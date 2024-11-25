const router = require('express').Router();

const salesRoutes = require('./sales/routes/index');
const accountingRoutes = require('./accounting/routes/index');
const productRoutes = require('./product/routes/index');

//const versionAddress = process.env.ApiVersionAddress + ''; ???
router.use('/api/v1', salesRoutes);
router.use('/api/v1', accountingRoutes);
router.use('/api/v1', productRoutes);

module.exports = router;
