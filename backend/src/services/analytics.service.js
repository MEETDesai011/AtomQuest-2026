const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getQoQTrends(year) {
  const targetYear = year ? parseInt(year) : new Date().getFullYear();

  const cycles = await prisma.goalCycle.findMany({
    where: { year: targetYear, phase: { in: ['Q1', 'Q2', 'Q3', 'Q4'] } },
    select: { id: true, phase: true },
  });

  const employees = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    include: {
      goals: {
        include: { achievements: true, cycle: true },
      },
    },
  });

  return employees.map((emp) => {
    const data = { employeeName: emp.name };
    
    // Initialize all phases to null
    ['Q1', 'Q2', 'Q3', 'Q4'].forEach(p => data[p] = null);

    const goalsInYear = emp.goals.filter(g => g.cycle?.year === targetYear);

    for (const cycle of cycles) {
      if (goalsInYear.length > 0) {
        let totalScore = 0;
        let validScores = 0;
        
        for (const goal of goalsInYear) {
          const ach = goal.achievements.find(a => a.cycleId === cycle.id);
          if (ach && ach.progressScore != null) {
            totalScore += ach.progressScore;
            validScores++;
          }
        }
        
        data[cycle.phase] = validScores > 0 ? Number((totalScore / validScores).toFixed(2)) : null;
      }
    }

    return data;
  });
}

async function getGoalDistribution(year) {
  const targetYear = year ? parseInt(year) : new Date().getFullYear();

  const goals = await prisma.goal.findMany({
    where: { 
      cycle: { year: targetYear }
    },
    select: { thrustArea: true, uom: true },
  });

  // Group by thrust area
  const distribution = {};
  for (const goal of goals) {
    if (!distribution[goal.thrustArea]) {
      distribution[goal.thrustArea] = { thrustArea: goal.thrustArea, MIN: 0, MAX: 0, TIMELINE: 0, ZERO: 0 };
    }
    distribution[goal.thrustArea][goal.uom] += 1;
  }

  return Object.values(distribution);
}

async function getCompletionHeatmap(year) {
  const targetYear = year ? parseInt(year) : new Date().getFullYear();

  const cycles = await prisma.goalCycle.findMany({
    where: { year: targetYear },
    select: { id: true, phase: true },
  });

  const employees = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    select: {
      id: true,
      department: true,
      goals: {
        include: { achievements: true, cycle: true },
      },
    },
  });

  // Group by department
  const depts = {};
  for (const emp of employees) {
    const deptName = emp.department || 'N/A';
    if (!depts[deptName]) {
      depts[deptName] = { department: deptName, employeeCount: 0 };
    }
    depts[deptName].employeeCount++;
  }

  // Calculate completion percentage per phase per department
  for (const deptName of Object.keys(depts)) {
    const deptEmps = employees.filter(e => (e.department || 'N/A') === deptName);
    
    for (const cycle of cycles) {
      let completedCount = 0;
      let expectedCount = 0;

      for (const emp of deptEmps) {
        const goalsInYear = emp.goals.filter(g => g.cycle?.year === targetYear);
        if (goalsInYear.length > 0) {
          expectedCount++;
          // Did this employee complete check-ins for all goals in this cycle?
          // If the cycle is GOAL_SETTING, check if goals exist.
          // Otherwise check achievements for that specific Q1/Q2/Q3 cycle id.
          let allCompleted = false;
          
          if (cycle.phase === 'GOAL_SETTING') {
             allCompleted = goalsInYear.length > 0;
          } else {
             const achs = goalsInYear.map(g => g.achievements.find(a => a.cycleId === cycle.id));
             allCompleted = achs.length > 0 && achs.every(a => a && a.status !== 'NOT_STARTED');
          }
          
          if (allCompleted) completedCount++;
        }
      }

      depts[deptName][cycle.phase] = expectedCount > 0 
        ? Number(((completedCount / expectedCount) * 100).toFixed(2)) 
        : null;
    }
  }

  return Object.values(depts).map((d) => {
    // Remove temporary counters before returning
    const { employeeCount, ...rest } = d;
    return rest;
  });
}

module.exports = {
  getQoQTrends,
  getGoalDistribution,
  getCompletionHeatmap,
};
