const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subChannelId:
 *                 type: integer
 *               name:
 *                 type: string
 *               details:
 *                 type: string
 *               completionPercentage:
 *                 type: integer
 *               assignedUserId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Task created
 */
router.post('/', protect, taskController.create);

/**
 * @swagger
 * /api/tasks/sub-channel/{subChannelId}:
 *   get:
 *     summary: Get all tasks for a sub-channel
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subChannelId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of tasks with assigned person name
 */
router.get('/sub-channel/:subChannelId', protect, taskController.getBySubChannel);

/**
 * @swagger
 * /api/tasks/{id}/progress:
 *   patch:
 *     summary: Update task completion percentage
 *     tags: [Tasks]
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
 *               completionPercentage:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Progress updated
 */
router.patch('/:id/progress', protect, taskController.updateProgress);

module.exports = router;
