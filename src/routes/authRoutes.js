const express = require('express');
const passport = require('passport');
const { generateToken } = require('../utils/jwtUtils');

const router = express.Router();
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

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
