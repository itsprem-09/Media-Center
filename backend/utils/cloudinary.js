const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Upload an image to Cloudinary
 * @param {Buffer|String|Stream} file - File buffer, file path or stream
 * @param {Object} options - Upload options
 * @returns {Promise} Cloudinary upload result
 */
const uploadImage = async (file, options = {}) => {
  try {
    // Set default folder if not provided
    const folder = options.folder || 'media-center/images';
    const uploadOptions = {
      folder,
      ...options
    };
    
    let result;
    
    // Check if file is a stream (from streamifier)
    if (file && typeof file === 'object' && typeof file.pipe === 'function') {
      // Handle stream upload
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        
        file.pipe(uploadStream);
      });
    } else {
      // Handle regular file path upload
      result = await cloudinary.uploader.upload(file, uploadOptions);
    }
    
    return {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Upload a video to Cloudinary
 * @param {Buffer|String|Stream} file - File buffer, file path or stream
 * @param {Object} options - Upload options
 * @returns {Promise} Cloudinary upload result
 */
const uploadVideo = async (file, options = {}) => {
  try {
    // Set default folder if not provided
    const folder = options.folder || 'media-center/videos';
    const uploadOptions = {
      folder,
      resource_type: 'video',
      timeout: 300000, // 5 minutes timeout
      ...options
    };
    
    let result;
    
    // Check if file is a stream (from streamifier)
    if (file && typeof file === 'object' && typeof file.pipe === 'function') {
      // Handle stream upload
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        
        file.pipe(uploadStream);
      });
    } else {
      // Handle regular file path upload
      result = await cloudinary.uploader.upload(file, uploadOptions);
    }
    
    // Create a thumbnail URL using Cloudinary's video transformation capabilities
    // For Cloudinary video thumbnails, we need to ensure we're using the correct format
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    
    // If public_id already contains folder paths, we need to keep those as-is
    // But add the transformation at the right position after /upload/
    const transformationParams = 'w_400,h_225,c_fill,g_auto/';
    
    // Use Cloudinary's URL structure: cloudname/resource_type/delivery_type/transformations/version/public_id.extension
    // Based on: https://cloudinary.com/documentation/video_manipulation_and_delivery#generating_video_thumbnails
    const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/video/upload/${transformationParams}${result.public_id}.jpg`;
    
    return {
      public_id: result.public_id,
      url: result.secure_url,
      thumbnail_url: thumbnailUrl,
      duration: result.duration,
      format: result.format,
      resource_type: result.resource_type
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload video to Cloudinary');
  }
};

/**
 * Delete a resource from Cloudinary
 * @param {String} publicId - Public ID of the resource
 * @param {String} resourceType - Type of resource (image or video)
 * @returns {Promise} Cloudinary deletion result
 */
const deleteResource = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Failed to delete ${resourceType} from Cloudinary`);
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadVideo,
  deleteResource
};
