const express = require('express');
const router = express.Router();
const { create, join, getAll, update, delete: deleteServer } = require('../controllers/serverController');
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

/**
 * @swagger
 * /api/servers/{id}:
 *   put:
 *     summary: Update a server (owner only)
 *     tags: [Servers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.put('/:id', protect, update);

/**
 * @swagger
 * /api/servers/{id}:
 *   delete:
 *     summary: Delete a server (owner only)
 *     tags: [Servers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete('/:id', protect, deleteServer);

module.exports = router;
