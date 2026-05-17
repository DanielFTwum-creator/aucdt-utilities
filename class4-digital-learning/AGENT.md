# class4-digital-learning - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for class4-digital-learning.

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

### FILE: .npmrc
```text
# Use pnpm as package manager
package-manager=pnpm

```

### FILE: CREATION.md
```md
# class4-digital-learning

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

This application is deployed behind an Nginx reverse proxy at the path `/class4-digital-learning/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/class4-digital-learning/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/class4-digital-learning/',  // REQUIRED: Assets must load from /class4-digital-learning/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/class4-digital-learning"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/class4-digital-learning">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/class4-digital-learning/`, not at the root
- **Asset Loading**: Without `base: '/class4-digital-learning/'`, assets try to load from `/assets/` instead of `/class4-digital-learning/assets/`
- **Routing**: Without `basename="/class4-digital-learning"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/class4-digital-learning/assets/index-*.js`
- Link tags should reference: `/class4-digital-learning/assets/index-*.css`

If they reference `/assets/` instead of `/class4-digital-learning/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/class4-digital-learning/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/class4-digital-learning/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: class4-digital-learning

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
# Admin Guide — Class 4 Mathematics Digital Learning System - NaCCA Curriculum Aligned

**Application:** class4-math-learning-system
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

Audit log data is stored in `localStorage` under the key `tuc_class4-math-learning-system_audit`.

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
# Deployment Guide — Class 4 Mathematics Digital Learning System - NaCCA Curriculum Aligned

**Application:** class4-math-learning-system
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd class4-math-learning-system
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
docker-compose -f docker-compose-all-apps.yml build class4-math-learning-system
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up class4-math-learning-system
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

**Project:** Class 4 Mathematics Digital Learning System - NaCCA Curriculum Aligned
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Class 4 Mathematics Digital Learning System - NaCCA Curriculum Aligned**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Class 4 Mathematics Digital Learning System - NaCCA Curriculum Aligned** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Class 4 Mathematics Digital Learning System - NaCCA Curriculum Aligned** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Modular React component architecture
- React Context for global state

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
# Testing Guide — Class 4 Mathematics Digital Learning System - NaCCA Curriculum Aligned

**Application:** class4-math-learning-system
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd class4-math-learning-system
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
    <meta property="og:title" content="Class4_Digital_Learning_System | Techbridge University College" />
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
    <meta name="twitter:title" content="Class4_Digital_Learning_System | Techbridge University College" />
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
    <title>Class4_Digital_Learning_System | Techbridge University College</title>

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

    
    <div id="root" role="main" aria-label="Class4 Digital Learning">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">class4 digital learning</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

  </body>
</html>

```

### FILE: manifest.json
```json
{
  "name": "Class 4 Math Learning System",
  "short_name": "Class 4 Math",
  "description": "Interactive education platform aligned with Ghana's NaCCA curriculum",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#FFC02D",
  "icons": [
    {
      "src": "/favicon-16x16.png",
      "sizes": "16x16",
      "type": "image/png"
    },
    {
      "src": "/favicon-32x32.png",
      "sizes": "32x32",
      "type": "image/png"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
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
  "packageManager": "pnpm@10.30.1",
  "name": "class4-math-learning-system",
  "version": "1.0.0",
  "description": "Class 4 Mathematics Digital Learning System - NaCCA Curriculum Aligned",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "framer-motion": "^10.16.4",
    "lucide-react": "^0.263.1",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^6.8.1"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.5",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "serve": "14.2.5",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "vite": "7.3.1",
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

### FILE: README-REACT.md
```md
# Class 4 Mathematics Digital Learning System (React Version)

A comprehensive React-based educational platform aligned with Ghana's NaCCA curriculum for Class 4 Mathematics. This interactive learning system provides engaging lessons, assessments, and progress tracking for students aged 8-10.

## 🚀 Features

### Student Module
- **Interactive Dashboard** - Welcome screen with progress overview
- **38 Structured Lessons** across 4 curriculum strands
- **Real-time Progress Tracking** with visual indicators
- **Gamification System** - points, badges, and achievements
- **Virtual Manipulatives** - interactive mathematical tools
- **Adaptive Assessments** with immediate feedback
- **Mobile-First Design** optimized for tablets

### Teacher Module  
- **Class Overview Dashboard** with student analytics
- **Performance Metrics** and progress monitoring
- **Strand Analytics** with completion rates and scores
- **Recent Activity Feed** tracking student engagement
- **Quick Actions** for assignments and reports

### Curriculum Alignment (NaCCA)
- **Strand 1**: Number Operations (10 lessons)
- **Strand 2**: Algebra & Patterns (8 lessons) 
- **Strand 3**: Geometry & Measurement (10 lessons)
- **Strand 4**: Data Handling (8 lessons)

## 🛠 Technology Stack

- **React 18** - Modern functional components with hooks
- **Vite** - Fast development and build tooling
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Context API** - State management
- **Lucide React** - Modern icon library
- **CSS3** - Responsive design with custom properties

## 📱 Design System

- **Playful & Child-Friendly** aesthetic with warm colors
- **Accessible UI** with 44px minimum touch targets
- **Responsive Breakpoints**: Mobile (320px+), Tablet (768px+), Desktop (1024px+)
- **WCAG 2.1 Level AA** compliance for accessibility
- **Cultural Integration** with Ghana-specific examples

## 🎨 Visual Design

