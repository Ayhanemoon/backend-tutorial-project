const router = require('express').Router();
const userController = require('../controllers/userController');
const {registrationUsernameValidation, registrationPasswordValidation, registrationEmailValidation, registrationPhoneValidation} = require('../middlewares/authValidation');
const {checkValidationPassed} = require('../../middlewares/chackValidationPassed');

router.get('/:userId', userController.register);
router.post('/login', authController.login);

module.exports = router;
