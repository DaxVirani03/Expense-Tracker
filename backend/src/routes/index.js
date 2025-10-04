const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const expenseRoutes = require('./expense.routes');
const companyRoutes = require('./company.routes');
const dashboardRoutes = require('./dashboard.routes');

const setupRoutes = (app) => {
  const API_VERSION = process.env.API_VERSION || 'v1';

  // Auth routes
  app.use(`/api/${API_VERSION}/auth`, authRoutes);

  // User routes
  app.use(`/api/${API_VERSION}/users`, userRoutes);

  // Expense routes
  app.use(`/api/${API_VERSION}/expenses`, expenseRoutes);

  // Company routes
  app.use(`/api/${API_VERSION}/company`, companyRoutes);

  // Dashboard routes
  app.use(`/api/${API_VERSION}/dashboard`, dashboardRoutes);
};

module.exports = setupRoutes;
