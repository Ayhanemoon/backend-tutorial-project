const ProductVariant = require('../../product/models/productVariant');
const mongoose = require('mongoose');

exports.orderLineItemValidation = async (productVariantId, productName, quantity) => {
  if (!mongoose.isValidObjectId(productVariantId)) {
    throw new Error('Product variant id must be an object id.');
  }
  const productVariant = await ProductVariant.findById(productVariantId);
  if (!productVariant) {
    throw new Error(`Product variant with id '${productVariantId}' does not exists.`);
  }
  if (productVariant.product.productName !== productName) {
    throw new Error(`Product name with '${productName}' is not same as the name stored for the product variant id.`);
  }
  if (!(typeof quantity === 'number' && !isNaN(quantity))) {
    throw new Error('Quantity is required.');
  }
  return true;
};