# what-color-is-your-parachute-personality-quiz - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for what-color-is-your-parachute-personality-quiz.

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
﻿# CREATION.md â€” What Colour Is Your Parachute? Personality Quiz
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/what-color-is-your-parachute-personality-quiz/`
**Last verified:** 2026-04-25

---

## 1. What This App Is

A 3-phase personality quiz based on the *What Colour Is Your Parachute?* career-guidance framework. Users work through two selection phases, then receive a personalised archetype reveal. No backend, no login wall â€” the quiz is fully public. An admin panel is hidden behind a footer link.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.5** |
| Build | Vite | ^6 |
| Language | TypeScript | ~5.8 |
| Styling | Tailwind CSS | ^4.2 |
| Package manager | pnpm | 10.30+ |
| Container | node:24-alpine â†’ nginx:alpine | â€” |

---

## 3. Directory Structure

```
src/
â”œâ”€â”€ App.tsx               # 3-phase state machine + admin overlay
â”œâ”€â”€ main.tsx              # createRoot â†’ App
â”œâ”€â”€ types.ts              # Trait, Profile interfaces
â”œâ”€â”€ constants.ts          # PREDEFINED_TRAITS[] (27 traits with emoji)
â”œâ”€â”€ index.css             # Tailwind + CSS custom properties
â””â”€â”€ components/
    â”œâ”€â”€ Phase1.tsx        # Trait token pool (multi-select, click to toggle)
    â”œâ”€â”€ Phase2.tsx        # Refine selection from Phase 1 picks
    â””â”€â”€ TraitPool.tsx     # Reusable token grid component
```

---

## 4. Data Types (implement verbatim)

```typescript
export interface Trait {
  id: string;
  label: string;
  emoji: string;
  accentColor?: string;
  tagline?: string;
  description?: string;
  shadowSide?: string;
  careerSuggestions?: string[];
}

