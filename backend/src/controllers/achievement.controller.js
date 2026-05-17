const achievementService = require('../services/achievement.service');
const { saveAchievementSchema } = require('../validators/achievement.validator');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../middleware/asyncHandler');

async function saveAchievement(req, res, next) {
  try {
    const parsed = saveAchievementSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        res,
        parsed.error.errors.map((e) => e.message).join(', '),
        400
      );
    }

    const achievement = await achievementService.saveAchievement(
      req.user.userId,
      parsed.data.cycleId,
      parsed.data
    );

    return sendSuccess(res, achievement, 'Achievement saved successfully');
  } catch (error) {
    next(error);
  }
}

async function getMyAchievements(req, res, next) {
  try {
    const achievements = await achievementService.getMyAchievements(
      req.user.userId
    );
    return sendSuccess(res, achievements, 'Achievements retrieved successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  saveAchievement: asyncHandler(saveAchievement),
  getMyAchievements: asyncHandler(getMyAchievements)
};
