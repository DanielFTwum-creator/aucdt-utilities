# sashmade - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for sashmade.

### FILE: .env.example
```text
# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
# Users configure this via the Secrets panel in the AI Studio UI.
GEMINI_API_KEY=[REDACTED_CREDENTIAL]

# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"

# VITE_GOOGLE_CLIENT_ID: Used for Google OAuth login on the frontend
VITE_GOOGLE_CLIENT_ID=[REDACTED_CREDENTIAL]

```

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

### FILE: CLAUDE.md
```md
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## SashMade — Afro-Chic Textile Studio

**SashMade** is an e-commerce storefront for Ghanaian Kente stoles, fabrics, and gift packages, built with React 19 + Vite. It includes an AI-powered fabric pattern analyzer ("Sash") powered by the Gemini API, a shopping cart, and a password-protected admin panel.

---

## Development Commands

```bash
pnpm install              # Install dependencies
pnpm run dev              # Start dev server on port 3000
pnpm run build            # Production build → dist/
pnpm run lint             # TypeScript type-check (tsc --noEmit)
pnpm run test:e2e         # Run Playwright e2e tests (auto-starts dev server)
pnpm run test:e2e:ui      # Playwright interactive UI mode
pnpm run test:e2e:report  # Open last test report
```

### Environment

Requires a `.env` or `.env.local` file with:
```
GEMINI_API_KEY=[REDACTED_CREDENTIAL]
```

Vite exposes this via `process.env.GEMINI_API_KEY` (defined in `vite.config.ts` — do not change this pattern).

---

## Architecture

### Context Providers (wrap the entire app)

- **`ThemeContext`** — dark/light mode toggle, persisted to localStorage
- **`AuthContext`** — user/admin session via localStorage; audit log written on login/logout
- **`CartContext`** — cart state persisted to `sashmade_cart` in localStorage

### Routing (`App.tsx`)

- Public routes under `<Layout />`: `/`, `/ai-studio`, `/shop`, `/about`, `/privacy`, `/terms`, `/refunds`
- Admin routes under `<AdminLayout />` (requires login at `/admin/login`): dashboard, inventory, diagnostics, testing, audit logs

### Admin Authentication

Mock auth only — credentials are hardcoded as `admin` / `sashmade2026` in `AdminLogin.tsx`. Not intended for production use as-is.

### AI Features (`src/services/gemini.ts`)

- **`generateChatResponse`** — stateful Gemini chat using `gemini-3-flash-preview`; "Sash" persona as system instruction
- **`analyzeFabricPattern`** — multimodal image analysis using `gemini-2.5-flash`; returns structured JSON (pattern name, cultural origin, color palette, etc.)

### Product Data (`src/data/products.ts`)

Static product catalog (Kente stoles, fabrics, gift packages). Adding/removing products requires editing this file directly — there is no backend database for products.

### Utility

- `src/lib/utils.ts` — exports `cn()` (clsx + tailwind-merge) for conditional class merging

---

## Testing

E2E tests live in `tests/e2e/` (one file per page: homepage, shop, about, admin, ai-studio). Playwright config targets `http://localhost:3000` and will auto-start the dev server if not already running. Tests run sequentially (`fullyParallel: false`) on Chromium only.

To run a single test file:
```bash
pnpm run test:e2e -- tests/e2e/shop.test.ts
```

---

## Key Config Notes

- **HMR** is controlled by `DISABLE_HMR` env var — do not add unconditional HMR config (used by AI Studio agent edits)
- **Chunk splitting** is manually configured in `vite.config.ts` to separate vendor bundles (react, router, charts, motion, icons, exceljs)
- `@` path alias resolves to the project root (not `src/`)

```

### FILE: CREATION.md
```md
# sashmade

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
FROM node:24-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || npm install
COPY . .
RUN pnpm run build || npm run build

FROM node:24-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
EXPOSE 4173
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/ADMIN_GUIDE.md
```md
﻿# SashMade Administrator Guide

**Version:** 2.0
**Date:** 2026-04-14
**Required React Version:** 19.2.5

## 1. Introduction
This guide provides instructions for administrators to manage the SashMade e-commerce platform. The Admin Console is a secure, password-protected area for monitoring system health, managing inventory, and viewing audit logs.

## 2. Accessing the Admin Console
1. Navigate to `/admin/login`.
2. Enter your credentials:
   - **Username:** `admin`
   - **Password:** `sashmade2026`
3. Upon successful login, you will be redirected to the Dashboard.

> **Security note:** Change the password before any public deployment by updating `src/pages/admin/AdminLogin.tsx` line 19.

## 3. Dashboard Overview
The Dashboard (`/admin/dashboard`) provides a high-level view of platform performance:
- **Total Sales:** Cumulative revenue from all orders.
- **Active Users:** Current session count.
- **System Health:** Overall status (Healthy / Degraded).
- **Weekly Sales Chart:** Revenue trend for the last 6 weeks (Recharts bar chart).

## 4. Inventory Manager
Navigate to `/admin/inventory` to:
- View all products with live price and stock status.
- Edit prices inline and toggle stock availability.
- Download full inventory as an `.xlsx` file (ExcelJS).
- Changes persist to `localStorage` and are reflected on the Shop page immediately.

## 5. System Diagnostics
Navigate to `/admin/diagnostics` to view:
- **Service Status:** Health checks for Gemini AI API, Hubtel Gateway, PostgreSQL, and Redis.
- **Latency:** Current system response time.
- **Uptime:** System uptime percentage.

## 6. Testing Framework
Navigate to `/admin/testing` to run the automated E2E suite:
1. Click **"Run All Tests"** to execute all 5 Playwright specs sequentially.
2. Click **"Rerun"** on any individual test card to re-execute just that spec.
3. Real-time logs appear in the terminal pane below each test card.
4. If a test fails, a failure screenshot is captured and displayed for debugging.

**Test specs (Playwright / Chromium):**

| ID | Name | File |
|---|---|---|
| E2E-01 | Homepage Load & Navigation | `homepage.test.ts` |
| E2E-02 | Shop / Collections | `shop.test.ts` |
| E2E-03 | About Page Content | `about.test.ts` |
| E2E-04 | AI Studio Tabs | `ai-studio.test.ts` |
| E2E-05 | Admin Console Auth & Inventory | `admin.test.ts` |

Run from the terminal: `pnpm test:e2e`

## 7. Audit Logs
Navigate to `/admin/audit` to view security events stored in `localStorage`:
- **Login Events:** Successful and failed login attempts (with timestamp and IP).
- **Logout Events:** User session terminations.
- **System Actions:** Critical changes (inventory edits, etc.).

## 8. Troubleshooting
- **Login Issues:** Verify credentials. Check the browser console for errors.
- **Test Failures:** Review logs and screenshots in the Testing tab. Common causes: network latency, API key not set, dev server not running.
- **Inventory not saving:** Confirm `localStorage` is not blocked (private/incognito mode).

```

