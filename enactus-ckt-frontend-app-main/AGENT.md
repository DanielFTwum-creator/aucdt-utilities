# enactus-ckt-frontend-app-main - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for enactus-ckt-frontend-app-main.

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

### FILE: .npmrc
```text
# Use pnpm as package manager
package-manager=pnpm

```

### FILE: COMPONENT_STRUCTURE.md
```md
# Enactus CKT-UTAS Website - Component Structure

This document outlines the component-based structure of the React donation website.

## Component Overview

The website has been refactored from a single HTML file into a modular React component structure. Each section of the original website is now a separate, reusable component.

## Components

### 1. Header (`/src/components/Header.jsx`)
- Contains the main navigation menu
- Logo and branding
- Mobile menu toggle
- Search and cart functionality
- Join button

### 2. Hero (`/src/components/Hero.jsx`)
- Main hero section with call-to-action
- Background images and shapes
- Primary messaging and buttons
- Impact statistics display

### 3. Feature (`/src/components/Feature.jsx`)
- Feature cards highlighting key services
- Statistics and achievements
- Call-to-action buttons

### 4. About (`/src/components/About.jsx`)
- Organization information
- Mission, vision, and values
- Achievements and impact
- Team images and statistics

### 5. Service (`/src/components/Service.jsx`)
- Service offerings display
- Service cards with descriptions
- Background images and styling

### 6. Projects (`/src/components/Donation.jsx`)
- Project/donation cards
- Progress bars and funding goals
- Project descriptions and SDG alignment
- View project buttons

### 7. Team (`/src/components/Team.jsx`)
- Team member cards
- Social media links
- Swiper slider for team display
- Background shapes and animations

### 8. Video (`/src/components/Video.jsx`)
- Video section with play button
- Background shapes and styling
- YouTube video integration

### 9. Pricing (`/src/components/Pricing.jsx`)
- Pricing plans display
- Feature checklists
- Call-to-action buttons

### 10. FAQ (`/src/components/FAQ.jsx`)
- Frequently asked questions
- Accordion-style display
- Background images

### 11. Brand (`/src/components/Brand.jsx`)
- Partner/brand logos
- Swiper slider for brand display
- Dark theme styling

### 12. Blog (`/src/components/Blog.jsx`)
- Blog post cards
- Meta information (date, tags)
- Read more buttons

### 13. Footer (`/src/components/Footer.jsx`)
- Contact information
- Quick links and services
- Newsletter signup
- Social media links
- Copyright information

## Usage

All components are imported and used in the main `Home.jsx` component:

```jsx
import {
    Header,
    Hero,
    Feature,
    About,
    Service,
    Donation,
    Team,
    Video,
    Pricing,
    FAQ,
    Brand,
    Blog,
    Footer
} from './components';

export default function Home() {
    return (
        <div>
            <Header />
            <Hero />
            <Feature />
            <About />
            <Service />
            <Donation />
            <Team />
            <Video />
            <Pricing />
            <FAQ />
            <Brand />
            <Blog />
            <Footer />
        </div>
    );
}
```

## Benefits of Component Structure

1. **Modularity**: Each section is now a separate, reusable component
2. **Maintainability**: Easier to update individual sections without affecting others
3. **Reusability**: Components can be reused across different pages
4. **Testing**: Individual components can be tested in isolation
5. **Performance**: Better code splitting and lazy loading opportunities
6. **Developer Experience**: Cleaner, more organized codebase

## File Structure

```
src/
├── components/
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── Feature.jsx
│   ├── About.jsx
│   ├── Service.jsx
│   ├── Donation.jsx
│   ├── Team.jsx
│   ├── Video.jsx
│   ├── Pricing.jsx
│   ├── FAQ.jsx
│   ├── Brand.jsx
│   ├── Blog.jsx
│   ├── Footer.jsx
│   └── index.js
├── Home.jsx
├── App.jsx
└── main.jsx
```

## Styling

All components maintain the original CSS classes and styling from the HTML template. The visual appearance and functionality remain exactly the same as the original website.


```

### FILE: CREATION.md
```md
# enactus-ckt-frontend-app-main

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

This application is deployed behind an Nginx reverse proxy at the path `/enactus-ckt-frontend-app-main/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/enactus-ckt-frontend-app-main/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/enactus-ckt-frontend-app-main/',  // REQUIRED: Assets must load from /enactus-ckt-frontend-app-main/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/enactus-ckt-frontend-app-main"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/enactus-ckt-frontend-app-main">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/enactus-ckt-frontend-app-main/`, not at the root
- **Asset Loading**: Without `base: '/enactus-ckt-frontend-app-main/'`, assets try to load from `/assets/` instead of `/enactus-ckt-frontend-app-main/assets/`
- **Routing**: Without `basename="/enactus-ckt-frontend-app-main"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/enactus-ckt-frontend-app-main/assets/index-*.js`
- Link tags should reference: `/enactus-ckt-frontend-app-main/assets/index-*.css`

If they reference `/assets/` instead of `/enactus-ckt-frontend-app-main/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/enactus-ckt-frontend-app-main/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/enactus-ckt-frontend-app-main/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: enactus-ckt-frontend-app-main

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
# Admin Guide — react-donat

**Application:** react-donat
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

Audit log data is stored in `localStorage` under the key `tuc_react-donat_audit`.

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
# Deployment Guide — react-donat

**Application:** react-donat
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd react-donat
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
docker-compose -f docker-compose-all-apps.yml build react-donat
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up react-donat
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

**Project:** React Donat
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **React Donat**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**React Donat** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**React Donat** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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
| ARIA 100% coverage | âœ… Compliant |
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
# Testing Guide — react-donat

**Application:** react-donat
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd react-donat
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
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
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
    <meta property="og:title" content="Enactus Ckt Frontend App Main | Techbridge University College" />
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
    <meta name="twitter:title" content="Enactus Ckt Frontend App Main | Techbridge University College" />
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
    <title>Enactus Ckt Frontend App Main | Techbridge University College</title>

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
        <div class="tuc-status">enactus ckt frontend app main</div>
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
  "name": "react-donat",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "start": "npm run dev",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.9.6",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.5",
    "@eslint/js": "^9.39.1",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "serve": "14.2.5",
    "vite": "7.3.1",
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
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# enactus-ckt-frontend-app

```

### FILE: src/App.tsx
```typescript
import RouterPage from './RouterPage';

export default function App() {
  return <RouterPage />;
}

```

### FILE: src/AppWithAuth.tsx
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import App from './App';

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

const AUTH_KEY = 'tuc_auth_enactus_ckt_frontend_app_main';
const ACCENT   = '#059669';

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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Enactus Ckt Frontend App Main</h1>
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

### FILE: src/components/About.tsx
```typescript
import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="overflow-hidden space" id="about-sec">
            <div className="shape-mockup about-bg-shape2-1 jump-reverse d-lg-inline-block d-none" data-top="10%" data-right="5%">
                <img src="assets/img/shape/heart-shape1.png" alt="shape" />
            </div>
            <div className="shape-mockup about-bg-shape3-1 jump" data-bottom="20%" data-right="5%">
                <div className="color-masking2">
                    <div className="masking-src" data-mask-src="assets/img/shape/about_shape3_1.png"></div>
                    <img src="assets/img/shape/about_shape3_1.png" alt="img" />
                </div>
            </div>
            <div className="container">
                <div className="row gy-60 align-items-center">
                    <div className="col-xl-6">
                        <div className="img-box3">
                            <div className="img1">
                                <img src="assets/img/outreach/IMG_4864.jpg" alt="Enactus President" />
                            </div>
                            <div className="img2 jump">
                                <img src="assets/img/president/IMG_5055.JPG" alt="Enactus Team" />
                            </div>
                            <div className="about-shape3-1 jump-reverse">
                                <div className="color-masking2">
                                    <div className="masking-src" data-mask-src="assets/img/shape/about_shape1_1.png"></div>
                                    <img src="assets/img/shape/about_shape1_1.png" alt="img" />
                                </div>
                            </div>
                            <div className="year-counter movingX">
                                <div className="year-counter_number">
                                    <strong>Join Us</strong> – Be part of our impact journey
                                </div>
                                <Link to="/join" className="link-btn style2">Join Us Now</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="title-area mb-40">
                            <span className="sub-title after-none before-none">
                                <i className="text-theme far fa-heart"></i> About Us
                            </span>
                            <h2 className="sec-title">Who We Are</h2>
                            <p>
                                Enactus CKT-UTAS is the student chapter of Enactus International at C.K. Tedam University of Technology and Applied Sciences (Navrongo, Ghana). We are a community of young innovators, leaders, and changemakers dedicated to developing entrepreneurial solutions that uplift livelihoods and protect our environment.
                            </p>
                        </div>
                        <div className="about-wrap3">
                            <h4 className="box-title">Our Mission</h4>
                            <p className="mb-20">
                                To use entrepreneurial action to create a better, more sustainable world while developing the next generation of entrepreneurial leaders.
                            </p>

                            <h4 className="box-title">Our Vision</h4>
                            <p className="mb-20">
                                A world where business and innovation serve as a force for good, empowering communities to thrive sustainably.
                            </p>

                            <h4 className="box-title">Our Values</h4>
                            <ul className="mb-20">
                                <li><strong>Innovation</strong> – finding creative solutions to real-world problems.</li>
                                <li><strong>Sustainability</strong> – ensuring long-term social and environmental impact.</li>
                                <li><strong>Collaboration</strong> – working together with students, communities, and partners.</li>
                                <li><strong>Impact</strong> – creating measurable change that improves lives.</li>
                            </ul>

                            <h4 className="box-title">Our Achievements</h4>
                            <div className="achievements-grid mb-30">
                                <div className="achievement-card">
                                    <div className="achievement-icon"><i className="fa-solid fa-users"></i></div>
                                    <div className="achievement-value"><span className="counter-number">40</span>+</div>
                                    <div className="achievement-label">Student Leaders</div>
                                </div>
                                <div className="achievement-card">
                                    <div className="achievement-icon"><i className="fa-regular fa-clock"></i></div>
                                    <div className="achievement-value"><span className="counter-number">1200</span>+</div>
                                    <div className="achievement-label">Volunteer Hours</div>
                                </div>
                                <div className="achievement-card">
                                    <div className="achievement-icon"><i className="fa-solid fa-globe"></i></div>
                                    <div className="achievement-value"><span className="counter-number">13</span></div>
                                    <div className="achievement-label">SDGs Tackled</div>
                                </div>
                                <div className="achievement-card">
                                    <div className="achievement-icon"><i className="fa-solid fa-route"></i></div>
                                    <div className="achievement-value"><span className="counter-number">800</span>+</div>
                                    <div className="achievement-label">Km Traveled</div>
                                </div>
                            </div>

                            <div className="btn-wrap mt-30">
                                <Link to="/about" className="th-btn style3 style-radius">
                                    Learn More <i className="fa-solid fa-arrow-up-right ms-2"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;


```

