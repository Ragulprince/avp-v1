#!/bin/sh
echo "Waiting for database..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "Database is ready!"
echo "Running Prisma migrations..."
npx prisma migrate deploy
echo "Running database seed..."
npm run db:seed
echo "Starting application..."
exec "$@"