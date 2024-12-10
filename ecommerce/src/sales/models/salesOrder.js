const mongoose = require('mongoose');
const orderLineItem = require('./orderLineItem');
const SalesOrderStatusEnum = require('./salesOrderStatusEnum');

const saleOrderSchema = new mongoose.Schema({
  user:{
    userId :{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    userName:{type: String, required: true},
    userInvoiceAddress:{type: String, required: false},
    userDeliveryAddress:{type: String, required: false}
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