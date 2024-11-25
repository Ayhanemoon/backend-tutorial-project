const router = require('express').Router();
const categoryRoutes = require('./categories');
const attributeRoutes = require('./attributes');
const productRoutes = require('./products');
const productVariantRoutes = require('./productVariants.js');

router.use('/categories', categoryRoutes);
router.use('/attributes', attributeRoutes);
router.use('/products', productRoutes);
router.use('/product-variants', productVariantRoutes);

module.exports = router;