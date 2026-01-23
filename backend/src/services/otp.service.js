const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Otp = require("../models/Otp");
const sendOtpEmail = require("../utils/sendOtp");
const { blockIp } = require("../utils/ipBlocker");

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
    throw { status: 400, message: "OTP expired" };
  }

  const isValid = await bcrypt.compare(otp, record.otp);

  if (!isValid) {
    record.attempts += 1;

    if (record.attempts === 3) {
      const newOtp = crypto.randomInt(100000, 999999).toString();
      record.otp = await bcrypt.hash(newOtp, 10);
      record.attempts = 0;
      record.expiresAt = Date.now() + 5 * 60 * 1000;
      await record.save();
      await sendOtpEmail(email, newOtp);

      throw {
        status: 400,
        code: "OTP_RESENT",
        message: "New OTP sent",
      };
    }

    if (record.attempts >= 6) {
      blockIp(ip, 20);
      blockEmail(email, 20);
      await Otp.deleteMany({ email });

      throw {
        status: 429,
        code: "BLOCKED",
        message: "Too many attempts. Try again after 20 minutes",
      };
    }

    await record.save();
    throw { status: 400, message: "Invalid OTP" };
  }

  await Otp.deleteMany({ email });
}
module.exports = {
  sendOtp,
  verifySignupOtp,
  verifyResetOtp,
};
