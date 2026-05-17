# mannequin-ai - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for mannequin-ai.

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
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: CREATION.md
```md
﻿# CREATION.md â€” MannequinAI Platform Console

**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/mannequin-ai/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

MannequinAI (`mannequin-ai` v0.0.0) is a **single-page platform console** for Techbridge University College (TUC) showcasing an 8-module Afro-centric fashion AI suite. It is a *brochure-grade* dashboard demonstrating the architecture, KPIs, IEEE SRS posture, and per-module feature cards for a hypothetical fashion-design platform.

The app boots into a **Hero "Enter Platform"** landing screen, then transitions into a left-rail **Sidebar + Main** layout. Users can browse 8 modules (MAS, FDG, VTO, FabricForge, DesignVault, FashionAcademy, IAM, Admin Console). Each module surfaces tagline, status badge (`active`/`beta`/`protected`), feature list, hardcoded stats, and 5 generated SRS requirements.

There is **no backend** â€” every value is sourced from `src/constants/index.ts`. State persists only the chosen colour theme (`localStorage["mannequin-theme"]`). A separate `AuthGate.tsx` exists in source but is **not currently mounted** â€” see Â§5 for the documented intent.

---

## 2. Tech Stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.5** (never change) |
| Build | Vite | ^7.3.1 |
| React plugin | @vitejs/plugin-react | ^5.1.1 |
| Language | TypeScript | ~5.9.3 |
| Styling | Tailwind CSS | ^4.2.1 (via `@tailwindcss/vite`) |
| Class merging | clsx ^2.1.1 + tailwind-merge ^3.5.0 | â€” |
| Icons | lucide-react | ^0.575.0 |
| Animation | framer-motion | ^12.34.3 (declared, not yet wired) |
| Unit tests | Vitest + @testing-library/react + jsdom | ^3.0.0 / ^16.3.2 / ^26.1.0 |
| Lint | ESLint 9 + typescript-eslint 8 | ^9.39.1 / ^8.48.0 |
| Package manager | pnpm | 10.30+ |
| Container | node:24-alpine â†’ node:24-alpine + `serve` | â€” |

`package.json` exposes scripts: `dev`, `build` (`tsc -b && vite build`), `lint`, `preview`, `test`, `test:ui`, `test:coverage`, `test:e2e` (uses `vitest.e2e.config.ts`).

---

## 3. Directory Structure (verbatim)

```
mannequin-ai/
â”œâ”€â”€ index.html               # TUC meta + Inter font + tuc-splash hero
â”œâ”€â”€ index.css                # @import "tailwindcss";
â”œâ”€â”€ package.json             # name: mannequin-ai, version: 0.0.0
â”œâ”€â”€ pnpm-lock.yaml
â”œâ”€â”€ pnpm-workspace.yaml
â”œâ”€â”€ vite.config.ts           # base './', manualChunks: react-vendor
â”œâ”€â”€ tsconfig.json / tsconfig.app.json / tsconfig.node.json
â”œâ”€â”€ eslint.config.js
â”œâ”€â”€ vitest.config.ts / vitest.e2e.config.ts
â”œâ”€â”€ Dockerfile               # multi-stage node:24-alpine, runs `serve` on :4173
â”œâ”€â”€ nginx.conf               # SPA fallback + /health + cache headers (alt deploy)
â”œâ”€â”€ .dockerignore / .gitignore
â”œâ”€â”€ DEPLOYMENT.md / README.md
â”œâ”€â”€ public/
â”œâ”€â”€ docs/
â””â”€â”€ src/
    â”œâ”€â”€ main.tsx                  # createRoot â†’ <App />
    â”œâ”€â”€ App.tsx                   # Hero â†’ Sidebar+main layout
    â”œâ”€â”€ App.css
    â”œâ”€â”€ index.css                 # @import "tailwindcss";
    â”œâ”€â”€ AuthGate.tsx              # admin/admin gate (declared, unused)
    â”œâ”€â”€ styles/
    â”‚   â””â”€â”€ global.css            # CSS vars, font-display, kente-bg, gold-shimmer
    â”œâ”€â”€ constants/
    â”‚   â””â”€â”€ index.ts              # THEMES, MODULES (8), CURRICULUM (12), AUDIT_LOGS (5)
    â”œâ”€â”€ types/
    â”‚   â””â”€â”€ index.ts              # ThemeType, ColorPalette, Module, CurriculumItem, AuditLog
    â”œâ”€â”€ hooks/
    â”‚   â””â”€â”€ useTheme.tsx          # ThemeProvider + useTheme + CSS-var injection
    â”œâ”€â”€ services/                 # (empty placeholder)
    â”œâ”€â”€ a11y/                     # (skip-link / accessible primitives placeholder)
    â”œâ”€â”€ layouts/                  # (placeholder)
    â”œâ”€â”€ assets/
    â”œâ”€â”€ __tests__/
    â””â”€â”€ components/
        â”œâ”€â”€ Sidebar.tsx           # left rail, nav buttons, theme switcher
        â”œâ”€â”€ Dashboard.tsx         # KPI strip + module grid + SRS banner
        â”œâ”€â”€ ModuleDetail.tsx      # module hero + stats + features + SRS
        â”œâ”€â”€ AccessibleLayout.tsx  # skip-link + main landmark wrapper
        â”œâ”€â”€ SkipLink.tsx          # sr-only "Skip to main content"
        â””â”€â”€ ui/
            â””â”€â”€ Cards.tsx         # Card, MetricCard
```

---

## 4. Provider Composition (`src/main.tsx` â†’ `src/App.tsx`)

```tsx
// main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
document.getElementById('tuc-splash-styles')?.remove();
```

```tsx
// App.tsx (canonical shape)
const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

const AppContent = () => {
  const [activeModule, setActiveModule] = useState<string>("landing");
  const [isAdmin] = useState(false);
  if (activeModule === "landing") return <HeroSection onEnter={() => setActiveModule("dashboard")} />;
  const selectedModule = MODULES.find(m => m.id === activeModule);
  return (
    <div className="flex min-h-screen">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} isAdmin={isAdmin} />
      <main className="flex-1 overflow-y-auto">
        {activeModule === "dashboard" && <Dashboard setActiveModule={setActiveModule} />}
        {selectedModule && <ModuleDetail module={selectedModule} />}
        {activeModule !== "dashboard" && !selectedModule && <div>Admin Console - Coming Soon</div>}
      </main>
    </div>
  );
};
```

`HeroSection` is a full-screen `kente-bg` splash: `Mannequin` heading, italic gold-shimmer "AI", and an "Enter Platform" button that flips state to `"dashboard"`.

---

## 5. Auth (declared, optional gate)

`src/AuthGate.tsx` exists but is NOT currently rendered by `main.tsx`. The shape is preserved so it can be wrapped later:

| Item | Value |
|---|---|
| Storage key | `sessionStorage["tuc_auth_mannequin_ai"]` (set to `"1"`) |
| Accent colour | `#e11d48` (rose-600) |
| Credentials | `admin` / `admin` (hardcoded) |
| UI | Centred 420px white card, Inter font, lightning-bolt logo, "Techbridge University College Â· admin / admin" footer |
| Failure copy | `"Invalid credentials. Use admin / admin"` |

