# CREATION.md â€” PLCRP: Production-Level Content Rights Platform
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/plcrp/`
**Last verified:** 2026-04-25

---

## 1. What This App Is

PLCRP is a **content rights management SPA** for music tracks. It enforces hard stage gates on AI-generated and human-authored tracks as they progress through a 5-stage production pipeline (S1 â†’ S5). The core invariant is: **free-tier AI-generated tracks (NON_COMMERCIAL) are permanently blocked at Stage 2 and can never reach distribution**.

It is an **educational institutional sandbox** â€” all data lives in `localStorage`, there is no backend.

---

## 2. Tech Stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.5** (never change) |
| Build | Vite | ^6.2.0 |
| Language | TypeScript | ~5.8.2 |
| Styling | Tailwind CSS | ^4.2.2 (via `@tailwindcss/vite`) |
| Icons | Inline SVG only â€” no icon library | â€” |
| Testing | Playwright | ^1.59.1 |
| Package manager | pnpm | 10.30+ |
| Container | node:24-alpine â†’ nginx:alpine | â€” |

---

## 3. Directory Structure

```
plcrp/
â”œâ”€â”€ index.html              # TUC brand meta, Google Fonts, CSS variable themes
â”œâ”€â”€ index.css               # @import "tailwindcss" + @theme font vars
â”œâ”€â”€ index.tsx               # createRoot â†’ ThemeProvider â†’ AuthProvider â†’ App
â”œâ”€â”€ App.tsx                 # Hash router, auth gate, module switcher
â”œâ”€â”€ types.ts                # All TypeScript types (copy verbatim â€” see Â§6)
â”œâ”€â”€ constants.tsx           # MODULES[], STAGES[], RIGHTS_STATUS_COLORS
â”œâ”€â”€ vite.config.ts          # port 5184, base './', no API proxy
â”œâ”€â”€ tsconfig.json           # Standard TUC tsconfig (bundler resolution)
â”œâ”€â”€ playwright.config.ts    # baseURL localhost:5184, tests/ dir
â”œâ”€â”€ Dockerfile              # node:24-alpine build â†’ nginx:alpine serve
â”œâ”€â”€ nginx.conf              # SPA fallback: try_files $uri /index.html
â”œâ”€â”€ contexts/
â”‚   â”œâ”€â”€ AuthContext.tsx     # TUC 2FA + admin password (see Â§7.1)
â”‚   â””â”€â”€ ThemeContext.tsx    # dark/light/high-contrast via data-theme attr
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ Sidebar.tsx         # Left nav: Dashboard + 6 modules + Admin + theme switcher
â”‚   â”œâ”€â”€ Header.tsx          # Breadcrumb title + user email + logout button
â”‚   â”œâ”€â”€ Dashboard.tsx       # KPI strip (4 stats) + stage pipeline bar + module grid
â”‚   â”œâ”€â”€ Admin.tsx           # Tabbed: Audit Log | Diagnostics
â”‚   â”œâ”€â”€ LoginModal.tsx      # Modal: 2FA (emailâ†’OTP) or admin password
â”‚   â””â”€â”€ Loader.tsx          # Spinner with role="status" aria-live="polite"
â”œâ”€â”€ modules/
â”‚   â”œâ”€â”€ Module1_Tracks.tsx          # Track Library: table + add form
â”‚   â”œâ”€â”€ Module2_Releases.tsx        # Release bundler (blocks NON_COMMERCIAL)
â”‚   â”œâ”€â”€ Module3_RightsAudit.tsx     # Track detail + promote button (gate enforced)
â”‚   â”œâ”€â”€ Module4_StagePipeline.tsx   # Kanban columns S1â†’S5
â”‚   â”œâ”€â”€ Module5_AuthorshipRegistry.tsx  # Checkbox form: record human elements
â”‚   â””â”€â”€ Module6_Distribution.tsx   # DSP submission (COMMERCIAL S5 only)
â”œâ”€â”€ services/
â”‚   â”œâ”€â”€ auditLogService.ts  # getLogs / addLog / clearLogs â†’ localStorage
â”‚   â””â”€â”€ trackService.ts     # getTracks / saveTrack / addTrack / canPromote
â”œâ”€â”€ tests/
â”‚   â”œâ”€â”€ auth.spec.ts        # Login flow E2E
â”‚   â”œâ”€â”€ rights-gate.spec.ts # E2 (NON_COMMERCIAL blocked) + E5 (authorship gate)
â”‚   â””â”€â”€ audit-log.spec.ts   # E8 (audit chain, diagnostics panel)
â””â”€â”€ docs/
    â”œâ”€â”€ srs/plcrp_srs_v1.0.md
    â””â”€â”€ admin_guide.md
