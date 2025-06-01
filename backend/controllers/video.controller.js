const Video = require('../models/Video');
const { deleteResource } = require('../utils/cloudinary'); // Import deleteResource

// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Video.countDocuments();
    
    res.json({
      videos,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: 'Server error fetching videos' });
  }
};

// Get single video
exports.getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await Video.findById(id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    res.json(video);
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ message: 'Server error fetching video' });
  }
};

// Create new video
exports.createVideo = async (req, res) => {
  try {
    const { title, videoData, thumbnailData, description } = req.body;
    
    // The frontend should upload the video to Cloudinary first using the /api/upload/video endpoint
    // Then pass the returned data here
    if (!videoData || !videoData.url) {
      return res.status(400).json({ message: 'Video data with URL is required' });
    }
    
    const newVideo = new Video({
      title,
      videoUrl: videoData.url,
      video_public_id: videoData.public_id || null,
      thumbnail: thumbnailData?.url || videoData.thumbnail_url || null,
      thumbnail_public_id: thumbnailData?.public_id || null,
      description
    });
    
    await newVideo.save();
    
    res.status(201).json({ 
      message: 'Video created successfully',
      video: newVideo
    });
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ message: 'Server error creating video' });
  }
};

// Update video
exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    // Assuming thumbnailData (if new one is uploaded) and videoData (if new video) would contain { url, public_id }
    // deleteThumbnail is a boolean flag from the form
    const { title, description, videoData, thumbnailData, deleteThumbnail } = req.body;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update basic fields
    if (title) video.title = title;
    if (description) video.description = description;

    // Handle video file update (if a new video was uploaded)
    if (videoData && videoData.url) {
      // If old video existed and had a public_id, delete it from Cloudinary
      if (video.video_public_id) {
        await deleteResource(video.video_public_id, 'video');
      }
      video.videoUrl = videoData.url;
      video.video_public_id = videoData.public_id;
      // When a new video is uploaded, Cloudinary automatically generates a thumbnail.
      // We should use this new auto-generated thumbnail unless a specific new thumbnail is also uploaded.
      // The videoData from Cloudinary upload should include this new thumbnail info.
      // For now, let's assume videoData might contain a `thumbnail_url` from Cloudinary's video processing.
      if (videoData.thumbnail_url && !thumbnailData) { // If new video provides a thumb, and no separate thumb is uploaded
        if (video.thumbnail_public_id) { // Delete old custom/auto thumbnail
            await deleteResource(video.thumbnail_public_id, 'image');
        }
        video.thumbnail = videoData.thumbnail_url;
        // video.thumbnail_public_id would need to be extracted if we want to manage this auto-thumb later
        // For simplicity, we'll assume videoData.thumbnail_url is just a URL and doesn't come with its own public_id here.
        // Or, the client should handle uploading this auto-thumb as a separate thumbnailData if it needs to be managed.
        video.thumbnail_public_id = null; // Or extract from videoData if available and structured for it
      }
    }

    // Handle thumbnail update
    if (deleteThumbnail) {
      // User wants to delete the custom thumbnail and use auto-generated
      if (video.thumbnail_public_id) {
        // Delete the custom thumbnail from Cloudinary if it exists
        await deleteResource(video.thumbnail_public_id, 'image');
      }
      
      // If a new video was uploaded during this update, its auto-thumb URL is in videoData
      if (videoData && videoData.thumbnail_url) {
        video.thumbnail = videoData.thumbnail_url;
      } else {
        // No new video was uploaded, so we need to generate the auto-thumb URL from the existing video
        // Only if video has a public_id (meaning it's in Cloudinary)
        if (video.video_public_id) {
          // Create a thumbnail URL using the same format as in cloudinary.js
          const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
          
          // Use transformations after /upload/ in the URL
          const transformationParams = 'w_400,h_225,c_fill,g_auto/';
          
          // Apply the Cloudinary URL structure
          video.thumbnail = `https://res.cloudinary.com/${cloudName}/video/upload/${transformationParams}${video.video_public_id}.jpg`;
        } else {
          video.thumbnail = null; // Fallback if no video_public_id exists
        }
      }
      
      // Set thumbnail_public_id to null to indicate it's auto-generated
      video.thumbnail_public_id = null;
    } else if (thumbnailData && thumbnailData.url) {
      // User is uploading a new custom thumbnail
      if (video.thumbnail_public_id) {
        // Delete existing custom thumbnail from Cloudinary
        await deleteResource(video.thumbnail_public_id, 'image');
      }
      video.thumbnail = thumbnailData.url;
      video.thumbnail_public_id = thumbnailData.public_id;
    }
    
    video.updatedAt = Date.now();
    await video.save();

    res.json({
      message: 'Video updated successfully',
      video
    });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ message: 'Server error updating video' });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await Video.findById(id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    await video.deleteOne();
    
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Server error deleting video' });
  }
};
