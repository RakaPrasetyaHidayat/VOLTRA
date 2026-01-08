const express = require('express');
const router = express.Router();
const { create, getByServer, getDetail } = require('../controllers/channelController');
const { protect } = require('../middleware/authMiddleware');


router.post('/', protect, create);

router.get('/server/:serverId', protect, getByServer);

router.get('/:id', protect, getDetail);

module.exports = router;
