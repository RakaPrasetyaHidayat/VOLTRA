const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtUtils');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');
const { validateEmail, validatePassword, validateUsername, validateString } = require('../middleware/validator');

/**
 * Helper: format user row from DB (snake_case) to camelCase response
 */
const formatUser = (row) => ({
  id: row.id,
  email: row.email,
  username: row.username,
  avatarUrl: row.avatar_url || null,
  company: row.company || null,
  officePosition: row.office_position || null,
  division: row.division || null,
  bio: row.bio || null,
  isVerified: row.is_verified,
  createdAt: row.created_at,
  updatedAt: row.updated_at || null,
});

// ─── REGISTER ────────────────────────────────────────────────────────────────
exports.register = asyncHandler(async (req, res, next) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return next(new ErrorHandler('Email, password, and username are required', 400));
  }

  try {
    validateEmail(email);
    validatePassword(password);
    validateUsername(username);
  } catch (err) {
    return next(err);
  }

  // Check duplicate email
  const existingEmail = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingEmail.rows.length > 0) {
    return next(new ErrorHandler('User with this email already exists', 400));
  }

  // Check duplicate username
  const existingUsername = await db.query('SELECT id FROM users WHERE username = $1', [username]);
  if (existingUsername.rows.length > 0) {
    return next(new ErrorHandler('Username is already taken', 400));
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await db.query(
    'INSERT INTO users (email, password, username, is_verified) VALUES ($1, $2, $3, TRUE) RETURNING id, email, username, avatar_url, is_verified, created_at',
    [email, hashedPassword, username]
  );

  const user = result.rows[0];
  const token = generateToken(user);

  return response.success(res, 201, { user: formatUser(user), token }, 'User registered successfully.');
});

// ─── LOGIN ───────────────────────────────────────────────────────────────────
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

  const token = generateToken(user);

  return response.success(res, 200, { user: formatUser(user), token }, 'Login successful');
});

// ─── GET ME ──────────────────────────────────────────────────────────────────
exports.getMe = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const result = await db.query(
    'SELECT id, email, username, avatar_url, company, office_position, division, bio, is_verified, created_at, updated_at FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    return next(new ErrorHandler('User not found', 404));
  }

  return response.success(res, 200, { user: formatUser(result.rows[0]) });
});

// ─── UPDATE PROFILE ──────────────────────────────────────────────────────────
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { username, avatar, company, officePosition, division, bio } = req.body;

  const updates = {};
  const values = [];
  let paramIndex = 1;

  if (username !== undefined) {
    try {
      validateUsername(username);
    } catch (err) {
      return next(err);
    }
    // Check if username is taken by another user
    const existing = await db.query('SELECT id FROM users WHERE username = $1 AND id != $2', [username, userId]);
    if (existing.rows.length > 0) {
      return next(new ErrorHandler('Username is already taken', 400));
    }
    updates['username'] = `$${paramIndex}`;
    values.push(username);
    paramIndex++;
  }

  if (avatar !== undefined) {
    updates['avatar_url'] = `$${paramIndex}`;
    values.push(avatar);
    paramIndex++;
  }

  if (company !== undefined) {
    try { validateString(company, 'Company', 1, 255); } catch (err) { return next(err); }
    updates['company'] = `$${paramIndex}`;
    values.push(company);
    paramIndex++;
  }

  if (officePosition !== undefined) {
    try { validateString(officePosition, 'Office position', 1, 255); } catch (err) { return next(err); }
    updates['office_position'] = `$${paramIndex}`;
    values.push(officePosition);
    paramIndex++;
  }

  if (division !== undefined) {
    try { validateString(division, 'Division', 1, 255); } catch (err) { return next(err); }
    updates['division'] = `$${paramIndex}`;
    values.push(division);
    paramIndex++;
  }

  if (bio !== undefined) {
    try { validateString(bio, 'Bio', 1, 1000); } catch (err) { return next(err); }
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
    `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING id, email, username, avatar_url, company, office_position, division, bio, is_verified, created_at, updated_at`,
    values
  );

  if (result.rows.length === 0) {
    return next(new ErrorHandler('User not found', 404));
  }

  return response.success(res, 200, { user: formatUser(result.rows[0]) }, 'Profile updated successfully');
});

// ─── CREATE PROFILE ──────────────────────────────────────────────────────────
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
    if (username) validateUsername(username);
  } catch (err) {
    return next(err);
  }

  // Build dynamic update using same pattern as updateProfile
  const fields = { company, office_position: officePosition, division, bio };
  const values = [];
  let paramIndex = 1;

  if (avatar) {
    fields['avatar_url'] = avatar;
  }
  if (username) {
    // Check uniqueness
    const existing = await db.query('SELECT id FROM users WHERE username = $1 AND id != $2', [username, userId]);
    if (existing.rows.length > 0) {
      return next(new ErrorHandler('Username is already taken', 400));
    }
    fields['username'] = username;
  }

  const setClauses = [];
  for (const [key, val] of Object.entries(fields)) {
    values.push(val);
    setClauses.push(`${key} = $${paramIndex}`);
    paramIndex++;
  }

  values.push(userId);

  const result = await db.query(
    `UPDATE users SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING id, email, username, avatar_url, company, office_position, division, bio, is_verified, created_at, updated_at`,
    values
  );

  if (result.rows.length === 0) {
    return next(new ErrorHandler('User not found', 404));
  }

  return response.success(res, 201, { user: formatUser(result.rows[0]) }, 'Profile created successfully');
});