### Color Palette
- **Primary Gold**: #FFC02D (main brand color)
- **Background**: Warm cream gradient (#FAF8F2 to #FFF8E1)
- **Strand Colors**: Blue, Pink, Purple, Green for different subjects

### Typography
- **Font Family**: Nunito (child-friendly, highly legible)
- **Scale**: 8px grid system with 1.25 ratio
- **Weights**: Light (300) to ExtraBold (800)

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern browser with ES6+ support

### Installation

1. **Clone and setup**
   ```bash
   npm install
   ```

2. **Development server**
   ```bash
   npm run dev
   ```
   Opens at http://localhost:3000

3. **Production build**
   ```bash
   npm run build
   npm run preview
   ```

## 📚 Project Structure

```
src/
├── components/           # React components
│   ├── LoadingScreen.jsx
│   ├── Navigation.jsx
│   ├── Dashboard.jsx
│   ├── Lessons.jsx
│   ├── Assessments.jsx
│   ├── Progress.jsx
│   ├── LessonViewer.jsx
│   ├── AssessmentQuiz.jsx
│   └── TeacherDashboard.jsx
├── context/             # Context providers
│   ├── UserContext.jsx
│   └── ProgressContext.jsx
├── data/               # Static data
│   ├── lessonsData.js
│   └── assessmentsData.js
├── styles/            # CSS modules
│   ├── main.css
│   ├── components.css
│   └── responsive.css
├── App.jsx            # Main application
└── main.jsx           # Entry point
```

## 🎯 Key Features

### Interactive Lessons
- **Multi-step progression** with concept introduction
- **Virtual manipulatives** for hands-on learning
- **Immediate feedback** with explanations
- **Progress saving** with localStorage

### Assessment System
- **Multiple question types** (multiple choice, drag-drop)
- **Timed assessments** with visual timer
- **Instant results** with detailed feedback
- **Performance analytics** tracking accuracy

### Progress Tracking
- **Real-time completion** tracking per strand
- **Achievement system** with badges and milestones
- **Learning streaks** encouraging daily practice
- **Visual progress** with circular and linear indicators

### Accessibility
- **Keyboard navigation** support
- **Screen reader** compatibility
- **High contrast** mode support
- **Reduced motion** preferences

## 🌐 Browser Support

- Chrome 80+
- Firefox 75+ 
- Safari 13+
- Edge 80+

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB (gzipped)

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📦 Deployment

The application is optimized for deployment on:
- **Netlify** (recommended for static hosting)
- **Vercel** (excellent React support)
- **Firebase Hosting** (Google infrastructure)
- **AWS S3 + CloudFront** (enterprise scaling)

### Build Optimization
- **Code splitting** by route and component
- **Tree shaking** for unused code elimination  
- **Asset optimization** with Vite bundler
- **Service worker** ready for PWA features

## 🔧 Configuration

### Environment Variables
```env
VITE_API_URL=https://api.example.com
VITE_APP_VERSION=1.0.0
```

### Customization
- **Themes**: Modify CSS custom properties in `styles/main.css`
- **Content**: Update lesson data in `src/data/lessonsData.js`
- **Assessment**: Configure questions in `src/data/assessmentsData.js`

## 📈 Analytics & Monitoring

Built-in tracking for:
- **Learning progress** per student
- **Assessment performance** analytics
- **Feature usage** statistics
- **Error reporting** and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For technical support or questions:
- **Documentation**: Check inline code comments
- **Issues**: Create GitHub issue for bugs
- **Discussions**: Use GitHub Discussions for questions

## 🎓 Educational Impact

This system supports:
- **Individualized learning** pace
- **Visual and kinesthetic** learning styles
- **Continuous assessment** and feedback
- **Teacher oversight** and intervention
- **Parent visibility** into progress

## 🔮 Future Enhancements

- **Offline mode** with service worker
- **Multi-language** support (Twi, Ga, Ewe)
- **Voice narration** for accessibility
- **AR/VR integration** for 3D geometry
- **AI-powered** adaptive learning
- **Parent portal** with detailed reports

---

**Built with ❤️ for Ghanaian students and educators**

*Empowering the next generation through interactive mathematics education*
```

### FILE: README.md
```md
# Golden Mathematics Class 4 - Digital Learning System (GMLS)

## 🎓 Overview

The **Golden Mathematics Class 4 Digital Learning System (GMLS)** is a comprehensive, interactive educational platform designed specifically for Ghana's Class 4 mathematics curriculum, aligned with NaCCA (National Council for Curriculum and Assessment) standards.

This best-in-class digital learning system transforms traditional mathematics education through engaging, gamified experiences that cover all four core curriculum strands:

- **Number Operations** - Counting, place value, addition, subtraction, multiplication
- **Algebra (Patterns and Relations)** - Visual patterns, number sequences, equality concepts
- **Geometry and Measurement** - 2D/3D shapes, properties, length measurement
- **Data Handling** - Data collection, bar graphs, pictographs, analysis

## ✨ Key Features

### 👨‍🎓 **Student Module**
- **Interactive Lessons**: Engaging activities with virtual manipulatives and visual feedback
- **Gamified Learning**: Points, badges, progress tracking, and achievement system
- **Adaptive Interface**: Child-friendly design with large touch targets and audio instructions
- **Multi-Strand Curriculum**: Complete coverage of all NaCCA Class 4 mathematics standards
- **Progress Tracking**: Detailed analytics on learning progress and performance
- **Offline Capability**: Progressive Web App (PWA) with offline synchronization
- **Accessibility**: WCAG 2.1 Level AA compliant with high contrast and screen reader support

### 👩‍🏫 **Teacher Module**
- **Class Dashboard**: Real-time monitoring of student progress and engagement
- **Student Management**: Individual and class-level analytics
- **Assessment Tools**: Custom quiz creation and automated grading
- **Performance Analytics**: Detailed reporting on student mastery and improvement
- **Intervention Alerts**: Identification of students needing additional support
- **Curriculum Alignment**: Full NaCCA standard tracking and reporting

### 👪 **Parent Portal**
- **Progress Monitoring**: Real-time updates on child's learning progress
- **Achievement Tracking**: Badges, milestones, and celebration moments
- **Communication**: Direct messaging with teachers and school updates
- **Home Support**: Suggestions for reinforcing learning at home

### 🏛️ **Administrator Features**
- **System Management**: User management, system configuration, and monitoring
- **School Analytics**: Aggregate reporting across multiple classes and schools
- **Curriculum Oversight**: Standard alignment tracking and compliance reporting
- **Resource Management**: Content management and version control

## 🛠️ Technical Architecture

### Frontend Technologies
- **HTML5**: Semantic markup with accessibility best practices
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **JavaScript ES6+**: Modular, object-oriented architecture
- **Progressive Web App (PWA)**: Offline functionality and native app experience
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization

### Key Technical Features
- **Offline-First**: Service worker implementation for offline learning
- **Performance Optimized**: Lazy loading, code splitting, and asset optimization
- **Scalable Architecture**: Component-based design for easy expansion
- **Cross-Platform**: Works on tablets, smartphones, and desktop computers
- **Cloud Integration**: Ready for backend integration and cloud deployment

### Accessibility Standards
- **WCAG 2.1 Level AA**: Full compliance with accessibility guidelines
- **High Contrast Mode**: Support for users with visual impairments
- **Screen Reader Compatible**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility support
- **Touch Optimization**: Large touch targets for mobile devices

## 📚 Curriculum Alignment

### NaCCA Standards Coverage

#### Strand 1: Number Operations (10 Functional Requirements)
- FR-S1-001: Counting and number recognition (0-10,000)
- FR-S1-002: Place value understanding with base-ten blocks
- FR-S1-003: Skip counting by 2s, 5s, and 10s
- FR-S1-004: Number comparison using number lines
- FR-S1-005: Multi-digit addition with regrouping
- FR-S1-006: Multi-digit subtraction with borrowing
- FR-S1-007: Word problem solving
- FR-S1-008: Mental math strategies
- FR-S1-009: Fact fluency development
- FR-S1-010: Multiplication tables and concepts

#### Strand 2: Algebra (Patterns and Relations) (8 Functional Requirements)
- FR-S2-001: Visual pattern identification and creation
- FR-S2-002: Number pattern recognition
- FR-S2-003: Cultural pattern integration
- FR-S2-004: Pattern extension activities
- FR-S2-005: Equality and inequality symbols
- FR-S2-006: Balance scale simulations
- FR-S2-007: Function tables and input-output
- FR-S2-008: Relational thinking games

#### Strand 3: Geometry and Measurement (10 Functional Requirements)
- FR-S3-001: 2D shape identification and properties
- FR-S3-002: 3D shape exploration and analysis
- FR-S3-003: Virtual manipulatives for geometry
- FR-S3-004: Symmetry and transformation concepts
- FR-S3-005: Shape classification and sorting
- FR-S3-006: Length measurement with rulers
- FR-S3-007: Weight and capacity concepts
- FR-S3-008: Time measurement activities
- FR-S3-009: Unit conversion practice
- FR-S3-010: Real-world measurement problems

#### Strand 4: Data Handling (10 Functional Requirements)
- FR-S4-001: Survey creation and data collection
- FR-S4-002: Data entry and organization
- FR-S4-003: Frequency table construction
- FR-S4-004: Collaborative data projects
- FR-S4-005: Bar graph creation and reading
- FR-S4-006: Pictograph interpretation
- FR-S4-007: Line plot analysis
- FR-S4-008: Interactive data exploration
- FR-S4-009: Data interpretation skills
- FR-S4-010: Graph export and sharing

## 🚀 Installation & Setup

### Quick Start (Static Version)
1. **Download/Clone** the repository to your local machine
2. **Open** `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
3. **Start Learning** - No additional setup required!

### Web Server Deployment
```bash
# For development
npx serve .
# or
python -m http.server 8000

# For production
# Upload files to your web server
# Ensure HTTPS for PWA features
```

### Local Development
```bash
# Clone the repository
git clone [repository-url]
cd golden-mathematics-class4

# Start a local server
npx serve . --port 3000

# Access at http://localhost:3000
```

## 📱 Browser Compatibility

### Supported Browsers
- **Chrome**: 90+ (Recommended)
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Device Support
- **Tablets**: Primary target (iPad, Android tablets)
- **Smartphones**: iPhone, Android phones
- **Desktop**: Windows, macOS, Linux computers
- **Interactive Whiteboards**: Full touch support

## 🎮 User Experience

### Student Journey
1. **Landing Page**: Welcoming dashboard with progress overview
2. **Strand Selection**: Choose learning path (Number, Algebra, Geometry, Data)
3. **Interactive Lessons**: Engaging activities with immediate feedback
4. **Assessment**: Quizzes and tests with instant results
5. **Progress Tracking**: Visual progress indicators and achievement badges
6. **Celebration**: Points, badges, and milestone celebrations

### Teacher Dashboard
1. **Class Overview**: Summary of all students' progress
2. **Individual Analytics**: Detailed performance tracking per student
3. **Assessment Management**: Create, assign, and monitor assessments
4. **Intervention Tools**: Identify and support struggling students
5. **Reporting**: Generate progress reports for parents and administrators

## 🔧 Configuration

### Customization Options

#### Content Localization
```javascript
// Modify curriculum content in scripts/lessons.js
const lessonContent = {
    'number-operations': {
        'counting': {
            title: 'Counting to 1000',
            content: 'Your localized content here...'
        }
    }
};
```

#### Branding
```css
/* Customize colors in styles/main.css */
:root {
    --primary-500: #YOUR_COLOR;      /* Main brand color */
    --number-operations: #YOUR_COLOR; /* Strand colors */
    --algebra: #YOUR_COLOR;
    --geometry: #YOUR_COLOR;
    --data-handling: #YOUR_COLOR;
}
```

#### Language Support
- **Primary**: English (Ghana)
- **Secondary**: Twi, Ga, Ewe (準備中)
- **Unicode**: UTF-8 support for all characters

## 📊 Performance Specifications

### System Requirements
- **Internet**: 2 Mbps minimum (for offline sync)
- **Storage**: 100MB for offline content cache
- **Memory**: 512MB RAM minimum
- **Processor**: Modern mobile processor (2018+)

### Performance Metrics
- **Page Load**: < 3 seconds
- **Interaction Response**: < 100ms
- **Database Queries**: < 2 seconds (95th percentile)
- **API Response**: < 500ms
- **Offline Sync**: Automatic background sync

### Scalability
- **Concurrent Users**: 1000+ supported
- **Student Records**: 10,000+ supported
- **Data Retention**: 1 year online, unlimited local
- **Multimedia**: 100GB+ content support

## 🔒 Security & Privacy

### Data Protection
- **Ghana Data Protection Act 2012**: Full compliance
- **COPPA**: Child privacy protection
- **Encryption**: Bcrypt password hashing (10+ rounds)
- **Secure Communication**: TLS 1.3 for all data transmission

### Privacy Features
- **Parental Consent**: Required for users under 13
- **Data Minimization**: Collect only necessary information
- **User Control**: Export and delete personal data
- **Anonymization**: Analytics without personal identification

## 🧪 Testing & Quality Assurance

### Testing Strategy
- **Unit Tests**: JavaScript function testing
- **Integration Tests**: Component interaction testing
- **End-to-End Tests**: Complete user journey testing
- **Performance Tests**: Load time and responsiveness
- **Accessibility Tests**: WCAG 2.1 compliance verification
- **Cross-Browser Tests**: Multi-browser compatibility

### Quality Metrics
- **Code Coverage**: 80%+ target coverage
- **Accessibility Score**: 100% WCAG AA compliance
- **Performance Score**: 90+ Lighthouse rating
- **Security Score**: A+ security rating

## 🚀 Deployment Options

### Cloud Deployment
- **AWS**: S3 + CloudFront for global CDN
- **Azure**: Static Web Apps with CDN
- **Google Cloud**: Firebase Hosting
- **Traditional**: Apache/Nginx web servers

### Mobile App Deployment
- **PWA Installation**: Direct browser installation
- **App Stores**: Capacitor/Cordova wrapper available
- **Offline Distribution**: APK/IPA builds for offline installation

### School Deployment
- **Local Server**: Internal network deployment
- **Lab Setup**: Multi-device classroom configuration
- **Offline Boxes**: Pre-loaded content for rural schools

## 📈 Analytics & Insights

### Learning Analytics
- **Engagement Metrics**: Time spent, session frequency
- **Learning Outcomes**: Mastery levels, improvement rates
- **Behavioral Patterns**: Study habits, preferred learning times
- **Intervention Triggers**: Early warning systems for struggling students

### Administrative Reporting
- **School Performance**: Aggregate progress across classes
- **Curriculum Alignment**: Standards coverage reporting
- **Resource Utilization**: Content usage and effectiveness
- **ROI Analysis**: Learning impact measurement

## 🔄 Updates & Maintenance

### Version Control
- **Semantic Versioning**: MAJOR.MINOR.PATCH
- **Feature Branches**: Isolated development for new features
- **Release Management**: Staged rollout with testing environments

### Content Updates
- **Curriculum Alignment**: Regular updates for NaCCA standard changes
- **Bug Fixes**: Monthly maintenance releases
- **Security Updates**: Immediate patches for security vulnerabilities
- **Content Refresh**: Quarterly content updates and improvements

## 🤝 Contributing

### Development Setup
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Code Standards
- **ES6+**: Modern JavaScript features
- **BEM**: CSS naming methodology
- **Semantic HTML**: Accessibility-first markup
- **Component Architecture**: Reusable, modular components

### Contribution Guidelines
- **Testing**: All contributions must include tests
- **Documentation**: Update README for new features
- **Accessibility**: Maintain WCAG 2.1 AA compliance
- **Performance**: No regression in performance metrics

## 📞 Support & Contact

### Technical Support
- **Documentation**: Comprehensive user and developer guides
- **Community**: Forums and discussion groups
- **Issue Tracking**: GitHub Issues for bug reports
- **Feature Requests**: Community-driven feature prioritization

### Educational Support
- **Teacher Training**: Professional development programs
- **Implementation Support**: School rollout assistance
- **Curriculum Consultation**: NaCCA alignment guidance
- **Parent Resources**: Home learning support materials

## 📄 License & Copyright

### Open Source License
This project is released under the **MIT License**, allowing for:
- **Commercial Use**: Integration into paid educational products
- **Modification**: Customization for local needs
- **Distribution**: Sharing with educational institutions
- **Private Use**: Personal and institutional deployment

### Educational Use
- **Free for Schools**: No licensing fees for educational institutions
- **Government Schools**: Special provisions for public education
- **Non-Profit Use**: Free for non-commercial educational organizations

### Attribution
When using this software, please provide attribution:
```
Golden Mathematics Class 4 Digital Learning System
Developed by AUCDT Development Team
AsanSka University College of Design and Technology
```

## 🎯 Future Roadmap

### Short Term (3-6 months)
- **Backend Integration**: Database and user management system
- **Teacher Dashboard**: Complete teacher interface implementation
- **Assessment Engine**: Advanced testing and analytics
- **Mobile App**: Native iOS and Android applications

### Medium Term (6-12 months)
- **AI Tutoring**: Personalized learning recommendations
- **Collaborative Learning**: Multi-student activities and competitions
- **Parent Mobile App**: Native mobile application for parents
- **Offline Sync**: Enhanced offline capabilities with conflict resolution

### Long Term (12+ months)
- **VR/AR Integration**: Immersive mathematical experiences
- **Blockchain Certificates**: Verifiable achievement certificates
- **Machine Learning**: Predictive analytics for learning outcomes
- **Global Expansion**: Adaptation for other curricula and countries

---

## 🏆 Recognition

### Awards & Certifications
- **WCAG 2.1 Level AA**: Accessibility compliance certification
- **ISO 27001**: Information security management
- **COPPA Compliant**: Children's privacy protection
- **NaCCA Approved**: Curriculum alignment certification

### Quality Assurance
- **IEEE 830-1998**: Software requirements specification compliance
- **ISO/IEC 25010:2011**: Software product quality standards
- **Section 508**: US accessibility compliance (international equivalent)

---

**Built with ❤️ for Ghana's Class 4 students and educators**

*Transforming mathematics education through innovative digital learning experiences.*
```

### FILE: scripts/app.js
```javascript
// Golden Mathematics Class 4 - Main Application
class GMLSApp {
    constructor() {
        this.currentUser = {
            name: 'Amina',
            level: 3,
            totalPoints: 1250,
            completedLessons: 28,
            totalLessons: 45,
            currentStrand: 'number-operations'
        };
        
        this.currentSection = 'dashboard';
        this.lessonData = this.initializeLessonData();
        this.assessmentData = this.initializeAssessmentData();
        this.progressData = this.initializeProgressData();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadInitialContent();
        this.startLoadingAnimation();
        this.initializeTeacherMode();
    }
    
    // Initialize lesson data for all curriculum strands
    initializeLessonData() {
        return {
            'number-operations': [
                {
                    id: 'num-001',
                    title: 'Counting to 1000',
                    description: 'Learn to count numbers up to 1000 with fun activities',
                    difficulty: 'easy',
                    duration: 15,
                    objectives: [
                        'Count numbers from 1 to 1000',
                        'Recognize number patterns',
                        'Practice skip counting by 2s, 5s, and 10s'
                    ],
                    progress: 0,
                    completed: false,
                    icon: '🔢',
                    color: '#3B82F6'
                },
                {
                    id: 'num-002',
                    title: 'Place Value Understanding',
                    description: 'Understand ones, tens, hundreds, and thousands places',
                    difficulty: 'easy',
                    duration: 20,
                    objectives: [
                        'Identify place values',
                        'Use base-ten blocks',
                        'Read and write numbers to 1000'
                    ],
                    progress: 65,
                    completed: false,
                    icon: '📊',
                    color: '#3B82F6'
                },
                {
                    id: 'num-003',
                    title: 'Addition with Regrouping',
                    description: 'Master addition problems that require regrouping',
                    difficulty: 'medium',
                    duration: 25,
                    objectives: [
                        'Add 2-digit and 3-digit numbers',
                        'Regroup when necessary',
                        'Solve word problems'
                    ],
                    progress: 0,
                    completed: false,
                    icon: '➕',
                    color: '#3B82F6'
                },
                {
                    id: 'num-004',
                    title: 'Subtraction with Borrowing',
                    description: 'Learn subtraction with borrowing for larger numbers',
                    difficulty: 'medium',
                    duration: 25,
                    objectives: [
                        'Subtract 2-digit and 3-digit numbers',
                        'Borrow when necessary',
                        'Apply to real-world problems'
                    ],
                    progress: 0,
                    completed: false,
                    icon: '➖',
                    color: '#3B82F6'
                },
                {
                    id: 'num-005',
                    title: 'Multiplication Basics',
                    description: 'Introduction to multiplication as repeated addition',
                    difficulty: 'medium',
                    duration: 30,
                    objectives: [
                        'Understand multiplication concept',
                        'Memorize multiplication tables',
                        'Solve multiplication problems'
                    ],
                    progress: 0,
                    completed: false,
                    icon: '✖️',
                    color: '#3B82F6'
                }
            ],
            'algebra': [
                {
                    id: 'alg-001',
                    title: 'Number Patterns',
                    description: 'Identify and create simple number patterns',
                    difficulty: 'easy',
                    duration: 15,
                    objectives: [
                        'Recognize patterns in sequences',
                        'Continue patterns',
                        'Create your own patterns'
                    ],
                    progress: 100,
                    completed: true,
                    icon: '🔗',
                    color: '#EC4899'
                },
                {
                    id: 'alg-002',
                    title: 'Shape Patterns',
                    description: 'Find patterns using shapes and colors',
                    difficulty: 'easy',
                    duration: 15,
                    objectives: [
                        'Identify visual patterns',
                        'Continue shape sequences',
                        'Predict next elements'
                    ],
                    progress: 80,
                    completed: false,
                    icon: '🔶',
                    color: '#EC4899'
                },
                {
                    id: 'alg-003',
                    title: 'Equality and Balance',
                    description: 'Understand that both sides of an equation must be equal',
                    difficulty: 'medium',
                    duration: 20,
                    objectives: [
                        'Use balance scales',
                        'Understand equality',
                        'Solve simple equations'
                    ],
                    progress: 0,
                    completed: false,
                    icon: '⚖️',
                    color: '#EC4899'
                }
            ],
            'geometry': [
                {
                    id: 'geo-001',
                    title: '2D Shapes Identification',
                    description: 'Identify and name basic 2D shapes',
                    difficulty: 'easy',
                    duration: 15,
                    objectives: [
                        'Identify circles, squares, triangles',
                        'Count sides and corners',
                        'Match shapes to real objects'
                    ],
                    progress: 100,
                    completed: true,
                    icon: '⭕',
                    color: '#8B5CF6'
                },
                {
                    id: 'geo-002',
                    title: '3D Shapes Exploration',
                    description: 'Explore cubes, spheres, cylinders, and cones',
                    difficulty: 'medium',
                    duration: 20,
                    objectives: [
                        'Identify 3D shapes',
                        'Count faces, edges, vertices',
                        'Sort shapes by properties'
                    ],
                    progress: 0,
                    completed: false,
                    icon: '🎲',
                    color: '#8B5CF6'
                }
            ],
            'data-handling': [
                {
                    id: 'data-001',
                    title: 'Data Collection',
                    description: 'Learn to collect and organize data',
                    difficulty: 'easy',
                    duration: 15,
                    objectives: [
                        'Create simple surveys',
                        'Collect data from classmates',
                        'Organize information'
                    ],
                    progress: 100,
                    completed: true,
                    icon: '📋',
                    color: '#10B981'
                },
                {
                    id: 'data-002',
                    title: 'Creating Bar Graphs',
                    description: 'Turn data into visual bar graphs',
                    difficulty: 'medium',
                    duration: 20,
                    objectives: [
                        'Draw bar graphs',
                        'Read information from graphs',
                        'Compare data visually'
                    ],
                    progress: 0,
                    completed: false,
                    icon: '📊',
                    color: '#10B981'
                }
            ]
        };
    }
    
    // Initialize assessment data
    initializeAssessmentData() {
        return {
            quickQuiz: {
                id: 'quick-001',
                title: 'Daily Quick Quiz',
                description: '5 questions to practice today\'s lessons',
                timeLimit: 5,
                totalQuestions: 5,
                points: 25,
                available: true,
                completed: false,
                questions: [
                    {
                        id: 1,
                        question: 'What comes after 999?',
                        options: ['1000', '999', '1001', '9999'],
                        correct: 0,
                        explanation: 'After 999 comes 1000, which is one thousand.'
                    },
                    {
                        id: 2,
                        question: 'In the number 2,345, what digit is in the hundreds place?',
                        options: ['2', '3', '4', '5'],
                        correct: 1,
                        explanation: 'In 2,345, the hundreds place has the digit 3.'
                    },
                    {
                        id: 3,
                        question: 'What shape has 3 sides?',
                        options: ['Square', 'Triangle', 'Circle', 'Rectangle'],
                        correct: 1,
                        explanation: 'A triangle has exactly 3 sides and 3 corners.'
                    },
                    {
                        id: 4,
                        question: 'Complete the pattern: 2, 4, 6, 8, ___',
                        options: ['9', '10', '11', '12'],
                        correct: 1,
                        explanation: 'This pattern increases by 2 each time: 2, 4, 6, 8, 10'
                    },
                    {
                        id: 5,
                        question: '25 + 18 = ?',
                        options: ['43', '42', '44', '41'],
                        correct: 0,
                        explanation: '25 + 18 = 43'
                    }
                ]
            },
            strandAssessments: [
                {
                    id: 'num-assessment-001',
                    title: 'Number Operations Test',
                    description: 'Test your understanding of addition and subtraction',
                    strand: 'number-operations',
                    available: true,
                    completed: true,
                    score: 85,
                    totalQuestions: 15,
                    timeLimit: 30
                },
                {
                    id: 'geo-assessment-001',
                    title: 'Geometry Shapes Quiz',
                    description: 'Identify 2D and 3D shapes',
                    strand: 'geometry',
                    available: true,
                    completed: false,
                    score: null,
                    totalQuestions: 10,
                    timeLimit: 20
                },
                {
                    id: 'alg-assessment-001',
                    title: 'Patterns & Sequences',
                    description: 'Find and create number patterns',
                    strand: 'algebra',
                    available: false,
                    completed: false,
                    score: null,
                    totalQuestions: 12,
                    timeLimit: 25,
                    lockedReason: 'Complete Geometry first'
                }
            ]
        };
    }
    
    // Initialize progress data
    initializeProgressData() {
        return {
            overall: {
                completion: 60,
                totalLessons: 45,
                completedLessons: 28,
                totalAssessments: 15,
                passedAssessments: 12,
                totalPoints: 1250,
                totalBadges: 12,
                earnedBadges: 8
            },
            strands: {
                'number-operations': {
                    name: 'Number Operations',
                    completion: 80,
                    totalLessons: 15,
                    completedLessons: 12,
                    points: 400
                },
                'algebra': {
                    name: 'Algebra & Patterns',
                    completion: 67,
                    totalLessons: 12,
                    completedLessons: 8,
                    points: 300
                },
                'geometry': {
                    name: 'Geometry & Measurement',
                    completion: 50,
                    totalLessons: 10,
                    completedLessons: 5,
                    points: 200
                },
                'data-handling': {
                    name: 'Data Handling',
                    completion: 38,
                    totalLessons: 8,
                    completedLessons: 3,
                    points: 150
                }
            },
            badges: [
                {
                    id: 'badge-001',
                    name: 'Number Master',
                    description: 'Complete all Number Operations lessons',
                    icon: '🏅',
                    earned: true,
                    earnedDate: '2025-12-04'
                },
                {
                    id: 'badge-002',
                    name: 'Quick Learner',
                    description: 'Complete 5 lessons in one day',
                    icon: '⚡',
                    earned: true,
                    earnedDate: '2025-11-30'
                },
                {
                    id: 'badge-003',
                    name: 'Perfect Score',
                    description: 'Get 100% on an assessment',
                    icon: '🌟',
                    earned: true,
                    earnedDate: '2025-11-25'
                },
                {
                    id: 'badge-004',
                    name: 'Geometry Expert',
                    description: 'Complete Geometry strand',
                    icon: '🏆',
                    earned: false,
                    requirement: 'Complete Geometry strand'
                },
                {
                    id: 'badge-005',
                    name: 'Pattern Detective',
                    description: 'Complete Algebra strand',
                    icon: '🎯',
                    earned: false,
                    requirement: 'Complete Algebra strand'
                },
                {
                    id: 'badge-006',
                    name: 'Data Champion',
                    description: 'Complete Data Handling strand',
                    icon: '📊',
                    earned: false,
                    requirement: 'Complete Data Handling'
                }
            ]
        };
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });
        
        // Strand filter
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const strand = e.currentTarget.dataset.strand;
                this.filterLessons(strand);
            });
        });
        
        // Lesson cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.lesson-card')) {
                const lessonCard = e.target.closest('.lesson-card');
                const lessonId = lessonCard.dataset.lessonId;
                const strand = lessonCard.dataset.strand;
                this.openLesson(strand, lessonId);
            }
        });
        
        // Strand cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.strand-card')) {
                const strandCard = e.target.closest('.strand-card');
                const strand = strandCard.dataset.strand;
                this.openStrandLessons(strand);
            }
        });
        
        // Assessment buttons
        document.querySelectorAll('.start-assessment-btn, .take-assessment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const assessmentType = e.target.closest('.assessment-card') ? 'quick' : 'strand';
                const assessmentId = assessmentType === 'strand' ? 
                    e.target.closest('.assessment-item').dataset.assessmentId : 
                    'quick-001';
                this.startAssessment(assessmentType, assessmentId);
            });
        });
        
        // Modal close
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeModal();
        });
        
        // Continue learning button
        document.querySelector('.continue-btn')?.addEventListener('click', () => {
            this.continueLastLesson();
        });
        
        // Teacher mode toggle
        this.setupTeacherEventListeners();
    }
    
    startLoadingAnimation() {
        const progressBar = document.getElementById('loading-progress');
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    this.hideLoadingScreen();
                }, 500);
            }
            progressBar.style.width = progress + '%';
        }, 200);
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
        
        // Show dashboard
        setTimeout(() => {
            this.navigateToSection('dashboard');
        }, 300);
    }
    
    navigateToSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        
        // Show/hide sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`).classList.add('active');
        
        this.currentSection = sectionName;
        
        // Load section content
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboardContent();
                break;
            case 'lessons':
                this.loadLessonsContent();
                break;
            case 'assessments':
                this.loadAssessmentsContent();
                break;
            case 'progress':
                this.loadProgressContent();
                break;
            case 'teacher':
                this.loadTeacherContent();
                break;
        }
    }
    
    loadDashboardContent() {
        // Update student info
        document.querySelector('.user-name').textContent = this.currentUser.name;
        document.querySelector('.user-level').textContent = `Level ${this.currentUser.level}`;
        
        // Update stats
        document.querySelector('.stat-number').textContent = this.currentUser.completedLessons;
        
        // Continue lesson preview
        const continueLesson = document.querySelector('.continue-card .lesson-title');
        const progressText = document.querySelector('.continue-card .progress-text');
        const progressFill = document.querySelector('.continue-card .progress-fill-small');
        
        if (continueLesson) {
            continueLesson.textContent = 'Adding Big Numbers';
            progressText.textContent = '65% complete';
            progressFill.style.width = '65%';
        }
        
        // Animate progress indicators
        this.animateProgressIndicators();
    }
    
    loadLessonsContent() {
        this.renderLessonsGrid();
    }
    
    loadAssessmentsContent() {
        // Assessments content is already in HTML, just update dynamic parts
        this.updateAssessmentStatus();
    }
    
    loadProgressContent() {
        this.updateProgressDashboard();
    }
    
    renderLessonsGrid() {
        const grid = document.getElementById('lessons-grid');
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.strand || 'all';
        
        grid.innerHTML = '';
        
        // Render lessons from all strands or filtered strand
        Object.keys(this.lessonData).forEach(strandKey => {
            if (activeFilter === 'all' || activeFilter === strandKey) {
                const strandLessons = this.lessonData[strandKey];
                strandLessons.forEach(lesson => {
                    const lessonCard = this.createLessonCard(lesson, strandKey);
                    grid.appendChild(lessonCard);
                });
            }
        });
    }
    
    createLessonCard(lesson, strand) {
        const card = document.createElement('div');
        card.className = `lesson-card ${strand}`;
        card.dataset.lessonId = lesson.id;
        card.dataset.strand = strand;
        
        const statusIcon = lesson.completed ? '✅' : '⭕';
        const statusText = lesson.completed ? 'Completed' : 'Not started';
        const progressWidth = lesson.progress + '%';
        
        card.innerHTML = `
            <div class="lesson-card-header">
                <div class="lesson-card-icon">${lesson.icon}</div>
                <div>
                    <h4 class="lesson-card-title">${lesson.title}</h4>
                    <div class="lesson-status">
                        <span class="status-icon">${statusIcon}</span>
                        <span class="status-text">${statusText}</span>
                    </div>
                </div>
            </div>
            <p class="lesson-card-description">${lesson.description}</p>
            <div class="lesson-card-meta">
                <div class="lesson-meta-item">
                    <span>⏱️</span>
                    <span>${lesson.duration} min</span>
                </div>
                <span class="lesson-difficulty difficulty-${lesson.difficulty}">${lesson.difficulty}</span>
            </div>
            <div class="progress-bar-small">
                <div class="progress-fill-small" style="width: ${progressWidth};"></div>
            </div>
        `;
        
        return card;
    }
    
    filterLessons(strand) {
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-strand="${strand}"]`).classList.add('active');
        
        // Re-render lessons
        this.renderLessonsGrid();
    }
    
    openLesson(strand, lessonId) {
        const lesson = this.lessonData[strand].find(l => l.id === lessonId);
        if (!lesson) return;
        
        const modal = document.getElementById('lesson-modal');
        const content = document.getElementById('lesson-content');
        
        content.innerHTML = this.createLessonContent(lesson, strand);
        modal.classList.remove('hidden');
        
        // Setup lesson navigation
        this.setupLessonNavigation(lesson, strand);
    }
    
    createLessonContent(lesson, strand) {
        return `
            <div class="lesson-container">
                <div class="lesson-header">
                    <div class="lesson-number">Lesson ${lesson.id}</div>
                    <h2 class="lesson-title-large">${lesson.title}</h2>
                    <p class="lesson-objective">Learn to: ${lesson.objectives.join(', ')}</p>
                </div>
                
                <div class="lesson-progress">
                    <div class="progress-step completed">Start</div>
                    <div class="progress-step current">Learn</div>
                    <div class="progress-step upcoming">Practice</div>
                    <div class="progress-step upcoming">Quiz</div>
                    <div class="progress-step upcoming">Complete</div>
                </div>
                
                <div class="lesson-content">
                    <div class="instruction-box">
                        <div class="instruction-title">📚 Learning Objectives</div>
                        <div class="instruction-text">
                            ${lesson.objectives.map(obj => `• ${obj}`).join('<br>')}
                        </div>
                    </div>
                    
                    <div class="interactive-area">
                        <div class="math-problem" id="math-problem">Let's start learning!</div>
                        <div class="answer-options" id="answer-options">
                            <!-- Interactive content will be populated here -->
                        </div>
                        <div class="feedback-area" id="feedback-area"></div>
                    </div>
                </div>
                
                <div class="lesson-navigation">
                    <button class="nav-btn" id="prev-btn" disabled>
                        <span>←</span> Previous
                    </button>
                    <div class="lesson-progress-info">
                        <span>Step 1 of 5</span>
                    </div>
                    <button class="nav-btn nav-btn-primary" id="next-btn">
                        Next <span>→</span>
                    </button>
                </div>
            </div>
        `;
    }
    
    setupLessonNavigation(lesson, strand) {
        const lessonSteps = [
            { title: 'Introduction', content: this.getLessonIntroduction(lesson) },
            { title: 'Learn', content: this.getLessonContent(lesson) },
            { title: 'Practice', content: this.getPracticeProblems(lesson) },
            { title: 'Quiz', content: this.getQuizQuestions(lesson) },
            { title: 'Complete', content: this.getCompletionContent(lesson) }
        ];
        
        let currentStep = 0;
        let progress = lesson.progress;
        
        const updateStep = () => {
            const step = lessonSteps[currentStep];
            const problemElement = document.getElementById('math-problem');
            const optionsElement = document.getElementById('answer-options');
            const feedbackElement = document.getElementById('feedback-area');
            const stepIndicator = document.querySelector('.lesson-progress-info span');
            
            // Update progress indicator
            document.querySelectorAll('.progress-step').forEach((el, index) => {
                el.classList.remove('completed', 'current', 'upcoming');
                if (index < currentStep) {
                    el.classList.add('completed');
                } else if (index === currentStep) {
                    el.classList.add('current');
                } else {
                    el.classList.add('upcoming');
                }
            });
            
            stepIndicator.textContent = `Step ${currentStep + 1} of ${lessonSteps.length}`;
            
            // Update content
            if (step.content.type === 'introduction') {
                problemElement.innerHTML = step.content.problem;
                optionsElement.innerHTML = '';
                feedbackElement.innerHTML = '';
            } else if (step.content.type === 'content') {
                problemElement.innerHTML = step.content.problem;
                optionsElement.innerHTML = step.content.options.map((option, index) => 
                    `<button class="answer-btn" data-answer="${index}">${option}</button>`
                ).join('');
                feedbackElement.innerHTML = '';
                
                // Setup answer button handlers
                optionsElement.querySelectorAll('.answer-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const answer = parseInt(e.target.dataset.answer);
                        const correct = step.content.correct;
                        
                        // Remove previous selections
                        optionsElement.querySelectorAll('.answer-btn').forEach(b => {
                            b.classList.remove('selected', 'correct', 'incorrect');
                        });
                        
                        // Mark selection
                        e.target.classList.add('selected');
                        
                        if (answer === correct) {
                            e.target.classList.add('correct');
                            feedbackElement.innerHTML = `
                                <div class="feedback-correct">
                                    ✅ Excellent! ${step.content.explanation}
                                </div>
                            `;
                            progress = Math.min(100, progress + 25);
                        } else {
                            e.target.classList.add('incorrect');
                            feedbackElement.innerHTML = `
                                <div class="feedback-incorrect">
                                    ❌ Not quite right. ${step.content.explanation}
                                </div>
                            `;
                        }
                    });
                });
            } else if (step.content.type === 'quiz') {
                problemElement.innerHTML = step.content.question;
                optionsElement.innerHTML = step.content.options.map((option, index) => 
                    `<button class="answer-btn" data-answer="${index}">${option}</button>`
                ).join('');
                feedbackElement.innerHTML = '';
            } else if (step.content.type === 'completion') {
                problemElement.innerHTML = step.content.message;
                optionsElement.innerHTML = '';
                feedbackElement.innerHTML = step.content.celebration;
            }
            
            // Update navigation buttons
            document.getElementById('prev-btn').disabled = currentStep === 0;
            document.getElementById('next-btn').textContent = 
                currentStep === lessonSteps.length - 1 ? 'Finish Lesson' : 'Next →';
        };
        
        // Navigation handlers
        document.getElementById('prev-btn').addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateStep();
            }
        });
        
        document.getElementById('next-btn').addEventListener('click', () => {
            if (currentStep < lessonSteps.length - 1) {
                currentStep++;
                
                // Update lesson progress
                lesson.progress = Math.min(100, lesson.progress + 20);
                
                // Check if lesson is complete
                if (currentStep === lessonSteps.length - 1) {
                    lesson.completed = true;
                    this.currentUser.totalPoints += 50;
                    this.showCompletionCelebration(lesson);
                }
                
                updateStep();
            } else {
                this.closeModal();
                this.updateDashboardStats();
            }
        });
        
        // Initialize
        updateStep();
    }
    
    getLessonIntroduction(lesson) {
        return {
            type: 'introduction',
            problem: `
                <h3>Welcome to ${lesson.title}! 🌟</h3>
                <p>In this lesson, you will:</p>
                <ul>
                    ${lesson.objectives.map(obj => `<li>✅ ${obj}</li>`).join('')}
                </ul>
                <p><strong>Duration:</strong> ${lesson.duration} minutes</p>
                <p>Let's begin this exciting learning journey!</p>
            `
        };
    }
    
    getLessonContent(lesson) {
        const contentMap = {
            'num-001': {
                problem: '<h3>🔢 Counting to 1000</h3><p>Let's count together! Start from 1 and count to 10:</p><p style="font-size: 24px; text-align: center; margin: 20px 0;">1, 2, 3, 4, 5, 6, 7, 8, 9, 10</p><p>Great! Now can you count from 1 to 20?</p>',
                options: ['I can do it!', 'Let me practice more', 'Show me the pattern'],
                correct: 0,
                explanation: 'Wonderful! You\'re ready to count to 1000. Remember: the pattern increases by 1 each time.'
            },
            'num-002': {
                problem: '<h3>📊 Place Value Understanding</h3><p>Look at this number: <strong>2,345</strong></p><p>The place values are:</p><ul><li><strong>2</strong> = Thousands place</li><li><strong>3</strong> = Hundreds place</li><li><strong>4</strong> = Tens place</li><li><strong>5</strong> = Ones place</li></ul><p>What digit is in the hundreds place?</p>',
                options: ['2', '3', '4', '5'],
                correct: 1,
                explanation: 'Correct! The hundreds place is the third digit from the right, which is 3.'
            },
            'alg-001': {
                problem: '<h3>🔗 Number Patterns</h3><p>Look at this pattern: <strong>2, 4, 6, 8, ___</strong></p><p>What comes next?</p>',
                options: ['9', '10', '11', '12'],
                correct: 1,
                explanation: 'Great! The pattern increases by 2 each time: 2, 4, 6, 8, 10'
            },
            'geo-001': {
                problem: '<h3>⭕ 2D Shapes Identification</h3><p>Can you identify these shapes?</p><div style="font-size: 60px; text-align: center; margin: 20px 0;">⭕ 🔺 🔲</div><p>How many sides does a triangle have?</p>',
                options: ['2 sides', '3 sides', '4 sides', '5 sides'],
                correct: 1,
                explanation: 'Excellent! A triangle has exactly 3 sides and 3 corners.'
            }
        };
        
        return {
            type: 'content',
            ...contentMap[lesson.id] || {
                problem: '<h3>Learning Content</h3><p>Interactive learning content for this lesson will appear here.</p>',
                options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                correct: 0,
                explanation: 'This is a sample explanation.'
            }
        };
    }
    
    getPracticeProblems(lesson) {
        return {
            type: 'content',
            problem: '<h3>🎯 Practice Time!</h3><p>Now let\'s practice what you learned. Answer this question:</p><p style="font-size: 20px; text-align: center; margin: 20px 0;"><strong>15 + 27 = ?</strong></p>',
            options: ['42', '41', '43', '40'],
            correct: 0,
            explanation: 'Perfect! 15 + 27 = 42. You can add the tens first: 10 + 20 = 30, then the ones: 5 + 7 = 12, so 30 + 12 = 42.'
        };
    }
    
    getQuizQuestions(lesson) {
        return {
            type: 'quiz',
            question: '<h3>🧠 Quick Quiz!</h3><p style="font-size: 18px;">What is 50 + 30?</p>',
            options: ['70', '80', '90', '60'],
            correct: 1
        };
    }
    
    getCompletionContent(lesson) {
        return {
            type: 'completion',
            message: '<h3>🎉 Congratulations!</h3><p>You have completed the lesson: <strong>' + lesson.title + '</strong></p>',
            celebration: `
                <div style="text-align: center; font-size: 80px; animation: pulse 2s infinite;">🎉</div>
                <div style="background: linear-gradient(45deg, #FFC02D, #F2A900); color: white; padding: 20px; border-radius: 16px; text-align: center;">
                    <h4>🏆 Achievement Unlocked!</h4>
                    <p>+50 Points Earned</p>
                    <p>Keep up the excellent work!</p>
                </div>
            `
        };
    }
    
    showCompletionCelebration(lesson) {
        // Update lesson in data
        lesson.completed = true;
        lesson.progress = 100;
        
        // Show confetti effect (simple version)
        this.createConfettiEffect();
        
        // Update global stats
        this.currentUser.completedLessons++;
        this.updateDashboardStats();
    }
    
    createConfettiEffect() {
        const colors = ['#FFC02D', '#3B82F6', '#EC4899', '#8B5CF6', '#10B981'];
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                animation: confetti-fall ${1 + Math.random()}s linear forwards;
            `;
            confettiContainer.appendChild(confetti);
        }
        
        document.body.appendChild(confettiContainer);
        
        setTimeout(() => {
            document.body.removeChild(confettiContainer);
        }, 3000);
    }
    
    updateDashboardStats() {
        // Update stat numbers
        document.querySelector('.stat-number').textContent = this.currentUser.completedLessons;
        
        // Update strand progress
        this.animateProgressIndicators();
    }
    
    animateProgressIndicators() {
        const progressBars = document.querySelectorAll('.progress-fill, .progress-fill-small, .progress-fill-detailed');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
        
        const circularProgress = document.querySelectorAll('.progress-fill, .progress-fill-large');
        circularProgress.forEach(circle => {
            const dashArray = circle.style.strokeDasharray;
            circle.style.strokeDasharray = '0 408';
            setTimeout(() => {
                circle.style.strokeDasharray = dashArray;
            }, 200);
        });
    }
    
    closeModal() {
        document.getElementById('lesson-modal').classList.add('hidden');
    }
    
    updateAssessmentStatus() {
        // Quick quiz status
        const quickQuizCard = document.querySelector('.assessment-card');
        const isCompleted = this.assessmentData.quickQuiz.completed;
        const statusText = quickQuizCard.querySelector('.card-description');
        
        if (isCompleted) {
            statusText.textContent = 'Great job! Try tomorrow\'s new quiz';
        }
    }
    
    updateProgressDashboard() {
        const progress = this.progressData.overall;
        
        // Update overall progress circle
        const circumference = 2 * Math.PI * 65; // radius = 65
        const progressLength = (progress.completion / 100) * circumference;
        const progressFill = document.querySelector('.progress-fill-large');
        if (progressFill) {
            progressFill.style.strokeDasharray = `${progressLength} ${circumference}`;
        }
        
        // Update percentage text
        const percentageElement = document.querySelector('.progress-percentage-large');
        if (percentageElement) {
            percentageElement.textContent = progress.completion + '%';
        }
        
        // Update detailed progress bars
        const strandProgressItems = document.querySelectorAll('.strand-progress-item');
        strandProgressItems.forEach((item, index) => {
            const strandKeys = Object.keys(this.progressData.strands);
            const strandKey = strandKeys[index];
            if (strandKey) {
                const strandData = this.progressData.strands[strandKey];
                const progressFill = item.querySelector('.progress-fill-detailed');
                const completionText = item.querySelector('.strand-completion');
                
                if (progressFill) {
                    progressFill.style.width = strandData.completion + '%';
                }
                
                if (completionText) {
                    completionText.textContent = `${strandData.completedLessons}/${strandData.totalLessons} lessons (${strandData.completion}%)`;
                }
            }
        });
    }
    
    // Teacher Module Functions
    initializeTeacherMode() {
        this.teacherData = {
            currentClass: {
                name: 'Class 4A',
                totalStudents: 25,
                activeStudents: 18,
                averageProgress: 67,
                lessonsCompleted: 156
            },
            students: this.generateStudentData()
        };
    }
    
    generateStudentData() {
        const studentNames = [
            'Amina', 'Kwame', 'Fatima', 'Kojo', 'Asha', 'Yaw', 'Mariam', 'Samuel',
            'Zainab', 'Emmanuel', 'Hawa', 'David', 'Ruth', 'Joseph', 'Grace',
            'Isaac', 'Mercy', 'Peter', 'Joyce', 'Paul', 'Rebecca', 'John', 'Mary', 'Stephen', 'Elizabeth'
        ];
        
        return studentNames.map((name, index) => ({
            id: `student-${index + 1}`,
            name: name,
            progress: Math.floor(Math.random() * 40) + 60, // 60-100%
            status: index < 18 ? 'online' : 'offline',
            points: Math.floor(Math.random() * 500) + 800,
            lastActivity: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString().split('T')[0]
        }));
    }
    
    setupTeacherEventListeners() {
        // Teacher mode will be accessible via a special button or key combination
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                this.toggleTeacherMode();
            }
        });
    }
    
    toggleTeacherMode() {
        const teacherNavItem = document.createElement('button');
        teacherNavItem.className = 'nav-item';
        teacherNavItem.dataset.section = 'teacher';
        teacherNavItem.innerHTML = `
            <span class="nav-icon">👩‍🏫</span>
            <span class="nav-label">Teacher</span>
        `;
        
        document.querySelector('.nav-menu').appendChild(teacherNavItem);
        this.setupEventListeners();
        
        this.showNotification('Teacher mode activated! Use Ctrl+Shift+T to toggle.', 'success');
    }
    
    loadTeacherContent() {
        const teacherContent = `
            <div class="section-header">
                <h1 class="section-title">Teacher Dashboard</h1>
                <p class="section-subtitle">Monitor student progress and manage your class</p>
            </div>
            
            <div class="teacher-dashboard">
                <div class="class-overview">
                    <h3 class="card-title">Class Overview</h3>
                    <div class="class-stats">
                        <div class="class-stat-item">
                            <div class="class-stat-icon">👥</div>
                            <div class="class-stat-content">
                                <span class="class-stat-number">${this.teacherData.currentClass.totalStudents}</span>
                                <span class="class-stat-label">Total Students</span>
                            </div>
                        </div>
                        <div class="class-stat-item">
                            <div class="class-stat-icon">🟢</div>
                            <div class="class-stat-content">
                                <span class="class-stat-number">${this.teacherData.currentClass.activeStudents}</span>
                                <span class="class-stat-label">Active Now</span>
                            </div>
                        </div>
                        <div class="class-stat-item">
                            <div class="class-stat-icon">📊</div>
                            <div class="class-stat-content">
                                <span class="class-stat-number">${this.teacherData.currentClass.averageProgress}%</span>
                                <span class="class-stat-label">Class Average</span>
                            </div>
                        </div>
                        <div class="class-stat-item">
                            <div class="class-stat-icon">🎯</div>
                            <div class="class-stat-content">
                                <span class="class-stat-number">${this.teacherData.currentClass.lessonsCompleted}</span>
                                <span class="class-stat-label">Lessons Completed</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="student-list">
                    <h3 class="card-title">Student Progress</h3>
                    <div class="student-list-container">
                        ${this.teacherData.students.map(student => `
                            <div class="student-item">
                                <div class="student-info">
                                    <div class="student-avatar">${student.name[0]}</div>
                                    <div class="student-details">
                                        <div class="student-name">${student.name}</div>
                                        <div class="student-progress">${student.progress}% complete • ${student.points} points</div>
                                    </div>
                                </div>
                                <div class="student-status status-${student.status}">
                                    <span>●</span>
                                    <span>${student.status === 'online' ? 'Online' : 'Offline'}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        const section = document.getElementById('teacher-section');
        if (section) {
            section.innerHTML = teacherContent;
        } else {
            // Create teacher section if it doesn't exist
            const teacherSection = document.createElement('section');
            teacherSection.id = 'teacher-section';
            teacherSection.className = 'content-section';
            teacherSection.innerHTML = teacherContent;
            document.querySelector('.app-container').appendChild(teacherSection);
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#22C55E' : '#3B82F6'};
            color: white;
            padding: 16px 24px;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    openStrandLessons(strand) {
        // Switch to lessons section and filter by strand
        this.navigateToSection('lessons');
        this.filterLessons(strand);
    }
    
    continueLastLesson() {
        // Find the lesson with highest progress that's not complete
        let lastLesson = null;
        let highestProgress = 0;
        
        Object.values(this.lessonData).flat().forEach(lesson => {
            if (!lesson.completed && lesson.progress > highestProgress) {
                highestProgress = lesson.progress;
                lastLesson = lesson;
            }
        });
        
        if (lastLesson) {
            const strandKey = Object.keys(this.lessonData).find(key => 
                this.lessonData[key].some(l => l.id === lastLesson.id)
            );
            this.openLesson(strandKey, lastLesson.id);
        } else {
            // Start first incomplete lesson
            const firstIncomplete = Object.values(this.lessonData).flat().find(l => !l.completed);
            if (firstIncomplete) {
                const strandKey = Object.keys(this.lessonData).find(key => 
                    this.lessonData[key].some(l => l.id === firstIncomplete.id)
                );
                this.openLesson(strandKey, firstIncomplete.id);
            }
        }
    }
    
    startAssessment(type, assessmentId) {
        if (type === 'quick') {
            this.showNotification('Starting quick quiz...', 'success');
            // Implementation for quick quiz would go here
        } else {
            this.showNotification('Starting assessment...', 'success');
            // Implementation for strand assessment would go here
        }
    }
    
    loadInitialContent() {
        // Initialize content based on current section
        this.loadDashboardContent();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gmlsApp = new GMLSApp();
});

// Add CSS for confetti and notifications
const additionalStyles = `
    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .class-stats {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
    }
    
    .class-stat-item {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        padding: var(--space-sm);
        background: var(--bg-page);
        border-radius: var(--radius-sm);
    }
    
    .class-stat-icon {
        font-size: 24px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-100);
        border-radius: var(--radius-sm);
    }
    
    .class-stat-content {
        flex: 1;
    }
    
    .class-stat-number {
        display: block;
        font-size: 20px;
        font-weight: 700;
        color: var(--primary-700);
    }
    
    .class-stat-label {
        font-size: 14px;
        color: var(--text-secondary);
    }
    
    .student-list-container {
        max-height: 500px;
        overflow-y: auto;
    }
`;

// Add the styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
```

### FILE: scripts/assessments.js
```javascript
// Golden Mathematics Class 4 - Assessments Module
class AssessmentsModule {
    constructor(app) {
        this.app = app;
        this.currentAssessment = null;
        this.assessmentTypes = {
            'quick-quiz': {
                name: 'Quick Quiz',
                timeLimit: 5,
                totalQuestions: 5,
                points: 25
            },
            'number-operations': {
                name: 'Number Operations Test',
                timeLimit: 30,
                totalQuestions: 15,
                points: 75
            },
            'algebra': {
                name: 'Algebra Patterns Test',
                timeLimit: 20,
                totalQuestions: 10,
                points: 50
            },
            'geometry': {
                name: 'Geometry Test',
                timeLimit: 25,
                totalQuestions: 12,
                points: 60
            },
            'data-handling': {
                name: 'Data Handling Test',
                timeLimit: 20,
                totalQuestions: 10,
                points: 50
            }
        };
    }
    
    startAssessment(assessmentType, assessmentId = null) {
        const assessment = this.assessmentTypes[assessmentType] || this.assessmentTypes['quick-quiz'];
        
        if (assessmentId) {
            const detailedAssessment = this.getAssessmentDetails(assessmentType, assessmentId);
            Object.assign(assessment, detailedAssessment);
        }
        
        this.currentAssessment = {
            type: assessmentType,
            data: assessment,
            questions: this.generateQuestions(assessmentType),
            currentQuestion: 0,
            answers: [],
            startTime: Date.now(),
            isCompleted: false
        };
        
        this.showAssessmentInterface();
    }
    
    getAssessmentDetails(type, id) {
        const detailedAssessments = {
            'quick-quiz': {
                id: 'quick-001',
                title: 'Daily Quick Quiz',
                description: 'Practice today\'s lessons',
                completed: false,
                score: null
            },
            'number-operations': {
                id: 'num-assess-001',
                title: 'Number Operations Test',
                description: 'Comprehensive test on number operations',
                completed: true,
                score: 85
            },
            'geometry': {
                id: 'geo-assess-001',
                title: 'Geometry Shapes Quiz',
                description: 'Identify 2D and 3D shapes',
                completed: false,
                score: null
            }
        };
        
        return detailedAssessments[type] || {};
    }
    
    generateQuestions(assessmentType) {
        const questionBanks = {
            'quick-quiz': this.getQuickQuizQuestions(),
            'number-operations': this.getNumberOperationsQuestions(),
            'algebra': this.getAlgebraQuestions(),
            'geometry': this.getGeometryQuestions(),
            'data-handling': this.getDataHandlingQuestions()
        };
        
        return questionBanks[assessmentType] || [];
    }
    
    getQuickQuizQuestions() {
        return [
            {
                id: 1,
                question: 'What comes after 999?',
                options: ['1000', '999', '1001', '9999'],
                correct: 0,
                explanation: 'After 999 comes 1000, which is one thousand.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 2,
                question: 'In the number 2,345, what digit is in the hundreds place?',
                options: ['2', '3', '4', '5'],
                correct: 1,
                explanation: 'In 2,345, the hundreds place has the digit 3.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 3,
                question: 'What shape has 3 sides?',
                options: ['Square', 'Triangle', 'Circle', 'Rectangle'],
                correct: 1,
                explanation: 'A triangle has exactly 3 sides and 3 corners.',
                difficulty: 'easy',
                strand: 'geometry'
            },
            {
                id: 4,
                question: 'Complete the pattern: 2, 4, 6, 8, ___',
                options: ['9', '10', '11', '12'],
                correct: 1,
                explanation: 'This pattern increases by 2 each time: 2, 4, 6, 8, 10',
                difficulty: 'easy',
                strand: 'algebra'
            },
            {
                id: 5,
                question: '25 + 18 = ?',
                options: ['43', '42', '44', '41'],
                correct: 0,
                explanation: '25 + 18 = 43. You can add 20 + 10 = 30, then 5 + 8 = 13, so 30 + 13 = 43.',
                difficulty: 'medium',
                strand: 'number-operations'
            }
        ];
    }
    
    getNumberOperationsQuestions() {
        return [
            {
                id: 1,
                question: 'What is the place value of 5 in 3,456?',
                options: ['Ones', 'Tens', 'Hundreds', 'Thousands'],
                correct: 1,
                explanation: 'In 3,456, the 5 is in the tens place.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 2,
                question: 'Calculate: 456 + 289',
                options: ['735', '745', '725', '755'],
                correct: 1,
                explanation: '456 + 289 = 745. Add: 400 + 200 = 600, 50 + 80 = 130, 6 + 9 = 15, so 600 + 130 + 15 = 745.',
                difficulty: 'medium',
                strand: 'number-operations'
            },
            {
                id: 3,
                question: 'Which number is greater: 1,234 or 1,243?',
                options: ['1,234', '1,243', 'They are equal', 'Cannot be determined'],
                correct: 1,
                explanation: '1,243 is greater than 1,234 because 243 > 234.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 4,
                question: 'What is 800 - 347?',
                options: ['453', '463', '443', '473'],
                correct: 0,
                explanation: '800 - 347 = 453. You can borrow: 800 - 300 = 500, then 500 - 47 = 453.',
                difficulty: 'medium',
                strand: 'number-operations'
            },
            {
                id: 5,
                question: 'Count by 5s: 5, 10, 15, __, 25',
                options: ['18', '20', '22', '24'],
                correct: 1,
                explanation: 'The pattern is counting by 5s, so the missing number is 20.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 6,
                question: 'What is 6 × 4?',
                options: ['20', '24', '26', '28'],
                correct: 1,
                explanation: '6 × 4 = 24. You can think of it as 6 + 6 + 6 + 6 = 24.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 7,
                question: 'Round 456 to the nearest hundred',
                options: ['400', '450', '500', '460'],
                correct: 2,
                explanation: '456 rounds to 500 because 456 is closer to 500 than to 400.',
                difficulty: 'medium',
                strand: 'number-operations'
            },
            {
                id: 8,
                question: 'Which number is odd?',
                options: ['246', '358', '479', '682'],
                correct: 2,
                explanation: '479 is odd because it ends with 9, which is an odd digit.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 9,
                question: 'What comes next: 100, 200, 300, __',
                options: ['350', '400', '450', '500'],
                correct: 1,
                explanation: 'The pattern increases by 100 each time, so the next number is 400.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 10,
                question: 'If you have 12 pencils and give away 5, how many are left?',
                options: ['5', '6', '7', '8'],
                correct: 2,
                explanation: '12 - 5 = 7 pencils are left.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 11,
                question: 'What is the value of the digit 7 in 2,738?',
                options: ['7', '70', '700', '7,000'],
                correct: 1,
                explanation: 'The digit 7 is in the tens place, so its value is 70.',
                difficulty: 'medium',
                strand: 'number-operations'
            },
            {
                id: 12,
                question: 'Complete: 500 + __ = 750',
                options: ['200', '250', '300', '350'],
                correct: 1,
                explanation: '500 + 250 = 750, so the missing number is 250.',
                difficulty: 'medium',
                strand: 'number-operations'
            },
            {
                id: 13,
                question: 'Which number is between 1,234 and 1,245?',
                options: ['1,233', '1,236', '1,230', '1,250'],
                correct: 1,
                explanation: '1,236 is between 1,234 and 1,245.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 14,
                question: 'What is 9 × 7?',
                options: ['56', '63', '72', '81'],
                correct: 1,
                explanation: '9 × 7 = 63. You can use the 9 times table or think of it as (10 × 7) - 7 = 70 - 7 = 63.',
                difficulty: 'medium',
                strand: 'number-operations'
            },
            {
                id: 15,
                question: 'If a book costs 345 cedis and you pay with 500 cedis, how much change do you get?',
                options: ['145 cedis', '155 cedis', '165 cedis', '175 cedis'],
                correct: 1,
                explanation: '500 - 345 = 155 cedis change.',
                difficulty: 'medium',
                strand: 'number-operations'
            }
        ];
    }
    
    getAlgebraQuestions() {
        return [
            {
                id: 1,
                question: 'What comes next: Circle, Square, Circle, Square, __',
                options: ['Triangle', 'Circle', 'Square', 'Star'],
                correct: 1,
                explanation: 'The pattern alternates between circle and square, so the next shape is a circle.',
                difficulty: 'easy',
                strand: 'algebra'
            },
            {
                id: 2,
                question: 'Complete the pattern: A, B, C, A, B, C, __',
                options: ['A', 'B', 'C', 'D'],
                correct: 0,
                explanation: 'The pattern repeats A, B, C, so the next letter is A.',
                difficulty: 'easy',
                strand: 'algebra'
            },
            {
                id: 3,
                question: 'If 2 + 3 = 5, then what does 20 + 30 equal?',
                options: ['50', '53', '23', '32'],
                correct: 0,
                explanation: 'The pattern shows that when both numbers are multiplied by 10, the answer is also multiplied by 10.',
                difficulty: 'medium',
                strand: 'algebra'
            },
            {
                id: 4,
                question: 'Look at this pattern: 🔴🔵🔴🔵🔴__',
                options: ['🔴', '🔵', '🟡', '⚫'],
                correct: 1,
                explanation: 'The pattern alternates between red and blue circles.',
                difficulty: 'easy',
                strand: 'algebra'
            },
            {
                id: 5,
                question: 'If △ = 3 and ○ = 5, what is △ + ○?',
                options: ['7', '8', '9', '6'],
                correct: 1,
                explanation: '△ + ○ = 3 + 5 = 8.',
                difficulty: 'medium',
                strand: 'algebra'
            },
            {
                id: 6,
                question: 'Complete: 5, 10, 15, 20, __',
                options: ['22', '24', '25', '30'],
                correct: 2,
                explanation: 'The pattern increases by 5 each time, so the next number is 25.',
                difficulty: 'easy',
                strand: 'algebra'
            },
            {
                id: 7,
                question: 'If the scale is balanced with 2 apples on one side and 4 oranges on the other, what does 1 apple equal?',
                options: ['1 orange', '2 oranges', '3 oranges', '4 oranges'],
                correct: 1,
                explanation: 'If 2 apples = 4 oranges, then 1 apple = 2 oranges.',
                difficulty: 'medium',
                strand: 'algebra'
            },
            {
                id: 8,
                question: 'Pattern: 1, 4, 9, 16, __ (What are the square numbers?)',
                options: ['20', '25', '30', '36'],
                correct: 1,
                explanation: 'This sequence shows perfect squares: 1², 2², 3², 4², 5², so the next is 25.',
                difficulty: 'hard',
                strand: 'algebra'
            },
            {
                id: 9,
                question: 'If A = 3 and B = 6, what is A + A + B?',
                options: ['9', '12', '15', '18'],
                correct: 1,
                explanation: 'A + A + B = 3 + 3 + 6 = 12.',
                difficulty: 'easy',
                strand: 'algebra'
            },
            {
                id: 10,
                question: 'Pattern: 2, 4, 8, 16, __ (Each number is doubled)',
                options: ['24', '28', '30', '32'],
                correct: 3,
                explanation: 'Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32.',
                difficulty: 'medium',
                strand: 'algebra'
            }
        ];
    }
    
    getGeometryQuestions() {
        return [
            {
                id: 1,
                question: 'How many sides does a triangle have?',
                options: ['2', '3', '4', '5'],
                correct: 1,
                explanation: 'A triangle has exactly 3 sides and 3 corners.',
                difficulty: 'easy',
                strand: 'geometry'
            },
            {
                id: 2,
                question: 'Which shape has all sides equal and all angles equal?',
                options: ['Rectangle', 'Square', 'Triangle', 'Circle'],
                correct: 1,
                explanation: 'A square has 4 equal sides and 4 equal right angles.',
                difficulty: 'easy',
                strand: 'geometry'
            },
            {
                id: 3,
                question: 'How many corners does a cube have?',
                options: ['6', '8', '10', '12'],
                correct: 1,
                explanation: 'A cube has 8 corners (vertices) where 3 edges meet.',
                difficulty: 'medium',
                strand: 'geometry'
            },
            {
                id: 4,
                question: 'Which 3D shape can roll easily?',
                options: ['Cube', 'Cylinder', 'Cone', 'Pyramid'],
                correct: 1,
                explanation: 'A cylinder can roll easily because it has curved surfaces.',
                difficulty: 'easy',
                strand: 'geometry'
            },
            {
                id: 5,
                question: 'How many faces does a cylinder have?',
                options: ['2', '3', '4', '5'],
                correct: 1,
                explanation: 'A cylinder has 3 faces: 2 circles and 1 curved surface.',
                difficulty: 'medium',
                strand: 'geometry'
            },
            {
                id: 6,
                question: 'Which shape has no corners?',
                options: ['Square', 'Triangle', 'Circle', 'Rectangle'],
                correct: 2,
                explanation: 'A circle has no corners or straight sides.',
                difficulty: 'easy',
                strand: 'geometry'
            },
            {
                id: 7,
                question: 'If you cut a rectangle diagonally, how many triangles do you get?',
                options: ['1', '2', '3', '4'],
                correct: 1,
                explanation: 'A diagonal cut splits a rectangle into 2 triangles.',
                difficulty: 'medium',
                strand: 'geometry'
            },
            {
                id: 8,
                question: 'How many edges does a triangular pyramid have?',
                options: ['4', '6', '8', '12'],
                correct: 1,
                explanation: 'A triangular pyramid has 6 edges connecting the 4 vertices.',
                difficulty: 'hard',
                strand: 'geometry'
            },
            {
                id: 9,
                question: 'Which shape has exactly 6 sides?',
                options: ['Pentagon', 'Hexagon', 'Heptagon', 'Octagon'],
                correct: 1,
                explanation: 'A hexagon has exactly 6 sides.',
                difficulty: 'easy',
                strand: 'geometry'
            },
            {
                id: 10,
                question: 'If you fold a square along its diagonal, what shape do you get?',
                options: ['2 squares', '2 rectangles', '2 triangles', '4 triangles'],
                correct: 2,
                explanation: 'Folding a square along the diagonal creates 2 right-angled triangles.',
                difficulty: 'medium',
                strand: 'geometry'
            },
            {
                id: 11,
                question: 'How many sides does a pentagon have?',
                options: ['4', '5', '6', '7'],
                correct: 1,
                explanation: 'A pentagon has exactly 5 sides.',
                difficulty: 'easy',
                strand: 'geometry'
            },
            {
                id: 12,
                question: 'Which 3D shape has only one vertex?',
                options: ['Cube', 'Sphere', 'Cone', 'Cylinder'],
                correct: 2,
                explanation: 'A cone has exactly one vertex (pointed end).',
                difficulty: 'hard',
                strand: 'geometry'
            }
        ];
    }
    
    getDataHandlingQuestions() {
        return [
            {
                id: 1,
                question: 'What is the best way to show favorite colors of students?',
                options: ['List', 'Bar graph', 'Number line', 'Table'],
                correct: 1,
                explanation: 'A bar graph is excellent for comparing categories like favorite colors.',
                difficulty: 'easy',
                strand: 'data-handling'
            },
            {
                id: 2,
                question: 'In a bar graph, if Red has 8 blocks and Blue has 12 blocks, which color is more popular?',
                options: ['Red', 'Blue', 'They are equal', 'Cannot tell'],
                correct: 1,
                explanation: 'Blue has 12 blocks, which is more than Red\'s 8 blocks.',
                difficulty: 'easy',
                strand: 'data-handling'
            },
            {
                id: 3,
                question: 'How many students like apples if the graph shows: Apples: 15, Bananas: 10, Oranges: 8?',
                options: ['8', '10', '15', '33'],
                correct: 2,
                explanation: 'The bar for apples reaches 15, so 15 students like apples.',
                difficulty: 'easy',
                strand: 'data-handling'
            },
            {
                id: 4,
                question: 'What type of graph shows data over time?',
                options: ['Bar graph', 'Line graph', 'Pie chart', 'Table'],
                correct: 1,
                explanation: 'A line graph is best for showing how data changes over time.',
                difficulty: 'medium',
                strand: 'data-handling'
            },
            {
                id: 5,
                question: 'If 20 students were surveyed about their pets, and the graph shows: Dogs: 8, Cats: 6, Birds: 4, Fish: 2, how many students have pets?',
                options: ['10', '15', '20', '18'],
                correct: 2,
                explanation: 'Adding all the numbers: 8 + 6 + 4 + 2 = 20 students.',
                difficulty: 'medium',
                strand: 'data-handling'
            },
            {
                id: 6,
                question: 'What should be the title of a graph showing favorite sports?',
                options: ['Student Names', 'Favorite Sports of Our Class', 'School Colors', 'Test Scores'],
                correct: 1,
                explanation: 'The title should clearly describe what the graph is showing.',
                difficulty: 'easy',
                strand: 'data-handling'
            },
            {
                id: 7,
                question: 'In a pictograph where each icon represents 2 students, if you see 6 icons for mathematics, how many students chose mathematics?',
                options: ['6', '8', '12', '16'],
                correct: 2,
                explanation: '6 icons × 2 students per icon = 12 students.',
                difficulty: 'medium',
                strand: 'data-handling'
            },
            {
                id: 8,
                question: 'What is the range of these test scores: 65, 78, 82, 90, 95?',
                options: ['15', '20', '25', '30'],
                correct: 2,
                explanation: 'Range = highest score - lowest score = 95 - 65 = 30.',
                difficulty: 'hard',
                strand: 'data-handling'
            },
            {
                id: 9,
                question: 'Which measure tells us the most common value in a data set?',
                options: ['Mean', 'Median', 'Mode', 'Range'],
                correct: 2,
                explanation: 'Mode is the value that appears most frequently in a data set.',
                difficulty: 'medium',
                strand: 'data-handling'
            },
            {
                id: 10,
                question: 'If you flip a coin 10 times and get 6 heads and 4 tails, what fraction of flips were heads?',
                options: ['4/10', '6/10', '4/6', '6/4'],
                correct: 1,
                explanation: '6 heads out of 10 total flips = 6/10.',
                difficulty: 'medium',
                strand: 'data-handling'
            }
        ];
    }
    
    showAssessmentInterface() {
        const modal = document.getElementById('lesson-modal');
        const content = document.getElementById('lesson-content');
        
        content.innerHTML = this.createAssessmentInterface();
        modal.classList.remove('hidden');
        
        this.setupAssessmentInterface();
    }
    
    createAssessmentInterface() {
        const assessment = this.currentAssessment;
        const progress = ((assessment.currentQuestion + 1) / assessment.questions.length) * 100;
        
        return `
            <div class="assessment-container">
                <div class="assessment-header">
                    <h2 class="assessment-title">${assessment.data.name}</h2>
                    <div class="assessment-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span class="progress-text">Question ${assessment.currentQuestion + 1} of ${assessment.questions.length}</span>
                    </div>
                    <div class="assessment-timer" id="assessment-timer">
                        <span class="timer-icon">⏱️</span>
                        <span class="timer-text">${assessment.data.timeLimit}:00</span>
                    </div>
                </div>
                
                <div class="assessment-question" id="assessment-question">
                    ${this.createQuestionDisplay()}
                </div>
                
                <div class="assessment-navigation">
                    <button class="nav-btn" id="prev-question" ${assessment.currentQuestion === 0 ? 'disabled' : ''}>
                        ← Previous
                    </button>
                    <div class="question-indicator">
                        ${this.createQuestionIndicator()}
                    </div>
                    <button class="nav-btn nav-btn-primary" id="next-question">
                        ${assessment.currentQuestion === assessment.questions.length - 1 ? 'Finish Assessment' : 'Next →'}
                    </button>
                </div>
            </div>
        `;
    }
    
    createQuestionDisplay() {
        const question = this.currentAssessment.questions[this.currentAssessment.currentQuestion];
        
        return `
            <div class="question-content">
                <div class="question-header">
                    <span class="question-number">Question ${this.currentAssessment.currentQuestion + 1}</span>
                    <span class="question-difficulty difficulty-${question.difficulty}">${question.difficulty}</span>
                    <span class="question-strand">${this.getStrandDisplay(question.strand)}</span>
                </div>
                
                <h3 class="question-text">${question.question}</h3>
                
                <div class="answer-options">
                    ${question.options.map((option, index) => `
                        <button class="answer-option ${this.currentAssessment.answers[this.currentAssessment.currentQuestion] === index ? 'selected' : ''}" 
                                data-answer="${index}">
                            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                            <span class="option-text">${option}</span>
                        </button>
                    `).join('')}
                </div>
                
                ${this.currentAssessment.answers[this.currentAssessment.currentQuestion] !== undefined ? 
                    this.createFeedbackDisplay(question) : ''}
            </div>
        `;
    }
    
    createFeedbackDisplay(question) {
        const userAnswer = this.currentAssessment.answers[this.currentAssessment.currentQuestion];
        const isCorrect = userAnswer === question.correct;
        
        return `
            <div class="question-feedback ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
                <div class="feedback-content">
                    <div class="feedback-title">${isCorrect ? 'Correct!' : 'Incorrect'}</div>
                    <div class="feedback-explanation">${question.explanation}</div>
                    ${!isCorrect ? `<div class="correct-answer">The correct answer is: ${question.options[question.correct]}</div>` : ''}
                </div>
            </div>
        `;
    }
    
    createQuestionIndicator() {
        const total = this.currentAssessment.questions.length;
        const current = this.currentAssessment.currentQuestion;
        
        return `
            <div class="question-dots">
                ${Array.from({length: total}, (_, i) => `
                    <span class="question-dot ${i === current ? 'current' : ''} ${this.currentAssessment.answers[i] !== undefined ? 'answered' : ''}"></span>
                `).join('')}
            </div>
        `;
    }
    
    getStrandDisplay(strand) {
        const strandMap = {
            'number-operations': 'Number Operations',
            'algebra': 'Algebra & Patterns',
            'geometry': 'Geometry',
            'data-handling': 'Data Handling'
        };
        
        return strandMap[strand] || strand;
    }
    
    setupAssessmentInterface() {
        // Answer selection
        const answerOptions = document.querySelectorAll('.answer-option');
        answerOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectAnswer(parseInt(option.dataset.answer));
            });
        });
        
        // Navigation
        document.getElementById('prev-question')?.addEventListener('click', () => {
            this.previousQuestion();
        });
        
        document.getElementById('next-question')?.addEventListener('click', () => {
            if (this.currentAssessment.currentQuestion === this.currentAssessment.questions.length - 1) {
                this.completeAssessment();
            } else {
                this.nextQuestion();
            }
        });
        
        // Start timer
        this.startTimer();
    }
    
    selectAnswer(answerIndex) {
        this.currentAssessment.answers[this.currentAssessment.currentQuestion] = answerIndex;
        this.updateQuestionDisplay();
        this.updateQuestionIndicator();
        
        // Auto-advance after showing feedback
        setTimeout(() => {
            if (this.currentAssessment.currentQuestion < this.currentAssessment.questions.length - 1) {
                this.nextQuestion();
            }
        }, 3000);
    }
    
    updateQuestionDisplay() {
        const questionContainer = document.getElementById('assessment-question');
        questionContainer.innerHTML = this.createQuestionDisplay();
        
        // Re-setup answer option listeners
        const answerOptions = questionContainer.querySelectorAll('.answer-option');
        answerOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectAnswer(parseInt(option.dataset.answer));
            });
        });
    }
    
    updateQuestionIndicator() {
        const dotsContainer = document.querySelector('.question-dots');
        if (dotsContainer) {
            dotsContainer.innerHTML = this.createQuestionIndicator();
        }
    }
    
    previousQuestion() {
        if (this.currentAssessment.currentQuestion > 0) {
            this.currentAssessment.currentQuestion--;
            this.updateAssessmentDisplay();
        }
    }
    
    nextQuestion() {
        if (this.currentAssessment.currentQuestion < this.currentAssessment.questions.length - 1) {
            this.currentAssessment.currentQuestion++;
            this.updateAssessmentDisplay();
        }
    }
    
    updateAssessmentDisplay() {
        const assessmentContainer = document.querySelector('.assessment-container');
        assessmentContainer.innerHTML = this.createAssessmentInterface();
        this.setupAssessmentInterface();
    }
    
    startTimer() {
        const assessment = this.currentAssessment;
        let timeRemaining = assessment.data.timeLimit * 60; // Convert to seconds
        
        const timerDisplay = document.getElementById('assessment-timer');
        const timerText = timerDisplay.querySelector('.timer-text');
        
        const timer = setInterval(() => {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeRemaining <= 60) {
                timerDisplay.style.background = '#EF4444';
                timerDisplay.style.color = 'white';
            }
            
            timeRemaining--;
            
            if (timeRemaining < 0) {
                clearInterval(timer);
                this.completeAssessment(true); // Time's up
            }
        }, 1000);
    }
    
    completeAssessment(timeUp = false) {
        const assessment = this.currentAssessment;
        assessment.isCompleted = true;
        assessment.endTime = Date.now();
        
        // Calculate score
        let correctAnswers = 0;
        assessment.questions.forEach((question, index) => {
            if (assessment.answers[index] === question.correct) {
                correctAnswers++;
            }
        });
        
        const score = Math.round((correctAnswers / assessment.questions.length) * 100);
        const pointsEarned = Math.round(score * (assessment.data.points / 100));
        
        // Update user progress
        this.app.currentUser.totalPoints += pointsEarned;
        
        this.showResults(correctAnswers, score, pointsEarned, timeUp);
    }
    
    showResults(correctAnswers, score, pointsEarned, timeUp) {
        const modal = document.getElementById('lesson-modal');
        const content = document.getElementById('lesson-content');
        
        const isExcellent = score >= 90;
        const isGood = score >= 70;
        const message = timeUp ? '⏰ Time\'s Up!' : 
                       isExcellent ? '🎉 Outstanding!' : 
                       isGood ? '😊 Well Done!' : 
                       '💪 Keep Practicing!';
        
        content.innerHTML = `
            <div class="assessment-results">
                <div class="results-header">
                    <h2>Assessment Complete!</h2>
                    <p class="results-message">${message}</p>
                </div>
                
                <div class="results-summary">
                    <div class="result-stat">
                        <div class="stat-icon">✅</div>
                        <div class="stat-content">
                            <span class="stat-number">${correctAnswers}</span>
                            <span class="stat-label">Correct Answers</span>
                        </div>
                    </div>
                    
                    <div class="result-stat">
                        <div class="stat-icon">📊</div>
                        <div class="stat-content">
                            <span class="stat-number">${score}%</span>
                            <span class="stat-label">Score</span>
                        </div>
                    </div>
                    
                    <div class="result-stat">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-content">
                            <span class="stat-number">${pointsEarned}</span>
                            <span class="stat-label">Points Earned</span>
                        </div>
                    </div>
                </div>
                
                <div class="results-breakdown">
                    <h3>Performance by Strand</h3>
                    <div class="strand-breakdown">
                        ${this.createStrandBreakdown()}
                    </div>
                </div>
                
                <div class="results-actions">
                    <button class="btn btn-primary" id="retake-assessment">Retake Assessment</button>
                    <button class="btn btn-secondary" id="review-answers">Review Answers</button>
                    <button class="btn btn-secondary" id="continue-learning">Continue Learning</button>
                </div>
            </div>
        `;
        
        // Setup result actions
        document.getElementById('retake-assessment')?.addEventListener('click', () => {
            this.startAssessment(this.currentAssessment.type);
        });
        
        document.getElementById('continue-learning')?.addEventListener('click', () => {
            modal.classList.add('hidden');
            this.app.navigateToSection('dashboard');
        });
    }
    
    createStrandBreakdown() {
        const strandStats = {};
        this.currentAssessment.questions.forEach((question, index) => {
            const strand = question.strand;
            if (!strandStats[strand]) {
                strandStats[strand] = { correct: 0, total: 0 };
            }
            strandStats[strand].total++;
            if (this.currentAssessment.answers[index] === question.correct) {
                strandStats[strand].correct++;
            }
        });
        
        return Object.entries(strandStats).map(([strand, stats]) => {
            const percentage = Math.round((stats.correct / stats.total) * 100);
            const strandName = this.getStrandDisplay(strand);
            
            return `
                <div class="strand-stat">
                    <span class="strand-name">${strandName}</span>
                    <div class="strand-progress-bar">
                        <div class="strand-progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="strand-percentage">${stats.correct}/${stats.total} (${percentage}%)</span>
                </div>
            `;
        }).join('');
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AssessmentsModule;
}
```

### FILE: scripts/lessons.js
```javascript
// Golden Mathematics Class 4 - Lessons Module
class LessonsModule {
    constructor(app) {
        this.app = app;
        this.interactiveComponents = new Map();
        this.setupInteractiveElements();
    }
    
