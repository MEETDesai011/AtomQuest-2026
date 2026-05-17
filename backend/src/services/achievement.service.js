const { PrismaClient } = require('@prisma/client');
const { GOAL_STATUS } = require('../constants');
const { computeProgressScore } = require('../utils/progressScore');

const prisma = new PrismaClient();

async function saveAchievement(employeeId, cycleId, data) {
  const { goalId, actualValue, status } = data;

  const cycle = await prisma.goalCycle.findUnique({
    where: { id: cycleId },
  });

  if (!cycle || !cycle.isActive) {
    const error = new Error('Cycle is not active.');
    error.statusCode = 400;
    throw error;
  }

  const now = new Date();
  if (now < cycle.windowOpen || now > cycle.windowClose) {
    const error = new Error('Achievement entry is not open for this cycle.');
    error.statusCode = 400;
    throw error;
  }

  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
  });

  if (!goal) {
    const error = new Error('Goal not found.');
    error.statusCode = 404;
    throw error;
  }

  if (goal.employeeId !== employeeId) {
    const error = new Error('Unauthorized to update this goal.');
    error.statusCode = 403;
    throw error;
  }

  if (goal.status !== GOAL_STATUS.APPROVED) {
    const error = new Error('Only APPROVED goals can have achievements recorded.');
    error.statusCode = 400;
    throw error;
  }

  const progressScore = computeProgressScore(
    goal.uom,
    goal.target,
    actualValue,
    goal.uom === 'TIMELINE' ? goal.createdAt : null, // Simplification for TIMELINE targetDate
    goal.uom === 'TIMELINE' && actualValue === 1 ? now : null // actualDate if completed
  );

  // If this is a shared goal, find all linked goals to update them synchronously
  const linkedGoalIds = [];
  if (goal.sharedFromId) {
    const linkedGoals = await prisma.goal.findMany({
      where: { sharedFromId: goal.sharedFromId },
      select: { id: true },
    });
    linkedGoalIds.push(...linkedGoals.map((g) => g.id));
    linkedGoalIds.push(goal.sharedFromId); // And the primary goal itself
  } else {
    // Maybe this IS the primary goal that was shared
    const linkedGoals = await prisma.goal.findMany({
      where: { sharedFromId: goal.id },
      select: { id: true },
    });
    if (linkedGoals.length > 0) {
      linkedGoalIds.push(...linkedGoals.map((g) => g.id));
    }
  }

  return prisma.$transaction(async (tx) => {
    // 1. Upsert for the direct user
    let primaryAchievement = await tx.achievement.findFirst({
      where: { goalId, cycleId },
    });

    if (primaryAchievement) {
      primaryAchievement = await tx.achievement.update({
        where: { id: primaryAchievement.id },
        data: { actualValue, status, progressScore },
      });
    } else {
      primaryAchievement = await tx.achievement.create({
        data: {
          goalId,
          cycleId,
          actualValue,
          status,
          progressScore,
        },
      });
    }

    // 2. Synchronize shared goals if applicable
    if (linkedGoalIds.length > 0) {
      const otherGoalIds = linkedGoalIds.filter((id) => id !== goalId);
      
      for (const linkedGoalId of otherGoalIds) {
        const existing = await tx.achievement.findFirst({
          where: { goalId: linkedGoalId, cycleId },
        });

        if (existing) {
          await tx.achievement.update({
            where: { id: existing.id },
            data: { actualValue, status, progressScore },
          });
        } else {
          await tx.achievement.create({
            data: {
              goalId: linkedGoalId,
              cycleId,
              actualValue,
              status,
              progressScore,
            },
          });
        }
      }
    }

    return primaryAchievement;
  });
}

async function getMyAchievements(employeeId) {
  return prisma.achievement.findMany({
    where: {
      goal: { 
        employeeId,
        deletedAt: null 
      },
    },
    include: {
      goal: true,
      cycle: true,
    },
    orderBy: { updatedAt: 'desc' },
  });
}

module.exports = {
  saveAchievement,
  getMyAchievements,
};
