/**
 * Middleware function to wrap asynchronous controller functions for error handling
 *
 * @param {Function} controller Asynchronous function to wrap
 * @returns {Function} Middleware function that wraps the controller
 */
const controllerWrapper = controller => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = controllerWrapper;
