const Article = require('../models/Article');

// Create a slug from title
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const { category, tag, limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query based on filters
    const query = {};
    if (category) query.category = category;
    if (tag) query.tags = tag;
    
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-content'); // Exclude content for list view
      
    const total = await Article.countDocuments(query);
    
    res.json({
      articles,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ message: 'Server error fetching articles' });
  }
};

// Get single article by ID
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if the ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid article ID format' });
    }
    const article = await Article.findById(id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    console.error('Get article by ID error:', error);
    res.status(500).json({ message: 'Server error fetching article' });
  }
};

// Get single article by slug
exports.getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const article = await Article.findOne({ slug });
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ message: 'Server error fetching article' });
  }
};

// Create new article
exports.createArticle = async (req, res) => {
  try {
    const { title, content, author, category, tags, imageData, videoData } = req.body;
    
    // Generate slug from title
    const slug = createSlug(title);
    
    // Check if article with same slug exists
    const articleExists = await Article.findOne({ slug });
    if (articleExists) {
      return res.status(400).json({ message: 'Article with similar title already exists' });
    }
    
    // Build article object
    const articleData = {
      title,
      slug,
      content,
      author,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    };
    
    // Add image data if provided
    if (imageData && imageData.url) {
      articleData.image = imageData.url;
      articleData.image_public_id = imageData.public_id;
    }
    
    // Add video data if provided
    if (videoData && videoData.url) {
      articleData.video = videoData.url;
      articleData.video_public_id = videoData.public_id;
    }
    
    const newArticle = new Article(articleData);
    
    await newArticle.save();
    
    res.status(201).json({ 
      message: 'Article created successfully',
      article: newArticle
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ message: 'Server error creating article' });
  }
};

// Update article
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author, category, tags, imageData, videoData } = req.body;
    const { deleteImage, deleteVideo } = req.body; // Optional flags to delete existing media
    
    const article = await Article.findById(id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Generate new slug if title changed
    let slug = article.slug;
    if (title && title !== article.title) {
      slug = createSlug(title);
      
      // Check if another article has the same slug
      const slugExists = await Article.findOne({ 
        slug, 
        _id: { $ne: id } 
      });
      
      if (slugExists) {
        return res.status(400).json({ message: 'Article with similar title already exists' });
      }
    }
    
    // Update article basic info
    article.title = title || article.title;
    article.slug = slug;
    article.content = content || article.content;
    article.author = author || article.author;
    article.category = category || article.category;
    
    if (tags) {
      if (Array.isArray(tags)) {
        article.tags = tags.map(tag => String(tag).trim()).filter(tag => tag);
      } else if (typeof tags === 'string') {
        article.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      } else {
        // Handle other unexpected types if necessary, or set to empty/default
        article.tags = []; 
      }
    } else if (tags === null || tags === '') { // Handle explicit empty tags
      article.tags = [];
    }
    
    // Handle image updates
    if (deleteImage && article.image) {
      // If there's a public ID stored, you can use Cloudinary API to delete it here
      // This is optional as Cloudinary has automatic cleanup policies available
      article.image = null;
      article.image_public_id = null;
    }
    
    if (imageData && imageData.url) {
      article.image = imageData.url;
      article.image_public_id = imageData.public_id || null;
    }
    
    // Handle video updates
    if (deleteVideo && article.video) {
      // If there's a public ID stored, you can use Cloudinary API to delete it here
      article.video = null;
      article.video_public_id = null;
    }
    
    if (videoData && videoData.url) {
      article.video = videoData.url;
      article.video_public_id = videoData.public_id || null;
    }
    
    await article.save();
    
    res.json({ 
      message: 'Article updated successfully',
      article
    });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ message: 'Server error updating article' });
  }
};

// Delete article
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findById(id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    await article.deleteOne();
    
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ message: 'Server error deleting article' });
  }
};