To enable it: wrap `<App />` in `<AuthGate>` inside `main.tsx`.

---

## 6. Data Model (`src/types/index.ts` â€” implement verbatim)

```ts
export type ThemeType = "dark" | "light" | "highContrast";

export interface ColorPalette {
  bg: string; surface: string; surfaceAlt: string; border: string;
  gold: string; goldLight: string;
  terracotta: string; terracottaLight: string;
  text: string; textMuted: string; textDim: string;
  accent: string; success: string; warning: string; error: string;
}

export interface Module {
  readonly id: string;
  readonly code: string;            // 2-3 letter shorthand (MAS, FDG, VTO, FF, DV, FA, IAM, ADM)
  readonly name: string;
  readonly tagline: string;
  readonly icon: string;            // unicode glyph
  readonly color: string;           // 'gold' | 'terracotta' | 'accent' | 'success' | 'error'
  readonly status: "active" | "beta" | "protected";
  readonly features: ReadonlyArray<string>;
  readonly stats: Readonly<Record<string, string>>;
}

export interface CurriculumItem { module: number; title: string; duration: string; level: "Beginner" | "Intermediate" | "Advanced" | "Expert"; }
export interface AuditLog { id: string; timestamp: string; user: string; action: string; resource: string; severity: "INFO" | "WARN" | "HIGH"; ip: string; }
```

---

## 7. Seed Constants (`src/constants/index.ts`)

### 7.1 MODULES (8 entries â€” copy verbatim by `id`)

| id | code | name | icon | color | status |
|---|---|---|---|---|---|
| `mas` | MAS | Mannequin AI Studio | â—ˆ | gold | active |
| `fdg` | FDG | Fashion Design Generator | âœ¦ | terracotta | active |
| `vto` | VTO | Virtual Try-On | â¬¡ | accent | active |
| `fabricforge` | FF | FabricForge | â—Ž | success | active |
| `designvault` | DV | DesignVault | â–£ | gold | active |
| `fashionacademy` | FA | FashionAcademy | â—‰ | terracotta | beta |
| `iam` | IAM | Identity & Access | â¬Ÿ | accent | active |
| `admin` | ADM | Admin Console | â¬¢ | error | protected |

Each entry carries 4 `features` and a `stats: Record<string,string>` of 3 key/value strings (e.g. `{ generated: "12,450", accuracy: "97.3%", diversity: "A+" }`).

### 7.2 CURRICULUM (12 weeks/modules)

`{ module: 1..12, title, duration, level }` covering "Foundations of African Fashion" through "Capstone: Launch Your Collection".

### 7.3 AUDIT_LOGS (5 fixture rows)

Sample rows include `AUD-001` through `AUD-005` with timestamps, users (`admin@mannequin.ai`, `designer@tbuni.edu.gh`), actions (`USER_CREATED`, `DESIGN_EXPORTED`, `LOGIN_FAILED`, `ROLE_MODIFIED`, `MODULE_COMPLETED`), severity, and IPs.

---

## 8. Theme System (`src/hooks/useTheme.tsx`)

Three palettes in `THEMES` constant, keyed by `ThemeType`. Provider behaviour:

1. Initial state read from `localStorage["mannequin-theme"]`, default `"dark"`.
2. `useEffect` on `[theme, colors]`:
   - Persist `theme` to `localStorage["mannequin-theme"]`.
   - For each `[key, value]` in `colors`, set CSS variable `--<kebab-key>` on `document.documentElement.style` (camelCase â†’ kebab-case, e.g. `surfaceAlt` â†’ `--surface-alt`).
   - Set `document.documentElement.dataset.theme = theme`.
3. `useTheme()` throws if used outside `<ThemeProvider>`.

### 8.1 Dark palette (default)

```ts
{ bg:"#0C0C0E", surface:"#14141A", surfaceAlt:"#1C1C26", border:"#2A2A3A",
  gold:"#C9A84C", goldLight:"#E8C96A",
  terracotta:"#D4694A", terracottaLight:"#E8886E",
  text:"#F0EDE6", textMuted:"#8A8799", textDim:"#4A4860",
  accent:"#7B6BDE", success:"#4CAF7D", warning:"#E8A44A", error:"#E85A4A" }
```

### 8.2 Light palette

```ts
{ bg:"#FAF8F3", surface:"#FFFFFF", surfaceAlt:"#F3EFE6", border:"#E2DAC8",
  gold:"#A87D2A", goldLight:"#C9A84C",
  terracotta:"#C4552F", terracottaLight:"#D4694A",
  text:"#1A1614", textMuted:"#5A5248", textDim:"#A09890",
  accent:"#5B4BC4", success:"#2D8A57", warning:"#C47A2A", error:"#C4402A" }
```

### 8.3 High-contrast palette

```ts
{ bg:"#000000", surface:"#0A0A0A", surfaceAlt:"#111111", border:"#FFFFFF",
  gold:"#FFD700", goldLight:"#FFE44D",
  terracotta:"#FF6633", terracottaLight:"#FF8866",
  text:"#FFFFFF", textMuted:"#CCCCCC", textDim:"#888888",
  accent:"#AA88FF", success:"#00FF88", warning:"#FFAA00", error:"#FF3333" }
```

### 8.4 TUC institutional overlay (in `index.html` splash)

`#0F0C07` (Ink) backdrop, `#141210` (Paper) card, `#C8A84B` (Gold) accents â€” these match the canonical TUC tokens and are used only in the boot splash before React mounts.

---

## 9. Typography

`index.html` preconnects Google Fonts and loads **Inter** at weights 400/500/600/700/900. `src/styles/global.css` declares `--font-display` (Playfair Displayâ€“style serif) consumed by `style={{ fontFamily: "var(--font-display)" }}` on every `h1`/`h2`/module name. Body chrome uses Inter. Decorative classes referenced from JSX:

- `kente-bg` â€” patterned hero background
- `gold-shimmer` â€” animated gold gradient for the italic "AI"
- `font-display` â€” Playfair-style serif for titles
- `animate-in` â€” page-mount fade

