const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticated = async (req, res, next) => {
  console.log("Cookies Received:", req.cookies); // 🧪 Debug
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    req.user = await User.findById(decoded.id).select("-password");
    console.log("Decoded User:", req.user); // 🧪 Debug
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};


exports.isAdmin = (req, res, next) => {
  if (req.user.role === 0) {
    return next(new ErrorResponse("Access denied. Admins only.", 403));
  }
  next();
};
