const logger = require('../utils/logger');

/**
 * Runtime Feature Telemetry Analytics
 * Tracks adoption metrics and usage frequency for high-value features.
 */

const trackFeatureAdoption = (featureName) => {
  return (req, res, next) => {
    try {
      // In production, this emits an async event to Mixpanel, Amplitude, or a TSDB
      const userId = req.user ? req.user.userId : 'anonymous';
      
      logger.info(`📈 [TELEMETRY] Feature Triggered: '${featureName}' by User: ${userId}`);
      
      // We do NOT block the request if telemetry fails
      next();
    } catch (error) {
      logger.warn(`Failed to track feature adoption for ${featureName}: ${error.message}`);
      next();
    }
  };
};

module.exports = { trackFeatureAdoption };
