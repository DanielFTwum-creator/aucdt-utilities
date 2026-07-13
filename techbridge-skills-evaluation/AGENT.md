# techbridge-skills-evaluation - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for techbridge-skills-evaluation.

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
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

```

### FILE: .npmrc
```text
# Use pnpm as package manager
package-manager=pnpm

```

### FILE: CREATION.md
```md
# techbridge-skills-evaluation

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

This application is deployed behind an Nginx reverse proxy at the path `/tuc-skills-evaluation/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/tuc-skills-evaluation/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/tuc-skills-evaluation/',  // REQUIRED: Assets must load from /tuc-skills-evaluation/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/tuc-skills-evaluation"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/tuc-skills-evaluation">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/tuc-skills-evaluation/`, not at the root
- **Asset Loading**: Without `base: '/tuc-skills-evaluation/'`, assets try to load from `/assets/` instead of `/tuc-skills-evaluation/assets/`
- **Routing**: Without `basename="/tuc-skills-evaluation"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/tuc-skills-evaluation/assets/index-*.js`
- Link tags should reference: `/tuc-skills-evaluation/assets/index-*.css`

If they reference `/assets/` instead of `/tuc-skills-evaluation/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/tuc-skills-evaluation/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/tuc-skills-evaluation/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: tuc-skills-evaluation

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
# Admin Guide — tuc-skills-evaluation

**Application:** tuc-skills-evaluation
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

Audit log data is stored in `localStorage` under the key `tuc_tuc-skills-evaluation_audit`.

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
# Deployment Guide — tuc-skills-evaluation

**Application:** tuc-skills-evaluation
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd tuc-skills-evaluation
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
docker-compose -f docker-compose-all-apps.yml build tuc-skills-evaluation
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up tuc-skills-evaluation
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

**Project:** Tuc Skills Evaluation
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Tuc Skills Evaluation**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Tuc Skills Evaluation** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Tuc Skills Evaluation** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

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
Stack: React 19.2.5 + TypeScript, Vite 7.3.1, React Router DOM
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
# Testing Guide — tuc-skills-evaluation

**Application:** tuc-skills-evaluation
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd tuc-skills-evaluation
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
    <meta property="og:title" content="Tuc Skills Evaluation | Techbridge University College" />
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
    <meta name="twitter:title" content="Tuc Skills Evaluation | Techbridge University College" />
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
    <title>Tuc Skills Evaluation | Techbridge University College</title>

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

    <script type="module" src="./src/index.tsx"></script>
  
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

    
    <div id="root" role="main" aria-label="Tuc Skills Evaluation">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">tuc skills evaluation</div>
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
  "packageManager": "pnpm@10.30.1",
  "name": "techbridge-skills-evaluation",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.7.0",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^13.5.0",
    "lucide-react": "^0.577.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.8.1",
    "recharts": "^3.8.0",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "dev": "vite",
    "preview": "vite preview",
    "serve": "serve -s dist -l 3000",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.2.1",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.5",
    "@vitejs/plugin-react": "^5.1.4",
    "@vitest/coverage-v8": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "jsdom": "^26.1.0",
    "serve": "14.2.5",
    "tailwindcss": "^4.2.1",
    "typescript": "^5.7.2",
    "vite": "7.3.1",
    "vitest": "^3.0.0"
  }
}
```

### FILE: README.md
```md
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `pnpm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `pnpm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `pnpm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `pnpm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

```

### FILE: src/a11y/aria-checklist.md
```md
# ARIA Accessibility Checklist — Tuc Skills Evaluation

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
- [ ] Wrap app content in `<AccessibleLayout label="Tuc Skills Evaluation">`
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

### FILE: src/App.css
```css
.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

```

### FILE: src/App.test.tsx
```typescript
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

