const express = require('express');
const router = express.Router();
const { create, join, getAll } = require('../controllers/serverController');
const { protect } = require('../middleware/authMiddleware');


/**
 * @swagger
 * tags:
 *   name: Servers
 *   description: Server management and collaboration
 */

/**
 * @swagger
 * /api/servers:
 *   post:
 *     summary: Create a new server
 *     tags: [Servers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Server created successfully
 */
router.post('/', protect, create);

/**
 * @swagger
 * /api/servers/join:
 *   post:
 *     summary: Join a server using invite token
 *     tags: [Servers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inviteToken
 *             properties:
 *               inviteToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Joined successfully
 *       404:
 *         description: Server not found
 */
router.post('/join', protect, join);

/**
 * @swagger
 * /api/servers:
 *   get:
 *     summary: Get all servers for current user
 *     tags: [Servers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of servers
 */
router.get('/', protect, getAll);

module.exports = router;
