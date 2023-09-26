const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../helpers");

/**
 * Middleware function to validate if a given ID is a valid MongoDB ObjectId
 * 
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Function to pass control to the next middleware
 * @throws {HttpError} Throw error with status 400 if validation failed
 */
const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    throw new HttpError(400, `${contactId} is not valid contactId`);
  }
  next();
};

module.exports = isValidId;
