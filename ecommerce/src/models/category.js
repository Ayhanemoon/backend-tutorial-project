const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type:String,
    required:true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  description: String,
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

module.exports = mongoose.model('Category', categorySchema);