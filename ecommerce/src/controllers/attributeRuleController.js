/* eslint-disable no-magic-numbers */
const AttributeRule = require('../models/attributeRule');

exports.createOrUpdateAttributeRule = async(req, res)=>{
  try {
    // eslint-disable-next-line prefer-const
    let {categoryName, requiredAttributes, optionalAttributes} = req.body;
    categoryName = categoryName.toLowerCase();
    const attributeRule = await AttributeRule.findOneAndUpdate(
      req.params.id,
      {categoryName, requiredAttributes, optionalAttributes},
      {projection:'-__v -_id', new:true, upsert:true, runValidators:true});

    res.status(200).json({message: 'Arribute rule added/updated successfully',attributeRule});
  } catch (error) {
    res.status(500).json({message:'Error adding/updating attributeRule.',error});
  }
};

exports.getAllAttributeRules = async(req, res)=>{
  try {
    const attributeRules = await AttributeRule.find({},'-__v');
    res.status(200).json(attributeRules??{});
  } catch (error) {
    res.status(500).json({message:'Error retreiving attributeRules.',error});
  }
};

exports.getAttributeRuleByCategory = async(req, res)=>{
  try {
    const categoryName = req.params.categoryName;
    const attributeRule = await AttributeRule.findOne({categoryName: categoryName?.toLowerCase()});
    if (!attributeRule) {
      res.status(404).json({message: 'AttributeRule not found'});
    }
    res.status(200).json(attributeRule);
  } catch (error) {
    res.status(500).json({message:'Error retreiving attributeRule.',error});
  }
};

exports.deleteAttributeRule = async(req, res)=>{
  try {
    const attributeRule = await AttributeRule.findOneAndDelete({ categoryName: req.params.categoryName});
    if (!attributeRule) {
      res.status(404).json({message: 'AttributeRule not found.'});
    }
    res.status(204).json({message: 'Attribute rule deleted successfully'});
  } catch (error) {
    res.status(500).json({message:'Error deleting attributeRule.',error});
  }
};