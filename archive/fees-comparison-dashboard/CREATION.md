# CREATION.md â€” Fees Comparison Dashboard (Ghana University Fees Dashboard)
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/fees-comparison-dashboard/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

The Fees Comparison Dashboard (`ghana-university-fees-dashboard` v0.0.0, public-facing brand: **EduData Ghana**) is a **client-side analytics SPA** that lets prospective students, parents, and researchers compare tuition fees across public and private universities in Ghana. The dashboard renders a Recharts vertical bar chart over three mutually exclusive student cohorts:

- **Undergraduate** â€” freshman vs continuing fees per institution.
- **International** â€” converted (USD Ã— 15 cedi) fees for African and non-African applicants.
- **Postgraduate** â€” Master/MPhil/MBA/PhD/MBA programmes.

Beyond the public dashboard, a **password-gated Admin Panel** lets authorised staff (a) edit fees in-place and (b) view the audit log, security/credential settings, and a system-health placeholder. All data lives in React `useState` providers â€” there is **no backend API** in the current build (a `backend/` workspace placeholder exists for future API work).

The service is wired into the TUC monorepo and ships as a Tomcat WAR (`fees-comparison-dashboard` is in the WAR-deployment list) and as a Docker image served by `serve` on port 4173.

---

## 2. Tech Stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.5** (never change) |
| DOM | react-dom | 19.2.5 |
| react-is | react-is | ^18.2.0 |
| Build | Vite | 7.3.1 |
| Vite plugin | @vitejs/plugin-react | ^5.1.1 |
| Language | TypeScript | ~5.9.3 |
| Styling | Tailwind CSS | ^4.2.2 (via `@tailwindcss/vite`) |
| Charts | Recharts | ^3.5.0 |
| Routing | react-router-dom | ^7.1.0 (declared, used minimally) |
| Icons | lucide-react | ^0.400.0 |
| Static server | serve | 14.2.5 |
| Unit tests | Vitest + @testing-library/react + jsdom | ^3.0.0 / ^16.3.2 / ^26.1.0 |
| Jest-DOM | @testing-library/jest-dom | ^6.6.3 |
| User events | @testing-library/user-event | ^14.6.1 |
| prop-types | prop-types | ^15.8.1 |
| Node types | @types/node | ^24.10.1 |
| Package manager | pnpm | 10.30.1 (declared in `packageManager`) |
| Container | node:24-alpine â†’ nginx:alpine (or `serve` on 4173) | â€” |

---

## 3. Directory Structure (verbatim)

```
fees-comparison-dashboard/
â”œâ”€â”€ index.html                  # EduData Ghana brand, fonts
â”œâ”€â”€ index.tsx                   # createRoot â†’ <App />
â”œâ”€â”€ index.css                   # Tailwind directives
â”œâ”€â”€ App.tsx                     # ThemeProvider â†’ AuthProvider â†’ DataProvider â†’ MainContent (Header + view switch)
â”œâ”€â”€ types.ts                    # Verbatim type contract â€” see Â§6
â”œâ”€â”€ package.json                # name: ghana-university-fees-dashboard
â”œâ”€â”€ pnpm-lock.yaml
â”œâ”€â”€ pnpm-workspace.yaml         # includes ./, ./backend
â”œâ”€â”€ vite.config.ts              # dev port 3000, base './'
â”œâ”€â”€ tsconfig.json
â”œâ”€â”€ vitest.config.ts
â”œâ”€â”€ vitest.e2e.config.ts
â”œâ”€â”€ Dockerfile                  # node:24-alpine builder; runtime serve dist on 4173
â”œâ”€â”€ Dockerfile.prod
â”œâ”€â”€ nginx.conf                  # SPA fallback try_files $uri /index.html
â”œâ”€â”€ .env.local                  # GEMINI_API_KEY (legacy AI Studio export)
â”œâ”€â”€ .npmrc
â”œâ”€â”€ .dockerignore
â”œâ”€â”€ DEPLOYMENT.md
â”œâ”€â”€ README.md
â”œâ”€â”€ SRS.md                      # IEEE SRS v1.1
â”œâ”€â”€ metadata.json
â”œâ”€â”€ public/                     # static assets
â”œâ”€â”€ docs/                       # architecture diagrams, deployment guide
â”œâ”€â”€ migrations/                 # placeholder for backend SQL migrations
â”œâ”€â”€ backend/                    # workspace placeholder (no live API yet)
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ FeesComparisonDashboard.tsx   # Public tab + chart + insights
â”‚   â””â”€â”€ AdminPanel.tsx                # Login, Logs, Data Mgmt, Security, Health tabs
â”œâ”€â”€ contexts/
â”‚   â”œâ”€â”€ ThemeContext.tsx        # light | dark | high-contrast â†’ body class
â”‚   â”œâ”€â”€ AuthContext.tsx         # in-memory password + audit log
â”‚   â””â”€â”€ DataContext.tsx         # seeded fees data + updateFee()
â”œâ”€â”€ src/                        # legacy React Scripts artefacts (kept for fallback)
â”‚   â”œâ”€â”€ AuthGate.jsx
â”‚   â”œâ”€â”€ components/, contexts/, services/, pages/
â”‚   â”œâ”€â”€ __tests__/
â”‚   â””â”€â”€ index.js
â””â”€â”€ WEB-INF/                    # Tomcat context for WAR deploy
```

