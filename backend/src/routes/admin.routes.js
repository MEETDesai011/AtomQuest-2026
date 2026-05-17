const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES } = require('../constants');

// All admin routes require ADMIN role
router.use(requireAuth);
router.use(requireRole(ROLES.ADMIN));

router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);

router.get('/cycles', adminController.getCycles);
router.post('/cycles', adminController.createCycle);
router.put('/cycles/:id', adminController.updateCycle);

router.put('/goals/:id/unlock', adminController.unlockGoal);
router.post('/goals/shared', adminController.createSharedGoal);

router.get('/reports/achievement', adminController.getAchievementReport);
router.get('/reports/export', adminController.exportAchievementReport);
router.get('/reports/export-csv', adminController.exportAchievementReportCsv);
router.get('/reports/completion', adminController.getCompletionStatus);

router.get('/audit', adminController.getAuditLogs);
router.get('/escalations', adminController.getEscalationLogs);

module.exports = router;
