const mongoose = require('mongoose');

const productAttributeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
     },
    values: [{ type: String, required: true }]
}, {
    timestamps: true
});
  
module.exports = mongoose.model('productAttribute', productAttributeSchema);