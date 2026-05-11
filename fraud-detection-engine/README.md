# Fraud Detection Engine

**App ID:** 137  
**Domain:** FinTech  
**AI-Enabled:** Yes  
**Version:** 3.0.0  
**Institution:** Techbridge University College (TUC)

## Description

Real-time FinTech entity monitoring platform with health scoring, alert management, and Sentinel AI Orchestrator integration. Part of THE AGENT 256-application ecosystem.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server (Express + Vite on port 3000)
pnpm run dev

# Build for production
pnpm run build

# Run tests
pnpm test
```

## Features

- âœ… React 19.2.5 + TypeScript (locked)
- âœ… Express backend with SQLite persistence
- âœ… Real-time dashboard with stat cards and health charts
- âœ… Entity management with color-coded health scores
- âœ… System health monitoring with distribution analysis
- âœ… Alert system with severity classification and acknowledgement
- âœ… Sentinel AI Orchestrator integration (health reports + remediation)
- âœ… Admin panel with authentication (6 admin routes)
- âœ… Dark/Light theme toggle
- âœ… Responsive design
- âœ… TUC institutional branding
- âœ… Production-ready Docker deployment

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Overview stats, health trends, avg score |
| `/entities` | Entities | Entity list with health scores and status |
| `/health` | System Health | Distribution, bar chart, entity grid |
| `/alerts` | Alerts | Active alerts with acknowledge workflow |
| `/login` | Login | Admin authentication (admin/admin) |
| `/admin/*` | Admin Panel | 6 diagnostic sub-routes (protected) |

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/v1/entities` | GET | List all entities |
| `/api/v1/entities/:id` | GET | Entity detail |
| `/api/v1/entities/:id/metrics` | GET | Entity metrics |
| `/api/v1/dashboard/overview` | GET | Dashboard aggregated data |
| `/api/v1/sentinel/health-report` | GET | Sentinel health report |
| `/api/v1/sentinel/remediation` | POST | Remediation actions |
| `/api/v1/ai/predict` | POST | AI prediction (placeholder) |

## Documentation

- [SRS (IEEE 29148-2018)](./docs/SRS.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Deployment](./docs/DEPLOYMENT.md)
- [Testing](./docs/TESTING.md)
- [Admin Guide](./docs/ADMIN_GUIDE.md)

## Tech Stack

- React 19.2.5 (locked)
- TypeScript ~6.0.3
- Vite 8.x
- Express 5.x
- SQLite (better-sqlite3 12.x)
- Tailwind CSS 4.x
- Zustand 5.x
- Recharts 3.x
- Lucide React (icons)
- Framer Motion (animations)

---

Techbridge University College  
THE AGENT Project â€” 256-Application Ecosystem  
Managed by The Sentinel AI Orchestrator