---

## 10. Component Behaviour

### 10.1 Sidebar (`src/components/Sidebar.tsx`)

`<aside className="w-60 shrink-0 border-r flex flex-col h-screen sticky top-0">` containing:

1. **Logo block** â€” 36-px goldâ†’terracotta gradient square with letter `M`, name "MannequinAI", subline `v1.0.0 Â· IEEE SRS`.
2. **Modules nav** â€” `MODULES.filter(m => m.id !== "admin").map(...)` rendered as buttons. Active state = gold text + 10% gold background. Beta modules show a `BETA` pill (`colors.warning`).
3. **System block** â€” `Admin Console` button (red on active) + `Dashboard` button (gold on active). When `isAdmin` is true, an animated success dot appears next to Admin.
4. **Theme switcher** â€” three icon buttons (`Moon` / `Sun` / `Contrast` from lucide). Active state outlined in gold + 15% gold background.
5. **Status footer** â€” pulsing green dot + "All systems operational".

### 10.2 Dashboard (`src/components/Dashboard.tsx`)

1. Header: 11-px uppercase eyebrow `Good morning â€” TECHBRIDGE University College` + 4xl `Platform Overview` + subline.
2. **KPI row** â€” 4 `MetricCard`s: `Active Designers 1,240 (+18% MoM)`, `Designs Generated 45,210 (+32% MoM)`, `VTO Sessions 24,100 (+41% MoM)`, `Academy Enrolments 3,200 (+12% MoM)`.
3. **Module grid** â€” full `MODULES` array, 1/2/3-col responsive. Each card resolves accent colour from `m.color` keyword and shows icon, status pill, name, tagline, divider, and 2 `stats` entries.
4. **SRS Compliance Banner** â€” gold-left-bordered card. Title "IEEE SRS v1.0.0 â€” MannequinAI", subline `60+ functional requirements Â· 8 modules Â· Ghana Data Protection Act compliant Â· GDPR aligned`, two pills (`Validated`, `880 Paragraphs`), and a 4-column progress bar grid: `Functional Req. 60+ (100%)`, `Security Req. OWASP A+ (100%)`, `Performance SLAs < 200ms (95%)`, `Cultural Compliance West Africa (100%)`.

### 10.3 ModuleDetail (`src/components/ModuleDetail.tsx`)

Renders a hero (16-px-square accent tile + module code eyebrow + status pill + 4xl name + italic tagline), 4 `MetricCard`s from `Object.entries(module.stats)`, and a 2-col grid:

1. **Core Features** card â€” bullet list of `module.features`.
2. **SRS Requirements card** â€” auto-generated 5-line REQ list: `REQ-${code}-001..005`, displayed monospace with green check icons.

### 10.4 ui/Cards (`src/components/ui/Cards.tsx`)

- `Card({ children, onClick?, borderLeft?, className? })` â€” applies `surface` background, optional 4-px `borderLeft` accent.
- `MetricCard({ label, value, delta?, color })` â€” displays label (uppercase, dim), value (3xl, accent), and optional delta (small, success).

---

