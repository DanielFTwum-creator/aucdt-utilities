# Container Health Auditor (App ID 110)

## Overview
The **Container Health Auditor (CHA-110)** is an AI-powered health monitoring system designed for containerized ecosystems. It serves as a critical component of "The Sentinel" AI orchestrator, providing deep observability, anomaly detection, and predictive failure analysis.

## Key Features
- **Real-Time Dashboard**: Monitor 109+ containers with live metrics (CPU, Memory, Restarts).
- **Health Scoring**: Dynamic scoring algorithm (0-100) based on weighted resource usage and stability.
- **Predictive Analysis**: AI-driven failure probability estimation and time-to-failure forecasting.
- **Sentinel Integration**: Autonomous remediation capabilities via the Sentinel Orchestrator.
- **Admin Suite**: Comprehensive diagnostics, database monitoring, and system logs.

## Quick Start

### Development
```bash
npm install
npm run dev
```

### Deployment
See [Deployment Guide](docs/DEPLOYMENT.md) for Kubernetes/Helm instructions.

## Documentation
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Admin Guide](docs/ADMIN_GUIDE.md)
- [Testing Guide](docs/TESTING.md)
- [Gap Analysis](GAP_ANALYSIS.md)

## Tech Stack
- **Frontend**: React 19, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Node.js, Express, SQLite (better-sqlite3)
- **State Management**: Zustand
- **Testing**: Custom Test Runner

## License
Proprietary - The Sentinel Project
