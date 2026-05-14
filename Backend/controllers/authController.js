const User = require("../models/User");

// Get Current User
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-googleId");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Logout
const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out!" });
  });
};

module.exports = { getMe, logout };