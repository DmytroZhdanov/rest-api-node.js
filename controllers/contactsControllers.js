const Contact = require("../models/schemas/contacts");
const { HttpError, controllerWrapper } = require("../helpers");

const getAll = controllerWrapper(async (req, res, next) => {
  const allContacts = await Contact.find();
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
  const newContact = await Contact.create({ ...req.body });
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
