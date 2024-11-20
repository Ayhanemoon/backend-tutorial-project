const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required()
});

exports.validateRegistration = (req, res, next)=>{
  const {orderLines} = req.body;
    
  return next();
};