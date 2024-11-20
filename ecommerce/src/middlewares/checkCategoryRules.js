/* eslint-disable no-magic-numbers */
const Category = require('../models/category');
const AttributeRule = require('../models/attributeRule');

const checkCategoryRules = async (req, res, next) => {
  try {
    const { category, extraAttributes } = req.body;

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const attributeRules = await AttributeRule.findOne({ categoryName: categoryDetails.name.toLowerCase() });
    if (attributeRules) {
      const { requiredAttributes, optionalAttributes } = attributeRules;
      const missingRequiredAttributes = requiredAttributes.filter(attr => !(attr in extraAttributes));
      const invalidAttributes = extraAttributes.filter(attr => !(attr in requiredAttributes) && !(attr in optionalAttributes));

      let message = missingRequiredAttributes.length > 0 ? `Missing required attributes for ${categoryDetails.name}: ${missingRequiredAttributes.join(', ')}` : '';
      message += invalidAttributes.length > 0 ? '\n' +  `Invalid attributes for ${categoryDetails.name}: ${invalidAttributes.join(', ')}` : '';
      if (missingRequiredAttributes.length > 0 || invalidAttributes.length > 0 ) {
        return res.status(400).json({message});
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error checking category rules', error });
  }
};

module.exports = checkCategoryRules;