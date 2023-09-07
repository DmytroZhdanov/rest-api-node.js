const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/contactsControllers");
const { validateBody } = require("../../middlewares");
const schemas = require("../../utils/validation/contactValidationSchemas");

router.get("/", controllers.getAll);
router.get("/:contactId", controllers.getById);
router.post("/", validateBody(schemas.addContactValidationSchema), controllers.addContact);
router.delete("/:contactId", controllers.removeContact);
router.put("/:contactId", validateBody(schemas.addContactValidationSchema), controllers.updateContact);

module.exports = router;
