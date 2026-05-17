const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding AtomQuest Database with rich demo data...');

  const hash = await bcrypt.hash('password123', 10);

  // ── USERS ──────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@atomquest.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@atomquest.com', passwordHash: hash, role: 'ADMIN', department: 'Executive' },
  });

  const managerEng = await prisma.user.upsert({
    where: { email: 'sarah.manager@atomquest.com' },
    update: {},
    create: { name: 'Sarah Smith', email: 'sarah.manager@atomquest.com', passwordHash: hash, role: 'MANAGER', department: 'Engineering' },
  });

  const managerSales = await prisma.user.upsert({
    where: { email: 'david.park@atomquest.com' },
    update: {},
    create: { name: 'David Park', email: 'david.park@atomquest.com', passwordHash: hash, role: 'MANAGER', department: 'Sales' },
  });

  const managerHR = await prisma.user.upsert({
    where: { email: 'lisa.chen@atomquest.com' },
    update: {},
    create: { name: 'Lisa Chen', email: 'lisa.chen@atomquest.com', passwordHash: hash, role: 'MANAGER', department: 'HR' },
  });

  const emp1 = await prisma.user.upsert({
    where: { email: 'john.doe@atomquest.com' },
    update: {},
    create: { name: 'John Doe', email: 'john.doe@atomquest.com', passwordHash: hash, role: 'EMPLOYEE', department: 'Engineering', managerId: managerEng.id },
  });
  const emp2 = await prisma.user.upsert({
    where: { email: 'emma.wilson@atomquest.com' },
    update: {},
    create: { name: 'Emma Wilson', email: 'emma.wilson@atomquest.com', passwordHash: hash, role: 'EMPLOYEE', department: 'Engineering', managerId: managerEng.id },
  });
  const emp3 = await prisma.user.upsert({
    where: { email: 'mike.chen@atomquest.com' },
    update: {},
    create: { name: 'Mike Chen', email: 'mike.chen@atomquest.com', passwordHash: hash, role: 'EMPLOYEE', department: 'Sales', managerId: managerSales.id },
  });
  const emp4 = await prisma.user.upsert({
    where: { email: 'anna.park@atomquest.com' },
    update: {},
    create: { name: 'Anna Park', email: 'anna.park@atomquest.com', passwordHash: hash, role: 'EMPLOYEE', department: 'HR', managerId: managerHR.id },
  });
  const emp5 = await prisma.user.upsert({
    where: { email: 'tom.lee@atomquest.com' },
    update: {},
    create: { name: 'Tom Lee', email: 'tom.lee@atomquest.com', passwordHash: hash, role: 'EMPLOYEE', department: 'Sales', managerId: managerSales.id },
  });

  console.log('  ✅ 9 Users created (1 Admin, 3 Managers, 5 Employees)');

  // ── GOAL CYCLES ────────────────────────────────
  const currentYear = new Date().getFullYear();
  const goalSettingCycle = await prisma.goalCycle.create({
    data: { year: currentYear, phase: 'GOAL_SETTING', windowOpen: new Date(`${currentYear}-01-01`), windowClose: new Date(`${currentYear}-12-31`), isActive: true },
  });
  const q1 = await prisma.goalCycle.create({
    data: { year: currentYear, phase: 'Q1', windowOpen: new Date(`${currentYear}-01-01`), windowClose: new Date(`${currentYear}-03-31`), isActive: false },
  });
  const q2 = await prisma.goalCycle.create({
    data: { year: currentYear, phase: 'Q2', windowOpen: new Date(`${currentYear}-04-01`), windowClose: new Date(`${currentYear}-06-30`), isActive: true }, // Made Q2 active since we're in May
  });
  const q3 = await prisma.goalCycle.create({
    data: { year: currentYear, phase: 'Q3', windowOpen: new Date(`${currentYear}-07-01`), windowClose: new Date(`${currentYear}-09-30`), isActive: false },
  });
  const q4 = await prisma.goalCycle.create({
    data: { year: currentYear, phase: 'Q4', windowOpen: new Date(`${currentYear}-10-01`), windowClose: new Date(`${currentYear}-12-31`), isActive: false },
  });

  console.log(`  ✅ 5 Goal Cycles created for ${currentYear} (Q2 active)`);

  // ── GOALS ──────────────────────────────────────
  const goals = [];
  const goalDefs = [
    { emp: emp1, title: 'Deploy Kubernetes Cluster', thrust: 'Innovation', uom: 'MAX', target: 100, weight: 30, status: 'APPROVED' },
    { emp: emp1, title: 'Reduce Cloud Spend by 20%', thrust: 'Cost', uom: 'MIN', target: 10000, weight: 30, status: 'APPROVED' },
    { emp: emp1, title: 'Implement CI/CD Pipeline', thrust: 'Efficiency', uom: 'MAX', target: 100, weight: 20, status: 'APPROVED' },
    { emp: emp1, title: 'Write Technical Documentation', thrust: 'Quality', uom: 'MAX', target: 50, weight: 20, status: 'SUBMITTED' },
    { emp: emp2, title: 'Migrate Legacy Services', thrust: 'Innovation', uom: 'MAX', target: 5, weight: 40, status: 'APPROVED' },
    { emp: emp2, title: 'Achieve 95% Test Coverage', thrust: 'Quality', uom: 'MAX', target: 95, weight: 30, status: 'APPROVED' },
    { emp: emp2, title: 'Reduce Bug Turnaround', thrust: 'Efficiency', uom: 'MIN', target: 24, weight: 30, status: 'REWORK' },
    { emp: emp3, title: 'Close 5 Enterprise Deals', thrust: 'Revenue', uom: 'MAX', target: 5, weight: 50, status: 'APPROVED' },
    { emp: emp3, title: 'Expand Partner Channel', thrust: 'Revenue', uom: 'MAX', target: 10, weight: 30, status: 'APPROVED' },
    { emp: emp3, title: 'Reduce Customer Churn to 5%', thrust: 'Revenue', uom: 'MIN', target: 5, weight: 20, status: 'DRAFT' },
    { emp: emp4, title: 'Hire 10 Senior Engineers', thrust: 'People', uom: 'MAX', target: 10, weight: 50, status: 'APPROVED' },
    { emp: emp4, title: 'Launch Employee Training', thrust: 'People', uom: 'MAX', target: 100, weight: 30, status: 'SUBMITTED' },
    { emp: emp4, title: 'Improve eNPS Score', thrust: 'People', uom: 'MAX', target: 80, weight: 20, status: 'APPROVED' },
    { emp: emp5, title: 'Generate $2M Pipeline', thrust: 'Revenue', uom: 'MAX', target: 2000000, weight: 60, status: 'APPROVED' },
    { emp: emp5, title: 'Onboard Channel Partners', thrust: 'Revenue', uom: 'MAX', target: 8, weight: 40, status: 'APPROVED' },
  ];

  for (const g of goalDefs) {
    const goal = await prisma.goal.create({
      data: {
        title: g.title,
        thrustArea: g.thrust,
        uom: g.uom,
        target: g.target,
        weightage: g.weight,
        status: g.status,
        employeeId: g.emp.id,
        cycleId: goalSettingCycle.id,
      }
    });
    goals.push(goal);
  }

  console.log('  ✅ 15 Goals created (varied statuses: APPROVED, SUBMITTED, REWORK, DRAFT)');

  // ── ACHIEVEMENTS (Q1, Q2 with realistic progression for May 2026) ──
  const approvedGoals = goals.filter((_, i) => goalDefs[i].status === 'APPROVED');
  const quarters = [q1, q2];
  const progressions = [
    [45, 60], [30, 45], [60, 75], // emp1 (Q1 completed, Q2 mid-way)
    [55, 65], [70, 80],           // emp2
    [40, 50], [50, 60],           // emp3
    [50, 65], [35, 50],           // emp4
    [60, 75], [45, 60],           // emp5
  ];

  let achIdx = 0;
  for (let i = 0; i < approvedGoals.length; i++) {
    const prog = progressions[i] || [50, 65];
    for (let qi = 0; qi < quarters.length; qi++) {
      await prisma.achievement.create({
        data: {
          goalId: approvedGoals[i].id,
          cycleId: quarters[qi].id,
          actualValue: (goalDefs.find((_, idx) => goals[idx]?.id === approvedGoals[i].id)?.target || 100) * prog[qi] / 100,
          progressScore: prog[qi],
          status: prog[qi] >= 80 ? 'COMPLETED' : prog[qi] >= 40 ? 'ON_TRACK' : 'NOT_STARTED',
        }
      });
      achIdx++;
    }
  }

  console.log(`  ✅ ${achIdx} Achievement entries created (Q1 completed, Q2 mid-way for May 2026)`);

  // ── AUDIT LOGS ─────────────────────────────────
  const auditActions = ['APPROVED', 'INLINE_EDIT', 'REWORK', 'UNLOCKED', 'STATUS_CHANGE'];
  for (let i = 0; i < Math.min(goals.length, 10); i++) {
    const actionType = auditActions[i % auditActions.length];
    await prisma.auditLog.create({
      data: {
        goalId: goals[i].id,
        changedBy: i % 2 === 0 ? managerEng.id : admin.id,
        actionType,
        fieldName: actionType === 'INLINE_EDIT' ? 'target' : 'status',
        oldValue: actionType === 'INLINE_EDIT' ? '80' : 'SUBMITTED',
        newValue: actionType === 'INLINE_EDIT' ? '100' : actionType,
      }
    });
  }

  console.log('  ✅ 10 Audit Log entries created');

  // ── ESCALATION LOGS ────────────────────────────
  await prisma.escalationLog.create({
    data: { type: 'OVERDUE_APPROVAL', userId: emp1.id, message: 'Goal "Write Technical Documentation" pending approval for 12 days.' }
  });
  await prisma.escalationLog.create({
    data: { type: 'MISSING_SUBMISSION', userId: emp5.id, message: 'Employee has not submitted Q3 achievements.' }
  });
  await prisma.escalationLog.create({
    data: { type: 'OVERDUE_APPROVAL', userId: emp2.id, message: 'Goal "Reduce Bug Turnaround" rework pending for 8 days.' }
  });

  console.log('  ✅ 3 Escalation Logs created');

  // ── CHECKIN COMMENTS ───────────────────────────
  const firstAchievement = await prisma.achievement.findFirst({ where: { goalId: approvedGoals[0].id } });
  if (firstAchievement) {
    await prisma.checkinComment.create({
      data: { achievementId: firstAchievement.id, managerId: managerEng.id, comment: 'Great progress on K8s migration. Keep pushing toward the Q4 deadline.' }
    });
    await prisma.checkinComment.create({
      data: { achievementId: firstAchievement.id, managerId: managerEng.id, comment: 'Consider documenting the migration runbook for the team.' }
    });
  }

  console.log('  ✅ 2 Check-in Comments created');
  console.log('\n🎉 Seeding Complete! Demo environment is fully loaded.');
  console.log('  Login credentials: any user email + password: password123');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
