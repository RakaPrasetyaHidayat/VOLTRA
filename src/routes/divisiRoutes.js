const express = require('express');
const router = express.Router();
const divisiController = require('../controllers/divisiController');
const { protect } = require('../middleware/authMiddleware');
const { apiRateLimiter } = require('../middleware/rateLimiter');

router.use(apiRateLimiter);

/**
 * @swagger
 * tags:
 *   name: Divisions
 *   description: Division management
 */

/**
 * @swagger
 * /api/divisions:
 *   post:
 *     summary: Create a new division
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - name
 *             properties:
 *               projectId:
 *                 type: integer
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Division created
 */
router.post('/', protect, divisiController.create);

/**
 * @swagger
 * /api/divisions/{id}:
 *   get:
 *     summary: Get division detail
 *     tags: [Divisions]
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
 *         description: Division details
 */
router.get('/:id', protect, divisiController.getDetail);

/**
 * @swagger
 * /api/divisions/project/{projectId}:
 *   get:
 *     summary: Get all divisions for a project
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of divisions with average progress
 */
router.get('/project/:projectId', protect, divisiController.getByProject);

/**
 * @swagger
 * /api/divisions/{id}:
 *   put:
 *     summary: Update a division
 *     tags: [Divisions]
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
 *               projectId:
 *                 type: integer
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Division updated
 */
router.put('/:id', protect, divisiController.update);

/**
 * @swagger
 * /api/divisions/{id}:
 *   delete:
 *     summary: Delete a division
 *     tags: [Divisions]
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
 *               projectId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Division deleted
 */
router.delete('/:id', protect, divisiController.delete);

module.exports = router;
