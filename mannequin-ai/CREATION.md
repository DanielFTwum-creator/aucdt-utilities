# CREATION.md â€” MannequinAI Platform Console

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
