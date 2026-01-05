const express = require('express');
const router = express.Router();
const subChannelController = require('../controllers/subChannelController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, subChannelController.create);
router.get('/channel/:channelId', protect, subChannelController.getByChannel);

module.exports = router;
