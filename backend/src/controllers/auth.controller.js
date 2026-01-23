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

    if (isEmailBlocked(email)) {
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

    // Optional: Add basic input validation
    if (!email || !otp) {
      return res.status(400).json({
        code: "MISSING_FIELDS",
        message: "Email and OTP are required",
      });
    }

    await otpService.verifyResetOtp(email, otp, req.ip);

    // Success
    res.status(200).json({ message: "OTP verified" });
  } catch (err) {
    // Log the full error for debugging (you can remove this later)
    console.error("Error in verifyResetOtp:", err);

    const status = err.status || 500;

    // Construct a clean, reliable error response
    const errorResponse = {
      code: err.code || "SERVER_ERROR",
      message: err.message || "An unexpected error occurred",
      attemptsLeft: err.attemptsLeft !== undefined ? err.attemptsLeft : null,
      status: status, // optional: include for frontend reference
    };

    // If there are additional fields in err, merge them safely
    if (typeof err === "object" && err !== null) {
      Object.assign(errorResponse, err);
    }

    // Send the response
    res.status(status).json(errorResponse);
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
