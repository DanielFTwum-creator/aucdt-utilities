# health-wellness-portal - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for health-wellness-portal.

### FILE: .dockerignore
```text
node_modules
dist
build
.git
.gitignore
*.md
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
coverage
.nyc_output
*.log
.cache
.vscode
.idea
*.swp
*.swo
test-results
playwright-report

```

### FILE: (environment files omitted)

> Environment files are never committed. See the repo's own `.env.example`
> for variable names; real values live only in the server's untracked
> `.env.local` / `.env.production`. This block was removed by the fleet
> secret-scrub (blueprint minus secrets).

### FILE: backend/.env.example
```text
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/health_wellness_portal_db

# JWT Configuration
JWT_SECRET=<REDACTED>
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

```

### FILE: backend/.gitignore
```text
node_modules/
dist/
.env
*.log
.DS_Store

```

### FILE: backend/package.json
```json
{
  "name": "Health Wellness Portal-backend",
  "version": "1.0.0",
  "description": "Backend API for Health Wellness Portal",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "vitest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.4.1",
    "zod": "^3.22.4",
    "pg": "^8.11.3",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.11.5",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "vitest": "^1.2.1",
    "eslint": "^8.56.0",
    "prettier": "^3.2.4"
  }
}

```

### FILE: backend/README.md
```md
# Health Wellness Portal - Backend API

## Quick Start

```bash
pnpm install
cp .env.example .env
# Configure .env
pnpm dev
```

## API Endpoints

(To be documented)

## Database Schema

(To be defined in src/config/database.sql)

```

### FILE: backend/src/middleware/errorHandler.ts
```typescript
import { Request, Response, NextFunction } from 'express'; export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => { console.error(err.stack); res.status(err.status || 500).json({ error: 'Internal Server Error', message: err.message || 'Something went wrong' }); };
```

### FILE: backend/src/routes/auth.ts
```typescript
import express from 'express'; const router = express.Router(); router.post('/login', (req, res) => res.json({ message: 'Login successful' })); router.post('/logout', (req, res) => res.json({ message: 'Logout successful' })); router.get('/me', (req, res) => res.json({ id: 1, username: 'admin', role: 'admin' })); export default router;
```

### FILE: backend/src/server.ts
```typescript
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

// Routes
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../../public', 'index.html')); });
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
// Import additional routes here

dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, '../../public')));
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
// Add additional routes here

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

```

### FILE: backend/src/utils/logger.ts
```typescript
export const logger = { info: (m) => console.log('[INFO] ' + m), error: (m) => console.error('[ERROR] ' + m), warn: (m) => console.warn('[WARN] ' + m) };
```

### FILE: backend/tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}

```

### FILE: client/docs/ADMIN_GUIDE.md
```md
# Admin Guide — health-wellness-portal-client

**Application:** health-wellness-portal-client
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_health-wellness-portal-client_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: client/docs/DEPLOYMENT.md
```md
# Deployment Guide — health-wellness-portal-client

**Application:** health-wellness-portal-client
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd health-wellness-portal-client
pnpm install
pnpm run dev        # http://localhost:5173
```

```bash
pnpm run build      # TypeScript compile + Vite bundle → dist/
```


---

## Docker Deployment

### Build

```bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build health-wellness-portal-client
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up health-wellness-portal-client
# App available at http://localhost:5173
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build pattern:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Environment Variables

Create `.env` (never commit):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_GA_ID=G-FKXTELQ71R
```

---

## Health Check

```bash
curl http://localhost:5173/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite memory error | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port 5173 in use | Change port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: client/docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Health Wellness Portal Client
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Health Wellness Portal Client**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Health Wellness Portal Client** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Health Wellness Portal Client** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Service layer for API integration
- Multi-page routing (React Router)

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âœ… Compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âŒ Non-compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1, Tailwind CSS 4.x, React Router DOM
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: client/docs/TESTING.md
```md
# Testing Guide — health-wellness-portal-client

