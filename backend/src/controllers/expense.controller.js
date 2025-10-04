const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const Expense = require('../models/expense.model');
const User = require('../models/user.model');
const Company = require('../models/company.model');
const { authorize, isManagerOrAbove } = require('../middlewares/role.middleware');
const logger = require('../config/logger');

/**
 * @desc    Get all expenses with filtering
 * @route   GET /api/v1/expenses
 * @access  Private
 */
const getAllExpenses = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    status, 
    category, 
    dateFrom, 
    dateTo, 
    userId, 
    amountMin, 
    amountMax 
  } = req.query;
  const companyId = req.user.companyId;

  // Build filter object
  const filter = { companyId };
  
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (userId) filter.employeeId = userId;
  if (dateFrom || dateTo) {
    filter.date = {};
    if (dateFrom) filter.date.$gte = new Date(dateFrom);
    if (dateTo) filter.date.$lte = new Date(dateTo);
  }
  if (amountMin || amountMax) {
    filter.amount = {};
    if (amountMin) filter.amount.$gte = parseFloat(amountMin);
    if (amountMax) filter.amount.$lte = parseFloat(amountMax);
  }

  // Role-based filtering
  if (req.user.role === 'employee') {
    filter.employeeId = req.user._id;
  } else if (req.user.role === 'manager') {
    // Managers can see their team's expenses
    const teamMembers = await User.find({ 
      managerId: req.user._id, 
      companyId 
    }).select('_id');
    const teamMemberIds = teamMembers.map(member => member._id);
    filter.employeeId = { $in: [req.user._id, ...teamMemberIds] };
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    populate: [
      { path: 'employeeId', select: 'name email department' },
      { path: 'approvers', select: 'name email' },
      { path: 'finalDecisionBy', select: 'name email' }
    ]
  };

  const expenses = await Expense.paginate(filter, options);

  res.status(200).json(
    new ApiResponse(200, expenses, 'Expenses fetched successfully')
  );
});

/**
 * @desc    Get expense by ID
 * @route   GET /api/v1/expenses/:id
 * @access  Private
 */
const getExpenseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const expense = await Expense.findOne({ _id: id, companyId })
    .populate('employeeId', 'name email department')
    .populate('approvers', 'name email')
    .populate('finalDecisionBy', 'name email')
    .populate('approvalHistory.approverId', 'name email');

  if (!expense) {
    return res.status(404).json(
      new ApiResponse(404, null, 'Expense not found')
    );
  }

  // Check access permissions
  if (req.user.role === 'employee' && expense.employeeId._id.toString() !== req.user._id.toString()) {
    return res.status(403).json(
      new ApiResponse(403, null, 'You can only view your own expenses')
    );
  }

  res.status(200).json(
    new ApiResponse(200, expense, 'Expense fetched successfully')
  );
});

/**
 * @desc    Create new expense
 * @route   POST /api/v1/expenses
 * @access  Private
 */
const createExpense = asyncHandler(async (req, res) => {
  const { 
    amount, 
    currency, 
    category, 
    description, 
    date, 
    receiptUrl, 
    tags, 
    notes 
  } = req.body;
  const companyId = req.user.companyId;

  // Validate required fields
  if (!amount || !category || !description) {
    return res.status(400).json(
      new ApiResponse(400, null, 'Please provide amount, category, and description')
    );
  }

  // Get company settings
  const company = await Company.findById(companyId);
  if (!company) {
    return res.status(404).json(
      new ApiResponse(404, null, 'Company not found')
    );
  }

  // Check if amount exceeds company limit
  if (amount > company.settings.maxExpenseAmount) {
    return res.status(400).json(
      new ApiResponse(400, null, `Expense amount exceeds maximum limit of ${company.settings.maxExpenseAmount}`)
    );
  }

  // Create expense
  const expense = await Expense.create({
    employeeId: req.user._id,
    companyId,
    amount: parseFloat(amount),
    currency: currency || company.defaultCurrency,
    category,
    description,
    date: date ? new Date(date) : new Date(),
    receiptUrl,
    tags: tags || [],
    notes
  });

  // Set up approval workflow
  await setupApprovalWorkflow(expense, company);

  logger.info(`New expense created: ${expense._id} by ${req.user.email}`);

  res.status(201).json(
    new ApiResponse(201, expense, 'Expense created successfully')
  );
});

/**
 * @desc    Update expense
 * @route   PUT /api/v1/expenses/:id
 * @access  Private
 */
const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    amount, 
    currency, 
    category, 
    description, 
    date, 
    receiptUrl, 
    tags, 
    notes 
  } = req.body;
  const companyId = req.user.companyId;

  const expense = await Expense.findOne({ _id: id, companyId });

  if (!expense) {
    return res.status(404).json(
      new ApiResponse(404, null, 'Expense not found')
    );
  }

  // Check permissions
  if (req.user.role === 'employee' && expense.employeeId.toString() !== req.user._id.toString()) {
    return res.status(403).json(
      new ApiResponse(403, null, 'You can only update your own expenses')
    );
  }

  // Check if expense can be updated
  if (expense.status !== 'pending') {
    return res.status(400).json(
      new ApiResponse(400, null, 'Only pending expenses can be updated')
    );
  }

  // Update expense fields
  if (amount !== undefined) expense.amount = parseFloat(amount);
  if (currency) expense.currency = currency;
  if (category) expense.category = category;
  if (description) expense.description = description;
  if (date) expense.date = new Date(date);
  if (receiptUrl !== undefined) expense.receiptUrl = receiptUrl;
  if (tags) expense.tags = tags;
  if (notes !== undefined) expense.notes = notes;

  await expense.save();

  logger.info(`Expense updated: ${expense._id} by ${req.user.email}`);

  res.status(200).json(
    new ApiResponse(200, expense, 'Expense updated successfully')
  );
});

