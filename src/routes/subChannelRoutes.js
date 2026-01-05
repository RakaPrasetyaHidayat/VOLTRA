const express = require('express');
const router = express.Router();
const subChannelController = require('../controllers/subChannelController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: SubChannels
 *   description: Sub-channel management
 */

/**
 * @swagger
 * /api/sub-channels:
 *   post:
 *     summary: Create a sub-channel
 *     tags: [SubChannels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channelId:
 *                 type: integer
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', protect, subChannelController.create);

/**
 * @swagger
 * /api/sub-channels/channel/{channelId}:
 *   get:
 *     summary: Get sub-channels by channel id
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
 *         description: OK
 */
router.get('/channel/:channelId', protect, subChannelController.getByChannel);

module.exports = router;
