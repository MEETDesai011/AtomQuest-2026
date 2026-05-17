const { PrismaClient } = require('@prisma/client');
const { GOAL_STATUS } = require('../constants');
const mailer = require('../utils/mailer');

const prisma = new PrismaClient();

async function checkSubordinate(managerId, employeeId) {
  const employee = await prisma.user.findUnique({
    where: { id: employeeId },
  });

  if (!employee || employee.managerId !== managerId) {
    const error = new Error('Unauthorized: Not a direct subordinate.');
    error.statusCode = 403;
    throw error;
  }
}

async function approveGoal(goalId, managerId) {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    include: { employee: true },
  });

  if (!goal) {
    const error = new Error('Goal not found.');
    error.statusCode = 404;
    throw error;
  }

  await checkSubordinate(managerId, goal.employeeId);

  if (goal.status !== GOAL_STATUS.SUBMITTED) {
    const error = new Error('Only SUBMITTED goals can be approved.');
    error.statusCode = 400;
    throw error;
  }

  const updatedGoal = await prisma.$transaction(async (tx) => {
    const updated = await tx.goal.update({
      where: { id: goalId },
      data: {
        status: GOAL_STATUS.APPROVED,
        isLocked: true,
      },
    });

    await tx.auditLog.create({
      data: {
        goalId: goalId,
        changedBy: managerId,
        actionType: 'APPROVED',
        fieldName: 'status',
        oldValue: GOAL_STATUS.SUBMITTED,
        newValue: GOAL_STATUS.APPROVED,
      },
    });

    return updated;
  });

  if (global.io) {
    global.io.emit('notification', {
      type: 'APPROVAL',
      title: 'Goal Approved',
      message: `Your goal "${goal.title}" has been approved by your manager.`
    });
  }

  if (goal.employee.email) {
    await mailer.sendApprovalEmail(
      goal.employee.email,
      goal.employee.name,
      true,
      null
    );
  }

  return updatedGoal;
}

async function returnForRework(goalId, managerId, reason) {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    include: { employee: true },
  });

  if (!goal) {
    const error = new Error('Goal not found.');
    error.statusCode = 404;
    throw error;
  }

  await checkSubordinate(managerId, goal.employeeId);

  if (goal.status !== GOAL_STATUS.SUBMITTED) {
    const error = new Error('Only SUBMITTED goals can be returned for rework.');
    error.statusCode = 400;
    throw error;
  }

  const updatedGoal = await prisma.$transaction(async (tx) => {
    const updated = await tx.goal.update({
      where: { id: goalId },
      data: {
        status: GOAL_STATUS.REWORK,
      },
    });

    await tx.auditLog.create({
      data: {
        goalId: goalId,
        changedBy: managerId,
        actionType: 'RETURNED_FOR_REWORK',
        fieldName: 'status',
        oldValue: GOAL_STATUS.SUBMITTED,
        newValue: GOAL_STATUS.REWORK,
      },
    });

    return updated;
  });

  if (goal.employee.email) {
    await mailer.sendApprovalEmail(
      goal.employee.email,
      goal.employee.name,
      false,
      reason
    );
  }

  return updatedGoal;
}

async function inlineEditGoal(goalId, managerId, data) {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
  });

  if (!goal) {
    const error = new Error('Goal not found.');
    error.statusCode = 404;
    throw error;
  }

  await checkSubordinate(managerId, goal.employeeId);

  if (goal.status !== GOAL_STATUS.SUBMITTED) {
    const error = new Error('Only SUBMITTED goals can be edited before approval.');
    error.statusCode = 400;
    throw error;
  }

  const { target, weightage } = data;
  const updateData = {};
  const auditLogs = [];

  if (target !== undefined && target !== goal.target) {
    updateData.target = target;
    auditLogs.push({
      goalId,
      changedBy: managerId,
      actionType: 'INLINE_EDIT',
      fieldName: 'target',
      oldValue: goal.target.toString(),
      newValue: target.toString(),
    });
  }

  if (weightage !== undefined && weightage !== goal.weightage) {
    updateData.weightage = weightage;
    auditLogs.push({
      goalId,
      changedBy: managerId,
      actionType: 'INLINE_EDIT',
      fieldName: 'weightage',
      oldValue: goal.weightage.toString(),
      newValue: weightage.toString(),
    });
  }

  if (Object.keys(updateData).length === 0) {
    return goal;
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.goal.update({
      where: { id: goalId },
      data: updateData,
    });

    if (auditLogs.length > 0) {
      await tx.auditLog.createMany({ data: auditLogs });
    }

    return updated;
  });
}

async function getTeam(managerId) {
  return prisma.user.findMany({
    where: { managerId },
    select: {
      id: true,
      name: true,
      department: true,
      email: true,
      _count: {
        select: { goals: { where: { deletedAt: null } } }
      }
    },
  });
}

async function getSubordinateGoals(managerId, employeeId) {
  await checkSubordinate(managerId, employeeId);

  return prisma.goal.findMany({
    where: { employeeId, deletedAt: null },
    include: { cycle: true, achievements: true },
    orderBy: { createdAt: 'desc' },
  });
}

async function getSubordinateCheckins(managerId, employeeId) {
  await checkSubordinate(managerId, employeeId);

  return prisma.goal.findMany({
    where: { employeeId, status: GOAL_STATUS.APPROVED, deletedAt: null },
    include: {
      achievements: {
        include: {
          comments: {
            include: { manager: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function addCheckinComment(managerId, achievementId, comment) {
  const achievement = await prisma.achievement.findUnique({
    where: { id: achievementId },
    include: { goal: true },
  });

  if (!achievement) {
    const error = new Error('Achievement not found.');
    error.statusCode = 404;
    throw error;
  }

  await checkSubordinate(managerId, achievement.goal.employeeId);

  const newComment = await prisma.checkinComment.create({
    data: {
      achievementId,
      managerId,
      comment,
    },
    include: { manager: { select: { name: true } } },
  });

  if (global.io) {
    global.io.emit('notification', {
      type: 'COMMENT',
      title: 'New Manager Comment',
      message: `Your manager left a comment on your check-in.`
    });
  }

  return newComment;
}

module.exports = {
  approveGoal,
  returnForRework,
  inlineEditGoal,
  getTeam,
  getSubordinateGoals,
  getSubordinateCheckins,
  addCheckinComment,
};
