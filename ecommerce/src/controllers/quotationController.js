const Quotation = require('../models/quotation')
const Customer = require('../models/customer')
exports.createQuotation = async(req, res) => {
    try {
        const { customerId, orderLineItems, status } = req.body;    
        let totalAmount = 0;
        orderLineItems.map(async (orderLineItem) => {
            orderLineItem.subtotal = orderLineItem.quantity * orderLineItem.price;
            totalAmount += orderLineItem.subtotal;
          });
        const customer = await Customer.findById(customerId)
        const quotation = new Quotation({
          customer: {
            id :customer._id,
            name:customer.name,
            invoiceAddress:customer.invoiceAddress,
            deliveryAddress:customer.deliveryAddress
        },
          orderLineItems,
          totalAmount,
          status,

        });
    
        const savedQuotation = await quotation.save();
        res.status(201).json(savedQuotation);
      } catch (error) {
        res.status(500).json({message:"Error creating quotation.", error})
    }
}



exports.getAllQuotations = async(req, res) => {
    try{
    const quotations = await Quotation.find({},'-__v');
    return res.status(200).json(quotations ?? {});
    }catch(error){
        res.status(500).json({message:"Error retreiving quotations.", error})
    }
}




exports.getQuotationById = async(req, res) => {
    try{
    const quotation = await Quotation.findById(req.params.id);
    if(!quotation){
        return res.status(404).json({message:'Quotation not found.'});
    }
    return res.status(200).json(quotation);
    }catch(error){
        res.status(500).json({message:"Error retreiving quotation.", error})
    }
    }



exports.updateQuotation = async(req, res) => {
    try {
        const { customerId, orderLineItems, status } = req.body;    
        let totalAmount = 0;
        orderLineItems.map(async (orderLineItem) => {
            const subtotal = orderLineItem.quantity * orderLineItem.price;
            totalAmount += subtotal;
            orderLineItem.subtotal = subtotal
          });
        const customer = await Customer.findById(customerId)
        const quotation = await Quotation.findByIdAndUpdate(req.params.id,{
            customer: {
                id :customer._id,
                name:customer.name,
                invoiceAddress:customer.invoiceAddress,
                deliveryAddress:customer.deliveryAddress
            },
              orderLineItems,
              totalAmount,
              status
        },{ 
            projection:'-__v -_id', 
            new:true, 
            runValidators:true
        });
        if(!quotation){
            res.status(404).json("Quotation not found.")
        }
        res.status(200).json(quotation);
      } catch (error) {
        res.status(500).json({message:"Error updating quotation.", error})
    }
}



exports.deleteQuotation = async(req, res) => {
    try{
        const quotation = await Quotation.findByIdAndDelete(req.params.id)
        if(!quotation){
            res.status(404).json("Quotation not found.");
        }
        return res.status(204).json({message:'Quotation deleted successfully'});
    }catch(error){
        res.status(500).json({message:"Error deleting quotation.", error})
    }
}