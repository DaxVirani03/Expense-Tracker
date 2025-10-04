const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/user.model');
const Company = require('../models/company.model');
const { generateAccessToken } = require('../utils/generateToken');
const logger = require('../config/logger');

/**
 * @desc    Register new admin and create company
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, country, companyName } = req.body;

  // Validate required fields
  if (!name || !email || !password || !country) {
    return res.status(400).json(
      new ApiResponse(400, null, 'Please provide all required fields')
    );
  }

  // Check if user already exists
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    return res.status(400).json(
      new ApiResponse(400, null, 'User with this email already exists')
    );
  }

  // Get country currency mapping
  const currencyMap = {
    'United States': 'USD',
    'United Kingdom': 'GBP',
    'India': 'INR',
    'Canada': 'CAD',
    'Australia': 'AUD',
    'Germany': 'EUR',
    'France': 'EUR',
    'Japan': 'JPY',
    'China': 'CNY',
    'Singapore': 'SGD',
  };

  const defaultCurrency = currencyMap[country] || 'USD';

  // Create company first
  const company = await Company.create({
    name: companyName || `${name}'s Company`,
    country,
    defaultCurrency,
    createdBy: null, // Will be updated after user creation
  });

  // Create admin user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: 'admin',
    companyId: company._id,
  });

  // Update company with createdBy
  company.createdBy = user._id;
  await company.save();

  // Generate JWT token
  const token = generateAccessToken(user._id);

  // Remove password from response
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyId: user.companyId,
    createdAt: user.createdAt,
  };

  logger.info(`New admin registered: ${email}`);

  res.status(201).json(
    new ApiResponse(
      201,
      { user: userResponse, company, token },
      'Admin registered successfully'
    )
  );
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json(
      new ApiResponse(400, null, 'Please provide email and password')
    );
  }

  // Find user and include password for comparison
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    return res.status(401).json(
      new ApiResponse(401, null, 'Invalid credentials')
    );
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json(
      new ApiResponse(401, null, 'Invalid credentials')
    );
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateAccessToken(user._id);

  // Get company details
  const company = await Company.findById(user.companyId);

  // Remove password from response
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyId: user.companyId,
    managerId: user.managerId,
    createdAt: user.createdAt,
  };

  logger.info(`User logged in: ${email}`);

  res.status(200).json(
    new ApiResponse(
      200,
      { user: userResponse, company, token },
      'Login successful'
    )
  );
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  // In JWT-based auth, logout is handled on client side by removing token
  // Optionally, implement token blacklist here
  
  logger.info(`User logged out: ${req.user.email}`);

  res.status(200).json(
    new ApiResponse(200, null, 'Logout successful')
  );
});

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('companyId', 'name country defaultCurrency');

  res.status(200).json(
    new ApiResponse(200, user, 'User profile fetched successfully')
  );
});

/**
 * @desc    Forgot password - send reset email
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json(
      new ApiResponse(400, null, 'Please provide email')
    );
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Don't reveal if user exists or not for security
    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        'If an account exists, a password reset link has been sent'
      )
    );
  }

  // Generate reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // TODO: Send email with reset link
  // For now, return token in response (only for development)
  logger.info(`Password reset requested for: ${email}`);

  res.status(200).json(
    new ApiResponse(
      200,
      { resetToken, resetUrl }, // Remove this in production
      'Password reset link sent to email'
    )
  );
});

/**
 * @desc    Reset password
 * @route   POST /api/v1/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json(
      new ApiResponse(400, null, 'Please provide new password')
    );
  }

  // Hash the token to compare with database
  const crypto = require('crypto');
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user with valid reset token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json(
      new ApiResponse(400, null, 'Invalid or expired reset token')
    );
  }

  // Set new password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Generate new token
  const authToken = generateAccessToken(user._id);

  logger.info(`Password reset successful for: ${user.email}`);

  res.status(200).json(
    new ApiResponse(
      200,
      { token: authToken },
      'Password reset successful'
    )
  );
});

/**
 * @desc    Change password
 * @route   PUT /api/v1/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json(
      new ApiResponse(400, null, 'Please provide current and new password')
    );
  }

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    return res.status(401).json(
      new ApiResponse(401, null, 'Current password is incorrect')
    );
  }

  // Set new password
  user.password = newPassword;
  await user.save();

  logger.info(`Password changed for: ${user.email}`);

  res.status(200).json(
    new ApiResponse(200, null, 'Password changed successfully')
  );
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
};
