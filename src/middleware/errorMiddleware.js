const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log for developer
  if (process.env.NODE_ENV !== 'production') {
    console.error('ERROR 💥:', err);
  }

  // Postgres unique constraint
  if (err.code === '23505') {
    error = new ErrorHandler('Duplicate field value entered', 400);
  }

  // Postgres foreign key violation
  if (err.code === '23503') {
    error = new ErrorHandler('Resource not found or foreign key constraint fails', 404);
  }

  // Postgres invalid text representation (e.g., invalid UUID)
  if (err.code === '22P02') {
    error = new ErrorHandler('Invalid input format', 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
