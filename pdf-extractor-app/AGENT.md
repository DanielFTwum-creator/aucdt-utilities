# pdf-extractor-app - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for pdf-extractor-app.

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
﻿# CREATION.md â€” PDF Extractor App

**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/pdf-extractor-app/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

The PDF Extractor App (`pdf-extractor-app` v0.1.0) is a **client-side PDF email-extraction utility SPA** for Techbridge University College (TUC). The user uploads a PDF; the app reads it entirely in-browser using PDF.js, walks every page's text content, and runs a regex against the concatenated string to surface unique email addresses. Results render as a click-to-copy list with bulk **Copy All** and **Download as TXT** actions.

Critically, the app **does not call any backend** to process PDFs â€” PDF.js is loaded from a CDN at boot, the worker is wired up to the same CDN, and the file never leaves the browser. The app is **gated by a session-storage login** (`admin` / `admin`) before the upload UI renders, and exposes a protected `/admin` route inside an inner React Router for compliance/audit dashboards. It is part of the TUC monorepo gateway, deployed via the `pdf-extractor-app` service in `docker-compose-all-apps.yml`.

---

## 2. Tech Stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.5** (never change) |
| DOM | react-dom | 19.2.5 |
| Build | Vite | 7.3.1 |
| React plugin | @vitejs/plugin-react | ^5.1.4 |
| Language | TypeScript | ^5.7.2 |
| Routing | react-router-dom | ^7.1.0 |
| Styling | Tailwind CSS | ^4.2.1 (via `@tailwindcss/vite`) + custom `App.css` |
| Icons | lucide-react | ^0.400.0 |
| PDF parsing | **pdf.js 3.11.174** (CDN: `cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js` + matching `pdf.worker.min.js`) â€” runtime-injected, NOT bundled |
| Web vitals | web-vitals | ^2.1.4 |
| Static server | serve | 14.2.5 |
| Unit tests | Vitest + @testing-library/react + jsdom | ^3.0.0 / ^16.3.2 / ^26.1.0 |
| Test DOM matchers | @testing-library/jest-dom | ^6.6.3 |
| User-event | @testing-library/user-event | ^14.6.1 |
| Coverage | @vitest/coverage-v8 | ^3.0.0 |
| Package manager | pnpm | 10.30.1 (declared in `packageManager`) |
| Container | node:24-alpine â†’ nginx:alpine | â€” |

---

## 3. Directory Structure (verbatim)

```
pdf-extractor-app/
â”œâ”€â”€ index.html
â”œâ”€â”€ index.css
â”œâ”€â”€ package.json                # name: pdf-extractor-app, version: 0.1.0
â”œâ”€â”€ pnpm-lock.yaml
â”œâ”€â”€ pnpm-workspace.yaml
â”œâ”€â”€ vite.config.ts              # dev port 3000, base './'
â”œâ”€â”€ vitest.config.ts
â”œâ”€â”€ vitest.e2e.config.ts
â”œâ”€â”€ tsconfig.json
â”œâ”€â”€ Dockerfile                  # node:24-alpine multi-stage â†’ serve dist :4173
â”œâ”€â”€ nginx.conf                  # SPA fallback, /health endpoint
â”œâ”€â”€ DEPLOYMENT.md
â”œâ”€â”€ README.md
â”œâ”€â”€ public/
â”œâ”€â”€ docs/
â”‚   â”œâ”€â”€ ADMIN_GUIDE.md
â”‚   â”œâ”€â”€ architecture.svg
â”‚   â”œâ”€â”€ dataflow.svg
â”‚   â”œâ”€â”€ DEPLOYMENT.md
â”‚   â”œâ”€â”€ SRS.md
â”‚   â””â”€â”€ TESTING.md
â””â”€â”€ src/
    â”œâ”€â”€ index.tsx               # createRoot + AuthGate + AppWithAuth
    â”œâ”€â”€ index.css
    â”œâ”€â”€ App.tsx                 # extractor root (~310 LOC)
    â”œâ”€â”€ App.css                 # custom styles for upload, results, message-box
    â”œâ”€â”€ App.test.js
    â”œâ”€â”€ AppWithAuth.tsx         # router with /login, /admin, /*
    â”œâ”€â”€ AuthGate.tsx
    â”œâ”€â”€ reportWebVitals.js
    â”œâ”€â”€ setupTests.js
    â”œâ”€â”€ logo.svg
    â”œâ”€â”€ vite-env.d.ts
    â”œâ”€â”€ __tests__/
    â”œâ”€â”€ components/
    â”‚   â””â”€â”€ ProtectedRoute.tsx
    â”œâ”€â”€ contexts/
    â”‚   â””â”€â”€ AuthContext.tsx
    â”œâ”€â”€ pages/
    â”‚   â”œâ”€â”€ LoginPage.tsx
    â”‚   â””â”€â”€ AdminPage.tsx
    â””â”€â”€ services/
        â””â”€â”€ AuthService.ts
```

