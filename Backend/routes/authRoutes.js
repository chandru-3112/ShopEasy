const express = require("express");
const router = express.Router();
const passport = require("passport");
const { getMe, logout } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Google Login
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Callback
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/`);
  }
);

// Get Current User
router.get("/me", protect, getMe);

// Logout
router.get("/logout", logout);

module.exports = router;