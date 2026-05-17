const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cron = require('node-cron');
const { writeFileSync } = require('fs');
const path = require('path');

// Runs on the 1st of every month at 2:00 AM
cron.schedule('0 2 1 * *', async () => {
  console.log('[CRON] Starting monthly audit log retention policy sweep...');
  try {
    // Calculate date exactly 7 years ago
    const sevenYearsAgo = new Date();
    sevenYearsAgo.setFullYear(sevenYearsAgo.getFullYear() - 7);

    // Fetch old logs
    const oldLogs = await prisma.auditLog.findMany({
      where: {
        changedAt: {
          lt: sevenYearsAgo
        }
      }
    });

    if (oldLogs.length > 0) {
      // 1. Archive to disk (CSV format)
      const archivePath = path.join(__dirname, `../../archives/audit_archive_${sevenYearsAgo.getFullYear()}_${sevenYearsAgo.getMonth() + 1}.json`);
      writeFileSync(archivePath, JSON.stringify(oldLogs, null, 2));

      // 2. Delete from active DB
      const deleted = await prisma.auditLog.deleteMany({
        where: {
          changedAt: {
            lt: sevenYearsAgo
          }
        }
      });
      
      console.log(`[CRON] Successfully archived and purged ${deleted.count} audit logs older than 7 years.`);
    } else {
      console.log('[CRON] No audit logs older than 7 years found. Retention policy met.');
    }
  } catch (error) {
    console.error('[CRON] Error during audit retention sweep:', error);
  }
});
