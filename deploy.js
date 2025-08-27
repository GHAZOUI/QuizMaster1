#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 QuizMaster Deployment Script');

// Function to run build
function runBuild() {
  console.log('📦 Building application for production...');
  try {
    execSync('npx tsc --project tsconfig.server.json', { stdio: 'inherit' });
    console.log('✅ Express server built successfully');
    
    // Create dist directory if it doesn't exist
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist', { recursive: true });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    return false;
  }
}

// Function to start production server
function startServer() {
  console.log('🌐 Starting production server...');
  
  // Set production environment variables
  process.env.NODE_ENV = 'production';
  process.env.PORT = process.env.PORT || '5000';
  
  // Start the Express server
  const serverProcess = spawn('node', ['dist/server/index.production.js'], {
    stdio: 'inherit',
    env: process.env
  });

  serverProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });

  serverProcess.on('exit', (code) => {
    console.log(`Server exited with code ${code}`);
    process.exit(code);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    serverProcess.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    serverProcess.kill('SIGTERM');
  });
}

// Main deployment logic
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'build':
      process.exit(runBuild() ? 0 : 1);
      break;
    case 'start':
      startServer();
      break;
    case 'deploy':
      if (runBuild()) {
        startServer();
      } else {
        process.exit(1);
      }
      break;
    default:
      console.log(`
Usage: node deploy.js [command]

Commands:
  build   - Build the application for production
  start   - Start the production server (requires build first)
  deploy  - Build and start (full deployment)

For Replit Deployments, use:
  Build Command: node deploy.js build
  Run Command: node deploy.js start
      `);
  }
}

main();