### FILE: src/components/alumni/AlumniPage.tsx
```typescript
import React from 'react'
import Alumni from '../Alumni'

export default function AlumniPage() {
    return <Alumni compact={false} />
}



```

### FILE: src/components/Alumni.tsx
```typescript
import React from 'react'
import { Link } from 'react-router-dom'

const alumniList = [
    {
        name: 'Aminu Salifu',
        year: 'Class of 2022',
        role: 'Product Manager, Fintech',
        photo: '/assets/img/team/team_3_1.png',
        essay: 'Led sustainable finance projects; now building inclusive financial products at scale.'
    },
    {
        name: 'Naomi Asante',
        year: 'Class of 2021',
        role: 'Founder, AgriTech Startup',
        photo: '/assets/img/team/team_3_2.png',
        essay: 'Scaled soil-health innovation from campus prototype to regional adoption.'
    },
    {
        name: 'Daniel Owusu',
        year: 'Class of 2023',
        role: 'CSR Analyst',
        photo: '/assets/img/team/team_3_3.png',
        essay: 'Drives corporate impact programmes aligned to SDGs and shared value.'
    },
    {
        name: 'Akosua Boatemaa',
        year: 'Class of 2024',
        role: 'Operations Associate, HealthTech',
        photo: '/assets/img/team/team_3_4.png',
        essay: 'Streamlines service delivery for underserved communities.'
    }
]

export default function Alumni({ compact = true }) {
    return (
        <section className="space" id="alumni-sec" data-bg-src="assets/img/bg/gray-bg2.png">
            <div className="container">
                <div className="title-area text-center">
                    <span className="sub-title after-none before-none">
                        <i className="far fa-heart text-theme"></i> Alumni
                    </span>
                    <h2 className="sec-title">Our Alumni: Building Impact Beyond Campus</h2>
                    <p className="sec-text">Stories of leadership, entrepreneurship, and social impact after Enactus.</p>
                </div>

                <div className="row g-4">
                    {(compact ? alumniList.slice(0, 4) : alumniList).map((alum, i) => (
                        <div className="col-12 col-sm-6 col-lg-3" key={i}>
                            <div className="card h-100" style={{ border: 'none', boxShadow: '0 10px 24px rgba(18, 38, 63, 0.08)', borderRadius: 16 }}>
                                <div className="ratio ratio-1x1" style={{ overflow: 'hidden', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                                    <img src={alum.photo} alt={alum.name} style={{ width: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="p-3">
                                    <h3 className="h5 mb-1">{alum.name}</h3>
                                    <div className="text-muted mb-1">{alum.year}</div>
                                    <div className="fw-semibold mb-2">{alum.role}</div>
                                    <p className="mb-0" style={{ color: '#5f6c7b' }}>{alum.essay}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {compact && (
                    <div className="text-center mt-30">
                        <Link to="/alumni" className="th-btn">View All Alumni</Link>
                    </div>
                )}
            </div>
        </section>
    )
}



```

### FILE: src/components/Blog.tsx
```typescript
import React from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
    return (
        <section className="space" id="blog-sec" data-bg-src="assets/img/bg/gray-bg2.png">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-7">
                        <div className="title-area text-center">
                            <span className="sub-title after-none before-none">
                                <i className="far fa-heart text-theme"></i> Our Blog
                            </span>
                            <h2 className="sec-title">Latest News & Updates</h2>
                            <p className="sec-text">
                                Stay informed about our latest projects, success stories, and community impact through our blog.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row gy-30">
                    <div className="col-xl-6">
                        <div className="blog-card style2">
                            <div className="blog-img">
                                <Link to="/blog/presidency-invite-2024">
                                    <img src="/assets/img/president/IMG_5059.JPG" alt="Presidency Invite" />
                                </Link>
                            </div>
                            <div className="blog-content">
                                <div className="blog-meta">
                                    <Link to="/blog/presidency-invite-2024"><i className="fas fa-calendar-days"></i>August 2024</Link>
                                    <Link to="/blog/presidency-invite-2024"><i className="fas fa-tags"></i>Recognition</Link>
                                </div>
                                <h3 className="box-title">
                                    <Link to="/blog/presidency-invite-2024">Enactus CKT-UTAS visits Jubilee House after National Win</Link>
                                </h3>
                                <p className="blog-text">
                                    After winning the 2024 Enactus National Expo, our team was invited by H.E. Nana Addo Dankwa Akufo-Addo to the Jubilee House.
                                </p>
                                <Link to="/blog/presidency-invite-2024" className="th-btn">
                                    Read More <i className="fas fa-arrow-up-right ms-2"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="blog-card style2">
                            <div className="blog-img">
                                <Link to="/blog/menstrual-health-outreach-2025">
                                    <img src="/assets/img/outreach/IMG_4864.jpg" alt="Menstrual Health Outreach" />
                                </Link>
                            </div>
                            <div className="blog-content">
                                <div className="blog-meta">
                                    <Link to="/blog/menstrual-health-outreach-2025"><i className="fas fa-calendar-days"></i>June 2025</Link>
                                    <Link to="/blog/menstrual-health-outreach-2025"><i className="fas fa-tags"></i>Health</Link>
                                </div>
                                <h3 className="box-title">
                                    <Link to="/blog/menstrual-health-outreach-2025">Menstrual Health Outreach at Adabayeri JHS, Navrongo</Link>
                                </h3>
                                <p className="blog-text">
                                    Sensitization on menstrual hygiene and distribution of sanitary pads to students in the Upper East Region.
                                </p>
                                <Link to="/blog/menstrual-health-outreach-2025" className="th-btn">
                                    Read More <i className="fas fa-arrow-up-right ms-2"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-12">
                        <div className="blog-card style2">
                            <div className="blog-img">
                                <Link to="/blog/hand-over-ceremony-2025">
                                    <img src="/assets/img/celebration/IMG_3610.jpg" alt="Handover and Awards Night" />
                                </Link>
                            </div>
                            <div className="blog-content">
                                <div className="blog-meta">
                                    <Link to="/blog/hand-over-ceremony-2025"><i className="fas fa-calendar-days"></i>July 2025</Link>
                                    <Link to="/blog/hand-over-ceremony-2025"><i className="fas fa-tags"></i>Community</Link>
                                </div>
                                <h3 className="box-title">
                                    <Link to="/blog/hand-over-ceremony-2025">Handover Ceremony, Awards & Dinner Night</Link>
                                </h3>
                                <p className="blog-text">
                                    Celebrating leadership transition and outstanding contributions as we close the academic year.
                                </p>
                                <Link to="/blog/hand-over-ceremony-2025" className="th-btn">
                                    Read More <i className="fas fa-arrow-up-right ms-2"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Blog;


```

### FILE: src/components/Brand.tsx
```typescript
import React from 'react';

const Brand = () => {
    return (
        <div className="bg-theme-dark overflow-hidden brand-area-1" data-mask-src="assets/img/shape/brand-bg-shape1.png">
            <div className="container">
                <div className="brand-wrap1 text-center">
                    <h3 className="brand-wrap-title text-white">
                        Over the years, these companies <span className="text-theme2"><span className="counter-number">Supported </span></span> us
                    </h3>
                    <div className="row g-3 justify-content-center align-items-center">
                        {[ 
                            { src: '/assets/img/brand/fidelity.png', alt: 'Fidelity' },
                            { src: '/assets/img/brand/GCB.png', alt: 'GCB' },
                            { src: '/assets/img/brand/republic.jpg', alt: 'Republic Bank' },
                            { src: '/assets/img/brand/SRC-RITSO.jpg', alt: 'SRC RITSO' },
                            { src: '/assets/img/brand/triteq.jpg', alt: 'Triteq' },
                        ].map((b, i) => (
                            <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={i}>
                                <div className="brand-box" style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 16 }}>
                                    <img className="brand-logo" src={b.src} alt={b.alt} style={{ maxHeight: 50, width: 'auto' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Brand;


```

