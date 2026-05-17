const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievement.controller');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES } = require('../constants');

// All achievement routes require employee role (for now)
router.use(requireAuth);
router.use(requireRole(ROLES.EMPLOYEE));

router.post('/', achievementController.saveAchievement);
router.get('/mine', achievementController.getMyAchievements);

module.exports = router;
