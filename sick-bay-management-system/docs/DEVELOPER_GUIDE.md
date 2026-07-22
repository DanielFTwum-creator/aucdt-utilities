# SickBay Management System — Developer's Guide

**Document ID:** `TUC-ICT-DEV-2026-004-SICKBAY`  
**Repository Path:** `sick-bay-management-system/`  
**Architecture Archetype:** Node.js Express Backend (`server.ts`) + React 19 Vite SPA Frontend  
**Server Port:** `3046` (see `PORT-REGISTRY.md`)  
**Deployed Sub-path:** `/sickbay/`  

---

## 1. Architectural Architecture & Stack

The **SickBay Management System** follows the standard TUC Node/SPA architecture archetype:

```
                               ┌──────────────────────────┐
                               │  Client Browser (React)  │
                               └────────────┬─────────────┘
                                            │ HTTPS (/sickbay/)
                               ┌────────────▼─────────────┐
                               │     Nginx Reverse        │
                               │      Proxy Server        │
                               └────────────┬─────────────┘
                                            │ Port 3046
                               ┌────────────▼─────────────┐
                               │   Express Backend Server │
                               │  (server.ts via tsx)     │
                               └────────────┬─────────────┘
                                            │ X-Gemini-Proxy-Key
                               ┌────────────▼─────────────┐
                               │    TUC WMS Gateway       │
                               │   (Port 8081 / Systemd)  │
                               └──────────────────────────┘
```

### Core Technologies
- **Frontend Framework:** React 19.0 + TypeScript 5.8 + Vite 6.2 + Tailwind CSS v4
- **UI Components & Motion:** Lucide React Icons + Framer Motion + Recharts
- **PDF Generation:** jsPDF
- **Backend Runtime:** Node.js v26.3.1 running Express v4 via `tsx`
- **Process Management:** PM2 process name `sickbay`
- **Authentication Relay:** WMS OAuth Proxy Relay (Pattern 35)

---

## 2. Directory Structure

```
sick-bay-management-system/
├── CONSTRAINTS.md          # Environment specification (Overrides all defaults)
├── README.md               # Quick start documentation
├── package.json            # Monorepo app configuration & dependencies
├── tsconfig.json           # TypeScript compiler configuration
├── vite.config.ts          # Vite build config (base '/sickbay/', manualChunks)
├── server.ts               # Express backend entry point (Port 3046)
├── deploy.ps1              # Remote deployment script for PowerShell
├── index.html              # Pattern 2 TUC standard HTML entry point
├── docs/
│   ├── USER_GUIDE.md       # User Guide documentation
│   ├── DEVELOPER_GUIDE.md  # Developer's technical reference
│   ├── architecture.svg    # System architecture diagram
│   └── erd.svg             # Entity-Relationship diagram
├── public/                 # Static public assets
└── src/
    ├── App.tsx             # Root application component & state machine
    ├── main.tsx            # React DOM entry point
    ├── index.css           # Global Tailwind CSS import
    ├── types.ts            # Clinical data type definitions
    ├── components/         # Bento-grid modular UI components
    │   ├── Dashboard.tsx
    │   ├── VisitLogger.tsx
    │   ├── VisitsListView.tsx
    │   ├── VitalsTrendView.tsx
    │   ├── RosterView.tsx
    │   ├── InventoryView.tsx
    │   ├── ReferralsView.tsx
    │   ├── FacilityLogView.tsx
    │   └── ReportsView.tsx
    └── data/
        └── mockData.ts     # Initial seed clinical dataset
```

---

## 3. Local Development Setup

### Prerequisites
- Node.js v26.3.1 (via NVM)
- `pnpm` 11.x (strictly required per project standards)

### Installation & Execution
```powershell
# 1. Navigate to project root
cd C:\Development\github\aucdt-utilities\sick-bay-management-system

# 2. Install dependencies cleanly
pnpm install

# 3. Start local development server (Port 3046)
pnpm dev

# 4. Execute TypeScript linting check
pnpm lint

# 5. Build production bundle
pnpm build
```

---

## 4. Sub-Path Serving & Nginx Integration Rules

### 4.1 Sub-Path Strip Middleware (Pattern 38)
Nginx proxies all requests from `https://ai-tools.techbridge.edu.gh/sickbay/*` to `http://localhost:3046/sickbay/*` without stripping the `/sickbay` prefix. `server.ts` handles this seamlessly via prefix-stripping middleware:

```typescript
const BASE_PATH = '/sickbay';

// Strip prefix so root API routes match incoming requests
app.use((req, _res, next) => {
  if (req.url.startsWith(`${BASE_PATH}/api/`)) {
    req.url = req.url.slice(BASE_PATH.length);
  }
  next();
});

// Dual registration guarantees health check availability
app.get(['/api/health', '/sickbay/api/health'], (_req, res) => {
  res.json({ status: 'healthy', service: 'sickbay', port: 3046 });
});
```

### 4.2 Code-Splitting & Bundle Budget (Pattern 31)
Heavy libraries (`recharts`, `jspdf`, `lucide-react`, `motion`) are code-split in `vite.config.ts` so `pnpm build` produces no chunks greater than 600 kB:

```typescript
export default defineConfig(() => ({
  base: '/sickbay/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-recharts': ['recharts'],
          'vendor-jspdf': ['jspdf'],
          'vendor-icons': ['lucide-react', 'motion'],
        },
      },
    },
  },
}));
```

---

## 5. Deployment Pipeline

Deployments are executed via the PowerShell script `deploy.ps1`:

```powershell
# Execute remote production deployment with frontend build step
cd C:\Development\github\aucdt-utilities\sick-bay-management-system
.\deploy.ps1 -Build
```

### Deployment Verification
After deployment, verify process uptime and health check response:
```bash
# Check PM2 process status
ssh root@techbridge.edu.gh "pm2 describe sickbay"

# Check internal API health endpoint
ssh root@techbridge.edu.gh "curl -s http://localhost:3046/sickbay/api/health"
```
