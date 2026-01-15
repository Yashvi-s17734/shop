const express = require("express");
const bcrypt = require("bcryptjs");
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
      { expiresIn: "1d" }
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
  })
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
      { expiresIn: "1d" }
    );

    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
);
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // req.user is already set by middleware (and password is excluded)
    res.json({ user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
