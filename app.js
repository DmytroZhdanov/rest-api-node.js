const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/api/auth");
const contactsRouter = require("./routes/api/contacts");

const app = express();

// Determine the logging format based on the environment
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger)); // Middleware for request logging
app.use(cors()); // Middleware for enabling CORS
app.use(express.json()); // Middleware for parsing JSON request bodies
app.use(express.static("public")); // Sets up the Express application to serve static files from the "public" directory

app.use("/api/users", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