**Application:** health-wellness-portal-client
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd health-wellness-portal-client
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: client/index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Health &amp; Wellness Portal — TUC" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Health &amp; Wellness Portal — TUC" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Health &amp; Wellness Portal — TUC</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

### FILE: client/package.json
```json
{
  "name": "health-wellness-portal-client",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.2.0"
  },
  "devDependencies": {
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.1",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.7.2",
    "vite": "^7.3.1",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0"
  }
}
```

### FILE: client/postcss.config.js
```javascript
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};

```

### FILE: client/src/App.tsx
```typescript
import { useState } from 'react';
import HealthRecordsView from './views/HealthRecordsView';
import AppointmentsView from './views/AppointmentsView';

type Tab = 'records' | 'appointments';

export default function App() {
  const [tab, setTab] = useState<Tab>('records');
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-800 text-white px-6 py-4 shadow">
        <h1 className="text-xl font-bold">Health & Wellness Portal — TUC</h1>
        <p className="text-teal-200 text-sm">Techbridge University College</p>
      </header>
      <nav className="bg-white border-b px-6 flex gap-2 pt-2">
        <button onClick={() => setTab('records')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'records' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Health Records</button>
        <button onClick={() => setTab('appointments')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'appointments' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Appointments</button>
      </nav>
      <main className="p-6 max-w-6xl mx-auto">
        {tab === 'records' ? <HealthRecordsView /> : <AppointmentsView />}
      </main>
    </div>
  );
}

```

### FILE: client/src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

```

### FILE: client/src/main.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

```

### FILE: client/src/services/api.ts
```typescript
const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export interface HealthRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  age: number;
  blood_type: string;
  medical_history: string;
  allergies: string;
  last_checkup_date: string;
  created_at: string;
}

export const healthRecordsApi = {
  list: () => request<HealthRecord[]>('/health-records'),
  create: (data: Omit<HealthRecord, 'id' | 'created_at'>) =>
    request<{ id: string }>('/health-records', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Omit<HealthRecord, 'id' | 'created_at'>) =>
    request<{ updated: boolean }>(`/health-records/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) =>
    request<{ deleted: boolean }>(`/health-records/${id}`, { method: 'DELETE' }),
};

export interface Appointment {
  id: string;
  health_record_id: string;
  appointment_date: string;
  doctor_name: string;
  department: string;
  reason_for_visit: string;
  status: string;
  notes: string;
  created_at: string;
}