```

### FILE: src/App.tsx
```typescript
import { ArrowLeft, ArrowRight, Award, BarChart2, BookOpen, CheckCircle, Clock, Download, FileText, Home, RefreshCw, Settings, ShieldCheck, Target, Trash2, TrendingDown, TrendingUp, Upload, Users, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// --- INITIAL DATA & CONFIGURATION ---
const initialProgrammeData = {
  "programmes": [
    {
      "id": "jd",
      "name": "Jewellery Design",
      "assessments": {
        "year1": [
          { "id": "BJDT111", "title": "Introduction to Jewellery Design", "duration": 15, "questions": 0 },
          { "id": "ACDT112", "title": "Workshop Safety Practices", "duration": 10, "questions": 0 },
          { "id": "ACDT113", "title": "Foundations in Technical Drawing", "duration": 10, "questions": 0 },
          { "id": "ACDT114", "title": "Basic Drawing", "duration": 10, "questions": 0 },
          { "id": "ACDT115", "title": "Introduction to African Art & Culture", "duration": 15, "questions": 0 },
          { "id": "ACDT116", "title": "Communication and Study Skills I", "duration": 10, "questions": 0 },
          { "id": "BJDT121", "title": "Experimental Jewellery Practices", "duration": 15, "questions": 0 },
          { "id": "BJDT122", "title": "Workshop Practice Basics", "duration": 10, "questions": 0 },
          { "id": "BJDT123", "title": "Orthographic and Isometric Projections", "duration": 15, "questions": 0 },
          { "id": "BJDT125", "title": "Introduction to Design and Modelling", "duration": 15, "questions": 0 },
          { "id": "ACDT125", "title": "Introduction to Computer Aided Design", "duration": 15, "questions": 0 },
          { "id": "ACDT126", "title": "Communication and Study Skills II", "duration": 10, "questions": 0 }
        ],
        "year2": [
          { "id": "BJDT231", "title": "Concept Design and Modelling", "duration": 15, "questions": 0 },
          { "id": "BJDT232", "title": "Fabrication and Finishing Basics", "duration": 15, "questions": 0 },
          { "id": "BJDT233", "title": "Alloy Calculation, Measuring and Marking", "duration": 15, "questions": 0 },
          { "id": "BJDT234", "title": "Introduction to Metallurgy", "duration": 15, "questions": 0 },
          { "id": "BJDT235", "title": "Assaying. Refining and Hallmarking", "duration": 15, "questions": 0 },
          { "id": "BJDT236", "title": "3D Modelling in Computing", "duration": 15, "questions": 0 },
          { "id": "ACDT237", "title": "Introduction to Entrepreneurship", "duration": 10, "questions": 0 },
          { "id": "BJDT241", "title": "Concept Design and Modelling", "duration": 15, "questions": 0 },
          { "id": "BJDT242", "title": "Fabrication and Finishing Techniques", "duration": 15, "questions": 0 },
          { "id": "BJDT243", "title": "Jewellery Casting Methods", "duration": 15, "questions": 0 },
          { "id": "BJDT244", "title": "Jewellery Surface Coating Methods", "duration": 15, "questions": 0 },
          { "id": "BJDT245", "title": "Advanced Metallurgy", "duration": 15, "questions": 0 },
          { "id": "BJDT246", "title": "Advanced Computer Application", "duration": 15, "questions": 0 },
          { "id": "BJDT247", "title": "New Venture Creation", "duration": 10, "questions": 0 }
        ],
        "year3": [
            { "id": "BJDT351", "title": "Advanced Design & Modelling Techniques", "duration": 15, "questions": 0 },
            { "id": "BJDT352", "title": "Fabrication and Finishing techniques", "duration": 15, "questions": 0 },
            { "id": "BJDT353", "title": "Introduction to Gemmology", "duration": 15, "questions": 0 },
            { "id": "BJDT354", "title": "Introduction to Gem Setting", "duration": 15, "questions": 0 },
            { "id": "BJDT355", "title": "Seminar", "duration": 15, "questions": 0 },
            { "id": "ACDT356", "title": "Business Management and Sustenance", "duration": 10, "questions": 0 },
            { "id": "ACDT357", "title": "Operations Management", "duration": 10, "questions": 0 },
            { "id": "BJDT361", "title": "Model Making and Fabrication", "duration": 10, "questions": 0 },
            { "id": "BJDT362", "title": "Jewellery Production", "duration": 20, "questions": 0 },
            { "id": "BJDT363", "title": "Advanced Gemmology", "duration": 15, "questions": 0 },
            { "id": "BJDT364", "title": "General Gem Setting Techniques", "duration": 15, "questions": 0 },
            { "id": "BJDT365", "title": "Ethical and Legal Issues in Jewellery", "duration": 10, "questions": 0 },
            { "id": "ACDT367", "title": "Research Methods", "duration": 15, "questions": 0 }
        ],
        "year4": [
            { "id": "BJDT471", "title": "Host Entity Evaluation Report", "duration": 30, "questions": 0 },
            { "id": "BJDT472", "title": "Industrial Activity Report", "duration": 20, "questions": 0 },
            { "id": "BJDT481", "title": "Post Industrial Attachment Seminars", "duration": 15, "questions": 0 },
            { "id": "BJDT482", "title": "Studio Research in Jewellery Design", "duration": 20, "questions": 0 },
            { "id": "BJDT483", "title": "Jewellery Exhibition and Portfolio", "duration": 15, "questions": 0 },
            { "id": "BJDT484", "title": "Project Management in Jewellery Design", "duration": 15, "questions": 0 },
            { "id": "BJDT485", "title": "Project Work", "duration": 15, "questions": 0 },
            { "id": "ACDT486", "title": "Accounting & Finance for Entrepreneurs", "duration": 15, "questions": 0 }
        ]
      }
    },
    {
      "id": "dm",
      "name": "Digital Media",
      "assessments": {
        "year1": [
          { "id": "DMCD111", "title": "Introduction to Digital Media", "duration": 15, "questions": 1 },
          { "id": "DMCD112", "title": "Basic Design", "duration": 15, "questions": 0 },
          { "id": "DMCD113", "title": "Introduction to Communication Design", "duration": 15, "questions": 0 },
          { "id": "DMCD114", "title": "Introduction to Computer Applications", "duration": 15, "questions": 0 },
          { "id": "ACDT114-DM", "title": "Basic Drawing", "duration": 15, "questions": 0 },
          { "id": "ACDT115-DM", "title": "Introduction to African Art & Culture", "duration": 15, "questions": 0 },
          { "id": "ACDT116-DM", "title": "Communication and Study Skills I", "duration": 10, "questions": 0 },
          { "id": "DMCD121", "title": "Basic Programming", "duration": 15, "questions": 0 },
          { "id": "DMCD122", "title": "Idea Development Techniques", "duration": 15, "questions": 0 },
          { "id": "DMCD123", "title": "Basic Rendering Techniques", "duration": 15, "questions": 0 },
          { "id": "DMCD124", "title": "Design History", "duration": 15, "questions": 0 },
          { "id": "ACDT124", "title": "Typography", "duration": 15, "questions": 0 },
          { "id": "ACDT125-DM", "title": "Image Manipulation", "duration": 15, "questions": 0 },
          { "id": "ACDT126-DM", "title": "Communication and Study Skills II", "duration": 10, "questions": 0 }
        ],
        "year2": [
          { "id": "DMCD231", "title": "Logos, Symbols & Trademarks", "duration": 15, "questions": 0 },
          { "id": "DMCD232", "title": "Print Design", "duration": 15, "questions": 0 },
          { "id": "DMCD233", "title": "Advanced Typography", "duration": 15, "questions": 0 },
          { "id": "DMCD234", "title": "Photography", "duration": 15, "questions": 0 },
          { "id": "DMCD235", "title": "Print Production", "duration": 15, "questions": 0 },
          { "id": "DMCD236", "title": "Design Seminar", "duration": 15, "questions": 0 },
          { "id": "ACDT231", "title": "Introduction to Entrepreneurship", "duration": 10, "questions": 0 },
          { "id": "DMCD241", "title": "Brand & Identity Systems", "duration": 15, "questions": 0 },
          { "id": "DMCD242", "title": "Advanced Print Design", "duration": 15, "questions": 0 },
          { "id": "DMCD243", "title": "Web Design", "duration": 15, "questions": 0 },
          { "id": "DMCD244", "title": "Advanced Photography", "duration": 15, "questions": 0 },
          { "id": "DMCD245", "title": "Advanced Print Production", "duration": 15, "questions": 0 }
        ],
        "year3": [
          { "id": "DMCD351", "title": "First Practical Training & Internship", "duration": 20, "questions": 0 },
          { "id": "DMCD352", "title": "Book & Magazine Design", "duration": 15, "questions": 0 },
          { "id": "DMCD353", "title": "Advertising Design", "duration": 15, "questions": 0 },
          { "id": "DMCD354", "title": "Online Media Technology", "duration": 15, "questions": 0 },
          { "id": "DMCD355", "title": "Animation", "duration": 15, "questions": 0 },
          { "id": "ACDT351", "title": "Business Management and Sustenance", "duration": 10, "questions": 0 },
          { "id": "DMCD361", "title": "Copywriting", "duration": 15, "questions": 0 },
          { "id": "DMCD362", "title": "Advanced Advertising Design", "duration": 15, "questions": 0 },
          { "id": "DMCD363", "title": "Video Production", "duration": 15, "questions": 0 },
          { "id": "DMCD364", "title": "Advanced Animation", "duration": 15, "questions": 0 },
          { "id": "ACDT361", "title": "Research Methods", "duration": 15, "questions": 0 },
          { "id": "DMCD365", "title": "Sound Production (Elective)", "duration": 15, "questions": 0 },
          { "id": "DMCD366", "title": "Motion Graphics (Elective)", "duration": 15, "questions": 0 }
        ],
        "year4": [
          { "id": "DMCD471", "title": "Second Practical Training & Internship", "duration": 20, "questions": 0 },
          { "id": "DMCD472", "title": "Project & Report Writing I", "duration": 15, "questions": 0 },
          { "id": "DMCD473", "title": "Professional Portfolio Development I", "duration": 15, "questions": 0 },
          { "id": "DMCD474", "title": "Contracts & Copyright (Elective)", "duration": 15, "questions": 0 },
          { "id": "ACDT471", "title": "Accounting & Finance for Entrepreneurs (Elective)", "duration": 15, "questions": 0 },
          { "id": "DMCD481", "title": "Project & Report Writing II", "duration": 15, "questions": 0 },
          { "id": "DMCD482", "title": "Professional Portfolio Development II", "duration": 15, "questions": 0 },
          { "id": "DMCD483", "title": "Ethics and Career Planning (Elective)", "duration": 15, "questions": 0 },
          { "id": "DMCD484", "title": "Taxes and Regulations (Elective)", "duration": 15, "questions": 0 }
        ]
      }
    },
    {
      "id": "fd",
      "name": "Fashion Design",
      "assessments": {
        "year1": [
          { "id": "FDT151", "title": "Introduction to Fashion", "duration": 15, "questions": 1 },
          { "id": "FDT153", "title": "Introduction to Textile Design", "duration": 15, "questions": 0 },
          { "id": "FDT155", "title": "Pattern Making", "duration": 15, "questions": 0 },
          { "id": "FDT157", "title": "Sewing Techniques", "duration": 15, "questions": 0 },
          { "id": "FDT159", "title": "Introduction to Textiles", "duration": 15, "questions": 0 },
          { "id": "ACDT114", "title": "Basic Drawing", "duration": 15, "questions": 0 },
          { "id": "ACDT117", "title": "Information Communication Technology I", "duration": 15, "questions": 0 },
          { "id": "ACDT115", "title": "Introduction to African Art & Culture", "duration": 15, "questions": 0 },
          { "id": "ACDT116", "title": "Communication and Study Skills I", "duration": 15, "questions": 0 },
          { "id": "FDT150", "title": "Introduction to Creative Design in Fashion", "duration": 15, "questions": 0 },
          { "id": "FDT152", "title": "Textile Design", "duration": 15, "questions": 0 },
          { "id": "FDT154", "title": "Pattern Adaptation", "duration": 15, "questions": 0 },
          { "id": "FDT156", "title": "Garment Construction", "duration": 15, "questions": 0 },
          { "id": "FDT158", "title": "Freehand Cutting", "duration": 15, "questions": 0 },
          { "id": "FDT160", "title": "Basic Design", "duration": 15, "questions": 0 },
          { "id": "ACDT127", "title": "Information Communication Technology II", "duration": 15, "questions": 0 },
          { "id": "ACDT126", "title": "Communication and Study Skills II", "duration": 15, "questions": 0 },
          { "id": "WEL150", "title": "Industrial Attachment I", "duration": 15, "questions": 0 }
        ],
        "year2": [
          { "id": "FDT251", "title": "Creative Design in Fashion", "duration": 15, "questions": 0 },
          { "id": "FDT253", "title": "Printed Textile Design Application", "duration": 15, "questions": 0 },
          { "id": "FDT255", "title": "Pattern Technology I", "duration": 15, "questions": 0 },
          { "id": "FDT257", "title": "Garment Technology I", "duration": 15, "questions": 0 },
          { "id": "FDT259", "title": "Introduction to Fabric Studies", "duration": 15, "questions": 0 },
          { "id": "FDT261", "title": "Fashion Illustration", "duration": 15, "questions": 0 },
          { "id": "FDT263", "title": "Basic Computer Aided Design", "duration": 15, "questions": 0 },
          { "id": "FDT265", "title": "Introduction to Fashion Accessories", "duration": 15, "questions": 0 },
          { "id": "FTD267", "title": "Introduction to Production Management", "duration": 15, "questions": 0 },
          { "id": "FDT250", "title": "Basic Fashion Design and Illustration", "duration": 15, "questions": 0 },
          { "id": "FDT252", "title": "Pattern Technology II", "duration": 15, "questions": 0 },
          { "id": "FDT254", "title": "Garment Technology II", "duration": 15, "questions": 0 },
          { "id": "FDT256", "title": "Fabric Studies", "duration": 15, "questions": 0 },
          { "id": "FDT258", "title": "Millinery Design and Production", "duration": 15, "questions": 0 },
          { "id": "FDT260", "title": "Computer Aided Design", "duration": 15, "questions": 0 },
          { "id": "FDT262", "title": "Fashion Marketing", "duration": 15, "questions": 0 },
          { "id": "FDT264", "title": "Production Management", "duration": 15, "questions": 0 },
          { "id": "WEL250", "title": "Industrial Attachment", "duration": 15, "questions": 0 }
        ],
        "year3": [
          { "id": "FDT351", "title": "Design and Illustration", "duration": 15, "questions": 0 },
          { "id": "FDT353", "title": "Garment Decoration Techniques", "duration": 15, "questions": 0 },
          { "id": "FDT355", "title": "Pattern Alteration", "duration": 15, "questions": 0 },
          { "id": "FDT357", "title": "Fashion Draping", "duration": 15, "questions": 0 },
          { "id": "FDT359", "title": "Design and Production of Bags and Slippers", "duration": 15, "questions": 0 },
          { "id": "FDT361", "title": "Entrepreneurship I", "duration": 15, "questions": 0 },
          { "id": "FDT363", "title": "Seminar in Fashion", "duration": 15, "questions": 0 },
          { "id": "ACDT367", "title": "Research Methods", "duration": 15, "questions": 0 },
          { "id": "WEL350", "title": "Industrial Attachment III", "duration": 15, "questions": 0 },
          { "id": "FDT352", "title": "Research Methods/Seminar", "duration": 15, "questions": 0 }
        ],
        "year4": [
          { "id": "FDT451", "title": "Collection Development", "duration": 15, "questions": 0 },
          { "id": "FDT453", "title": "Quality Control in Garment Production", "duration": 15, "questions": 0 },
          { "id": "FDT455", "title": "Beauty Culture", "duration": 15, "questions": 0 },
          { "id": "FDT457", "title": "Entrepreneurship II", "duration": 15, "questions": 0 },
          { "id": "FDT459", "title": "Thesis/ Project I", "duration": 15, "questions": 0 },
          { "id": "FDT450", "title": "Final Collection Development", "duration": 15, "questions": 0 },
          { "id": "FDT452", "title": "Portfolio Development and Exhibition", "duration": 15, "questions": 0 },
          { "id": "FDT454", "title": "Salesmanship and Sales Management", "duration": 15, "questions": 0 },
          { "id": "FDT460", "title": "Fashion Merchandising", "duration": 15, "questions": 0 },
          { "id": "FDT464", "title": "Thesis/ Project II", "duration": 15, "questions": 0 }
        ]
      }
    },
    {
      "id": "pd",
      "name": "Product Design",
      "assessments": {
        "year1": [
          { "id": "BPDE111", "title": "Introduction to Industrial/Product Design", "duration": 15, "questions": 1 },
          { "id": "ACDT112", "title": "Safety In Workshop Practices", "duration": 10, "questions": 0 },
          { "id": "ACDT113", "title": "Technical Drawing", "duration": 10, "questions": 0 },
          { "id": "ACDT114", "title": "Basic Drawing", "duration": 10, "questions": 0 },
          { "id": "ACDT115", "title": "Introduction to African Art & Culture", "duration": 15, "questions": 0 },
          { "id": "ACDT116", "title": "Communication Skills I", "duration": 10, "questions": 0 },
          { "id": "ACDT117", "title": "Information Communication Technology I", "duration": 10, "questions": 0 },
          { "id": "BPDE121", "title": "Idea Development and Design Processes", "duration": 15, "questions": 0 },
          { "id": "BPDE122", "title": "Workshop Practices", "duration": 15, "questions": 0 },
          { "id": "BPDE123", "title": "Orthographic and Isometric Projections", "duration": 15, "questions": 0 },
          { "id": "BPDE125", "title": "Freehand Drawing Techniques", "duration": 15, "questions": 0 },
          { "id": "ACDT125", "title": "Introduction to Computer Aided Design", "duration": 15, "questions": 0 },
          { "id": "ACDT126", "title": "Communication Skills II", "duration": 10, "questions": 0 },
          { "id": "ACDT127", "title": "Information Communication Technology II", "duration": 10, "questions": 0 }
        ],
        "year2": [
          { "id": "BPDE231", "title": "Introduction to Modelling", "duration": 15, "questions": 0 },
          { "id": "BPDE232", "title": "Product Design Methods", "duration": 15, "questions": 0 },
          { "id": "BPDE233", "title": "Perspective Drawing", "duration": 15, "questions": 0 },
          { "id": "BPDE234", "title": "Nature of Materials and Processes", "duration": 15, "questions": 0 },
          { "id": "BPDE235", "title": "Manufacturing Processes I", "duration": 15, "questions": 0 },
          { "id": "BPDE236", "title": "Three-Dimensional Design in Computing", "duration": 15, "questions": 0 },
          { "id": "BPDE237", "title": "Introduction to Entrepreneurship", "duration": 10, "questions": 0 },
          { "id": "BPDE241", "title": "Design for Use", "duration": 15, "questions": 0 },
          { "id": "BPDE242", "title": "Visual Communication and Package Design", "duration": 15, "questions": 0 },
          { "id": "BPDE243", "title": "Ergonomics and Human Factors Applications", "duration": 15, "questions": 0 },
          { "id": "BPDE244", "title": "Contextual Nature of Products", "duration": 15, "questions": 0 },
          { "id": "BPDE245", "title": "Objects and Impacts", "duration": 15, "questions": 0 },
          { "id": "BPDE246", "title": "Advanced Computer Application", "duration": 15, "questions": 0 },
          { "id": "ACDT247", "title": "New Venture Creation", "duration": 10, "questions": 0 }
        ],
        "year3": [
          { "id": "BPDE351", "title": "Practical Model Making Techniques", "duration": 15, "questions": 0 },
          { "id": "BPDE352", "title": "Product Interface Design", "duration": 15, "questions": 0 },
          { "id": "BPDE353", "title": "Workshop Practice I", "duration": 15, "questions": 0 },
          { "id": "BPDE354", "title": "Design and Development", "duration": 15, "questions": 0 },
          { "id": "BPDE355", "title": "Seminar", "duration": 15, "questions": 0 },
          { "id": "ACDT356", "title": "Business Management and Sustainability", "duration": 10, "questions": 0 },
          { "id": "BPDE361", "title": "Mass Production Technology", "duration": 15, "questions": 0 },
          { "id": "BPDE362", "title": "Rendering for Presentation", "duration": 15, "questions": 0 },
          { "id": "BPDE363", "title": "Workshop Practice II", "duration": 15, "questions": 0 },
          { "id": "BPDE364", "title": "Design and Sustainability", "duration": 15, "questions": 0 },
          { "id": "BPDE365", "title": "Ethical and Legal Issues", "duration": 10, "questions": 0 },
          { "id": "ACDT367", "title": "Research Methods", "duration": 15, "questions": 0 }
        ],
        "year4": [
          { "id": "BPDE471", "title": "Industrial Attachment", "duration": 20, "questions": 0 },
          { "id": "BPDE472", "title": "Project Report I", "duration": 20, "questions": 0 },
          { "id": "BPDE481", "title": "Industrial Attachment Seminars", "duration": 15, "questions": 0 },
          { "id": "BPDE482", "title": "Studio Research in Product Design", "duration": 15, "questions": 0 },
          { "id": "BPDE483", "title": "Exhibition Design", "duration": 15, "questions": 0 },
          { "id": "BPDE484", "title": "Project Report II", "duration": 15, "questions": 0 },
          { "id": "ACDT485", "title": "Accounting and Finance for Entrepreneurs", "duration": 15, "questions": 0 }
        ]
      }
    }
  ],
  "questions": {
    "DMCD111": [
        { "question": "What does RGB stand for in digital colour models?", "options": ["Red, Green, Blue", "Red, Grey, Black", "Royal Gold Banner", "Raster Graphics Buffer"], "answer": "Red, Green, Blue" }
    ],
    "FDT151": [
        { "question": "Which of these is a natural fibre?", "options": ["Cotton", "Polyester", "Nylon", "Rayon"], "answer": "Cotton" }
    ],
    "BPDE111": [
        { "question": "What is the primary focus of ergonomics?", "options": ["User comfort and efficiency", "Aesthetics", "Material cost", "Manufacturing speed"], "answer": "User comfort and efficiency" }
    ]
  }
};

const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]

