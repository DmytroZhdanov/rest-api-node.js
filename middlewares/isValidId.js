const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../helpers");

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    throw new HttpError(400, `${contactId} is not valid contactId`);
  }
  next();
};

module.exports = isValidId;
