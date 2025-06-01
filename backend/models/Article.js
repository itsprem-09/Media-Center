const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  image: {
    type: String
  },
  image_public_id: {
    type: String,
    default: null
  },
  video: {
    type: String
  },
  video_public_id: {
    type: String,
    default: null
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
articleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
