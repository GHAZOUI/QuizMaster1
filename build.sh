#!/bin/bash

echo "🚀 Building QuizMaster for deployment..."

# Build the Express server for production
echo "📦 Building Express server..."
if npx tsc --project tsconfig.server.json; then
    echo "✅ Express server built successfully"
else
    echo "❌ Failed to build Express server"
    exit 1
fi

# For Expo web build (optional)
echo "🌐 Building Expo web version..."
mkdir -p dist
if npx expo export --platform web --output-dir dist/web --clear; then
    echo "✅ Expo web build completed"
else
    echo "⚠️  Expo web build failed, but this is okay for mobile-first deployment"
    echo "   The Express API server will still work for mobile clients"
fi

echo "🎉 Build completed! The server can now run in production mode."