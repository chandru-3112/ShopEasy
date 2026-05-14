const admin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ success: false, message: "Admin access only!" });
};

module.exports = { admin };