# directive-workflow - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for directive-workflow.

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

### FILE: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: backend/.env.example
```text
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/directive_workflow_db

# JWT Configuration
JWT_SECRET=[REDACTED_CREDENTIAL]
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
  "name": "Directive Workflow-backend",
  "version": "1.0.0",
  "description": "Backend API for Directive Workflow",
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
# Directive Workflow - Backend API

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

### FILE: backend/src/server.ts
```typescript
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

// Routes
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
// Import additional routes here

dotenv.config();

const app = express();
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

### FILE: CREATION.md
```md
# directive-workflow

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

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/directive-workflow/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/directive-workflow/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/directive-workflow/',  // REQUIRED: Assets must load from /directive-workflow/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/directive-workflow"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/directive-workflow">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/directive-workflow/`, not at the root
- **Asset Loading**: Without `base: '/directive-workflow/'`, assets try to load from `/assets/` instead of `/directive-workflow/assets/`
- **Routing**: Without `basename="/directive-workflow"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/directive-workflow/assets/index-*.js`
- Link tags should reference: `/directive-workflow/assets/index-*.css`

If they reference `/assets/` instead of `/directive-workflow/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/directive-workflow/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/directive-workflow/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: directive-workflow

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

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — directive-workflow

**Application:** directive-workflow
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

Audit log data is stored in `localStorage` under the key `tuc_directive-workflow_audit`.

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

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — directive-workflow

**Application:** directive-workflow
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd directive-workflow
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
docker-compose -f docker-compose-all-apps.yml build directive-workflow
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up directive-workflow
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

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Directive Workflow
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Directive Workflow**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Directive Workflow** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Directive Workflow** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Modular React component architecture
- Custom React hooks for state management
- Service layer for API integration

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
| Docker service configured | âœ… Compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1
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

### FILE: docs/TESTING.md
```md
# Testing Guide — directive-workflow

**Application:** directive-workflow
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd directive-workflow
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

### FILE: eslint.config.js
```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])

```

### FILE: index.css
```css
@import "tailwindcss";


```

