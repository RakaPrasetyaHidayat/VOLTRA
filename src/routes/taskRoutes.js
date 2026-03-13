const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { apiRateLimiter } = require('../middleware/rateLimiter');

router.use(apiRateLimiter);

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management within divisions
 */

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
 *             required:
 *               - divisiId
 *               - name
 *             properties:
 *               divisiId:
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
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task detail
 *     tags: [Tasks]
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
 *         description: Task details
 */
router.get('/:id', protect, taskController.getDetail);

/**
 * @swagger
 * /api/tasks/division/{divisiId}:
 *   get:
 *     summary: Get all tasks for a division
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: divisiId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/division/:divisiId', protect, taskController.getByDivision);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
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
 *               name:
 *                 type: string
 *               details:
 *                 type: string
 *               completionPercentage:
 *                 type: integer
 *               assignedUserId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Task updated
 */
router.put('/:id', protect, taskController.update);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
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
 *         description: Task deleted
 */
router.delete('/:id', protect, taskController.delete);

/**
 * @swagger
 * /api/tasks/{id}/progress:
 *   patch:
 *     summary: Update task progress percentage
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
 *             required:
 *               - completionPercentage
 *             properties:
 *               completionPercentage:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Progress updated
 */
router.patch('/:id/progress', protect, taskController.updateProgress);

/**
 * @swagger
 * /api/tasks/stats/{subChannelId}:
 *   get:
 *     summary: Get task statistics for a sub-channel
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
 *         description: Task statistics
 */
router.get('/stats/:subChannelId', protect, taskController.getStats);

module.exports = router;
