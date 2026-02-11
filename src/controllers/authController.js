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

  // Insert user
  const result = await db.query(
    'INSERT INTO users (email, password, full_name, is_verified) VALUES ($1, $2, $3, TRUE) RETURNING id, email, full_name, avatar_url, created_at',
    [email, hashedPassword, fullName]
  );

  const user = result.rows[0];

  return response.success(res, 201, { user }, 'User registered successfully.');
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler('Email is required', 400));
  }

  const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (userResult.rows.length === 0) {
    return next(new ErrorHandler('User not found', 404));
  }

  const user = userResult.rows[0];

  if (!user.password) {
    return next(new ErrorHandler('This account uses Google Login', 400));
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await db.query(
    'INSERT INTO password_resets (user_id, otp_hash, expires_at) VALUES ($1, $2, $3)',
    [user.id, otpHash, expiresAt]
  );

  try {
    await mailService.sendOtpEmail(email, otp, 'Password Reset');
  } catch (error) {
    console.error('Error sending reset OTP email:', error);
  }

  return response.success(res, 200, null, 'OTP for password reset sent to your email');
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return next(new ErrorHandler('Email, OTP, and new password are required', 400));
  }

  const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (userResult.rows.length === 0) {
    return next(new ErrorHandler('User not found', 404));
  }

  const user = userResult.rows[0];

  const otpHash = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');

  const resetResult = await db.query(
    `SELECT * FROM password_resets 
     WHERE user_id = $1 AND otp_hash = $2 AND used = FALSE AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [user.id, otpHash]
  );

  if (resetResult.rows.length === 0) {
    return next(new ErrorHandler('Invalid or expired OTP', 400));
  }

  const resetRequest = resetResult.rows[0];

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password and mark OTP as used
  await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
  await db.query('UPDATE password_resets SET used = TRUE WHERE id = $1', [resetRequest.id]);

  return response.success(res, 200, null, 'Password reset successfully');
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
