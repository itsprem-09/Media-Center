const Gallery = require('../models/Gallery');

// Get all galleries
exports.getAllGalleries = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const galleries = await Gallery.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Gallery.countDocuments();
    
    res.json({
      galleries,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get galleries error:', error);
    res.status(500).json({ message: 'Server error fetching galleries' });
  }
};

// Get single gallery
exports.getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const gallery = await Gallery.findById(id);
    
    if (!gallery) {
      return res.status(404).json({ message: 'Gallery not found' });
    }
    
    res.json(gallery);
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ message: 'Server error fetching gallery' });
  }
};

// Create new gallery
exports.createGallery = async (req, res) => {
  try {
    const { title, images } = req.body;
    
    const newGallery = new Gallery({
      title,
      images: images || []
    });
    
    await newGallery.save();
    
    res.status(201).json({ 
      message: 'Gallery created successfully',
      gallery: newGallery
    });
  } catch (error) {
    console.error('Create gallery error:', error);
    res.status(500).json({ message: 'Server error creating gallery' });
  }
};

// Update gallery
exports.updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, images } = req.body;
    
    const gallery = await Gallery.findById(id);
    
    if (!gallery) {
      return res.status(404).json({ message: 'Gallery not found' });
    }
    
    // Update gallery
    if (title) gallery.title = title;
    
    // If images array is provided, replace the current array
    if (images) {
      gallery.images = images;
    }
    
    await gallery.save();
    
    res.json({ 
      message: 'Gallery updated successfully',
      gallery
    });
  } catch (error) {
    console.error('Update gallery error:', error);
    res.status(500).json({ message: 'Server error updating gallery' });
  }
};

// Add image to gallery
exports.addImageToGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageData, caption } = req.body;
    
    // For direct Cloudinary URLs or when using the Upload API
    // The frontend will use the /api/upload/image endpoint first to get the Cloudinary URL
    // and then pass that data here
    if (!imageData || !imageData.url) {
      return res.status(400).json({ message: 'Image data with URL is required' });
    }
    
    const gallery = await Gallery.findById(id);
    
    if (!gallery) {
      return res.status(404).json({ message: 'Gallery not found' });
    }
    
    gallery.images.push({
      url: imageData.url,
      public_id: imageData.public_id || null,
      caption: caption || ''
    });
    
    await gallery.save();
    
    res.json({ 
      message: 'Image added to gallery successfully',
      gallery
    });
  } catch (error) {
    console.error('Add image to gallery error:', error);
    res.status(500).json({ message: 'Server error adding image to gallery' });
  }
};

// Remove image from gallery
exports.removeImageFromGallery = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    
    const gallery = await Gallery.findById(id);
    
    if (!gallery) {
      return res.status(404).json({ message: 'Gallery not found' });
    }
    
    // Find image index by its _id
    const imageIndex = gallery.images.findIndex(img => img._id.toString() === imageId);
    
    if (imageIndex === -1) {
      return res.status(404).json({ message: 'Image not found in gallery' });
    }
    
    // Remove image from array
    gallery.images.splice(imageIndex, 1);
    
    await gallery.save();
    
    res.json({ 
      message: 'Image removed from gallery successfully',
      gallery
    });
  } catch (error) {
    console.error('Remove image from gallery error:', error);
    res.status(500).json({ message: 'Server error removing image from gallery' });
  }
};

// Delete gallery
exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    
    const gallery = await Gallery.findById(id);
    
    if (!gallery) {
      return res.status(404).json({ message: 'Gallery not found' });
    }
    
    await gallery.deleteOne();
    
    res.json({ message: 'Gallery deleted successfully' });
  } catch (error) {
    console.error('Delete gallery error:', error);
    res.status(500).json({ message: 'Server error deleting gallery' });
  }
};
