const ProductVariant = require('../models/productVariant');
const {check} = require('express-validator');
const mongoose = require('mongoose');

exports.productVariantIdValidation = check('productVariantId')
  .custom(productVariantId => mongoose.isValidObjectId(productVariantId))
  .withMessage('Product variant id must be an object id.')
  .bail()
  .customSanitizer(productVariantId => mongoose.Types.ObjectId.createFromHexString(productVariantId))
  .custom(async (productVariantId) => {
    const productVariant = await ProductVariant.findById(productVariantId);
    if (!productVariant) {
      throw new Error(`Product variant with id '${productVariantId}' does not exists.`);
    }
    return true;
  });

exports.patchValidation = [
  check('sku').optional(),
  check('stock').optional().custom(stock => typeof stock === 'number'),
  check('price').optional().custom(price => typeof price === 'number')
];