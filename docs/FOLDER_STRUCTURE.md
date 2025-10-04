# Expense-Tracker - Complete Folder Structure

## 📁 Full Project Structure

```
Expense-Tracker/
│
├── backend/                 │   │   ├── pages/                             # Page Components
│   │   │   ├── auth/                          # TODO: Auth pages
│   │   │   │   ├── Login.jsx                    # ✅ Signin page (email/password)
│   │   │   │   ├── Signup.jsx                   # ✅ Admin company signup (name/email/password/country)
│   │   │   │   ├── ForgotPassword.jsx           # ✅ Password recovery
│   │   │   │   └── ResetPassword.jsx            # ✅ Password reset             # Node.js/Express Backend
│   ├── src/
│   │   ├── config/                            # Configuration Files
│   │   │   ├── db.js                          # ✅ MongoDB connection
│   │   │   ├── cloudinary.js                  # ✅ Cloudinary config
│   │   │   ├── ocr.js                         # ✅ OCR setup (Tesseract/Google Vision)
│   │   │   ├── logger.js                      # ✅ Winston logger
│   │   │   └── index.js                       # ✅ Config exports
│   │   │
│   │   ├── models/                            # Mongoose Models
│   │   │   ├── user.model.js                  # ✅ User schema
│   │   │   ├── company.model.js               # ✅ Company schema
│   │   │   ├── expense.model.js               # ✅ Expense schema
│   │   │   ├── approvalRule.model.js          # ✅ Approval rule schema
│   │   │   ├── transaction.model.js           # ✅ Transaction schema
│   │   │   └── auditLog.model.js              # ✅ Audit log schema (immutable)
│   │   │
│   │   ├── controllers/                       # Route Controllers
│   │   │   ├── auth.controller.js             # ✅ Auth operations (7 endpoints)
│   │   │   ├── user.controller.js             # TODO: User CRUD
│   │   │   ├── expense.controller.js          # TODO: Expense management
│   │   │   ├── approval.controller.js         # TODO: Approval workflow
│   │   │   ├── rule.controller.js             # TODO: Rule management
│   │   │   ├── company.controller.js          # TODO: Company settings
│   │   │   ├── upload.controller.js           # TODO: File uploads
│   │   │   └── report.controller.js           # TODO: Reports/analytics
│   │   │
│   │   ├── services/                          # Business Logic Layer
│   │   │   ├── auth.service.js                # TODO: JWT, password hashing
│   │   │   ├── user.service.js                # TODO: User operations
│   │   │   ├── expense.service.js             # TODO: Expense logic
│   │   │   ├── ocr.service.js                 # TODO: OCR processing
│   │   │   ├── email.service.js               # TODO: Email notifications
│   │   │   ├── rule.service.js                # TODO: Rule engine
│   │   │   └── analytics.service.js           # TODO: Analytics/reports
│   │   │
│   │   ├── routes/                            # API Routes
│   │   │   ├── auth.routes.js                 # ✅ Auth endpoints (7 routes)
│   │   │   ├── user.routes.js                 # TODO: User endpoints
│   │   │   ├── expense.routes.js              # TODO: Expense endpoints
│   │   │   ├── approval.routes.js             # TODO: Approval endpoints
│   │   │   ├── rule.routes.js                 # TODO: Rule endpoints
│   │   │   ├── upload.routes.js               # TODO: Upload endpoints
│   │   │   ├── company.routes.js              # TODO: Company endpoints
│   │   │   └── index.js                       # ✅ Route aggregator
│   │   │
│   │   ├── middlewares/                       # Express Middlewares
│   │   │   ├── auth.middleware.js             # ✅ JWT verification
│   │   │   ├── role.middleware.js             # ✅ RBAC enforcement
│   │   │   ├── error.middleware.js            # ✅ Error handler
│   │   │   ├── upload.middleware.js           # TODO: Multer config
│   │   │   ├── rateLimiter.js                 # TODO: Rate limiting
│   │   │   └── validator.js                   # TODO: Input validation
│   │   │
│   │   ├── utils/                             # Utility Functions
│   │   │   ├── apiResponse.js                 # ✅ Standard API responses
│   │   │   ├── asyncHandler.js                # ✅ Async error wrapper
│   │   │   ├── generateToken.js               # ✅ JWT token generation
│   │   │   ├── currencyUtil.js                # ✅ Currency conversion
│   │   │   └── constants.js                   # ✅ Application constants
│   │   │
│   │   ├── tests/                             # Test Files
│   │   │   ├── unit/                          # TODO: Unit tests
│   │   │   │   ├── models.test.js
│   │   │   │   ├── services.test.js
│   │   │   │   └── utils.test.js
│   │   │   ├── integration/                   # TODO: Integration tests
│   │   │   │   ├── auth.test.js
│   │   │   │   ├── expenses.test.js
│   │   │   │   └── approval.test.js
│   │   │   └── e2e/                           # TODO: E2E tests
│   │   │       └── workflow.test.js
│   │   │
│   │   ├── app.js                             # TODO: Express app config
│   │   └── server.js                          # TODO: Entry point
│   │
│   ├── logs/                                  # Application Logs
│   │   ├── combined.log                       # Auto-generated
│   │   └── error.log                          # Auto-generated
│   │
│   ├── .env.example                           # ✅ Environment template
│   ├── package.json                           # ✅ Dependencies
│   ├── jest.config.js                         # TODO: Jest config
│   ├── .eslintrc.json                         # TODO: ESLint config
│   ├── .prettierrc                            # TODO: Prettier config
│   └── README.md                              # ✅ Backend docs
│
├── frontend/                                   # React Frontend
│   ├── src/
│   │   ├── api/                               # API Integration
│   │   │   ├── auth.api.js                    # ✅ Auth API calls (7 endpoints)
│   │   │   ├── expenses.api.js                # TODO: Expense API calls
│   │   │   │   ├── users.api.js                   # TODO: User API calls
│   │   │   ├── rules.api.js                   # TODO: Rules API calls
│   │   │   └── uploads.api.js                 # TODO: Upload API calls
│   │   │
│   │   ├── components/                        # Reusable Components
│   │   │   ├── common/                        # TODO: Common components
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Button.jsx                 # ✅ Button component with variants
│   │   │   │   ├── Input.jsx                  # ✅ Input component with validation
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── ErrorBoundary.jsx
│   │   │   │   ├── PasswordStrength.jsx       # ✅ Password strength indicator
│   │   │   │   └── CountrySelector.jsx        # ✅ Country dropdown with currency logic
│   │   │   ├── expense/                       # TODO: Expense components
│   │   │   │   ├── ExpenseCard.jsx
│   │   │   │   ├── ExpenseForm.jsx
│   │   │   │   ├── ExpenseList.jsx
│   │   │   │   └── ReceiptUploader.jsx
│   │   │   ├── approval/                      # TODO: Approval components
│   │   │   │   ├── ApprovalList.jsx
│   │   │   │   ├── ApprovalCard.jsx
│   │   │   │   └── ApprovalFlow.jsx
│   │   │   ├── dashboard/                     # TODO: Dashboard components
│   │   │   │   ├── DashboardCharts.jsx
│   │   │   │   ├── StatsCard.jsx
│   │   │   │   └── RecentActivity.jsx
│   │   │   └── admin/                         # TODO: Admin components
│   │   │       ├── RuleConfigurator.jsx
│   │   │       ├── UserManager.jsx
│   │   │       └── SettingsForm.jsx
│   │   │
│   │   ├── pages/                             # Page Components
│   │   │   ├── auth/                          # TODO: Auth pages
│   │   │   │   ├── Login.jsx                      # Signin page (email/password)
│   │   │   │   ├── Signup.jsx                     # Admin company signup (name/email/password/country)
│   │   │   │   ├── ForgotPassword.jsx             # Password recovery
│   │   │   │   └── ResetPassword.jsx              # Password reset
│   │   │   │
│   │   │   ├── dashboard/                     # TODO: Dashboard pages
│   │   │   │   ├── EmployeeDashboard.jsx
│   │   │   │   ├── ManagerDashboard.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   └── AnalyticsDashboard.jsx
│   │   │   │
│   │   │   ├── expenses/                      # TODO: Expense pages
│   │   │   │   ├── ExpenseList.jsx
│   │   │   │   ├── ExpenseDetails.jsx
│   │   │   │   ├── NewExpense.jsx
│   │   │   │   └── EditExpense.jsx
│   │   │   │
│   │   │   ├── admin/                         # TODO: Admin pages
│   │   │   │   ├── ManageUsers.jsx
│   │   │   │   ├── ManageRules.jsx
│   │   │   │   ├── CompanySettings.jsx
│   │   │   │   └── Reports.jsx
│   │   │   │
│   │   │   └── common/                        # TODO: Common pages
│   │   │       ├── Home.jsx
│   │   │       ├── NotFound.jsx
│   │   │       └── Unauthorized.jsx
│   │   │
│   │   ├── context/                           # React Context
│   │   │   ├── AuthContext.jsx                # ✅ Auth state management
│   │   │   ├── ExpenseContext.jsx             # TODO: Expense state
│   │   │   ├── ThemeContext.jsx               # TODO: Theme state
│   │   │   └── NotificationContext.jsx        # TODO: Notifications
│   │   │
│   │   ├── hooks/                             # Custom Hooks
│   │   │   ├── useAuth.js                     # ✅ Auth hook
│   │   │   ├── useApi.js                      # TODO: API hook
│   │   │   ├── useForm.js                     # TODO: Form hook
│   │   │   ├── useDebounce.js                 # TODO: Debounce hook
│   │   │   ├── useNotifications.js            # TODO: Notification hook
│   │   │   └── useLocalStorage.js             # TODO: LocalStorage hook
│   │   │
│   │   ├── routes/                            # Routing
│   │   │   ├── AppRoutes.jsx                  # ✅ Route config with auth guards
│   │   │   ├── ProtectedRoute.jsx             # ✅ Auth guard component
│   │   │   └── RoleRoute.jsx                  # TODO: Role-based guard
│   │   │
│   │   ├── assets/                            # Static Assets
│   │   │   ├── images/                        # TODO: Images
│   │   │   │   ├── logo.svg
│   │   │   │   └── placeholder.png
│   │   │   └── icons/                         # TODO: Icons
│   │   │       └── expense-icon.svg
│   │   │
│   │   ├── styles/                            # Global Styles
│   │   │   ├── global.css                     # ✅ Global CSS with ExpenseFlow branding
│   │   │   ├── expensflow-brand.css           # ✅ Brand-specific styles and utilities
│   │   │   └── tailwind.css                   # TODO: Tailwind imports
│   │   │
│   │   ├── utils/                             # Utility Functions
│   │   │   ├── formatDate.js                  # TODO: Date formatting
│   │   │   ├── formatCurrency.js              # TODO: Currency formatting
│   │   │   ├── validators.js                  # TODO: Validation helpers
│   │   │   └── constants.js                   # TODO: Frontend constants
│   │   │
│   │   ├── main.jsx                           # ✅ Entry point with brand CSS
│   │   └── App.jsx                            # ✅ Root component with auth providers
│   │
│   ├── public/                                # Public Assets
│   │   ├── index.html                         # TODO: HTML template
│   │   ├── favicon.ico                        # TODO: Favicon
│   │   └── manifest.json                      # TODO: PWA manifest
│   │
│   ├── .env.example                           # TODO: Environment template
│   ├── package.json                           # ✅ Dependencies
│   ├── vite.config.js                         # ✅ Vite config
│   ├── tailwind.config.js                     # ✅ Tailwind config
│   ├── postcss.config.js                      # TODO: PostCSS config
│   ├── .eslintrc.json                         # TODO: ESLint config
│   ├── .prettierrc                            # TODO: Prettier config
│   └── README.md                              # ✅ Frontend docs
│
├── docs/                                       # Documentation
│   ├── ExpenseManagement.txt                  # ✅ Project requirements
│   ├── FOLDER_STRUCTURE.md                    # ✅ This file
│   ├── api-reference.md                       # TODO: API documentation
│   ├── deployment-guide.md                    # TODO: Deployment guide
│   ├── architecture.md                        # TODO: System architecture
│   ├── user-guide.md                          # TODO: User manual
│   └── developer-guide.md                     # TODO: Dev documentation
│
├── .gitignore                                 # ✅ Git ignore rules
├── .env.example                               # TODO: Root environment template
├── LICENSE                                    # ✅ MIT License
└── README.md                                  # ✅ Project README
```

