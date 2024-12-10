/* eslint-disable no-magic-numbers */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  userController.createUser(req, res);
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({username});

  if (!user) {
    return res.status(400).json({ message: 'User not found!' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid password!' });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

  return res.json({ message: 'Login successful!', token });
};
