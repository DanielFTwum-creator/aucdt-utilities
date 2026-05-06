<div align="center">
<h1>🎨 TechBridge Poster Studio</h1>
<p><strong>Professional marketing poster generator for Techbridge University College</strong></p>
</div>

---

## Overview

TechBridge Poster Studio is a hybrid client-server application that enables creation and export of professional marketing posters with multiple aspect ratios (cinema, story, portrait, square, landscape).

- **Client:** React 19 + Vite + Tailwind CSS
- **Server:** Node.js Express + Playwright (for PDF/PNG export)
- **Mobile:** Capacitor wrapper for iOS/Android deployment

---

## Features

✨ **5 Aspect Ratios:** Cinema, Story, Portrait, Square, Landscape  
📥 **Export Formats:** PNG, PDF, MP4 (WebCodecs)  
🎨 **Live Preview:** Real-time poster editor  
🏪 **App Store Ready:** PWA manifest, service worker, offline support  
🔒 **Secure:** No API keys in client bundle  

---

## Quick Start

### Prerequisites
- Node.js 24+ (latest stable)
- npm or pnpm

### Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the dev server:**
   ```bash
   npm run dev
   ```

   This starts:
   - Vite dev server with HMR (http://localhost:3000)
   - Express backend with Playwright support (http://localhost:3000)

3. **Open in browser:**
   - http://localhost:3000

### Build & Preview

```bash
npm run build      # Compile for production
npm run preview    # Preview the built app locally
```

---

## Deployment

### Web Deployment (SPA)

The `dist/` output is a static bundle compatible with any HTTP server:

- **Cloud Static Hosts:** Firebase Hosting, Netlify, Vercel
- **Docker:** See `Dockerfile` for containerized serving
- **Node.js:** `npm run start` (Express server)

### Mobile Deployment (iOS / Android)

TechBridge Poster Studio can be packaged as a native app using **Capacitor**.

**Important:** The Playwright PDF/PNG export requires a backend API service (Cloud Run, etc.) since mobile devices cannot run Node.js. See [docs/deployment-guide.md](docs/deployment-guide.md) for detailed instructions.

---

## Project Structure

```
techbridge-poster-studio/
├── src/
│   ├── App.tsx                    # Main editor component
│   ├── components/Poster.tsx      # 5 aspect-ratio poster layouts
│   ├── lib/
│   │   ├── poster-utils.ts        # Shared poster HTML generation
│   │   ├── video-export.ts        # Client-side MP4 export (WebCodecs)
│   │   └── ...
│   ├── types.ts                   # TypeScript definitions
│   ├── constants.ts               # Aspect ratio dimensions
│   └── main.tsx                   # React entry point
├── server.ts                      # Express + Playwright backend
├── vite.config.ts                 # Vite + Tailwind config
├── index.html                     # HTML entry point (PWA meta tags)
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── icons/                     # App icons (multiple sizes)
│   └── sw.js                      # Service worker (auto-generated)
├── Dockerfile                     # Multi-stage Docker build
├── docker-compose.yml             # Local Docker Compose setup
├── docs/
│   ├── deployment-guide.md        # Deployment & Cloud Run setup
│   ├── privacy-policy.md          # App Store / Play Store privacy policy
│   ├── MOBILE_GAP_ANALYSIS.md     # 20-gap audit for App Store readiness
│   └── implementation-status.md   # Current gap implementation status
└── tests/
    └── poster.spec.ts             # Playwright integration tests
```

---

## Environment Variables

### Development
- `.env.local` (git-ignored):
  ```
  GEMINI_API_KEY=your_gemini_key_here
  ```

### Production (Server)
- `NODE_ENV=production`
- `GEMINI_API_KEY` (for future AI features; not currently used in client)

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with Vite HMR + Express backend |
| `npm run build` | Build production React bundle to `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run start` | Start Express server (production mode) |
| `npm run lint` | Run TypeScript type check |

---

## Docker

Build and run the app in a container:

```bash
# Build image
docker build -t techbridge-poster-studio .

# Run with docker-compose
docker-compose up -d

# Access at http://localhost:3000
```

See `Dockerfile` and `docker-compose.yml` for configuration details.

---

## Mobile / App Store Readiness

The app is being prepared for iOS App Store and Google Play Store submission.

**Current Status:** 20 gaps identified across 5 priority levels (P0–P4).

- **P0 (Hard Blockers):** Remote API deployment, iOS VideoEncoder detection, relative asset paths, API key security
- **P1 (Store Submission):** Manifest, icons, meta tags, privacy policy, service worker
- **P2 (Mobile UX):** Responsive layout, input sizing, safe-area insets, touch feedback
- **P3 (Capacitor):** Native packaging, iOS download handling, offline assets
- **P4 (Compliance):** Admin auth hardening

See [docs/MOBILE_GAP_ANALYSIS.md](docs/MOBILE_GAP_ANALYSIS.md) for full details and implementation order.

---

## Testing

Run the Playwright integration test:

```bash
npm test
```

This verifies that the poster generator works correctly across aspect ratios.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Export timeout | Increase timeout in server.ts (line 40) |
| CORS errors on external logo | Ensure logo URL has CORS headers enabled |
| Import paths not resolving | Check `@` alias in `vite.config.ts` |
| Playwright not found | Run `npm install`; Playwright is in devDependencies |

---

## License

Proprietary — Techbridge University College

---

## Contact

- **Developer:** Daniel Frempong Twum (daniel.twum@techbridge.edu.gh)
- **Project:** Techbridge University College ICT Department

---

*Last updated: 2026-05-04*