### FILE: index.html
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
    <meta property="og:title" content="Directive Workflow | Techbridge University College" />
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
    <meta name="twitter:title" content="Directive Workflow | Techbridge University College" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Directive Workflow | Techbridge University College</title>

    <!-- TailwindCSS -->
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />

    <style>
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
      }

      #root {
        min-height: 100vh;
      }
          .skip-to-main {
        position: absolute;
        left: -9999px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
        z-index: 9999;
      }
      .skip-to-main:focus {
        left: 8px;
        width: auto;
        height: auto;
      }
    </style>

    <script type="module" src="./src/main.tsx"></script>
  
    <style id="tuc-splash-styles">
      body { background-color: #0F0C07 !important; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: serif; overflow: hidden; }
      .tuc-splash { text-align: center; border: 1px solid rgba(200,168,75,0.2); padding: 60px; background: #141210; position: relative; }
      .tuc-splash::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #C8A84B; }
      .tuc-logo { color: #C8A84B; font-size: 3rem; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; display: block; }
      .tuc-status { color: #D4C4A0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.4em; font-size: 0.7rem; opacity: 0.6; }
      .tuc-loading { margin-top: 30px; height: 1px; width: 100px; background: rgba(200,168,75,0.2); margin-left: auto; margin-right: auto; position: relative; overflow: hidden; }
      .tuc-loading::after { content: ""; position: absolute; left: -100%; width: 50%; height: 100%; background: #C8A84B; animation: tuc-load 2s infinite; }
      @keyframes tuc-load { to { left: 150%; } }
    </style>
</head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <a href="#main-content" class="skip-to-main" aria-label="Skip to main content">Skip to main content</a>

    
    <div id="root" role="main" aria-label="Directive Workflow">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">directive workflow</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

  </body>
</html>

```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "name": "directive-workflow",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "framer-motion": "^12.34.3",
    "jszip": "^3.10.1",
    "lucide-react": "^0.575.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "tailwind-merge": "^3.5.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/jszip": "^3.4.1",
    "@types/node": "^24.10.1",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.5",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.48.0",
    "vite": "^7.3.1",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: README.md
```md
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

```

### FILE: src/a11y/aria-checklist.md
```md
# ARIA Accessibility Checklist — Directive Workflow

## Status: Phase 2 Scaffolded

The following ARIA patterns have been scaffolded. Review and wire manually.

---

## Completed (automated)
- [x] `<html lang="en">` set in index.html
- [x] `role="application"` + `aria-label` on root div (#root)
- [x] Skip-to-content link injected in index.html
- [x] `SkipLink.tsx` component created
- [x] `AccessibleLayout.tsx` component created

## Pending (manual)

### Landmark Regions
- [ ] Wrap app content in `<AccessibleLayout label="Directive Workflow">`
- [ ] Ensure `<nav aria-label="Main navigation">` on nav elements
- [ ] Ensure `<header role="banner">` on page headers
- [ ] Ensure `<footer role="contentinfo">` on footers

### Interactive Elements
- [ ] All `<button>` elements have `aria-label` or visible text
- [ ] Icon-only buttons: `<button aria-label="Close"><XIcon /></button>`
- [ ] All `<input>` elements have associated `<label>` or `aria-label`
- [ ] Links have descriptive text (not "click here")

### Dynamic Content
- [ ] Loading states: `<div aria-live="polite" aria-busy={loading}>`
- [ ] Error messages: `<p role="alert">{error}</p>`
- [ ] Success notifications: `<div aria-live="polite">`

### Images
- [ ] Decorative images: `<img alt="" aria-hidden="true" />`
- [ ] Informational images: `<img alt="Descriptive text" />`

### Focus Management
- [ ] Modal dialogs trap focus (use `aria-modal="true"`)
- [ ] Focus returns to trigger after modal closes
- [ ] Logical tab order (no positive `tabIndex`)

### Colour & Contrast
- [ ] All text meets WCAG AA (4.5:1 normal, 3:1 large)
- [ ] TUC Maroon #630f12 on white: ✓ passes
- [ ] TUC Gold #ffcb05 on dark bg: verify contrast

---

## Resources
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [axe DevTools](https://www.deque.com/axe/)

```

### FILE: src/App.tsx
```typescript
import React, { useState } from "react";
import { PhaseCard } from "./components/PhaseCard";
import { ProjectDownloader } from "./components/ProjectDownloader";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { PHASES } from "./data/phases";
import { ThemeProvider } from "./hooks/useTheme";
import "./styles/global.css";

const AppContent: React.FC = () => {
  const [activeId, setActiveId] = useState<string>("session");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const activePhase = PHASES.find(p => p.id === activeId) || PHASES[0];
  const doneCount = Object.values(completed).filter(Boolean).length;

  const handleCopy = () => {
    navigator.clipboard.writeText(activePhase.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggleDone = () => {
    setCompleted(prev => ({
      ...prev,
      [activeId]: !prev[activeId]
    }));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--secondary)]/30">
      <Sidebar 
        activeId={activeId} 
        completed={completed} 
        onSelect={setActiveId} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar doneCount={doneCount} total={PHASES.length} />
        
        <main className="flex-1 flex flex-col min-h-0">
          <PhaseCard 
            phase={activePhase}
            isDone={!!completed[activeId]}
            onToggleDone={toggleDone}
            onCopy={handleCopy}
            copied={copied}
          />
          <ProjectDownloader />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;

```

### FILE: src/AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_directive_workflow';
const ACCENT   = '#3b82f6';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Directive Workflow</h1>
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

### FILE: src/components/AccessibleLayout.tsx
```typescript
import React from 'react';
import SkipLink from './SkipLink';

interface AccessibleLayoutProps {
  children: React.ReactNode;
  /** Describes this page/section for screen readers */
  label?: string;
}

/**
 * AccessibleLayout — wraps app content with proper landmark regions.
 * Usage: wrap your root component with <AccessibleLayout label="App Name">
 */
export default function AccessibleLayout({ children, label = 'Application' }: AccessibleLayoutProps) {
  return (
    <>
      <SkipLink targetId="main-content" />
      <main id="main-content" aria-label={label} tabIndex={-1}>
        {children}
      </main>
    </>
  );
}

```

### FILE: src/components/Badge.tsx
```typescript
import React from "react";

interface BadgeProps {
  label: string;
  color: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, color }) => {
  return (
    <span 
      className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border"
      style={{ 
        color: color, 
        backgroundColor: `${color}15`, 
        borderColor: `${color}33` 
      }}
    >
      {label}
    </span>
  );
};

```

### FILE: src/components/DirectiveCode.tsx
```typescript
import React from "react";
import { useTheme } from "../hooks/useTheme";

interface DirectiveCodeProps {
  content: string;
  color: string;
}

export const DirectiveCode: React.FC<DirectiveCodeProps> = ({ content, color }) => {
  const { theme } = useTheme();
  const lines = content.split("\n");

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[#08081a] shadow-2xl">
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#0e0e22] border-b border-[var(--border)] flex items-center px-4 gap-2 z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-4 text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-widest">
          directive_v1.txt — {lines.length} lines
        </span>
      </div>
      
      <div className="pt-10 overflow-hidden group">
        <pre className="p-6 font-mono text-[13px] leading-relaxed text-[var(--text)] whitespace-pre-wrap break-words max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar italic-brackets">
          {lines.map((line, i) => {
            const isChecked = line.trimStart().startsWith("✅");
            const isUnchecked = line.trimStart().startsWith("☐");
            const isHeader = line.startsWith("---") || 
              (line === line.toUpperCase() && line.trim().length > 4 && 
               !line.includes("☐") && !line.includes("✅"));
            
            return (
              <div 
                key={i} 
                className={`transition-colors duration-150 ${
                  isChecked ? "text-[var(--success)] font-medium" : 
                  isUnchecked ? "text-[var(--text-muted)]" : 
                  isHeader ? "font-bold tracking-wide" : ""
                }`}
                style={{ color: isHeader ? color : undefined }}
              >
                {line || "\u00A0"}
              </div>
            );
          })}
        </pre>
        
        <div className="absolute top-12 right-6 opacity-5 pointer-events-none select-none text-9xl font-black italic gold-shimmer">
          {theme === "highContrast" ? "" : "DIRECTIVE"}
        </div>
      </div>
    </div>
  );
};

```

### FILE: src/components/PhaseCard.tsx
```typescript
import { CheckCircle, Copy } from "lucide-react";
import React from "react";
import type { Phase } from "../types";
import { Badge } from "./Badge";
import { DirectiveCode } from "./DirectiveCode";

interface PhaseCardProps {
  phase: Phase;
  isDone: boolean;
  onToggleDone: () => void;
  onCopy: () => void;
  copied: boolean;
}

export const PhaseCard: React.FC<PhaseCardProps> = ({ 
  phase, 
  isDone, 
  onToggleDone, 
  onCopy, 
  copied 
}) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--surface-alt)]/30">
      <div className="p-8 border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
        <div className="flex items-start gap-6 max-w-6xl mx-auto w-full">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-2xl"
            style={{ 
              background: phase.gradient,
              boxShadow: `0 12px 32px ${phase.color}44`
            }}
          >
            {phase.icon}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge label={phase.label} color={phase.color} />
              <Badge label={phase.tag} color={phase.color} />
            </div>
            <h2 className="text-2xl font-black text-[var(--text)] tracking-tight mb-1">{phase.title}</h2>
            <p className="text-sm text-[var(--text-muted)] font-medium">{phase.subtitle}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onToggleDone}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-bold text-xs transition-all duration-300 ${
                isDone 
                ? "bg-[var(--success)] shadow-lg shadow-emerald-500/20 text-white border-transparent" 
                : "bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-dim)]"
              }`}
            >
              {isDone ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 rounded-sm border-2 border-currentColor" />}
              {isDone ? "PHASE COMPLETE" : "MARK COMPLETE"}
            </button>
            
            <button
              onClick={onCopy}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white transition-all duration-300 shadow-xl ${
                copied ? "bg-[var(--success)]" : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:-translate-y-0.5"
              }`}
              style={{ 
                backgroundColor: copied ? undefined : phase.color,
                boxShadow: copied ? "0 10px 25px rgba(16, 185, 129, 0.4)" : `0 10px 25px ${phase.color}55`
              }}
            >
              <Copy size={14} />
              {copied ? "COPIED TO CLIPBOARD" : "COPY DIRECTIVE"}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto w-full">
          <DirectiveCode content={phase.content} color={phase.color} />
        </div>
      </div>
    </div>
  );
};

```

### FILE: src/components/ProjectDownloader.tsx
```typescript
import { Download, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { generateProjectZip } from "../services/ZipService";

export const ProjectDownloader: React.FC = () => {
  const [progress, setProgress] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateProjectZip(setProgress);
    } catch (error) {
      setProgress("Download failed. Please try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 mt-auto border-t border-[var(--border)] bg-[var(--surface-alt)]/50">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-8">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">Export Baseline Project</h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Generate a pre-configured Vite + React 19 project structure containing this workflow 
            utility as a standalone implementation. Ready for <code className="bg-white/5 px-1 rounded text-[var(--accent)]">pnpm install</code>.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-3 min-w-[240px]">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-2xl ${
              isGenerating 
              ? "bg-[var(--surface-alt)] text-[var(--text-dim)] cursor-not-allowed" 
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:-translate-y-1 hover:shadow-blue-500/20"
            }`}
          >
            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
            {isGenerating ? "GENERATING..." : "DOWNLOAD BASELINE"}
          </button>
          
          {progress && (
            <div className="text-[10px] font-bold text-[var(--text-muted)] italic animate-pulse">
              {progress}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

```

### FILE: src/components/Sidebar.tsx
```typescript
import { CheckCircle2, ChevronRight } from "lucide-react";
import React from "react";
import { PHASES } from "../data/phases";

interface SidebarProps {
  activeId: string;
  completed: Record<string, boolean>;
  onSelect: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeId, completed, onSelect }) => {
  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--surface-alt)] flex flex-col shrink-0 h-full overflow-hidden">
      <div className="p-4 border-b border-[var(--border)]">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-dim)]">
          Workflow Navigation
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {PHASES.map((phase) => {
          const isActive = activeId === phase.id;
          const isDone = !!completed[phase.id];
          
          return (
            <button
              key={phase.id}
              onClick={() => onSelect(phase.id)}
              className={`w-full group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
                isActive ? "bg-[var(--surface)] shadow-md border border-[var(--border)]" : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <div 
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 transition-all duration-200 ${
                  isActive ? "scale-110 shadow-lg" : "grayscale opacity-50"
                }`}
                style={{ 
                  background: isActive ? phase.gradient : "transparent",
                  boxShadow: isActive ? `0 4px 12px ${phase.color}33` : "none"
                }}
              >
                {phase.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isActive ? "" : "text-[var(--text-dim)]"}`} style={{ color: isActive ? phase.color : undefined }}>
                  {phase.label}
                </div>
                <div className={`text-xs font-semibold truncate ${isActive ? "text-[var(--text)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-muted)]"}`}>
                  {phase.title}
                </div>
              </div>
              
              {isDone && <CheckCircle2 size={14} className="text-[var(--success)] shrink-0" />}
              {isActive && !isDone && <ChevronRight size={14} className="text-[var(--text-dim)] opacity-50 shrink-0" />}
            </button>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[var(--success)] shadow-[0_0_8px_var(--success)] animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Live Environment</span>
        </div>
        <div className="text-[9px] text-[var(--text-dim)] font-mono uppercase tracking-tighter">
          ver: 1.0.0-PRO / stable
        </div>
      </div>
    </aside>
  );
};

```

### FILE: src/components/SkipLink.tsx
```typescript
import React from 'react';

/**
 * SkipLink — allows keyboard users to skip directly to main content.
 * Usage: <SkipLink targetId="main-content" />
 */
export default function SkipLink({ targetId = 'main-content' }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#630f12] focus:text-white focus:rounded-lg focus:font-medium"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
}

```

### FILE: src/components/TopBar.tsx
```typescript
import React from "react";

interface TopBarProps {
  doneCount: number;
  total: number;
}

export const TopBar: React.FC<TopBarProps> = ({ doneCount, total }) => {
  const percentage = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  return (
    <header className="h-16 px-6 flex items-center gap-4 bg-[var(--surface)] border-b border-[var(--border)] shrink-0 shadow-sm relative z-10">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
        🤖
      </div>
      <div className="flex-1">
        <h1 className="text-sm font-bold tracking-tight">AI Studio Directive Workflow</h1>
        <p className="text-[11px] text-[var(--text-muted)]">Sequential precision directives</p>
      </div>
      
      <div className="w-48 text-right hidden sm:block">
        <div className="flex justify-between items-center mb-1.5 px-1">
          <span className="text-[10px] uppercase font-bold text-[var(--text-dim)] tracking-wider">Progress</span>
          <span className="text-[10px] font-bold text-[var(--success)]">{doneCount}/{total} PHASES</span>
        </div>
        <div className="h-1.5 w-full bg-[var(--surface-alt)] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </header>
  );
};

```

### FILE: src/data/phases.ts
```typescript
import type { Phase } from "../types";

export const PHASES: Phase[] = [
  {
    id: "session",
    label: "SESSION START",
    icon: "🚀",
    color: "#a78bfa",
    gradient: "linear-gradient(135deg, #a78bfa, #7c3aed)",
    title: "Session Kickoff",
    subtitle: "Paste this FIRST in every new AI Studio session",
    tag: "Always First",
    content: `SESSION PERMANENT REQUIREMENTS:
1. React 19.2.4 ONLY
2. ZERO broken links - implement fully or exclude
3. Gap analysis mandatory after implementation (SRS ↔ Implementation two-way sync)
4. ALL diagnostics in /admin section only
5. Update SRS to match actual implementation

Confirm these requirements understood before proceeding.`,
  },
  {
    id: "phase1",
    label: "PHASE 1",
    icon: "🔍",
    color: "#34d399",
    gradient: "linear-gradient(135deg, #34d399, #059669)",
    title: "Foundation & Compliance",
    subtitle: "Pre-flight checks, SRS generation, gap analysis",
    tag: "Required",
    content: `EXECUTE PHASE 1 ONLY - DO NOT PROCEED UNTIL CONFIRMED

PRE-FLIGHT CHECKS (MANDATORY):
☐ Verify React version = 19.2.4 in package.json
☐ Review all existing links/buttons - flag any broken ones
☐ Confirm SRS document exists and is current

IMPLEMENTATION:
☐ Clean project synchronisation - reset to latest stable
☐ Generate/update IEEE standard SRS for current state
☐ Regenerate primary AI agent component
☐ Execute initial gap analysis (SRS vs current implementation)

COMPLETION REQUIREMENTS:
✅ All pre-flight checks passed
✅ SRS document created/updated
✅ Initial gap analysis report generated
✅ State "PHASE 1 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 2 UNTIL CONFIRMED`,
  },
  {
    id: "phase2",
    label: "PHASE 2",
    icon: "🔒",
    color: "#60a5fa",
    gradient: "linear-gradient(135deg, #60a5fa, #2563eb)",
    title: "Security & Accessibility",
    subtitle: "Admin auth, diagnostics routing, themes, a11y",
    tag: "Required",
    content: `EXECUTE PHASE 2 ONLY - DO NOT PROCEED UNTIL CONFIRMED

PRE-IMPLEMENTATION:
☐ Confirm React 19.2.4 in use
☐ Review all planned links - ensure all are implementable

IMPLEMENTATION:
☐ Admin section with password-protected auth
☐ Move ALL diagnostics to /admin/* routes
☐ Comprehensive audit logging for admin actions
☐ Full accessibility support (screen readers, keyboard nav, ARIA labels)
☐ User-selectable themes: Light, Dark, High-contrast
☐ Ensure ZERO broken links in implemented features

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs implementation)
☐ Update SRS with admin/accessibility features
☐ Verify all admin diagnostic routes functional

COMPLETION REQUIREMENTS:
✅ Admin security implemented & tested
✅ All diagnostics moved to admin section
✅ Accessibility features verified
✅ Gap analysis completed and SRS updated
✅ State "PHASE 2 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 3 UNTIL CONFIRMED`,
  },
  {
    id: "phase3",
    label: "PHASE 3",
    icon: "🧪",
    color: "#fb923c",
    gradient: "linear-gradient(135deg, #fb923c, #ea580c)",
    title: "Testing Framework",
    subtitle: "Puppeteer suite, self-testing, screenshot capture",
    tag: "Required",
    content: `EXECUTE PHASE 3 ONLY - DO NOT PROCEED UNTIL CONFIRMED

PRE-IMPLEMENTATION:
☐ Confirm React 19.2.4 in use
☐ Verify all test-related links will be functional

IMPLEMENTATION:
☐ Integrate self-testing capabilities
☐ Develop Puppeteer test suite for critical user journeys
☐ Create interactive "Puppeteer Self-Test" tab in /admin/testing
☐ Enable real-time test result display with screenshot capture
☐ Test ALL implemented links/features
☐ Remove or implement any non-functional elements

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs implementation)
☐ Update SRS with testing framework details
☐ Verify zero broken links in test interfaces

COMPLETION REQUIREMENTS:
✅ Test framework integrated
✅ Puppeteer tests functional
✅ Admin testing section operational
✅ Gap analysis completed and SRS updated
✅ State "PHASE 3 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 4 UNTIL CONFIRMED`,
  },
  {
    id: "phase4",
    label: "PHASE 4",
    icon: "📄",
    color: "#c084fc",
    gradient: "linear-gradient(135deg, #c084fc, #9333ea)",
    title: "Documentation & Diagrams",
    subtitle: "SVG architecture diagrams, admin/deploy/test guides",
    tag: "Required",
    content: `EXECUTE PHASE 4 ONLY - DO NOT PROCEED UNTIL CONFIRMED

PRE-IMPLEMENTATION:
☐ Gather current implementation details
☐ Confirm all features are documented

IMPLEMENTATION:
☐ Generate System Architecture Diagram (SVG) - show admin structure
☐ Generate Database Architecture Diagram (SVG) - tables, columns, relationships
☐ Create Administrator Guide (all admin features, diagnostics access)
☐ Create Deployment Guide (production deployment steps)
☐ Create Testing Guide (manual and automated test procedures)
☐ Document React 19.2.4 requirement in all guides

POST-IMPLEMENTATION:
☐ Execute gap analysis (documentation vs implementation)
☐ Ensure all implemented features are documented
☐ Verify all documentation links are valid

COMPLETION REQUIREMENTS:
✅ All SVG diagrams generated
✅ All three guides created
✅ Gap analysis completed
✅ State "PHASE 4 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 5 UNTIL CONFIRMED`,
  },
  {
    id: "phase5",
    label: "PHASE 5",
    icon: "🏁",
    color: "#f472b6",
    gradient: "linear-gradient(135deg, #f472b6, #db2777)",
    title: "Final Verification",
    subtitle: "100% SRS alignment, /docs structure, board diagrams",
    tag: "Final",
    content: `EXECUTE PHASE 5 ONLY - FINAL PHASE

FINAL IMPLEMENTATION:
☐ Update IEEE SRS document with ALL implemented features
☐ Embed SVG diagrams directly in SRS
☐ Generate board-level presentation diagrams (data flow, tech stack)
☐ Create /docs directory structure
☐ Collate all documents into /docs folder

MANDATORY FINAL GAP ANALYSIS:
☐ Complete two-way verification:
   - Every SRS feature → Implemented (or removed from SRS)
   - Every implemented feature → Documented in SRS
☐ Generate final Gap Analysis Report
☐ Confirm 100% alignment
☐ Document React 19.2.4 requirement in SRS
☐ Document admin-only diagnostic architecture in SRS

FINAL CHECKLIST:
✅ SRS 100% matches implementation
✅ Zero broken links in entire application
✅ All diagnostics in admin section
✅ React 19.2.4 confirmed
✅ Gap analysis shows 100% alignment
✅ /docs directory organised

COMPLETION REQUIREMENTS:
✅ State "ALL PHASES COMPLETE - FINAL GAP ANALYSIS CONFIRMS 100% ALIGNMENT"
✅ Attach final Gap Analysis Report

This is the final phase - complete all tasks.`,
  },
  {
    id: "singleshot",
    label: "SINGLE SHOT",
    icon: "⚡",
    color: "#fbbf24",
    gradient: "linear-gradient(135deg, #fbbf24, #d97706)",
    title: "Master Single-Shot",
    subtitle: "All 5 phases in one prompt for fast execution",
    tag: "Power Mode",
    content: `MASTER PROJECT REFRESH - ENFORCE ALL PERMANENT REQUIREMENTS

PERMANENT REQUIREMENTS (CHECK FIRST):
☐ React version = 19.2.4 (verify package.json)
☐ ZERO broken links policy in effect
☐ Gap analysis mandatory after each section
☐ All diagnostics go to /admin/* routes

EXECUTION CHECKLIST:

☐ 1. FOUNDATION & COMPLIANCE
   - Verify React 19.2.4
   - Generate/update IEEE SRS
   - Initial gap analysis (SRS vs implementation)

☐ 2. SECURITY & ACCESSIBILITY
   - Password-protected admin section
   - Move ALL diagnostics to /admin routes
   - Audit logging for admin actions
   - Full accessibility + themes (Light/Dark/High-contrast)
   - NO broken links in implementation
   - Gap analysis + SRS update

☐ 3. TESTING FRAMEWORK
   - Integrate self-testing capabilities
   - Create Puppeteer test suite
   - Add /admin/testing tab with screenshot capture
   - Test all links - implement or remove broken ones
   - Gap analysis + SRS update

☐ 4. DOCUMENTATION
   - System Architecture SVG (show admin structure)
   - Database Architecture SVG
   - Admin Guide, Deployment Guide, Testing Guide
   - Document React 19.2.4 requirement
   - Gap analysis + verify documentation alignment

☐ 5. FINAL VERIFICATION
   - Update final SRS with ALL features
   - Embed diagrams in SRS
   - Complete two-way gap analysis
   - Confirm 100% alignment
   - Organise all files in /docs directory

COMPLETION PROTOCOL:
- Mark each ☐ item as ✅ when complete
- Include gap analysis report after sections 1-5
- If ANY requirement cannot be met, STOP and report
- Final confirmation must include "100% ALIGNMENT VERIFIED"

BEGIN EXECUTION NOW`,
  },
  {
    id: "rescue",
    label: "RESCUE",
    icon: "🛟",
    color: "#f87171",
    gradient: "linear-gradient(135deg, #f87171, #dc2626)",
    title: "Rescue / Troubleshoot",
    subtitle: "Restore dropped requirements mid-session",
    tag: "Emergency",
    content: `CRITICAL REMINDER - RESTORE PERMANENT REQUIREMENTS:

React 19.2.4 ONLY — verify package.json NOW
ZERO broken links — implement fully or exclude
Gap analysis required — SRS ↔ Implementation two-way sync
ALL diagnostics in /admin section only
Update SRS to match actual implementation

---

[IF GAP ANALYSIS WAS SKIPPED]
Execute gap analysis now — compare SRS vs implementation.
Generate gap analysis report showing all discrepancies.
Two-way sync: SRS → Implementation AND Implementation → SRS.

---

[IF REACT VERSION CHANGED]
STOP — Rollback immediately. Restore React 19.2.4.
Verify package.json before any further work.

---

[IF BROKEN LINKS ADDED]
STOP — Review all links/buttons added this session.
Either fully implement or remove them entirely.
ZERO broken links is a non-negotiable requirement.

---

[IF DIAGNOSTICS ON PUBLIC PAGES]
STOP — Move all diagnostic/monitoring/test pages to /admin/* routes.
Public pages must contain ZERO diagnostic UI.

Confirm all requirements restored before continuing.`,
  },
];

```

### FILE: src/hooks/useTheme.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from "react";
import type { ColorPalette, ThemeType } from "../types";

const THEMES: Record<ThemeType, ColorPalette> = {
  dark: {
    bg: "#0b0b1a",
    surface: "#0e0e24",
    surfaceAlt: "#16162a",
    border: "#1e1e3a",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    textDim: "#475569",
    primary: "#6c63ff",
    secondary: "#00b894",
    accent: "#a78bfa",
    success: "#34d399",
    warning: "#fb923c",
    error: "#f87171",
  },
  light: {
    bg: "#f8fafc",
    surface: "#ffffff",
    surfaceAlt: "#f1f5f9",
    border: "#e2e8f0",
    text: "#0f172a",
    textMuted: "#475569",
    textDim: "#94a3b8",
    primary: "#4f46e5",
    secondary: "#059669",
    accent: "#7c3aed",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  highContrast: {
    bg: "#000000",
    surface: "#000000",
    surfaceAlt: "#111111",
    border: "#ffffff",
    text: "#ffffff",
    textMuted: "#cccccc",
    textDim: "#888888",
    primary: "#ffff00",
    secondary: "#00ff00",
    accent: "#ff00ff",
    success: "#00ff00",
    warning: "#ffff00",
    error: "#ff0000",
  },
};

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: ColorPalette;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem("directive-theme");
    return (saved as ThemeType) || "dark";
  });

  const colors = THEMES[theme];

  useEffect(() => {
    localStorage.setItem("directive-theme", theme);
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
      root.style.setProperty(cssVar, value);
    });
    root.setAttribute("data-theme", theme);
  }, [theme, colors]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

```

### FILE: src/main.tsx
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'
import { AuthGate } from './AuthGate';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

document.getElementById('tuc-splash-styles')?.remove();

```

### FILE: src/services/ZipService.ts
```typescript
import JSZip from "jszip";

export const generateProjectZip = async (onProgress: (msg: string) => void) => {
  const zip = new JSZip();
  onProgress("Initializing project structure...");

  const files: Record<string, string> = {
    "package.json": JSON.stringify({
      name: "ai-studio-directives",
      private: true,
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
      },
      dependencies: {
        react: "19.2.4",
        "react-dom": "19.2.4"
      },
      devDependencies: {
        "@vitejs/plugin-react": "^4.3.4",
        vite: "^6.3.5"
      }
    }, null, 2),
    "vite.config.js": `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,
    "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Studio Directive Workflow</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,
    ".gitignore": `node_modules\ndist\n.env\n.DS_Store\n*.local`,
    "README.md": `# AI Studio Directive Workflow\n\nComplete production-ready project.`,
    "src/index.css": `body { background: #0b0b1a; color: #e2e8f0; }`,
    "src/main.jsx": `import { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport './index.css'\nimport App from './App.jsx'\n\ncreateRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)`,
    "src/App.jsx": `export default function App() { return <div>AI Studio Directive Workflow</div> }`
  };

  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }

  onProgress("Generating ZIP archive...");
  const content = await zip.generateAsync({ type: "blob" });
  
  onProgress("Finalizing download...");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = "ai-studio-directive-workflow.zip";
  link.click();
  
  onProgress("Project generated successfully!");
  setTimeout(() => onProgress(""), 3000);
};

