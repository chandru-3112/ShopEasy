const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  toggleBlockUser,
  updateProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// User Routes
router.put("/profile", protect, updateProfile);

// Admin Routes
router.get("/", protect, admin, getAllUsers);
router.put("/block/:id", protect, admin, toggleBlockUser);

module.exports = router;