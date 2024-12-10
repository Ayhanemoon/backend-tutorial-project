const User = require('../models/user');

exports.getAllUsers = async(req, res) => {
// #swagger.tags = ['User']
  try {
    const users = await User.find({}, '-__v');
    return res.status(200).json(users ?? {});
  } catch (error) {
    return res.status(500).json({mssage: 'Error retreiving users', error});
  }
};

exports.getUserById = async(req, res) => {
  // #swagger.tags = ['User']
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({message:'User not found.'});
    }
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({message:'Error retreiving user.', error});
  }
};

exports.deleteUser = async(req, res) => {
  // #swagger.tags = ['User']
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({message:'User not found.'});
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({message: 'Error deleting user.', error});
  }
};

exports.partiallyUpdateUser = async(req, res) => {
  // #swagger.tags = ['User']
  try {
    const user = await User.findById(req.params.userId);
    const {email, phone, invoiceAddress, deliverAddress} = req.body;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;
    user.invoiceAddress = invoiceAddress ?? user.invoiceAddress;
    user.deliverAddress = deliverAddress ?? user.deliverAddress;
    await user.save();
    return res.status(201).json({message: 'User updated successfully', user});
  } catch (error) {
    return res.status(500).json({message: 'Error updating user.', error});
  }
};

