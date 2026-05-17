const { z } = require('zod');

/**
 * WebSocket Event Schema Contracts
 * Enforces strict typing for real-time payloads across the distributed system.
 */

const BaseEventSchema = z.object({
  timestamp: z.string().datetime(),
  traceId: z.string().uuid().optional(),
});

const SocketEventContracts = {
  // Emitted when a manager approves a goal
  'approval:created': BaseEventSchema.extend({
    payload: z.object({
      goalId: z.string().uuid(),
      approvedBy: z.string().uuid(),
      message: z.string().default('Your goal has been approved.')
    })
  }),

  // Emitted when a threaded comment is added
  'comment:added': BaseEventSchema.extend({
    payload: z.object({
      achievementId: z.string().uuid(),
      authorId: z.string().uuid(),
      content: z.string().min(1)
    })
  }),

  // Emitted by the cron engine for overdue actions
  'escalation:triggered': BaseEventSchema.extend({
    payload: z.object({
      escalationType: z.enum(['OVERDUE_APPROVAL', 'MISSING_SUBMISSION']),
      targetUserId: z.string().uuid(),
      severity: z.enum(['LOW', 'HIGH', 'CRITICAL'])
    })
  })
};

module.exports = { SocketEventContracts };
