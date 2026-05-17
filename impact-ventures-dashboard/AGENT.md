# impact-ventures-dashboard - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for impact-ventures-dashboard.

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

```

### FILE: .env.local
```text
# Local-only — gitignored. Do not commit.
# Paste your rotated Gemini API key below (no quotes needed, no spaces).
GEMINI_API_KEY=[REDACTED_CREDENTIAL]

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

### FILE: CREATION.md
```md
# impact-ventures-dashboard

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

### FILE: deploy.ps1
```ps1
# Impact Ventures Dashboard Deployment Script

param(
    [string]$RemoteHost = "root@66.226.72.199",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/impact-ventures/",
    [switch]$Build = $false
)

Write-Host "=== IMPACT VENTURES DASHBOARD DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host "Remote: $RemoteHost"
Write-Host "Path: $RemotePath`n"

if ($Build) {
    Write-Host "Building..." -ForegroundColor Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Write-Host "Error: dist/ not found. Run with -Build flag." -ForegroundColor Red
    exit 1
}

Write-Host "Creating directory..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Write-Host "Copying files..." -ForegroundColor Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\impact-ventures-dashboard' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Write-Host "Creating .htaccess..." -ForegroundColor Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /impact-ventures/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /impact-ventures/index.html [QSA,L]
</IfModule>
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Write-Host "Setting permissions..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "URL: https://ai-tools.techbridge.edu.gh/impact-ventures`n"

```

### FILE: Dockerfile
```text
FROM node:24-alpine AS builder
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

### FILE: docs/admin_guide.md
```md
# Admin Guide — Impact Ventures Dashboard

## Accessing the Admin Panel

Navigate to `#/admin` (append `#/admin` to the app URL). You will be prompted for the admin password.

**Default password:** `admin123`  
Change this in `src/App.tsx` → `ADMIN_PASSWORD` constant before deploying to production.

## Session Management

- Session persists in `sessionStorage` for the browser tab lifetime.
- Closing the tab clears the session automatically.
- Click **Logout** to end the session manually.

## Audit Log

All significant actions are logged automatically:

| Event | Trigger |
|---|---|
| `ADMIN_LOGIN_SUCCESS` | Correct password entered |
| `ADMIN_LOGIN_FAIL` | Incorrect password attempt |
| `ADMIN_LOGOUT` | Logout button clicked |
| `DIAGNOSTIC_RUN` | Storage test executed |

- Logs are stored in `localStorage` under key `impact-ventures-audit-logs`
- Maximum 200 entries retained (oldest entries trimmed automatically)
- Timestamps shown in local browser timezone

## Diagnostics Tab

| Check | Description |
|---|---|
| LocalStorage Access | Verifies browser storage read/write works |
| Portfolio Count | Displays current APP_DATA length (data integrity) |
| Gemini API Key | Checks if `GEMINI_API_KEY` env var is present |

## Security Notes

- The admin password is hardcoded in the frontend bundle — this is suitable for internal/demo use only
- For production with sensitive data, replace with a proper backend authentication flow
- Session tokens are not transmitted to any server; they exist only in the user's browser

```

### FILE: docs/deployment_guide.md
```md
# Deployment Guide — Impact Ventures Dashboard

## Prerequisites

- Node.js 24.x
- pnpm 10.30+
- Docker (for containerised deployment)
- `GEMINI_API_KEY` environment variable

## Local Development

```bash
cd impact-ventures-dashboard
pnpm install
GEMINI_API_KEY=[REDACTED_CREDENTIAL]
# Opens at http://localhost:5173
```

## Production Build

```bash
GEMINI_API_KEY=[REDACTED_CREDENTIAL]
# Output: dist/
```

## Docker Deployment

```bash
docker build -t impact-ventures-dashboard .
docker run -p 80:80 -e GEMINI_API_KEY=[REDACTED_CREDENTIAL]
```

### Docker Compose (monorepo)

The service is defined in `docker-compose-all-apps.yml`. Start with:

```bash
docker-compose -f ../docker-compose-all-apps.yml up impact-ventures-dashboard
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes (for AI briefs) | Google Gemini API key |

## Nginx Gateway

The app is proxied via the monorepo NGINX gateway at `http://localhost:8080/impact-ventures-dashboard/`.

To regenerate the nginx config after adding new services:

```bash
node scripts/generate_nginx_conf.js
```

## Health Check

The Docker container exposes the app on port 80 (nginx static serving). No `/health` endpoint is needed for a purely static SPA.

```

### FILE: docs/srs/impact_ventures_srs_v1.0.md
```md
﻿# Software Requirements Specification
## Impact Ventures Dashboard
**Version:** 1.0.0  
**Date:** April 24, 2026  
**Institution:** Techbridge University College (TUC)  
**Status:** As-Built

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the Impact Ventures Dashboard, a multivariate risk/reward analytics engine for evaluating AI venture portfolios against commercial liquidity and societal impact vectors.

### 1.2 Scope
The system provides: portfolio visualisation via scatter matrix, venture registry with multi-filter search, AI-generated strategic briefs (Gemini), side-by-side venture comparison, and a password-protected admin dashboard with audit logging.

### 1.3 Definitions
- **Tier**: Classification bracket (T1â€“T4) based on combined M+G scores
- **M-Score**: Monetisation / ROI capacity index (1â€“5)
- **G-Score**: Societal good / AI-for-Good index (1â€“5)
- **Brief**: AI-synthesised 4-point strategic analysis per venture

---

## 2. Overall Description

### 2.1 Product Perspective
Single-page React application. Static deployment via Nginx. Gemini API integration for AI brief generation.

### 2.2 User Classes
- **Portfolio Analyst**: Views matrix, filters registry, generates briefs
- **Administrator**: Accesses `#/admin` for audit logs and runtime diagnostics

---

## 3. Functional Requirements

| ID | Requirement |
|---|---|
| FR-001 | Display scatter matrix (M vs G axes) with tier colour coding |
| FR-002 | Render venture registry with rank, tier, category, M/G scores |
| FR-003 | Full-text search across venture name and rationale |
| FR-004 | Filter by tier (ALL, T1â€“T4), category, M-range, G-range |
| FR-005 | Click venture card to open detail modal |
| FR-006 | Generate AI strategic brief per venture via Gemini API |
| FR-007 | Select up to 4 ventures for side-by-side comparison matrix |
| FR-008 | Password-protected `#/admin` hash route |
| FR-009 | Audit log persisted to localStorage (max 200 entries) |
| FR-010 | Admin diagnostics: localStorage test, portfolio count, API key check |
| FR-011 | Session persistence via sessionStorage for admin auth |
| FR-012 | ARIA labels, roles, and skip-to-content link on all interactive elements |
| FR-013 | Strategic observations sidebar with synthetic intelligence summaries |

---

## 4. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-001 | React 19.2.5 (pinned, no caret) |
| NFR-002 | Zero broken links (`href="#"` prohibited) |
| NFR-003 | 100% ARIA coverage on interactive elements |
| NFR-004 | Build output < 2MB gzipped |
| NFR-005 | Docker multi-stage: `node:24-alpine` builder + `nginx:alpine` runtime |
| NFR-006 | WCAG 2.1 AA compliance |

---

## 5. Architecture

- **Frontend:** React 19.2.5, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts
- **AI:** Google Gemini API (`gemini-3-flash-preview`) for brief generation
- **State:** React hooks (useState, useMemo, useEffect, useCallback)
- **Persistence:** localStorage (audit logs), sessionStorage (admin session)
- **Routing:** Hash-based (`#/admin` for admin route)

---

## 6. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0.0 | 2026-04-24 | TUC Dev Team | Initial as-built specification |

```

### FILE: docs/testing_guide.md
```md
# Testing Guide — Impact Ventures Dashboard

## Manual Test Checklist

### Core UI
- [ ] Scatter matrix renders with tier colour coding (cyan T1, mint T2, amber T3, slate T4)
- [ ] Clicking a scatter point opens the venture detail modal
- [ ] Modal closes via the X button and via backdrop click
- [ ] Strategic observations sidebar displays all entries

### Search & Filter
- [ ] Search by venture name returns matching results
- [ ] Search by rationale text returns matching results
- [ ] Tier buttons (ALL, T1–T4) filter the grid correctly
- [ ] Category filter works for all 9 categories
- [ ] M-range and G-range sliders filter correctly
- [ ] "Reset all filters" restores full list

### Comparison
- [ ] Select up to 4 ventures — comparison bar appears
- [ ] EXECUTE_COMPARE opens the comparison matrix modal
- [ ] CLEAR_STACK removes all selections
- [ ] Cannot select a 5th venture

### AI Brief Generation
- [ ] GENERATE_BRIEF triggers Gemini API call
- [ ] Loading state shows "SYNTHESIZING_COMPUTE..."
- [ ] Generated brief renders as bullet points
- [ ] REGENERATE_ANALYSIS replaces previous brief

### Admin
- [ ] Navigate to `#/admin` — login modal appears
- [ ] Wrong password shows error, logs `ADMIN_LOGIN_FAIL`
- [ ] Correct password (`admin123`) opens dashboard
- [ ] Audit Log tab shows all events
- [ ] Diagnostics: storage test shows PASS/FAIL
- [ ] Diagnostics: portfolio count matches APP_DATA.length
- [ ] Logout clears session and closes dashboard

### Accessibility
- [ ] Skip-to-content link appears on Tab key press
- [ ] All modals trap focus correctly
- [ ] Tier filter buttons announce `aria-pressed` state
- [ ] Advanced filter panel announces `aria-expanded` state
- [ ] Screen reader announces modal labels correctly

## Admin Diagnostics (in-app)

Access `#/admin` → Diagnostics tab to run:
1. **LocalStorage Access** — verifies browser storage
2. **Portfolio Count** — validates data integrity
3. **Gemini API Key** — checks environment configuration

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
    <meta property="og:title" content="Impact Ventures Dashboard | Techbridge University College" />
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
    <meta name="twitter:title" content="Impact Ventures Dashboard | Techbridge University College" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#0F0C07" />
    <meta name="msapplication-TileColor" content="#0F0C07" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Impact Ventures Dashboard | Techbridge University College</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-FKXTELQ71R"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-FKXTELQ71R');
    </script>

    <style>
      :root, [data-theme='dark'] {
        --color-background-main: #0F0C07;
        --color-background-card: #141210;
        --color-background-card-hover: #1c1a17;
        --color-background-input: #0F0C07;
        --color-border-card: #1c1a17;
        --color-border-input: #2a2825;
        --color-foreground: #F2EBD9;
        --color-foreground-muted: #9ca3af;
        --color-foreground-on-primary: #0F0C07;
        --color-primary: #C8A84B;
        --color-primary-hover: #b6963a;
      }

      [data-theme='light'] {
        --color-background-main: #fcfaf2;
        --color-background-card: #ffffff;
        --color-background-card-hover: #f3f4f6;
        --color-background-input: #ffffff;
        --color-border-card: #e5e7eb;
        --color-border-input: #d1d5db;
        --color-foreground: #0F0C07;
        --color-foreground-muted: #4b5563;
        --color-foreground-on-primary: #ffffff;
        --color-primary: #C8A84B;
        --color-primary-hover: #b6963a;
      }

      [data-theme='high-contrast'] {
        --color-background-main: #000000;
        --color-background-card: #000000;
        --color-background-card-hover: #1a1a1a;
        --color-background-input: #000000;
        --color-border-card: #ffffff;
        --color-border-input: #ffffff;
        --color-foreground: #ffffff;
        --color-foreground-muted: #e0e0e0;
        --color-foreground-on-primary: #000000;
        --color-primary: #ffff00;
        --color-primary-hover: #e6e600;
      }

      body {
        background-color: var(--color-background-main);
        color: var(--color-foreground);
        font-family: 'Inter', sans-serif;
      }

      h1, h2, h3, .font-playfair {
        font-family: 'Playfair Display', serif;
      }

      .font-bebas {
        font-family: 'Bebas Neue', sans-serif;
      }

      .font-cormorant {
        font-family: 'Cormorant Garamond', serif;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }
    </style>
    <link rel="stylesheet" href="/src/index.css">
  </head>
  <body class="antialiased">
    <script>
      (function() {
        const theme = localStorage.getItem('impact-ventures-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
      })();
    </script>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

### FILE: metadata.json
```json
{
  "name": "Impact Ventures Dashboard",
  "description": "A strategic ranking dashboard for AI applications, balancing Monetisation potential with AI-for-Good impact.",
  "requestFramePermissions": [],
  "majorCapabilities": ["Data Visualization", "Strategic Insights"]
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
  "name": "impact-ventures-dashboard",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "node server.js",
    "dev:server": "node server.js",
    "start": "node server.js",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "pnpm exec playwright test --config playwright.config.ts"
  },
  "dependencies": {
    "@google/genai": "^1.50.1",
    "clsx": "^2.1.1",
    "express": "^5.2.1",
    "lucide-react": "^1.11.0",
    "motion": "^12.38.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "recharts": "^3.8.1",
    "tailwind-merge": "^3.5.0"
  },
  "devDependencies": {
    "@playwright/browser-chromium": "^1.59.1",
    "@playwright/browser-firefox": "^1.59.1",
    "@playwright/browser-webkit": "^1.59.1",
    "@playwright/test": "^1.59.1",
    "@tailwindcss/vite": "^4.2.4",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^25.6.0",
    "@vitejs/plugin-react": "^6.0.1",
    "@vitest/coverage-v8": "^4.1.5",
    "@vitest/ui": "^4.1.5",
    "autoprefixer": "^10.5.0",
    "baseline-browser-mapping": "^2.10.23",
    "jsdom": "^29.0.2",
    "postcss": "^8.5.12",
    "tailwindcss": "^4.2.4",
    "typescript": "~6.0.3",
    "vite": "^8.0.10",
    "vitest": "^4.1.5"
  }
}

```

### FILE: playwright-report/data/01bffda9377d59e7b57988dcf16a7d9d576126fe.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> admin journey >> admin session persists: re-entering #/admin skips login
- Location: tests\e2e\admin.spec.ts:90:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel(/password/i)

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('admin journey', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |     // ensure clean session/local storage for each scenario
  7   |     await page.evaluate(() => {
  8   |       sessionStorage.clear();
  9   |       localStorage.removeItem('impact-ventures-audit-logs');
  10  |     });
  11  |   });
  12  | 
  13  |   test('footer Admin link navigates to login modal', async ({ page }) => {
  14  |     await page.getByRole('button', { name: /open admin dashboard/i }).click();
  15  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
  16  |   });
  17  | 
  18  |   test('deep link #/admin opens the login modal', async ({ page }) => {
  19  |     await page.goto('/#/admin');
  20  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
  21  |   });
  22  | 
  23  |   test('show/hide password toggle flips input type', async ({ page }) => {
  24  |     await page.goto('/#/admin');
  25  |     const pwd = page.getByLabel(/password/i);
  26  |     await pwd.fill('something');
  27  |     await expect(pwd).toHaveAttribute('type', 'password');
  28  |     await page.getByRole('button', { name: /show password/i }).click();
  29  |     await expect(pwd).toHaveAttribute('type', 'text');
  30  |     await page.getByRole('button', { name: /hide password/i }).click();
  31  |     await expect(pwd).toHaveAttribute('type', 'password');
  32  |   });
  33  | 
  34  |   test('invalid password shows alert and writes a fail entry to audit log', async ({ page }) => {
  35  |     await page.goto('/#/admin');
  36  |     await page.getByLabel(/password/i).fill('wrong');
  37  |     await page.getByRole('button', { name: /authenticate/i }).click();
  38  |     await expect(page.getByRole('alert')).toContainText(/invalid password/i);
  39  | 
  40  |     const logs = await page.evaluate(() =>
  41  |       JSON.parse(localStorage.getItem('impact-ventures-audit-logs') || '[]'),
  42  |     );
  43  |     expect(logs[0].action).toBe('ADMIN_LOGIN_FAIL');
  44  |   });
  45  | 
  46  |   test('cancel returns to home', async ({ page }) => {
  47  |     await page.goto('/#/admin');
  48  |     await page.getByRole('button', { name: /^cancel$/i }).click();
  49  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
  50  |     await expect(page).toHaveURL(/\/$|#$/);
  51  |   });
  52  | 
  53  |   test('valid password opens dashboard, both tabs work, logout clears session', async ({ page }) => {
  54  |     await page.goto('/#/admin');
  55  |     await page.getByLabel(/password/i).fill('admin123');
  56  |     await page.getByRole('button', { name: /authenticate/i }).click();
  57  | 
  58  |     const dashboard = page.getByRole('main', { name: /admin dashboard/i });
  59  |     await expect(dashboard).toBeVisible();
  60  | 
  61  |     // Audit Log tab is the default
  62  |     const logsTab = page.getByRole('tab', { name: /audit log/i });
  63  |     const diagTab = page.getByRole('tab', { name: /diagnostics/i });
  64  |     await expect(logsTab).toHaveAttribute('aria-selected', 'true');
  65  |     await expect(page.getByRole('region', { name: /audit log/i })).toBeVisible();
  66  |     await expect(page.getByText('ADMIN_LOGIN_SUCCESS')).toBeVisible();
  67  | 
  68  |     // Switch to Diagnostics
  69  |     await diagTab.click();
  70  |     await expect(diagTab).toHaveAttribute('aria-selected', 'true');
  71  |     await expect(page.getByRole('region', { name: /system diagnostics/i })).toBeVisible();
  72  |     await expect(page.getByText(/portfolio count/i)).toBeVisible();
  73  | 
  74  |     // Run storage test → PASS
  75  |     await page.getByRole('button', { name: /^run test$/i }).click();
  76  |     await expect(page.getByRole('status').filter({ hasText: 'PASS' })).toBeVisible();
  77  | 
  78  |     // Diagnostic run is logged
  79  |     await logsTab.click();
  80  |     await expect(page.getByText('DIAGNOSTIC_RUN')).toBeVisible();
  81  | 
  82  |     // Logout clears session and unmounts dashboard
  83  |     await page.getByRole('button', { name: /logout from admin/i }).click();
  84  |     await expect(dashboard).toHaveCount(0);
  85  | 
  86  |     const session = await page.evaluate(() => sessionStorage.getItem('impact-ventures-admin'));
  87  |     expect(session).toBeNull();
  88  |   });
  89  | 
  90  |   test('admin session persists: re-entering #/admin skips login', async ({ page }) => {
  91  |     await page.goto('/#/admin');
> 92  |     await page.getByLabel(/password/i).fill('admin123');
      |                                        ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  93  |     await page.getByRole('button', { name: /authenticate/i }).click();
  94  |     await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();
  95  | 
  96  |     // Close dashboard via logout-free path: navigate away then back
  97  |     await page.evaluate(() => { window.location.hash = ''; });
  98  |     await page.evaluate(() => { window.location.hash = '#/admin'; });
  99  | 
  100 |     // Session is still set, so dashboard reopens without the login modal
  101 |     await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();
  102 |     await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
  103 |   });
  104 | });
  105 | 
