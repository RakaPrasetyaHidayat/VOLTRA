const express = require('express');
const passport = require('passport');
const { generateToken } = require('../utils/jwtUtils');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Start Google OAuth2 flow
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google
 */
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect with token to frontend
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user.id);
    res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth-success?token=${token}`
    );
  }
);

module.exports = router;
