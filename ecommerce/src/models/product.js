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
  attributes:[{
    required:Boolean,
    attribute:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Attribute'
    }
  }]
}, 
{
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);