```
```

### FILE: playwright-report/data/06295b39ac8d2f455054380a85d1db007b60d353.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> admin journey >> deep link #/admin opens the login modal
- Location: tests\e2e\admin.spec.ts:18:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog', { name: /admin access/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('dialog', { name: /admin access/i })

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('admin journey', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |     // ensure clean session/local storage for each scenario
  7   |     await page.evaluate(() => {
  8   |       sessionStorage.clear();
  9   |       localStorage.removeItem('impact-ventures-audit-logs');
  10  |     });
  11  |   });
  12  | 
  13  |   test('footer Admin link navigates to login modal', async ({ page }) => {
  14  |     await page.getByRole('button', { name: /open admin dashboard/i }).click();
  15  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
  16  |   });
  17  | 
  18  |   test('deep link #/admin opens the login modal', async ({ page }) => {
  19  |     await page.goto('/#/admin');
> 20  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
      |                                                                       ^ Error: expect(locator).toBeVisible() failed
  21  |   });
  22  | 
  23  |   test('show/hide password toggle flips input type', async ({ page }) => {
  24  |     await page.goto('/#/admin');
  25  |     const pwd = page.getByLabel(/password/i);
  26  |     await pwd.fill('something');
  27  |     await expect(pwd).toHaveAttribute('type', 'password');
  28  |     await page.getByRole('button', { name: /show password/i }).click();
  29  |     await expect(pwd).toHaveAttribute('type', 'text');
  30  |     await page.getByRole('button', { name: /hide password/i }).click();
  31  |     await expect(pwd).toHaveAttribute('type', 'password');
  32  |   });
  33  | 
  34  |   test('invalid password shows alert and writes a fail entry to audit log', async ({ page }) => {
  35  |     await page.goto('/#/admin');
  36  |     await page.getByLabel(/password/i).fill('wrong');
  37  |     await page.getByRole('button', { name: /authenticate/i }).click();
  38  |     await expect(page.getByRole('alert')).toContainText(/invalid password/i);
  39  | 
  40  |     const logs = await page.evaluate(() =>
  41  |       JSON.parse(localStorage.getItem('impact-ventures-audit-logs') || '[]'),
  42  |     );
  43  |     expect(logs[0].action).toBe('ADMIN_LOGIN_FAIL');
  44  |   });
  45  | 
  46  |   test('cancel returns to home', async ({ page }) => {
  47  |     await page.goto('/#/admin');
  48  |     await page.getByRole('button', { name: /^cancel$/i }).click();
  49  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
  50  |     await expect(page).toHaveURL(/\/$|#$/);
  51  |   });
  52  | 
  53  |   test('valid password opens dashboard, both tabs work, logout clears session', async ({ page }) => {
  54  |     await page.goto('/#/admin');
  55  |     await page.getByLabel(/password/i).fill('admin123');
  56  |     await page.getByRole('button', { name: /authenticate/i }).click();
  57  | 
  58  |     const dashboard = page.getByRole('main', { name: /admin dashboard/i });
  59  |     await expect(dashboard).toBeVisible();
  60  | 
  61  |     // Audit Log tab is the default
  62  |     const logsTab = page.getByRole('tab', { name: /audit log/i });
  63  |     const diagTab = page.getByRole('tab', { name: /diagnostics/i });
  64  |     await expect(logsTab).toHaveAttribute('aria-selected', 'true');
  65  |     await expect(page.getByRole('region', { name: /audit log/i })).toBeVisible();
  66  |     await expect(page.getByText('ADMIN_LOGIN_SUCCESS')).toBeVisible();
  67  | 
  68  |     // Switch to Diagnostics
  69  |     await diagTab.click();
  70  |     await expect(diagTab).toHaveAttribute('aria-selected', 'true');
  71  |     await expect(page.getByRole('region', { name: /system diagnostics/i })).toBeVisible();
  72  |     await expect(page.getByText(/portfolio count/i)).toBeVisible();
  73  | 
  74  |     // Run storage test → PASS
  75  |     await page.getByRole('button', { name: /^run test$/i }).click();
  76  |     await expect(page.getByRole('status').filter({ hasText: 'PASS' })).toBeVisible();
  77  | 
  78  |     // Diagnostic run is logged
  79  |     await logsTab.click();
  80  |     await expect(page.getByText('DIAGNOSTIC_RUN')).toBeVisible();
  81  | 
  82  |     // Logout clears session and unmounts dashboard
  83  |     await page.getByRole('button', { name: /logout from admin/i }).click();
  84  |     await expect(dashboard).toHaveCount(0);
  85  | 
  86  |     const session = await page.evaluate(() => sessionStorage.getItem('impact-ventures-admin'));
  87  |     expect(session).toBeNull();
  88  |   });
  89  | 
  90  |   test('admin session persists: re-entering #/admin skips login', async ({ page }) => {
  91  |     await page.goto('/#/admin');
  92  |     await page.getByLabel(/password/i).fill('admin123');
  93  |     await page.getByRole('button', { name: /authenticate/i }).click();
  94  |     await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();
  95  | 
  96  |     // Close dashboard via logout-free path: navigate away then back
  97  |     await page.evaluate(() => { window.location.hash = ''; });
  98  |     await page.evaluate(() => { window.location.hash = '#/admin'; });
  99  | 
  100 |     // Session is still set, so dashboard reopens without the login modal
  101 |     await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();
  102 |     await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
  103 |   });
  104 | });
  105 | 
```
```

### FILE: playwright-report/data/0ccc87b326e2c40eda52319ee3259e1281cb306f.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> admin journey >> valid password opens dashboard, both tabs work, logout clears session
- Location: tests\e2e\admin.spec.ts:53:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel(/password/i)

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('admin journey', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |     // ensure clean session/local storage for each scenario
  7   |     await page.evaluate(() => {
  8   |       sessionStorage.clear();
  9   |       localStorage.removeItem('impact-ventures-audit-logs');
  10  |     });
  11  |   });
  12  | 
  13  |   test('footer Admin link navigates to login modal', async ({ page }) => {
  14  |     await page.getByRole('button', { name: /open admin dashboard/i }).click();
  15  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
  16  |   });
  17  | 
  18  |   test('deep link #/admin opens the login modal', async ({ page }) => {
  19  |     await page.goto('/#/admin');
  20  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
  21  |   });
  22  | 
  23  |   test('show/hide password toggle flips input type', async ({ page }) => {
  24  |     await page.goto('/#/admin');
  25  |     const pwd = page.getByLabel(/password/i);
  26  |     await pwd.fill('something');
  27  |     await expect(pwd).toHaveAttribute('type', 'password');
  28  |     await page.getByRole('button', { name: /show password/i }).click();
  29  |     await expect(pwd).toHaveAttribute('type', 'text');
  30  |     await page.getByRole('button', { name: /hide password/i }).click();
  31  |     await expect(pwd).toHaveAttribute('type', 'password');
  32  |   });
  33  | 
  34  |   test('invalid password shows alert and writes a fail entry to audit log', async ({ page }) => {
  35  |     await page.goto('/#/admin');
  36  |     await page.getByLabel(/password/i).fill('wrong');
  37  |     await page.getByRole('button', { name: /authenticate/i }).click();
  38  |     await expect(page.getByRole('alert')).toContainText(/invalid password/i);
  39  | 
  40  |     const logs = await page.evaluate(() =>
  41  |       JSON.parse(localStorage.getItem('impact-ventures-audit-logs') || '[]'),
  42  |     );
  43  |     expect(logs[0].action).toBe('ADMIN_LOGIN_FAIL');
  44  |   });
  45  | 
  46  |   test('cancel returns to home', async ({ page }) => {
  47  |     await page.goto('/#/admin');
  48  |     await page.getByRole('button', { name: /^cancel$/i }).click();
  49  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
  50  |     await expect(page).toHaveURL(/\/$|#$/);
  51  |   });
  52  | 
  53  |   test('valid password opens dashboard, both tabs work, logout clears session', async ({ page }) => {
  54  |     await page.goto('/#/admin');
> 55  |     await page.getByLabel(/password/i).fill('admin123');
      |                                        ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  56  |     await page.getByRole('button', { name: /authenticate/i }).click();
  57  | 
  58  |     const dashboard = page.getByRole('main', { name: /admin dashboard/i });
  59  |     await expect(dashboard).toBeVisible();
  60  | 
  61  |     // Audit Log tab is the default
  62  |     const logsTab = page.getByRole('tab', { name: /audit log/i });
  63  |     const diagTab = page.getByRole('tab', { name: /diagnostics/i });
  64  |     await expect(logsTab).toHaveAttribute('aria-selected', 'true');
  65  |     await expect(page.getByRole('region', { name: /audit log/i })).toBeVisible();
  66  |     await expect(page.getByText('ADMIN_LOGIN_SUCCESS')).toBeVisible();
  67  | 
  68  |     // Switch to Diagnostics
  69  |     await diagTab.click();
  70  |     await expect(diagTab).toHaveAttribute('aria-selected', 'true');
  71  |     await expect(page.getByRole('region', { name: /system diagnostics/i })).toBeVisible();
  72  |     await expect(page.getByText(/portfolio count/i)).toBeVisible();
  73  | 
  74  |     // Run storage test → PASS
  75  |     await page.getByRole('button', { name: /^run test$/i }).click();
  76  |     await expect(page.getByRole('status').filter({ hasText: 'PASS' })).toBeVisible();
  77  | 
  78  |     // Diagnostic run is logged
  79  |     await logsTab.click();
  80  |     await expect(page.getByText('DIAGNOSTIC_RUN')).toBeVisible();
  81  | 
  82  |     // Logout clears session and unmounts dashboard
  83  |     await page.getByRole('button', { name: /logout from admin/i }).click();
  84  |     await expect(dashboard).toHaveCount(0);
  85  | 
  86  |     const session = await page.evaluate(() => sessionStorage.getItem('impact-ventures-admin'));
  87  |     expect(session).toBeNull();
  88  |   });
  89  | 
  90  |   test('admin session persists: re-entering #/admin skips login', async ({ page }) => {
  91  |     await page.goto('/#/admin');
  92  |     await page.getByLabel(/password/i).fill('admin123');
  93  |     await page.getByRole('button', { name: /authenticate/i }).click();
  94  |     await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();
  95  | 
  96  |     // Close dashboard via logout-free path: navigate away then back
  97  |     await page.evaluate(() => { window.location.hash = ''; });
  98  |     await page.evaluate(() => { window.location.hash = '#/admin'; });
  99  | 
  100 |     // Session is still set, so dashboard reopens without the login modal
  101 |     await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();
  102 |     await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
  103 |   });
  104 | });
  105 | 
```
```

### FILE: playwright-report/data/10d646639827d6aa88dab44a4ef0c14a14be471c.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> admin journey >> show/hide password toggle flips input type
- Location: tests\e2e\admin.spec.ts:23:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel(/password/i)

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('admin journey', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |     // ensure clean session/local storage for each scenario
  7   |     await page.evaluate(() => {
  8   |       sessionStorage.clear();
  9   |       localStorage.removeItem('impact-ventures-audit-logs');
  10  |     });
  11  |   });
  12  | 
  13  |   test('footer Admin link navigates to login modal', async ({ page }) => {
  14  |     await page.getByRole('button', { name: /open admin dashboard/i }).click();
  15  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
  16  |   });
  17  | 
  18  |   test('deep link #/admin opens the login modal', async ({ page }) => {
  19  |     await page.goto('/#/admin');
  20  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
  21  |   });
  22  | 
  23  |   test('show/hide password toggle flips input type', async ({ page }) => {
  24  |     await page.goto('/#/admin');
  25  |     const pwd = page.getByLabel(/password/i);
> 26  |     await pwd.fill('something');
      |               ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  27  |     await expect(pwd).toHaveAttribute('type', 'password');
  28  |     await page.getByRole('button', { name: /show password/i }).click();
  29  |     await expect(pwd).toHaveAttribute('type', 'text');
  30  |     await page.getByRole('button', { name: /hide password/i }).click();
  31  |     await expect(pwd).toHaveAttribute('type', 'password');
  32  |   });
  33  | 
  34  |   test('invalid password shows alert and writes a fail entry to audit log', async ({ page }) => {
  35  |     await page.goto('/#/admin');
  36  |     await page.getByLabel(/password/i).fill('wrong');
  37  |     await page.getByRole('button', { name: /authenticate/i }).click();
  38  |     await expect(page.getByRole('alert')).toContainText(/invalid password/i);
  39  | 
  40  |     const logs = await page.evaluate(() =>
  41  |       JSON.parse(localStorage.getItem('impact-ventures-audit-logs') || '[]'),
  42  |     );
  43  |     expect(logs[0].action).toBe('ADMIN_LOGIN_FAIL');
  44  |   });
  45  | 
  46  |   test('cancel returns to home', async ({ page }) => {
  47  |     await page.goto('/#/admin');
  48  |     await page.getByRole('button', { name: /^cancel$/i }).click();
  49  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
  50  |     await expect(page).toHaveURL(/\/$|#$/);
  51  |   });
  52  | 
  53  |   test('valid password opens dashboard, both tabs work, logout clears session', async ({ page }) => {
  54  |     await page.goto('/#/admin');
  55  |     await page.getByLabel(/password/i).fill('admin123');
  56  |     await page.getByRole('button', { name: /authenticate/i }).click();
  57  | 
  58  |     const dashboard = page.getByRole('main', { name: /admin dashboard/i });
  59  |     await expect(dashboard).toBeVisible();
  60  | 
  61  |     // Audit Log tab is the default
  62  |     const logsTab = page.getByRole('tab', { name: /audit log/i });
  63  |     const diagTab = page.getByRole('tab', { name: /diagnostics/i });
  64  |     await expect(logsTab).toHaveAttribute('aria-selected', 'true');
  65  |     await expect(page.getByRole('region', { name: /audit log/i })).toBeVisible();
  66  |     await expect(page.getByText('ADMIN_LOGIN_SUCCESS')).toBeVisible();
  67  | 
  68  |     // Switch to Diagnostics
  69  |     await diagTab.click();
  70  |     await expect(diagTab).toHaveAttribute('aria-selected', 'true');
  71  |     await expect(page.getByRole('region', { name: /system diagnostics/i })).toBeVisible();
  72  |     await expect(page.getByText(/portfolio count/i)).toBeVisible();
  73  | 
  74  |     // Run storage test → PASS
  75  |     await page.getByRole('button', { name: /^run test$/i }).click();
  76  |     await expect(page.getByRole('status').filter({ hasText: 'PASS' })).toBeVisible();
  77  | 
  78  |     // Diagnostic run is logged
  79  |     await logsTab.click();
  80  |     await expect(page.getByText('DIAGNOSTIC_RUN')).toBeVisible();
  81  | 
  82  |     // Logout clears session and unmounts dashboard
  83  |     await page.getByRole('button', { name: /logout from admin/i }).click();
  84  |     await expect(dashboard).toHaveCount(0);
  85  | 
  86  |     const session = await page.evaluate(() => sessionStorage.getItem('impact-ventures-admin'));
  87  |     expect(session).toBeNull();
  88  |   });
  89  | 
  90  |   test('admin session persists: re-entering #/admin skips login', async ({ page }) => {
  91  |     await page.goto('/#/admin');
  92  |     await page.getByLabel(/password/i).fill('admin123');
  93  |     await page.getByRole('button', { name: /authenticate/i }).click();
  94  |     await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();
  95  | 
  96  |     // Close dashboard via logout-free path: navigate away then back
  97  |     await page.evaluate(() => { window.location.hash = ''; });
  98  |     await page.evaluate(() => { window.location.hash = '#/admin'; });
  99  | 
  100 |     // Session is still set, so dashboard reopens without the login modal
  101 |     await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();
  102 |     await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
  103 |   });
  104 | });
  105 | 
```
```

