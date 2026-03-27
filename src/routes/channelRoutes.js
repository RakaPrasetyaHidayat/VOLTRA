const express = require('express');
const router = express.Router();
const { create, getByServer, getDetail, update, delete: deleteChannel } = require('../controllers/channelController');
const { protect } = require('../middleware/authMiddleware');
const { apiRateLimiter } = require('../middleware/rateLimiter');

router.use(apiRateLimiter);

/**
 * @swagger
 * tags:
 *   name: Channels
 *   description: Project channels management
 */

/**
 * @swagger
 * /api/channels:
 *   post:
 *     summary: Create a new channel (project)
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serverId
 *               - name
 *             properties:
 *               serverId:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               techStack:
 *                 type: string
 *               background:
 *                 type: string
 *               problemToSolve:
 *                 type: string
 *     responses:
 *       201:
 *         description: Channel created
 */
router.post('/', protect, create);

/**
 * @swagger
 * /api/channels/server/{serverId}:
 *   get:
 *     summary: Get all channels for a server
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of channels
 */
router.get('/server/:serverId', protect, getByServer);

/**
 * @swagger
 * /api/channels/{id}:
 *   get:
 *     summary: Get channel detail
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Channel details
 *       404:
 *         description: Not found
 */
router.get('/:id', protect, getDetail);

/**
 * @swagger
 * /api/channels/{id}:
 *   put:
 *     summary: Update a channel
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               techStack:
 *                 type: string
 *               background:
 *                 type: string
 *               problemToSolve:
 *                 type: string
 *     responses:
 *       200:
 *         description: Channel updated
 */
router.put('/:id', protect, update);

/**
 * @swagger
 * /api/channels/{id}:
 *   delete:
 *     summary: Delete a channel
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Channel deleted
 */
router.delete('/:id', protect, deleteChannel);

module.exports = router;
