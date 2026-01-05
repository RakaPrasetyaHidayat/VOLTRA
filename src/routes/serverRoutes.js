const express = require('express');
const router = express.Router();
const { create, join, getAll } = require('../controllers/serverController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Servers
 *   description: Server management
 */

/**
 * @swagger
 * /api/servers:
 *   post:
 *     summary: Create a server
 *     tags: [Servers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', protect, create);

/**
 * @swagger
 * /api/servers/join:
 *   post:
 *     summary: Join a server
 *     tags: [Servers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Joined
 */
router.post('/join', protect, join);

/**
 * @swagger
 * /api/servers:
 *   get:
 *     summary: Get all servers for user
 *     tags: [Servers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', protect, getAll);

module.exports = router;
