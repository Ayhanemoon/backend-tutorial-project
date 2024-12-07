/* eslint-disable no-magic-numbers */
const Category = require('../models/category');

exports.createCategory = async(req, res) => {
  try {
    // eslint-disable-next-line prefer-const
    let {name, description} = req.body;
    name = name.toLowerCase();
    const category = new Category({name, description});
    await category.save();
    res.status(201).json({message: 'Category created successfully', category});
  } catch (error) {
    res.status(500).json({message: 'Error creating category.', error});
  }
};

exports.getAllCategories = async(req, res) => {
  try {
    const categories = await Category.find({}, '-__v');
    res.status(200).json(categories ?? {});
  } catch (error) {
    res.status(500).json({message: 'Error retreiving category.', error});
  }
};

exports.getCategoryById = async(req, res) => {
  try {
    const category = await Category.findById(req.params.id, '-__v -_id');
    res.status(200).json(category ?? {});
  } catch (error) {
    res.status(500).json({message: 'Error retreiving category.', error});
  }
};

exports.updateCategory = async(req, res) => {
  try {
    // eslint-disable-next-line prefer-const
    let {name, description} = req.body;
    name = name.toLowerCase();
    const category = Category.findByIdAndUpdate(
      req.params.id,
      {name, description},
      {projection:'-__v -_id', new:true, runValidators:true});
    if (!category) {
      res.status(404).json({message: 'Category not found.'});
    }
    res.status(201).json({message: 'Category updated successfully', category});
  } catch (error) {
    res.status(500).json({message: 'Error updating category.', error});
  }
};

exports.deleteCategory = async(req, res) => {
  try {
    const category = Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({message:'Category not found.'});
    }
    return res.status(204).json({message:'Category deleted successfully', category});
  } catch (error) {
    return res.status(500).json({message: 'Error deleting category', error});
  }
};