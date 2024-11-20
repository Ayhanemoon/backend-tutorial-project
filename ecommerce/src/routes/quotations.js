const router = require('express').Router();
const quotationController = require('../controllers/quotationController');

router.post('/',quotationController.createQuotation);
router.get('/',quotationController.getAllQuotations);
router.get('/:id',quotationController.getQuotationById);
router.put('/:id',quotationController.updateQuotation);
router.delete('/:id',quotationController.deleteQuotation);

module.exports = router