const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Otp = require("../models/Otp");
const sendOtpEmail = require("../utils/sendOtp");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const passport = require("passport");
const router = express.Router();
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "user registered successfully!!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email first",
      });
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.password) {
      return res.status(401).json({
        message: "Please login using Google",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",

      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        role: req.user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  },
);
router.get("/me", authMiddleware, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.deleteMany({ email });
    await Otp.create({
      email,
      otp: hashedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });
    await sendOtpEmail(email, otp);
    res.json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error(
      "SendGrid error details:",
      error.response?.body || error.message,
    );

    res.status(500).json({
      message: "Failed to send OTP",
      error: error.response?.body?.errors?.[0]?.message || "Internal error",
    });
  }
});
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email });
  if (!record) return res.status(400).json({ message: "OTP expired" });

  if (record.expiresAt < Date.now())
    return res.status(400).json({ message: "OTP expired" });

  const isValid = await bcrypt.compare(otp, record.otp);
  if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

  let user = await User.findOne({ email });

  if (!user) {
    const baseUsername = email.split("@")[0];

    let username = baseUsername;
    let count = 1;

    while (await User.findOne({ username })) {
      username = `${baseUsername}${count}`;
      count++;
    }

    user = await User.create({
      username,
      email,
      isVerified: true,
      provider: "local",
    });
  }

  user.isVerified = true;
  await user.save();

  await Otp.deleteMany({ email });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ message: "Verified", token, user });
  console.log("OTP VERIFY USER:", user);
});
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });
  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  await Otp.deleteMany({ email });
  await Otp.create({
    email,
    otp: hashedOtp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
  await sendOtpEmail(email, otp);
  res.json({ mesaage: "OTP sent to email" });
});
router.post("/verify-reset-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email });
    if (!record) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isValid = await bcrypt.compare(otp, record.otp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ OTP verified, BUT DO NOT change password here
    res.json({ message: "OTP verified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    await Otp.deleteMany({ email });

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