### FILE: playwright-report/data/1b5284776e9138e0c6b474cce00f4a1b31d0fc95.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> admin journey >> cancel returns to home
- Location: tests\e2e\admin.spec.ts:46:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /^cancel$/i })

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('admin journey', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |     // ensure clean session/local storage for each scenario
  7   |     await page.evaluate(() => {
  8   |       sessionStorage.clear();
  9   |       localStorage.removeItem('impact-ventures-audit-logs');
  10  |     });
  11  |   });
  12  | 
  13  |   test('footer Admin link navigates to login modal', async ({ page }) => {
  14  |     await page.getByRole('button', { name: /open admin dashboard/i }).click();
  15  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
  16  |   });
  17  | 
  18  |   test('deep link #/admin opens the login modal', async ({ page }) => {
  19  |     await page.goto('/#/admin');
  20  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
  21  |   });
  22  | 
  23  |   test('show/hide password toggle flips input type', async ({ page }) => {
  24  |     await page.goto('/#/admin');
  25  |     const pwd = page.getByLabel(/password/i);
  26  |     await pwd.fill('something');
  27  |     await expect(pwd).toHaveAttribute('type', 'password');
  28  |     await page.getByRole('button', { name: /show password/i }).click();
  29  |     await expect(pwd).toHaveAttribute('type', 'text');
  30  |     await page.getByRole('button', { name: /hide password/i }).click();
  31  |     await expect(pwd).toHaveAttribute('type', 'password');
  32  |   });
  33  | 
  34  |   test('invalid password shows alert and writes a fail entry to audit log', async ({ page }) => {
  35  |     await page.goto('/#/admin');
  36  |     await page.getByLabel(/password/i).fill('wrong');
  37  |     await page.getByRole('button', { name: /authenticate/i }).click();
  38  |     await expect(page.getByRole('alert')).toContainText(/invalid password/i);
  39  | 
  40  |     const logs = await page.evaluate(() =>
  41  |       JSON.parse(localStorage.getItem('impact-ventures-audit-logs') || '[]'),
  42  |     );
  43  |     expect(logs[0].action).toBe('ADMIN_LOGIN_FAIL');
  44  |   });
  45  | 
  46  |   test('cancel returns to home', async ({ page }) => {
  47  |     await page.goto('/#/admin');
> 48  |     await page.getByRole('button', { name: /^cancel$/i }).click();
      |                                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
  49  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
  50  |     await expect(page).toHaveURL(/\/$|#$/);
  51  |   });
  52  | 
  53  |   test('valid password opens dashboard, both tabs work, logout clears session', async ({ page }) => {
  54  |     await page.goto('/#/admin');
  55  |     await page.getByLabel(/password/i).fill('admin123');
  56  |     await page.getByRole('button', { name: /authenticate/i }).click();
  57  | 
  58  |     const dashboard = page.getByRole('main', { name: /admin dashboard/i });
  59  |     await expect(dashboard).toBeVisible();
  60  | 
  61  |     // Audit Log tab is the default
  62  |     const logsTab = page.getByRole('tab', { name: /audit log/i });
  63  |     const diagTab = page.getByRole('tab', { name: /diagnostics/i });
  64  |     await expect(logsTab).toHaveAttribute('aria-selected', 'true');
  65  |     await expect(page.getByRole('region', { name: /audit log/i })).toBeVisible();
  66  |     await expect(page.getByText('ADMIN_LOGIN_SUCCESS')).toBeVisible();
  67  | 
  68  |     // Switch to Diagnostics
  69  |     await diagTab.click();
  70  |     await expect(diagTab).toHaveAttribute('aria-selected', 'true');
  71  |     await expect(page.getByRole('region', { name: /system diagnostics/i })).toBeVisible();
  72  |     await expect(page.getByText(/portfolio count/i)).toBeVisible();
  73  | 
  74  |     // Run storage test → PASS
  75  |     await page.getByRole('button', { name: /^run test$/i }).click();
  76  |     await expect(page.getByRole('status').filter({ hasText: 'PASS' })).toBeVisible();
  77  | 
  78  |     // Diagnostic run is logged
  79  |     await logsTab.click();
  80  |     await expect(page.getByText('DIAGNOSTIC_RUN')).toBeVisible();
  81  | 
  82  |     // Logout clears session and unmounts dashboard
  83  |     await page.getByRole('button', { name: /logout from admin/i }).click();
  84  |     await expect(dashboard).toHaveCount(0);
  85  | 
  86  |     const session = await page.evaluate(() => sessionStorage.getItem('impact-ventures-admin'));
  87  |     expect(session).toBeNull();
  88  |   });
  89  | 
  90  |   test('admin session persists: re-entering #/admin skips login', async ({ page }) => {
  91  |     await page.goto('/#/admin');
  92  |     await page.getByLabel(/password/i).fill('admin123');
  93  |     await page.getByRole('button', { name: /authenticate/i }).click();
  94  |     await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();
  95  | 
  96  |     // Close dashboard via logout-free path: navigate away then back
  97  |     await page.evaluate(() => { window.location.hash = ''; });
  98  |     await page.evaluate(() => { window.location.hash = '#/admin'; });
  99  | 
  100 |     // Session is still set, so dashboard reopens without the login modal
  101 |     await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();
  102 |     await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
  103 |   });
  104 | });
  105 | 
```
```

### FILE: playwright-report/data/20c7bb905f2fabed38118d9f1bb477a3168ad8ff.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> skip-link is present for keyboard users
- Location: tests\e2e\smoke.spec.ts:21:1

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator: getByRole('link', { name: /skip to main content/i })
Expected: "#main-content"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for getByRole('link', { name: /skip to main content/i })

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('home renders core landmarks without console errors', async ({ page }) => {
  4  |   const errors: string[] = [];
  5  |   page.on('pageerror', (err) => errors.push(err.message));
  6  |   page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  7  | 
  8  |   await page.goto('/');
  9  | 
  10 |   await expect(page.getByRole('banner')).toBeVisible();
  11 |   await expect(page.getByRole('heading', { level: 1, name: /IMPACT/i })).toBeVisible();
  12 |   await expect(page.getByText('PORTFOLIO.SIZE')).toBeVisible();
  13 |   await expect(page.getByText('IMPACT.CRITICAL')).toBeVisible();
  14 |   await expect(page.getByRole('region', { name: /impact matrix/i })).toBeVisible();
  15 |   await expect(page.getByRole('region', { name: /venture registry/i })).toBeVisible();
  16 |   await expect(page.getByRole('contentinfo')).toBeVisible();
  17 | 
  18 |   expect(errors, `errors: ${errors.join(' | ')}`).toEqual([]);
  19 | });
  20 | 
  21 | test('skip-link is present for keyboard users', async ({ page }) => {
  22 |   await page.goto('/');
  23 |   const skip = page.getByRole('link', { name: /skip to main content/i });
> 24 |   await expect(skip).toHaveAttribute('href', '#main-content');
     |                      ^ Error: expect(locator).toHaveAttribute(expected) failed
  25 | });
  26 | 
```
```

### FILE: playwright-report/data/377b63b95c9db48002c5d802c1a054ce971f2cf7.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: compare.spec.ts >> compare flow >> CLEAR_STACK empties the toolbar
- Location: tests\e2e\compare.spec.ts:22:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('div').filter({ has: getByRole('heading', { name: /fraud detection engine/i }) }).first().getByRole('button', { name: /compare/i })

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const card = (page: import('@playwright/test').Page, name: RegExp) =>
  4  |   page.locator('div').filter({ has: page.getByRole('heading', { name }) }).first();
  5  | 
  6  | test.describe('compare flow', () => {
  7  |   test.beforeEach(async ({ page }) => {
  8  |     await page.goto('/');
  9  |   });
  10 | 
  11 |   test('selecting cards reveals the toolbar with count', async ({ page }) => {
  12 |     // The COMPARE button on each card stops propagation, so it does not open the modal.
  13 |     await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
  14 |     const toolbar = page.getByRole('toolbar', { name: /compare selected ventures/i });
  15 |     await expect(toolbar).toBeVisible();
  16 |     await expect(toolbar.getByText('1 ASSETS_MAPPED')).toBeVisible();
  17 | 
  18 |     await card(page, /predictive disease risk model/i).getByRole('button', { name: /compare/i }).click();
  19 |     await expect(toolbar.getByText('2 ASSETS_MAPPED')).toBeVisible();
  20 |   });
  21 | 
  22 |   test('CLEAR_STACK empties the toolbar', async ({ page }) => {
> 23 |     await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
     |                                                                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
  24 |     const toolbar = page.getByRole('toolbar', { name: /compare selected ventures/i });
  25 |     await toolbar.getByRole('button', { name: /clear comparison selection/i }).click();
  26 |     await expect(toolbar).toHaveCount(0);
  27 |   });
  28 | 
  29 |   test('EXECUTE_COMPARE opens the comparison stream and RETURN closes it', async ({ page }) => {
  30 |     await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
  31 |     await card(page, /predictive disease risk model/i).getByRole('button', { name: /compare/i }).click();
  32 | 
  33 |     await page.getByRole('button', { name: /compare 2 selected ventures/i }).click();
  34 | 
  35 |     await expect(page.getByText('RELATIVE_VENTURE_MATRIX.0x4')).toBeVisible();
  36 |     await expect(page.getByRole('heading', { name: /comparison/i })).toBeVisible();
  37 | 
  38 |     await page.getByRole('button', { name: /return_to_command_dashboard/i }).click();
  39 |     await expect(page.getByText('RELATIVE_VENTURE_MATRIX.0x4')).toHaveCount(0);
  40 |   });
  41 | 
  42 |   test('cap at 4 selections — a 5th click is ignored', async ({ page }) => {
  43 |     const targets = [
  44 |       /fraud detection engine/i,
  45 |       /predictive disease risk model/i,
  46 |       /academic integrity detector/i,
  47 |       /microcredit risk scorer/i,
  48 |       /ai exam generator/i,
  49 |     ];
  50 |     for (const t of targets) {
  51 |       await card(page, t).getByRole('button', { name: /compare|mapped/i }).click();
  52 |     }
  53 |     await expect(page.getByRole('toolbar').getByText(/4 ASSETS_MAPPED/)).toBeVisible();
  54 |   });
  55 | });
  56 | 
```
```

### FILE: playwright-report/data/3e058690ffc39c9735966b01f1728c3c7e617edb.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> home renders core landmarks without console errors
- Location: tests\e2e\smoke.spec.ts:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('banner')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('banner')

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('home renders core landmarks without console errors', async ({ page }) => {
  4  |   const errors: string[] = [];
  5  |   page.on('pageerror', (err) => errors.push(err.message));
  6  |   page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  7  | 
  8  |   await page.goto('/');
  9  | 
> 10 |   await expect(page.getByRole('banner')).toBeVisible();
     |                                          ^ Error: expect(locator).toBeVisible() failed
  11 |   await expect(page.getByRole('heading', { level: 1, name: /IMPACT/i })).toBeVisible();
  12 |   await expect(page.getByText('PORTFOLIO.SIZE')).toBeVisible();
  13 |   await expect(page.getByText('IMPACT.CRITICAL')).toBeVisible();
  14 |   await expect(page.getByRole('region', { name: /impact matrix/i })).toBeVisible();
  15 |   await expect(page.getByRole('region', { name: /venture registry/i })).toBeVisible();
  16 |   await expect(page.getByRole('contentinfo')).toBeVisible();
  17 | 
  18 |   expect(errors, `errors: ${errors.join(' | ')}`).toEqual([]);
  19 | });
  20 | 
  21 | test('skip-link is present for keyboard users', async ({ page }) => {
  22 |   await page.goto('/');
  23 |   const skip = page.getByRole('link', { name: /skip to main content/i });
  24 |   await expect(skip).toHaveAttribute('href', '#main-content');
  25 | });
  26 | 
```
```

### FILE: playwright-report/data/5f27e03c4d91e4adf6f8fec203451e696ea6ba5b.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> admin journey >> footer Admin link navigates to login modal
- Location: tests\e2e\admin.spec.ts:13:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /open admin dashboard/i })

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('admin journey', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |     // ensure clean session/local storage for each scenario
  7   |     await page.evaluate(() => {
  8   |       sessionStorage.clear();
  9   |       localStorage.removeItem('impact-ventures-audit-logs');
  10  |     });
  11  |   });
  12  | 
  13  |   test('footer Admin link navigates to login modal', async ({ page }) => {
> 14  |     await page.getByRole('button', { name: /open admin dashboard/i }).click();
      |                                                                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
  15  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
  16  |   });
  17  | 
  18  |   test('deep link #/admin opens the login modal', async ({ page }) => {
  19  |     await page.goto('/#/admin');
  20  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
  21  |   });
  22  | 
  23  |   test('show/hide password toggle flips input type', async ({ page }) => {
  24  |     await page.goto('/#/admin');
  25  |     const pwd = page.getByLabel(/password/i);
  26  |     await pwd.fill('something');
  27  |     await expect(pwd).toHaveAttribute('type', 'password');
  28  |     await page.getByRole('button', { name: /show password/i }).click();
  29  |     await expect(pwd).toHaveAttribute('type', 'text');
  30  |     await page.getByRole('button', { name: /hide password/i }).click();
  31  |     await expect(pwd).toHaveAttribute('type', 'password');
  32  |   });
  33  | 
  34  |   test('invalid password shows alert and writes a fail entry to audit log', async ({ page }) => {
  35  |     await page.goto('/#/admin');
  36  |     await page.getByLabel(/password/i).fill('wrong');
  37  |     await page.getByRole('button', { name: /authenticate/i }).click();
  38  |     await expect(page.getByRole('alert')).toContainText(/invalid password/i);
  39  | 
  40  |     const logs = await page.evaluate(() =>
  41  |       JSON.parse(localStorage.getItem('impact-ventures-audit-logs') || '[]'),
  42  |     );
  43  |     expect(logs[0].action).toBe('ADMIN_LOGIN_FAIL');
  44  |   });
  45  | 
  46  |   test('cancel returns to home', async ({ page }) => {
  47  |     await page.goto('/#/admin');
  48  |     await page.getByRole('button', { name: /^cancel$/i }).click();
  49  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
  50  |     await expect(page).toHaveURL(/\/$|#$/);
  51  |   });
  52  | 
  53  |   test('valid password opens dashboard, both tabs work, logout clears session', async ({ page }) => {
  54  |     await page.goto('/#/admin');
  55  |     await page.getByLabel(/password/i).fill('admin123');
  56  |     await page.getByRole('button', { name: /authenticate/i }).click();
  57  | 
  58  |     const dashboard = page.getByRole('main', { name: /admin dashboard/i });
  59  |     await expect(dashboard).toBeVisible();
  60  | 
  61  |     // Audit Log tab is the default
  62  |     const logsTab = page.getByRole('tab', { name: /audit log/i });
  63  |     const diagTab = page.getByRole('tab', { name: /diagnostics/i });
  64  |     await expect(logsTab).toHaveAttribute('aria-selected', 'true');
  65  |     await expect(page.getByRole('region', { name: /audit log/i })).toBeVisible();
  66  |     await expect(page.getByText('ADMIN_LOGIN_SUCCESS')).toBeVisible();
  67  | 
  68  |     // Switch to Diagnostics
  69  |     await diagTab.click();
  70  |     await expect(diagTab).toHaveAttribute('aria-selected', 'true');
  71  |     await expect(page.getByRole('region', { name: /system diagnostics/i })).toBeVisible();
  72  |     await expect(page.getByText(/portfolio count/i)).toBeVisible();
  73  | 
  74  |     // Run storage test → PASS
  75  |     await page.getByRole('button', { name: /^run test$/i }).click();
  76  |     await expect(page.getByRole('status').filter({ hasText: 'PASS' })).toBeVisible();
  77  | 
  78  |     // Diagnostic run is logged
  79  |     await logsTab.click();
  80  |     await expect(page.getByText('DIAGNOSTIC_RUN')).toBeVisible();
  81  | 
  82  |     // Logout clears session and unmounts dashboard
  83  |     await page.getByRole('button', { name: /logout from admin/i }).click();
  84  |     await expect(dashboard).toHaveCount(0);
  85  | 
  86  |     const session = await page.evaluate(() => sessionStorage.getItem('impact-ventures-admin'));
  87  |     expect(session).toBeNull();
  88  |   });
  89  | 
  90  |   test('admin session persists: re-entering #/admin skips login', async ({ page }) => {
  91  |     await page.goto('/#/admin');
  92  |     await page.getByLabel(/password/i).fill('admin123');
  93  |     await page.getByRole('button', { name: /authenticate/i }).click();
  94  |     await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();
  95  | 
  96  |     // Close dashboard via logout-free path: navigate away then back
  97  |     await page.evaluate(() => { window.location.hash = ''; });
  98  |     await page.evaluate(() => { window.location.hash = '#/admin'; });
  99  | 
  100 |     // Session is still set, so dashboard reopens without the login modal
  101 |     await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();
  102 |     await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
  103 |   });
  104 | });
  105 | 
```
```

### FILE: playwright-report/data/69a9016fbeac51585bc505c8ae82a0e1f5c9204f.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filters.spec.ts >> search and filter journey >> search narrows the registry
- Location: tests\e2e\filters.spec.ts:8:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('searchbox', { name: /search ventures/i })

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('search and filter journey', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('search narrows the registry', async ({ page }) => {
  9  |     const search = page.getByRole('searchbox', { name: /search ventures/i });
> 10 |     await search.fill('fraud');
     |                  ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  11 |     await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
  12 |     // a non-matching name should disappear
  13 |     await expect(page.getByRole('heading', { name: /crop yield predictor/i })).toHaveCount(0);
  14 |   });
  15 | 
  16 |   test('tier filter restricts to selected tier', async ({ page }) => {
  17 |     await page.getByRole('button', { name: /filter tier 1/i }).click();
  18 |     await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
  19 |     // a known T2 entry should be hidden
  20 |     await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toHaveCount(0);
  21 | 
  22 |     await page.getByRole('button', { name: /show all tiers/i }).click();
  23 |     await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toBeVisible();
  24 |   });
  25 | 
  26 |   test('advanced filters: toggle, category filter, and reset', async ({ page }) => {
  27 |     const refine = page.getByRole('button', { name: /refine/i });
  28 |     await expect(refine).toHaveAttribute('aria-expanded', 'false');
  29 |     await refine.click();
  30 |     await expect(refine).toHaveAttribute('aria-expanded', 'true');
  31 | 
  32 |     // Category: HealthTech only — must not show a FinTech card
  33 |     await page.getByRole('button', { name: /^HealthTech$/ }).click();
  34 |     await expect(page.getByRole('heading', { name: /predictive disease risk model/i })).toBeVisible();
  35 |     await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toHaveCount(0);
  36 | 
  37 |     // Reset returns FinTech entries
  38 |     await page.getByRole('button', { name: /reset all filters/i }).click();
  39 |     await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
  40 |   });
  41 | 
  42 |   test('search + tier compose (both must match)', async ({ page }) => {
  43 |     await page.getByRole('searchbox', { name: /search ventures/i }).fill('compliance');
  44 |     await page.getByRole('button', { name: /filter tier 1/i }).click();
  45 |     // T1 + "compliance" in name/why → bias-detection-engine (rationale mentions regulatory/compliance)
  46 |     await expect(page.getByRole('heading', { name: /bias detection engine/i })).toBeVisible();
  47 |     // T2 compliance entry should NOT appear
  48 |     await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toHaveCount(0);
  49 |   });
  50 | });
  51 | 
```
```

