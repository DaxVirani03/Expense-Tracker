# 🚀 ExpenseFlow - Complete Setup Instructions

## 📋 Project Overview

ExpenseFlow is a complete MERN stack expense management system with:
- ✅ **Backend**: Node.js + Express + MongoDB with JWT authentication
- ✅ **Frontend**: React + Vite + TailwindCSS with modern UI
- ✅ **Features**: User management, expense submission, approval workflow, dashboard analytics
- ✅ **Security**: JWT tokens, bcrypt password hashing, role-based access control

## 🛠️ Prerequisites

Before starting, ensure you have:
- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** (for version control)

## 📦 Installation Steps

### 1. Clone and Navigate to Project
```bash
# Navigate to the project directory
cd "C:\Users\Tirth\OneDrive\Desktop\New folder (4)\Expense-Tracker"
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
# Copy the following content to .env file:
```

**Create `backend/.env` file with:**
```env
# Environment Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/expense-tracker

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-change-in-production
JWT_REFRESH_EXPIRE=30d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# File Upload (optional - for future use)
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,application/pdf

# Security
BCRYPT_ROUNDS=10
```

```bash
# Start backend server
npm run dev
```

### 3. Frontend Setup

```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
# Copy the following content to .env file:
```

**Create `frontend/.env` file with:**
```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Application Configuration
VITE_APP_NAME=ExpenseFlow
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_OCR=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=false

# Development Configuration
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=info
```

```bash
# Start frontend development server
npm run dev
```

## 🗄️ Database Setup

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database

### Option 2: MongoDB Atlas (Cloud)
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `backend/.env`

## 🚀 Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:3000

## 🧪 Testing the Application

### 1. Create Admin Account
1. Open http://localhost:3000
2. Click "Signup" 
3. Fill in the admin registration form:
   - Name: Your Name
   - Email: admin@company.com
   - Password: SecurePass123!
   - Country: United States
   - Company Name: Your Company

### 2. Login and Test Features
1. Login with your admin credentials
2. You'll see the dashboard with:
   - Statistics cards
   - Recent expenses (empty initially)
   - Navigation options

### 3. Submit Test Expense
1. Click "Submit Expense" button
2. Fill in expense details:
   - Amount: 50.00
   - Category: Travel
   - Description: Client meeting
   - Date: Today's date
3. Submit the expense

### 4. Test User Management (Admin)
- Create additional users
- Assign roles (Employee, Manager, Admin)
- Test approval workflow

## 📁 Project Structure

```
Expense-Tracker/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database, logging, cloudinary
│   │   ├── controllers/     # API controllers
│   │   ├── middlewares/    # Auth, error handling
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # Main server file
│   ├── logs/               # Application logs
│   └── package.json
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── services/       # API client
│   │   ├── styles/         # CSS files
│   │   └── routes/         # React Router
│   └── package.json
└── docs/                   # Documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register admin
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/forgot-password` - Forgot password
- `POST /api/v1/auth/reset-password/:token` - Reset password

### Users
- `GET /api/v1/users` - Get all users (Admin/Manager)
- `POST /api/v1/users` - Create user (Admin/Manager)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin)

### Expenses
- `GET /api/v1/expenses` - Get all expenses
- `POST /api/v1/expenses` - Create expense
- `GET /api/v1/expenses/:id` - Get expense by ID
- `PUT /api/v1/expenses/:id` - Update expense
- `DELETE /api/v1/expenses/:id` - Delete expense
- `POST /api/v1/expenses/:id/approve` - Approve expense
- `POST /api/v1/expenses/:id/reject` - Reject expense

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics
- `GET /api/v1/dashboard/recent-expenses` - Get recent expenses
- `GET /api/v1/dashboard/pending-approvals` - Get pending approvals

### Company
- `GET /api/v1/company` - Get company details
- `PUT /api/v1/company` - Update company (Admin)
- `GET /api/v1/company/stats` - Get company statistics

## 🎨 Frontend Features

### Pages
- **Login** - User authentication
- **Signup** - Admin registration with company creation
- **Dashboard** - Main application interface
- **Expense Form** - Submit new expenses
- **Forgot Password** - Password recovery
- **Reset Password** - Password reset with token

### Components
- **Input** - Form input with validation
- **Button** - Multi-variant button component
- **PasswordStrength** - Real-time password strength
- **CountrySelector** - Country dropdown with currency
- **ProtectedRoute** - Authentication guard

### Features
- ✅ Responsive design (mobile-first)
- ✅ Real-time form validation
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ Role-based access control

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with 10 salt rounds
- **Role-Based Access** - Admin, Manager, Employee roles
- **Input Validation** - Server-side validation
- **CORS Protection** - Cross-origin request security
- **Rate Limiting** - API request limiting
- **Helmet Security** - Security headers

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env
   - Verify database permissions

2. **Port Already in Use**
   - Change PORT in backend/.env
   - Update VITE_API_URL in frontend/.env

3. **CORS Errors**
   - Check CORS_ORIGIN in backend/.env
   - Ensure frontend URL matches

4. **JWT Token Errors**
   - Check JWT_SECRET in backend/.env
   - Clear browser localStorage

### Logs
- Backend logs: `backend/logs/`
- Console logs: Check terminal output
- Network logs: Browser DevTools

## 📈 Next Steps

### Immediate Improvements
1. **Email Service** - Add password reset emails
2. **File Upload** - Implement receipt upload
3. **Advanced Analytics** - Charts and reports
4. **Mobile App** - React Native version

### Production Deployment
1. **Environment Variables** - Secure production configs
2. **Database Security** - MongoDB authentication
3. **HTTPS** - SSL certificates
4. **Monitoring** - Error tracking and analytics

## 🎯 Success Criteria

✅ **Authentication System** - Complete with JWT tokens  
✅ **User Management** - Role-based access control  
✅ **Expense Submission** - Full CRUD operations  
✅ **Approval Workflow** - Manager/Admin approval system  
✅ **Dashboard Analytics** - Statistics and reporting  
✅ **Responsive UI** - Mobile-first design  
✅ **Security** - Production-ready security measures  

## 📞 Support

If you encounter any issues:
1. Check the logs in `backend/logs/`
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check MongoDB connection
4. Review browser console for frontend errors

---

**🎉 Congratulations! Your ExpenseFlow application is now ready to use!**

The system includes a complete expense management workflow with user authentication, role-based access control, and a modern React frontend. You can now register as an admin, create users, submit expenses, and manage the approval process.
