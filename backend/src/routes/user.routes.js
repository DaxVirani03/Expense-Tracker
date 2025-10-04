const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  getUserExpenses,
} = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize, isAdmin, isManagerOrAbove } = require('../middlewares/role.middleware');

// All routes require authentication
router.use(protect);

// Get all users (Admin/Manager only)
router.get('/', authorize('admin', 'manager'), getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Create new user (Admin/Manager only)
router.post('/', authorize('admin', 'manager'), createUser);

// Update user
router.put('/:id', updateUser);

// Delete user (Admin only)
router.delete('/:id', isAdmin, deleteUser);

// Update user profile
router.put('/profile', updateProfile);

// Get user expenses
router.get('/:id/expenses', getUserExpenses);

module.exports = router;
