# CLAUDE.md — SmartGhana

> Inherits standards from parent `aucdt-utilities/CLAUDE.md`. See there for task delegation, operating principles, and TUC institutional standards.

AI Studio app for Ghana — Powered by Google Gemini API.

---

## Quick Start

**Prerequisites:** Node.js 18+, pnpm 8.15.0+

```bash
# Install dependencies
pnpm install

# Set up environment
# Copy .env.example to .env.local and add your GEMINI_API_KEY
# Get API key from: https://aistudio.google.com/apikey

# Run dev server (localhost:3000)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

**Note:** This project uses pnpm exclusively. Do not use npm or yarn.

---

## Project Overview

### Purpose
SmartGhana is an AI Studio application that demonstrates integration with the Google Gemini API for conversational AI capabilities in a Ghana-focused context.

### Stack
- **Frontend:** React 19 + TypeScript 5.9 + Vite 6.4
- **Styling:** Tailwind CSS v4 + @tailwindcss/vite plugin
- **AI:** Google Gemini API v1.29.0
- **Build:** Vite with React and Tailwind plugins
- **Testing:** Playwright E2E tests

### Environment Configuration

**`.env.local` (required for local development):**
```
GEMINI_API_KEY="your-api-key-here"
APP_URL="http://localhost:3000"
```

Get your free Gemini API key at: https://aistudio.google.com/apikey

The API key is injected at build time via `vite.config.ts`:
```typescript
define: {
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
}
```

---

## Build & Deployment

### Production Build
```bash
pnpm build
```

**Output:** `dist/` folder
- `index.html` — 0.41 kB (gzip: 0.28 kB)
- `assets/index-*.css` — 42.56 kB (gzip: 7.60 kB)
- `assets/index-*.js` — 767.48 kB (gzip: 230.88 kB)

### Bundle Optimization Notes
Current bundle size warning: single JS chunk > 500 kB. For future optimization, consider:
- Dynamic imports via `import()` for route-based code splitting
- `build.rollupOptions.output.manualChunks` for library extraction
- Adjusting `build.chunkSizeWarningLimit` in vite.config.ts

### Deployment Targets
- **AI Studio:** Auto-deployed on git push to main branch
- **Custom server:** Copy `dist/` to web root (SPA requires catch-all routing)

**SPA Routing Note:** If deploying to custom server, configure web server to redirect 404s to `index.html`:
```nginx
# nginx example
try_files $uri $uri/ /index.html;
```

---

## Development

### Dev Server
- **Command:** `pnpm dev`
- **URL:** http://localhost:3000
- **Hot reload:** Enabled (unless `DISABLE_HMR=true`)
- **Port:** 3000 (customizable via `--port=XXXX`)

### TypeScript Checking
```bash
pnpm lint
```
Runs `tsc --noEmit` for type safety without emitting output.

### E2E Tests
```bash
pnpm test:e2e
```
Runs Playwright test suite (see `playwright.config.ts`).

---

## API Integration

### Google Gemini API
- **Package:** `@google/genai` v1.29.0
- **Configuration:** API key loaded from `.env.local` at build time
- **Usage:** React components access `process.env.GEMINI_API_KEY` directly
- **Rate Limits:** Free tier has usage limits; monitor via Google AI Studio dashboard

### Vite Proxy (if needed)
Server proxies `/api` to `http://localhost:8080` (config in vite.config.ts).

---

## Standards & Conventions

### Code Style
Inherits from parent project:
- **Language:** UK British English in all comments and docs
- **Framework:** React 19 + TypeScript 5.9
- **Styling:** Tailwind CSS v4 (see parent for theme conventions)
- **No placeholders:** Production-ready code only

### Frontend Patterns (TUC Standard)
Apply these to `index.html` and components:
- Meta tags: charset, viewport, SEO (description, keywords, author), OG, Twitter Card
- Font preconnect: `fonts.googleapis.com`, `fonts.gstatic.com` before styles
- Analytics: Google Analytics (ID `G-FKXTELQ71R` for TUC properties)
- Theme: `:root`, `[data-theme='dark']`, `[data-theme='light']`, `[data-theme='high-contrast']`
- Typography: Inter (body), Crimson Text or Playfair (headings)
- Animations: `fadeIn`, `slideIn` keyframes preferred

