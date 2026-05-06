# Deployment Guide

## Prerequisites
- Node.js environment (v20+ recommended)
- `npm` or `pnpm`
- Environment Variables:
  - `GEMINI_API_KEY`: Required for AI Generation functionality.

## Build Process
1. Ensure all dependencies are installed:
   ```bash
   npm install
   ```
2. Build the production application bundle:
   ```bash
   npm run build
   ```
   This compiles the React 19.2.5 application and Vite configurations into the `/dist` directory.

## TUC Portfolio Pipeline Integration
This application integrates with the TUC monorepo pipeline for portfolio screenshot generation:
1. Ensure `scripts/build-serve-screenshot.js` (from the monorepo root) can access the build output.
2. The headless browser context will automatically log in with `admin/admin` and capture the `/admin/dashboard` state if `/login` redirects properly.
3. Serve the `/dist` directory using a static file server:
   ```bash
   npx serve -s dist -l 3000
   ```

## Production Considerations
- **Environment Context**: Ensure `NODE_ENV=production` is set so React optimizes its DOM bindings.
- **Security**: The current `localStorage` admin gate is sufficient for the internal, non-internet facing portfolio builder. If this tool is exposed publicly, a backend JWT implementation must replace `AdminGuard.tsx`.
