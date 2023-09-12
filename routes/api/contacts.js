const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/contactsControllers");
const { validateBody, isValidId } = require("../../middlewares");
const schemas = require("../../utils/validation/contactValidationSchemas");

router.get("/", controllers.getAll);
router.get("/:contactId", isValidId, controllers.getById);
router.post("/", validateBody(schemas.addContactValidationSchema), controllers.addContact);
router.delete("/:contactId", isValidId, controllers.removeContact);
router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.addContactValidationSchema),
  controllers.updateContact
);
router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  controllers.updateContact
);

module.exports = router;
