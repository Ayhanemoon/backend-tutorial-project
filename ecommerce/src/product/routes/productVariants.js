const router = require('express').Router();
const productVariantController = require('../controllers/productVariantController');
const {productVariantIdValidation, patchValidation} = require('../middlewares/productVariantValidation');
const {checkValidationPassed} = require('../../middlewares/chackValidationPassed');

router.get('/', productVariantController.getAllProductVariants);
router.patch('/:productVariantId',[productVariantIdValidation, patchValidation], checkValidationPassed, productVariantController.partiallyUpdateProductVariant);

module.exports = router;