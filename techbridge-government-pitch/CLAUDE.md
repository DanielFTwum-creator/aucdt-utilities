# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---
## Task Delegation

When spawning subagents, use the cheapest model that can handle the task:
- Haiku: bulk mechanical tasks - file ops, formatting, renaming, 
  simple transformations. No judgment required.
- Sonnet: scoped research, code exploration, summarization, 
  synthesis across sources.
- Opus: only when real planning or tradeoffs are involved - 
  architecture, ambiguous requirements, high-stakes decisions.

### Spawn rules:
- Haiku subagents cannot spawn further subagents. 
  If they need to, the task was wrong-sized - return to parent.
- Max spawn depth: 2 (parent → subagent → one more tier, no deeper)
- If a subagent realizes it needs a smarter model, 
  it returns to the parent instead of escalating on its own.
  
## Quick Commands

**Package manager:** pnpm 8.15.0 (required)

| Task | Command |
|---|---|
| **Development server** | `pnpm dev` (localhost:3000) |
| **Build for production** | `pnpm build` (TypeScript check + Vite) |
| **Type checking only** | `pnpm lint` (tsc --noEmit) |
| **Run tests** | `pnpm test` |
| **Tests with watch mode** | `pnpm test:watch` |
| **Coverage report** | `pnpm test:coverage` |
| **Export to PDF** | `pnpm run export-pdf` (builds site, then Playwright + pdf-lib → `exports/`) |
| **Deploy to server** | `pnpm run deploy` (builds + SCP to `/smart/` on techbridge.edu.gh) |

**Note:** This project uses pnpm exclusively. Do not use npm or yarn.

**Deployment:** The `deploy` script copies the production build to the server at `/var/www/vhosts/techbridge.edu.gh/httpdocs/smart/`. Requires SSH access to `root@techbridge.edu.gh` and assumes the `/smart/` directory exists.

---

## Architecture Overview

### Purpose
This is a government proposal website for Ghana's **One Million Coders Programme**. It pitches Techbridge Education Services Ghana as the delivery partner against a named competitor (SmartBridge, India-based). The site is also packaged as a formal PDF document for government submission.

### Stack
- **Frontend:** React 19 + TypeScript 5.9 + Vite 7
- **Routing:** React Router v7 (flat routes, no lazy loading, `basename="/smart"`)
- **Styling:** Tailwind CSS v4 + PostCSS
- **Deployment path:** `/smart/` (configurable via `vite.config.ts` `base` and `App.tsx` `basename`)
- **Animation:** Framer Motion (every page uses `fadeUp` / `fadeIn` variants with `whileInView`)
- **Charts:** Recharts (ImpactPage only)
- **Icons:** lucide-react
- **Build:** Vite with SPA fallback (`try_files $uri $uri/ /index.html` in nginx.conf)
- **Deployment:** Docker (multi-stage: Node build → nginx serve)
- **Testing:** Vitest + @testing-library/react

### Routes (9 total, all flat)
```
/                          → HomePage
/why-techbridge            → WhyTechbridgePage
/programme                 → ProgrammePage
/platform                  → PlatformPage
/track-record              → TrackRecordPage
/impact                    → ImpactPage
/implementation            → ImplementationPage
/contact                   → ContactPage
/executive-summary         → ExecutiveSummaryPage (PDF export friendly)
```

### Layout Structure
- **App.tsx** — Root: `<BrowserRouter>` wrapping `<Navbar>` + `<Routes>` + `<Footer>`
- **Navbar.tsx** — Navigation + mobile hamburger menu
- **Footer.tsx** — Shared footer on all pages

### Styling & Theming

**Tailwind v4 dual theme definition:**
- `tailwind.config.js` — extends `theme.colors` with custom palettes
- `src/index.css` — `@theme` block (Tailwind v4 syntax) *[canonical]*

**Color systems:**
- `techbridge-*` — Brand colors: navy, blue, gold, green, light
- `ghana-*` — Flag stripe: red, gold, green (decorative motif on every page)
- `academic-*` — Legacy from prior ThesisAI project (unused)

**Typography:**
- Headings: `font-serif` (Crimson Text 400/600/700)
- Body: `font-sans` (Inter 300–700)

### Animation Pattern
Every page follows the same motion pattern:
```tsx
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.div
  variants={variants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
```
Uses `whileInView` (not `animate`) so elements animate as they scroll into view.

### PDF Export (Dual Mechanism)

**Browser print (built-in):**
- `ExecutiveSummaryPage` has a print button (`window.print()`)
- `src/index.css` has `@media print` rules: hide nav/footer, add `page-break-after: always` to `.exec-page` divs
- User prints directly from browser

**Playwright automation (`scripts/export-pdf.js`):**
- Run: `pnpm run export-pdf`
- Builds site → starts Vite preview on port 4174 → uses Playwright Chromium to capture each of 9 routes as A4 PDF
- Merges PDFs using `pdf-lib`
- Outputs two files to `exports/`:
  - `Techbridge-One-Million-Coders-Proposal.pdf` (all 9 routes)
  - `Techbridge-Executive-Summary.pdf` (only `/executive-summary`)

