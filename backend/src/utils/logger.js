const winston = require('winston');

const isProd = process.env.NODE_ENV === 'production';

/**
 * Logger configuration.
 *
 * Production (Render):  Console-only JSON output — Render captures stdout/stderr
 *                       and surfaces them in the log dashboard. File transports
 *                       would fail on Render's read-only filesystem.
 *
 * Development (local):  Console with colours + pretty format for readability.
 */
const transports = [
  new winston.transports.Console({
    format: isProd
      ? winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()           // structured JSON → Render log aggregator
        )
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: 'HH:mm:ss' }),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const extras = Object.keys(meta).length
              ? ' ' + JSON.stringify(meta)
              : '';
            return `${timestamp} ${level}: ${message}${extras}`;
          })
        ),
  }),
];

const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  defaultMeta: { service: 'goal-portal-api' },
  transports,
});

module.exports = logger;
