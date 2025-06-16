
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';
console.log("before")
const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
});
console.log("after")
// Log database queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e:any) => {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Duration: ${e.duration}ms`);
  });
}

prisma.$on('error', (e:any) => {
  logger.error('Database error:', e);
});

export { prisma };

export const connectDatabase = async () => {
  try {

    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};
