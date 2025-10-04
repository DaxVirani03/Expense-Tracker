const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const { ERROR_MESSAGES } = require('../utils/constants');
const User = require('../models/user.model');

/**
 * Protect routes - Verify JWT token
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json(ApiResponse.unauthorized(ERROR_MESSAGES.UNAUTHORIZED));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res
        .status(401)
        .json(ApiResponse.unauthorized(ERROR_MESSAGES.USER_NOT_FOUND));
    }

    if (!req.user.isActive) {
      return res
        .status(401)
        .json(ApiResponse.unauthorized('Your account has been deactivated'));
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json(ApiResponse.unauthorized(ERROR_MESSAGES.TOKEN_INVALID));
  }
});

/**
 * Verify company access
 */
const verifyCompanyAccess = asyncHandler(async (req, res, next) => {
  const companyId = req.params.companyId || req.body.companyId || req.query.companyId;

  if (companyId && req.user.companyId.toString() !== companyId.toString()) {
    return res
      .status(403)
      .json(ApiResponse.forbidden('You do not have access to this company'));
  }

  next();
});

module.exports = {
  protect,
  verifyCompanyAccess,
};