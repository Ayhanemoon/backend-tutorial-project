const router = require('express').Router();
const productAttributeController = require('../controllers/productAttributeController');

router.post('/', productAttributeController.createProductAttribute);
router.get('/', productAttributeController.getAllProductAttributes);
router.get('/:id', productAttributeController.getProductAttributeById);
router.put('/:id', productAttributeController.updateProductAttribute);
router.delete('/:id', productAttributeController.deleteProductAttribute);

module.exports = router;