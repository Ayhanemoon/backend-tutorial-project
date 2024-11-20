const ProductVariant = require('../models/productVariant')

exports.validateRegistration = (req, res, next)=>{
    const orderLineItems = req.body;
    orderLineItems.map(async (lineItem) => {
        const product = await ProductVariant.find({productId: lineItem.productVariantId});
        if (!product) {
          res.status(404).json({message:`Product with ID ${line.productId} not found`});
        }

        //chack price validation??
    }
    )
    return next();
  };