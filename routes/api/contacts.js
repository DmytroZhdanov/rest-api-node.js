const express = require("express");
const controllers = require("../../controllers/contactsControllers");
const { validateBody, isValidId, authenticate } = require("../../middlewares");
const schemas = require("../../utils/validation/contactValidationSchemas");

const router = express.Router();

// Routes for handling various contacts-related requests
router.get("/", authenticate, controllers.getAll);
router.get("/:contactId", authenticate, isValidId, controllers.getById);
router.post(
  "/",
  authenticate,
  validateBody(schemas.addContactValidationSchema),
  controllers.addContact
);
router.delete("/:contactId", authenticate, isValidId, controllers.removeContact);
router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemas.addContactValidationSchema),
  controllers.updateContact
);
router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  controllers.updateContact
);

module.exports = router;
