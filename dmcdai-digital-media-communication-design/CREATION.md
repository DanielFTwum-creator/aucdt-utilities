# CREATION.md — dmcdAI: AI in Digital Media & Communication Design
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/dmcdai-digital-media-communication-design/`
**Last verified:** 2026-04-25

---

## 1. What This App Is

dmcdAI is a **10-module AI learning sandbox** for the DMCD programme at Techbridge University College. Students log in with their `@techbridge.edu.gh` email (2FA OTP via TUC mail API), then explore interactive AI tools across 10 domains. Each module has a unique AI-powered interaction — text generation, image generation, sentiment analysis, etc. — all powered by the Gemini API. An admin panel (password-protected) provides audit logs and simulator controls.

---

## 2. Tech Stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.4** (never change) |
| Build | Vite | ^6.2.0 |
| Dev server | Express + Vite middleware | express ^4.22.1 |
| Language | TypeScript | ~5.8.2 |
| Styling | Tailwind CSS | ^4.2.2 (via `@tailwindcss/vite`) |
| AI | `@google/genai` | ^1.28.0 |
| Storage | IndexedDB (via `dbService.ts`) | — |
| Testing | Playwright | ^1.59.1 / Vitest ^3.0.0 |
| Package manager | pnpm | 10.30+ |
| Container | node:24-alpine → nginx:alpine | — |

---

## 3. Directory Structure

```
dmcdai-digital-media-communication-design/
├── index.html              # TUC brand meta, Google Fonts, inline CSS variables
├── index.css               # @import "tailwindcss" + @theme font vars
├── index.tsx               # createRoot → ThemeProvider → AuthProvider → App
├── App.tsx                 # Hash router, auth gate, module switcher
├── types.ts                # All TypeScript types
├── constants.tsx           # MODULES[] array (10 entries)
├── server.js               # Express dev server with Vite middleware + /api/send-email proxy
├── vite.config.ts          # port 3000 (via server.js), base './'
├── tsconfig.json
├── playwright.config.ts
├── vitest.config.ts
├── Dockerfile
├── nginx.conf
├── contexts/
│   ├── AuthContext.tsx     # TUC 2FA OTP + admin password auth
│   └── ThemeContext.tsx    # dark/light/high-contrast
├── components/
│   ├── Sidebar.tsx         # Left nav: 10 modules + Admin + theme switcher
│   ├── Header.tsx          # Breadcrumb + placeholder user avatar
│   ├── Dashboard.tsx       # Module card grid (10 cards)
│   ├── Admin.tsx           # Tabbed: Audit Log | Diagnostics
│   ├── LoginModal.tsx      # access (2FA) or admin (password)
│   ├── ComingSoon.tsx      # Placeholder for unimplemented module
│   └── Loader.tsx          # Spinner
├── modules/                # 10 module components (Module1_VisualDesign.tsx … Module10_Ethics.tsx)
├── services/
│   ├── auditLogService.ts  # addLog / getLogs / clearLogs → IndexedDB
│   ├── dbService.ts        # IndexedDB wrapper (singleton, DB name: dmcdAI_db)
│   ├── geminiService.ts    # Gemini API calls (generateText, generateImage, etc.)
│   └── simulationService.ts # Simulator mode toggle → IndexedDB settings
└── docs/
    ├── SRS.md
    ├── AdminGuide.md
    └── DeploymentTestingGuide.md
```

---

## 4. UI Layout

Same two-column layout as PLCRP (see PLCRP CREATION.md §4).
- Sidebar: `w-64`, title `dmcd<span gold>AI</span>` in Playfair Display
- Header: home button + module title + placeholder avatar (`picsum.photos/seed/student/40/40`)
- Unauthenticated: LoginModal only (sidebar hidden)

---

## 5. Authentication

### 5.1 Access (students) — 2FA OTP flow
1. User enters `@techbridge.edu.gh` email
2. App calls `POST /api/send-email` (proxied by `server.js` to `https://portal.aucdt.edu.gh/aucdt-dev/sendMail`)
3. OTP is stored in `pendingOtpCode` state + `window.__dmcdaiPendingOtp` (dev/automated mode)
4. User enters 6-digit OTP → `verifyOtp()` → sets `isAuthenticated = true`

### 5.2 Admin password
```
dmcdai-admin-2025-secure
```

### 5.3 Automated 2FA (for testing)
Set env var `VITE_AUTOMATED_2FA=true` **or** call `window.__dmcdaiAuto2FAEnabled = true` in browser. In this mode the email send is skipped and the OTP is available via `window.__dmcdaiPendingOtp`.

### 5.4 Session keys (sessionStorage)
```
dmcdAI-admin-session   → 'true'
dmcdAI-auth-session    → 'true'
dmcdAI-auth-email      → email string
```

### 5.5 Hash routing
Identical logic to PLCRP §5.4 — `#/admin`, `#/<module-id>`, empty hash = Dashboard.

