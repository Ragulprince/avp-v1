
FROM node:18-alpine

WORKDIR /app

# Install necessary packages
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci 

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Create startup script
RUN echo '#!/bin/sh\n\
echo "Waiting for database..."\n\
while ! nc -z postgres 5432; do\n\
  sleep 1\n\
done\n\
echo "Database is ready!"\n\
echo "Running Prisma migrations..."\n\
npx prisma migrate deploy\n\
echo "Starting application..."\n\
exec "$@"' > /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "start"]
