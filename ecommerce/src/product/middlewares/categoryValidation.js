const Category = require('../models/category');
const {attributeValidation} = require('../middlewares/attributeValidation');
const {check} = require('express-validator');
const mongoose = require('mongoose');

//exports.requiredValidation => check to be a valid boolean

exports.categoryIdValidation = check('categoryId')
  .custom(categoryId => mongoose.isValidObjectId(categoryId))
  .withMessage('Category id must be an object id.')
  .bail()
  .customSanitizer(categoryId => mongoose.Types.ObjectId.createFromHexString(categoryId))
  .custom(async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error(`Category with id '${categoryId}' does not exists.`);
    }
    return true;
  });

//checkunique name for category
exports.categoryNameValidation = check('name')
  .notEmpty()
  .withMessage('Enter a name for category.')
  .bail()
  .customSanitizer(name => name.toLowerCase());

exports.categoryParentValidation = check('parent.parentId')
  .optional()
  .custom(parentId => mongoose.isValidObjectId(parentId))
  .withMessage('Parent id must be an object id.')
  .bail()
  .customSanitizer(parentId => mongoose.Types.ObjectId.createFromHexString(parentId))//can add name to attribute?
  .custom(async(parentId, {req})=>{
    const category = await Category.findById(parentId);
    if (!category) {
      throw new Error(`Parent category with id '${parentId}' does not exists.`);
    }
    if (category.name !== req.body.parent.parentName) {
      throw new Error('Parent name is not same as the name stored for the parent id.');
    }
    return true;
  });

exports.categoryAttributesValidation = check('attributes') // uniq attribute ids...
  .optional()
  .isArray()
  .withMessage('Atrributes must be an array.')
  .bail()
  .custom(attributes => attributes.every(async (attr) => await attributeValidation(attr.attributeId, attr.attributeName, attr.attributeValues)))
  .customSanitizer(attributes => attributes.map(attr => ({
    required: attr.required ?? false,
    attributeId: mongoose.Types.ObjectId.createFromHexString(attr.attributeId),
    attributeName: attr.attributeName,
    attributeValues: attr.attributeValues
  })
  ));