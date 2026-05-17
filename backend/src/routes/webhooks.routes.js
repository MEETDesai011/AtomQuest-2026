const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { requireAuth, requireRole } = require('../middleware/auth');

/**
 * Webhook Subscription Architecture
 * Allows external HR/ERP systems to subscribe to system events.
 */

// POST /api/v1/webhooks/subscribe
router.post('/subscribe', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { targetUrl, eventType } = req.body;
    
    // Allowed events: 'goal.approved', 'escalation.triggered', 'cycle.closed'
    const allowedEvents = ['goal.approved', 'escalation.triggered', 'cycle.closed'];
    
    if (!allowedEvents.includes(eventType)) {
      return res.status(400).json({ status: 'error', message: 'Invalid Webhook Event Type' });
    }

    logger.info(`🔗 Webhook Subscribed: External system bound to [${eventType}] targeting ${targetUrl}`);
    
    // In production, save subscription to DB
    return res.status(201).json({
      status: 'success',
      data: {
        subscriptionId: `wh_sub_${Date.now()}`,
        targetUrl,
        eventType,
        status: 'active'
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
