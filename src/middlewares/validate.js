/* eslint-disable no-magic-numbers */
const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required()
});

exports.validateRegistration = (req, res, next)=>{
  const {error} = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({message: error.details[0].message});
  }
  return next();
};