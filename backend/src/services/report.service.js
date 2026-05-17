// Report service functions are integrated into admin.service.js
// This file re-exports for clarity and discoverability

const { getAchievementReportData, exportAchievementReport, getCompletionStatus } = require('./admin.service');

module.exports = {
  getAchievementReportData,
  exportAchievementReport,
  getCompletionStatus,
};
