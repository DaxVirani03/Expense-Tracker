const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRecentExpenses,
  getPendingApprovals,
  getExpenseAnalytics,
  getDashboardNotifications,
} = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// All routes require authentication
router.use(protect);

// Get dashboard statistics
router.get('/stats', getDashboardStats);

// Get recent expenses
router.get('/recent-expenses', getRecentExpenses);

// Get pending approvals (Manager/Admin only)
router.get('/pending-approvals', authorize('manager', 'admin'), getPendingApprovals);

// Get expense analytics
router.get('/analytics', getExpenseAnalytics);

// Get dashboard notifications
router.get('/notifications', getDashboardNotifications);

module.exports = router;
