const express = require('express');
const router = express.Router();
const subChannelController = require('../controllers/subChannelController');
const { protect } = require('../middleware/authMiddleware');
const { apiRateLimiter } = require('../middleware/rateLimiter');

router.use(apiRateLimiter);

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
 * /api/sub-channels/{id}:
 *   get:
 *     summary: Get sub-channel detail
 *     tags: [SubChannels]
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
 *         description: Sub-channel details
 */
router.get('/:id', protect, subChannelController.getDetail);

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

/**
 * @swagger
 * /api/sub-channels/{id}:
 *   put:
 *     summary: Update a sub-channel
 *     tags: [SubChannels]
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
 *               channelId:
 *                 type: integer
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sub-channel updated
 */
router.put('/:id', protect, subChannelController.update);

/**
 * @swagger
 * /api/sub-channels/{id}:
 *   delete:
 *     summary: Delete a sub-channel
 *     tags: [SubChannels]
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
 *               channelId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Sub-channel deleted
 */
router.delete('/:id', protect, subChannelController.delete);

module.exports = router;
