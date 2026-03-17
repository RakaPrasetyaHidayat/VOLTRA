const multer = require('multer');
const ErrorHandler = require('../utils/errorHandler');

// Use memory storage (no persistent disk on Vercel)
const storage = multer.memoryStorage();

// Filter: only allow image files
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ErrorHandler('Only image files (JPEG, PNG, GIF, WEBP) are allowed', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max
  },
});

// Middleware for single avatar upload
const uploadAvatar = upload.single('avatar');

module.exports = { uploadAvatar };