### FILE: playwright-report/data/77e39b5678946931794ab44cf1d534363c932bbc.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: detail-modal.spec.ts >> venture detail modal >> clicking a card opens the modal with venture details
- Location: tests\e2e\detail-modal.spec.ts:8:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('heading', { name: /fraud detection engine/i })

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('venture detail modal', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('clicking a card opens the modal with venture details', async ({ page }) => {
> 9  |     await page.getByRole('heading', { name: /fraud detection engine/i }).click();
     |                                                                          ^ Error: locator.click: Test timeout of 30000ms exceeded.
  10 |     const dialog = page.getByRole('dialog', { name: /venture detail: fraud detection engine/i });
  11 |     await expect(dialog).toBeVisible();
  12 |     await expect(dialog.getByText('STRATEGIC_SUMMARY')).toBeVisible();
  13 |     await expect(dialog.getByText('ROI_CAPACITY_INDEX')).toBeVisible();
  14 |     await expect(dialog.getByText('SOCIAL_LIQUIDITY')).toBeVisible();
  15 |   });
  16 | 
  17 |   test('close (X) button dismisses the modal', async ({ page }) => {
  18 |     await page.getByRole('heading', { name: /fraud detection engine/i }).click();
  19 |     const dialog = page.getByRole('dialog', { name: /venture detail/i });
  20 |     await expect(dialog).toBeVisible();
  21 |     await dialog.getByRole('button', { name: /close venture detail/i }).click();
  22 |     await expect(dialog).toHaveCount(0);
  23 |   });
  24 | 
  25 |   test('CLOSE_NODE button dismisses the modal', async ({ page }) => {
  26 |     await page.getByRole('heading', { name: /fraud detection engine/i }).click();
  27 |     const dialog = page.getByRole('dialog', { name: /venture detail/i });
  28 |     await dialog.getByRole('button', { name: /close_node/i }).click();
  29 |     await expect(page.getByRole('dialog', { name: /venture detail/i })).toHaveCount(0);
  30 |   });
  31 | });
  32 | 
```
```

### FILE: playwright-report/data/857dc5dc8319d3e6d2c8869546350bb33992371a.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filters.spec.ts >> search and filter journey >> advanced filters: toggle, category filter, and reset
- Location: tests\e2e\filters.spec.ts:26:3

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator: getByRole('button', { name: /refine/i })
Expected: "false"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for getByRole('button', { name: /refine/i })

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('search and filter journey', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('search narrows the registry', async ({ page }) => {
  9  |     const search = page.getByRole('searchbox', { name: /search ventures/i });
  10 |     await search.fill('fraud');
  11 |     await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
  12 |     // a non-matching name should disappear
  13 |     await expect(page.getByRole('heading', { name: /crop yield predictor/i })).toHaveCount(0);
  14 |   });
  15 | 
  16 |   test('tier filter restricts to selected tier', async ({ page }) => {
  17 |     await page.getByRole('button', { name: /filter tier 1/i }).click();
  18 |     await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
  19 |     // a known T2 entry should be hidden
  20 |     await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toHaveCount(0);
  21 | 
  22 |     await page.getByRole('button', { name: /show all tiers/i }).click();
  23 |     await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toBeVisible();
  24 |   });
  25 | 
  26 |   test('advanced filters: toggle, category filter, and reset', async ({ page }) => {
  27 |     const refine = page.getByRole('button', { name: /refine/i });
> 28 |     await expect(refine).toHaveAttribute('aria-expanded', 'false');
     |                          ^ Error: expect(locator).toHaveAttribute(expected) failed
  29 |     await refine.click();
  30 |     await expect(refine).toHaveAttribute('aria-expanded', 'true');
  31 | 
  32 |     // Category: HealthTech only — must not show a FinTech card
  33 |     await page.getByRole('button', { name: /^HealthTech$/ }).click();
  34 |     await expect(page.getByRole('heading', { name: /predictive disease risk model/i })).toBeVisible();
  35 |     await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toHaveCount(0);
  36 | 
  37 |     // Reset returns FinTech entries
  38 |     await page.getByRole('button', { name: /reset all filters/i }).click();
  39 |     await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
  40 |   });
  41 | 
  42 |   test('search + tier compose (both must match)', async ({ page }) => {
  43 |     await page.getByRole('searchbox', { name: /search ventures/i }).fill('compliance');
  44 |     await page.getByRole('button', { name: /filter tier 1/i }).click();
  45 |     // T1 + "compliance" in name/why → bias-detection-engine (rationale mentions regulatory/compliance)
  46 |     await expect(page.getByRole('heading', { name: /bias detection engine/i })).toBeVisible();
  47 |     // T2 compliance entry should NOT appear
  48 |     await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toHaveCount(0);
  49 |   });
  50 | });
  51 | 
```
```

### FILE: playwright-report/data/9162e311fcb0a9ae781234625e24eb67d588fb6f.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: compare.spec.ts >> compare flow >> EXECUTE_COMPARE opens the comparison stream and RETURN closes it
- Location: tests\e2e\compare.spec.ts:29:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('div').filter({ has: getByRole('heading', { name: /fraud detection engine/i }) }).first().getByRole('button', { name: /compare/i })

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const card = (page: import('@playwright/test').Page, name: RegExp) =>
  4  |   page.locator('div').filter({ has: page.getByRole('heading', { name }) }).first();
  5  | 
  6  | test.describe('compare flow', () => {
  7  |   test.beforeEach(async ({ page }) => {
  8  |     await page.goto('/');
  9  |   });
  10 | 
  11 |   test('selecting cards reveals the toolbar with count', async ({ page }) => {
  12 |     // The COMPARE button on each card stops propagation, so it does not open the modal.
  13 |     await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
  14 |     const toolbar = page.getByRole('toolbar', { name: /compare selected ventures/i });
  15 |     await expect(toolbar).toBeVisible();
  16 |     await expect(toolbar.getByText('1 ASSETS_MAPPED')).toBeVisible();
  17 | 
  18 |     await card(page, /predictive disease risk model/i).getByRole('button', { name: /compare/i }).click();
  19 |     await expect(toolbar.getByText('2 ASSETS_MAPPED')).toBeVisible();
  20 |   });
  21 | 
  22 |   test('CLEAR_STACK empties the toolbar', async ({ page }) => {
  23 |     await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
  24 |     const toolbar = page.getByRole('toolbar', { name: /compare selected ventures/i });
  25 |     await toolbar.getByRole('button', { name: /clear comparison selection/i }).click();
  26 |     await expect(toolbar).toHaveCount(0);
  27 |   });
  28 | 
  29 |   test('EXECUTE_COMPARE opens the comparison stream and RETURN closes it', async ({ page }) => {
> 30 |     await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
     |                                                                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
  31 |     await card(page, /predictive disease risk model/i).getByRole('button', { name: /compare/i }).click();
  32 | 
  33 |     await page.getByRole('button', { name: /compare 2 selected ventures/i }).click();
  34 | 
  35 |     await expect(page.getByText('RELATIVE_VENTURE_MATRIX.0x4')).toBeVisible();
  36 |     await expect(page.getByRole('heading', { name: /comparison/i })).toBeVisible();
  37 | 
  38 |     await page.getByRole('button', { name: /return_to_command_dashboard/i }).click();
  39 |     await expect(page.getByText('RELATIVE_VENTURE_MATRIX.0x4')).toHaveCount(0);
  40 |   });
  41 | 
  42 |   test('cap at 4 selections — a 5th click is ignored', async ({ page }) => {
  43 |     const targets = [
  44 |       /fraud detection engine/i,
  45 |       /predictive disease risk model/i,
  46 |       /academic integrity detector/i,
  47 |       /microcredit risk scorer/i,
  48 |       /ai exam generator/i,
  49 |     ];
  50 |     for (const t of targets) {
  51 |       await card(page, t).getByRole('button', { name: /compare|mapped/i }).click();
  52 |     }
  53 |     await expect(page.getByRole('toolbar').getByText(/4 ASSETS_MAPPED/)).toBeVisible();
  54 |   });
  55 | });
  56 | 
```
```

### FILE: playwright-report/data/a7996d26eaf5b750c11f3f55661ef5d30d304234.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filters.spec.ts >> search and filter journey >> search + tier compose (both must match)
- Location: tests\e2e\filters.spec.ts:42:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('searchbox', { name: /search ventures/i })

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('search and filter journey', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('search narrows the registry', async ({ page }) => {
  9  |     const search = page.getByRole('searchbox', { name: /search ventures/i });
  10 |     await search.fill('fraud');
  11 |     await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
  12 |     // a non-matching name should disappear
  13 |     await expect(page.getByRole('heading', { name: /crop yield predictor/i })).toHaveCount(0);
  14 |   });
  15 | 
  16 |   test('tier filter restricts to selected tier', async ({ page }) => {
  17 |     await page.getByRole('button', { name: /filter tier 1/i }).click();
  18 |     await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
  19 |     // a known T2 entry should be hidden
  20 |     await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toHaveCount(0);
  21 | 
  22 |     await page.getByRole('button', { name: /show all tiers/i }).click();
  23 |     await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toBeVisible();
  24 |   });
  25 | 
  26 |   test('advanced filters: toggle, category filter, and reset', async ({ page }) => {
  27 |     const refine = page.getByRole('button', { name: /refine/i });
  28 |     await expect(refine).toHaveAttribute('aria-expanded', 'false');
  29 |     await refine.click();
  30 |     await expect(refine).toHaveAttribute('aria-expanded', 'true');
  31 | 
  32 |     // Category: HealthTech only — must not show a FinTech card
  33 |     await page.getByRole('button', { name: /^HealthTech$/ }).click();
  34 |     await expect(page.getByRole('heading', { name: /predictive disease risk model/i })).toBeVisible();
  35 |     await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toHaveCount(0);
  36 | 
  37 |     // Reset returns FinTech entries
  38 |     await page.getByRole('button', { name: /reset all filters/i }).click();
  39 |     await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
  40 |   });
  41 | 
  42 |   test('search + tier compose (both must match)', async ({ page }) => {
> 43 |     await page.getByRole('searchbox', { name: /search ventures/i }).fill('compliance');
     |                                                                     ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  44 |     await page.getByRole('button', { name: /filter tier 1/i }).click();
  45 |     // T1 + "compliance" in name/why → bias-detection-engine (rationale mentions regulatory/compliance)
  46 |     await expect(page.getByRole('heading', { name: /bias detection engine/i })).toBeVisible();
  47 |     // T2 compliance entry should NOT appear
  48 |     await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toHaveCount(0);
  49 |   });
  50 | });
  51 | 
```
```

### FILE: playwright-report/data/af136ad82e4ba4a3f844e1e25835876eb279ab1b.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: detail-modal.spec.ts >> venture detail modal >> close (X) button dismisses the modal
- Location: tests\e2e\detail-modal.spec.ts:17:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('heading', { name: /fraud detection engine/i })

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('venture detail modal', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('clicking a card opens the modal with venture details', async ({ page }) => {
  9  |     await page.getByRole('heading', { name: /fraud detection engine/i }).click();
  10 |     const dialog = page.getByRole('dialog', { name: /venture detail: fraud detection engine/i });
  11 |     await expect(dialog).toBeVisible();
  12 |     await expect(dialog.getByText('STRATEGIC_SUMMARY')).toBeVisible();
  13 |     await expect(dialog.getByText('ROI_CAPACITY_INDEX')).toBeVisible();
  14 |     await expect(dialog.getByText('SOCIAL_LIQUIDITY')).toBeVisible();
  15 |   });
  16 | 
  17 |   test('close (X) button dismisses the modal', async ({ page }) => {
> 18 |     await page.getByRole('heading', { name: /fraud detection engine/i }).click();
     |                                                                          ^ Error: locator.click: Test timeout of 30000ms exceeded.
  19 |     const dialog = page.getByRole('dialog', { name: /venture detail/i });
  20 |     await expect(dialog).toBeVisible();
  21 |     await dialog.getByRole('button', { name: /close venture detail/i }).click();
  22 |     await expect(dialog).toHaveCount(0);
  23 |   });
  24 | 
  25 |   test('CLOSE_NODE button dismisses the modal', async ({ page }) => {
  26 |     await page.getByRole('heading', { name: /fraud detection engine/i }).click();
  27 |     const dialog = page.getByRole('dialog', { name: /venture detail/i });
  28 |     await dialog.getByRole('button', { name: /close_node/i }).click();
  29 |     await expect(page.getByRole('dialog', { name: /venture detail/i })).toHaveCount(0);
  30 |   });
  31 | });
  32 | 
```
```

### FILE: playwright-report/data/c382973666e968697b2a504d1c58670b7ab17c70.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: compare.spec.ts >> compare flow >> cap at 4 selections — a 5th click is ignored
- Location: tests\e2e\compare.spec.ts:42:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('div').filter({ has: getByRole('heading', { name: /fraud detection engine/i }) }).first().getByRole('button', { name: /compare|mapped/i })

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const card = (page: import('@playwright/test').Page, name: RegExp) =>
  4  |   page.locator('div').filter({ has: page.getByRole('heading', { name }) }).first();
  5  | 
  6  | test.describe('compare flow', () => {
  7  |   test.beforeEach(async ({ page }) => {
  8  |     await page.goto('/');
  9  |   });
  10 | 
  11 |   test('selecting cards reveals the toolbar with count', async ({ page }) => {
  12 |     // The COMPARE button on each card stops propagation, so it does not open the modal.
  13 |     await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
  14 |     const toolbar = page.getByRole('toolbar', { name: /compare selected ventures/i });
  15 |     await expect(toolbar).toBeVisible();
  16 |     await expect(toolbar.getByText('1 ASSETS_MAPPED')).toBeVisible();
  17 | 
  18 |     await card(page, /predictive disease risk model/i).getByRole('button', { name: /compare/i }).click();
  19 |     await expect(toolbar.getByText('2 ASSETS_MAPPED')).toBeVisible();
  20 |   });
  21 | 
  22 |   test('CLEAR_STACK empties the toolbar', async ({ page }) => {
  23 |     await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
  24 |     const toolbar = page.getByRole('toolbar', { name: /compare selected ventures/i });
  25 |     await toolbar.getByRole('button', { name: /clear comparison selection/i }).click();
  26 |     await expect(toolbar).toHaveCount(0);
  27 |   });
  28 | 
  29 |   test('EXECUTE_COMPARE opens the comparison stream and RETURN closes it', async ({ page }) => {
  30 |     await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
  31 |     await card(page, /predictive disease risk model/i).getByRole('button', { name: /compare/i }).click();
  32 | 
  33 |     await page.getByRole('button', { name: /compare 2 selected ventures/i }).click();
  34 | 
  35 |     await expect(page.getByText('RELATIVE_VENTURE_MATRIX.0x4')).toBeVisible();
  36 |     await expect(page.getByRole('heading', { name: /comparison/i })).toBeVisible();
  37 | 
  38 |     await page.getByRole('button', { name: /return_to_command_dashboard/i }).click();
  39 |     await expect(page.getByText('RELATIVE_VENTURE_MATRIX.0x4')).toHaveCount(0);
  40 |   });
  41 | 
  42 |   test('cap at 4 selections — a 5th click is ignored', async ({ page }) => {
  43 |     const targets = [
  44 |       /fraud detection engine/i,
  45 |       /predictive disease risk model/i,
  46 |       /academic integrity detector/i,
  47 |       /microcredit risk scorer/i,
  48 |       /ai exam generator/i,
  49 |     ];
  50 |     for (const t of targets) {
> 51 |       await card(page, t).getByRole('button', { name: /compare|mapped/i }).click();
     |                                                                            ^ Error: locator.click: Test timeout of 30000ms exceeded.
  52 |     }
  53 |     await expect(page.getByRole('toolbar').getByText(/4 ASSETS_MAPPED/)).toBeVisible();
  54 |   });
  55 | });
  56 | 
```
```

### FILE: playwright-report/data/ea5344d3523e2b11d06b6eb54065cf49829a502d.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: detail-modal.spec.ts >> venture detail modal >> CLOSE_NODE button dismisses the modal
- Location: tests\e2e\detail-modal.spec.ts:25:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('heading', { name: /fraud detection engine/i })

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('venture detail modal', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('clicking a card opens the modal with venture details', async ({ page }) => {
  9  |     await page.getByRole('heading', { name: /fraud detection engine/i }).click();
  10 |     const dialog = page.getByRole('dialog', { name: /venture detail: fraud detection engine/i });
  11 |     await expect(dialog).toBeVisible();
  12 |     await expect(dialog.getByText('STRATEGIC_SUMMARY')).toBeVisible();
  13 |     await expect(dialog.getByText('ROI_CAPACITY_INDEX')).toBeVisible();
  14 |     await expect(dialog.getByText('SOCIAL_LIQUIDITY')).toBeVisible();
  15 |   });
  16 | 
  17 |   test('close (X) button dismisses the modal', async ({ page }) => {
  18 |     await page.getByRole('heading', { name: /fraud detection engine/i }).click();
  19 |     const dialog = page.getByRole('dialog', { name: /venture detail/i });
  20 |     await expect(dialog).toBeVisible();
  21 |     await dialog.getByRole('button', { name: /close venture detail/i }).click();
  22 |     await expect(dialog).toHaveCount(0);
  23 |   });
  24 | 
  25 |   test('CLOSE_NODE button dismisses the modal', async ({ page }) => {
> 26 |     await page.getByRole('heading', { name: /fraud detection engine/i }).click();
     |                                                                          ^ Error: locator.click: Test timeout of 30000ms exceeded.
  27 |     const dialog = page.getByRole('dialog', { name: /venture detail/i });
  28 |     await dialog.getByRole('button', { name: /close_node/i }).click();
  29 |     await expect(page.getByRole('dialog', { name: /venture detail/i })).toHaveCount(0);
  30 |   });
  31 | });
  32 | 
```
```

