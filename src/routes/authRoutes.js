const express = require('express');
const passport = require('passport');
const { generateToken } = require('../utils/jwtUtils');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authRateLimiter, apiRateLimiter } = require('../middleware/rateLimiter');
const { uploadAvatar } = require('../middleware/uploadMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and User management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully with authorization token
 */
router.post('/register', authRateLimiter, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', authRateLimiter, authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile (includes company, position, division, bio)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile with all fields
 */
router.get('/me', protect, apiRateLimiter, authController.getMe);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update current user profile (all fields optional, supports avatar upload)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: User full name
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture (JPEG, PNG, GIF, WEBP, max 2MB)
 *               username:
 *                 type: string
 *                 description: Username
 *               company:
 *                 type: string
 *                 description: Company name
 *               officePosition:
 *                 type: string
 *                 description: Office position / job title
 *               division:
 *                 type: string
 *                 description: Division
 *               bio:
 *                 type: string
 *                 description: Short bio
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: At least one field is required
 */
router.put('/profile', protect, apiRateLimiter, uploadAvatar, authController.updateProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   post:
 *     summary: Create or update user profile with company details (supports avatar upload)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - company
 *               - officePosition
 *               - division
 *               - bio
 *             properties:
 *               company:
 *                 type: string
 *                 description: Company name
 *               officePosition:
 *                 type: string
 *                 description: Office position / job title
 *               division:
 *                 type: string
 *                 description: Division
 *               bio:
 *                 type: string
 *                 description: Short bio
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture (JPEG, PNG, GIF, WEBP, max 2MB)
 *               username:
 *                 type: string
 *                 description: Username (optional)
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/profile', protect, apiRateLimiter, uploadAvatar, authController.createProfile);

module.exports = router;
