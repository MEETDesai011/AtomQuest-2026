require('dotenv').config();

// Enforce IST Timezone globally for the backend
process.env.TZ = 'Asia/Kolkata';

// Vercel read-only filesystem hack for SQLite
if (process.env.VERCEL) {
  const fs = require('fs');
  const path = require('path');
  const tmpDbPath = '/tmp/dev.db';
  
  // Vercel serverless bundles can flatten directories or keep them intact. Check both.
  const possiblePaths = [
    path.join(__dirname, '../prisma/dev.db'), // Normal structure
    path.join(process.cwd(), 'prisma/dev.db'), // From working directory
    path.join(__dirname, 'prisma/dev.db') // Flattened
  ];
  
  let originalDbPath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      originalDbPath = p;
      break;
    }
  }
  
  try {
    if (!fs.existsSync(tmpDbPath)) {
      if (originalDbPath) {
        fs.copyFileSync(originalDbPath, tmpDbPath);
        console.log(`Copied DB from ${originalDbPath} to ${tmpDbPath}`);
      } else {
        console.error('CRITICAL: dev.db not found in any expected location.');
      }
    }
  } catch (err) {
    console.error('Error copying DB:', err);
  }
  process.env.DATABASE_URL = `file:${tmpDbPath}`;
}


const { z } = require('zod');

// Environment validation — server refuses to start if any are missing
const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  PORT: z.string().default("5000"),
});

try {
  envSchema.parse(process.env);
} catch (error) {
  console.error('FATAL: Missing or invalid environment variables:');
  console.error(error.errors);
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(express.json());
app.use(morgan('dev'));

// Health check
const healthController = require('./controllers/health.controller');
app.get('/api/v1/health', healthController.checkHealth);

// Prometheus Metrics
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Swagger Documentation
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Public-ish route: any authenticated user can get cycles
const { requireAuth } = require('./middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendSuccess } = require('./utils/response');

app.get('/api/v1/cycles', requireAuth, async (req, res, next) => {
  try {
    const cycles = await prisma.goalCycle.findMany({ orderBy: { createdAt: 'desc' } });
    return sendSuccess(res, cycles, 'Cycles retrieved');
  } catch (err) { next(err); }
});

const authRoutes = require('./routes/auth.routes');
const goalRoutes = require('./routes/goal.routes');
const managerRoutes = require('./routes/manager.routes');
const achievementRoutes = require('./routes/achievement.routes');
const adminRoutes = require('./routes/admin.routes');
const analyticsRoutes = require('./routes/analytics.routes');

// Routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/goals', goalRoutes);
app.use('/api/v1/manager', managerRoutes);
app.use('/api/v1/achievements', achievementRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Centralized error handler — must be registered LAST
app.use(errorHandler);

// Start Cron Jobs
const { startCron } = require('./cron/escalation');
const { startSyntheticMonitor } = require('./cron/syntheticMonitor');
const { startWeeklyAISummary } = require('./cron/weeklySummary');
startCron();
startSyntheticMonitor();
startWeeklyAISummary();

const PORT = process.env.PORT || 5000;

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ["GET", "POST"]
  }
});

// Store io globally for controllers to access
global.io = io;

io.on('connection', (socket) => {
  logger.info(`🔌 Socket client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    logger.info(`🔌 Socket client disconnected: ${socket.id}`);
  });
});

// Only start listening when running locally (not on Vercel)
if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    logger.info(`🚀 Goal Portal API running on http://localhost:${PORT}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`⚡ Socket.IO Layer initialized`);
  });
}

// Export for Vercel serverless
module.exports = app;
