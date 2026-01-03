const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');

/**
 * Middleware buat nge-protect route pake JWT
 */
const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorHandler('Not authorized, no token', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ErrorHandler('Not authorized, token failed', 401));
  }
};

module.exports = { protect };
