const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  video_public_id: {
    type: String,
    default: null
  },
  thumbnail: {
    type: String
  },
  thumbnail_public_id: {
    type: String,
    default: null
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
videoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
