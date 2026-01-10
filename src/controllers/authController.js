const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtUtils');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');

exports.register = asyncHandler(async (req, res, next) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return next(new ErrorHandler('Email, password, and full name are required', 400));
  }

  // Check if user already exists
  const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    return next(new ErrorHandler('User with this email already exists', 400));
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert user
  const result = await db.query(
    'INSERT INTO users (email, password, full_name, is_verified) VALUES ($1, $2, $3, TRUE) RETURNING id, email, full_name, avatar_url, created_at',
    [email, hashedPassword, fullName]
  );

  const user = result.rows[0];
  const token = generateToken(user.id);

  return response.success(res, 201, { user, token }, 'User registered successfully');
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Email and password are required', 400));
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
  const { fullName, avatarUrl } = req.body;

  const result = await db.query(
    'UPDATE users SET full_name = $1, avatar_url = $2 WHERE id = $3 RETURNING id, email, full_name, avatar_url, is_verified, created_at',
    [fullName, avatarUrl, userId],
    userId
  );

  if (result.rows.length === 0) {
    return next(new ErrorHandler('User not found', 404));
  }

  return response.success(res, 200, result.rows[0], 'Profile updated successfully');
});

// Google ID token sign-in (for mobile/SPAs that send id_token directly)
exports.googleTokenAuth = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new ErrorHandler('idToken is required', 400));
  }

  // Verify token with Google's tokeninfo endpoint
  const resp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
  if (!resp.ok) {
    return next(new ErrorHandler('Invalid Google ID token', 401));
  }

  const payload = await resp.json();
  const email = payload.email;
  const googleId = payload.sub;
  const displayName = payload.name || '';
  const avatarUrl = payload.picture || null;

  if (!email || !googleId) {
    return next(new ErrorHandler('Invalid Google token payload', 400));
  }

  // find or create user
  let userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  let user;

  if (userResult.rows.length === 0) {
    const newUser = await db.query(
      'INSERT INTO users (full_name, email, avatar_url, is_verified) VALUES ($1, $2, $3, TRUE) RETURNING *',
      [displayName, email, avatarUrl]
    );
    user = newUser.rows[0];
  } else {
    user = userResult.rows[0];
  }

  const oauthResult = await db.query('SELECT * FROM oauth_accounts WHERE provider = $1 AND provider_user_id = $2', ['google', googleId]);
  if (oauthResult.rows.length === 0) {
    await db.query('INSERT INTO oauth_accounts (user_id, provider, provider_user_id) VALUES ($1, $2, $3)', [user.id, 'google', googleId]);
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

  return response.success(res, 200, { user: userResp, token }, 'Google sign-in successful');
});
