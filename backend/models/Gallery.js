const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      default: null
    },
    caption: {
      type: String,
      default: ''
    }
  }],
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
gallerySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
