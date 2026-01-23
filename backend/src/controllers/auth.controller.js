const authService = require("../services/auth.service");
const otpService = require("../services/otp.service");
const { isIpBlocked, isEmailBlocked } = require("../utils/ipBlocker");

exports.register = async (req, res) => {
  try {
    await authService.register(req.body);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    await otpService.sendOtp(req.body.email);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const data = await authService.verifySignupOtp(email, otp);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const ip = req.ip;

    if (isIpBlocked(ip) || isEmailBlocked(email)) {
      return res.status(429).json({
        code: "BLOCKED",
        message: "Too many attempts. Try again after 20 minutes",
      });
    }

    await authService.forgotPassword(email);

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await otpService.verifyResetOtp(email, otp, req.ip);
    res.json({ message: "OTP verified" });
  } catch (err) {
    res.status(err.status || 500).json(err);
  }
};


exports.resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.body);
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  res.json({ message: "Logged out" });
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};
console.log("authService keys:", Object.keys(authService));
