const logger = require('../utils/logger');

/**
 * Idempotency Middleware
 * Prevents duplicate submissions of critical POST/PUT requests (e.g. exports, approvals)
 * by verifying an `Idempotency-Key` header against a Redis/Memory cache.
 */

// In-memory cache for demonstration (use Redis in prod)
const idempotencyCache = new Map();

const requireIdempotency = (req, res, next) => {
  const key = req.headers['idempotency-key'];
  
  if (!key) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Idempotency-Key header is required for this mutation.' 
    });
  }

  if (idempotencyCache.has(key)) {
    logger.warn(`🛑 Blocked duplicate idempotent request. Key: ${key}`);
    return res.status(409).json({
      status: 'error',
      message: 'Duplicate request detected. This action has already been processed.'
    });
  }

  // Register key (TTL 24 hours in real Redis)
  idempotencyCache.set(key, true);
  setTimeout(() => idempotencyCache.delete(key), 1000 * 60 * 60 * 24);

  next();
};

module.exports = { requireIdempotency };
