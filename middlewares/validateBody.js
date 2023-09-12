const { HttpError } = require("../helpers");

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
