# Local MongoDB Setup Guide for Expense-Tracker

## 🚀 Local MongoDB Installation (Recommended)

### Option 1: Windows Package Manager (winget)
```bash
winget install MongoDB.Server
```

### Option 2: Manual Download
1. Go to [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Download MongoDB Community Server for Windows
3. Run the installer
4. Follow the installation wizard

### Start MongoDB Service
```bash
# Start as Windows Service
net start MongoDB

# Or run manually (in a separate terminal)
mongod
```

### Verify Installation
```bash
# Check if MongoDB is running
mongosh --eval "db.runCommand('ping')"
```

## 🔧 Configuration

The `.env` file is pre-configured for local MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/expense-tracker
```

## 📊 Database Structure

The application will automatically create these collections:
- `users` - User accounts and authentication
- `companies` - Company information
- `expenses` - Expense records
- `approvalrules` - Approval workflow rules
- `transactions` - Payment/reimbursement records
- `auditlogs` - Compliance audit trails

## 🐛 Troubleshooting

### MongoDB Won't Start
- Check if port 27017 is available: `netstat -ano | findstr :27017`
- Kill any conflicting processes
- Try running as Administrator

### Connection Issues
- Ensure MongoDB service is running
- Check firewall settings
- Verify connection string in `.env`

### Permission Issues
- Run Command Prompt as Administrator
- Check MongoDB installation directory permissions

## ✅ Verification

Once MongoDB is running, start the backend:
```bash
cd backend
npm run dev
```

You should see:
```
MongoDB Connected: localhost
Server running in development mode on port 5000
```

## 📝 Notes

- All data is stored locally on your machine
- No cloud costs or external dependencies
- Full control over your data
- Suitable for development and small-scale production

### 1. Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project called "Expense-Tracker"

### 2. Create a Cluster
1. Click "Build a Database"
2. Choose "M0 Cluster" (Free tier)
3. Select your preferred cloud provider and region
4. Click "Create Cluster" (takes 5-10 minutes)

### 3. Set up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username: `expenseuser`
5. Set password: `expensepass123` (or your choice)
6. Click "Add User"

### 4. Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 5. Get Connection String
1. Go to "Clusters" and click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. It should look like: `mongodb+srv://expenseuser:expensepass123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### 6. Update Environment Variables
1. Open `backend/.env`
2. Replace the MONGODB_URI with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://expenseuser:expensepass123@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority
   ```

### 7. Test Connection with MongoDB Compass
1. Install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Open Compass and paste your connection string
3. Click "Connect"
4. You should see your cluster and can create the `expense-tracker` database

## 🔧 Alternative: Local MongoDB Setup

If you prefer local MongoDB:

### Windows Installation
```bash
# Using winget
winget install MongoDB.Server

# Or download from: https://www.mongodb.com/try/download/community
```

### Start MongoDB Service
```bash
# Windows Service (if installed as service)
net start MongoDB

# Or run manually
mongod
```

### Update .env
Keep the default local connection:
```
MONGODB_URI=mongodb://localhost:27017/expense-tracker
```

## ✅ Verification

Once set up, run the backend:
```bash
cd backend
npm run dev
```

You should see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net (or localhost)
Server running in development mode on port 5000
```

## 🐛 Troubleshooting

### Connection Issues
- **Atlas**: Check IP whitelist and credentials
- **Local**: Ensure MongoDB service is running
- **Compass**: Verify connection string format

### Common Errors
- `Authentication failed`: Check username/password in Atlas
- `Connection timed out`: Check network access rules
- `Database not found`: Database is created automatically on first write

## 📊 Database Structure

The application will create these collections:
- `users` - User accounts and authentication
- `companies` - Company information
- `expenses` - Expense records
- `approvalrules` - Approval workflow rules
- `transactions` - Payment/reimbursement records
- `auditlogs` - Compliance audit trails

## 🔒 Security Notes

- Change default passwords in production
- Restrict IP access in production
- Use environment variables for all secrets
- Enable database authentication</content>
<parameter name="filePath">e:\Expense-Tracker\docs\MONGODB_SETUP.md