```

---

## 4. UI Layout

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  SIDEBAR (w-64, fixed)     â”‚  HEADER (h-20, sticky top) â”‚
â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€     â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€  â”‚
â”‚  PLCRP logo (Playfair)     â”‚  ðŸ  / Module title + desc   â”‚
â”‚                            â”‚  [user email]  [Sign out]   â”‚
â”‚  > Dashboard               â”‚                             â”‚
â”‚  > Track Library      â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ â”‚
â”‚  > Release Manager         â”‚  MAIN CONTENT (flex-1,      â”‚
â”‚  > Rights Audit            â”‚  overflow-y-auto, p-6 lg:p-8â”‚
â”‚  > Stage Pipeline          â”‚                             â”‚
â”‚  > Authorship Registry     â”‚  <ActiveModule />           â”‚
â”‚  > Distribution            â”‚                             â”‚
â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€          â”‚                             â”‚
â”‚  > Admin Panel             â”‚                             â”‚
â”‚                            â”‚                             â”‚
â”‚  [Theme: Dark â–¾]           â”‚                             â”‚
â”‚  Â© 2026 TUC                â”‚                             â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

Unauthenticated users see **only** the LoginModal (full-screen overlay) â€” the sidebar and header are not rendered.

---

## 5. Authentication Logic

### 5.1 Two modes

| Mode | Trigger | Mechanism |
|---|---|---|
| `access` | Default on load | TUC email (`@techbridge.edu.gh`) â†’ OTP â†’ verify |
| `admin` | Visiting `#/admin` unauthenticated, or clicking Admin in sidebar | Password prompt |

### 5.2 Session storage keys

```
plcrp-admin-session  â†’ 'true'   (sessionStorage)
plcrp-auth-session   â†’ 'true'   (sessionStorage)
plcrp-auth-email     â†’ email    (sessionStorage)
```

### 5.3 Admin password
```
plcrp-admin-2025
```

### 5.4 Hash routing logic (in App.tsx)
- `#/admin` + isAdmin â†’ show Admin module
- `#/admin` + isAuthenticated (not admin) â†’ show LoginModal (admin mode)
- `#/admin` + unauthenticated â†’ show LoginModal (access mode, redirect after login)
- `#/<module-id>` â†’ activate that module
- `#/` or empty â†’ Dashboard

---

## 6. Data Types (types.ts â€” implement verbatim)

```typescript
export type ModuleId =
  | 'tracks' | 'releases' | 'rights-audit'
  | 'stage-pipeline' | 'authorship-registry' | 'distribution';

export type RightsStatus = 'COMMERCIAL' | 'NON_COMMERCIAL' | 'PENDING' | 'DISPUTED';
export type StageId = 'S1' | 'S2' | 'S3' | 'S4' | 'S5';
export type SourcePlatform = 'suno' | 'udio' | 'original' | 'licensed' | 'sample';
export type SourceAccountTier = 'free' | 'pro' | 'enterprise';

export interface Track {
  id: string;
  title: string;
  artist: string;
  sourcePlatform: SourcePlatform;
  sourceAccountTier: SourceAccountTier;
  rightsStatus: RightsStatus;   // auto-resolved: suno/udio + free â†’ NON_COMMERCIAL
  currentStage: StageId;
  humanAuthorshipElements: number;  // 0..n; gate requires â‰¥2 at S4
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601
  auditHash: string;   // 8-char hex, recomputed on every save
}

export interface Release {
  id: string; title: string; trackIds: string[];
  distributor: string;
  status: 'draft' | 'ready' | 'submitted' | 'live';
  createdAt: string;
}

export interface AuditLog {
  id: string; timestamp: string; action: string;
  entityType?: 'track' | 'release' | 'system';
  entityId?: string;
  result?: 'allowed' | 'denied' | 'info';
}
```

