const Attribute = require('../models/attribute');

exports.createAttribute = async(req, res) => {
  // #swagger.tags = ['Attribute']
  try {
    const { name, values } = req.body;
    const attribute = new Attribute({name, values});
    await attribute.save();
    return res.status(201).json({ message: 'Attribute created successfully', attribute });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating attributes.', error });
  }
};

exports.getAllAttributes = async(req, res) => {
  // #swagger.tags = ['Attribute']
  try {
    const attribute = await Attribute.find({}, '-__v -updatedAt');
    return res.status(200).json(attribute ?? {});
  } catch (error) {
    return res.status(500).json({mssage: 'Error retreiving attributes', error});
  }
};

exports.getAttributeById = async(req, res)=>{
  // #swagger.tags = ['Attribute']
  try {
    const attribute = await Attribute.findById(req.params.attributeId, '-__v -_id -updatedAt');
    // if (!productAttribute) {
    //   return res.status(404).json({message:'Attribute not found'});
    // }
    return res.status(200).json(attribute ?? {});
  } catch (error) {
    return res.status(500).json({mssage: 'Error retreiving attribute', error});
  }
};

exports.updateAttribute = async(req, res)=>{
  // #swagger.tags = ['Attribute']
  try {
    const { name, values} = req.body;
    const attribute = await Attribute.findByIdAndUpdate(
      req.params.attributeId,
      { name, values},
      { projection:'-__v -_id -updatedAt', new:true, runValidators:true});
    // if (!productAttribute) {
    //   return res.status(404).json({message:'Attribute not found'});
    // }
    return res.status(200).json({message:'Attribute updated successfully', attribute});
  } catch (error) {
    return res.status(500).json({message: 'Error updating attribute', error});
  }
};

exports.deleteAttribute = async(req, res) => {
  // #swagger.tags = ['Attribute']
  try {
    await Attribute.findByIdAndDelete(req.params.attributeId);
    // if (!productAttribute) {
    //   return res.status(404).json({message:'Attribute not found'});
    // }
    return res.status(204).json({message:'Attribute deleted successfully'});
  } catch (error) {
    return res.status(500).json({message: 'Error deleting product', error});
  }
};