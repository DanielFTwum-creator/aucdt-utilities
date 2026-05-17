# playwright-framework - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for playwright-framework.

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
# playwright-framework

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

### FILE: docs/SRS.md
```md
﻿# System Requirements Specification (SRS)
## Project: playwright
**Version:** 1.0 (Auto-Generated Baseline)
**Date:** 2026-03-07

---

## 1. Introduction
### 1.1 Purpose
This document defines the baseline system requirements for **playwright**, ensuring alignment with the overarching Techbridge University College ecosystem standards.

### 1.2 Scope
This application provides utility functionality within the Techbridge ecosystem.

## 2. Institutional Compliance Mandates (Permanent)
To maintain alignment with the **Techbridge Scholarship Portal v2.0 Blueprint**, this project strictly adheres to the following constraints:

- **React Version:** Must operate on React 19.2.5.
- **Linguistic Standard:** Strict adherence to UK British English (e.g., *programme*, *colour*, *analyse*).
- **Security & Diagnostics:** All internal audit logs and test simulators must be isolated behind the `#/admin` hash route.
- **Deployment:** `vite.config.ts` must utilize relative base pathing (`base: './'`) to guarantee universal PWA hosting.
- **UI/UX Aesthetics:** Implementation of the "Warm Prestige" 6R aesthetic (TUC Gold, Cream, Ink) using `Playfair Display` and `Cormorant Garamond`.

## 3. Architecture & Tech Stack
- **Frontend Core:** React 19.2.5 + TypeScript
- **Build Tool:** Vite 7+
- **Styling:** Tailwind CSS v4

## 4. Revision History
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2026-03-07 | 1.0 | Initial Scaffolding | ReactUIRemediator Agent |

```

### FILE: e2e.spec.ts
```typescript
import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const APP_URL = 'https://portal.aucdt.edu.gh/genai/6/';
const SCREENSHOTS_DIR = path.join(__dirname, 'qa_snapshots');

test.beforeAll(() => {
  if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
});

test.use({ viewport: { width: 1280, height: 1024 } });

test('TC-01: Home Page loads and renders correctly', async ({ page }) => {
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await expect(page).toHaveTitle(/.+/);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-HomePage.png') });
});

test('TC-02: Default Mathematics Exam flow', async ({ page }) => {
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await page.click('button.aucdt-button-green');
  await page.waitForSelector('h3.font-bold.mb-2');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02-ExamPage.png') });
  const questionCount = await page.locator('h3.font-bold.mb-2').count();
  expect(questionCount).toBeGreaterThan(0);
});

test('TC-03: Navigation and UI elements', async ({ page }) => {
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03-Navigation.png') });
  // Verify at least one interactive element is present
  const buttons = await page.locator('button').count();
  expect(buttons).toBeGreaterThan(0);
});

test('TC-04: Page responsiveness at mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04-Mobile.png') });
  await expect(page.locator('body')).toBeVisible();
});

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
  "name": "playwright-e2e-suite",
  "version": "1.0.0",
  "description": "Playwright E2E test suite for TUC Examination Portal",
  "private": true,
  "packageManager": "pnpm@10.30.1",
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:report": "playwright show-report playwright-report"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "@types/node": "^22.0.0",
    "typescript": "~5.7.0"
  }
}

```

### FILE: playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.ts',
  fullyParallel: false,
  retries: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: 'https://portal.aucdt.edu.gh',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});

```

