const mongoose = require('mongoose');

const approvalRuleSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a rule name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: ['sequence', 'percentage', 'specific', 'hybrid', 'amount-based'],
      default: 'sequence',
      required: true,
    },
    // For sequence type: define order of approvers
    approverSequence: [
      {
        role: {
          type: String,
          enum: ['manager', 'admin', 'finance', 'director'],
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        level: Number,
      },
    ],
    // For percentage type
    percentageThreshold: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    // For specific approver type
    specificApproverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // For amount-based rules
    amountThresholds: [
      {
        minAmount: {
          type: Number,
          default: 0,
        },
        maxAmount: {
          type: Number,
          default: null,
        },
        approvers: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
        requiresAllApprovals: {
          type: Boolean,
          default: true,
        },
      },
    ],
    // Conditions for rule application
    conditions: {
      categories: {
        type: [String],
        default: [],
      },
      departments: {
        type: [String],
        default: [],
      },
      minAmount: {
        type: Number,
        default: null,
      },
      maxAmount: {
        type: Number,
        default: null,
      },
    },
    priority: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    autoApprove: {
      enabled: {
        type: Boolean,
        default: false,
      },
      conditions: {
        maxAmount: Number,
        trustedEmployees: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
approvalRuleSchema.index({ companyId: 1, isActive: 1 });
approvalRuleSchema.index({ priority: -1 });

// Method to check if rule applies to an expense
approvalRuleSchema.methods.appliesTo = function (expense) {
  const conditions = this.conditions;
  
  // Check category
  if (conditions.categories.length > 0 && !conditions.categories.includes(expense.category)) {
    return false;
  }
  
  // Check amount range
  if (conditions.minAmount !== null && expense.amount < conditions.minAmount) {
    return false;
  }
  
  if (conditions.maxAmount !== null && expense.amount > conditions.maxAmount) {
    return false;
  }
  
  return true;
};

// Method to get approvers based on rule type
approvalRuleSchema.methods.getApprovers = function (expense) {
  const approvers = [];
  
  switch (this.type) {
    case 'sequence':
      return this.approverSequence
        .sort((a, b) => a.level - b.level)
        .map((item) => item.userId)
        .filter((id) => id);
        
    case 'specific':
      return this.specificApproverId ? [this.specificApproverId] : [];
      
    case 'amount-based':
      for (const threshold of this.amountThresholds) {
        if (
          expense.amount >= threshold.minAmount &&
          (threshold.maxAmount === null || expense.amount <= threshold.maxAmount)
        ) {
          return threshold.approvers;
        }
      }
      return [];
      
    default:
      return [];
  }
};

const ApprovalRule = mongoose.model('ApprovalRule', approvalRuleSchema);

module.exports = ApprovalRule;