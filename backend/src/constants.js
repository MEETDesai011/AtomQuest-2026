const ROLES = {
  EMPLOYEE: 'EMPLOYEE',
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN',
};

const GOAL_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REWORK: 'REWORK',
};

const ACHIEVEMENT_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  ON_TRACK: 'ON_TRACK',
  COMPLETED: 'COMPLETED',
};

const UOM = {
  MIN: 'MIN',
  MAX: 'MAX',
  TIMELINE: 'TIMELINE',
  ZERO: 'ZERO',
};

const PHASES = {
  GOAL_SETTING: 'GOAL_SETTING',
  Q1: 'Q1',
  Q2: 'Q2',
  Q3: 'Q3',
  Q4: 'Q4',
};

const THRUST_AREAS = ['Revenue', 'Cost', 'People', 'Quality', 'Safety', 'Innovation'];

const VALIDATION = {
  MAX_GOALS: 8,
  MIN_WEIGHTAGE: 10,
  TOTAL_WEIGHTAGE: 100,
};

module.exports = {
  ROLES,
  GOAL_STATUS,
  ACHIEVEMENT_STATUS,
  UOM,
  PHASES,
  THRUST_AREAS,
  VALIDATION,
};
