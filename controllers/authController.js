const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');

exports.signup = async (req, res, next) => {
  const { email } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) {
    return next(new ErrorResponse("Email already Registered", 400));
  }

  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return next(new ErrorResponse("Please add an email", 403));
    }

    if (!password) {
      return next(new ErrorResponse("Please add a password", 403));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 400));
    }

    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return next(new ErrorResponse("Invalid credentials", 400));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

const sendTokenResponse = async (user, codeStatus, res) => {
  const token = await user.getJwtToken();

  res
  res
  .status(codeStatus)
  .cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",  // 🔥 Required for HTTPS
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",  // 🔥 Required for cross-origin cookie
    maxAge: 60 * 60 * 1000,
  })

    .json({ success: true, token, user });
};

exports.logout = (req, res, next) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};