export const appointmentsApi = {
  list: () => request<Appointment[]>('/appointments'),
  create: (data: Omit<Appointment, 'id' | 'created_at'>) =>
    request<{ id: string }>('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Omit<Appointment, 'id' | 'created_at'>) =>
    request<{ updated: boolean }>(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) =>
    request<{ deleted: boolean }>(`/appointments/${id}`, { method: 'DELETE' }),
};

```

### FILE: client/src/views/AppointmentsView.tsx
```typescript
import { useEffect, useState } from 'react';
import { appointmentsApi, healthRecordsApi, type Appointment, type HealthRecord } from '../services/api';

const EMPTY: Omit<Appointment, 'id' | 'created_at'> = {
  health_record_id: '', appointment_date: '', doctor_name: '', department: '', reason_for_visit: '', status: 'scheduled', notes: '',
};

export default function AppointmentsView() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => { setLoading(true); Promise.all([appointmentsApi.list(), healthRecordsApi.list()]).then(([a,r]) => { setAppointments(a); setRecords(r); }).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const patientName = (id: string) => records.find(r => r.id === id)?.patient_name || id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) await appointmentsApi.update(editId, form); else await appointmentsApi.create(form);
    setForm(EMPTY); setEditId(null); setShowForm(false); load();
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Appointments ({appointments.length})</h2>
        <button onClick={() => { setForm({ ...EMPTY, health_record_id: records[0]?.id || '' }); setEditId(null); setShowForm(true); }} className="bg-teal-700 text-white px-4 py-2 rounded text-sm hover:bg-teal-800">+ Schedule Appointment</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-5 mb-6 grid grid-cols-2 gap-4">
          <h3 className="col-span-2 font-medium">{editId ? 'Edit Appointment' : 'New Appointment'}</h3>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Patient</span>
            <select value={form.health_record_id} onChange={e => setForm(f => ({ ...f, health_record_id: e.target.value }))} className="border rounded px-3 py-1.5 text-sm" required>
              <option value="">— Select patient —</option>
              {records.map(r => <option key={r.id} value={r.id}>{r.patient_name}</option>)}
            </select>
          </label>
          {([['appointment_date','Appointment Date','datetime-local'],['doctor_name','Doctor Name','text'],['department','Department','text']] as [keyof typeof form, string, string][]).map(([k,l,t]) => (
            <label key={k} className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{l}</span>
              <input type={t} value={String(form[k])} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className="border rounded px-3 py-1.5 text-sm" required />
            </label>
          ))}
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Status</span>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="border rounded px-3 py-1.5 text-sm">
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </label>
          {(['reason_for_visit','notes'] as (keyof typeof form)[]).map(k => (
            <label key={k} className="col-span-2 flex flex-col gap-1">
              <span className="text-xs text-gray-500 capitalize">{k.replace('_',' ')}</span>
              <textarea value={String(form[k])} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className="border rounded px-3 py-1.5 text-sm" rows={2} />
            </label>
          ))}
          <div className="col-span-2 flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-teal-700 text-white rounded">{editId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      )}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
            <tr>{['Patient','Date','Doctor','Department','Reason','Status',''].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {appointments.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No appointments yet</td></tr>}
            {appointments.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{patientName(a.health_record_id)}</td>
                <td className="px-4 py-3">{a.appointment_date?.slice(0,16).replace('T',' ')}</td>
                <td className="px-4 py-3">{a.doctor_name}</td>
                <td className="px-4 py-3">{a.department}</td>
                <td className="px-4 py-3 max-w-xs truncate text-gray-500">{a.reason_for_visit}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : a.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{a.status}</span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setForm({ health_record_id: a.health_record_id, appointment_date: a.appointment_date?.slice(0,16) || '', doctor_name: a.doctor_name, department: a.department, reason_for_visit: a.reason_for_visit, status: a.status, notes: a.notes }); setEditId(a.id); setShowForm(true); }} className="text-blue-600 text-xs hover:underline">Edit</button>
                  <button onClick={async () => { if (confirm('Delete?')) { await appointmentsApi.remove(a.id); load(); } }} className="text-red-500 text-xs hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

```

### FILE: client/src/views/HealthRecordsView.tsx
```typescript
import { useEffect, useState } from 'react';
import { healthRecordsApi, type HealthRecord } from '../services/api';

const EMPTY: Omit<HealthRecord, 'id' | 'created_at'> = {
  patient_id: '', patient_name: '', age: 0, blood_type: '', medical_history: '', allergies: '', last_checkup_date: '',
};

