const SalesOrder = require('../models/salesOrder');
const {orderLineItemValidation} = require('../middlewares/orderLineItemValidation');
const {customerValidation} = require('../../accounting/middlewares/customerValidation');
const {check} = require('express-validator');
const mongoose = require('mongoose');

exports.salesOrderIdValidation = check('salesOrderId').notEmpty()
  .withMessage('Sales order id in required.')
  .bail()
  .custome(salesOrderId => mongoose.isValidObjectId(salesOrderId))
  .withMessage('Sales order id must be an object id.')
  .bail()
  .customSanitizer(salesOrderId => new mongoose.Types.ObjectId.cacheHexString(salesOrderId))
  .custome(async (salesOrderId) => {
    const salesOrder = await SalesOrder.findById(salesOrderId);
    if (!salesOrder) {
      throw new Error(`Sales order with id '${salesOrderId}' does not exists.`);
    }
    return true;
  });

exports.customerValidation = async(req) => await customerValidation(req.customer.customerId, req.customer.customerName,
  req.customer.customerInvoiceAddress, req.customer.customerDeliveryAddress);

exports.orderLineItemsValidation = check('orderLineItems') //unique order line item
  .isArray()
  .withMessage('Order line items must be an array.')
  .bail()
  .custom(async (orderLineItems) => orderLineItems.every(async (lineItem) =>
    await orderLineItemValidation(lineItem.productVariantId, lineItem.productName,
      lineItem.quantity, lineItem.price, lineItem.subtotal)))
  .customSanitizer(orderLineItems => orderLineItems.map(lineItem => ({
    productVariantId: lineItem.productVariantId,
    productName: lineItem.productName,
    quantity: lineItem.quantity,
    price: lineItem.price,
    subtotal: lineItem.subtotal
  })
  ));

exports.totalAmountValidation = check('totalAmount').notEmpty()
  .withMessage('Total amount is required.')
  .bail()
  .isNumeric()
  .withMessage('Total amount should be numeric.')
  .bail()
  .custom((totalAmount, {req}) => { //include tax ...
    if (req.body.orderLineItems.reduce((result, lineItem) => result + lineItem.subTotal, 0) !== totalAmount) {
      throw new Error('Sum of prices of order line items is not equal with totalAmount');
    }
    return true;
  });