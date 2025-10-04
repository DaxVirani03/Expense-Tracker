const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
      immutable: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'expense_created',
        'expense_updated',
        'expense_deleted',
        'expense_approved',
        'expense_rejected',
        'user_created',
        'user_updated',
        'user_deleted',
        'role_changed',
        'approval_rule_created',
        'approval_rule_updated',
        'approval_rule_deleted',
        'company_settings_updated',
        'login',
        'logout',
        'password_reset',
        'password_changed',
        'transaction_created',
        'transaction_processed',
        'export_data',
        'import_data',
      ],
      immutable: true,
    },
    resourceType: {
      type: String,
      required: true,
      enum: ['Expense', 'User', 'Company', 'ApprovalRule', 'Transaction', 'Auth', 'System'],
      immutable: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      immutable: true,
    },
    changes: {
      before: mongoose.Schema.Types.Mixed,
      after: mongoose.Schema.Types.Mixed,
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
      location: String,
      deviceType: String,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low',
      immutable: true,
    },
    description: {
      type: String,
      required: true,
      immutable: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
      index: true,
    },
  },
  {
    timestamps: false, // We use custom timestamp field
  }
);

// Compound indexes for efficient querying
auditLogSchema.index({ companyId: 1, timestamp: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ severity: 1, timestamp: -1 });

// Make all fields immutable by default
auditLogSchema.pre('save', function (next) {
  if (!this.isNew) {
    return next(new Error('Audit logs cannot be modified'));
  }
  next();
});

// Prevent updates and deletes
auditLogSchema.pre('findOneAndUpdate', function (next) {
  next(new Error('Audit logs cannot be modified'));
});

auditLogSchema.pre('findOneAndDelete', function (next) {
  next(new Error('Audit logs cannot be deleted'));
});

auditLogSchema.pre('deleteMany', function (next) {
  next(new Error('Audit logs cannot be deleted'));
});

// Static method to create audit log
auditLogSchema.statics.createLog = async function (logData) {
  try {
    const log = await this.create({
      ...logData,
      timestamp: new Date(),
    });
    return log;
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error to prevent breaking main operations
    return null;
  }
};

// Static method to query logs with filters
auditLogSchema.statics.queryLogs = async function (filters, options = {}) {
  const {
    page = 1,
    limit = 50,
    sortBy = 'timestamp',
    sortOrder = 'desc',
  } = options;
  
  const query = {};
  
  if (filters.companyId) query.companyId = filters.companyId;
  if (filters.userId) query.userId = filters.userId;
  if (filters.action) query.action = filters.action;
  if (filters.resourceType) query.resourceType = filters.resourceType;
  if (filters.resourceId) query.resourceId = filters.resourceId;
  if (filters.severity) query.severity = filters.severity;
  
  // Date range filter
  if (filters.startDate || filters.endDate) {
    query.timestamp = {};
    if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
    if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
  }
  
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
  
  const logs = await this.find(query)
    .sort(sort)
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('userId', 'name email role')
    .lean();
  
  const total = await this.countDocuments(query);
  
  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;