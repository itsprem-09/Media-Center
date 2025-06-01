const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const upload = require('../utils/upload');
const { auth, isAdmin } = require('../middleware/auth');

// Protected routes for file uploads (admin only)
router.post('/image', auth, isAdmin, upload.single('image'), uploadController.uploadImage);
router.post('/video', auth, isAdmin, upload.single('video'), uploadController.uploadVideo);

module.exports = router;
