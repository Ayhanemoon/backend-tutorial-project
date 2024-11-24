const Category = require('../models/category');

exports.createCategory = async(req, res) => {
  try {
    const {name, parent, attributes} = req.body;
    let category = new Category({name, parent, attributes});
    await category.save();
    category = category.toObject();
    delete category.updatedAt;
    delete category.__v;
    return res.status(201).json({message: 'Category created successfully', category});
  } catch (error) {
    return res.status(500).json({message: 'Error creating category.', error});
  }
};

exports.getAllCategories = async(req, res) => {
  try {
    const categories = await Category.find({}, '-__v -updatedAt');
    return res.status(200).json(categories ?? {});
  } catch (error) {
    return res.status(500).json({message: 'Error retreiving category.', error});
  }
};

exports.getCategoryById = async(req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId, '-__v -_id -updatedAt');
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({message: 'Error retreiving category.', error});
  }
};

exports.updateCategory = async(req, res) => {
  try {
    const {name, parent, attributes} = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.categoryId,
      {name, parent, attributes},
      {projection:'-__v -_id', new:true, runValidators:true});
    return res.status(201).json({message: 'Category updated successfully', category});
  } catch (error) {
    return res.status(500).json({message: 'Error updating category.', error});
  }
};

exports.deleteCategory = async(req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.categoryId);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({message: 'Error deleting category', error});
  }
};

exports.updateAttributes = async(req, res) => {
  try {
    const {attributes} = req.body;
    const category = await Category.findById(req.params.categoryId);
    category.attributes = attributes;
    await category.save();
    return res.status(201).json({message: 'Attributes updated successfully', category});
  } catch (error) {
    return res.status(500).json({message: 'Error updating category.', error});
  }
};