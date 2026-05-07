# CLAUDE.md — SmartGhana

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

## Known Issues & Limitations

1. **Large JS bundle:** Single 767 KB chunk may be slow on 3G connections. Consider route-based code splitting in future iterations.
2. **API key exposure:** Hardcoded into browser bundle. Use caution with production keys; consider backend proxy for sensitive keys.

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

- [ ] Optimize bundle size (code splitting)
- [ ] Add comprehensive error handling for API failures
- [ ] Implement caching strategy for API responses
- [ ] Add PWA support (service worker, manifest)
- [ ] Set up CI/CD pipeline for automated testing
- [ ] Configure production deployment

---

*Last updated: 2026-05-07*
*Status: Dev-ready, build tested, deployment ready*