### Pages at a Glance
- **HomePage** — Hero with Ghana flag stripe, animated stats (8 weeks, 15K students, 50+ institutions), comparison vs foreign vendors
- **WhyTechbridgePage** — Competitive analysis: 8-row comparison table vs SmartBridge + 4 pillar cards (Accountability, Availability, Ghana Knowledge, Economic Impact)
- **ProgrammePage** — Programme structure: 4 tech tracks (AI/ML, Cloud, Data Science, SoftDev), 3-step learning model, 5-phase lifecycle, regional coverage, year-by-year targets (50K → 1M)
- **PlatformPage** — Three live Techbridge platforms (main LMS, AI hub, adaptive AI), metrics, Skill Wallet mockup, infrastructure features
- **TrackRecordPage** — 5-year history (2020–2025): stat cards, timeline, partnerships, 7-programme breadth, testimonials
- **ImpactPage** — Data dashboard: KPIs, line chart (growth), bar chart (regional), pie chart (tracks), radar chart (Techbridge vs benchmark), ROI visualization
- **ImplementationPage** — 8-week deployment roadmap, phase cards, vs competitor timeline, governance grid, sustainability phases, org chart, risk/mitigation cards
- **ContactPage** — Contact form (`useState`-managed, no API call), three contact cards, process flow, emergency contact
- **ExecutiveSummaryPage** — 8-page A4 PDF-ready document with `page-break-after: always` per page, print/CSS-only rendering
- **LandingPage.tsx** — *Unmounted* (legacy from prior iteration, not in router)

### State Management
**No global state library.** Only local `useState` in three places:
- **ContactPage:** form fields + `submitted` boolean
- **PlatformPage:** `useCountUp` counter animation via `useRef` + `useEffect` + `useInView`
- **Navbar:** `menuOpen` for mobile hamburger menu

### API Integration
**No API calls in production code.** `axios` is in `package.json` but unused. The contact form is client-side only (`setSubmitted(true)` on submit).

The Vite dev server proxies `/api` to `http://localhost:8080` (no backend implemented in this repo).

---

## Bundle & Performance

**Code splitting:** Routes are lazy-loaded using React's `lazy()` and `Suspense`. Each page is a separate chunk, downloaded only when visited. Initial load downloads the main bundle (381 kB gzip) + CSS; subsequent page navigation streams only the needed chunk.

**Bundle breakdown (gzip):**
- Main: 122 kB
- ImpactPage (Recharts): 123.81 kB
- Other pages: 3-8 kB each

This is optimized for slower internet connections — users see the home page quickly, then stream additional pages on demand.

## PWA & Mobile Support

**Progressive Web App:** The app is configured as a PWA with:
- **Service worker** — Generated by `vite-plugin-pwa` using Workbox. Provides offline caching and background sync.
- **Web App Manifest** — Defines app metadata (name, icons, theme colors) for install prompts on iOS/Android home screens.
- **Icons** — SVG icons (192×192 and 512×512 px) stored in `public/` folder; auto-copied to `dist/`.
- **Mobile meta tags** — iOS standalone mode, theme colors, status bar styling configured in `index.html`.

**Files:**
- `public/manifest.json` — App metadata
- `public/favicon.svg`, `icon-192x192.svg`, `icon-512x512.svg` — App icons
- `dist/sw.js` — Service worker (generated at build time)
- `dist/manifest.webmanifest` — Alternative manifest format (auto-generated by Vite PWA plugin)

**Testing PWA:**
```bash
pnpm build && pnpm preview
# In DevTools:
#   - Application → Service Workers (should show active)
#   - Application → Manifest (should show app metadata)
#   - Try offline mode (DevTools → Network → Offline) — site should still load cached pages
```

**App Store packaging:** To publish to Google Play and Apple App Store, you'll need Capacitor. See `GAP-ANALYSIS-MOBILE.md` for the complete roadmap and cost/timeline breakdown.

## Known Issues

1. **Dual theme token definition:** Both `tailwind.config.js` and `src/index.css` define custom colors. For Tailwind v4, the `@theme` block in CSS is canonical; the JS config may be redundant. Clarify which is authoritative to avoid maintenance confusion.

---

## Testing

- **Framework:** Vitest + @testing-library/react
- **Setup:** `src/test/setup.ts` imports `@testing-library/jest-dom` and runs `cleanup()` after each test
- **Environment:** jsdom with `globals: true`
- **Coverage:** Reports to `text`, `json`, `html` (excludes `node_modules/`, `src/test/`, config files)
- **Current state:** Tests are stale and non-functional against the current app

---

## Docker & Deployment

**Dockerfile:**
- Multi-stage: `node:18-alpine` → build stage (pnpm install + vite build) → `nginx:alpine` serve stage
- Copies `dist/` to nginx html root, uses custom `nginx.conf`
- Exposes port 80

**nginx.conf:**
- SPA catch-all: `try_files $uri $uri/ /index.html`
- API proxy: `/api` → `http://backend:8080` with websocket upgrade headers
- Ready for Kubernetes or standalone reverse proxy

---

## Development Notes

- **Hot reload:** Vite HMR is enabled on dev server; changes to React components and CSS are reflected instantly
- **TypeScript strict mode:** Enabled; `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` are enforced
- **CSS:** All styling is Tailwind utility classes; no CSS-in-JS or separate stylesheets per component
- **Icons:** Lucide React icons; check [lucide.dev](https://lucide.dev) for available icon names
- **Animations:** Framer Motion variants are locally scoped per page; consider extracting to `src/constants/animations.ts` if duplication grows

---

*Last updated: 2026-05-06*
