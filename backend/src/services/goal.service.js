const { PrismaClient } = require('@prisma/client');
const { VALIDATION, GOAL_STATUS } = require('../constants');
const mailer = require('../utils/mailer');

const prisma = new PrismaClient();

async function createGoal(employeeId, cycleId, data) {
  // Check max goals
  const goalCount = await prisma.goal.count({
    where: { employeeId, cycleId, deletedAt: null },
  });

  if (goalCount >= VALIDATION.MAX_GOALS) {
    const error = new Error(`Maximum of ${VALIDATION.MAX_GOALS} goals allowed per cycle.`);
    error.statusCode = 400;
    throw error;
  }

  // Check min weightage
  if (data.weightage < VALIDATION.MIN_WEIGHTAGE) {
    const error = new Error(`Minimum weightage per goal is ${VALIDATION.MIN_WEIGHTAGE}%.`);
    error.statusCode = 400;
    throw error;
  }

  const cycle = await prisma.goalCycle.findUnique({ where: { id: cycleId } });
  if (!cycle || !cycle.isActive) {
    const error = new Error('Selected cycle is not active or does not exist.');
    error.statusCode = 400;
    throw error;
  }

  return prisma.goal.create({
    data: {
      ...data,
      employeeId,
      cycleId,
      status: GOAL_STATUS.DRAFT,
    },
  });
}

async function updateGoal(goalId, employeeId, data) {
  const goal = await prisma.goal.findUnique({ where: { id: goalId } });

  if (!goal) {
    const error = new Error('Goal not found.');
    error.statusCode = 404;
    throw error;
  }

  if (goal.employeeId !== employeeId) {
    const error = new Error('Unauthorized to edit this goal.');
    error.statusCode = 403;
    throw error;
  }

  if (goal.isLocked) {
    const error = new Error('This goal is locked and cannot be edited.');
    error.statusCode = 400;
    throw error;
  }

  if (goal.status !== GOAL_STATUS.DRAFT && goal.status !== GOAL_STATUS.REWORK) {
    const error = new Error('Only DRAFT or REWORK goals can be edited.');
    error.statusCode = 400;
    throw error;
  }
  
  if (data.weightage !== undefined && data.weightage < VALIDATION.MIN_WEIGHTAGE) {
    const error = new Error(`Minimum weightage per goal is ${VALIDATION.MIN_WEIGHTAGE}%.`);
    error.statusCode = 400;
    throw error;
  }

  return prisma.goal.update({
    where: { id: goalId },
    data,
  });
}

async function deleteGoal(goalId, employeeId) {
  const goal = await prisma.goal.findUnique({ where: { id: goalId } });

  if (!goal) {
    const error = new Error('Goal not found.');
    error.statusCode = 404;
    throw error;
  }

  if (goal.employeeId !== employeeId) {
    const error = new Error('Unauthorized to delete this goal.');
    error.statusCode = 403;
    throw error;
  }

  if (goal.isLocked || goal.status !== GOAL_STATUS.DRAFT) {
    const error = new Error('Only unlocked DRAFT goals can be deleted.');
    error.statusCode = 400;
    throw error;
  }

  return prisma.goal.update({
    where: { id: goalId },
    data: { deletedAt: new Date() },
  });
}

async function submitAllGoals(employeeId, cycleId) {
  const goals = await prisma.goal.findMany({
    where: {
      employeeId,
      cycleId,
      status: { in: [GOAL_STATUS.DRAFT, GOAL_STATUS.REWORK] },
      deletedAt: null,
    },
    include: { employee: { include: { manager: true } } },
  });

  if (goals.length === 0) {
    const error = new Error('No DRAFT or REWORK goals to submit.');
    error.statusCode = 400;
    throw error;
  }

  const allGoalsInCycle = await prisma.goal.findMany({
    where: { employeeId, cycleId, deletedAt: null },
  });

  const totalWeightage = Number(allGoalsInCycle.reduce((sum, g) => sum + g.weightage, 0).toFixed(2));

  if (totalWeightage !== VALIDATION.TOTAL_WEIGHTAGE) {
    const error = new Error(`Total weightage is ${totalWeightage}%. Must equal exactly ${VALIDATION.TOTAL_WEIGHTAGE}%.`);
    error.statusCode = 400;
    throw error;
  }

  // Use a transaction to update all
  const updatedGoals = await prisma.$transaction(
    goals.map((g) =>
      prisma.goal.update({
        where: { id: g.id },
        data: { status: GOAL_STATUS.SUBMITTED },
      })
    )
  );

  // Send email if applicable
  const employee = goals[0].employee;
  if (employee && employee.manager && employee.manager.email) {
    await mailer.sendGoalSubmittedEmail(
      employee.manager.email,
      employee.manager.name,
      employee.name
    );
  }

  return updatedGoals;
}

async function getMyGoals(employeeId, cycleId) {
  return prisma.goal.findMany({
    where: { employeeId, cycleId, deletedAt: null },
    include: { achievements: true },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = {
  createGoal,
  updateGoal,
  deleteGoal,
  submitAllGoals,
  getMyGoals,
};
