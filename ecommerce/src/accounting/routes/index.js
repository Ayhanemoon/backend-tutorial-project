const router = require('express').Router();
const auth = require('./auth');
const userRoutes = require('./users');

router.use('/auth', auth);
router.use('/users', userRoutes);

module.exports = router;