The **canonical entry tree** is `index.tsx â†’ App.tsx â†’ components/`. The `src/` folder is a legacy CRA tree retained only for the WAR/Tomcat fallback path.

---

## 4. UI Layout

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  HEADER (sticky, h-16, backdrop-blur-md)                  â”‚
â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€    â”‚
â”‚  [ðŸ“Š EduData Ghana]            [Light|Dark|HC] [Adminâ–¸]  â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  MAIN (max-w-7xl, py-8 sm:py-12)                          â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”‚
â”‚  â”‚  TABS: Undergraduate | International | Postgraduate  â”‚ â”‚
â”‚  â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€  â”‚ â”‚
â”‚  â”‚  RECHARTS BAR CHART (ResponsiveContainer)            â”‚ â”‚
â”‚  â”‚  X axis: institution names                           â”‚ â”‚
â”‚  â”‚  Y axis: GHâ‚µ values (formatted "GHâ‚µNk")              â”‚ â”‚
â”‚  â”‚  Bars (UG): freshman + continuing                    â”‚ â”‚
â”‚  â”‚  Bars (Intl/PG): single fee                          â”‚ â”‚
â”‚  â”‚  Tooltip: name + value (GHâ‚µ...) + type badge         â”‚ â”‚
â”‚  â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€  â”‚ â”‚
â”‚  â”‚  KEY OBSERVATIONS panel â€” text insights              â”‚ â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  FOOTER â€” Â© year EduData Ghana â€” Privacy / Terms / Contactâ”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

Clicking **Admin Access** swaps `<FeesComparisonDashboard />` for `<AdminPanel />`. Same view returns to "Public Dashboard".

---

## 5. Provider Composition (`App.tsx`)

```tsx
const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <DataProvider>
        <MainContent />
      </DataProvider>
    </AuthProvider>
  </ThemeProvider>
);
```

`MainContent` owns the local `currentView: 'public' | 'admin'` state and renders `<Header />` + chart-or-admin + footer.

`index.tsx`:
```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);
```

---

## 6. Data Types (`types.ts` â€” implement verbatim)

```ts
export interface BaseFeeData {
  name: string;
  fees: number;
  type: 'public' | 'private';
}
export interface UndergraduateFeeData extends BaseFeeData { continuing: number; }
export interface InternationalFeeData extends BaseFeeData {}
export interface PostgraduateFeeData extends BaseFeeData {}
export type FeeDataItem = UndergraduateFeeData | InternationalFeeData | PostgraduateFeeData;
export type ViewType = 'undergraduate' | 'international' | 'postgraduate';
export type Theme = 'light' | 'dark' | 'high-contrast';

export interface AuditLog {
  id: string; timestamp: number; action: string; details: string; actor: string;
}
export interface AuthState {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  updatePassword: (newPassword: string) => void;
}
export interface DataContextType {
  undergraduateData: UndergraduateFeeData[];
  internationalData: InternationalFeeData[];
  postgraduateData: PostgraduateFeeData[];
  updateFee: (category: ViewType, index: number, field: string, value: number) => void;
  auditLogs: AuditLog[];
}
```

---

## 7. Seeded Data (`contexts/DataContext.tsx` â€” required)

