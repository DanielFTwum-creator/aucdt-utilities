# Deployment Guide - Synthetic User Simulator (App ID 123)

## Prerequisites

- Kubernetes Cluster (v1.27+)
- Helm (v3.0+)
- Docker (v24.0+)
- Node.js 20+

## Local Development

```bash
# Install dependencies
npm install

# Start development server (backend + frontend)
npm run dev

# Access application
open http://localhost:3000
```

## Production Build

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

## Docker Deployment

```bash
# Build Docker image
docker build -t synthetic-user-simulator:2.0.0 .

# Run container
docker run -p 3000:3000 synthetic-user-simulator:2.0.0
```

## Kubernetes Deployment

```bash
# Deploy via Helm
helm install synthetic-user-simulator ./charts/synthetic-user-simulator -n infrastructure

# Verify deployment
kubectl get pods -n infrastructure -l app=synthetic-user-simulator
```

## Environment Variables

```bash
NODE_ENV=production
PORT=3000
DATABASE_PATH=./sus.db
SENTINEL_URL=http://sentinel-service:8080
```

## Health Checks

```bash
# Application health
curl http://localhost:3000/api/health

# Sentinel health report
curl http://localhost:3000/api/v1/sentinel/health-report
```
