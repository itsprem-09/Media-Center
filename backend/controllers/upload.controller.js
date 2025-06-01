const { uploadImage, uploadVideo } = require('../utils/cloudinary');
const streamifier = require('streamifier');

// Handle image upload
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Create a buffer stream from the file
    const stream = streamifier.createReadStream(req.file.buffer);
    
    // Get file type from mimetype
    const fileType = req.file.mimetype.split('/')[0];
    
    if (fileType !== 'image') {
      return res.status(400).json({ message: 'Provided file is not an image' });
    }
    
    // Upload to Cloudinary
    const result = await uploadImage(stream, {
      folder: 'media-center/images',
      // You can add more options here like transformation settings
    });
    
    res.json({
      message: 'Image uploaded successfully',
      image: result
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
};

// Handle video upload
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }
    
    // Create a buffer stream from the file
    const stream = streamifier.createReadStream(req.file.buffer);
    
    // Get file type from mimetype
    const fileType = req.file.mimetype.split('/')[0];
    
    if (fileType !== 'video') {
      return res.status(400).json({ message: 'Provided file is not a video' });
    }
    
    // Upload to Cloudinary
    const result = await uploadVideo(stream, {
      folder: 'media-center/videos',
      // You can add more options here like transformation settings
    });
    
    res.json({
      message: 'Video uploaded successfully',
      video: result
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ message: 'Failed to upload video' });
  }
};
