const authRoutes = require('./auth.routes');
// TODO: Import other routes as they are created
// const userRoutes = require('./user.routes');
// const expenseRoutes = require('./expense.routes');
// const approvalRoutes = require('./approval.routes');
// const ruleRoutes = require('./rule.routes');
// const uploadRoutes = require('./upload.routes');
// const companyRoutes = require('./company.routes');

const setupRoutes = (app) => {
  const API_VERSION = process.env.API_VERSION || 'v1';

  // Auth routes
  app.use(`/api/${API_VERSION}/auth`, authRoutes);

  // TODO: Add other routes
  // app.use(`/api/${API_VERSION}/users`, userRoutes);
  // app.use(`/api/${API_VERSION}/expenses`, expenseRoutes);
  // app.use(`/api/${API_VERSION}/approvals`, approvalRoutes);
  // app.use(`/api/${API_VERSION}/rules`, ruleRoutes);
  // app.use(`/api/${API_VERSION}/uploads`, uploadRoutes);
  // app.use(`/api/${API_VERSION}/company`, companyRoutes);
};

module.exports = setupRoutes;
