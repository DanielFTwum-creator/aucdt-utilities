# lumina-concert-video-wall - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for lumina-concert-video-wall.

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

### FILE: .gitignore
```text
node_modules/
build/
dist/
coverage/
.DS_Store
*.log
.env*
!.env.example

```

### FILE: CREATION.md
```md
# lumina-concert-video-wall

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

This application is deployed behind an Nginx reverse proxy at the path `/lumina-concert-video-wall/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/lumina-concert-video-wall/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/lumina-concert-video-wall/',  // REQUIRED: Assets must load from /lumina-concert-video-wall/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/lumina-concert-video-wall"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/lumina-concert-video-wall">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/lumina-concert-video-wall/`, not at the root
- **Asset Loading**: Without `base: '/lumina-concert-video-wall/'`, assets try to load from `/assets/` instead of `/lumina-concert-video-wall/assets/`
- **Routing**: Without `basename="/lumina-concert-video-wall"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/lumina-concert-video-wall/assets/index-*.js`
- Link tags should reference: `/lumina-concert-video-wall/assets/index-*.css`

If they reference `/assets/` instead of `/lumina-concert-video-wall/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/lumina-concert-video-wall/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/lumina-concert-video-wall/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: lumina-concert-video-wall

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
# Admin Guide — react-example

**Application:** react-example
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

Audit log data is stored in `localStorage` under the key `tuc_react-example_audit`.

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
# Deployment Guide — react-example

**Application:** react-example
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd react-example
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
docker-compose -f docker-compose-all-apps.yml build react-example
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up react-example
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

**Project:** React Example
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **React Example**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**React Example** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**React Example** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Modular React component architecture

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
Stack: React 19.2.5 + TypeScript, Vite 7.3.1, Tailwind CSS 4.x
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
# Testing Guide — react-example

**Application:** react-example
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd react-example
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
    <meta property="og:title" content="Lumina   Concert Video Wall | Techbridge University College" />
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
    <meta name="twitter:title" content="Lumina   Concert Video Wall | Techbridge University College" />
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
    <title>Lumina   Concert Video Wall | Techbridge University College</title>

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
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">lumina concert video wall</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

  </body>
</html>

```

### FILE: metadata.json
```json
{
  "name": "Lumina - Concert Video Wall",
  "description": "Interactive concert video wall generator with mouse-reactive visuals and customizable LED patterns.",
  "requestFramePermissions": []
}

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
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "@google/genai": "^1.29.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "lucide-react": "^0.546.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "vite": "^6.2.0",
    "express": "^4.21.2",
    "dotenv": "^17.2.3",
    "better-sqlite3": "^12.4.1",
    "motion": "^12.23.24",
    "react-router-dom": "^7.1.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "@types/express": "^4.17.21",
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

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/a5cdfdd5-5101-4a21-ba1b-eb846f2246c5

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/App.tsx
```typescript
import React, { useState } from 'react';
import VideoWall from './components/VideoWall';
import Controls from './components/Controls';

interface VisualConfig {
  gridSize: number;
  decay: number;
  colorPrimary: string;
  colorSecondary: string;
  sensitivity: number;
  mode: 'ripple' | 'matrix' | 'plasma' | 'wave' | 'silhouette';
  activeShape: 'africa' | 'world';
  silhouetteSize: number;
  activeVideo: string;
  useVideoBackground: boolean;
}

const VIDEOS = {
  collection: "https://sashmade.com/media/animate%20%2820%29.mp4",
  hero1: "https://sashmade.com/media/Hailuo_Video_Lifestyle%20Fashion%20Shot%20_Elegan_482623006861987841.mp4",
  hero2: "https://sashmade.com/media/WhatsApp%20Video%202026-02-19%20at%206.18.13%20PM.mp4",
  techbridge7: "https://media.techbridge.edu.gh/media/banner7.mp4",
  techbridge6: "https://media.techbridge.edu.gh/media/banner6.mp4",
  techbridge1: "https://media.techbridge.edu.gh/media/banner1.mp4"
};

