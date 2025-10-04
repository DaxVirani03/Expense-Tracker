const express = require('express');
const router = express.Router();
const {
  getCompany,
  updateCompany,
  getCompanyStats,
  getCompanyUsers,
  updateSubscription,
  getCompanyDepartments,
  getCompanyCategories,
  updateCompanyCategories,
} = require('../controllers/company.controller');
const { protect } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

// All routes require authentication
router.use(protect);

// Get company details
router.get('/', getCompany);

// Update company settings (Admin only)
router.put('/', isAdmin, updateCompany);

// Get company statistics (Admin only)
router.get('/stats', isAdmin, getCompanyStats);

// Get company users (Admin only)
router.get('/users', isAdmin, getCompanyUsers);

// Update subscription (Admin only)
router.put('/subscription', isAdmin, updateSubscription);

// Get company departments
router.get('/departments', getCompanyDepartments);

// Get company categories
router.get('/categories', getCompanyCategories);

// Update company categories (Admin only)
router.put('/categories', isAdmin, updateCompanyCategories);

module.exports = router;