---

## 6. 10 Modules

| # | Module ID | Title | Core Interaction |
|---|---|---|---|
| 1 | `visual-design` | AI-Driven Visual Design | Text prompt → Gemini image generation |
| 2 | `video-production` | Automated Video Production | Concept brief → AI-generated storyboard text |
| 3 | `content-creation` | Generative Content Creation | Platform + brief → blog post / social copy |
| 4 | `personalization` | Personalized Media | Audience segments → personalised copy variants |
| 5 | `storytelling` | Interactive Storytelling | User choices → branching AI narrative |
| 6 | `sentiment-analysis` | Sentiment Analysis | Text input → sentiment score + explanation |
| 7 | `ux-ui-design` | AI-Assisted UX/UI Design | Feature brief → UI component JSON / wireframe text |
| 8 | `branding` | AI in Branding Systems | Brand values → manifesto + colour palette + logo concept |
| 9 | `deepfakes` | Synthetic Media | Media description → authenticity analysis + flags |
| 10 | `ethics` | Ethics in AI Design | Scenario → ethical concern analysis (severity: Low/Medium/High) |

All modules use the same shell:
1. A textarea or structured input
2. A "Generate" button (calls Gemini via `geminiService.ts`)
3. A result display area (loading spinner → response card)
4. Error handling: `QUOTA_EXCEEDED`, `SAFETY_BLOCK`, `INVALID_KEY` → friendly messages

---

## 7. Gemini Service (services/geminiService.ts)

```typescript
// Environment
const API_KEY = process.env.API_KEY;   // injected by vite.config.ts from GEMINI_API_KEY env var

// Core function signatures:
generateText(prompt: string): Promise<string>
generateImage(prompt: string, base64?: string, mimeType?: string): Promise<string>
// Returns: image data URL or throws QUOTA_EXCEEDED / SAFETY_BLOCK / INVALID_KEY
```

When Simulator Mode is enabled (from Admin → Diagnostics), the service returns a canned response instead of calling the API.

---

## 8. IndexedDB Storage

Two object stores in `dmcdAI_db` (version 1):
- `audit_logs` — keyPath: `id` (autoIncrement). Stores `{ id, timestamp, action }`.
- `system_settings` — keyPath: `key`. Stores `{ key, value }`.

Settings keys:
```
simulator_enabled   → boolean
simulator_response  → 'SUCCESS' | 'QUOTA_EXCEEDED' | 'SAFETY_BLOCK' | 'INVALID_KEY'
```

---

## 9. Colour Tokens & Typography

Identical to PLCRP (see §10 and §11 of PLCRP CREATION.md). Theme key: `dmcdAI-theme`.

---

## 10. Admin Panel

Identical two-tab structure to PLCRP. Additional in **Diagnostics**:
- **Simulator Mode toggle** (checkbox/button) — enables/disables Gemini API mock
- **Simulator Response selector** — `SUCCESS | QUOTA_EXCEEDED | SAFETY_BLOCK | INVALID_KEY`
- **Run Diagnostic** button — 1500ms delay, appends result to audit log

---

## 11. ARIA Requirements

Same as PLCRP CREATION.md §12. Additionally:
- Module cards on Dashboard: `aria-label="Open module: {title}"` + `title="Enter {title} Module"`
- Sidebar nav buttons: `aria-label="Open {title}"` + `title="Navigate to {title}"`

---

## 12. server.js (dev server)

```javascript
// Express + Vite middleware server
// PORT: process.env.PORT || 3000
// Route: POST /api/send-email → proxies to https://portal.aucdt.edu.gh/aucdt-dev/sendMail
// All other routes → Vite middleware (serves React SPA)
```

In **production** (Docker): the Express server is NOT used. nginx serves the static `dist/` build.

---

## 13. Docker & Build

```bash
pnpm install
pnpm run build      # vite build → dist/
pnpm run dev        # node server.js (port 3000)
```

Dockerfile: identical pattern to PLCRP (node:24-alpine build → nginx:alpine). nginx.conf: same SPA fallback pattern.

---

## 14. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Build completes with zero errors |
| AC-2 | Unauthenticated users see only the LoginModal |
| AC-3 | Valid `@techbridge.edu.gh` email progresses to OTP step |
| AC-4 | Invalid email shows error containing "techbridge.edu.gh" |
| AC-5 | All 10 module cards are visible on Dashboard after login |
| AC-6 | Each module has a unique AI interaction (input → generate → result) |
| AC-7 | Simulator Mode in Admin bypasses Gemini API |
| AC-8 | Admin password `dmcdai-admin-2025-secure` grants admin access |
| AC-9 | All audit events (login, navigation, generation) appear in Admin → Audit Log |
| AC-10 | Dark / Light / High-Contrast themes work via sidebar selector |
| AC-11 | Skip link, all aria-labels, aria-current on active nav item present |
