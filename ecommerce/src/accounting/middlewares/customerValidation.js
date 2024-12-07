const Customer = require('../models/customer');
const mongoose = require('mongoose');

exports.customerValidation = async(customerId, customerUsername, customerInvoiceAddress, customerDeliveryAddress) => {
  if (!mongoose.isValidObjectId(customerId)) {
    throw new Error('Customer id must be an object id.');
  }
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new Error(`Customer with id '${customerId}' does not exists.`);
  }
  if (customer.username !== customerUsername) {
    throw new Error('Customer name is not same as the name stored for the customer id.');
  }
  if (customer.invoiceAddress !== customerInvoiceAddress) {
    throw new Error('Invoice address is not same as the address stored for the customer id.');
  }
  if (customer.deliveryAddress !== customerDeliveryAddress) {
    throw new Error('Delivery address is not same as the address stored for the customer id.');
  }
  return true;
};