### FILE: playwright-report/data/eb35fb8de1dae5d6fac485d5a39b2b2fa2407dd2.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> admin journey >> invalid password shows alert and writes a fail entry to audit log
- Location: tests\e2e\admin.spec.ts:34:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel(/password/i)

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('admin journey', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |     // ensure clean session/local storage for each scenario
  7   |     await page.evaluate(() => {
  8   |       sessionStorage.clear();
  9   |       localStorage.removeItem('impact-ventures-audit-logs');
  10  |     });
  11  |   });
  12  | 
  13  |   test('footer Admin link navigates to login modal', async ({ page }) => {
  14  |     await page.getByRole('button', { name: /open admin dashboard/i }).click();
  15  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
  16  |   });
  17  | 
  18  |   test('deep link #/admin opens the login modal', async ({ page }) => {
  19  |     await page.goto('/#/admin');
  20  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
  21  |   });
  22  | 
  23  |   test('show/hide password toggle flips input type', async ({ page }) => {
  24  |     await page.goto('/#/admin');
  25  |     const pwd = page.getByLabel(/password/i);
  26  |     await pwd.fill('something');
  27  |     await expect(pwd).toHaveAttribute('type', 'password');
  28  |     await page.getByRole('button', { name: /show password/i }).click();
  29  |     await expect(pwd).toHaveAttribute('type', 'text');
  30  |     await page.getByRole('button', { name: /hide password/i }).click();
  31  |     await expect(pwd).toHaveAttribute('type', 'password');
  32  |   });
  33  | 
  34  |   test('invalid password shows alert and writes a fail entry to audit log', async ({ page }) => {
  35  |     await page.goto('/#/admin');
> 36  |     await page.getByLabel(/password/i).fill('wrong');
      |                                        ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  37  |     await page.getByRole('button', { name: /authenticate/i }).click();
  38  |     await expect(page.getByRole('alert')).toContainText(/invalid password/i);
  39  | 
  40  |     const logs = await page.evaluate(() =>
  41  |       JSON.parse(localStorage.getItem('impact-ventures-audit-logs') || '[]'),
  42  |     );
  43  |     expect(logs[0].action).toBe('ADMIN_LOGIN_FAIL');
  44  |   });
  45  | 
  46  |   test('cancel returns to home', async ({ page }) => {
  47  |     await page.goto('/#/admin');
  48  |     await page.getByRole('button', { name: /^cancel$/i }).click();
  49  |     await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
  50  |     await expect(page).toHaveURL(/\/$|#$/);
  51  |   });
  52  | 
  53  |   test('valid password opens dashboard, both tabs work, logout clears session', async ({ page }) => {
  54  |     await page.goto('/#/admin');
  55  |     await page.getByLabel(/password/i).fill('admin123');
  56  |     await page.getByRole('button', { name: /authenticate/i }).click();
  57  | 
  58  |     const dashboard = page.getByRole('main', { name: /admin dashboard/i });
  59  |     await expect(dashboard).toBeVisible();
  60  | 
  61  |     // Audit Log tab is the default
  62  |     const logsTab = page.getByRole('tab', { name: /audit log/i });
  63  |     const diagTab = page.getByRole('tab', { name: /diagnostics/i });
  64  |     await expect(logsTab).toHaveAttribute('aria-selected', 'true');
  65  |     await expect(page.getByRole('region', { name: /audit log/i })).toBeVisible();
  66  |     await expect(page.getByText('ADMIN_LOGIN_SUCCESS')).toBeVisible();
  67  | 
  68  |     // Switch to Diagnostics
  69  |     await diagTab.click();
  70  |     await expect(diagTab).toHaveAttribute('aria-selected', 'true');
  71  |     await expect(page.getByRole('region', { name: /system diagnostics/i })).toBeVisible();
  72  |     await expect(page.getByText(/portfolio count/i)).toBeVisible();
  73  | 
  74  |     // Run storage test → PASS
  75  |     await page.getByRole('button', { name: /^run test$/i }).click();
  76  |     await expect(page.getByRole('status').filter({ hasText: 'PASS' })).toBeVisible();
  77  | 
  78  |     // Diagnostic run is logged
  79  |     await logsTab.click();
  80  |     await expect(page.getByText('DIAGNOSTIC_RUN')).toBeVisible();
  81  | 
  82  |     // Logout clears session and unmounts dashboard
  83  |     await page.getByRole('button', { name: /logout from admin/i }).click();
  84  |     await expect(dashboard).toHaveCount(0);
  85  | 
  86  |     const session = await page.evaluate(() => sessionStorage.getItem('impact-ventures-admin'));
  87  |     expect(session).toBeNull();
  88  |   });
  89  | 
  90  |   test('admin session persists: re-entering #/admin skips login', async ({ page }) => {
  91  |     await page.goto('/#/admin');
  92  |     await page.getByLabel(/password/i).fill('admin123');
  93  |     await page.getByRole('button', { name: /authenticate/i }).click();
  94  |     await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();
  95  | 
  96  |     // Close dashboard via logout-free path: navigate away then back
  97  |     await page.evaluate(() => { window.location.hash = ''; });
  98  |     await page.evaluate(() => { window.location.hash = '#/admin'; });
  99  | 
  100 |     // Session is still set, so dashboard reopens without the login modal
  101 |     await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();
  102 |     await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
  103 |   });
  104 | });
  105 | 
```
```

### FILE: playwright-report/data/f436702f88b76dae624a3709dcbf2470f349b863.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filters.spec.ts >> search and filter journey >> tier filter restricts to selected tier
- Location: tests\e2e\filters.spec.ts:16:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /filter tier 1/i })

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('search and filter journey', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('search narrows the registry', async ({ page }) => {
  9  |     const search = page.getByRole('searchbox', { name: /search ventures/i });
  10 |     await search.fill('fraud');
  11 |     await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
  12 |     // a non-matching name should disappear
  13 |     await expect(page.getByRole('heading', { name: /crop yield predictor/i })).toHaveCount(0);
  14 |   });
  15 | 
  16 |   test('tier filter restricts to selected tier', async ({ page }) => {
> 17 |     await page.getByRole('button', { name: /filter tier 1/i }).click();
     |                                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
  18 |     await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
  19 |     // a known T2 entry should be hidden
  20 |     await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toHaveCount(0);
  21 | 
  22 |     await page.getByRole('button', { name: /show all tiers/i }).click();
  23 |     await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toBeVisible();
  24 |   });
  25 | 
  26 |   test('advanced filters: toggle, category filter, and reset', async ({ page }) => {
  27 |     const refine = page.getByRole('button', { name: /refine/i });
  28 |     await expect(refine).toHaveAttribute('aria-expanded', 'false');
  29 |     await refine.click();
  30 |     await expect(refine).toHaveAttribute('aria-expanded', 'true');
  31 | 
  32 |     // Category: HealthTech only — must not show a FinTech card
  33 |     await page.getByRole('button', { name: /^HealthTech$/ }).click();
  34 |     await expect(page.getByRole('heading', { name: /predictive disease risk model/i })).toBeVisible();
  35 |     await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toHaveCount(0);
  36 | 
  37 |     // Reset returns FinTech entries
  38 |     await page.getByRole('button', { name: /reset all filters/i }).click();
  39 |     await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
  40 |   });
  41 | 
  42 |   test('search + tier compose (both must match)', async ({ page }) => {
  43 |     await page.getByRole('searchbox', { name: /search ventures/i }).fill('compliance');
  44 |     await page.getByRole('button', { name: /filter tier 1/i }).click();
  45 |     // T1 + "compliance" in name/why → bias-detection-engine (rationale mentions regulatory/compliance)
  46 |     await expect(page.getByRole('heading', { name: /bias detection engine/i })).toBeVisible();
  47 |     // T2 compliance entry should NOT appear
  48 |     await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toHaveCount(0);
  49 |   });
  50 | });
  51 | 
```
```

### FILE: playwright-report/data/fec2e75b1ce0908435a292daa601238f293a6866.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: compare.spec.ts >> compare flow >> selecting cards reveals the toolbar with count
- Location: tests\e2e\compare.spec.ts:11:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('div').filter({ has: getByRole('heading', { name: /fraud detection engine/i }) }).first().getByRole('button', { name: /compare/i })

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const card = (page: import('@playwright/test').Page, name: RegExp) =>
  4  |   page.locator('div').filter({ has: page.getByRole('heading', { name }) }).first();
  5  | 
  6  | test.describe('compare flow', () => {
  7  |   test.beforeEach(async ({ page }) => {
  8  |     await page.goto('/');
  9  |   });
  10 | 
  11 |   test('selecting cards reveals the toolbar with count', async ({ page }) => {
  12 |     // The COMPARE button on each card stops propagation, so it does not open the modal.
> 13 |     await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
     |                                                                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
  14 |     const toolbar = page.getByRole('toolbar', { name: /compare selected ventures/i });
  15 |     await expect(toolbar).toBeVisible();
  16 |     await expect(toolbar.getByText('1 ASSETS_MAPPED')).toBeVisible();
  17 | 
  18 |     await card(page, /predictive disease risk model/i).getByRole('button', { name: /compare/i }).click();
  19 |     await expect(toolbar.getByText('2 ASSETS_MAPPED')).toBeVisible();
  20 |   });
  21 | 
  22 |   test('CLEAR_STACK empties the toolbar', async ({ page }) => {
  23 |     await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
  24 |     const toolbar = page.getByRole('toolbar', { name: /compare selected ventures/i });
  25 |     await toolbar.getByRole('button', { name: /clear comparison selection/i }).click();
  26 |     await expect(toolbar).toHaveCount(0);
  27 |   });
  28 | 
  29 |   test('EXECUTE_COMPARE opens the comparison stream and RETURN closes it', async ({ page }) => {
  30 |     await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
  31 |     await card(page, /predictive disease risk model/i).getByRole('button', { name: /compare/i }).click();
  32 | 
  33 |     await page.getByRole('button', { name: /compare 2 selected ventures/i }).click();
  34 | 
  35 |     await expect(page.getByText('RELATIVE_VENTURE_MATRIX.0x4')).toBeVisible();
  36 |     await expect(page.getByRole('heading', { name: /comparison/i })).toBeVisible();
  37 | 
  38 |     await page.getByRole('button', { name: /return_to_command_dashboard/i }).click();
  39 |     await expect(page.getByText('RELATIVE_VENTURE_MATRIX.0x4')).toHaveCount(0);
  40 |   });
  41 | 
  42 |   test('cap at 4 selections — a 5th click is ignored', async ({ page }) => {
  43 |     const targets = [
  44 |       /fraud detection engine/i,
  45 |       /predictive disease risk model/i,
  46 |       /academic integrity detector/i,
  47 |       /microcredit risk scorer/i,
  48 |       /ai exam generator/i,
  49 |     ];
  50 |     for (const t of targets) {
  51 |       await card(page, t).getByRole('button', { name: /compare|mapped/i }).click();
  52 |     }
  53 |     await expect(page.getByRole('toolbar').getByText(/4 ASSETS_MAPPED/)).toBeVisible();
  54 |   });
  55 | });
  56 | 
```
```

### FILE: playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `pnpm exec vite preview --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
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

View your app in AI Studio: https://ai.studio/apps/7cbdfb22-372c-4f47-8e61-21f9ff3074b9

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: server.js
```javascript
import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      const url = req.originalUrl;
      try {
        const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const transformed = await vite.transformIndexHtml(url, html);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(transformed);
      } catch (err) {
        next(err);
      }
    });
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(distPath, 'index.html'));
      } else {
        res.status(404).send('Not found');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

```

