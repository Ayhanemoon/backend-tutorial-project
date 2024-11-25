const router = require('express').Router();
const salesOrderRoutes = require('./salesOrders');

router.use('/sales-order', salesOrderRoutes);

module.exports = router;