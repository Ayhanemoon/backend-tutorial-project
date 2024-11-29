const router = require('express').Router();
const salesOrderController = require('../controllers/salesOrderController');
const {salesOrderIdValidation, customerValidation, orderLineItemsValidation, totalAmountValidation} = require('../middlewares/salesOrderValidation');
const {checkValidationPassed} = require('../../middlewares/chackValidationPassed');

router.post('/', [customerValidation, orderLineItemsValidation, totalAmountValidation],checkValidationPassed, salesOrderController.createSalesOrder);
/**
 * @swagger
paths:
  /api/v1/sales-order:
    get:
      summary: "Example endpoint"
      parameters:
        - in: header
          name: X-Custom-Header
          required: true
          schema:
            type: string
          description: "Custom header for the request"
      responses:
        '200':
          description: "Successful response"
 */
router.get('/', salesOrderController.getAllSalesOrders);
router.get('/:salesOrderId', salesOrderIdValidation, checkValidationPassed, salesOrderController.getSalesOrderById);
router.put('/:salesOrderId', [salesOrderIdValidation, customerValidation, orderLineItemsValidation, totalAmountValidation],
  checkValidationPassed, salesOrderController.updateSalesOrder);
router.delete('/:salesOrderId', salesOrderIdValidation, checkValidationPassed, salesOrderController.deleteSalesOrder);

module.exports = router;