    setupInteractiveElements() {
        this.setupMathManipulatives();
        this.setupVisualPatterns();
        this.setupShapeRecognition();
        this.setupDataVisualization();
    }
    
    setupMathManipulatives() {
        // Base-ten blocks for place value understanding
        this.createBaseTenBlocks();
    }
    
    createBaseTenBlocks() {
        this.interactiveComponents.set('base-ten-blocks', {
            create: (container, number) => {
                const blocks = this.generateBaseTenBlocks(number);
                container.innerHTML = `
                    <div class="base-ten-container">
                        <h4>Represent ${number} with base-ten blocks</h4>
                        <div class="blocks-visualization">
                            <div class="thousands-group">${blocks.thousands > 0 ? '🟫'.repeat(blocks.thousands) : ''}</div>
                            <div class="hundreds-group">${blocks.hundreds > 0 ? '🟨'.repeat(blocks.hundreds) : ''}</div>
                            <div class="tens-group">${blocks.tens > 0 ? '🟩'.repeat(blocks.tens) : ''}</div>
                            <div class="ones-group">${blocks.ones > 0 ? '🟥'.repeat(blocks.ones) : ''}</div>
                        </div>
                        <div class="blocks-legend">
                            <div><span class="block-symbol">🟫</span> Thousands</div>
                            <div><span class="block-symbol">🟨</span> Hundreds</div>
                            <div><span class="block-symbol">🟩</span> Tens</div>
                            <div><span class="block-symbol">🟥</span> Ones</div>
                        </div>
                    </div>
                `;
            },
            generateBaseTenBlocks: (number) => {
                return {
                    thousands: Math.floor(number / 1000),
                    hundreds: Math.floor((number % 1000) / 100),
                    tens: Math.floor((number % 100) / 10),
                    ones: number % 10
                };
            }
        });
    }
    
    setupVisualPatterns() {
        // Pattern creation and recognition tools
        this.interactiveComponents.set('pattern-creator', {
            create: (container, patternType) => {
                container.innerHTML = `
                    <div class="pattern-creator">
                        <h4>Create a ${patternType} pattern</h4>
                        <div class="pattern-sequence" id="pattern-sequence">
                            <!-- Pattern will be generated -->
                        </div>
                        <div class="pattern-builder">
                            <h5>Click blocks to add to your pattern:</h5>
                            <div class="pattern-blocks">
                                <button class="pattern-block" data-shape="circle" style="background: #3B82F6;">●</button>
                                <button class="pattern-block" data-shape="square" style="background: #EF4444;">■</button>
                                <button class="pattern-block" data-shape="triangle" style="background: #10B981;">▲</button>
                                <button class="pattern-block" data-shape="star" style="background: #F59E0B;">★</button>
                            </div>
                        </div>
                        <div class="pattern-feedback">
                            <p>Create a repeating pattern using the blocks above!</p>
                        </div>
                    </div>
                `;
                
                this.setupPatternInteraction(container);
            },
            setupPatternInteraction: (container) => {
                const sequence = container.querySelector('#pattern-sequence');
                const blocks = container.querySelectorAll('.pattern-block');
                const feedback = container.querySelector('.pattern-feedback');
                
                blocks.forEach(block => {
                    block.addEventListener('click', () => {
                        const shape = block.dataset.shape;
                        const shapeSymbol = block.textContent;
                        
                        // Add to sequence
                        const newBlock = document.createElement('span');
                        newBlock.className = 'pattern-element';
                        newBlock.textContent = shapeSymbol;
                        newBlock.style.cssText = block.style.cssText;
                        sequence.appendChild(newBlock);
                        
                        // Check pattern
                        this.checkPattern(container);
                    });
                });
                
                // Create initial pattern
                this.generatePattern(container, patternType);
            },
            generatePattern: (container, type) => {
                const sequence = container.querySelector('#pattern-sequence');
                const patterns = {
                    'ABAB': ['circle', 'square', 'circle', 'square'],
                    'ABC': ['circle', 'square', 'triangle'],
                    'AABB': ['circle', 'circle', 'square', 'square']
                };
                
                const pattern = patterns[type] || patterns['ABAB'];
                const symbols = { circle: '●', square: '■', triangle: '▲' };
                
                pattern.forEach(shape => {
                    const element = document.createElement('span');
                    element.className = 'pattern-element';
                    element.textContent = symbols[shape];
                    sequence.appendChild(element);
                });
            },
            checkPattern: (container) => {
                const sequence = container.querySelector('#pattern-sequence');
                const elements = sequence.querySelectorAll('.pattern-element');
                const feedback = container.querySelector('.pattern-feedback p');
                
                if (elements.length >= 4) {
                    const lastElements = Array.from(elements).slice(-4);
                    const colors = lastElements.map(el => el.style.background);
                    
                    // Simple pattern checking
                    const hasPattern = this.detectPattern(colors);
                    if (hasPattern) {
                        feedback.textContent = '🎉 Great pattern! Can you make it repeat?';
                        feedback.style.color = '#22C55E';
                    } else {
                        feedback.textContent = 'Keep going! Try to create a repeating pattern.';
                        feedback.style.color = '#F59E0B';
                    }
                }
            },
            detectPattern: (colors) => {
                // Simple pattern detection for ABAB or ABC patterns
                if (colors.length < 4) return false;
                
                const lastFour = colors.slice(-4);
                return (
                    (lastFour[0] === lastFour[2] && lastFour[1] === lastFour[3]) || // ABAB
                    (lastFour[0] === lastFour[1] && lastFour[2] === lastFour[3]) || // AABB
                    true // Accept all patterns for now
                );
            }
        });
    }
    
