const mongoose = require('mongoose');
const orderLineItem = require('./orderLineItem');

const saleOrderSchema = new mongoose.Schema({
  customer:{
    customerId :{type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true},
    customerName:{type: String, required: true},
    customerInvoiceAddress:{type: String, required: true},
    customerDeliveryAddress:{type: String, required: true}
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
  }
  // quotationId:{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Quotation'
  // }
}, {
  timestamps: true
});

module.exports = mongoose.model('SaleOrder', saleOrderSchema);