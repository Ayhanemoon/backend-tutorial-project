const Payment = require('../models/payment');
const SalesOrder = require('../../sales/models/salesOrder');
const Invoice = require('../../sales/models/invoice');

exports.createPayment = async(req, res) => {
// #swagger.tags = ['Payment']
  try {
    const { salesOrderId, totalPrice } = req.body;

    const salesOrder = await SalesOrder.findById(salesOrderId);
    if (!salesOrder) {
      throw new Error('Sales order does not exists.');
    }
    salesOrder.status = 'paid';
    await salesOrder.save();

    const invoice = await Invoice.findOne({'orderId': salesOrderId});
    if ( !invoice.orderId.equals(salesOrderId)) {
      throw new Error('You should create invoice for sales order');
    }
    invoice.status = 'paid';
    await invoice.save();

    //---payment
    const payment = new Payment({salesOrderId, totalPrice});
    await payment.save();

    return res.status(201).json({ message: 'Payment created successfully', payment });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating payment.', error: error });
  }
};

exports.getAllPayments = async(req, res) => {
  // #swagger.tags = ['Payment']
  try {
    const payment = await Payment.find({}, '-__v -updatedAt');
    return res.status(200).json(payment ?? {});
  } catch (error) {
    return res.status(500).json({mssage: 'Error retreiving payments', error});
  }
};

exports.getPaymentById = async(req, res) => {
  // #swagger.tags = ['Payment']
  try {
    const payment = await Payment.findById(req.params.paymentId, '-__v -_id -updatedAt');
    if (!payment) {
      return res.status(404).json({message:'Payment not found'});
    }
    return res.status(200).json(payment ?? {});
  } catch (error) {
    return res.status(500).json({mssage: 'Error retreiving payment', error});
  }
};

exports.deletePayment = async(req, res) => {
// #swagger.tags = ['Payment']
  try {
    const payment = await Payment.findByIdAndDelete(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({message:'Payment not found'});
    }
    return res.status(204).json({message:'Payment deleted successfully'});
  } catch (error) {
    return res.status(500).json({message: 'Error deleting payment', error});
  }
};