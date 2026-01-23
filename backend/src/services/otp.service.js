const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Otp = require("../models/Otp");
const sendOtpEmail = require("../utils/sendOtp");
const { blockIp, blockEmail } = require("../utils/ipBlocker");

async function sendOtp(email) {
  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await Otp.deleteMany({ email });

  await Otp.create({
    email,
    otp: hashedOtp,
    attempts: 0,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  await sendOtpEmail(email, otp);
}

async function verifySignupOtp(email, otp) {
  const record = await Otp.findOne({ email });

  if (!record || record.expiresAt < Date.now()) {
    throw { status: 400, message: "OTP expired" };
  }

  const isValid = await bcrypt.compare(otp, record.otp);
  if (!isValid) {
    throw { status: 400, message: "Invalid OTP" };
  }

  await Otp.deleteMany({ email });
}
async function verifyResetOtp(email, otp, ip) {
  const record = await Otp.findOne({ email });

  if (!record || record.expiresAt < Date.now()) {
    await Otp.deleteMany({ email });
    throw {
      status: 400,
      code: "OTP_EXPIRED",
      message: "OTP expired",
    };
  }

  const isValid = await bcrypt.compare(otp, record.otp);

  if (!isValid) {
    record.attempts = record.attempts ?? 0;
    record.totalAttempts = record.totalAttempts ?? 0;

    record.attempts += 1;
    record.totalAttempts += 1;

    const attemptsLeftThisOtp = Math.max(0, 3 - record.attempts);

    if (record.totalAttempts >= 10) {
      blockEmail(email, 30);
      await Otp.deleteMany({ email });
      throw {
        status: 429,
        code: "BLOCKED",
        message:
          "Too many attempts. Password reset is temporarily locked for this account. Try again in 30 minutes.",
      };
    }

    await record.save();
    console.log("Throwing error:", {
      status: 400,
      code: "INVALID_OTP",
      attemptsLeft: attemptsLeftThisOtp,
      message: `Invalid OTP. ${attemptsLeftThisOtp} attempt${attemptsLeftThisOtp === 1 ? "" : "s"} left`,
    });

    throw {
      status: 400,
      code: "INVALID_OTP", // ← MUST HAVE THIS
      attemptsLeft: attemptsLeftThisOtp, // ← MUST SEND THIS
      message: `Invalid OTP. ${attemptsLeftThisOtp} attempt${attemptsLeftThisOtp === 1 ? "" : "s"} left`,
    };
  }

  await Otp.deleteMany({ email });
}
module.exports = {
  sendOtp,
  verifySignupOtp,
  verifyResetOtp,
};
