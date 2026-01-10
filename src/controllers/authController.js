const db = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { generateToken } = require('../utils/jwtUtils');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');
const mailService = require('../services/mailService');
const validator = require('validator');

exports.register = asyncHandler(async (req, res, next) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return next(new ErrorHandler('Email, password, and full name are required', 400));
  }

  if (!validator.isEmail(email)) {
    return next(new ErrorHandler('Invalid email format', 400));
  }

  if (!email.toLowerCase().endsWith('@gmail.com')) {
    return next(new ErrorHandler('Only Gmail addresses are allowed for registration', 400));
  }

  // Check if user already exists
  const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    return next(new ErrorHandler('User with this email already exists', 400));
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Insert user
  const result = await db.query(
    'INSERT INTO users (email, password, full_name, is_verified, verification_token, verification_token_expires) VALUES ($1, $2, $3, FALSE, $4, $5) RETURNING id, email, full_name, avatar_url, created_at',
    [email, hashedPassword, fullName, verificationToken, tokenExpires]
  );

  const user = result.rows[0];

  // Send verification email
  try {
    await mailService.sendVerificationEmail(email, verificationToken);
  } catch (error) {
    console.error('Error sending verification email:', error);
    // We still registered the user, but email failed. 
    // In a real app, we might want to handle this better.
  }

  return response.success(res, 201, { user }, 'User registered successfully. Please check your email to verify your account.');
});

exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return next(new ErrorHandler('Verification token is required', 400));
  }

  const result = await db.query(
    'SELECT * FROM users WHERE verification_token = $1 AND verification_token_expires > NOW()',
    [token]
  );

  if (result.rows.length === 0) {
    return next(new ErrorHandler('Invalid or expired verification token', 400));
  }

  const user = result.rows[0];

  await db.query(
    'UPDATE users SET is_verified = TRUE, verification_token = NULL, verification_token_expires = NULL WHERE id = $1',
    [user.id]
  );

  return response.success(res, 200, null, 'Email verified successfully. You can now login.');
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

  if (!user.is_verified) {
    return next(new ErrorHandler('Please verify your email before logging in', 401));
  }

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
