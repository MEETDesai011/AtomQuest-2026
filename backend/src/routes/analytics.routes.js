const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES } = require('../constants');

// Analytics requires ADMIN role
router.use(requireAuth);
router.use(requireRole(ROLES.ADMIN));

router.get('/qoq', analyticsController.getQoQTrends);
router.get('/distribution', analyticsController.getGoalDistribution);
router.get('/heatmap', analyticsController.getCompletionHeatmap);

module.exports = router;
