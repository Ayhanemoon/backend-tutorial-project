const router = require('express').Router();
const productController = require('../controllers/productController');
const {productIdValidation, productNameValidation, productPriceValidation,
  productCategoryValidation, productAttributesValidation} = require('../middlewares/productValidation');
const {checkValidationPassed} = require('../../middlewares/chackValidationPassed');

router.post('/', [productNameValidation, productPriceValidation, productCategoryValidation,
  productAttributesValidation] ,checkValidationPassed ,productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:productId',productIdValidation ,checkValidationPassed, productController.getProductById);
router.put('/:productId', [productIdValidation, productNameValidation, productPriceValidation,
  productCategoryValidation, productAttributesValidation],checkValidationPassed, productController.updateProduct);
router.delete('/:productId', productIdValidation, checkValidationPassed, productController.deleteProduct);
router.patch('/:productId/attributes',[productIdValidation, productAttributesValidation] ,checkValidationPassed, productController.updateAttributes);//???

module.exports = router;