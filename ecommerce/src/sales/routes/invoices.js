const router = require('express').Router();
const invoiceController = require('../controllers/invoiceController');
//const {checkValidationPassed} = require('../../middlewares/chackValidationPassed');

//router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.getAllInvoices);
router.get('/:invoiceId', invoiceController.getInvoiceById);
//router.put('/:invoiceId', invoiceController.updateInvoice);
//router.delete('/:invoiceId', invoiceController.deleteInvoice);

module.exports = router;