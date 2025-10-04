const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const Company = require('../models/company.model');
const User = require('../models/user.model');
const { isAdmin } = require('../middlewares/role.middleware');
const logger = require('../config/logger');

/**
 * @desc    Get company details
 * @route   GET /api/v1/company
 * @access  Private
 */
const getCompany = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;

  const company = await Company.findById(companyId)
    .populate('createdBy', 'name email');

  if (!company) {
    return res.status(404).json(
      new ApiResponse(404, null, 'Company not found')
    );
  }

  res.status(200).json(
    new ApiResponse(200, company, 'Company details fetched successfully')
  );
});

/**
 * @desc    Update company settings (Admin only)
 * @route   PUT /api/v1/company
 * @access  Private (Admin)
 */
const updateCompany = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;
  const { 
    name, 
    logo, 
    address, 
    settings 
  } = req.body;

  const company = await Company.findById(companyId);

  if (!company) {
    return res.status(404).json(
      new ApiResponse(404, null, 'Company not found')
    );
  }

  // Update company fields
  if (name) company.name = name;
  if (logo !== undefined) company.logo = logo;
  if (address) company.address = address;
  if (settings) {
    company.settings = { ...company.settings, ...settings };
  }

  await company.save();

  logger.info(`Company updated: ${company.name} by ${req.user.email}`);

  res.status(200).json(
    new ApiResponse(200, company, 'Company updated successfully')
  );
});

/**
 * @desc    Get company statistics
 * @route   GET /api/v1/company/stats
 * @access  Private (Admin)
 */
const getCompanyStats = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;

  // Get user count by role
  const userStats = await User.aggregate([
    { $match: { companyId } },
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);

  // Get expense statistics
  const Expense = require('../models/expense.model');
  const expenseStats = await Expense.aggregate([
    { $match: { companyId } },
    { 
      $group: { 
        _id: '$status', 
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      } 
    }
  ]);

  // Get monthly expense trend
  const monthlyTrend = await Expense.aggregate([
    { $match: { companyId } },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 }
  ]);

  const stats = {
    users: userStats,
    expenses: expenseStats,
    monthlyTrend
  };

  res.status(200).json(
    new ApiResponse(200, stats, 'Company statistics fetched successfully')
  );
});

/**
 * @desc    Get company users
 * @route   GET /api/v1/company/users
 * @access  Private (Admin)
 */
const getCompanyUsers = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;
  const { page = 1, limit = 10, role, department, search } = req.query;

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
      { path: 'managerId', select: 'name email' }
    ]
  };

  const users = await User.paginate(filter, options);

  res.status(200).json(
    new ApiResponse(200, users, 'Company users fetched successfully')
  );
});

/**
 * @desc    Update company subscription
 * @route   PUT /api/v1/company/subscription
 * @access  Private (Admin)
 */
const updateSubscription = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;
  const { plan, startDate, endDate } = req.body;

  const company = await Company.findById(companyId);

  if (!company) {
    return res.status(404).json(
      new ApiResponse(404, null, 'Company not found')
    );
  }

  // Update subscription
  company.subscription.plan = plan;
  if (startDate) company.subscription.startDate = new Date(startDate);
  if (endDate) company.subscription.endDate = new Date(endDate);
  company.subscription.isActive = true;

  await company.save();

  logger.info(`Company subscription updated: ${company.name} to ${plan} by ${req.user.email}`);

  res.status(200).json(
    new ApiResponse(200, company.subscription, 'Subscription updated successfully')
  );
});

/**
 * @desc    Get company departments
 * @route   GET /api/v1/company/departments
 * @access  Private
 */
const getCompanyDepartments = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;

  // Get unique departments from users
  const departments = await User.distinct('department', { 
    companyId, 
    department: { $exists: true, $ne: null } 
  });

  const departmentStats = await User.aggregate([
    { $match: { companyId, department: { $exists: true, $ne: null } } },
    { $group: { _id: '$department', count: { $sum: 1 } } }
  ]);

  res.status(200).json(
    new ApiResponse(200, { departments, stats: departmentStats }, 'Company departments fetched successfully')
  );
});

/**
 * @desc    Get company expense categories
 * @route   GET /api/v1/company/categories
 * @access  Private
 */
const getCompanyCategories = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;

  const company = await Company.findById(companyId);

  if (!company) {
    return res.status(404).json(
      new ApiResponse(404, null, 'Company not found')
    );
  }

  res.status(200).json(
    new ApiResponse(200, company.settings.expenseCategories, 'Company categories fetched successfully')
  );
});

/**
 * @desc    Update company categories
 * @route   PUT /api/v1/company/categories
 * @access  Private (Admin)
 */
const updateCompanyCategories = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;
  const { categories } = req.body;

  if (!Array.isArray(categories)) {
    return res.status(400).json(
      new ApiResponse(400, null, 'Categories must be an array')
    );
  }

  const company = await Company.findById(companyId);

  if (!company) {
    return res.status(404).json(
      new ApiResponse(404, null, 'Company not found')
    );
  }

  company.settings.expenseCategories = categories;
  await company.save();

  logger.info(`Company categories updated: ${company.name} by ${req.user.email}`);

  res.status(200).json(
    new ApiResponse(200, categories, 'Company categories updated successfully')
  );
});

module.exports = {
  getCompany,
  updateCompany,
  getCompanyStats,
  getCompanyUsers,
  updateSubscription,
  getCompanyDepartments,
  getCompanyCategories,
  updateCompanyCategories,
};
