const Invoice = require('../models/invoice');

exports.createInvoice = async (salesOrder) => {
  try {
    const savedInvoice = await Invoice.findOne({orderId:salesOrder._id});
    if (savedInvoice) {
      return;
    }
    const invoice = new Invoice({
      customer: {
        customerId: salesOrder.customer.customerId,
        customerName: salesOrder.customer.customerName
      },
      orderId: salesOrder._id,
      orderLineItems: salesOrder.orderLineItems,
      totalPrice: salesOrder.totalPrice
    });
    await invoice.save();
    return invoice;
  } catch (error)  {
    throw new Error('Error creating invoice.', error);
  }};

exports.getAllInvoices = async(req, res) => {
  // #swagger.tags = ['Invoice']
  try {
    const invoices = await Invoice.find({},'-__v');
    return res.status(200).json(invoices ?? {});
  } catch (error) {
    res.status(500).json({message:'Error retreiving invoices.', error});
  }
};

exports.getInvoiceById = async(req, res) => {
  // #swagger.tags = ['Invoice']
  try {
    const invoice = await Invoice.findById(req.params.invoiceId);
    // if (!salesOrder) {
    //   return res.status(404).json({message:'Sales order not found.'});
    // }
    return res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({message:'Error retreiving invoice.', error});
  }
};
