const {check} = require('express-validator');
const Customer = require('../models/customer');
const jwt = require('jsonwebtoken');

const usernameMinLen = 3;
const passwordMinLen = 6;

exports.registrationUsernameValidation = check('username')
  .notEmpty()
  .withMessage('Username is required.')
  .bail()
  .isLength({ min: usernameMinLen})
  .withMessage(`Username must at least ${usernameMinLen} characters long.`)
  .bail()
  .custom(async username => {
    const customer = await Customer.findOne({username});
    if (customer) {
      throw new Error(`Customer with username '${username}' exists.`);
    }
    return true;
  });

exports.registrationPasswordValidation = check('password')
  .notEmpty()
  .withMessage('Password is required.')
  .bail()
  .isLength({min : passwordMinLen})
  .withMessage(`Password must be at least ${passwordMinLen} characters long.`);

exports.registrationEmailValidation = check('email')
  .notEmpty()
  .withMessage('Email is required.')
  .bail()
  .custom(async email => {
    const customer = await Customer.findOne({email});
    if (customer) {
      throw new Error(`Customer with email '${email}' exists.`);
    }
    return true;
  });

exports.registrationPhoneValidation = check('phone')
  .optional()
  .isString();

exports.authenticateJWT = check('Authorization')
  .notEmpty()
  .withMessage('Access Denied. No token provided.')
  .custom((token, req) => {
    try {
      req.local.customer = jwt.verify(token, process.env.JWT_SECRET);
      return true;
    } catch (err) {
      throw new Error({message:'Access Denied. Invalid token.', err});
    }
  });