```

### FILE: src/styles/global.css
```css
@import url('https://fonts.googleapis.com/css2?family=Cascadia+Code&family=Fira+Code:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');

:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace;

  /* Theme Transitions */
  --transition-fast: 0.1s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.4s ease;
}

[data-theme="dark"] {
  --bg: #0b0b1a;
  --surface: #0e0e24;
  --surface-alt: #16162a;
  --border: #1e1e3a;
  --text: #e2e8f0;
  --text-muted: #94a3b8;
  --text-dim: #475569;
  --primary: #6c63ff;
  --secondary: #00b894;
  --accent: #a78bfa;
  --success: #34d399;
  --warning: #fb923c;
  --error: #f87171;
}

[data-theme="light"] {
  --bg: #f8fafc;
  --surface: #ffffff;
  --surface-alt: #f1f5f9;
  --border: #e2e8f0;
  --text: #0f172a;
  --text-muted: #475569;
  --text-dim: #94a3b8;
  --primary: #4f46e5;
  --secondary: #059669;
  --accent: #7c3aed;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
}

[data-theme="highContrast"] {
  --bg: #000000;
  --surface: #000000;
  --surface-alt: #111111;
  --border: #ffffff;
  --text: #ffffff;
  --text-muted: #cccccc;
  --text-dim: #888888;
  --primary: #ffff00;
  --secondary: #00ff00;
  --accent: #ff00ff;
  --success: #00ff00;
  --warning: #ffff00;
  --error: #ff0000;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--text);
  overflow: hidden;
  transition: background var(--transition-base), color var(--transition-base);
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-dim);
}

