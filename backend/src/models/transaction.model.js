const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    expenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense',
      required: true,
      index: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ['reimbursement', 'advance', 'refund'],
      required: true,
      default: 'reimbursement',
    },
    method: {
      type: String,
      enum: ['bank_transfer', 'check', 'cash', 'payroll', 'digital_wallet'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentDetails: {
      bankName: String,
      accountNumber: String,
      accountHolderName: String,
      ifscCode: String,
      swiftCode: String,
      checkNumber: String,
    },
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    processedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    failureReason: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
transactionSchema.index({ employeeId: 1, status: 1 });
transactionSchema.index({ companyId: 1, status: 1, createdAt: -1 });

// Generate unique transaction ID before saving
transactionSchema.pre('save', async function (next) {
  if (!this.transactionId && this.isNew) {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    this.transactionId = `TXN-${timestamp}-${randomStr}`.toUpperCase();
  }
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;