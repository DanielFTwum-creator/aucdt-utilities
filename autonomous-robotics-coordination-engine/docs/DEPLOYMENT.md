# Deployment Guide - Autonomous Robotics Coordination Engine (App ID 197)

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
docker build -t autonomous-robotics-coordination-engine:2.0.0 .

# Run container
docker run -p 3000:3000 autonomous-robotics-coordination-engine:2.0.0
```

## Kubernetes Deployment

```bash
# Deploy via Helm
helm install autonomous-robotics-coordination-engine ./charts/autonomous-robotics-coordination-engine -n infrastructure

# Verify deployment
kubectl get pods -n infrastructure -l app=autonomous-robotics-coordination-engine
```

## Environment Variables

```bash
NODE_ENV=production
PORT=3000
DATABASE_PATH=./arc.db
SENTINEL_URL=http://sentinel-service:8080
```

## Health Checks

```bash
# Application health
curl http://localhost:3000/api/health

# Sentinel health report
curl http://localhost:3000/api/v1/sentinel/health-report
```
