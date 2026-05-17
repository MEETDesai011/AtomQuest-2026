const { z } = require('zod');

const createGoalSchema = z.object({
  cycleId: z.string().uuid(),
  thrustArea: z.enum(['Revenue', 'Cost', 'People', 'Quality', 'Safety', 'Innovation']),
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  uom: z.enum(['MIN', 'MAX', 'TIMELINE', 'ZERO']),
  target: z.number().positive().or(z.number().min(0)), // Allow 0 for ZERO UoM
  weightage: z.number().min(10).max(100),
});

const updateGoalSchema = createGoalSchema.partial().omit({ cycleId: true });

module.exports = { createGoalSchema, updateGoalSchema };
