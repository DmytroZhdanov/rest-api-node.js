const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../../helpers");

// Schema for User model
const user = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    avatarURL: {
      type: String,
      required: true,
    },
    token: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

// Handle Mongoose save errors using a post middleware
user.post("save", handleMongooseError);

// Creating Mongoose model for the 'user' collection using the userSchema
const User = model("user", user);

module.exports = User;
