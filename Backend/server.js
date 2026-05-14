const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

dotenv.config();

// Passport config
require("./config/passport");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "ShopEasy Backend Running! 🚀" });
});

// MongoDB Connect + Server Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected!");
    app.listen(process.env.PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
  });