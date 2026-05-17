const goalService = require('../services/goal.service');
const { createGoalSchema, updateGoalSchema } = require('../validators/goal.validator');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../middleware/asyncHandler');

async function createGoal(req, res, next) {
  try {
    const parsed = createGoalSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        res,
        parsed.error.errors.map((e) => e.message).join(', '),
        400
      );
    }

    const goal = await goalService.createGoal(
      req.user.userId,
      parsed.data.cycleId,
      parsed.data
    );
    return sendSuccess(res, goal, 'Goal created successfully', 201);
  } catch (error) {
    next(error);
  }
}

async function updateGoal(req, res, next) {
  try {
    const parsed = updateGoalSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        res,
        parsed.error.errors.map((e) => e.message).join(', '),
        400
      );
    }

    const goal = await goalService.updateGoal(
      req.params.id,
      req.user.userId,
      parsed.data
    );
    return sendSuccess(res, goal, 'Goal updated successfully');
  } catch (error) {
    next(error);
  }
}

async function deleteGoal(req, res, next) {
  try {
    await goalService.deleteGoal(req.params.id, req.user.userId);
    return sendSuccess(res, null, 'Goal deleted successfully');
  } catch (error) {
    next(error);
  }
}

async function submitAllGoals(req, res, next) {
  try {
    const { cycleId } = req.body;
    if (!cycleId) {
      return sendError(res, 'cycleId is required', 400);
    }
    const result = await goalService.submitAllGoals(req.user.userId, cycleId);
    return sendSuccess(res, result, 'Goals submitted successfully');
  } catch (error) {
    next(error);
  }
}

async function getMyGoals(req, res, next) {
  try {
    const { cycleId } = req.query;
    if (!cycleId) {
      return sendError(res, 'cycleId query parameter is required', 400);
    }
    const goals = await goalService.getMyGoals(req.user.userId, cycleId);
    return sendSuccess(res, goals, 'Goals retrieved successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createGoal: asyncHandler(createGoal),
  updateGoal: asyncHandler(updateGoal),
  deleteGoal: asyncHandler(deleteGoal),
  submitAllGoals: asyncHandler(submitAllGoals),
  getMyGoals: asyncHandler(getMyGoals),
};
