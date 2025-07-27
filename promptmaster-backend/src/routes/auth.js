const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

// Login endpoint
router.post('/login', rateLimiter.general, authController.login);

// Verify token endpoint
router.get('/verify', authMiddleware, authController.verify);

module.exports = router;