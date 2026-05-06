# CREATION.md — PDF Extractor App

**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/pdf-extractor-app/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

The PDF Extractor App (`pdf-extractor-app` v0.1.0) is a **client-side PDF email-extraction utility SPA** for Techbridge University College (TUC). The user uploads a PDF; the app reads it entirely in-browser using PDF.js, walks every page's text content, and runs a regex against the concatenated string to surface unique email addresses. Results render as a click-to-copy list with bulk **Copy All** and **Download as TXT** actions.

Critically, the app **does not call any backend** to process PDFs — PDF.js is loaded from a CDN at boot, the worker is wired up to the same CDN, and the file never leaves the browser. The app is **gated by a session-storage login** (`admin` / `admin`) before the upload UI renders, and exposes a protected `/admin` route inside an inner React Router for compliance/audit dashboards. It is part of the TUC monorepo gateway, deployed via the `pdf-extractor-app` service in `docker-compose-all-apps.yml`.

---

## 2. Tech Stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.4** (never change) |
| DOM | react-dom | 19.2.4 |
| Build | Vite | 7.3.1 |
| React plugin | @vitejs/plugin-react | ^5.1.4 |
| Language | TypeScript | ^5.7.2 |
| Routing | react-router-dom | ^7.1.0 |
| Styling | Tailwind CSS | ^4.2.1 (via `@tailwindcss/vite`) + custom `App.css` |
| Icons | lucide-react | ^0.400.0 |
| PDF parsing | **pdf.js 3.11.174** (CDN: `cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js` + matching `pdf.worker.min.js`) — runtime-injected, NOT bundled |
| Web vitals | web-vitals | ^2.1.4 |
| Static server | serve | 14.2.5 |
| Unit tests | Vitest + @testing-library/react + jsdom | ^3.0.0 / ^16.3.2 / ^26.1.0 |
| Test DOM matchers | @testing-library/jest-dom | ^6.6.3 |
| User-event | @testing-library/user-event | ^14.6.1 |
| Coverage | @vitest/coverage-v8 | ^3.0.0 |
| Package manager | pnpm | 10.30.1 (declared in `packageManager`) |
| Container | node:24-alpine → nginx:alpine | — |

---

## 3. Directory Structure (verbatim)

