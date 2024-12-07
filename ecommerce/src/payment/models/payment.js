const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  salesOrderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesOrder',
    default: null,
    required: true
  },
  totalPrice:{
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);