---

## 7. Business Rules (implement exactly)

### 7.1 Rights auto-resolution (trackService.ts: `resolveRightsStatus`)
```
platform=suno  + tier=free        â†’ NON_COMMERCIAL
platform=udio  + tier=free        â†’ NON_COMMERCIAL
platform=original                 â†’ COMMERCIAL
platform=licensed                 â†’ COMMERCIAL
tier=pro OR tier=enterprise       â†’ COMMERCIAL
otherwise                         â†’ PENDING
```

### 7.2 Stage gate (trackService.ts: `canPromote`)
```
1. rightsStatus === 'NON_COMMERCIAL' AND currentStage === 'S2'
   â†’ blocked, reason: "Free-tier source â€” non-commercial. Cannot promote past S2."

2. currentStage === 'S4' AND humanAuthorshipElements < 2
   â†’ blocked, reason: "Insufficient human authorship elements (N/2 required)."

3. currentStage === 'S5'
   â†’ blocked, reason: "Track is already at the final stage."

4. rightsStatus !== 'COMMERCIAL'
   â†’ blocked, reason: "Rights status must be COMMERCIAL to promote."

5. Otherwise â†’ allowed
```

### 7.3 Release creation gate
- If any selected track has `rightsStatus === 'NON_COMMERCIAL'`, block the release with an error and log a `denied` audit entry.

### 7.4 Distribution module
- Only show tracks where `rightsStatus === 'COMMERCIAL' AND currentStage === 'S5'`.
- Show a separate "Blocked" section listing all `NON_COMMERCIAL` tracks with reason.

---

## 8. Seed Data (5 tracks â€” pre-loaded on first visit)

| id | title | artist | platform | tier | rights | stage | humanElements |
|---|---|---|---|---|---|---|---|
| track-001 | Neon Frequencies | Kwame Asante | original | pro | COMMERCIAL | S3 | 4 |
| track-002 | Fixture-NonCommercial-Track-001 | AI Studio | suno | free | NON_COMMERCIAL | S2 | 0 |
| track-003 | Accra Midnight | Ama Osei | licensed | enterprise | COMMERCIAL | S4 | 2 |
| track-004 | Gold Coast Drift | Kofi Mensah | udio | pro | COMMERCIAL | S5 | 3 |
| track-005 | Synthetic Horizon | AI Composer | udio | free | NON_COMMERCIAL | S1 | 0 |

> The name `Fixture-NonCommercial-Track-001` is **required** â€” Playwright tests reference it by this exact name.

---

## 9. localStorage Keys

| Key | Default | Contents |
|---|---|---|
| `plcrp-tracks` | seeded on first load | Track[] |
| `plcrp-releases` | `[]` | Release[] |
| `plcrp-audit-logs` | `[]` | AuditLog[] (max 500, newest first) |
| `plcrp-theme` | `'dark'` | `'dark' \| 'light' \| 'high-contrast'` |

---

## 10. Colour Tokens & Theme

Applied via `data-theme` attribute on `<html>`. Dark theme is the default.

```css
/* dark (default) */
--color-background-main:       #0F0C07;   /* TUC Ink */
--color-background-card:       #141210;   /* TUC Paper */
--color-background-card-hover: #1c1a17;
--color-background-input:      #0F0C07;
--color-border-card:           #1c1a17;
--color-border-input:          #2a2825;
--color-foreground:            #F2EBD9;   /* TUC Cream */
--color-foreground-muted:      #9ca3af;
--color-foreground-on-primary: #0F0C07;
--color-primary:               #C8A84B;   /* TUC Gold */
--color-primary-hover:         #b6963a;

/* light â€” swap backgrounds/foregrounds, keep gold */
/* high-contrast â€” black bg, white fg, yellow primary (#ffff00) */
```

---

## 11. Typography (Google Fonts)

```
Playfair Display  â†’ h1/h2/h3, module titles, dashboard headings
Bebas Neue        â†’ KPI numbers, stage labels (font-bebas class)
Inter             â†’ body text, labels, UI chrome
Cormorant Garamond â†’ optional editorial use
```

---

## 12. ARIA Requirements (mandatory)

