const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { register, login, getUserProfile, updateProfile } = require('../controllers/authController');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Get user profile (Protected)
router.get('/me', verifyToken, getUserProfile);

// Update user profile (Protected)
router.put('/me', verifyToken, updateProfile);  // Add PUT route for updating profile

module.exports = router;
