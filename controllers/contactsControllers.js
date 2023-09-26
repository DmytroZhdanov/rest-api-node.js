const Contact = require("../models/schemas/contacts");
const { HttpError, controllerWrapper } = require("../helpers");

/**
 * Get user's contacts including optional filtering by favorite status and pagination
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Function to pass control to the next middleware
 * @returns {Object} JSON response containing user's contacts
 */
const getAll = controllerWrapper(async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const allContacts = await Contact.find(
    favorite ? { owner, favorite } : { owner },
    "-createdAt -updatedAt",
    {
      skip,
      limit,
    }
  ).populate("owner");

  res.json(allContacts);
});

/**
 * Get user's contact by contact ID
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Function to pass control to the next middleware
 * @throws {HttpError} Throw error with status 404 if contact not found
 * @returns {Object} JSON response containing user's contact
 */
const getById = controllerWrapper(async (req, res, next) => {
  const id = req.params.contactId;
  const contact = await Contact.findById(id);

  if (!contact) {
    throw new HttpError(404, "Not found");
  }

  res.json(contact);
});

/**
 * Add new contact
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Function to pass control to the next middleware
 * @returns {Object} JSON response containing newly created user's contact
 */
const addContact = controllerWrapper(async (req, res, next) => {
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });

  res.status(201).json(newContact);
});

/**
 * Delete user's contact by contact ID
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Function to pass control to the next middleware
 * @throws {HttpError} Throw error with status 404 if contact not found
 * @returns {Object} JSON response containing deleted user's contact
 */
const removeContact = controllerWrapper(async (req, res, next) => {
  const deletedContact = await Contact.findByIdAndRemove({ _id: req.params.contactId });

  if (!deletedContact) {
    throw new HttpError(404, "Not found");
  }

  res.json(deletedContact);
});

/**
 * Update user's contact by contact ID
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Function to pass control to the next middleware
 * @throws {HttpError} Throw error with status 404 if contact not found
 * @returns {Object} JSON response containing updated user's contact
 */
const updateContact = controllerWrapper(async (req, res, next) => {
  const updatedContact = await Contact.findByIdAndUpdate({ _id: req.params.contactId }, req.body, {
    new: true,
  });

  if (!updatedContact) {
    throw new HttpError(404, "Not found");
  }

  res.json(updatedContact);
});

module.exports = {
  getAll,
  getById,
  addContact,
  removeContact,
  updateContact,
};
