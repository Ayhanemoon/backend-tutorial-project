const mongoose = require('mongoose');

const orderLineItem = mongoose.Schema({
    productVariantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductVariant',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type:Number,
        required:true,
        min:1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    }
},{
    timeStamp:true
});

module.exports = orderLineItem;