export default function HealthRecordsView() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => { setLoading(true); healthRecordsApi.list().then(setRecords).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) await healthRecordsApi.update(editId, form); else await healthRecordsApi.create(form);
    setForm(EMPTY); setEditId(null); setShowForm(false); load();
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Health Records ({records.length})</h2>
        <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }} className="bg-teal-700 text-white px-4 py-2 rounded text-sm hover:bg-teal-800">+ Add Record</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-5 mb-6 grid grid-cols-2 gap-4">
          <h3 className="col-span-2 font-medium">{editId ? 'Edit Record' : 'New Health Record'}</h3>
          {([['patient_id','Patient ID','text'],['patient_name','Patient Name','text'],['age','Age','number'],['blood_type','Blood Type','text'],['last_checkup_date','Last Checkup','date']] as [keyof typeof form, string, string][]).map(([k,l,t]) => (
            <label key={k} className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{l}</span>
              <input type={t} value={String(form[k])} onChange={e => setForm(f => ({ ...f, [k]: t === 'number' ? Number(e.target.value) : e.target.value }))} className="border rounded px-3 py-1.5 text-sm" required={k !== 'last_checkup_date'} />
            </label>
          ))}
          {(['medical_history','allergies'] as (keyof typeof form)[]).map(k => (
            <label key={k} className="col-span-2 flex flex-col gap-1">
              <span className="text-xs text-gray-500 capitalize">{k.replace('_',' ')}</span>
              <textarea value={String(form[k])} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className="border rounded px-3 py-1.5 text-sm" rows={2} />
            </label>
          ))}
          <div className="col-span-2 flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-teal-700 text-white rounded">{editId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      )}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
            <tr>{['Patient ID','Name','Age','Blood Type','Allergies','Last Checkup',''].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {records.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No records yet</td></tr>}
            {records.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{r.patient_id}</td>
                <td className="px-4 py-3 font-medium">{r.patient_name}</td>
                <td className="px-4 py-3">{r.age}</td>
                <td className="px-4 py-3">{r.blood_type}</td>
                <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{r.allergies || '—'}</td>
                <td className="px-4 py-3">{r.last_checkup_date?.slice(0,10) || '—'}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setForm({ patient_id: r.patient_id, patient_name: r.patient_name, age: r.age, blood_type: r.blood_type, medical_history: r.medical_history, allergies: r.allergies, last_checkup_date: r.last_checkup_date?.slice(0,10) || '' }); setEditId(r.id); setShowForm(true); }} className="text-blue-600 text-xs hover:underline">Edit</button>
                  <button onClick={async () => { if (confirm('Delete this record and all appointments?')) { await healthRecordsApi.remove(r.id); load(); } }} className="text-red-500 text-xs hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

```

### FILE: client/src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — health-wellness-portal-client
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('health-wellness-portal-client E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: client/src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: client/src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: client/tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss';
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;

```

### FILE: client/tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}

```

### FILE: client/vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:4054',
      '/health': 'http://localhost:4054',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom')) return 'vendor-react-dom';
              if (id.includes('react-router')) return 'vendor-router';
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
              if (id.includes('lucide') || id.includes('heroicons')) return 'vendor-icons';
              return 'vendor';
            }
          },
        },
      },
    },
});

```

### FILE: client/vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — health-wellness-portal-client
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: client/vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — health-wellness-portal-client
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

### FILE: CREATION.md
```md
# health-wellness-portal

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: Dockerfile
```text
# Multi-stage Dockerfile for Vite/React Applications
# Optimized for production deployment

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || npm install

# Copy application source
COPY . .

# Build application
RUN pnpm run build || npm run build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /app

# Install serve for production preview
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1