- Every `<button>` must have `aria-label`
- Icons: `aria-hidden="true"` on all decorative SVGs
- Form inputs: `<label htmlFor>` paired with input `id`
- Modals: `role="dialog" aria-modal="true" aria-labelledby`
- Tab interfaces: `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`
- Skip link: `<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to main content</a>` as first child of App return
- Main landmark: `<main id="main-content">`
- Sidebar: `<aside aria-label="Main navigation">`
- Nav buttons: `aria-current="page"` on the active item
- Error messages: `role="alert" aria-live="assertive"`
- Status messages: `role="status"` or `aria-live="polite"`

---

## 13. Admin Panel (components/Admin.tsx)

Two tabs â€” **Audit Log** and **Diagnostics**.

**Audit Log tab:**
- Shows all entries from `getLogs()`, newest first
- Each row: `timestamp | action text | result badge (allowed/denied/info)`
- Refresh button + Clear All button (with `window.confirm`)
- `aria-live="polite"` on the log container

**Diagnostics tab:**
- Static gate status table (4 rows, all ACTIVE)
- "Run Diagnostic" button â†’ 1200ms timeout â†’ appends a text result to the log and shows inline
- On load: calls `addLog('Admin Panel loaded.')` with `result: 'info'`

---

## 14. Playwright Tests (tests/)

Three test files. All tests log in as admin first using the helper:
```typescript
async function loginAsAdmin(page) {
  await page.goto('/#/admin');
  await page.fill('#plcrp-admin-password', 'plcrp-admin-2025');
  await page.click('button[aria-label="Login"]');
  await expect(page.getByText(/Admin Panel/i)).toBeVisible();
}
```

**auth.spec.ts** â€” 4 tests:
1. Login modal visible on load
2. Admin login succeeds via `/#/admin`
3. Wrong password shows error
4. Non-Techbridge email rejected

**rights-gate.spec.ts** â€” 5 tests:
1. `Fixture-NonCommercial-Track-001` has `[data-test="promote-to-s3"]` disabled
2. Disabled promote button has `title` containing "Free-tier source"
3. No `[data-test*="override"]` element exists in the UI
4. A COMMERCIAL track (`Neon Frequencies`) has its promote button enabled
5. `Accra Midnight` (S4, 2 elements) is visible in Rights Audit

**audit-log.spec.ts** â€” 4 tests:
1. After admin login, audit log contains "Admin login successful"
2. Navigating to `/#/tracks` then back to admin shows "Track Library" in log
3. After visiting rights-audit, admin panel shows entries
4. Diagnostics tab shows "NON_COMMERCIAL block" text and "ACTIVE" badge

---

## 15. Docker

```dockerfile
FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm@10
COPY package.json pnpm-lock.yaml* ./
RUN CI=true pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

`nginx.conf` must have `try_files $uri $uri/ /index.html` to support hash routing on refresh.

---

## 16. Build & Run

```bash
cd plcrp
pnpm install
pnpm run dev        # http://localhost:5184
pnpm run build      # dist/
pnpm test:e2e       # Playwright (requires dev server running)
```

Expected build output: ~285 kB total (gzipped ~80 kB). No errors. No TypeScript errors.

---

## 17. Acceptance Criteria

An implementation is correct if and only if:

| # | Criterion |
|---|---|
| AC-1 | Build completes with zero errors and zero TypeScript errors |
| AC-2 | Unauthenticated visit shows LoginModal; sidebar is not rendered |
| AC-3 | `track-002` (NON_COMMERCIAL, S2) has its promote button disabled with title containing "Free-tier source" |
| AC-4 | No override control (`[data-test*="override"]`) exists anywhere in the UI |
| AC-5 | Creating a release that includes a NON_COMMERCIAL track shows an error and logs a `denied` audit entry |
| AC-6 | Distribution module shows track-004 (COMMERCIAL, S5) as eligible; track-002 appears in "Blocked" section |
| AC-7 | Setting `humanAuthorshipElements = 1` on a track at S4 blocks promotion with the correct reason text |
| AC-8 | Admin panel is accessible only via correct password; audit log records the login |
| AC-9 | All three Playwright test suites pass |
| AC-10 | Dark / Light / High-Contrast themes switch correctly via the sidebar selector |
| AC-11 | Skip-to-content link is present and focusable; all interactive elements have `aria-label` |
