const router = require('express').Router();
const salesOrderController = require('../controllers/salesOrderController');

router.post('/',salesOrderController.createSalesOrder);
router.get('/',salesOrderController.getAllSalesOrders);
router.get('/:id',salesOrderController.getSalesOrderById);
router.put('/:id',salesOrderController.updateSalesOrder);
router.delete('/:id',salesOrderController.deleteSalesOrder);

module.exports = router