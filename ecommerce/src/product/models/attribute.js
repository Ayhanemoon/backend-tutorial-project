const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  values:{
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: 'The array must contain at least one item.'
    }}
}, {
  timestamps: true
});

module.exports = mongoose.model('Attribute', attributeSchema);