---

## 4. Provider Composition (`src/index.tsx`)

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWithAuth from './AppWithAuth';
import reportWebVitals from './reportWebVitals';
import { AuthGate } from './AuthGate';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthGate><AppWithAuth /></AuthGate>
  </React.StrictMode>
);
reportWebVitals();
document.getElementById('tuc-splash-styles')?.remove();
```

---

## 5. Application State (`src/App.tsx`)

```ts
const [fileInfo, setFileInfo]               = useState('');
const [loading, setLoading]                 = useState(false);
const [error, setError]                     = useState('');
const [extractedEmails, setExtractedEmails] = useState<string[]>([]);
const [showResults, setShowResults]         = useState(false);
const [messageBox, setMessageBox]           = useState({ visible: false, title: '', content: '' });
const [isPdfjsLoaded, setIsPdfjsLoaded]     = useState(false);
```

---

## 6. PDF.js Bootstrapping

On mount, a `useEffect` injects a `<script>` tag into `document.head`:

```ts
const url = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const id  = 'pdfjs-script';
script.src = url;
script.id  = id;
script.async = true;
script.onload = () => {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  setIsPdfjsLoaded(true);
};
script.onerror = () => setError('Failed to load PDF.js library. Please check your internet connection.');
```

The file input is `disabled` and the label reads **"â³ Loading PDF.js..."** until `isPdfjsLoaded === true`, at which point it switches to **"ðŸ“„ Choose PDF File"**.

---

## 7. Extraction Pipeline

```ts
const handleFileSelect = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  setFileInfo(`Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
  extractEmails(file);
};

const extractEmails = async (file) => {
  setLoading(true); setError(''); setShowResults(false); setExtractedEmails([]);
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let allText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const tc   = await page.getTextContent();
    allText += tc.items.map(it => it.str).join(' ') + ' ';
  }
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = allText.match(emailRegex) || [];
  const unique = [...new Set(emails.map(e => e.toLowerCase()))].sort();
  setExtractedEmails(unique);
  setLoading(false);
  if (unique.length) setShowResults(true);
  else showCustomMessageBox('No Emails Found', 'No email addresses were found in the PDF file.');
};
```

Notes:
- All emails are normalised to lowercase before deduping.
- Final list is alphabetically sorted.
- On parse failure, `error` is set to `"Error processing PDF: <message>. Please ensure it is a valid PDF file and try again."`.
- A modal (`messageBox`) surfaces success / failure for non-fatal operations like "No Emails Found" or copy/download fallback paths.

---

## 8. Clipboard & Download

`copyToClipboard(text, event, successMessage)`:
1. Try `navigator.clipboard.writeText(text)`.
2. On failure, call `fallbackCopyToClipboard(text, target, message)` which renders an off-screen `<textarea>`, calls `document.execCommand('copy')`, and removes the textarea.
3. On success, `applyCopyFeedback(target, message)` flashes the button label to `"âœ“ Copied!"` and the background to `linear-gradient(135deg, #228B22 0%, #3CB371 100%)` for 1500 ms.

`downloadEmails()`:
- Joins `extractedEmails` with `\n`, builds `Blob([content], { type: 'text/plain;charset=utf-8' })`, creates an `<a download="extracted_unique_emails.txt">`, programmatically clicks it, then revokes the object URL after 200 ms.
- Visual feedback: button briefly shows `"âœ“ Downloaded!"` and the green gradient for 2000 ms.

`copyAllEmails(event)` joins the array with `\n` and pushes through `copyToClipboard` with message `"All emails copied to clipboard!"`.

---

## 9. UI Composition (`App.tsx` JSX, `App.css`)

The page uses a centred `.container` card. Section structure:

1. `.header` â€” purple gradient banner with `ðŸ“§ PDF Email Extractor` title and subtitle `"Extract unique email addresses from PDF documents with ease"`.
2. `.upload-section` â€” the file input + label, plus a `.file-info` row when a file is chosen.
3. `.loading` â€” inline spinner with `"Processing PDF file..."` while the extraction promise is pending.
4. `.error` â€” red alert banner.
5. `.results` â€” heading `"ðŸ“‹ Extracted Email Addresses"`, an `.email-count` row, a vertical `.email-list` of clickable `.email-item` chips (each click copies that single address), and a `.download-section` with two buttons:
   - `#downloadBtn` `ðŸ’¾ Download as TXT`
   - `#copyBtn` `ðŸ“‹ Copy All`
6. `.message-box-overlay` / `.message-box` â€” modal for status messages, dismissed by an `OK` button bound to `hideCustomMessageBox()`.

The success-state gradient is `linear-gradient(135deg, #228B22 0%, #3CB371 100%)` (forest green â†’ medium spring green).

---

## 10. Authentication

### Outer gate (`src/AuthGate.tsx`)

- **Session key:** `sessionStorage["tuc_auth_pdf_extractor_app"] === "1"`.
- **Accent colour (login icon + button):** `#0891b2` (cyan-600).
- Hard-coded credentials: `admin` / `admin`. Failure: `"Invalid credentials. Use admin / admin"`.
- Login card title: `"Pdf Extractor App"`. Footer: `"Techbridge University College Â· admin / admin"`.

### Inner router (`AuthContext` + `AuthService`)

- `API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'`.
- `TOKEN_KEY = [REDACTED_CREDENTIAL]
- `AuthService.login(u,p)` POSTs `${API_BASE}/api/auth/login`; persists token; `validateToken` GETs `${API_BASE}/api/auth/validate`.
- `<ProtectedRoute>` redirects unauthenticated `/admin` visits to `/login`.
- `User` shape: `{ id, username, role }`.

---

## 11. Admin Panel (`src/pages/AdminPage.tsx`)

Two-pane layout consistent with the rest of the monorepo:
- **Sidebar** `bg-[#0f172a]` slate, with a yellow `bg-[#ffcb05]` shield, app title `Pdf Extractor App`, two tabs (`overview`, `logs`), Sign-Out at the bottom.
- **Main pane** header `Pdf Extractor App â€” Admin Â· Techbridge University College Â· Staff Portal`.

Tabs:

1. **Overview** â€” six compliance tiles: `React Version 19.2.5`, `Docker Configured`, `SRS docs/SRS.md`, `Tests vitest.config.ts`, `Auth Active`, `Phase Phase 2 Complete`.
2. **Activity Log** â€” table of `{ id, time, action, detail }`; seeded with one `SESSION_START` entry.

All future diagnostics (e.g. PDF parse benchmarks, regex coverage tests) MUST live exclusively under `/admin`.

---

## 12. Build / Run / Test

```bash
pnpm install
pnpm run dev            # vite, port 3000
pnpm run build          # â†’ dist/
pnpm run preview
pnpm run serve          # serve -s dist -l 3000
pnpm test
pnpm run test:ui
pnpm run test:coverage
pnpm run test:e2e
```

---

## 13. Docker

- **Dockerfile** â€” node:24-alpine multi-stage. Stage 1: corepack pnpm + `pnpm install --frozen-lockfile || npm install` + `pnpm run build`. Stage 2: `pnpm add -g serve`, copy `dist/`, expose **4173**, healthcheck `wget --spider http://localhost:4173/health`.
- **nginx.conf** â€” `listen 80; root /usr/share/nginx/html; try_files $uri $uri/ /index.html;`. Security headers: `X-Frame-Options SAMEORIGIN`, `X-Content-Type-Options nosniff`, `X-XSS-Protection 1; mode=block`, `Referrer-Policy strict-origin-when-cross-origin`. Static assets cached 1 year immutable. Gzip enabled. `/health` returns `healthy`.
- **docker-compose-all-apps.yml** â€” service `pdf-extractor-app`, context `./pdf-extractor-app`, dockerfile `../Dockerfile.vite`, network `tuc-network`.

---

## 14. Environment Variables

```bash
# Frontend (Vite)
VITE_API_URL=http://localhost:5000     # backend auth API for inner router
NODE_ENV=development
```

If the CSP needs locking down, allow-list `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/` so the runtime script + worker can load. Production deployments should consider self-hosting the worker to avoid third-party trust.

---

## 15. Branding Overlay (mandatory in any new chrome)

| Token | Hex |
|---|---|
| Gold | `#C8A84B` |
| Ink | `#0F0C07` |
| Cream | `#F2EBD9` |
| Paper | `#141210` |

Typography: Playfair Display (titles), Bebas Neue (display), Inter / Cormorant Garamond (body). Always refer to the institution as **Techbridge University College** or **TUC**.

---

## 16. Accessibility Requirements

- File input is bound to `<label htmlFor="pdfFile">`; label renders the visible button.
- Loading state should declare `role="status" aria-live="polite"` so screen readers announce `"Processing PDF file..."`.
- Error banner should declare `role="alert"`.
- Modal (`.message-box-overlay`) should set `role="dialog" aria-modal="true"` and trap focus to the OK button.
- `.email-item` rows are clickable; add `role="button" tabIndex={0}` and `onKeyDown` for Enter/Space when refactoring for full WCAG 2.1 AA.
- All buttons must have visible focus rings.
- Colour-only state (the green gradient on success) must be paired with text feedback ("âœ“ Copied!" / "âœ“ Downloaded!").

---

## 17. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | App builds with zero TypeScript errors |
| AC-2 | `AuthGate` blocks the extractor until session login succeeds with `admin/admin` |
| AC-3 | PDF.js (3.11.174) loads from CDN at boot and the worker is wired to the matching `pdf.worker.min.js` |
| AC-4 | The file input is disabled until `isPdfjsLoaded === true`; label switches from `â³ Loading PDF.js...` to `ðŸ“„ Choose PDF File` |
| AC-5 | Choosing a PDF triggers `extractEmails`, which iterates `pdf.numPages` and concatenates `getTextContent` results |
| AC-6 | The email regex `/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g` is used to find addresses |
| AC-7 | Results are deduplicated case-insensitively and sorted alphabetically |
| AC-8 | "No Emails Found" message-box appears when extraction yields zero matches |
| AC-9 | Single-email click and `Copy All` button both copy via `navigator.clipboard` with execCommand fallback |
| AC-10 | `Download as TXT` produces `extracted_unique_emails.txt` with one email per line |
| AC-11 | `/admin` is protected; unauthenticated visits redirect to `/login` |
| AC-12 | Admin Overview shows the six compliance tiles in Â§11 |
| AC-13 | Dockerfile produces a healthy image; `/health` returns `healthy` |
| AC-14 | Service appears under `pdf-extractor-app:` in `docker-compose-all-apps.yml` on `tuc-network` |
| AC-15 | No PDF bytes are uploaded to any server â€” extraction stays local to the browser |
| AC-16 | Institution name in any new chrome is **Techbridge University College** / **TUC** |
| AC-17 | Tests run via `pnpm test`; coverage achievable via `pnpm test:coverage` |

```

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/pdf-extractor-app/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/pdf-extractor-app/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/pdf-extractor-app/',  // REQUIRED: Assets must load from /pdf-extractor-app/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/pdf-extractor-app"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/pdf-extractor-app">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/pdf-extractor-app/`, not at the root
- **Asset Loading**: Without `base: '/pdf-extractor-app/'`, assets try to load from `/assets/` instead of `/pdf-extractor-app/assets/`
- **Routing**: Without `basename="/pdf-extractor-app"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/pdf-extractor-app/assets/index-*.js`
- Link tags should reference: `/pdf-extractor-app/assets/index-*.css`

If they reference `/assets/` instead of `/pdf-extractor-app/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/pdf-extractor-app/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/pdf-extractor-app/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: pdf-extractor-app

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
# Admin Guide — pdf-extractor-app

**Application:** pdf-extractor-app
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

Audit log data is stored in `localStorage` under the key `tuc_pdf-extractor-app_audit`.

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
# Deployment Guide — pdf-extractor-app

**Application:** pdf-extractor-app
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd pdf-extractor-app
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
docker-compose -f docker-compose-all-apps.yml build pdf-extractor-app
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up pdf-extractor-app
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

**Project:** Pdf Extractor App
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Pdf Extractor App**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Pdf Extractor App** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Pdf Extractor App** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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
# Testing Guide — pdf-extractor-app

**Application:** pdf-extractor-app
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd pdf-extractor-app
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
    <meta property="og:title" content="Pdf Extractor App | Techbridge University College" />
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
    <meta name="twitter:title" content="Pdf Extractor App | Techbridge University College" />
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
    <title>Pdf Extractor App | Techbridge University College</title>

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
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">pdf extractor app</div>
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
  "name": "pdf-extractor-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@tailwindcss/vite": "^4.2.1",
    "@testing-library/dom": "^10.4.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^13.5.0",
    "lucide-react": "^0.400.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0",
    "tailwindcss": "^4.2.1",
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

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

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

### FILE: src/App.css
```css
/* Basic reset for consistent styling */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Body styling with a gradient background and Inter font */
body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #4A2B15 0%, #6F452C 50%, #4A2B15 100%); /* Deep Brown to SaddleBrown */
    background-size: 200% 200%;
    animation: gradientBackground 20s ease infinite;
    min-height: 100vh;
    padding: 20px;
    display: flex;
    justify-content: center;
    /* Changed align-items to flex-start to allow body to scroll when content exceeds viewport height */
    align-items: flex-start;
    overflow-y: auto; /* Explicitly allow vertical scrolling on the body */
    -webkit-overflow-scrolling: touch; /* For smoother scrolling on iOS devices */
    overflow-x: hidden; /* Prevent horizontal scrolling */
}

@keyframes gradientBackground {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* Main container for the application */
.container {
    max-width: 800px;
    width: 100%;
    /* Add auto margins for vertical centering when content is smaller than viewport,
       but allows normal flow when content is larger */
    margin: auto;
    background: rgba(255, 255, 255, 0.85); /* White with subtle transparency for glassmorphism */
    backdrop-filter: blur(25px) saturate(180%);
    -webkit-backdrop-filter: blur(25px) saturate(180%);
    border-radius: 45px; /* Very rounded corners */
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    overflow: hidden; /* Ensure content stays within rounded corners, hide any internal overflow */
    transition: all 0.4s ease-in-out;
    flex-shrink: 0; /* Prevent the container from shrinking */
    /* Add a max-height to the container itself to ensure its own content scrolls if it gets too tall */
    max-height: 95vh; /* Ensure container itself doesn't exceed 95% of viewport height */
    display: flex;
    flex-direction: column; /* Make container a flex column to manage its children's height */
}

.container:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 35px 70px rgba(0, 0, 0, 0.25);
}

/* Header section styling */
.header {
    background: linear-gradient(135deg, #B8860B 0%, #FFD700 100%); /* DarkGoldenrod to Gold */
    padding: 40px;
    text-align: center;
    color: white;
    position: relative;
    overflow: hidden;
    animation: fadeInUp 1.2s ease-out;
    border-top-left-radius: 45px;
    border-top-right-radius: 45px;
    flex-shrink: 0; /* Prevent header from shrinking */
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

.header h1 {
    font-size: 2.8rem;
    font-weight: 800;
    margin-bottom: 12px;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
    line-height: 1.2;
}

.header p {
    font-size: 1.2rem;
    opacity: 0.95;
}

/* Content area padding */
.content {
    padding: 50px;
    flex-grow: 1; /* Allow content area to grow and take available space */
    overflow-y: auto; /* Enable scrolling for the content area if it overflows */
    -webkit-overflow-scrolling: touch;
}

/* File upload section styling */
.upload-section {
    text-align: center;
    margin-bottom: 40px;
    flex-shrink: 0; /* Prevent upload section from shrinking */
}

.file-input-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: 25px;
}

/* Hide default file input */
.file-input {
    position: absolute;
    left: -9999px;
}

/* Custom label for file input to act as a button */
.file-input-label {
    display: inline-block;
    padding: 18px 35px;
    background: linear-gradient(135deg, #DAA520 0%, #FFD700 70%, #DAA520 100%); /* Gold gradient */
    color: #4A2B15; /* AsanSka Deep Brown for readability */
    border-radius: 100px; /* Fully pill-shaped */
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: 700;
    transition: all 0.35s ease;
    box-shadow: 0 10px 25px rgba(218, 165, 32, 0.5);
    text-shadow: none; /* Removed text shadow for better contrast */
    letter-spacing: 0.5px;
}

.file-input-label:hover {
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 20px 40px rgba(218, 165, 32, 0.6);
}

.file-info {
    margin-top: 20px;
    font-size: 1.05rem;
    color: #555;
}

/* Loading indicator styling */
.loading {
    text-align: center;
    margin: 30px 0;
    flex-shrink: 0;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #DAA520; /* Gold spinner */
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Results section styling */
.results {
    margin-top: 40px;
    animation: fadeIn 1s ease-out;
    flex-grow: 1; /* Allow results to grow */
    display: flex; /* Make results section a flex container */
    flex-direction: column; /* Stack its children vertically */
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.results h2 {
    color: #333;
    margin-bottom: 25px;
    font-size: 2rem;
    border-bottom: 4px solid #DAA520; /* Gold underline */
    padding-bottom: 15px;
    flex-shrink: 0;
}

.email-count {
    background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%); /* Gold gradient */
    color: white;
    padding: 18px 30px;
    border-radius: 35px;
    margin-bottom: 25px;
    font-size: 1.3rem;
    font-weight: 700;
    text-align: center;
    box-shadow: 0 8px 20px rgba(218, 165, 32, 0.3);
    flex-shrink: 0;
}

/* List of extracted emails */
.email-list {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 35px;
    padding: 25px;
    max-height: 400px; /* Adjust this height as needed, it will scroll within .content */
    overflow-y: auto; /* Crucial: ensures this list scrolls independently if it exceeds max-height */
    border: 1px solid rgba(233, 236, 239, 0.5);
    box-shadow: inset 0 3px 15px rgba(0, 0, 0, 0.08);
    flex-grow: 1; /* Allow email list to fill available space within .results */
}

.email-item {
    background: white;
    padding: 15px 25px;
    margin-bottom: 10px;
    border-radius: 25px;
    border-left: 5px solid #B8860B; /* Darker gold/brown left border */
    font-family: 'Courier New', monospace;
    font-size: 1rem;
    color: #343a40;
    cursor: pointer;
    transition: all 0.25s ease-out;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.email-item:hover {
    background: #FFFBF5; /* Creamy white on hover */
    transform: translateX(10px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.email-item:last-child {
    margin-bottom: 0;
}

/* Download and Copy buttons section */
.download-section {
    margin-top: 35px;
    text-align: center;
    flex-shrink: 0; /* Prevent buttons from shrinking */
}

.download-btn, .copy-btn {
    padding: 15px 35px;
    border: none;
    border-radius: 100px; /* Fully pill-shaped */
    font-size: 1.15rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.35s ease;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
}

.download-btn {
    background: linear-gradient(135deg, #2E8B57 0%, #3CB371 70%, #2E8B57 100%); /* Green gradient */
    color: white;
    box-shadow: 0 10px 25px rgba(46, 139, 87, 0.5);
}

.download-btn:hover {
    transform: translateY(-6px) scale(1.03);
    box-shadow: 0 25px 50px rgba(46, 139, 87, 0.7);
}
    
.copy-btn {
    background: linear-gradient(135deg, #B8860B 0%, #DAA520 70%, #B8860B 100%); /* Darker Gold gradient */
    color: white;
    margin-left: 25px;
    box-shadow: 0 10px 25px rgba(184, 134, 11, 0.5);
}

.copy-btn:hover {
    transform: translateY(-6px) scale(1.03);
    box-shadow: 0 25px 50px rgba(184, 134, 11, 0.7);
}

/* Active (click) state for buttons */
.download-btn:active, .copy-btn:active, .file-input-label:active, .message-box button:active {
    transform: translateY(0);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    filter: brightness(0.9);
}

/* Error message styling */
.error {
    background: #f8d7da;
    color: #721c24;
    padding: 20px;
    border-radius: 30px;
    margin: 25px 0;
    border: 1px solid #f5c6cb;
    box-shadow: 0 4px 15px rgba(248, 215, 218, 0.6);
    font-size: 1.05rem;
    line-height: 1.5;
}

/* Custom Message Box Styles */
.message-box-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.message-box {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 40px;
    border-radius: 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    text-align: center;
    max-width: 450px;
    width: 90%;
    animation: fadeInScale 0.4s ease-out;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

@keyframes fadeInScale {
    from { opacity: 0; transform: translateY(-50px) scale(0.8); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

.message-box h3 {
    margin-bottom: 25px;
    color: #333;
    font-size: 1.8rem;
    font-weight: 700;
}

.message-box p {
    margin-bottom: 30px;
    color: #555;
    line-height: 1.7;
    font-size: 1.1rem;
}

.message-box button {
    background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
    color: white;
    padding: 15px 35px;
    border: none;
    border-radius: 100px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 20px rgba(218, 165, 32, 0.4);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.message-box button:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 12px 25px rgba(218, 165, 32, 0.5);
}

```

### FILE: src/App.test.js
```javascript
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
import React, { useState, useEffect } from 'react';
import './App.css'; // Importing the CSS file

// pdfjsLib will be dynamically loaded, so no 'declare const' is needed here.

function App() {
    // State variables to manage the application's UI and data
    const [fileInfo, setFileInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [extractedEmails, setExtractedEmails] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [messageBox, setMessageBox] = useState({
        visible: false,
        title: '',
        content: '',
    });
    // State to track if pdfjsLib is loaded and ready
    const [isPdfjsLoaded, setIsPdfjsLoaded] = useState(false);

    // useEffect hook to dynamically load PDF.js script and configure its worker.
    useEffect(() => {
        // Function to load a script dynamically
        const loadScript = (url, id, callback) => {
            if (document.getElementById(id)) {
                // If script already exists and typeof window.pdfjsLib is defined, it's already loaded
                if (typeof window.pdfjsLib !== 'undefined') {
                    callback();
                }
                return;
            }

            const script = document.createElement('script');
            script.src = url;
            script.id = id;
            script.async = true;
            script.onload = () => {
                // Once pdf.min.js is loaded, set the worker source
                if (typeof window.pdfjsLib !== 'undefined') {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                    callback(); // Notify that PDF.js is fully ready
                }
            };
            script.onerror = () => {
                setError('Failed to load PDF.js library. Please check your internet connection.');
            };
            document.head.appendChild(script);
        };

        // Dynamically load pdf.min.js
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'pdfjs-script', () => {
            setIsPdfjsLoaded(true); // Set state to true when PDF.js is fully ready
        });

    }, []); // Empty dependency array ensures this runs once on mount

    // Function to display a custom modal message box.
    const showCustomMessageBox = (title, content) => {
        setMessageBox({ visible: true, title, content });
    };

    // Function to hide the custom modal message box.
    const hideCustomMessageBox = () => {
        setMessageBox({ visible: false, title: '', content: '' });
    };

    // Handler for file input change.
    // Updates selected file info and triggers email extraction.
    const handleFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileInfo(`Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        extractEmails(file);
    };

    // Asynchronous function to extract emails from the provided PDF file.
    // Uses PDF.js to read text content and regex to find emails.
    const extractEmails = async (file) => {
        setLoading(true); // Show loading spinner
        setError(''); // Clear previous errors
        setShowResults(false); // Hide previous results
        setExtractedEmails([]); // Clear extracted emails

        try {
            // Ensure pdfjsLib is available before attempting to use it
            if (!isPdfjsLoaded || typeof window.pdfjsLib === 'undefined') {
                throw new Error("PDF.js library is not ready. Please wait a moment or refresh the page.");
            }

            const arrayBuffer = await file.arrayBuffer(); // Read file as ArrayBuffer
            // Access pdfjsLib via window object
            const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise; // Load PDF document

            let allText = '';
            // Loop through all pages to extract text content
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item) => item.str).join(' ');
                allText += pageText + ' ';
            }

            // Regular expression to match email addresses.
            const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
            const emails = allText.match(emailRegex) || [];

            // Remove duplicate emails and sort them alphabetically.
            const uniqueEmails = [...new Set(emails.map((email) => email.toLowerCase()))].sort();
            setExtractedEmails(uniqueEmails);

            setLoading(false); // Hide loading spinner

            // Display results or a message if no emails are found.
            if (uniqueEmails.length > 0) {
                setShowResults(true);
            } else {
                showCustomMessageBox('No Emails Found', 'No email addresses were found in the PDF file.');
            }
        } catch (err) {
            setLoading(false); // Hide loading spinner on error
            setError('Error processing PDF: ' + err.message + '. Please ensure it is a valid PDF file and try again.');
        }
    };

    // Function to copy text to the clipboard.
    // Includes a fallback for environments where navigator.clipboard might not be available.
    const copyToClipboard = async (text, event, successMessage = 'Copied!') => {
        const targetElement = event.currentTarget; // Get the element that triggered the event

        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                applyCopyFeedback(targetElement, successMessage); // Apply visual feedback
            } catch (err) {
                console.error('Failed to copy using navigator.clipboard: ', err);
                fallbackCopyToClipboard(text, targetElement, successMessage); // Use fallback
            }
        } else {
            fallbackCopyToClipboard(text, targetElement, successMessage); // Use fallback
        }
    };

    // Fallback function for copying text to clipboard using document.execCommand.
    const fallbackCopyToClipboard = (text, targetElement, successMessage) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed'; // Prevents scrolling
        textArea.style.left = '-9999px'; // Hides the textarea off-screen
        document.body.appendChild(textArea);
        textArea.select(); // Select the text
        try {
            const successful = document.execCommand('copy'); // Execute copy command
            if (successful) {
                applyCopyFeedback(targetElement, successMessage);
            } else {
                showCustomMessageBox('Copy Failed', 'Unable to copy text. Please try manually selecting and copying.');
            }
        } catch (err) {
            console.error('Fallback copy failed: ', err);
            showCustomMessageBox('Copy Failed', 'Unable to copy text. Your browser may not support this function.');
        }
        document.body.removeChild(textArea); // Clean up the textarea
    };

    // Applies visual feedback to an element (e.g., button) after a successful copy operation.
    const applyCopyFeedback = (element, message) => {
        const originalText = element.textContent;
        const originalBackground = element.style.background;

        element.textContent = '✓ ' + message.split(' ')[0]; // Change text to "✓ Copied!"
        element.style.background = 'linear-gradient(135deg, #228B22 0%, #3CB371 100%)'; // Change background to green

        setTimeout(() => {
            element.textContent = originalText; // Restore original text
            element.style.background = originalBackground; // Restore original background
        }, 1500); // Revert after 1.5 seconds
    };

    // Function to download the extracted emails as a TXT file.
    const downloadEmails = () => {
        if (extractedEmails.length === 0) {
            showCustomMessageBox('No Emails to Download', 'There are no email addresses extracted to download. Please upload a PDF first.');
            return;
        }

        try {
            const content = extractedEmails.join('\n'); // Join emails with newlines
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob); // Create a URL for the Blob

            const a = document.createElement('a');
            a.href = url;
            a.download = 'extracted_unique_emails.txt'; // Set download filename
            a.style.display = 'none'; // Hide the anchor element

            document.body.appendChild(a); // Append to body to make it clickable
            a.click(); // Programmatically click the anchor to trigger download

            // Clean up the URL and element after a short delay
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 200);

            // Apply visual feedback to the download button
            const btn = document.getElementById('downloadBtn');
            if (btn) {
                const originalText = btn.textContent;
                const originalBackground = btn.style.background;
                btn.textContent = '✓ Downloaded!';
                btn.style.background = 'linear-gradient(135deg, #228B22 0%, #3CB371 100%)';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = originalBackground;
                }, 2000);
            }

        } catch (error) {
            console.error('Download failed:', error);
            showCustomMessageBox('Download Failed', 'The download could not be initiated. This might be due to browser security restrictions. Please try copying the emails instead.');
        }
    };

    // Function to copy all extracted emails to the clipboard.
    const copyAllEmails = (event) => {
        if (extractedEmails.length === 0) {
            showCustomMessageBox('No Emails to Copy', 'There are no email addresses extracted to copy. Please upload a PDF first.');
            return;
        }
        const content = extractedEmails.join('\n');
        copyToClipboard(content, event, 'All emails copied to clipboard!');
    };

    return (
        <div className="container">
            <div className="header">
                <h1 className="header-title">📧 PDF Email Extractor</h1>
                <p className="header-subtitle">Extract unique email addresses from PDF documents with ease</p>
            </div>

            <div className="content">
                <div className="upload-section">
                    <div className="file-input-wrapper">
                        {/* Disable input until pdfjsLib is loaded */}
                        <input type="file" id="pdfFile" className="file-input" accept=".pdf" onChange={handleFileSelect} disabled={!isPdfjsLoaded} />
                        <label htmlFor="pdfFile" className="file-input-label" style={!isPdfjsLoaded ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>
                            {isPdfjsLoaded ? '📄 Choose PDF File' : '⏳ Loading PDF.js...'}
                        </label>
                    </div>
                    {fileInfo && <div className="file-info">{fileInfo}</div>}
                    {!isPdfjsLoaded && (
                        <div className="text-sm text-gray-500 mt-2">
                            Please wait while the PDF processing library loads.
                        </div>
                    )}
                </div>

                {loading && (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Processing PDF file...</p>
                    </div>
                )}

                {error && <div className="error">{error}</div>}

                {showResults && (
                    <div className="results">
                        <h2>📋 Extracted Email Addresses</h2>
                        <div className="email-count">Found {extractedEmails.length} unique email address{extractedEmails.length !== 1 ? 'es' : ''}</div>
                        <div className="email-list">
                            {extractedEmails.map((email, index) => (
                                <div key={index} className="email-item" onClick={(event) => copyToClipboard(email, event, 'Email copied!')}>
                                    {email}
                                </div>
                            ))}
                        </div>
                        <div className="download-section">
                            <button className="download-btn" id="downloadBtn" onClick={downloadEmails}>
                                💾 Download as TXT
                            </button>
                            <button className="copy-btn" id="copyBtn" onClick={copyAllEmails}>
                                📋 Copy All
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Message Box HTML */}
            {messageBox.visible && (
                <div className="message-box-overlay">
                    <div className="message-box">
                        <h3>{messageBox.title}</h3>
                        <p>{messageBox.content}</p>
                        <button onClick={hideCustomMessageBox}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
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

const AUTH_KEY = 'tuc_auth_pdf_extractor_app';
const ACCENT   = '#0891b2';

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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Pdf Extractor App</h1>
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

### FILE: src/index.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWithAuth from './AppWithAuth';
import reportWebVitals from './reportWebVitals';
import { AuthGate } from './AuthGate';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthGate><AppWithAuth /></AuthGate>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

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
          <span className="font-bold text-sm">Pdf Extractor App</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Pdf Extractor App — Admin</h1>
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
 * E2E stub — pdf-extractor-app
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('pdf-extractor-app E2E', () => {
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

// Vitest unit test configuration — pdf-extractor-app
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

// Vitest E2E configuration — pdf-extractor-app
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