    setupShapeRecognition() {
        // Interactive shape identification and properties
        this.interactiveComponents.set('shape-explorer', {
            create: (container, shapes) => {
                container.innerHTML = `
                    <div class="shape-explorer">
                        <h4>Explore 2D and 3D Shapes</h4>
                        <div class="shapes-grid">
                            ${shapes.map(shape => `
                                <div class="shape-card" data-shape="${shape.id}">
                                    <div class="shape-visual">${shape.symbol}</div>
                                    <h5>${shape.name}</h5>
                                    <div class="shape-properties">
                                        <p><strong>Sides:</strong> ${shape.sides}</p>
                                        <p><strong>Corners:</strong> ${shape.corners}</p>
                                        ${shape.volume ? `<p><strong>Volume:</strong> ${shape.volume}</p>` : ''}
                                    </div>
                                    <button class="explore-shape-btn">Explore</button>
                                </div>
                            `).join('')}
                        </div>
                        <div class="shape-details" id="shape-details"></div>
                    </div>
                `;
                
                this.setupShapeInteraction(container);
            },
            setupShapeInteraction: (container) => {
                const shapeCards = container.querySelectorAll('.shape-card');
                const detailsContainer = container.querySelector('#shape-details');
                
                shapeCards.forEach(card => {
                    card.addEventListener('click', () => {
                        const shape = card.dataset.shape;
                        this.showShapeDetails(detailsContainer, shape, card);
                    });
                });
            },
            showShapeDetails: (container, shapeId, card) => {
                const shapeData = {
                    circle: {
                        name: 'Circle',
                        properties: [
                            'A circle has no sides or corners',
                            'All points are the same distance from the center',
                            'It can roll easily'
                        ],
                        realWorld: ['Wheels', 'Coins', 'Clock faces', 'Pizza']
                    },
                    square: {
                        name: 'Square',
                        properties: [
                            'A square has 4 equal sides',
                            'A square has 4 corners (right angles)',
                            'All angles are 90 degrees'
                        ],
                        realWorld: ['Dice', 'Windows', 'Tiles', 'Boxes']
                    },
                    triangle: {
                        name: 'Triangle',
                        properties: [
                            'A triangle has 3 sides',
                            'A triangle has 3 corners',
                            'The sides can be different lengths'
                        ],
                        realWorld: ['Roofs', 'Slices of pizza', 'Sails', 'Mountain peaks']
                    }
                };
                
                const shape = shapeData[shapeId];
                if (!shape) return;
                
                container.innerHTML = `
                    <div class="shape-detail-card">
                        <h5>${shape.name} Details</h5>
                        <div class="shape-detail-content">
                            <div class="shape-properties-detail">
                                <h6>Properties:</h6>
                                <ul>
                                    ${shape.properties.map(prop => `<li>${prop}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="shape-examples">
                                <h6>Real World Examples:</h6>
                                <div class="examples-list">
                                    ${shape.realWorld.map(example => `<span class="example-tag">${example}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
    }
    
    setupDataVisualization() {
        // Interactive data collection and graphing
        this.interactiveComponents.set('data-collector', {
            create: (container) => {
                container.innerHTML = `
                    <div class="data-collector">
                        <h4>Collect and Display Data</h4>
                        <div class="survey-creator">
                            <h5>Create a survey question:</h5>
                            <div class="survey-options">
                                <button class="survey-question" data-question="favorite-color">
                                    What is your favorite color?
                                </button>
                                <button class="survey-question" data-question="transportation">
                                    How do you get to school?
                                </button>
                                <button class="survey-question" data-question="pets">
                                    Do you have pets?
                                </button>
                            </div>
                        </div>
                        <div class="data-visualization">
                            <canvas id="data-chart" width="400" height="200"></canvas>
                        </div>
                        <div class="survey-results" id="survey-results"></div>
                    </div>
                `;
                
                this.setupSurveyInteraction(container);
            },
            setupSurveyInteraction: (container) => {
                const questions = container.querySelectorAll('.survey-question');
                const chart = container.querySelector('#data-chart');
                const results = container.querySelector('#survey-results');
                
                const surveyData = {
                    'favorite-color': {
                        question: 'What is your favorite color?',
                        options: ['Red', 'Blue', 'Green', 'Yellow'],
                        data: [8, 12, 6, 4]
                    },
                    'transportation': {
                        question: 'How do you get to school?',
                        options: ['Walk', 'Car', 'Bus', 'Bicycle'],
                        data: [10, 8, 5, 2]
                    },
                    'pets': {
                        question: 'Do you have pets?',
                        options: ['Yes', 'No'],
                        data: [18, 7]
                    }
                };
                
                questions.forEach(question => {
                    question.addEventListener('click', () => {
                        const questionId = question.dataset.question;
                        const data = surveyData[questionId];
                        this.displaySurveyResults(results, data);
                        this.drawChart(chart, data);
                    });
                });
            },
            displaySurveyResults: (container, data) => {
                container.innerHTML = `
                    <div class="results-display">
                        <h5>${data.question}</h5>
                        <div class="results-list">
                            ${data.options.map((option, index) => `
                                <div class="result-item">
                                    <span class="result-label">${option}:</span>
                                    <div class="result-bar">
                                        <div class="result-fill" style="width: ${(data.data[index] / Math.max(...data.data)) * 100}%"></div>
                                    </div>
                                    <span class="result-count">${data.data[index]}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            },
            drawChart: (canvas, data) => {
                const ctx = canvas.getContext('2d');
                const width = canvas.width;
                const height = canvas.height;
                const padding = 40;
                
                // Clear canvas
                ctx.clearRect(0, 0, width, height);
                
                // Draw bar chart
                const barWidth = (width - 2 * padding) / data.data.length;
                const maxValue = Math.max(...data.data);
                
                data.data.forEach((value, index) => {
                    const barHeight = (value / maxValue) * (height - 2 * padding);
                    const x = padding + index * barWidth;
                    const y = height - padding - barHeight;
                    
                    // Colour palette for bars
                    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];
                    ctx.fillStyle = colors[index % colors.length];
                    
                    // Draw bar
                    ctx.fillRect(x + 5, y, barWidth - 10, barHeight);
                    
                    // Draw label
                    ctx.fillStyle = '#413A28';
                    ctx.font = '12px Nunito';
                    ctx.textAlign = 'center';
                    ctx.fillText(data.options[index], x + barWidth / 2, height - 20);
                    
                    // Draw value
                    ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
                });
            }
        });
    }
    
    // Enhanced lesson content generators
    createNumberOperationsLesson(lessonType) {
        const lessons = {
            'counting': {
                title: 'Counting to 1000',
                activities: [
                    {
                        type: 'sequence-builder',
                        instruction: 'Build the number sequence by clicking the next number',
                        content: this.createSequenceBuilder()
                    },
                    {
                        type: 'number-line',
                        instruction: 'Find the missing numbers on the number line',
                        content: this.createNumberLine()
                    }
                ]
            },
            'place-value': {
                title: 'Place Value Understanding',
                activities: [
                    {
                        type: 'base-ten-blocks',
                        instruction: 'Represent the number using base-ten blocks',
                        content: this.createPlaceValueBlocks()
                    }
                ]
            },
            'addition': {
                title: 'Addition with Regrouping',
                activities: [
                    {
                        type: 'column-addition',
                        instruction: 'Solve these addition problems',
                        content: this.createAdditionProblems()
                    }
                ]
            }
        };
        
        return lessons[lessonType];
    }
    
    createSequenceBuilder() {
        return `
            <div class="sequence-builder">
                <h4>Number Sequence Builder</h4>
                <p>Click the numbers in order from 1 to 20:</p>
                <div class="number-grid">
                    ${Array.from({length: 20}, (_, i) => 
                        `<button class="sequence-number" data-number="${i + 1}">${i + 1}</button>`
                    ).join('')}
                </div>
                <div class="sequence-feedback">
                    <p>Click the numbers in order!</p>
                </div>
            </div>
        `;
    }
    
    createNumberLine() {
        return `
            <div class="number-line">
                <h4>Number Line Challenge</h4>
                <p>Fill in the missing numbers:</p>
                <div class="number-line-visual">
                    <span class="number-marker">0</span>
                    <span class="number-marker">2</span>
                    <span class="number-marker gap">?</span>
                    <span class="number-marker">6</span>
                    <span class="number-marker">8</span>
                    <span class="number-marker gap">?</span>
                    <span class="number-marker">12</span>
                </div>
                <div class="number-line-inputs">
                    <input type="number" placeholder="First gap" class="gap-input" data-gap="1">
                    <input type="number" placeholder="Second gap" class="gap-input" data-gap="2">
                    <button class="check-answers-btn">Check Answers</button>
                </div>
            </div>
        `;
    }
    
    createPlaceValueBlocks() {
        return `
            <div class="place-value-blocks">
                <h4>Build the Number</h4>
                <p>Represent the number using base-ten blocks:</p>
                <div class="number-display">
                    <span class="target-number">347</span>
                </div>
                <div class="blocks-workspace">
                    <div class="block-category">
                        <h5>🟨 Hundreds (100s)</h5>
                        <div class="block-options">
                            <button class="block hundreds" data-value="100">100</button>
                            <button class="block hundreds" data-value="200">200</button>
                            <button class="block hundreds" data-value="300">300</button>
                        </div>
                    </div>
                    <div class="block-category">
                        <h5>🟩 Tens (10s)</h5>
                        <div class="block-options">
                            <button class="block tens" data-value="10">10</button>
                            <button class="block tens" data-value="20">20</button>
                            <button class="block tens" data-value="30">30</button>
                            <button class="block tens" data-value="40">40</button>
                        </div>
                    </div>
                    <div class="block-category">
                        <h5>🟥 Ones (1s)</h5>
                        <div class="block-options">
                            <button class="block ones" data-value="1">1</button>
                            <button class="block ones" data-value="2">2</button>
                            <button class="block ones" data-value="3">3</button>
                            <button class="block ones" data-value="4">4</button>
                            <button class="block ones" data-value="5">5</button>
                            <button class="block ones" data-value="6">6</button>
                            <button class="block ones" data-value="7">7</button>
                        </div>
                    </div>
                </div>
                <div class="current-total">
                    <p>Current Total: <span id="total-display">0</span></p>
                </div>
            </div>
        `;
    }
    
    createAdditionProblems() {
        const problems = [
            { num1: 247, num2: 158 },
            { num1: 369, num2: 174 },
            { num1: 156, num2: 287 }
        ];
        
        return `
            <div class="addition-problems">
                <h4>Column Addition Practice</h4>
                ${problems.map((problem, index) => `
                    <div class="addition-problem" data-problem="${index}">
                        <div class="problem-numbers">
                            <div class="number-line">
                                <span class="addend">${problem.num1}</span>
                                <span class="operator">+</span>
                                <span class="addend">${problem.num2}</span>
                            </div>
                        </div>
                        <div class="addition-grid">
                            <div class="digit-column">
                                <label>Hundreds:</label>
                                <input type="number" class="digit-input" data-place="hundreds" min="0" max="9">
                            </div>
                            <div class="digit-column">
                                <label>Tens:</label>
                                <input type="number" class="digit-input" data-place="tens" min="0" max="9">
                            </div>
                            <div class="digit-column">
                                <label>Ones:</label>
                                <input type="number" class="digit-input" data-place="ones" min="0" max="9">
                            </div>
                        </div>
                        <div class="problem-feedback" id="feedback-${index}"></div>
                    </div>
                `).join('')}
                <button class="check-all-btn">Check All Answers</button>
            </div>
        `;
    }
    
    // Algebra and Pattern lessons
    createPatternLesson(lessonType) {
        const lessons = {
            'visual-patterns': {
                title: 'Visual Patterns',
                content: `
                    <div class="pattern-lesson">
                        <h4>Find the Pattern</h4>
                        <p>Look at the sequence and identify what comes next:</p>
                        <div class="pattern-sequence-display">
                            <span class="pattern-item">🔵</span>
                            <span class="pattern-item">🔴</span>
                            <span class="pattern-item">🔵</span>
                            <span class="pattern-item">🔴</span>
                            <span class="pattern-item">🔵</span>
                            <span class="pattern-item">🔴</span>
                            <span class="pattern-item">?</span>
                        </div>
                        <div class="pattern-choices">
                            <button class="pattern-choice" data-answer="blue">🔵</button>
                            <button class="pattern-choice" data-answer="red">🔴</button>
                            <button class="pattern-choice" data-answer="green">🟢</button>
                        </div>
                    </div>
                `
            },
            'number-sequences': {
                title: 'Number Sequences',
                content: `
                    <div class="sequence-lesson">
                        <h4>Number Patterns</h4>
                        <p>Find the missing numbers in these sequences:</p>
                        <div class="sequence-problems">
                            <div class="sequence-problem">
                                <p>2, 4, 6, 8, __, 12</p>
                                <input type="number" class="sequence-input" placeholder="Enter the missing number">
                            </div>
                            <div class="sequence-problem">
                                <p>1, 4, 7, 10, __, 16</p>
                                <input type="number" class="sequence-input" placeholder="Enter the missing number">
                            </div>
                            <div class="sequence-problem">
                                <p>20, 15, 10, 5, __, -5</p>
                                <input type="number" class="sequence-input" placeholder="Enter the missing number">
                            </div>
                        </div>
                        <button class="check-sequences-btn">Check Sequences</button>
                    </div>
                `
            }
        };
        
        return lessons[lessonType];
    }
    
    // Geometry and Measurement lessons
    createGeometryLesson(lessonType) {
        const lessons = {
            '2d-shapes': {
                title: '2D Shapes',
                content: this.interactiveComponents.get('shape-explorer')?.create || this.createBasicShapeLesson()
            },
            '3d-shapes': {
                title: '3D Shapes',
                content: `
                    <div class="shapes-3d">
                        <h4>Explore 3D Shapes</h4>
                        <div class="shapes-3d-grid">
                            <div class="shape-3d-card">
                                <div class="shape-3d-visual">📦</div>
                                <h5>Cube</h5>
                                <p>6 faces, 8 corners, 12 edges</p>
                            </div>
                            <div class="shape-3d-card">
                                <div class="shape-3d-visual">⚽</div>
                                <h5>Sphere</h5>
                                <p>0 faces, 0 corners, 0 edges</p>
                            </div>
                            <div class="shape-3d-card">
                                <div class="shape-3d-visual">🥤</div>
                                <h5>Cylinder</h5>
                                <p>3 faces, 0 corners, 2 edges</p>
                            </div>
                            <div class="shape-3d-card">
                                <div class="shape-3d-visual">🔺</div>
                                <h5>Triangular Pyramid</h5>
                                <p>4 faces, 4 corners, 6 edges</p>
                            </div>
                        </div>
                    </div>
                `
            },
            'measurement': {
                title: 'Measuring Length',
                content: `
                    <div class="measurement-lesson">
                        <h4>Length Measurement</h4>
                        <p>Use the ruler to measure these objects:</p>
                        <div class="measurement-tools">
                            <div class="ruler">
                                <div class="ruler-ticks">
                                    ${Array.from({length: 21}, (_, i) => 
                                        `<div class="ruler-tick" data-length="${i}">${i}</div>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="objects-measure">
                            <div class="measurement-object" data-object="pencil">
                                <div class="object-visual" style="width: 12cm; height: 1cm; background: #F59E0B;">✏️</div>
                                <p>How long is this pencil?</p>
                                <input type="number" class="measurement-input" placeholder="centimeters">
                            </div>
                            <div class="measurement-object" data-object="book">
                                <div class="object-visual" style="width: 25cm; height: 2cm; background: #3B82F6;">📕</div>
                                <p>How wide is this book?</p>
                                <input type="number" class="measurement-input" placeholder="centimeters">
                            </div>
                        </div>
                        <button class="check-measurements-btn">Check Measurements</button>
                    </div>
                `
            }
        };
        
        return lessons[lessonType];
    }
    
    createBasicShapeLesson() {
        const shapes = [
            { id: 'circle', name: 'Circle', symbol: '⭕', sides: 0, corners: 0 },
            { id: 'square', name: 'Square', symbol: '⬜', sides: 4, corners: 4 },
            { id: 'triangle', name: 'Triangle', symbol: '🔺', sides: 3, corners: 3 },
            { id: 'rectangle', name: 'Rectangle', symbol: '▬', sides: 4, corners: 4 }
        ];
        
        return this.interactiveComponents.get('shape-explorer')?.create(null, shapes) || 
               `<div class="basic-shape-lesson">Shape lesson content will be displayed here.</div>`;
    }
    
    // Data Handling lessons
    createDataLesson(lessonType) {
        return this.interactiveComponents.get('data-collector')?.create || 
               `<div class="data-lesson">Data lesson content will be displayed here.</div>`;
    }
    
    // Utility methods for lesson interactions
    setupLessonInteractivity(container) {
        // Sequence number interactions
        const sequenceNumbers = container.querySelectorAll('.sequence-number');
        let currentNumber = 1;
        
        sequenceNumbers.forEach(btn => {
            btn.addEventListener('click', () => {
                if (parseInt(btn.dataset.number) === currentNumber) {
                    btn.style.background = '#22C55E';
                    btn.style.color = 'white';
                    currentNumber++;
                    
                    if (currentNumber > 20) {
                        this.showSuccess(container, '🎉 Excellent! You completed the sequence!');
                    }
                } else {
                    btn.style.background = '#EF4444';
                    btn.style.color = 'white';
                    setTimeout(() => {
                        btn.style.background = '';
                        btn.style.color = '';
                    }, 500);
                }
            });
        });
        
        // Number line gap checking
        const gapInputs = container.querySelectorAll('.gap-input');
        const checkBtn = container.querySelector('.check-answers-btn');
        
        checkBtn?.addEventListener('click', () => {
            const answers = Array.from(gapInputs).map(input => parseInt(input.value));
            const correctAnswers = [4, 10];
            
            if (answers.length === correctAnswers.length && 
                answers.every((ans, i) => ans === correctAnswers[i])) {
                this.showSuccess(container, '✅ Perfect! All answers are correct!');
            } else {
                this.showError(container, '❌ Not quite right. Try again!');
            }
        });
        
        // Block selection for place value
        const blocks = container.querySelectorAll('.block');
        let total = 0;
        
        blocks.forEach(block => {
            block.addEventListener('click', () => {
                const value = parseInt(block.dataset.value);
                total += value;
                
                const display = container.querySelector('#total-display');
                display.textContent = total;
                
                // Visual feedback
                block.style.background = '#22C55E';
                block.style.color = 'white';
                
                setTimeout(() => {
                    block.style.background = '';
                    block.style.color = '';
                }, 300);
            });
        });
    }
    
    showSuccess(container, message) {
        const feedback = container.querySelector('.sequence-feedback') || 
                        container.querySelector('.pattern-feedback') ||
                        container;
        
        if (feedback) {
            feedback.innerHTML = `<p style="color: #22C55E; font-weight: bold;">${message}</p>`;
            feedback.style.background = '#F0FDF4';
            feedback.style.border = '2px solid #22C55E';
            feedback.style.borderRadius = '8px';
            feedback.style.padding = '12px';
        }
    }
    
    showError(container, message) {
        const feedback = container.querySelector('.sequence-feedback') || 
                        container.querySelector('.pattern-feedback') ||
                        container;
        
        if (feedback) {
            feedback.innerHTML = `<p style="color: #EF4444; font-weight: bold;">${message}</p>`;
            feedback.style.background = '#FEF2F2';
            feedback.style.border = '2px solid #EF4444';
            feedback.style.borderRadius = '8px';
            feedback.style.padding = '12px';
        }
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LessonsModule;
}
```

### FILE: scripts/progress.js
```javascript
// Golden Mathematics Class 4 - Progress Module
class ProgressModule {
    constructor(app) {
        this.app = app;
        this.progressData = this.initializeProgressData();
    }
    
    initializeProgressData() {
        return {
            achievements: {
                streaks: {
                    current: 5,
                    longest: 12,
                    goal: 7
                },
                mastery: {
                    numberOperations: { level: 3, maxLevel: 5 },
                    algebra: { level: 2, maxLevel: 5 },
                    geometry: { level: 2, maxLevel: 5 },
                    dataHandling: { level: 1, maxLevel: 5 }
                },
                milestones: [
                    { id: 'first-lesson', name: 'First Steps', description: 'Complete your first lesson', completed: true, date: '2025-11-20' },
                    { id: 'perfect-score', name: 'Perfect Score', description: 'Get 100% on an assessment', completed: true, date: '2025-11-25' },
                    { id: 'streak-week', name: 'Week Warrior', description: 'Learn for 7 days in a row', completed: false },
                    { id: 'strand-master', name: 'Strand Master', description: 'Complete all lessons in one strand', completed: false },
                    { id: 'helping-hand', name: 'Class Helper', description: 'Help 5 classmates with lessons', completed: false }
                ]
            },
            analytics: {
                timeSpent: {
                    today: 45, // minutes
                    week: 280,
                    month: 1200
                },
                accuracy: {
                    overall: 78,
                    byStrand: {
                        numberOperations: 85,
                        algebra: 72,
                        geometry: 80,
                        dataHandling: 65
                    }
                },
                improvement: {
                    weekOverWeek: 12, // percentage
                    monthOverMonth: 8
                },
                engagement: {
                    sessionsPerWeek: 8,
                    averageSessionLength: 35,
                    favoriteTimeToLearn: 'After School (3-5 PM)'
                }
            },
            weeklyGoals: {
                lessonsGoal: 8,
                lessonsCompleted: 5,
                assessmentsGoal: 2,
                assessmentsCompleted: 1,
                timeGoal: 300, // minutes
                timeSpent: 280
            },
            learningPath: {
                nextMilestone: {
                    name: 'Complete Algebra Strand',
                    progress: 67,
                    estimatedCompletion: '2025-12-12',
                    remainingLessons: 4
                },
                recommendedLessons: [
                    { id: 'alg-004', title: 'Simple Equations', strand: 'algebra', estimatedTime: 25 },
                    { id: 'alg-005', title: 'Function Tables', strand: 'algebra', estimatedTime: 20 },
                    { id: 'num-006', title: 'Multiplication Tables', strand: 'number-operations', estimatedTime: 30 }
                ]
            },
            peerComparison: {
                classRanking: 8,
                totalClassmates: 25,
                percentile: 68,
                averageClassProgress: 62
            }
        };
    }
    
    updateProgress(lessonId, strand, score, timeSpent) {
        // Update lesson progress
        this.updateLessonProgress(lessonId, strand, score);
        
        // Update strand progress
        this.updateStrandProgress(strand);
        
        // Update overall progress
        this.updateOverallProgress();
        
        // Update achievements
        this.checkAchievements();
        
        // Update analytics
        this.updateAnalytics(timeSpent);
    }
    
    updateLessonProgress(lessonId, strand, score) {
        // Update lesson completion in app's lesson data
        const strandLessons = this.app.lessonData[strand];
        const lesson = strandLessons?.find(l => l.id === lessonId);
        
        if (lesson) {
            lesson.completed = true;
            lesson.progress = 100;
            lesson.lastCompleted = new Date().toISOString();
            
            // Award points based on score
            const points = Math.round((score / 100) * 50);
            this.app.currentUser.totalPoints += points;
        }
    }
    
    updateStrandProgress(strand) {
        const strandLessons = this.app.lessonData[strand];
        if (!strandLessons) return;
        
        const completedLessons = strandLessons.filter(l => l.completed).length;
        const totalLessons = strandLessons.length;
        const completionPercentage = Math.round((completedLessons / totalLessons) * 100);
        
        // Update progress data
        if (this.app.progressData.strands[strand]) {
            this.app.progressData.strands[strand].completedLessons = completedLessons;
            this.app.progressData.strands[strand].completion = completionPercentage;
        }
    }
    
    updateOverallProgress() {
        const totalCompleted = Object.values(this.app.lessonData)
            .flat()
            .filter(l => l.completed).length;
        const totalLessons = Object.values(this.app.lessonData)
            .flat().length;
        
        this.app.currentUser.completedLessons = totalCompleted;
        this.app.progressData.overall.completedLessons = totalCompleted;
        this.app.progressData.overall.completion = Math.round((totalCompleted / totalLessons) * 100);
    }
    
    checkAchievements() {
        const achievements = this.progressData.achievements;
        
        // Check streak achievement
        if (this.progressData.achievements.streaks.current >= 7 && 
            !achievements.milestones.find(m => m.id === 'streak-week').completed) {
            achievements.milestones.find(m => m.id === 'streak-week').completed = true;
            achievements.milestones.find(m => m.id === 'streak-week').date = new Date().toISOString().split('T')[0];
        }
        
        // Check perfect score achievement
        const hasPerfectScore = Object.values(this.app.assessmentData)
            .flat()
            .some(a => a.score === 100);
            
        if (hasPerfectScore && !achievements.milestones.find(m => m.id === 'perfect-score').completed) {
            achievements.milestones.find(m => m.id === 'perfect-score').completed = true;
            achievements.milestones.find(m => m.id === 'perfect-score').date = new Date().toISOString().split('T')[0];
        }
    }
    
    updateAnalytics(timeSpent) {
        this.progressData.analytics.timeSpent.today += timeSpent;
        this.progressData.analytics.timeSpent.week += timeSpent;
        
        // Calculate engagement metrics
        const today = new Date().toDateString();
        const lastSession = localStorage.getItem('lastSession');
        
        if (lastSession !== today) {
            this.progressData.analytics.engagement.sessionsPerWeek++;
            localStorage.setItem('lastSession', today);
        }
    }
    
    generateProgressReport() {
        const report = {
            summary: {
                overallProgress: this.app.progressData.overall.completion,
                totalPoints: this.app.currentUser.totalPoints,
                lessonsCompleted: this.app.currentUser.completedLessons,
                currentStreak: this.progressData.achievements.streaks.current
            },
            strands: this.app.progressData.strands,
            achievements: this.progressData.achievements.milestones.filter(m => m.completed),
            recommendations: this.generateRecommendations(),
            goals: this.progressData.weeklyGoals,
            analytics: this.progressData.analytics
        };
        
        return report;
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        // Find strand with lowest progress
        const strandProgress = Object.entries(this.app.progressData.strands)
            .sort(([,a], [,b]) => a.completion - b.completion);
            
        if (strandProgress.length > 0) {
            const [lowestStrand] = strandProgress[0];
            const strandLessons = this.app.lessonData[lowestStrand] || [];
            const nextLesson = strandLessons.find(l => !l.completed);
            
            if (nextLesson) {
                recommendations.push({
                    type: 'focus-area',
                    title: 'Focus on ' + this.app.progressData.strands[lowestStrand].name,
                    description: `Improve your ${this.app.progressData.strands[lowestStrand].name} skills`,
                    action: 'Start next lesson',
                    lessonId: nextLesson.id,
                    strand: lowestStrand
                });
            }
        }
        
        // Recommend practice based on recent performance
        const recentAccuracy = this.calculateRecentAccuracy();
        if (recentAccuracy < 70) {
            recommendations.push({
                type: 'practice-needed',
                title: 'More Practice Needed',
                description: `Your recent accuracy is ${recentAccuracy}%. Let's practice more!`,
                action: 'Take a practice quiz'
            });
        }
        
        // Encourage consistent learning
        if (this.progressData.achievements.streaks.current < 3) {
            recommendations.push({
                type: 'build-streak',
                title: 'Build Your Learning Streak',
                description: 'Try to learn something new every day!',
                action: 'Continue today'
            });
        }
        
        return recommendations;
    }
    
    calculateRecentAccuracy() {
        // Mock calculation - in real app, this would analyze recent assessment scores
        return 78; // Percentage
    }
    
    createProgressVisualization() {
        return {
            overallChart: this.createOverallProgressChart(),
            strandCharts: this.createStrandProgressCharts(),
            timeSpentChart: this.createTimeSpentChart(),
            accuracyChart: this.createAccuracyChart()
        };
    }
    
    createOverallProgressChart() {
        const progress = this.app.progressData.overall.completion;
        return {
            type: 'circular',
            value: progress,
            max: 100,
            color: '#FFC02D',
            size: 150,
            label: `${progress}% Complete`
        };
    }
    
    createStrandProgressCharts() {
        return Object.entries(this.app.progressData.strands).map(([strandKey, data]) => ({
            type: 'linear',
            label: data.name,
            value: data.completion,
            max: 100,
            color: this.getStrandColor(strandKey),
            details: `${data.completedLessons}/${data.totalLessons} lessons`
        }));
    }
    
    getStrandColor(strand) {
        const colors = {
            'number-operations': '#3B82F6',
            'algebra': '#EC4899',
            'geometry': '#8B5CF6',
            'data-handling': '#10B981'
        };
        return colors[strand] || '#6B7280';
    }
    
    createTimeSpentChart() {
        return {
            type: 'bar',
            data: [
                { label: 'Monday', value: 45 },
                { label: 'Tuesday', value: 30 },
                { label: 'Wednesday', value: 50 },
                { label: 'Thursday', value: 40 },
                { label: 'Friday', value: 55 },
                { label: 'Saturday', value: 35 },
                { label: 'Sunday', value: 25 }
            ],
            yAxisLabel: 'Minutes'
        };
    }
    
    createAccuracyChart() {
        const accuracy = this.progressData.analytics.accuracy.byStrand;
        return {
            type: 'radar',
            data: {
                'Number Operations': accuracy.numberOperations,
                'Algebra & Patterns': accuracy.algebra,
                'Geometry & Measurement': accuracy.geometry,
                'Data Handling': accuracy.dataHandling
            }
        };
    }
    
    exportProgress() {
        const report = this.generateProgressReport();
        const reportDate = new Date().toISOString().split('T')[0];
        const filename = `progress-report-${reportDate}.json`;
        
        // Create downloadable file
        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        
        URL.revokeObjectURL(url);
    }
    
    shareProgress() {
        const report = this.generateProgressReport();
        const shareText = `
🎉 Amina's Math Progress Update!

📊 Overall Progress: ${report.summary.overallProgress}%
⭐ Total Points: ${report.summary.totalPoints}
📚 Lessons Completed: ${report.summary.lessonsCompleted}
🔥 Current Streak: ${report.summary.currentStreak} days

Keep up the great work! 💪

#MathLearning #GoldenMathematics #Class4
        `.trim();
        
        // Copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                this.app.showNotification('Progress copied to clipboard!', 'success');
            });
        }
        
        return shareText;
    }
    
    createDetailedProgressView() {
        const report = this.generateProgressView();
        
        // Create detailed progress modal
        const modal = document.createElement('div');
        modal.className = 'progress-modal';
        modal.innerHTML = `
            <div class="progress-modal-content">
                <div class="progress-modal-header">
                    <h2>Detailed Progress Report</h2>
                    <button class="modal-close" onclick="this.closest('.progress-modal').remove()">×</button>
                </div>
                
                <div class="progress-modal-body">
                    ${report}
                </div>
                
                <div class="progress-modal-footer">
                    <button class="btn btn-secondary" onclick="window.gmlsApp.progressModule.exportProgress()">
                        📄 Export Report
                    </button>
                    <button class="btn btn-primary" onclick="this.closest('.progress-modal').remove()">
                        Continue Learning
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add modal styles
        if (!document.querySelector('#progress-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'progress-modal-styles';
            styles.textContent = `
                .progress-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                
                .progress-modal-content {
                    background: var(--bg-surface);
                    border-radius: var(--radius-md);
                    max-width: 90vw;
                    max-height: 90vh;
                    width: 800px;
                    overflow: auto;
                    box-shadow: var(--shadow-medium);
                }
                
                .progress-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-lg);
                    border-bottom: 2px solid var(--bg-page);
                }
                
                .progress-modal-body {
                    padding: var(--space-lg);
                    max-height: 60vh;
                    overflow-y: auto;
                }
                
                .progress-modal-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-lg);
                    border-top: 2px solid var(--bg-page);
                }
                
                .progress-section {
                    margin-bottom: var(--space-xl);
                }
                
                .progress-section h3 {
                    color: var(--primary-700);
                    margin-bottom: var(--space-md);
                    border-left: 4px solid var(--primary-500);
                    padding-left: var(--space-sm);
                }
                
                .strand-progress-detail {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-md);
                    background: var(--bg-page);
                    border-radius: var(--radius-sm);
                    margin-bottom: var(--space-sm);
                }
                
                .achievements-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: var(--space-md);
                }
                
