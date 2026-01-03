const express = require('express');
const router = express.Router();
const { create, join, getAll } = require('../controllers/serverController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, create);
router.post('/join', protect, join);
router.get('/', protect, getAll);

module.exports = router;
