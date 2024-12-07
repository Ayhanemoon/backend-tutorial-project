const SalesOrder = require('../models/salesOrder');
const {orderLineItemValidation} = require('../middlewares/orderLineItemValidation');
const {customerValidation} = require('../../accounting/middlewares/customerValidation');
const SalesOrderStatusEnum = require('../models/salesOrderStatusEnum');
const {check} = require('express-validator');
const mongoose = require('mongoose');

exports.salesOrderIdValidation = check('salesOrderId').notEmpty()
  .withMessage('Sales order id in required.')
  .bail()
  .custom(salesOrderId => mongoose.isValidObjectId(salesOrderId))
  .withMessage('Sales order id must be an object id.')
  .bail()
  .customSanitizer(salesOrderId =>  mongoose.Types.ObjectId.createFromHexString(salesOrderId))
  .custom(async (salesOrderId) => {
    const salesOrder = await SalesOrder.findById(salesOrderId);
    if (!salesOrder) {
      throw new Error(`Sales order with id '${salesOrderId}' does not exists.`);
    }
    return true;
  });

exports.customerValidation = check('customer')
  .notEmpty()
  .withMessage('Customer info is required.')
  .bail()
  .custom(async(customer) => await customerValidation(customer.customerId, customer.customerName,
    customer.customerInvoiceAddress, customer.customerDeliveryAddress));

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