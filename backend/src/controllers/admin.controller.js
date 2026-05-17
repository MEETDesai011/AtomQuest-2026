const adminService = require('../services/admin.service');
const { sendSuccess, sendError } = require('../utils/response');
const { z } = require('zod');
const asyncHandler = require('../middleware/asyncHandler');

async function getUsers(req, res, next) {
  try {
    const users = await adminService.getUsers(req.query.role);
    return sendSuccess(res, users, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      role: z.enum(['EMPLOYEE', 'MANAGER', 'ADMIN']),
      department: z.string().optional(),
      managerId: z.string().uuid().optional().nullable(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        res,
        parsed.error.errors.map((e) => e.message).join(', '),
        400
      );
    }

    const user = await adminService.createUser(parsed.data);
    return sendSuccess(res, user, 'User created successfully', 201);
  } catch (error) {
    next(error);
  }
}

async function getCycles(req, res, next) {
  try {
    const cycles = await adminService.getCycles();
    return sendSuccess(res, cycles, 'Cycles retrieved successfully');
  } catch (error) {
    next(error);
  }
}

async function createCycle(req, res, next) {
  try {
    const schema = z.object({
      year: z.number().int(),
      phase: z.enum(['GOAL_SETTING', 'Q1', 'Q2', 'Q3', 'Q4']),
      windowOpen: z.string().datetime(),
      windowClose: z.string().datetime(),
      isActive: z.boolean().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        res,
        parsed.error.errors.map((e) => e.message).join(', '),
        400
      );
    }

    const cycle = await adminService.createCycle(parsed.data);
    return sendSuccess(res, cycle, 'Cycle created successfully', 201);
  } catch (error) {
    next(error);
  }
}

async function updateCycle(req, res, next) {
  try {
    const schema = z.object({
      windowOpen: z.string().datetime().optional(),
      windowClose: z.string().datetime().optional(),
      isActive: z.boolean().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        res,
        parsed.error.errors.map((e) => e.message).join(', '),
        400
      );
    }

    const cycle = await adminService.updateCycle(req.params.id, parsed.data);
    return sendSuccess(res, cycle, 'Cycle updated successfully');
  } catch (error) {
    next(error);
  }
}

async function unlockGoal(req, res, next) {
  try {
    const goal = await adminService.unlockGoal(req.params.id, req.user.userId);
    return sendSuccess(res, goal, 'Goal unlocked successfully');
  } catch (error) {
    next(error);
  }
}

async function createSharedGoal(req, res, next) {
  try {
    const schema = z.object({
      goalData: z.object({
        cycleId: z.string().uuid(),
        thrustArea: z.enum(['Revenue', 'Cost', 'People', 'Quality', 'Safety', 'Innovation']),
        title: z.string().min(3),
        description: z.string().optional(),
        uom: z.enum(['MIN', 'MAX', 'TIMELINE', 'ZERO']),
        target: z.number(),
        weightage: z.number().min(10).max(100),
      }),
      employeeIds: z.array(z.string().uuid()).min(1),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        res,
        parsed.error.errors.map((e) => e.message).join(', '),
        400
      );
    }

    const goal = await adminService.createSharedGoal(
      parsed.data.goalData,
      parsed.data.employeeIds
    );
    return sendSuccess(res, goal, 'Shared goals created successfully', 201);
  } catch (error) {
    next(error);
  }
}

async function getAchievementReport(req, res, next) {
  try {
    const data = await adminService.getAchievementReportData(req.query.cycleId);
    return sendSuccess(res, data, 'Report data retrieved successfully');
  } catch (error) {
    next(error);
  }
}

async function exportAchievementReport(req, res, next) {
  try {
    const { buffer, filename } = await adminService.exportAchievementReport(
      req.query.cycleId
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    return res.send(buffer);
  } catch (error) {
    next(error);
  }
}

async function exportAchievementReportCsv(req, res, next) {
  try {
    const { csv, filename } = await adminService.exportAchievementReportCsv(req.query.cycleId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    return res.send(csv);
  } catch (error) {
    next(error);
  }
}

async function getCompletionStatus(req, res, next) {
  try {
    const year = req.query.year || new Date().getFullYear();
    const data = await adminService.getCompletionStatus(year);
    return sendSuccess(res, data, 'Completion status retrieved successfully');
  } catch (error) {
    next(error);
  }
}

async function getAuditLogs(req, res, next) {
  try {
    const logs = await adminService.getAuditLogs(req.query);
    return sendSuccess(res, logs, 'Audit logs retrieved successfully');
  } catch (error) {
    next(error);
  }
}

async function getEscalationLogs(req, res, next) {
  try {
    const logs = await adminService.getEscalationLogs();
    return sendSuccess(res, logs, 'Escalation logs retrieved successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers: asyncHandler(getUsers),
  createUser: asyncHandler(createUser),
  getCycles: asyncHandler(getCycles),
  createCycle: asyncHandler(createCycle),
  updateCycle: asyncHandler(updateCycle),
  unlockGoal: asyncHandler(unlockGoal),
  createSharedGoal: asyncHandler(createSharedGoal),
  getAchievementReport: asyncHandler(getAchievementReport),
  exportAchievementReport: asyncHandler(exportAchievementReport),
  exportAchievementReportCsv: asyncHandler(exportAchievementReportCsv),
  getCompletionStatus: asyncHandler(getCompletionStatus),
  getAuditLogs: asyncHandler(getAuditLogs),
  getEscalationLogs: asyncHandler(getEscalationLogs),
};
