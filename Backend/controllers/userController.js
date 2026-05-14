const User = require("../models/User");

// Get All Users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-googleId").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Block / Unblock User (Admin)
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({
      success: true,
      message: user.isBlocked ? "User blocked!" : "User unblocked!",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true }
    ).select("-googleId");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllUsers, toggleBlockUser, updateProfile };