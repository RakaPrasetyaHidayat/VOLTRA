const express = require('express');
const db = require('../config/db');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Test
 *   description: API Testing and Health Checks
 */

/**
 * @swagger
 * /api/test/test-db:
 *   get:
 *     summary: Test database connection
 *     tags: [Test]
 *     description: Checks if the connection to NeonDB is active and returns the current time from the DB.
 *     responses:
 *       200:
 *         description: Connection successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       500:
 *         description: Connection failed
 */
router.get('/test-db', async (req, res) => {
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
