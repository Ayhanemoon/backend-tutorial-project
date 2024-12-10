const User = require('../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const { username, password, email, phone, invoiceAddress, deliveryAddress} = req.body;
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SaltLength));
    const user = new User({username, password: hashedPassword, email, phone, invoiceAddress, deliveryAddress});
    await user.save();

    res.status(200).json({ message: 'User registered successfully!' });
  } catch (error) {
    return res.status(500).json({message: 'Error register user.', error:error});
  }
};

exports.login = async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const { username, password } = req.body;
    const user = await User.findOne({username});

    if (!user) {
      return res.status(400).json({ message: 'Cusotmer not found!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password!' });
    }

    const token = jwt.sign({
      user:{
        user: user._id,
        userUsername: user.username
      } },
    process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ message: 'Login successful!', token });
  } catch (error) {
    return res.status(500).json({message: 'Error login user.', error});
  }
};