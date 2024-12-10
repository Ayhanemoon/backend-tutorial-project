const mongoose = require('mongoose');
//const address = require('./address');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  invoiceAddress: {
    type: String
  },
  deliveryAddress: {
    type: String
  }
  //,
  // balance: {
  //   type: Number, // Outstanding balance (total owed by the user)
  //   default: 0
  // },
  // isCustomer: {
  //   type: Boolean,
  //   default: true // True if the entity is a user
  // }
  // isSupplier: {
  //   type: Boolean,
  //   default: false // True if the entity is a supplier
  // },
},{
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
