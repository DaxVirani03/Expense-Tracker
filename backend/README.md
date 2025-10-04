# Expense-Tracker Backend

ExpenseFlow - Intelligent Expense Management System Backend API

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (RBAC)
- **User Management**: Multi-role support (Employee, Manager, Admin, Finance, Director)
- **Expense Management**: Create, track, and manage expenses with receipt uploads
- **Approval Workflows**: Multi-level approval system with configurable rules
- **OCR Integration**: Automatic receipt data extraction using Tesseract.js/Google Vision
- **Currency Support**: Multi-currency with automatic conversion
- **Audit Logging**: Immutable audit trails for compliance
- **Real-time Analytics**: Dashboard analytics and reporting
- **File Upload**: Cloudinary integration for secure receipt storage
- **Email Notifications**: Automated email alerts for approvals/rejections

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm >= 9.0.0

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   
   **Option A: MongoDB Atlas (Recommended)**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account and cluster
   - Get your connection string
   - Update `MONGODB_URI` in `.env`
   
   **Option B: Local MongoDB**
   - Install MongoDB Community Server
   - Start MongoDB service
   - Use default `MONGODB_URI=mongodb://localhost:27017/expense-tracker`

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your configuration values (MongoDB URI, JWT secrets are pre-filled)

5. **Start MongoDB Compass**
   - Install [MongoDB Compass](https://www.mongodb.com/products/compass)
   - Connect using your MongoDB URI
   - Create database: `expense-tracker`

6. **Run the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files (DB, Cloudinary, OCR, Logger)
│   ├── models/           # Mongoose models
│   ├── controllers/      # Route controllers
│   ├── services/         # Business logic
│   ├── routes/           # API routes
│   ├── middlewares/      # Express middlewares
│   ├── utils/            # Utility functions
│   ├── tests/            # Test files
│   ├── app.js            # Express app configuration
│   └── server.js         # Entry point
├── logs/                 # Application logs
├── .env.example          # Environment variables template
├── package.json          # Dependencies
└── README.md             # This file
```

## 🔐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new company admin
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password/:token` - Reset password

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `POST /api/v1/users` - Create user (Admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin only)
- `GET /api/v1/users/:id/expenses` - Get user expenses

### Expenses
- `GET /api/v1/expenses` - Get all expenses
- `POST /api/v1/expenses` - Create expense
- `GET /api/v1/expenses/:id` - Get expense by ID
- `PUT /api/v1/expenses/:id` - Update expense
- `DELETE /api/v1/expenses/:id` - Delete expense
- `PUT /api/v1/expenses/:id/approve` - Approve expense
- `PUT /api/v1/expenses/:id/reject` - Reject expense

### Approval Rules
- `GET /api/v1/approval-rules` - Get approval rules
- `POST /api/v1/approval-rules` - Create approval rule (Admin only)
- `PUT /api/v1/approval-rules/:id` - Update approval rule (Admin only)
- `DELETE /api/v1/approval-rules/:id` - Delete approval rule (Admin only)

### Company
- `GET /api/v1/company` - Get company info
- `PUT /api/v1/company` - Update company settings (Admin only)

### Uploads
- `POST /api/v1/uploads/receipt` - Upload expense receipt

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run tests in watch mode
npm run test:watch
```

## 📝 Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_*` - Cloudinary credentials for file uploads
- `EMAIL_*` - Email configuration for notifications

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting on sensitive endpoints
- XSS protection
- MongoDB injection prevention
- CORS configuration
- Helmet security headers
- HTTP-only cookies

## 📊 Logging

Application logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

## 🚢 Deployment

### Manual Deployment

1. Set `NODE_ENV=production` in `.env`
2. Configure production MongoDB URI
3. Set secure JWT secrets
4. Configure CORS for production frontend URL
5. Run `npm start`

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📄 License

MIT

## 👥 Authors

Your Name - Initial work

## 🐛 Known Issues

See GitHub Issues page

## 📞 Support

For support, email support@expenseflow.com