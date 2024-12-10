const mongoose = require('mongoose');
const orderLineItem = require('./orderLineItem');
const InvoiceStatusEnum = require('./InvoiceStatusEnum');

const invoiceSchema = new mongoose.Schema({
  user: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: String
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesOrder',
    required: true
  },
  orderLineItems: [orderLineItem],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  invoiceDate: {
    type: Date,
    default: Date.now
  },
  status:{
    type: String,
    enum: InvoiceStatusEnum.values(),
    default: InvoiceStatusEnum.DRAFT
  }
  // ,
  // dueDate: {
  //   type: Date
  // }
  // status: {
  //   type: String,
  //   enum: ['draft', 'validated', 'paid', 'canceled'],
  //   default: 'draft'
  // },
  // paymentTerms: {
  //  type: String
  // } // Example: "Net 30"
});

module.exports = mongoose.model('Invoice', invoiceSchema);;
