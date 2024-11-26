const router = require('express').Router();
const salesOrderController = require('../controllers/salesOrderController');
const {salesOrderIdValidation, customerValidation, orderLineItemsValidation, totalAmountValidation} = require('../middlewares/salesOrderValidation');
const {checkValidationPassed} = require('../../middlewares/chackValidationPassed');

router.post('/', [customerValidation, orderLineItemsValidation, totalAmountValidation],checkValidationPassed, salesOrderController.createSalesOrder);
router.get('/', salesOrderController.getAllSalesOrders);
router.get('/:salesOrderId', salesOrderIdValidation, checkValidationPassed, salesOrderController.getSalesOrderById);
router.put('/:salesOrderId', [salesOrderIdValidation, customerValidation, orderLineItemsValidation, totalAmountValidation],
  checkValidationPassed, salesOrderController.updateSalesOrder);
router.delete('/:salesOrderId', salesOrderIdValidation, checkValidationPassed, salesOrderController.deleteSalesOrder);

module.exports = router;