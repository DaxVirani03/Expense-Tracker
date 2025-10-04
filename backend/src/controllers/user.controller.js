const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/user.model');
const Company = require('../models/company.model');
const { authorize, isAdmin, isManagerOrAbove, canAccessResource } = require('../middlewares/role.middleware');
const logger = require('../config/logger');

/**
 * @desc    Get all users (Admin/Manager only)
 * @route   GET /api/v1/users
 * @access  Private (Admin/Manager)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, department, search } = req.query;
  const companyId = req.user.companyId;

  // Build filter object
  const filter = { companyId };
  
  if (role) filter.role = role;
  if (department) filter.department = department;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    populate: [
      { path: 'managerId', select: 'name email' },
      { path: 'companyId', select: 'name' }
    ]
  };

  const users = await User.paginate(filter, options);

  res.status(200).json(
    new ApiResponse(200, users, 'Users fetched successfully')
  );
});

/**
 * @desc    Get user by ID
 * @route   GET /api/v1/users/:id
 * @access  Private
 */
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const user = await User.findOne({ _id: id, companyId })
    .select('-password')
    .populate('managerId', 'name email')
    .populate('companyId', 'name country defaultCurrency');

  if (!user) {
    return res.status(404).json(
      new ApiResponse(404, null, 'User not found')
    );
  }

  res.status(200).json(
    new ApiResponse(200, user, 'User fetched successfully')
  );
});

/**
 * @desc    Create new user (Admin/Manager only)
 * @route   POST /api/v1/users
 * @access  Private (Admin/Manager)
 */
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, managerId, department, phone } = req.body;
  const companyId = req.user.companyId;

  // Validate required fields
  if (!name || !email || !password || !role) {
    return res.status(400).json(
      new ApiResponse(400, null, 'Please provide all required fields')
    );
  }

  // Check if user already exists
  const userExists = await User.findOne({ email: email.toLowerCase(), companyId });
  if (userExists) {
    return res.status(400).json(
      new ApiResponse(400, null, 'User with this email already exists')
    );
  }

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role,
    managerId: managerId || null,
    companyId,
    department,
    phone
  });

  // Remove password from response
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    managerId: user.managerId,
    companyId: user.companyId,
    department: user.department,
    phone: user.phone,
    isActive: user.isActive,
    createdAt: user.createdAt
  };

  logger.info(`New user created: ${email} by ${req.user.email}`);

  res.status(201).json(
    new ApiResponse(201, userResponse, 'User created successfully')
  );
});

/**
 * @desc    Update user
 * @route   PUT /api/v1/users/:id
 * @access  Private
 */
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, role, managerId, department, phone, isActive } = req.body;
  const companyId = req.user.companyId;

  const user = await User.findOne({ _id: id, companyId });

  if (!user) {
    return res.status(404).json(
      new ApiResponse(404, null, 'User not found')
    );
  }

  // Update user fields
  if (name) user.name = name;
  if (email) user.email = email.toLowerCase();
  if (role) user.role = role;
  if (managerId !== undefined) user.managerId = managerId;
  if (department !== undefined) user.department = department;
  if (phone !== undefined) user.phone = phone;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  logger.info(`User updated: ${user.email} by ${req.user.email}`);

  res.status(200).json(
    new ApiResponse(200, user, 'User updated successfully')
  );
});

/**
 * @desc    Delete user (Admin only)
 * @route   DELETE /api/v1/users/:id
 * @access  Private (Admin)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  // Prevent admin from deleting themselves
  if (id === req.user._id.toString()) {
    return res.status(400).json(
      new ApiResponse(400, null, 'You cannot delete your own account')
    );
  }

  const user = await User.findOne({ _id: id, companyId });

  if (!user) {
    return res.status(404).json(
      new ApiResponse(404, null, 'User not found')
    );
  }

  await User.findByIdAndDelete(id);

  logger.info(`User deleted: ${user.email} by ${req.user.email}`);

  res.status(200).json(
    new ApiResponse(200, null, 'User deleted successfully')
  );
});

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, department } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json(
      new ApiResponse(404, null, 'User not found')
    );
  }

  // Update profile fields
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (department !== undefined) user.department = department;

  await user.save();

  logger.info(`Profile updated: ${user.email}`);

  res.status(200).json(
    new ApiResponse(200, user, 'Profile updated successfully')
  );
});

/**
 * @desc    Get user expenses
 * @route   GET /api/v1/users/:id/expenses
 * @access  Private
 */
const getUserExpenses = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10, status, category, dateFrom, dateTo } = req.query;
  const companyId = req.user.companyId;

  // Check if user can access this data
  if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
    return res.status(403).json(
      new ApiResponse(403, null, 'You can only view your own expenses')
    );
  }

  // Build filter object
  const filter = { employeeId: id, companyId };
  
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (dateFrom || dateTo) {
    filter.date = {};
    if (dateFrom) filter.date.$gte = new Date(dateFrom);
    if (dateTo) filter.date.$lte = new Date(dateTo);
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    populate: [
      { path: 'employeeId', select: 'name email' },
      { path: 'approvers', select: 'name email' }
    ]
  };

  const Expense = require('../models/expense.model');
  const expenses = await Expense.paginate(filter, options);

  res.status(200).json(
    new ApiResponse(200, expenses, 'User expenses fetched successfully')
  );
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  getUserExpenses,
};
