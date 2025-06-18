import winston from 'winston';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

// Ensure logs directory exists
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create Winston logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  defaultMeta: { service: 'avp-academy-backend' },
  transports: [
    new winston.transports.File({ filename: `${logDir}/error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${logDir}/combined.log` }),
  ],
});

// Add console output in non-production
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Express middleware for HTTP request logging
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

    logger.log(logLevel, `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,'/n', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: duration,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
  });

  next();
};

export { logger, requestLogger };