// --- HELPER FUNCTIONS & HOOKS ---

// Custom hook for using Local Storage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
};

// Audit Logger
const useAuditLog = () => {
  const [log, setLog] = useLocalStorage('tuc-audit-log', []);

  const addLogEntry = (eventType, eventData) => {
    const newEntry = {
      timestamp: new Date().toISOString(),
      eventType,
      ...eventData
    };
    setLog(prevLog => [...prevLog, newEntry]);
  };

  return { log, addLogEntry, setLog };
};


// --- BRANDED UI COMPONENTS (from Analytics Dashboard) ---

const StatCard = ({ title, value, change, icon, subtitle }) => (
  <div className="bg-white rounded-xl border-l-4 border-[#D4AF37] p-6 shadow-[0_4px_12px_rgba(139,21,56,0.15)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-lg bg-[#F4E4BC]">{icon}</div>
      <div className={`flex items-center text-sm font-medium ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
        {change > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : change < 0 ? <TrendingDown className="w-4 h-4 mr-1" /> : null}
        {change !== 0 && `${change > 0 ? '+' : ''}${change}%`}
      </div>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-[#2C1810] mb-1">{value.toLocaleString()}</h3>
      <p className="text-[#2C1810] text-sm font-medium">{title}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  </div>
);

const SkillProgressBar = ({ skill, value, change }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-[#2C1810]">{skill}</span>
      <div className="flex items-center">
        <span className="text-sm text-[#2C1810] font-semibold mr-2">{value}%</span>
        <span className={`text-xs font-medium ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
          {change > 0 ? '+' : ''}{change}
        </span>
      </div>
    </div>
    <div className="w-full bg-[#E6D5C7] rounded-full h-2">
      <div className="bg-gradient-to-r from-[#8B1538] to-[#6B1028] h-2 rounded-full transition-all duration-500" style={{ width: `${value}%` }} />
    </div>
  </div>
);

// --- MODAL COMPONENT ---
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};


