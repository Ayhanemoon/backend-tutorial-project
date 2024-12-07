const router = require('express').Router();
const authController = require('../controllers/authController');
const {registrationUsernameValidation, registrationPasswordValidation, registrationEmailValidation, registrationPhoneValidation} = require('../middlewares/authValidation');
const {checkValidationPassed} = require('../../middlewares/chackValidationPassed');

router.post('/register', [registrationUsernameValidation, registrationPasswordValidation,
  registrationEmailValidation, registrationPhoneValidation], checkValidationPassed, authController.register);
router.post('/login', authController.login);

module.exports = router;
