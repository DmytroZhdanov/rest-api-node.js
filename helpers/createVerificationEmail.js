const { BASE_URL } = process.env;

/**
 * Create email object to send
 *
 * @param {String} email user email address to send a letter
 * @param {String} verificationToken Token for verification
 * @returns Object containing dynamic data for sending email
 */
const createVerificationEmail = (email, verificationToken) => ({
  to: email,
  subject: "Verify your email address",
  html: `<h1>Please, verify your email address</h1><p>Click <a href="${BASE_URL}/api/users/verify/${verificationToken}">here</a> to pass verification`,
});

module.exports = createVerificationEmail;
