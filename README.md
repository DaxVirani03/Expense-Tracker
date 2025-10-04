# Expense-Tracker (ExpenseFlow)

🚀 **Intelligent Expense Management System** - A comprehensive MERN stack application for streamlining company expense reimbursements with automated multi-level approvals, OCR support, and flexible approval rules.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [User Roles](#user-roles)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [License](#license)

## 🎯 Overview

ExpenseFlow is a full-stack expense management solution designed to digitize expense submissions, automate multi-level approvals, and ensure transparency with flexible approval rules. The system supports OCR for receipt processing, multi-currency transactions, and provides comprehensive analytics dashboards.

### Key Highlights

✅ **MVP Features**
- Authentication (signup/login/forgot/reset)
- Company auto-creation on signup
- Role-based users (Employee, Manager, Admin)
- Expense submission with receipts
- Multi-level approval workflow
- Admin dashboard and configuration
- Basic reporting and analytics

🚀 **Advanced Features**
- OCR receipt auto-reading
- Conditional approval rules
- Currency conversion support
- Email notifications
- Audit logs for compliance
- Advanced analytics

## ✨ Features

### For Employees
- 📝 Submit expenses with receipts
- 💰 Multi-currency support
- 📊 Track approval status
- 📜 View expense history

### For Managers
- ✅ Approve/reject team expenses
- 👥 View team reports
- 💬 Add approval comments

### For Administrators
- 👤 User management
- ⚙️ Configure approval rules
- 🏢 Company settings
- 📊 System-wide reports

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB (Local)
- **Authentication**: JWT
- **File Storage**: Local file system
- **OCR**: Tesseract.js (Local)
- **Logging**: Winston

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand + React Query
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Charts**: Recharts

## 📁 Project Structure

```
Expense-Tracker/
│
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── models/            # Mongoose models
│   │   ├── controllers/       # Route controllers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   ├── middlewares/       # Express middlewares
│   │   ├── utils/             # Utility functions
│   │   ├── tests/             # Test files
│   │   └── server.js          # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── api/               # API clients
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── context/           # Context providers
│   │   ├── hooks/             # Custom hooks
│   │   ├── routes/            # Routing config
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── docs/                       # Documentation
│   └── ExpenseManagement.txt  # Requirements
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0+)
- npm (v9.0.0+)
- MongoDB (Local installation)

## 📦 Installation

### 1. Install MongoDB Locally
```bash
# Windows (using winget)
winget install MongoDB.Server

# Or download from: https://www.mongodb.com/try/download/community
```

### 2. Start MongoDB
```bash
# Windows Service
net start MongoDB

# Or run manually
mongod
```

### 3. Clone Repository
```bash
git clone https://github.com/DaxVirani03/Expense-Tracker.git
cd Expense-Tracker
```

### 4. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# .env is pre-configured for local development
```

### 5. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with VITE_API_URL=http://localhost:5000/api/v1
```

## 🏃 Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```
Runs on `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm run dev
```
Runs on `http://localhost:3000`

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Employee** | Submit expenses, view own history |
| **Manager** | Approve/reject team expenses |
| **Admin** | Full system access, configuration |

## 📚 API Documentation

### Authentication
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login

### Expenses
- `GET /api/v1/expenses` - List expenses
- `POST /api/v1/expenses` - Create expense
- `PUT /api/v1/expenses/:id/approve` - Approve

See `docs/api-reference.md` for complete documentation.

## 🎨 UI/UX Specifications

Detailed design specifications for authentication pages:
- `docs/UI_UX_SPECIFICATIONS.md` - Complete UI/UX guide for Login & Signup pages
- `docs/ExpenseManagement.txt` - Updated requirements with UI details

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 🚢 Deployment

### Backend
Deploy to Heroku, Render, or Railway

### Frontend
Deploy to Vercel or Netlify

See `docs/deployment-guide.md` for details.

## 🔒 Security
- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- XSS & CSRF protection
- Environment variables

## 📝 License

MIT License - see LICENSE file

## 👨‍💻 Author

**Dax Virani** - [DaxVirani03](https://github.com/DaxVirani03)

## 📞 Support

For support, open an issue on GitHub.

---

**Built with ❤️ using MERN Stack**