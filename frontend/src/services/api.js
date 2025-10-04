import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Handle 403 Forbidden - Insufficient permissions
    if (error.response?.status === 403) {
      console.error('Access denied: Insufficient permissions');
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error: Unable to reach the server');
    }

    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  // Register new admin and company
  register: (data) => api.post('/api/v1/auth/register', data),

  // Login user
  login: (data) => api.post('/api/v1/auth/login', data),

  // Logout user
  logout: () => api.post('/api/v1/auth/logout'),

  // Get current user
  getMe: () => api.get('/api/v1/auth/me'),

  // Forgot password - Send reset link
  forgotPassword: (email) => api.post('/api/v1/auth/forgot-password', { email }),

  // Reset password with token
  resetPassword: (token, password) =>
    api.post(`/api/v1/auth/reset-password/${token}`, { password }),

  // Change password (authenticated)
  changePassword: (data) => api.post('/api/v1/auth/change-password', data),
};

// User API endpoints
export const userAPI = {
  // Get all users (Admin/Manager only)
  getAllUsers: () => api.get('/api/v1/users'),

  // Get user by ID
  getUserById: (id) => api.get(`/api/v1/users/${id}`),

  // Create new user (Admin/Manager only)
  createUser: (data) => api.post('/api/v1/users', data),

  // Update user
  updateUser: (id, data) => api.put(`/api/v1/users/${id}`, data),

  // Delete user (Admin only)
  deleteUser: (id) => api.delete(`/api/v1/users/${id}`),

  // Update user profile
  updateProfile: (data) => api.put('/api/v1/users/profile', data),
};

// Company API endpoints
export const companyAPI = {
  // Get company details
  getCompany: () => api.get('/api/v1/company'),

  // Update company settings
  updateCompany: (data) => api.put('/api/v1/company', data),
};

// Expense API endpoints
export const expenseAPI = {
  // Get all expenses
  getAllExpenses: (params) => api.get('/api/v1/expenses', { params }),

  // Get expense by ID
  getExpenseById: (id) => api.get(`/api/v1/expenses/${id}`),

  // Create new expense
  createExpense: (data) => api.post('/api/v1/expenses', data),

  // Update expense
  updateExpense: (id, data) => api.put(`/api/v1/expenses/${id}`, data),

  // Delete expense
  deleteExpense: (id) => api.delete(`/api/v1/expenses/${id}`),

  // Upload receipt
  uploadReceipt: (expenseId, file) => {
    const formData = new FormData();
    formData.append('receipt', file);
    return api.post(`/api/v1/expenses/${expenseId}/receipt`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Approve expense (Manager/Admin only)
  approveExpense: (id) => api.post(`/api/v1/expenses/${id}/approve`),

  // Reject expense (Manager/Admin only)
  rejectExpense: (id, reason) =>
    api.post(`/api/v1/expenses/${id}/reject`, { reason }),
};

// Category API endpoints
export const categoryAPI = {
  // Get all categories
  getAllCategories: () => api.get('/api/v1/categories'),

  // Get category by ID
  getCategoryById: (id) => api.get(`/api/v1/categories/${id}`),

  // Create new category (Admin/Manager only)
  createCategory: (data) => api.post('/api/v1/categories', data),

  // Update category (Admin/Manager only)
  updateCategory: (id, data) => api.put(`/api/v1/categories/${id}`, data),

  // Delete category (Admin only)
  deleteCategory: (id) => api.delete(`/api/v1/categories/${id}`),
};

// Department API endpoints
export const departmentAPI = {
  // Get all departments
  getAllDepartments: () => api.get('/api/v1/departments'),

  // Get department by ID
  getDepartmentById: (id) => api.get(`/api/v1/departments/${id}`),

  // Create new department (Admin/Manager only)
  createDepartment: (data) => api.post('/api/v1/departments', data),

  // Update department (Admin/Manager only)
  updateDepartment: (id, data) => api.put(`/api/v1/departments/${id}`, data),

  // Delete department (Admin only)
  deleteDepartment: (id) => api.delete(`/api/v1/departments/${id}`),
};

// Report API endpoints
export const reportAPI = {
  // Get expense summary
  getSummary: (params) => api.get('/api/v1/reports/summary', { params }),

  // Get expenses by category
  getByCategory: (params) => api.get('/api/v1/reports/by-category', { params }),

  // Get expenses by user
  getByUser: (params) => api.get('/api/v1/reports/by-user', { params }),

  // Get expenses by department
  getByDepartment: (params) => api.get('/api/v1/reports/by-department', { params }),

  // Export report
  exportReport: (params) =>
    api.get('/api/v1/reports/export', {
      params,
      responseType: 'blob',
    }),
};

// Dashboard API endpoints
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: () => api.get('/api/v1/dashboard/stats'),

  // Get recent expenses
  getRecentExpenses: () => api.get('/api/v1/dashboard/recent-expenses'),

  // Get pending approvals (Manager/Admin only)
  getPendingApprovals: () => api.get('/api/v1/dashboard/pending-approvals'),
};

export default api;
