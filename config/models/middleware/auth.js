const jwt = require("jsonwebtoken");
const User = require("../User");

// JWT Authentication Middleware
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "لا يوجد رمز مصادقة، الوصول مرفوض", // No authentication token, access denied
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findByPk(decoded.id);

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: "المستخدم غير موجود أو غير نشط", // User not found or inactive
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;
    req.userRole = user.role;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "رمز غير صالح أو منتهي الصلاحية", // Invalid or expired token
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "غير مصرح بالوصول", // Unauthorized
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "ليس لديك صلاحية للقيام بهذا الإجراء", // You don't have permission
      });
    }

    next();
  };
};

module.exports = { authMiddleware, authorize };
