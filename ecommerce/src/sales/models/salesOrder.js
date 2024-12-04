const mongoose = require('mongoose');
const orderLineItem = require('./orderLineItem');
const SalesOrderStatusEnum = require('./salesOrderStatusEnum');

const saleOrderSchema = new mongoose.Schema({
  customer:{
    customerId :{type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true},
    customerName:{type: String, required: true},
    customerInvoiceAddress:{type: String, required: true},
    customerDeliveryAddress:{type: String, required: true}
  },
  orderLineItems: [orderLineItem],
  totalPrice:{
    type: Number,
    required: true,
    min: 0
  },
  status:{
    type: String,
    enum: SalesOrderStatusEnum.values(),
    default: SalesOrderStatusEnum.DRAFT
  }
  // quotationId:{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Quotation'
  // }
}, {
  timestamps: true
});

module.exports = mongoose.model('SalesOrder', saleOrderSchema);