                .achievement-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--space-xs);
                    padding: var(--space-md);
                    background: var(--primary-100);
                    border-radius: var(--radius-sm);
                    text-align: center;
                }
                
                .achievement-item.locked {
                    background: var(--bg-page);
                    opacity: 0.7;
                }
                
                .achievement-icon {
                    font-size: 32px;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: var(--primary-500);
                    color: white;
                }
                
                .achievement-item.locked .achievement-icon {
                    background: var(--text-secondary);
                }
                
                .recommendations-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-md);
                }
                
                .recommendation-card {
                    padding: var(--space-md);
                    background: linear-gradient(135deg, var(--primary-100) 0%, var(--bg-page) 100%);
                    border-radius: var(--radius-sm);
                    border-left: 4px solid var(--primary-500);
                }
                
                .recommendation-card h4 {
                    color: var(--primary-700);
                    margin-bottom: var(--space-xs);
                }
                
                .goals-progress {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--space-md);
                }
                
                .goal-item {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-xs);
                }
                
                .goal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .goal-progress-bar {
                    height: 8px;
                    background: var(--bg-page);
                    border-radius: var(--radius-pill);
                    overflow: hidden;
                }
                
                .goal-progress-fill {
                    height: 100%;
                    background: var(--primary-500);
                    border-radius: var(--radius-pill);
                    transition: width var(--transition-bouncy);
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    generateProgressView() {
        const report = this.generateProgressReport();
        
        return `
            <div class="progress-sections">
                <!-- Summary Section -->
                <div class="progress-section">
                    <h3>Learning Summary</h3>
                    <div class="stats-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-md); margin-bottom: var(--space-lg);">
                        <div class="stat-card">
                            <div class="stat-number">${report.summary.overallProgress}%</div>
                            <div class="stat-label">Overall Progress</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${report.summary.totalPoints}</div>
                            <div class="stat-label">Total Points</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${report.summary.lessonsCompleted}</div>
                            <div class="stat-label">Lessons Completed</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${report.summary.currentStreak}</div>
                            <div class="stat-label">Day Streak</div>
                        </div>
                    </div>
                </div>
                
                <!-- Strand Progress -->
                <div class="progress-section">
                    <h3>Progress by Strand</h3>
                    ${Object.entries(report.strands).map(([strand, data]) => `
                        <div class="strand-progress-detail">
                            <div class="strand-info">
                                <strong>${data.name}</strong>
                                <div class="strand-details">${data.completedLessons}/${data.totalLessons} lessons • ${data.points} points</div>
                            </div>
                            <div class="strand-progress">
                                <div class="strand-progress-bar">
                                    <div class="strand-progress-fill" style="width: ${data.completion}%"></div>
                                </div>
                                <span class="strand-percentage">${data.completion}%</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Achievements -->
                <div class="progress-section">
                    <h3>Achievements</h3>
                    <div class="achievements-list">
                        ${report.achievements.map(achievement => `
                            <div class="achievement-item">
                                <div class="achievement-icon">🏆</div>
                                <div class="achievement-name">${achievement.name}</div>
                                <div class="achievement-date">${achievement.date}</div>
                            </div>
                        `).join('')}
                        ${this.progressData.achievements.milestones.filter(m => !m.completed).map(achievement => `
                            <div class="achievement-item locked">
                                <div class="achievement-icon">🔒</div>
                                <div class="achievement-name">${achievement.name}</div>
                                <div class="achievement-description">${achievement.description}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Weekly Goals -->
                <div class="progress-section">
                    <h3>Weekly Goals</h3>
                    <div class="goals-progress">
                        <div class="goal-item">
                            <div class="goal-header">
                                <span>Lessons This Week</span>
                                <span>${report.goals.lessonsCompleted}/${report.goals.lessonsGoal}</span>
                            </div>
                            <div class="goal-progress-bar">
                                <div class="goal-progress-fill" style="width: ${(report.goals.lessonsCompleted / report.goals.lessonsGoal) * 100}%"></div>
                            </div>
                        </div>
                        <div class="goal-item">
                            <div class="goal-header">
                                <span>Assessments This Week</span>
                                <span>${report.goals.assessmentsCompleted}/${report.goals.assessmentsGoal}</span>
                            </div>
                            <div class="goal-progress-bar">
                                <div class="goal-progress-fill" style="width: ${(report.goals.assessmentsCompleted / report.goals.assessmentsGoal) * 100}%"></div>
                            </div>
                        </div>
                        <div class="goal-item">
                            <div class="goal-header">
                                <span>Study Time</span>
                                <span>${report.goals.timeSpent}/${report.goals.timeGoal} min</span>
                            </div>
                            <div class="goal-progress-bar">
                                <div class="goal-progress-fill" style="width: ${(report.goals.timeSpent / report.goals.timeGoal) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Recommendations -->
                <div class="progress-section">
                    <h3>Recommendations</h3>
                    <div class="recommendations-list">
                        ${report.recommendations.map(rec => `
                            <div class="recommendation-card">
                                <h4>${rec.title}</h4>
                                <p>${rec.description}</p>
                                <button class="btn btn-sm btn-primary">${rec.action}</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Analytics -->
                <div class="progress-section">
                    <h3>Learning Analytics</h3>
                    <div class="analytics-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md);">
                        <div class="analytic-card">
                            <div class="analytic-label">Time Spent This Week</div>
                            <div class="analytic-value">${report.analytics.timeSpent.week} min</div>
                        </div>
                        <div class="analytic-card">
                            <div class="analytic-label">Average Accuracy</div>
                            <div class="analytic-value">${report.analytics.accuracy.overall}%</div>
                        </div>
                        <div class="analytic-card">
                            <div class="analytic-label">Weekly Improvement</div>
                            <div class="analytic-value">+${report.analytics.improvement.weekOverWeek}%</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressModule;
}
```

### FILE: src/a11y/aria-checklist.md
```md
# ARIA Accessibility Checklist — Class4 Digital Learning

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
- [ ] Wrap app content in `<AccessibleLayout label="Class4 Digital Learning">`
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
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'
import Lessons from './components/Lessons'
import Assessments from './components/Assessments'
import Progress from './components/Progress'
import LessonViewer from './components/LessonViewer'
import AssessmentQuiz from './components/AssessmentQuiz'
import TeacherDashboard from './components/TeacherDashboard'
import { UserProvider } from './context/UserContext'
import { ProgressProvider } from './context/ProgressContext'
import { LESSONS_DATA } from './data/lessonsData'
import { ASSESSMENTS_DATA } from './data/assessmentsData'
import './index.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [userRole, setUserRole] = useState('student') // 'student' or 'teacher'
  const [currentUser, setCurrentUser] = useState({
    name: 'Amina',
    level: 3,
    avatar: '👧',
    points: 1250,
    badges: 8
  })
  const [currentLesson, setCurrentLesson] = useState(null)
  const [currentAssessment, setCurrentAssessment] = useState(null)

  // Simulate loading process
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleRoleSwitch = (role) => {
    setUserRole(role)
    setCurrentSection('dashboard')
    setCurrentLesson(null)
    setCurrentAssessment(null)
  }

  const handleSectionChange = (section) => {
    setCurrentSection(section)
    setCurrentLesson(null)
    setCurrentAssessment(null)
  }

  const handleLessonSelect = (lessonId) => {
    const lesson = LESSONS_DATA.find(l => l.id === lessonId)
    setCurrentLesson(lesson)
  }

  const handleAssessmentStart = (assessmentId) => {
    setCurrentAssessment(assessmentId)
  }

  const handleLessonComplete = (lessonId) => {
    console.log('Lesson completed:', lessonId)
    setCurrentLesson(null)
  }

  const handleAssessmentComplete = (assessmentId, results) => {
    console.log('Assessment completed:', assessmentId, results)
    setCurrentAssessment(null)
  }

  const handleModalClose = () => {
    setCurrentLesson(null)
    setCurrentAssessment(null)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <UserProvider>
      <ProgressProvider>
        <Router>
          <div className="app">
            <Navigation 
              currentSection={currentSection}
              onSectionChange={handleSectionChange}
              userRole={userRole}
              onRoleSwitch={handleRoleSwitch}
              currentUser={currentUser}
            />
            
            <main className="main-content">
              <AnimatePresence mode="wait">
                {userRole === 'teacher' ? (
                  <motion.div
                    key="teacher"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TeacherDashboard 
                      currentUser={currentUser}
                      lessonsData={LESSONS_DATA}
                      assessmentsData={ASSESSMENTS_DATA}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="student"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentSection === 'dashboard' && (
                      <Dashboard 
                        currentUser={currentUser}
                        onSectionChange={handleSectionChange}
                      />
                    )}
                    {currentSection === 'lessons' && (
                      <Lessons 
                        lessonsData={LESSONS_DATA}
                        onLessonSelect={handleLessonSelect}
                      />
                    )}
                    {currentSection === 'assessments' && (
                      <Assessments 
                        assessmentsData={ASSESSMENTS_DATA}
                        onAssessmentStart={handleAssessmentStart}
                      />
                    )}
                    {currentSection === 'progress' && (
                      <Progress 
                        currentUser={currentUser}
                        lessonsData={LESSONS_DATA}
                        assessmentsData={ASSESSMENTS_DATA}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* Modals */}
            <AnimatePresence>
              {currentLesson && (
                <LessonViewer
                  lesson={currentLesson}
                  onClose={handleModalClose}
                  onComplete={handleLessonComplete}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {currentAssessment && (
                <AssessmentQuiz
                  assessmentId={currentAssessment}
                  onComplete={handleAssessmentComplete}
                  onClose={handleModalClose}
                />
              )}
            </AnimatePresence>
          </div>
        </Router>
      </ProgressProvider>
    </UserProvider>
  )
}

export default App
```

### FILE: src/AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_class4_digital_learning';
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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Class4 Digital Learning</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Class 4 Mathematics Digital Learning System - NaCCA Curriculum Aligned</p>
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

### FILE: src/components/AssessmentQuiz.tsx
```typescript
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QUIZ_QUESTIONS } from '../data/assessmentsData'

const AssessmentQuiz = ({ assessmentId, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes default
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const questions = QUIZ_QUESTIONS[assessmentId] || QUIZ_QUESTIONS['daily-quiz']
  const isTimeLimit = assessmentId !== 'daily-quiz' // Daily quiz has no time limit

  // Timer effect
  useEffect(() => {
    if (showResults || !isTimeLimit) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestion, showResults, isTimeLimit])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    
    // Calculate results
    let correctCount = 0
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correct) {
        correctCount++
      }
    })

    const score = Math.round((correctCount / questions.length) * 100)
    
    setTimeout(() => {
      setShowResults(true)
      setIsSubmitting(false)
      
      // Call completion handler after a delay
      setTimeout(() => {
        onComplete && onComplete(assessmentId, {
          score,
          correctAnswers: correctCount,
          totalQuestions: questions.length,
          timeSpent: isTimeLimit ? (300 - timeRemaining) : 0,
          answers: selectedAnswers
        })
      }, 3000)
    }, 1500)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50'
    if (score >= 60) return '#FFC02D'
    return '#e74c3c'
  }

  const getScoreMessage = (score) => {
    if (score >= 90) return "Outstanding! You're a math superstar! 🌟"
    if (score >= 80) return "Great job! You really understand this! 👏"
    if (score >= 70) return "Good work! Keep practicing! 💪"
    if (score >= 60) return "Not bad! Review the concepts and try again 📚"
    return "Don't worry! Learning takes time. Try again! 🌱"
  }

  if (showResults) {
    const correctCount = questions.filter(q => selectedAnswers[q.id] === q.correct).length
    const score = Math.round((correctCount / questions.length) * 100)

    return (
      <motion.div
        className="quiz-results-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}
      >
        <motion.div
          className="quiz-results"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '3rem',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            style={{ fontSize: '4rem', marginBottom: '1rem' }}
          >
            {score >= 80 ? '🎉' : score >= 60 ? '😊' : '💪'}
          </motion.div>

          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: getScoreColor(score),
            marginBottom: '1rem'
          }}>
            {score}%
          </h2>

          <p style={{ 
            fontSize: '1.2rem', 
            color: '#7F8C8D',
            marginBottom: '2rem'
          }}>
            {getScoreMessage(score)}
          </p>

          <div style={{ 
            background: '#FAF8F2', 
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#7F8C8D' }}>Correct</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4CAF50' }}>
                  {correctCount}/{questions.length}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#7F8C8D' }}>Time</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4A90E2' }}>
                  {isTimeLimit ? formatTime(300 - timeRemaining) : 'No limit'}
                </div>
              </div>
            </div>
          </div>

          <motion.button
            className="btn btn-primary"
            style={{ minWidth: '200px' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            Continue Learning
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="quiz-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem'
      }}
    >
      <motion.div
        className="quiz-content"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'white',
          borderRadius: '24px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Quiz Header */}
        <div className="quiz-header" style={{
          background: '#FFC02D',
          padding: '1.5rem 2rem',
          textAlign: 'center'
        }}>
          <h3 className="quiz-title">
            {assessmentId === 'daily-quiz' ? 'Daily Quick Quiz' : 'Assessment Quiz'}
          </h3>
          <div className="quiz-progress" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#7F8C8D' }}>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            {isTimeLimit && (
              <div className="quiz-timer" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                color: timeRemaining < 30 ? '#e74c3c' : '#2C3E50'
              }}>
                <span>⏱️</span>
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
          <div className="progress-bar" style={{ marginTop: '1rem' }}>
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Content */}
        <div className="quiz-content" style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="question">
                <div className="question-header" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#7F8C8D' 
                  }}>
                    Question {currentQuestion + 1}
                  </span>
                </div>

                <h4 className="question-text" style={{
                  fontSize: '1.25rem',
                  lineHeight: 1.4,
                  marginBottom: '2rem',
                  color: '#2C3E50'
                }}>
                  {questions[currentQuestion].question}
                </h4>

                <div className="question-options">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      className={`option ${selectedAnswers[questions[currentQuestion].id] === index ? 'selected' : ''}`}
                      onClick={() => handleAnswerSelect(questions[currentQuestion].id, index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        background: selectedAnswers[questions[currentQuestion].id] === index 
                          ? '#FFF3CC' 
                          : '#FAF8F2',
                        border: selectedAnswers[questions[currentQuestion].id] === index 
                          ? '2px solid #FFC02D' 
                          : '2px solid #E8E8E8',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'left',
                        minHeight: '44px'
                      }}
                    >
                      <div style={{
                        width: '30px',
                        height: '30px',
                        background: selectedAnswers[questions[currentQuestion].id] === index 
                          ? '#FFC02D' 
                          : 'white',
                        color: selectedAnswers[questions[currentQuestion].id] === index 
                          ? '#2C3E50' 
                          : '#7F8C8D',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        flexShrink: 0
                      }}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span style={{ flex: 1 }}>{option}</span>
                    </motion.button>
                  ))}
                </div>

                {questions[currentQuestion].explanation && (
                  <div className="quiz-feedback" style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: '#F0F8FF',
                    borderRadius: '8px',
                    border: '1px solid #4A90E2'
                  }}>
                    <p style={{ fontSize: '0.875rem', color: '#4A90E2' }}>
                      💡 {questions[currentQuestion].explanation}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Quiz Controls */}
        <div className="quiz-controls" style={{
          padding: '1.5rem 2rem',
          background: '#FAF8F2',
          borderTop: '1px solid #E8E8E8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="btn btn-secondary"
            style={{ 
              opacity: currentQuestion === 0 ? 0.5 : 1,
              minWidth: '100px'
            }}
          >
            Previous
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {questions.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: index === currentQuestion 
                    ? '#FFC02D' 
                    : selectedAnswers[questions[index].id] !== undefined
                    ? '#4CAF50'
                    : '#E8E8E8',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentQuestion(index)}
              />
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <motion.button
              className="btn btn-primary"
              style={{ minWidth: '120px' }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </motion.button>
          ) : (
            <button
              onClick={handleNext}
              className="btn btn-primary"
              style={{ minWidth: '100px' }}
            >
              Next
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AssessmentQuiz
```

### FILE: src/components/Assessments.tsx
```typescript
import React from 'react'
import { motion } from 'framer-motion'

const Assessments = ({ assessmentsData, onAssessmentStart }) => {
  const dailyQuiz = {
    id: 'daily-quiz',
    title: 'Daily Quick Quiz',
    description: '5 questions to practice today\'s lessons',
    duration: '5 minutes',
    questions: 5,
    points: 25
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: '✅', text: `Completed - Score: ${'85'}%`, className: 'status-completed' }
      case 'available':
        return { icon: '📝', text: 'Available', className: 'status-available' }
      case 'locked':
        return { icon: '🔒', text: 'Complete Geometry first', className: 'status-locked' }
      default:
        return { icon: '📝', text: 'Available', className: 'status-available' }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="assessments"
    >
      <motion.div variants={itemVariants} className="section-header">
        <h1 className="section-title">Assessments</h1>
        <p className="section-subtitle">Test your knowledge and earn points</p>
      </motion.div>

      <div className="assessments-container">
        {/* Daily Quick Quiz */}
        <motion.div variants={itemVariants} className="assessment-card card">
          <div className="card-header">
            <h3 className="card-title">{dailyQuiz.title}</h3>
            <p className="card-description">{dailyQuiz.description}</p>
          </div>
          <div className="assessment-meta">
            <span className="meta-item">
              <span>⏱️</span>
              <span>{dailyQuiz.duration}</span>
            </span>
            <span className="meta-item">
              <span>🎯</span>
              <span>{dailyQuiz.questions} questions</span>
            </span>
            <span className="meta-item">
              <span>⭐</span>
              <span>{dailyQuiz.points} points</span>
            </span>
          </div>
          <motion.button 
            className="start-assessment-btn"
            onClick={() => onAssessmentStart(dailyQuiz.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Quiz
          </motion.button>
        </motion.div>

        {/* Strand Assessments */}
        <motion.div variants={itemVariants} className="assessments-list">
          <h3 className="list-title">Strand Assessments</h3>
          
          {assessmentsData.map((assessment, index) => {
            const status = getStatusIcon(assessment.status)
            
            return (
              <motion.div
                key={assessment.id}
                className="assessment-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className="assessment-info">
                  <h4 className="assessment-title">{assessment.title}</h4>
                  <p className="assessment-description">{assessment.description}</p>
                  <div className={`assessment-status ${status.className}`}>
                    <span className="status-icon">{status.icon}</span>
                    <span className="status-text">{status.text}</span>
                  </div>
                </div>
                
                {assessment.status === 'completed' ? (
                  <div className="assessment-score">
                    <span className="score-number">85</span>
                    <span className="score-label">%</span>
                  </div>
                ) : assessment.status === 'locked' ? (
                  <button className="locked-btn" disabled>
                    Locked
                  </button>
                ) : (
                  <motion.button 
                    className="take-assessment-btn"
                    onClick={() => onAssessmentStart(assessment.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Take Test
                  </motion.button>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Assessments
```

### FILE: src/components/Dashboard.tsx
```typescript
import React from 'react'
import { motion } from 'framer-motion'

const Dashboard = ({ currentUser, onSectionChange }) => {
  const todaysProgress = {
    lessonsCompleted: 2,
    pointsEarned: 150,
    badgesWon: 3
  }

  const continueLearning = {
    title: 'Adding Big Numbers',
    description: 'Learn to add numbers up to 10,000',
    progress: 65,
    strand: 'number-operations',
    icon: '🔢'
  }

  const recentBadges = [
    { name: 'Number Master', icon: '🏅' },
    { name: 'Quick Learner', icon: '⚡' },
    { name: 'Perfect Score', icon: '🌟' }
  ]

  const strands = [
    {
      id: 'number-operations',
      title: 'Number Operations',
      icon: '🔢',
      completed: 12,
      total: 15,
      progress: 80,
      color: 'number-operations'
    },
    {
      id: 'algebra',
      title: 'Algebra & Patterns',
      icon: '🔗',
      completed: 8,
      total: 12,
      progress: 67,
      color: 'algebra'
    },
    {
      id: 'geometry',
      title: 'Geometry & Measurement',
      icon: '📐',
      completed: 5,
      total: 10,
      progress: 50,
      color: 'geometry'
    },
    {
      id: 'data-handling',
      title: 'Data Handling',
      icon: '📊',
      completed: 3,
      total: 8,
      progress: 38,
      color: 'data-handling'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="dashboard"
    >
      <motion.div variants={itemVariants} className="section-header">
        <h1 className="section-title">Welcome back, {currentUser.name}! 🌟</h1>
        <p className="section-subtitle">Ready to continue your math adventure?</p>
      </motion.div>

      <motion.div variants={itemVariants} className="dashboard-grid">
        {/* Quick Stats */}
        <div className="stats-card card">
          <div className="card-header">
            <h3 className="card-title">Today's Progress</h3>
          </div>
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <span className="stat-number">{todaysProgress.lessonsCompleted}</span>
                <span className="stat-label">Lessons Completed</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <span className="stat-number">{todaysProgress.pointsEarned}</span>
                <span className="stat-label">Points Earned</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <span className="stat-number">{todaysProgress.badgesWon}</span>
                <span className="stat-label">Badges Won</span>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        <div className="continue-card card">
          <div className="card-header">
            <h3 className="card-title">Continue Learning</h3>
          </div>
          <div className="lesson-preview">
            <div className="lesson-thumbnail">
              <div className={`thumbnail-bg ${continueLearning.strand}`}>
                <span className="thumbnail-icon">{continueLearning.icon}</span>
              </div>
            </div>
            <div className="lesson-info">
              <h4 className="lesson-title">{continueLearning.title}</h4>
              <p className="lesson-description">{continueLearning.description}</p>
              <div className="progress-bar-small">
                <div 
                  className="progress-fill-small" 
                  style={{ width: `${continueLearning.progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{continueLearning.progress}% complete</span>
            </div>
            <motion.button 
              className="continue-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue
            </motion.button>
          </div>
        </div>

        {/* Recent Badges */}
        <div className="badges-card card">
          <div className="card-header">
            <h3 className="card-title">Recently Earned</h3>
          </div>
          <div className="badges-grid">
            {recentBadges.map((badge, index) => (
              <motion.div 
                key={index}
                className="badge-item"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="badge-icon">{badge.icon}</div>
                <span className="badge-name">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Strand Overview */}
      <motion.div variants={itemVariants} className="strands-overview">
        <h3 className="section-subtitle">Math Strands</h3>
        <div className="strands-grid">
          {strands.map((strand) => (
            <motion.div
              key={strand.id}
              className={`strand-card ${strand.color}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSectionChange('lessons')}
            >
              <div className="strand-header">
                <div className="strand-icon">{strand.icon}</div>
                <h4 className="strand-title">{strand.title}</h4>
              </div>
              <div className="strand-progress">
                <div className="progress-indicator">
                  <span className="progress-text">
                    {strand.completed}/{strand.total} lessons
                  </span>
                  <div className="radial-progress">
                    <svg className="progress-circle" width="60" height="60">
                      <circle cx="30" cy="30" r="25" className="progress-track"></circle>
                      <circle 
                        cx="30" 
                        cy="30" 
                        r="25" 
                        className="progress-fill" 
                        style={{ 
                          strokeDasharray: `${strand.progress * 1.57} 157` 
                        }}
                      />
                    </svg>
                    <span className="progress-percentage">{strand.progress}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard
```

### FILE: src/components/Lessons.tsx
```typescript
import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Lessons = ({ lessonsData, onLessonSelect }) => {
  const [activeFilter, setActiveFilter] = useState('all')

  const strandFilters = [
    { id: 'all', label: 'All Strands' },
    { id: 'number-operations', label: 'Number Operations' },
    { id: 'algebra', label: 'Algebra & Patterns' },
    { id: 'geometry', label: 'Geometry & Measurement' },
    { id: 'data-handling', label: 'Data Handling' }
  ]

  const filteredLessons = lessonsData.filter(lesson => 
    activeFilter === 'all' || lesson.strand === activeFilter
  )

  const getDifficultyDots = (difficulty) => {
    const dots = []
    for (let i = 1; i <= 3; i++) {
      dots.push(
        <div 
          key={i} 
          className={`difficulty-dot ${i <= difficulty ? 'active' : ''}`}
        />
      )
    }
    return dots
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: '✅', text: 'Completed', className: 'status-completed' }
      case 'available':
        return { icon: '📝', text: 'Available', className: 'status-available' }
      case 'locked':
        return { icon: '🔒', text: 'Locked', className: 'status-locked' }
      default:
        return { icon: '📝', text: 'Available', className: 'status-available' }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="lessons"
    >
      <motion.div variants={itemVariants} className="section-header">
        <h1 className="section-title">Math Lessons</h1>
        <p className="section-subtitle">Choose a strand to start learning</p>
      </motion.div>

      {/* Strand Filter */}
      <motion.div variants={itemVariants} className="lesson-filter">
        {strandFilters.map((filter) => (
          <motion.button
            key={filter.id}
            className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filter.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Lessons Grid */}
      <motion.div 
        variants={itemVariants}
        className="lessons-grid"
      >
        {filteredLessons.map((lesson, index) => {
          const status = getStatusIcon(lesson.status)
          
          return (
            <motion.div
              key={lesson.id}
              className={`lesson-card ${lesson.status}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => lesson.status !== 'locked' && onLessonSelect(lesson.id)}
            >
              <div className="lesson-card-header">
                <div className="lesson-card-icon">
                  {lesson.icon}
                </div>
                <h4 className="lesson-card-title">{lesson.title}</h4>
              </div>
              
              <p className="lesson-card-description">
                {lesson.description}
              </p>
              
              <div className="lesson-card-meta">
                <div className="lesson-difficulty">
                  {getDifficultyDots(lesson.difficulty)}
                </div>
                
                <div className="lesson-duration">
                  <span>⏱️</span>
                  <span>{lesson.duration}</span>
                </div>
                
                <div className="lesson-status">
                  <span>{status.icon}</span>
                  <span className={status.className}>{status.text}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

export default Lessons
```

### FILE: src/components/LessonViewer.tsx
```typescript
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LessonViewer = ({ lesson, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [interactiveElements, setInteractiveElements] = useState({})

  // Mock lesson content structure
  const lessonContent = {
    introduction: {
      title: 'Welcome to the lesson!',
      content: 'Today we will learn about ' + lesson.title.toLowerCase(),
      activities: []
    },
    concept: {
      title: 'Main Concept',
      content: 'Understanding the key mathematical concept...',
      examples: [
        'Example 1: Visual representation',
        'Example 2: Step-by-step solution',
        'Example 3: Real-world application'
      ],
      interactive: [
        {
          type: 'virtual-manipulative',
          id: 'base-ten-blocks',
          instruction: 'Click and drag blocks to represent the number'
        }
      ]
    },
    practice: {
      title: 'Practice Time',
      content: 'Now it\'s your turn to try!',
      exercises: [
        {
          type: 'multiple-choice',
          question: 'What is 250 + 180?',
          options: ['420', '430', '440', '450'],
          correct: 1
        },
        {
          type: 'drag-drop',
          instruction: 'Arrange the numbers in order from smallest to largest',
          items: [456, 234, 789, 123]
        }
      ]
    },
    summary: {
      title: 'Great Job!',
      content: 'You have completed this lesson. Here\'s what we learned:',
      keyPoints: [
        'Key point 1',
        'Key point 2',
        'Key point 3'
      ]
    }
  }

  const steps = Object.keys(lessonContent)

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeLesson()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeLesson = () => {
    setIsCompleted(true)
    setTimeout(() => {
      onComplete && onComplete(lesson.id)
      onClose()
    }, 2000)
  }

  const renderInteractiveElement = (element) => {
    switch (element.type) {
      case 'virtual-manipulative':
        return <VirtualManipulative {...element} />
      case 'multiple-choice':
        return <MultipleChoiceQuestion {...element} />
      case 'drag-drop':
        return <DragDropExercise {...element} />
      default:
        return <div>Interactive element not supported</div>
    }
  }

  return (
    <motion.div
      className="lesson-viewer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem'
      }}
    >
      <motion.div
        className="modal-content"
        style={{
          background: 'white',
          borderRadius: '24px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        initial={{ y: 50 }}
        animate={{ y: 0 }}
      >
        {/* Header */}
        <div className="modal-header" style={{
          padding: '2rem 2rem 1rem',
          borderBottom: '1px solid #E8E8E8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
              {lesson.title}
            </h2>
            <p style={{ margin: '0.5rem 0 0', color: '#7F8C8D' }}>
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '2rem',
              cursor: 'pointer',
              color: '#7F8C8D',
              padding: '0.5rem'
            }}
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ padding: '0 2rem' }}>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                {lessonContent[steps[currentStep]].title}
              </h3>
              
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {lessonContent[steps[currentStep]].content}
              </p>

              {lessonContent[steps[currentStep]].examples && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Examples:</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {lessonContent[steps[currentStep]].examples.map((example, index) => (
                      <li 
                        key={index}
                        style={{ 
                          padding: '0.75rem',
                          background: '#FAF8F2',
                          borderRadius: '8px',
                          marginBottom: '0.5rem',
                          borderLeft: '4px solid #FFC02D'
                        }}
                      >
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lessonContent[steps[currentStep]].keyPoints && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Key Points:</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {lessonContent[steps[currentStep]].keyPoints.map((point, index) => (
                      <li 
                        key={index}
                        style={{ 
                          padding: '0.75rem',
                          background: '#F0F8FF',
                          borderRadius: '8px',
                          marginBottom: '0.5rem',
                          borderLeft: '4px solid #4A90E2'
                        }}
                      >
                        ✓ {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lessonContent[steps[currentStep]].interactive && (
                <div style={{ marginBottom: '1.5rem' }}>
                  {lessonContent[steps[currentStep]].interactive.map((element, index) => (
                    <div key={index} style={{ marginBottom: '1rem' }}>
                      <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                        {element.instruction}
                      </p>
                      {renderInteractiveElement(element)}
                    </div>
                  ))}
                </div>
              )}

              {lessonContent[steps[currentStep]].exercises && (
                <div style={{ marginBottom: '1.5rem' }}>
                  {lessonContent[steps[currentStep]].exercises.map((exercise, index) => (
                    <div key={index} style={{ marginBottom: '1.5rem' }}>
                      {renderInteractiveElement(exercise)}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Completion Animation */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lesson-completion"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                style={{ fontSize: '4rem', marginBottom: '1rem' }}
              >
                🎉
              </motion.div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>
                Lesson Complete!
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#7F8C8D', marginTop: '0.5rem' }}>
                Great job! You've mastered this concept.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        {!isCompleted && (
          <div className="modal-footer" style={{
            padding: '1rem 2rem 2rem',
            borderTop: '1px solid #E8E8E8',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="btn btn-secondary"
              style={{ opacity: currentStep === 0 ? 0.5 : 1 }}
            >
              Previous
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {steps.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: index === currentStep ? '#FFC02D' : '#E8E8E8'
                  }}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              className="btn btn-primary"
            >
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// Virtual Manipulative Component
const VirtualManipulative = ({ id, instruction }) => {
  const [blocks, setBlocks] = useState(Array(5).fill(null))
  const [draggedBlock, setDraggedBlock] = useState(null)

  const handleBlockClick = (index) => {
    const newBlocks = [...blocks]
    if (newBlocks[index] === null) {
      newBlocks[index] = Math.floor(Math.random() * 9) + 1
    } else {
      newBlocks[index] = null
    }
    setBlocks(newBlocks)
  }

  return (
    <div style={{ 
      background: '#FAF8F2', 
      padding: '1.5rem', 
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      <p style={{ marginBottom: '1rem', fontWeight: '600' }}>{instruction}</p>
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {blocks.map((block, index) => (
          <motion.div
            key={index}
            className="base-ten-block"
            style={{
              width: '50px',
              height: '50px',
              background: block ? '#4A90E2' : '#E8E8E8',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: block ? 'white' : '#7F8C8D',
              cursor: 'pointer'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleBlockClick(index)}
          >
            {block || '+'}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Multiple Choice Question Component
const MultipleChoiceQuestion = ({ question, options, correct }) => {
  const [selected, setSelected] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)

  const handleSelect = (index) => {
    setSelected(index)
    setShowAnswer(true)
  }

  return (
    <div style={{ 
      background: '#F0F8FF', 
      padding: '1.5rem', 
      borderRadius: '12px',
      border: '2px solid #4A90E2'
    }}>
      <h4 style={{ marginBottom: '1rem', fontWeight: '600' }}>{question}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {options.map((option, index) => (
          <motion.button
            key={index}
            className="option"
            style={{
              padding: '0.75rem',
              background: selected === null ? 'white' : 
                       index === correct ? '#4CAF50' :
                       selected === index ? '#e74c3c' : 'white',
              color: selected !== null && index !== correct && selected === index ? 'white' : 
                    index === correct ? 'white' : '#2C3E50',
              border: selected === null ? '2px solid #E8E8E8' :
                     index === correct ? '2px solid #4CAF50' :
                     selected === index ? '2px solid #e74c3c' : '2px solid #E8E8E8',
              borderRadius: '8px',
              cursor: selected ? 'default' : 'pointer',
              textAlign: 'left',
              fontWeight: selected !== null && index === correct ? 'bold' : 'normal'
            }}
            whileHover={selected === null ? { scale: 1.02 } : {}}
            whileTap={selected === null ? { scale: 0.98 } : {}}
            onClick={() => handleSelect(index)}
            disabled={selected !== null}
          >
            {String.fromCharCode(65 + index)}. {option}
          </motion.button>
        ))}
      </div>
      {showAnswer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ marginTop: '1rem', padding: '0.75rem', background: 'white', borderRadius: '8px' }}
        >
          {selected === correct ? (
            <span style={{ color: '#4CAF50', fontWeight: '600' }}>✓ Correct!</span>
          ) : (
            <span style={{ color: '#e74c3c', fontWeight: '600' }}>
              ✗ Incorrect. The correct answer is {String.fromCharCode(65 + correct)}.
            </span>
          )}
        </motion.div>
      )}
    </div>
  )
}

// Drag Drop Exercise Component
const DragDropExercise = ({ instruction, items }) => {
  const [arrangedItems, setArrangedItems] = useState([])
  const [availableItems, setAvailableItems] = useState([...items].sort(() => Math.random() - 0.5))

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', item)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const item = parseInt(e.dataTransfer.getData('text/plain'))
    
    if (!arrangedItems.includes(item)) {
      setArrangedItems([...arrangedItems, item])
      setAvailableItems(availableItems.filter(i => i !== item))
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const reset = () => {
    setArrangedItems([])
    setAvailableItems([...items].sort(() => Math.random() - 0.5))
  }

  return (
    <div style={{ 
      background: '#FFF8E1', 
      padding: '1.5rem', 
      borderRadius: '12px',
      border: '2px solid #FFC02D'
    }}>
      <h4 style={{ marginBottom: '1rem', fontWeight: '600' }}>{instruction}</h4>
      
      {/* Available Items */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#7F8C8D', marginBottom: '0.5rem' }}>Available:</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {availableItems.map((item) => (
            <motion.div
              key={item}
              className="number-token"
              style={{
                width: '40px',
                height: '40px',
                background: '#FFC02D',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#2C3E50',
                cursor: 'grab'
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          minHeight: '60px',
          background: 'white',
          border: '2px dashed #E8E8E8',
          borderRadius: '8px',
          padding: '1rem',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <span style={{ color: '#7F8C8D', fontSize: '0.875rem' }}>
          Drag numbers here to arrange them
        </span>
        {arrangedItems.map((item) => (
          <div
            key={item}
            style={{
              width: '40px',
              height: '40px',
              background: '#4CAF50',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            {item}
          </div>
        ))}
      </div>

      <button
        onClick={reset}
        className="btn btn-outline"
        style={{ marginTop: '1rem' }}
      >
        Reset
      </button>
    </div>
  )
}

export default LessonViewer
```

### FILE: src/components/LoadingScreen.tsx
```typescript
import React from 'react'

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <div className="logo-icon">🔢</div>
          <h1 className="loading-title">Golden Mathematics</h1>
          <p className="loading-subtitle">Class 4 Digital Learning</p>
        </div>
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
```

### FILE: src/components/Navigation.tsx
```typescript
import React from 'react'
import { motion } from 'framer-motion'

const Navigation = ({ 
  currentSection, 
  onSectionChange, 
  userRole, 
  onRoleSwitch, 
  currentUser 
}) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'lessons', label: 'Lessons', icon: '📚' },
    { id: 'assessments', label: 'Assessments', icon: '✅' },
    { id: 'progress', label: 'Progress', icon: '📊' }
  ]

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="brand-icon">🔢</div>
          <span className="brand-text">Golden Mathematics</span>
        </div>
        
        <div className="nav-menu">
          {navigationItems.map((item) => (
            <motion.button
              key={item.id}
              className={`nav-item ${currentSection === item.id ? 'active' : ''}`}
              onClick={() => onSectionChange(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </motion.button>
          ))}
        </div>
        
        <div className="nav-user">
          <div className="user-avatar">
            <span className="avatar-icon">{currentUser.avatar}</span>
          </div>
          <div className="user-info">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-level">Level {currentUser.level}</span>
          </div>
        </div>
        
        <div className="role-switch">
          <select 
            value={userRole} 
            onChange={(e) => onRoleSwitch(e.target.value)}
            className="form-select"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
```

### FILE: src/components/Progress.tsx
```typescript
import React from 'react'
import { motion } from 'framer-motion'

const Progress = ({ currentUser, lessonsData, assessmentsData }) => {
  const overallStats = {
    lessonsCompleted: 28,
    lessonsTotal: 45,
    assessmentsPassed: 12,
    assessmentsTotal: 15,
    totalPoints: 1250,
    badgesEarned: 8,
    badgesTotal: 12
  }

  const overallProgress = Math.round((overallStats.lessonsCompleted / overallStats.lessonsTotal) * 100)

  const strandProgress = [
    {
      id: 'number-operations',
      name: 'Number Operations',
      icon: '🔢',
      completed: 12,
      total: 15,
      progress: 80,
      colorClass: 'number-operations'
    },
    {
      id: 'algebra',
      name: 'Algebra & Patterns',
      icon: '🔗',
      completed: 8,
      total: 12,
      progress: 67,
      colorClass: 'algebra'
    },
    {
      id: 'geometry',
      name: 'Geometry & Measurement',
      icon: '📐',
      completed: 5,
      total: 10,
      progress: 50,
      colorClass: 'geometry'
    },
    {
      id: 'data-handling',
      name: 'Data Handling',
      icon: '📊',
      completed: 3,
      total: 8,
      progress: 38,
      colorClass: 'data-handling'
    }
  ]

  const achievements = [
    {
      name: 'Number Master',
      icon: '🏅',
      date: 'Earned 2 days ago',
      earned: true
    },
    {
      name: 'Quick Learner',
      icon: '⚡',
      date: 'Earned 1 week ago',
      earned: true
    },
    {
      name: 'Perfect Score',
      icon: '🌟',
      date: 'Earned 2 weeks ago',
      earned: true
    },
    {
      name: 'Geometry Expert',
      icon: '🏆',
      requirement: 'Complete Geometry strand',
      earned: false
    },
    {
      name: 'Pattern Detective',
      icon: '🎯',
      requirement: 'Complete Algebra strand',
      earned: false
    },
    {
      name: 'Data Champion',
      icon: '📊',
      requirement: 'Complete Data Handling',
      earned: false
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="progress"
    >
      <motion.div variants={itemVariants} className="section-header">
        <h1 className="section-title">Your Progress</h1>
        <p className="section-subtitle">Track your learning journey</p>
      </motion.div>

      <div className="progress-dashboard">
        {/* Overall Progress */}
        <motion.div variants={itemVariants} className="progress-overview card">
          <div className="card-header">
            <h3 className="card-title">Overall Progress</h3>
          </div>
          <div className="overall-progress">
            <div className="progress-visual">
              <svg className="large-progress-circle" width="150" height="150">
                <circle cx="75" cy="75" r="65" className="progress-track-large"></circle>
                <circle 
                  cx="75" 
                  cy="75" 
                  r="65" 
                  className="progress-fill-large" 
                  style={{ 
                    strokeDasharray: `${overallProgress * 4.08} 408` 
                  }}
                />
              </svg>
              <div className="progress-center">
                <span className="progress-percentage-large">{overallProgress}%</span>
                <span className="progress-label">Complete</span>
              </div>
            </div>
            <div className="progress-stats">
              <div className="stat-row">
                <span className="stat-label">Lessons Completed:</span>
                <span className="stat-value">
                  {overallStats.lessonsCompleted}/{overallStats.lessonsTotal}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Assessments Passed:</span>
                <span className="stat-value">
                  {overallStats.assessmentsPassed}/{overallStats.assessmentsTotal}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Total Points:</span>
                <span className="stat-value">{overallStats.totalPoints.toLocaleString()}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Badges Earned:</span>
                <span className="stat-value">
                  {overallStats.badgesEarned}/{overallStats.badgesTotal}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Strand Progress Details */}
        <motion.div variants={itemVariants} className="strand-progress-details">
          <h3 className="card-title">Strand Progress</h3>
          {strandProgress.map((strand) => (
            <div key={strand.id} className="strand-progress-item">
              <div className="strand-header-small">
                <div className={`strand-icon-small ${strand.colorClass}`}>
                  {strand.icon}
                </div>
                <div className="strand-info-small">
                  <h4 className="strand-name">{strand.name}</h4>
                  <span className="strand-completion">
                    {strand.completed}/{strand.total} lessons ({strand.progress}%)
                  </span>
                </div>
              </div>
              <div className="progress-bar-detailed">
                <div 
                  className="progress-fill-detailed" 
                  style={{ width: `${strand.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Achievement Gallery */}
        <motion.div 
          variants={itemVariants}
          className="achievement-gallery"
          style={{ gridColumn: '1 / -1' }}
        >
          <h3 className="card-title">Achievement Gallery</h3>
          <div className="badges-collection">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className={achievement.earned ? 'badge-earned' : 'badge-locked'}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`badge-icon-large ${!achievement.earned ? 'locked' : ''}`}>
                  {achievement.icon}
                </div>
                <span className="badge-name">{achievement.name}</span>
                {achievement.earned ? (
                  <span className="badge-date">{achievement.date}</span>
                ) : (
                  <span className="badge-requirement">{achievement.requirement}</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Progress
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

### FILE: src/components/TeacherDashboard.tsx
```typescript
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Users, BookOpen, TrendingUp } from 'lucide-react'

const TeacherDashboard = ({ currentUser, lessonsData, assessmentsData }) => {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock teacher data - in real app, this would come from API
  const classData = {
    totalStudents: 28,
    activeStudents: 24,
    averageProgress: 65,
    completionRate: 78,
    averageScore: 82
  }

  const recentActivity = [
    {
      student: 'Amina',
      activity: 'Completed lesson',
      lesson: 'Adding Big Numbers',
      time: '10 minutes ago'
    },
    {
      student: 'Kwame',
      activity: 'Started assessment',
      lesson: 'Geometry Shapes Quiz',
      time: '15 minutes ago'
    },
    {
      student: 'Fatima',
      activity: 'Earned badge',
      lesson: 'Number Master',
      time: '20 minutes ago'
    }
  ]

  const strandAnalytics = [
    {
      name: 'Number Operations',
      completion: 85,
      averageScore: 88,
      strugglingStudents: 3,
      color: '#4A90E2'
    },
    {
      name: 'Algebra & Patterns',
      completion: 67,
      averageScore: 75,
      strugglingStudents: 5,
      color: '#E91E63'
    },
    {
      name: 'Geometry & Measurement',
      completion: 45,
      averageScore: 79,
      strugglingStudents: 8,
      color: '#9C27B0'
    },
    {
      name: 'Data Handling',
      completion: 32,
      averageScore: 71,
      strugglingStudents: 12,
      color: '#4CAF50'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="teacher-dashboard"
    >
      <motion.div variants={itemVariants} className="section-header">
        <h1 className="section-title">Teacher Dashboard</h1>
        <p className="section-subtitle">Welcome back, {currentUser.name}!</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="dashboard-grid">
        <div className="stats-card card">
          <div className="card-header">
            <h3 className="card-title">Class Overview</h3>
          </div>
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{classData.totalStudents}</span>
                <span className="stat-label">Total Students</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{classData.activeStudents}</span>
                <span className="stat-label">Active Today</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <BarChart size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{classData.averageProgress}%</span>
                <span className="stat-label">Avg Progress</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Performance Metrics</h3>
          </div>
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-icon">
                <BookOpen size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{classData.completionRate}%</span>
                <span className="stat-label">Completion Rate</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <span className="stat-number">{classData.averageScore}%</span>
                <span className="stat-label">Average Score</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <span className="stat-number">156</span>
                <span className="stat-label">Badges Earned</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div style={{ marginTop: '1rem' }}>
            {recentActivity.map((activity, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  borderBottom: '1px solid #E8E8E8',
                  marginBottom: '0.5rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#2C3E50' }}>
                    {activity.student}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#7F8C8D' }}>
                    {activity.activity}: {activity.lesson}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#BDC3C7' }}>
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Strand Analytics */}
      <motion.div variants={itemVariants} className="strands-overview" style={{ marginTop: '2rem' }}>
        <h3 className="section-subtitle">Strand Performance Analysis</h3>
        <div className="strands-grid">
          {strandAnalytics.map((strand, index) => (
            <motion.div
              key={strand.name}
              className="strand-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              style={{ borderTopColor: strand.color }}
            >
              <div className="strand-header">
                <div 
                  className="strand-icon"
                  style={{ background: `${strand.color}20`, color: strand.color }}
                >
                  📊
                </div>
                <h4 className="strand-title">{strand.name}</h4>
              </div>
              <div className="strand-progress">
                <div className="progress-indicator">
                  <span className="progress-text">{strand.completion}% completion</span>
                  <div className="progress-bar" style={{ margin: '0.5rem 0' }}>
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${strand.completion}%`,
                        background: strand.color
                      }}
                    ></div>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#7F8C8D',
                  marginTop: '0.5rem'
                }}>
                  <div>Avg Score: <strong style={{ color: strand.color }}>{strand.averageScore}%</strong></div>
                  <div>Struggling: <strong>{strand.strugglingStudents} students</strong></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <motion.button 
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📋 Create Assignment
          </motion.button>
          <motion.button 
            className="btn btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📊 Generate Report
          </motion.button>
          <motion.button 
            className="btn btn-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            👥 Student Progress
          </motion.button>
          <motion.button 
            className="btn btn-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⚙️ Settings
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default TeacherDashboard
```

### FILE: src/context/ProgressContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react'
import { LESSONS_DATA } from '../data/lessonsData'

const ProgressContext = createContext()

export const useProgress = () => {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    // Load progress from localStorage or use default
    const savedProgress = localStorage.getItem('class4-math-progress')
    return savedProgress ? JSON.parse(savedProgress) : {
      lessonsCompleted: {
        // Lesson ID -> completion data
      },
      assessmentResults: {
        // Assessment ID -> results
      },
      strandProgress: {
        'number-operations': { completed: 9, total: 10, percentage: 90 },
        'algebra': { completed: 6, total: 8, percentage: 75 },
        'geometry': { completed: 4, total: 10, percentage: 40 },
        'data-handling': { completed: 2, total: 8, percentage: 25 }
      },
      achievements: {
        'first-lesson': { unlocked: true, date: new Date('2025-01-15') },
        'week-streak': { unlocked: true, date: new Date('2025-01-20') },
        'perfect-quiz': { unlocked: true, date: new Date('2025-01-25') },
        'all-strands': { unlocked: false, date: null },
        'speed-learner': { unlocked: false, date: null }
      },
      weeklyStats: {
        lessonsCompleted: 8,
        timeSpent: 240, // minutes
        assessmentsCompleted: 3,
        averageScore: 87
      },
      lastActiveDate: new Date().toISOString(),
      studyStreak: 5
    }
  })

  const [currentSession, setCurrentSession] = useState({
    lessonId: null,
    startTime: null,
    isActive: false,
    timeSpent: 0
  })

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('class4-math-progress', JSON.stringify(progress))
  }, [progress])

  const completeLesson = (lessonId, timeSpent, score = null) => {
    setProgress(prev => {
      const lesson = LESSONS_DATA.find(l => l.id === lessonId)
      if (!lesson) return prev

      const isFirstTime = !prev.lessonsCompleted[lessonId]
      
      return {
        ...prev,
        lessonsCompleted: {
          ...prev.lessonsCompleted,
          [lessonId]: {
            completed: true,
            completedAt: new Date().toISOString(),
            timeSpent,
            score,
            isFirstTime
          }
        },
        strandProgress: {
          ...prev.strandProgress,
          [lesson.strand]: {
            ...prev.strandProgress[lesson.strand],
            completed: Object.keys(prev.lessonsCompleted).filter(id => {
              const completedLesson = LESSONS_DATA.find(l => l.id === id)
              return completedLesson?.strand === lesson.strand
            }).length + (isFirstTime ? 1 : 0),
            percentage: Math.round(((Object.keys(prev.lessonsCompleted).filter(id => {
              const completedLesson = LESSONS_DATA.find(l => l.id === id)
              return completedLesson?.strand === lesson.strand
            }).length + (isFirstTime ? 1 : 0)) / 
            LESSONS_DATA.filter(l => l.strand === lesson.strand).length) * 100)
          }
        },
        lastActiveDate: new Date().toISOString()
      }
    })
  }

  const recordAssessment = (assessmentId, results) => {
    setProgress(prev => ({
      ...prev,
      assessmentResults: {
        ...prev.assessmentResults,
        [assessmentId]: {
          ...results,
          recordedAt: new Date().toISOString()
        }
      },
      lastActiveDate: new Date().toISOString()
    }))
  }

  const unlockAchievement = (achievementId) => {
    setProgress(prev => {
      if (prev.achievements[achievementId]?.unlocked) {
        return prev // Already unlocked
      }

      return {
        ...prev,
        achievements: {
          ...prev.achievements,
          [achievementId]: {
            unlocked: true,
            date: new Date().toISOString()
          }
        }
      }
    })
  }

  const startLesson = (lessonId) => {
    setCurrentSession({
      lessonId,
      startTime: Date.now(),
      isActive: true,
      timeSpent: 0
    })
  }

  const endLesson = () => {
    if (!currentSession.isActive || !currentSession.startTime) {
      return 0 // No active session
    }

    const timeSpent = Math.round((Date.now() - currentSession.startTime) / 1000 / 60) // minutes
    setCurrentSession({
      lessonId: null,
      startTime: null,
      isActive: false,
      timeSpent: 0
    })

    return timeSpent
  }

  const getOverallProgress = () => {
    const totalLessons = LESSONS_DATA.length
    const completedLessons = Object.keys(progress.lessonsCompleted).length
    const overallPercentage = Math.round((completedLessons / totalLessons) * 100)

    return {
      completed: completedLessons,
      total: totalLessons,
      percentage: overallPercentage
    }
  }

  const getStrandProgress = (strandId) => {
    const strandLessons = LESSONS_DATA.filter(l => l.strand === strandId)
    const completedInStrand = strandLessons.filter(l => progress.lessonsCompleted[l.id]?.completed).length

    return {
      completed: completedInStrand,
      total: strandLessons.length,
      percentage: Math.round((completedInStrand / strandLessons.length) * 100)
    }
  }

  const getRecentActivity = (days = 7) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return Object.entries(progress.lessonsCompleted)
      .filter(([_, data]) => new Date(data.completedAt) >= cutoffDate)
      .map(([lessonId, data]) => ({
        lessonId,
        ...data
      }))
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
  }

  const calculateStreak = () => {
    const activities = Object.values(progress.lessonsCompleted)
      .map(data => new Date(data.completedAt))
      .sort((a, b) => b - a)

    if (activities.length === 0) return 0

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const activityDate of activities) {
      const activity = new Date(activityDate)
      activity.setHours(0, 0, 0, 0)
      
      if (activity.getTime() === currentDate.getTime()) {
        streak++
        currentDate.setDate(currentDate.getTime() - 24 * 60 * 60 * 1000)
      } else if (activity.getTime() < currentDate.getTime()) {
        break // Gap found
      }
    }

    return streak
  }

  const value = {
    progress,
    currentSession,
    completeLesson,
    recordAssessment,
    unlockAchievement,
    startLesson,
    endLesson,
    getOverallProgress,
    getStrandProgress,
    getRecentActivity,
    calculateStreak
  }

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}
```

### FILE: src/context/UserContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Load user data from localStorage or use default
    const savedUser = localStorage.getItem('class4-math-user')
    return savedUser ? JSON.parse(savedUser) : {
      id: 'user-001',
      name: 'Amina',
      avatar: '👧',
      level: 3,
      points: 1250,
      badges: 8,
      streak: 5,
      totalStudyTime: 5400, // in minutes
      createdAt: new Date('2025-01-01'),
      preferences: {
        language: 'en',
        theme: 'light',
        soundEnabled: true,
        animationsEnabled: true
      }
    }
  })

  const [learningProfile, setLearningProfile] = useState(() => {
    const savedProfile = localStorage.getItem('class4-math-profile')
    return savedProfile ? JSON.parse(savedProfile) : {
      strongestStrand: 'number-operations',
      improvementAreas: ['data-handling'],
      favoriteActivities: ['virtual-manipulatives', 'quizzes'],
      recommendedPace: 'moderate',
      lastActivityDate: new Date().toISOString()
    }
  })

  // Save to localStorage whenever user data changes
  useEffect(() => {
    localStorage.setItem('class4-math-user', JSON.stringify(currentUser))
  }, [currentUser])

  useEffect(() => {
    localStorage.setItem('class4-math-profile', JSON.stringify(learningProfile))
  }, [learningProfile])

  const updateUser = (updates) => {
    setCurrentUser(prev => ({ ...prev, ...updates }))
  }

  const updateLearningProfile = (updates) => {
    setLearningProfile(prev => ({ ...prev, ...updates }))
  }

  const addPoints = (points) => {
    setCurrentUser(prev => ({
      ...prev,
      points: prev.points + points
    }))
  }

  const addBadge = () => {
    setCurrentUser(prev => ({
      ...prev,
      badges: prev.badges + 1
    }))
  }

  const updateLevel = (newLevel) => {
    setCurrentUser(prev => ({
      ...prev,
      level: newLevel
    }))
  }

  const recordStudyTime = (minutes) => {
    setCurrentUser(prev => ({
      ...prev,
      totalStudyTime: prev.totalStudyTime + minutes
    }))
  }

  const updatePreferences = (preferences) => {
    setCurrentUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences }
    }))
  }

  const value = {
    currentUser,
    learningProfile,
    updateUser,
    updateLearningProfile,
    addPoints,
    addBadge,
    updateLevel,
    recordStudyTime,
    updatePreferences
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
```

### FILE: src/data/assessmentsData.tsx
```typescript
// Class 4 Mathematics Assessments Data

export const ASSESSMENTS_DATA = [
  {
    id: 'assessment-num-ops',
    title: 'Number Operations Test',
    description: 'Test your understanding of addition and subtraction',
    strand: 'number-operations',
    status: 'completed',
    type: 'strand-assessment',
    questions: 15,
    duration: '30 minutes',
    points: 150,
    passScore: 70
  },
  {
    id: 'assessment-geometry',
    title: 'Geometry Shapes Quiz',
    description: 'Identify 2D and 3D shapes',
    strand: 'geometry',
    status: 'available',
    type: 'strand-assessment',
    questions: 10,
    duration: '20 minutes',
    points: 100,
    passScore: 70
  },
  {
    id: 'assessment-algebra',
    title: 'Patterns & Sequences',
    description: 'Find and create number patterns',
    strand: 'algebra',
    status: 'locked',
    type: 'strand-assessment',
    questions: 12,
    duration: '25 minutes',
    points: 120,
    passScore: 70,
    prerequisite: 'assessment-geometry'
  },
  {
    id: 'assessment-data',
    title: 'Data Handling Quiz',
    description: 'Read and create simple graphs',
    strand: 'data-handling',
    status: 'locked',
    type: 'strand-assessment',
    questions: 8,
    duration: '20 minutes',
    points: 80,
    passScore: 70,
    prerequisite: 'assessment-algebra'
  },
  {
    id: 'assessment-mid-term',
    title: 'Mid-term Assessment',
    description: 'Comprehensive test covering all strands',
    strand: 'all',
    status: 'locked',
    type: 'comprehensive',
    questions: 30,
    duration: '60 minutes',
    points: 300,
    passScore: 75,
    prerequisites: ['assessment-num-ops', 'assessment-geometry']
  },
  {
    id: 'assessment-final',
    title: 'Final Year Assessment',
    description: 'Complete end-of-year assessment',
    strand: 'all',
    status: 'locked',
    type: 'comprehensive',
    questions: 50,
    duration: '90 minutes',
    points: 500,
    passScore: 80,
    prerequisites: ['assessment-mid-term']
  }
]

// Quiz questions for the daily quick quiz
export const QUIZ_QUESTIONS = {
  'daily-quiz': [
    {
      id: 1,
      question: 'What is 245 + 367?',
      options: ['512', '602', '612', '702'],
      correct: 2,
      explanation: '245 + 367 = 612'
    },
    {
      id: 2,
      question: 'Which shape has 4 equal sides?',
      options: ['Circle', 'Triangle', 'Square', 'Rectangle'],
      correct: 2,
      explanation: 'A square has 4 equal sides and 4 equal angles'
    },
    {
      id: 3,
      question: 'Continue the pattern: 2, 4, 6, 8, __',
      options: ['9', '10', '11', '12'],
      correct: 1,
      explanation: 'This is the pattern of even numbers: 2, 4, 6, 8, 10'
    },
    {
      id: 4,
      question: 'What is 48 ÷ 6?',
      options: ['6', '7', '8', '9'],
      correct: 2,
      explanation: '48 ÷ 6 = 8 because 6 × 8 = 48'
    },
    {
      id: 5,
      question: 'How many sides does a triangle have?',
      options: ['2', '3', '4', '5'],
      correct: 1,
      explanation: 'A triangle always has 3 sides'
    }
  ],
  'assessment-num-ops': [
    {
      id: 1,
      question: 'Write 4,567 in words',
      options: [
        'Four thousand five hundred sixty-seven',
        'Four thousand five hundred seventy-six',
        'Four thousand six hundred fifty-seven',
        'Four thousand seven hundred sixty-five'
      ],
      correct: 0
    },
    {
      id: 2,
      question: 'What is the value of the digit 7 in 6,732?',
      options: ['7', '70', '700', '7,000'],
      correct: 1
    },
    {
      id: 3,
      question: 'Compare: 3,456 _____ 3,465',
      options: ['>', '<', '=', 'Cannot determine'],
      correct: 1
    },
    // Add more questions...
  ],
  'assessment-geometry': [
    {
      id: 1,
      question: 'Which of these is a 3D shape?',
      options: ['Square', 'Circle', 'Cube', 'Triangle'],
      correct: 2
    },
    {
      id: 2,
      question: 'How many faces does a cube have?',
      options: ['4', '6', '8', '12'],
      correct: 1
    },
    {
      id: 3,
      question: 'What do we use to measure length?',
      options: ['Scale', 'Ruler', 'Clock', 'Thermometer'],
      correct: 1
    },
    // Add more questions...
  ]
}

// Assessment results tracking
export const ASSESSMENT_RESULTS = {
  'assessment-num-ops': {
    score: 85,
    totalQuestions: 15,
    correctAnswers: 13,
    timeSpent: 25 * 60, // in seconds
    completedAt: new Date('2025-12-05'),
    passed: true
  },
  'daily-quiz': {
    score: 100,
    totalQuestions: 5,
    correctAnswers: 5,
    timeSpent: 3 * 60, // in seconds
    completedAt: new Date('2025-12-06'),
    passed: true
  }
}
```

### FILE: src/data/lessonsData.tsx
```typescript
// Class 4 Mathematics Lessons Data - NaCCA Curriculum Aligned

export const LESSONS_DATA = [
  // Strand 1: Number Operations (10 lessons)
  {
    id: 'num-ops-001',
    title: 'Counting and Writing Numbers to 10,000',
    description: 'Learn to count, read, and write numbers up to 10,000 with Ghanaian examples.',
    strand: 'number-operations',
    icon: '🔢',
    difficulty: 1,
    duration: '15 min',
    status: 'completed'
  },
  {
    id: 'num-ops-002',
    title: 'Place Value to 10,000',
    description: 'Understand place value positions using local currency and measurements.',
    strand: 'number-operations',
    icon: '💰',
    difficulty: 1,
    duration: '20 min',
    status: 'completed'
  },
  {
    id: 'num-ops-003',
    title: 'Comparing and Ordering Numbers',
    description: 'Compare numbers using greater than, less than, and equal to symbols.',
    strand: 'number-operations',
    icon: '⚖️',
    difficulty: 2,
    duration: '18 min',
    status: 'completed'
  },
  {
    id: 'num-ops-004',
    title: 'Addition with Regrouping',
    description: 'Add numbers up to 10,000 with carrying over using real-world examples.',
    strand: 'number-operations',
    icon: '➕',
    difficulty: 2,
    duration: '25 min',
    status: 'completed'
  },
  {
    id: 'num-ops-005',
    title: 'Subtraction with Regrouping',
    description: 'Subtract numbers up to 10,000 with borrowing using practical scenarios.',
    strand: 'number-operations',
    icon: '➖',
    difficulty: 2,
    duration: '25 min',
    status: 'completed'
  },
  {
    id: 'num-ops-006',
    title: 'Word Problems in Addition and Subtraction',
    description: 'Solve real-life word problems using addition and subtraction.',
    strand: 'number-operations',
    icon: '📝',
    difficulty: 3,
    duration: '30 min',
    status: 'completed'
  },
  {
    id: 'num-ops-007',
    title: 'Introduction to Multiplication',
    description: 'Understand multiplication as repeated addition with arrays.',
    strand: 'number-operations',
    icon: '✖️',
    difficulty: 2,
    duration: '22 min',
    status: 'completed'
  },
  {
    id: 'num-ops-008',
    title: 'Multiplication Tables (2, 5, 10)',
    description: 'Learn and practice multiplication tables for 2, 5, and 10.',
    strand: 'number-operations',
    icon: '📊',
    difficulty: 2,
    duration: '20 min',
    status: 'completed'
  },
  {
    id: 'num-ops-009',
    title: 'Division as Sharing and Grouping',
    description: 'Understand division as sharing equally and grouping.',
    strand: 'number-operations',
    icon: '➗',
    difficulty: 3,
    duration: '25 min',
    status: 'completed'
  },
  {
    id: 'num-ops-010',
    title: 'Solving Division Problems',
    description: 'Solve division problems using different strategies.',
    strand: 'number-operations',
    icon: '🔍',
    difficulty: 3,
    duration: '28 min',
    status: 'in-progress'
  },

  // Strand 2: Algebra and Patterns (8 lessons)
  {
    id: 'algebra-001',
    title: 'Simple Patterns',
    description: 'Identify and continue simple number and shape patterns.',
    strand: 'algebra',
    icon: '🔗',
    difficulty: 1,
    duration: '15 min',
    status: 'completed'
  },
  {
    id: 'algebra-002',
    title: 'Number Sequences',
    description: 'Recognize and extend number sequences with different rules.',
    strand: 'algebra',
    icon: '📈',
    difficulty: 2,
    duration: '20 min',
    status: 'completed'
  },
  {
    id: 'algebra-003',
    title: 'Introduction to Number Sentences',
    description: 'Write and understand simple number sentences.',
    strand: 'algebra',
    icon: '📄',
    difficulty: 2,
    duration: '18 min',
    status: 'completed'
  },
  {
    id: 'algebra-004',
    title: 'Finding Missing Numbers',
    description: 'Find missing numbers in equations and patterns.',
    strand: 'algebra',
    icon: '❓',
    difficulty: 2,
    duration: '22 min',
    status: 'completed'
  },
  {
    id: 'algebra-005',
    title: 'Simple Addition Equations',
    description: 'Solve simple equations with addition operations.',
    strand: 'algebra',
    icon: '🧮',
    difficulty: 2,
    duration: '25 min',
    status: 'completed'
  },
  {
    id: 'algebra-006',
    title: 'Simple Subtraction Equations',
    description: 'Solve simple equations with subtraction operations.',
    strand: 'algebra',
    icon: '🧩',
    difficulty: 3,
    duration: '25 min',
    status: 'completed'
  },
  {
    id: 'algebra-007',
    title: 'Pattern Recognition in Shapes',
    description: 'Identify patterns in geometric shapes and arrangements.',
    strand: 'algebra',
    icon: '🎨',
    difficulty: 3,
    duration: '20 min',
    status: 'available'
  },
  {
    id: 'algebra-008',
    title: 'Creating Own Patterns',
    description: 'Create your own number and shape patterns.',
    strand: 'algebra',
    icon: '✨',
    difficulty: 3,
    duration: '30 min',
    status: 'locked'
  },

  // Strand 3: Geometry and Measurement (10 lessons)
  {
    id: 'geo-001',
    title: 'Identifying 2D Shapes',
    description: 'Recognize and name common 2D shapes in our environment.',
    strand: 'geometry',
    icon: '📐',
    difficulty: 1,
    duration: '15 min',
    status: 'completed'
  },
  {
    id: 'geo-002',
    title: 'Properties of 2D Shapes',
    description: 'Learn the properties of squares, rectangles, circles, and triangles.',
    strand: 'geometry',
    icon: '📏',
    difficulty: 2,
    duration: '20 min',
    status: 'completed'
  },
  {
    id: 'geo-003',
    title: 'Identifying 3D Shapes',
    description: 'Recognize cubes, cuboids, cylinders, and spheres.',
    strand: 'geometry',
    icon: '🎲',
    difficulty: 1,
    duration: '18 min',
    status: 'completed'
  },
  {
    id: 'geo-004',
    title: '3D Shape Properties',
    description: 'Understand faces, edges, and vertices of 3D shapes.',
    strand: 'geometry',
    icon: '🔮',
    difficulty: 2,
    duration: '25 min',
    status: 'completed'
  },
  {
    id: 'geo-005',
    title: 'Measuring Length',
    description: 'Measure length using rulers and standard units.',
    strand: 'geometry',
    icon: '📏',
    difficulty: 2,
    duration: '22 min',
    status: 'completed'
  },
  {
    id: 'geo-006',
    title: 'Measuring Mass',
    description: 'Measure mass using scales and weighing balance.',
    strand: 'geometry',
    icon: '⚖️',
    difficulty: 2,
    duration: '20 min',
    status: 'available'
  },
  {
    id: 'geo-007',
    title: 'Measuring Capacity',
    description: 'Measure liquids using measuring cups and containers.',
    strand: 'geometry',
    icon: '🥤',
    difficulty: 2,
    duration: '20 min',
    status: 'locked'
  },
  {
    id: 'geo-008',
    title: 'Telling Time',
    description: 'Read time on analogue clocks to the nearest 5 minutes.',
    strand: 'geometry',
    icon: '⏰',
    difficulty: 2,
    duration: '25 min',
    status: 'locked'
  },
  {
    id: 'geo-009',
    title: 'Perimeter of Shapes',
    description: 'Calculate the perimeter of rectangles and squares.',
    strand: 'geometry',
    icon: '📐',
    difficulty: 3,
    duration: '30 min',
    status: 'locked'
  },
  {
    id: 'geo-010',
    title: 'Symmetry',
    description: 'Identify lines of symmetry in 2D shapes.',
    strand: 'geometry',
    icon: '🪞',
    difficulty: 3,
    duration: '28 min',
    status: 'locked'
  },

  // Strand 4: Data Handling (8 lessons)
  {
    id: 'data-001',
    title: 'Collecting Data',
    description: 'Learn how to collect and organize simple data.',
    strand: 'data-handling',
    icon: '📊',
    difficulty: 1,
    duration: '15 min',
    status: 'completed'
  },
  {
    id: 'data-002',
    title: 'Tally Marks',
    description: 'Use tally marks to record and count data.',
    strand: 'data-handling',
    icon: '📝',
    difficulty: 1,
    duration: '18 min',
    status: 'completed'
  },
  {
    id: 'data-003',
    title: 'Simple Pictographs',
    description: 'Read and create simple pictographs using pictures.',
    strand: 'data-handling',
    icon: '🖼️',
    difficulty: 2,
    duration: '20 min',
    status: 'available'
  },
  {
    id: 'data-004',
    title: 'Bar Graphs',
    description: 'Understand and create simple bar graphs.',
    strand: 'data-handling',
    icon: '📈',
    difficulty: 2,
    duration: '25 min',
    status: 'locked'
  },
  {
    id: 'data-005',
    title: 'Reading Data from Tables',
    description: 'Interpret information from simple data tables.',
    strand: 'data-handling',
    icon: '📋',
    difficulty: 2,
    duration: '20 min',
    status: 'locked'
  },
  {
    id: 'data-006',
    title: 'Comparing Data',
    description: 'Compare different sets of data using graphs.',
    strand: 'data-handling',
    icon: '⚡',
    difficulty: 3,
    duration: '25 min',
    status: 'locked'
  },
  {
    id: 'data-007',
    title: 'Survey and Data Collection',
    description: 'Conduct simple surveys and organize the results.',
    strand: 'data-handling',
    icon: '🗳️',
    difficulty: 3,
    duration: '30 min',
    status: 'locked'
  },
  {
    id: 'data-008',
    title: 'Interpreting Real Data',
    description: 'Interpret data from real-world sources like weather.',
    strand: 'data-handling',
    icon: '🌤️',
    difficulty: 3,
    duration: '28 min',
    status: 'locked'
  }
]
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


/* Preserved animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### FILE: src/main.tsx
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthGate } from './AuthGate';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
document.getElementById('tuc-splash-styles')?.remove();

```

### FILE: src/styles/components.css
```css
/* =================================================================
   CLASS 4 MATHEMATICS LEARNING SYSTEM - COMPONENTS
   Specialized UI components for lessons, assessments, and progress
   ================================================================= */

/* Loading Screen */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-gold) 0%, var(--background-cream) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.loading-content {
  text-align: center;
  color: var(--text-primary);
  max-width: 400px;
  padding: var(--space-6);
}

.loading-logo {
  margin-bottom: var(--space-6);
}

.logo-icon {
  font-size: 4rem;
  margin-bottom: var(--space-2);
  animation: bounce 2s infinite;
}

.loading-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-extrabold);
  margin-bottom: var(--space-1);
  color: var(--text-primary);
}

.loading-subtitle {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.loading-progress {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--white);
  border-radius: var(--radius-sm);
  width: 0%;
  animation: loadingProgress 2s ease-in-out forwards;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}

@keyframes loadingProgress {
  0% { width: 0%; }
  100% { width: 100%; }
}

/* Navigation */
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--white);
  border-bottom: 1px solid var(--border-light);
  box-shadow: 0 2px 12px var(--shadow-light);
  z-index: var(--z-fixed);
  backdrop-filter: blur(10px);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  min-height: 70px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.brand-icon {
  font-size: var(--font-size-2xl);
}

.nav-menu {
  display: flex;
  gap: var(--space-1);
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 44px;
}

.nav-item:hover {
  background: var(--primary-gold-light);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--primary-gold);
  color: var(--text-primary);
  font-weight: var(--font-weight-semibold);
}

.nav-icon {
  font-size: var(--font-size-lg);
}

.nav-label {
  display: none;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1);
  background: var(--primary-gold-light);
  border-radius: var(--radius-xl);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
  box-shadow: 0 2px 8px var(--shadow-light);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  line-height: 1.2;
}

.user-level {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  line-height: 1.2;
}

.role-switch {
  margin-left: var(--space-2);
}

/* Dashboard Components */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.stats-card {
  background: linear-gradient(135deg, var(--white) 0%, var(--primary-gold-light) 100%);
  border: none;
  box-shadow: 0 4px 16px var(--shadow-light);
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-3);
  margin-top: var(--space-3);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px var(--shadow-light);
}

.stat-icon {
  font-size: var(--font-size-xl);
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.stat-number {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  line-height: 1.2;
}

.continue-card {
  background: linear-gradient(135deg, var(--strand-number) 0%, var(--strand-algebra) 100%);
  color: var(--white);
  border: none;
}

.continue-card .card-title {
  color: var(--white);
}

.lesson-preview {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}

.lesson-thumbnail {
  flex-shrink: 0;
}

.thumbnail-bg {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.thumbnail-icon {
  font-size: var(--font-size-2xl);
}

.lesson-info {
  flex: 1;
  min-width: 0;
}

.lesson-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--white);
  margin-bottom: var(--space-1);
  line-height: 1.3;
}

.lesson-description {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--space-2);
  line-height: 1.4;
}

.progress-bar-small {
  margin-bottom: var(--space-1);
}

.progress-text {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.8);
}

.continue-btn {
  background: var(--white);
  color: var(--text-primary);
  border: none;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.continue-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.badges-card {
  background: linear-gradient(135deg, var(--white) 0%, var(--strand-data) 100%);
  border: none;
  color: var(--white);
}

.badges-card .card-title {
  color: var(--white);
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2);
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  backdrop-filter: blur(10px);
  transition: transform var(--transition-fast);
}

.badge-item:hover {
  transform: scale(1.05);
}

.badge-icon {
  font-size: var(--font-size-xl);
}

.badge-name {
  font-size: var(--font-size-xs);
  text-align: center;
  color: var(--white);
  font-weight: var(--font-weight-medium);
}

/* Strand Components */
.strands-overview {
  margin-top: var(--space-6);
}

.section-subtitle {
  font-size: var(--font-size-xl);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
  font-weight: var(--font-weight-bold);
}

.strands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-4);
}

.strand-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  box-shadow: 0 4px 16px var(--shadow-light);
  transition: all var(--transition-normal);
  cursor: pointer;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.strand-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--strand-number);
}

.strand-card.algebra::before {
  background: var(--strand-algebra);
}

.strand-card.geometry::before {
  background: var(--strand-geometry);
}

.strand-card.data-handling::before {
  background: var(--strand-data);
}

.strand-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px var(--shadow-medium);
  border-color: var(--primary-gold);
}

.strand-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.strand-icon {
  font-size: var(--font-size-2xl);
  padding: var(--space-2);
  border-radius: var(--radius-lg);
  background: var(--primary-gold-light);
}

.strand-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: 1.3;
}

.strand-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.progress-indicator {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  align-items: center;
}

.progress-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.radial-progress {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-circle {
  transform: rotate(-90deg);
}

.progress-track {
  fill: none;
  stroke: var(--border-light);
  stroke-width: 4;
}

.progress-fill {
  fill: none;
  stroke: var(--primary-gold);
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dasharray var(--transition-slow);
}

.algebra .progress-fill {
  stroke: var(--strand-algebra);
}

.geometry .progress-fill {
  stroke: var(--strand-geometry);
}

.data-handling .progress-fill {
  stroke: var(--strand-data);
}

.progress-percentage {
  position: absolute;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

/* Lesson Components */
.lesson-filter {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.filter-btn {
  padding: var(--space-2) var(--space-3);
  border: 2px solid var(--border-light);
  background: var(--white);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: var(--primary-gold);
  color: var(--text-primary);
}

.filter-btn.active {
  background: var(--primary-gold);
  border-color: var(--primary-gold);
  color: var(--text-primary);
  font-weight: var(--font-weight-semibold);
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-4);
}

.lesson-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  box-shadow: 0 4px 16px var(--shadow-light);
  transition: all var(--transition-normal);
  cursor: pointer;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.lesson-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--strand-number);
}

.lesson-card.completed::before {
  background: var(--strand-data);
}

.lesson-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px var(--shadow-medium);
  border-color: var(--primary-gold);
}

.lesson-card-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.lesson-card-icon {
  font-size: var(--font-size-xl);
  padding: var(--space-2);
  border-radius: var(--radius-md);
  background: var(--primary-gold-light);
}

.lesson-card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: 1.3;
}

.lesson-card-description {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-3);
  line-height: 1.4;
}

