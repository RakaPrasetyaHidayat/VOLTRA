const express = require('express');
const router = express.Router();
const { create, getByServer, getDetail, update, delete: deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { apiRateLimiter } = require('../middleware/rateLimiter');

router.use(apiRateLimiter);

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
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
 *         description: Project created
 */
router.post('/', protect, create);

/**
 * @swagger
 * /api/projects/server/{serverId}:
 *   get:
 *     summary: Get all projects for a server
 *     tags: [Projects]
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
 *         description: List of projects
 */
router.get('/server/:serverId', protect, getByServer);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project detail
 *     tags: [Projects]
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
 *         description: Project details
 *       404:
 *         description: Not found
 */
router.get('/:id', protect, getDetail);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
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
 *         description: Project updated
 */
router.put('/:id', protect, update);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
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
 *         description: Project deleted
 */
router.delete('/:id', protect, deleteProject);

module.exports = router;
