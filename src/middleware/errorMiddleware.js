const ErrorHandler = require('../utils/errorHandler');

/**
 * Middleware handler error terpusat
 */
module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error cuma di non-production biar dev bisa liat
  if (process.env.NODE_ENV !== 'production' && !err.statusCode) {
    console.error(err);
  }

  // Tangani error Postgres tertentu (duplicate key)
  if (err.code === '23505') {
    error = new ErrorHandler('Duplicate field value entered', 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};
