# Deployment Guide

## Prerequisites
- Node.js v20+
- PNPM v9+ (recommended for faster builds)

## Build Instructions
1. **Install Dependencies:**
   ```bash
   pnpm install
   ```

2. **Build for Production:**
   ```bash
   pnpm run build
   ```
   This will generate a `dist` folder containing the compiled assets.

## Running the Application
### Development Mode
```bash
pnpm run dev
```
Runs the application with a local Express server (handling the API proxy) and Vite middleware.
- URL: `http://localhost:3000`

### Production Mode
1. Ensure the build step is complete.
2. Set `NODE_ENV=production`.
3. Run the server:
   ```bash
   pnpm start
   ```
   *Note: Ensure `package.json` has a start script pointing to `node server.ts` or `tsx server.ts` depending on the environment.*

## Environment Variables
- `PORT`: Port to run the server on (default: 3000).
- `API_URL`: (Optional) Override for the external email service URL.

## Docker Deployment
1. Use the provided `Dockerfile` (if applicable).
2. Expose port 3000.
3. Mount any necessary volumes for logs (if persistent logging is enabled).
