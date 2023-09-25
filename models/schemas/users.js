const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../../helpers");

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
  },
  { versionKey: false, timestamps: true }
);

user.post("save", handleMongooseError);

const User = model("user", user);

module.exports = User;
