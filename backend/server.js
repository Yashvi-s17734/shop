const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://shop-henna-beta.vercel.app",
    credentials: true,
  })
);

app.use("/api/auth", require("./routes/authRoutes"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sever Running on port ${PORT}`);
});
