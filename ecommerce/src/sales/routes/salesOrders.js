const router = require('express').Router();
const salesOrderController = require('../controllers/salesOrderController');
const {salesOrderIdValidation, salesOrderStateValidation, userValidation,
  orderLineItemsValidation} = require('../middlewares/salesOrderValidation');
const {checkValidationPassed} = require('../../middlewares/chackValidationPassed');

router.post('/', [userValidation, orderLineItemsValidation],checkValidationPassed, salesOrderController.createSalesOrder);
router.get('/', salesOrderController.getAllSalesOrders);
router.get('/:salesOrderId', salesOrderIdValidation, checkValidationPassed, salesOrderController.getSalesOrderById);
router.put('/:salesOrderId', [salesOrderIdValidation, userValidation, orderLineItemsValidation],
  checkValidationPassed, salesOrderController.updateSalesOrder);
router.patch('/:salesOrderId', [salesOrderIdValidation, salesOrderStateValidation], checkValidationPassed, salesOrderController.partiallyUpdateSalesOrder);
router.delete('/:salesOrderId', salesOrderIdValidation, checkValidationPassed, salesOrderController.deleteSalesOrder);

module.exports = router;