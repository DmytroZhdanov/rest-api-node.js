const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const nanoid = require("nanoid");

const User = require("../models/schemas/users");
const { HttpError, controllerWrapper, resizeImage } = require("../helpers");
const sendEmail = require("../helpers/sendEmail");
const createVerificationEmail = require("../helpers/createVerificationEmail");

const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

/**
 * Register a new user using provided email and password
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @throws {HttpError} Throw error with status 409 if registration failed
 * @returns {Object} JSON response containing the newly registered user's email and subscription
 */
const register = controllerWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  await sendEmail(createVerificationEmail(email, verificationToken));

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
});

/**
 * Handling verification request
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @throws {HttpError} Throw error with status 404 if user not found and verification failed to pass
 * @returns {Object} JSON response containing success code and message
 */
const verificationRequest = controllerWrapper(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  await User.findOneAndUpdate(user._id, { verify: true, verificationToken: null });

  res.status(200).json({ message: "Verification successful" });
});

/**
 * Resend verification email if user not verified
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @throws {HttpError} Throw error with status 404 if user not found
 * @throws {HttpError} Throw error with status 400 if verification has already been passed
 * @returns {Object} JSON response containing success code and message
 */
const verify = controllerWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed");
  }

  await sendEmail(createVerificationEmail(email, user.verificationToken));

  res.status(200).json({ message: "Verification email sent" });
});

/**
 * Log in an existing user using provided email and password
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @throws {HttpError} Throw error with status 401 if login failed
 * @throws {HttpError} Throw error with status 403 if user is not verified
 * @returns {Object} JSON response containing authentication token and user's email and subscription
 */
const login = controllerWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw new HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw new HttpError(403, "Log in forbidden");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({ token, user: { email, subscription: user.subscription } });
});

/**
 * Log out authorized user
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {Object} JSON response indicating successful logout
 */
const logout = controllerWrapper(async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204);
});

/**
 * Get authorized user's data
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {Object} JSON response containing currently authorized user's email and subscription
 */
const getCurrent = controllerWrapper(async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
});

/**
 * Update user's subscription type
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {Object} JSON response containing user's email and updated subscription type
 */
const updateSubscription = controllerWrapper(async (req, res) => {
  const { _id, email } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(_id, { subscription });

  res.json({ email, subscription });
});

/**
 * Update user's avatar
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {Object} JSON response containing user's new avatarURL
 */
const updateAvatar = controllerWrapper(async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await resizeImage(tempUpload);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
});

module.exports = {
  register,
  verificationRequest,
  verify,
  login,
  logout,
  getCurrent,
  updateSubscription,
  updateAvatar,
};
