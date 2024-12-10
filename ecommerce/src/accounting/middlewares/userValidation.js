const User = require('../models/user');
const mongoose = require('mongoose');

exports.userValidation = async(userId, userUsername, userInvoiceAddress, userDeliveryAddress) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error('User id must be an object id.');
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with id '${userId}' does not exists.`);
  }
  if (user.username !== userUsername) {
    throw new Error('User name is not same as the name stored for the user id.');
  }
  if (user.invoiceAddress !== userInvoiceAddress) {
    throw new Error('Invoice address is not same as the address stored for the user id.');
  }
  if (user.deliveryAddress !== userDeliveryAddress) {
    throw new Error('Delivery address is not same as the address stored for the user id.');
  }
  return true;
};