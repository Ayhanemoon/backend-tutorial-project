const SalesOrder = require('../models/salesOrder');

exports.createSalesOrder = async(req, res) => {
  try {
    const { customer, orderLineItems, totalAmount, status} = req.body;
    const salesOrder = new SalesOrder({customer, orderLineItems, totalAmount, status});
    const savedSalesOrder = await salesOrder.save();
    res.status(201).json(savedSalesOrder);
  } catch (error) {
    res.status(500).json({message:'Error creating sales order.', error});
  }
};

exports.getAllSalesOrders = async(req, res) => {
  try {
    const salesOrders = await SalesOrder.find({},'-__v');
    return res.status(200).json(salesOrders ?? {});
  } catch (error) {
    res.status(500).json({message:'Error retreiving sales orders.', error});
  }
};

exports.getSalesOrderById = async(req, res) => {
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
  try {
    const { customer, orderLineItems, totalAmount, status} = req.body;
    const salesOrder = await SalesOrder.findByIdAndUpdate(req.params.salesOrderId,
      {customer, orderLineItems, totalAmount, status},
      {projection:'-__v -_id', new:true, runValidators:true});
    // if (!salesOrder) {
    //   res.status(404).json('Sales order not found.');
    // }
    res.status(200).json(salesOrder);
  } catch (error) {
    res.status(500).json({message:'Error updating sales order.', error});
  }
};

exports.deleteSalesOrder = async(req, res) => {
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