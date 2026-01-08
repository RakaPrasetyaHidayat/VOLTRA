const db = require('../config/db');
const bcrypt = require('bcryptjs');
const ErrorHandler = require('../utils/errorHandler');

const findUserByEmail = async (email) => {
  const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0] || null;
};

const createUser = async ({ email, passwordHash, username, fullName, jobTitle, division, bio, company, avatarUrl }) => {
  const result = await db.query(
    'INSERT INTO users (email, password, username, full_name, job_title, division, bio, company, avatar_url, is_verified) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, TRUE) RETURNING *',
    [email, passwordHash, username, fullName, jobTitle, division, bio, company, avatarUrl]
  );
  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  createUser,
};