export interface Profile {
  id?: string;
  top10: Trait[];
  top3: Trait[];
  createdAt?: string;
}
```

---

## 5. 27 Predefined Traits (constants.ts â€” use these exact IDs and labels)

```
creative/ðŸŽ¨  analytical/ðŸ”¬  empathetic/ðŸ’›  ambitious/ðŸš€  adventurous/ðŸ§­
organized/ðŸ“‹  curious/ðŸ”  loyal/ðŸ›¡ï¸  visionary/ðŸŒ…  humorous/ðŸ˜„
strategic/â™Ÿï¸  nurturing/ðŸŒ¿  independent/ðŸ¦…  disciplined/âš–ï¸  passionate/ðŸ”¥
resilient/ðŸ’ª  intuitive/âœ¨  collaborative/ðŸ¤  authentic/ðŸªž  patient/ðŸ•Šï¸
bold/âš¡  thoughtful/ðŸ“š  optimistic/ðŸŒˆ  competitive/ðŸ†  compassionate/â¤ï¸
innovative/ðŸ’¡  grounded/ðŸŒ
```

---

## 6. Quiz Flow (3 phases, managed in App.tsx state)

```
phase: 'phase1' | 'phase2' | 'reveal'
selectedTraits: Trait[]    (built up across phases)
```

| Phase | What happens |
|---|---|
| **Phase 1** | Show all 27 traits as clickable tokens. User picks any number. "Continue" â†’ Phase 2. |
| **Phase 2** | Show only the Phase 1 selections. User narrows down to their top picks. "Reveal" â†’ Phase 3. |
| **Phase 3 (reveal)** | Show personality archetype card derived from final selections. "Start Over" button resets to Phase 1. |

The archetype is derived from the `top3` traits â€” display their labels, emojis, taglines, and careerSuggestions.

---

## 7. Admin Panel

Inline (no separate component file) inside `App.tsx`.

```
ADMIN_PASSWORD = [REDACTED_CREDENTIAL]
ADMIN_SESSION_KEY = 'parachute-quiz-admin'   (sessionStorage)
AUDIT_LOG_KEY = 'parachute-quiz-audit'       (localStorage, max 200)
```

**Access:** Footer button labelled "Admin" â†’ `window.location.hash = '#/admin'`

**AuditEntry interface:**
```typescript
interface AuditEntry { id: string; timestamp: string; action: string; details?: string; }
```

**Audit events to log:**
- `ADMIN_LOGIN_SUCCESS`, `ADMIN_LOGIN_FAIL`, `ADMIN_LOGOUT`
- `DIAGNOSTIC_RUN` (with details: `localStorage: PASS` or `FAIL`)

**AdminDashboard two tabs:**
- Audit Log: table with timestamp / action / details columns
- Diagnostics: "LocalStorage Access" test â†’ writes `__diag__` key â†’ removes it â†’ PASS/FAIL badge

---

## 8. CSS Custom Properties (Tailwind config)

```css
/* Light mode (default) */
--color-bg:           #FAFAF8;
--color-surface:      #F0EDE8;
--color-text-main:    #1A1A1A;
--color-text-dim:     #6B6B6B;
--color-border:       #E0DDD8;
--color-accent:       #8B4513;   /* warm brown â€” parachute theme */
```

Apply via `bg-bg`, `text-text-main`, `text-accent` etc. using Tailwind's `@theme` mapping.

---

## 9. ARIA Requirements

- Phase indicator `<h2>`: `aria-live="polite"`
- Phase 3 reveal region: `role="region" aria-label="Phase 3: Reveal"`
- "Start Over" button: `aria-label="Restart quiz from beginning"`
- Admin modal: `role="dialog" aria-modal="true" aria-labelledby`
- Admin tab buttons: `role="tab" aria-selected`
- Footer admin button: `aria-label="Open admin dashboard"`
- All error messages: `role="alert"`

---

## 10. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Build is error-free |
| AC-2 | Phase 1 shows all 27 trait tokens as clickable elements |
| AC-3 | Phase 2 shows only the traits selected in Phase 1 |
| AC-4 | Phase 3 displays archetype based on final selections |
| AC-5 | "Start Over" resets to Phase 1 with empty selection |
| AC-6 | Footer "Admin" link opens admin login modal |
| AC-7 | Password `admin123` grants access; wrong password shows error |
| AC-8 | Audit log records login/logout/diagnostic events |
| AC-9 | All interactive elements have aria-label; phase indicator has aria-live |

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
CMD ["nginx", "-g", "daemon off;"]

```

### FILE: docs/admin_guide.md
```md
# Admin Guide — What Colour Is Your Parachute? Personality Quiz

## Access
Navigate to `/#/admin` or click "Admin" in the footer.

**Password:** `admin123`

## Features
- **Audit Log tab:** All quiz navigation and admin events stored in localStorage key `parachute-quiz-audit`.
- **Diagnostics tab:** System health check simulation.

## Resetting
Clear `parachute-quiz-audit` in DevTools → Application → localStorage to purge audit logs.

```

### FILE: docs/srs/srs_v1.0.md
```md
﻿# IEEE SRS â€” What Colour Is Your Parachute? Personality Quiz
**Version:** 1.0.0 (as-built)
**Institution:** Techbridge University College
**Status:** Active

## 1. Introduction
A 3-phase personality quiz based on the *What Colour Is Your Parachute?* framework. Users select trait tokens across two phases, then receive a personalised archetype reveal.

## 2. Scope
Single-page React application. No backend required. State lives in React hooks; no persistence between sessions.

## 3. Functional Requirements
| ID | Requirement |
|---|---|
| FR-1 | Phase 1: user selects from a trait pool (multi-select tokens) |
| FR-2 | Phase 2: user refines selections from chosen set |
| FR-3 | Phase 3: system reveals personality archetype based on selected traits |
| FR-4 | User can restart quiz at any time |
| FR-5 | Admin panel accessible via `#/admin` with password `admin123` |
| FR-6 | Audit log of quiz events stored in localStorage |

