const mongoose = require('mongoose');
const orderLineItem = require('./orderLineItem');

const invoiceSchema = new mongoose.Schema({
  customer: {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    customerName: String
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

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
