const router = require('express').Router();
const paymentController = require('../controllers/paymentController');
//const {paymentIdValidation, attributeNameValidation, attributeValuesValidation} = require('../middlewares/paymentValidation');
//const {checkValidationPassed} = require('../../middlewares/chackValidationPassed');

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/:paymentId', paymentController.getPaymentById);
router.delete('/:paymentId', paymentController.deletePayment);

module.exports = router;