## 📊 Progress Summary

### ✅ Completed (Phase 1 + Authentication System)
- Backend folder structure
- Configuration files (DB, Cloudinary, OCR, Logger)
- All 6 Mongoose models with relationships
- Utility functions (API Response, Async Handler, Token Generation, Currency, Constants)
- Middleware files (Auth, Role, Error)
- **Authentication System**: Complete auth controller, routes, and API endpoints
- Frontend folder structure
- **Authentication Components**: Login, Signup, Forgot Password, Reset Password pages
- **Reusable Components**: Button, Input, PasswordStrength, CountrySelector
- **State Management**: AuthContext with global authentication state
- **API Integration**: Axios client with auth interceptors
- **Routing**: React Router with protected routes
- **Styling**: TailwindCSS with ExpenseFlow brand colors and custom CSS
- Package.json files for both backend and frontend
- Build configurations (Vite, Tailwind)
- Documentation structure
- README files

### 🚧 To Be Implemented (Phase 2 - Expense Management)
- Controllers (7 remaining files - auth ✅)
- Services (7 files)
- Routes (7 remaining files - auth ✅)
- Additional middlewares (3 files)
- Test files (unit, integration, e2e)
- Frontend components (25+ remaining files)
- Frontend pages (11+ remaining files)
- Context providers (remaining)
- Custom hooks (remaining)
- API integration layer (remaining endpoints)