## 4. Non-Functional Requirements
- ARIA 100% coverage on all interactive elements
- Responsive: mobile-first Tailwind layout
- React 19.2.5

## 5. Architecture
- **Framework:** Vite + React + TypeScript
- **Styling:** Tailwind CSS 4
- **State:** useState + useCallback
- **Admin:** `#/admin` hash route â†’ AdminLoginModal â†’ AdminDashboard

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
    <meta property="og:title" content="My Google AI Studio App" />
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
    <meta name="twitter:title" content="My Google AI Studio App" />
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
    <title>My Google AI Studio App</title>
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
  "name": "What Color Is Your Parachute? Personality Quiz",
  "description": "A personality assessment tool that guides users through a structured three-phase quiz to identify their core personality traits and generate a personalized profile.",
  "requestFramePermissions": [],
  "majorCapabilities": []
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
    "dev": "tsx server.ts",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit",
    "start": "node dist/server.cjs"
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
    "motion": "^12.23.24"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "@types/express": "^4.17.21"
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

View your app in AI Studio: https://ai.studio/apps/b13f0df9-bcb3-4cfb-9716-dd9ea9085d89

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: server.ts
```typescript
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API routes
  app.get("/api/traits", (req, res) => {
    res.json([]); // Placeholder
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

```

### FILE: src/App.tsx
```typescript
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Trait } from './types';
import Phase1 from './components/Phase1';
import Phase2 from './components/Phase2';

// ── Admin ─────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]
const ADMIN_SESSION_KEY = 'parachute-quiz-admin';
const AUDIT_LOG_KEY = 'parachute-quiz-audit';
interface AuditEntry { id: string; timestamp: string; action: string; details?: string; }
function getAuditLogs(): AuditEntry[] { try { return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]'); } catch { return []; } }
function appendAuditLog(action: string, details?: string) {
  const logs = getAuditLogs();
  logs.unshift({ id: Date.now().toString(), timestamp: new Date().toISOString(), action, details });
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs.slice(0, 200)));
}
function AdminLoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [pwd, setPwd] = useState(''); const [error, setError] = useState('');
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (pwd === ADMIN_PASSWORD) { sessionStorage.setItem(ADMIN_SESSION_KEY, 'true'); appendAuditLog('ADMIN_LOGIN_SUCCESS'); onSuccess(); } else { appendAuditLog('ADMIN_LOGIN_FAIL'); setError('Invalid password.'); setPwd(''); } };
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="admin-login-title" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-2xl">
        <h2 id="admin-login-title" className="text-lg font-bold mb-6 text-gray-900">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label htmlFor="admin-pwd" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="admin-pwd" type="password" value={pwd} onChange={e => { setPwd(e.target.value); setError(''); }} autoFocus required aria-describedby={error ? 'admin-err' : undefined} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            {error && <p id="admin-err" role="alert" className="mt-1 text-xs text-red-500">{error}</p>}</div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-accent text-white py-2 rounded-md text-sm font-semibold hover:opacity-90">Authenticate</button>
            <button type="button" onClick={onClose} className="px-4 border border-gray-300 text-gray-600 py-2 rounded-md text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [logs, setLogs] = useState<AuditEntry[]>([]); const [tab, setTab] = useState<'logs'|'diagnostics'>('logs'); const [storageTest, setStorageTest] = useState<'idle'|'pass'|'fail'>('idle');
  useEffect(() => { setLogs(getAuditLogs()); }, []);
  const handleLogout = () => { appendAuditLog('ADMIN_LOGOUT'); sessionStorage.removeItem(ADMIN_SESSION_KEY); onClose(); };
  const runStorageTest = () => { try { localStorage.setItem('__diag__','1'); localStorage.removeItem('__diag__'); setStorageTest('pass'); appendAuditLog('DIAGNOSTIC_RUN','localStorage: PASS'); } catch { setStorageTest('fail'); appendAuditLog('DIAGNOSTIC_RUN','localStorage: FAIL'); } };
  return (
    <div role="main" aria-label="Admin Dashboard" className="fixed inset-0 z-50 bg-bg overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-6 text-text-main">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <h1 className="text-xl font-bold">Admin Dashboard — Personality Quiz</h1>
          <button onClick={handleLogout} aria-label="Logout from admin" className="px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200">Logout</button>
        </div>
        <div role="tablist" aria-label="Admin sections" className="flex gap-2">
          {(['logs','diagnostics'] as const).map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium ${tab===t?'bg-accent text-white':'bg-surface text-text-dim hover:text-text-main'}`}>{t==='logs'?'Audit Log':'Diagnostics'}</button>)}
        </div>
        {tab==='logs' && <section aria-label="Audit log"><table className="w-full text-sm border border-border rounded-lg overflow-hidden" aria-label="Admin activity log"><thead className="bg-surface"><tr><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-text-dim">Timestamp</th><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-text-dim">Action</th><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-text-dim">Details</th></tr></thead><tbody className="divide-y divide-border">{logs.length===0?<tr><td colSpan={3} className="px-4 py-8 text-center text-text-dim">No entries yet.</td></tr>:logs.map(l=><tr key={l.id}><td className="px-4 py-2 text-text-dim text-xs">{new Date(l.timestamp).toLocaleString()}</td><td className="px-4 py-2 text-accent font-mono text-xs">{l.action}</td><td className="px-4 py-2 text-text-dim text-xs">{l.details||'—'}</td></tr>)}</tbody></table></section>}
        {tab==='diagnostics' && <section aria-label="System diagnostics" className="space-y-4"><div className="flex items-center justify-between p-4 bg-surface border border-border rounded-lg"><div><p className="text-sm font-medium">LocalStorage Access</p><p className="text-xs text-text-dim">Verifies browser storage</p></div><div className="flex items-center gap-3">{storageTest!=='idle'&&<span role="status" className={`text-xs font-bold px-2 py-1 rounded ${storageTest==='pass'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{storageTest.toUpperCase()}</span>}<button onClick={runStorageTest} className="px-3 py-1.5 bg-bg border border-border text-accent rounded text-xs font-medium hover:bg-surface">Run Test</button></div></div></section>}
      </div>
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState(1);
  const [top10, setTop10] = useState<Trait[]>([]);
  const [top3, setTop3] = useState<Trait[]>([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const check = () => { if (window.location.hash === '#/admin') { sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true' ? setShowAdmin(true) : setShowAdminLogin(true); } };
    check(); window.addEventListener('hashchange', check); return () => window.removeEventListener('hashchange', check);
  }, []);
  const handleAdminClose = useCallback(() => { setShowAdmin(false); window.location.hash = ''; }, []);

  const addTrait = (trait: Trait) => {
    if (top10.length < 10 && !top10.find(t => t.id === trait.id)) {
      setTop10([...top10, trait]);
    }
  };

  const removeTrait = (trait: Trait) => {
    setTop10(top10.filter(t => t.id !== trait.id));
  };

  const moveTrait = (index: number, direction: number) => {
    const newTop10 = [...top10];
    const item = newTop10.splice(index, 1)[0];
    newTop10.splice(index + direction, 0, item);
    setTop10(newTop10);
  };

  const toggleTraitInTop3 = (trait: Trait) => {
    if (top3.find(t => t.id === trait.id)) {
      setTop3(top3.filter(t => t.id !== trait.id));
    } else if (top3.length < 3) {
      setTop3([...top3, trait]);
    }
  };

  return (
    <>
    {showAdmin && <AdminDashboard onClose={handleAdminClose} />}
    {showAdminLogin && <AdminLoginModal onClose={() => { setShowAdminLogin(false); window.location.hash = ''; }} onSuccess={() => { setShowAdminLogin(false); setShowAdmin(true); }} />}
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-md">Skip to main content</a>
    <main id="main-content" className="min-h-screen bg-bg text-text-main flex flex-col">
      <header className="px-12 pt-10 pb-6 flex justify-between items-end" role="banner">
        <div className="brand-group">
          <h1 className="text-[72px] font-extrabold leading-[0.9] -tracking-[2px] uppercase">Which traits define you?</h1>
          <p className="font-mono text-xs text-accent mt-3 uppercase tracking-[2px]">Identify your core personality markers</p>
        </div>
        <div className="phase-indicator text-right">
          <h2 className="text-sm uppercase tracking-[2px] text-text-dim" aria-live="polite">Phase 0{phase} / 03</h2>
          <p className="text-xs text-accent">Selection (Top 10)</p>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-[1fr,320px] gap-6 px-12 pb-12 overflow-hidden">
      {phase === 1 && (
        <Phase1
          selected={top10}
          onAdd={addTrait}
          onRemove={removeTrait}
          onMove={moveTrait}
          onNext={() => setPhase(2)}
        />
      )}
      {phase === 2 && (
        <Phase2
          top10={top10}
          selectedTop3={top3}
          onToggle={toggleTraitInTop3}
          onNext={() => setPhase(3)}
        />
      )}
      {phase === 3 && (
        <div className="flex flex-col gap-6" role="region" aria-label="Phase 3: Reveal">
          <h2 className="text-2xl font-bold">Your Top Traits</h2>
          <div className="flex gap-4">
            {top3.map(t => <div key={t.id} className="p-4 bg-surface border border-border" aria-label={`Trait: ${t.label}`}>{t.label}</div>)}
          </div>
          <button onClick={() => { setPhase(1); setTop10([]); setTop3([]); }} className="btn" aria-label="Restart quiz from beginning">Start Over</button>
        </div>
      )}
      </div>
      <footer className="text-center py-3 text-xs text-text-dim border-t border-border">
        <button type="button" onClick={() => { window.location.hash = '#/admin'; }} aria-label="Open admin dashboard" className="hover:text-text-main transition-colors">Admin</button>
      </footer>
    </main>
    </>
  );
}

```

### FILE: src/components/Phase1.tsx
```typescript
import { Trait } from '../types';
import TraitPool from './TraitPool';
import { ChevronUp, ChevronDown, X } from 'lucide-react';

export default function Phase1({
  selected,
  onAdd,
  onRemove,
  onMove,
  onNext
}: {
  selected: Trait[],
  onAdd: (t: Trait) => void,
  onRemove: (t: Trait) => void,
  onMove: (index: number, direction: number) => void,
  onNext: () => void
}) {
  return (
    <>
      <section className="trait-library bg-surface rounded-3xl border border-border p-8 flex flex-col gap-6 overflow-hidden">
        <TraitPool onSelect={onAdd} />
      </section>
      <section className="selection-sidebar flex flex-col gap-4">
        <div className="rank-list bg-surface rounded-3xl border border-border p-6 flex-1 flex flex-col gap-2">
           <h3 className="text-xs uppercase tracking-[1px] text-text-dim mb-2">Ranked Traits</h3>
           <ul className="flex flex-col gap-2 overflow-y-auto">
             {selected.map((t, i) => (
               <li key={t.id} className="rank-item filled flex items-center gap-3 bg-white/5 border border-border rounded-lg px-3 h-10 text-xs">
                 <span className="font-mono text-accent w-4 mr-3">{String(i + 1).padStart(2, '0')}</span>
                 <span className="text-lg">{t.emoji}</span>
                 <span className="flex-1">{t.label}</span>
                 <button onClick={() => onMove(i, -1)} disabled={i === 0}>▲</button>
                 <button onClick={() => onMove(i, 1)} disabled={i === selected.length - 1}>▼</button>
                 <button onClick={() => onRemove(t)}>✕</button>
               </li>
             ))}
             {Array.from({ length: 10 - selected.length }).map((_, i) => (
                <div key={i} className="rank-item h-10 border border-dashed border-border rounded-lg px-3 flex items-center text-xs text-text-dim">
                  <span className="font-mono text-accent w-4 mr-3">{String(selected.length + i + 1).padStart(2, '0')}</span>
                </div>
             ))}
           </ul>
        </div>
        <div className="action-panel flex flex-col gap-3">
           <div className="flex justify-between text-xs mb-1">
             <span className="text-text-dim">Selection Progress</span>
             <span className="font-bold">{selected.length}/10</span>
           </div>
           <div className="progress-bar h-1 bg-border rounded-full overflow-hidden">
             <div className="progress-fill h-full bg-accent" style={{width: `${(selected.length/10)*100}%`}}></div>
           </div>
           {selected.length === 10 ? (
             <button onClick={onNext} className="btn bg-text-main text-bg p-4 rounded-xl font-bold uppercase tracking-[1px] text-sm cursor-pointer w-full">Choose My Top 3</button>
           ) : (
             <button className="btn disabled bg-border text-text-dim p-4 rounded-xl font-bold uppercase tracking-[1px] text-sm w-full cursor-not-allowed">Choose My Top 3</button>
           )}
        </div>
      </section>
    </>
  );
}

```

### FILE: src/components/Phase2.tsx
```typescript
import { Trait } from '../types';

export default function Phase2({
  top10,
  selectedTop3,
  onToggle,
  onNext
}: {
  top10: Trait[],
  selectedTop3: Trait[],
  onToggle: (t: Trait) => void,
  onNext: () => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Phase 2: Refinement</h2>
      <p className="text-text-dim">Select your Top 3 from your Top 10.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {top10.map(t => {
          const isSelected = selectedTop3.find(s => s.id === t.id);
          return (
            <button
              key={t.id}
              onClick={() => onToggle(t)}
              className={`p-4 rounded-xl border ${isSelected ? 'border-accent bg-accent text-white' : 'border-border bg-surface text-text-main'} hover:border-text-dim`}
            >
              <div className="text-4xl mb-2">{t.emoji}</div>
              <div className="font-bold">{t.label}</div>
            </button>
          );
        })}
      </div>
      
      {selectedTop3.length === 3 && (
        <button onClick={onNext} className="btn bg-text-main text-bg p-4 rounded-xl font-bold uppercase tracking-[1px] text-sm mt-6 w-full max-w-sm">Reveal My Parachute</button>
      )}
    </div>
  );
}

```

### FILE: src/components/TraitPool.tsx
```typescript
import { useState } from 'react';
import React from 'react';
import { PREDEFINED_TRAITS } from '../constants';
import { Trait } from '../types';
import { Search } from 'lucide-react';

export default function TraitPool({ onSelect }: { onSelect: (trait: Trait) => void }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTraits = PREDEFINED_TRAITS.filter(t => 
    t.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      // Check if it exists
      const exists = PREDEFINED_TRAITS.find(t => t.label.toLowerCase() === searchTerm.toLowerCase());
      if (!exists) {
        onSelect({ id: searchTerm.toLowerCase().replace(/\s+/g, '-'), label: searchTerm, emoji: '⭐' });
        setSearchTerm('');
      }
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search for traits or type to add custom..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="search-bar w-full bg-white/5 border border-border p-4 rounded-xl text-lg text-text-main"
      />
      <div className="trait-grid grid grid-cols-4 gap-3 overflow-y-auto">
        {filteredTraits.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className="trait-card flex items-center gap-3 p-4 border border-border bg-white/[0.02] rounded-xl cursor-pointer hover:bg-white/5 hover:border-text-dim"
          >
            <span className="trait-emoji text-xl text-text-main">{t.emoji}</span>
            <span className="trait-name text-sm font-medium">{t.label}</span>
          </button>
        ))}
      </div>
      <p style={{color: 'var(--color-text-dim)', fontSize: '11px'}}>Displaying {filteredTraits.length} of {PREDEFINED_TRAITS.length} standard traits. Press Enter to add as a custom trait.</p>
    </>
  );
}

```

### FILE: src/constants.ts
```typescript
import { Trait } from './types';

export const PREDEFINED_TRAITS: Trait[] = [
  { id: 'creative', label: 'Creative', emoji: '🎨' },
  { id: 'analytical', label: 'Analytical', emoji: '🔬' },
  { id: 'empathetic', label: 'Empathetic', emoji: '💛' },
  { id: 'ambitious', label: 'Ambitious', emoji: '🚀' },
  { id: 'adventurous', label: 'Adventurous', emoji: '🧭' },
  { id: 'organized', label: 'Organized', emoji: '📋' },
  { id: 'curious', label: 'Curious', emoji: '🔍' },
  { id: 'loyal', label: 'Loyal', emoji: '🛡️' },
  { id: 'visionary', label: 'Visionary', emoji: '🌅' },
  { id: 'humorous', label: 'Humorous', emoji: '😄' },
  { id: 'strategic', label: 'Strategic', emoji: '♟️' },
  { id: 'nurturing', label: 'Nurturing', emoji: '🌿' },
  { id: 'independent', label: 'Independent', emoji: '🦅' },
  { id: 'disciplined', label: 'Disciplined', emoji: '⚖️' },
  { id: 'passionate', label: 'Passionate', emoji: '🔥' },
  { id: 'resilient', label: 'Resilient', emoji: '💪' },
  { id: 'intuitive', label: 'Intuitive', emoji: '✨' },
  { id: 'collaborative', label: 'Collaborative', emoji: '🤝' },
  { id: 'authentic', label: 'Authentic', emoji: '🪞' },
  { id: 'patient', label: 'Patient', emoji: '🕊️' },
  { id: 'bold', label: 'Bold', emoji: '⚡' },
  { id: 'thoughtful', label: 'Thoughtful', emoji: '📚' },
  { id: 'optimistic', label: 'Optimistic', emoji: '🌈' },
  { id: 'competitive', label: 'Competitive', emoji: '🏆' },
  { id: 'compassionate', label: 'Compassionate', emoji: '❤️' },
  { id: 'innovative', label: 'Innovative', emoji: '💡' },
  { id: 'grounded', label: 'Grounded', emoji: '🌍' },
  { id: 'expressive', label: 'Expressive', emoji: '🎭' },
  { id: 'methodical', label: 'Methodical', emoji: '🗂️' },
  { id: 'charismatic', label: 'Charismatic', emoji: '🌟' },
  { id: 'protective', label: 'Protective', emoji: '🧱' },
  { id: 'spiritual', label: 'Spiritual', emoji: '🕯️' },
  { id: 'pragmatic', label: 'Pragmatic', emoji: '🔧' },
  { id: 'idealistic', label: 'Idealistic', emoji: '🌠' },
  { id: 'determined', label: 'Determined', emoji: '🎯' },
  { id: 'reflective', label: 'Reflective', emoji: '🪷' },
  { id: 'leader', label: 'Leader', emoji: '👑' },
  { id: 'peacemaker', label: 'Peacemaker', emoji: '☮️' },
  { id: 'maverick', label: 'Maverick', emoji: '🃏' },
  { id: 'stoic', label: 'Stoic', emoji: '🗿' },
];

```

### FILE: src/index.css
```css
@import "tailwindcss";

@theme {
  --color-bg: #080810;
  --color-surface: #12121e;
  --color-border: #2a2a3a;
  --color-text-main: #ffffff;
  --color-text-dim: #8e8e9e;
  --color-accent: #ff4e00;
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'Courier New', monospace;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text-main);
  font-family: var(--font-sans);
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

### FILE: src/types.ts
```typescript
export interface Trait {
  id: string;
  label: string;
  emoji: string;
  accentColor?: string;
  tagline?: string;
  description?: string;
  shadowSide?: string;
  careerSuggestions?: string[];
}

export interface Profile {
  id?: string;
  top10: Trait[];
  top3: Trait[];
  createdAt?: string;
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
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});

```

