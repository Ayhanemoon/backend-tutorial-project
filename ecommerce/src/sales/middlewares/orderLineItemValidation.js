const ProductVariant = require('../../product/models/productVariant');
const mongoose = require('mongoose');

exports.orderLineItemValidation = async (productVariantId, productName, quantity, price, subtotal) => {
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
  if (!(typeof price === 'number' && !isNaN(price))) {
    throw new Error('Price is required.');
  }
  if (productVariant.price !== price) {
    throw new Error('Price of product variant is not same as the price stored for it');
  }
  if (quantity * price !== subtotal) {
    throw new Error('Subtotal is not true.');
  }
  return true;
};