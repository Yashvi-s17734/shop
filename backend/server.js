require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./config/passport");

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://shop-henna-beta.vercel.app",
        "https://shop-git-otp-attempts-working-yashvi-shahs-projects-3f7dcf6f.vercel.app",
      ];

      if (allowed.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  }),
);

app.use(passport.initialize());

app.use("/api/auth", require("./src/routes/authRoutes"));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
    hint: "Check if route exists and method is correct",
  });
});

app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
