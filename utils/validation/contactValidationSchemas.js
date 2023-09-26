// Joi schemas to validate request body related to contact's operations
const Joi = require("joi");

const addContactValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = { addContactValidationSchema, updateFavoriteSchema };
