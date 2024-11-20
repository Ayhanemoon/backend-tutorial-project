const mongoose = require('mongoose');
const orderLineItem = require('./orderLineItem')

const saleOrderSchema = new mongoose.Schema({
customer:{
    id :{type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true},
    name:{type: String, required: true},
    invoiceAddress:{type: String, required: true},
    deliveryAddress:{type: String, required: true}
},
orderLineItems: [orderLineItem],
totalAmount:{
    type: Number,
    required: true,
    min: 0
},
status:{
    type: String,
    enum:['toInvoice', 'nothingToInvoice', 'fullyInvoiced', 'cancelled'],
    default: 'toInvoice'
},
quotationId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quotation'
}
}, {
    timestamps: true
});

module.exports = mongoose.model('SaleOrder', saleOrderSchema);