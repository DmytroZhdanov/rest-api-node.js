const { HttpError } = require("../helpers");

/**
 * Middleware function to validate the request body using a schema
 * 
 * @param {Joi.schema} schema Joi schema for request body validation
 * @returns Middleware function to validate the request body
 */
const validateBody = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      const fieldName = error.message.split('"');
      next(new HttpError(400, `missing ${fieldName[1]} field`));
    }

    next();
  };
};

module.exports = validateBody;
