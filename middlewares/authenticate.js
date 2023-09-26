const jwt = require("jsonwebtoken");
const User = require("../models/schemas/users");
const { HttpError } = require("../helpers");
const { SECRET_KEY } = process.env;

/**
 * Middleware function to authenticate user requests using JWT token
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Function to pass control to the next middleware
 * @throws {HttpError} Throw error with status 401 if authentication failed
 */
const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    return next(new HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      next(new HttpError(401, "Not authorized"));
    }

    req.user = user;
    next();
  } catch {
    next(new HttpError(401, "Not authorized"));
  }
};

module.exports = authenticate;
