const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Otp = require("../models/Otp");
const sendOtpEmail = require("../utils/sendOtp");
const { blockIp, blockEmail } = require("../utils/ipBlocker");

async function sendOtp(email) {
  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  const existing = await Otp.findOne({ email });

  if (existing) {
    if (existing.resendCount >= 1) {
      throw {
        status: 429,
        code: "RESEND_LIMIT",
        message: "OTP resend limit reached",
      };
    }

    await Otp.updateOne(
      { email },
      {
        $set: {
          otp: hashedOtp,
          otpAttempts: 0,
          expiresAt: Date.now() + 5 * 60 * 1000,
        },
        $inc: {
          resendCount: 1,
          otpCycles: 1, // optional if you use cycles
        },
      },
    );
  } else {
    await Otp.create({
      email,
      otp: hashedOtp,
      otpAttempts: 0,
      resendCount: 0,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });
  }

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
    throw { status: 400, code: "OTP_EXPIRED", message: "OTP expired" };
  }

  const isValid = await bcrypt.compare(otp, record.otp);

  if (!isValid) {
    record.otpAttempts = Number(record.otpAttempts || 0) + 1;
    await record.save();

    const attemptsLeft = Math.max(0, 3 - record.otpAttempts);
    console.log("record", record);
    if (record.otpAttempts >= 3) {
      if (record.otpCycles >= 2) {
        // blockEmail(email, 15);
        // blockIp(ip, 15);
        console.log("is is blocked");
        await Otp.deleteMany({ email });

        throw {
          status: 429,
          code: "BLOCKED",
          message: "Too many attempts. Blocked for 15 minutes.",
        };
      }

      // Lock OTP and force resend
      record.expiresAt = Date.now();
      await record.save();

      throw {
        status: 400,
        code: "OTP_ATTEMPTS_EXCEEDED",
        canResend: true,
        message: "OTP attempts exceeded. Please resend OTP.",
      };
    }

    throw {
      status: 400,
      code: "INVALID_OTP",
      attemptsLeft,
      message: `Invalid OTP. ${attemptsLeft} attempts left`,
    };
  }

  await Otp.deleteMany({ email });
}

module.exports = {
  sendOtp,
  verifySignupOtp,
  verifyResetOtp,
};