### FILE: src/App.tsx
```typescript
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import {
  BarChart3,
  Target,
  ShieldCheck,
  Lightbulb,
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  Info,
  Maximize2,
  FileText,
  GraduationCap,
  Stethoscope,
  Sprout,
  Scale,
  Cpu,
  Truck,
  Globe,
  Wallet,
  Lock,
  LogOut,
  Activity,
  Settings,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { APP_DATA, STRATEGIC_OBSERVATIONS, type AppRanking } from './data';
import { cn } from './lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ── Admin types ──────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]
const ADMIN_SESSION_KEY = 'impact-ventures-admin';
const AUDIT_LOG_KEY = 'impact-ventures-audit-logs';

interface AuditEntry { id: string; timestamp: string; action: string; details?: string; }

function getAuditLogs(): AuditEntry[] {
  try { return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]'); } catch { return []; }
}
function appendAuditLog(action: string, details?: string) {
  const logs = getAuditLogs();
  logs.unshift({ id: Date.now().toString(), timestamp: new Date().toISOString(), action, details });
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs.slice(0, 200)));
}

// ── AdminLoginModal ──────────────────────────────────────────────────────────
const AdminLoginModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      appendAuditLog('ADMIN_LOGIN_SUCCESS');
      onSuccess();
    } else {
      appendAuditLog('ADMIN_LOGIN_FAIL', 'Invalid password attempt');
      setError('Invalid password.');
      setPwd('');
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="admin-login-title"
      className="fixed inset-0 z-[100] bg-brand-depth/90 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-brand-surface border border-white/10 rounded-sm p-10 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <Lock size={18} className="text-brand-cyan" aria-hidden="true" />
          <h2 id="admin-login-title" className="text-sm font-mono font-bold uppercase tracking-[0.3em] text-white">Admin Access</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="admin-pwd" className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-3">Password</label>
            <div className="relative">
              <input id="admin-pwd" type={showPwd ? 'text' : 'password'} value={pwd}
                onChange={e => { setPwd(e.target.value); setError(''); }}
                autoFocus required
                aria-describedby={error ? 'admin-pwd-error' : undefined}
                className="w-full bg-brand-depth border border-slate-800 focus:border-brand-cyan rounded-sm px-4 py-3 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-brand-cyan/30 pr-12" />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <p id="admin-pwd-error" role="alert" className="mt-2 text-[11px] text-red-400 font-mono flex items-center gap-2"><AlertTriangle size={12} />{error}</p>}
          </div>
          <div className="flex gap-4 pt-2">
            <button type="submit"
              className="flex-1 bg-brand-cyan text-brand-depth font-bold py-3 rounded-sm text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-all">
              Authenticate
            </button>
            <button type="button" onClick={onClose}
              className="px-6 border border-white/10 text-slate-400 font-bold py-3 rounded-sm text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ── AdminDashboard ───────────────────────────────────────────────────────────
const AdminDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'logs' | 'diagnostics'>('logs');
  const [storageTest, setStorageTest] = useState<'idle' | 'pass' | 'fail'>('idle');

  useEffect(() => {
    if (activeTab === 'logs') setLogs(getAuditLogs());
  }, [activeTab]);

  const handleLogout = () => {
    appendAuditLog('ADMIN_LOGOUT');
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    onClose();
  };

  const runStorageTest = () => {
    try {
      localStorage.setItem('__diag__', '1');
      localStorage.removeItem('__diag__');
      setStorageTest('pass');
      appendAuditLog('DIAGNOSTIC_RUN', 'localStorage: PASS');
    } catch {
      setStorageTest('fail');
      appendAuditLog('DIAGNOSTIC_RUN', 'localStorage: FAIL');
    }
  };

  return (
    <div role="main" aria-label="Admin Dashboard"
      className="fixed inset-0 z-[100] bg-brand-depth overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pt-4 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-brand-cyan" aria-hidden="true" />
            <h1 className="text-lg font-mono font-bold uppercase tracking-[0.3em] text-white">Admin Dashboard</h1>
          </div>
          <button onClick={handleLogout} aria-label="Logout from admin"
            className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-red-900/20 border border-red-800/40 text-red-400 text-[10px] font-bold uppercase tracking-widest hover:bg-red-900/40 transition-all">
            <LogOut size={14} aria-hidden="true" /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div role="tablist" aria-label="Admin sections" className="flex gap-1 bg-brand-surface/30 p-1 rounded-sm border border-white/5 w-fit">
          {(['logs', 'diagnostics'] as const).map(tab => (
            <button key={tab} role="tab" aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={cn('px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xs transition-all',
                activeTab === tab ? 'bg-brand-cyan text-brand-depth' : 'text-slate-500 hover:text-white')}>
              {tab === 'logs' ? 'Audit Log' : 'Diagnostics'}
            </button>
          ))}
        </div>

        {/* Audit Log Tab */}
        {activeTab === 'logs' && (
          <section aria-label="Audit log">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
              <Activity size={14} className="text-brand-cyan" aria-hidden="true" /> Activity Stream
            </h2>
            <div className="rounded-sm border border-white/5 overflow-hidden">
              <table className="w-full text-xs font-mono" aria-label="Admin activity log">
                <thead>
                  <tr className="bg-brand-surface/50 text-left">
                    <th scope="col" className="px-6 py-3 text-[9px] uppercase tracking-widest text-slate-600 font-bold">Timestamp</th>
                    <th scope="col" className="px-6 py-3 text-[9px] uppercase tracking-widest text-slate-600 font-bold">Action</th>
                    <th scope="col" className="px-6 py-3 text-[9px] uppercase tracking-widest text-slate-600 font-bold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-10 text-center text-slate-700">No log entries yet.</td></tr>
                  ) : logs.map(log => (
                    <tr key={log.id} className="hover:bg-brand-surface/30 transition-colors">
                      <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-3 text-brand-cyan">{log.action}</td>
                      <td className="px-6 py-3 text-slate-500">{log.details || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Diagnostics Tab */}
        {activeTab === 'diagnostics' && (
          <section aria-label="System diagnostics">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
              <Settings size={14} className="text-brand-cyan" aria-hidden="true" /> Runtime Diagnostics
            </h2>
            <div className="space-y-4">
              <div className="bg-brand-surface/30 border border-white/5 rounded-sm p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono font-bold text-white uppercase tracking-widest">LocalStorage Access</p>
                  <p className="text-[10px] text-slate-600 font-mono mt-1">Verifies browser storage read/write</p>
                </div>
                <div className="flex items-center gap-4">
                  {storageTest !== 'idle' && (
                    <span role="status" className={cn('text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-sm border',
                      storageTest === 'pass' ? 'text-brand-mint border-brand-mint/30 bg-brand-mint/5' : 'text-red-400 border-red-400/30 bg-red-400/5')}>
                      {storageTest === 'pass' ? 'PASS' : 'FAIL'}
                    </span>
                  )}
                  <button onClick={runStorageTest}
                    className="px-5 py-2 bg-brand-depth border border-slate-700 text-brand-cyan text-[10px] font-bold uppercase tracking-widest rounded-sm hover:border-brand-cyan transition-all">
                    Run Test
                  </button>
                </div>
              </div>
              <div className="bg-brand-surface/30 border border-white/5 rounded-sm p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono font-bold text-white uppercase tracking-widest">Portfolio Count</p>
                  <p className="text-[10px] text-slate-600 font-mono mt-1">Validates APP_DATA integrity</p>
                </div>
                <span role="status" className="text-[10px] font-mono font-bold text-brand-mint border border-brand-mint/30 bg-brand-mint/5 px-3 py-1 rounded-sm uppercase tracking-widest">
                  {APP_DATA.length} ASSETS
                </span>
              </div>
              <div className="bg-brand-surface/30 border border-white/5 rounded-sm p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono font-bold text-white uppercase tracking-widest">Gemini API Key</p>
                  <p className="text-[10px] text-slate-600 font-mono mt-1">Checks environment variable availability</p>
                </div>
                <span role="status" className={cn('text-[10px] font-mono font-bold px-3 py-1 rounded-sm border uppercase tracking-widest',
                  process.env.GEMINI_API_KEY ? 'text-brand-mint border-brand-mint/30 bg-brand-mint/5' : 'text-red-400 border-red-400/30 bg-red-400/5')}>
                  {process.env.GEMINI_API_KEY ? 'CONFIGURED' : 'MISSING'}
                </span>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const CategoryIcon = ({ category, size = 16, className = "" }: { category: AppRanking['category'], size?: number, className?: string }) => {
  const iconMap: Record<AppRanking['category'], React.ElementType> = {
    FinTech: Wallet,
    HealthTech: Stethoscope,
    EdTech: GraduationCap,
    AgriTech: Sprout,
    LegalTech: Scale,
    Compliance: ShieldCheck,
    Logistics: Truck,
    Infrastructure: Cpu,
    Media: Globe
  };
  const Icon = iconMap[category];
  return <Icon size={size} className={className} />;
};

const TierBadge = ({ tier }: { tier: number }) => {
  const colors = [
    "border-brand-cyan text-brand-cyan bg-brand-cyan/5",
    "border-brand-mint text-brand-mint bg-brand-mint/5",
    "border-brand-amber text-brand-amber bg-brand-amber/5",
    "border-slate-500 text-slate-400 bg-slate-500/5",
  ];
  return (
    <span className={cn(
      "px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.15em] border rounded-sm whitespace-nowrap",
      colors[tier - 1]
    )}>
      T{tier} ACTIVE
    </span>
  );
};

const MetricIndicator = ({ value, label, colorClass = "bg-brand-cyan" }: { value: number, label: string, colorClass?: string }) => (
  <div className="w-full space-y-1.5">
    <div className="flex justify-between items-baseline">
      <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider transition-colors group-hover:text-slate-300">{label}</span>
      <span className="text-xs font-mono font-bold text-white transition-all">0{value}.00</span>
    </div>
    <div className="segmented-bar" aria-label={`${label}: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i} 
          className={cn(
            "segmented-segment transition-all duration-700",
            i <= value ? colorClass : "bg-slate-800"
          )} 
        />
      ))}
    </div>
  </div>
);

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTier, setActiveTier] = useState<number | 'all'>('all');
  const [mRange, setMRange] = useState<[number, number]>([1, 5]);
  const [gRange, setGRange] = useState<[number, number]>([1, 5]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppRanking | null>(null);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [briefs, setBriefs] = useState<Record<number, { text: string; loading: boolean; error?: string }>>({});
  const [activeCategory, setActiveCategory] = useState<AppRanking['category'] | 'all'>('all');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Restore admin session and handle #/admin hash route
  useEffect(() => {
    const checkRoute = () => {
      if (window.location.hash === '#/admin') {
        if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') {
          setShowAdmin(true);
        } else {
          setShowAdminLogin(true);
        }
      }
    };
    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    return () => window.removeEventListener('hashchange', checkRoute);
  }, []);

  const handleAdminClose = useCallback(() => {
    setShowAdmin(false);
    window.location.hash = '';
  }, []);

  const compareApps = useMemo(() => {
    return APP_DATA.filter(app => compareIds.includes(app.rank));
  }, [compareIds]);

  const toggleCompare = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const handleGenerateBrief = async (app: AppRanking) => {
    if (briefs[app.rank]?.loading) return;

    setBriefs(prev => ({ 
      ...prev, 
      [app.rank]: { text: '', loading: true } 
    }));

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a concise, professional strategic brief for an AI venture. 
          Venture Name: ${app.name}
          Category: ${app.category}
          Description: ${app.description}
          Monetisation Score: ${app.m}/5
          Social Good Score: ${app.g}/5
          Tier: ${app.tier}
          Strategic Rationale: ${app.why}
          
          The brief should be exactly 4 bullet points focusing on:
          1. Commercial Scalability
          2. Societal Impact
          3. Key Risks
          4. Strategic Recommendation`,
      });

      const text = response.text || "Failed to generate brief.";
      setBriefs(prev => ({ 
        ...prev, 
        [app.rank]: { text, loading: false } 
      }));
    } catch (error) {
      console.error("AI Generation Error:", error);
      setBriefs(prev => ({ 
        ...prev, 
        [app.rank]: { text: '', loading: false, error: "AI Service Unavailable" } 
      }));
    }
  };

  const filteredApps = useMemo(() => {
    return APP_DATA.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           app.why.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = activeTier === 'all' || app.tier === activeTier;
      const matchesCategory = activeCategory === 'all' || app.category === activeCategory;
      const matchesM = app.m >= mRange[0] && app.m <= mRange[1];
      const matchesG = app.g >= gRange[0] && app.g <= gRange[1];
      return matchesSearch && matchesTier && matchesCategory && matchesM && matchesG;
    });
  }, [searchTerm, activeTier, activeCategory, mRange, gRange]);

  const stats = useMemo(() => ({
    total: APP_DATA.length,
    highImpact: APP_DATA.filter(a => a.g >= 4).length,
    highRev: APP_DATA.filter(a => a.m >= 4).length,
  }), []);

  return (
    <>
    {showAdmin && <AdminDashboard onClose={handleAdminClose} />}
    {showAdminLogin && (
      <AdminLoginModal
        onClose={() => { setShowAdminLogin(false); window.location.hash = ''; }}
        onSuccess={() => { setShowAdminLogin(false); setShowAdmin(true); }}
      />
    )}
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-cyan focus:text-brand-depth focus:font-bold focus:rounded-sm">
      Skip to main content
    </a>
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-12 relative overflow-hidden">
      <div className="noise-overlay" aria-hidden="true" />
      {/* Header Section */}
      <header role="banner" className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5 relative">
        <div className="absolute bottom-0 left-0 w-32 h-px bg-brand-cyan" />
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-cyan">
            <div className="w-1.5 h-1.5 bg-brand-cyan animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em]">IMPACT_ANALYSIS_NODE.2026</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.8]">
            <span className="text-white">IMPACT</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-400/20 to-slate-800/10 border-slate-700/50" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.05)' }}>
              VENTURES
            </span>
          </h1>
          <p className="text-slate-500 max-w-lg text-xs font-mono uppercase tracking-widest leading-loose">
            Multivariate risk/reward engine balancing commercial liquidity against sovereign societal advancement vectors.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-brand-surface/30 px-6 py-4 border border-white/5 rounded-sm space-y-1 min-w-[160px]">
            <span className="block text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">PORTFOLIO.SIZE</span>
            <span className="text-3xl font-display font-bold text-white uppercase tracking-tighter">{stats.total} <span className="text-[10px] text-slate-700 font-mono tracking-normal">UNITS</span></span>
          </div>
          <div className="bg-brand-surface/30 px-6 py-4 border border-white/5 rounded-sm space-y-1 min-w-[160px]">
            <span className="block text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">IMPACT.CRITICAL</span>
            <span className="text-3xl font-display font-bold text-brand-mint uppercase tracking-tighter">{stats.highImpact} <span className="text-[10px] text-slate-700 font-mono tracking-normal">SIGMA</span></span>
          </div>
        </div>
      </header>

      {/* Matrix Section */}
      <section id="main-content" aria-label="Impact matrix and strategic intelligence" className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-brand-surface/20 border border-white/5 rounded-sm p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-12 h-1 bg-brand-cyan" />
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
              <Target size={14} className="text-brand-cyan" />
              MATRIX_INDEX_ALPHA <span className="text-slate-800 tracking-normal px-2 bg-white/5 rounded-xs">V2.94</span>
            </h2>
            <div className="flex gap-4 items-center text-[9px] font-mono font-bold text-slate-600">
              <div className="flex items-center gap-2 tracking-widest uppercase"><div className="w-1.5 h-1.5 bg-brand-cyan" /> Tier 1</div>
              <div className="flex items-center gap-2 tracking-widest uppercase"><div className="w-1.5 h-1.5 bg-brand-mint" /> Tier 2</div>
              <div className="flex items-center gap-2 tracking-widest uppercase"><div className="w-1.5 h-1.5 bg-brand-amber" /> Tier 3</div>
            </div>
          </div>
          <div className="h-[440px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                <XAxis 
                  type="number" 
                  dataKey="m" 
                  name="Monetisation" 
                  domain={[1, 5]} 
                  stroke="rgba(148, 163, 184, 0.2)" 
                  fontSize={10} 
                  fontFamily="DM Mono"
                  fontWeight={500}
                  tickFormatter={(val) => `M${val}`}
                />
                <YAxis 
                  type="number" 
                  dataKey="g" 
                  name="AI-for-Good" 
                  domain={[1, 5]} 
                  stroke="rgba(148, 163, 184, 0.2)" 
                  fontSize={10} 
                  fontFamily="DM Mono"
                  fontWeight={500}
                  tickFormatter={(val) => `G${val}`}
                />
                <ZAxis type="number" range={[100, 400]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as AppRanking;
                      return (
                        <div className="bg-slate-900 border border-slate-600 p-4 rounded-lg shadow-2xl backdrop-blur-md">
                          <p className="text-sm font-mono font-bold text-brand-cyan mb-2">{data.name}</p>
                          <div className="flex justify-between gap-6">
                            <span className="text-xs font-bold text-slate-200 uppercase">Tier {data.tier}</span>
                            <span className="text-xs font-bold text-white">M:{data.m} G:{data.g}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={APP_DATA} animationBegin={500} animationDuration={1500} animationEasing="ease-out">
                  {APP_DATA.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.tier === 1 ? '#22d3ee' : entry.tier === 2 ? '#10b981' : entry.tier === 3 ? '#f59e0b' : '#94a3b8'} 
                      onClick={() => setSelectedApp(entry)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Observations Sidebar */}
        <div className="space-y-8">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
            <Lightbulb size={14} className="text-brand-amber" />
            SYNTHETIC_INTELLIGENCE
          </h2>
          <div className="space-y-4">
            {STRATEGIC_OBSERVATIONS.map((obs, i) => (
              <motion.div 
                key={obs.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-brand-surface/30 border border-white/5 p-6 rounded-sm space-y-4 group hover:border-brand-cyan/20 transition-all cursor-default"
              >
                <div className="flex justify-between items-start">
                   <h3 className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em]">{obs.title}</h3>
                   <div className="text-slate-800 font-mono text-[9px] uppercase tracking-widest pb-1 border-b border-white/5">PRIORITY_HI</div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-mono italic opacity-80 group-hover:opacity-100 transition-opacity">“{obs.observation}”</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {obs.items.map(item => (
                    <span key={item} className="text-[9px] font-mono font-bold px-2 py-1 bg-brand-depth text-slate-500 border border-white/5 uppercase tracking-tighter">
                      {item.split('-').join('_')}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main List Section */}
      <section aria-label="Venture registry" className="space-y-12 pt-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-4xl font-display font-bold text-white tracking-tight">Project Registry</h2>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span className="text-brand-cyan">●</span> 30 LIVE ASSETS
              <span className="mx-2">/</span>
              BALANCED SCORECARD
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="group relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-cyan transition-colors" size={16} />
              <input
                type="search"
                placeholder="SEARCH VENTURE ARCHIVE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search ventures"
                className="bg-brand-surface/40 backdrop-blur-md border border-slate-800 rounded-sm pl-12 pr-6 py-3 text-xs font-mono tracking-wider focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/20 transition-all w-80 placeholder:text-slate-700"
              />
            </div>
            
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              aria-expanded={showAdvancedFilters}
              aria-controls="advanced-filters"
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-sm border text-xs font-bold uppercase tracking-[0.15em] transition-all relative overflow-hidden group/btn",
                showAdvancedFilters ? "bg-brand-surface border-brand-cyan text-brand-cyan" : "bg-brand-surface/20 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
              )}
            >
              <div className="absolute inset-0 bg-brand-cyan/5 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
              <Filter size={14} className="relative z-10" />
              <span className="relative z-10">REFINE</span>
            </button>

            <div role="group" aria-label="Filter by tier" className="flex bg-brand-depth border border-slate-800 rounded-sm p-1 gap-1 relative h-10 items-center">
              {['all', 1, 2, 3, 4].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTier(t as any)}
                  aria-pressed={activeTier === t}
                  aria-label={t === 'all' ? 'Show all tiers' : `Filter tier ${t}`}
                  className={cn(
                    "px-4 h-full rounded-xs text-[10px] font-bold uppercase tracking-widest transition-all relative z-10",
                    activeTier === t ? "text-brand-depth" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {t === 'all' ? 'ALL' : `T${t}`}
                </button>
              ))}
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-y-1 bg-brand-cyan rounded-xs pointer-events-none"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                style={{ 
                  left: activeTier === 'all' ? 4 : typeof activeTier === 'number' ? (activeTier * 44) + 4 : 4,
                  width: activeTier === 'all' ? 44 : 40
                }}
              />
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              id="advanced-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-brand-surface/40 backdrop-blur-xl border border-slate-800 rounded-sm p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {/* Monetisation Range */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono font-bold text-brand-cyan uppercase tracking-[0.2em]">ROI SCORE ARCHIVE</label>
                    <span className="text-xs font-mono text-white">M{mRange[0]}.00 — M{mRange[1]}.00</span>
                  </div>
                  <div className="px-2 space-y-4">
                    <div className="flex gap-4 items-center">
                      <span className="text-[10px] text-slate-500 font-mono w-12 tracking-tighter">LO_BOUND</span>
                      <input 
                        type="range" 
                        min="1" max="5" step="1" 
                        value={mRange[0]}
                        onChange={(e) => setMRange([Math.min(parseInt(e.target.value), mRange[1]), mRange[1]])}
                        className="flex-1 accent-brand-cyan h-1 bg-slate-800 rounded-none cursor-crosshair"
                      />
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="text-[10px] text-slate-500 font-mono w-12 tracking-tighter">HI_BOUND</span>
                      <input 
                        type="range" 
                        min="1" max="5" step="1" 
                        value={mRange[1]}
                        onChange={(e) => setMRange([mRange[0], Math.max(parseInt(e.target.value), mRange[0])])}
                        className="flex-1 accent-brand-cyan h-1 bg-slate-800 rounded-none cursor-crosshair"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Good Range */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono font-bold text-brand-mint uppercase tracking-[0.2em]">IMPACT CAPACITY</label>
                    <span className="text-xs font-mono text-white">G{gRange[0]}.00 — G{gRange[1]}.00</span>
                  </div>
                  <div className="px-2 space-y-4">
                    <div className="flex gap-4 items-center">
                      <span className="text-[10px] text-slate-500 font-mono w-12 tracking-tighter">LO_BOUND</span>
                      <input 
                        type="range" 
                        min="1" max="5" step="1" 
                        value={gRange[0]}
                        onChange={(e) => setGRange([Math.min(parseInt(e.target.value), gRange[1]), gRange[1]])}
                        className="flex-1 accent-brand-mint h-1 bg-slate-800 rounded-none cursor-crosshair"
                      />
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="text-[10px] text-slate-500 font-mono w-12 tracking-tighter">HI_BOUND</span>
                      <input 
                        type="range" 
                        min="1" max="5" step="1" 
                        value={gRange[1]}
                        onChange={(e) => setGRange([gRange[0], Math.max(parseInt(e.target.value), gRange[0])])}
                        className="flex-1 accent-brand-mint h-1 bg-slate-800 rounded-none cursor-crosshair"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-6">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em] block">Vertical Index</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'LegalTech', 'Compliance', 'Logistics', 'Infrastructure', 'Media'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat as any)}
                        className={cn(
                          "px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest transition-all border flex items-center gap-2",
                          activeCategory === cat 
                            ? "bg-brand-cyan border-brand-cyan text-brand-depth" 
                            : "bg-brand-surface border-slate-700 text-slate-500 hover:border-slate-500"
                        )}
                      >
                        {cat !== 'all' && <CategoryIcon category={cat as any} size={10} className={activeCategory === cat ? "text-brand-depth" : "text-brand-cyan"} />}
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-800/60 flex justify-between items-center">
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Advanced multi-variant filtering system activated</p>
                <button 
                  onClick={() => {
                    setMRange([1, 5]);
                    setGRange([1, 5]);
                    setActiveTier('all');
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                  className="text-[10px] font-bold text-brand-amber uppercase hover:text-white transition-colors tracking-[0.2em] flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-brand-amber rounded-full" />
                  Reset all filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,1.1fr,1fr] gap-6">
          <AnimatePresence mode="popLayout">
            {filteredApps.map((app, i) => (
              <motion.div
                layout
                key={app.rank}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                onClick={() => setSelectedApp(app)}
                className="group relative bg-brand-surface border border-brand-cyan/10 hover:border-brand-cyan/30 flex flex-col cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(0,255,209,0.06)] overflow-hidden"
                style={{
                  padding: '20px 20px 20px 28px'
                }}
              >
                {/* Left Accent Line */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-cyan/20 group-hover:bg-brand-cyan transition-colors" />
                
                {/* Rank Ghost Watermark */}
                <span className="absolute -right-4 -top-8 text-[96px] font-display font-black text-white/5 pointer-events-none tracking-tighter">
                  #{app.rank.toString().padStart(2, '0')}
                </span>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                       <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-brand-mint uppercase tracking-[0.2em] opacity-80">EYEBROW // {app.category}</span>
                       </div>
                       <h3 className="text-2xl font-display font-bold text-white tracking-widest leading-none group-hover:text-brand-cyan transition-colors">
                        {app.name.split('-').join(' ')}
                       </h3>
                    </div>
                  </div>
                  
                  <p className="text-[11px] font-mono text-slate-400 line-clamp-3 mb-8 leading-relaxed pr-8">
                    {app.why}
                  </p>

                  <div className="mt-auto space-y-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <MetricIndicator value={app.m} label="ROI" />
                      <MetricIndicator value={app.g} label="GOOD" colorClass="bg-brand-mint" />
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-800/60">
                      <button 
                        onClick={(e) => toggleCompare(app.rank, e)}
                        className={cn(
                          "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-sm transition-all overflow-hidden relative group/compare",
                          compareIds.includes(app.rank) 
                            ? "bg-brand-cyan text-brand-depth" 
                            : "bg-brand-depth text-brand-amber border border-brand-amber/20 hover:border-brand-amber/50"
                        )}
                      >
                         <motion.div 
                          className="flex items-center gap-2"
                          animate={{ x: compareIds.includes(app.rank) ? 0 : -4 }}
                         >
                           <ChevronRight size={12} className={cn("transition-transform", compareIds.includes(app.rank) ? "rotate-90" : "")} />
                           <span>{compareIds.includes(app.rank) ? 'MAPPED' : 'COMPARE'}</span>
                         </motion.div>
                      </button>

                      <div className="absolute bottom-0 right-0 translate-y-1/2 group-hover:translate-y-0 transition-transform duration-500">
                        <TierBadge tier={app.tier} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* App Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              aria-hidden="true"
              className="fixed inset-0 bg-brand-depth/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Venture detail: ${selectedApp.name.split('-').join(' ')}`}
              layoutId={`modal-${selectedApp.rank}`}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed inset-x-4 md:inset-x-auto md:w-[640px] top-[15%] md:top-[12%] mx-auto bg-brand-surface border border-white/10 rounded-sm p-12 z-[60] shadow-[0_0_64px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-24 h-1 bg-brand-cyan" />
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-6xl font-display font-bold text-white/10 tracking-tighter leading-none">#{selectedApp.rank.toString().padStart(2, '0')}</span>
                    <TierBadge tier={selectedApp.tier} />
                  </div>
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={selectedApp.category} size={28} className="text-brand-cyan" />
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tighter leading-none">
                      {selectedApp.name.split('-').join(' ')}
                    </h2>
                  </div>
                </div>
                <button onClick={() => setSelectedApp(null)} aria-label="Close venture detail" className="p-2 hover:bg-white/5 rounded-sm transition-colors border border-transparent hover:border-white/10">
                  <Maximize2 size={24} className="text-slate-500 rotate-45" aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-12 border-y border-white/5 py-10">
                <MetricIndicator value={selectedApp.m} label="ROI_CAPACITY_INDEX" />
                <MetricIndicator value={selectedApp.g} label="SOCIAL_LIQUIDITY" colorClass="bg-brand-mint" />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-brand-cyan">
                  <div className="h-px flex-1 bg-white/5" />
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]">STRATEGIC_SUMMARY</h4>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <p className="text-slate-400 text-sm font-mono leading-loose italic opacity-90">
                  “{selectedApp.why}”
                </p>

                {briefs[selectedApp.rank]?.text && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-brand-depth border border-brand-cyan/20 p-8 rounded-sm space-y-6"
                  >
                    <div className="flex items-center gap-3 text-brand-cyan">
                      <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-pulse" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em]">AI_SYNTHESIS_STREAM</span>
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed font-mono space-y-4">
                      {briefs[selectedApp.rank].text.split('\n').filter(line => line.trim()).map((line, idx) => (
                        <div key={idx} className="flex gap-3 opacity-90">
                          <span className="text-brand-cyan font-bold transition-all group-hover:scale-125">»</span>
                          <span>{line.replace(/^[•\-\d\.]+\s*/, '')}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {briefs[selectedApp.rank]?.error && (
                  <motion.div
                    role="alert"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-red-950/20 border border-red-800/40 p-6 rounded-sm flex items-start gap-3"
                  >
                    <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" aria-hidden="true" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-red-400">AI_SYNTHESIS_ERROR</p>
                      <p className="text-xs font-mono text-red-300/90">{briefs[selectedApp.rank].error}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="mt-12 flex gap-4">
                <button 
                  onClick={() => handleGenerateBrief(selectedApp)}
                  disabled={briefs[selectedApp.rank]?.loading}
                  className={cn(
                    "flex-1 bg-brand-cyan text-brand-depth font-bold py-5 rounded-sm text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group",
                    briefs[selectedApp.rank]?.loading && "opacity-50 cursor-not-allowed animate-pulse"
                  )}
                >
                  <div className="w-1 h-1 bg-brand-depth rounded-full group-hover:scale-150 transition-transform" />
                  {briefs[selectedApp.rank]?.loading ? 'SYNTHESIZING_COMPUTE...' : briefs[selectedApp.rank]?.text ? 'REGENERATE_ANALYSIS' : 'GENERATE_BRIEF'}
                </button>
                <button onClick={() => setSelectedApp(null)} className="px-8 border border-white/10 text-slate-400 font-bold py-5 rounded-sm text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
                  CLOSE_NODE
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="pt-24 pb-8 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-slate-600 uppercase tracking-widest border-t border-slate-900">
        <div>Proprietary Asset Scoring System v2.0</div>
        <div className="flex gap-8">
          <span className="hover:text-slate-400 cursor-pointer">Methodology</span>
          <span className="hover:text-slate-400 cursor-pointer">Conflict Report</span>
          <span className="hover:text-slate-400 cursor-pointer">Archive 2025</span>
          <button
            type="button"
            onClick={() => { window.location.hash = '#/admin'; }}
            aria-label="Open admin dashboard"
            className="hover:text-slate-400 transition-colors"
          >
            Admin
          </button>
        </div>
      </footer>

      {/* Comparison Action Bar */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div
            role="toolbar"
            aria-label="Compare selected ventures"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[40] bg-brand-surface/80 backdrop-blur-xl border border-white/10 rounded-sm p-6 shadow-[0_0_32px_rgba(0,0,0,0.5)] flex items-center gap-10 min-w-[400px]"
          >
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {compareApps.map((app) => (
                  <div key={app.rank} className="w-10 h-10 rounded-sm bg-brand-depth border border-white/20 flex items-center justify-center text-xs font-mono font-bold text-brand-cyan shadow-lg">
                    {app.rank.toString().padStart(2, '0')}
                  </div>
                ))}
              </div>
              <div className="space-y-0.5">
                <span className="block text-xs font-display font-bold text-white tracking-widest uppercase">{compareIds.length} ASSETS_MAPPED</span>
                <span className="block text-[9px] text-slate-600 font-mono uppercase tracking-[0.2em]">DELTA_READY_FOR_COMPUTE</span>
              </div>
            </div>
            
            <div className="h-10 w-px bg-white/5" />

            <div className="flex gap-6 items-center">
              <button
                onClick={() => setCompareIds([])}
                aria-label="Clear comparison selection"
                className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest hover:text-white transition-colors"
              >
                CLEAR_STACK
              </button>
              <button
                onClick={() => setIsComparing(true)}
                aria-label={`Compare ${compareIds.length} selected ventures`}
                className="bg-brand-amber text-brand-depth font-bold py-3 px-8 rounded-sm text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_12px_rgba(245,166,35,0.3)]"
              >
                EXECUTE_COMPARE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Matrix Modal */}
      <AnimatePresence>
        {isComparing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-depth/95 backdrop-blur-md z-[100] p-4 md:p-12 overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto space-y-16">
              <div className="flex justify-between items-start border-b border-white/5 pb-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-brand-cyan">
                    <div className="w-2 h-2 bg-brand-cyan" />
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.4em]">RELATIVE_VENTURE_MATRIX.0x4</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter">COMPARISON <span className="text-slate-800 uppercase">STREAM</span></h2>
                </div>
                <button 
                  onClick={() => setIsComparing(false)}
                  className="bg-brand-surface border border-white/10 text-slate-500 p-4 rounded-sm hover:text-white hover:border-brand-cyan transition-all"
                >
                  <Maximize2 size={32} className="rotate-45" />
                </button>
              </div>

              <div className={cn(
                "grid gap-6 md:gap-8",
                compareApps.length === 1 ? "grid-cols-1" :
                compareApps.length === 2 ? "grid-cols-2" :
                compareApps.length === 3 ? "grid-cols-3" : "grid-cols-4"
              )}>
                {compareApps.map((app) => (
                  <motion.div 
                    key={app.rank}
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-brand-surface border border-white/5 rounded-sm p-10 space-y-12 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-cyan/20" />
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-7xl font-display font-bold text-white/5 leading-none">#{app.rank.toString().padStart(2, '0')}</span>
                        <TierBadge tier={app.tier} />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <CategoryIcon category={app.category} size={24} className="text-brand-cyan" />
                          <h3 className="text-3xl font-display font-bold text-white uppercase tracking-tighter leading-tight">{app.name.split('-').join(' ')}</h3>
                        </div>
                        <p className="text-[10px] text-brand-cyan font-mono font-bold uppercase mt-2 tracking-[0.2em] opacity-60 italic whitespace-nowrap overflow-hidden text-ellipsis">{app.description}</p>
                      </div>
                    </div>

                    <div className="space-y-10">
                       <MetricIndicator value={app.m} label="ROI_EFFICIENCY" />
                       <MetricIndicator value={app.g} label="SOCIETAL_LIFT" colorClass="bg-brand-mint" />
                    </div>

                    <div className="space-y-4 pt-10 border-t border-white/5">
                       <div className="flex items-center gap-2 text-slate-600">
                        <Info size={14} />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]">RATIONALE_CORE</span>
                       </div>
                       <p className="text-xs text-slate-400 leading-relaxed font-mono italic line-clamp-6 opacity-80">
                        “{app.why}”
                       </p>
                    </div>

                    <div className="space-y-4 pt-8">
                      {briefs[app.rank]?.text ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-brand-depth border border-brand-cyan/20 p-6 rounded-sm space-y-4 shadow-inner"
                        >
                          <div className="flex items-center gap-3 text-brand-cyan">
                            <div className="w-1 h-1 bg-brand-cyan rounded-full animate-pulse" />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em]">AI_SYNTHESIS_STREAM</span>
                          </div>
                          <div className="text-[11px] text-slate-300 leading-relaxed font-mono space-y-3">
                            {briefs[app.rank].text.split('\n').filter(line => line.trim()).map((line, idx) => (
                              <div key={idx} className="flex gap-2 opacity-90">
                                <span className="text-brand-cyan font-bold transition-all group-hover:scale-125">»</span>
                                <span>{line.replace(/^[•\-\d\.]+\s*/, '')}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ) : null}

                      <button 
                        onClick={() => handleGenerateBrief(app)}
                        disabled={briefs[app.rank]?.loading}
                        className={cn(
                          "w-full bg-brand-depth hover:bg-brand-surface text-white font-bold py-4 rounded-sm text-[10px] border border-white/10 uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group/ai",
                          briefs[app.rank]?.loading && "opacity-50 cursor-not-allowed animate-pulse"
                        )}
                      >
                        {briefs[app.rank]?.loading ? (
                          <>SYNTHESIZING_COMPUTE...</>
                        ) : (
                          <>
                            <div className="w-1 h-1 bg-brand-cyan rounded-full transition-transform group-hover/ai:scale-150" />
                            {briefs[app.rank]?.text ? "REGENERATE_ANALYSIS" : "INITIALIZE_AI_BRIEF"}
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-center pt-16">
                <button 
                  onClick={() => setIsComparing(false)}
                  className="text-slate-600 hover:text-brand-amber font-mono text-[10px] uppercase tracking-[0.5em] transition-all pb-1 border-b border-transparent hover:border-brand-amber"
                >
                  RETURN_TO_COMMAND_DASHBOARD
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}

```

### FILE: src/data.ts
```typescript
export interface AppRanking {
  rank: number;
  name: string;
  description: string;
  category: 'FinTech' | 'HealthTech' | 'EdTech' | 'AgriTech' | 'LegalTech' | 'Compliance' | 'Logistics' | 'Infrastructure' | 'Media';
  m: number;
  g: number;
  why: string;
  tier: number;
}

export const APP_DATA: AppRanking[] = [
  { rank: 1, name: "fraud-detection-engine", description: "Real-time B2B fintech security layer", category: "FinTech", m: 5, g: 5, tier: 1, why: "Largest fintech B2B market globally; directly protects vulnerable users from financial harm" },
  { rank: 2, name: "predictive-disease-risk-model", description: "Health analytics for low-resource systems", category: "HealthTech", m: 5, g: 5, tier: 1, why: "Healthcare AI is the highest-value sector; life-saving in low-resource health systems" },
  { rank: 3, name: "academic-integrity-detector", description: "LLM-aware plagiarism detection suite", category: "EdTech", m: 5, g: 4, tier: 1, why: "$200M+ plagiarism-detection market; levels the playing field in education" },
  { rank: 4, name: "microcredit-risk-scorer", description: "Credit-scoring for the unbanked", category: "FinTech", m: 4, g: 5, tier: 1, why: "Financial inclusion for the unbanked; huge emerging-market demand from MFIs/fintechs" },
  { rank: 5, name: "ai-exam-generator", description: "Automated institutional assessment tool", category: "EdTech", m: 4, g: 5, tier: 1, why: "Democratises quality assessment at scale; clear SaaS per-institution pricing" },
  { rank: 6, name: "adaptive-curriculum-engine", description: "Personalised ed-tech learning pathways", category: "EdTech", m: 4, g: 5, tier: 1, why: "Personalised learning is the top ed-tech investment theme; strong in underserved markets" },
  { rank: 7, name: "bias-detection-engine", description: "Regulatory AI compliance monitor", category: "Compliance", m: 4, g: 5, tier: 1, why: "Regulatory pressure (EU AI Act etc.) is creating urgent enterprise demand" },
  { rank: 8, name: "ai-legal-clause-analyzer", description: "High-speed legal tech for underserved regions", category: "LegalTech", m: 5, g: 4, tier: 1, why: "Legal-tech is under-served in Africa; access-to-justice mission + high B2B billing rates" },
  { rank: 9, name: "crop-yield-predictor", description: "Agritech forecasting for smallholders", category: "AgriTech", m: 4, g: 5, tier: 1, why: "Agritech for smallholders; food security + strong NGO/govt grant pipeline" },
  { rank: 10, name: "digital-identity-verifier", description: "Foundation layer for financial inclusion", category: "FinTech", m: 5, g: 4, tier: 1, why: "Identity is the foundation of financial inclusion; large fintech/govt contract market" },
  
  { rank: 11, name: "autonomous-audit-engine", description: "Enterprise SaaS compliance automator", category: "Compliance", m: 5, g: 3, tier: 2, why: "Enterprise compliance SaaS commands premium pricing; governance is universal" },
  { rank: 12, name: "ai-code-reviewer", description: "Deep developer tooling subscription", category: "Infrastructure", m: 5, g: 3, tier: 2, why: "Developer tooling market is deep and subscription-friendly" },
  { rank: 13, name: "supply-chain-route-optimizer", description: "Logistics efficiency with emission reduction", category: "Logistics", m: 5, g: 3, tier: 2, why: "Logistics optimisation pays for itself immediately; reduces emissions as a side-effect" },
  { rank: 14, name: "treasury-forecasting-ai", description: "Financial services liquidity predictor", category: "FinTech", m: 5, g: 3, tier: 2, why: "Financial services highest willingness-to-pay vertical" },
  { rank: 15, name: "insurance-risk-intelligence-engine", description: "Insurtech for climate & agriculture", category: "FinTech", m: 5, g: 3, tier: 2, why: "Insurtech + parametric insurance for climate/agriculture is a hot funding area" },
  { rank: 16, name: "knowledge-compression-engine", description: "Enterprise-wide knowledge management", category: "Infrastructure", m: 4, g: 3, tier: 2, why: "Enterprise knowledge mgmt is a clear pain; licensing model straightforward" },
  { rank: 17, name: "student-performance-predictor", description: "Early-intervention data for education", category: "EdTech", m: 4, g: 4, tier: 2, why: "Early-intervention data that can save students; ed-analytics SaaS growing fast" },

  { rank: 18, name: "misinformation-detector", description: "Democracy-critical media licensing", category: "Media", m: 3, g: 5, tier: 3, why: "Democracy-critical; media platform licensing + NGO/govt grants" },
  { rank: 19, name: "public-health-surveillance-ai", description: "Population-scale healthcare monitor", category: "HealthTech", m: 3, g: 5, tier: 3, why: "Life-saving at population scale; funded through govt/WHO/USAID contracts" },
  { rank: 20, name: "disaster-response-allocator", description: "Humanitarian resource AI", category: "Logistics", m: 2, g: 5, tier: 3, why: "Humanitarian AI; funded through grants/UN but not self-sustaining commercially" },
  { rank: 21, name: "community-plates.v1", description: "Food rescue marketplace model", category: "Infrastructure", m: 3, g: 5, tier: 3, why: "Food rescue platform; impact-measurable, fundable, potential marketplace model" },
  { rank: 22, name: "climate-impact-modeler", description: "Carbon market monetization path", category: "Infrastructure", m: 3, g: 5, tier: 3, why: "Carbon markets + climate finance creating monetisation path" },
  { rank: 23, name: "soil-health-analyzer", description: "Smallholder agriculture impact tool", category: "AgriTech", m: 3, g: 5, tier: 3, why: "Direct smallholder agriculture impact; extension-service distribution model" },

  { rank: 24, name: "autonomous-compliance-enforcer", description: "Regulatory automation tool", category: "Compliance", m: 4, g: 3, tier: 4, why: "Regulatory compliance automation" },
  { rank: 25, name: "api-monetization-portal", description: "TUC commercial infrastructure", category: "Infrastructure", m: 4, g: 2, tier: 4, why: "Infrastructure for TUC to commercialise all other apps" },
  { rank: 26, name: "ai-marketplace-engine", description: "Tool aggregation platform", category: "Infrastructure", m: 4, g: 2, tier: 4, why: "Platform play — aggregates the other AI tools" },
  { rank: 27, name: "sentiment-aware-ux-adapter", description: "Accessibility for neurodiverse users", category: "Infrastructure", m: 3, g: 3, tier: 4, why: "Accessible UX for neurodiverse users is an underserved angle" },
  { rank: 28, name: "federated-learning-coordinator", description: "Privacy-preserving data share layer", category: "Infrastructure", m: 3, g: 4, tier: 4, why: "Privacy-preserving AI; critical for health/finance data sharing across institutions" },
  { rank: 29, name: "techbridge-eligibility-checker", description: "Scholarship & welfare access booster", category: "EdTech", m: 3, g: 4, tier: 4, why: "Direct scholarship/welfare access improvement — high impact per student" },
  { rank: 30, name: "hospital-resource-allocator", description: "Health system intake optimizer", category: "HealthTech", m: 3, g: 5, tier: 4, why: "Highly impactful but constrained to health system procurement cycles" },
];

export const STRATEGIC_OBSERVATIONS = [
  {
    title: "Best Immediate Revenue Target",
    items: ["fraud-detection-engine", "ai-legal-clause-analyzer", "autonomous-audit-engine"],
    observation: "Enterprises pay now, procurement cycles are short in fintech."
  },
  {
    title: "Best Grant/Impact Funding Target",
    items: ["predictive-disease-risk-model", "public-health-surveillance-ai", "disaster-response-allocator", "misinformation-detector"],
    observation: "Align with USAID, Gates Foundation, AfDB, and AU digital strategy priorities."
  },
  {
    title: "Best TUC Flagship to Spin Out",
    items: ["academic-integrity-detector", "ai-exam-generator"],
    observation: "Bundled assessment suite — directly addresses a pain TUC already lives."
  },
  {
    title: "Hidden Gem",
    items: ["microcredit-risk-scorer"],
    observation: "Ghana's mobile money ecosystem is actively looking for credit-scoring infrastructure."
  }
];

```

### FILE: src/index.css
```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Inter:wght@300;400;600;700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Bebas Neue", sans-serif;
  --font-mono: "DM Mono", monospace;
  
  --color-brand-depth: #080D14;
  --color-brand-surface: #0D1520;
  --color-brand-cyan: #00FFD1;
  --color-brand-mint: #2DD4BF;
  --color-brand-amber: #F5A623;
}

@layer base {
  body {
    @apply bg-brand-depth text-slate-50 font-sans antialiased selection:bg-brand-cyan/30;
  }
}

.noise-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.segmented-bar {
  display: flex;
  gap: 4px;
  width: 100%;
}

.segmented-segment {
  height: 4px;
  flex: 1;
  border-radius: 1px;
}

```

### FILE: src/lib/utils.ts
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

### FILE: test-results/.last-run.json
```json
{
  "status": "passed",
  "failedTests": []
}
```

### FILE: tests/audit-log.test.ts
```typescript
import { describe, it, expect, beforeEach } from 'vitest';

const AUDIT_LOG_KEY = 'impact-ventures-audit-logs';

interface AuditEntry { id: string; timestamp: string; action: string; details?: string; }

function getAuditLogs(): AuditEntry[] {
  try { return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]'); } catch { return []; }
}
function appendAuditLog(action: string, details?: string) {
  const logs = getAuditLogs();
  logs.unshift({ id: Date.now().toString() + Math.random(), timestamp: new Date().toISOString(), action, details });
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs.slice(0, 200)));
}

describe('audit log behaviour', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty', () => {
    expect(getAuditLogs()).toEqual([]);
  });

  it('appends entries newest-first', () => {
    appendAuditLog('FIRST');
    appendAuditLog('SECOND');
    const logs = getAuditLogs();
    expect(logs[0].action).toBe('SECOND');
    expect(logs[1].action).toBe('FIRST');
  });

  it('persists details when provided', () => {
    appendAuditLog('TEST_ACTION', 'with details');
    expect(getAuditLogs()[0].details).toBe('with details');
  });

  it('caps at 200 entries (oldest dropped)', () => {
    for (let i = 0; i < 250; i++) appendAuditLog('ENTRY_' + i);
    const logs = getAuditLogs();
    expect(logs.length).toBe(200);
    expect(logs[0].action).toBe('ENTRY_249');
    expect(logs[199].action).toBe('ENTRY_50');
  });

  it('returns empty array if storage holds invalid JSON', () => {
    localStorage.setItem(AUDIT_LOG_KEY, 'not-json{');
    expect(getAuditLogs()).toEqual([]);
  });
});

```

### FILE: tests/data.test.ts
```typescript
import { describe, it, expect } from 'vitest';
import { APP_DATA, STRATEGIC_OBSERVATIONS, type AppRanking } from '../src/data';

const VALID_CATEGORIES: AppRanking['category'][] = [
  'FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'LegalTech',
  'Compliance', 'Logistics', 'Infrastructure', 'Media',
];

describe('APP_DATA integrity', () => {
  it('has at least 30 entries (registry advertises "30 LIVE ASSETS")', () => {
    expect(APP_DATA.length).toBeGreaterThanOrEqual(30);
  });

  it('has unique ranks', () => {
    const ranks = APP_DATA.map(a => a.rank);
    expect(new Set(ranks).size).toBe(ranks.length);
  });

  it('has ranks numbered 1..N with no gaps', () => {
    const sorted = [...APP_DATA].map(a => a.rank).sort((a, b) => a - b);
    sorted.forEach((rank, i) => expect(rank).toBe(i + 1));
  });

  it('every entry has all required fields populated', () => {
    APP_DATA.forEach(a => {
      expect(a.name, `rank ${a.rank} name`).toBeTruthy();
      expect(a.description, `rank ${a.rank} description`).toBeTruthy();
      expect(a.why, `rank ${a.rank} why`).toBeTruthy();
    });
  });

  it('M (monetisation) is integer in [1,5] for every entry', () => {
    APP_DATA.forEach(a => {
      expect(Number.isInteger(a.m), `rank ${a.rank} m=${a.m}`).toBe(true);
      expect(a.m).toBeGreaterThanOrEqual(1);
      expect(a.m).toBeLessThanOrEqual(5);
    });
  });

  it('G (social good) is integer in [1,5] for every entry', () => {
    APP_DATA.forEach(a => {
      expect(Number.isInteger(a.g), `rank ${a.rank} g=${a.g}`).toBe(true);
      expect(a.g).toBeGreaterThanOrEqual(1);
      expect(a.g).toBeLessThanOrEqual(5);
    });
  });

  it('tier is integer in [1,4]', () => {
    APP_DATA.forEach(a => {
      expect([1, 2, 3, 4]).toContain(a.tier);
    });
  });

  it('every category is one of the 9 declared values', () => {
    APP_DATA.forEach(a => {
      expect(VALID_CATEGORIES).toContain(a.category);
    });
  });
});

describe('STRATEGIC_OBSERVATIONS', () => {
  it('has at least one observation', () => {
    expect(STRATEGIC_OBSERVATIONS.length).toBeGreaterThan(0);
  });

  it('every observation has title, observation text, and items[]', () => {
    STRATEGIC_OBSERVATIONS.forEach(o => {
      expect(o.title).toBeTruthy();
      expect(o.observation).toBeTruthy();
      expect(Array.isArray(o.items)).toBe(true);
      expect(o.items.length).toBeGreaterThan(0);
    });
  });
});

```

### FILE: tests/e2e/admin.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('admin journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // ensure clean session/local storage for each scenario
    await page.evaluate(() => {
      sessionStorage.clear();
      localStorage.removeItem('impact-ventures-audit-logs');
    });
  });

  test('footer Admin link navigates to login modal', async ({ page }) => {
    await page.getByRole('button', { name: /open admin dashboard/i }).click();
    await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
  });

  test('deep link #/admin opens the login modal', async ({ page }) => {
    await page.goto('/#/admin');
    await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
  });

  test('show/hide password toggle flips input type', async ({ page }) => {
    await page.goto('/#/admin');
    const pwd = page.getByRole('textbox', { name: 'Password' });
    await pwd.fill('something');
    await expect(pwd).toHaveAttribute('type', 'password');
    await page.getByRole('button', { name: /show password/i }).click();
    await expect(pwd).toHaveAttribute('type', 'text');
    await page.getByRole('button', { name: /hide password/i }).click();
    await expect(pwd).toHaveAttribute('type', 'password');
  });

  test('invalid password shows alert and writes a fail entry to audit log', async ({ page }) => {
    await page.goto('/#/admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrong');
    await page.getByRole('button', { name: /authenticate/i }).click();
    await expect(page.getByRole('alert')).toContainText(/invalid password/i);

    const logs = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('impact-ventures-audit-logs') || '[]'),
    );
    expect(logs[0].action).toBe('ADMIN_LOGIN_FAIL');
  });

  test('cancel returns to home', async ({ page }) => {
    await page.goto('/#/admin');
    await page.getByRole('button', { name: /^cancel$/i }).click();
    await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
    await expect(page).toHaveURL(/\/$|#$/);
  });

  test('valid password opens dashboard, both tabs work, logout clears session', async ({ page }) => {
    await page.goto('/#/admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: /authenticate/i }).click();

    const dashboard = page.getByRole('main', { name: /admin dashboard/i });
    await expect(dashboard).toBeVisible();

    // Audit Log tab is the default
    const logsTab = page.getByRole('tab', { name: /audit log/i });
    const diagTab = page.getByRole('tab', { name: /diagnostics/i });
    await expect(logsTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('region', { name: /audit log/i })).toBeVisible();
    await expect(page.getByText('ADMIN_LOGIN_SUCCESS')).toBeVisible();

    // Switch to Diagnostics
    await diagTab.click();
    await expect(diagTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('region', { name: /system diagnostics/i })).toBeVisible();
    await expect(page.getByText(/portfolio count/i)).toBeVisible();

    // Run storage test → PASS
    await page.getByRole('button', { name: /^run test$/i }).click();
    await expect(page.getByRole('status').filter({ hasText: 'PASS' })).toBeVisible();

    // Diagnostic run is logged
    await logsTab.click();
    await expect(page.getByText('DIAGNOSTIC_RUN')).toBeVisible();

    // Logout clears session and unmounts dashboard
    await page.getByRole('button', { name: /logout from admin/i }).click();
    await expect(dashboard).toHaveCount(0);

    const session = await page.evaluate(() => sessionStorage.getItem('impact-ventures-admin'));
    expect(session).toBeNull();
  });

  test('admin session persists: re-entering #/admin skips login', async ({ page }) => {
    await page.goto('/#/admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: /authenticate/i }).click();
    await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();

    // Close dashboard via logout-free path: navigate away then back
    await page.evaluate(() => { window.location.hash = ''; });
    await page.evaluate(() => { window.location.hash = '#/admin'; });

    // Session is still set, so dashboard reopens without the login modal
    await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();
    await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
  });
});

```

### FILE: tests/e2e/brief-generation.spec.ts
```typescript
import { test, expect } from '@playwright/test';

// This spec exercises the live Gemini call. It needs GEMINI_API_KEY in the
// environment of the vite preview server (loaded from .env.local at build).
// With the current model id ("gemini-3-flash-preview") the API rejects the
// request and the UI surfaces the error branch.

test.describe('AI brief generation (error path)', () => {
  test.skip(!process.env.GEMINI_API_KEY, 'GEMINI_API_KEY not set — skipping live API spec');

  test('GENERATE_BRIEF on a venture surfaces "AI Service Unavailable"', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('heading', { name: /fraud detection engine/i }).click();
    const dialog = page.getByRole('dialog', { name: /venture detail: fraud detection engine/i });
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', { name: /generate_brief/i }).click();

    // Loading label flips first
    await expect(dialog.getByRole('button', { name: /synthesizing_compute/i })).toBeVisible();

    // The current model id ("gemini-3-flash-preview") is not a valid Gemini
    // model, so the API rejects the call and the error branch renders an alert.
    // Allow up to 30s for the API round-trip + render.
    const errorAlert = dialog.getByRole('alert').filter({ hasText: /AI_SYNTHESIS_ERROR/i });
    await expect(errorAlert).toBeVisible({ timeout: 30_000 });
    await expect(errorAlert).toContainText(/AI Service Unavailable/i);
  });
});

```

### FILE: tests/e2e/compare.spec.ts
```typescript
import { test, expect } from '@playwright/test';

// Each registry card is a motion.div containing exactly one h3 with the
// venture name. Walk up from the heading to that ancestor card so we can
// scope queries (like the COMPARE button) to a single card.
const card = (page: import('@playwright/test').Page, name: RegExp) =>
  page.getByRole('heading', { level: 3, name }).locator('xpath=ancestor::div[contains(@class,"group")][1]');

test.describe('compare flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('selecting cards reveals the toolbar with count', async ({ page }) => {
    // The COMPARE button on each card stops propagation, so it does not open the modal.
    await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
    const toolbar = page.getByRole('toolbar', { name: /compare selected ventures/i });
    await expect(toolbar).toBeVisible();
    await expect(toolbar.getByText('1 ASSETS_MAPPED')).toBeVisible();

    await card(page, /predictive disease risk model/i).getByRole('button', { name: /compare/i }).click();
    await expect(toolbar.getByText('2 ASSETS_MAPPED')).toBeVisible();
  });

  test('CLEAR_STACK empties the toolbar', async ({ page }) => {
    await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
    const toolbar = page.getByRole('toolbar', { name: /compare selected ventures/i });
    await toolbar.getByRole('button', { name: /clear comparison selection/i }).click();
    await expect(toolbar).toHaveCount(0);
  });

  test('EXECUTE_COMPARE opens the comparison stream and RETURN closes it', async ({ page }) => {
    await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
    await card(page, /predictive disease risk model/i).getByRole('button', { name: /compare/i }).click();

    await page.getByRole('button', { name: /compare 2 selected ventures/i }).click();

    await expect(page.getByText('RELATIVE_VENTURE_MATRIX.0x4')).toBeVisible();
    await expect(page.getByRole('heading', { name: /comparison/i })).toBeVisible();

    await page.getByRole('button', { name: /return_to_command_dashboard/i }).click();
    await expect(page.getByText('RELATIVE_VENTURE_MATRIX.0x4')).toHaveCount(0);
  });

  test('cap at 4 selections — a 5th click is ignored', async ({ page }) => {
    const targets = [
      /fraud detection engine/i,
      /predictive disease risk model/i,
      /academic integrity detector/i,
      /microcredit risk scorer/i,
      /ai exam generator/i,
    ];
    for (const t of targets) {
      await card(page, t).getByRole('button', { name: /compare|mapped/i }).click();
    }
    await expect(page.getByRole('toolbar').getByText(/4 ASSETS_MAPPED/)).toBeVisible();
  });
});

```

### FILE: tests/e2e/detail-modal.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('venture detail modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking a card opens the modal with venture details', async ({ page }) => {
    await page.getByRole('heading', { name: /fraud detection engine/i }).click();
    const dialog = page.getByRole('dialog', { name: /venture detail: fraud detection engine/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('STRATEGIC_SUMMARY')).toBeVisible();
    await expect(dialog.getByText('ROI_CAPACITY_INDEX')).toBeVisible();
    await expect(dialog.getByText('SOCIAL_LIQUIDITY')).toBeVisible();
  });

  test('close (X) button dismisses the modal', async ({ page }) => {
    await page.getByRole('heading', { name: /fraud detection engine/i }).click();
    const dialog = page.getByRole('dialog', { name: /venture detail/i });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /close venture detail/i }).click();
    await expect(dialog).toHaveCount(0);
  });

  test('CLOSE_NODE button dismisses the modal', async ({ page }) => {
    await page.getByRole('heading', { name: /fraud detection engine/i }).click();
    const dialog = page.getByRole('dialog', { name: /venture detail/i });
    await dialog.getByRole('button', { name: /close_node/i }).click();
    await expect(page.getByRole('dialog', { name: /venture detail/i })).toHaveCount(0);
  });
});

