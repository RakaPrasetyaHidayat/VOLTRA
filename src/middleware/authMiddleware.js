const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');

/**
 * Middleware to protect routes with JWT authentication.
 * Sets req.user = { id, email, username } from the decoded token.
 */
const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorHandler('Not authorized, no token provided', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ErrorHandler('Token expired, please login again', 401));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new ErrorHandler('Invalid token', 401));
    }
    return next(new ErrorHandler('Not authorized, token failed', 401));
  }
};

module.exports = { protect };