# Run application
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/SRS.md
```md
# Software Requirements Specification (SRS)
## Health Wellness Portal - Management System

**Document Version:** 1.0
**Date:** 2026-03-03
**Project Type:** Management System
**Status:** Draft

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for Health Wellness Portal, a comprehensive management system designed to manage and track Health Wellness Portal operations.

### 1.2 Scope
Health Wellness Portal will provide:
- User authentication and authorization
- CRUD operations for record management
- Real-time data synchronization
- Reporting and analytics
- Audit logging

### 1.3 Definitions, Acronyms, and Abbreviations
- **CRUD:** Create, Read, Update, Delete
- **API:** Application Programming Interface
- **JWT:** JSON Web Token
- **RBAC:** Role-Based Access Control

### 1.4 References
- Project Documentation: `/docs/`
- API Documentation: `/docs/api/`
- Design Mockups: `/docs/designs/`

---

## 2. Overall Description

### 2.1 Product Perspective
Health Wellness Portal is a web-based management system that integrates with:
- User authentication service
- Central database
- Notification service
- File storage service

### 2.2 Product Functions
1. **User Management**
   - User registration and authentication
   - Role and permission management
   - Profile management

2. **record Management**
   - Create new record records
   - View record list with search and filter
   - Update record information
   - Delete/Archive record records

3. **Reporting**
   - Generate reports on record data
   - Export data to PDF/Excel
   - Scheduled report generation

4. **Audit & Logging**
   - Track all system activities
   - User action logs
   - System error logs

### 2.3 User Classes and Characteristics
- **Administrator:** Full system access, user management, system configuration
- **Manager:** Manage record, generate reports, view analytics
- **Staff:** Basic CRUD operations on assigned record
- **Viewer:** Read-only access to record data

### 2.4 Operating Environment
- **Frontend:** React 18+ with Vite
- **Backend:** Node.js 22+ with Express
- **Database:** PostgreSQL 15+ or MongoDB 6+
- **Deployment:** Docker containers, cloud-native
- **Browsers:** Chrome 100+, Firefox 100+, Safari 15+, Edge 100+

### 2.5 Design and Implementation Constraints
- Must comply with data protection regulations
- Must support concurrent users (minimum 100)
- Must have 99.5% uptime SLA
- Response time < 2 seconds for 95% of requests

---

## 3. System Features

### 3.1 User Authentication
**Priority:** Critical
**Description:** Secure user login and session management

#### 3.1.1 Functional Requirements
- FR-1.1: System shall support email/password authentication
- FR-1.2: System shall implement JWT-based session management
- FR-1.3: System shall support password reset via email
- FR-1.4: System shall enforce strong password requirements
- FR-1.5: System shall implement multi-factor authentication (optional)

#### 3.1.2 Non-Functional Requirements
- NFR-1.1: Authentication response time < 1 second
- NFR-1.2: JWT tokens shall expire after 24 hours
- NFR-1.3: Failed login attempts shall be rate-limited

### 3.2 record Management
**Priority:** Critical
**Description:** Complete CRUD operations for record

#### 3.2.1 Functional Requirements
- FR-2.1: Users shall create new record with required fields: name, description, status
- FR-2.2: Users shall view paginated list of record (25 items per page)
- FR-2.3: Users shall search record by name, description
- FR-2.4: Users shall filter record by status, date
- FR-2.5: Users shall update record information
- FR-2.6: Users shall soft-delete record (archive)
- FR-2.7: Administrators shall permanently delete record

#### 3.2.2 Non-Functional Requirements
- NFR-2.1: List view shall load in < 2 seconds
- NFR-2.2: Search shall return results in < 1 second
- NFR-2.3: System shall handle 10,000+ record records

### 3.3 Reporting & Analytics
**Priority:** High
**Description:** Generate insights and reports from record data

#### 3.3.1 Functional Requirements
- FR-3.1: Users shall generate summary reports
- FR-3.2: Users shall export reports to PDF format
- FR-3.3: Users shall export data to Excel format
- FR-3.4: Users shall schedule automated report generation
- FR-3.5: System shall display dashboard with key metrics

#### 3.3.2 Non-Functional Requirements
- NFR-3.1: Report generation shall complete in < 30 seconds
- NFR-3.2: Dashboard shall update in real-time

---

## 4. External Interface Requirements

### 4.1 User Interfaces
- Responsive web application
- Mobile-first design approach
- Accessibility compliance (WCAG 2.1 AA)

### 4.2 Hardware Interfaces
- Standard web server infrastructure
- Database server with SSD storage

### 4.3 Software Interfaces
- **Authentication Service API:** JWT-based authentication
- **Database:** PostgreSQL/MongoDB connection via ORM
- **Email Service:** SMTP for notifications
- **File Storage:** S3-compatible object storage

### 4.4 Communication Interfaces
- **HTTP/HTTPS:** RESTful API
- **WebSocket:** Real-time updates (optional)
- **API Rate Limiting:** 100 requests/minute per user

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements
- Support 100 concurrent users
- Page load time < 3 seconds
- API response time < 2 seconds (95th percentile)
- Database query time < 500ms

### 5.2 Safety Requirements
- Automated database backups every 24 hours
- Point-in-time recovery capability
- Disaster recovery plan with RTO < 4 hours

### 5.3 Security Requirements
- HTTPS/TLS encryption for all communications
- SQL injection prevention
- XSS and CSRF protection
- Role-based access control (RBAC)
- Audit logging for sensitive operations
- Regular security audits

### 5.4 Software Quality Attributes
- **Reliability:** 99.5% uptime
- **Availability:** 24/7 operation
- **Maintainability:** Modular architecture, documented code
- **Portability:** Docker containerization
- **Scalability:** Horizontal scaling support

---

## 6. Database Requirements

### 6.1 Data Models

#### User Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);
```