/**
 * @desc    Delete expense
 * @route   DELETE /api/v1/expenses/:id
 * @access  Private
 */
const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const expense = await Expense.findOne({ _id: id, companyId });

  if (!expense) {
    return res.status(404).json(
      new ApiResponse(404, null, 'Expense not found')
    );
  }

  // Check permissions
  if (req.user.role === 'employee' && expense.employeeId.toString() !== req.user._id.toString()) {
    return res.status(403).json(
      new ApiResponse(403, null, 'You can only delete your own expenses')
    );
  }

  // Check if expense can be deleted
  if (expense.status !== 'pending') {
    return res.status(400).json(
      new ApiResponse(400, null, 'Only pending expenses can be deleted')
    );
  }

  await Expense.findByIdAndDelete(id);

  logger.info(`Expense deleted: ${id} by ${req.user.email}`);

  res.status(200).json(
    new ApiResponse(200, null, 'Expense deleted successfully')
  );
});

/**
 * @desc    Approve expense (Manager/Admin only)
 * @route   POST /api/v1/expenses/:id/approve
 * @access  Private (Manager/Admin)
 */
const approveExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const companyId = req.user.companyId;

  const expense = await Expense.findOne({ _id: id, companyId });

  if (!expense) {
    return res.status(404).json(
      new ApiResponse(404, null, 'Expense not found')
    );
  }

  // Check if user can approve this expense
  if (!canUserApproveExpense(expense, req.user)) {
    return res.status(403).json(
      new ApiResponse(403, null, 'You are not authorized to approve this expense')
    );
  }

  // Add approval to history
  expense.approvalHistory.push({
    approverId: req.user._id,
    decision: 'approved',
    comment: comment || '',
    decidedAt: new Date()
  });

  // Check if all approvers have approved
  const allApproved = checkAllApprovals(expense);
  
  if (allApproved) {
    expense.status = 'approved';
    expense.finalDecision = 'approved';
    expense.finalDecisionBy = req.user._id;
    expense.finalDecisionAt = new Date();
  } else {
    // Move to next approver
    expense.advanceToNextApprover();
  }

  await expense.save();

  logger.info(`Expense approved: ${expense._id} by ${req.user.email}`);

  res.status(200).json(
    new ApiResponse(200, expense, 'Expense approved successfully')
  );
});

/**
 * @desc    Reject expense (Manager/Admin only)
 * @route   POST /api/v1/expenses/:id/reject
 * @access  Private (Manager/Admin)
 */
const rejectExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const companyId = req.user.companyId;

  const expense = await Expense.findOne({ _id: id, companyId });

  if (!expense) {
    return res.status(404).json(
      new ApiResponse(404, null, 'Expense not found')
    );
  }

  // Check if user can reject this expense
  if (!canUserApproveExpense(expense, req.user)) {
    return res.status(403).json(
      new ApiResponse(403, null, 'You are not authorized to reject this expense')
    );
  }

  // Add rejection to history
  expense.approvalHistory.push({
    approverId: req.user._id,
    decision: 'rejected',
    comment: comment || '',
    decidedAt: new Date()
  });

  // Set expense as rejected
  expense.status = 'rejected';
  expense.finalDecision = 'rejected';
  expense.finalDecisionBy = req.user._id;
  expense.finalDecisionAt = new Date();

  await expense.save();

  logger.info(`Expense rejected: ${expense._id} by ${req.user.email}`);

  res.status(200).json(
    new ApiResponse(200, expense, 'Expense rejected successfully')
  );
});

/**
 * @desc    Upload receipt for expense
 * @route   POST /api/v1/expenses/:id/receipt
 * @access  Private
 */
const uploadReceipt = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const expense = await Expense.findOne({ _id: id, companyId });

  if (!expense) {
    return res.status(404).json(
      new ApiResponse(404, null, 'Expense not found')
    );
  }

  // Check permissions
  if (req.user.role === 'employee' && expense.employeeId.toString() !== req.user._id.toString()) {
    return res.status(403).json(
      new ApiResponse(403, null, 'You can only upload receipts for your own expenses')
    );
  }

  // TODO: Implement file upload logic with Cloudinary
  // For now, just return success
  res.status(200).json(
    new ApiResponse(200, null, 'Receipt upload functionality will be implemented')
  );
});

// Helper Functions

/**
 * Setup approval workflow for expense
 */
const setupApprovalWorkflow = async (expense, company) => {
  // For now, use simple manager approval
  // TODO: Implement complex approval rules
  const managers = await User.find({ 
    role: 'manager', 
    companyId: company._id 
  }).limit(1);
  
  if (managers.length > 0) {
    expense.approvers = [managers[0]._id];
  }
  
  await expense.save();
};

/**
 * Check if user can approve expense
 */
const canUserApproveExpense = (expense, user) => {
  // Admin can approve any expense
  if (user.role === 'admin') return true;
  
  // Manager can approve if they are in the approvers list
  if (user.role === 'manager' && expense.approvers.includes(user._id)) {
    return true;
  }
  
  return false;
};

/**
 * Check if all approvals are complete
 */
const checkAllApprovals = (expense) => {
  const approvals = expense.approvalHistory.filter(h => h.decision === 'approved');
  return approvals.length >= expense.approvers.length;
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  approveExpense,
  rejectExpense,
  uploadReceipt,
};
