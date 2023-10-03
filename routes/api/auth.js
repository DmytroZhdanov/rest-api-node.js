const express = require("express");
const controllers = require("../../controllers/authControllers");
const { validateBody, authenticate, uploadImage } = require("../../middlewares");
const schemas = require("../../utils/validation/authValidationSchemas");

const router = express.Router();

// Routes for handling various user-related requests
router.post("/register", validateBody(schemas.registerValidationSchema), controllers.register);
router.get("/verify/:verificationToken", controllers.verificationRequest);
router.post("/verify", validateBody(schemas.verifyValidationSchema), controllers.verify);
router.post("/login", validateBody(schemas.loginValidationSchema), controllers.login);
router.post("/logout", authenticate, controllers.logout);
router.get("/current", authenticate, controllers.getCurrent);
router.patch(
  "/",
  authenticate,
  validateBody(schemas.updateSubscriptionValidationSchema),
  controllers.updateSubscription
);
router.patch("/avatars", authenticate, uploadImage.single("avatar"), controllers.updateAvatar);

module.exports = router;