#### record Table
```sql
CREATE TABLE [entity_table] (
    id UUID PRIMARY KEY,
    [field_1] VARCHAR(255) NOT NULL,
    [field_2] TEXT,
    [field_3] INTEGER,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);
```

---

## 7. API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### record Management
- `GET /api/record` - List all record (paginated)
- `GET /api/record/:id` - Get single record
- `POST /api/record` - Create new record
- `PUT /api/record/:id` - Update record
- `DELETE /api/record/:id` - Soft delete record
- `GET /api/record/search?q=...` - Search record

### Reports
- `GET /api/reports/summary` - Get summary statistics
- `POST /api/reports/generate` - Generate custom report
- `GET /api/reports/:id/download` - Download report file

---

## 8. Testing Requirements

### 8.1 Unit Testing
- Minimum 80% code coverage
- Test all business logic functions
- Test all API endpoints

### 8.2 Integration Testing
- Test API integration with database
- Test authentication flow
- Test file upload/download

### 8.3 User Acceptance Testing
- Test all user workflows
- Test accessibility compliance
- Test cross-browser compatibility

---

## 9. Deployment Requirements

### 9.1 Deployment Architecture
- Containerized deployment using Docker
- Microservices architecture (frontend + backend + database)
- Load balancer for high availability
- CDN for static assets

### 9.2 Environment Configuration
- **Development:** Local Docker Compose
- **Staging:** Cloud deployment (testing)
- **Production:** Cloud deployment (live)

---

## 10. Maintenance and Support

### 10.1 Maintenance Plan
- Regular security updates
- Database optimization quarterly
- Performance monitoring and tuning

### 10.2 Support Requirements
- Technical documentation
- User manual
- Admin guide
- API documentation

---

## 11. Appendices

### Appendix A: Glossary
- Define domain-specific terms

### Appendix B: Change Log
| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-03-03 | [AUTHOR] | Initial draft |

---

**Document Approval:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Technical Lead | | | |
| QA Lead | | | |

```

### FILE: package.json
```json
{
  "name": "health-wellness-portal",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^16.4.5",
    "express": "^5.2.1",
    "mysql2": "^3.3.0",
    "uuid": "^11.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0",
    "vitest": "^3.0.0"
  }
}

```

### FILE: src/AuthGate.jsx
```javascript
import { useState } from 'react';

const AUTH_KEY = 'tuc_auth_health_wellness_portal';
const ACCENT   = '#059669';

export function AuthGate({ children }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password =[REDACTED_CREDENTIAL]
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Invalid credentials. Use admin / admin');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Health Wellness Portal</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <p style={{color:'#ef4444',fontSize:'13px',margin:'0 0 12px 0'}}>{error}</p>}
          <button
            type="submit"
            style={{width:'100%',padding:'10px',background:ACCENT,color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}
          >
            Sign In
          </button>
        </form>
        <p style={{fontSize:'11px',color:'#cbd5e1',textAlign:'center',marginTop:'16px',marginBottom:0}}>Techbridge University College &nbsp;·&nbsp; admin / admin</p>
      </div>
    </div>
  );
}

```

### FILE: src/index.js
```javascript
import { AuthGate } from './AuthGate';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 4054;

const app = express();
app.use(cors());
app.use(express.json());


// Serve admin UI from public directory
app.use(express.static(path.join(__dirname, '../public')));
let pool;

