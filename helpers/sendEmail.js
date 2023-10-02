const nodemailer = require("nodemailer");

const { EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_FROM_USER, EMAIL_FROM_PASSWORD } = process.env;

const nodemailerConfig = {
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: {
    user: EMAIL_FROM_USER,
    pass: EMAIL_FROM_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

/**
 * Send email to user
 *
 * @param {Object} email Dynamic data for sending email
 */
const sendEmail = async email => {
  await transport.sendMail({ ...email, from: EMAIL_FROM_USER });
};

module.exports = sendEmail;
