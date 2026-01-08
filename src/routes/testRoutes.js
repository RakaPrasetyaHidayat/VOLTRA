const express = require('express');
const db = require('../config/db');
const router = express.Router();


router.get('/test-db', async (req, res) => {
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({
      status: 'error',
      message: 'Database not configured on this environment. Set DATABASE_URL to test DB connection.'
    });
  }

  try {
    const result = await db.query('SELECT NOW() as current_time, current_database() as database');
    res.status(200).json({
      status: 'success',
      message: 'Database connection is working!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

module.exports = router;
