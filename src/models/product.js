const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  price:{
    type: Number,
    required: true
  },
  description: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  extraAttributes:[{
    type: mongoose.Schema.Types.Mixed
  }],
  createdAt:{
    type:Date, default:Date.now
  },
  updatedAt:{
    type:Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);