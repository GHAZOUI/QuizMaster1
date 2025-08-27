# QuizMaster Deployment Guide

## Deployment Fixed Issues

✅ **Missing build script** - Added production build configuration
✅ **TypeScript compilation** - Created tsconfig.server.json for server builds  
✅ **Production server** - Configured Express server for deployment
✅ **Dependency issues** - Resolved missing type definitions
✅ **API routes** - Simplified routes for production deployment

## Deployment Configuration

### For Replit Deployments

**Build Command:**
```bash
node deploy.js build
```

**Run Command:**
```bash
node deploy.js start
```

**Port:** 5000 (automatically configured via PORT environment variable)

### Manual Deployment

**Build the application:**
```bash
./build.sh
# or
node deploy.js build
```

**Start production server:**
```bash
./start.sh  
# or
node deploy.js start
```

### Files Created for Deployment

- `deploy.js` - Main deployment script with build/start commands
- `tsconfig.server.json` - TypeScript config for server compilation
- `server/index.production.ts` - Production server entry point
- `server/routes.production.ts` - Simplified API routes for deployment
- `build.sh` / `start.sh` - Shell script alternatives

### API Endpoints Available

- `GET /api/health` - Health check endpoint
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `GET /api/questions` - Get questions by category
- `GET /api/questions/random/:category` - Get random questions
- `POST /api/quiz-sessions` - Create quiz session
- `GET /api/quiz-sessions/:id` - Get quiz session
- `PUT /api/quiz-sessions/:id` - Update quiz session
- `GET /api/leaderboard` - Get leaderboard with filters
- `POST /api/leaderboard` - Create leaderboard entry

### Environment Variables

- `NODE_ENV=production` - Required for production mode
- `PORT` - Server port (defaults to 5000)
- `DATABASE_URL` - PostgreSQL database connection

### CORS Configuration

The production server includes CORS headers for mobile client access:
- Access-Control-Allow-Origin: *
- Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
- Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization

## Mobile App Connection

The Expo React Native mobile app can connect to the deployed API server using the deployed URL. Update the API base URL in the mobile app configuration to point to your deployed server.

## Notes

- The deployment configuration excludes authentication features to simplify the production build
- Stripe integration is optional and requires STRIPE_SECRET_KEY environment variable
- The Expo web build is optional - the core functionality is the Express API server
- Database schema will be automatically initialized on first run