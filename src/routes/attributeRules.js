const router = require('express').Router();
const attributeRuleController = require('../controllers/attributeRuleController');

router.post('/', attributeRuleController.createOrUpdateAttributeRule);
router.get('/', attributeRuleController.getAllAttributeRules);
router.get('/:categoryName', attributeRuleController.getAttributeRuleByCategory);
router.delete('/:categoryName', attributeRuleController.deleteAttributeRule);

module.exports = router;