## 11. UI Layout Sketch

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ [Hero on first load â€” h-screen, kente-bg]                 â”‚
â”‚ "Mannequin AI"  [Enter Platform â†’]                        â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
       â†“ click Enter
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Sidebar (w-60â”‚ <Dashboard /> or <ModuleDetail/>           â”‚
â”‚  - ModulesÃ—7 â”‚ Header + KPI strip + Module grid + SRS bar â”‚
â”‚  - Admin     â”‚                                            â”‚
â”‚  - Dashboard â”‚                                            â”‚
â”‚  - Theme:    â”‚                                            â”‚
â”‚    [â˜¾][â˜€][â¬£]â”‚                                            â”‚
â”‚  statusâ—ok   â”‚                                            â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## 12. ARIA Requirements

- `index.html` includes `<a href="#main-content" class="skip-to-main">` rendered visually hidden until focus.
- `<div id="root" role="main" aria-label="Mannequin Ai">` is the main landmark.
- Sidebar should be `<aside aria-label="Main navigation">` (currently a plain `<aside>` â€” wrap if you re-implement).
- Every interactive `<button>` should carry an `aria-label` (current implementation passes visible text â€” preserve that).
- Theme buttons in Sidebar must include `aria-pressed` indicating the active theme.
- All decorative icons should have `aria-hidden="true"`.

---

## 13. Build / Run / Test

```bash
cd mannequin-ai
pnpm install
pnpm run dev          # Vite default :5173
pnpm run build        # tsc -b && vite build â†’ dist/
pnpm run preview
pnpm test             # Vitest
pnpm test:coverage
pnpm test:e2e         # uses vitest.e2e.config.ts
```

`vite.config.ts` sets `base: './'` (relative paths so the bundle works behind nested gateway routes) and adds `manualChunks: { 'react-vendor': ['react','react-dom'] }`.

---

## 14. Docker

`Dockerfile` is a two-stage build:

```dockerfile
FROM node:24-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || npm install
COPY . .
RUN pnpm run build || npm run build

FROM node:24-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm add -g serve
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
EXPOSE 4173
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1
CMD ["serve", "-s", "dist", "-l", "4173"]
```

`nginx.conf` (alt deployment): `try_files $uri $uri/ /index.html;`, `/health` returns 200 `healthy`, gzip on, 1-year immutable cache for static assets, security headers `X-Frame-Options SAMEORIGIN`, `X-Content-Type-Options nosniff`, `X-XSS-Protection 1; mode=block`, `Referrer-Policy strict-origin-when-cross-origin`.

The service must be registered in `docker-compose-all-apps.yml` under the `tuc-network` (172.20.0.0/16).

---

## 15. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Build completes with zero TypeScript errors and zero lint errors |
| AC-2 | First load renders the Hero "Enter Platform" screen full-bleed |
| AC-3 | Clicking "Enter Platform" mounts the Sidebar + Dashboard in one transition |
| AC-4 | Dashboard renders 4 KPI cards, the full 8-module grid (including Admin), and the IEEE SRS banner |
| AC-5 | Selecting any non-admin module routes to `<ModuleDetail>` with hero + stats + features + auto-generated REQ list |
| AC-6 | Theme switcher cycles `dark`/`light`/`highContrast`; selection persists in `localStorage["mannequin-theme"]` |
| AC-7 | Theme change instantly updates every CSS variable on `document.documentElement` AND sets `data-theme` attribute |
| AC-8 | No production network calls â€” all data is local to `src/constants/index.ts` |
| AC-9 | Skip-to-main link is present in `index.html` and visible only on focus |
| AC-10 | `tuc-splash-styles` element is removed by `main.tsx` after React mounts (no flicker) |
| AC-11 | Docker image builds clean, exposes `:4173`, and `/health` returns 200 |
| AC-12 | All `MODULES` icons render as their original Unicode glyphs (â—ˆ âœ¦ â¬¡ â—Ž â–£ â—‰ â¬Ÿ â¬¢) |
| AC-13 | Beta modules (FashionAcademy) display the `BETA` pill in both sidebar and grid card |
| AC-14 | `MetricCard` accepts `(label, value, delta?, color)` and renders without runtime warnings |
| AC-15 | Bundle size < 500 KB gzipped; `react-vendor` chunk is split via `manualChunks` |

```

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/mannequin-ai/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/mannequin-ai/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/mannequin-ai/',  // REQUIRED: Assets must load from /mannequin-ai/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/mannequin-ai"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/mannequin-ai">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/mannequin-ai/`, not at the root
- **Asset Loading**: Without `base: '/mannequin-ai/'`, assets try to load from `/assets/` instead of `/mannequin-ai/assets/`
- **Routing**: Without `basename="/mannequin-ai"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/mannequin-ai/assets/index-*.js`
- Link tags should reference: `/mannequin-ai/assets/index-*.css`

If they reference `/assets/` instead of `/mannequin-ai/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/mannequin-ai/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/mannequin-ai/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: mannequin-ai

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
# Admin Guide — mannequin-ai

**Application:** mannequin-ai
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

Audit log data is stored in `localStorage` under the key `tuc_mannequin-ai_audit`.

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
# Deployment Guide — mannequin-ai

**Application:** mannequin-ai
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd mannequin-ai
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
docker-compose -f docker-compose-all-apps.yml build mannequin-ai
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up mannequin-ai
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

**Project:** Mannequin Ai
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Mannequin Ai**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Mannequin Ai** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Mannequin Ai** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Modular React component architecture
- Custom React hooks for state management
- Service layer for API integration

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
# Testing Guide — mannequin-ai

**Application:** mannequin-ai
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd mannequin-ai
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
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
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
    <meta property="og:title" content="Mannequin Ai | Techbridge University College" />
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
    <meta name="twitter:title" content="Mannequin Ai | Techbridge University College" />
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
    <title>Mannequin Ai | Techbridge University College</title>

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
          .skip-to-main {
        position: absolute;
        left: -9999px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
        z-index: 9999;
      }
      .skip-to-main:focus {
        left: 8px;
        width: auto;
        height: auto;
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
    <a href="#main-content" class="skip-to-main" aria-label="Skip to main content">Skip to main content</a>

    
    <div id="root" role="main" aria-label="Mannequin Ai">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">mannequin ai</div>
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
  "name": "mannequin-ai",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.2.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.34.3",
    "lucide-react": "^0.575.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^4.2.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^24.10.1",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.5",
    "@vitejs/plugin-react": "^5.1.1",
    "@vitest/coverage-v8": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "jsdom": "^26.1.0",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.48.0",
    "vite": "^7.3.1",
    "vitest": "^3.0.0"
  }
}

```

### FILE: README.md
```md
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

```

### FILE: src/a11y/aria-checklist.md
```md
# ARIA Accessibility Checklist — Mannequin Ai

## Status: Phase 2 Scaffolded

The following ARIA patterns have been scaffolded. Review and wire manually.

---

## Completed (automated)
- [x] `<html lang="en">` set in index.html
- [x] `role="application"` + `aria-label` on root div (#root)
- [x] Skip-to-content link injected in index.html
- [x] `SkipLink.tsx` component created
- [x] `AccessibleLayout.tsx` component created

## Pending (manual)

### Landmark Regions
- [ ] Wrap app content in `<AccessibleLayout label="Mannequin Ai">`
- [ ] Ensure `<nav aria-label="Main navigation">` on nav elements
- [ ] Ensure `<header role="banner">` on page headers
- [ ] Ensure `<footer role="contentinfo">` on footers

### Interactive Elements
- [ ] All `<button>` elements have `aria-label` or visible text
- [ ] Icon-only buttons: `<button aria-label="Close"><XIcon /></button>`
- [ ] All `<input>` elements have associated `<label>` or `aria-label`
- [ ] Links have descriptive text (not "click here")

### Dynamic Content
- [ ] Loading states: `<div aria-live="polite" aria-busy={loading}>`
- [ ] Error messages: `<p role="alert">{error}</p>`
- [ ] Success notifications: `<div aria-live="polite">`

### Images
- [ ] Decorative images: `<img alt="" aria-hidden="true" />`
- [ ] Informational images: `<img alt="Descriptive text" />`

### Focus Management
- [ ] Modal dialogs trap focus (use `aria-modal="true"`)
- [ ] Focus returns to trigger after modal closes
- [ ] Logical tab order (no positive `tabIndex`)

### Colour & Contrast
- [ ] All text meets WCAG AA (4.5:1 normal, 3:1 large)
- [ ] TUC Maroon #630f12 on white: ✓ passes
- [ ] TUC Gold #ffcb05 on dark bg: verify contrast

---

## Resources
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [axe DevTools](https://www.deque.com/axe/)

```

### FILE: src/App.css
```css
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}

```

### FILE: src/App.tsx
```typescript
import React, { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { ModuleDetail } from "./components/ModuleDetail";
import { Sidebar } from "./components/Sidebar";
import { MODULES } from "./constants";
import { ThemeProvider, useTheme } from "./hooks/useTheme";
import "./styles/global.css";

const HeroSection = ({ onEnter }: { onEnter: () => void }) => {
  const { colors } = useTheme();
  return (
    <div className="h-screen flex items-center justify-center flex-col kente-bg" style={{ background: colors.bg }}>
       <h1 className="text-9xl font-light leading-none mb-4" style={{ color: colors.text, fontFamily: "var(--font-display)" }}>
        Mannequin<span className="block italic gold-shimmer">AI</span>
      </h1>
      <button onClick={onEnter} className="px-8 py-3 bg-gold text-black uppercase font-bold tracking-widest rounded-sm mt-10 hover:opacity-80 transition-opacity">
        Enter Platform
      </button>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>("landing");
  const [isAdmin] = useState(false);
  const { colors } = useTheme();

  if (activeModule === "landing") {
    return <HeroSection onEnter={() => setActiveModule("dashboard")} />;
  }

  const selectedModule = MODULES.find(m => m.id === activeModule);

  return (
    <div className="flex min-h-screen" style={{ background: colors.bg }}>
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule} 
        isAdmin={isAdmin} 
      />
      <main className="flex-1 overflow-y-auto">
        {activeModule === "dashboard" && <Dashboard setActiveModule={setActiveModule} />}
        {selectedModule && <ModuleDetail module={selectedModule} />}
        {activeModule !== "dashboard" && !selectedModule && (
          <div className="p-10" style={{ color: colors.text }}>
            Admin Console - Coming Soon
          </div>
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;

```

### FILE: src/AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_mannequin_ai';
const ACCENT   = '#e11d48';

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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Mannequin AI</h1>
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

### FILE: src/components/AccessibleLayout.tsx
```typescript
import React from 'react';
import SkipLink from './SkipLink';

interface AccessibleLayoutProps {
  children: React.ReactNode;
  /** Describes this page/section for screen readers */
  label?: string;
}

/**
 * AccessibleLayout — wraps app content with proper landmark regions.
 * Usage: wrap your root component with <AccessibleLayout label="App Name">
 */
export default function AccessibleLayout({ children, label = 'Application' }: AccessibleLayoutProps) {
  return (
    <>
      <SkipLink targetId="main-content" />
      <main id="main-content" aria-label={label} tabIndex={-1}>
        {children}
      </main>
    </>
  );
}

```

### FILE: src/components/Dashboard.tsx
```typescript
import { CheckCircle2 } from "lucide-react";
import React from "react";
import { MODULES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { Card, MetricCard } from "./ui/Cards";

export const Dashboard: React.FC<{ setActiveModule: (id: string) => void }> = ({ setActiveModule }) => {
  const { colors } = useTheme();

  return (
    <div className="p-8 lg:p-10 animate-in">
      <div className="mb-10">
        <div className="text-[11px] uppercase tracking-widest font-bold mb-1" style={{ color: colors.textMuted }}>
          Good morning — TECHBRIDGE University College
        </div>
        <h1 className="text-4xl font-semibold leading-tight mb-2" style={{ color: colors.text, fontFamily: "var(--font-display)" }}>
          Platform Overview
        </h1>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          MannequinAI is live. All 8 modules initialised. IEEE SRS v1.0.0 compliance: ✓
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Active Designers", value: "1,240", delta: "+18% MoM", color: colors.gold },
          { label: "Designs Generated", value: "45,210", delta: "+32% MoM", color: colors.terracotta },
          { label: "VTO Sessions", value: "24,100", delta: "+41% MoM", color: colors.accent },
          { label: "Academy Enrolments", value: "3,200", delta: "+12% MoM", color: colors.success },
        ].map((kpi) => (
          <MetricCard 
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            color={kpi.color}
          />
        ))}
      </div>

      {/* Module Grid */}
      <div className="mb-10">
        <div className="text-[11px] uppercase tracking-widest font-bold mb-4" style={{ color: colors.textDim }}>
          All Modules
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {MODULES.map((m) => {
             const accentColor = m.color === "gold" ? colors.gold : m.color === "terracotta" ? colors.terracotta : m.color === "accent" ? colors.accent : m.color === "success" ? colors.success : m.color === "error" ? colors.error : colors.gold;
             return (
              <Card 
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                borderLeft={accentColor}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-3xl">{m.icon}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border" 
                        style={{ 
                          borderColor: m.status === 'active' ? `${colors.success}4d` : m.status === 'beta' ? `${colors.warning}4d` : `${colors.error}4d`,
                          color: m.status === 'active' ? colors.success : m.status === 'beta' ? colors.warning : colors.error,
                          background: m.status === 'active' ? `${colors.success}1a` : m.status === 'beta' ? `${colors.warning}1a` : `${colors.error}1a`
                        }}>
                    {m.status}
                  </span>
                </div>
                <div className="text-xl font-semibold mb-1" style={{ color: colors.text, fontFamily: "var(--font-display)" }}>{m.name}</div>
                <div className="text-xs leading-relaxed mb-4" style={{ color: colors.textMuted }}>{m.tagline}</div>
                <div className="h-px w-full my-4" style={{ background: colors.border }} />
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {Object.entries(m.stats).slice(0, 2).map(([k, v]) => (
                    <span key={k} className="text-[11px]" style={{ color: colors.textMuted }}>
                      <strong style={{ color: colors.text }}>{v}</strong> {k}
                    </span>
                  ))}
                </div>
              </Card>
             );
          })}
        </div>
      </div>

      {/* SRS Compliance Banner */}
      <div className="bg-surface-alt border rounded-lg p-6 lg:p-8 border-l-[4px]" 
           style={{ backgroundColor: colors.surfaceAlt, borderColor: colors.border, borderLeftColor: colors.gold }}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <div>
            <div className="text-lg font-semibold" style={{ color: colors.text, fontFamily: "var(--font-display)" }}>IEEE SRS v1.0.0 — MannequinAI</div>
            <div className="text-sm mt-1" style={{ color: colors.textMuted }}>60+ functional requirements · 8 modules · Ghana Data Protection Act compliant · GDPR aligned</div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider"
                 style={{ borderColor: `${colors.success}4d`, color: colors.success, background: `${colors.success}1a` }}>
              <CheckCircle2 size={12} />
              Validated
            </div>
            <div className="px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider"
                 style={{ borderColor: `${colors.gold}4d`, color: colors.gold, background: `${colors.gold}1a` }}>
              880 Paragraphs
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            { label: "Functional Req.", value: "60+", pct: 100 },
            { label: "Security Req.", value: "OWASP A+", pct: 100 },
            { label: "Performance SLAs", value: "< 200ms", pct: 95 },
            { label: "Cultural Compliance", value: "West Africa", pct: 100 },
          ].map((r) => (
            <div key={r.label}>
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-[11px] uppercase tracking-wider font-bold" style={{ color: colors.textDim }}>{r.label}</span>
                <span className="text-[11px] font-bold" style={{ color: colors.gold }}>{r.value}</span>
              </div>
              <div className="h-[3px] w-full rounded-full overflow-hidden" style={{ background: colors.border }}>
                <div className="h-full rounded-full" 
                     style={{ 
                       width: `${r.pct}%`, 
                       background: `linear-gradient(90deg, ${colors.gold}, ${colors.terracotta})` 
                     }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

```

### FILE: src/components/ModuleDetail.tsx
```typescript
import { CheckCircle2 } from "lucide-react";
import React from "react";
import { useTheme } from "../hooks/useTheme";
import type { Module } from "../types";
import { Card, MetricCard } from "./ui/Cards";

interface ModuleDetailProps {
  module: Module;
}

export const ModuleDetail: React.FC<ModuleDetailProps> = ({ module }) => {
  const { colors } = useTheme();
  
  const accentColor = module.color === "gold" ? colors.gold : module.color === "terracotta" ? colors.terracotta : module.color === "accent" ? colors.accent : module.color === "success" ? colors.success : module.color === "error" ? colors.error : colors.gold;

  return (
    <div className="p-8 lg:p-10 animate-in">
      <div className="flex items-start gap-6 mb-10">
        <div className="w-16 h-16 rounded-lg flex items-center justify-center text-4xl shrink-0" 
             style={{ background: `${accentColor}26`, border: `1px solid ${accentColor}4d` }}>
          {module.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: accentColor }}>{module.code}</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border" 
                  style={{ 
                    borderColor: module.status === 'active' ? `${colors.success}4d` : module.status === 'beta' ? `${colors.warning}4d` : `${colors.error}4d`,
                    color: module.status === 'active' ? colors.success : module.status === 'beta' ? colors.warning : colors.error,
                    background: module.status === 'active' ? `${colors.success}1a` : module.status === 'beta' ? `${colors.warning}1a` : `${colors.error}1a`
                  }}>
              {module.status}
            </span>
          </div>
          <h1 className="text-4xl font-semibold leading-tight mb-2" style={{ color: colors.text, fontFamily: "var(--font-display)" }}>
            {module.name}
          </h1>
          <p className="text-sm font-medium italic" style={{ color: colors.textMuted }}>{module.tagline}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {Object.entries(module.stats).map(([k, v]) => (
          <MetricCard 
            key={k}
            label={k}
            value={v}
            color={accentColor}
          />
        ))}
      </div>

      {/* Features & SRS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col gap-4">
          <div className="text-[11px] uppercase tracking-widest font-bold mb-2" style={{ color: colors.textDim }}>Core Features</div>
          <div className="space-y-3">
            {module.features.map((f) => (
              <div key={f} className="flex items-center gap-3 p-3 rounded-md border" style={{ background: colors.surfaceAlt, borderColor: colors.border }}>
                <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
                <span className="text-[13px]" style={{ color: colors.text }}>{f}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card borderLeft={accentColor}>
          <div className="text-[11px] uppercase tracking-widest font-bold mb-4" style={{ color: colors.textDim }}>SRS Requirements — {module.code}</div>
          <div className="space-y-4">
            {[
              `REQ-${module.code}-001: System shall support ${module.features[0]}`,
              `REQ-${module.code}-002: Platform shall comply with WCAG 2.1 AA accessibility`,
              `REQ-${module.code}-003: All data processing subject to Ghana Data Protection Act`,
              `REQ-${module.code}-004: Response time ≤ 200ms for 95th percentile`,
              `REQ-${module.code}-005: System shall log all user actions to audit trail`,
            ].map((req, i) => (
              <div key={i} className="flex gap-3 text-[12px]">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: colors.success }} />
                <span className="font-mono leading-relaxed" style={{ color: colors.textMuted }}>{req}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

```

### FILE: src/components/Sidebar.tsx
```typescript
import { clsx, type ClassValue } from "clsx";
import { Contrast, LayoutGrid, Moon, ShieldAlert, Sun } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";
import { MODULES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import type { ThemeType } from "../types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeModule: string;
  setActiveModule: (id: string) => void;
  isAdmin: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule, isAdmin }) => {
  const { theme, setTheme, colors } = useTheme();

  return (
    <aside className="w-60 shrink-0 border-r flex flex-col h-screen sticky top-0" style={{ background: colors.surface, borderColor: colors.border }}>
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: colors.border }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md flex items-center justify-center text-lg font-bold text-black" 
               style={{ background: `linear-gradient(135deg, ${colors.gold}, ${colors.terracotta})`, fontFamily: "var(--font-display)" }}>
            M
          </div>
          <div>
            <div className="text-lg font-semibold leading-tight" style={{ color: colors.text, fontFamily: "var(--font-display)" }}>MannequinAI</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: colors.textMuted }}>v1.0.0 · IEEE SRS</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="text-[10px] uppercase tracking-widest font-bold px-1 mb-1" style={{ color: colors.textDim }}>Modules</div>
        {MODULES.filter(m => m.id !== "admin").map((m) => (
          <button 
            key={m.id} 
            onClick={() => setActiveModule(m.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2 rounded-sm text-sm transition-all duration-200 text-left",
              activeModule === m.id ? "font-medium" : "font-normal hover:bg-opacity-50"
            )}
            style={{ 
              color: activeModule === m.id ? colors.gold : colors.textMuted,
              background: activeModule === m.id ? `${colors.gold}1a` : "transparent"
            }}
          >
            <span className="text-base">{m.icon}</span>
            <span>{m.name}</span>
            {m.status === "beta" && (
              <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full border" 
                    style={{ borderColor: `${colors.warning}4d`, color: colors.warning, background: `${colors.warning}1a` }}>
                BETA
              </span>
            )}
          </button>
        ))}

        <div className="h-px my-4" style={{ background: colors.border }} />
        
        <div className="text-[10px] uppercase tracking-widest font-bold px-1 mb-1" style={{ color: colors.textDim }}>System</div>
        <button 
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2 rounded-sm text-sm transition-all duration-200 text-left",
            activeModule === "admin" ? "font-medium" : "font-normal hover:bg-opacity-10"
          )}
          onClick={() => setActiveModule("admin")}
          style={{ 
            color: activeModule === "admin" ? colors.error : colors.textMuted,
            background: activeModule === "admin" ? `${colors.error}1a` : "transparent"
          }}
        >
          <ShieldAlert size={16} />
          <span>Admin Console</span>
          {isAdmin && <div className="ml-auto w-2 h-2 rounded-full shadow-sm" style={{ background: colors.success, boxShadow: `0 0 6px ${colors.success}` }} />}
        </button>
        <button 
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2 rounded-sm text-sm transition-all duration-200 text-left",
            activeModule === "dashboard" ? "font-medium" : "font-normal hover:bg-opacity-10"
          )}
          onClick={() => setActiveModule("dashboard")}
          style={{ 
            color: activeModule === "dashboard" ? colors.gold : colors.textMuted,
            background: activeModule === "dashboard" ? `${colors.gold}1a` : "transparent"
          }}
        >
          <LayoutGrid size={16} />
          <span>Dashboard</span>
        </button>
      </div>

      {/* Theme switcher */}
      <div className="p-4 border-t space-y-3" style={{ borderColor: colors.border }}>
        <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: colors.textMuted }}>Theme</div>
        <div className="flex gap-1.5">
          {(["dark", "light", "highContrast"] as ThemeType[]).map((t) => (
            <button 
              key={t} 
              onClick={() => setTheme(t)}
              className={cn(
                "flex-1 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border transition-all duration-200",
                theme === t ? "border-gold" : "border-transparent"
              )}
              style={{ 
                borderColor: theme === t ? colors.gold : colors.border,
                background: theme === t ? `${colors.gold}26` : "transparent",
                color: theme === t ? colors.gold : colors.textMuted
              }}
            >
              {t === "dark" ? <Moon size={12} className="mx-auto" /> : t === "light" ? <Sun size={12} className="mx-auto" /> : <Contrast size={12} className="mx-auto" />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div className="w-2 h-2 rounded-full" style={{ background: colors.success, boxShadow: `0 0 6px ${colors.success}` }} />
          <span className="text-[11px]" style={{ color: colors.textMuted }}>All systems operational</span>
        </div>
      </div>
    </aside>
  );
};

```

### FILE: src/components/SkipLink.tsx
```typescript
import React from 'react';

/**
 * SkipLink — allows keyboard users to skip directly to main content.
 * Usage: <SkipLink targetId="main-content" />
 */
export default function SkipLink({ targetId = 'main-content' }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#630f12] focus:text-white focus:rounded-lg focus:font-medium"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
}

```

### FILE: src/components/ui/Cards.tsx
```typescript
import { clsx, type ClassValue } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";
import { useTheme } from "../../hooks/useTheme";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void; borderLeft?: string }> = ({ children, className, onClick, borderLeft }) => {
  const { colors } = useTheme();
  return (
    <div 
      onClick={onClick}
      className={cn("bg-surface border rounded-lg p-6 transition-all duration-[250ms] hover:border-gold hover:shadow-sm", onClick && "cursor-pointer", className)}
      style={{ 
        backgroundColor: colors.surface, 
        borderColor: colors.border,
        borderLeft: borderLeft ? `3px solid ${borderLeft}` : undefined
      }}
    >
      {children}
    </div>
  );
};

export const MetricCard: React.FC<{ label: string; value: string; delta?: string; color: string; className?: string }> = ({ label, value, delta, color, className }) => {
  const { colors } = useTheme();
  return (
    <div className={cn("bg-surface-alt border rounded-lg p-5 text-center", className)}
         style={{ backgroundColor: colors.surfaceAlt, borderColor: colors.border }}>
      <div className="text-4xl font-semibold leading-tight mb-1.5" style={{ color, fontFamily: "var(--font-display)" }}>{value}</div>
      <div className="text-xs" style={{ color: colors.textMuted }}>{label}</div>
      {delta && <div className="text-[11px] mt-1 text-success" style={{ color: colors.success }}>{delta}</div>}
    </div>
  );
};

```

### FILE: src/constants/index.ts
```typescript
export const THEMES = {
  dark: {
    bg: "#0C0C0E",
    surface: "#14141A",
    surfaceAlt: "#1C1C26",
    border: "#2A2A3A",
    gold: "#C9A84C",
    goldLight: "#E8C96A",
    terracotta: "#D4694A",
    terracottaLight: "#E8886E",
    text: "#F0EDE6",
    textMuted: "#8A8799",
    textDim: "#4A4860",
    accent: "#7B6BDE",
    success: "#4CAF7D",
    warning: "#E8A44A",
    error: "#E85A4A",
  },
  light: {
    bg: "#FAF8F3",
    surface: "#FFFFFF",
    surfaceAlt: "#F3EFE6",
    border: "#E2DAC8",
    gold: "#A87D2A",
    goldLight: "#C9A84C",
    terracotta: "#C4552F",
    terracottaLight: "#D4694A",
    text: "#1A1614",
    textMuted: "#5A5248",
    textDim: "#A09890",
    accent: "#5B4BC4",
    success: "#2D8A57",
    warning: "#C47A2A",
    error: "#C4402A",
  },
  highContrast: {
    bg: "#000000",
    surface: "#0A0A0A",
    surfaceAlt: "#111111",
    border: "#FFFFFF",
    gold: "#FFD700",
    goldLight: "#FFE44D",
    terracotta: "#FF6633",
    terracottaLight: "#FF8866",
    text: "#FFFFFF",
    textMuted: "#CCCCCC",
    textDim: "#888888",
    accent: "#AA88FF",
    success: "#00FF88",
    warning: "#FFAA00",
    error: "#FF3333",
  },
} as const;

export const MODULES = [
  {
    id: "mas",
    code: "MAS",
    name: "Mannequin AI Studio",
    tagline: "Generate diverse, culturally authentic mannequin visuals",
    icon: "◈",
    color: "gold",
    status: "active",
    features: ["Body Diversity Engine", "Skin Tone Matrix (24+ tones)", "Cultural Pose Library", "Afrocentric Silhouette AI"],
    stats: { generated: "12,450", accuracy: "97.3%", diversity: "A+" },
  },
  {
    id: "fdg",
    code: "FDG",
    name: "Fashion Design Generator",
    tagline: "AI-powered garment creation with African textile DNA",
    icon: "✦",
    color: "terracotta",
    status: "active",
    features: ["Kente Pattern Generator", "Ankara Fusion Engine", "Adinkra Symbol Weaver", "Fabric Simulation AI"],
    stats: { designs: "8,920", patterns: "340+", styles: "West African · Pan-African" },
  },
  {
    id: "vto",
    code: "VTO",
    name: "Virtual Try-On",
    tagline: "See garments on bodies that look like yours",
    icon: "⬡",
    color: "accent",
    status: "active",
    features: ["Real-time Drape Simulation", "Multi-body-type Fitting", "Fabric Physics Engine", "AR Preview Mode"],
    stats: { tryon: "24,100", satisfaction: "94.2%", retention: "+38%" },
  },
  {
    id: "fabricforge",
    code: "FF",
    name: "FabricForge",
    tagline: "Analyse, source, and sustainably select African textiles",
    icon: "◎",
    color: "success",
    status: "active",
    features: ["Textile DNA Recognition", "Artisan Sourcing Network", "Sustainability Score", "WACS-Certified Fabrics"],
    stats: { fabrics: "1,200+", artisans: "450", countries: "22 African nations" },
  },
  {
    id: "designvault",
    code: "DV",
    name: "DesignVault",
    tagline: "Archive, version, and protect your creative portfolio",
    icon: "▣",
    color: "gold",
    status: "active",
    features: ["Blockchain IP Protection", "Version Control for Designs", "Collaboration Workspace", "Export to Production"],
    stats: { designs: "45,000+", protected: "100%", formats: "SVG · PDF · DXF · AI" },
  },
  {
    id: "fashionacademy",
    code: "FA",
    name: "FashionAcademy",
    tagline: "Africa's premier AI-powered fashion education platform",
    icon: "◉",
    color: "terracotta",
    status: "beta",
    features: ["12-Module Curriculum", "African Fashion History", "AI Design Mentor", "Industry Certification"],
    stats: { students: "3,200+", modules: "12", cert: "WACS Accredited" },
  },
  {
    id: "iam",
    code: "IAM",
    name: "Identity & Access",
    tagline: "Role-based access control and user management",
    icon: "⬟",
    color: "accent",
    status: "active",
    features: ["RBAC Engine", "OAuth2 / JWT Auth", "MFA Support", "Session Management"],
    stats: { roles: "7", security: "OWASP A+", uptime: "99.97%" },
  },
  {
    id: "admin",
    code: "ADM",
    name: "Admin Console",
    tagline: "Platform governance, analytics, and audit logging",
    icon: "⬢",
    color: "error",
    status: "protected",
    features: ["Audit Log Trail", "User Management", "Revenue Analytics", "System Health Monitor"],
    stats: { logs: "Real-time", retention: "90 days", compliance: "GDPR + GhDP" },
  },
] as const;

export const CURRICULUM = [
  { module: 1, title: "Foundations of African Fashion", duration: "4 weeks", level: "Beginner" },
  { module: 2, title: "Textile Heritage & Symbolism", duration: "3 weeks", level: "Beginner" },
  { module: 3, title: "Pattern Cutting & Construction", duration: "6 weeks", level: "Intermediate" },
  { module: 4, title: "Draping on Diverse Bodies", duration: "4 weeks", level: "Intermediate" },
  { module: 5, title: "AI-Assisted Design Workflow", duration: "5 weeks", level: "Intermediate" },
  { module: 6, title: "Kente, Ankara & Adinkra Mastery", duration: "4 weeks", level: "Advanced" },
  { module: 7, title: "Sustainable Sourcing in Africa", duration: "3 weeks", level: "Advanced" },
  { module: 8, title: "Digital Fashion & Virtual Try-On", duration: "5 weeks", level: "Advanced" },
  { module: 9, title: "Fashion Business & African Markets", duration: "4 weeks", level: "Advanced" },
  { module: 10, title: "Brand Identity & Storytelling", duration: "3 weeks", level: "Advanced" },
  { module: 11, title: "Production & Manufacturing", duration: "4 weeks", level: "Expert" },
  { module: 12, title: "Capstone: Launch Your Collection", duration: "6 weeks", level: "Expert" },
] as const;

export const AUDIT_LOGS = [
  { id: "AUD-001", timestamp: "2025-01-15 09:14:22", user: "admin@mannequin.ai", action: "USER_CREATED", resource: "IAM", severity: "INFO" as const, ip: "41.66.102.14" },
  { id: "AUD-002", timestamp: "2025-01-15 09:22:07", user: "designer@tbuni.edu.gh", action: "DESIGN_EXPORTED", resource: "DesignVault", severity: "INFO" as const, ip: "197.251.67.88" },
  { id: "AUD-003", timestamp: "2025-01-15 10:05:41", user: "unknown", action: "LOGIN_FAILED", resource: "IAM", severity: "WARN" as const, ip: "185.220.101.42" },
  { id: "AUD-004", timestamp: "2025-01-15 10:31:18", user: "admin@mannequin.ai", action: "ROLE_MODIFIED", resource: "IAM", severity: "HIGH" as const, ip: "41.66.102.14" },
  { id: "AUD-005", timestamp: "2025-01-15 11:00:00", user: "student@fashionacademy.ai", action: "MODULE_COMPLETED", resource: "FashionAcademy", severity: "INFO" as const, ip: "154.72.198.22" },
];

```

### FILE: src/hooks/useTheme.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from "react";
import { THEMES } from "../constants";
import type { ColorPalette, ThemeType } from "../types";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: ColorPalette;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem("mannequin-theme");
    return (saved as ThemeType) || "dark";
  });

  const colors = THEMES[theme];

  useEffect(() => {
    localStorage.setItem("mannequin-theme", theme);
    
    // Inject CSS variables into :root
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      // Convert camelCase to kebab-case (e.g., surfaceAlt to --surface-alt)
      const cssVar = `--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
      root.style.setProperty(cssVar, value);
    });
    
    // Set data-theme attribute for high-level selectors if needed
    root.setAttribute("data-theme", theme);
  }, [theme, colors]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

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

### FILE: src/main.tsx
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthGate } from './AuthGate';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

document.getElementById('tuc-splash-styles')?.remove();

```

### FILE: src/styles/global.css
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Sora', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --radius: 2px;
  --radius-lg: 6px;
  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #root {
  height: 100%;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.6;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg);
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--gold);
}

