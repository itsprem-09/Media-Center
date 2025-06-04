const Article = require('../models/Article');
const Gallery = require('../models/Gallery');
const Video = require('../models/Video');

/**
 * Search across articles, galleries, and videos
 * @param {Object} req - Request object with query parameters
 * @param {Object} res - Response object
 */
exports.searchContent = async (req, res) => {
  try {
    const { query, limit = 10, page = 1 } = req.query;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const searchRegex = new RegExp(query, 'i');
    
    // Search in articles (title, content, tags, category)
    const articles = await Article.find({
      $or: [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
        { category: searchRegex }
      ]
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('-content'); // Exclude content for list view
    
    // Search in galleries (title)
    const galleries = await Gallery.find({
      title: searchRegex
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
    // Search in videos (title, description)
    const videos = await Video.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex }
      ]
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
    // Get total counts for pagination
    const articlesCount = await Article.countDocuments({
      $or: [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
        { category: searchRegex }
      ]
    });
    
    const galleriesCount = await Gallery.countDocuments({
      title: searchRegex
    });
    
    const videosCount = await Video.countDocuments({
      $or: [
        { title: searchRegex },
        { description: searchRegex }
      ]
    });
    
    const totalResults = articlesCount + galleriesCount + videosCount;
    
    res.json({
      results: {
        articles,
        galleries,
        videos
      },
      counts: {
        articles: articlesCount,
        galleries: galleriesCount,
        videos: videosCount,
        total: totalResults
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalResults,
        pages: Math.ceil(totalResults / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error during search operation' });
  }
};
