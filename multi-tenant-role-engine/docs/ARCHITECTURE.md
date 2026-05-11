# System Architecture - Multi-Tenant Role Engine (App ID 119)

## High-Level Architecture

```mermaid
graph TD
    User[User/Admin] -->|HTTPS| Frontend[React Frontend]
    Sentinel[The Sentinel AI] -->|WebSocket| API[API Gateway]

    subgraph "Multi-Tenant Role Engine"
        Frontend --> API
        API -->|Read/Write| DB[(SQLite Database)]

        Backend[Express Server] -->|Manages| DB
        Backend -->|Serves| Frontend
    end
```

## Technology Stack

**Frontend:**
- React 19.2.5
- TypeScript 5.8.2
- Tailwind CSS 4.1.14
- Zustand 5.0.11
- Recharts 3.7.0

**Backend:**
- Express 4.21.2
- Node.js 20+
- SQLite (better-sqlite3)
- Axios 1.13.6

**Deployment:**
- Docker + Nginx
- Kubernetes 1.27+
- Helm charts

## Component Structure

```
src/
â”œâ”€â”€ components/       # Reusable UI components
â”œâ”€â”€ pages/           # Route-level page components
â”‚   â””â”€â”€ admin/       # Protected admin pages
â”œâ”€â”€ authStore.ts     # Authentication state
â”œâ”€â”€ themeStore.ts    # Theme management
â”œâ”€â”€ store.ts         # Main app state
â”œâ”€â”€ App.tsx          # Router configuration
â”œâ”€â”€ Layout.tsx       # Main layout with sidebar
â””â”€â”€ main.tsx         # Application entry point
```

## Sentinel Integration

This application integrates with The Sentinel AI Orchestrator via:

1. **Health Reporting:** `/api/v1/sentinel/health-report`
2. **Remediation Actions:** `/api/v1/sentinel/remediation`
3. **WebSocket Connection:** Real-time bidirectional communication

## Security

- Admin routes protected with authentication
- JWT token validation (future enhancement)
- Rate limiting on API endpoints
- SQL injection prevention via prepared statements
