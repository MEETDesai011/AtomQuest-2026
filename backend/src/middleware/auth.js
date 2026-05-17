const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return sendError(res, 'Unauthorized', 401);
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return sendError(res, 'Token expired or invalid', 401);
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Forbidden: insufficient permissions', 403);
    }
    next();
  };
};

module.exports = { requireAuth, requireRole };
