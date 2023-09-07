const { HttpError, controllerWrapper } = require("../helpers");
const contacts = require("../models/contacts");

const getAll = async (req, res, next) => {
  const allContacts = await contacts.listContacts();
  res.json(allContacts);
};

const getById = async (req, res, next) => {
  const id = req.params.contactId;
  const contact = await contacts.getContactById(id);
  if (!contact) {
    throw new HttpError(404, "Not found");
  }
  res.json(contact);
};

const addContact = async (req, res, next) => {
  const newContact = await contacts.addContact(req.body);
  res.status(201).json(newContact);
};

const removeContact = async (req, res, next) => {
  const deletedContact = await contacts.removeContact(req.params.contactId);
  if (!deletedContact) {
    throw new HttpError(404, "Not found");
  }
  res.json(deletedContact);
};

const updateContact = async (req, res, next) => {
  const updatedContact = await contacts.updateContact(req.params.contactId, req.body);
  if (!updatedContact) {
    throw new HttpError(404, "Not found");
  }
  res.json(updatedContact);
};

module.exports = {
  getAll: controllerWrapper(getAll),
  getById: controllerWrapper(getById),
  addContact: controllerWrapper(addContact),
  removeContact: controllerWrapper(removeContact),
  updateContact: controllerWrapper(updateContact),
};
