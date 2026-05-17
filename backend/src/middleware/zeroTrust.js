const logger = require('../utils/logger');

/**
 * Zero-Trust Posture Middleware (Stub)
 * Simulates strict mTLS (Mutual TLS) service authentication and least-privilege scoping.
 */

const enforceZeroTrust = (req, res, next) => {
  // 1. Verify Service-to-Service mTLS Header (if request comes from another microservice)
  const isServiceCall = req.headers['x-service-mesh-auth'];
  if (isServiceCall && isServiceCall !== process.env.SERVICE_MESH_SECRET) {
    logger.warn('🛑 [ZERO TRUST] Blocked invalid service mesh interconnect attempt.');
    return res.status(403).json({ status: 'error', message: 'mTLS Verification Failed' });
  }

  // 2. Validate token lifespan (Short-lived tokens strategy)
  if (req.user && req.user.exp) {
    const timeRemaining = req.user.exp - Math.floor(Date.now() / 1000);
    // If token expires in less than 5 minutes, force rotation
    if (timeRemaining < 300) {
      res.setHeader('X-Token-Expiring', 'true');
    }
  }

  next();
};

module.exports = { enforceZeroTrust };
