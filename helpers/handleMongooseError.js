/**
 *
 * @param {Error} error Mongoose error
 * @param {Object} data Additional data related to the error
 * @param {Function} next Function to pass control to the next middleware
 */
const handleMongooseError = (error, data, next) => {
  error.status = 400;
  next();
};

module.exports = handleMongooseError;