// --- CORE APPLICATION COMPONENTS ---

// 1. Programme Dashboard (FR-001)
const ProgrammeDashboard = ({ setView, setProgramme, programmes }) => (
    <div>
        <h2 className="text-2xl font-semibold text-[#2C1810] mb-6">Academic Programmes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programmes.map(prog => (
                <div key={prog.id} onClick={() => { setProgramme(prog); setView('programmeDetail'); }}
                     className="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(139,21,56,0.15)] cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-[#D4AF37]">
                    <h3 className="text-lg font-bold text-[#8B1538]">{prog.name}</h3>
                    <p className="text-gray-600 text-sm mt-2">View available assessments for this programme.</p>
                </div>
            ))}
        </div>
    </div>
);

// 2. Programme Detail (FR-002, FR-003)
const ProgrammeDetail = ({ programme, setView, setAssessment }) => (
    <div>
        <button onClick={() => setView('dashboard')} className="flex items-center text-sm font-medium text-[#8B1538] mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programmes
        </button>
        <h2 className="text-2xl font-semibold text-[#2C1810] mb-2">{programme.name}</h2>
        <p className="text-gray-500 mb-6">Select an assessment to begin.</p>
        
        {Object.entries(programme.assessments).map(([year, assessments]) => (
            <div key={year} className="mb-6">
                <h3 className="text-lg font-semibold text-[#6B1028] capitalize mb-3 border-b-2 border-[#E6D5C7] pb-2">
                    {year.replace('year', 'Year ')}
                </h3>
                <div className="space-y-3">
                    {assessments.map(asm => (
                        <div key={asm.id} onClick={() => { setAssessment(asm); setView('assessment'); }}
                             className="bg-white p-4 rounded-lg shadow-sm cursor-pointer flex justify-between items-center hover:bg-[#F8F6F0]">
                            <div className="flex items-center">
                                <span className="text-xs font-mono bg-[#E6D5C7] text-[#6B1028] px-2 py-1 rounded-md mr-4">{asm.id}</span>
                                <div>
                                    <h4 className="font-semibold text-[#2C1810]">{asm.title}</h4>
                                    <p className="text-xs text-gray-500">{asm.questions} Questions | {asm.duration} Minutes</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

// 3. Assessment Player (FR-004 to FR-008, FR-019, FR-020)
const AssessmentPlayer = ({ assessment, questions, setView, setResults, addLogEntry }) => {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useLocalStorage(`assessment-session-${assessment.id}`, {});
    const [timeLeft, setTimeLeft] = useLocalStorage(`assessment-time-${assessment.id}`, assessment.duration * 60);
    const [confirmSubmit, setConfirmSubmit] = useState(false);

    const timerRef = useRef();

    useEffect(() => {
        addLogEntry('ASSESSMENT_START', { assessmentId: assessment.id, title: assessment.title });
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);
    
    useEffect(() => {
        if (timeLeft === 0) {
            handleSubmit();
        }
    }, [timeLeft]);

    const handleAnswer = (questionIndex, answer) => {
        const newAnswers = { ...answers, [questionIndex]: answer };
        setAnswers(newAnswers);
        addLogEntry('QUESTION_ANSWER', { assessmentId: assessment.id, questionIndex, answer });
    };

    const handleSubmit = () => {
        clearInterval(timerRef.current);
        let score = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.answer) {
                score++;
            }
        });
        const finalResults = {
            score,
            total: questions.length,
            answers,
            questions,
            assessmentId: assessment.id,
            assessmentTitle: assessment.title
        };
        setResults(finalResults);
        addLogEntry('ASSESSMENT_SUBMIT', { assessmentId: assessment.id, score, total: questions.length });
        
        // Clear session from local storage
        localStorage.removeItem(`assessment-session-${assessment.id}`);
        localStorage.removeItem(`assessment-time-${assessment.id}`);

        setView('results');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!questions || questions.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-[#8B1538] mb-4">No Questions Available</h2>
                <p className="text-gray-600 mb-6">This assessment has not been configured with questions yet. Please check back later or contact an administrator.</p>
                <button onClick={() => setView('dashboard')} className="flex items-center mx-auto px-6 py-2 bg-gradient-to-r from-[#8B1538] to-[#6B1028] text-white rounded-full font-semibold text-sm">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(139,21,56,0.15)]">
                <div className="flex justify-between items-center border-b border-[#E6D5C7] pb-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-[#8B1538]">{assessment.id} - {assessment.title}</h2>
                        <p className="text-sm text-gray-500">Question {currentQ + 1} of {questions.length}</p>
                    </div>
                    <div className="flex items-center font-semibold text-lg text-[#6B1028] bg-[#F4E4BC] px-4 py-2 rounded-full">
                        <Clock className="w-5 h-5 mr-2" />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-[#2C1810] mb-6">{questions[currentQ].question}</h3>
                    <div className="space-y-4">
                        {questions[currentQ].options.map(option => (
                            <div key={option} onClick={() => handleAnswer(currentQ, option)}
                                 className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${answers[currentQ] === option ? 'bg-[#F4E4BC] border-[#D4AF37]' : 'border-[#E6D5C7] hover:border-[#D4AF37]'}`}>
                                {option}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#E6D5C7]">
                    <button onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}
                            className="flex items-center px-6 py-2 bg-white border border-[#E6D5C7] text-[#2C1810] rounded-full font-semibold text-sm disabled:opacity-50">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                    </button>
                    {currentQ < questions.length - 1 ? (
                        <button onClick={() => setCurrentQ(q => Math.min(questions.length - 1, q + 1))}
                                className="flex items-center px-6 py-2 bg-gradient-to-r from-[#8B1538] to-[#6B1028] text-white rounded-full font-semibold text-sm">
                            Next <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    ) : (
                        <button onClick={() => setConfirmSubmit(true)}
                                className="flex items-center px-6 py-2 bg-gradient-to-r from-[#8B1538] to-[#6B1028] text-white rounded-full font-semibold text-sm">
                            Submit Assessment
                        </button>
                    )}
                </div>
            </div>
            <Modal isOpen={confirmSubmit} onClose={() => setConfirmSubmit(false)}>
                <h3 className="text-lg font-bold text-[#2C1810] mb-4">Confirm Submission</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to submit your answers? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={() => setConfirmSubmit(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-[#8B1538] text-white rounded-lg">Submit</button>
                </div>
            </Modal>
        </div>
    );
};

// 4. Results Page (FR-009 to FR-012)
const ResultsPage = ({ results, setView }) => {
    const [feedback, setFeedback] = useState('');
    const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);
    const [reviewMode, setReviewMode] = useState(false);

    useEffect(() => {
        const fetchFeedback = async () => {
            setIsLoadingFeedback(true);
            const incorrectAnswers = results.questions
                .map((q, i) => ({ ...q, userAnswer: results.answers[i] }))
                .filter(q => q.userAnswer !== q.answer);

            const prompt = `A student took an assessment titled "${results.assessmentId} - ${results.assessmentTitle}". They scored ${results.score} out of ${results.total}. 
            Here are the questions they got wrong and the answers they chose:
            ${incorrectAnswers.map(q => `- Question: "${q.question}", Their Answer: "${q.userAnswer}", Correct Answer: "${q.answer}"`).join('\n')}
            
            Provide encouraging, personalised feedback in British English. Explain why some of their incorrect answers might have been wrong and offer brief, constructive advice for improvement. Keep it concise and supportive. Start with "Well done on completing the assessment!".`;
            
            try {
                // This is a mock API call. Replace with your actual Gemini API call.
                // In a real app, the API key should be handled securely.
                const apiKey = ""; // IMPORTANT: Add your Gemini API key here for feedback to work.
                if (!apiKey) {
                    setFeedback("AI feedback is not configured. Please add an API key. \n\nBased on your results, focus on reviewing the topics where you made mistakes. Great effort!");
                    setIsLoadingFeedback(false);
                    return;
                }
                
                let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
                const payload = { contents: chatHistory };
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();
                const text = result.candidates[0].content.parts[0].text;
                setFeedback(text);

            } catch (error) {
                console.error("Error fetching AI feedback:", error);
                setFeedback("There was an issue generating your feedback. Please try again later. Well done on completing the assessment!");
            } finally {
                setIsLoadingFeedback(false);
            }
        };

        fetchFeedback();
    }, [results]);

    if (reviewMode) {
        return <ReviewAnswers results={results} setReviewMode={setReviewMode} />;
    }

    const percentage = results.total > 0 ? Math.round((results.score / results.total) * 100) : 0;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(139,21,56,0.15)] text-center">
                <h2 className="text-2xl font-bold text-[#8B1538] mb-2">Assessment Complete!</h2>
                <p className="text-gray-600 mb-6">Here is a summary of your performance for {results.assessmentId}.</p>
                <div className="flex justify-center items-center my-8">
                    <div className="relative w-48 h-48">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path className="text-[#E6D5C7]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                            <path className="text-[#8B1538]" strokeDasharray={`${percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"></path>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-[#2C1810]">{percentage}%</span>
                            <span className="text-gray-500">{results.score}/{results.total} Correct</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-[#F8F6F0] p-6 rounded-lg text-left my-6">
                    <h3 className="font-semibold text-[#2C1810] mb-3">Personalised Feedback</h3>
                    {isLoadingFeedback ? (
                        <p className="text-gray-600 animate-pulse">Generating your feedback...</p>
                    ) : (
                        <p className="text-gray-700 whitespace-pre-wrap">{feedback}</p>
                    )}
                </div>

                <div className="flex justify-center space-x-4 mt-8">
                    <button onClick={() => setView('dashboard')} className="flex items-center px-6 py-2 bg-white border border-[#E6D5C7] text-[#2C1810] rounded-full font-semibold text-sm">
                        <Home className="w-4 h-4 mr-2" /> Back to Dashboard
                    </button>
                    <button onClick={() => setReviewMode(true)} className="flex items-center px-6 py-2 bg-gradient-to-r from-[#8B1538] to-[#6B1028] text-white rounded-full font-semibold text-sm">
                        Review Answers <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReviewAnswers = ({ results, setReviewMode }) => (
    <div className="max-w-4xl mx-auto">
        <button onClick={() => setReviewMode(false)} className="flex items-center text-sm font-medium text-[#8B1538] mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Results
        </button>
        <h2 className="text-2xl font-semibold text-[#2C1810] mb-6">Review Your Answers for {results.assessmentId}</h2>
        <div className="space-y-6">
            {results.questions.map((q, index) => {
                const userAnswer = results.answers[index];
                const isCorrect = userAnswer === q.answer;
                return (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="font-semibold text-[#2C1810] mb-4">Question {index + 1}: {q.question}</h3>
                        <div className="space-y-3">
                            {q.options.map(option => {
                                let style = 'border-gray-300';
                                if (option === q.answer) style = 'border-green-500 bg-green-50 text-green-800';
                                if (option === userAnswer && !isCorrect) style = 'border-red-500 bg-red-50 text-red-800';
                                
                                return (
                                    <div key={option} className={`p-3 border-2 rounded-lg flex items-center ${style}`}>
                                        {option === q.answer && <CheckCircle className="w-5 h-5 mr-3 text-green-600" />}
                                        {option === userAnswer && !isCorrect && <XCircle className="w-5 h-5 mr-3 text-red-600" />}
                                        {option}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

// 5. Admin Panel (FR-013 to FR-018)
const AdminPanel = ({ programmeData, setProgrammeData, log, setLog }) => {
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const fileInputRef = useRef(null);

    const handleExportProgrammes = () => {
        const dataStr = JSON.stringify(programmeData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tuc-programmes.json';
        a.click();
        URL.revokeObjectURL(url);
        setMessage({ text: 'Programme data exported successfully.', type: 'success' });
    };

    const handleImportProgrammes = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    if (json.programmes && json.questions) {
                        setProgrammeData(json);
                        setMessage({ text: 'Programme data imported successfully.', type: 'success' });
                    } else {
                        throw new Error('Invalid file structure.');
                    }
                } catch (error) {
                    setMessage({ text: `Import failed: ${error.message}`, type: 'error' });
                }
            };
            reader.readAsText(file);
        } else {
            setMessage({ text: 'Please select a valid JSON file.', type: 'error' });
        }
        fileInputRef.current.value = null; // Reset file input
    };

    const handleExportLog = () => {
        const dataStr = JSON.stringify(log, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tuc-audit-log.json';
        a.click();
        URL.revokeObjectURL(url);
        setMessage({ text: 'Audit log exported successfully.', type: 'success' });
    };

    const performAction = () => {
        if (action === 'clearLog') {
            setLog([]);
            setMessage({ text: 'Audit log cleared.', type: 'success' });
        } else if (action === 'resetData') {
            setProgrammeData(initialProgrammeData);
            setMessage({ text: 'Programme data reset to default.', type: 'success' });
        }
        setShowModal(false);
        setAction(null);
    };

    const adminActions = [
        { label: 'Export Programme Data', icon: Download, action: handleExportProgrammes, color: 'blue' },
        { label: 'Import Programme Data', icon: Upload, action: () => fileInputRef.current.click(), color: 'blue' },
        { label: 'Export Audit Log', icon: FileText, action: handleExportLog, color: 'green' },
        { label: 'Clear Audit Log', icon: Trash2, action: () => { setAction('clearLog'); setShowModal(true); }, color: 'red' },
        { label: 'Reset All Data', icon: RefreshCw, action: () => { setAction('resetData'); setShowModal(true); }, color: 'red' },
    ];

    return (
        <div>
            <h2 className="text-2xl font-semibold text-[#2C1810] mb-6">Administrative Panel</h2>
            {message.text && (
                <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <input type="file" ref={fileInputRef} onChange={handleImportProgrammes} accept=".json" className="hidden" />
                {adminActions.map(act => (
                    <div key={act.label} onClick={act.action}
                         className={`bg-white p-6 rounded-xl shadow-sm cursor-pointer flex flex-col items-center justify-center text-center hover:bg-gray-50 border-b-4 border-${act.color}-500`}>
                        <act.icon className={`w-10 h-10 mb-3 text-${act.color}-600`} />
                        <span className="font-semibold text-[#2C1810]">{act.label}</span>
                    </div>
                ))}
            </div>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h3 className="text-lg font-bold text-[#2C1810] mb-4">Confirm Action</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to {action === 'clearLog' ? 'clear the audit log' : 'reset all programme data'}? This cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                    <button onClick={performAction} className="px-4 py-2 bg-red-600 text-white rounded-lg">Confirm</button>
                </div>
            </Modal>
        </div>
    );
};


// 6. Analytics Dashboard (Integrated)
const AnalyticsDashboard = () => {
    // Using static data as per the original component, now updated for 4 programmes
    const programmePerformance = [
        { name: 'Jewellery Design', students: 145, avgScore: 87, completion: 92 },
        { name: 'Digital Media', students: 203, avgScore: 84, completion: 88 },
        { name: 'Fashion Design', students: 167, avgScore: 81, completion: 85 },
        { name: 'Product Design', students: 89, avgScore: 89, completion: 94 }
    ];
    const skillsBreakdown = [
        { skill: 'Technical Skills', value: 78, change: +5 },
        { skill: 'Creative Design', value: 85, change: +8 },
        { skill: 'Problem Solving', value: 72, change: +3 },
        { skill: 'Communication', value: 81, change: +7 },
        { skill: 'Project Management', value: 69, change: -2 },
        { skill: 'Industry Knowledge', value: 83, change: +4 }
    ];

    const kpiData = {
        totalStudents: 604,
        totalAssessments: 2196,
        avgCompletionRate: 89,
        avgScore: 82,
        trends: { students: +12, assessments: +18, completion: +3, score: +5 }
    };
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-[#E6D5C7] shadow-lg">
                    <p className="label font-semibold text-[#2C1810]">{`${label}`}</p>
                    {payload.map((pld, index) => (
                        <p key={index} style={{ color: pld.color }} className="text-sm">{`${pld.name}: ${pld.value}`}</p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold text-[#2C1810] mb-6">Performance Analytics</h2>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Students" value={kpiData.totalStudents} change={kpiData.trends.students} icon={<Users className="w-6 h-6 text-[#8B1538]" />} subtitle="Across all programmes" />
                <StatCard title="Assessments Completed" value={kpiData.totalAssessments} change={kpiData.trends.assessments} icon={<BookOpen className="w-6 h-6 text-[#8B1538]" />} subtitle="This academic year" />
                <StatCard title="Completion Rate" value={`${kpiData.avgCompletionRate}%`} change={kpiData.trends.completion} icon={<Target className="w-6 h-6 text-[#8B1538]" />} subtitle="Average across programmes" />
                <StatCard title="Average Score" value={`${kpiData.avgScore}%`} change={kpiData.trends.score} icon={<Award className="w-6 h-6 text-[#8B1538]" />} subtitle="Skills assessment average" />
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(139,21,56,0.15)]">
                    <h3 className="text-lg font-semibold text-[#2C1810] mb-4">Programme Performance Comparison</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={programmePerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E6D5C7" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="avgScore" fill="#8B1538" name="Average Score" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="completion" fill="#D4AF37" name="Completion Rate" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(139,21,56,0.15)]">
                    <h3 className="text-lg font-semibold text-[#2C1810] mb-4">Skills Development Progress</h3>
                    <div className="space-y-4">
                        {skillsBreakdown.map((skill, index) => (
                            <SkillProgressBar key={index} {...skill} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};


// --- MAIN APP COMPONENT (Router & State Management) ---
const App = () => {
    const [view, setView] = useState('dashboard'); // dashboard, programmeDetail, assessment, results, admin, analytics
    const [programmeData, setProgrammeData] = useLocalStorage('tuc-programme-data', initialProgrammeData);
    const [selectedProgramme, setSelectedProgramme] = useState(null);
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [results, setResults] = useState(null);
    const [sessionToResume, setSessionToResume] = useState(null);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminError, setAdminError] = useState('');

    const { log, addLogEntry, setLog } = useAuditLog();

    useEffect(() => {
        addLogEntry('APP_LOAD', {});
        // Check for an in-progress assessment on load
        const inProgress = Object.keys(localStorage).find(k => k.startsWith('assessment-session-'));
        if (inProgress) {
            const assessmentId = inProgress.replace('assessment-session-', '');
            const allAssessments = programmeData.programmes.flatMap(p => Object.values(p.assessments).flat());
            const assessmentDetails = allAssessments.find(a => a.id === assessmentId);
            if (assessmentDetails) {
                setSessionToResume(assessmentDetails);
            }
        }
    }, []);

    const resumeAssessment = () => {
        setSelectedAssessment(sessionToResume);
        setView('assessment');
        setSessionToResume(null);
    };
    
    const discardAssessment = () => {
        localStorage.removeItem(`assessment-session-${sessionToResume.id}`);
        localStorage.removeItem(`assessment-time-${sessionToResume.id}`);
        setSessionToResume(null);
    };

    const handleAdminLogin = () => {
        if (password =[REDACTED_CREDENTIAL]
            setIsAdminAuthenticated(true);
            setView('admin');
            setShowAdminModal(false);
            setAdminError('');
            setPassword('');
        } else {
            setAdminError('Incorrect password.');
        }
    };

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <ProgrammeDashboard setView={setView} setProgramme={setSelectedProgramme} programmes={programmeData.programmes} />;
            case 'programmeDetail':
                return <ProgrammeDetail programme={selectedProgramme} setView={setView} setAssessment={setSelectedAssessment} />;
            case 'assessment':
                return <AssessmentPlayer assessment={selectedAssessment} questions={programmeData.questions[selectedAssessment.id] || []} setView={setView} setResults={setResults} addLogEntry={addLogEntry} />;
            case 'results':
                return <ResultsPage results={results} setView={setView} />;
            case 'admin':
                return <AdminPanel programmeData={programmeData} setProgrammeData={setProgrammeData} log={log} setLog={setLog} />;
            case 'analytics':
                return <AnalyticsDashboard />;
            default:
                return <ProgrammeDashboard setView={setView} setProgramme={setSelectedProgramme} programmes={programmeData.programmes} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F6F0] text-[#2C1810] font-sans">
            <header className="bg-white/80 backdrop-blur-sm border-b border-[#E6D5C7] px-6 py-3 sticky top-0 z-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center cursor-pointer" onClick={() => setView('dashboard')}>
                        <img src="https://techbridge.edu.gh/wp-content/uploads/tuc-logo.png" alt="TUC Logo" className="h-12 mr-4" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                        <div>
                            <h1 className="text-xl font-bold text-[#8B1538]">Skills Evaluation System</h1>
                        </div>
                    </div>
                    <nav className="flex items-center space-x-4">
                        <button onClick={() => setView('dashboard')} className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-[#E6D5C7] transition-colors"><Home className="w-5 h-5"/><span>Home</span></button>
                        <button onClick={() => setView('analytics')} className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-[#E6D5C7] transition-colors"><BarChart2 className="w-5 h-5"/><span>Analytics</span></button>
                        <button onClick={() => { if(isAdminAuthenticated) setView('admin'); else setShowAdminModal(true); }} className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-[#E6D5C7] transition-colors">
                            {isAdminAuthenticated ? <ShieldCheck className="w-5 h-5 text-green-600"/> : <Settings className="w-5 h-5"/>}
                            <span>Admin</span>
                        </button>
                    </nav>
                </div>
            </header>

            <main className="p-6">
                {renderView()}
            </main>

            <Modal isOpen={!!sessionToResume} onClose={() => {}}>
                <h3 className="text-lg font-bold text-[#2C1810] mb-4">Resume Assessment?</h3>
                <p className="text-gray-600 mb-6">We found an assessment in progress for "{sessionToResume?.id} - {sessionToResume?.title}". Would you like to resume where you left off?</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={discardAssessment} className="px-4 py-2 bg-gray-200 rounded-lg">Discard</button>
                    <button onClick={resumeAssessment} className="px-4 py-2 bg-[#8B1538] text-white rounded-lg">Resume</button>
                </div>
            </Modal>

            <Modal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)}>
                <h3 className="text-lg font-bold text-[#2C1810] mb-4">Admin Access</h3>
                <p className="text-gray-600 mb-4">Please enter the password to access administrative tools.</p>
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                />
                {adminError && <p className="text-red-500 text-sm mb-4">{adminError}</p>}
                <div className="flex justify-end space-x-4">
                    <button onClick={() => setShowAdminModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                    <button onClick={handleAdminLogin} className="px-4 py-2 bg-[#8B1538] text-white rounded-lg">Login</button>
                </div>
            </Modal>
        </div>
    );
};

export default App;

```

### FILE: src/AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_techbridge_skills_evaluation';
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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Techbridge Skills Evaluation</h1>
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

### FILE: src/index.js
```javascript
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4014;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = <REDACTED>
const DB_NAME = process.env.DB_NAME || 'skills_evaluation';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS competencies (
        id VARCHAR(255) PRIMARY KEY, competency_name VARCHAR(255),
        competency_category VARCHAR(100), proficiency_levels INT DEFAULT 5,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS skill_assessments (
        id VARCHAR(255) PRIMARY KEY, student_id VARCHAR(255),
        competency_id VARCHAR(255), proficiency_level INT,
        assessment_score DECIMAL(5,2), feedback TEXT,
        assessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (competency_id) REFERENCES competencies(id),
        INDEX idx_student (student_id), INDEX idx_competency (competency_id)
      )
    `);
    conn.release();
    console.log('Skills Evaluation DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'skills-evaluation' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/assessment') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const assessId = `skill_${Date.now()}`;
          await conn.query(
            'INSERT INTO skill_assessments (id, student_id, competency_id, proficiency_level, assessment_score, feedback) VALUES (?, ?, ?, ?, ?, ?)',
            [assessId, data.student_id || '', data.competency_id || '', data.level || 3, data.score || 0, data.feedback || '']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, assessment_id: assessId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/competencies')) {
      const conn = await pool.getConnection();
      const [skills] = await conn.query('SELECT * FROM competencies LIMIT 50');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(skills));
      return;
    }

    res.writeHead(404);
    res.end('Not Found');
  } catch (e) {
    console.error('Request error:', e);
    res.writeHead(500);
    res.end(JSON.stringify({ error: e.message }));
  }
}

async function start() {
  await initDB();
  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch(e => { res.writeHead(500); res.end('error'); });
  });
  server.listen(PORT, () => console.log(`Skills Evaluation API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });

```

### FILE: src/index.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { AuthGate } from './AuthGate';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthGate><App /></AuthGate>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

document.getElementById('tuc-splash-styles')?.remove();

```

### FILE: src/reportWebVitals.js
```javascript
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

```

### FILE: src/setupTests.js
```javascript
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

```

### FILE: src/vite-env.d.ts
```typescript
/// <reference types="vite/client" />

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — tuc-skills-evaluation
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('tuc-skills-evaluation E2E', () => {
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
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src"]
}

```

### FILE: vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
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
    }
})

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — tuc-skills-evaluation
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

// Vitest E2E configuration — tuc-skills-evaluation
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

