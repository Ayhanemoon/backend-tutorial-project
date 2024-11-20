const ProductVariant = require('../models/productVariant');

exports.createProductVariant = async(req, res) => {
  try {
    let { product, attributes, sku, stock, price } = req.body;
    const productVariant = new ProductVariant({product, attributes, sku, stock, price });
    await productVariant.save();
    return res.status(201).json({ message: 'Product variant created successfully', productVariant });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating product variant.', error });
  }
};

exports.getAllProductVariants = async(req, res)=>{
  try {
    const productVariant = await ProductVariant.find({}, '-__v -updatedAt');
    return res.status(200).json(productVariant ?? {});
  } catch (error) {
    return res.status(500).json({mssage: 'Error retreiving product variant', error});
  }
};

exports.getProductVariantById = async(req, res)=>{
  try {
    const productVariant = await ProductVariant.findById(req.params.id, '-__v -_id -updatedAt');
    return res.status(200).json(productVariant ?? {});
  } catch (error) {
    return res.status(500).json({mssage: 'Error retreiving product variant', error});
  }
};

exports.updateProductVariant = async(req, res)=>{
  try {
    let { product, attributes, sku, stock, price} = req.body;
    const productVariant = await ProductVariant.findByIdAndUpdate(
      req.params.id,
      { product, attributes, sku, stock, price},
      { projection:'-__v -_id -updatedAt', new:true, runValidators:true});
    if (!productVariant) {
      return res.status(404).json({message:'Product variant not found'});
    }
    return res.status(200).json({message:'Product variant updated successfully', product});
  } catch (error) {
    return res.status(500).json({message: 'Error updating product variant', error});
  }
};

exports.deleteProductVariant = async(req, res) => {
  try {
    const productVariant = await ProductVariant.findByIdAndDelete(req.params.id);
    if (!productVariant) {
      return res.status(404).json({message:'Product variant not found'});
    }
    return res.status(204).json({message:'Product variant deleted successfully'});
  } catch (error) {
    return res.status(500).json({message: 'Error deleting product variant', error});
  }
};