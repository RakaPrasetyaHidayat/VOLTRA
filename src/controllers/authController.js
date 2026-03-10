const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtUtils');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');
const { validateEmail, validatePassword, validateString, validateInputSanitization } = require('../middleware/validator');

exports.register = asyncHandler(async (req, res, next) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return next(new ErrorHandler('Email, password, and full name are required', 400));
  }

  try {
    validateEmail(email);
    validatePassword(password);
    validateString(fullName, 'Full name', 1, 255);
  } catch (err) {
    return next(err);
  }

  const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    return next(new ErrorHandler('User with this email already exists', 400));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await db.query(
    'INSERT INTO users (email, password, full_name, is_verified) VALUES ($1, $2, $3, TRUE) RETURNING id, email, full_name, avatar_url, created_at',
    [email, hashedPassword, fullName]
  );

  const user = result.rows[0];

  return response.success(res, 201, { user }, 'User registered successfully.');
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Email and password are required', 400));
  }

  try {
    validateEmail(email);
  } catch (err) {
    return next(err);
  }

  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    return next(new ErrorHandler('Invalid credentials', 401));
  }

  const user = result.rows[0];

  if (!user.password) {
    return next(new ErrorHandler('Please use social login for this account', 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler('Invalid credentials', 401));
  }

  const token = generateToken(user.id);

  const userResp = {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    avatarUrl: user.avatar_url,
    isVerified: user.is_verified,
    createdAt: user.created_at
  };

  return response.success(res, 200, { user: userResp, token }, 'Login successful');
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const result = await db.query('SELECT id, email, full_name, avatar_url, is_verified, created_at FROM users WHERE id = $1', [userId], userId);

  if (result.rows.length === 0) {
    return next(new ErrorHandler('User not found', 404));
  }

  return response.success(res, 200, result.rows[0]);
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { fullName, avatarUrl, company, officePosition, division, bio } = req.body;

  const updates = {};
  const values = [];
  let paramIndex = 1;

  if (fullName !== undefined) {
    try {
      validateString(fullName, 'Full name', 1, 255);
    } catch (err) {
      return next(err);
    }
    updates['full_name'] = `$${paramIndex}`;
    values.push(fullName);
    paramIndex++;
  }

  if (avatarUrl !== undefined) {
    updates['avatar_url'] = `$${paramIndex}`;
    values.push(avatarUrl);
    paramIndex++;
  }

  if (company !== undefined) {
    try {
      validateString(company, 'Company', 1, 255);
    } catch (err) {
      return next(err);
    }
    updates['company'] = `$${paramIndex}`;
    values.push(company);
    paramIndex++;
  }

  if (officePosition !== undefined) {
    try {
      validateString(officePosition, 'Office position', 1, 255);
    } catch (err) {
      return next(err);
    }
    updates['office_position'] = `$${paramIndex}`;
    values.push(officePosition);
    paramIndex++;
  }

  if (division !== undefined) {
    try {
      validateString(division, 'Division', 1, 255);
    } catch (err) {
      return next(err);
    }
    updates['division'] = `$${paramIndex}`;
    values.push(division);
    paramIndex++;
  }

  if (bio !== undefined) {
    try {
      validateString(bio, 'Bio', 1, 1000);
    } catch (err) {
      return next(err);
    }
    updates['bio'] = `$${paramIndex}`;
    values.push(bio);
    paramIndex++;
  }

  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler('At least one field is required for update', 400));
  }

  const setClause = Object.entries(updates).map(([key, value]) => `${key} = ${value}`).join(', ');
  values.push(userId);

  const result = await db.query(
    `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING id, email, full_name, avatar_url, company, office_position, division, bio, is_verified, created_at`,
    values,
    userId
  );

  if (result.rows.length === 0) {
    return next(new ErrorHandler('User not found', 404));
  }

  return response.success(res, 200, result.rows[0], 'Profile updated successfully');
});

exports.createProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { company, officePosition, division, bio } = req.body;

  if (!company || !officePosition || !division || !bio) {
    return next(new ErrorHandler('Company, office position, division, and bio are required', 400));
  }

  try {
    validateString(company, 'Company', 1, 255);
    validateString(officePosition, 'Office position', 1, 255);
    validateString(division, 'Division', 1, 255);
    validateString(bio, 'Bio', 1, 1000);
  } catch (err) {
    return next(err);
  }

  const result = await db.query(
    'UPDATE users SET company = $1, office_position = $2, division = $3, bio = $4, updated_at = NOW() WHERE id = $5 RETURNING id, email, full_name, avatar_url, company, office_position, division, bio, is_verified, created_at',
    [company, officePosition, division, bio, userId],
    userId
  );

  if (result.rows.length === 0) {
    return next(new ErrorHandler('User not found', 404));
  }

  return response.success(res, 201, result.rows[0], 'Profile created successfully');
});
