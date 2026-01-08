const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtUtils');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const response = require('../utils/response');

exports.register = asyncHandler(async (req, res, next) => {
  const { email, password, confirmPassword, username, fullName, jobTitle, division, bio, company } = req.body;

  if (!email || !password || !username) {
    return next(new ErrorHandler('Email, password, and username are required', 400));
  }

  if (typeof confirmPassword !== 'undefined' && password !== confirmPassword) {
    return next(new ErrorHandler('Password and confirm password do not match', 400));
  }

  // Check if user already exists
  const existingUser = await db.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
  if (existingUser.rows.length > 0) {
    return next(new ErrorHandler('User with this email or username already exists', 400));
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert user
  const result = await db.query(
    'INSERT INTO users (email, password, username, full_name, job_title, division, bio, company, is_verified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE) RETURNING id, email, username, full_name, job_title, division, bio, company',
    [email, hashedPassword, username, fullName, jobTitle, division, bio, company]
  );

  const userRow = result.rows[0];
  const user = {
    id: userRow.id,
    email: userRow.email,
    username: userRow.username,
    fullName: userRow.full_name,
    jobTitle: userRow.job_title,
    division: userRow.division,
    bio: userRow.bio,
    company: userRow.company,
    avatarUrl: userRow.avatar_url,
  };

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

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler('Invalid credentials', 401));
  }

  const token = generateToken(user.id);

  const userResp = {
    id: user.id,
    email: user.email,
    username: user.username,
    fullName: user.full_name,
    jobTitle: user.job_title,
    division: user.division,
    bio: user.bio,
    company: user.company,
    avatarUrl: user.avatar_url,
  };

  return response.success(res, 200, { user: userResp, token }, 'Login successful');
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const result = await db.query('SELECT id, email, username, full_name, job_title, division, bio, company, avatar_url FROM users WHERE id = $1', [userId]);
  
  if (result.rows.length === 0) {
    return next(new ErrorHandler('User not found', 404));
  }

  const row = result.rows[0];
  const user = {
    id: row.id,
    email: row.email,
    username: row.username,
    fullName: row.full_name,
    jobTitle: row.job_title,
    division: row.division,
    bio: row.bio,
    company: row.company,
    avatarUrl: row.avatar_url,
  };

  return response.success(res, 200, user);
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { fullName, jobTitle, division, bio, company, avatarUrl } = req.body;

  const result = await db.query(
    'UPDATE users SET full_name = $1, job_title = $2, division = $3, bio = $4, company = $5, avatar_url = $6 WHERE id = $7 RETURNING id, email, username, full_name, job_title, division, bio, company, avatar_url',
    [fullName, jobTitle, division, bio, company, avatarUrl, userId]
  );

  if (result.rows.length === 0) {
    return next(new ErrorHandler('User not found', 404));
  }
  const row = result.rows[0];
  const user = {
    id: row.id,
    email: row.email,
    username: row.username,
    fullName: row.full_name,
    jobTitle: row.job_title,
    division: row.division,
    bio: row.bio,
    company: row.company,
    avatarUrl: row.avatar_url,
  };

  return response.success(res, 200, user, 'Profile updated successfully');
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
    username: user.username,
    fullName: user.full_name,
    jobTitle: user.job_title,
    division: user.division,
    bio: user.bio,
    company: user.company,
    avatarUrl: user.avatar_url,
  };

  return response.success(res, 200, { user: userResp, token }, 'Google sign-in successful');
});
