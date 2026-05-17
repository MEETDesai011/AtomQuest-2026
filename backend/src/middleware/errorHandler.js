const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  // Temporarily expose all errors to debug Vercel 500
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({ success: false, error: message, stack: err.stack });
};

module.exports = errorHandler;