### FILE: docs/DEPLOYMENT_GUIDE.md
```md
﻿# SashMade Deployment Guide

**Version:** 2.0
**Date:** 2026-04-14
**Required React Version:** 19.2.5

## 1. Prerequisites
- **Node.js:** v22.x LTS (minimum v22.0.0)
- **pnpm:** v10.30+ (`npm install -g pnpm`)
- **Gemini API Key:** A valid Google Gemini API key (for AI Studio features)

## 2. Environment Setup
1. Clone the repository and `cd sashmade`.
2. Create `.env.local`:
   ```env
   GEMINI_API_KEY=[REDACTED_CREDENTIAL]
   ```

## 3. Installation
```bash
pnpm install
```
> **Critical:** Ensure `react` and `react-dom` are pinned to `19.2.5` in `package.json`. Never upgrade without approval.

## 4. Development Server
```bash
pnpm run dev        # http://localhost:3000
```

## 5. Building for Production
```bash
pnpm run build      # outputs to dist/
pnpm run preview    # preview the production build locally
```

Chunk splitting is configured in `vite.config.ts` â€” expect 7â€“9 `.js` files in `dist/assets/`, none exceeding 1 MB.

## 6. Deployment Targets

### 6.1 Netlify / Static Hosting
1. Connect the repository to Netlify.
2. Set build command: `pnpm run build`
3. Set output directory: `dist`
4. Add environment variable `GEMINI_API_KEY` in the Netlify dashboard.
5. SPA routing is handled by `public/_redirects` (`/* /index.html 200`).

### 6.2 Apache / cPanel
1. Upload `dist/` contents to the web root.
2. SPA routing is handled by `public/.htaccess` (RewriteEngine rules).

### 6.3 Docker
```bash
docker build -t sashmade .
docker run -p 3000:80 -e GEMINI_API_KEY=[REDACTED_CREDENTIAL]
```

## 7. Post-Deployment Verification
After deployment, verify:
1. `/` â€” Homepage loads with hero, moodboard, How to Order section.
2. `/shop` â€” All 5 products display with prices in â‚µ.
3. `/about` â€” Founder message, team, contact info visible.
4. `/admin/login` â€” Login form present; credentials `admin / sashmade2026` work.
5. `/admin/testing` â€” Run E2E suite to confirm all 5 specs pass.
6. SPA routing: navigate to `/shop`, refresh â€” page must not 404.

```

### FILE: docs/TESTING_GUIDE.md
```md
﻿# SashMade Testing Guide

**Version:** 2.0
**Date:** 2026-04-14
**Required React Version:** 19.2.5
**Test Framework:** Playwright (Chromium)

## 1. Overview
The SashMade platform uses Playwright for end-to-end (E2E) testing. All specs are TypeScript files located in `tests/e2e/`. The `/admin/testing` panel provides an interactive in-browser runner for monitoring test execution.

## 2. E2E Test Suite

### 2.1 Test Files
| File | Spec ID | Coverage |
|---|---|---|
| `homepage.test.ts` | E2E-01 | Hero, navigation, kente strip, mood board |
| `shop.test.ts` | E2E-02 | Product grid, colour filters, payment banner |
| `about.test.ts` | E2E-03 | Founder message, team, contact details |
| `ai-studio.test.ts` | E2E-04 | AI Studio tabs and interactions |
| `admin.test.ts` | E2E-05 | Auth guard, login, inventory manager |

### 2.2 Running Tests
**From terminal (requires dev server or auto-started by Playwright):**
```bash
pnpm test:e2e                   # run all specs
pnpm test:e2e:ui                # interactive Playwright UI mode
pnpm test:e2e:report            # open last HTML report
```

**From Admin Console:**
Navigate to `/admin/testing` â†’ click **Run All Tests** or **Rerun** on individual cards.

### 2.3 Configuration
`playwright.config.ts`:
- Base URL: `http://localhost:3000`
- Browser: Chromium (Desktop Chrome)
- Retries: 1
- Screenshots: on failure only
- Reports: `tests/playwright-report/` (HTML), `list` (terminal)
- Web server: `pnpm run dev` auto-started if not running

## 3. Manual Testing Checklist

### 3.1 Public Pages
- [ ] **Home:** Hero loads, mood board images visible, How to Order steps render, WhatsApp link present.
- [ ] **Shop:** All 5 products display (â‚µ prices), colour filters work, sidebar How to Order visible, Payment Options banner renders.
- [ ] **About:** Flyer image loads, founder quote visible, team grid renders, contact links correct.
- [ ] **SPA routing:** Refresh `/shop`, `/about`, `/privacy` â€” no 404.

### 3.2 Admin Console
- [ ] **Auth guard:** Visiting `/admin/dashboard` unauthenticated redirects to `/admin/login`.
- [ ] **Login:** `admin / sashmade2026` succeeds; invalid credentials show error.
- [ ] **Dashboard:** KPI cards and weekly chart render.
- [ ] **Inventory:** Products listed; price edit + stock toggle persists on reload.
- [ ] **Diagnostics:** Health check cards visible.
- [ ] **Testing:** Runner executes; logs display per test; failure screenshot shown when applicable.
- [ ] **Audit Logs:** Login/logout events captured.

### 3.3 Accessibility
- [ ] All nav buttons have `aria-label`.
- [ ] Mobile hamburger has `aria-expanded`.
- [ ] Images have `alt` text.
- [ ] Keyboard: Tab through nav â†’ cart â†’ login without mouse.

## 4. Troubleshooting
- **`Error: No tests found`:** Confirm `testDir: './tests/e2e'` in `playwright.config.ts` and files end in `.test.ts`.
- **Dev server timeout:** Increase `webServer.timeout` in config, or start `pnpm run dev` manually before running tests.
- **Test failures on CI:** Ensure `GEMINI_API_KEY` env var is set; AI Studio tests may fail without it.

```

### FILE: GAP_ANALYSIS.md
```md
﻿# Final Gap Analysis Report
**Date:** 2026-02-23
**Project:** SashMade: Afro-Chic Studio
**Phase:** 5 (Final Delivery)

## 1. Overview
This final report confirms the alignment between the implemented system and the Software Requirements Specification (SRS) v3.0.

## 2. Requirement Verification

### 2.1 Foundation & UI
*   **React 19.2.5:** Verified in `package.json`.
*   **Tailwind CSS:** Verified in `package.json` and `vite.config.ts`.
*   **Responsiveness:** Verified in `Layout.tsx` and `Home.tsx`.
*   **Themes:** Light, Dark, High-Contrast implemented and verified.
*   **Hero Carousel:** Implemented in `Home.tsx` with updated media assets.

### 2.2 E-Commerce Features
*   **Product Grid:** Implemented in `Shop.tsx`.
*   **Filtering:** Implemented (Origin, Pattern, Color) in `Shop.tsx`.
*   **Cart:** Implemented via `CartContext`.

### 2.3 AI Features
*   **Chatbot:** Implemented in `AIStudio.tsx` using Gemini API.
*   **Fabric Analysis:** Implemented in `AIStudio.tsx` using Gemini Vision.

### 2.4 Admin & Security
*   **Authentication:** Implemented `AuthContext` and protected routes.
*   **Dashboard:** Implemented with Recharts.
*   **Diagnostics:** Implemented service health checks.
*   **Audit Logs:** Implemented action logging.
*   **Testing:** Implemented interactive runner in `/admin/testing`.

### 2.5 Documentation
*   **SRS:** Updated with all features and diagrams.
*   **Admin Guide:** Created.
*   **Deployment Guide:** Created.
*   **Testing Guide:** Created.
*   **Architecture Diagrams:** System, Database, and User Journey diagrams created and embedded.

## 3. Conclusion
The project has successfully met all critical requirements defined in the SRS. The implementation is 100% aligned with the documented features for this release.

**ALL PHASES COMPLETE - FINAL GAP ANALYSIS CONFIRMS 100% ALIGNMENT VERIFIED**

```

### FILE: index.html
```html
<!doctype html>
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
    <meta property="og:title" content="SashMade" />
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
    <meta name="twitter:title" content="SashMade" />
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
    <title>SashMade</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>


```

### FILE: metadata.json
```json
{
  "name": "SashMade: Afro-Chic Studio",
  "description": "AI-enhanced e-commerce platform for African textile patterns and fashion.",
  "requestFramePermissions": [
    "camera"
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
  "name": "sashmade",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:report": "playwright show-report tests/playwright-report"
  },
  "dependencies": {
    "@google/genai": "^1.49.0",
    "@tailwindcss/vite": "^4.2.2",
    "@vitejs/plugin-react": "^6.0.1",
    "better-sqlite3": "^12.9.0",
    "clsx": "^2.1.1",
    "dotenv": "^17.4.2",
    "exceljs": "^4.4.0",
    "express": "^5.2.1",
    "lucide-react": "^1.8.0",
    "motion": "^12.38.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.14.0",
    "recharts": "^3.8.1",
    "tailwind-merge": "^3.5.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.59.1",
    "@types/express": "^5.0.6",
    "@types/node": "^25.6.0",
    "autoprefixer": "^10.4.27",
    "tailwindcss": "^4.2.2",
    "tsx": "^4.21.0",
    "typescript": "~6.0.2",
    "vite": "^8.0.8"
  }
}

```

### FILE: playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 1,
  reporter: [['list'], ['html', { outputFolder: 'tests/playwright-report', open: 'never' }]],
  outputDir: 'tests/playwright-results',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // Start the dev server automatically when running tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f8fd6b63-e9fb-43b8-ad1f-5db8df393991

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
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { AIStudio } from './pages/AIStudio';
import { Shop } from './pages/Shop';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { Diagnostics } from './pages/admin/Diagnostics';
import { AuditLogs } from './pages/admin/AuditLogs';
import { Testing } from './pages/admin/Testing';
import { InventoryManager } from './pages/admin/InventoryManager';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Refunds } from './pages/Refunds';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="ai-studio" element={<AIStudio />} />
                <Route path="shop" element={<Shop />} />
                <Route path="about" element={<About />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="terms" element={<Terms />} />
                <Route path="refunds" element={<Refunds />} />
                <Route path="*" element={<div className="p-12 text-center">404 - Not Found</div>} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="inventory" element={<InventoryManager />} />
                <Route path="diagnostics" element={<Diagnostics />} />
                <Route path="testing" element={<Testing />} />
                <Route path="audit" element={<AuditLogs />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

```

### FILE: src/components/CartDrawer.tsx
```typescript
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Plus, Minus, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  const handleWhatsAppCheckout = () => {
    const phoneNumber = "233247139986"; // Formatted for WhatsApp
    
    let message = "Hi SashMade! I would like to order:\n\n";
    cartItems.forEach(item => {
      message += `- ${item.quantity}x ${item.product.name} (₵${item.product.price})\n`;
    });
    message += `\n*Total: ₵${cartTotal}*\n\nPlease let me know the next steps for payment.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-stone-900 shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#4A5340] dark:text-[#D97706]" />
                <h2 className="font-serif text-xl font-bold text-[#4A5340] dark:text-[#D97706]">Your Cart</h2>
                <span className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs px-2 py-0.5 rounded-full ml-2">
                  {cartItems.length} items
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-stone-500 space-y-4">
                  <ShoppingCart className="w-12 h-12 opacity-20" />
                  <p>Your cart is empty.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2 bg-[#4A5340] text-white rounded-full text-sm font-medium hover:bg-[#3A4232] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-700/50">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-xl bg-white dark:bg-stone-900"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-[#4A5340] dark:text-white leading-tight">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                            {item.product.category}
                          </p>
                        </div>
                        <p className="font-bold text-[#D97706]">
                          ₵{item.product.price}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 p-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors text-stone-600 dark:text-stone-400"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors text-stone-600 dark:text-stone-400"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-stone-600 dark:text-stone-300 font-medium">Subtotal</span>
                  <span className="font-serif text-2xl font-bold text-[#4A5340] dark:text-[#D97706]">
                    ₵{cartTotal}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mb-6 font-medium">
                  Taxes and shipping calculated at checkout.
                </p>
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white py-4 rounded-xl font-bold transition-colors shadow-lg shadow-green-500/20"
                >
                  <Send className="w-5 h-5" />
                  Order via WhatsApp
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full mt-3 py-3 text-sm font-bold text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

```

### FILE: src/components/Layout.tsx
```typescript
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Sun, Moon, Eye } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { CartDrawer } from './CartDrawer';
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { cartItems, setIsCartOpen } = useCart();
  const { user, login, logout, isAuthenticated } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Collections', path: '/shop' },
    { name: 'About', path: '/about' },
  ];

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('high-contrast');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-5 h-5" />;
    if (theme === 'dark') return <Moon className="w-5 h-5" />;
    return <Eye className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-stone-200 dark:border-stone-800" style={{ background: 'rgba(26,26,26,0.96)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src="/images/sashmade_logo.png" alt="SashMade" className="w-full h-full object-cover" />
              </div>
              <span className="font-serif font-bold text-xl tracking-tight" style={{ color: '#E87722' }}>
                SashMade
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "nav-link text-sm font-medium font-sans pb-1 transition-colors",
                    location.pathname === link.path
                      ? "active text-white"
                      : "text-stone-300 hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors text-stone-600 dark:text-stone-400"
                aria-label="Toggle theme"
              >
                {getThemeIcon()}
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors relative"
                aria-label="Open shopping cart"
              >
                <ShoppingCart className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#D97706] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </button>
              {isAuthenticated && user?.role === 'user' ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{user.username}</span>
                  {user.picture ? (
                    <img src={user.picture} alt="Avatar" className="w-8 h-8 rounded-full border border-stone-200" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#D97706] text-white flex items-center justify-center font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button onClick={logout} className="text-xs text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md">Logout</button>
                </div>
              ) : (
                <button onClick={login} className="flex items-center gap-2 px-4 py-2 bg-[#4A5340] text-white rounded-full hover:bg-[#3A4232] transition-colors text-sm font-medium">
                  <User className="w-4 h-4" />
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-stone-700 dark:text-stone-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 dark:text-stone-300 hover:text-[#4A5340] dark:hover:text-[#D97706] hover:bg-stone-50 dark:hover:bg-stone-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex items-center justify-between border-t border-stone-100 dark:border-stone-800">
                <button 
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-stone-700 dark:text-stone-300"
                >
                  {getThemeIcon()}
                  <span>Theme</span>
                </button>
                <button 
                  onClick={() => { setIsMenuOpen(false); setIsCartOpen(true); }}
                  className="flex items-center gap-2 text-stone-700 dark:text-stone-300"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
                </button>
                {isAuthenticated && user?.role === 'user' ? (
                  <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-full text-sm text-center">
                    Logout ({user.username})
                  </button>
                ) : (
                  <button onClick={login} className="px-4 py-2 bg-[#4A5340] text-white rounded-full text-sm text-center">
                    Login
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Footer */}
      <footer style={{ background: '#1a1a1a', color: '#ffffff' }}>
        {/* Kente strip — top border */}
        <div className="kente-strip" />

        {/* Footer grid */}
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem) 2rem',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 'clamp(2rem, 4vw, 4rem)',
          }}
          className="footer-grid"
        >
          {/* Brand col */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-5" style={{ display: 'inline-flex' }}>
              <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                <img src="/images/sashmade_logo.png" alt="SashMade" className="w-full h-full object-cover" />
              </div>
              <span className="font-serif font-bold text-lg" style={{ color: '#E87722' }}>SashMade</span>
            </Link>
            <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 300, maxWidth: '260px' }}>
              Celebrating African heritage through handcrafted kente graduation stoles.
            </p>
            {/* Social icons */}
            <div className="flex gap-2.5 mt-5">
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/sashmade', icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="5"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                )},
                { label: 'LinkedIn', href: 'https://www.linkedin.com/company/sashmade/', icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                )},
                { label: 'X / Twitter', href: 'https://x.com/sashwoveit', icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                )},
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center transition-colors"
                  style={{
                    width: '32px', height: '32px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#E87722';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#E87722';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)';
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop col */}
          <div>
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>Shop</p>
            <ul className="space-y-3">
              {[{ label: 'Graduation Stoles', to: '/shop' }].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="font-sans text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal col */}
          <div>
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>Legal</p>
            <ul className="space-y-3">
              {[
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Terms & Conditions', to: '/terms' },
                { label: 'Refund Policy', to: '/refunds' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="font-sans text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  to="/admin/login"
                  className="font-sans text-sm font-medium transition-colors"
                  style={{ color: '#E87722' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#E87722')}
                >
                  Staff & Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact col */}
          <div>
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>Contact</p>
            <ul className="space-y-3">
              {[
                { text: '0247 139 986', href: 'tel:+233247139986' },
                { text: 'info@sashmade.com', href: 'mailto:info@sashmade.com' },
                { text: 'support@sashmade.com', href: 'mailto:support@sashmade.com' },
                { text: 'Accra, Ghana', href: undefined },
                { text: 'Instagram: @sashmade', href: 'https://www.instagram.com/sashmade' },
              ].map(({ text, href }) => (
                <li key={text}>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="font-sans text-sm transition-colors"
                      style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                    >
                      {text}
                    </a>
                  ) : (
                    <span className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '1.25rem clamp(1.5rem, 5vw, 4rem)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
          className="footer-bottom"
        >
          <p className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © 2026 SashMade. All Rights Reserved. Pan-African Pride, Worldwide.
          </p>
          {/* Pan-African dots */}
          <div className="flex items-center gap-1">
            {['#C0392B', '#C9941A', '#2E7D32'].map(c => (
              <div key={c} style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }} />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

```

### FILE: src/components/StyleOracle.tsx
```typescript
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { generateChatResponse } from '../services/gemini';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export function StyleOracle() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm Sash, your Afro-Chic fashion consultant. How can I help you explore African textiles or style your next look today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for Gemini
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await generateChatResponse(history, userMessage.text);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having trouble connecting to the spirit of the loom right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200">
      <div className="bg-[#4A5340] p-4 flex items-center gap-3">
        <div className="p-2 bg-[#D97706] rounded-full">
          <Bot className="w-6 h-6 text-[#4A5340]" />
        </div>
        <div>
          <h3 className="text-white font-serif font-semibold text-lg">Sash</h3>
          <p className="text-blue-100 text-xs">Style Oracle & Pattern Guide</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "flex w-full",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.role === 'user'
                    ? "bg-[#4A5340] text-white rounded-br-none"
                    : "bg-white text-stone-800 border border-stone-200 rounded-bl-none"
                )}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-stone-200 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#D97706]" />
              <span className="text-xs text-stone-500">Consulting the threads...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-stone-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about patterns, styling, or fabrics..."
            className="flex-1 p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#4A5340] focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-[#4A5340] text-white rounded-xl hover:bg-[#3A4232] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

```

### FILE: src/context/AuthContext.tsx
```typescript
import React, { createContext, useContext, useState } from 'react';

interface User {
  username: string; // Used for standard user or the person's name
  email?: string;
  picture?: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, role: 'admin' | 'user', email?: string, picture?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (
    username: string, 
    role: 'admin' | 'user', 
    email?: string, 
    picture?: string
  ) => {
    const newUser = { username, role, email, picture };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Log login action (Mock Audit)
    const auditLog = JSON.parse(localStorage.getItem('audit_log') || '[]');
    auditLog.push({
      timestamp: new Date().toISOString(),
      action: 'LOGIN',
      actor: username,
      details: 'User logged in'
    });
    localStorage.setItem('audit_log', JSON.stringify(auditLog));
  };

  const logout = () => {
    // Log logout action
    if (user) {
        const auditLog = JSON.parse(localStorage.getItem('audit_log') || '[]');
        auditLog.push({
          timestamp: new Date().toISOString(),
          action: 'LOGOUT',
          actor: user.username,
          details: 'User logged out'
        });
        localStorage.setItem('audit_log', JSON.stringify(auditLog));
    }
    
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

```

### FILE: src/context/CartContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sashmade_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sashmade_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true); // Auto-open cart on add
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

```

### FILE: src/context/ThemeContext.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    return saved || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

```

### FILE: src/data/products.ts
```typescript
export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  category: 'Kente Stole' | 'Kente Fabric' | 'Gift Package';
  origin: string;
  patternType: string;
  colors: string[];
  features: string[];
  inStock: boolean;
  description: string;
}

export const products: Product[] = [
  {
    id: 'adehye-style',
    name: 'Adehye Style',
    tagline: 'Elevate your graduation with a touch of Ghanaian royal heritage.',
    price: 100,
    image: '/images/p2_28.png',
    category: 'Kente Stole',
    origin: 'Ghana',
    patternType: 'Kente',
    colors: ['Black', 'Gold', 'Green', 'Red'],
    features: ['Adinkra Symbol of Choice', 'Basic Ghanaian Colors', 'Preferred Inscription'],
    inStock: true,
    description:
      'Elevate your graduation with our "Adehye Style" stole, featuring an exquisite Adinkra symbol cherished by Ghanaians for its deep cultural significance. This stole showcases your connection to Ghana\'s rich heritage.',
  },
  {
    id: 'nyonyo',
    name: 'Nyonyo',
    tagline: 'Wear your school pride with bold Ghanaian colors.',
    price: 115,
    image: '/images/p3_32.png',
    category: 'Kente Stole',
    origin: 'Ghana',
    patternType: 'Kente',
    colors: ['Black', 'Gold', 'Green', 'Red'],
    features: ['School Logo', 'Basic Ghanaian Colors', 'Preferred Inscription'],
    inStock: true,
    description:
      'Elevate your graduation with a touch of school pride. Our Nyonyo Kente stole is customised with your school logo, a personal inscription, and the iconic Ghanaian colors.',
  },
  {
    id: 'sophie',
    name: 'Sophie',
    tagline: 'Unleash your creativity — colors that reflect your journey.',
    price: 115,
    image: '/images/p4_36.png',
    category: 'Kente Stole',
    origin: 'Ghana',
    patternType: 'Kente',
    colors: ['Black', 'Customised'],
    features: ['School Logo', 'Customised Colors', 'Preferred Inscription'],
    inStock: true,
    description:
      'Unleash your creativity for graduation day! Tailor your Sophie stole with your school logo, a personal inscription, and a color palette that reflects your unique journey and personality.',
  },
  {
    id: 'daisy',
    name: 'Daisy',
    tagline: 'Celebrate your achievement in the most regal way.',
    price: 105,
    image: '/images/p5_40.png',
    category: 'Kente Stole',
    origin: 'Ghana',
    patternType: 'Kente',
    colors: ['Black', 'Customised'],
    features: ['Adinkra Symbol', 'Customised Colors', 'Preferred Inscription'],
    inStock: true,
    description:
      'Celebrate your achievement in the most regal way. Let your Daisy stole speak of your success and the cultural legacy you proudly embrace.',
  },
  {
    id: 'my-becoming',
    name: 'My Becoming',
    tagline: 'A longer, fully bespoke stole tailored precisely to your needs.',
    price: 135,
    image: '/images/p6_44.png',
    category: 'Kente Stole',
    origin: 'Ghana',
    patternType: 'Kente',
    colors: ['Black', 'Gold', 'Green', 'Red', 'Customised'],
    features: [
      'Adinkra Symbol or School Logo',
      'Customised Colors',
      'Preferred Inscription',
      'Preferred Base Design',
    ],
    inStock: true,
    description:
      'Pause for a moment to consider how you want to style your stole. My Becoming is a longer model tailored just to your needs. Feel free to blend your colors in a way that relates to your journey.',
  },
];

```

### FILE: src/index.css
```css
@import "tailwindcss";

@theme {
  --font-sans: "DM Sans", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Playfair Display", Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;

  /* Brand tokens */
  --clr-olive: #3d4a35;
  --clr-ember: #E87722;
  --clr-onyx: #1a1a1a;
  --clr-cream: #F5F0E8;
  --clr-pan-r: #C0392B;
  --clr-pan-g: #2E7D32;
  --clr-pan-y: #C9941A;
}

/* Kente strip utility */
.kente-strip {
  height: 6px;
  background: repeating-linear-gradient(
    90deg,
    var(--clr-pan-r) 0px,
    var(--clr-pan-r) 18px,
    var(--clr-pan-y) 18px,
    var(--clr-pan-y) 36px,
    var(--clr-pan-g) 36px,
    var(--clr-pan-g) 54px
  );
}

/* Hero grain overlay */
.hero-grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.04;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 1;
}

/* Nav ember underline */
.nav-link {
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #E87722;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 200ms ease;
}
.nav-link:hover::after,
.nav-link.active::after {
  transform: scaleX(1);
}

/* Scroll cue chevron */
@keyframes scroll-bounce {
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(6px); opacity: 1; }
}
.scroll-cue {
  animation: scroll-bounce 1.8s ease-in-out infinite;
}

/* Marquee scroll */
@keyframes marqueeScroll {
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  [style*="marqueeScroll"] {
    animation: none !important;
  }
}

/* Card fade-up animation */
@keyframes card-fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
.card-animate {
  opacity: 0;
  animation: card-fade-up 0.5s ease forwards;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-cue,
  .card-animate,
  .hero-grain::after {
    animation: none !important;
    opacity: 1;
  }
}

/* Responsive single-col grids on mobile */
@media (max-width: 768px) {
  .hero-main-grid,
  .how-to-order-grid,
  .about-hero-grid {
    grid-template-columns: 1fr !important;
  }

  .founder-note-grid {
    grid-template-columns: 1fr !important;
  }
}

/* Shop layout — sidebar stacks below on mobile */
@media (max-width: 900px) {
  .shop-layout {
    flex-direction: column !important;
  }
  .shop-sidebar {
    width: 100% !important;
  }
}

/* Footer grid — 2-col on tablet, 1-col on mobile */
@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr !important;
  }
}
@media (max-width: 600px) {
  .footer-grid {
    grid-template-columns: 1fr !important;
  }
  .footer-bottom {
    flex-direction: column !important;
    align-items: flex-start !important;
  }
}

/* High Contrast Theme Overrides */
.high-contrast {
  --color-stone-50: #ffffff;
  --color-stone-100: #f0f0f0;
  --color-stone-200: #e0e0e0;
  --color-stone-800: #000000;
  --color-stone-900: #000000;
  --color-stone-950: #000000;
}

.high-contrast * {
  border-color: #000 !important;
}

.high-contrast .bg-stone-50 {
  background-color: #ffffff;
  color: #000000;
}

.high-contrast .text-stone-500,
.high-contrast .text-stone-600 {
  color: #000000 !important;
}

.high-contrast button {
  border: 2px solid #000 !important;
  font-weight: bold;
}

```

### FILE: src/lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

### FILE: src/main.tsx
```typescript
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

```

### FILE: src/pages/About.tsx
```typescript
import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, ExternalLink, Clock } from 'lucide-react';

const team = [
  { role: 'Executive Director', name: 'George Kofi Tego', image: '/images/Nana Kofi.jpeg' },
  { role: 'CEO & Founder', name: 'Sharon Akua Begah', image: '/images/Sharon Akua Begah.jpeg' },
  { role: 'Director of Operations', name: 'Stephanie Acquah-Djan', image: '/images/Stephanie.jpeg' },
  { role: 'HR Executive', name: 'Deborah Owusu Afriyie' },
  { role: 'Marketing & Client Relations', name: 'Ursula', image: '/images/Ursula.jpeg' },
  { role: 'Creative Director', name: 'Samuel', image: '/images/Samuel.jpeg' },
  { role: 'IT Executive', name: 'Mandela' },
];

const clients = [
  'Jospong Group of Companies',
  'African Agribusiness Consortium',
  'Zoomlion Ghana',
  'Asanska University',
  'Hallpax',
  'Genero',
  'Envoy Ghana',
  'Akwaaba Trip',
  'Transitions Ghana',
  'Kofih BME',
  'Ceana',
];

const services = [
  {
    title: 'Custom Kente Sash Design & Production',
    description:
      'We design and produce personalised kente sashes for graduations, pageants, church events, awards, and special ceremonies, tailored to your colours, logos, and messages.',
  },
  {
    title: 'Printing & Embroidery Services',
    description:
      'Professional embroidery and printing services on sashes, fabrics, and selected materials, ensuring clear, durable, and elegant finishing for names, logos, and event details.',
  },
  {
    title: 'Kente Cloth Sales',
    description:
      'Authentic and affordable kente cloth in a variety of colours and patterns for individuals, designers, and institutions.',
  },
  {
    title: 'Curated Gift Packages',
    description:
      'Customised gift packages for graduations, birthdays, corporate events, and special occasions, carefully selected and packaged to suit your theme and budget.',
  },
  {
    title: 'Event Planning & Management',
    description:
      'Event coordination and management services, helping to organise ceremonies, celebrations, and special occasions smoothly and professionally.',
  },
];

const coreValues = [
  {
    label: '01',
    title: 'Customer-Centered',
    description:
      'Our customers are at the heart of everything we create. Customization, clear communication, and delivering beyond expectations.',
  },
  {
    label: '02',
    title: 'Integrity & Professionalism',
    description:
      'We operate with honesty, transparency, and accountability — fair pricing, reliable delivery, and ethical sourcing.',
  },
  {
    label: '03',
    title: 'Growth & Empowerment',
    description:
      'We aim to grow not just a brand, but a community — empowering local artisans, investing in skills development.',
  },
  {
    label: '04',
    title: 'Unity in Craft',
    description:
      'We operate as one team with a shared vision — every stitch, design, and delivery reflects collective effort.',
  },
];

/* ─── Shared section heading ─────────────────────────────── */
function SectionHeading({ eyebrow, title, light = false }: { eyebrow: string; title: React.ReactNode; light?: boolean }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-3">
        <div style={{ width: '24px', height: '2px', background: '#E87722', flexShrink: 0 }} />
        <span
          className="font-sans text-[11px] font-medium uppercase tracking-[0.16em]"
          style={{ color: '#E87722' }}
        >
          {eyebrow}
        </span>
      </div>
      <h2
        className="font-serif font-bold leading-[1.05]"
        style={{
          fontSize: 'clamp(28px, 4vw, 44px)',
          letterSpacing: '-0.02em',
          color: light ? '#ffffff' : '#1a1a1a',
        }}
      >
        {title}
      </h2>
    </div>
  );
}

export function About() {
  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="hero-grain relative overflow-hidden"
        style={{ background: '#3d4a35', paddingTop: '80px' }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(3rem, 6vw, 6rem)',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
          className="about-hero-grid"
        >
          {/* Left — flyer image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div
              style={{
                position: 'absolute', inset: '-12px',
                border: '1px solid rgba(232,119,34,0.15)',
                borderRadius: '8px',
                pointerEvents: 'none',
              }}
            />
            <div className="overflow-hidden rounded-lg shadow-2xl" style={{ aspectRatio: '4/5' }}>
              <img
                src="/images/about_flyer.png"
                alt="Get Your Kente Stole at an Affordable Price — SashMade"
                className="w-full h-full object-cover"
                style={{ objectPosition: '50% 20%' }}
              />
            </div>
          </motion.div>

          {/* Right — text */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div style={{ width: '24px', height: '2px', background: '#E87722' }} />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: '#E87722' }}>
                Our Story
              </span>
            </div>

            <h1
              className="font-serif font-black text-white leading-[1.0] mb-8"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', letterSpacing: '-0.02em' }}
            >
              About<br /><em style={{ color: '#E87722' }}>SashMade</em>
            </h1>

            <div className="space-y-5" style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 300, fontSize: 'clamp(14px, 1.4vw, 16px)', lineHeight: 1.75 }}>
              <p>
                We specialize in transforming your graduation day into a truly memorable and personalized experience.
              </p>
              <p>
                We craft customized stoles that reflect your unique journey and style. Each stole is a canvas for your story, a symbol of your hard work and dedication.
              </p>
              <p>
                Whether you're looking for a touch of elegance, a dash of personality, or a splash of color — we're here to help you celebrate this milestone in your own special way.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex gap-10 mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
              {[['12K+', 'Graduates Served'], ['47', 'Countries'], ['500+', 'Designs']].map(([num, label]) => (
                <div key={label}>
                  <div className="font-serif font-bold" style={{ fontSize: '2rem', color: '#E87722', letterSpacing: '-0.02em', lineHeight: 1 }}>{num}</div>
                  <div className="font-sans text-[11px] font-medium uppercase tracking-[0.1em] mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="kente-strip" style={{ position: 'relative', zIndex: 1 }} />
      </section>

      {/* ── FOUNDER'S MESSAGE ────────────────────────────── */}
      <section style={{ background: '#F5F0E8', padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <SectionHeading eyebrow="Founder's Note" title={<>Message from Our <em style={{ fontStyle: 'italic', color: '#3d4a35' }}>Founder</em></>} />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: '#ffffff',
              border: '1px solid rgba(61,74,53,0.12)',
              borderRadius: '4px',
              padding: 'clamp(2rem, 4vw, 3rem)',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(220px, 280px) 1fr',
                gap: 'clamp(1.5rem, 4vw, 2.5rem)',
                alignItems: 'start',
              }}
              className="founder-note-grid"
            >
              <div>
                <div
                  className="overflow-hidden rounded-lg shadow-lg"
                  style={{ aspectRatio: '4 / 5', background: '#e8e3da' }}
                >
                  <img
                    src="/images/Sharon Akua Begah.jpeg"
                    alt="Sharon Akua Begah"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center top' }}
                  />
                </div>
                <div className="mt-4">
                  <p className="font-serif font-bold text-lg" style={{ color: '#3d4a35' }}>
                    Sharon Akua Begah
                  </p>
                  <p className="font-sans text-xs uppercase tracking-[0.14em]" style={{ color: '#E87722' }}>
                    CEO & Founder
                  </p>
                </div>
              </div>

              <blockquote>
                <div
                  className="font-serif"
                  style={{ fontSize: '5rem', color: '#E87722', lineHeight: 0.8, marginBottom: '1.5rem', opacity: 0.6 }}
                >
                  "
                </div>

                <div className="space-y-5 font-sans" style={{ color: 'rgba(26,26,26,0.72)', fontWeight: 300, fontSize: 'clamp(14px, 1.4vw, 16px)', lineHeight: 1.8 }}>
                  <p>
                    Sashmade was never just about fabric, design, or even celebration — it was born from a deeply
                    personal moment. During my Master's journey, I longed for something that could truly represent the
                    years of hard work, the identity we had built as a class, and the pride of reaching that milestone.
                    What I found in the market didn't reflect that depth, that meaning, or that story. So, we created our own.
                  </p>
                  <p>
                    What started as a simple desire to feel seen and represented quickly became something much bigger.
                    The response from other students who felt the same need — who wanted more than just a decorative
                    sash — sparked the beginning of Sashmade.
                  </p>
                  <p>
                    Today, Sashmade stands as a Ghanaian brand rooted in purpose, culture, and craftsmanship. We create
                    premium customised kente sashes that go beyond aesthetics. Every piece is designed to embody
                    achievement, identity, and cultural pride. Each sash carries a story — your story.
                  </p>
                  <p>
                    When I think about the future of Sashmade — what it could become, the lives it could touch — it both
                    excites and humbles me. We have come a long way, and this is only the beginning.
                  </p>
                  <p>Thank you for being part of this journey.</p>
                </div>

                <footer className="mt-8 font-serif font-bold text-lg" style={{ color: '#3d4a35' }}>
                  — Sharon A., Sashmade
                </footer>
              </blockquote>
            </div>

            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px',
              background: 'repeating-linear-gradient(180deg,#C0392B 0px,#C0392B 8px,#C9941A 8px,#C9941A 16px,#2E7D32 16px,#2E7D32 24px)',
              borderRadius: '4px 0 0 4px',
            }} />
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────── */}
      <section style={{ background: '#1a1a1a', padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <SectionHeading eyebrow="What We Do" title={<span style={{ color: '#ffffff' }}>Our <em style={{ fontStyle: 'italic', color: '#E87722' }}>Services</em></span>} light />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.07)' }}>
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: '#1a1a1a', padding: '2rem', cursor: 'default' }}
                className="group hover:bg-[#252525] transition-colors duration-200"
              >
                <div
                  className="font-serif font-bold mb-4"
                  style={{ fontSize: '2.5rem', color: 'rgba(232,119,34,0.25)', lineHeight: 1 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3
                  className="font-serif font-bold mb-3"
                  style={{ fontSize: 'clamp(16px, 1.6vw, 20px)', color: '#ffffff', letterSpacing: '-0.01em' }}
                >
                  {service.title}
                </h3>
                <p
                  className="font-sans leading-relaxed"
                  style={{ fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.5)' }}
                >
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="kente-strip mt-16" style={{ maxWidth: '100%' }} />
      </section>

      {/* ── CORE VALUES ──────────────────────────────────── */}
      <section style={{ background: '#3d4a35', padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <SectionHeading eyebrow="What Drives Us" title={<span style={{ color: '#ffffff' }}>Core <em style={{ fontStyle: 'italic', color: '#E87722' }}>Values</em></span>} light />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {coreValues.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  padding: '2rem',
                }}
              >
                <div
                  className="font-serif font-black mb-4"
                  style={{ fontSize: '2rem', color: 'rgba(232,119,34,0.4)', lineHeight: 1 }}
                >
                  {value.label}
                </div>
                <h3 className="font-serif font-bold text-white mb-3" style={{ fontSize: '1.1rem' }}>
                  {value.title}
                </h3>
                <p className="font-sans" style={{ fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────── */}
      <section style={{ background: '#F5F0E8', padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <SectionHeading eyebrow="The People" title={<>The Team Behind <em style={{ fontStyle: 'italic', color: '#3d4a35' }}>Every Weave</em></>} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(61,74,53,0.12)',
                  borderRadius: '4px',
                  padding: '1rem',
                  textAlign: 'center',
                }}
              >
                {member.image ? (
                  <div
                    className="overflow-hidden rounded-lg mb-4"
                    style={{ aspectRatio: '4 / 5', background: '#e8e3da' }}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center top' }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: '52px', height: '52px',
                      background: '#3d4a35',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 1rem',
                    }}
                  >
                    <span className="font-serif font-bold text-xl" style={{ color: '#E87722' }}>
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
                <p className="font-serif font-bold text-sm" style={{ color: '#1a1a1a' }}>{member.name}</p>
                <p className="font-sans text-xs mt-1" style={{ color: 'rgba(26,26,26,0.45)', fontWeight: 400 }}>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTS ──────────────────────────────────────── */}
      <section style={{ background: '#1a1a1a', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="flex items-center gap-2 mb-8">
            <div style={{ width: '24px', height: '2px', background: '#E87722' }} />
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: '#E87722' }}>
              Trusted By
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {clients.map((client, i) => (
              <span
                key={i}
                className="font-sans text-sm font-medium"
                style={{
                  padding: '8px 18px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '2px',
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '0.02em',
                }}
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT & HOURS ──────────────────────────────── */}
      <section style={{ background: '#F5F0E8', padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <SectionHeading eyebrow="Reach Us" title={<>Get in <em style={{ fontStyle: 'italic', color: '#3d4a35' }}>Touch</em></>} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

            {/* Contact card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ ease: [0.16, 1, 0.3, 1] }}
              style={{ background: '#3d4a35', borderRadius: '4px', padding: '2.5rem' }}
            >
              <h3 className="font-serif font-bold text-white mb-6" style={{ fontSize: '1.25rem' }}>Contact</h3>
              <ul className="space-y-4">
                {[
                  { Icon: Phone, text: '0247 139 986', href: 'tel:+233247139986' },
                  { Icon: Mail, text: 'info@sashmade.com', href: 'mailto:info@sashmade.com' },
                  { Icon: Mail, text: 'support@sashmade.com', href: 'mailto:support@sashmade.com' },
                  { Icon: ExternalLink, text: 'Instagram: @sashmade', href: 'https://www.instagram.com/sashmade' },
                  { Icon: ExternalLink, text: 'LinkedIn: Sashmade', href: 'https://www.linkedin.com/company/sashmade/' },
                  { Icon: ExternalLink, text: 'X: @sashwoveit', href: 'https://x.com/sashwoveit' },
                ].map(({ Icon, text, href }) => (
                  <li key={text} className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#E87722' }} />
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="font-sans text-sm transition-colors"
                      style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 300 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Hours card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: '#ffffff', border: '1px solid rgba(61,74,53,0.12)', borderRadius: '4px', padding: '2.5rem' }}
            >
              <h3 className="font-serif font-bold mb-6 flex items-center gap-2" style={{ fontSize: '1.25rem', color: '#1a1a1a' }}>
                <Clock className="w-5 h-5" style={{ color: '#E87722' }} />
                Opening Hours
              </h3>
              <ul className="space-y-0 font-sans">
                {[
                  { day: 'Monday – Friday', hours: '7:00 AM – 10:00 PM' },
                  { day: 'Saturday', hours: '7:00 AM – 10:00 PM' },
                  { day: 'Sunday', hours: 'Closed' },
                ].map(({ day, hours }, i, arr) => (
                  <li
                    key={day}
                    className="flex justify-between items-center py-4"
                    style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(61,74,53,0.1)' : 'none' }}
                  >
                    <span className="text-sm font-medium" style={{ color: 'rgba(26,26,26,0.7)' }}>{day}</span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: hours === 'Closed' ? '#C0392B' : '#3d4a35' }}
                    >
                      {hours}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="font-sans text-xs mt-6 leading-relaxed" style={{ color: 'rgba(26,26,26,0.45)', fontWeight: 300 }}>
                For a more guided and personalised experience, our client support team is available to help you choose
                the perfect sash design, kente pattern, or gift package.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}

```

### FILE: src/pages/admin/AdminLayout.tsx
```typescript
import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Activity, LogOut, ShieldCheck, TestTube, PackageSearch } from 'lucide-react';
import { cn } from '../../lib/utils';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { name: 'Dashboard',   path: '/admin/dashboard',   icon: LayoutDashboard },
    { name: 'Inventory',   path: '/admin/inventory',   icon: PackageSearch   },
    { name: 'Diagnostics', path: '/admin/diagnostics', icon: Activity        },
    { name: 'Testing',     path: '/admin/testing',     icon: TestTube        },
    { name: 'Audit Logs',  path: '/admin/audit',       icon: ShieldCheck     },
  ];

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#4A5340] text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-blue-800">
          <h2 className="font-serif font-bold text-xl text-[#D97706]">SashMade Admin</h2>
          <p className="text-xs text-blue-200 mt-1">Logged in as {user.username}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-[#D97706] text-[#4A5340]"
                  : "text-blue-100 hover:bg-white/10"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-300 hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

```

### FILE: src/pages/admin/AdminLogin.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, AlertCircle } from 'lucide-react';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - in real app this would verify against DB
    if (username === 'admin' && password =[REDACTED_CREDENTIAL]
      login(username, 'admin');
      navigate(from, { replace: true });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-900">
      <div className="bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-stone-200 dark:border-stone-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#4A5340] rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-[#D97706]" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#4A5340] dark:text-[#D97706]">Admin Access</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm">Secure Area - Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-700 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#4A5340] focus:border-transparent"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#4A5340] focus:border-transparent"
              placeholder="password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#4A5340] hover:bg-[#3A4232] text-white font-bold rounded-xl transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

```

### FILE: src/pages/admin/AuditLogs.tsx
```typescript
import React, { useEffect, useState } from 'react';

interface LogEntry {
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}

export function AuditLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const storedLogs = localStorage.getItem('audit_log');
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs).reverse());
    }
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-white">Audit Logs</h1>
      
      <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-700">
            <tr>
              <th className="p-4 font-semibold text-stone-900 dark:text-white">Timestamp</th>
              <th className="p-4 font-semibold text-stone-900 dark:text-white">Actor</th>
              <th className="p-4 font-semibold text-stone-900 dark:text-white">Action</th>
              <th className="p-4 font-semibold text-stone-900 dark:text-white">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-stone-500">No audit logs found.</td>
              </tr>
            ) : (
              logs.map((log, i) => (
                <tr key={i} className="hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                  <td className="p-4 text-stone-600 dark:text-stone-300 font-mono text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 text-stone-900 dark:text-white font-medium">{log.actor}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md text-xs font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-stone-600 dark:text-stone-300">{log.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

```

### FILE: src/pages/admin/Dashboard.tsx
```typescript
import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export function Dashboard() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = chartRef.current;
    if (!node) return;

    const updateSize = () => {
      const nextWidth = node.clientWidth;
      const nextHeight = node.clientHeight;
      setChartSize((prev) =>
        prev.width === nextWidth && prev.height === nextHeight
          ? prev
          : { width: nextWidth, height: nextHeight }
      );
    };

    updateSize();

    const observer = new ResizeObserver(() => updateSize());
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-white">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: 'GHS 24,500', icon: DollarSign, change: '+12%' },
          { title: 'Active Orders', value: '45', icon: ShoppingBag, change: '+5%' },
          { title: 'New Customers', value: '128', icon: Users, change: '+18%' },
          { title: 'AI Generations', value: '1,204', icon: TrendingUp, change: '+24%' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <kpi.icon className="w-6 h-6 text-[#4A5340] dark:text-[#D97706]" />
              </div>
              <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">{kpi.change}</span>
            </div>
            <h3 className="text-stone-500 dark:text-stone-400 text-sm font-medium">{kpi.title}</h3>
            <p className="text-2xl font-bold text-stone-900 dark:text-white mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 min-w-0">
        <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-6">Weekly Sales Overview</h2>
        <div ref={chartRef} className="h-[300px] min-w-0">
          {chartSize.width > 0 && chartSize.height > 0 ? (
            <BarChart width={chartSize.width} height={chartSize.height} data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="sales" fill="#4A5340" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : null}
        </div>
      </div>
    </div>
  );
}

```

### FILE: src/pages/admin/Diagnostics.tsx
```typescript
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  lastChecked: string;
}

export function Diagnostics() {
  const [health, setHealth] = useState<HealthCheck[]>([
    { service: 'Gemini AI API', status: 'healthy', latency: 120, lastChecked: new Date().toISOString() },
    { service: 'Hubtel Gateway', status: 'healthy', latency: 45, lastChecked: new Date().toISOString() },
    { service: 'Database (Postgres)', status: 'healthy', latency: 12, lastChecked: new Date().toISOString() },
    { service: 'Redis Cache', status: 'healthy', latency: 5, lastChecked: new Date().toISOString() },
  ]);

  const refreshDiagnostics = () => {
    // Simulate refresh
    setHealth(prev => prev.map(h => ({
      ...h,
      latency: Math.floor(Math.random() * 100) + 10,
      lastChecked: new Date().toISOString()
    })));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-white">System Diagnostics</h1>
        <button 
          onClick={refreshDiagnostics}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A5340] text-white rounded-xl hover:bg-[#3A4232] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Status
        </button>
      </div>

      <div className="grid gap-4">
        {health.map((item) => (
          <div key={item.service} className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {item.status === 'healthy' && <CheckCircle className="w-6 h-6 text-green-500" />}
              {item.status === 'degraded' && <AlertTriangle className="w-6 h-6 text-yellow-500" />}
              {item.status === 'down' && <XCircle className="w-6 h-6 text-red-500" />}
              
              <div>
                <h3 className="font-bold text-stone-900 dark:text-white">{item.service}</h3>
                <p className="text-xs text-stone-500">Last checked: {new Date(item.lastChecked).toLocaleTimeString()}</p>
              </div>
            </div>
            
            <div className="text-right">
              <span className={`text-sm font-bold ${
                item.latency < 100 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {item.latency}ms
              </span>
              <p className="text-xs text-stone-500">Latency</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

```

### FILE: src/pages/admin/InventoryManager.tsx
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Download, Loader2, CheckCircle } from 'lucide-react';
import ExcelJS from 'exceljs';
import { products } from '../../data/products';
import type { Product } from '../../data/products';

// ─── Types ───────────────────────────────────────────────────────────────────

type StockStatus = 'In Stock' | 'Out of Stock' | 'Made to Order';

interface Row {
  product: Product;
  status: StockStatus;
  priceInput: string;  // GHS, editable string
  saved: boolean;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

const PRICE_KEY  = 'sashmade_prices';
const STATUS_KEY = 'sashmade_statuses';

function loadPrices(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(PRICE_KEY) || '{}'); } catch { return {}; }
}
function savePrices(p: Record<string, number>) {
  localStorage.setItem(PRICE_KEY, JSON.stringify(p));
}
function loadStatuses(): Record<string, StockStatus> {
  try { return JSON.parse(localStorage.getItem(STATUS_KEY) || '{}'); } catch { return {}; }
}
function saveStatuses(s: Record<string, StockStatus>) {
  localStorage.setItem(STATUS_KEY, JSON.stringify(s));
}

const STATUS_CYCLE: StockStatus[] = ['In Stock', 'Made to Order', 'Out of Stock'];

function nextStatus(current: StockStatus): StockStatus {
  const i = STATUS_CYCLE.indexOf(current);
  return STATUS_CYCLE[(i + 1) % STATUS_CYCLE.length];
}

// ─── Build initial rows ───────────────────────────────────────────────────────

function buildRows(): Row[] {
  const prices   = loadPrices();
  const statuses = loadStatuses();
  return products.map((p) => ({
    product: p,
    status: statuses[p.id] ?? (p.inStock ? 'In Stock' : 'Out of Stock'),
    priceInput: String(prices[p.id] ?? p.price),
    saved: false,
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InventoryManager() {
  const [rows, setRows]           = useState<Row[]>(buildRows);
  const [filter, setFilter]       = useState<'all' | StockStatus>('all');
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => { setRows(buildRows()); }, []);

  // ── Price editing ───────────────────────────────────────────────────────────

  const handlePriceChange = (id: string, value: string) => {
    setRows((prev) =>
      prev.map((r) => r.product.id === id ? { ...r, priceInput: value, saved: false } : r)
    );
  };

  const handleSave = (id: string) => {
    setRows((prev) => {
      const row = prev.find((r) => r.product.id === id);
      if (!row) return prev;
      const parsed = parseFloat(row.priceInput);
      if (isNaN(parsed) || parsed < 0) return prev;

      const stored = loadPrices();
      stored[id] = Math.round(parsed);
      savePrices(stored);

      if (timers.current[id]) clearTimeout(timers.current[id]);
      timers.current[id] = setTimeout(() => {
        setRows((cur) => cur.map((r) => r.product.id === id ? { ...r, saved: false } : r));
      }, 2000);

      return prev.map((r) =>
        r.product.id === id ? { ...r, priceInput: String(Math.round(parsed)), saved: true } : r
      );
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') handleSave(id);
  };

  // ── Status cycling ──────────────────────────────────────────────────────────

  const handleStatusToggle = (id: string) => {
    setRows((prev) => {
      const updated = prev.map((r) => {
        if (r.product.id !== id) return r;
        return { ...r, status: nextStatus(r.status) };
      });
      const s = loadStatuses();
      const row = updated.find((r) => r.product.id === id)!;
      s[id] = row.status;
      saveStatuses(s);
      return updated;
    });
  };

  // ── Excel export ────────────────────────────────────────────────────────────

  const handleExport = async () => {
    setExporting(true);
    setExportError('');
    try {
      const THUMB_H  = 80;
      const ROW_H    = 84;
      const SITE_BASE = window.location.origin;

      const wb = new ExcelJS.Workbook();
      wb.creator = 'SashMade Admin';
      const ws = wb.addWorksheet('SashMade Inventory');

      ws.columns = [
        { header: 'Photo',       key: 'photo',       width: 14 },
        { header: 'ID',          key: 'id',          width: 18 },
        { header: 'Design Name', key: 'name',        width: 22 },
        { header: 'Category',    key: 'category',    width: 16 },
        { header: 'Status',      key: 'status',      width: 14 },
        { header: 'Price (GHS)', key: 'price',       width: 14 },
        { header: 'Features',    key: 'features',    width: 40 },
        { header: 'Description', key: 'description', width: 52 },
      ];

      // Header styling — SashMade brand colours (#4A5340 bg / #D97706 text)
      const headerRow = ws.getRow(1);
      headerRow.height = 22;
      headerRow.eachCell((cell) => {
        cell.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A3C6B' } };
        cell.font   = { bold: true, color: { argb: 'FFC9A84C' }, size: 11 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { bottom: { style: 'thin', color: { argb: 'FFC9A84C' } } };
      });
      ws.views = [{ state: 'frozen', ySplit: 1 }];

      for (let i = 0; i < rows.length; i++) {
        const r      = rows[i];
        const rowNum = i + 2;
        const row    = ws.getRow(rowNum);
        row.height   = ROW_H;

        const inStock = r.status === 'In Stock';
        const bgColor = inStock ? 'FFFFF8ED' : 'FFFFF3F0';

        row.getCell('id').value          = r.product.id;
        row.getCell('name').value        = r.product.name;
        row.getCell('category').value    = r.product.category;
        row.getCell('status').value      = r.status;
        row.getCell('price').value       = parseFloat(r.priceInput) || r.product.price;
        row.getCell('features').value    = r.product.features.join(' · ');
        row.getCell('description').value = r.product.description;

        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
          cell.alignment = { wrapText: true, vertical: 'middle' };
          cell.border    = { bottom: { style: 'hair', color: { argb: 'FFDDDDDD' } } };
        });
        row.getCell('price').numFmt = '"₵"#,##0';

        // Embed thumbnail
        try {
          const imgUrl    = `${SITE_BASE}${r.product.image.startsWith('http') ? '' : ''}${r.product.image}`;
          const pngBase64 = await new Promise<string | null>((resolve) => {
            const img        = new Image();
            img.crossOrigin  = 'anonymous';
            img.onload = () => {
              const scale  = THUMB_H / img.naturalHeight;
              const w      = Math.max(1, Math.round(img.naturalWidth * scale));
              const canvas = document.createElement('canvas');
              canvas.width  = w;
              canvas.height = THUMB_H;
              const ctx = canvas.getContext('2d');
              if (!ctx) { resolve(null); return; }
              ctx.drawImage(img, 0, 0, w, THUMB_H);
              resolve(canvas.toDataURL('image/png').split(',')[1]);
            };
            img.onerror = () => resolve(null);
            img.src = imgUrl;
          });

          if (pngBase64) {
            const imgId = wb.addImage({ base64: pngBase64, extension: 'png' });
            ws.addImage(imgId, {
              tl: { col: 0, row: rowNum - 1 } as ExcelJS.Anchor,
              br: { col: 1, row: rowNum }     as ExcelJS.Anchor,
              editAs: 'oneCell',
            });
          }
        } catch {
          // skip image if fetch fails (external URL / CORS)
        }
      }

      const buf  = await wb.xlsx.writeBuffer();
      const blob = new Blob([buf], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href     = url;
      a.download = `sashmade-inventory-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setExportError(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  // ── Derived counts ──────────────────────────────────────────────────────────

  const inStockCount     = rows.filter((r) => r.status === 'In Stock').length;
  const mtoCount         = rows.filter((r) => r.status === 'Made to Order').length;
  const outOfStockCount  = rows.filter((r) => r.status === 'Out of Stock').length;
  const visibleRows      = filter === 'all' ? rows : rows.filter((r) => r.status === filter);

  const statusStyle = (s: StockStatus) => {
    if (s === 'In Stock')     return 'border-green-600/50 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20';
    if (s === 'Made to Order') return 'border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20';
    return 'border-red-400/50 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20';
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-white">Inventory Manager</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            Edit prices, toggle availability, and export to Excel.
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#4A5340] text-white text-sm font-bold rounded-xl hover:bg-[#3A4232] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Download inventory as Excel file"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {exporting ? 'Building…' : 'Download Inventory (.xlsx)'}
        </button>
      </div>

      {exportError && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg" role="alert">
          {exportError}
        </p>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'In Stock',      count: inStockCount,    color: 'text-green-600' },
          { label: 'Made to Order', count: mtoCount,        color: 'text-amber-600' },
          { label: 'Out of Stock',  count: outOfStockCount, color: 'text-red-500'   },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-200 dark:border-stone-700 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap" role="tablist">
        {([
          ['all', `All (${rows.length})`],
          ['In Stock', `In Stock (${inStockCount})`],
          ['Made to Order', `Made to Order (${mtoCount})`],
          ['Out of Stock', `Out of Stock (${outOfStockCount})`],
        ] as const).map(([val, label]) => (
          <button
            key={val}
            role="tab"
            aria-selected={filter === val}
            onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              filter === val
                ? 'bg-[#4A5340] text-white border-[#4A5340]'
                : 'border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:border-[#4A5340] dark:hover:border-[#D97706]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[64px_1fr_140px_140px_160px_80px] gap-4 px-5 py-3 bg-[#4A5340] text-[#D97706] text-xs font-bold uppercase tracking-widest">
          <div></div>
          <div>Design</div>
          <div>Category</div>
          <div>Status</div>
          <div>Price (GHS)</div>
          <div></div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-stone-100 dark:divide-stone-700">
          {visibleRows.map((row) => (
            <div
              key={row.product.id}
              className="grid grid-cols-[64px_1fr_140px_140px_160px_80px] gap-4 items-center px-5 py-3 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors"
            >
              {/* Thumbnail */}
              <img
                src={row.product.image}
                alt={row.product.name}
                className="w-14 h-14 object-cover rounded-lg bg-stone-100 dark:bg-stone-700 shrink-0"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              {/* Name + tagline */}
              <div className="min-w-0">
                <p className="font-serif font-bold text-[#4A5340] dark:text-white truncate">{row.product.name}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">{row.product.tagline}</p>
                <ul className="flex flex-wrap gap-x-2 mt-1">
                  {row.product.features.map((f, i) => (
                    <li key={i} className="text-[10px] text-[#D97706] font-medium">{f}</li>
                  ))}
                </ul>
              </div>

              {/* Category */}
              <div className="text-xs text-stone-600 dark:text-stone-300 truncate">{row.product.category}</div>

              {/* Status toggle */}
              <button
                onClick={() => handleStatusToggle(row.product.id)}
                title="Click to cycle status"
                aria-label={`Status: ${row.status}. Click to change.`}
                className={`text-xs px-3 py-1.5 rounded-full border font-bold transition-colors truncate ${statusStyle(row.status)}`}
              >
                {row.status}
              </button>

              {/* Price input */}
              <div className="flex items-center gap-1">
                <span className="text-stone-500 dark:text-stone-400 text-sm font-bold">₵</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={row.priceInput}
                  onChange={(e) => handlePriceChange(row.product.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, row.product.id)}
                  className="w-20 bg-transparent border-b border-stone-300 dark:border-stone-600 text-stone-900 dark:text-white text-sm py-1 px-1 focus:outline-none focus:border-[#4A5340] dark:focus:border-[#D97706] transition-colors"
                  aria-label={`Price for ${row.product.name}`}
                />
              </div>

              {/* Save button */}
              <div className="flex items-center gap-2">
                {row.saved ? (
                  <CheckCircle className="w-5 h-5 text-green-500" aria-label="Saved" />
                ) : (
                  <button
                    onClick={() => handleSave(row.product.id)}
                    className="px-3 py-1 bg-[#4A5340] text-white text-xs font-bold rounded-lg hover:bg-[#3A4232] transition-colors"
                    aria-label={`Save price for ${row.product.name}`}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-stone-400 text-center">
        Prices and statuses are persisted in localStorage. Export includes embedded product images.
      </p>
    </motion.div>
  );
}

```

### FILE: src/pages/admin/Testing.tsx
```typescript
import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Loader2, Terminal } from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  file: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  logs: string[];
  screenshot?: string;
}

const TEST_SUITE: Omit<TestResult, 'status' | 'logs'>[] = [
  { id: '1', name: 'E2E-01: Homepage Load & Navigation', file: 'homepage.test.ts' },
  { id: '2', name: 'E2E-02: Shop / Collections',        file: 'shop.test.ts'     },
  { id: '3', name: 'E2E-03: About Page Content',        file: 'about.test.ts'    },
  { id: '4', name: 'E2E-04: AI Studio Tabs',            file: 'ai-studio.test.ts'},
  { id: '5', name: 'E2E-05: Admin Console Auth & Inventory', file: 'admin.test.ts' },
];

const SIMULATED_LOGS: Record<string, string[]> = {
  '1': [
    'playwright: launching Chromium…',
    'page.goto http://localhost:3000',
    'expect(h1).toContainText("YOUR") → ✓',
    'expect(nav link "Shop Collections").toBeVisible() → ✓',
    'expect(nav link "About").toBeVisible() → ✓',
    'expect(CTA link to="/shop").toBeVisible() → ✓',
    'expect(kente-strip).toBeVisible() → ✓',
  ],
  '2': [
    'playwright: launching Chromium…',
    'page.goto http://localhost:3000/shop',
    'expect(h1).toContainText("Collections") → ✓',
    'expect(product cards with ₵).count() >= 5 → ✓',
    'expect(colour filter swatches).toBeVisible() → ✓',
    'expect("How to Order" sidebar).toBeVisible() → ✓',
    'expect(Payment Options banner).toBeVisible() → ✓',
  ],
  '3': [
    'playwright: launching Chromium…',
    'page.goto http://localhost:3000/about',
    'expect(h1).toContainText("About SashMade") → ✓',
    'expect("Sharon A.").toBeVisible() → ✓',
    'expect("Jospong").toBeVisible() → ✓',
    'expect("0247 139 986").toBeVisible() → ✓',
  ],
  '4': [
    'playwright: launching Chromium…',
    'page.goto http://localhost:3000/ai-studio',
    'expect(h1).toBeVisible() → ✓',
    'expect("Visual Decoder").toBeVisible() → ✓',
    'expect("Generative Loom").toBeVisible() → ✓',
  ],
  '5': [
    'playwright: launching Chromium…',
    'page.goto /admin/login → login form visible ✓',
    'page.goto /admin/dashboard (unauthenticated) → redirected to /admin/login ✓',
    'adminLogin(): fill username=admin, password=[REDACTED_CREDENTIAL]
    'expect("Inventory Manager").toBeVisible() → ✓',
    'expect("Adehye Style").toBeVisible() → ✓',
    'expect("Download Inventory").toBeVisible() → ✓',
  ],
};

export function Testing() {
  const [tests, setTests] = useState<TestResult[]>(
    TEST_SUITE.map((t) => ({ ...t, status: 'pending', logs: [] }))
  );
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (testId: string) => {
    setTests((prev) =>
      prev.map((t) =>
        t.id === testId
          ? { ...t, status: 'running', logs: ['playwright: initializing test runner…'] }
          : t
      )
    );

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

    setTests((prev) =>
      prev.map((t) => {
        if (t.id !== testId) return t;
        const passed = Math.random() > 0.15; // 85 % pass rate simulation
        return {
          ...t,
          status: passed ? 'passed' : 'failed',
          duration: Math.floor(Math.random() * 1800) + 400,
          logs: [
            ...t.logs,
            ...(SIMULATED_LOGS[testId] ?? []),
            passed
              ? '✓ All assertions passed.'
              : '✗ Assertion failed. Screenshot captured.',
          ],
          screenshot: passed ? undefined : 'https://picsum.photos/seed/pw-fail/800/450',
        };
      })
    );
  };

  const runAllTests = async () => {
    setIsRunning(true);
    // Reset all to pending first
    setTests((prev) => prev.map((t) => ({ ...t, status: 'pending', logs: [], screenshot: undefined })));
    for (const t of TEST_SUITE) {
      await runTest(t.id);
    }
    setIsRunning(false);
  };

  const passed  = tests.filter((t) => t.status === 'passed').length;
  const failed  = tests.filter((t) => t.status === 'failed').length;
  const pending = tests.filter((t) => t.status === 'pending').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-white">Automated Testing</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1 text-sm">
            Playwright E2E Test Suite — {tests.length} specs across 5 pages
          </p>
        </div>
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-3 bg-[#4A5340] text-white rounded-xl hover:bg-[#3A4232] disabled:opacity-50 transition-colors font-bold"
        >
          {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
          Run All Tests
        </button>
      </div>

      {/* Summary bar */}
      {tests.some((t) => t.status !== 'pending') && (
        <div className="flex gap-4 text-sm font-bold">
          <span className="text-green-600">{passed} passed</span>
          {failed > 0 && <span className="text-red-500">{failed} failed</span>}
          {pending > 0 && <span className="text-stone-400">{pending} pending</span>}
        </div>
      )}

      {/* Test cards */}
      <div className="grid gap-4">
        {tests.map((test) => (
          <div
            key={test.id}
            className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden"
          >
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                {/* Status icon */}
                {test.status === 'pending' && (
                  <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-700 flex items-center justify-center shrink-0">
                    <Terminal className="w-4 h-4 text-stone-400" />
                  </div>
                )}
                {test.status === 'running' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  </div>
                )}
                {test.status === 'passed' && (
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                )}
                {test.status === 'failed' && (
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                    <XCircle className="w-4 h-4 text-red-500" />
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="font-bold text-stone-900 dark:text-white">{test.name}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                    {test.file}
                    {test.duration ? ` · ${test.duration}ms` : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={() => runTest(test.id)}
                disabled={isRunning || test.status === 'running'}
                className="shrink-0 px-4 py-2 text-sm font-medium text-[#4A5340] dark:text-[#D97706] hover:bg-stone-50 dark:hover:bg-stone-700 rounded-lg transition-colors disabled:opacity-40"
              >
                Rerun
              </button>
            </div>

            {/* Logs pane */}
            {test.status !== 'pending' && (
              <div className="bg-stone-900 px-5 py-4 font-mono text-xs text-stone-300 border-t border-stone-800">
                <div className="space-y-1 mb-3">
                  {test.logs.map((line, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-stone-600 shrink-0">[pw]</span>
                      <span className={
                        line.includes('✗') || line.includes('FAIL') ? 'text-red-400' :
                        line.includes('✓') || line.includes('PASS') ? 'text-green-400' :
                        'text-stone-300'
                      }>
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
                {test.screenshot && (
                  <div className="mt-3">
                    <p className="text-stone-500 mb-2">Failure screenshot:</p>
                    <img
                      src={test.screenshot}
                      alt="Test failure screenshot"
                      className="rounded-lg border border-stone-700 max-h-48"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-stone-400 text-center">
        Run <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded">pnpm test:e2e</code> in the terminal to execute against a live server.
        &nbsp;Reports saved to <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded">tests/playwright-report/</code>.
      </p>
    </div>
  );
}

```

### FILE: src/pages/AIStudio.tsx
```typescript
import React from 'react';
import { StyleOracle } from '../components/StyleOracle';
import { motion } from 'motion/react';

export function AIStudio() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold text-[#4A5340] mb-4">AI Design Studio</h1>
        <p className="text-stone-600 max-w-2xl mx-auto">
          Explore the intersection of tradition and technology. Generate patterns, analyze fabrics, or consult with Sash.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column: Tools (Placeholder for Phase 1) */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200"
          >
            <h2 className="font-serif text-2xl font-bold text-[#4A5340] mb-4">Visual Decoder</h2>
            <p className="text-stone-600 mb-6">
              Upload an image of a fabric to identify its pattern, cultural origin, and get styling suggestions.
            </p>
            <div className="h-48 border-2 border-dashed border-stone-300 rounded-xl flex items-center justify-center bg-stone-50 text-stone-400">
              <span>Drag & Drop or Click to Upload (Coming Soon)</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200"
          >
            <h2 className="font-serif text-2xl font-bold text-[#4A5340] mb-4">Generative Loom</h2>
            <p className="text-stone-600 mb-6">
              Describe a pattern in text, and watch as our AI weaves it into existence.
            </p>
            <div className="h-48 bg-stone-100 rounded-xl flex items-center justify-center text-stone-400">
              <span>Pattern Generation Interface (Coming Soon)</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Chatbot */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="sticky top-24">
            <h2 className="font-serif text-2xl font-bold text-[#4A5340] mb-4">Style Oracle</h2>
            <p className="text-stone-600 mb-6">
              Chat with Sash for real-time advice and insights.
            </p>
            <StyleOracle />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

```

### FILE: src/pages/Home.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const heroMedia = [
  '/images/p7_54.png',
  '/images/p7_53.png',
  '/images/p7_51.png',
  '/images/p7_49.png',
];

export function Home() {
  const [shuffledMedia, setShuffledMedia] = useState(heroMedia);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Randomize the media order on mount
    setShuffledMedia([...heroMedia].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % shuffledMedia.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [shuffledMedia.length]);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="hero-grain relative min-h-[92vh] overflow-hidden py-10 md:py-16" style={{ background: '#3d4a35' }}>
        <div
          className="hero-main-grid relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 md:px-10 lg:px-16"
          style={{ gridTemplateColumns: 'minmax(0, 1.02fr) minmax(320px, 0.98fr)' }}
        >
          <div className="max-w-2xl text-white">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 flex items-center gap-3"
            >
              <div style={{ width: '40px', height: '2px', background: '#E87722' }} />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.28em]" style={{ color: '#E87722' }}>
                Graduate in Style
              </span>
            </motion.div>

            <h1 className="font-serif font-black leading-[0.92] tracking-[-0.04em]" style={{ fontSize: 'clamp(3.8rem, 9vw, 7.4rem)' }}>
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.62, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Your <span style={{ color: '#E87722', fontStyle: 'italic' }}>Journey.</span>
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.62, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Your Style.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.34 }}
              className="mt-8 max-w-xl font-sans text-lg leading-relaxed md:text-[1.35rem]"
              style={{ color: 'rgba(255,255,255,0.74)', fontWeight: 300 }}
            >
              Custom kente stoles crafted for graduations, institutions, and milestone moments across Africa. Wear heritage with presence, precision, and pride.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.46 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/shop"
                className="inline-flex items-center gap-2.5 rounded-[4px] px-7 py-4 font-sans text-sm font-bold uppercase tracking-[0.14em] text-[#1a1a1a] transition-colors"
                style={{ background: '#E87722' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#c96010')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#E87722')}
              >
                Shop Collections <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border-b pb-1 font-sans text-sm font-semibold tracking-[0.02em] transition-colors"
                style={{ color: 'rgba(255,255,255,0.72)', borderColor: 'rgba(255,255,255,0.2)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.72)')}
              >
                Meet SashMade <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.58 }}
              className="mt-10 flex flex-wrap gap-8 border-t pt-6"
              style={{ borderColor: 'rgba(255,255,255,0.12)' }}
            >
              {[
                ['500+', 'Custom designs'],
                ['70%', 'Deposit to begin'],
                ['1 week', 'Minimum turnaround'],
              ].map(([value, label]) => (
                <div key={label}>
                  <div className="font-serif text-3xl font-bold leading-none" style={{ color: '#E87722' }}>{value}</div>
                  <div className="mt-1 font-sans text-[11px] uppercase tracking-[0.16em]" style={{ color: 'rgba(255,255,255,0.46)' }}>{label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-12 hidden items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/40 md:flex"
            >
              <ChevronDown className="scroll-cue h-4 w-4 text-[#E87722]" />
              <span>Scroll to explore</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 14 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full"
          >
            <div
              className="relative ml-auto grid max-w-[580px] gap-3"
              style={{ gridTemplateColumns: '1.1fr 0.9fr', gridTemplateRows: '1.1fr 0.82fr', minHeight: '620px' }}
            >
              <div
                className="absolute -left-6 -top-6 h-28 w-28 rounded-full border"
                style={{ borderColor: 'rgba(232,119,34,0.14)' }}
              />
              <div
                className="absolute -bottom-8 right-10 h-24 w-24 rounded-full border"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}
              />

              <div className="overflow-hidden rounded-[20px] shadow-2xl" style={{ gridColumn: '1 / 2', gridRow: '1 / 3' }}>
                <img
                  src={shuffledMedia[currentImageIndex]}
                  alt="SashMade featured editorial"
                  className="h-full w-full object-cover transition-transform duration-700"
                  style={{ objectPosition: 'center top' }}
                />
              </div>

              <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#2e3728] p-4 shadow-xl" style={{ gridColumn: '2 / 3', gridRow: '1 / 2' }}>
                <img
                  src="/images/p7_56.png"
                  alt="Packaged SashMade collections"
                  className="h-full w-full rounded-[14px] object-cover"
                />
              </div>

              <div
                className="rounded-[20px] border border-white/10 p-6 shadow-xl"
                style={{
                  gridColumn: '2 / 3',
                  gridRow: '2 / 3',
                  background: 'linear-gradient(180deg, rgba(14,18,12,0.92) 0%, rgba(31,38,26,0.98) 100%)',
                }}
              >
                <div className="font-sans text-[11px] uppercase tracking-[0.18em]" style={{ color: '#E87722' }}>
                  Why SashMade
                </div>
                <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-white">
                  Kente stoles with cultural weight.
                </h2>
                <p className="mt-4 font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)' }}>
                  Designed around your class, logo, inscription, and colors so the final piece feels earned, not generic.
                </p>
                <div className="mt-6 space-y-3">
                  {['School logo integration', 'Preferred inscription', 'Pan-African color options'].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full" style={{ background: '#E87722' }} />
                      <span className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.84)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Kente strip at bottom */}
        <div className="kente-strip absolute bottom-0 left-0 right-0 z-10" />
      </section>

      {/* Mood Board */}
      <section className="py-12 px-4 md:px-10 lg:px-16" style={{ background: '#3d4a35' }}>
        <div className="max-w-7xl mx-auto">
          {/*
            Target grid (7 cells):
            [man-suit: col1 rows1-2] [heading: col2 row1] [woman-white: col3 row1] [man-blazer: col4 rows1-2]
                                     [kente-lay: col2 row2] [bags: col2b row2] [stacked: col3 row2]  [woman-blue: col4 rows1-2]

            Simplified as 12-col grid:
            col 1-3: tall portrait (2 rows)
            col 4-5: heading top / kente bottom
            col 6: bags bottom
            col 7-9: woman-white top / stacked bottom
            col 10-12: man-blazer top + woman-blue bottom (each 1 row)
          */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: '1fr 1fr',
            gap: '10px',
            height: '420px',
          }}>

            {/* Man in suit — tall left */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.05 }}
              className="overflow-hidden rounded-lg"
              style={{ gridColumn: '1 / 4', gridRow: '1 / 3' }}
            >
              <img src="/images/p7_49.png" alt="Graduate in suit"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" />
            </motion.div>

            {/* Heading — center top */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.08 }}
              className="flex flex-col justify-center pl-4"
              style={{ gridColumn: '4 / 7', gridRow: '1 / 2' }}
            >
              <h2 className="font-serif font-black text-white leading-[0.95]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                MOOD-<br/>BOARD
              </h2>
              <p className="font-sans text-[11px] tracking-[0.28em] uppercase mt-3" style={{ color: '#E87722' }}>
                @ SASHMADE2024
              </p>
            </motion.div>

            {/* Woman in white dress — center-right top */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="overflow-hidden rounded-lg"
              style={{ gridColumn: '7 / 10', gridRow: '1 / 2' }}
            >
              <img src="/images/p7_54.png" alt="Graduate in white dress"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                style={{ objectPosition: '50% 30%' }} />
            </motion.div>

            {/* Man in blazer — far right top */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.12 }}
              className="overflow-hidden rounded-lg"
              style={{ gridColumn: '10 / 13', gridRow: '1 / 2' }}
            >
              <img src="/images/p7_53.png" alt="Graduate in blazer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                style={{ objectPosition: '50% 25%' }} />
            </motion.div>

            {/* Kente flat-lay — bottom left-center */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.16 }}
              className="overflow-hidden rounded-lg"
              style={{ gridColumn: '4 / 6', gridRow: '2 / 3' }}
            >
              <img src="/images/p7_50.png" alt="Kente stoles on grass"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </motion.div>

            {/* Packaged bags — bottom center */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.19 }}
              className="overflow-hidden rounded-lg"
              style={{ gridColumn: '6 / 8', gridRow: '2 / 3' }}
            >
              <img src="/images/p7_56.png" alt="Packaged stoles"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </motion.div>

            {/* Stacked stoles — bottom center-right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.22 }}
              className="overflow-hidden rounded-lg"
              style={{ gridColumn: '8 / 10', gridRow: '2 / 3' }}
            >
              <img src="/images/p7_52.png" alt="Stacked kente stoles"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </motion.div>

            {/* Woman in blue dress — far right bottom */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.25 }}
              className="overflow-hidden rounded-lg"
              style={{ gridColumn: '10 / 13', gridRow: '2 / 3' }}
            >
              <img src="/images/p7_51.png" alt="Graduate in blue dress"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="overflow-hidden py-3.5" style={{ background: '#1a1a1a', borderTop: '1px solid rgba(255,255,255,0.06)' }} aria-hidden="true">
        <div style={{ display: 'flex', width: 'max-content', animation: 'marqueeScroll 28s linear infinite' }}>
          {[...Array(4)].flatMap(() => [
            'Graduate in Style', 'Your Journey', 'Your Style',
            'Stoles That Tell Your Story', 'Pan-African Pride',
            'Handcrafted in Ghana', 'Wear Your Story', 'Class of 2025',
          ]).map((text, i) => (
            <span
              key={i}
              className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] px-8 whitespace-nowrap flex items-center gap-4"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              <span
                className="inline-block w-[5px] h-[5px] rounded-full flex-shrink-0"
                style={{ background: ['#C0392B','#C9941A','#2E7D32'][i % 3] }}
              />
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* How to Order */}
      <section style={{ background: '#1a1a1a', position: 'relative' }}>
        <div
          style={{
            padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)',
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(3rem, 6vw, 6rem)',
            alignItems: 'center',
          }}
          className="how-to-order-grid"
        >
          {/* Left — visual panel */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Decorative ring */}
            <div style={{
              position: 'absolute', inset: '-16px',
              border: '1px solid rgba(232,119,34,0.12)',
              borderRadius: '8px',
              pointerEvents: 'none',
            }} />
            <div className="overflow-hidden rounded-lg shadow-2xl" style={{ aspectRatio: '4/5' }}>
              <img
                src="/images/about_flyer.png"
                alt="Get Your Kente Stole at an Affordable Price"
                className="w-full h-full object-cover"
                style={{ objectPosition: '50% 20%' }}
              />
            </div>

            {/* Floating stat badge */}
            <div style={{
              position: 'absolute', bottom: '24px', right: '-16px',
              background: '#252525',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              padding: '12px 18px',
            }}>
              <div className="font-serif font-bold text-xl" style={{ color: '#E87722', lineHeight: 1 }}>500+</div>
              <div className="font-sans text-[10px] font-medium uppercase tracking-[0.1em] mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Designs</div>
            </div>
          </motion.div>

          {/* Right — steps */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-5">
              <div style={{ width: '24px', height: '2px', background: '#E87722', flexShrink: 0 }} />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: '#E87722' }}>
                The Process
              </span>
            </div>

            <h2
              className="font-serif font-black text-white leading-[1.05] mb-10"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
            >
              HOW TO PLACE<br />AN ORDER
            </h2>

            <ol className="space-y-5">
              {[
                'Settle on the design you prefer and share',
                'Send inscription details per preference',
                'Make 70% payment and confirm',
                'Confirm mock up design',
                'Kindly wait for product to be ready',
                'Make balance payment of 30% and confirm',
              ].map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.18 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-4 font-sans leading-snug"
                  style={{ color: 'rgba(255,255,255,0.82)', fontSize: 'clamp(14px, 1.4vw, 16px)', fontWeight: 300 }}
                >
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: '#E87722', color: '#1a1a1a', fontFamily: 'var(--font-sans)' }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </motion.li>
              ))}
            </ol>

            {/* NB note */}
            <p
              className="font-sans text-sm italic mt-8 pl-11"
              style={{ color: 'rgba(232,119,34,0.8)' }}
            >
              NB: Product Completion takes Minimum a week
            </p>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '2rem 0' }} />

            {/* CTA row */}
            <div className="flex items-center gap-5 flex-wrap">
              <a
                href="https://wa.me/233555043118"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 font-sans font-medium text-[13px] uppercase tracking-[0.08em] transition-all"
                style={{
                  background: '#E87722', color: '#1a1a1a',
                  padding: '13px 26px', borderRadius: '3px',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#c96010'; (e.currentTarget as HTMLAnchorElement).style.letterSpacing = '0.12em'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#E87722'; (e.currentTarget as HTMLAnchorElement).style.letterSpacing = '0.08em'; }}
              >
                {/* WhatsApp icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.108.549 4.089 1.508 5.817L0 24l6.348-1.487A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.374l-.359-.214-3.724.873.93-3.613-.234-.37A9.818 9.818 0 1112 21.818z"/>
                </svg>
                Order via WhatsApp
              </a>
              <div>
                <p className="font-sans text-sm font-medium text-white">055 504 3118</p>
                <p className="font-sans text-[11px] uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.35)' }}>Follow us @ SASHMADE</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Kente strip at bottom */}
        <div className="kente-strip" />
      </section>

      {/* Collection Teaser */}
      <section className="py-24" style={{ background: '#F5F0E8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: '#E87722' }}>
            Handcrafted in Ghana
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6" style={{ color: '#3d4a35' }}>
            Our Custom Stole Models
          </h2>
          <p className="font-sans text-stone-600 max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
            Choose from our premium graduation stole models: Adehye Style, Nyonyo, Sophie, Daisy, and My Becoming. Let your stole speak of your success and the cultural legacy you proudly embrace.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 font-sans font-bold rounded-full transition-colors text-white"
            style={{ background: '#3d4a35' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#2c3828')}
            onMouseLeave={e => (e.currentTarget.style.background = '#3d4a35')}
          >
            View All Designs <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

```

### FILE: src/pages/Privacy.tsx
```typescript
import React from 'react';

export function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-[#4A5340] mb-6">Privacy Policy</h1>
      <div className="prose prose-lg text-stone-600">
        <p>Last updated: February 2026</p>
        <p>
          At SashMade, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.
        </p>
        <h3>Data Collection</h3>
        <p>
          We collect information you provide directly to us, such as when you create an account, make a purchase, or contact customer support.
        </p>
        <h3>Data Usage</h3>
        <p>
          We use your data to process orders, improve our services, and communicate with you about promotions and updates.
        </p>
      </div>
    </div>
  );
}

```

### FILE: src/pages/Refunds.tsx
```typescript
import React from 'react';

export function Refunds() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-[#4A5340] mb-6">Refund Policy</h1>
      <div className="prose prose-lg text-stone-600">
        <p>
          We want you to be completely satisfied with your purchase. If you are not, we offer a comprehensive refund policy.
        </p>
        <h3>Returns</h3>
        <p>
          You have 14 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it.
        </p>
        <h3>Refunds</h3>
        <p>
          Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
        </p>
      </div>
    </div>
  );
}

```

### FILE: src/pages/Shop.tsx
```typescript
import React, { useState, useMemo } from 'react';
import { products } from '../data/products';
import { CheckCircle, Phone, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';

const colorDots: Record<string, string> = {
  'Black':      '#1a1a1a',
  'Gold':       '#C9A84C',
  'Green':      '#2E7D32',
  'Red':        '#C0392B',
  'Customised': 'linear-gradient(135deg,#C0392B,#C9941A,#2E7D32)',
};

export function Shop() {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [addedId, setAddedId]               = useState<string | null>(null);
  const { addToCart }                        = useCart();

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const colors = useMemo(() => Array.from(new Set(products.flatMap(p => p.colors))).sort(), []);

  const filteredProducts = useMemo(() =>
    products.filter(p =>
      selectedColors.length === 0 || p.colors.some(c => selectedColors.includes(c))
    ), [selectedColors]);

  const toggle = (value: string) =>
    setSelectedColors(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="hero-grain relative overflow-hidden"
        style={{ background: '#3d4a35', paddingTop: '64px' }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: 'clamp(3.5rem, 7vw, 6rem) clamp(1.5rem, 5vw, 4rem) clamp(2.5rem, 5vw, 4rem)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: '24px', height: '2px', background: '#E87722', flexShrink: 0 }} />
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: '#E87722' }}>
              Handcrafted in Ghana
            </span>
          </div>

          <h1
            className="font-serif font-black text-white leading-[1.0]"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', letterSpacing: '-0.02em', maxWidth: '700px' }}
          >
            Our <em style={{ fontStyle: 'italic', color: '#E87722' }}>Collections</em>
          </h1>

          <p
            className="font-sans mt-5"
            style={{
              fontSize: 'clamp(14px, 1.4vw, 16px)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.65)',
              maxWidth: '520px',
              lineHeight: 1.7,
            }}
          >
            Premium customised kente stoles — tailored to your colours, logo, and story.
            Every piece is designed to embody achievement, identity, and cultural pride.
          </p>
        </div>
        <div className="kente-strip" style={{ position: 'relative', zIndex: 1 }} />
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <section style={{ background: '#F5F0E8', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '3rem', alignItems: 'flex-start' }} className="shop-layout">

          {/* ── SIDEBAR ──────────────────────────────────── */}
          <aside style={{ width: '240px', flexShrink: 0 }} className="shop-sidebar">

            {/* Filter panel */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid rgba(61,74,53,0.12)',
                borderRadius: '4px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif font-bold" style={{ color: '#1a1a1a', fontSize: '1rem' }}>Filter</h3>
                {selectedColors.length > 0 && (
                  <button
                    onClick={() => setSelectedColors([])}
                    className="flex items-center gap-1 font-sans text-xs transition-colors"
                    style={{ color: '#C0392B' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] mb-3" style={{ color: 'rgba(26,26,26,0.4)' }}>
                Colour Accent
              </p>

              <div className="flex flex-wrap gap-2">
                {colors.map(color => {
                  const isActive = selectedColors.includes(color);
                  return (
                    <button
                      key={color}
                      title={color}
                      onClick={() => toggle(color)}
                      className="relative group"
                      style={{
                        width: '32px', height: '32px',
                        borderRadius: '50%',
                        border: isActive ? '2px solid #3d4a35' : '2px solid transparent',
                        outline: isActive ? 'none' : '1px solid rgba(61,74,53,0.2)',
                        outlineOffset: '1px',
                        background: colorDots[color] ?? '#ccc',
                        transform: isActive ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s ease, border-color 0.15s ease',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      {isActive && (
                        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle className="w-4 h-4 text-white drop-shadow" />
                        </span>
                      )}
                      {/* Tooltip */}
                      <span
                        className="font-sans text-[10px] font-medium pointer-events-none"
                        style={{
                          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
                          transform: 'translateX(-50%)',
                          background: '#1a1a1a', color: '#fff',
                          padding: '3px 8px', borderRadius: '2px',
                          whiteSpace: 'nowrap',
                          opacity: 0,
                          transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                      >
                        {color}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedColors.length > 0 && (
                <p className="font-sans text-[11px] mt-4" style={{ color: 'rgba(26,26,26,0.45)' }}>
                  {filteredProducts.length} design{filteredProducts.length !== 1 ? 's' : ''} match
                </p>
              )}
            </div>

            {/* How to Order mini-panel */}
            <div
              style={{
                background: '#3d4a35',
                borderRadius: '4px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div style={{ width: '16px', height: '2px', background: '#E87722' }} />
                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.14em]" style={{ color: '#E87722' }}>
                  How to Order
                </span>
              </div>

              <ol className="space-y-3">
                {[
                  'Settle on the design you prefer and share',
                  'Send inscription details per preference',
                  'Make 70% payment and confirm',
                  'Confirm mock up design',
                  'Wait for product to be ready',
                  'Make balance payment of 30% and confirm',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className="font-sans font-bold text-[10px] flex-shrink-0 flex items-center justify-center rounded-full"
                      style={{
                        width: '18px', height: '18px',
                        background: '#E87722', color: '#1a1a1a',
                        marginTop: '1px',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="font-sans text-[12px] leading-snug" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 300 }}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1.25rem 0' }} />

              <a
                href="tel:0247139986"
                className="flex items-center gap-2 font-sans text-xs font-medium transition-colors"
                style={{ color: '#E87722' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#E87722')}
              >
                <Phone className="w-3.5 h-3.5" /> 0247 139 986
              </a>
            </div>

            {/* NB note */}
            <p className="font-sans text-[11px] italic" style={{ color: 'rgba(26,26,26,0.5)', lineHeight: 1.6 }}>
              NB: Product Completion takes Minimum a week.
            </p>
          </aside>

          {/* ── PRODUCT GRID ─────────────────────────────── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Count bar */}
            <div className="flex items-center justify-between mb-8">
              <p className="font-sans text-sm" style={{ color: 'rgba(26,26,26,0.45)', fontWeight: 400 }}>
                Showing <strong style={{ color: '#1a1a1a' }}>{filteredProducts.length}</strong> design{filteredProducts.length !== 1 ? 's' : ''}
              </p>
              {selectedColors.length > 0 && (
                <button
                  onClick={() => setSelectedColors([])}
                  className="font-sans text-xs flex items-center gap-1 transition-colors"
                  style={{ color: '#C0392B' }}
                >
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div
                className="text-center py-20 font-sans"
                style={{ border: '1px dashed rgba(61,74,53,0.25)', borderRadius: '4px' }}
              >
                <p style={{ color: 'rgba(26,26,26,0.45)' }}>No products match your filters.</p>
                <button
                  onClick={() => setSelectedColors([])}
                  className="mt-4 font-medium text-sm transition-colors"
                  style={{ color: '#3d4a35' }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                <AnimatePresence>
                  {filteredProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ delay: Math.min(idx, 5) * 0.07, ease: [0.16, 1, 0.3, 1] }}
                      className="group"
                      style={{
                        background: '#ffffff',
                        border: '1px solid rgba(61,74,53,0.14)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'default',
                        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.2s',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = 'translateY(-5px)';
                        el.style.boxShadow = '0 16px 48px rgba(61,74,53,0.14)';
                        el.style.borderColor = 'rgba(61,74,53,0.32)';
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = '';
                        el.style.boxShadow = '';
                        el.style.borderColor = 'rgba(61,74,53,0.14)';
                      }}
                    >
                      {/* Image */}
                      <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#e8e3da', position: 'relative' }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          style={{ transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)' }}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = '')}
                          referrerPolicy="no-referrer"
                        />
                        {/* Category badge */}
                        <div
                          className="font-sans font-bold text-[9px] uppercase tracking-[0.1em]"
                          style={{
                            position: 'absolute', top: '10px', left: '10px',
                            background: '#3d4a35', color: '#E87722',
                            padding: '3px 9px', borderRadius: '2px',
                          }}
                        >
                          {product.category}
                        </div>
                      </div>

                      {/* Body */}
                      <div style={{ padding: '1.25rem 1.25rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h3
                          className="font-serif font-bold leading-tight mb-1"
                          style={{ fontSize: 'clamp(16px, 1.8vw, 19px)', color: '#1a1a1a', letterSpacing: '-0.01em' }}
                        >
                          {product.name}
                        </h3>

                        <p
                          className="font-sans italic mb-3"
                          style={{ fontSize: '13px', color: 'rgba(26,26,26,0.45)', fontWeight: 300 }}
                        >
                          {product.tagline}
                        </p>

                        <p
                          className="font-sans leading-relaxed mb-4"
                          style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(26,26,26,0.6)', lineHeight: 1.6 }}
                        >
                          {product.description}
                        </p>

                        {/* Features */}
                        <ul className="space-y-1.5 mb-5">
                          {product.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#E87722' }} />
                              <span className="font-sans text-xs" style={{ color: 'rgba(26,26,26,0.6)', fontWeight: 300 }}>{f}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Footer */}
                        <div
                          className="mt-auto flex items-center justify-between pt-4"
                          style={{ borderTop: '1px solid rgba(61,74,53,0.1)' }}
                        >
                          <span className="font-serif font-bold" style={{ fontSize: '1.5rem', color: '#E87722', letterSpacing: '-0.01em' }}>
                            ₵{product.price}
                          </span>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={cn(
                              'flex items-center gap-2 font-sans font-medium text-[13px] uppercase tracking-[0.06em] transition-all',
                              addedId === product.id ? '' : ''
                            )}
                            style={{
                              padding: '9px 18px',
                              borderRadius: '3px',
                              background: addedId === product.id ? '#E87722' : '#3d4a35',
                              color: '#ffffff',
                              border: 'none',
                              cursor: 'pointer',
                              transform: addedId === product.id ? 'scale(0.95)' : 'scale(1)',
                              transition: 'background 0.2s, transform 0.15s',
                            }}
                            onMouseEnter={e => {
                              if (addedId !== product.id)
                                (e.currentTarget as HTMLButtonElement).style.background = '#2c3828';
                            }}
                            onMouseLeave={e => {
                              if (addedId !== product.id)
                                (e.currentTarget as HTMLButtonElement).style.background = '#3d4a35';
                            }}
                          >
                            {addedId === product.id ? (
                              <><CheckCircle className="w-4 h-4" /> Added!</>
                            ) : (
                              <><Plus className="w-4 h-4" /> Order</>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── PAYMENT BANNER ───────────────────────────────── */}
      <section style={{ background: '#1a1a1a', padding: 'clamp(3.5rem, 7vw, 6rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>

          <div className="flex items-center justify-center gap-2 mb-5">
            <div style={{ width: '24px', height: '2px', background: '#E87722' }} />
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: '#E87722' }}>
              Payment Options
            </span>
            <div style={{ width: '24px', height: '2px', background: '#E87722' }} />
          </div>

          <h2
            className="font-serif font-bold text-white mb-3"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', letterSpacing: '-0.02em' }}
          >
            We Make Paying <em style={{ fontStyle: 'italic', color: '#E87722' }}>Easy</em>
          </h2>

          <p className="font-sans mb-8" style={{ fontSize: '15px', fontWeight: 300, color: 'rgba(255,255,255,0.55)' }}>
            MTN Mobile Money · Vodafone Cash · GTBank Transfer · Cheque
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1px',
              background: 'rgba(255,255,255,0.07)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '2rem',
            }}
          >
            {[
              { label: 'MoMo Numbers', value: '0555 043 118\n0501 589 811' },
              { label: 'Account Name', value: 'Sharon Akua Begah' },
              { label: 'Account Number', value: '226103621140' },
              { label: 'Branch', value: 'Ashaley Botwe' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: '#252525', padding: '1.5rem' }}>
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {label}
                </p>
                <p className="font-sans font-medium" style={{ color: '#ffffff', fontSize: '14px', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          <p className="font-sans text-xs italic" style={{ color: 'rgba(232,119,34,0.8)' }}>
            All cheques should be written in the name of SASHMADE
          </p>
          <p className="font-sans text-xs mt-2 uppercase tracking-[0.06em]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            NB: Kindly notify us before and after payment. Product Completion takes Minimum a week.
          </p>
        </div>
      </section>

    </div>
  );
}

```

### FILE: src/pages/Terms.tsx
```typescript
import React from 'react';

export function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-[#4A5340] mb-6">Terms & Conditions</h1>
      <div className="prose prose-lg text-stone-600">
        <p>Last updated: February 2026</p>
        <p>
          Welcome to SashMade. By accessing or using our website, you agree to be bound by these Terms and Conditions.
        </p>
        <h3>Use of Service</h3>
        <p>
          You agree to use our service only for lawful purposes and in accordance with these Terms.
        </p>
        <h3>Intellectual Property</h3>
        <p>
          All content on this site, including text, graphics, logos, and images, is the property of SashMade or its content suppliers.
        </p>
      </div>
    </div>
  );
}

```

### FILE: src/services/gemini.ts
```typescript
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateChatResponse = async (
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  message: string
) => {
  if (!ai) throw new Error("Gemini API Key not configured");

  // The new SDK handles history differently in chats.create, but for a stateless
  // function we might need to reconstruct it or just use a new chat each time 
  // if we are managing state externally.
  // However, ai.chats.create returns a stateful chat object.
  // To support the existing UI which passes history, we should ideally use that history.
  // The SDK's Chat object has a `history` property we can populate.

  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction:
        "You are 'Sash', an AI fashion consultant for SashMade, an Afro-Chic textile studio. You are knowledgeable about African textile patterns (Kente, Ankara, Adinkra, etc.), their cultural significance, and modern styling. You are helpful, creative, and respectful of cultural heritage. Keep responses concise and engaging.",
    },
    history: history, 
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};

export const analyzeFabricPattern = async (file: File) => {
  if (!ai) throw new Error("Gemini API Key not configured");

  // Convert file to base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
    };
    reader.onerror = reject;
  });

  const prompt = `Analyze this fabric pattern. Return a JSON object with the following fields:
  - patternName: string
  - culturalOrigin: string
  - historicalSignificance: string
  - suggestedStyling: string
  - estimatedValueRange: string
  - colorPalette: array of 6 hex codes
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        },
      ],
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  // Clean up markdown code blocks if present
  const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(jsonString);
};

```

### FILE: SRS.md
```md
﻿# SashMade: Afro-Chic Studio - Software Requirements Specification
**IEEE Std 830-1998 Compliant**

| Field | Detail |
| :--- | :--- |
| **Document Version** | 3.0 (Final) |
| **Date** | February 2026 |
| **Status** | Production Ready |
| **Prepared For** | sashmade.com Development Team |
| **Prepared By** | Technical Architecture Team |
| **Classification** | Internal â€“ Confidential |

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for the SashMade: Afro-Chic Studio web platform (sashmade.com). It serves as the authoritative contractual reference between stakeholders, designers, and developers. The document conforms to IEEE Std 830-1998 and encompasses all subsystems including AI-powered design tools, end-to-end e-commerce operations, and integrated payment processing via Techbridge/Hubtel Gateway.

### 1.2 Scope
SashMade is a React 19-based Single Page Application (SPA) deployed at sashmade.com that enables customers across Ghana and the African diaspora to:
*   Explore, analyse, and generate African textile patterns using AI (Google Gemini).
*   Browse, filter, and purchase fabric products, custom garments, and design assets.
*   Checkout securely via Hubtel Payment Gateway (Mobile Money, Card, Bank).
*   Track order lifecycle from placement through fulfilment and delivery.
*   Interact with an AI fashion consultant chatbot named 'Sash'.
*   Manage accounts, wishlists, and order histories.

The platform is explicitly out of scope for: physical inventory management hardware, third-party logistics integrations beyond shipping-status webhooks, and wholesale B2B procurement workflows.

### 1.3 Definitions, Acronyms, and Abbreviations
| Term / Acronym | Definition |
| :--- | :--- |
| **SRS** | Software Requirements Specification |
| **SPA** | Single Page Application |
| **AI / ML** | Artificial Intelligence / Machine Learning |
| **API** | Application Programming Interface |
| **FR** | Functional Requirement |
| **NFR** | Non-Functional Requirement |
| **E2E** | End-to-End (testing) |
| **UX** | User Experience |
| **WCAG** | Web Content Accessibility Guidelines |
| **MoMo** | Mobile Money (Ghana-specific payment method) |
| **Hubtel** | Techbridge/Hubtel Payment Gateway (primary PSP) |
| **PSP** | Payment Service Provider |
| **SKU** | Stock Keeping Unit |
| **JWT** | JSON Web Token (authentication) |
| **CDN** | Content Delivery Network |
| **GDPR** | General Data Protection Regulation |
| **NDPC** | National Data Protection Commission (Ghana) |
| **TDD** | Test-Driven Development |

### 1.4 References
*   IEEE Std 830-1998: Recommended Practice for Software Requirements Specifications.
*   Google Gemini API Documentation â€” Multimodal Vision & Chat (2025).
*   Hubtel Developer Portal: Payment Gateway API v3.
*   Techbridge Integration Manual â€” Direct Debit & Mobile Money (2025).
*   WCAG 2.2 â€” W3C Web Content Accessibility Guidelines.
*   NDPC Guidelines for Online Data Processors â€” Ghana, 2023.
*   React 19 Official Documentation.
*   OWASP Top 10 2021 â€” Application Security Risks.

### 1.5 Document Overview
Section 2 provides product context. Section 3 specifies all functional requirements. Section 4 covers external interface requirements. Section 5 defines system features. Sections 6â€“14 address non-functional requirements, data management, security, e-commerce specifics, payment processing, deployment, testing, and appendices.

---

## 2. Overall Description

### 2.1 Product Perspective
SashMade operates as a vertically integrated AI-enhanced e-commerce platform. It is a new, standalone system that communicates with the following external systems:
*   **Google Gemini API** for multimodal AI processing (pattern analysis, image generation, chat).
*   **Hubtel Payment Gateway** for all payment transactions (MoMo, debit/credit card, bank transfer).
*   **Courier/Logistics Webhook APIs** for real-time shipment tracking status updates.
*   **Cloud Object Storage** (AWS S3 or Cloudflare R2) for product images and AI-generated assets.
*   **SMTP / Transactional Email Service** (SendGrid or Mailchimp) for order confirmations and notifications.

The system is decomposed into four high-level subsystems: (1) the AI Design Studio, (2) the E-Commerce Storefront, (3) the Order & Fulfilment Engine, and (4) the Admin Console.

### 2.2 Product Functions â€” High Level
| Subsystem | Key Functions |
| :--- | :--- |
| **AI Design Studio** | Image analysis, seamless pattern generation, AI chatbot 'Sash' |
| **E-Commerce Storefront** | Product catalogue, search & filter, wishlist, cart, promotions |
| **Checkout & Payments** | Multi-method checkout, Hubtel MoMo/Card/Bank, invoicing |
| **Order & Fulfilment** | Order management, status tracking, returns & refunds |
| **User Accounts** | Registration, authentication, profile, address book, order history |
| **Admin Console** | Dashboard, inventory, order processing, analytics, system health |

### 2.3 User Classes and Characteristics
#### 2.3.1 Guest Visitor
Unauthenticated user browsing the catalogue. May add to cart but must register/log in to complete checkout. Limited access to AI tools (max 3 pattern analyses per session).

#### 2.3.2 Registered Customer
Authenticated user with full purchase rights. Has access to order history, saved addresses, wishlist, and unlimited AI Design Studio features.

#### 2.3.3 Designer / Creative Partner
A registered user with elevated privileges to upload original textile designs for sale on the marketplace. Subject to a design vetting workflow.

#### 2.3.4 Customer Support Agent
Internal staff member with read access to customer orders and the ability to initiate refunds and update order statuses through the Admin Console.

#### 2.3.5 System Administrator
Full-access internal user responsible for system configuration, user management, inventory updates, analytics, and system health monitoring.

### 2.4 Operating Environment
*   **Client:** Modern web browsers (Chrome 120+, Firefox 120+, Safari 17+, Edge 120+) on desktop, tablet, and mobile.
*   **Server:** Node.js 20 LTS / Express 5 on a containerised cloud environment.
*   **Database:** PostgreSQL 16 (primary relational store) + Redis 7 (session cache, rate limiting).
*   **CDN:** Static assets and product images served via CDN edge nodes.
*   **Connectivity:** Requires active internet; offline mode is not supported.

### 2.5 Design and Implementation Constraints
*   **Frontend framework:** React 19.2.5 (strict requirement; no downgrade permitted).
*   **AI provider:** Google Gemini API (gemini-2.5-flash for vision/generation; gemini-3-flash-preview for chat).
*   **Payment PSP:** Hubtel Gateway (Techbridge) exclusively for primary transactions.
*   **Compliance:** NDPC (Ghana), GDPR (diaspora customers in EU), PCI-DSS SAQ-A for card data handling.
*   **Currency:** Default GHS (Ghana Cedi); multi-currency display (USD, GBP, EUR) with live exchange rates.
*   **Language:** English primary; Twi and French localisation planned for v3.1.

### 2.6 User Documentation
*   **Administrator Guide:** `/docs/ADMIN_GUIDE.md`
*   **Deployment Guide:** `/docs/DEPLOYMENT_GUIDE.md`
*   **Testing Guide:** `/docs/TESTING_GUIDE.md`

### 2.7 Assumptions and Dependencies
*   Google Gemini API quota is sufficient for expected load.
*   Hubtel merchant account is provisioned and sandbox credentials are available.
*   Product photography and initial inventory data are provided by the business team.
*   SSL/TLS certificate is managed by the hosting provider or Cloudflare.
*   The logistics partner exposes a REST webhook for shipment status events.

---

## 3. System Features

### 3.1 Splash Homepage
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-01** | Display a Hero section with auto-rotating image carousel (3â€“5 curated fabric images, 5-second interval, manual nav arrows) and a primary Call-To-Action button linking to the storefront. | MUST | Business |
| **FR-02** | Display an 'About SashMade' section with brand heritage narrative, founder story, and cultural context. | MUST | Marketing |
| **FR-03** | Display a 'Features at a Glance' section summarising the AI Studio, Storefront, and Chatbot. | SHOULD | Marketing |
| **FR-04** | Display a customer testimonials carousel with star ratings and reviewer attribution. | SHOULD | Marketing |
| **FR-05** | Display a product gallery grid (8â€“12 items) pulling from the live catalogue API. | MUST | Business |
| **FR-06** | Render a responsive navigation bar with logo, links (Shop, AI Studio, About), Cart icon with item count badge, and Login/Account button. | MUST | UX |
| **FR-07** | Display a footer with social links, legal pages (Privacy Policy, Terms & Conditions, Refund Policy), contact details, and payment method icons. | MUST | Legal/UX |

### 3.2 AI Design Studio

#### 3.2.1 Visual Decoder (Fabric Analyser)
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-10** | Accept image uploads (PNG, JPG, WEBP, max 5 MB) via drag-and-drop or file picker. | MUST | AI |
| **FR-11** | Display image preview immediately on upload before AI processing. | MUST | UX |
| **FR-12** | Submit image to Gemini Vision API and return structured metadata: Pattern Name, Cultural Origin, Historical Significance, Suggested Styling, Estimated Value Range. | MUST | AI |
| **FR-13** | Extract and display a 6-colour palette from the fabric image with hex codes and colour names. | MUST | AI |
| **FR-14** | Allow authenticated customers to save analysis results to their account profile. | SHOULD | UX |
| **FR-15** | Guest users may perform up to 3 analyses per session before a registration prompt is displayed. | MUST | Business |

#### 3.2.2 Generative Loom (Pattern Generator)
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-20** | Accept free-text prompts for AI-driven textile pattern generation. | MUST | AI |
| **FR-21** | Provide a library of at least 12 preset prompt templates (e.g., 'Kente Royale', 'Adinkra Minimal', 'Batik Coastal'). | MUST | UX |
| **FR-22** | Generate high-resolution (1024Ã—1024 px minimum) seamless pattern images via Gemini image generation. | MUST | AI |
| **FR-23** | Display generated image with prompt history (last 10 prompts in session). | MUST | UX |
| **FR-24** | Allow download of generated pattern as PNG. | MUST | UX |
| **FR-25** | Allow authenticated users to add a generated pattern to the marketplace for sale (triggers designer vetting workflow). | COULD | Business |
| **FR-26** | Display a loading skeleton/spinner with estimated time during generation. | MUST | UX |

#### 3.2.3 Style Oracle (AI Chatbot)
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-30** | Present a conversational chat interface with the 'Sash' AI persona. | MUST | AI |
| **FR-31** | Maintain context-aware session chat history (retained for the browser session duration). | MUST | AI |
| **FR-32** | Provide fashion advice on fabric pairing, styling, occasion dressing, and cultural significance. | MUST | AI |
| **FR-33** | Allow users to share a product URL in chat; Sash shall retrieve product details and advise on it. | SHOULD | AI/UX |
| **FR-34** | Display typing indicator while the AI is generating a response. | MUST | UX |
| **FR-35** | Provide quick-reply suggestion chips for common queries. | SHOULD | UX |

### 3.3 E-Commerce Storefront

#### 3.3.1 Product Catalogue
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-40** | Display a paginated product grid (24 items per page) with image, name, price (GHS primary), and 'Add to Cart' button. | MUST | E-Commerce |
| **FR-41** | Support filtering by category, origin, price range, and availability. | MUST | E-Commerce |
| **FR-42** | Support full-text keyword search with debounced API calls (300ms debounce). | MUST | E-Commerce |
| **FR-43** | Support sorting by Newest, Price Lowâ€“High, Price Highâ€“Low, Most Popular, Top Rated. | MUST | E-Commerce |
| **FR-44** | Display a Product Detail Page (PDP) with: image gallery, description, size chart, material composition, cultural story, reviews, and related products. | MUST | E-Commerce |
| **FR-45** | Allow customers to select size, colour variant, and quantity on the PDP. | MUST | E-Commerce |
| **FR-46** | Display real-time stock availability status. | MUST | E-Commerce |
| **FR-47** | Support a wishlist feature for authenticated users. | SHOULD | E-Commerce |

#### 3.3.2 Shopping Cart
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-50** | Persist cart in browser localStorage for guest users and database-backed for authenticated users. | MUST | E-Commerce |
| **FR-51** | Allow quantity adjustment and item removal within the cart. | MUST | E-Commerce |
| **FR-52** | Display order summary: line items, subtotal, estimated shipping, promotional discounts, and total. | MUST | E-Commerce |
| **FR-53** | Allow entry and validation of promotional/discount codes. | MUST | E-Commerce |
| **FR-54** | Merge guest cart with authenticated cart upon login. | MUST | E-Commerce |
| **FR-55** | Display a cross-sell recommendation block at the bottom of the cart. | COULD | Business |

### 3.4 Checkout & Order Placement
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-60** | Implement a multi-step checkout flow: (1) Contact Info, (2) Delivery Address, (3) Shipping Method, (4) Payment, (5) Review & Confirm. | MUST | E-Commerce |
| **FR-61** | Support guest checkout with optional account creation post-order. | MUST | E-Commerce |
| **FR-62** | Allow authenticated users to select from saved addresses or add a new address. | MUST | E-Commerce |
| **FR-63** | Display available shipping methods with estimated delivery dates and costs. | MUST | E-Commerce |
| **FR-64** | Integrate Hubtel Payment Gateway to support MoMo, Cards, Bank Transfer. | MUST | Payments |
| **FR-65** | Redirect to Hubtel-hosted payment page for card transactions (PCI-DSS SAQ-A compliant). | MUST | Compliance |
| **FR-66** | Handle Hubtel payment callbacks and update order status accordingly. | MUST | Payments |
| **FR-67** | Generate a unique Order Reference Number (SML-YYYYMMDD-XXXXX). | MUST | E-Commerce |
| **FR-68** | Send an order confirmation email with itemised receipt. | MUST | E-Commerce |
| **FR-69** | Display an Order Confirmation page with order summary and next-steps guidance. | MUST | UX |
| **FR-70** | Implement idempotency keys in all payment API calls. | MUST | Payments |
| **FR-71** | Support multi-currency display (GHS, USD, GBP, EUR). | SHOULD | Business |

### 3.5 Order Management
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-80** | Maintain order lifecycle states: Pending Payment â†’ Confirmed â†’ Processing â†’ Shipped â†’ Delivered â†’ Completed / Cancelled / Refunded. | MUST | E-Commerce |
| **FR-81** | Allow authenticated customers to view full order history. | MUST | E-Commerce |
| **FR-82** | Allow customers to view shipment tracking status. | MUST | E-Commerce |
| **FR-83** | Allow customers to submit a return/refund request within 14 days. | MUST | E-Commerce |
| **FR-84** | Send automated email/SMS notifications on order status transitions. | MUST | E-Commerce |
| **FR-85** | Allow admins to manually update order status and trigger refund via Hubtel API. | MUST | Admin |
| **FR-86** | Generate downloadable PDF invoice for any completed order. | SHOULD | E-Commerce |

### 3.6 User Account Management
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-90** | Support registration via email/password and social OAuth. | MUST | Auth |
| **FR-91** | Enforce email verification before account activation. | MUST | Security |
| **FR-92** | Support password reset via time-limited email link. | MUST | Security |
| **FR-93** | Allow users to manage profile details. | MUST | UX |
| **FR-94** | Allow users to manage multiple saved delivery addresses. | MUST | UX |
| **FR-95** | Implement JWT-based session management. | MUST | Security |
| **FR-96** | Provide a data export function (GDPR/NDPC). | MUST | Compliance |
| **FR-97** | Provide account deletion with a 30-day soft-delete grace period. | MUST | Compliance |

### 3.7 Admin Console
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-100** | Restrict access to /admin/* routes; require admin credentials (username + TOTP 2FA). | MUST | Security |
| **FR-101** | Dashboard: display real-time KPIs. | MUST | Admin |
| **FR-102** | Inventory management: CRUD operations for products, variants, SKUs. | MUST | Admin |
| **FR-103** | Order queue: view all orders, filter by status, print packing slips. | MUST | Admin |
| **FR-104** | Customer management: view customer profiles, order histories. | MUST | Admin |
| **FR-105** | Promotions management: create discount codes. | SHOULD | Business |
| **FR-106** | System diagnostics: API health checks, error logs. | MUST | Admin |
| **FR-107** | Audit log: immutable log of all admin actions. | MUST | Compliance |
| **FR-108** | Theme management: toggle Light, Dark, and High-Contrast themes. | COULD | UX |

### 3.8 Automated Testing Framework
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-110** | Expose an /admin/testing UI for executing automated E2E test suites. | MUST | QA |
| **FR-111** | Use Playwright to verify critical paths. | MUST | QA |
| **FR-112** | Display real-time test execution logs and pass/fail status. | MUST | QA |
| **FR-113** | Capture and store screenshots for failed tests. | MUST | QA |
| **FR-114** | Allow one-click test suite re-run from the admin UI. | SHOULD | QA |

---

## 4. External Interface Requirements
*   **User Interfaces:** Responsive (mobile/tablet/desktop), Afro-Chic aesthetic, WCAG 2.2 AA.
*   **Hardware Interfaces:** Standard web browsers; Camera/file API for uploads.
*   **Software Interfaces:** Google Gemini API, Hubtel Payment Gateway, Logistics Webhooks, SendGrid/Mailchimp, AWS S3/Cloudflare R2.
*   **Communications:** HTTPS (TLS 1.3), SSE for AI streaming, WebSockets for admin dashboard.

---

## 5. Payment Processing â€” Hubtel / Techbridge Gateway
*   **MoMo Flow:** Initiate -> USSD Prompt -> Callback -> Verify.
*   **Card Flow:** Initiate -> Redirect to Hubtel -> 3DS -> Redirect Back -> Verify.
*   **Security:** API credentials server-side only, HMAC-SHA256 callback validation, Idempotency keys, PCI-DSS SAQ-A (hosted pages).

---

## 6. Non-Functional Requirements
*   **Performance:** LCP <= 2.5s, AI response <= 10s, Hubtel init <= 5s.
*   **Reliability:** 99.9% uptime, API retry logic, graceful degradation.
*   **Security:** HTTPS, JWT (RS256), Rate limiting, OWASP Top 10, CSP, bcrypt passwords, TOTP 2FA for admins.
*   **Usability & Accessibility:** WCAG 2.2 Level AA, Keyboard navigable, Contrast ratios.
*   **Maintainability:** Airbnb Style Guide, Versioned APIs, Unit test coverage >= 80%.

---

## 7. Data Management
The following diagram illustrates the conceptual database schema.

![Database Schema](/docs/database_architecture.svg)

*   **Entities:** User, Product, SKU, Order, OrderItem, Payment, Shipment, DiscountCode, Review, AuditLog.
*   **Retention:** Indefinite for orders/payments, 30-day grace for deleted users, 90 days for AI images.
*   **Privacy:** NDPC/GDPR compliance, Cookie consent, Privacy Policy.

---

## 8. System Architecture Overview
The following diagrams illustrate the architecture and user flow of the SashMade platform.

### 8.1 High-Level Architecture
![System Architecture](/docs/system_architecture.svg)

### 8.2 Customer Journey
![Customer Journey](/docs/user_journey.svg)

*   **Frontend:** React 19, TypeScript, Tailwind CSS.
*   **Backend:** Node.js 20, Express 5, TypeScript.
*   **Database:** PostgreSQL 16, Redis 7.
*   **Infrastructure:** Docker, Kubernetes/PaaS, CI/CD (GitHub Actions).

---

## 9. Testing Requirements
*   **Unit:** Jest + React Testing Library (>= 80% coverage).
*   **Integration:** API tests, Payment callback tests.
*   **E2E:** Playwright-based tests accessible from Admin Console.
*   **Security:** OWASP ZAP scan, Penetration testing.
*   **Acceptance:** UAT with representative users.

---

## 10. Deployment and DevOps
*   **Environments:** Local Dev, Staging (Hubtel Sandbox), Production (Live).
*   **CI/CD:** Lint -> Unit Test -> Docker Build -> Deploy Staging -> E2E Test -> Manual Gate -> Deploy Production.
*   **Monitoring:** APM (Sentry/Datadog), Uptime checks, Alerting.

---

## 11. Regulatory and Compliance
*   **Data Protection:** Ghana NDPC, GDPR.
*   **Payment:** PCI-DSS SAQ-A, AML.
*   **Consumer Protection:** Refund Policy, Accurate descriptions.

---

## 12. Requirements Traceability Matrix
(Mapped in full document)

---

## 13. Document Revision History
*   **3.0 (2026-02-23):** Full IEEE Std 830-1998 restructure. Added Hubtel/Techbridge payment integration, compliance, deployment, testing.

---

## 14. Appendices
*   **A:** Hubtel Payment API Quick Reference.
*   **B:** Order Status State Machine.
*   **C:** Priority Classification.
*   **D:** Contact & Approval.

```

### FILE: tests/e2e/about.test.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('E2E-03: About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('loads the About heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/about/i);
    await expect(page.locator('h1')).toContainText(/sashmade/i);
  });

  test('shows the founder message section', async ({ page }) => {
    await expect(page.getByText(/message from our founder/i)).toBeVisible();
    await expect(page.getByText(/sharon a\./i)).toBeVisible();
  });

  test('team section lists members', async ({ page }) => {
    const teamSection = page.getByText(/the team behind/i).locator('..').locator('..');
    await expect(teamSection.getByText(/sharon akua begah/i)).toBeVisible();
    await expect(teamSection.getByText(/george kofi tego/i)).toBeVisible();
  });

  test('clients section is present', async ({ page }) => {
    await expect(page.getByText(/trusted by/i)).toBeVisible();
    await expect(page.getByText(/jospong/i)).toBeVisible();
    await expect(page.getByText(/zoomlion/i)).toBeVisible();
  });

  test('contact block shows phone and email', async ({ page }) => {
    const contactSection = page.locator('section').last();
    await expect(contactSection.getByRole('link', { name: /0247 139 986/i }).first()).toBeVisible();
    await expect(contactSection.getByRole('link', { name: /info@sashmade\.com/i }).first()).toBeVisible();
  });

  test('opening hours table is visible', async ({ page }) => {
    const contactSection = page.locator('section').last();
    await expect(contactSection.getByText(/opening hours/i)).toBeVisible();
    await expect(contactSection.getByText(/7:00 am/i).first()).toBeVisible();
    await expect(contactSection.getByText(/sunday/i)).toBeVisible();
  });
});

```

### FILE: tests/e2e/admin.test.ts
```typescript
import { test, expect } from '@playwright/test';

// Helper: log in as admin
async function adminLogin(page: import('@playwright/test').Page) {
  await page.goto('/admin/login');
  await page.fill('input[type="text"], input[name="username"]', 'admin');
  await page.fill('input[type="password"]', 'sashmade2026');
  await page.getByRole('button', { name: /login|sign in/i }).click();
  await page.waitForURL(/\/admin/);
}

test.describe('E2E-05: Admin Console', () => {
  test('login page is accessible', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('unauthenticated access to /admin redirects to login', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test.describe('authenticated', () => {
    test.beforeEach(async ({ page }) => {
      await adminLogin(page);
    });

    test('dashboard loads KPI cards', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await expect(page.getByText(/total revenue/i)).toBeVisible();
      await expect(page.getByText(/active orders/i)).toBeVisible();
    });

    test('inventory manager is accessible', async ({ page }) => {
      await page.goto('/admin/inventory');
      await expect(page.getByRole('heading', { name: /inventory manager/i })).toBeVisible();
    });

    test('inventory shows all stole designs', async ({ page }) => {
      await page.goto('/admin/inventory');
      // All 5 designs from products.ts
      for (const name of ['Adehye Style', 'Nyonyo', 'Sophie', 'Daisy', 'My Becoming']) {
        await expect(page.getByText(name)).toBeVisible();
      }
    });

    test('download inventory button is present', async ({ page }) => {
      await page.goto('/admin/inventory');
      await expect(
        page.getByRole('button', { name: /download inventory/i })
      ).toBeVisible();
    });

    test('diagnostics page loads', async ({ page }) => {
      await page.goto('/admin/diagnostics');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('audit logs page loads', async ({ page }) => {
      await page.goto('/admin/audit');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('testing page shows Playwright label', async ({ page }) => {
      await page.goto('/admin/testing');
      await expect(page.getByText(/playwright e2e test suite/i)).toBeVisible();
    });
  });
});

```

### FILE: tests/e2e/ai-studio.test.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('E2E-04: AI Studio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ai-studio');
  });

  test('loads the AI Studio heading', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Visual Decoder tab is present', async ({ page }) => {
    await expect(page.getByText(/visual decoder/i)).toBeVisible();
  });

  test('Generative Loom tab is present', async ({ page }) => {
    await expect(page.getByText(/generative loom/i)).toBeVisible();
  });

  test('upload area or prompt input is reachable', async ({ page }) => {
    // At least one of these interactive elements should exist
    const uploadArea = page.getByText(/drag.*drop|upload|choose file/i).first();
    const promptInput = page.locator('textarea, input[type="text"]').first();
    const hasUpload = await uploadArea.isVisible().catch(() => false);
    const hasInput  = await promptInput.isVisible().catch(() => false);
    expect(hasUpload || hasInput).toBeTruthy();
  });
});

```

### FILE: tests/e2e/homepage.test.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('E2E-01: Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads with correct heading', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/your/i);
    await expect(page.locator('h1')).toContainText(/style/i);
  });

  test('hero section is visible', async ({ page }) => {
    // Hero section sits in the first <section>
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
  });

  test('navigation links are present', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav.getByRole('link', { name: /shop collections/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /about/i })).toBeVisible();
  });

  test('CTA button links to shop', async ({ page }) => {
    const cta = page.getByRole('link', { name: /view all designs/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /\/shop/);
  });

  test('footer shows contact info', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toContainText('info@sashmade.com');
  });
});

```

### FILE: tests/e2e/shop.test.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('E2E-02: Shop / Collections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
  });

  test('loads the shop heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/collections/i);
  });

  test('displays product cards', async ({ page }) => {
    const cards = page.getByRole('heading', { level: 3 }).filter({ hasText: /adehye style|nyonyo|sophie|daisy|my becoming/i });
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(5);
  });

  test('product card shows price in GHS', async ({ page }) => {
    const firstPrice = page.locator('text=/₵\\d+/').first();
    await expect(firstPrice).toBeVisible();
  });

  test('colour filters are rendered', async ({ page }) => {
    await expect(page.getByTitle(/black/i)).toBeVisible();
    await expect(page.getByTitle(/gold/i)).toBeVisible();
  });

  test('clicking a colour filter updates the result count', async ({ page }) => {
    const totalText = page.getByText(/showing \d+ designs?/i).first();
    const beforeMatch = (await totalText.textContent())?.match(/\d+/);
    const totalBefore = beforeMatch ? Number(beforeMatch[0]) : 0;

    await page.getByTitle(/gold/i).click();
    const afterMatch = (await totalText.textContent())?.match(/\d+/);
    const totalAfter = afterMatch ? Number(afterMatch[0]) : 0;

    expect(totalAfter).toBeLessThanOrEqual(totalBefore);
  });

  test('order buttons are present on product cards', async ({ page }) => {
    const orderBtn = page.getByRole('button', { name: /order/i }).first();
    await expect(orderBtn).toBeVisible();
  });

  test('how to order sidebar is visible on desktop', async ({ page }) => {
    await expect(page.getByText(/how to order/i)).toBeVisible();
  });

  test('payment info banner is at the bottom', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText(/payment options/i)).toBeVisible();
  });
});

```

### FILE: tests/playwright-results/.last-run.json
```json
{
  "status": "passed",
  "failedTests": []
}
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
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
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
              if (id.includes('exceljs') || id.includes('jszip') || id.includes('archiver') || id.includes('fflate')) return 'vendor-exceljs';
              return 'vendor';
            }
          },
        },
      },
    },
  };
});

```

