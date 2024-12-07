const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  parent: {
    parentId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    parentName : String
  },
  attributes:[
    {
      required:{
        type:Boolean,
        default: false
      },
      attributeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Attribute'
      },
      attributeName:{
        type:String
      },
      attributeValues:[
        {
          type:String
        }
      ]
    }
  ]
},
{
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);