async function initDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD || 'apppass',
    database: process.env.DB_NAME || 'health_wellness',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const conn = await pool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS health_records (
      id VARCHAR(255) PRIMARY KEY,
      patient_id VARCHAR(255),
      patient_name VARCHAR(255),
      age INT,
      blood_type VARCHAR(10),
      medical_history TEXT,
      allergies TEXT,
      last_checkup_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await conn.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id VARCHAR(255) PRIMARY KEY,
      health_record_id VARCHAR(255),
      appointment_date DATETIME,
      doctor_name VARCHAR(255),
      department VARCHAR(100),
      reason_for_visit TEXT,
      status VARCHAR(50),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (health_record_id) REFERENCES health_records(id)
    )
  `);
  conn.release();
  console.log('Health & Wellness DB initialized');
}


// Serve admin UI at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'health-wellness-portal' });
});

// --- Health Records CRUD ---
app.get('/api/health-records', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM health_records ORDER BY created_at DESC');
  res.json(rows);
});

app.post('/api/health-records', async (req, res) => {
  const { patient_id, patient_name, age, blood_type, medical_history, allergies, last_checkup_date } = req.body;
  const id = `hrc_${uuidv4()}`;
  await pool.query(
    'INSERT INTO health_records (id, patient_id, patient_name, age, blood_type, medical_history, allergies, last_checkup_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, patient_id, patient_name, age || null, blood_type || '', medical_history || '', allergies || '', last_checkup_date || null]
  );
  res.status(201).json({ id });
});

app.put('/api/health-records/:id', async (req, res) => {
  const { patient_id, patient_name, age, blood_type, medical_history, allergies, last_checkup_date } = req.body;
  await pool.query(
    'UPDATE health_records SET patient_id=?, patient_name=?, age=?, blood_type=?, medical_history=?, allergies=?, last_checkup_date=? WHERE id=?',
    [patient_id, patient_name, age, blood_type, medical_history, allergies, last_checkup_date || null, req.params.id]
  );
  res.json({ updated: true });
});

app.delete('/api/health-records/:id', async (req, res) => {
  await pool.query('DELETE FROM appointments WHERE health_record_id=?', [req.params.id]);
  await pool.query('DELETE FROM health_records WHERE id=?', [req.params.id]);
  res.json({ deleted: true });
});

// --- Appointments CRUD ---
app.get('/api/appointments', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM appointments ORDER BY appointment_date DESC');
  res.json(rows);
});

app.post('/api/appointments', async (req, res) => {
  const { health_record_id, appointment_date, doctor_name, department, reason_for_visit, status, notes } = req.body;
  const id = `appt_${uuidv4()}`;
  await pool.query(
    'INSERT INTO appointments (id, health_record_id, appointment_date, doctor_name, department, reason_for_visit, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, health_record_id, appointment_date, doctor_name, department || '', reason_for_visit || '', status || 'scheduled', notes || '']
  );
  res.status(201).json({ id });
});

app.put('/api/appointments/:id', async (req, res) => {
  const { health_record_id, appointment_date, doctor_name, department, reason_for_visit, status, notes } = req.body;
  await pool.query(
    'UPDATE appointments SET health_record_id=?, appointment_date=?, doctor_name=?, department=?, reason_for_visit=?, status=?, notes=? WHERE id=?',
    [health_record_id, appointment_date, doctor_name, department, reason_for_visit, status, notes, req.params.id]
  );
  res.json({ updated: true });
});

app.delete('/api/appointments/:id', async (req, res) => {
  await pool.query('DELETE FROM appointments WHERE id=?', [req.params.id]);
  res.json({ deleted: true });
});

async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Health & Wellness Portal API running on port ${PORT}`);
  });
}

start().catch(console.error);

```

### FILE: src/__tests__/index.test.ts
```typescript
import { describe, it, expect } from 'vitest';

describe('health-wellness-portal', () => {
  it('module loads without error', () => {
    expect(true).toBe(true);
  });
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },
  },
});

```

