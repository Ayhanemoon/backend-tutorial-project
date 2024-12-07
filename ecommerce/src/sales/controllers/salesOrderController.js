const SalesOrder = require('../models/salesOrder');
const {invoiceEventEmitter} = require('../../setting/controllers/invoiceEventController');
const invoiceEventEnum = require('../../setting/controllers/invoiceEventEnum');
const ProductVariant = require('../../product/models/productVariant');

exports.createSalesOrder = async(req, res) => {
  // #swagger.tags = ['Sales Order']
  try {
    const { customer, orderLineItems, status} = req.body;
    let totalPrice = 0;
    for (const item of orderLineItems) {
      const productVariant = await ProductVariant.findById(item.productVariantId);
      item.price = productVariant.price;
      totalPrice += item.price * item.quantity;
    }

    const salesOrder = new SalesOrder({customer, orderLineItems, totalPrice, status});
    const savedSalesOrder = await salesOrder.save();
    invoiceEventEmitter.emit(invoiceEventEnum.SALES_ORDER_STATUS_CHANGED, salesOrder);
    res.status(201).json(savedSalesOrder);
  } catch (error) {
    res.status(500).json({message:'Error creating sales order.', error});
  }
};

exports.getAllSalesOrders = async(req, res) => {
  // #swagger.tags = ['Sales Order']
  try {
    const salesOrders = await SalesOrder.find({},'-__v');
    return res.status(200).json(salesOrders ?? {});
  } catch (error) {
    res.status(500).json({message:'Error retreiving sales orders.', error});
  }
};

exports.getSalesOrderById = async(req, res) => {
  // #swagger.tags = ['Sales Order']
  try {
    const salesOrder = await SalesOrder.findById(req.params.salesOrderId);
    // if (!salesOrder) {
    //   return res.status(404).json({message:'Sales order not found.'});
    // }
    return res.status(200).json(salesOrder);
  } catch (error) {
    res.status(500).json({message:'Error retreiving sales order.', error});
  }
};

exports.updateSalesOrder = async(req, res) => {
  // #swagger.tags = ['Sales Order']
  try {
    const { customer, orderLineItems, totalPrice, status} = req.body;
    const salesOrder = await SalesOrder.findByIdAndUpdate(req.params.salesOrderId,
      {customer, orderLineItems, totalPrice, status},
      {projection:'-__v -_id', new:false, runValidators:true});
    // if (!salesOrder) {
    //   res.status(404).json('Sales order not found.');
    // }
    if (salesOrder.status !== status) {
      invoiceEventEmitter.emit(invoiceEventEnum.SALES_ORDER_STATUS_CHANGED, salesOrder);
    }
    res.status(200).send();
  } catch (error) {
    res.status(500).json({message:'Error updating sales order.', error});
  }
};

exports.deleteSalesOrder = async(req, res) => {
  // #swagger.tags = ['Sales Order']
  try {
    await SalesOrder.findByIdAndDelete(req.params.salesOrderId);
    // if (!salesOrder) {
    //   res.status(404).json('Sales order not found.');
    // }
    return res.status(204).json({message:'Sales order deleted successfully'});
  } catch (error) {
    res.status(500).json({message:'Error deleting sales order.', error});
  }
};

exports.partiallyUpdateSalesOrder = async(req, res) => {
  // #swagger.tags = ['Sales Order']
  try {
    const salesOrder = await SalesOrder.findById(req.params.salesOrderId);
    // if (!salesOrder) {
    //   res.status(404).json('Sales order not found.');
    // }
    salesOrder.status = req.body.status;
    await salesOrder.save();
    invoiceEventEmitter.emit(invoiceEventEnum.SALES_ORDER_STATUS_CHANGED, salesOrder);
    return res.status(201).send();
  } catch (error) {
    res.status(500).json({message:'Error deleting sales order.', error});
  }
};