### FILE: src/components/competition/CompetitionDetails.tsx
```typescript
import React from 'react'

export default function CompetitionDetails() {
    return (
        <section className="space" data-bg-src="assets/img/bg/gray-bg2.png">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-9">
                        <div className="title-area text-center">
                            <span className="sub-title after-none before-none">
                                <i className="far fa-heart text-theme"></i> Enactus Annual Competition
                            </span>
                            <h1 className="sec-title">Competition Details</h1>
                            <p className="sec-text">Everything you need to know about our annual Enactus competition.</p>
                        </div>

                        <div className="card p-4 mb-30">
                            <h3 className="box-title mb-10">Areas of Focus</h3>
                            <ul className="list-unstyled ms-3 mb-0">
                                <li>• Entrepreneurship and innovation for good</li>
                                <li>• Sustainable development and circular economy</li>
                                <li>• Financial inclusion and livelihoods</li>
                                <li>• Health, education, and community development</li>
                                <li>• Climate action, clean water, and sanitation</li>
                            </ul>
                        </div>

                        <div className="row g-3 mb-30">
                            <div className="col-md-6">
                                <div className="card p-4 h-100">
                                    <h3 className="box-title mb-10">Eligibility</h3>
                                    <p className="mb-0">Open to tertiary students in the Upper East Region. Individuals and team entries are allowed.</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card p-4 h-100">
                                    <h3 className="box-title mb-10">Format</h3>
                                    <ul className="mb-0 ms-3">
                                        <li>• 5–8 minute pitch + Q&A</li>
                                        <li>• Judges score on impact, feasibility, sustainability</li>
                                        <li>• Top finalists receive mentorship and support</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="card p-4 mb-30">
                            <h3 className="box-title mb-10">Top 3 Projects (Latest Edition)</h3>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="p-3 rounded h-100" style={{ background: '#f8faff' }}>
                                        <h4 className="h5 mb-5">1st Place</h4>
                                        <p className="mb-1"><strong>Project:</strong> Project Alpha</p>
                                        <p className="mb-1"><strong>Team:</strong> Team Horizon</p>
                                        <p className="mb-0">A brief description of the winning solution and its impact.</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 rounded h-100" style={{ background: '#f8faff' }}>
                                        <h4 className="h5 mb-5">2nd Place</h4>
                                        <p className="mb-1"><strong>Project:</strong> Project Beta</p>
                                        <p className="mb-1"><strong>Team:</strong> Team Catalyst</p>
                                        <p className="mb-0">A concise description of the project and the community it serves.</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 rounded h-100" style={{ background: '#f8faff' }}>
                                        <h4 className="h5 mb-5">3rd Place</h4>
                                        <p className="mb-1"><strong>Project:</strong> Project Gamma</p>
                                        <p className="mb-1"><strong>Team:</strong> Team Nova</p>
                                        <p className="mb-0">Short description highlighting the solution and expected outcomes.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <a href="/competition/2026" className="th-btn">See 2026 Pitching Competition</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}



```

### FILE: src/components/competition/Pitch2026.tsx
```typescript
import React from 'react'

export default function Pitch2026() {
    return (
        <section className="space" data-bg-src="assets/img/bg/gray-bg2.png">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-9">
                        <div className="title-area text-center">
                            <span className="sub-title after-none before-none">
                                <i className="far fa-heart text-theme"></i> 2026 Enactus Pitching Competition
                            </span>
                            <h1 className="sec-title">Rules, Regulations & Team Formation</h1>
                        </div>

                        <div className="card p-4 mb-30">
                            <h3 className="box-title mb-10">Eligibility & Team Formation</h3>
                            <ul className="ms-3 mb-0">
                                <li>• Open to tertiary students in the Upper East Region</li>
                                <li>• Apply as a team (2–5) or as an individual</li>
                                <li>• Interdisciplinary teams are encouraged</li>
                            </ul>
                        </div>

                        <div className="card p-4 mb-30">
                            <h3 className="box-title mb-10">Standard Requirements</h3>
                            <ul className="ms-3 mb-0">
                                <li>• 5–8 minute pitch + 5 minute Q&A</li>
                                <li>• Problem, solution, market, impact and sustainability clearly stated</li>
                                <li>• Prototype or proof-of-concept recommended</li>
                                <li>• Slides submitted 24 hours before event</li>
                            </ul>
                        </div>

                        <div className="card p-4 mb-30">
                            <h3 className="box-title mb-10">Rules & Regulations</h3>
                            <ul className="ms-3 mb-0">
                                <li>• Original work and proper citations required</li>
                                <li>• Respect time limits; overruns may be penalized</li>
                                <li>• Judges’ decision is final</li>
                                <li>• Code of conduct applies to all participants</li>
                            </ul>
                        </div>

                        <div className="card p-4 mb-30">
                            <h3 className="box-title mb-10">We’re Seeking Sponsors & Partnerships</h3>
                            <p className="mb-0">Join us to fund prizes, mentorship, and incubation for winning teams. Your support accelerates solutions that improve lives.</p>
                        </div>

                        <div className="text-center">
                            <a href="/contact" className="th-btn">Become a Sponsor/Partner</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}



```

### FILE: src/components/Competition.tsx
```typescript
import React from 'react';
import { Link } from 'react-router-dom';

const Competition = () => {
    return (
        <section className="space overflow-hidden" id="pitch-competition" data-bg-src="assets/img/bg/gray-bg2.png">
            <div className="container">
                <div className="row gy-40 align-items-center">
                    <div className="col-lg-6">
                        <div className="ratio ratio-16x9 rounded" style={{ overflow: 'hidden' }}>
                            {/* Replace this image with your flyer when ready */}
                            <img src="/assets/img/pages/index.jpg" alt="Enactus Annual Competition Flyer" style={{ width: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <span className="sub-title after-none before-none">
                            <i className="far fa-heart text-theme"></i> Enactus Annual Competition
                        </span>
                        <h2 className="sec-title">Showcasing Student Innovation To Investors</h2>
                        <p className="sec-text">
                            Our annual competition gives tertiary students and individuals a platform to pitch
                            solutions with real-world impact. Connect with partners and investors ready to help scale.
                        </p>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                            <Link to="/competition" className="th-btn">
                                View Competition Details <i className="fa-solid fa-arrow-up-right ms-2"></i>
                            </Link>
                            <Link to="/competition/2026" className="th-btn style2">
                                2026 Pitching Competition <i className="fa-solid fa-flag ms-2"></i>
                            </Link>
                            <Link to="/contact" className="th-btn style3">
                                Sponsor & Partner <i className="fa-solid fa-handshake ms-2"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Competition;



```

### FILE: src/components/Contact.tsx
```typescript
import React from 'react';

const Contact = () => {
    return (
        <section className="space">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-7">
                        <div className="title-area text-center">
                            <span className="sub-title after-none before-none"><i className="far fa-heart text-theme"></i> Contact Us</span>
                            <h2 className="sec-title">Get In Touch With Enactus CKT-UTAS</h2>
                            <p className="sec-text">We’d love to hear from you. Reach out for partnerships, membership, or general enquiries.</p>
                        </div>
                    </div>
                </div>
                <div className="row gy-30">
                    <div className="col-lg-6">
                        <div className="info-card style2">
                            <div className="box-icon bg-theme"><i className="fal fa-phone"></i></div>
                            <div className="box-content">
                                <p className="box-text">Call us any time</p>
                                <h4 className="box-title"><a href="tel:+233506063217">+233 50 606 3217</a></h4>
                            </div>
                        </div>
                        <div className="info-card style2">
                            <div className="box-icon bg-theme2"><i className="fal fa-envelope-open"></i></div>
                            <div className="box-content">
                                <p className="box-text">Email us</p>
                                <h4 className="box-title"><a href="mailto:enactus@cktutas.edu.gh">enactus@cktutas.edu.gh</a></h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <form className="contact-form">
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <input type="text" className="form-control" name="name" placeholder="Name" />
                                </div>
                                <div className="form-group col-md-6">
                                    <input type="email" className="form-control" name="email" placeholder="Email" />
                                </div>
                                <div className="form-group col-12">
                                    <input type="text" className="form-control" name="subject" placeholder="Subject" />
                                </div>
                                <div className="form-group col-12">
                                    <textarea className="form-control" name="message" rows="5" placeholder="Message" />
                                </div>
                                <div className="form-group col-12">
                                    <button className="th-btn style3" type="submit">Send Message</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;





```