::selection {
  background: var(--gold);
  color: #000;
}

/* Kente geometric pattern overlay */
.kente-bg {
  background-image: 
    repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(201,168,76,0.03) 20px, rgba(201,168,76,0.03) 21px),
    repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(201,168,76,0.03) 20px, rgba(201,168,76,0.03) 21px);
}

.diamond-pattern {
  background-image: 
    linear-gradient(45deg, rgba(201,168,76,0.05) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(201,168,76,0.05) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(201,168,76,0.05) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(201,168,76,0.05) 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
}

@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.gold-shimmer {
  background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 50%, var(--gold) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

```

### FILE: src/types/index.ts
```typescript
export type ThemeType = "dark" | "light" | "highContrast";

export interface ColorPalette {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  gold: string;
  goldLight: string;
  terracotta: string;
  terracottaLight: string;
  text: string;
  textMuted: string;
  textDim: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
}

export interface Module {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly tagline: string;
  readonly icon: string;
  readonly color: string;
  readonly status: "active" | "beta" | "protected";
  readonly features: ReadonlyArray<string>;
  readonly stats: Readonly<Record<string, string>>;
}

export interface CurriculumItem {
  module: number;
  title: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  severity: "INFO" | "WARN" | "HIGH";
  ip: string;
}

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — mannequin-ai
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('mannequin-ai E2E', () => {
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

### FILE: tsconfig.app.json
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"],
  "exclude": ["src/__tests__", "**/*.test.tsx", "**/*.e2e.ts", "vitest.config.ts", "vitest.e2e.config.ts"]
}

```

### FILE: tsconfig.json
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}

```

### FILE: tsconfig.node.json
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}

```

### FILE: vite.config.ts
```typescript
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
  base: './',
  plugins: [react(), tailwindcss()],
})

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — mannequin-ai
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

// Vitest E2E configuration — mannequin-ai
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

