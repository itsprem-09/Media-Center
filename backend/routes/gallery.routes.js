const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallery.controller');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', galleryController.getAllGalleries);
router.get('/:id', galleryController.getGalleryById);

// Protected routes (admin only)
router.post('/', auth, isAdmin, galleryController.createGallery);
router.put('/:id', auth, isAdmin, galleryController.updateGallery);
router.post('/:id/images', auth, isAdmin, galleryController.addImageToGallery);
router.delete('/:id/images/:imageId', auth, isAdmin, galleryController.removeImageFromGallery);
router.delete('/:id', auth, isAdmin, galleryController.deleteGallery);

module.exports = router;
