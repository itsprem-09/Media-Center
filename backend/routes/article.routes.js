const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', articleController.getAllArticles);
router.get('/:slug', articleController.getArticleBySlug);

// Protected routes (admin only)
router.get('/id/:id', auth, isAdmin, articleController.getArticleById); // New route for fetching by ID for admin

router.post('/', auth, isAdmin, articleController.createArticle);
router.put('/:id', auth, isAdmin, articleController.updateArticle);
router.delete('/:id', auth, isAdmin, articleController.deleteArticle);

module.exports = router;
