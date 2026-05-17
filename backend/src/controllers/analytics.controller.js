const analyticsService = require('../services/analytics.service');
const { sendSuccess, sendError } = require('../utils/response');

async function getQoQTrends(req, res, next) {
  try {
    const data = await analyticsService.getQoQTrends(req.query.year);
    return sendSuccess(res, data, 'QoQ Trends retrieved successfully');
  } catch (error) {
    next(error);
  }
}

async function getGoalDistribution(req, res, next) {
  try {
    const data = await analyticsService.getGoalDistribution(req.query.year);
    return sendSuccess(res, data, 'Goal Distribution retrieved successfully');
  } catch (error) {
    next(error);
  }
}

async function getCompletionHeatmap(req, res, next) {
  try {
    const data = await analyticsService.getCompletionHeatmap(req.query.year);
    return sendSuccess(res, data, 'Completion Heatmap retrieved successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getQoQTrends,
  getGoalDistribution,
  getCompletionHeatmap,
};
