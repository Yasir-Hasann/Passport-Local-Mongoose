// module imports
const asyncHandler = require('express-async-handler');

// file imports
const UserModel = require('../models/user');
const ErrorResponse = require('../utils/error-response');

// @desc   Login User
// @route  POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});

// @desc   Register User
// @route  POST /api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
  const user = await UserModel.register(new UserModel({ ...req.body, username: req.body.email }), req.body.password);
  if (!user) return next(new ErrorResponse('Something went wrong', 500));

  const token = user.getSignedJwtToken();
  res.status(200).json({ success: true, token });
});

// @desc   Change Password
// @route  POST /api/v1/auth/change-pass
// @access Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { newPassword } = req.body;

  await user.setPassword(newPassword);
  await user.save();
  res.status(200).json({ success: true, message: 'Password changed successfully!' });
});

// @desc   Find User
// @route  POST /api/v1/auth/user
// @access Public
exports.findUser = asyncHandler(async (req, res, next) => {
  const { username } = req.body;
  const user = await UserModel.findByUsername(username);
  if (!user) return next(new ErrorResponse('User not found', 404));
  res.status(200).json(user);
});

// @desc   Get user
// @route  GET /api/v1/auth/whoami
// @access Private
exports.whoami = asyncHandler(async (req, res, next) => {
  const { createdAt, updatedAt, __v, ...rest } = req.user._doc;
  res.status(200).json(rest);
});
