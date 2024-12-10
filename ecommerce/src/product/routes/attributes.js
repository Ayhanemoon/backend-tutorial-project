const router = require('express').Router();
const attributeController = require('../controllers/attributeController');
const {attributeIdValidation, attributeNameValidation, attributeValuesValidation} = require('../middlewares/attributeValidation');
const {checkValidationPassed} = require('../../middlewares/chackValidationPassed');

router.post('/', [attributeNameValidation, attributeValuesValidation], checkValidationPassed, attributeController.createAttribute);
router.get('/', attributeController.getAllAttributes);
router.get('/:attributeId', attributeIdValidation, checkValidationPassed, attributeController.getAttributeById);
router.put('/:attributeId', [attributeIdValidation, attributeNameValidation, attributeValuesValidation], checkValidationPassed, attributeController.updateAttribute);
router.delete('/:attributeId', attributeIdValidation, checkValidationPassed, attributeController.deleteAttribute);

module.exports = router;