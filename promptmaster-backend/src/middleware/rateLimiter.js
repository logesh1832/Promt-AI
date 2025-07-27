const rateLimit = require('express-rate-limit');

// General rate limiter - 100 requests per 15 minutes
const general = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for Gemini API calls - 20 requests per hour
const geminiApi = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    success: false,
    error: {
      code: 'AI_RATE_LIMIT_EXCEEDED',
      message: 'AI request limit reached, please try again later'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit by user ID if authenticated, otherwise by IP
    return req.user?.id || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  }
});

// Admin endpoints can have higher limits
const adminApi = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: {
    success: false,
    error: {
      code: 'ADMIN_RATE_LIMIT_EXCEEDED',
      message: 'Admin API limit reached'
    }
  },
  skip: (req) => req.user?.role === 'admin' // Skip rate limiting for admins
});

module.exports = {
  general,
  geminiApi,
  adminApi
};