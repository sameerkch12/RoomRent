const twilio = require("twilio");
const dotenv = require("dotenv");
dotenv.config();

// Twilio configuration
const accountSid = process.env.accountSid
const authToken = process.env.authToken
const verifyServiceSid = process.env.verifyServiceSid // Create this in Twilio Verify
const twilioClient = twilio(accountSid, authToken);

module.exports = {
    twilioClient,
    verifyServiceSid
}