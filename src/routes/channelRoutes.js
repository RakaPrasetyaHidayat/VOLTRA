const express = require('express');
const router = express.Router();
const { create, getByServer, getDetail } = require('../controllers/channelController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Channels
 *   description: Channel management
 */

/**
 * @swagger
 * /api/channels:
 *   post:
 *     summary: Create a channel
 *     tags: [Channels]
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
 * /api/channels/server/{serverId}:
 *   get:
 *     summary: Get channels by server
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
 *         description: OK
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
 *         description: OK
 */
router.get('/:id', protect, getDetail);

module.exports = router;
