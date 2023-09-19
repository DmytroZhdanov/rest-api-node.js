const Contact = require("../models/schemas/contacts");
const { HttpError, controllerWrapper } = require("../helpers");

const getAll = controllerWrapper(async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const allContacts = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner");
  res.json(allContacts);
});

const getById = controllerWrapper(async (req, res, next) => {
  const id = req.params.contactId;
  const contact = await Contact.findById(id);
  if (!contact) {
    throw new HttpError(404, "Not found");
  }
  res.json(contact);
});

const addContact = controllerWrapper(async (req, res, next) => {
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(newContact);
});

const removeContact = controllerWrapper(async (req, res, next) => {
  const deletedContact = await Contact.findByIdAndRemove({ _id: req.params.contactId });
  if (!deletedContact) {
    throw new HttpError(404, "Not found");
  }
  res.json(deletedContact);
});

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
