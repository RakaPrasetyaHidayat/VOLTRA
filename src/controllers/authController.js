const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtUtils');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');
const { validateEmail, validatePassword, validateString, validateInputSanitization } = require('../middleware/validator');

exports.register = asyncHandler(async (req, res, next) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return next(new ErrorHandler('Email, password, and full name are required', 400));
  }

  try {
    validateEmail(email);
    validatePassword(password);
    validateString(username, 'Full name', 1, 255);
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
    'INSERT INTO users (email, password, full_name, is_verified) VALUES ($1, $2, $3, TRUE) RETURNING id, email, full_name, avatar_url, is_verified, created_at',
    [email, hashedPassword, username]
  );

  const user = result.rows[0];

  const token = generateToken(user.id);

  const userResp = {
    id: user.id,
    email: user.email,
    username: user.full_name,
    avatarUrl: user.avatar_url,
    isVerified: user.is_verified,
    createdAt: user.created_at
  };

  return response.success(res, 201, { user: userResp, token }, 'User registered successfully.');
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
    username: user.full_name,
    avatarUrl: user.avatar_url,
    isVerified: user.is_verified,
    createdAt: user.created_at
  };

  return response.success(res, 200, { user: userResp, token }, 'Login successful');
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const result = await db.query('SELECT id, email, username, full_name, avatar_url, company, office_position, division, bio, is_verified, created_at, updated_at FROM users WHERE id = $1', [userId], userId);

  if (result.rows.length === 0) {
    return next(new ErrorHandler('User not found', 404));
  }

  return response.success(res, 200, result.rows[0]);
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { username, avatar, company, officePosition, division, bio } = req.body;

  const updates = {};
  const values = [];
  let paramIndex = 1;

  if (username !== undefined) {
    try {
      validateString(username, 'Full name', 1, 255);
    } catch (err) {
      return next(err);
    }
    updates['full_name'] = `$${paramIndex}`;
    values.push(username);
    paramIndex++;
  }

  if (username !== undefined) {
    try {
      validateString(username, 'Username', 1, 255);
    } catch (err) {
      return next(err);
    }
    updates['username'] = `$${paramIndex}`;
    values.push(username);
    paramIndex++;
  }

  // Handle avatar from JSON body (base64 string or URL)
  if (avatar !== undefined) {
    updates['avatar_url'] = `$${paramIndex}`;
    values.push(avatar);
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
    `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING id, email, username, full_name, avatar_url, company, office_position, division, bio, is_verified, created_at, updated_at`,
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
  const { company, officePosition, division, bio, avatar, username } = req.body;

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

  // Handle avatar from JSON body (base64 string or URL)
  const avatarUrl = avatar || null;

  let query, params;
  if (avatarUrl && username) {
    query = 'UPDATE users SET company = $1, office_position = $2, division = $3, bio = $4, avatar_url = $5, username = $6, updated_at = NOW() WHERE id = $7 RETURNING id, email, username, full_name, avatar_url, company, office_position, division, bio, is_verified, created_at, updated_at';
    params = [company, officePosition, division, bio, avatarUrl, username, userId];
  } else if (avatarUrl) {
    query = 'UPDATE users SET company = $1, office_position = $2, division = $3, bio = $4, avatar_url = $5, updated_at = NOW() WHERE id = $6 RETURNING id, email, username, full_name, avatar_url, company, office_position, division, bio, is_verified, created_at, updated_at';
    params = [company, officePosition, division, bio, avatarUrl, userId];
  } else if (username) {
    query = 'UPDATE users SET company = $1, office_position = $2, division = $3, bio = $4, username = $5, updated_at = NOW() WHERE id = $6 RETURNING id, email, username, full_name, avatar_url, company, office_position, division, bio, is_verified, created_at, updated_at';
    params = [company, officePosition, division, bio, username, userId];
  } else {
    query = 'UPDATE users SET company = $1, office_position = $2, division = $3, bio = $4, updated_at = NOW() WHERE id = $5 RETURNING id, email, username, full_name, avatar_url, company, office_position, division, bio, is_verified, created_at, updated_at';
    params = [company, officePosition, division, bio, userId];
  }

  const result = await db.query(query, params, userId);

  if (result.rows.length === 0) {
    return next(new ErrorHandler('User not found', 404));
  }

  return response.success(res, 201, result.rows[0], 'Profile created successfully');
});
