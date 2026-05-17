const logger = require('../utils/logger');

/**
 * Centralised Express error handler.
 * Must be registered LAST (after all routes).
 *
 * In production: hides stack traces from the client.
 * In development: exposes full stack for easier debugging.
 */
const errorHandler = (err, req, res, next) => {
  const isProd   = process.env.NODE_ENV === 'production';
  const status   = err.statusCode || err.status || 500;
  const message  = err.message   || 'Internal server error';

  // Always log the full error server-side
  logger.error(`[${req.method}] ${req.originalUrl} → ${status}: ${message}`, {
    stack:  err.stack,
    body:   req.body,
    params: req.params,
    query:  req.query,
    userId: req.user?.userId,
  });

  const body = {
    success: false,
    error:   message,
    // Only expose the stack in non-production environments
    ...(isProd ? {} : { stack: err.stack }),
  };

  return res.status(status).json(body);
};

module.exports = errorHandler;
