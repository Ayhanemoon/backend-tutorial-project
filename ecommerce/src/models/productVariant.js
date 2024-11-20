const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    attributes: [{ 
      attribute: { type: mongoose.Schema.Types.ObjectId, ref: 'Attribute', required: true },
      value: { type: String, required: true },
    }],
    sku: { type: String, unique: true, required: true },
    stock: { type: Number, default: 0 },
    price: { type: Number, required: true },
  }, {
    timestamps: true
});
  
module.exports = mongoose.model('ProductVariant', productVariantSchema);
  