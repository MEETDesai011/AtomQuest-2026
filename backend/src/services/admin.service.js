const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { GOAL_STATUS } = require('../constants');
const { buildAchievementReport } = require('../utils/export');

const prisma = new PrismaClient();

async function getUsers(roleFilter) {
  const where = roleFilter ? { role: roleFilter } : {};
  return prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      managerId: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function createUser(data) {
  const passwordHash = await bcrypt.hash(data.password, 12);
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
      department: data.department,
      managerId: data.managerId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
    },
  });
}

async function getCycles() {
  return prisma.goalCycle.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

async function createCycle(data) {
  return prisma.goalCycle.create({ data });
}

async function updateCycle(cycleId, data) {
  return prisma.goalCycle.update({
    where: { id: cycleId },
    data,
  });
}

async function unlockGoal(goalId, adminId) {
  return prisma.$transaction(async (tx) => {
    const goal = await tx.goal.update({
      where: { id: goalId },
      data: { isLocked: false },
    });

    await tx.auditLog.create({
      data: {
        goalId,
        changedBy: adminId,
        actionType: 'ADMIN_UNLOCK',
        fieldName: 'isLocked',
        oldValue: 'true',
        newValue: 'false',
      },
    });

    return goal;
  });
}

async function createSharedGoal(goalData, employeeIds) {
  if (!employeeIds || employeeIds.length === 0) {
    const error = new Error('At least one employee is required for a shared goal.');
    error.statusCode = 400;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    // Create the primary goal for the first employee
    const primaryEmployeeId = employeeIds[0];
    const primaryGoal = await tx.goal.create({
      data: {
        ...goalData,
        employeeId: primaryEmployeeId,
        status: GOAL_STATUS.DRAFT,
      },
    });

    // Create copies for remaining employees with sharedFromId = primary.id
    if (employeeIds.length > 1) {
      const remainingIds = employeeIds.slice(1);
      const sharedGoalsData = remainingIds.map((empId) => ({
        ...goalData,
        employeeId: empId,
        status: GOAL_STATUS.DRAFT,
        sharedFromId: primaryGoal.id,
      }));

      await tx.goal.createMany({ data: sharedGoalsData });
    }

    return primaryGoal; // Return the root goal
  });
}

async function getAchievementReportData(cycleId) {
  if (!cycleId) throw new Error('cycleId is required');

  const cycle = await prisma.goalCycle.findUnique({ where: { id: cycleId } });

  const employees = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    include: {
      goals: {
        where: { cycle: { year: cycle?.year } },
        include: {
          achievements: {
            where: { cycleId },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return employees.map((emp) => ({
    employeeName: emp.name,
    department: emp.department || 'N/A',
    goals: emp.goals.map((g) => {
      const ach = g.achievements[0];
      return {
        title: g.title,
        thrustArea: g.thrustArea,
        uom: g.uom,
        target: g.target,
        actual: ach?.actualValue ?? null,
        progressScore: ach?.progressScore ?? null,
        status: ach?.status ?? 'NOT_STARTED',
      };
    }),
  }));
}

async function exportAchievementReport(cycleId) {
  const reportData = await getAchievementReportData(cycleId);
  const cycle = await prisma.goalCycle.findUnique({ where: { id: cycleId } });
  const cycleName = cycle ? `${cycle.year}-${cycle.phase}` : 'Report';
  
  const workbook = await buildAchievementReport(reportData, cycleName);
  const buffer = await workbook.xlsx.writeBuffer();
  
  return { buffer, filename: `achievement-report-${cycleName}.xlsx` };
}

async function exportAchievementReportCsv(cycleId) {
  const reportData = await getAchievementReportData(cycleId);
  const cycle = await prisma.goalCycle.findUnique({ where: { id: cycleId } });
  const cycleName = cycle ? `${cycle.year}-${cycle.phase}` : 'Report';
  
  const headers = ['Employee Name', 'Department', 'Goal Title', 'Thrust Area', 'UoM', 'Target', 'Actual', 'Score', 'Status'];
  const rows = [];
  reportData.forEach(emp => {
    emp.goals.forEach(g => {
      rows.push([
        `"${emp.employeeName}"`, `"${emp.department}"`, `"${g.title}"`, `"${g.thrustArea}"`, 
        `"${g.uom}"`, g.target, g.actual || 0, g.progressScore || 0, `"${g.status}"`
      ].join(','));
    });
  });
  
  const csv = [headers.join(','), ...rows].join('\n');
  return { csv, filename: `achievement-report-${cycleName}.csv` };
}

async function getCompletionStatus(year) {
  // Returns raw check-in completion counts/status per employee
  // Used by admin completion dashboard
  const cycles = await prisma.goalCycle.findMany({
    where: { year: parseInt(year) },
    select: { id: true, phase: true },
  });

  const employees = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    include: {
      goals: {
        include: { achievements: true },
      },
    },
  });

  return employees.map(emp => {
    const status = { employee: emp.name, department: emp.department };
    for (const cycle of cycles) {
      const goalsInCycle = emp.goals.filter(g => g.cycleId === cycle.id);
      if (goalsInCycle.length === 0) {
        status[cycle.phase] = 'N/A';
      } else {
        const achs = goalsInCycle.map(g => g.achievements.find(a => a.cycleId === cycle.id));
        const allCompleted = achs.every(a => a && a.status !== 'NOT_STARTED');
        status[cycle.phase] = allCompleted ? 'COMPLETED' : 'PENDING';
      }
    }
    return status;
  });
}

async function getAuditLogs(filters) {
  const where = {};
  if (filters.goalId) where.goalId = filters.goalId;
  if (filters.userId) where.changedBy = filters.userId;
  
  return prisma.auditLog.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      goal: { select: { title: true } },
    },
    orderBy: { changedAt: 'desc' },
    take: 500, // Limit for performance
  });
}

module.exports = {
  getUsers,
  createUser,
  getCycles,
  createCycle,
  updateCycle,
  unlockGoal,
  createSharedGoal,
  getAchievementReportData,
  exportAchievementReport,
  exportAchievementReportCsv,
  getCompletionStatus,
  getAuditLogs,
  getEscalationLogs: async () => {
    return prisma.escalationLog.findMany({
      include: {
        user: { select: { name: true, email: true, department: true } },
      },
      orderBy: { triggeredAt: 'desc' },
      take: 500,
    });
  },
};
