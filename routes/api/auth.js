const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/authControllers");
const { validateBody, authenticate, upload } = require("../../middlewares");
const schemas = require("../../utils/validation/authValidationSchemas");

router.post("/register", validateBody(schemas.registerValidationSchema), controllers.register);
router.post("/login", validateBody(schemas.loginValidationSchema), controllers.login);
router.post("/logout", authenticate, controllers.logout);
router.get("/current", authenticate, controllers.getCurrent);
router.patch(
  "/",
  authenticate,
  validateBody(schemas.updateSubscriptionValidationSchema),
  controllers.updateSubscription
);
router.patch("/avatars", authenticate, upload.single("avatar"), controllers.updateAvatar);

module.exports = router;
