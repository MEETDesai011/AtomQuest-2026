require('dotenv').config();

// Enforce IST Timezone globally for the backend
process.env.TZ = 'Asia/Kolkata';

const { z } = require('zod');

// ──────────────────────────────────────────────
// Environment validation — server refuses to
// start if required variables are missing.
// ──────────────────────────────────────────────
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET:   z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  PORT:         z.string().default('5000'),
  NODE_ENV:     z.string().default('development'),
});

try {
  envSchema.parse(process.env);
} catch (error) {
  console.error('FATAL: Missing or invalid environment variables:');
  console.error(error.errors);
  process.exit(1);
}

const express   = require('express');
const cors      = require('cors');
const morgan    = require('morgan');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const logger       = require('./utils/logger');

const app = express();

// ──────────────────────────────────────────────
// Security hardening
// ──────────────────────────────────────────────
app.use(helmet());

// Render sits behind a proxy — trust the first hop so
// express-rate-limit reads the real client IP correctly.
app.set('trust proxy', 1);

// ──────────────────────────────────────────────
// CORS — allow Vercel frontend + local dev
// ──────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://atom-quest-2026.vercel.app',  // production frontend
  /\.vercel\.app$/,                       // any *.vercel.app preview deploy
];

// Allow any additional origin specified via env (e.g. custom domain)
if (process.env.FRONTEND_URL) {
  ALLOWED_ORIGINS.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no Origin header (server-to-server, curl, Postman)
    if (!origin) return callback(null, true);
    const isAllowed = ALLOWED_ORIGINS.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    if (isAllowed) return callback(null, true);
    return callback(new Error(`CORS: origin '${origin}' is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
// Handle pre-flight for all routes
app.options('*', cors(corsOptions));

// ──────────────────────────────────────────────
// Body parsing & request logging
// ──────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ──────────────────────────────────────────────
// Rate limiting
// ──────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});

// ──────────────────────────────────────────────
// Bare /health — required by Render health check
// and simple uptime monitors.
// ──────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ──────────────────────────────────────────────
// Detailed health check (existing — keep working)
// ──────────────────────────────────────────────
const healthController = require('./controllers/health.controller');
app.get('/api/v1/health', healthController.checkHealth);

// ──────────────────────────────────────────────
// Prometheus metrics
// ──────────────────────────────────────────────
const client             = require('prom-client');
const { Registry }       = client;
const register           = new Registry();
client.collectDefaultMetrics({ register });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// ──────────────────────────────────────────────
// Swagger docs
// ──────────────────────────────────────────────
const swaggerUi   = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// ──────────────────────────────────────────────
// Shared Prisma instance
// ──────────────────────────────────────────────
const { requireAuth } = require('./middleware/auth');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'production'
    ? ['error']
    : ['query', 'warn', 'error'],
});

const { sendSuccess } = require('./utils/response');

// Public-ish route: any authenticated user can get cycles
app.get('/api/v1/cycles', requireAuth, async (req, res, next) => {
  try {
    const cycles = await prisma.goalCycle.findMany({ orderBy: { createdAt: 'desc' } });
    return sendSuccess(res, cycles, 'Cycles retrieved');
  } catch (err) { next(err); }
});

// ──────────────────────────────────────────────
// Feature routes
// ──────────────────────────────────────────────
const authRoutes        = require('./routes/auth.routes');
const goalRoutes        = require('./routes/goal.routes');
const managerRoutes     = require('./routes/manager.routes');
const achievementRoutes = require('./routes/achievement.routes');
const adminRoutes       = require('./routes/admin.routes');
const analyticsRoutes   = require('./routes/analytics.routes');

app.use('/api/v1/auth',         authLimiter, authRoutes);
app.use('/api/v1/goals',        goalRoutes);
app.use('/api/v1/manager',      managerRoutes);
app.use('/api/v1/achievements', achievementRoutes);
app.use('/api/v1/admin',        adminRoutes);
app.use('/api/v1/analytics',    analyticsRoutes);

// ──────────────────────────────────────────────
// 404 catch-all
// ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

// ──────────────────────────────────────────────
// Centralized error handler — must be last
// ──────────────────────────────────────────────
app.use(errorHandler);

// ──────────────────────────────────────────────
// Cron jobs (skip on test runs)
// ──────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  const { startCron }            = require('./cron/escalation');
  const { startSyntheticMonitor } = require('./cron/syntheticMonitor');
  const { startWeeklyAISummary }  = require('./cron/weeklySummary');
  startCron();
  startSyntheticMonitor();
  startWeeklyAISummary();
}

// ──────────────────────────────────────────────
// HTTP server + Socket.IO
// ──────────────────────────────────────────────
const http     = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions,
});

// Make io accessible in controllers
global.io = io;

io.on('connection', socket => {
  logger.info(`🔌 Socket connected: ${socket.id}`);
  socket.on('disconnect', () => {
    logger.info(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// ──────────────────────────────────────────────
// Start listening — Render (and local) both use
// this path. process.env.PORT is always set on
// Render; falls back to 5000 for local dev.
// ──────────────────────────────────────────────
const PORT = parseInt(process.env.PORT, 10) || 5000;

server.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 AtomQuest API running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`⚡ Socket.IO layer initialized`);
});

// Graceful shutdown
const shutdown = async (signal) => {
  logger.info(`${signal} received — shutting down gracefully`);
  await prisma.$disconnect();
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
  // Force-kill after 10 s if connections are stuck
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

module.exports = app; // kept for supertest / future serverless usage
