#!/bin/bash

echo "🚀 Starting QuizMaster in production mode..."

# Set production environment
export NODE_ENV=production

# Start the Express server
echo "🌐 Starting Express API server..."
exec node dist/server/index.production.js