```

### FILE: tests/e2e/filters.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('search and filter journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('search narrows the registry', async ({ page }) => {
    const search = page.getByRole('searchbox', { name: /search ventures/i });
    await search.fill('fraud');
    await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
    // a non-matching name should disappear
    await expect(page.getByRole('heading', { name: /crop yield predictor/i })).toHaveCount(0);
  });

  test('tier filter restricts to selected tier', async ({ page }) => {
    await page.getByRole('button', { name: /filter tier 1/i }).click();
    await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
    // a known T2 entry should be hidden
    await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toHaveCount(0);

    await page.getByRole('button', { name: /show all tiers/i }).click();
    await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toBeVisible();
  });

  test('advanced filters: toggle, category filter, and reset', async ({ page }) => {
    const refine = page.getByRole('button', { name: /refine/i });
    await expect(refine).toHaveAttribute('aria-expanded', 'false');
    await refine.click();
    await expect(refine).toHaveAttribute('aria-expanded', 'true');

    // Category: HealthTech only — must not show a FinTech card
    await page.getByRole('button', { name: /^HealthTech$/ }).click();
    await expect(page.getByRole('heading', { name: /predictive disease risk model/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toHaveCount(0);

    // Reset returns FinTech entries
    await page.getByRole('button', { name: /reset all filters/i }).click();
    await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
  });

  test('search + tier compose (both must match)', async ({ page }) => {
    await page.getByRole('searchbox', { name: /search ventures/i }).fill('compliance');
    await page.getByRole('button', { name: /filter tier 1/i }).click();
    // T1 + "compliance" in name/why → bias-detection-engine (rationale mentions regulatory/compliance)
    await expect(page.getByRole('heading', { name: /bias detection engine/i })).toBeVisible();
    // T2 compliance entry should NOT appear
    await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toHaveCount(0);
  });
});

```