### Documentation Standards
See parent `CLAUDE.md` section 6 for full standards:
- IEEE 830 / 29148 SRS format for specifications
- Document names: `TUC-ICT-SRS-YYYY-NNN`
- Diagrams: SVG format, embedded in docs
- Organization: All docs in `/docs` directory

---

## PWA & Mobile Support

### Current Status (Phase 1 Complete)
SmartGhana is now a fully functional Progressive Web App:
- ✅ Service worker (`dist/sw.js`) provides offline caching via Workbox
- ✅ Manifest (`public/manifest.json`) enables "Add to Home Screen" on iOS/Android
- ✅ Icons (SVG-based, 192×192 and 512×512 px) use Techbridge branding
- ✅ Auto-update enabled — users get new versions automatically when you redeploy
- ✅ Precaches 10 static assets (795 KiB) on first visit
- ✅ Caches Google Fonts for 1 year (offline-ready after first load)

### Testing PWA Locally
```bash
pnpm build && pnpm preview
# In DevTools (F12):
#   → Application → Service Workers (should show "active")
#   → Application → Manifest (shows app metadata)
#   → Network → Offline (toggle)
#   → Refresh page — should load from cache
```

### Roadmap for App Store / Play Store

**Phase 2 (In Progress):** Capacitor setup for native Android/iOS packages
- Install `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`
- Create `capacitor.config.ts`
- Build native `.aab` for Play Store

**Phase 3 (Planned):** Resolve critical blockers before store submission
- **Blocker #1:** Gemini API key embedded in JS bundle → Move to Express backend proxy
- **Blocker #2:** External assets (logos, video) from techbridge.edu.gh → Download locally
- **Blocker #3:** `window.print()` won't work in Capacitor → Replace with `@capacitor/share`

**Full gap analysis:** See `GAP-ANALYSIS-MOBILE.md` for 20-step roadmap, costs, and detailed requirements.

---

## Known Issues & Limitations

1. **Large JS bundle:** Single 767 KB chunk may be slow on 3G connections. Consider route-based code splitting in future iterations.
2. **API key exposure (Phase 3 blocker):** Embedded in browser bundle via `define` in `vite.config.ts`. Both App Store and Play Store reject apps with exposed credentials. Must move to backend proxy before submission.
3. **External asset dependencies (Phase 3 blocker):** Logos and video from `techbridge.edu.gh` break in restricted networks. Play Store / App Store test for this — must download locally before submission.
4. **Print mechanism (Phase 3 blocker):** `window.print()` fails silently in Capacitor WebView. Must replace with `@capacitor/share` for native experience.

---

## File Structure

```
smartghana/
├── src/
│   ├── App.tsx           — Root component
│   ├── main.tsx          — Entry point
│   └── index.css         — Global styles + Tailwind directives
├── public/               — Static assets
├── dist/                 — Production build output (generated)
├── vite.config.ts        — Vite configuration
├── tailwind.config.js    — Tailwind theme config
├── playwright.config.ts  — E2E test configuration
├── .env.example          — Environment template
├── .env.local            — Local secrets (git-ignored)
├── package.json          — Dependencies & scripts
└── CLAUDE.md             — This file
```

---

## Next Steps

- [x] Add PWA support (service worker, manifest) — **Phase 1 Complete**
- [ ] Set up Capacitor for Android/iOS native builds — **Phase 2 In Progress**
- [ ] Resolve API key security blocker (backend proxy) — **Phase 3 Planned**
- [ ] Download assets locally (logos, video) — **Phase 3 Planned**
- [ ] Replace `window.print()` with Capacitor share — **Phase 3 Planned**
- [ ] Optimize bundle size (code splitting)
- [ ] Add comprehensive error handling for API failures
- [ ] Set up CI/CD pipeline for automated testing

---

*Last updated: 2026-05-07 (Phase 1 PWA complete, Phase 2 in progress)*  
*See `GAP-ANALYSIS-MOBILE.md` for complete 20-step mobile app roadmap*
