/* eslint-disable no-magic-numbers */
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.createUser = async(req, res) => {
  const {username, password, email} = req.body;
  try {
    const existingUser = await User.exists({email});
    if (existingUser) {
      return res.status(400).json({message: 'User already exists.'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({username, password: hashedPassword, email});
    await newUser.save();
    return res.status(201).json({message: 'User created successfully', user:{_id: newUser._id, userName: newUser.username,
      email: newUser.email}});
  } catch (error) {
    return res.status(500).json({message:'Error creating user', error});
  }
};

exports.getAllUsers = async (req,res) => {
  try {
    const users = await User.find({},'-password -__v');
    return res.status(200).json(users ?? {});
  } catch (error) {
    return res.status(500).json({message:'Error retrieving users', error});
  }
};

exports.getUserById = async(req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id,'-password -__v -_id');
    if (!user) {
      return res.status(404).json({message:'User not found.'});
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({message:'Error retrieving user', error });
  }
};

exports.updateUser = async (req,res)=> {
  try {
    const {username, email} = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { username, email }, { projection:'-password -__v -_id', new:true, runValidators:true});
    if (!user) {
      return res.status(404).json({message:'User not found'});
    }
    return res.status(200).json({message:'User updated successfully', user});
  } catch (error) {
    return res.status(500).json({message:'Error updating user',error});
  }
};

exports.deleteUser = async(req, res) =>{
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({message:'User not found'});
    }
    return res.status(204).json({message:'User deleted successfully'});
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user', error });
  }
};
