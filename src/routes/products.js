const router = require('express').Router();
const productController = require('../controllers/productController');
const checkCategoryRules = require('../middlewares/checkCategoryRules');

router.post('/', checkCategoryRules, productController.addProduct);
router.put('/:id', checkCategoryRules, productController.updateProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.delete('/:id', productController.deleteProduct);

module.exports = router;