#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building QuizMaster for deployment...');

// Build the Express server for production
console.log('📦 Building Express server...');
try {
  execSync('npx tsc --project tsconfig.server.json', { stdio: 'inherit' });
  console.log('✅ Express server built successfully');
} catch (error) {
  console.error('❌ Failed to build Express server');
  process.exit(1);
}

// For Expo web build (optional, since this is primarily an Expo mobile app)
console.log('🌐 Building Expo web version...');
try {
  // Create dist directory if it doesn't exist
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  
  // Export Expo web build
  execSync('npx expo export --platform web --output-dir dist/web --clear', { stdio: 'inherit' });
  console.log('✅ Expo web build completed');
} catch (error) {
  console.warn('⚠️  Expo web build failed, but this is okay for mobile-first deployment');
  console.log('   The Express API server will still work for mobile clients');
}

console.log('🎉 Build completed! The server can now run in production mode.');