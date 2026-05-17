const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const mailer = require('../utils/mailer');
const { GOAL_STATUS } = require('../constants');
const { differenceInDays } = require('date-fns');

const prisma = new PrismaClient();

async function runEscalationRules() {
  console.log(`[${new Date().toISOString()}] ⏳ Running daily escalation rules...`);
  const now = new Date();

  try {
    // 1. Rule 1: Employee hasn't submitted goals within 7 days of GOAL_SETTING open
    const goalSettingCycle = await prisma.goalCycle.findFirst({
      where: {
        phase: 'GOAL_SETTING',
        isActive: true,
      },
    });

    if (goalSettingCycle) {
      const daysSinceOpen = differenceInDays(now, new Date(goalSettingCycle.windowOpen));
      if (daysSinceOpen >= 7) {
        // Find employees with no SUBMITTED/APPROVED goals in this cycle
        const employees = await prisma.user.findMany({
          where: { role: 'EMPLOYEE' },
          include: {
            goals: {
              where: { cycleId: goalSettingCycle.id },
            },
          },
        });

        for (const emp of employees) {
          const hasSubmitted = emp.goals.some(g => g.status === GOAL_STATUS.SUBMITTED || g.status === GOAL_STATUS.APPROVED);
          if (!hasSubmitted && emp.email) {
            console.log(`Triggered Rule 1 for ${emp.email}`);
            await mailer.sendEscalationEmail(
              emp.email,
              emp.name,
              'You have not submitted your goals within 7 days of the goal setting window opening. Please submit them immediately.'
            );
          }
        }
      }
    }

    // 2. Rule 2: Manager hasn't approved a submitted goal within 5 days
    const pendingGoals = await prisma.goal.findMany({
      where: { status: GOAL_STATUS.SUBMITTED },
      include: { employee: { include: { manager: true } } },
    });

    for (const goal of pendingGoals) {
      const daysSinceSubmit = differenceInDays(now, new Date(goal.updatedAt)); // Assuming updatedAt is when it was submitted
      if (daysSinceSubmit >= 5 && goal.employee.manager && goal.employee.manager.email) {
        console.log(`Triggered Rule 2 for Manager ${goal.employee.manager.email} regarding Goal ${goal.id}`);
        await mailer.sendEscalationEmail(
          goal.employee.manager.email,
          goal.employee.manager.name,
          `You have a pending goal submission from ${goal.employee.name} that has been waiting for more than 5 days. Please review it.`
        );
      }
    }

    // 3. Rule 3: Active Q1/Q2/Q3/Q4 cycle is open, but employee has no achievement entry
    const activePerformanceCycles = await prisma.goalCycle.findMany({
      where: {
        phase: { in: ['Q1', 'Q2', 'Q3', 'Q4'] },
        isActive: true,
        windowOpen: { lte: now },
        windowClose: { gte: now },
      },
    });

    for (const cycle of activePerformanceCycles) {
      const goalsWithoutAchievements = await prisma.goal.findMany({
        where: {
          status: GOAL_STATUS.APPROVED, // Only approved goals need achievements
          achievements: {
            none: { cycleId: cycle.id }
          }
        },
        include: { employee: true },
      });

      // Group by employee so we don't spam them per goal
      const employeeMap = new Map();
      for (const goal of goalsWithoutAchievements) {
        if (!employeeMap.has(goal.employeeId)) {
          employeeMap.set(goal.employeeId, goal.employee);
        }
      }

      for (const emp of employeeMap.values()) {
        if (emp.email) {
          console.log(`Triggered Rule 3 for ${emp.email} (Phase ${cycle.phase})`);
          await mailer.sendCheckinReminderEmail(
            emp.email,
            emp.name,
            cycle.phase
          );
        }
      }
    }

    console.log(`[${new Date().toISOString()}] ✅ Escalation rules finished.`);
  } catch (error) {
    console.error('❌ Error running escalation rules:', error);
  }
}

function startCron() {
  // Run daily at 8:00 AM
  cron.schedule('0 8 * * *', runEscalationRules);
  console.log('⏰ Escalation cron job scheduled (Runs daily at 8:00 AM)');
}

module.exports = { startCron };