### 7.1 Undergraduate (19 rows â€” fees in GHâ‚µ)
Public: UG (Humanities) 2319/1774, UG (Admin/Law) 2435/1890, KNUST (Humanities) 1875/1715, KNUST (Business) 2428/2268, KNUST (Engineering) 3778/2968, KNUST (Medicine) 4068/3908, UEW (Humanities) 2226, UEW (Business) 3096, UEW (Science) 2783.
Private: TUC 5299, Academic City (CS) 41580, Academic City (Journalism) 29700, Academic City (Biomed) 59400, Ashesi (Business) 12500, Ashesi (Engineering) 14000, Valley View (Business) 2250, Valley View (Science) 2856, Wisconsin (General) 3180, Wisconsin (Law) 5800.

### 7.2 International (9 rows â€” base $ Ã— 15 cedi multiplier)
Public: UG (Humanities) African 4328Ã—15, UG (Humanities) Non-African 5109Ã—15, UG (Admin/Law) 5336Ã—15, KNUST (Humanities) 4354Ã—15, KNUST (Business/Law) 6054Ã—15, KNUST (Engineering) 6204Ã—15, KNUST (Medicine) 7487Ã—15.
Private: Lancaster (Foundation) 7000Ã—15, Lancaster (Undergraduate) 9000Ã—15.

### 7.3 Postgraduate (10 rows)
Public: UG (MA â€“ One Year) 13074, UG (MPhil/MBA) 13551, UG (Law â€“ ADR/HRA) 22485, UG (EPM â€“ Regular) 18540, UG (EPM â€“ Weekend) 25785, UG (PhD â€“ Humanities) 10256, UG (PhD â€“ Admin) 11694.
Private: Academic City (Data Sci) 47250/2, Academic City (Cyber Sec) 47250/2, Lancaster (MBA) (12000Ã—15)/2.

The literal multiplications/divisions must be preserved in the source so future maintainers can audit derivation.

---

## 8. Authentication (`contexts/AuthContext.tsx`)

- In-memory password (default `admin123`) â€” **no localStorage persistence; session loss on reload is intentional** for the public preview build.
- `login(password) â†’ boolean`. Calls `logAction('LOGIN', 'Admin logged in successfully')` on success or `logAction('LOGIN_FAILED', 'Invalid password attempt')` on failure.
- `logout()` â†’ `logAction('LOGOUT', 'Admin logged out')`.
- `updatePassword(newPassword)` â†’ `logAction('SECURITY_UPDATE', 'Admin password changed')`.
- Every mutation funnels through `logAction(action, details)` which prepends a new `AuditLog` (id = 9-char base36) onto `auditLogs` state.

---

## 9. Data Mutation (`contexts/DataContext.tsx`)

`updateFee(category, index, field, value)`:
1. Reads `oldVal = list[index][field]` and `name = list[index].name` for the audit message.
2. Returns a new immutable list with the field overwritten.
3. Calls `logAction('DATA_UPDATE', \`Updated ${category} fee for ${name}: ${field} changed from ${oldVal} to ${value}\`)`.

`DataProvider` consumes `useAuth()` for `logAction`, so it **must** sit inside `<AuthProvider>` (already enforced in `App.tsx`).

---

## 10. Theme System (`contexts/ThemeContext.tsx`)

Theme is `'light' | 'dark' | 'high-contrast'`. Default is `light`. `useEffect` on theme change:
1. Removes `theme-light theme-dark theme-high-contrast dark` from `document.body.classList`.
2. Adds `theme-${theme}`; if `theme === 'dark'` also adds `dark` (for Tailwind dark variants).
3. Updates `<meta name="theme-color">` to `#111827` (dark) or `#ffffff` (otherwise).

The chart and admin shell consume `useTheme()` and switch palettes inline â€” see Â§11.

---

## 11. Chart Palette (per theme)

```ts
// light
{ text: '#64748b', bar1: '#2563eb', bar2: '#059669', grid: '#e2e8f0',
  tooltipBg: 'rgba(255,255,255,0.98)', tooltipText: '#1e293b',
  cardBg: '#ffffff', borderColor: '#e2e8f0',
  accentGradient: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }
// dark
{ text: '#9ca3af', bar1: '#3b82f6', bar2: '#10b981', grid: '#374151',
  tooltipBg: 'rgba(17,24,39,0.98)', tooltipText: '#f3f4f6',
  cardBg: '#1e293b', borderColor: '#374151' }
// high-contrast
{ text: '#000000', bar1: '#000000', bar2: '#555555', grid: '#000000',
  tooltipBg: '#ffffff', tooltipText: '#000000',
  cardBg: '#ffffff', borderColor: '#000000' }
```

