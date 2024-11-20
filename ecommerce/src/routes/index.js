const router = require('express').Router();
const auth = require('./auth');
const userRoutes = require('./users');
const categoryRoutes = require('./categories')


router.use('/auth', auth);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;