const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    unique: true
  },
  price:{
    type: Number,
    required: true
  },
  category: {
    categoryId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    categoryName : String
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

module.exports = mongoose.model('Product', productSchema);