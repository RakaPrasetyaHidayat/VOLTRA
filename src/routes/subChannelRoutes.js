const express = require('express');
const router = express.Router();
const subChannelController = require('../controllers/subChannelController');
const { protect } = require('../middleware/authMiddleware');


/**
 * @swagger
 * tags:
 *   name: SubChannels
 *   description: Division/Sub-channel management
 */

/**
 * @swagger
 * /api/sub-channels:
 *   post:
 *     summary: Create a new sub-channel
 *     tags: [SubChannels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - channelId
 *               - name
 *             properties:
 *               channelId:
 *                 type: integer
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sub-channel created
 */
router.post('/', protect, subChannelController.create);

/**
 * @swagger
 * /api/sub-channels/channel/{channelId}:
 *   get:
 *     summary: Get all sub-channels for a channel
 *     tags: [SubChannels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of sub-channels with average progress
 */
router.get('/channel/:channelId', protect, subChannelController.getByChannel);

module.exports = router;
