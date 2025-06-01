const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user (protected route)
router.get('/user', auth, authController.getCurrentUser);

module.exports = router;
