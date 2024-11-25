const ProductAttribute = require('../models/attribute');

exports.createAttribute = async(req, res) => {
  try {
    const { name, values } = req.body;
    const productAttribute = new ProductAttribute({name, values});
    await productAttribute.save();
    return res.status(201).json({ message: 'Attribute created successfully', productAttribute });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating attributes.', error });
  }
};

exports.getAllAttributes = async(req, res)=>{
  try {
    const productAttribute = await ProductAttribute.find({}, '-__v -updatedAt');
    return res.status(200).json(productAttribute ?? {});
  } catch (error) {
    return res.status(500).json({mssage: 'Error retreiving attributes', error});
  }
};

exports.getAttributeById = async(req, res)=>{
  try {
    const productAttribute = await ProductAttribute.findById(req.params.attributeId, '-__v -_id -updatedAt');
    if (!productAttribute) {
      return res.status(404).json({message:'Attribute not found'});
    }
    return res.status(200).json(productAttribute ?? {});
  } catch (error) {
    return res.status(500).json({mssage: 'Error retreiving attribute', error});
  }
};

exports.updateAttribute = async(req, res)=>{
  try {
    const { name, values} = req.body;
    const productAttribute = await ProductAttribute.findByIdAndUpdate(
      req.params.attributeId,
      { name, values},
      { projection:'-__v -_id -updatedAt', new:true, runValidators:true});
    if (!productAttribute) {
      return res.status(404).json({message:'Attribute not found'});
    }
    return res.status(200).json({message:'Attribute updated successfully', productAttribute});
  } catch (error) {
    return res.status(500).json({message: 'Error updating attribute', error});
  }
};

exports.deleteAttribute = async(req, res) => {
  try {
    const productAttribute = await ProductAttribute.findByIdAndDelete(req.params.attributeId);
    if (!productAttribute) {
      return res.status(404).json({message:'Attribute not found'});
    }
    return res.status(204).json({message:'Attribute deleted successfully'});
  } catch (error) {
    return res.status(500).json({message: 'Error deleting product', error});
  }
};