.mono {
  font-family: var(--font-mono);
}

.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.shimmer {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.05),
    transparent
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

```

### FILE: src/types/index.ts
```typescript
export interface Phase {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly color: string;
  readonly gradient: string;
  readonly title: string;
  readonly subtitle: string;
  readonly tag: string;
  readonly content: string;
}

export type ThemeType = "dark" | "light" | "highContrast";

export interface ColorPalette {
  readonly bg: string;
  readonly surface: string;
  readonly surfaceAlt: string;
  readonly border: string;
  readonly text: string;
  readonly textMuted: string;
  readonly textDim: string;
  readonly primary: string;
  readonly secondary: string;
  readonly accent: string;
  readonly success: string;
  readonly warning: string;
  readonly error: string;
}

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — directive-workflow
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('directive-workflow E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.tsx
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

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: SRS.md
```md
# Software Requirements Specification (SRS)
## Directive Workflow - Management System

**Document Version:** 1.0
**Date:** 2026-03-03
**Project Type:** Management System
**Status:** Draft

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for Directive Workflow, a comprehensive management system designed to manage and track Directive Workflow operations.

### 1.2 Scope
Directive Workflow will provide:
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
Directive Workflow is a web-based management system that integrates with:
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

### FILE: tsconfig.app.json
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"],
  "exclude": ["src/__tests__", "**/*.test.tsx", "**/*.e2e.ts", "vitest.config.ts", "vitest.e2e.config.ts"]
}

```

### FILE: tsconfig.json
```json
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "skipLibCheck": true
  },
  "exclude": [
    "src/__tests__",
    "**/*.test.tsx",
    "**/*.e2e.ts",
    "vitest.config.ts",
    "vitest.e2e.config.ts"
  ]
}
```

### FILE: tsconfig.node.json
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}

```

### FILE: vite.config.ts
```typescript
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
  base: './',
  plugins: [react(), tailwindcss()],
})

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — directive-workflow
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

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — directive-workflow
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