### 📈 Statistics
- **Total Directories**: 45+
- **Completed Files**: 45+ (Phase 1 + Auth System)
- **Pending Files**: 60+
- **Models**: 6/6 ✅
- **Config Files**: 5/5 ✅
- **Middleware**: 3/6 ✅
- **Utils**: 5/5 ✅
- **Auth Controllers**: 1/8 ✅
- **Auth Routes**: 1/8 ✅
- **Auth Components**: 4/4 ✅
- **Auth Pages**: 4/4 ✅
- **Auth Context**: 1/4 ✅
- **Auth API**: 1/5 ✅

## 🎯 Next Steps

### Phase 2A - Expense Management System
1. **Backend Controllers**: Implement remaining 7 controller files (user, expense, approval, rule, company, upload, report)
2. **Backend Services**: Implement business logic in 7 service files
3. **Backend Routes**: Set up remaining API endpoints
4. **Frontend Components**: Build expense management UI components
5. **Frontend Pages**: Create expense dashboard, submission forms, approval workflows
6. **Integration**: Connect expense management frontend to backend APIs
7. **Testing**: Write unit, integration, and E2E tests for expense features

### Phase 2B - Advanced Features
8. **OCR Integration**: Implement receipt scanning with Tesseract/Google Vision
9. **File Upload**: Set up Cloudinary for receipt storage
10. **Email Notifications**: Implement email service for approvals
11. **Analytics Dashboard**: Build reporting and analytics features
12. **Advanced Approval Rules**: Implement conditional approval logic

