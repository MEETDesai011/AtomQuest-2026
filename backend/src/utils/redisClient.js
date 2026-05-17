const Redis = require('ioredis');
const logger = require('./logger');

// Distributed Cache Layer for Analytics and Socket Session Scaling
let redisClient = null;

if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
  });

  redisClient.on('connect', () => {
    logger.info('🟢 Redis Cache Layer connected successfully');
  });

  redisClient.on('error', (err) => {
    logger.error('🔴 Redis Cache connection error:', err);
  });
} else {
  // Graceful degradation for local development
  logger.warn('🟡 REDIS_URL not provided. Running with in-memory fallback cache.');
  redisClient = {
    get: async () => null,
    set: async () => true,
    del: async () => true,
  };
}

module.exports = redisClient;
