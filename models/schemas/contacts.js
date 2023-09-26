const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../../helpers");

// Schema for Contact model
const contact = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: { type: Boolean, default: false },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

// Handle Mongoose save errors using a post middleware
contact.post("save", handleMongooseError);

// Creating Mongoose model for the 'contact' collection using the contactSchema
const Contact = model("contact", contact);

module.exports = Contact;
