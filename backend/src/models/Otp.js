const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  otpAttempts: { type: Number, default: 0 },
  totalAttempts: { type: Number, default: 0 },
});
module.exports = mongoose.model("Otp", otpSchema);
