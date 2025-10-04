const express = require('express');
const router = express.Router();
const {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  approveExpense,
  rejectExpense,
  uploadReceipt,
} = require('../controllers/expense.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize, isManagerOrAbove } = require('../middlewares/role.middleware');

// All routes require authentication
router.use(protect);

// Get all expenses
router.get('/', getAllExpenses);

// Get expense by ID
router.get('/:id', getExpenseById);

// Create new expense
router.post('/', createExpense);

// Update expense
router.put('/:id', updateExpense);

// Delete expense
router.delete('/:id', deleteExpense);

// Approve expense (Manager/Admin only)
router.post('/:id/approve', isManagerOrAbove, approveExpense);

// Reject expense (Manager/Admin only)
router.post('/:id/reject', isManagerOrAbove, rejectExpense);

// Upload receipt
router.post('/:id/receipt', uploadReceipt);

module.exports = router;
