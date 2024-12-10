const Payment = require('../models/payment');
const SalesOrder = require('../../sales/models/salesOrder');
const Invoice = require('../../sales/models/invoice');
const mongoose = require('mongoose');

exports.createPayment = async(req, res) => {
// #swagger.tags = ['Payment']
  const session = await mongoose.startSession();
  try {
    const { salesOrderId, totalPrice } = req.body;

    session.startTransaction();
    const salesOrder = await SalesOrder.findById(salesOrderId).session(session);
    if (!salesOrder) {
      throw new Error('Sales order does not exists.');
    }
    salesOrder.status = 'paid';
    await salesOrder.save({session});

    const invoice = await Invoice.findOne({'orderId': salesOrderId}).session(session);
    if ( !invoice.orderId.equals(salesOrderId)) {
      throw new Error('You should create invoice for sales order');
    }
    invoice.status = 'paid';
    await invoice.save({session});

    //---payment
    const payment = new Payment({salesOrderId, totalPrice});
    await payment.save({session});
    await session.commitTransaction();
    return res.status(201).json({ message: 'Payment created successfully', payment });
  } catch (error) {
    session.abortTransaction();
    return res.status(500).json({ message: 'Error creating payment.', error: error });
  } finally {
    session.endSession();
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