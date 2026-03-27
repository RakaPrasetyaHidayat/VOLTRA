const ErrorHandler = require('../utils/errorHandler');
const validator = require('validator');

const validateEmail = (email) => {
  if (!email || !validator.isEmail(email)) {
    throw new ErrorHandler('Invalid email format', 400);
  }
};

const validatePassword = (password) => {
  if (!password || password.length < 6) {
    throw new ErrorHandler('Password must be at least 6 characters long', 400);
  }
};

const validateString = (value, fieldName, minLength = 1, maxLength = 255) => {
  if (!value || typeof value !== 'string') {
    throw new ErrorHandler(`${fieldName} is required and must be a string`, 400);
  }
  if (value.length < minLength) {
    throw new ErrorHandler(`${fieldName} must be at least ${minLength} character(s)`, 400);
  }
  if (value.length > maxLength) {
    throw new ErrorHandler(`${fieldName} must not exceed ${maxLength} character(s)`, 400);
  }
};

const validateNumber = (value, fieldName, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new ErrorHandler(`${fieldName} must be a valid number`, 400);
  }
  if (num < min || num > max) {
    throw new ErrorHandler(`${fieldName} must be between ${min} and ${max}`, 400);
  }
  return num;
};

const validateCompletionPercentage = (percentage) => {
  const num = parseInt(percentage, 10);
  if (isNaN(num) || num < 0 || num > 100) {
    throw new ErrorHandler('Completion percentage must be a number between 0 and 100', 400);
  }
  return num;
};

const validateInputSanitization = (obj) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = validator.trim(value);
      sanitized[key] = validator.escape(sanitized[key]);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    throw new ErrorHandler('Username is required', 400);
  }
  if (username.length < 3 || username.length > 30) {
    throw new ErrorHandler('Username must be between 3 and 30 characters', 400);
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new ErrorHandler('Username can only contain letters, numbers, and underscores', 400);
  }
};

module.exports = {
  validateEmail,
  validatePassword,
  validateString,
  validateNumber,
  validateCompletionPercentage,
  validateInputSanitization,
  validateUsername,
};