```
pdf-extractor-app/
├── index.html
├── index.css
├── package.json                # name: pdf-extractor-app, version: 0.1.0
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── vite.config.ts              # dev port 3000, base './'
├── vitest.config.ts
├── vitest.e2e.config.ts
├── tsconfig.json
├── Dockerfile                  # node:24-alpine multi-stage → serve dist :4173
├── nginx.conf                  # SPA fallback, /health endpoint
├── DEPLOYMENT.md
├── README.md
├── public/
├── docs/
│   ├── ADMIN_GUIDE.md
│   ├── architecture.svg
│   ├── dataflow.svg
│   ├── DEPLOYMENT.md
│   ├── SRS.md
│   └── TESTING.md
└── src/
    ├── index.tsx               # createRoot + AuthGate + AppWithAuth
    ├── index.css
    ├── App.tsx                 # extractor root (~310 LOC)
    ├── App.css                 # custom styles for upload, results, message-box
    ├── App.test.js
    ├── AppWithAuth.tsx         # router with /login, /admin, /*
    ├── AuthGate.tsx
    ├── reportWebVitals.js
    ├── setupTests.js
    ├── logo.svg
    ├── vite-env.d.ts
    ├── __tests__/
    ├── components/
    │   └── ProtectedRoute.tsx
    ├── contexts/
    │   └── AuthContext.tsx
    ├── pages/
    │   ├── LoginPage.tsx
    │   └── AdminPage.tsx
    └── services/
        └── AuthService.ts
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

The file input is `disabled` and the label reads **"⏳ Loading PDF.js..."** until `isPdfjsLoaded === true`, at which point it switches to **"📄 Choose PDF File"**.

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
3. On success, `applyCopyFeedback(target, message)` flashes the button label to `"✓ Copied!"` and the background to `linear-gradient(135deg, #228B22 0%, #3CB371 100%)` for 1500 ms.

`downloadEmails()`:
- Joins `extractedEmails` with `\n`, builds `Blob([content], { type: 'text/plain;charset=utf-8' })`, creates an `<a download="extracted_unique_emails.txt">`, programmatically clicks it, then revokes the object URL after 200 ms.
- Visual feedback: button briefly shows `"✓ Downloaded!"` and the green gradient for 2000 ms.

`copyAllEmails(event)` joins the array with `\n` and pushes through `copyToClipboard` with message `"All emails copied to clipboard!"`.

---

## 9. UI Composition (`App.tsx` JSX, `App.css`)

The page uses a centred `.container` card. Section structure:

1. `.header` — purple gradient banner with `📧 PDF Email Extractor` title and subtitle `"Extract unique email addresses from PDF documents with ease"`.
2. `.upload-section` — the file input + label, plus a `.file-info` row when a file is chosen.
3. `.loading` — inline spinner with `"Processing PDF file..."` while the extraction promise is pending.
4. `.error` — red alert banner.
5. `.results` — heading `"📋 Extracted Email Addresses"`, an `.email-count` row, a vertical `.email-list` of clickable `.email-item` chips (each click copies that single address), and a `.download-section` with two buttons:
   - `#downloadBtn` `💾 Download as TXT`
   - `#copyBtn` `📋 Copy All`
6. `.message-box-overlay` / `.message-box` — modal for status messages, dismissed by an `OK` button bound to `hideCustomMessageBox()`.

The success-state gradient is `linear-gradient(135deg, #228B22 0%, #3CB371 100%)` (forest green → medium spring green).

---

## 10. Authentication

### Outer gate (`src/AuthGate.tsx`)

- **Session key:** `sessionStorage["tuc_auth_pdf_extractor_app"] === "1"`.
- **Accent colour (login icon + button):** `#0891b2` (cyan-600).
- Hard-coded credentials: `admin` / `admin`. Failure: `"Invalid credentials. Use admin / admin"`.
- Login card title: `"Pdf Extractor App"`. Footer: `"Techbridge University College · admin / admin"`.

### Inner router (`AuthContext` + `AuthService`)

- `API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'`.
- `TOKEN_KEY = 'tuc_pdf_extractor_app_token'` (analogous to other apps).
- `AuthService.login(u,p)` POSTs `${API_BASE}/api/auth/login`; persists token; `validateToken` GETs `${API_BASE}/api/auth/validate`.
- `<ProtectedRoute>` redirects unauthenticated `/admin` visits to `/login`.
- `User` shape: `{ id, username, role }`.

---

## 11. Admin Panel (`src/pages/AdminPage.tsx`)

Two-pane layout consistent with the rest of the monorepo:
- **Sidebar** `bg-[#0f172a]` slate, with a yellow `bg-[#ffcb05]` shield, app title `Pdf Extractor App`, two tabs (`overview`, `logs`), Sign-Out at the bottom.
- **Main pane** header `Pdf Extractor App — Admin · Techbridge University College · Staff Portal`.

Tabs:

1. **Overview** — six compliance tiles: `React Version 19.2.4`, `Docker Configured`, `SRS docs/SRS.md`, `Tests vitest.config.ts`, `Auth Active`, `Phase Phase 2 Complete`.
2. **Activity Log** — table of `{ id, time, action, detail }`; seeded with one `SESSION_START` entry.

All future diagnostics (e.g. PDF parse benchmarks, regex coverage tests) MUST live exclusively under `/admin`.

---

## 12. Build / Run / Test

```bash
pnpm install
pnpm run dev            # vite, port 3000
pnpm run build          # → dist/
pnpm run preview
pnpm run serve          # serve -s dist -l 3000
pnpm test
pnpm run test:ui
pnpm run test:coverage
pnpm run test:e2e
```

---

## 13. Docker

- **Dockerfile** — node:24-alpine multi-stage. Stage 1: corepack pnpm + `pnpm install --frozen-lockfile || npm install` + `pnpm run build`. Stage 2: `pnpm add -g serve`, copy `dist/`, expose **4173**, healthcheck `wget --spider http://localhost:4173/health`.
- **nginx.conf** — `listen 80; root /usr/share/nginx/html; try_files $uri $uri/ /index.html;`. Security headers: `X-Frame-Options SAMEORIGIN`, `X-Content-Type-Options nosniff`, `X-XSS-Protection 1; mode=block`, `Referrer-Policy strict-origin-when-cross-origin`. Static assets cached 1 year immutable. Gzip enabled. `/health` returns `healthy`.
- **docker-compose-all-apps.yml** — service `pdf-extractor-app`, context `./pdf-extractor-app`, dockerfile `../Dockerfile.vite`, network `tuc-network`.

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
- Colour-only state (the green gradient on success) must be paired with text feedback ("✓ Copied!" / "✓ Downloaded!").

---

## 17. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | App builds with zero TypeScript errors |
| AC-2 | `AuthGate` blocks the extractor until session login succeeds with `admin/admin` |
| AC-3 | PDF.js (3.11.174) loads from CDN at boot and the worker is wired to the matching `pdf.worker.min.js` |
| AC-4 | The file input is disabled until `isPdfjsLoaded === true`; label switches from `⏳ Loading PDF.js...` to `📄 Choose PDF File` |
| AC-5 | Choosing a PDF triggers `extractEmails`, which iterates `pdf.numPages` and concatenates `getTextContent` results |
| AC-6 | The email regex `/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g` is used to find addresses |
| AC-7 | Results are deduplicated case-insensitively and sorted alphabetically |
| AC-8 | "No Emails Found" message-box appears when extraction yields zero matches |
| AC-9 | Single-email click and `Copy All` button both copy via `navigator.clipboard` with execCommand fallback |
| AC-10 | `Download as TXT` produces `extracted_unique_emails.txt` with one email per line |
| AC-11 | `/admin` is protected; unauthenticated visits redirect to `/login` |
| AC-12 | Admin Overview shows the six compliance tiles in §11 |
| AC-13 | Dockerfile produces a healthy image; `/health` returns `healthy` |
| AC-14 | Service appears under `pdf-extractor-app:` in `docker-compose-all-apps.yml` on `tuc-network` |
| AC-15 | No PDF bytes are uploaded to any server — extraction stays local to the browser |
| AC-16 | Institution name in any new chrome is **Techbridge University College** / **TUC** |
| AC-17 | Tests run via `pnpm test`; coverage achievable via `pnpm test:coverage` |
