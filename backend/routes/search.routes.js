const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

// GET /api/search - Search across articles, galleries, and videos
router.get('/', searchController.searchContent);

module.exports = router;
