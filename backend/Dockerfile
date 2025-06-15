
FROM node:18-alpine

WORKDIR /app

# Install necessary packages including Python for native dependencies
RUN apk add --no-cache curl netcat-openbsd openssl python3 make g++ dos2unix

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci 

# Copy source code
COPY . .

# Convert line endings and make entrypoint executable
RUN dos2unix /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Generate Prisma client
RUN npx prisma generate

# Create logs and uploads directories
RUN mkdir -p logs uploads

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "start"]
