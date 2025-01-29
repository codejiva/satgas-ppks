const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { register, login, getUserProfile } = require('../controllers/authController');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Get user profile (Protected)
router.get('/me', verifyToken, getUserProfile);

module.exports = router;