**TUC brand overlay** (used in headers/footers/marketing surfaces): Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`, Paper `#141210`. Typography: Playfair Display, Bebas Neue, Inter / Cormorant Garamond.

Page background switches between `bg-[#0f172a]` (dark) and `bg-[#f8fafc]` (light).

---

## 12. Public Dashboard (`components/FeesComparisonDashboard.tsx`)

- Local `viewType: ViewType` state (default `'undergraduate'`).
- `dataToDisplay = useMemo` switching on `viewType`.
- Three pill-style filter tabs at the top of the card: Undergraduate, International, Postgraduate.
- `<ResponsiveContainer>` wraps `<BarChart>` with `XAxis dataKey="name"`, `YAxis tickFormatter={formatAxisCurrency}`.
- For Undergraduate, render two `<Bar>` series: `dataKey="fees"` (Freshman, `bar1`), `dataKey="continuing"` (Continuing, `bar2`).
- Currency helpers:
  ```ts
  formatCurrency(v)     â†’ `GHâ‚µ${v.toLocaleString()}`
  formatAxisCurrency(v) â†’ v >= 1000 ? `GHâ‚µ${(v/1000).toFixed(0)}k` : `GHâ‚µ${v}`
  ```
- Tooltip shows: institution name, fee value via `formatCurrency`, public/private type badge.
- A "Key Observations" insights panel below the chart summarises the active view in 3â€“5 bullets.
- All bars must distinguish public/private by colour or pattern (REQ-1.4 of SRS).

---

## 13. Admin Panel (`components/AdminPanel.tsx`)

Two render modes:

### 13.1 Login view (when `!isAuthenticated`)
- Centred card, "Admin Portal" title, lock icon.
- Password `<input type="password">` with `aria-label`.
- On submit calls `login(passwordInput)`; on false â†’ "Incorrect password. Please try again."

### 13.2 Authenticated view
Sticky header: avatar circle "A", "Administrator", "â— System Active" status, **Sign Out** button (red).

Sidebar (md:w-64) with four tab buttons:

| Tab id | Label | Content |
|---|---|---|
| `logs` | Audit Logs | Table of all `auditLogs` entries: timestamp (locale time), event type pill (green for LOGIN, blue for UPDATE, gray default), description, initiator |
| `data` | Data Management | Editable list of undergraduate rows; freshman fees (`field='fees'`) editable inline; calls `updateFee('undergraduate', idx, 'fees', Number(e.target.value))` |
| `settings` | Security | New-password input + "Update Credentials" button â†’ `updatePassword()` |
| `health` | System Health | Placeholder card; "Launch Diagnostics (Preview)" button â€” Phase 3 hook for the test runner |

The admin shell rounds at `rounded-3xl`, min-height 800px, sidebar bg `bg-gray-50/50` (light) or `bg-gray-900/50` (dark).

---

## 14. Build Configuration (`vite.config.ts`)

Dev server port **3000**, host `0.0.0.0`. `base: './'` for Tomcat-relative deployment. Plugins: `react()`, `tailwindcss()`. Vite `define` shims `process.env.API_KEY` and `process.env.GEMINI_API_KEY` from the `GEMINI_API_KEY` env var (legacy AI Studio scaffolding â€” kept for backward compatibility).

Build output goes to `dist/` with `assets/[name]-[hash].[ext]` filenames. `chunkSizeWarningLimit: 1000`. Manual chunks split:

| Chunk | Modules |
|---|---|
| `vendor-react-dom` | react-dom |
| `vendor-router` | react-router |
| `vendor-react` | react |
| `vendor-charts` | recharts, d3-* |
| `vendor-motion` | framer-motion, motion |
| `vendor-icons` | lucide, heroicons |
| `vendor` | everything else |

> Note: the committed `vite.config.ts` has a duplicated `build:` block (legacy merge artefact). Deduplicate when refactoring.

---

## 15. Docker

