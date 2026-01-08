const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, taskController.create);

router.get('/sub-channel/:subChannelId', protect, taskController.getBySubChannel);

router.patch('/:id/progress', protect, taskController.updateProgress);

module.exports = router;
