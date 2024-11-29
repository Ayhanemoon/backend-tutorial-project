const router = require('express').Router();

const salesOrderRoutes = require('./sales/routes/salesOrders');
const authRoutes = require('./accounting/routes/auth');
const categoryRoutes = require('./product/routes/categories');
const attributeRoutes = require('./product/routes/attributes');
const productRoutes = require('./product/routes/products');
const productVariantRoutes = require('./product/routes/productVariants');
const {authenticateJWT} = require('./accounting/middlewares/authValidation');
const {checkValidationPassed} = require('./middlewares/chackValidationPassed');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger-output.json');
//${process.env.ApiVersionAddress}

router.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use('/api/v1/sales-order', /*authenticateJWT, checkValidationPassed,*/ salesOrderRoutes);
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/categories', /*authenticateJWT, checkValidationPassed,*/ categoryRoutes);
router.use('/api/v1/attributes', /*authenticateJWT, checkValidationPassed,*/ attributeRoutes);
router.use('/api/v1/products', /*authenticateJWT, checkValidationPassed,*/ productRoutes);
router.use('/api/v1/product-variants', /*authenticateJWT, checkValidationPassed,*/ productVariantRoutes);

module.exports = router;
