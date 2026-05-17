const managerService = require('../services/manager.service');
const { sendSuccess, sendError } = require('../utils/response');
const { z } = require('zod');
const asyncHandler = require('../middleware/asyncHandler');

async function getTeam(req, res, next) {
  try {
    const team = await managerService.getTeam(req.user.userId);
    return sendSuccess(res, team, 'Team retrieved successfully');
  } catch (error) {
    next(error);
  }
}

async function getSubordinateGoals(req, res, next) {
  try {
    const goals = await managerService.getSubordinateGoals(
      req.user.userId,
      req.params.userId
    );
    return sendSuccess(res, goals, 'Goals retrieved successfully');
  } catch (error) {
    next(error);
  }
}

async function approveGoal(req, res, next) {
  try {
    const goal = await managerService.approveGoal(
      req.params.id,
      req.user.userId
    );
    return sendSuccess(res, goal, 'Goal approved successfully');
  } catch (error) {
    next(error);
  }
}

async function returnForRework(req, res, next) {
  try {
    const schema = z.object({ reason: z.string().min(1) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, 'Reason is required', 400);
    }

    const goal = await managerService.returnForRework(
      req.params.id,
      req.user.userId,
      parsed.data.reason
    );
    return sendSuccess(res, goal, 'Goal returned for rework');
  } catch (error) {
    next(error);
  }
}

async function inlineEditGoal(req, res, next) {
  try {
    const schema = z.object({
      target: z.number().optional(),
      weightage: z.number().min(10).max(100).optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, 'Invalid target or weightage', 400);
    }

    const goal = await managerService.inlineEditGoal(
      req.params.id,
      req.user.userId,
      parsed.data
    );
    return sendSuccess(res, goal, 'Goal updated successfully');
  } catch (error) {
    next(error);
  }
}

async function getSubordinateCheckins(req, res, next) {
  try {
    const goals = await managerService.getSubordinateCheckins(
      req.user.userId,
      req.params.userId
    );
    return sendSuccess(res, goals, 'Check-ins retrieved successfully');
  } catch (error) {
    next(error);
  }
}

async function addCheckinComment(req, res, next) {
  try {
    const schema = z.object({ comment: z.string().min(1) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, 'Comment is required', 400);
    }

    const comment = await managerService.addCheckinComment(
      req.user.userId,
      req.params.achievementId,
      parsed.data.comment
    );
    return sendSuccess(res, comment, 'Comment added successfully', 201);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTeam: asyncHandler(getTeam),
  getSubordinateGoals: asyncHandler(getSubordinateGoals),
  approveGoal: asyncHandler(approveGoal),
  returnForRework: asyncHandler(returnForRework),
  inlineEditGoal: asyncHandler(inlineEditGoal),
  getSubordinateCheckins: asyncHandler(getSubordinateCheckins),
  addCheckinComment: asyncHandler(addCheckinComment),
};
