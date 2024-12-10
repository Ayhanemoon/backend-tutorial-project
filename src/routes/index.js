const router = require('express').Router();
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const attributeRuleRoutes = require('./attributeRuleRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/attribute-rules', attributeRuleRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

module.exports = router;