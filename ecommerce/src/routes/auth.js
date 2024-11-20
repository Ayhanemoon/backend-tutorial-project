const router = require('express').Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');

router.post('/register', validate.validateRegistration, authController.register);
router.post('/login', authController.login);

module.exports = router;
