const Customer = require('../models/customer');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const { username, password, email, phone, invoiceAddress, deliveryAddress} = req.body;
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SaltLength));
    const customer = new Customer({username, password: hashedPassword, email, phone, invoiceAddress, deliveryAddress});
    await customer.save();

    res.status(200).json({ message: 'Customer registered successfully!' });
  } catch (error) {
    return res.status(500).json({message: 'Error register user.', error:error});
  }
};

exports.login = async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const { username, password } = req.body;
    const customer = await Customer.findOne({username});

    if (!customer) {
      return res.status(400).json({ message: 'Cusotmer not found!' });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password!' });
    }

    const token = jwt.sign({
      customer:{
        customerId: customer._id,
        customerUsername: customer.username
      } },
    process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ message: 'Login successful!', token });
  } catch (error) {
    return res.status(500).json({message: 'Error login user.', error});
  }
};