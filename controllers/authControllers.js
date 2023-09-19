const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/schemas/users");

const { HttpError, controllerWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

const register = controllerWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = bcrypt.hash(password, 10);

  const newUser = { ...req.body, password: hashPassword };

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
});

const login = controllerWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({ token, user: { email } });
});

const logout = controllerWrapper(async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204);
});

const getCurrent = controllerWrapper(async (req, res) => {
  const { email } = req.user;

  res.json({ email });
});

module.exports = { register, login, logout, getCurrent };
