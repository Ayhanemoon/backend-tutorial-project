const SalesOrder = require('../models/salesOrder')
const Customer = require('../models/customer')

exports.createSalesOrder = async(req, res) => {
    try {
        const { customerId, orderLineItems, status, quotationId } = req.body;    
        let totalAmount = 0;
        orderLineItems.map(async (orderLineItem) => {
            orderLineItem.subtotal = orderLineItem.quantity * orderLineItem.price;
            totalAmount += orderLineItem.subtotal;
          });
        const customer = await Customer.findById(customerId)
        const salesOrder = new SalesOrder({
          customer: {
            id :customer._id,
            name:customer.name,
            invoiceAddress:customer.invoiceAddress,
            deliveryAddress:customer.deliveryAddress
        },
          orderLineItems,
          totalAmount,
          status,
          quotationId
        });
        const savedSalesOrder = await salesOrder.save();
        res.status(201).json(savedSalesOrder);
      } catch (error) {
        res.status(500).json({message:"Error creating sales order.", error})
    }
}



exports.getAllSalesOrders = async(req, res) => {
    try{
    const salesOrders = await SalesOrder.find({},'-__v');
    return res.status(200).json(salesOrders ?? {});
    }catch(error){
        res.status(500).json({message:"Error retreiving sales orders.", error})
    }
}


exports.getSalesOrderById = async(req, res) => {
    try{
    const salesOrder = await SalesOrder.findById(req.params.id);
    if(!salesOrder){
        return res.status(404).json({message:'Sales order not found.'});
    }
    return res.status(200).json(salesOrder);
    }catch(error){
        res.status(500).json({message:"Error retreiving sales order.", error})
    }
    }

exports.updateSalesOrder = async(req, res) => {
    try {
        const { customerId, orderLineItems, status, quotationId } = req.body;    
        let totalAmount = 0;
        orderLineItems.map(async (orderLineItem) => {
            const subtotal = orderLineItem.quantity * orderLineItem.price;
            totalAmount += subtotal;
            orderLineItem.subtotal = subtotal
          });
        const customer = await Customer.findById(customerId)
        const salesOrder = await SalesOrder.findByIdAndUpdate(req.params.id,{
            customer: {
                id :customer._id,
                name:customer.name,
                invoiceAddress:customer.invoiceAddress,
                deliveryAddress:customer.deliveryAddress
            },
              orderLineItems,
              totalAmount,
              status,
              quotationId
        },{ 
            projection:'-__v -_id', 
            new:true, 
            runValidators:true
        });
        if(!salesOrder){
            res.status(404).json("Sales order not found.")
        }
        res.status(200).json(salesOrder);
      } catch (error) {
        res.status(500).json({message:"Error updating sales order.", error})
    }
}


exports.deleteSalesOrder = async(req, res) => {
    try{
        const salesOrder = await SalesOrder.findByIdAndDelete(req.params.id)
        if(!salesOrder){
            res.status(404).json("Sales order not found.");
        }
        return res.status(204).json({message:'Sales order deleted successfully'});
    }catch(error){
        res.status(500).json({message:"Error deleting sales order.", error})
    }
}