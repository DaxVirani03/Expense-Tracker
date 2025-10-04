// Application Constants

// User Roles
const USER_ROLES = {
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
  ADMIN: 'admin',
  FINANCE: 'finance',
  DIRECTOR: 'director',
};

// Expense Status
const EXPENSE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REIMBURSED: 'reimbursed',
};

// Approval Decision
const APPROVAL_DECISION = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PENDING: 'pending',
};

// Approval Rule Types
const APPROVAL_RULE_TYPES = {
  SEQUENCE: 'sequence',
  PERCENTAGE: 'percentage',
  SPECIFIC: 'specific',
  HYBRID: 'hybrid',
  AMOUNT_BASED: 'amount-based',
};

// Transaction Types
const TRANSACTION_TYPES = {
  REIMBURSEMENT: 'reimbursement',
  ADVANCE: 'advance',
  REFUND: 'refund',
};

// Transaction Status
const TRANSACTION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

// Payment Methods
const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  CHECK: 'check',
  CASH: 'cash',
  PAYROLL: 'payroll',
  DIGITAL_WALLET: 'digital_wallet',
};

// Expense Categories
const EXPENSE_CATEGORIES = [
  'Travel',
  'Meals',
  'Accommodation',
  'Transportation',
  'Office Supplies',
  'Software',
  'Marketing',
  'Training',
  'Entertainment',
  'Equipment',
  'Utilities',
  'Internet',
  'Phone',
  'Subscriptions',
  'Other',
];

// Audit Log Actions
const AUDIT_ACTIONS = {
  EXPENSE_CREATED: 'expense_created',
  EXPENSE_UPDATED: 'expense_updated',
  EXPENSE_DELETED: 'expense_deleted',
  EXPENSE_APPROVED: 'expense_approved',
  EXPENSE_REJECTED: 'expense_rejected',
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_DELETED: 'user_deleted',
  ROLE_CHANGED: 'role_changed',
  APPROVAL_RULE_CREATED: 'approval_rule_created',
  APPROVAL_RULE_UPDATED: 'approval_rule_updated',
  APPROVAL_RULE_DELETED: 'approval_rule_deleted',
  COMPANY_SETTINGS_UPDATED: 'company_settings_updated',
  LOGIN: 'login',
  LOGOUT: 'logout',
  PASSWORD_RESET: 'password_reset',
  PASSWORD_CHANGED: 'password_changed',
  TRANSACTION_CREATED: 'transaction_created',
  TRANSACTION_PROCESSED: 'transaction_processed',
  EXPORT_DATA: 'export_data',
  IMPORT_DATA: 'import_data',
};

// Audit Log Severity
const AUDIT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// API Versioning
const API_VERSION = 'v1';
const API_PREFIX = `/api/${API_VERSION}`;

// Pagination Defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// File Upload
const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf'],
};

// Rate Limiting
const RATE_LIMITS = {
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 5,
  },
  API: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
};

// Error Messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You are not authorized to access this resource',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  SERVER_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  USER_NOT_FOUND: 'User not found',
  USER_EXISTS: 'User already exists',
  COMPANY_NOT_FOUND: 'Company not found',
  EXPENSE_NOT_FOUND: 'Expense not found',
  INVALID_APPROVAL: 'Invalid approval action',
  ALREADY_PROCESSED: 'Request has already been processed',
};

// Success Messages
const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  EXPENSE_SUBMITTED: 'Expense submitted successfully',
  EXPENSE_APPROVED: 'Expense approved successfully',
  EXPENSE_REJECTED: 'Expense rejected successfully',
  PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent successfully',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
};

// Environment
const ENVIRONMENT = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
};

module.exports = {
  USER_ROLES,
  EXPENSE_STATUS,
  APPROVAL_DECISION,
  APPROVAL_RULE_TYPES,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
  PAYMENT_METHODS,
  EXPENSE_CATEGORIES,
  AUDIT_ACTIONS,
  AUDIT_SEVERITY,
  API_VERSION,
  API_PREFIX,
  PAGINATION,
  FILE_UPLOAD,
  RATE_LIMITS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ENVIRONMENT,
};