### FILE: tests/e2e/smoke.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test('home renders core landmarks without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

  await page.goto('/');

  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: /IMPACT/i })).toBeVisible();
  await expect(page.getByText('PORTFOLIO.SIZE')).toBeVisible();
  await expect(page.getByText('IMPACT.CRITICAL')).toBeVisible();
  await expect(page.getByRole('region', { name: /impact matrix/i })).toBeVisible();
  await expect(page.getByRole('region', { name: /venture registry/i })).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();

  expect(errors, `errors: ${errors.join(' | ')}`).toEqual([]);
});

test('skip-link is present for keyboard users', async ({ page }) => {
  await page.goto('/');
  const skip = page.getByRole('link', { name: /skip to main content/i });
  await expect(skip).toHaveAttribute('href', '#main-content');
});

```

### FILE: tests/setup.ts
```typescript
import '@testing-library/jest-dom/vitest';

```

### FILE: tests/utils.test.ts
```typescript
import { describe, it, expect } from 'vitest';
import { cn } from '../src/lib/utils';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('drops falsy values', () => {
    expect(cn('a', false && 'b', null, undefined, 'c')).toBe('a c');
  });

  it('merges conflicting Tailwind utilities, keeping the last', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles arrays and conditional objects', () => {
    expect(cn(['a', 'b'], { c: true, d: false })).toBe('a b c');
  });

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('');
  });
});

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
    "types": [
      "node"
    ],
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
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/impact-ventures/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
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
              return 'vendor';
            }
          },
        },
      },
    },
  };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/**/*.d.ts'],
    },
  },
});

```

