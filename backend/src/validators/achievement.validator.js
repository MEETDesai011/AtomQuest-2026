const { z } = require('zod');

const saveAchievementSchema = z.object({
  goalId: z.string().uuid(),
  cycleId: z.string().uuid(),
  actualValue: z.number().nullable(),
  status: z.enum(['NOT_STARTED', 'ON_TRACK', 'COMPLETED']),
});

module.exports = { saveAchievementSchema };