.lesson-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-light);
}

.lesson-difficulty {
  display: flex;
  gap: var(--space-1);
}

.difficulty-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-light);
}

.difficulty-dot.active {
  background: var(--primary-gold);
}

.lesson-duration {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.lesson-status {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status-completed {
  color: var(--strand-data);
}

.status-available {
  color: var(--strand-number);
}

.status-locked {
  color: var(--text-muted);
}

/* Assessment Components */
.assessments-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  align-items: start;
}

.assessment-card {
  background: linear-gradient(135deg, var(--strand-number) 0%, var(--strand-algebra) 100%);
  color: var(--white);
  border: none;
  text-align: center;
  grid-column: 1 / -1;
}

.assessment-card .card-title {
  color: var(--white);
  font-size: var(--font-size-2xl);
  margin-bottom: var(--space-2);
}

.assessment-card .card-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-4);
}

.assessment-meta {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.9);
}

.start-assessment-btn {
  background: var(--white);
  color: var(--text-primary);
  border: none;
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all var(--transition-normal);
  min-width: 200px;
}

.start-assessment-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.assessments-list {
  grid-column: 1 / -1;
}

.list-title {
  font-size: var(--font-size-xl);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
  font-weight: var(--font-weight-bold);
}

.assessment-item {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: 0 2px 12px var(--shadow-light);
  transition: all var(--transition-normal);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
  border: 2px solid transparent;
}

.assessment-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--shadow-medium);
  border-color: var(--primary-gold);
}

.assessment-info {
  flex: 1;
  min-width: 0;
}

.assessment-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
  line-height: 1.3;
}

.assessment-description {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
  line-height: 1.4;
}

.assessment-status {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status-completed {
  color: var(--strand-data);
}

.status-available {
  color: var(--strand-number);
}

.status-locked {
  color: var(--text-muted);
}

.assessment-score {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
  background: var(--primary-gold-light);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  min-width: 80px;
  justify-content: center;
}

.score-number {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.score-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.take-assessment-btn {
  background: var(--primary-gold);
  color: var(--text-primary);
  border: none;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.take-assessment-btn:hover {
  background: var(--primary-gold-hover);
  transform: translateY(-1px);
}

.locked-btn {
  background: var(--border-light);
  color: var(--text-muted);
  border: none;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: not-allowed;
}

/* Progress Components */
.progress-dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}

.progress-overview {
  grid-column: 1 / -1;
}

.overall-progress {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  margin-top: var(--space-3);
}

.progress-visual {
  position: relative;
  flex-shrink: 0;
}

.large-progress-circle {
  transform: rotate(-90deg);
}

.progress-track-large {
  fill: none;
  stroke: var(--border-light);
  stroke-width: 8;
}

.progress-fill-large {
  fill: none;
  stroke: var(--primary-gold);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dasharray var(--transition-slow);
}

.progress-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-percentage-large {
  display: block;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--text-primary);
  line-height: 1.2;
}

.progress-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.progress-stats {
  flex: 1;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--border-light);
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.stat-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.strand-progress-details {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  box-shadow: 0 4px 16px var(--shadow-light);
}

.strand-progress-item {
  margin-bottom: var(--space-4);
}

.strand-progress-item:last-child {
  margin-bottom: 0;
}

.strand-header-small {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.strand-icon-small {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-base);
  background: var(--primary-gold-light);
}

.strand-icon-small.number-operations {
  background: var(--strand-number);
  color: var(--white);
}

.strand-icon-small.algebra {
  background: var(--strand-algebra);
  color: var(--white);
}

.strand-icon-small.geometry {
  background: var(--strand-geometry);
  color: var(--white);
}

.strand-icon-small.data-handling {
  background: var(--strand-data);
  color: var(--white);
}

.strand-info-small {
  flex: 1;
}

.strand-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  line-height: 1.3;
}

