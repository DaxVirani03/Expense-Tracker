# Expense-Tracker Frontend

ExpenseFlow - Intelligent Expense Management System Frontend Application

## 🚀 Features

- **Modern React**: Built with React 18 and Vite for fast development
- **Responsive Design**: TailwindCSS for beautiful, mobile-first UI
- **State Management**: Zustand for global state, React Query for server state
- **Authentication**: JWT-based authentication with protected routes
- **Role-Based UI**: Different dashboards for Employee, Manager, and Admin
- **Form Handling**: React Hook Form for efficient form management
- **Data Visualization**: Recharts for beautiful expense analytics
- **Notifications**: React Hot Toast for user feedback
- **Animations**: Framer Motion for smooth transitions
- **Type Safety**: ESLint for code quality

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🛠️ Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure API URL

4. **Start development server**
   ```bash
   npm run dev
   ```

The app will run on `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # API client and endpoints
│   ├── assets/           # Images, icons, static files
│   ├── components/       # Reusable components
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # Dashboard pages
│   │   ├── expenses/     # Expense management pages
│   │   ├── admin/        # Admin pages
│   │   └── common/       # Common pages (404, etc.)
│   ├── routes/           # Routing configuration
│   ├── styles/           # Global styles
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main App component
│   └── main.jsx          # Entry point
├── public/               # Public assets
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Dependencies
```

## 🎨 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Fix linting errors
npm run lint:fix

# Format code
npm run format

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 🔐 User Roles & Features

### Employee
- Submit expenses with receipts
- View personal expense history
- Track approval status
- Manage profile

### Manager
- Approve/reject team expenses
- View team expense reports
- Manage team members
- Dashboard analytics

### Admin
- Full system access
- User management
- Approval rule configuration
- Company settings
- Comprehensive reports
- System analytics

## 🎯 Key Features

### Expense Management
- Create expenses with multiple currencies
- Upload receipts (images/PDFs)
- Categorize expenses
- Add descriptions and notes
- Track approval status

### Approval Workflow
- Multi-level approvals
- Real-time status updates
- Approval history
- Comments and feedback

### Analytics Dashboard
- Expense trends
- Category breakdown
- Monthly comparisons
- Department analytics
- Export reports

### User Management (Admin)
- Create/edit users
- Assign roles
- Manager mapping
- Department organization

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand + React Query
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Date Handling**: date-fns

## 🎨 UI Components

- Navbar with role-based menu
- Sidebar navigation
- Expense cards
- Data tables
- Forms with validation
- Modal dialogs
- Dropdown menus
- Charts and graphs
- Loading states
- Error boundaries

## 🌐 API Integration

All API calls are centralized in the `/src/api` directory:

- `axiosClient.js` - Base axios configuration
- `auth.api.js` - Authentication endpoints
- `expenses.api.js` - Expense endpoints
- `users.api.js` - User management endpoints
- `rules.api.js` - Approval rules endpoints
- `uploads.api.js` - File upload endpoints

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 Theming

Support for light and dark themes:
- Theme toggle in navbar
- Persistent theme selection
- System preference detection

## 🔒 Security

- JWT token management
- Protected routes
- Role-based access control
- XSS protection
- CSRF protection
- Secure cookie handling

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to Vercel

```bash
vercel deploy
```

### Deploy to Netlify

```bash
netlify deploy --prod
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📝 Environment Variables

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=ExpenseFlow
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📄 License

MIT

## 👥 Authors

Your Name - Initial work

## 📞 Support

For support, email support@expenseflow.com