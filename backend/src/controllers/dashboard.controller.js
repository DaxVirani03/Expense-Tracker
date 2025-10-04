const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const Expense = require('../models/expense.model');
const User = require('../models/user.model');
const Company = require('../models/company.model');
const logger = require('../config/logger');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/v1/dashboard/stats
 * @access  Private
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;
  const userId = req.user._id;
  const userRole = req.user.role;

  // Base filter for expenses
  let expenseFilter = { companyId };
  
  // Role-based filtering
  if (userRole === 'employee') {
    expenseFilter.employeeId = userId;
  } else if (userRole === 'manager') {
    // Get team members
    const teamMembers = await User.find({ 
      managerId: userId, 
      companyId 
    }).select('_id');
    const teamMemberIds = teamMembers.map(member => member._id);
    expenseFilter.employeeId = { $in: [userId, ...teamMemberIds] };
  }

  // Get expense statistics
  const expenseStats = await Expense.aggregate([
    { $match: expenseFilter },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  // Get monthly expense trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyTrend = await Expense.aggregate([
    { 
      $match: { 
        ...expenseFilter, 
        date: { $gte: sixMonthsAgo } 
      } 
    },
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
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Get category breakdown
  const categoryBreakdown = await Expense.aggregate([
    { $match: expenseFilter },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    },
    { $sort: { totalAmount: -1 } },
    { $limit: 10 }
  ]);

  // Get top spenders (for managers and admins)
  let topSpenders = [];
  if (userRole !== 'employee') {
    topSpenders = await Expense.aggregate([
      { $match: expenseFilter },
      {
        $group: {
          _id: '$employeeId',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          count: 1,
          totalAmount: 1
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 5 }
    ]);
  }

  // Calculate totals
  const totalExpenses = expenseStats.reduce((sum, stat) => sum + stat.count, 0);
  const totalAmount = expenseStats.reduce((sum, stat) => sum + stat.totalAmount, 0);
  const pendingCount = expenseStats.find(stat => stat._id === 'pending')?.count || 0;
  const approvedCount = expenseStats.find(stat => stat._id === 'approved')?.count || 0;
  const rejectedCount = expenseStats.find(stat => stat._id === 'rejected')?.count || 0;

  const stats = {
    summary: {
      totalExpenses,
      totalAmount,
      pendingCount,
      approvedCount,
      rejectedCount
    },
    monthlyTrend,
    categoryBreakdown,
    topSpenders
  };

  res.status(200).json(
    new ApiResponse(200, stats, 'Dashboard statistics fetched successfully')
  );
});

/**
 * @desc    Get recent expenses
 * @route   GET /api/v1/dashboard/recent-expenses
 * @access  Private
 */
const getRecentExpenses = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;
  const userId = req.user._id;
  const userRole = req.user.role;
  const { limit = 10 } = req.query;

  // Base filter for expenses
  let expenseFilter = { companyId };
  
  // Role-based filtering
  if (userRole === 'employee') {
    expenseFilter.employeeId = userId;
  } else if (userRole === 'manager') {
    // Get team members
    const teamMembers = await User.find({ 
      managerId: userId, 
      companyId 
    }).select('_id');
    const teamMemberIds = teamMembers.map(member => member._id);
    expenseFilter.employeeId = { $in: [userId, ...teamMemberIds] };
  }

  const expenses = await Expense.find(expenseFilter)
    .populate('employeeId', 'name email')
    .populate('approvers', 'name email')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  res.status(200).json(
    new ApiResponse(200, expenses, 'Recent expenses fetched successfully')
  );
});

/**
 * @desc    Get pending approvals (Manager/Admin only)
 * @route   GET /api/v1/dashboard/pending-approvals
 * @access  Private (Manager/Admin)
 */
const getPendingApprovals = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;
  const userId = req.user._id;
  const userRole = req.user.role;

  if (userRole === 'employee') {
    return res.status(403).json(
      new ApiResponse(403, null, 'Access denied')
    );
  }

  // Get expenses pending approval
  let expenseFilter = { 
    companyId, 
    status: 'pending' 
  };

  if (userRole === 'manager') {
    // Get team members
    const teamMembers = await User.find({ 
      managerId: userId, 
      companyId 
    }).select('_id');
    const teamMemberIds = teamMembers.map(member => member._id);
    expenseFilter.employeeId = { $in: [userId, ...teamMemberIds] };
  }

  const pendingExpenses = await Expense.find(expenseFilter)
    .populate('employeeId', 'name email department')
    .populate('approvers', 'name email')
    .sort({ createdAt: -1 });

  // Filter expenses that need this user's approval
  const userApprovals = pendingExpenses.filter(expense => {
    if (userRole === 'admin') return true;
    return expense.approvers.includes(userId);
  });

  res.status(200).json(
    new ApiResponse(200, userApprovals, 'Pending approvals fetched successfully')
  );
});

