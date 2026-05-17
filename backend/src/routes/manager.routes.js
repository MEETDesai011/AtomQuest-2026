const express = require('express');
const router = express.Router();
const managerController = require('../controllers/manager.controller');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES } = require('../constants');

// All manager routes require manager role
router.use(requireAuth);
router.use(requireRole(ROLES.MANAGER));

router.get('/team', managerController.getTeam);
router.get('/goals/:userId', managerController.getSubordinateGoals);
router.put('/goals/:id/approve', managerController.approveGoal);
router.put('/goals/:id/rework', managerController.returnForRework);
router.put('/goals/:id/edit', managerController.inlineEditGoal);

router.get('/checkins/:userId', managerController.getSubordinateCheckins);
router.post('/checkins/:achievementId/comment', managerController.addCheckinComment);

module.exports = router;
