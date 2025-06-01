const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);

// Protected routes (admin only)
router.post('/', auth, isAdmin, videoController.createVideo);
router.put('/:id', auth, isAdmin, videoController.updateVideo);
router.delete('/:id', auth, isAdmin, videoController.deleteVideo);

module.exports = router;