/**
 * @desc    Get expense analytics
 * @route   GET /api/v1/dashboard/analytics
 * @access  Private
 */
const getExpenseAnalytics = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;
  const userId = req.user._id;
  const userRole = req.user.role;
  const { period = '6months' } = req.query;

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  
  switch (period) {
    case '1month':
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case '3months':
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    case '6months':
      startDate.setMonth(endDate.getMonth() - 6);
      break;
    case '1year':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(endDate.getMonth() - 6);
  }

  // Base filter for expenses
  let expenseFilter = { 
    companyId,
    date: { $gte: startDate, $lte: endDate }
  };
  
  // Role-based filtering
  if (userRole === 'employee') {
    expenseFilter.employeeId = userId;
  } else if (userRole === 'manager') {
    // Get team members
    const teamMembers = await User.find({ 
      managerId: userId, 
      companyId 
    }).select('_id');
    const teamMemberIds = teamMembers.map(member => member._id);
    expenseFilter.employeeId = { $in: [userId, ...teamMemberIds] };
  }

  // Get monthly breakdown
  const monthlyBreakdown = await Expense.aggregate([
    { $match: expenseFilter },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        avgAmount: { $avg: '$amount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Get category breakdown
  const categoryBreakdown = await Expense.aggregate([
    { $match: expenseFilter },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        avgAmount: { $avg: '$amount' }
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);

  // Get status breakdown
  const statusBreakdown = await Expense.aggregate([
    { $match: expenseFilter },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  // Get approval time analytics (for managers and admins)
  let approvalTimeAnalytics = [];
  if (userRole !== 'employee') {
    approvalTimeAnalytics = await Expense.aggregate([
      { 
        $match: { 
          ...expenseFilter, 
          status: { $in: ['approved', 'rejected'] },
          'approvalHistory.0': { $exists: true }
        } 
      },
      {
        $project: {
          createdAt: 1,
          finalDecisionAt: 1,
          approvalTime: {
            $subtract: ['$finalDecisionAt', '$createdAt']
          }
        }
      },
      {
        $group: {
          _id: null,
          avgApprovalTime: { $avg: '$approvalTime' },
          minApprovalTime: { $min: '$approvalTime' },
          maxApprovalTime: { $max: '$approvalTime' }
        }
      }
    ]);
  }

  const analytics = {
    period,
    dateRange: { startDate, endDate },
    monthlyBreakdown,
    categoryBreakdown,
    statusBreakdown,
    approvalTimeAnalytics: approvalTimeAnalytics[0] || null
  };

  res.status(200).json(
    new ApiResponse(200, analytics, 'Expense analytics fetched successfully')
  );
});

/**
 * @desc    Get dashboard notifications
 * @route   GET /api/v1/dashboard/notifications
 * @access  Private
 */
const getDashboardNotifications = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;
  const userId = req.user._id;
  const userRole = req.user.role;

  const notifications = [];

  // Get pending approvals count
  if (userRole !== 'employee') {
    let expenseFilter = { 
      companyId, 
      status: 'pending' 
    };

    if (userRole === 'manager') {
      const teamMembers = await User.find({ 
        managerId: userId, 
        companyId 
      }).select('_id');
      const teamMemberIds = teamMembers.map(member => member._id);
      expenseFilter.employeeId = { $in: [userId, ...teamMemberIds] };
    }

    const pendingCount = await Expense.countDocuments(expenseFilter);
    
    if (pendingCount > 0) {
      notifications.push({
        type: 'pending_approvals',
        message: `You have ${pendingCount} pending expense approvals`,
        count: pendingCount,
        priority: 'high'
      });
    }
  }

  // Get user's pending expenses
  const userPendingCount = await Expense.countDocuments({
    companyId,
    employeeId: userId,
    status: 'pending'
  });

  if (userPendingCount > 0) {
    notifications.push({
      type: 'pending_expenses',
      message: `You have ${userPendingCount} pending expenses`,
      count: userPendingCount,
      priority: 'medium'
    });
  }

  // Get recent approvals (for employees)
  if (userRole === 'employee') {
    const recentApprovals = await Expense.find({
      companyId,
      employeeId: userId,
      status: { $in: ['approved', 'rejected'] },
      finalDecisionAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    })
    .populate('finalDecisionBy', 'name')
    .sort({ finalDecisionAt: -1 })
    .limit(5);

    if (recentApprovals.length > 0) {
      notifications.push({
        type: 'recent_approvals',
        message: `You have ${recentApprovals.length} recently processed expenses`,
        data: recentApprovals,
        priority: 'low'
      });
    }
  }

  res.status(200).json(
    new ApiResponse(200, notifications, 'Dashboard notifications fetched successfully')
  );
});

module.exports = {
  getDashboardStats,
  getRecentExpenses,
  getPendingApprovals,
  getExpenseAnalytics,
  getDashboardNotifications,
};
