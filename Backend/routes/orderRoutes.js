const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// User Routes
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);

// Admin Routes
router.get("/", protect, admin, getAllOrders);
router.put("/:id", protect, admin, updateOrderStatus);

module.exports = router;