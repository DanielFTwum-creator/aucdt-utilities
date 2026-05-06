# TechBridge Clinical Platform - Deployment Guide

## 1. System Requirements
- **Runtime**: Node.js v20+
- **Framework**: React 19.2.4 (Strict Requirement)
- **Database**: SQLite (Development) / MariaDB (Production recommended)
- **Browser**: Chrome/Edge (for Playwright testing)

## 2. Environment Configuration
Create a `.env` file in the root directory:

```env
# Required for Image Analysis
GEMINI_API_KEY=your_api_key_here

# Optional: Port override (Default: 3000)
PORT=3000
```

## 3. Installation
```bash
# Install dependencies
npm install

# Verify React version
npm list react
# Output must be 19.2.4
```

## 4. Build Process
The application uses Vite for bundling the frontend and `tsx` for the backend.

```bash
# Production Build
npm run build

# This generates the /dist folder containing static assets.
```

## 5. Running the Application
### Development Mode
```bash
npm run dev
# Starts server with Vite middleware on port 3000
```

### Production Mode
```bash
npm start
# Serves static assets from /dist via Express on port 3000
```

## 6. Docker Deployment
A `Dockerfile` is recommended for containerized deployment:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 7. Database Migration
- The system automatically initializes the SQLite database (`gluco.db`) on startup.
- Schema migrations are handled in `src/server/db.ts`.
- **Note**: Ensure the `/app` directory is writable for SQLite in Docker.
