const multer = require('multer');
const path = require('path');

// Instead of disk storage, we'll use memory storage since we'll upload to Cloudinary
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept images and videos only
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'), false);
  }
};

// Create the multer upload instance
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit (Cloudinary free plan allows up to 25MB)
  }
});

module.exports = upload;
