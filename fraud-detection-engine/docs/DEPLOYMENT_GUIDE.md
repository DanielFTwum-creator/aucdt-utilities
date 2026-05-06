# Deployment Guide

## Prerequisites
- Node.js `v20.x` or higher
- `pnpm` package manager
- Docker & Docker Compose (for containerized deployment)

## Environment Variables
Create a `.env` file in the project root:
```env
NODE_ENV=production
PORT=3000
VITE_API_URL=http://localhost:3000
```

## Option A: Local Bare-Metal Deployment

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Build the Frontend**
   ```bash
   pnpm run build
   ```
   *This compiles the React 19.2.4 Vite application into the `/dist` directory.*

3. **Start the Production Server**
   ```bash
   NODE_ENV=production pnpm run dev
   ```
   *In production mode, `server.ts` will serve the REST API and dynamically host the static files from `/dist`.*

## Option B: Docker Containerization (TUC Standard)

1. **Build the Image**
   Ensure `Dockerfile.vite` is correctly configured to use `node:20-alpine` and `nginx`.
   ```bash
   docker build -t tuc-fraud-engine:3.0.0 -f Dockerfile.vite .
   ```

2. **Run the Container**
   ```bash
   docker run -d -p 80:80 --name fraud-engine tuc-fraud-engine:3.0.0
   ```

## Infrastructure Topologies
As defined in `architecture.svg`:
- **Database**: SQLite (`fde.db`) resides on disk. In containerized environments, ensure the project root is mounted as a persistent volume to avoid data loss on container restart.
- **Routing**: The application expects to be mounted at `/`. If deploying under a subpath (e.g. `/fraud-engine`), update the `base` property in `vite.config.ts`.
