const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
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
      required: [true, 'Please provide an amount'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      required: [true, 'Please provide a currency'],
      default: 'USD',
      uppercase: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide an expense date'],
      default: Date.now,
    },
    receiptUrl: {
      type: String,
      default: null,
    },
    receiptPublicId: {
      type: String,
      default: null,
    },
    ocrData: {
      extractedText: String,
      extractedAmount: Number,
      extractedDate: String,
      extractedVendor: String,
      processed: {
        type: Boolean,
        default: false,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'reimbursed'],
      default: 'pending',
      index: true,
    },
    approvers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    approvalHistory: [
      {
        approverId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        decision: {
          type: String,
          enum: ['approved', 'rejected', 'pending'],
        },
        comment: {
          type: String,
          maxlength: 500,
        },
        decidedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    currentApproverIndex: {
      type: Number,
      default: 0,
    },
    finalDecision: {
      type: String,
      enum: ['approved', 'rejected', 'pending'],
      default: 'pending',
    },
    finalDecisionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    finalDecisionAt: {
      type: Date,
      default: null,
    },
    reimbursementDate: {
      type: Date,
      default: null,
    },
    reimbursementMethod: {
      type: String,
      enum: ['bank_transfer', 'check', 'cash', 'payroll'],
      default: null,
    },
    tags: [String],
    notes: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
expenseSchema.index({ employeeId: 1, status: 1 });
expenseSchema.index({ companyId: 1, status: 1 });
expenseSchema.index({ status: 1, date: -1 });
expenseSchema.index({ createdAt: -1 });

// Virtual for checking if expense is awaiting approval
expenseSchema.virtual('isAwaitingApproval').get(function () {
  return this.status === 'pending' && this.currentApproverIndex < this.approvers.length;
});

// Method to get current approver
expenseSchema.methods.getCurrentApprover = function () {
  if (this.currentApproverIndex < this.approvers.length) {
    return this.approvers[this.currentApproverIndex];
  }
  return null;
};

// Method to advance to next approver
expenseSchema.methods.advanceToNextApprover = function () {
  if (this.currentApproverIndex < this.approvers.length - 1) {
    this.currentApproverIndex++;
    return true;
  }
  return false;
};

// Ensure virtuals are included in JSON
expenseSchema.set('toJSON', { virtuals: true });
expenseSchema.set('toObject', { virtuals: true });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;