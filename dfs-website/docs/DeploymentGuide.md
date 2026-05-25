# Deployment Guide
## Drumming for SEL Success

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher.
- **React**: 19.2.4 (Pinned).
- **Package Manager**: npm or yarn.

### 2. Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   *The server runs on port 3000 using `tsx server.ts`.*

### 3. Production Build
1. Generate the static build:
   ```bash
   npm run build
   ```
2. The output will be in the `/dist` directory.

### 4. Server Deployment
- The application uses a full-stack Express + Vite setup.
- Ensure the environment variable `NODE_ENV` is set to `production` in your hosting environment.
- The server entry point is `server.ts`.

### 5. Playwright Setup
- To run tests in a new environment, ensure browsers are installed:
  ```bash
  npx playwright install chromium
  ```

---
*Requirement: React 19.2.4 is mandatory for this build.*