`Dockerfile` (multi-stage):
1. `FROM node:24-alpine AS builder` â€” `corepack enable`, `pnpm install --frozen-lockfile || npm install`, copy source, `pnpm run build`.
2. `FROM node:24-alpine` â€” install global `serve`, copy `dist/`, `EXPOSE 4173`, `HEALTHCHECK` hits `http://localhost:4173/health`, `CMD ["serve", "-s", "dist", "-l", "4173"]`.

`Dockerfile.prod` is the slimmer nginx variant pairing with `nginx.conf`. The nginx config exposes `/health` returning `'healthy'`, sets X-Frame-Options/X-Content-Type/X-XSS/Referrer-Policy headers, gzips text/css/js/json/svg, and applies `try_files $uri $uri/ /index.html` for SPA deep-link refreshes.

Network: `tuc-network`. Reachable through gateway `nginx-gateway` at `http://localhost:8080/fees-comparison-dashboard/`.

---

## 16. Build / Run / Test

```bash
pnpm install
pnpm run dev          # Vite, port 3000
pnpm run build        # â†’ dist/
pnpm run preview
pnpm test             # Vitest
pnpm run test:ui
pnpm run test:coverage
pnpm run test:e2e     # vitest run --config vitest.e2e.config.ts
```

Coverage target: â‰¥70% across branches/functions/lines/statements (TUC monorepo standard).

---

## 17. Environment Variables

```bash
# .env.local
GEMINI_API_KEY=<unused-but-shimmed>   # legacy AI Studio var; kept for compat
```

The Vite `define` block exposes `process.env.GEMINI_API_KEY` so any historical reference still resolves.

---

## 18. ARIA / Accessibility Requirements

- Theme switcher buttons each have `aria-label="Switch to <theme> theme"`.
- Header `Admin Access` / `Public Dashboard` toggle button â€” must remain keyboard-accessible (`<button>`).
- Login form input must have `<label htmlFor>` paired with input `id`.
- All inline SVG icons in the header should have `aria-hidden="true"`.
- Chart `<section role="region" aria-labelledby="..." aria-describedby="...">` with `sr-only` description summarising the trend (per TUC SHARED-STANDARDS).
- Skip-to-content link as the first focusable element of `<App>`.
- Currency values comma-separated (REQ-NFR-3); minimum 4.5:1 contrast (REQ-NFR-4).
- 200% browser zoom must not break layout (REQ-NFR-1).

---

## 19. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Build completes with zero TypeScript errors |
| AC-2 | Header shows "EduData Ghana" wordmark and three theme pills (light / dark / HC) |
| AC-3 | Switching theme updates `document.body.className` to `theme-<value>` (and adds `dark` when applicable) |
| AC-4 | Public dashboard renders a Recharts bar chart for the selected `ViewType` |
| AC-5 | Undergraduate view renders two bar series: freshman and continuing |
| AC-6 | International and postgraduate views render single fee bars; values formatted `GHâ‚µNk` on the Y axis |
| AC-7 | Tooltip displays institution name, currency-formatted fee, and public/private type |
| AC-8 | Clicking "Admin Access" swaps the main view to `<AdminPanel />` |
| AC-9 | Admin login with default password `admin123` succeeds; wrong password shows inline error |
| AC-10 | After login, audit log records the LOGIN event in the Logs tab |
| AC-11 | Changing a fee in Data Management calls `updateFee` and emits a `DATA_UPDATE` audit entry |
| AC-12 | Updating the password emits `SECURITY_UPDATE` and immediately invalidates the old password |
| AC-13 | Logout flips back to the login screen and emits a `LOGOUT` audit entry |
| AC-14 | High-contrast theme renders chart in pure black/grey with white card backgrounds |
| AC-15 | All chart values are comma-separated for thousands (e.g. `GHâ‚µ41,580`) |
| AC-16 | Docker build succeeds with `node:24-alpine` and the resulting image serves on port 4173 (or via nginx on 80) |
| AC-17 | `nginx.conf` exposes `/health` returning HTTP 200 |
| AC-18 | Deep-link refresh on `/admin` returns `index.html` (SPA fallback works) |
| AC-19 | Service is reachable through TUC gateway at `http://localhost:8080/fees-comparison-dashboard/` |
| AC-20 | All `<button>` elements are keyboard-focusable and have visible focus styles |
