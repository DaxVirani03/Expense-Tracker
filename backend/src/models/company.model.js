const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true,
      unique: true,
    },
    country: {
      type: String,
      required: [true, 'Please provide a country'],
      trim: true,
    },
    defaultCurrency: {
      type: String,
      required: [true, 'Please provide a default currency'],
      default: 'USD',
      uppercase: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    logo: {
      type: String,
      default: null,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    settings: {
      expenseCategories: {
        type: [String],
        default: [
          'Travel',
          'Meals',
          'Accommodation',
          'Transportation',
          'Office Supplies',
          'Software',
          'Marketing',
          'Training',
          'Entertainment',
          'Other',
        ],
      },
      maxExpenseAmount: {
        type: Number,
        default: 10000,
      },
      approvalRequired: {
        type: Boolean,
        default: true,
      },
      receiptRequired: {
        type: Boolean,
        default: true,
      },
      ocrEnabled: {
        type: Boolean,
        default: false,
      },
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'basic', 'pro', 'enterprise'],
        default: 'free',
      },
      startDate: Date,
      endDate: Date,
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
companySchema.index({ createdBy: 1 });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;