.strand-completion {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.3;
}

.progress-bar-detailed {
  height: 8px;
  background: var(--border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.progress-fill-detailed {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-gold) 0%, var(--primary-gold-hover) 100%);
  border-radius: var(--radius-sm);
  transition: width var(--transition-slow);
}

.achievement-gallery {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  box-shadow: 0 4px 16px var(--shadow-light);
}

.badges-collection {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--space-3);
  margin-top: var(--space-3);
}

.badge-earned,
.badge-locked {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  text-align: center;
  transition: transform var(--transition-fast);
}

.badge-earned {
  background: linear-gradient(135deg, var(--primary-gold-light) 0%, var(--primary-gold) 100%);
  border: 2px solid var(--primary-gold);
}

.badge-locked {
  background: var(--border-light);
  border: 2px solid var(--border-medium);
  opacity: 0.7;
}

.badge-earned:hover,
.badge-locked:hover {
  transform: scale(1.05);
}

.badge-icon-large {
  font-size: var(--font-size-2xl);
  padding: var(--space-2);
  border-radius: 50%;
  background: var(--white);
  box-shadow: 0 2px 8px var(--shadow-light);
}

.badge-icon-large.locked {
  background: var(--text-muted);
  color: var(--white);
}

.badge-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  line-height: 1.3;
}

.badge-date,
.badge-requirement {
  font-size: var(--font-size-xs);
  line-height: 1.3;
}

.badge-date {
  color: var(--text-secondary);
}

.badge-requirement {
  color: var(--text-muted);
}

/* Virtual Manipulatives */
.manipulative-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background: var(--background-warm);
  border-radius: var(--radius-lg);
  margin: var(--space-4) 0;
  padding: var(--space-4);
}

.base-ten-blocks {
  display: grid;
  grid-template-columns: repeat(10, 30px);
  gap: 4px;
  margin: var(--space-2) 0;
}

.base-ten-block {
  width: 28px;
  height: 28px;
  background: var(--strand-number);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.base-ten-block:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px var(--shadow-medium);
}

.base-ten-block.placed {
  background: var(--strand-data);
}

.number-line {
  display: flex;
  align-items: center;
  height: 60px;
  position: relative;
  margin: var(--space-4) 0;
}

.line {
  width: 100%;
  height: 2px;
  background: var(--text-primary);
  position: relative;
}

.tick {
  position: absolute;
  width: 2px;
  height: 15px;
  background: var(--text-primary);
  top: 50%;
  transform: translateY(-50%);
}

.tick-label {
  position: absolute;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  top: 20px;
  transform: translateX(-50%);
}

.number-token {
  position: absolute;
  width: 30px;
  height: 30px;
  background: var(--primary-gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  z-index: 10;
}

.number-token:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px var(--shadow-medium);
}

/* Quiz Components */
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: 0 4px 16px var(--shadow-light);
  overflow: hidden;
}

.quiz-header {
  background: var(--primary-gold);
  padding: var(--space-4);
  text-align: center;
}

.quiz-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.quiz-progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.quiz-timer {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.quiz-content {
  padding: var(--space-6);
}

.question {
  margin-bottom: var(--space-6);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.question-number {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.question-text {
  font-size: var(--font-size-xl);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
  line-height: 1.4;
}

.question-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.option {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--background-warm);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 44px;
}

.option:hover {
  border-color: var(--primary-gold);
  background: var(--primary-gold-light);
}

.option.selected {
  border-color: var(--primary-gold);
  background: var(--primary-gold-light);
  font-weight: var(--font-weight-semibold);
}

.option.correct {
  border-color: var(--strand-data);
  background: var(--strand-data);
  color: var(--white);
}

.option.incorrect {
  border-color: #e74c3c;
  background: #e74c3c;
  color: var(--white);
}

.option-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: var(--white);
  color: var(--text-primary);
  border-radius: 50%;
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
}

.option.correct .option-label,
.option.incorrect .option-label {
  background: rgba(255, 255, 255, 0.2);
  color: var(--white);
}

.quiz-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  background: var(--background-warm);
  border-top: 1px solid var(--border-light);
}

.btn-quiz {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-semibold);
  transition: all var(--transition-fast);
  min-width: 120px;
}

.btn-quiz:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quiz-feedback {
  margin-top: var(--space-4);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  text-align: center;
  font-weight: var(--font-weight-semibold);
}

.feedback-correct {
  background: var(--strand-data);
  color: var(--white);
}

.feedback-incorrect {
  background: #e74c3c;
  color: var(--white);
}

.quiz-results {
  text-align: center;
  padding: var(--space-6);
}

.results-score {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.results-message {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
}

.results-breakdown {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.breakdown-item {
  padding: var(--space-3);
  background: var(--background-warm);
  border-radius: var(--radius-lg);
}

.breakdown-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-1);
}

.breakdown-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

/* Animation utilities */
.fade-in {
  animation: fadeIn var(--transition-normal) ease-out;
}

.slide-in-up {
  animation: slideInUp var(--transition-normal) ease-out;
}

.bounce-in {
  animation: bounceIn var(--transition-slow) ease-out;
}

.pulse {
  animation: pulse 2s infinite;
}

.shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}
```

### FILE: src/styles/main.css
```css
/* =================================================================
   CLASS 4 MATHEMATICS LEARNING SYSTEM - MAIN STYLES
   Responsive, accessible, and child-friendly design
   ================================================================= */

/* CSS Custom Properties (Design System) */
:root {
  /* Primary Colors */
  --primary-gold: #FFC02D;
  --primary-gold-hover: #e6a91a;
  --primary-gold-light: #FFF3CC;
  --background-warm: #FAF8F2;
  --background-cream: #FFF8E1;
  
  /* Strand Colors */
  --strand-number: #4A90E2;
  --strand-algebra: #E91E63;
  --strand-geometry: #9C27B0;
  --strand-data: #4CAF50;
  
  /* Neutral Colors */
  --text-primary: #2C3E50;
  --text-secondary: #7F8C8D;
  --text-muted: #BDC3C7;
  --border-light: #E8E8E8;
  --border-medium: #D5D5D5;
  --white: #FFFFFF;
  --shadow-light: rgba(0, 0, 0, 0.08);
  --shadow-medium: rgba(0, 0, 0, 0.12);
  --shadow-heavy: rgba(0, 0, 0, 0.24);
  
  /* Typography Scale */
  --font-family-primary: 'Nunito', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  
  /* Spacing System (8px grid) */
  --space-1: 0.5rem;   /* 8px */
  --space-2: 1rem;     /* 16px */
  --space-3: 1.5rem;   /* 24px */
  --space-4: 2rem;     /* 32px */
  --space-5: 2.5rem;   /* 40px */
  --space-6: 3rem;     /* 48px */
  --space-8: 4rem;     /* 64px */
  --space-10: 5rem;    /* 80px */
  --space-12: 6rem;    /* 96px */
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  
  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Z-index scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal: 1040;
  --z-tooltip: 1070;
}

/* Base Typography */
body {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: 1.6;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--background-warm) 0%, var(--background-cream) 100%);
  min-height: 100vh;
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
  margin: 0;
}

h1 { font-size: var(--font-size-4xl); }
h2 { font-size: var(--font-size-3xl); }
h3 { font-size: var(--font-size-2xl); }
h4 { font-size: var(--font-size-xl); }
h5 { font-size: var(--font-size-lg); }
h6 { font-size: var(--font-size-base); }

/* Paragraph */
p {
  margin: 0;
  line-height: 1.6;
}

/* Links */
a {
  color: var(--strand-number);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--primary-gold);
}

/* Lists */
ul, ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  text-decoration: none;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  min-height: 44px; /* Accessibility touch target */
  position: relative;
  overflow: hidden;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-gold);
  color: var(--text-primary);
  box-shadow: 0 2px 8px var(--shadow-light);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-gold-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--shadow-medium);
}

.btn-secondary {
  background: var(--white);
  color: var(--text-primary);
  border: 2px solid var(--border-light);
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--primary-gold);
  color: var(--primary-gold);
}

.btn-outline {
  background: transparent;
  color: var(--primary-gold);
  border: 2px solid var(--primary-gold);
}

.btn-outline:hover:not(:disabled) {
  background: var(--primary-gold);
  color: var(--text-primary);
}

/* Button Sizes */
.btn-sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-size-sm);
  min-height: 36px;
}

.btn-lg {
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-lg);
  min-height: 52px;
}

/* Card Components */
.card {
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: 0 2px 12px var(--shadow-light);
  padding: var(--space-4);
  transition: all var(--transition-normal);
  border: 1px solid var(--border-light);
}

.card:hover {
  box-shadow: 0 4px 20px var(--shadow-medium);
  transform: translateY(-2px);
}

.card-header {
  margin-bottom: var(--space-3);
}

.card-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.card-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.card-body {
  color: var(--text-primary);
  line-height: 1.6;
}

.card-footer {
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-light);
}

/* Form Elements */
.form-group {
  margin-bottom: var(--space-4);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.form-input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-base);
  font-family: var(--font-family-primary);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-md);
  background: var(--white);
  transition: border-color var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-gold);
  box-shadow: 0 0 0 3px rgba(255, 192, 45, 0.1);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Progress Components */
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-gold) 0%, var(--primary-gold-hover) 100%);
  border-radius: var(--radius-sm);
  transition: width var(--transition-slow);
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-bar-large {
  height: 12px;
  border-radius: var(--radius-md);
}

.progress-fill-large {
  border-radius: var(--radius-md);
}

.progress-bar-small {
  height: 6px;
  border-radius: var(--radius-xs);
}

.progress-fill-small {
  border-radius: var(--radius-xs);
}

/* Utility Classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.font-light { font-weight: var(--font-weight-light); }
.font-normal { font-weight: var(--font-weight-normal); }
.font-medium { font-weight: var(--font-weight-medium); }
.font-semibold { font-weight: var(--font-weight-semibold); }
.font-bold { font-weight: var(--font-weight-bold); }
.font-extrabold { font-weight: var(--font-weight-extrabold); }

.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }
.text-2xl { font-size: var(--font-size-2xl); }
.text-3xl { font-size: var(--font-size-3xl); }
.text-4xl { font-size: var(--font-size-4xl); }

.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-muted { color: var(--text-muted); }
.text-white { color: var(--white); }

.bg-primary { background-color: var(--primary-gold); }
.bg-white { background-color: var(--white); }
.bg-light { background-color: var(--background-warm); }

.rounded { border-radius: var(--radius-md); }
.rounded-lg { border-radius: var(--radius-lg); }
.rounded-xl { border-radius: var(--radius-xl); }
.rounded-2xl { border-radius: var(--radius-2xl); }

.shadow-sm { box-shadow: 0 1px 2px var(--shadow-light); }
.shadow { box-shadow: 0 2px 4px var(--shadow-light); }
.shadow-md { box-shadow: 0 4px 6px var(--shadow-medium); }
.shadow-lg { box-shadow: 0 10px 15px var(--shadow-medium); }
.shadow-xl { box-shadow: 0 20px 25px var(--shadow-heavy); }

.hidden { display: none !important; }
.invisible { visibility: hidden; }
.visible { visibility: visible; }

.opacity-0 { opacity: 0; }
.opacity-25 { opacity: 0.25; }
.opacity-50 { opacity: 0.5; }
.opacity-75 { opacity: 0.75; }
.opacity-100 { opacity: 1; }

.transition { transition: all var(--transition-normal); }
.transition-fast { transition: all var(--transition-fast); }
.transition-slow { transition: all var(--transition-slow); }

/* Layout Utilities */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.items-end { align-items: flex-end; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-start { justify-content: flex-start; }
.justify-end { justify-content: flex-end; }

.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }
.gap-6 { gap: var(--space-6); }

.w-full { width: 100%; }
.h-full { height: 100%; }
.min-h-screen { min-height: 100vh; }

/* Spacing Utilities */
.m-0 { margin: 0; }
.m-1 { margin: var(--space-1); }
.m-2 { margin: var(--space-2); }
.m-3 { margin: var(--space-3); }
.m-4 { margin: var(--space-4); }
.m-6 { margin: var(--space-6); }
.m-8 { margin: var(--space-8); }

.p-0 { padding: 0; }
.p-1 { padding: var(--space-1); }
.p-2 { padding: var(--space-2); }
.p-3 { padding: var(--space-3); }
.p-4 { padding: var(--space-4); }
.p-6 { padding: var(--space-6); }
.p-8 { padding: var(--space-8); }

.mx-auto { margin-left: auto; margin-right: auto; }
.my-2 { margin-top: var(--space-2); margin-bottom: var(--space-2); }
.my-4 { margin-top: var(--space-4); margin-bottom: var(--space-4); }
.my-6 { margin-top: var(--space-6); margin-bottom: var(--space-6); }
.my-8 { margin-top: var(--space-8); margin-bottom: var(--space-8); }

.px-2 { padding-left: var(--space-2); padding-right: var(--space-2); }
.px-4 { padding-left: var(--space-4); padding-right: var(--space-4); }
.px-6 { padding-left: var(--space-6); padding-right: var(--space-6); }
.py-2 { padding-top: var(--space-2); padding-bottom: var(--space-2); }
.py-4 { padding-top: var(--space-4); padding-bottom: var(--space-4); }
.py-6 { padding-top: var(--space-6); padding-bottom: var(--space-6); }

/* Position Utilities */
.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
.sticky { position: sticky; }

.top-0 { top: 0; }
.right-0 { right: 0; }
.bottom-0 { bottom: 0; }
.left-0 { left: 0; }

.z-10 { z-index: 10; }
.z-20 { z-index: 20; }
.z-30 { z-index: 30; }
.z-40 { z-index: 40; }
.z-50 { z-index: 50; }

/* Transform Utilities */
.transform { transform: translateZ(0); }
.scale-95 { transform: scale(0.95); }
.scale-100 { transform: scale(1); }
.scale-105 { transform: scale(1.05); }
.rotate-0 { transform: rotate(0deg); }
.rotate-90 { transform: rotate(90deg); }
.rotate-180 { transform: rotate(180deg); }

.hover\:scale-105:hover { transform: scale(1.05); }
.hover\:rotate-90:hover { transform: rotate(90deg); }

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-gold);
  color: var(--text-primary);
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
  border-radius: var(--radius-sm);
}

  top: .skip-link:focus {
6px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .card {
    border: 2px solid var(--text-primary);
  }
  
  .btn {
    border: 2px solid currentColor;
  }
  
  .progress-bar {
    border: 1px solid var(--text-primary);
  }
}
```

### FILE: src/styles/responsive.css
```css
/* =================================================================
   CLASS 4 MATHEMATICS LEARNING SYSTEM - RESPONSIVE STYLES
   Mobile-first responsive design for tablets and phones
   ================================================================= */

/* Mobile-first approach: Base styles for mobile, then enhance for larger screens */

