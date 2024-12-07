const Attribute = require('../models/attribute');
const {check} = require('express-validator');
const mongoose = require('mongoose');

exports.attributeIdValidation = check('attributeId')
  .custom(attributeId => mongoose.isValidObjectId(attributeId))
  .withMessage('Attribute id must be an object id.')
  .bail()
  .customSanitizer(attributeId => mongoose.Types.ObjectId.createFromHexString(attributeId))
  .custom(async (attributeId) => {
    const attribute = await Attribute.findById(attributeId);
    if (!attribute) {
      throw new Error(`Attribute with id '${attributeId}' does not exists.`);
    }
    return true;
  });

exports.attributeNameValidation = check('name')
  .notEmpty()
  .withMessage('Enter a name for attribute.')
  .bail()
  .customSanitizer(name => name.toLowerCase());

exports.attributeValuesValidation = check('values')
  .notEmpty()
  .isArray()
  .withMessage('Values must be an array.')
  .bail()
  .custom(values => values.every(async (val) => typeof val === 'string' && val.trim().length > 0));

exports.attributeValidation = async (attributeId, attributeName, attributeValues) => {
  if (!mongoose.isValidObjectId(attributeId)) {
    throw new Error('Attribute id must be an object id.');
  }
  const attribute = await Attribute.findById(attributeId);
  if (!attribute) {
    throw new Error(`Attribute with id '${attributeId}' does not exists.`);
  }
  if (attribute.name !== attributeName) {
    throw new Error(`Attribute name with '${attributeName}' is not same as the name stored for the attribute id.`);
  }
  if (!attributeValues.every(val => attribute.values.includes(val))) {
    throw new Error(`Attribute values '${attributeValues}' is not sub set of values of attribute id = '${attributeId}'.`);
  }
  return true;
};