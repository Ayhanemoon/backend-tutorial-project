const Category = require('../models/category');
const {attributeValidation} = require('../middlewares/attributeValidation');
const {check} = require('express-validator');
const mongoose = require('mongoose');

exports.productIdValidation = check('productId')
  .custom(productId => mongoose.isValidObjectId(productId))
  .withMessage('Product id must be an object id.')
  .bail()
  .customSanitizer(productId => mongoose.Types.ObjectId.createFromHexString(productId));

exports.productNameValidation = check('name')
  .notEmpty()
  .withMessage('A name for product is required.')
  .bail()
  .customSanitizer(name => name.toLowerCase());

exports.productPriceValidation = check('price')
  .notEmpty()
  .withMessage('A price for product required.')
  .isNumeric()
  .withMessage('Price should be numeric.')
  .bail();

exports.productCategoryValidation = check('category')
  .notEmpty()
  .custom(category => mongoose.isValidObjectId(category.categoryId))
  .withMessage('Category id must be an object id.')
  .bail()
  .customSanitizer(category => ({
    categoryId : mongoose.Types.ObjectId.createFromHexString(category.categoryId),
    categoryName : category.categoryName
  }))
  .custom(async(category)=>{
    const savedCategory = await Category.findById(category.categoryId);
    if (!savedCategory) {
      throw new Error(`Category with id '${category.categoryId}' does not exists.`);
    }
    if (savedCategory.name !== category.categoryName) {
      throw new Error('Category name is not same as the name stored for the category id.');
    }
    return true;
  });

exports.productAttributesValidation = check('attributes') // uniq attribute ids...
  .optional()
  .isArray()
  .withMessage('Atrributes must be an array.')
  .bail()
  .custom(async (attributes) => attributes.every(async (attr) => await attributeValidation(attr.attributeId, attr.attributeName, attr.attributeValues)))
  .customSanitizer(attributes => attributes.map(attr => ({
    required: attr.required ?? false,
    attributeId: mongoose.Types.ObjectId.createFromHexString(attr.attributeId),
    attributeName: attr.attributeName,
    attributeValues: attr.attributeValues
  })
  ));
