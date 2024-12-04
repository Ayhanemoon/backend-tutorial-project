const mongoose = require('mongoose');
const InvoicePolicyEnum = require('./invoicePolicyEnum');

const settingSchema = new mongoose.Schema({
  invoice:{
    invoicingPolicy: {
      type: String,
      enum: InvoicePolicyEnum.values(),
      default: InvoicePolicyEnum.ON_ORDER
    },
    automatic: {
      type: Boolean,
      default: false
    }
  }
  //,
  //   paymentTerms: {
  //     type: String,
  //     default: 'Net 30'
  //   },
  // taxInclusive: {
  //   type: Boolean,
  //   default: false
  // } // Example: Show prices with or without tax
});

const setting = mongoose.model('Setting', settingSchema);
module.exports = setting;

