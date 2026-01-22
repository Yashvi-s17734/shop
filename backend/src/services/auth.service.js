const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const otpService = require("./otp.service");

async function register({ username, email, password }) {
  if (!username || !email || !password) {
    throw new Error("All fields are required");
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    throw new Error("Username or email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    username,
    email,
    password: hashedPassword,
    provider: "local",
    isVerified: false,
  });
}

async function login({ identifier, password }) {
  if (!identifier || !password) {
    const err = new Error("Email/Username and password are required");
    err.status = 400;
    throw err;
  }

  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });

  if (!user) {
    const err = new Error("Invalid email/username or password");
    err.status = 401;
    throw err;
  }

  if (!user.isVerified) {
    const err = new Error("Please verify your email first");
    err.status = 401;
    throw err;
  }

  if (!user.password) {
    const err = new Error("Please login using Google");
    err.status = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid email/username or password");
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
}
async function forgotPassword(email) {
  const user = await User.findOne({ email });

  if (!user) {
    throw { status: 404, message: "No account found with this email" };
  }

  if (!user.password || user.provider === "google") {
    throw {
      status: 400,
      message: "This account uses Google login",
    };
  }

  await otpService.sendOtp(email);
}

module.exports = {
  register,
  login,
  forgotPassword,
};
