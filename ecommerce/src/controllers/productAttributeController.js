const ProductAttribute = require('../models/productAttribute');

exports.createProductAttribute = async(req, res) => {
  try {
    let { name, values } = req.body;
    const productAttribute = new ProductAttribute({name, values});
    await productAttribute.save();
    return res.status(201).json({ message: 'Product attribute created successfully', product });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating product attributes.', error });
  }
};

exports.getAllProductAttributes = async(req, res)=>{
  try {
    const productAttribute = await ProductAttribute.find({}, '-__v -updatedAt');
    return res.status(200).json(productAttribute ?? {});
  } catch (error) {
    return res.status(500).json({mssage: 'Error retreiving product attributes', error});
  }
};

exports.getProductAttributeById = async(req, res)=>{
  try {
    const productAttribute = await ProductAttribute.findById(req.params.id, '-__v -_id -updatedAt');
    return res.status(200).json(productAttribute ?? {});
  } catch (error) {
    return res.status(500).json({mssage: 'Error retreiving product attribute', error});
  }
};

exports.updateProductAttribute = async(req, res)=>{
  try {
    let { name, values} = req.body;
    const productAttribute = await ProductAttribute.findByIdAndUpdate(
      req.params.id,
      { name, values},
      { projection:'-__v -_id -updatedAt', new:true, runValidators:true});
    if (!productAttribute) {
      return res.status(404).json({message:'Product attribute not found'});
    }
    return res.status(200).json({message:'Product attribute updated successfully', product});
  } catch (error) {
    return res.status(500).json({message: 'Error updating product attribute', error});
  }
};

exports.deleteProductAttribute = async(req, res) => {
  try {
    const productAttribute = await ProductAttribute.findByIdAndDelete(req.params.id);
    if (!productAttribute) {
      return res.status(404).json({message:'Product attribute not found'});
    }
    return res.status(204).json({message:'Product attribute deleted successfully'});
  } catch (error) {
    return res.status(500).json({message: 'Error deleting product attribute', error});
  }
};