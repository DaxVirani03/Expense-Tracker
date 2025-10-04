const ApiResponse = require('../utils/apiResponse');
const { USER_ROLES, ERROR_MESSAGES } = require('../utils/constants');

/**
 * Check if user has required role(s)
 * @param  {...string} roles - Required roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json(ApiResponse.unauthorized(ERROR_MESSAGES.UNAUTHORIZED));
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json(
          ApiResponse.forbidden(
            `User role '${req.user.role}' is not authorized to access this resource`
          )
        );
    }

    next();
  };
};

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== USER_ROLES.ADMIN) {
    return res
      .status(403)
      .json(ApiResponse.forbidden('Admin access required'));
  }
  next();
};

/**
 * Check if user is manager or above
 */
const isManagerOrAbove = (req, res, next) => {
  const allowedRoles = [USER_ROLES.MANAGER, USER_ROLES.ADMIN, USER_ROLES.FINANCE, USER_ROLES.DIRECTOR];
  
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res
      .status(403)
      .json(ApiResponse.forbidden('Manager access or above required'));
  }
  next();
};

/**
 * Check if user can access resource
 * Admins can access all, others only their own
 */
const canAccessResource = (req, res, next) => {
  const resourceUserId = req.params.userId || req.body.userId || req.query.userId;
  
  // Admins can access all resources
  if (req.user.role === USER_ROLES.ADMIN) {
    return next();
  }
  
  // Users can only access their own resources
  if (resourceUserId && req.user._id.toString() !== resourceUserId.toString()) {
    return res
      .status(403)
      .json(ApiResponse.forbidden('You can only access your own resources'));
  }
  
  next();
};

module.exports = {
  authorize,
  isAdmin,
  isManagerOrAbove,
  canAccessResource,
};