### Phase 3 - Production & Enterprise Features
13. **Security Hardening**: Rate limiting, input sanitization, audit logs
14. **Multi-tenancy**: Company isolation and data segregation
15. **Performance**: Caching, optimization, monitoring
16. **Deployment**: CI/CD, containerization, cloud deployment

## 🚀 Quick Start Commands

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd frontend && npm install

# Development mode
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev
```

## 📝 Notes

- All models include proper indexes for performance
- Audit logs are immutable for compliance
- Currency conversion with caching implemented
- JWT authentication with refresh tokens ready
- Role-based access control configured
- File upload structure prepared for Cloudinary
- OCR ready for both Tesseract and Google Vision

---

**Status**: Authentication System Complete ✅ | Expense Management Ready 🚀 | Production Prep �

## 🎨 UI/UX Specifications - Authentication Pages

### Overall Theme & Branding
- **Platform**: ExpenseFlow
- **Aesthetic**: Clean, modern, professional, enterprise-friendly, trust-building
- **Colors**: Primary blue (#3A7AFE), accent green (#2ECC71), neutral grays (#F5F6FA)
- **Typography**: Modern sans-serif (Inter/Poppins/Roboto)
- **Elements**: White space, rounded cards, subtle shadows

### Admin (Company) Signup Page
**Title**: "Admin (company) Signup Page"
**Constraint**: "1 admin user per company"

**Form Fields** (top to bottom):
- Name: Text input (admin's name)
- Email: Text input (admin's email)
- Password: Password input (masked, with strength indicator)
- Confirm Password: Password input (confirmation)
- Country: Dropdown (all world countries → sets base currency)

**Critical Business Logic**: Selected country's currency becomes company's base currency (immutable)

**Actions**:
- "Signup" button (primary CTA)
- "Already have an account? Login" link

### Login Page
**Title**: "Signin Page"

**Form Fields** (top to bottom):
- Email: Text input (user's email)
- Password: Password input (masked)

**Actions**:
- "Login" button (primary CTA)
- "Don't have an account? Signup" link
- "Forgot password?" link

### Key Considerations
- **Password Strength**: Real-time validation (Weak/Medium/Strong)
- **Country Selection**: Critical for currency - show importance with info icon
- **Error Handling**: Clear feedback for validation failures
- **Navigation**: Bidirectional links between login/signup
- **Responsive**: Mobile-friendly design
- **Accessibility**: Proper labels, keyboard navigation

### Component Dependencies
- PasswordStrength.jsx: Visual password strength indicator
- CountrySelector.jsx: World countries dropdown with currency mapping
- Form validation with real-time feedback
- Loading states during API calls
- Error boundaries for graceful failure handling