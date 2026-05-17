const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess, sendError } = require('../utils/response');

async function checkHealth(req, res, next) {
  try {
    // 1. Check DB Connection
    await prisma.$queryRaw`SELECT 1`;
    
    const healthStatus = {
      status: 'UP',
      timestamp: new Date().toISOString(),
      database: 'CONNECTED',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };

    return sendSuccess(res, healthStatus, 'System is healthy');
  } catch (error) {
    return sendError(res, 'System is degraded: Database connection failed', 503);
  }
}

module.exports = {
  checkHealth: asyncHandler(checkHealth),
};
