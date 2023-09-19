const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/authControllers");
const { validateBody, authenticate } = require("../../middlewares");
const schemas = require("../../utils/validation/authSchemas");

router.post("/register", validateBody(schemas.registerSchema), controllers.register);
router.post("/login", validateBody(schemas.loginSchema), controllers.login);
router.post("/logout", authenticate, controllers.logout);
router.get("/current", authenticate, controllers.getCurrent);

module.exports = router;
