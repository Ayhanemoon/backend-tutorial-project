const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const {categoryIdValidation, categoryNameValidation, categoryParentValidation, categoryAttributesValidation} = require('../middlewares/categoryValidation');
const {checkValidationPassed} = require('../../middlewares/chackValidationPassed');

router.post('/', [categoryNameValidation, categoryParentValidation, categoryAttributesValidation], checkValidationPassed, categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:categoryId', categoryIdValidation, checkValidationPassed, categoryController.getCategoryById);
router.put('/:categoryId', [categoryIdValidation, categoryNameValidation, categoryParentValidation, categoryAttributesValidation], checkValidationPassed, categoryController.updateCategory);
router.delete('/:categoryId', categoryIdValidation, checkValidationPassed, categoryController.deleteCategory);
router.patch('/:categoryId/attributes', [categoryIdValidation, categoryAttributesValidation], checkValidationPassed, categoryController.updateAttributes);

module.exports = router;