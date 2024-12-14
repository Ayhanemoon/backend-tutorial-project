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
      default: null,
      required: true
    },
    categoryName : {
      type: String,
      required: true
    }
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

productSchema.index({ name: 'text'});
module.exports = mongoose.model('Product', productSchema);