export default function App() {
  const [config, setConfig] = useState<VisualConfig>({
    gridSize: 20,
    decay: 0.96,
    colorPrimary: '#00ff88', // Neon Green
    colorSecondary: '#000000', // Black
    sensitivity: 1.5,
    mode: 'ripple',
    activeShape: 'africa',
    silhouetteSize: 1.0,
    activeVideo: VIDEOS.collection,
    useVideoBackground: false,
  });

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative font-sans">
      <VideoWall config={config} />
      <Controls config={config} onChange={setConfig} />
      
      {/* Overlay for initial guidance or branding if needed, currently kept minimal for "Video Wall" feel */}
      <div className="absolute bottom-4 left-4 text-white/30 text-xs font-mono pointer-events-none select-none">
        LUMINA // INTERACTIVE DISPLAY SYSTEM v1.0
      </div>
    </div>
  );
}

```

### FILE: src/AppWithAuth.tsx
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import App from './App.tsx';

export default function AppWithAuth() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

```

### FILE: src/AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_lumina_concert_video_wall';
const ACCENT   = '#7c3aed';

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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Lumina Concert Video Wall</h1>
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

### FILE: src/components/Controls.tsx
```typescript
import React from 'react';
import { Settings, Sliders, Monitor, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface VisualConfig {
  gridSize: number;
  decay: number;
  colorPrimary: string;
  colorSecondary: string;
  sensitivity: number;
  mode: 'ripple' | 'matrix' | 'plasma' | 'wave' | 'silhouette';
  activeShape: 'africa' | 'world';
  silhouetteSize: number;
  activeVideo: string;
  useVideoBackground: boolean;
}

const VIDEOS = {
  collection: "https://sashmade.com/media/animate%20%2820%29.mp4",
  hero1: "https://sashmade.com/media/Hailuo_Video_Lifestyle%20Fashion%20Shot%20_Elegan_482623006861987841.mp4",
  hero2: "https://sashmade.com/media/WhatsApp%20Video%202026-02-19%20at%206.18.13%20PM.mp4",
  techbridge7: "https://media.techbridge.edu.gh/media/banner7.mp4",
  techbridge6: "https://media.techbridge.edu.gh/media/banner6.mp4",
  techbridge1: "https://media.techbridge.edu.gh/media/banner1.mp4"
};

interface ControlsProps {
  config: VisualConfig;
  onChange: (newConfig: VisualConfig) => void;
}

const Controls: React.FC<ControlsProps> = ({ config, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const handleChange = (key: keyof VisualConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <motion.div 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed top-4 right-4 z-50"
    >
      <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 w-80 shadow-2xl text-white">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2 font-mono">
                <Monitor className="w-5 h-5 text-emerald-400" />
                LUMINA OS
            </h2>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-white/10 rounded-full">
                <Settings className="w-5 h-5" />
            </button>
        </div>

        {isOpen && (
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['ripple', 'matrix', 'plasma', 'wave', 'silhouette'] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => handleChange('mode', m)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    config.mode === m 
                                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                                }`}
                            >
                                {m.charAt(0).toUpperCase() + m.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Background</label>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => handleChange('useVideoBackground', false)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${
                                !config.useVideoBackground
                                ? 'bg-emerald-500 text-black' 
                                : 'bg-white/5 hover:bg-white/10 text-gray-300'
                            }`}
                        >
                            Solid Black
                        </button>
                        <div className="space-y-1">
                            <button
                                onClick={() => handleChange('useVideoBackground', true)}
                                className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${
                                    config.useVideoBackground
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                                }`}
                            >
                                Video Wall
                            </button>
                            
                            {config.useVideoBackground && (
                                <div className="pl-2 space-y-1 border-l-2 border-emerald-500/30 mt-2">
                                    <button
                                        onClick={() => handleChange('activeVideo', VIDEOS.collection)}
                                        className={`w-full px-3 py-1.5 rounded text-xs font-medium text-left transition-all ${
                                            config.activeVideo === VIDEOS.collection
                                            ? 'text-emerald-400 bg-emerald-500/10' 
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        Collection / Sidebar
                                    </button>
                                    <button
                                        onClick={() => handleChange('activeVideo', VIDEOS.hero1)}
                                        className={`w-full px-3 py-1.5 rounded text-xs font-medium text-left transition-all ${
                                            config.activeVideo === VIDEOS.hero1
                                            ? 'text-emerald-400 bg-emerald-500/10' 
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        Hero: Elegant
                                    </button>
                                    <button
                                        onClick={() => handleChange('activeVideo', VIDEOS.hero2)}
                                        className={`w-full px-3 py-1.5 rounded text-xs font-medium text-left transition-all ${
                                            config.activeVideo === VIDEOS.hero2
                                            ? 'text-emerald-400 bg-emerald-500/10' 
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        Hero: Lifestyle
                                    </button>
                                    <button
                                        onClick={() => handleChange('activeVideo', VIDEOS.techbridge7)}
                                        className={`w-full px-3 py-1.5 rounded text-xs font-medium text-left transition-all ${
                                            config.activeVideo === VIDEOS.techbridge7
                                            ? 'text-emerald-400 bg-emerald-500/10' 
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        TechBridge: Banner 7
                                    </button>
                                    <button
                                        onClick={() => handleChange('activeVideo', VIDEOS.techbridge6)}
                                        className={`w-full px-3 py-1.5 rounded text-xs font-medium text-left transition-all ${
                                            config.activeVideo === VIDEOS.techbridge6
                                            ? 'text-emerald-400 bg-emerald-500/10' 
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        TechBridge: Banner 6
                                    </button>
                                    <button
                                        onClick={() => handleChange('activeVideo', VIDEOS.techbridge1)}
                                        className={`w-full px-3 py-1.5 rounded text-xs font-medium text-left transition-all ${
                                            config.activeVideo === VIDEOS.techbridge1
                                            ? 'text-emerald-400 bg-emerald-500/10' 
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        TechBridge: Banner 1
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {config.mode === 'silhouette' && (
                  <div className="space-y-4 border-t border-white/10 pt-4">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Shape</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleChange('activeShape', 'africa')}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    config.activeShape === 'africa'
                                    ? 'bg-emerald-500 text-black' 
                                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                                }`}
                            >
                                Africa
                            </button>
                            <button
                                onClick={() => handleChange('activeShape', 'world')}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    config.activeShape === 'world'
                                    ? 'bg-emerald-500 text-black' 
                                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                                }`}
                            >
                                World
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Size</span>
                            <span className="font-mono">{Math.round(config.silhouetteSize * 100)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="3.0" 
                            step="0.1"
                            value={config.silhouetteSize} 
                            onChange={(e) => handleChange('silhouetteSize', Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Sliders className="w-3 h-3" /> Parameters
                    </label>
                    
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Grid Size</span>
                            <span className="font-mono">{config.gridSize}px</span>
                        </div>
                        <input 
                            type="range" 
                            min="5" 
                            max="50" 
                            value={config.gridSize} 
                            onChange={(e) => handleChange('gridSize', Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Sensitivity</span>
                            <span className="font-mono">{Math.round(config.sensitivity * 100)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="5" 
                            step="0.1"
                            value={config.sensitivity} 
                            onChange={(e) => handleChange('sensitivity', Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Decay (Ripple)</span>
                            <span className="font-mono">{config.decay}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.8" 
                            max="0.99" 
                            step="0.01"
                            value={config.decay} 
                            onChange={(e) => handleChange('decay', Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Palette</label>
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-1">
                            <span className="text-[10px] text-gray-500">Primary</span>
                            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                                <input 
                                    type="color" 
                                    value={config.colorPrimary}
                                    onChange={(e) => handleChange('colorPrimary', e.target.value)}
                                    className="w-6 h-6 rounded bg-transparent border-none cursor-pointer"
                                />
                                <span className="text-xs font-mono">{config.colorPrimary}</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <span className="text-[10px] text-gray-500">Secondary</span>
                            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                                <input 
                                    type="color" 
                                    value={config.colorSecondary}
                                    onChange={(e) => handleChange('colorSecondary', e.target.value)}
                                    className="w-6 h-6 rounded bg-transparent border-none cursor-pointer"
                                />
                                <span className="text-xs font-mono">{config.colorSecondary}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Activity className="w-3 h-3 animate-pulse text-emerald-500" />
                        <span>System Active • 60 FPS</span>
                    </div>
                </div>
            </div>
        )}
      </div>
    </motion.div>
  );
};

export default Controls;

```

### FILE: src/components/ProtectedRoute.tsx
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Verifying session…</div>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

```

### FILE: src/components/VideoWall.tsx
```typescript
import React, { useEffect, useRef } from 'react';

interface VisualConfig {
  gridSize: number;
  decay: number;
  colorPrimary: string;
  colorSecondary: string;
  sensitivity: number;
  mode: 'ripple' | 'matrix' | 'plasma' | 'wave' | 'silhouette';
  activeShape: 'africa' | 'world';
  silhouetteSize: number;
  activeVideo: string;
  useVideoBackground: boolean;
}

const SHAPES = {
  // Simplified Africa path
  africa: "M 420 100 L 550 100 L 600 180 L 650 250 L 620 350 L 550 450 L 480 550 L 400 450 L 350 350 L 300 250 L 320 180 L 380 120 Z", 
  // Very rough World Map approximation (just a placeholder for the concept)
  world: "M 100 100 H 900 V 500 H 100 Z" 
};

// More detailed Africa path with Madagascar
const AFRICA_PATH = "M 360 110 L 420 100 L 480 105 L 520 120 L 540 140 L 560 200 L 630 245 L 600 300 L 580 400 L 550 500 L 480 630 L 420 560 L 390 480 L 400 400 L 300 350 L 220 260 L 250 180 L 300 140 Z M 610 450 L 650 460 L 640 550 L 600 530 Z";

const VideoWall: React.FC<{ config: VisualConfig }> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const animationRef = useRef<number>(0);
  const failedSourcesRef = useRef<Set<string>>(new Set());

  // Grid state for ripple effect
  const gridRef = useRef<Float32Array>(new Float32Array(0));
  const prevGridRef = useRef<Float32Array>(new Float32Array(0));

  // Offscreen canvas for shape sampling
  const shapeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!config.useVideoBackground) {
        video.pause();
        return;
    }

    const fallbackUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    const targetUrl = config.activeVideo;
    
    // Determine which URL to use: Target or Fallback
    const urlToUse = failedSourcesRef.current.has(targetUrl) ? fallbackUrl : targetUrl;

    const attemptPlay = async () => {
        try {
            await video.play();
        } catch (err) {
            console.warn("Playback failed, attempting mute:", err);
            if (!video.muted) {
                video.muted = true;
                try {
                    await video.play();
                } catch (err2) {
                    console.error("Retry playback failed:", err2);
                }
            }
        }
    };

    video.onerror = () => {
        console.error(`Video error for source: ${video.src}`);
        // Mark the requested video as failed
        failedSourcesRef.current.add(targetUrl);
        
        // If we aren't already on the fallback, switch to it
        if (video.src !== fallbackUrl && urlToUse !== fallbackUrl) {
            console.log("Switching to fallback video...");
            video.src = fallbackUrl;
            video.load();
            attemptPlay();
        }
    };

    // Only load if the source is different
    if (video.src !== urlToUse) {
        video.src = urlToUse;
        video.load();
        attemptPlay();
    } else {
        // If already loaded but paused, play
        if (video.paused) {
            attemptPlay();
        }
    }
  }, [config.useVideoBackground, config.activeVideo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) return;
    
    // We use alpha: false for performance, as we handle all drawing manually
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Initialize grid
    const cols = Math.ceil(width / config.gridSize);
    const rows = Math.ceil(height / config.gridSize);
    const numCells = cols * rows;
    
    if (gridRef.current.length !== numCells) {
      gridRef.current = new Float32Array(numCells);
      prevGridRef.current = new Float32Array(numCells);
    }

    // Initialize shape canvas
    if (!shapeCanvasRef.current) {
        shapeCanvasRef.current = document.createElement('canvas');
    }
    const shapeCtx = shapeCanvasRef.current.getContext('2d');
    if (shapeCtx) {
        shapeCanvasRef.current.width = width;
        shapeCanvasRef.current.height = height;
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      if (shapeCanvasRef.current) {
          shapeCanvasRef.current.width = width;
          shapeCanvasRef.current.height = height;
      }

      const newCols = Math.ceil(width / config.gridSize);
      const newRows = Math.ceil(height / config.gridSize);
      gridRef.current = new Float32Array(newCols * newRows);
      prevGridRef.current = new Float32Array(newCols * newRows);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      timeRef.current += 0.01;
      
      // 1. Clear background to black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const cols = Math.ceil(width / config.gridSize);
      const rows = Math.ceil(height / config.gridSize);

      // Mouse interaction
      const mx = Math.floor(mouseRef.current.x / config.gridSize);
      const my = Math.floor(mouseRef.current.y / config.gridSize);
      
      if (mx >= 0 && mx < cols && my >= 0 && my < rows) {
        const index = my * cols + mx;
        prevGridRef.current[index] = config.sensitivity * 255;
      }

      // Update physics/simulation
      if (config.mode === 'ripple') {
        for (let y = 1; y < rows - 1; y++) {
          for (let x = 1; x < cols - 1; x++) {
            const i = y * cols + x;
            const val = (
              prevGridRef.current[i - 1] +
              prevGridRef.current[i + 1] +
              prevGridRef.current[i - cols] +
              prevGridRef.current[i + cols]
            ) / 2 - gridRef.current[i];
            
            gridRef.current[i] = val * config.decay;
          }
        }
        const temp = prevGridRef.current;
        prevGridRef.current = gridRef.current;
        gridRef.current = temp;
      }

      // Prepare shape context if in silhouette mode
      if (config.mode === 'silhouette' && shapeCtx) {
          shapeCtx.clearRect(0, 0, width, height);
          shapeCtx.fillStyle = '#FFFFFF';
          shapeCtx.save();
          shapeCtx.translate(width / 2, height / 2);
          const baseScale = Math.min(width, height) / 800;
          const scale = baseScale * config.silhouetteSize;
          shapeCtx.scale(scale, scale);
          shapeCtx.translate(-450, -300);
          const path = new Path2D(config.activeShape === 'africa' ? AFRICA_PATH : SHAPES.world);
          shapeCtx.fill(path);
          shapeCtx.restore();
      }

      // 2. Render Video Background (if active)
      if (config.useVideoBackground && video && video.readyState >= 2) {
          // Draw video full screen
          ctx.drawImage(video, 0, 0, width, height);
          
          // Use destination-in to keep video ONLY where we draw the LEDs
          ctx.globalCompositeOperation = 'destination-in';
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cx = x * config.gridSize;
                const cy = y * config.gridSize;
                const pad = 1;
                ctx.rect(cx + pad, cy + pad, config.gridSize - pad*2, config.gridSize - pad*2);
            }
          }
          ctx.fill();
          
          // Fill the rest with black (where video was removed)
          ctx.globalCompositeOperation = 'destination-over';
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, width, height);
          
          // Reset for subsequent drawing
          ctx.globalCompositeOperation = 'source-over';
      }

      // 3. Draw Interactive Effects (Light up LEDs on top)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const cx = x * config.gridSize;
          const cy = y * config.gridSize;
          const pad = 1;

          let intensity = 0;

          if (config.mode === 'ripple') {
             intensity = Math.abs(gridRef.current[i]);
          } else if (config.mode === 'plasma') {
             const v = Math.sin(x * 0.1 + timeRef.current) + Math.sin(y * 0.1 + timeRef.current) + Math.sin((x + y) * 0.1 + timeRef.current);
             const dx = cx - mouseRef.current.x;
             const dy = cy - mouseRef.current.y;
             const dist = Math.sqrt(dx*dx + dy*dy);
             const mouseFactor = Math.max(0, 1 - dist / 300);
             intensity = (v + 3) * 20 + (mouseFactor * config.sensitivity * 100);
          } else if (config.mode === 'matrix') {
             if (Math.random() > 0.99) gridRef.current[i] = 255;
             gridRef.current[i] *= 0.95;
             const dx = cx - mouseRef.current.x;
             const dy = cy - mouseRef.current.y;
             if (Math.sqrt(dx*dx + dy*dy) < 100) gridRef.current[i] = 255;
             intensity = gridRef.current[i];
          } else if (config.mode === 'wave') {
             const dist = Math.sqrt(Math.pow(cx - mouseRef.current.x, 2) + Math.pow(cy - mouseRef.current.y, 2));
             intensity = Math.sin(dist * 0.05 - timeRef.current * 5) * 100 + 100;
             intensity *= Math.max(0, 1 - dist / 800);
          } else if (config.mode === 'silhouette' && shapeCtx) {
             const path = new Path2D(config.activeShape === 'africa' ? AFRICA_PATH : SHAPES.world);
             
             shapeCtx.save();
             shapeCtx.translate(width / 2, height / 2);
             const baseScale = Math.min(width, height) / 800;
             const scale = baseScale * config.silhouetteSize;
             shapeCtx.scale(scale, scale);
             shapeCtx.translate(-450, -300);
             const isInside = shapeCtx.isPointInPath(path, cx + config.gridSize/2, cy + config.gridSize/2);
             shapeCtx.restore();

             if (isInside) {
                 const noise = Math.random() * 50;
                 const pulse = Math.sin(timeRef.current * 2 + x * 0.1) * 50 + 50;
                 intensity = 100 + pulse + noise;
                 
                 const dx = cx - mouseRef.current.x;
                 const dy = cy - mouseRef.current.y;
                 const dist = Math.sqrt(dx*dx + dy*dy);
                 if (dist < 200) {
                     intensity += (1 - dist/200) * 155;
                 }
             }
          }

          if (intensity > 5) {
            const r = parseInt(config.colorPrimary.slice(1, 3), 16);
            const g = parseInt(config.colorPrimary.slice(3, 5), 16);
            const b = parseInt(config.colorPrimary.slice(5, 7), 16);
            
            const r2 = parseInt(config.colorSecondary.slice(1, 3), 16);
            const g2 = parseInt(config.colorSecondary.slice(3, 5), 16);
            const b2 = parseInt(config.colorSecondary.slice(5, 7), 16);

            const ratio = Math.min(1, intensity / 255);
            const finalR = Math.floor(r * ratio + r2 * (1 - ratio));
            const finalG = Math.floor(g * ratio + g2 * (1 - ratio));
            const finalB = Math.floor(b * ratio + b2 * (1 - ratio));

            // Additive blending for light effects
            ctx.fillStyle = `rgba(${finalR}, ${finalG}, ${finalB}, ${Math.min(1, intensity/255)})`;
            ctx.fillRect(cx + pad, cy + pad, config.gridSize - pad*2, config.gridSize - pad*2);
          }
        }
      }
      
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [config]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      {/* Video element is hidden but used as source */}
      <video 
        ref={videoRef}
        className="hidden"
        loop
        muted
        autoPlay
        playsInline
      />
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block" 
      />
    </div>
  );
};

export default VideoWall;

```

### FILE: src/contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface User { id: string; username: string; role: string }
interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = [REDACTED_CREDENTIAL]
    if (!token) { setIsLoading(false); return; }
    AuthService.validateToken(token)
      .then((res: any) => {
        if (res.valid && res.user) { setIsAuthenticated(true); setUser(res.user); }
        else { AuthService.logout(); setIsAuthenticated(false); }
      })
      .catch(() => { /* backend unreachable — keep state */ })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await AuthService.login(username, password);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const logout = () => { AuthService.logout(); setIsAuthenticated(false); setUser(null); };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

```

### FILE: src/index.css
```css
@import "tailwindcss";

@theme {
  --color-tuc-maroon: #630f12;
  --color-tuc-gold: #ffcb05;
  --color-tuc-beige: #f5f5dc;
  --color-tuc-green: #3db54a;
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  background-color: #ffffff;
  color: #1a1a1a;
  -webkit-font-smoothing: antialiased;
}

/* TUC utility classes */
.tuc-header { background-color: #630f12; color: #ffffff; }
.tuc-accent { color: #630f12; }
.tuc-btn {
  background-color: #630f12;
  color: #ffffff;
  border-radius: 6px;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
}
.tuc-btn:hover { background-color: #7a1318; }
.tuc-gold { color: #ffcb05; }
.tuc-bg { background-color: #630f12; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #630f12; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #7a1318; }

```

### FILE: src/main.tsx
```typescript
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import AppWithAuth from './AppWithAuth';
import './index.css';
import { AuthGate } from './AuthGate';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithAuth />
  </StrictMode>,
);

document.getElementById('tuc-splash-styles')?.remove();

```

### FILE: src/pages/AdminPage.tsx
```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

type Tab = 'overview' | 'logs';

interface LogEntry { id: string; time: string; action: string; detail: string }

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [logs] = useState<LogEntry[]>([
    { id: '1', time: new Date().toLocaleTimeString(), action: 'SESSION_START', detail: 'Admin session initiated' },
  ]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0f172a] text-white flex flex-col p-6 shrink-0" aria-label="Admin navigation">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-[#ffcb05] rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-sm">Lumina Concert Video Wall</span>
        </div>
        <nav className="flex-1 space-y-1" role="navigation">
          {(['overview', 'logs'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t ? 'true' : 'false'}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${tab === t ? 'bg-[#ffcb05] text-[#0f172a] font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {t === 'overview' ? 'Overview' : 'Activity Log'}
            </button>
          ))}
        </nav>
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-1 px-2">Signed in as</p>
          <p className="text-sm text-slate-300 font-medium px-2 mb-3 truncate">{user?.username || 'Admin'}</p>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 max-w-4xl" role="main">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Lumina Concert Video Wall — Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Techbridge University College · Staff Portal</p>
        </header>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'React Version', value: '19.2.4', ok: true },
              { label: 'Docker', value: 'Configured', ok: true },
              { label: 'SRS', value: 'docs/SRS.md', ok: true },
              { label: 'Tests', value: 'vitest.config.ts', ok: true },
              { label: 'Auth', value: 'Active', ok: true },
              { label: 'Phase', value: 'Phase 2 Complete', ok: true },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
                <span className={`text-xs ${item.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.ok ? '✓ compliant' : '✗ gap'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Activity Log</h2>
            </div>
            <table className="w-full text-sm" aria-label="Activity log">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Action</th>
                  <th className="px-6 py-3 text-left">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-400">{log.time}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 text-gray-500">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

```

### FILE: src/pages/LoginPage.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-[#630f12] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#ffcb05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in with your TUC credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username" type="text" value={username} required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your username"
              aria-label="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password" type="password" value={password} required
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-2 px-4 bg-[#630f12] text-white font-semibold rounded-lg hover:bg-[#7a1317] focus:outline-none focus:ring-2 focus:ring-[#630f12] focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label={loading ? 'Signing in' : 'Sign in'}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

```

### FILE: src/services/AuthService.ts
```typescript
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = [REDACTED_CREDENTIAL]

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: { id: string; username: string; role: string };
}

export const AuthService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data: AuthResponse = await res.json();
      if (data.success && data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    } catch {
      return { success: false, message: 'Could not connect to TUC Auth API' };
    }
  },

  async validateToken(token: string) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch {
      return { success: false, valid: false };
    }
  },

  logout:          () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getToken:        () => localStorage.getItem(TOKEN_KEY),
};

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — react-example
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('react-example E2E', () => {
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

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}

```

### FILE: vite.config.ts
```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
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
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — react-example
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

// Vitest E2E configuration — react-example
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

