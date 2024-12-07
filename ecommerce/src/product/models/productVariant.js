const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema({
  product: {
    productId:{type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    productName:{type: String, required: true}
  },
  attribute: {
    attributeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attribute', required: true },
    attributeName: {type:String, required: true},
    attributeValue: { type: String, required: true }
  },
  sku: { type: String},
  stock: { type: Number, default: 0 },
  price: { type: Number}
}, {
  timestamps: true
});

module.exports = mongoose.model('ProductVariant', productVariantSchema);