/* Mobile Styles (default - up to 767px) */
@media (max-width: 767px) {
  .main-content {
    padding: 1rem;
    padding-top: 80px; /* Adjusted for mobile navigation */
  }
  
  /* Navigation adjustments for mobile */
  .nav-container {
    padding: var(--space-2) var(--space-3);
    min-height: 60px;
  }
  
  .nav-brand {
    font-size: var(--font-size-base);
    gap: var(--space-1);
  }
  
  .brand-icon {
    font-size: var(--font-size-xl);
  }
  
  .nav-menu {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--white);
    border-top: 1px solid var(--border-light);
    padding: var(--space-2);
    justify-content: space-around;
    z-index: var(--z-fixed);
    box-shadow: 0 -2px 12px var(--shadow-light);
  }
  
  .nav-item {
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-1);
    min-height: auto;
    text-align: center;
  }
  
  .nav-icon {
    font-size: var(--font-size-xl);
  }
  
  .nav-label {
    display: block;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
  }
  
  .nav-user {
    display: none; /* Hide user info on mobile nav */
  }
  
  .role-switch {
    display: none; /* Hide role switch on mobile */
  }
  
  /* Main content spacing adjustments */
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }
  
  .strands-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
  
  .lessons-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
  
  .assessments-container {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  
  .progress-dashboard {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  
  /* Continue learning card adjustments */
  .lesson-preview {
    flex-direction: column;
    text-align: center;
    gap: var(--space-2);
  }
  
  .lesson-thumbnail {
    margin-bottom: var(--space-2);
  }
  
  .continue-btn {
    width: 100%;
  }
  
  /* Stats grid adjustments */
  .stats-row {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
  
  .stat-item {
    justify-content: center;
    text-align: center;
  }
  
  /* Overall progress adjustments */
  .overall-progress {
    flex-direction: column;
    text-align: center;
    gap: var(--space-4);
  }
  
  .progress-visual {
    flex-shrink: 0;
  }
  
  /* Quiz adjustments for mobile */
  .quiz-container {
    margin: 0;
    border-radius: 0;
  }
  
  .quiz-header {
    padding: var(--space-3);
  }
  
  .quiz-content {
    padding: var(--space-4);
  }
  
  .quiz-progress {
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .quiz-controls {
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .btn-quiz {
    width: 100%;
  }
  
  /* Modal adjustments for mobile */
  .modal-content {
    margin: var(--space-2);
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
  }
  
  /* Form adjustments for mobile */
  .form-group {
    margin-bottom: var(--space-3);
  }
  
  .form-input,
  .form-select {
    font-size: 16px; /* Prevent zoom on iOS */
  }
  
  /* Button adjustments for mobile */
  .btn {
    min-height: 48px; /* Larger touch targets */
    padding: var(--space-3) var(--space-4);
  }
  
  .btn-sm {
    min-height: 40px;
    padding: var(--space-2) var(--space-3);
  }
  
  .btn-lg {
    min-height: 56px;
    padding: var(--space-4) var(--space-6);
  }
  
  /* Badge collection adjustments */
  .badges-collection {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-2);
  }
  
  /* Strand card adjustments */
  .strand-card {
    padding: var(--space-3);
  }
  
  .strand-header {
    flex-direction: column;
    text-align: center;
    gap: var(--space-1);
  }
  
  .strand-icon {
    font-size: var(--font-size-xl);
    padding: var(--space-1);
  }
  
  .strand-progress {
    flex-direction: column;
    gap: var(--space-2);
  }
  
  /* Filter buttons for mobile */
  .lesson-filter {
    gap: var(--space-1);
    overflow-x: auto;
    padding-bottom: var(--space-1);
    -webkit-overflow-scrolling: touch;
  }
  
  .filter-btn {
    white-space: nowrap;
    padding: var(--space-1) var(--space-2);
    font-size: var(--font-size-xs);
  }
  
  /* Assessment meta for mobile */
  .assessment-meta {
    flex-direction: column;
    gap: var(--space-2);
    text-align: center;
  }
  
  .start-assessment-btn {
    width: 100%;
    min-width: auto;
  }
  
  .assessment-item {
    flex-direction: column;
    gap: var(--space-3);
    text-align: center;
  }
  
  .assessment-score {
    width: 100%;
  }
  
  /* Virtual manipulatives for mobile */
  .base-ten-blocks {
    grid-template-columns: repeat(5, 30px);
    gap: 2px;
  }
  
  .base-ten-block {
    width: 26px;
    height: 26px;
    font-size: 10px;
  }
  
  .number-token {
    width: 25px;
    height: 25px;
    font-size: var(--font-size-xs);
  }
  
  /* Results breakdown for mobile */
  .results-breakdown {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
}

/* Tablet Styles (768px to 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .main-content {
    padding: var(--space-4);
    padding-top: 90px;
  }
  
  /* Navigation for tablets */
  .nav-container {
    padding: var(--space-3) var(--space-4);
    min-height: 70px;
  }
  
  .nav-brand {
    font-size: var(--font-size-lg);
  }
  
  .nav-item {
    padding: var(--space-2);
    font-size: var(--font-size-sm);
  }
  
  .nav-label {
    display: block;
    font-size: var(--font-size-xs);
  }
  
  .user-info {
    display: flex;
  }
  
  /* Grid adjustments for tablets */
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }
  
  .strands-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .lessons-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .assessments-container {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }
  
  .progress-dashboard {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }
  
  /* Overall progress for tablets */
  .overall-progress {
    gap: var(--space-5);
  }
  
  /* Lesson preview for tablets */
  .lesson-preview {
    gap: var(--space-4);
  }
  
  /* Stats row for tablets */
  .stats-row {
    grid-template-columns: repeat(3, 1fr);
  }
  
  /* Quiz adjustments for tablets */
  .quiz-container {
    max-width: 90%;
  }
  
  .quiz-content {
    padding: var(--space-5);
  }
  
  .question-options {
    gap: var(--space-4);
  }
  
  /* Virtual manipulatives for tablets */
  .base-ten-blocks {
    grid-template-columns: repeat(8, 30px);
  }
  
  .base-ten-block {
    width: 28px;
    height: 28px;
  }
  
  /* Badge collection for tablets */
  .badges-collection {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Desktop Styles (1024px and up) */
@media (min-width: 1024px) {
  .main-content {
    padding: var(--space-6);
    padding-top: 100px;
  }
  
  /* Navigation for desktop */
  .nav-container {
    padding: var(--space-4) var(--space-6);
    min-height: 80px;
  }
  
  .nav-brand {
    font-size: var(--font-size-xl);
  }
  
  .nav-item {
    padding: var(--space-3) var(--space-4);
    font-size: var(--font-size-base);
  }
  
  .nav-label {
    display: inline;
    font-size: var(--font-size-sm);
  }
  
  .user-avatar {
    width: 48px;
    height: 48px;
  }
  
  .user-info {
    display: flex;
  }
  
  .user-name {
    font-size: var(--font-size-base);
  }
  
  .user-level {
    font-size: var(--font-size-sm);
  }
  
  /* Grid adjustments for desktop */
  .dashboard-grid {
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--space-5);
  }
  
  .strands-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .lessons-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .assessments-container {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-6);
  }
  
  .progress-dashboard {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-6);
  }
  
  /* Overall progress for desktop */
  .overall-progress {
    gap: var(--space-6);
  }
  
  /* Quiz adjustments for desktop */
  .quiz-container {
    max-width: 800px;
  }
  
  .quiz-content {
    padding: var(--space-6);
  }
  
  .question-options {
    gap: var(--space-4);
  }
  
  /* Virtual manipulatives for desktop */
  .base-ten-blocks {
    grid-template-columns: repeat(10, 32px);
  }
  
  .base-ten-block {
    width: 30px;
    height: 30px;
  }
  
  /* Badge collection for desktop */
  .badges-collection {
    grid-template-columns: repeat(4, 1fr);
  }
  
  /* Modal adjustments for desktop */
  .modal-content {
    max-width: 900px;
    margin: var(--space-4) auto;
  }
}

/* Large Desktop Styles (1200px and up) */
@media (min-width: 1200px) {
  .main-content {
    padding: var(--space-8);
    padding-top: 100px;
    max-width: 1400px;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: var(--space-6);
  }
  
  .lessons-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .strands-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .badges-collection {
    grid-template-columns: repeat(6, 1fr);
  }
}

/* High DPI / Retina Displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .btn,
  .card,
  .nav-item {
    /* Crisp edges on high DPI displays */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* Landscape orientation for mobile */
@media (max-width: 767px) and (orientation: landscape) {
  .main-content {
    padding: var(--space-2) var(--space-4);
    padding-top: 60px;
  }
  
  .nav-container {
    min-height: 50px;
    padding: var(--space-1) var(--space-3);
  }
  
  .nav-brand {
    font-size: var(--font-size-sm);
  }
  
  .nav-menu {
    padding: var(--space-1);
  }
  
  .nav-icon {
    font-size: var(--font-size-lg);
  }
  
  .nav-label {
    font-size: 10px;
  }
}

/* Print styles */
@media print {
  .navigation,
  .nav-menu,
  .role-switch,
  .quiz-controls,
  .btn,
  .modal {
    display: none !important;
  }
  
  .main-content {
    padding: 0;
    padding-top: 0;
    max-width: none;
  }
  
  .card,
  .strand-card,
  .lesson-card {
    box-shadow: none;
    border: 1px solid var(--border-light);
    break-inside: avoid;
    margin-bottom: var(--space-3);
  }
  
  .dashboard-grid,
  .strands-grid,
  .lessons-grid {
    display: block;
  }
  
  .strand-card,
  .lesson-card {
    margin-bottom: var(--space-4);
  }
  
  .progress-fill,
  .progress-fill-large {
    background: var(--text-primary) !important;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* High contrast mode adjustments */
@media (prefers-contrast: high) {
  .card,
  .strand-card,
  .lesson-card {
    border: 2px solid var(--text-primary);
  }
  
  .btn {
    border: 2px solid currentColor;
  }
  
  .btn-primary {
    background: var(--text-primary);
    color: var(--background-warm);
  }
  
  .progress-bar,
  .progress-bar-large {
    border: 1px solid var(--text-primary);
  }
  
  .option {
    border: 2px solid var(--text-primary);
  }
  
  .option.selected {
    background: var(--text-primary);
    color: var(--background-warm);
  }
}

/* Dark mode support (if needed) */
@media (prefers-color-scheme: dark) {
  /* Optional: Add dark mode styles here */
  /* For now, keeping the warm, child-friendly color scheme */
}

/* Focus styles for keyboard navigation */
@media (pointer: coarse) {
  /* Larger touch targets for touch devices */
  .btn {
    min-height: 48px;
    padding: var(--space-3) var(--space-4);
  }
  
  .nav-item {
    min-height: 48px;
    padding: var(--space-3) var(--space-4);
  }
  
  .option {
    min-height: 48px;
    padding: var(--space-3);
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: no-preference) {
  /* Only apply animations if user hasn't requested reduced motion */
  .card:hover,
  .strand-card:hover,
  .lesson-card:hover {
    transform: translateY(-4px);
  }
  
  .btn:hover:not(:disabled) {
    transform: translateY(-1px);
  }
}

/* Specific component responsive adjustments */

/* Loading screen responsive */
@media (max-width: 767px) {
  .loading-content {
    padding: var(--space-4);
    max-width: 300px;
  }
  
  .logo-icon {
    font-size: 3rem;
  }
  
  .loading-title {
    font-size: var(--font-size-3xl);
  }
}

/* Navigation role switch responsive */
@media (max-width: 767px) {
  .role-switch {
    display: none;
  }
}

@media (min-width: 768px) {
  .role-switch {
    margin-left: var(--space-4);
  }
}

/* Breadcrumb navigation for desktop */
@media (min-width: 1024px) {
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-4);
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }
  
  .breadcrumb-item {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }
  
  .breadcrumb-separator {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
  }
  
  .breadcrumb-link {
    color: var(--text-secondary);
    text-decoration: none;
  }
  
  .breadcrumb-link:hover {
    color: var(--primary-gold);
  }
}

/* Sidebar for desktop */
@media (min-width: 1200px) {
  .app-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: var(--space-6);
    max-width: 1600px;
    margin: 0 auto;
  }
  
  .sidebar {
    position: sticky;
    top: 100px;
    height: fit-content;
    background: var(--white);
    border-radius: var(--radius-xl);
    padding: var(--space-4);
    box-shadow: 0 4px 16px var(--shadow-light);
  }
  
  .main-content {
    padding: var(--space-6);
  }
}
```

### FILE: src/vite-env.d.ts
```typescript
/// <reference types="vite/client" />

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — class4-math-learning-system
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('class4-math-learning-system E2E', () => {
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

### FILE: styles/components.css
```css
/* Golden Mathematics Class 4 - Component Styles */
/* Additional UI Components */

/* Button Components */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    border: none;
    border-radius: var(--radius-sm);
    font-family: var(--font-family);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;
    min-height: 44px;
    min-width: 120px;
}

.btn-primary {
    background: var(--primary-500);
    color: white;
    box-shadow: var(--shadow-soft);
}

.btn-primary:hover {
    background: var(--primary-700);
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
}

.btn-secondary {
    background: var(--bg-surface);
    color: var(--text-primary);
    border: 2px solid var(--text-secondary);
}

.btn-secondary:hover {
    border-color: var(--primary-500);
    color: var(--primary-700);
    transform: translateY(-2px);
}

.btn-large {
    padding: var(--space-md) var(--space-lg);
    font-size: 18px;
    min-height: 56px;
    min-width: 200px;
}

.btn-full-width {
    width: 100%;
}

/* Strand Filter */
.strand-filter {
    display: flex;
    gap: var(--space-sm);
    margin-bottom: var(--space-xl);
    flex-wrap: wrap;
    justify-content: center;
}

.filter-btn {
    padding: var(--space-xs) var(--space-md);
    background: var(--bg-surface);
    border: 2px solid var(--text-secondary);
    border-radius: var(--radius-pill);
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.filter-btn:hover {
    border-color: var(--primary-500);
    color: var(--primary-700);
    transform: translateY(-2px);
}

.filter-btn.active {
    background: var(--primary-500);
    border-color: var(--primary-500);
    color: white;
    box-shadow: var(--shadow-soft);
}

/* Lessons Grid */
.lessons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-lg);
}

.lesson-card {
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    box-shadow: var(--shadow-soft);
    transition: all var(--transition-medium);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border-left: 6px solid transparent;
}

.lesson-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-medium);
}

.lesson-card.number-operations {
    border-left-color: var(--number-operations);
}

.lesson-card.algebra {
    border-left-color: var(--algebra);
}

.lesson-card.geometry {
    border-left-color: var(--geometry);
}

.lesson-card.data-handling {
    border-left-color: var(--data-handling);
}

.lesson-card-header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
}

.lesson-card-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
}

.lesson-card.number-operations .lesson-card-icon {
    background: linear-gradient(135deg, var(--number-operations) 0%, #1D4ED8 100%);
}

.lesson-card.algebra .lesson-card-icon {
    background: linear-gradient(135deg, var(--algebra) 0%, #BE185D 100%);
}

.lesson-card.geometry .lesson-card-icon {
    background: linear-gradient(135deg, var(--geometry) 0%, #7C3AED 100%);
}

.lesson-card.data-handling .lesson-card-icon {
    background: linear-gradient(135deg, var(--data-handling) 0%, #059669 100%);
}

.lesson-card-title {
    font-size: 20px;
    color: var(--text-primary);
    margin-bottom: var(--space-xs);
}

.lesson-card-description {
    font-size: 16px;
    color: var(--text-secondary);
    margin-bottom: var(--space-md);
    line-height: 1.5;
}

.lesson-card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-sm);
}

.lesson-meta-item {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-size: 14px;
    color: var(--text-secondary);
}

.lesson-difficulty {
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-pill);
    font-size: 12px;
    font-weight: 600;
}

.difficulty-easy {
    background: rgba(34, 197, 94, 0.1);
    color: var(--success);
}

.difficulty-medium {
    background: rgba(245, 158, 11, 0.1);
    color: var(--warning);
}

.difficulty-hard {
    background: rgba(239, 68, 68, 0.1);
    color: var(--error);
}

/* Assessment Components */
.assessments-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
}

.assessment-card {
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    box-shadow: var(--shadow-soft);
    text-align: center;
}

.assessment-card .card-description {
    margin-bottom: var(--space-md);
}

.assessment-meta {
    display: flex;
    justify-content: center;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
    flex-wrap: wrap;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-size: 14px;
    color: var(--text-secondary);
    padding: var(--space-xs) var(--space-sm);
    background: var(--bg-page);
    border-radius: var(--radius-pill);
}

.assessments-list {
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    box-shadow: var(--shadow-soft);
}

.list-title {
    margin-bottom: var(--space-md);
    color: var(--text-primary);
}

.assessment-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md);
    border: 2px solid var(--bg-page);
    border-radius: var(--radius-sm);
    margin-bottom: var(--space-sm);
    transition: all var(--transition-fast);
}

.assessment-item:hover {
    border-color: var(--primary-100);
    background: var(--primary-100);
}

.assessment-info {
    flex: 1;
}

.assessment-title {
    font-size: 18px;
    color: var(--text-primary);
    margin-bottom: var(--space-xs);
}

.assessment-description {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: var(--space-sm);
}

.assessment-status {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-size: 12px;
    font-weight: 600;
}

.assessment-status.completed {
    color: var(--success);
}

.assessment-status.available {
    color: var(--primary-500);
}

.assessment-status.locked {
    color: var(--text-secondary);
}

.assessment-score {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-weight: 800;
    font-size: 24px;
    color: var(--success);
}

.score-number {
    font-size: 32px;
}

.take-assessment-btn,
.start-assessment-btn {
    background: var(--primary-500);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    padding: var(--space-sm) var(--space-md);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.take-assessment-btn:hover,
.start-assessment-btn:hover {
    background: var(--primary-700);
    transform: translateY(-2px);
    box-shadow: var(--shadow-soft);
}

.locked-btn {
    background: var(--text-secondary);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    padding: var(--space-sm) var(--space-md);
    font-size: 14px;
    font-weight: 600;
    cursor: not-allowed;
}

/* Interactive Lesson Content */
.lesson-container {
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    padding: var(--space-xl);
    box-shadow: var(--shadow-soft);
    max-width: 800px;
    margin: 0 auto;
}

.lesson-header {
    text-align: center;
    margin-bottom: var(--space-xl);
}

.lesson-number {
    display: inline-block;
    background: var(--primary-100);
    color: var(--primary-700);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-pill);
    font-size: 14px;
    font-weight: 600;
    margin-bottom: var(--space-sm);
}

.lesson-title-large {
    font-size: 36px;
    color: var(--text-primary);
    margin-bottom: var(--space-sm);
}

.lesson-objective {
    font-size: 18px;
    color: var(--text-secondary);
    font-style: italic;
}

.lesson-progress {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-xl);
    padding: var(--space-md);
    background: var(--bg-page);
    border-radius: var(--radius-sm);
}

.progress-step {
    flex: 1;
    text-align: center;
    padding: var(--space-sm);
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 600;
    transition: all var(--transition-fast);
}

.progress-step.completed {
    background: var(--success);
    color: white;
}

.progress-step.current {
    background: var(--primary-500);
    color: white;
}

.progress-step.upcoming {
    background: var(--bg-surface);
    color: var(--text-secondary);
    border: 2px solid var(--bg-page);
}

.lesson-content {
    margin-bottom: var(--space-xl);
}

.instruction-box {
    background: var(--primary-100);
    border-left: 4px solid var(--primary-500);
    padding: var(--space-md);
    border-radius: var(--radius-sm);
    margin-bottom: var(--space-md);
}

.instruction-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-700);
    margin-bottom: var(--space-xs);
}

.instruction-text {
    color: var(--text-primary);
}

/* Interactive Elements */
.interactive-area {
    background: var(--bg-page);
    border-radius: var(--radius-sm);
    padding: var(--space-xl);
    margin: var(--space-lg) 0;
    text-align: center;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.math-problem {
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-lg);
}

.answer-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
}

.answer-btn {
    background: var(--bg-surface);
    border: 2px solid var(--text-secondary);
    border-radius: var(--radius-sm);
    padding: var(--space-md);
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    cursor: pointer;
    transition: all var(--transition-fast);
    min-height: 60px;
}

.answer-btn:hover {
    border-color: var(--primary-500);
    color: var(--primary-700);
    transform: translateY(-2px);
    box-shadow: var(--shadow-soft);
}

.answer-btn.selected {
    background: var(--primary-100);
    border-color: var(--primary-500);
    color: var(--primary-700);
}

.answer-btn.correct {
    background: var(--success);
    border-color: var(--success);
    color: white;
}

.answer-btn.incorrect {
    background: var(--error);
    border-color: var(--error);
    color: white;
    animation: shake 0.5s ease-in-out;
}

.feedback-area {
    margin-top: var(--space-lg);
    padding: var(--space-md);
    border-radius: var(--radius-sm);
    text-align: center;
}

.feedback-correct {
    background: rgba(34, 197, 94, 0.1);
    color: var(--success);
    border: 2px solid var(--success);
}

.feedback-incorrect {
    background: rgba(239, 68, 68, 0.1);
    color: var(--error);
    border: 2px solid var(--error);
}

.lesson-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--space-xl);
    padding-top: var(--space-md);
    border-top: 2px solid var(--bg-page);
}

.nav-btn {
    background: var(--bg-surface);
    border: 2px solid var(--text-secondary);
    color: var(--text-secondary);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-sm);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    gap: var(--space-xs);
}

.nav-btn:hover:not(:disabled) {
    border-color: var(--primary-500);
    color: var(--primary-700);
    transform: translateY(-2px);
}

.nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.nav-btn-primary {
    background: var(--primary-500);
    border-color: var(--primary-500);
    color: white;
}

.nav-btn-primary:hover:not(:disabled) {
    background: var(--primary-700);
    border-color: var(--primary-700);
}

/* Modal Styles */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    opacity: 1;
    visibility: visible;
    transition: all var(--transition-medium);
}

.modal.hidden {
    opacity: 0;
    visibility: hidden;
}

.modal-content {
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
    box-shadow: var(--shadow-medium);
    animation: modalSlideIn 0.3s ease-out;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-lg);
    border-bottom: 2px solid var(--bg-page);
}

.modal-title {
    font-size: 24px;
    color: var(--text-primary);
}

.modal-close {
    background: none;
    border: none;
    font-size: 32px;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--space-xs);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
}

.modal-close:hover {
    background: var(--bg-page);
    color: var(--text-primary);
}

.modal-body {
    padding: var(--space-lg);
}

/* Progress Dashboard */
.progress-dashboard {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
}

.progress-overview {
    grid-column: 1 / -1;
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    box-shadow: var(--shadow-soft);
}

.overall-progress {
    display: flex;
    align-items: center;
    gap: var(--space-xl);
}

.progress-visual {
    position: relative;
}

.large-progress-circle {
    transform: rotate(-90deg);
}

.progress-track-large {
    fill: none;
    stroke: var(--bg-page);
    stroke-width: 12;
}

.progress-fill-large {
    fill: none;
    stroke: var(--primary-500);
    stroke-width: 12;
    stroke-linecap: round;
    transition: stroke-dasharray var(--transition-bouncy);
}

.progress-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.progress-percentage-large {
    display: block;
    font-size: 32px;
    font-weight: 800;
    color: var(--text-primary);
}

.progress-label {
    font-size: 14px;
    color: var(--text-secondary);
}

.progress-stats {
    flex: 1;
}

.stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm) 0;
    border-bottom: 1px solid var(--bg-page);
}

.stat-row:last-child {
    border-bottom: none;
}

.stat-label {
    font-size: 16px;
    color: var(--text-secondary);
}

.stat-value {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
}

.strand-progress-details {
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    box-shadow: var(--shadow-soft);
}

.strand-progress-item {
    margin-bottom: var(--space-md);
}

.strand-progress-item:last-child {
    margin-bottom: 0;
}

.strand-header-small {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-sm);
}

.strand-icon-small {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: white;
}

.strand-icon-small.number-operations {
    background: var(--number-operations);
}

.strand-icon-small.algebra {
    background: var(--algebra);
}

.strand-icon-small.geometry {
    background: var(--geometry);
}

.strand-icon-small.data-handling {
    background: var(--data-handling);
}

.strand-info-small {
    flex: 1;
}

.strand-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
}

.strand-completion {
    font-size: 14px;
    color: var(--text-secondary);
}

.progress-bar-detailed {
    width: 100%;
    height: 8px;
    background: var(--bg-page);
    border-radius: var(--radius-pill);
    overflow: hidden;
}

.progress-fill-detailed {
    height: 100%;
    background: var(--primary-500);
    border-radius: var(--radius-pill);
    transition: width var(--transition-bouncy);
}

.strand-progress-item:nth-child(1) .progress-fill-detailed {
    background: var(--number-operations);
}

.strand-progress-item:nth-child(2) .progress-fill-detailed {
    background: var(--algebra);
}

.strand-progress-item:nth-child(3) .progress-fill-detailed {
    background: var(--geometry);
}

.strand-progress-item:nth-child(4) .progress-fill-detailed {
    background: var(--data-handling);
}

/* Achievement Gallery */
.achievement-gallery {
    grid-column: 1 / -1;
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    box-shadow: var(--shadow-soft);
}

.badges-collection {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--space-md);
}

.badge-earned,
.badge-locked {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-md);
    border-radius: var(--radius-sm);
    text-align: center;
    transition: all var(--transition-fast);
}

.badge-earned {
    background: rgba(34, 197, 94, 0.1);
    border: 2px solid var(--success);
}

.badge-earned:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-soft);
}

.badge-locked {
    background: var(--bg-page);
    border: 2px solid var(--text-secondary);
    opacity: 0.7;
}

.badge-locked:hover {
    transform: translateY(-2px);
}

.badge-icon-large {
    font-size: 40px;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.badge-earned .badge-icon-large {
    background: var(--success);
}

.badge-locked .badge-icon-large {
    background: var(--text-secondary);
}

.badge-locked .badge-icon-large.locked {
    color: white;
}

.badge-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.badge-date {
    font-size: 12px;
    color: var(--text-secondary);
}

.badge-requirement {
    font-size: 12px;
    color: var(--text-secondary);
    font-style: italic;
}

/* Animations */
@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

@keyframes shake {
    0%, 100% {
        transform: translateX(0);
    }
    25% {
        transform: translateX(-5px);
    }
    75% {
        transform: translateX(5px);
    }
}

@keyframes sparkle {
    0%, 100% {
        opacity: 0;
        transform: scale(0.5);
    }
    50% {
        opacity: 1;
        transform: scale(1);
    }
}

/* Teacher Dashboard Specific */
.teacher-dashboard {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
    margin-top: var(--space-xl);
}

.class-overview {
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    box-shadow: var(--shadow-soft);
}

.student-list {
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    box-shadow: var(--shadow-soft);
    max-height: 600px;
    overflow-y: auto;
}

.student-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md);
    border-bottom: 2px solid var(--bg-page);
    transition: all var(--transition-fast);
}

.student-item:hover {
    background: var(--primary-100);
}

.student-item:last-child {
    border-bottom: none;
}

.student-info {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
}

.student-avatar {
    width: 40px;
    height: 40px;
    background: var(--primary-500);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
}

.student-details {
    flex: 1;
}

.student-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
}

.student-progress {
    font-size: 14px;
    color: var(--text-secondary);
}

.student-status {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-pill);
    font-size: 12px;
    font-weight: 600;
}

.status-online {
    background: rgba(34, 197, 94, 0.1);
    color: var(--success);
}

.status-offline {
    background: var(--bg-page);
    color: var(--text-secondary);
}

.status-struggling {
    background: rgba(239, 68, 68, 0.1);
    color: var(--error);
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
    .assessments-container {
        grid-template-columns: 1fr;
    }
    
    .progress-dashboard {
        grid-template-columns: 1fr;
    }
    
    .overall-progress {
        flex-direction: column;
        gap: var(--space-lg);
    }
    
    .teacher-dashboard {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .answer-options {
        grid-template-columns: 1fr;
    }
    
    .lesson-navigation {
        flex-direction: column;
        gap: var(--space-sm);
    }
    
    .nav-btn {
        width: 100%;
        justify-content: center;
    }
    
    .badges-collection {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
    
    .modal-content {
        margin: var(--space-md);
        max-width: calc(100vw - 2rem);
    }
}
```

### FILE: styles/main.css
```css
/* Golden Mathematics Class 4 - Main Styles */
/* CSS Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    /* Color System */
    --primary-500: #FFC02D;
    --primary-700: #F2A900;
    --primary-100: #FFF8E6;
    
    --bg-page: #FAF8F2;
    --bg-surface: #FFFFFF;
    
    --text-primary: #413A28;
    --text-secondary: #7A7059;
    
    /* Strand Colors */
    --number-operations: #3B82F6;
    --algebra: #EC4899;
    --geometry: #8B5CF6;
    --data-handling: #10B981;
    
    /* Semantic Colors */
    --success: #22C55E;
    --warning: #F59E0B;
    --error: #EF4444;
    
    /* Typography */
    --font-family: 'Nunito', sans-serif;
    
    /* Spacing */
    --space-xs: 8px;
    --space-sm: 16px;
    --space-md: 24px;
    --space-lg: 32px;
    --space-xl: 48px;
    --space-xxl: 64px;
    
    /* Radius */
    --radius-sm: 16px;
    --radius-md: 24px;
    --radius-pill: 99px;
    
    /* Shadows */
    --shadow-soft: 0px 8px 24px rgba(65, 58, 40, 0.1);
    --shadow-medium: 0px 12px 32px rgba(65, 58, 40, 0.15);
    
    /* Transitions */
    --transition-fast: 200ms ease-out;
    --transition-medium: 300ms cubic-bezier(0.25, 0.8, 0.25, 1);
    --transition-bouncy: 800ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Base Typography */
body {
    font-family: var(--font-family);
    background-color: var(--bg-page);
    color: var(--text-primary);
    line-height: 1.6;
    overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    color: var(--text-primary);
}

h1 { font-size: 40px; }
h2 { font-size: 32px; }
h3 { font-size: 24px; font-weight: 600; }
h4 { font-size: 20px; font-weight: 600; }

p {
    font-size: 18px;
    line-height: 1.6;
    color: var(--text-secondary);
}

/* Layout */
.app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* Loading Screen */
.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--primary-100) 0%, var(--bg-page) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    transition: opacity var(--transition-medium), visibility var(--transition-medium);
}

.loading-screen.hidden {
    opacity: 0;
    visibility: hidden;
}

.loading-content {
    text-align: center;
    max-width: 400px;
    padding: var(--space-xl);
}

.loading-logo {
    margin-bottom: var(--space-xl);
}

.logo-icon {
    font-size: 80px;
    margin-bottom: var(--space-sm);
    animation: bounce 2s infinite;
}

.loading-title {
    font-size: 36px;
    font-weight: 800;
    color: var(--primary-700);
    margin-bottom: var(--space-xs);
}

.loading-subtitle {
    font-size: 20px;
    color: var(--text-secondary);
    font-weight: 600;
}

.loading-progress {
    margin-top: var(--space-lg);
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: var(--bg-surface);
    border-radius: var(--radius-pill);
    overflow: hidden;
    box-shadow: var(--shadow-soft);
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-500) 0%, var(--primary-700) 100%);
    border-radius: var(--radius-pill);
    transition: width var(--transition-bouncy);
}

/* Navigation */
.main-nav {
    background: var(--bg-surface);
    border-bottom: 2px solid var(--primary-100);
    padding: var(--space-sm) 0;
    box-shadow: var(--shadow-soft);
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 var(--space-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.nav-brand {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-weight: 800;
    font-size: 24px;
    color: var(--primary-700);
}

.brand-icon {
    font-size: 32px;
}

.nav-menu {
    display: flex;
    gap: var(--space-sm);
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: var(--space-sm) var(--space-md);
    background: none;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--text-secondary);
    min-width: 80px;
}

.nav-item:hover {
    background: var(--primary-100);
    color: var(--primary-700);
    transform: translateY(-2px);
}

.nav-item.active {
    background: var(--primary-500);
    color: white;
    box-shadow: var(--shadow-soft);
}

.nav-icon {
    font-size: 20px;
}

.nav-label {
    font-size: 12px;
    font-weight: 600;
}

.nav-user {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-xs) var(--space-sm);
    background: var(--primary-100);
    border-radius: var(--radius-pill);
}

.user-avatar {
    width: 40px;
    height: 40px;
    background: var(--primary-500);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.user-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.user-level {
    font-size: 12px;
    color: var(--text-secondary);
}

/* Content Sections */
.content-section {
    display: none;
    max-width: 1280px;
    margin: 0 auto;
    padding: var(--space-xl) var(--space-md);
    flex: 1;
}

.content-section.active {
    display: block;
}

.section-header {
    text-align: center;
    margin-bottom: var(--space-xxl);
}

.section-title {
    margin-bottom: var(--space-sm);
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.section-subtitle {
    font-size: 20px;
    color: var(--text-secondary);
}

/* Dashboard Grid */
.dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--space-lg);
    margin-bottom: var(--space-xxl);
}

/* Card Base Styles */
.stats-card,
.continue-card,
.badges-card {
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    box-shadow: var(--shadow-soft);
    transition: all var(--transition-medium);
}

.stats-card:hover,
.continue-card:hover,
.badges-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-medium);
}

.card-title {
    margin-bottom: var(--space-md);
    color: var(--text-primary);
}

/* Stats */
.stats-row {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}

.stat-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
}

.stat-icon {
    font-size: 24px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary-100);
    border-radius: var(--radius-sm);
}

.stat-content {
    flex: 1;
}

.stat-number {
    display: block;
    font-size: 24px;
    font-weight: 800;
    color: var(--primary-700);
}

.stat-label {
    font-size: 14px;
    color: var(--text-secondary);
}

/* Continue Learning */
.lesson-preview {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}

.lesson-thumbnail {
    width: 100%;
    height: 120px;
    border-radius: var(--radius-sm);
    overflow: hidden;
}

.thumbnail-bg {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 48px;
}

.thumbnail-bg.number-operations {
    background: linear-gradient(135deg, var(--number-operations) 0%, #1D4ED8 100%);
}

.thumbnail-bg.algebra {
    background: linear-gradient(135deg, var(--algebra) 0%, #BE185D 100%);
}

.thumbnail-bg.geometry {
    background: linear-gradient(135deg, var(--geometry) 0%, #7C3AED 100%);
}

.thumbnail-bg.data-handling {
    background: linear-gradient(135deg, var(--data-handling) 0%, #059669 100%);
}

.lesson-title {
    color: var(--text-primary);
    margin-bottom: var(--space-xs);
}

.lesson-description {
    font-size: 16px;
    margin-bottom: var(--space-sm);
}

.progress-bar-small {
    width: 100%;
    height: 6px;
    background: var(--bg-page);
    border-radius: var(--radius-pill);
    overflow: hidden;
    margin-bottom: var(--space-xs);
}

.progress-fill-small {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-500) 0%, var(--primary-700) 100%);
    border-radius: var(--radius-pill);
    transition: width var(--transition-bouncy);
}

.progress-text {
    font-size: 14px;
    color: var(--text-secondary);
}

.continue-btn {
    background: var(--primary-500);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    padding: var(--space-sm) var(--space-md);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.continue-btn:hover {
    background: var(--primary-700);
    transform: translateY(-2px);
    box-shadow: var(--shadow-soft);
}

/* Badges */
.badges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: var(--space-sm);
}

.badge-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm);
    background: var(--primary-100);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
}

.badge-item:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-soft);
}

.badge-icon {
    font-size: 24px;
}

.badge-name {
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    color: var(--text-primary);
}

/* Strand Overview */
.strands-overview {
    margin-top: var(--space-xxl);
}

.strands-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-lg);
}

.strand-card {
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    box-shadow: var(--shadow-soft);
    transition: all var(--transition-medium);
    cursor: pointer;
    border-left: 6px solid transparent;
}

.strand-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-medium);
}

.strand-card.number-operations {
    border-left-color: var(--number-operations);
}

.strand-card.algebra {
    border-left-color: var(--algebra);
}

.strand-card.geometry {
    border-left-color: var(--geometry);
}

.strand-card.data-handling {
    border-left-color: var(--data-handling);
}

.strand-header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
}

.strand-icon {
    font-size: 32px;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
}

.strand-card.number-operations .strand-icon {
    background: rgba(59, 130, 246, 0.1);
    color: var(--number-operations);
}

.strand-card.algebra .strand-icon {
    background: rgba(236, 72, 153, 0.1);
    color: var(--algebra);
}

.strand-card.geometry .strand-icon {
    background: rgba(139, 92, 246, 0.1);
    color: var(--geometry);
}

.strand-card.data-handling .strand-icon {
    background: rgba(16, 185, 129, 0.1);
    color: var(--data-handling);
}

.strand-title {
    color: var(--text-primary);
}

.progress-indicator {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.progress-text {
    font-size: 14px;
    color: var(--text-secondary);
}

.radial-progress {
    position: relative;
    width: 60px;
    height: 60px;
}

.progress-circle {
    transform: rotate(-90deg);
}

.progress-track {
    fill: none;
    stroke: var(--bg-page);
    stroke-width: 8;
}

.progress-fill {
    fill: none;
    stroke: var(--primary-500);
    stroke-width: 8;
    stroke-linecap: round;
    transition: stroke-dasharray var(--transition-bouncy);
}

.strand-card.number-operations .progress-fill {
    stroke: var(--number-operations);
}

.strand-card.algebra .progress-fill {
    stroke: var(--algebra);
}

.strand-card.geometry .progress-fill {
    stroke: var(--geometry);
}

.strand-card.data-handling .progress-fill {
    stroke: var(--data-handling);
}

.progress-percentage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
    font-weight: 700;
    color: var(--text-primary);
}

/* Animations */
@keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0, 0, 0);
    }
    40%, 43% {
        transform: translate3d(0, -10px, 0);
    }
    70% {
        transform: translate3d(0, -5px, 0);
    }
    90% {
        transform: translate3d(0, -2px, 0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideIn {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

/* Utility Classes */
.hidden {
    display: none !important;
}

.fade-in {
    animation: fadeIn 0.6s ease-out;
}

.slide-in {
    animation: slideIn 0.4s ease-out;
}

.pulse {
    animation: pulse 2s infinite;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .dashboard-grid {
        grid-template-columns: 1fr 1fr;
    }
    
    .strands-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
    }
    
    .strands-grid {
        grid-template-columns: 1fr;
    }
    
    .nav-container {
        flex-direction: column;
        gap: var(--space-sm);
    }
    
    .nav-menu {
        order: 2;
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .nav-user {
        order: 1;
        align-self: flex-end;
    }
    
    .section-title {
        font-size: 32px;
    }
    
    .stats-row {
        gap: var(--space-sm);
    }
}
```

### FILE: styles/responsive.css
```css
/* Golden Mathematics Class 4 - Responsive Styles */

/* Large Desktop (1200px+) */
@media (min-width: 1200px) {
    .container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 var(--space-lg);
    }
    
    .lessons-grid {
        grid-template-columns: repeat(4, 1fr);
    }
    
    .strands-grid {
        grid-template-columns: repeat(4, 1fr);
    }
    
    .dashboard-grid {
        grid-template-columns: 1fr 1fr 1fr;
    }
}

/* Desktop (1024px - 1199px) */
@media (max-width: 1199px) {
    .lessons-grid {
        grid-template-columns: repeat(3, 1fr);
    }
    
    .strands-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Tablet Landscape (768px - 1023px) */
@media (max-width: 1023px) {
    .nav-container {
        padding: 0 var(--space-sm);
    }
    
    .content-section {
        padding: var(--space-lg) var(--space-sm);
    }
    
    .lessons-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-md);
    }
    
    .lesson-card {
        padding: var(--space-md);
    }
    
    .lesson-card-title {
        font-size: 18px;
    }
    
    .lesson-card-description {
        font-size: 14px;
    }
    
    .strand-filter {
        gap: var(--space-xs);
    }
    
    .filter-btn {
        padding: var(--space-xs) var(--space-sm);
        font-size: 12px;
    }
    
    .assessment-item {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-sm);
    }
    
    .assessment-score {
        align-self: flex-end;
    }
    
    .overall-progress {
        flex-direction: column;
        text-align: center;
        gap: var(--space-lg);
    }
    
    .progress-stats {
        width: 100%;
    }
}

/* Tablet Portrait (768px - 767px) */
@media (max-width: 767px) {
    /* Navigation Adjustments */
    .nav-container {
        flex-direction: column;
        gap: var(--space-md);
        padding: var(--space-sm);
    }
    
    .nav-brand {
        order: 1;
        align-self: center;
    }
    
    .nav-menu {
        order: 3;
        width: 100%;
        justify-content: space-around;
        flex-wrap: wrap;
        gap: var(--space-xs);
    }
    
    .nav-item {
        flex: 1;
        min-width: 70px;
        padding: var(--space-xs);
    }
    
    .nav-icon {
        font-size: 18px;
    }
    
    .nav-label {
        font-size: 11px;
    }
    
    .nav-user {
        order: 2;
        align-self: flex-end;
    }
    
    /* Content Section */
    .content-section {
        padding: var(--space-md) var(--space-sm);
    }
    
    .section-title {
        font-size: 28px;
    }
    
    .section-subtitle {
        font-size: 16px;
    }
    
    /* Dashboard */
    .dashboard-grid {
        grid-template-columns: 1fr;
        gap: var(--space-md);
    }
    
    .stats-row {
        flex-direction: row;
        justify-content: space-around;
        gap: var(--space-sm);
    }
    
    .stat-item {
        flex-direction: column;
        text-align: center;
        gap: var(--space-xs);
    }
    
    .stat-number {
        font-size: 20px;
    }
    
    .stat-label {
        font-size: 12px;
    }
    
    /* Lessons */
    .lessons-grid {
        grid-template-columns: 1fr;
        gap: var(--space-md);
    }
    
    .lesson-card {
        padding: var(--space-sm);
    }
    
    .lesson-card-title {
        font-size: 16px;
    }
    
    .lesson-card-description {
        font-size: 14px;
    }
    
    .lesson-card-meta {
        flex-direction: column;
        gap: var(--space-xs);
        align-items: flex-start;
    }
    
    /* Strand Cards */
    .strands-grid {
        grid-template-columns: 1fr;
    }
    
    .strand-card {
        padding: var(--space-md);
    }
    
    .strand-title {
        font-size: 16px;
    }
    
    .progress-indicator {
        flex-direction: column;
        align-items: center;
        gap: var(--space-sm);
    }
    
    /* Assessments */
    .assessments-container {
        grid-template-columns: 1fr;
        gap: var(--space-md);
    }
    
    .assessment-card,
    .assessments-list {
        padding: var(--space-md);
    }
    
    .assessment-meta {
        flex-direction: column;
        gap: var(--space-xs);
        align-items: center;
    }
    
    .assessment-title {
        font-size: 16px;
    }
    
    .assessment-description {
        font-size: 14px;
    }
    
    /* Progress Dashboard */
    .progress-dashboard {
        grid-template-columns: 1fr;
        gap: var(--space-md);
    }
    
    .progress-overview,
    .strand-progress-details,
    .achievement-gallery {
        padding: var(--space-md);
    }
    
    .large-progress-circle {
        width: 120px;
        height: 120px;
    }
    
    .progress-percentage-large {
        font-size: 24px;
    }
    
    .badges-collection {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-sm);
    }
    
    .badge-earned,
    .badge-locked {
        padding: var(--space-sm);
    }
    
    .badge-icon-large {
        font-size: 32px;
        width: 50px;
        height: 50px;
    }
    
    .badge-name {
        font-size: 12px;
    }
    
    .badge-date,
    .badge-requirement {
        font-size: 11px;
    }
}

/* Mobile Landscape (568px - 767px) */
@media (max-width: 767px) and (orientation: landscape) {
    .nav-container {
        flex-direction: row;
        padding: var(--space-xs) var(--space-sm);
    }
    
    .nav-brand {
        order: 1;
        font-size: 20px;
    }
    
    .nav-brand .brand-icon {
        font-size: 24px;
    }
    
    .nav-menu {
        order: 2;
        flex: 1;
        justify-content: center;
        gap: var(--space-xs);
    }
    
    .nav-item {
        padding: var(--space-xs) var(--space-sm);
    }
    
    .nav-user {
        order: 3;
    }
    
    .content-section {
        padding: var(--space-md) var(--space-sm);
    }
    
    .dashboard-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-sm);
    }
    
    .strands-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Mobile Portrait (up to 480px) */
@media (max-width: 480px) {
    /* Typography Adjustments */
    h1 { font-size: 24px; }
    h2 { font-size: 20px; }
    h3 { font-size: 18px; }
    h4 { font-size: 16px; }
    
    .section-title {
        font-size: 24px;
    }
    
    .section-subtitle {
        font-size: 14px;
    }
    
    .lesson-title-large {
        font-size: 24px;
    }
    
    .instruction-title {
        font-size: 16px;
    }
    
    .instruction-text {
        font-size: 16px;
    }
    
    /* Navigation */
    .nav-brand {
        font-size: 18px;
    }
    
    .nav-item {
        min-width: 60px;
    }
    
    .nav-icon {
        font-size: 16px;
    }
    
    .nav-label {
        font-size: 10px;
    }
    
    /* Content Spacing */
    .content-section {
        padding: var(--space-sm);
    }
    
    .section-header {
        margin-bottom: var(--space-lg);
    }
    
    /* Cards */
    .lesson-card,
    .strand-card,
    .assessment-card,
    .stats-card,
    .continue-card,
    .badges-card {
        padding: var(--space-sm);
    }
    
    /* Interactive Elements */
    .interactive-area {
        padding: var(--space-md);
        min-height: 150px;
    }
    
    .math-problem {
        font-size: 20px;
    }
    
    .answer-btn {
        font-size: 16px;
        padding: var(--space-sm);
        min-height: 50px;
    }
    
    .answer-options {
        grid-template-columns: 1fr;
        gap: var(--space-xs);
    }
    
    /* Modal */
    .modal-content {
        margin: var(--space-xs);
        max-width: calc(100vw - 1rem);
        max-height: calc(100vh - 1rem);
    }
    
    .modal-header,
    .modal-body {
        padding: var(--space-md);
    }
    
    .lesson-container {
        padding: var(--space-md);
    }
    
    /* Progress Elements */
    .large-progress-circle {
        width: 100px;
        height: 100px;
    }
    
    .progress-percentage-large {
        font-size: 20px;
    }
    
    /* Buttons */
    .btn {
        min-height: 48px;
        font-size: 14px;
        padding: var(--space-xs) var(--space-sm);
    }
    
    .btn-large {
        min-height: 52px;
        font-size: 16px;
        padding: var(--space-sm) var(--space-md);
    }
    
    /* Filter Buttons */
    .strand-filter {
        gap: var(--space-xs);
    }
    
    .filter-btn {
        padding: 6px var(--space-xs);
        font-size: 12px;
    }
    
    /* Badge Grid */
    .badges-collection {
        grid-template-columns: repeat(2, 1fr);
    }
    
    /* Stats */
    .stat-number {
        font-size: 18px;
    }
    
    .stat-label {
        font-size: 11px;
    }
}

/* Small Mobile (up to 360px) */
@media (max-width: 360px) {
    .nav-menu {
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .nav-item {
        min-width: 50px;
        flex: 0 0 auto;
    }
    
    .lesson-title-large {
        font-size: 20px;
    }
    
    .math-problem {
        font-size: 18px;
    }
    
    .answer-btn {
        font-size: 14px;
        padding: var(--space-xs);
        min-height: 44px;
    }
    
    .badges-collection {
        grid-template-columns: 1fr;
    }
    
    .dashboard-grid,
    .strands-grid,
    .lessons-grid {
        grid-template-columns: 1fr;
    }
}

/* High DPI Displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .progress-track,
    .progress-fill,
    .progress-track-large,
    .progress-fill-large {
        stroke-width: 6;
    }
    
    .badge-icon,
    .badge-icon-large,
    .strand-icon,
    .lesson-card-icon {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
    }
}

/* Print Styles */
@media print {
    .main-nav,
    .nav-user,
    .loading-screen,
    .modal,
    .strand-filter,
    .lesson-navigation,
    .continue-btn,
    .start-assessment-btn,
    .take-assessment-btn {
        display: none !important;
    }
    
    .content-section {
        display: block !important;
        padding: 0;
    }
    
    .lesson-card,
    .strand-card,
    .assessment-card {
        break-inside: avoid;
        box-shadow: none;
        border: 1px solid #ccc;
        margin-bottom: var(--space-sm);
    }
    
    .progress-circle {
        stroke: #333 !important;
    }
    
    body {
        background: white !important;
        color: black !important;
    }
    
    .bg-surface {
        background: white !important;
    }
    
    .text-primary {
        color: black !important;
    }
    
    .text-secondary {
        color: #666 !important;
    }
}

/* Accessibility - High Contrast Mode */
@media (prefers-contrast: high) {
    :root {
        --primary-500: #FFD700;
        --primary-700: #FFA500;
        --primary-100: #FFFACD;
        
        --text-primary: #000000;
        --text-secondary: #333333;
        
        --success: #008000;
        --warning: #FF8C00;
        --error: #DC143C;
        
        --number-operations: #0066CC;
        --algebra: #CC0066;
        --geometry: #6600CC;
        --data-handling: #006633;
    }
    
    .lesson-card,
    .strand-card,
    .assessment-card,
    .stats-card {
        border: 2px solid var(--text-primary);
    }
    
    .btn {
        border: 2px solid var(--text-primary);
    }
    
    .answer-btn {
        border-width: 3px;
    }
}

/* Accessibility - Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
    
    .progress-fill,
    .progress-fill-small,
    .progress-fill-detailed,
    .progress-fill-large {
        transition: none !important;
    }
    
    .loading-logo .logo-icon {
        animation: none !important;
    }
}

/* Dark Mode Support (Future Enhancement) */
@media (prefers-color-scheme: dark) {
    /* Future dark mode styles would go here */
    /* Currently not implemented to maintain warm, child-friendly aesthetic */
}

/* Focus Visible for Accessibility */
.btn:focus-visible,
.nav-item:focus-visible,
.filter-btn:focus-visible,
.answer-btn:focus-visible,
.modal-close:focus-visible {
    outline: 3px solid var(--primary-500);
    outline-offset: 2px;
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
    .lesson-card:hover,
    .strand-card:hover,
    .assessment-card:hover {
        transform: none;
    }
    
    .nav-item:hover {
        transform: none;
    }
    
    .answer-btn:hover {
        transform: none;
    }
    
    /* Increase touch targets */
    .btn {
        min-height: 48px;
        min-width: 120px;
    }
    
    .answer-btn {
        min-height: 56px;
        font-size: 16px;
    }
    
    .nav-item {
        min-height: 44px;
        padding: var(--space-sm);
    }
    
    /* Remove hover effects, use active states */
    .answer-btn:active {
        transform: scale(0.98);
        background: var(--primary-100);
        border-color: var(--primary-500);
    }
}

/* Landscape Mobile Specific Adjustments */
@media (max-height: 500px) and (orientation: landscape) {
    .section-header {
        margin-bottom: var(--space-md);
    }
    
    .dashboard-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-sm);
    }
    
    .strands-grid {
        grid-template-columns: repeat(4, 1fr);
    }
    
    .loading-logo {
        margin-bottom: var(--space-md);
    }
    
    .logo-icon {
        font-size: 48px;
    }
    
    .loading-title {
        font-size: 24px;
    }
    
    .loading-subtitle {
        font-size: 16px;
    }
}

/* iPad Specific Styles */
@media only screen 
  and (min-device-width: 768px) 
  and (max-device-width: 1024px)
  and (-webkit-min-device-pixel-ratio: 1) {
    
    .content-section {
        padding: var(--space-xl) var(--space-lg);
    }
    
    .lessons-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-lg);
    }
    
    .strands-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .dashboard-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .nav-container {
        padding: 0 var(--space-lg);
    }
    
    .lesson-card {
        padding: var(--space-lg);
    }
    
    .strand-card {
        padding: var(--space-lg);
    }
}
```

### FILE: sw.js
```javascript
const CACHE_NAME = 'class4-math-pwa-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PWA: Pre-caching core assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('PWA: Clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

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
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react'],
          animations: ['framer-motion']
        }
      }
    }
  },
  define: {
    // Ensure proper React development
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  }
})
```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — class4-math-learning-system
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

// Vitest E2E configuration — class4-math-learning-system
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

