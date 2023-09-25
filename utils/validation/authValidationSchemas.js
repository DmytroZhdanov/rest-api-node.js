const Joi = require("joi");

const registerValidationSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const loginValidationSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const updateSubscriptionValidationSchema = Joi.object({
  subscription: Joi.any().valid("starter", "pro", "business"),
});

module.exports = {
  registerValidationSchema,
  loginValidationSchema,
  updateSubscriptionValidationSchema,
};
