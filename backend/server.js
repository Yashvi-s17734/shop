// server.js (or index.js)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");

// Passport config - must be required BEFORE using passport
require("./config/passport");

// Database connection
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// ── Middleware ───────────────────────────────────────────────
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://shop-henna-beta.vercel.app",
      // add your production frontend later
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Initialize Passport (important for OAuth strategies)
app.use(passport.initialize());

// CORS configuration - improved & safer for production

// ── Routes ───────────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));

// Simple health check route (very useful for debugging deployments)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler - better message for debugging
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
    hint: "Check if route exists and method is correct",
  });
});

// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
});

// ── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
});
