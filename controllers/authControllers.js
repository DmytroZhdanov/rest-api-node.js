const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");

const User = require("../models/schemas/users");
const { HttpError, controllerWrapper, resizeImage } = require("../helpers");

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

  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
});

/**
 * Log in an existing user using provided email and password
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @throws {HttpError} Throw error with status 401 if login failed
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

module.exports = { register, login, logout, getCurrent, updateSubscription, updateAvatar };
