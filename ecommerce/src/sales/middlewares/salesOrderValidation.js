const {orderLineItemValidation} = require('../middlewares/orderLineItemValidation');
const {userValidation} = require('../../accounting/middlewares/userValidation');
const SalesOrderStatusEnum = require('../models/salesOrderStatusEnum');
const {check} = require('express-validator');
const mongoose = require('mongoose');

exports.salesOrderIdValidation = check('salesOrderId').notEmpty()
  .withMessage('Sales order id in required.')
  .bail()
  .custom(salesOrderId => mongoose.isValidObjectId(salesOrderId))
  .withMessage('Sales order id must be an object id.')
  .bail()
  .customSanitizer(salesOrderId =>  mongoose.Types.ObjectId.createFromHexString(salesOrderId));

exports.userValidation = check('user')
  .notEmpty()
  .withMessage('User info is required.')
  .bail()
  .custom(async(user) => await userValidation(user.userId, user.userName,
    user.userInvoiceAddress, user.userDeliveryAddress));

exports.orderLineItemsValidation = check('orderLineItems') //unique order line item
  .isArray()
  .withMessage('Order line items must be an array.')
  .bail()
  .custom(async (orderLineItems) => orderLineItems.every(async (lineItem) =>
    await orderLineItemValidation(lineItem.productVariantId, lineItem.productName, lineItem.quantity)))
  .customSanitizer(orderLineItems => orderLineItems.map(lineItem => ({
    productVariantId: lineItem.productVariantId,
    productName: lineItem.productName,
    quantity: lineItem.quantity,
    price: lineItem.price,
    subtotal: lineItem.subtotal
  })
  ));

exports.salesOrderStateValidation = check('status')
  .custom((status)=> {
    const statusValues = SalesOrderStatusEnum.values();
    if (!statusValues.includes(status)) {
      throw new Error('State is not valid');
    }
    return true;
  });