### FILE: src/components/Donation.tsx
```typescript
import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from './projectsData';

const Donation = () => {
    return (
        <section className="space overflow-hidden" id="donation-sec">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="title-area text-center">
                            <span className="sub-title before-none after-none">
                                <i className="far fa-heart text-theme"></i> Our Projects
                            </span>
                            <h2 className="sec-title">Student-Led Ventures Creating Measurable Impact</h2>
                        </div>
                    </div>
                </div>
                <div className="row gy-30">
                    {projects.map((p, idx) => (
                        <div className="col-xl-6" key={p.slug}>
                        <div className="donation-card style3">
                            <div className="box-thumb">
                                    <img src={p.coverImage} alt={p.title} />
                                    <div className={`donation-card-tag ${idx % 2 === 1 ? 'bg-theme2' : ''}`}>❤️</div>
                                <div className="donation-card-shape" data-mask-src="assets/img/donation/donation-card-shape2-1.png"></div>
                            </div>
                            <div className="box-content">
                                <h3 className="box-title">
                                        <Link to={`/projects/${p.slug}`}>{p.title}</Link>
                                </h3>
                                    <p>{p.shortDescription}</p>
                                {/* <div className="donation-card_progress-wrap">
                                    <div className="progress">
                                        <div className="progress-bar" style={{ width: '85%' }}></div>
                                    </div>
                                    <div className="donation-card_progress-content">
                                        <span className="donation-card_raise">
                                                Raised <span className="donation-card_raise-number">—</span>
                                        </span>
                                        <span className="donation-card_goal">
                                                Goal <span className="donation-card_goal-number">—</span>
                                        </span>
                                    </div>
                                    </div> */}
                                    <div className="d-flex gap-2">
                                        <Link to={`/projects/${p.slug}`} className="th-btn style6">
                                    View Project <i className="fas fa-arrow-up-right ms-2"></i>
                                        </Link>
                                        {p.actionType === 'donate' ? (
                                            <Link to={`/projects/${p.slug}#donate`} className="th-btn">
                                                Donate <i className="fas fa-heart ms-2"></i>
                                            </Link>
                                        ) : (
                                            <Link to={`/projects/${p.slug}#partner`} className="th-btn">
                                                Partnership <i className="fas fa-handshake ms-2"></i>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Donation;


```

### FILE: src/components/FAQ.tsx
```typescript
import React from 'react';

const FAQ = () => {
    return (
        <div className="overflow-hidden space" id="faq-sec">
            <div className="container">
                <div className="row gy-60 align-items-center">
                    <div className="col-xl-7">
                        <div className="title-area">
                            <span className="sub-title after-none before-none">
                                <i className="far fa-heart text-theme"></i> FAQ
                            </span>
                            <h2 className="sec-title">Frequently Asked Questions</h2>
                            <p className="sec-text">
                                Find answers to common questions about our organization, programmes, and how you can get involved.
                            </p>
                        </div>
                        <div className="accordion" id="faqAccordion">
                            <div className="accordion-card style2">
                                <div className="accordion-header" id="collapse-item-1">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-1" aria-expanded="true" aria-controls="collapse-1">
                                        What are Enactus CKT-UTAS’s recent achievements?
                                    </button>
                                </div>
                                <div id="collapse-1" className="accordion-collapse collapse show" aria-labelledby="collapse-item-1" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        <p className="faq-text">
                                            We have won the Enactus National Expo four consecutive times from 2021 to 2024.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-card style2">
                                <div className="accordion-header" id="collapse-item-2">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-2" aria-expanded="false" aria-controls="collapse-2">
                                        How do I become a member?
                                    </button>
                                </div>
                                <div id="collapse-2" className="accordion-collapse collapse" aria-labelledby="collapse-item-2" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        <p className="faq-text">
                                            Purchase a form or voucher and attend an interview. Membership decisions are made after the interview.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-card style2">
                                <div className="accordion-header" id="collapse-item-3">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-3" aria-expanded="false" aria-controls="collapse-3">
                                        Do members pay dues?
                                    </button>
                                </div>
                                <div id="collapse-3" className="accordion-collapse collapse" aria-labelledby="collapse-item-3" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        <p className="faq-text">
                                            Yes. Members pay a small due per semester to support activities and operations.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-card style2">
                                <div className="accordion-header" id="collapse-item-4">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-4" aria-expanded="false" aria-controls="collapse-4">
                                        What SDGs does Enactus CKT-UTAS work on?
                                    </button>
                                </div>
                                <div id="collapse-4" className="accordion-collapse collapse" aria-labelledby="collapse-item-4" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        <p className="faq-text">
                                            We have tackled 13+ UN Sustainable Development Goals through our projects and community engagements.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-5">
                        <div className="faq-img-box2">
                            <div className="img1">
                                <img src="assets/img/normal/faq_2_1.png" alt="img" />
                            </div>
                            <div className="faq-img-shape">
                                <img src="assets/img/shape/faq-shape2-1.png" alt="img" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;


```

### FILE: src/components/Feature.tsx
```typescript
import React from 'react';

const Feature = () => {
    return (
        <section className="feature-area-1 position-relative space-bottom">
            <div className="feature-bg-wrap" data-bg-src="assets/img/bg/gray-bg2.png" data-mask-src="assets/img/bg/feature-bg-mask-1.png">
                <div className="feature-bg-shape1-1"></div>
            </div>
            <div className="container">
                <div className="row gy-30 gx-30 justify-content-end">
                    <div className="col-12 pb-2">
                        <div className="alert alert-light text-center fw-semibold" role="alert" style={{ background: 'rgba(255,215,0,.15)' }}>
                            40+ Student Leaders | 1200+ Volunteer Hours | 13 SDGs Tackled | 800+ km Traveled
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4">
                        <div className="feature-card">
                            <div className="feature-card-bg-shape">
                            </div>
                            <div className="box-icon">
                                <img src="assets/img/icon/feature-icon1-2.svg" alt="Innovation icon" />
                            </div>
                            <h3 className="box-title">Innovation In Action</h3>
                            <p className="box-text">
                                Student-led prototypes and ventures tackling sustainability and livelihoods with practical, scalable solutions.
                            </p>

                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4">
                        <div className="feature-card">
                            <div className="feature-card-bg-shape">
                            </div>
                            <div className="box-icon">
                                <img src="assets/img/icon/service-icon/service-card-icon1-3.svg" alt="Leadership icon" />
                            </div>
                            <h3 className="box-title">Entrepreneurial Leadership</h3>
                            <p className="box-text">
                                Building leaders who use business as a force for good to create measurable impact.
                            </p>

                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4">
                        <div className="feature-card">
                            <div className="feature-card-bg-shape">
                            </div>
                            <div className="box-icon">
                                <img src="assets/img/icon/service-icon/service-card-icon1-1.svg" alt="Community icon" />
                            </div>
                            <h3 className="box-title">Community Impact</h3>
                            <p className="box-text">
                                Co-creating change with local communities through education, inclusion, and sustainable practices.
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Feature;


```

### FILE: src/components/Footer.tsx
```typescript
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-wrapper footer-layout2">
            <div className="shape-mockup footer-bg-shape2-1 jump" data-left="0" data-top="0">
                <div className="color-masking2">
                    <div className="masking-src" data-mask-src="assets/img/shape/footer-bg-shape2-1.png"></div>
                    <img src="assets/img/shape/footer-bg-shape2-1.png" alt="img" />
                </div>
            </div>
            <div className="shape-mockup footer-bg-shape2-2 jump-reverse" data-right="0" data-bottom="0">
                <div className="color-masking">
                    <div className="masking-src" data-mask-src="assets/img/shape/footer-bg-shape2-2.png"></div>
                    <img src="assets/img/shape/footer-bg-shape2-2.png" alt="img" />
                </div>
            </div>
            <div className="widget-area space-top">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-md-6 col-xl-auto">
                            <div className="widget footer-widget">
                                <div className="th-widget-about">
                                    <div className="about-logo">
                                        <Link to="/"><img src="/assets/img/logo/enactus.png?v=3" alt="Enactus CKT-UTAS" style={{height: '40px', width: 'auto'}} /></Link>
                                    </div>
                                    <p className="about-text mb-3">
                                        Enactus CKT-UTAS is a student club for social entrepreneurs, building sustainable solutions that improve lives.
                                    </p>
                                    <div className="info-card style2">
                                        <div className="box-icon bg-theme">
                                            <i className="fal fa-phone"></i>
                                        </div>
                                        <div className="box-content">
                                            <p className="box-text">Call us any time:</p>
                                            <h4 className="box-title"><a href="tel:16336547896">+233 50 606 3217</a></h4>
                                        </div>
                                    </div>
                                    <div className="info-card style2">
                                        <div className="box-icon bg-theme2">
                                            <i className="fal fa-envelope-open"></i>
                                        </div>
                                        <div className="box-content">
                                            <p className="box-text">Email us any time:</p>
                                            <h4 className="box-title"><a href="mailto:enactus@cktutas.edu.gh">enactus@cktutas.edu.gh</a></h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-auto">
                            <div className="widget widget_nav_menu footer-widget">
                                <h3 className="widget_title">Quick Links</h3>
                                <div className="menu-all-pages-container">
                                    <ul className="menu">
                                        <li><Link to="/about">About Us</Link></li>
                                        <li><Link to="/blog">Our News</Link></li>
                                        <li><Link to="/projects">Our Projects</Link></li>
                                        <li><Link to="/privacy">Privacy policy</Link></li>
                                        <li><Link to="/contact">Contact Us</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-auto">
                            <div className="widget widget_nav_menu footer-widget">
                                <h3 className="widget_title">Our Service</h3>
                                <div className="menu-all-pages-container">
                                    <ul className="menu">
                                        <li><Link to="/join">Join Enactus</Link></li>
                                        <li><Link to="/about">Education & Training</Link></li>
                                        <li><Link to="/projects">Community Projects</Link></li>
                                        <li><Link to="/contact">Partnerships</Link></li>
                                        <li><Link to="/projects">Our Initiatives</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-auto">
                            <div className="widget newsletter-widget footer-widget">
                                <h3 className="widget_title">Newsletter</h3>
                                <p className="footer-text mb-4">
                                    Subscribe to Our Newsletter. Regular inspection and feedback mechanisms
                                </p>
                                <form className="newsletter-form">
                                    <div className="form-group style-dark">
                                        <input className="form-control" type="email" placeholder="Enter your email" required="" />
                                    </div>
                                    <button type="submit" className="th-btn style5">
                                        <i className="fas fa-paper-plane"></i>
                                    </button>
                                </form>
                                <div className="th-social style6">
                                    <a href="https://www.facebook.com/">
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="https://www.twitter.com/">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="https://www.linkedin.com/">
                                        <i className="fab fa-linkedin-in"></i>
                                    </a>
                                    <a href="https://www.behance.com/">
                                        <i className="fab fa-behance"></i>
                                    </a>
                                    <a href="https://www.vimeo.com/">
                                        <i className="fab fa-vimeo-v"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright-wrap bg-theme text-center">
                <div className="container">
                    <p className="copyright-text">
                        Copyright 2025 <Link to="/">Enactus CKT-UTAS</Link> All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;


```

### FILE: src/components/Header.tsx
```typescript
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false)
    return (
        <header className="th-header header-layout2">
            <div className="sticky-wrapper">
                {/* Main Menu Area */}
                <div className="container">
                    <div className="menu-area">
                        <div className="header-logo">
                            <Link to="/"><img src="/assets/img/logo/enactus.png?v=3" alt="Enactus CKT-UTAS" style={{height: '40px', width: 'auto'}} /></Link>
                        </div>
                        <div className="menu-area-wrap">
                            <nav className="main-menu d-none d-lg-block">
                                <ul>
                                    <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
                                    <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink></li>
                                    <li><NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>Projects</NavLink></li>
                                    <li><NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''}>Blog</NavLink></li>
                                    <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink></li>
                                </ul>
                            </nav>
                            <p className="header-notice">
                                {/* <img className="me-1" src="assets/img/icon/heart-icon.svg" alt="img" /> */}
                                Enactus CKT-UTAS: Student Social Entrepreneurs Driving Sustainable Impact.
                            </p>
                        </div>
                        <div className="header-button">
                            <Link to="/join" className="th-btn style3 d-xl-block d-none">
                                <i className="fas fa-heart me-2"></i>
                                Join Us
                            </Link>
                            <button type="button" className="icon-btn th-menu-toggle d-lg-none" onClick={() => setMobileOpen(true)} aria-label="Open Menu" aria-expanded={mobileOpen}>
                                <i className="far fa-bars"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-lg-none" style={{position:'fixed', inset:0, background: mobileOpen ? 'rgba(0,0,0,.4)' : 'transparent', pointerEvents: mobileOpen ? 'auto' : 'none', transition: 'background .2s ease'}} onClick={() => setMobileOpen(false)}>
                <nav role="navigation" aria-label="Mobile" style={{position:'absolute', top:0, right:0, height:'100%', width:'80%', maxWidth:320, background:'#fff', transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)', transition:'transform .2s ease', boxShadow:'0 0 20px rgba(0,0,0,.2)', padding:20}} onClick={(e)=>e.stopPropagation()}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <strong>Menu</strong>
                        <button type="button" className="icon-btn" onClick={() => setMobileOpen(false)} aria-label="Close Menu">
                            <i className="fal fa-times"></i>
                        </button>
                    </div>
                    <ul className="list-unstyled m-0">
                        <li className="mb-2"><NavLink to="/" onClick={() => setMobileOpen(false)} className={({isActive})=> isActive?'active':''}>Home</NavLink></li>
                        <li className="mb-2"><NavLink to="/about" onClick={() => setMobileOpen(false)} className={({isActive})=> isActive?'active':''}>About</NavLink></li>
                        <li className="mb-2"><NavLink to="/projects" onClick={() => setMobileOpen(false)} className={({isActive})=> isActive?'active':''}>Projects</NavLink></li>
                        <li className="mb-2"><NavLink to="/blog" onClick={() => setMobileOpen(false)} className={({isActive})=> isActive?'active':''}>Blog</NavLink></li>
                        <li className="mb-2"><NavLink to="/contact" onClick={() => setMobileOpen(false)} className={({isActive})=> isActive?'active':''}>Contact</NavLink></li>
                        <li className="mt-3"><Link to="/join" className="th-btn w-100" onClick={() => setMobileOpen(false)}>Join Us</Link></li>
                    </ul>
                </nav>
            </div> 
        </header>
    );
};

export default Header;


```

### FILE: src/components/Hero.tsx
```typescript
import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="th-hero-wrapper hero-3" id="hero">
            <div className="shape-mockup hero-shape-3-1 d-lg-block d-none" data-top="20%" data-left="50%">
                <div className="color-masking">
                    <div className="masking-src" data-mask-src="assets/img/hero/hero-bg-shape2-3.png"></div>
                    <img src="assets/img/hero/hero-bg-shape2-3.png" alt="shape" />
                </div>
            </div>
            <div className="shape-mockup hero-shape-3-2 jump" data-top="25%" data-left="5%">
                <div className="color-masking">
                    <div className="masking-src" data-mask-src="assets/img/hero/hero-bg-shape2-1.png"></div>
                    <img src="assets/img/hero/hero-bg-shape2-1.png" alt="shape" />
                </div>
            </div>
            {/* Removed waving hand shape behind the logo */}

            <div className="container">
                <div className="row gx-40 align-items-start">
                    <div className="col-lg-6">
                        <div className="hero-style3 hero-style-mobile-bg">
                            <span className="sub-title after-none">Enactus CKT-UTAS</span>
                            <h1 className="hero-title">
                                <span className="title2">Transforming <span className="text-theme2 d-inline-block">Visions</span> Into Reality</span>
                            </h1>
                            <p className="hero-text">
                                We are a student social entrepreneurship club turning ideas into impact through innovation, leadership, and action. Together, we transform challenges into opportunities, and visions into reality.
                            </p>
                            <p className="hero-text" style={{ fontStyle: 'italic' }}>
                                “At Enactus CKT-UTAS, we believe that, out of despair blooms hope, the seed of transformative change. Our story is one of creativity, perseverance, and passion.”
                            </p>
                            <div className="btn-wrap">
                                <Link to="/projects" className="th-btn">
                                    Explore Our Projects<i className="fa-solid fa-arrow-up-right ms-2"></i>
                                </Link>
                                <Link to="/join" className="th-btn style2">
                                    Join Us<i className="fa-solid fa-arrow-up-right ms-2"></i>
                                </Link>
                            </div>
                            <div className="mt-4 d-lg-none text-center">
                                <img src="/assets/img/celebration/IMG_3579.jpg" alt="Celebration" style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }} />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="text-center text-lg-end hero-img-offset-lg d-none d-lg-block">
                            <img src="/assets/img/celebration/IMG_3579.jpg" alt="Celebration" style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;


```

### FILE: src/components/index.tsx
```typescript
export { default as Header } from './Header';
export { default as Hero } from './Hero';
export { default as Feature } from './Feature';
export { default as About } from './About';
export { default as Service } from './Service';
export { default as Donation } from './Donation';
export { default as Team } from './Team';
export { default as Video } from './Video';
export { default as Pricing } from './Pricing';
export { default as FAQ } from './FAQ';
export { default as Brand } from './Brand';
export { default as Blog } from './Blog';
export { default as Footer } from './Footer';
export { default as Projects } from './Projects';
export { default as Competition } from './Competition';
export { default as Alumni } from './Alumni';


```

### FILE: src/components/news/BlogPost.tsx
```typescript
import React from 'react'
import { useParams, Link } from 'react-router-dom'

const posts = {
    'presidency-invite-2024': {
        title: 'Enactus CKT-UTAS visits Jubilee House after National Win',
        date: 'August 2024',
        tag: 'Recognition',
        hero: '/assets/img/president/IMG_5059.JPG',
        content: (
            <>
                <p>
                    After winning the 2024 Enactus National Expo, Enactus CKT-UTAS received an invitation from
                    H.E. Nana Addo Dankwa Akufo-Addo to the Jubilee House. The visit recognized the team’s
                    achievements and reaffirmed national support for youth-led innovation.
                </p>
                <p>
                    Discussions centered on scaling impactful student-led ventures across regions and strengthening
                    university-industry-government collaboration.
                </p>
            </>
        ),
    },
    'menstrual-health-outreach-2025': {
        title: 'Menstrual Health Outreach at Adabayeri JHS, Navrongo',
        date: 'June 2025',
        tag: 'Health',
        hero: '/assets/img/outreach/IMG_4864.jpg',
        content: (
            <>
                <p>
                    We visited Adabayeri JHS in the Upper East Region, Navrongo, to sensitize students on menstrual
                    health and hygiene. As part of the engagement, we distributed sanitary pads and educational
                    materials.
                </p>
                <p>
                    The outreach is part of our broader commitment to SDG 3 (Good Health and Well-being) and SDG 5
                    (Gender Equality).
                </p>
            </>
        ),
    },
    'hand-over-ceremony-2025': {
        title: 'Handover Ceremony, Awards & Dinner Night',
        date: 'July 2025',
        tag: 'Community',
        hero: '/assets/img/celebration/IMG_3610.jpg',
        content: (
            <>
                <p>
                    Enactus CKT-UTAS held its handover ceremony, awards, and dinner night to celebrate an impactful
                    year and usher in a new leadership team. Outstanding members and project leaders were recognized
                    for excellence and service.
                </p>
                <p>
                    The event marked the climax of the academic year and set the tone for new initiatives.
                </p>
            </>
        ),
    },
}

export default function BlogPost() {
    const { slug } = useParams()
    const post = posts[slug]

    if (!post) {
        return (
            <section className="space">
                <div className="container text-center">
                    <h1 className="sec-title">Post not found</h1>
                    <Link to="/blog" className="th-btn mt-2">Back to Blog</Link>
                </div>
            </section>
        )
    }

    return (
        <section className="space" data-bg-src="assets/img/bg/gray-bg2.png">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-9">
                        <div className="title-area text-center">
                            <span className="sub-title after-none before-none">
                                <i className="far fa-heart text-theme"></i> {post.tag}
                            </span>
                            <h1 className="sec-title">{post.title}</h1>
                            <div className="blog-meta"><i className="fas fa-calendar-days"></i> {post.date}</div>
                        </div>
                        <div className="mb-30">
                            <img src={post.hero} alt={post.title} style={{ width: '100%', borderRadius: 12 }} />
                        </div>
                        <div className="content">
                            {post.content}
                        </div>
                        <div className="text-center mt-30">
                            <Link to="/blog" className="th-btn">Back to Blog</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}



```

### FILE: src/components/Pricing.tsx
```typescript
import React from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
    return (
        <section className="space overflow-hidden">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-7">
                        <div className="title-area text-center">
                            <span className="sub-title after-none before-none">
                                <i className="far fa-heart text-theme"></i> Membership & Programmes
                            </span>
                            <h2 className="sec-title">Opportunities For Students To Learn, Build, And Lead</h2>
                        </div>
                    </div>
                </div>
                <div className="row gy-30 justify-content-center">
                    <div className="col-xl-12 col-lg-4 col-md-6">
                        <div className="price-card2">
                            <div className="price-card-title-wrap">
                                <h3 className="price-card_title">Campus Member</h3>
                                <p className="price-card_text">Join our open community of student innovators and changemakers.</p>
                            </div>
                            <div className="price-card-price-wrap">
                                <h4 className="price-card_price">Free</h4>
                            </div>
                            <div className="price-card_content">
                                <div className="checklist">
                                    <ul>
                                        <li><i className="fas fa-circle-check"></i> Access to meetings & workshops</li>
                                        <li><i className="fas fa-circle-check"></i> Project team placements</li>
                                        <li><i className="fas fa-circle-check"></i> Mentorship & career support</li>
                                        <li><i className="fas fa-circle-check"></i> National Expo participation</li>
                                    </ul>
                                </div>
                                <Link to="/join" className="th-btn style3 w-100">Join Enactus CKT-UTAS</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;


```

### FILE: src/components/ProjectDetails.tsx
```typescript
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectBySlug } from './projectsData';

const ProjectDetails = () => {
    const { slug } = useParams();
    const project = getProjectBySlug(slug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!project) {
        return (
            <div className="space">
                <div className="container text-center">
                    <h2 className="sec-title">Project not found</h2>
                    <Link to="/projects" className="th-btn mt-3">Back to Projects</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space">
            <div className="container">
                <div className="row gy-40 align-items-start">
                    <div className="col-lg-6">
                        <img src={project.coverImage} alt={project.title} style={{ width: '100%', borderRadius: '16px' }} />
                    </div>
                    <div className="col-lg-6">
                        <span className="sub-title after-none before-none"><i className="text-theme far fa-heart"></i> Project</span>
                        <h2 className="sec-title">{project.title}</h2>
                        <p className="mb-20">{project.fullDescription}</p>

                        {project.actionType === 'donate' ? (
                            <div id="donate" className="project-cta card p-3">
                                <h4 className="box-title">Support This Project</h4>
                                <p className="mb-2"><strong>MoMo Number:</strong> {project.finance.momoNumber}</p>
                                <p className="mb-2"><strong>Finance Director:</strong> {project.finance.directorName}</p>
                                <p className="mb-3"><strong>Contact:</strong> {project.finance.phone}</p>
                                <a href={`tel:${project.finance.phone.replace(/\s/g, '')}`} className="th-btn">
                                    Call Finance Director
                                </a>
                            </div>
                        ) : (
                            <div id="partner" className="project-cta card p-3">
                                <h4 className="box-title">Partner With Us</h4>
                                <p className="mb-2"><strong>Project Director:</strong> {project.projectDirector.name}</p>
                                <p className="mb-2"><strong>Phone:</strong> {project.projectDirector.phone}</p>
                                <p className="mb-3"><strong>Email:</strong> {project.projectDirector.email}</p>
                                <div className="d-flex gap-2">
                                    <a href={`tel:${project.projectDirector.phone.replace(/\s/g, '')}`} className="th-btn">Call</a>
                                    <a href={`mailto:${project.projectDirector.email}`} className="th-btn style2">Email</a>
                                </div>
                            </div>
                        )}

                        <div className="mt-3">
                            <Link to="/projects" className="link-btn style2">Back to Projects <i className="fa-solid fa-arrow-up-right ms-2"></i></Link>
                        </div>
                    </div>
                </div>

                {/* Images below come from project.gallery in src/components/projectsData.js.
                    Add '/assets/...' image paths to that gallery array to display them here. */}
                <div className="title-area text-center mt-40">
                    <h3 className="sec-title">Project Photo Gallery</h3>
                    <p className="sec-text">Drop image paths into the project "gallery" array to show them here.</p>
                </div>

                {project.gallery && project.gallery.length > 0 ? (
                    <div className="row gy-20">
                        {project.gallery.map((src, idx) => (
                            <div className="col-6 col-md-4 col-lg-3" key={idx}>
                                <img src={src} alt={`${project.title} ${idx + 1}`} style={{ width: '100%', borderRadius: 12 }} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="row gy-20">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                            <div className="col-6 col-md-4 col-lg-3" key={i}>
                                <div className="ratio ratio-1x1" style={{ background: '#f8fafc', borderRadius: 12, border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                    <span>Image {i}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;



```

### FILE: src/components/Projects.tsx
```typescript
import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from './projectsData';

const Projects = () => {
    return (
        <div className="space" id="projects">
            <div className="container">
                <div className="title-area text-center mb-40">
                    <span className="sub-title after-none before-none">
                        <i className="text-theme far fa-heart"></i> Our Projects
                    </span>
                    <h2 className="sec-title">What We’re Working On</h2>
                </div>
                <div className="row gy-30">
                    {projects.map((p) => (
                        <div className="col-md-6 col-lg-4" key={p.slug}>
                            <div className="project-card">
                                <div className="project-thumb">
                                    <img src={p.coverImage} alt={p.title} />
                                </div>
                                <div className="project-content">
                                    <h3 className="box-title">{p.title}</h3>
                                    <p className="mb-2">{p.shortDescription}</p>
                                    <div className="d-flex gap-2">
                                        <Link className="th-btn style2" to={`/projects/${p.slug}`}>
                                            Read More <i className="fa-solid fa-arrow-up-right ms-2"></i>
                                        </Link>
                                        {p.actionType === 'donate' ? (
                                            <Link className="th-btn" to={`/projects/${p.slug}#donate`}>
                                                Donate <i className="fa-solid fa-heart ms-2"></i>
                                            </Link>
                                        ) : (
                                            <Link className="th-btn" to={`/projects/${p.slug}#partner`}>
                                                Partnership <i className="fa-solid fa-handshake ms-2"></i>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="row g-2">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div className="col-4" key={`${p.slug}-ph-${i}`}>
                                            <div className="ratio ratio-1x1" style={{ background: '#f8fafc', borderRadius: 8, border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 12 }}>
                                                <span>Photo {i}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Projects;



```

### FILE: src/components/projectsData.tsx
```typescript
export const projects = [
  {
    slug: 'flow-with-dignity',
    title: 'Flow with Dignity (Menstrual Hygiene & Plastic Waste Outreach)',
    shortDescription:
      'Annual outreach donating sanitary pads and educating on menstrual hygiene and plastic waste awareness.',
    fullDescription:
      'In Ghana, many young girls miss school during their periods due to lack of sanitary products and menstrual health education. This affects their confidence, academic performance, and future opportunities. At the same time, improper disposal of plastics—including sanitary waste—continues to choke our environment.\n\nTo address these twin challenges, ENACTUS CKT-UTAS launched Flow with Dignity, an annual outreach program held on World Menstrual Hygiene Day. Each year, we donate sanitary pads to schoolgirls at Adabayere JHS and neighboring schools while providing education on menstrual hygiene, breaking taboos, and fostering dignity. Alongside this, we sensitize students on proper plastic waste management, linking menstrual health to broader environmental responsibility.\n\nThis initiative empowers girls to stay in school, promotes gender equality, and creates awareness about sustainable waste practices. Flow with Dignity goes beyond pads—it’s about restoring dignity, improving education outcomes, and protecting our environment.',
    coverImage: '/assets/img/outreach/IMG_4864.jpg',
    actionType: 'donate',
    // Add '/assets/...' image paths here to show on the Project Details gallery
    gallery: [
      '/assets/img/projects/menstrual/img5.jpg',
      '/assets/img/projects/menstrual/img4.jpg',
      '/assets/img/projects/menstrual/img3.jpg',
      '/assets/img/projects/menstrual/img2.jpg',
      '/assets/img/projects/menstrual/img1.jpg',
    ],
    finance: {
      directorName: 'Finance Director',
      phone: '+233 55 000 0000',
      momoNumber: '055 000 0000',
    },
  },
  {
    slug: 'learn-and-rise',
    title: 'Learn & Rise (Books & Pens Donation Project)',
    shortDescription:
      'Annual books and pens donation outreaches to support quality education in rural schools.',
    fullDescription:
      'Education remains one of the most powerful tools to break the cycle of poverty, yet many children in rural Ghana still lack access to basic learning materials. Without exercise books or pens, countless pupils struggle to fully participate in class, limiting their academic growth and opportunities.\n\nThrough our Learn & Rise project, we organize annual book and pen donation outreaches across rural communities. These donations equip students with essential learning tools while inspiring hope and motivation. Beyond the materials, our team engages students with mentorship talks, encouraging them to dream big and work hard towards their goals.\n\nThe project directly supports SDG 4 (Quality Education) by promoting literacy and educational inclusivity. By tackling these foundational barriers, Learn & Rise helps nurture the next generation of thinkers, leaders, and change-makers. Every book shared is a step toward a brighter future.',
    coverImage: '/assets/img/outreach/IMG_4864.jpg',
    actionType: 'donate',
    // Add '/assets/...' image paths here for this project's gallery
    gallery: [],
    finance: {
      directorName: 'Finance Director',
      phone: '+233 55 000 0000',
      momoNumber: '055 000 0000',
    },
  },
  {
    slug: 'agrihub',
    title: 'AgriHub',
    shortDescription:
      'Digital agricultural platform with AI guidance, real-time data, and direct market access for farmers.',
    fullDescription:
      'Agriculture is the backbone of Ghana, yet farmers continue to face limited market access, poor-quality inputs, and climate uncertainties. AgriHub was created to tackle these challenges by offering a comprehensive, tech-driven solution that bridges the digital divide. Through the platform, farmers can sell produce directly to verified buyers, receive real-time weather updates, access AI-driven planting guidance, and detect crop diseases specific to their region.\n\nThe platform also provides video consultations with certified agronomists and deploys local AgriHub agents to assist offline communities. Beyond income generation, AgriHub reduces post-harvest losses, promotes climate-resilient farming, and empowers young graduates with jobs as local agents. Through outreaches, our team has engaged farmers across Northern Ghana, introducing them to the benefits of digital agriculture. AgriHub is not just an app—it is a revolution in sustainable farming and food security.',
    coverImage: '/assets/img/donation/donation2-1.png',
    actionType: 'partnership',
    // Add '/assets/...' image paths here for this project's gallery
    gallery: [],
    projectDirector: {
      name: 'Project Director',
      phone: '+233 54 000 0000',
      email: 'project@enactus-ckt-utas.org',
    },
  },
  {
    slug: 'polygen',
    title: 'Polygen',
    shortDescription:
      'Transforms plastic waste into eco-friendly fuel and durable construction bricks.',
    fullDescription:
      'Plastic waste is one of Ghana’s biggest environmental challenges, clogging gutters, fueling floods, and polluting the air through burning. Polygen was born to address this crisis with a dual-solution: converting plastic waste into diesel-like fuel through pyrolysis, and using the residue to create durable, fire-resistant eco-bricks.\n\nFor every 10kg of plastic processed, Polygen produces 7 liters of fuel and 10 bricks. This provides affordable energy for small businesses and cost-effective construction materials for housing developers, NGOs, and rural builders. By doing so, Polygen reduces CO2 emissions, supports sustainable construction, and creates economic opportunities for waste pickers.\n\nOur outreach efforts include school sensitizations on plastic management, with donations of books and sanitary pads to Adabayere JHS, reinforcing our commitment to community development. Polygen is more than recycling—it’s an engine for sustainability, affordable housing, and renewable energy.',
    coverImage: '/assets/img/donation/donation2-1.png',
    actionType: 'partnership',
    // Add '/assets/...' image paths here for this project's gallery
    gallery: [],
    projectDirector: {
      name: 'Project Director',
      phone: '+233 54 000 0000',
      email: 'project@enactus-ckt-utas.org',
    },
  },
  {
    slug: 'cocofert',
    title: 'Cocofert',
    shortDescription:
      'Organic fertilizer from coconut husk to boost soil health affordably.',
    fullDescription:
      'The overuse of chemical fertilizers has depleted Ghana’s soils, harmed biodiversity, and left many farmers struggling with low yields. Cocofert provides a sustainable alternative by turning coconut husks into nutrient-rich organic fertilizer. Tested by the Biological Science Department of CKT-UTAS, Cocofert contains essential plant nutrients (N-P-K), improves water-holding capacity, and neutralizes soil acidity.\n\nCompared to expensive inorganic fertilizers, Cocofert is cost-effective and biodegradable, giving farmers a healthier, eco-friendly option. Local farmers in Vonania have already testified to its positive impact on crop yields. With plans to scale production and explore other coconut by-products such as ropes, carpets, and egg crates, Cocofert is poised to transform agriculture across Ghana and beyond.\n\nThrough farmer outreaches and training, we are working to promote the adoption of Cocofert and improve livelihoods in rural communities. Cocofert is here to stay—putting smiles on farmers’ faces while restoring soil fertility.',
    coverImage: '/assets/img/donation/donation2-3.png',
    actionType: 'partnership',
    // Add '/assets/...' image paths here for this project's gallery
    gallery: [],
    projectDirector: {
      name: 'Project Director',
      phone: '+233 54 000 0000',
      email: 'project@enactus-ckt-utas.org',
    },
  },
  {
    slug: 'ecohusk',
    title: 'EcoHusk (Biowood & Biochar)',
    shortDescription:
      'Converts rice husk and straw into eco-friendly plywood alternatives and sustainable charcoal.',
    fullDescription:
      'Rice cultivation produces millions of tons of husks and straw that are often burnt, releasing harmful CO2 emissions and fueling climate change. EcoHusk provides a two-phased solution: Biowood and Biochar.\n\nBiowood transforms rice husks into biodegradable plywood and boards, offering affordable alternatives for furniture and interior design. Already in collaboration with local carpenters, EcoHusk has generated revenue, created jobs, and impacted thousands of lives. The second phase, Biochar, converts rice straw into sustainable charcoal that reduces deforestation, enriches soil fertility, and provides a cheaper fuel source for households.\n\nThrough community engagements, we are training farmers on sustainable practices and creating jobs in the value chain. EcoHusk doesn’t just recycle waste—it builds resilience, protects forests, and powers communities sustainably.',
    coverImage: '/assets/img/donation/donation2-4.png',
    actionType: 'partnership',
    // Add '/assets/...' image paths here for this project's gallery
    gallery: [],
    projectDirector: {
      name: 'Project Director',
      phone: '+233 54 000 0000',
      email: 'project@enactus-ckt-utas.org',
    },
  },
  {
    slug: 'bioplast',
    title: 'Bioplast',
    shortDescription:
      'Biodegradable cassava-starch-based plastic bags as an alternative to single-use plastics.',
    fullDescription:
      'Ghana generates over 1.7 million tonnes of plastic waste annually, much of which ends up in gutters, rivers, and streets. To address this, Bioplast was developed using cassava starch—a by-product from Gari production. These biodegradable plastic bags decompose within three months, enriching the soil instead of polluting the environment.\n\nBioplast bags are affordable, elastic, and eco-friendly, with potential to include embedded seeds that sprout when discarded. With strong demand from food vendors, supermarkets, and retailers, Bioplast offers a ready market while addressing one of Ghana’s most urgent waste problems.',
    coverImage: '/assets/img/donation/donation2-2.png',
    actionType: 'partnership',
    gallery: [],
    projectDirector: {
      name: 'Project Director',
      phone: '+233 54 000 0000',
      email: 'project@enactus-ckt-utas.org',
    },
  },
];

export function getProjectBySlug(slug) {
  return projects.find(p => p.slug === slug);
}


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

### FILE: src/components/Service.tsx
```typescript
import React from 'react';
import { Link } from 'react-router-dom';

const Service = () => {
    return (
        <section className="overflow-hidden space" id="service-sec" data-bg-src="assets/img/bg/gray-bg2.png">
            <div className="shape-mockup service-bg-shape2-1 d-xxl-inline-block d-none" data-bottom="0" data-left="0">
                <img src="assets/img/shape/service_bg_shape3_1.png" alt="img" />
            </div>
            <div className="container">
                <div className="row gx-80">
                    <div className="col-xl-6">
                        <div className="service-wrap2">
                            <div className="title-area">
                                <span className="sub-title after-none before-none">
                                    <i className="far fa-heart text-theme"></i> What We Do
                                </span>
                                <h2 className="sec-title">Empowering Student Entrepreneurs To Build Sustainable Solutions</h2>
                                <p className="sec-text">
                                    We apply entrepreneurial thinking to solve social and environmental challenges. From product design to market validation, we turn classroom knowledge into real-world impact.
                                </p>
                            </div>
                            <div className="service-bg-shape2-2">
                                <img src="assets/img/service/service-thumb3-1.png" alt="img" />
                                <div className="service-bg-shape2-3">
                                    <div className="color-masking2">
                                        <div className="masking-src" data-mask-src="assets/img/shape/service_bg_shape3_2.png"></div>
                                        <img src="assets/img/shape/service_bg_shape3_2.png" alt="img" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="row gy-30">
                            <div className="col-12">
                                <div className="service-card2">
                                    <div className="service-card-icon">
                                        <img src="assets/img/icon/service-icon/service-card-icon1-1.svg" alt="Icon" />
                                    </div>
                                    <div className="box-content">
                                        <h3 className="box-title"><Link to="/about">Product & Prototype Labs</Link></h3>
                                        <p className="box-text">
                                            Share stories and experiences from current volunteers to inspire others to join. Allow user to sign up for volunteer opportunities.
                                        </p>
                                        <Link to="/about" className="icon-btn">
                                            <i className="fas fa-arrow-up-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="service-card2">
                                    <div className="service-card-icon">
                                        <img src="assets/img/icon/service-icon/service-card-icon1-2.svg" alt="Icon" />
                                    </div>
                                    <div className="box-content">
                                        <h3 className="box-title"><Link to="/about">Training & Leadership</Link></h3>
                                        <p className="box-text">
                                            Share stories and experiences from current volunteers to inspire others to join. Allow user to sign up for volunteer opportunities.
                                        </p>
                                        <Link to="/about" className="icon-btn">
                                            <i className="fas fa-arrow-up-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="service-card2">
                                    <div className="service-card-icon">
                                        <img src="assets/img/icon/service-icon/service-card-icon1-3.svg" alt="Icon" />
                                    </div>
                                    <div className="box-content">
                                        <h3 className="box-title"><Link to="/about">Community Partnerships</Link></h3>
                                        <p className="box-text">
                                            Share stories and experiences from current volunteers to inspire others to join. Allow user to sign up for volunteer opportunities.
                                        </p>
                                        <Link to="/about" className="icon-btn">
                                            <i className="fas fa-arrow-up-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Service;


```

### FILE: src/components/Team.tsx
```typescript
import React from 'react';

const Team = () => {
    return (
        <section className="space" id="team-sec" data-bg-src="assets/img/bg/gray-bg2.png">
            <div className="shape-mockup team-bg-shape3-1 d-xxl-block d-none" data-top="0%" data-left="0%" data-bottom="0">
                <img src="assets/img/shape/team_bg_shape3_1.png" alt="img" />
            </div>
            <div className="shape-mockup team-bg-shape3-2 d-xxl-block d-none" data-top="0%" data-right="0%" data-bottom="0">
                <img src="assets/img/shape/team_bg_shape3_2.png" alt="img" />
            </div>
            <div className="shape-mockup team-bg-shape3-3 spin d-xxl-block d-none" data-top="15%" data-left="20%">
                <div className="color-masking2">
                    <div className="masking-src" data-mask-src="assets/img/shape/team_bg_shape3_3.png"></div>
                    <img src="assets/img/shape/team_bg_shape3_3.png" alt="img" />
                </div>
            </div>
            <div className="shape-mockup team-bg-shape3-4 jump d-xxl-block d-none" data-top="18%" data-right="10%">
                <img src="assets/img/shape/team_bg_shape3_4.png" alt="img" />
            </div>
            <div className="shape-mockup team-bg-shape3-5 spin d-xxl-block d-none" data-bottom="18%" data-left="10%">
                <img src="assets/img/shape/team_bg_shape3_5.png" alt="img" />
            </div>
            <div className="shape-mockup team-bg-shape3-6 spin d-xxl-block d-none" data-bottom="10%" data-right="10%">
                <div className="color-masking">
                    <div className="masking-src" data-mask-src="assets/img/shape/team_bg_shape3_6.png"></div>
                    <img src="assets/img/shape/team_bg_shape3_6.png" alt="img" />
                </div>
            </div>
            <div className="container">
                <div className="title-area text-center">
                    <span className="sub-title after-none before-none">
                        <i className="far fa-heart text-theme"></i> Team
                    </span>
                    <h2 className="sec-title">Behind every project is a team of dreamers and doers.</h2>
                    <p className="mt-10">
                        40+ student leaders • 30+ community volunteers engaged • United by one purpose: Transforming visions into reality.
                    </p>
                </div>
                <div className="row g-4 mt-2">
                    {[
                        { img: 'assets/img/president/IMG_5055.JPG', role: 'Chapter President', dept: 'Leadership & Strategy' },
                        { img: 'assets/img/outreach/IMG_4878.jpg', role: 'Project Director', dept: 'Programmes & Partnerships' },
                        { img: 'assets/img/outreach/IMG_4893.jpg', role: 'Finance Director', dept: 'Budget & Operations' },
                        { img: 'assets/img/outreach/IMG_4895.jpg', role: 'Communications Lead', dept: 'Media & Outreach' },
                    ].map((m, i) => (
                        <div className="col-12 col-sm-6 col-lg-3" key={i}>
                            <div className="th-team team-card3 h-100">
                                <div className="team-img">
                                    <img src={m.img} alt={m.role} />
                                </div>
                                <div className="team-card-content">
                                    <h3 className="box-title">{m.role}</h3>
                                    <span className="team-desig">{m.dept}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;


```

### FILE: src/components/Video.tsx
```typescript
import React from 'react';

const Video = () => {
    return (
        <div className="video-area-3">
            <div className="shape-mockup video-bg-shape3-1" data-top="0" data-left="0" data-bottom="0">
                <img src="assets/img/shape/video_bg_shape3_1.png" alt="img" />
            </div>
            <div className="shape-mockup video-bg-shape3-2" data-top="0" data-right="0" data-bottom="0">
                <img src="assets/img/shape/video_bg_shape3_2.png" alt="img" />
            </div>
            <div className="video-thumb3-1 video-box-center">
                <img src="assets/img/normal/video-thumb3-1.png" alt="img" />
                <a href="https://www.youtube.com/watch?v=_sI_Ps7JSEk" className="play-btn style7 popup-video">
                    <i className="fa-sharp fa-solid fa-play"></i>
                </a>
            </div>
        </div>
    );
};

export default Video;


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

### FILE: src/Home.tsx
```typescript
import React from 'react';
import {
    Hero,
    Feature,
    About,
    Service,
    Donation,
    Team,
    Video,
    Pricing,
    FAQ,
    Brand,
    Blog,
    Competition,
    Alumni
} from './components';

export default function Home() {
    return (
        <div>
            <Hero />
            <Feature />
            <About />
            <Service />
            <Donation />
            <Team />
            <Alumni />
            <Video />
            <Pricing />
            <Competition />
            <FAQ />
            <Brand />
            <Blog />
        </div>
    );
}



```

### FILE: src/index.tsx
```typescript
import './main.jsx'



```

### FILE: src/main.tsx
```typescript
import { createRoot } from 'react-dom/client'
import AppWithAuth from './AppWithAuth'
import { AuthGate } from './AuthGate';

createRoot(document.getElementById('root')).render(
  <AuthGate><AppWithAuth /></AuthGate>
)

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
          <span className="font-bold text-sm">Enactus Ckt Frontend App Main</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Enactus Ckt Frontend App Main — Admin</h1>
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

### FILE: src/RouterPage.tsx
```typescript
import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import Home from './Home'
import About from './components/About'
import Projects from './components/Projects'
import ProjectDetails from './components/ProjectDetails'
import Blog from './components/Blog'
import BlogPost from './components/news/BlogPost'
import AlumniPage from './components/alumni/AlumniPage'
import CompetitionDetails from './components/competition/CompetitionDetails'
import Pitch2026 from './components/competition/Pitch2026'
import Contact from './components/Contact'
import Header from './components/Header'
import Footer from './components/Footer'

const Placeholder = ({ title }) => (
    <div style={{ padding: '120px 0' }}>
        <div className="container">
            <h1 className="sec-title">{title}</h1>
            <p>Content coming soon.</p>
        </div>
    </div>
)

export default function RouterPage() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetails />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/alumni" element={<AlumniPage />} />
                <Route path="/competition" element={<CompetitionDetails />} />
                <Route path="/competition/2026" element={<Pitch2026 />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/join" element={<Placeholder title="Join Enactus CKT-UTAS" />} />
                <Route path="/privacy" element={<Placeholder title="Privacy Policy" />} />
                <Route path="*" element={<Home />} />
            </Route>
        </Routes>
    )
}

const Layout = () => (
    <div>
        <Header />
        <Outlet />
        <Footer />
    </div>
)



```

### FILE: src/ScrollToTop.tsx
```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
    }, [pathname]);

    return null;
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

### FILE: src/vite-env.d.ts
```typescript
/// <reference types="vite/client" />

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — react-donat
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('react-donat E2E', () => {
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
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src"],
  "exclude": ["src/__tests__", "**/*.test.tsx", "**/*.e2e.ts", "vitest.config.ts", "vitest.e2e.config.ts"]
}

```

### FILE: vite.config.ts
```typescript
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './', // Add this line - ensures absolute paths from root
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Optional: explicitly set output directory
        outDir: 'dist',
        // Optional: ensure assets use absolute paths
        assetsDir: 'assets',
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
    };
});
```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — react-donat
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

// Vitest E2E configuration — react-donat
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

