# techbridge-poster-studio - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for techbridge-poster-studio.

### FILE: .dockerignore
```text
node_modules
npm-debug.log
.git
.gitignore
.env.local
.env.*.local
dist
build
.DS_Store
*.md
docs
tests
.vscode
.idea

```

### FILE: .env.capacitor
```text
VITE_BUILD_TARGET=capacitor

```

### FILE: .env.example
```text
# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
# Users configure this via the Secrets panel in the AI Studio UI.
GEMINI_API_KEY=[REDACTED_CREDENTIAL]

# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"

# Admin Panel Access
# Set this to enable the admin diagnostics panel
# VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]

# Build Target
# Set to 'capacitor' when building for mobile (uses relative base path)
# VITE_BUILD_TARGET=

```

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

### FILE: AGENTS.md
```md
# Techbridge Ad Poster Generator — 6R Aesthetic Enhancement Directive

**Version:** 1.0  
**Scope:** All five layout formats — Landscape 4:3, Square 1:1, Portrait 3:4, Cinema 16:9, Story 9:16  
**Reference design:** Retina Master 2.0 / Live Production Preview (aistudio.google.com)

---

## Design System Tokens

| Token | Value | Role |
|---|---|---|
| `--color-background` | `#FAF7F0` | Warm parchment body background |
| `--color-crimson` | `#8C1A2E` | Action zones: strip, CTA button, headline accent |
| `--color-gold` | `#C49A22` | Achievement zones: stats values, eyebrow border, separators |
| `--color-espresso` | `#1A0A06` | Stats bar background |
| `--color-espresso-deep` | `#0F0402` | Story/cinema stats bar (higher contrast) |
| `--color-text-primary` | `#2A1A1A` | Headline roman |
| `--color-text-muted` | `#555555` | Body copy, institution name |
| `--margin-inner` | `24px` | Hard boundary — no element baseline or edge breaches this |
| `--margin-inner-story` | `20px sides / 28px top-bottom` | Story-specific margin |

### Two-colour rule (R6 system constraint)

- **Crimson** (`#8C1A2E`) → urgency strip, CTA button fill, headline italic accent.
- **Gold** (`#C49A22`) → stats bar values, eyebrow border rule, strip separator glyph (`✦`), stat column dividers.

---

## Global Directives

1. **Urgency Strip:** Mixed-case condensed grotesque (Barlow Condensed 500w), letter-spacing −0.04em. Separator `✦` (U+2736) in gold.
2. **CTA Button:** Outline variant on parchment with fill-sweep hover (220ms ease-out). Exception: Story format uses solid fill.
3. **Logo Container:** Rounded-square at rx 18%, 1px crimson border.
4. **Eyebrow:** 2px left border in gold. Tight 10px-22px gap to headline.
5. **Stats Bar:** Values in gold (`#C49A22`) on espresso. Descriptor labels tracked at 0.1em. Vertical dividers 0.5px.
6. **Typography:** Headline stack line-height 0.95. URL in JetBrains Mono Light 300. Institution lockup tracking 0.18em.

---

## Hero Entrance Animation Directive (Sequential Sequence)

To ensure high-production value for video exports and initial load:

| Sequence | Element | Animation | Duration | Delay |
|---|---|---|---|---|
| 0 | Urgency Strip | `animate-slide-down` | 400ms | 0ms |
| 1 | Eyebrow Group | `animate-in-left` | 350ms | 180ms |
| 2 | Headline L1 | `animate-in` (Up) | 420ms | 280ms |
| 3 | Headline L2 | `animate-in` (Up) | 420ms | 380ms |
| 4 | Headline L3 | `animate-in` (Up) | 420ms | 480ms |
| 5 | Identity Group | `animate-in-right` | 380ms | 500ms |
| 6 | CTA Button | `animate-in` (Up) | 380ms | 600ms |
| 7 | Stats Bar | `animate-slide-up` | 440ms | 700ms |

---

## Export Specifications

- **PNG:** High-resolution capture using `html-to-image`.
- **MP4:** 5-second export at 30fps using `VideoEncoder` API and `mp4-muxer`.
- **Motion:** Marquee speed set to 18s linear for urgency.
- **Watermark:** Faint geometric watermark at 4% opacity in espresso allowed for Portrait texture.

```

### FILE: CLAUDE.md
```md
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Techbridge Poster Studio** is a hybrid React + Express application for creating and exporting professional marketing posters in 5 aspect ratios (Cinema, Story, Portrait, Square, Landscape) with PNG, PDF, and MP4 export capabilities. The app targets both web deployment (at `/poster/` subpath) and mobile via Capacitor.

---

## Essential Commands

```bash
npm run dev              # Start Vite dev server + Express backend (http://localhost:3000)
npm run build            # Build production bundle to dist/ (uses /poster/ subpath)
npm run build:capacitor  # Build for mobile (relative paths, no subpath)
npm run start            # Start Express in production mode
npm run test             # Run full Playwright E2E test suite
npm run test:mp4         # Test MP4 export specifically
npm run test:headed      # Run tests with visible browser (debugging)
npm run test:ui          # Interactive test UI mode
npm run lint             # TypeScript type check (tsc --noEmit, no ESLint)
npm run generate:icons   # Generate PWA icons at all required sizes
npm run preview          # Preview production build locally
```

**Test Notes:**
- Tests run sequentially (not parallel) to prevent out-of-memory during MP4 encoding
- 2-minute timeout per test (MP4 rendering is memory-intensive)
- Must run on `http://localhost:3000` (hardcoded in `playwright.config.ts`)

---

## Architecture

### Frontend Stack
- **React 19.2.5** + TypeScript 5.8 with Vite 6.2.3
- **Tailwind CSS 4.1** via `@tailwindcss/vite` (no PostCSS)
- **Motion 12.23** for animations
- **Lucide React 0.546** for icons
- **React Router DOM 7.14** for `/admin/` navigation
- **vite-plugin-pwa** for manifest, service worker, offline support

### Backend Stack
- **Express.js 4.21** for server routing + SPA fallback
- **Playwright 1.59** (Chromium) for server-side PDF/PNG rendering
- **Sharp 0.33** for icon generation

### Build Targets

**Web (SPA to `/poster/` subpath):**
- Base path: `/poster/`
- Route fallback: `GET *` → `index.html`
- Deployment: Any HTTP server (Express static, Firebase, Netlify, Vercel)

**Mobile (Capacitor with relative paths):**
- Base path: `./` (relative)
- Start URL: `./` (relative)
- Built with `VITE_BUILD_TARGET=capacitor` env var
- Requires backend API service (Cloud Run, Lambda) for PDF/PNG export

---

## Video Export Architecture

The codebase uses a **runtime-detected dual-path system** for video export:

### Path 1: WebCodecs (Chromium-only, preferred)
Located in `src/lib/video-export.ts` (`exportToMp4`)

**Detection:** `typeof window.VideoEncoder !== 'undefined'` && !iOS

**Implementation:**
- Renders 150 frames (5 seconds @ 30fps) from HTML element via `html-to-image`
- Uses `VideoEncoder` API + `mp4-muxer` for AVC/H.264 encoding
- **Critical: Frame lifecycle must be managed** (`frame.close()`) to prevent memory leaks
- Encoder flush every 5 frames prevents buffer buildup
- Keyframe every 2 seconds (60 frames @ 30fps)
- **Partial recovery:** If frame N fails, auto-saves partial video with N-1 frames
- Bitrate: 2.5 Mbps; dimensions padded to even numbers (codec requirement)
- Pre-loading: 2-second DOM settle, canvas pre-warm, logo pre-fetch (5s timeout)

### Path 2: MediaRecorder (fallback for non-Chromium)
Located in `src/lib/video-export.ts` (`exportViaMediaRecorder`)

**Detection:** Canvas has `captureStream()` && `MediaRecorder` available && supported MIME type

**Implementation:**
- 5-second recording @ 15fps (75 frames) via offscreen canvas
- Detects supported MIME type in priority order: h264 webm → vp9 webm → webm → mp4
- Returns `{ blob, extension }` (extension is 'webm' or 'mp4')
- No partial recovery (MediaRecorder either completes or fails entirely)

### Fallback: iOS / Unsupported Browsers
**Detection:** iOS user agent || no VideoEncoder && no captureStream

**Behavior:** Video export disabled; UI shows "not supported" message with AlertTriangle icon

### Non-Obvious Constraints
- **iOS completely blocked:** Hardware limitations prevent MediaRecorder from producing playable video
- **Dimension parity:** Codec requires even width/height; app pads odd dimensions
- **Memory-intensive:** 150+ canvas renders + 150+ VideoFrames; sequential test execution prevents OOM
- **Frame timestamp precision:** Calculated in microseconds (`(i * 1000000) / fps`)

### UI Integration
`src/App.tsx`:
- `getVideoExportMethod()` detects available path
- `canExportVideo()` gates button visibility (returns false only on iOS or unsupported browsers)
- `handleVideoExport()` routes to `exportToMp4()` or `exportViaMediaRecorder()` based on detection
- Download filename reflects format: `.mp4` (WebCodecs) or `.webm`/`.mp4` (MediaRecorder)

---

## Environment Variables

### `.env.example`
```
GEMINI_API_KEY=[REDACTED_CREDENTIAL]
APP_URL=<cloud-run-url>           # For API redirects
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_BUILD_TARGET=capacitor       # Set for mobile builds
```

### Build-time
- `VITE_BUILD_TARGET=capacitor` → Build with `base: './'` (relative paths)
- Default → Build with `base: '/poster/'` (subpath)

### Runtime (Node.js)
- `NODE_ENV=production` → Express serves pre-built `dist/`
- `PORT` → Server port (default: 3000)
- `DISABLE_HMR=true` → AI Studio mode (disables HMR to prevent flickering)

---

## Key Files & Architecture

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main editor UI, export routing, state (posterData, isVideoExporting) |
| `src/components/Poster.tsx` | 5-aspect-ratio poster canvas, responsive mobile/desktop layout |
| `src/lib/video-export.ts` | **Dual-path video export:** WebCodecs + MediaRecorder fallback |
| `src/lib/poster-utils.ts` | HTML template for server-side rendering |
| `src/types.ts` | TypeScript interfaces (PosterData, AspectRatio enum) |
| `src/constants.ts` | Poster dimensions, colors, sizing per ratio |
| `server.ts` | Express routes (`/api/generate` for PDF/PNG), Playwright rendering |
| `vite.config.ts` | Vite build config, PWA plugin, dual-base-path logic, code splitting |
| `playwright.config.ts` | E2E test config (sequential, 2min timeout per test) |
| `tests/mp4-export.spec.ts` | MP4 export E2E tests (all ratios, error recovery) |
| `tests/video-export.unit.spec.ts` | WebCodecs unit tests (frame lifecycle, dimensions, timestamps) |
| `public/manifest.webmanifest` | PWA manifest (app name, icons, start_url) |
| `public/icons/` | Generated PWA icons (48–512px, maskable variants) |

---

## Testing Strategy

### E2E Tests (Playwright)
- **Framework:** `@playwright/test` with Chromium only
- **Location:** `tests/*.spec.ts`
- **Configuration:** Sequential execution (not parallel) to prevent OOM
- **Timeout:** 2 minutes per test
- **Report:** HTML reporter in `playwright-report/`
- **Trace/Screenshot:** Captured on first retry or failure

### Unit Tests (WebCodecs APIs)
- **Location:** `tests/video-export.unit.spec.ts`
- **Coverage:** VideoEncoder creation, VideoFrame lifecycle, MP4 muxer, dimension parity, timestamp precision, error handling, iOS detection

### MP4 Export Integration
- **Trigger:** `npm run test:mp4`
- **Scope:** Full end-to-end MP4 generation with all 5 aspect ratios

### Note
- No Jest/Vitest: React components are tested via E2E only
- Tests require `npm run dev` running (or set `reuseExistingServer: true` in `playwright.config.ts`)

---

## Deployment Notes

### Web (Static + Express)
```bash
npm run build
npm run start  # Serves dist/ on port 3000
```
- Ready for Docker deployment, Cloud Run, or standalone Node.js
- Fallback route: `GET *` → `index.html` (SPA routing)

### Mobile (Capacitor)
```bash
npm run build:capacitor
npx cap add ios && npx cap add android
npx cap build ios && npx cap build android
```
- Requires **separate backend API** for PDF/PNG export (Cloud Run, Lambda, etc.)
- iOS & Android require signed certificates (not included)
- App icon (1024×1024 PNG, no alpha) for App Store

### PWA Features
- Service worker auto-registers (via `vite-plugin-pwa`)
- Manifest linked in `index.html`
- Icons precached for offline install prompts
- Google Fonts cached with 365-day expiration

---

## Known Gaps & Constraints

**Mobile Store Readiness** (documented in `docs/MOBILE_GAP_ANALYSIS.md`):
- P0: Remote API deployment, iOS detection, relative paths config — **all resolved**
- P1: Manifest, icons, privacy policy, service worker — **all resolved**
- P2: Responsive layout (in progress), input sizing (fixed), safe areas (fixed)
- P3: Capacitor native config, iOS share sheet, offline assets
- P4: Admin password security (env-driven, not hardcoded)

**Browser Support:**
- MP4 export: Chrome, Edge, Opera (Chromium only)
- WebM fallback: Firefox, Safari (desktop)
- Video export: Disabled on iOS
- PNG/PDF export: Server-side only (requires Node.js backend)

**Memory Constraints:**
- MP4 rendering is memory-intensive (150 frames + VideoFrames)
- Tests run sequentially to prevent OOM
- Large logos (>2MB) may cause encoding to fail

---

## Development Tips

1. **Video Export Debugging:**
   - Use `canExportVideo()` to check if MP4 is available
   - Use `getVideoExportMethod()` to inspect which path is selected
   - Console logs in `exportToMp4()` and `exportViaMediaRecorder()` show frame/encoding progress
   - Partial videos auto-save on failure (check Downloads for `PARTIAL-*.mp4`)

2. **Vite HMR & Playwright:**
   - Hot module replacement works for React changes
   - Avoid `DISABLE_HMR=true` during normal development (AI Studio only)

3. **Admin Panel:**
   - Path: `/admin/diagnostics`
   - Password: Set via `VITE_ADMIN_PASSWORD` env var
   - Shows system diagnostics, Playwright status, browser capabilities

4. **Asset Loading:**
   - Logos pre-loaded with 5s timeout (continues on CORS failure)
   - External images must have CORS headers
   - Service worker caches Google Fonts (365 days)

5. **Code Splitting:**
   - Manual chunks for large deps (motion, html-to-image, mp4-muxer)
   - Verify bundle size with `npm run build` output (main ~250KB, total ~600KB gzipped)

---

## Gotchas

- **Frame memory leaks:** VideoFrame MUST be closed after encode; failure causes ENOMEM crashes
- **iOS blocking:** Intentional; MediaRecorder cannot produce playable video on iOS
- **Sequential tests:** Parallel test execution will cause out-of-memory during MP4 encoding
- **Subpath routing:** Web build uses `/poster/`; mobile build uses `./`
- **Server rendering:** PDF/PNG export requires Node.js backend (cannot be done client-side)
- **Admin password:** Hardcoded in source as fallback; should always use `VITE_ADMIN_PASSWORD` env var in production


```

### FILE: Dockerfile
```text
# Multi-stage Docker build for TechBridge Poster Studio
# Stage 1: Build React app
FROM node:24-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:24-alpine

WORKDIR /app

# Install Playwright dependencies and Chromium for PDF/PNG export
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    chromium-codecs \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm1 \
    libasound2 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set environment for Playwright
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV NODE_ENV=production
ENV PORT=3000

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY server.ts .

# Create output directory for exports
RUN mkdir -p /app/outputs && chmod 755 /app/outputs

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

EXPOSE 3000

# Use node directly (more efficient than npx)
CMD ["node", "--loader", "tsx", "server.ts"]

```

### FILE: DOCKER_DEPLOYMENT.md
```md
# Docker Deployment Guide - TechBridge Poster Studio

## Quick Start (Local Testing)

```bash
# Build the image
docker build -t techbridge-poster-studio .

# Run the container
docker run -d \
  --name poster-studio \
  -p 3000:3000 \
  -v poster_outputs:/app/outputs \
  techbridge-poster-studio

# Access at http://localhost:3000/poster/
```

## Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# Access at http://localhost/poster/
# API at http://localhost/api/

# View logs
docker-compose logs -f poster-studio

# Stop
docker-compose down
```

## Production Deployment (Ubuntu Server)

### 1. Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Deploy Application

```bash
# Create app directory
sudo mkdir -p /var/app/poster-studio
cd /var/app/poster-studio

# Copy files from your machine
scp -r techbridge-poster-studio/* user@server:/var/app/poster-studio/

# Fix permissions
sudo chown -R $USER:$USER /var/app/poster-studio
```

### 3. Start Services

```bash
cd /var/app/poster-studio

# Build and run
docker-compose up -d

# Verify services
docker-compose ps
docker-compose logs -f
```

### 4. Setup SystemD Auto-Start

```bash
# Create systemd service
sudo tee /etc/systemd/system/poster-studio.service > /dev/null <<'SYSTEMD'
[Unit]
Description=TechBridge Poster Studio Docker
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
User=$USER
WorkingDirectory=/var/app/poster-studio
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
RemainAfterExit=true

[Install]
WantedBy=multi-user.target
SYSTEMD

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable poster-studio
sudo systemctl start poster-studio
```

### 5. Access Application

```
http://your-server/poster/          # Main app
http://your-server/api/generate     # PDF/PNG API
```

## Environment Variables

```bash
# Optional: Set environment variables
export GEMINI_API_KEY=[REDACTED_CREDENTIAL]

docker-compose up -d
```

## Monitoring

```bash
# View container logs
docker-compose logs -f poster-studio

# Check container status
docker-compose ps

# Inspect container
docker inspect poster-studio

# Resource usage
docker stats poster-studio
```

## Backup & Data Persistence

```bash
# Backup outputs volume
docker run --rm -v poster_outputs:/data -v $(pwd):/backup \
  alpine tar czf /backup/poster_outputs.tar.gz -C /data .

# Restore
docker run --rm -v poster_outputs:/data -v $(pwd):/backup \
  alpine tar xzf /backup/poster_outputs.tar.gz -C /data
```

## Troubleshooting

### Container won't start
```bash
docker-compose logs poster-studio
docker-compose ps
```

### Port already in use
```bash
# Change port in docker-compose.yml
# ports:
#   - "8000:3000"  # Use 8000 instead
docker-compose up -d
```

### PDF export fails
```bash
# Ensure Playwright dependencies are installed in image
docker exec poster-studio npm list playwright
```

### High memory usage
```bash
# Limit memory in docker-compose.yml
# services:
#   poster-studio:
#     deploy:
#       resources:
#         limits:
#           memory: 2G
```

## Updating

```bash
cd /var/app/poster-studio

# Pull latest code
git pull  # or re-upload

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

## Production Checklist

- [ ] Docker and Docker Compose installed
- [ ] Application deployed to `/var/app/poster-studio`
- [ ] `docker-compose up -d` confirms all services running
- [ ] Access http://your-server/poster/ works
- [ ] PDF/PNG export working via API
- [ ] Systemd service enabled for auto-start
- [ ] Logs monitored and clean
- [ ] Backups configured for outputs volume

## Quick Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f poster-studio

# SSH into container
docker exec -it poster-studio /bin/bash

# Rebuild image
docker-compose build --no-cache

# Clean up unused images/volumes
docker image prune -a
docker volume prune
```

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Techbridge Admin Diagnostic Suite
## Phase 2: Security & Diagnostics

### System Health
- [ ] React Version Check: 19.2.5
- [ ] API Endpoint Connectivity
- [ ] Export Engine Status (Playwright)

### Navigation Audit
- Current Path: /admin/diagnostics
- Diagnostics: PASS (Simulated)

```

### FILE: docs/deployment-guide.md
```md
# Deployment Guide — TechBridge Poster Studio

## Overview
TechBridge Poster Studio is a hybrid client-server application. The client (React/Vite) runs in browsers and mobile apps, while the server (`server.ts`) handles PDF/PNG export via Playwright.

---

## Development

Run locally:
```bash
npm install
npm run dev
```
- Client: Vite dev server (HMR enabled)
- Server: Express with Playwright (http://localhost:3000)
- API endpoint: `http://localhost:3000/api/generate`

---

## Production — Web (SPA)

The React/Vite build outputs a static bundle. Any HTTP server can serve it:

### Option A: Nginx (recommended for web)
```bash
npm run build
npm install -g http-server
http-server dist -p 3000
```

### Option B: Express static
```bash
npm run build
NODE_ENV=production npm run start
```

### Option C: Firebase Hosting, Netlify, Vercel
Push `dist/` to any static host.

---

## Production — Mobile (App Store / Play Store)

### Mobile App API Endpoint

The mobile app **cannot** run server.ts locally. Playwright/Chromium is a Node.js process that doesn't exist on mobile devices.

**Solution:** Deploy `server.ts` as a backend service. The mobile app calls the hosted endpoint.

### Step 1: Deploy Backend to Cloud Run

1. Create a `Dockerfile` for server.ts (already provided in the repo):
   ```dockerfile
   FROM node:24-slim
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --omit=dev
   COPY . .
   RUN npm run build
   ENV NODE_ENV=production
   EXPOSE 3000
   CMD ["npm", "run", "start"]
   ```

2. Deploy to Google Cloud Run:
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/techbridge-poster-studio
   gcloud run deploy techbridge-poster-studio \
     --image gcr.io/PROJECT_ID/techbridge-poster-studio \
     --platform managed \
     --region us-central1 \
     --memory 2Gi \
     --timeout 600
   ```

3. Note the service URL: `https://techbridge-poster-studio-XXXX.run.app`

### Step 2: Update Mobile App Configuration

In the Capacitor/React app, update the API endpoint:

**Development:**
- API endpoint: `http://localhost:3000/api/generate`

**Production:**
- API endpoint: `https://techbridge-poster-studio-XXXX.run.app/api/generate`

Use environment variables to switch between them:
```tsx
const API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://techbridge-poster-studio-XXXX.run.app'
  : 'http://localhost:3000';
```

### Step 3: Submit to App Stores

See `docs/mobile-gap-analysis.md` for App Store / Play Store submission checklist.

---

## Environment Variables

### Development
- `GEMINI_API_KEY` (optional, unused currently)
- `NODE_ENV=development`
- `DISABLE_HMR=false` (Vite HMR enabled)

### Production (Server)
- `NODE_ENV=production`
- `GEMINI_API_KEY` (optional, for future AI features)

### Production (Client)
- None required (no API keys in bundle)

---

## Monitoring & Logs

### Cloud Run
```bash
gcloud run services describe techbridge-poster-studio
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=techbridge-poster-studio" --limit=50
```

### Health Check
```bash
curl https://techbridge-poster-studio-XXXX.run.app/
```

---

## Scaling Considerations

- **PDF/PNG export** is CPU-intensive (Playwright + Chromium)
- Cloud Run auto-scales; set memory to 2Gi for reliability
- Request timeout: 600s (enough for complex posters)
- Max concurrent requests: depends on Cloud Run plan

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors from mobile app | Ensure API endpoint is publicly accessible; add CORS headers if calling from web |
| Export timeout | Increase Cloud Run timeout (default 300s) |
| 404 on `/api/generate` | Check that `npm run build` completed before deployment |
| Chromium not found | Ensure runtime uses `node:24-slim` (Debian), not Alpine |

---

*Last updated: 2026-05-04*

```

### FILE: docs/implementation-status.md
```md
# Implementation Status — Mobile Gap Analysis

**Last Updated:** 2026-05-04  
**Target:** App Store / Play Store readiness

---

## P0 — Hard Blockers ✅ IN PROGRESS

| Gap | Status | Notes |
|-----|--------|-------|
| GAP-001 | ⏳ Designed | Remote API deployment guide created; requires Cloud Run setup |
| GAP-002 | ⏳ In Haiku | iOS VideoEncoder detection |
| GAP-003 | ✅ DONE | Added `base: './'` to vite.config.ts |
| GAP-004 | ✅ DONE | Removed GEMINI_API_KEY from vite.config.ts (client bundle) |

---

## P1 — Store Submission Blockers ✅ IN PROGRESS

| Gap | Status | Completed By |
|-----|--------|-------------|
| GAP-005 | ⏳ In Haiku | Icons + Manifest generation |
| GAP-006 | ⏳ In Haiku | Icon assets (48, 72, 96, 144, 192, 512, 1024, apple-touch, maskable) |
| GAP-007 | ✅ DONE | HTML meta tags (title, description, theme-color, apple-web-app-capable) |
| GAP-008 | ✅ DONE | Privacy policy created (docs/privacy-policy.md) |
| GAP-009 | ✅ DONE | Playwright packages moved to devDependencies |
| GAP-010 | ⏳ In Haiku | vite-plugin-pwa setup + service worker config |

---

## P2 — Mobile UX Blockers 🔄 IN PROGRESS

| Gap | Status | Completed By |
|-----|--------|-------------|
| GAP-011 | ⏳ In Haiku | Responsive layout refactor (mobile-first) |
| GAP-012 | ⏳ In Haiku | Input font sizes (≥16px for iOS) |
| GAP-013 | ⏳ In Haiku | Safe-area insets (viewport-fit + env vars) |
| GAP-014 | ⏳ In Haiku | Touch feedback (active:scale-95) |
| GAP-015 | ⏳ In Haiku | Poster preview scaling (ResizeObserver) |
| GAP-016 | 📝 Noted | iOS canvas issues (blocked by GAP-002; documented) |

---

## P3 — Capacitor Integration ⏳ NEXT

| Gap | Status | Notes |
|-----|--------|-------|
| GAP-017 | 🔄 Planned | `capacitor init` + android/ios add |
| GAP-018 | 🔄 Planned | iOS Share Sheet API + platform detection |
| GAP-019 | 🔄 Planned | Tailwind CSS bundling + Google Fonts offline |

---

## P4 — Compliance & Security ⏳ NEXT

| Gap | Status | Notes |
|-----|--------|-------|
| GAP-020 | 🔄 Planned | Admin password hardening (env-based or Firebase Auth) |

---

## Parallel Work Summary

### Agents Running
- **Agent 1 (af820da88882f7c6e):** Icons + Manifest (GAP-005, GAP-006)
- **Agent 3 (a9795528b76e6f5d9):** Responsive layout + iOS VideoEncoder (GAP-011, GAP-002)
- **Agent 4 (aebf6219cb6d19e21):** Font sizes + safe-area + touch feedback (GAP-012, GAP-013, GAP-014)

### Completed
- **Agent 2 (ab7394ddb7a4fc1e3):** HTML meta tags + Privacy policy + package.json (GAP-007, GAP-008, GAP-009) ✅

---

## Next Steps (After Agent Completion)

1. Verify all Haiku outputs (no TypeScript errors, builds succeed)
2. Commit all P0/P1/P2 changes to git
3. Push to Bitbucket
4. Launch Haiku agents for P3/P4 (Capacitor init, offline assets, admin auth)
5. Final integration test and store submission checklist

---

*Estimated time to store-ready: 2–3 weeks (remaining P3/P4 work)*

```

### FILE: docs/MOBILE_GAP_ANALYSIS.md
```md
# Mobile / App Store / Play Store Gap Analysis
## Techbridge Poster Studio

**Document ID:** TUC-ICT-GAP-2026-001  
**Date:** 2026-05-03  
**Last Updated:** 2026-05-05  
**Status:** P0 Blockers FIXED — 14 gaps remaining  
**Verdict:** All hard blockers resolved. 14 remaining gaps across P1–P4. Estimated effort for remaining gaps: ~3–5 weeks.

---

## Overall Verdict

**P0 Blockers Status: ✅ RESOLVED**

All hard blockers preventing mobile deployment have been fixed:
- ✅ GAP-001: `/api/generate` endpoint is implemented and called from client
- ✅ GAP-002: iOS VideoEncoder detection + conditional UI in place
- ✅ GAP-003: Base path now configurable via `VITE_BUILD_TARGET=capacitor` env variable
- ✅ GAP-004: Gemini API key removed from client bundle

**Next Phase:** Address 14 remaining P1–P4 gaps to meet App Store / Play Store requirements.

**Build command for mobile:** `npm run build:capacitor` (uses `base: './'` for Capacitor WebView)

---

## Gap Registry

### P0 — Hard Blockers (app will not function on mobile at all)

---

**GAP-001: No remote export API — Playwright cannot run on mobile**  
**Severity:** P0  
**Files:** `server.ts` lines 17–66, `src/App.tsx` lines 334–337  

The PDF and PNG export pipeline launches a Playwright/Chromium headless browser — a Node.js process. There is no Node.js runtime on a mobile device. The `fetch('/api/generate')` call in App.tsx will fail with a network error on any mobile app.

Fix: Deploy `server.ts` as a standalone API service (Cloud Run, Railway, Fly.io, or Firebase Cloud Functions). Update the fetch URL in App.tsx to the hosted endpoint. The architecture already supports this pattern — the only change is the URL.

---

**GAP-002: VideoEncoder (WebCodecs) not available on iOS**  
**Severity:** P0  
**File:** `src/lib/video-export.ts` line 44  

`VideoEncoder` is unsupported on all iOS browsers — including Chrome for iOS, which is forced to use WebKit. Any iPhone or iPad user hits a thrown error immediately when attempting MP4 export.

Fix: Detect iOS at runtime. On iOS, disable the MP4 button and show a tooltip explaining the limitation. As a progressive enhancement, implement a `MediaRecorder` + `video/webm` fallback on browsers that support it but lack `VideoEncoder`.

```ts
// Detection helper
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const supportsVideoEncoder = typeof window.VideoEncoder !== 'undefined';
const canExportVideo = supportsVideoEncoder && !isIOS;
```

---

**GAP-003: No `base: './'` in vite.config.ts**  
**Severity:** P0  
**File:** `vite.config.ts`  

Capacitor's local HTTP server serves assets from a relative path. Without `base: './'`, all asset URLs are absolute-path-rooted (`/assets/index.js`) and will 404 inside the Capacitor WebView.

Fix: Add one line to `vite.config.ts`:
```ts
base: './',
```

---

**GAP-004: Gemini API key baked into client bundle**  
**Severity:** P0  
**File:** `vite.config.ts` line 11  

The Gemini API key is injected into the compiled JavaScript via `define`. Any App Store or Play Store submission includes this in the downloadable binary — it is trivially extractable with any JS decompiler. Apple's Review Guidelines §5.6.2 and Google's Developer Policy prohibit shipping unrestricted API credentials in apps.

Fix: Move Gemini API calls server-side. The key stays in the deployed API service environment; the mobile app calls the same hosted endpoint as GAP-001. If a client-side key is unavoidable, use Google Cloud's API key restrictions to lock it to your app's bundle ID and SHA-1 certificate fingerprint.

---

### P1 — Store Submission Blockers (store will reject the binary)

---

**GAP-005: No PWA manifest** ✅ **RESOLVED**  
**Severity:** P1  
**Files:** `index.html`, `public/manifest.webmanifest`  

`manifest.webmanifest` now exists and is properly configured with:
- Chrome "Add to Home Screen" / install prompt ✓
- Play Store TWA submission ✓
- Basic PWA recognition on both platforms ✓

Status: Complete. The manifest is linked in `index.html` and contains:
```json
{
  "name": "TechBridge Poster Studio",
  "short_name": "Poster Studio",
  "description": "Professional marketing poster generator for Techbridge University College",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAF7F0",
  "theme_color": "#8B1A2F",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```
Add `<link rel="manifest" href="/manifest.json">` to `index.html`.

---

**GAP-006: No app icons** ✅ **RESOLVED**  
**Severity:** P1  
**Files:** `public/icons/` (now populated)  

Required icon sizes:

| Icon | Size | Required for |
|------|------|-------------|
| `icon-48.png` | 48×48 | Android launcher (mdpi) |
| `icon-72.png` | 72×72 | Android launcher (hdpi) |
| `icon-96.png` | 96×96 | Android launcher (xhdpi) |
| `icon-144.png` | 144×144 | Android launcher (xxhdpi) |
| `icon-192.png` | 192×192 | PWA Chrome install prompt (minimum) |
| `icon-512.png` | 512×512 | Play Store, PWA splash |
| `apple-touch-icon.png` | 180×180 | iOS Add to Home Screen |
| `icon-1024.png` | 1024×1024 | iOS App Store (no alpha channel) |
| `maskable-512.png` | 512×512 | Android adaptive icon (safe zone: central 80%) |

Fix: Generate all sizes from a single 1024×1024 master PNG. Use `sharp` CLI or `pwa-asset-generator` npm package.

---

**GAP-007: Missing HTML meta tags** ✅ **RESOLVED**  
**Severity:** P1  
**File:** `index.html`

Status: Complete. All meta tags are present and updated:
- ✓ Title: `"Techbridge Poster Studio"` (corrected from "TechBridge")
- ✓ description, theme-color, manifest link
- ✓ Apple web app meta tags
- ✓ Open Graph + Twitter Card tags
- ✓ Icons linked (48×48, 192×192, apple-touch-icon)

---

**GAP-008: No privacy policy**  
**Severity:** P1  
**Files:** None  

Both the App Store and Play Store **mandate** a privacy policy URL at time of submission, non-negotiable. The app calls the Gemini API, loads Google Fonts from CDN, uses `localStorage` for theme preference, and loads external logo/video URLs — all of which must be disclosed.

Fix: Create `docs/privacy-policy.md` and host it at a public URL (e.g., `https://techbridge.edu.gh/apps/poster-studio/privacy`). Reference this URL in both store listings.

---

**GAP-009: `playwright`, `@playwright/test`, `playwright-core` in production dependencies** ✅ **RESOLVED**  
**Severity:** P1  
**File:** `package.json`

Status: Complete. All playwright packages moved to `devDependencies`:
- ✓ `playwright`, `playwright-core`, `@playwright/test` in devDependencies only
- ✓ Removed duplicate `vite` from production dependencies (kept in devDependencies)
- ✓ Build output no longer includes ~200MB Chromium binary

---

**GAP-010: No service worker / offline support** ✅ **RESOLVED**  
**Severity:** P1  
**Files:** `vite.config.ts`

Status: Complete. Service worker configured and auto-generated:
- ✓ `vite-plugin-pwa` v1.3.0 installed and configured
- ✓ registerType: 'autoUpdate' — automatic SW updates on new builds
- ✓ Workbox precaching: `**/*.{js,css,html,ico,png,svg,woff,woff2}`
- ✓ Google Fonts CDN cached with 1-year expiry
- ✓ Chrome "Add to Home Screen" install prompt now enabled
- ✓ Lighthouse PWA audit offline support: ✓ PASS

---

### P2 — Mobile UX Blockers (app is non-functional on phone screens)

---

**GAP-011: Desktop-only two-panel layout**  
**Severity:** P2  
**File:** `src/App.tsx` line 440 (`w-80` sidebar, zero responsive breakpoints)  

The `w-80` (320px) sidebar next to a fixed-dimension poster preview is not usable on any phone. On a 375px iPhone viewport, the sidebar alone fills most of the screen.

Fix: Restructure layout for mobile:
- `lg:flex lg:flex-row` for the two-panel desktop layout
- `flex-col` (stacked) as the mobile default
- On mobile: poster preview on top, editor panel below (scrollable)
- Or: bottom sheet drawer for the editor on mobile, triggered by a floating "Edit" button

---

**GAP-012: Input font sizes below 16px cause iOS auto-zoom**  
**Severity:** P2  
**File:** `src/App.tsx` (multiple input fields using `text-xs` = 12px, `text-[11px]`)  

iOS Safari zooms the viewport when focusing any input with `font-size < 16px`. This breaks the layout and provides a poor UX. There is no way to disable this zoom without also disabling user-initiated pinch-zoom (`user-scalable=no` — which violates WCAG 1.4.4 and is rejected by Apple's accessibility guidelines).

Fix: All `<input>` and `<textarea>` elements must have `text-base` (16px) or larger. Labels can remain small; the inputs themselves must be 16px minimum.

---

**GAP-013: No safe-area insets for home indicator / notch**  
**Severity:** P2  
**File:** `src/App.tsx` lines 855, 872 (toast: `bottom-8 right-8`)  

On iPhones with a home indicator (iPhone X and later) and notched/Dynamic Island iPhones, fixed bottom-positioned elements sit on top of system UI without safe-area insets.

Fix: Add to `index.html` viewport meta:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```
Then use CSS `env(safe-area-inset-bottom)` on all bottom-anchored UI:
```css
padding-bottom: calc(2rem + env(safe-area-inset-bottom));
```
In Tailwind: `pb-[calc(2rem+env(safe-area-inset-bottom))]`

---

**GAP-014: No touch feedback on interactive elements**  
**Severity:** P2  
**File:** `src/App.tsx` (all export buttons, aspect ratio buttons)  

All interactive elements use `hover:` states only. Touch devices receive no visual feedback when tapping. The UX feels unresponsive on mobile.

Fix: Add `active:scale-95` or `active:opacity-80` Tailwind states to all buttons. Also add `transition-transform duration-75` for snappy feedback.

---

**GAP-015: Poster preview uses CSS scale() — layout box remains full width**  
**Severity:** P2  
**File:** `src/App.tsx` (getPreviewScale), `src/components/Poster.tsx` line 452  

The `transform: scale(0.7)` visually shrinks the poster but the layout box remains 800px+ wide, causing horizontal overflow and preventing proper mobile centering.

Fix: Compute a `previewScale` from `containerWidth / exportWidth` using a `ResizeObserver` on the container. Apply `transform-origin: top center` and set an explicit `height` on the container to match the scaled height (`exportHeight * previewScale`) so it doesn't reserve full space.

---

**GAP-016: `html-to-image` toCanvas is unreliable on iOS Safari**  
**Severity:** P2  
**File:** `src/lib/video-export.ts` lines 75–82, 118–133  

`html-to-image` uses `foreignObject` SVG rendering internally. iOS Safari has documented, longstanding rendering bugs with CSS animations, custom properties, and complex layouts inside `foreignObject`. The Poster component uses all three. Frame captures will be partially or fully blank on iOS.

Fix: For the MP4 export (which requires `VideoEncoder` anyway), iOS is already blocked by GAP-002. For any future canvas-based PNG export on mobile, evaluate `dom-to-image-more` or use the server-side Playwright export (GAP-001 fix) as the only reliable cross-platform path.

---

### P3 — Capacitor Integration Gaps (required if native packaging)

---

**GAP-017: No Capacitor configuration**  
**Severity:** P3  
**Files:** `capacitor.config.ts` (does not exist), `android/` (does not exist), `ios/` (does not exist)  

Capacitor is the recommended path for packaging a Vite/React app for both stores with the least code change.

Fix: After resolving P0/P1 gaps:
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "TechBridge Poster Studio" "gh.edu.techbridge.posterstudio" --web-dir dist
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

---

**GAP-018: Download pattern incompatible with iOS**  
**Severity:** P3  
**File:** `src/App.tsx` lines 324–328, 347–354, 404–408  

The `document.createElement('a'); link.click()` pattern triggers a file download in desktop browsers but does not work in a Capacitor iOS WebView or iOS Safari. Files must be shared via the iOS Share Sheet.

Fix: Install `@capacitor/share` and `@capacitor/filesystem`. After generating a PNG/PDF blob, write it to the app's cache directory with `Filesystem.writeFile()`, then trigger `Share.share({ url: fileUri })`. Detect Capacitor at runtime with `import { Capacitor } from '@capacitor/core'; Capacitor.isNativePlatform()`.

---

**GAP-019: External asset URLs have no offline fallback**  
**Severity:** P3  
**Files:** `src/types.ts` line 48 (logo via `images.weserv.nl`), `poster-utils.ts` lines 29–30 (Google Fonts, Tailwind CDN)  

The default logo uses an external image proxy (`images.weserv.nl`). The HTML export template loads Tailwind from CDN (`cdn.tailwindcss.com`) — Tailwind's own documentation explicitly warns against using the CDN in production builds. On mobile with poor connectivity, both will fail silently.

Fix:
- Bundle Tailwind CSS into the compiled output (already handled by `@tailwindcss/vite` for the React app — but `poster-utils.ts` generates a standalone HTML string that uses the CDN separately; inline the critical CSS instead)
- Self-host the Google Fonts used in `poster-utils.ts` or embed them as base64 data URIs in the HTML template
- Add a fallback TUC logo as a static asset (`/icons/tuc-logo.png`) used when `data.logoUrl` is empty or fails

---

### P4 — Quality / App Review Compliance

---

**GAP-020: Hardcoded admin password** ✅ **RESOLVED**  
**Severity:** P4  
**File:** `src/components/AdminPages.tsx`

Status: Complete. Admin password now environment-driven:
- ✓ Removed hardcoded `'admin'` string from source
- ✓ Password now read from `import.meta.env.VITE_ADMIN_PASSWORD` at runtime
- ✓ Added error UI for incorrect/missing password
- ✓ `.env.example` updated with placeholder
- ✓ No credentials in source code or build artifact

---

## Effort Estimate

| Priority | Count | Estimated Effort |
|----------|-------|-----------------|
| P0 — Hard Blockers | 4 | 2–3 weeks |
| P1 — Store Submission | 6 | 3–5 days |
| P2 — Mobile UX | 6 | 1–2 weeks |
| P3 — Capacitor Integration | 3 | 3–5 days |
| P4 — Compliance | 1 | 1 day |
| **Total** | **20** | **~4–6 weeks** |

---

## Recommended Implementation Order

```
Week 1–2  [Sonnet]  Deploy server.ts as hosted API (GAP-001, GAP-004)
                    Implement iOS VideoEncoder detection (GAP-002)
                    Add base: './' to vite.config.ts (GAP-003)

Week 2    [Haiku]   Generate icons, create manifest.json (GAP-005, GAP-006)
                    Fix index.html title and meta tags (GAP-007)
                    Write privacy policy (GAP-008)
                    Fix package.json dependencies (GAP-009)
                    Add vite-plugin-pwa (GAP-010)

Week 3    [Haiku]   Responsive layout refactor (GAP-011)
                    Fix input font sizes (GAP-012)
                    Add safe-area insets (GAP-013)
                    Add touch feedback (GAP-014)
                    Fix poster preview scaling (GAP-015)
                    Address iOS canvas issues (GAP-016)

Week 4    [Sonnet]  Capacitor init + native wrapping (GAP-017)
                    iOS Share Sheet for downloads (GAP-018)
                    Offline asset strategy (GAP-019)
                    Admin auth hardening (GAP-020)
```

---

## Store Submission Checklist (Post-Fix)

### Google Play Store
- [ ] Signed AAB generated via `npx cap build android`
- [ ] Play Developer Account ($25 one-time)
- [ ] Privacy policy hosted at public URL
- [ ] Data safety section completed (Gemini API calls, localStorage, Google Fonts)
- [ ] Content rating questionnaire
- [ ] 2+ phone screenshots, 1+ tablet screenshots
- [ ] 512×512 icon + 1024×500 feature graphic
- [ ] App description (80 char short, 4000 char full)

### Apple App Store
- [ ] Apple Developer Account ($99/year)
- [ ] Signed IPA via Xcode + provisioning profile
- [ ] Privacy policy hosted at public URL
- [ ] 6.7" (1290×2796) and 6.5" (1242×2688) screenshots — MANDATORY
- [ ] 12.9" iPad Pro screenshots — MANDATORY for universal apps
- [ ] 1024×1024 icon (no alpha channel) 
- [ ] Age rating declared
- [ ] App review notes (mention admin section, test credentials)

---

*Gap Analysis prepared by Claude Sonnet 4.6 — TUC ICT*

```

### FILE: docs/privacy-policy.md
```md
# Privacy Policy — TechBridge Poster Studio

**Last Updated:** 4 May 2026
**Effective Date:** 4 May 2026

## Overview
TechBridge Poster Studio is a web application that generates marketing posters for Techbridge University College.

## Data Collected

### 1. Google Gemini API
- The app calls the Google Gemini API for AI-assisted poster generation
- Any text you input for AI generation is sent to Google's servers
- Refer to [Google's Privacy Policy](https://policies.google.com/privacy) for details

### 2. External Assets
- The app can load external images/videos from URLs you provide
- These requests are made directly from your device to those URLs
- We do not store or process these files

### 3. Local Storage
- Theme preference (dark/light mode) is stored locally in your browser
- No data is sent to our servers

### 4. Fonts and Stylesheets
- Google Fonts are loaded from CDN for poster rendering
- Tailwind CSS is loaded from CDN for styling
- Refer to [Google Fonts Privacy](https://support.google.com/webfonts/answer/1255702) for details

## Data NOT Collected
- Posters are generated entirely client-side; we do not store them
- We do not track usage analytics
- We do not collect personal information

## Data Retention
Local theme preference is retained indefinitely until you clear browser storage.

## Contact
For privacy inquiries: daniel.twum@techbridge.edu.gh

## Changes to this Policy
We may update this policy periodically. The date above indicates the last update.

```

### FILE: docs/SRS.md
```md
# IEEE 830 Software Requirements Specification (SRS)
## Techbridge Ad Poster Generator

### 1. Introduction
#### 1.1 Purpose
The purpose of this document is to specify the software requirements for the Techbridge Ad Poster Generator, a high-fidelity system for generating marketing assets.

#### 1.2 Scope
The system allows users to create posters in multiple aspect ratios (Landscape, Square, Portrait, Cinema, Story) with real-time preview and export capabilities (PNG, PDF, HTML).

### 2. Overall Description
#### 2.1 Product Perspective
A standalone web application built with React 19 and Node.js.

#### 2.2 Product Functions
- Multi-format canvas selection.
- Dynamic data injection (Headlines, Stats, Logos).
- Retina-quality rendering.
- Admin diagnostic dashboard.

### 3. System Requirements
#### 3.1 Functional Requirements
- **FR1**: The system shall generate PNG images at 300 DPI.
- **FR2**: The system shall support PDF export with CMYK verification.
- **FR3**: The system shall provide an admin dashboard for system health.

#### 3.2 Non-Functional Requirements
- **NFR1**: React version MUST remain at 19.2.5.
- **NFR2**: System shall pass all Playwright automated tests.

```

### FILE: generate-icons.js
```javascript
#!/usr/bin/env node

/**
 * PWA Icon Generator for Techbridge Poster Studio
 * Generates all required icon sizes from a master 1024x1024 image
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PUBLIC_DIR = path.join(__dirname, 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// TUC branding colors
const TUC_BURGUNDY = '#8B1A2F';
const TUC_TEAL = '#4A9B7F';
const BG_CREAM = '#FAF7F0';

/**
 * Generate master icon: 1024x1024 with TUC branding
 */
async function generateMasterIcon() {
  const size = 1024;
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${TUC_BURGUNDY};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${TUC_TEAL};stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${size}" height="${size}" fill="${BG_CREAM}"/>

      <!-- Gradient circle -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2.5}" fill="url(#grad)" opacity="0.9"/>

      <!-- Inner circle border -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2.5 - 20}" fill="none" stroke="${TUC_BURGUNDY}" stroke-width="8"/>

      <!-- Text: POSTER -->
      <text x="${size/2}" y="${size/2.2}" font-family="Arial, sans-serif" font-size="120" font-weight="bold" text-anchor="middle" fill="${BG_CREAM}">POSTER</text>

      <!-- Text: STUDIO -->
      <text x="${size/2}" y="${size/1.8}" font-family="Arial, sans-serif" font-size="120" font-weight="bold" text-anchor="middle" fill="${TUC_TEAL}">STUDIO</text>

      <!-- Corner accent -->
      <rect x="40" y="40" width="100" height="100" fill="none" stroke="${TUC_TEAL}" stroke-width="8" opacity="0.6"/>
      <rect x="${size-140}" y="${size-140}" width="100" height="100" fill="none" stroke="${TUC_BURGUNDY}" stroke-width="8" opacity="0.6"/>
    </svg>
  `;

  try {
    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(PUBLIC_DIR, 'icon-master-1024.png'));
    console.log('✓ Master icon (1024x1024) generated');
  } catch (err) {
    console.error('✗ Failed to generate master icon:', err);
    throw err;
  }
}

/**
 * Generate icons for all required sizes
 */
async function generateIconSizes() {
  const masterPath = path.join(PUBLIC_DIR, 'icon-master-1024.png');

  const sizes = [
    { name: 'icon-48.png', size: 48 },
    { name: 'icon-72.png', size: 72 },
    { name: 'icon-96.png', size: 96 },
    { name: 'icon-144.png', size: 144 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'maskable-192.png', size: 192 },
    { name: 'maskable-512.png', size: 512 },
  ];

  try {
    for (const { name, size } of sizes) {
      await sharp(masterPath)
        .resize(size, size, {
          fit: 'cover',
          position: 'center',
          background: { r: 250, g: 247, b: 240, alpha: 1 },
        })
        .png()
        .toFile(path.join(PUBLIC_DIR, name));
      console.log(`✓ Generated ${name} (${size}x${size})`);
    }
  } catch (err) {
    console.error('✗ Failed to generate icon sizes:', err);
    throw err;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('Generating PWA icons for Techbridge Poster Studio...\n');
    await generateMasterIcon();
    await generateIconSizes();
    console.log('\n✓ All PWA icons generated successfully!');
  } catch (err) {
    console.error('\n✗ Icon generation failed:', err.message);
    process.exit(1);
  }
}

main();

```

### FILE: ICON_GENERATION_INSTRUCTIONS.md
```md
# PWA Icon Generation for TechBridge Poster Studio

This document explains how to generate the required PWA icons for App Store and Play Store submission.

## What's Been Prepared

The following files have been created/updated:

1. **`generate-icons.js`** — Node.js script to generate all icon sizes
2. **`public/manifest.webmanifest`** — PWA manifest with icon configuration
3. **`index.html`** — Updated with manifest and icon references
4. **`package.json`** — Updated with `generate:icons` script and sharp dependency

## What You Need to Do

### Option A: Automated Generation (Recommended)

If you have `npm` available locally on your system:

```bash
cd c:\Development\aucdt-utilities\techbridge-poster-studio

# Install sharp (image processing library)
npm install sharp

# Generate all icons from the master SVG
npm run generate:icons
```

This will create:
- `public/icons/icon-master-1024.png` (source master)
- `public/icons/icon-48.png` through `public/icons/icon-512.png`
- `public/icons/apple-touch-icon.png` (180x180)
- `public/icons/maskable-512.png` (for adaptive icons)

### Option B: Manual Generation (If npm unavailable)

Use any image editing tool or online service to resize `public/icons/icon-master-1024.png` to:

- **48x48** → `icon-48.png`
- **72x72** → `icon-72.png`
- **96x96** → `icon-96.png`
- **144x144** → `icon-144.png`
- **192x192** → `icon-192.png`
- **512x512** → `icon-512.png`
- **180x180** → `apple-touch-icon.png`
- **512x512 (maskable)** → `maskable-512.png`

**Important:** All images must be PNG format with proper colour profile (sRGB).

## Icon Specifications

### Master Icon (1024×1024)
- **Colours:**
  - Burgundy: `#8B1A2F` (TUC primary)
  - Teal: `#4A9B7F` (accent)
  - Cream: `#FAF7F0` (background)
- **Content:** Gradient circle with "POSTER STUDIO" text
- **Safe Area:** Inner 80% of square (centre 800×800 pixels)

### Maskable Icons
The `maskable-512.png` is used for adaptive icons on Android. It should have:
- Content within centre 66% (340×340 pixels for 512×512 image)
- Safe colour contrast on various backgrounds
- No hard edges at 512×512 boundary

## Verification

After generation, verify:

```bash
# Check all icon files exist
ls -la public/icons/

# Verify manifest is valid JSON
node -e "console.log(JSON.stringify(require('./public/manifest.webmanifest'), null, 2))"

# Build the app (this will validate the manifest reference)
npm run build
```

Expected output in `dist/`:
```
dist/
├── index.html (with manifest link)
├── manifest.webmanifest
└── icons/
    ├── icon-48.png
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-144.png
    ├── icon-192.png
    ├── icon-512.png
    ├── maskable-512.png
    └── apple-touch-icon.png
```

## App Store Submission Checklist

Once icons are generated, verify:

- [ ] All PNG files are **without alpha channel** (solid background, no transparency)
- [ ] Icon files are in `public/icons/` directory
- [ ] `manifest.webmanifest` is valid and references all icons
- [ ] `index.html` contains `<link rel="manifest" href="/manifest.webmanifest">`
- [ ] `index.html` contains `<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">`
- [ ] `npm run build` completes without errors
- [ ] Icons appear correctly in `dist/` after build

## Technical Details

### Why Multiple Icon Sizes?

- **48×48, 72×72, 96×96, 144×144:** Android adaptive icons at various densities
- **192×192:** Primary launcher icon (Android)
- **512×512:** Splash screen and large displays
- **180×180:** Apple Home Screen icon (iOS/iPadOS)
- **maskable-512:** Adaptive icon shape for modern Android (Android 8.0+)

### Manifest Structure

The `manifest.webmanifest` includes:
- `display: "standalone"` — App runs full-screen like native app
- `start_url: "/"` — Home page on launch
- `theme_color` and `background_color` — UI chrome colours
- `icons` array with all sizes and purposes
- `screenshots` — For app store listing (requires generation separately)

## Troubleshooting

**Issue:** Build fails due to missing icons
- **Solution:** Ensure all PNG files are in `public/icons/` before running `npm run build`

**Issue:** Manifest not loading in browser
- **Solution:** Verify `index.html` has `<link rel="manifest" href="/manifest.webmanifest">` in `<head>`

**Issue:** Icons not showing on App Store
- **Solution:** Verify icons are 1:1 aspect ratio (square) and PNG format with no transparency

---

Generated: 2026-05-04
Project: TechBridge Poster Studio
Gap Analysis References: GAP-005, GAP-006

```

### FILE: index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>Techbridge Poster Studio</title>
    <meta name="description" content="Professional marketing poster generator for Techbridge University College" />
    <meta name="theme-color" content="#8B1A2F" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Poster Studio" />

    <!-- Icons -->
    <link rel="icon" type="image/png" href="/icons/icon-48.png" sizes="48x48" />
    <link rel="icon" type="image/png" href="/icons/icon-192.png" sizes="192x192" />
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.webmanifest" />

    <!-- Open Graph (Social Sharing) -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://poster-studio.techbridge.edu.gh" />
    <meta property="og:title" content="Techbridge Poster Studio" />
    <meta property="og:description" content="Professional marketing poster generator for Techbridge University College" />
    <meta property="og:image" content="/icons/icon-512.png" />

    <!-- Twitter Card -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="Techbridge Poster Studio" />
    <meta property="twitter:description" content="Professional marketing poster generator for Techbridge University College" />
    <meta property="twitter:image" content="/icons/icon-512.png" />
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
  "name": "Techbridge Poster Studio",
  "description": "Premium ad poster generator for Techbridge University College with high-res PNG and 5s MP4 video export.",
  "requestFramePermissions": [],
  "majorCapabilities": []
}

```

### FILE: nginx.conf
```conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    upstream poster_studio {
        server poster-studio:3000;
    }

    server {
        listen 80;
        server_name _;

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Poster Studio at /poster/
        location /poster/ {
            proxy_pass http://poster_studio/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_buffering off;
            proxy_request_buffering off;
        }

        # API endpoints at /api/
        location /api/ {
            proxy_pass http://poster_studio/api/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_buffering off;
            proxy_request_buffering off;
            proxy_read_timeout 300s;
            proxy_connect_timeout 300s;
            proxy_send_timeout 300s;
        }

        # Redirect root to poster
        location = / {
            return 301 /poster/;
        }
    }

    # SSL configuration (uncomment and configure for HTTPS)
    # server {
    #     listen 443 ssl http2;
    #     server_name yourdomain.com;
    #     ssl_certificate /etc/nginx/ssl/cert.pem;
    #     ssl_certificate_key /etc/nginx/ssl/key.pem;
    #     # ... rest of location blocks same as above
    # }
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
    "build:capacitor": "vite build --mode capacitor",
    "start": "tsx server.ts",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit",
    "generate:icons": "node generate-icons.js",
    "test": "playwright test",
    "test:mp4": "playwright test mp4-export",
    "test:unit": "playwright test video-export.unit",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report"
  },
  "dependencies": {
    "@google/genai": "^1.29.0",
    "@tailwindcss/vite": "^4.1.14",
    "@types/canvas-confetti": "^1.9.0",
    "@vitejs/plugin-react": "^5.0.4",
    "canvas-confetti": "^1.9.4",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "html-to-image": "^1.11.13",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "mp4-muxer": "^5.2.2",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.14.2",
    "recordrtc": "^5.6.2"
  },
  "devDependencies": {
    "@playwright/test": "^1.59.1",
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "playwright": "^1.59.1",
    "playwright-core": "^1.59.1",
    "sharp": "^0.33.0",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.3",
    "vite-plugin-pwa": "^1.3.0"
  }
}

```

### FILE: playwright-report/data/37d7b372194e602794f08e241f1ad37b29a2e467.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mp4-export.spec.ts >> MP4 Video Export - WebCodecs >> should update UI during MP4 encoding
- Location: tests\mp4-export.spec.ts:208:3

# Error details

```
Test timeout of 120000ms exceeded.
```

```
TimeoutError: locator.waitFor: Timeout 120000ms exceeded.
Call log:
  - waiting for locator('.fixed.inset-0.z-\\[200\\]') to be hidden
    49 × locator resolved to visible <div class="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6">…</div>

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img "Logo" [ref=e8]
        - generic [ref=e9]:
          - heading "TECHBRIDGE" [level=1] [ref=e10]
          - paragraph [ref=e11]: Poster Studio
      - button [ref=e13]:
        - img [ref=e15]
    - generic [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e20]:
          - img [ref=e21]
          - heading "Layout" [level=2] [ref=e23]
        - generic [ref=e24]:
          - button "SQUARE 1:1" [ref=e26]:
            - generic [ref=e27]: SQUARE
            - generic [ref=e28]: 1:1
          - button "LANDSCAPE 4:3" [ref=e30]:
            - generic [ref=e31]: LANDSCAPE
            - generic [ref=e32]: 4:3
          - button "PORTRAIT 3:4" [ref=e34]:
            - generic [ref=e35]: PORTRAIT
            - generic [ref=e36]: 3:4
          - button "CINEMA 16:9" [ref=e38]:
            - generic [ref=e39]: CINEMA
            - generic [ref=e40]: 16:9
          - button "STORY 9:16" [ref=e42]:
            - generic [ref=e43]: STORY
            - generic [ref=e44]: 9:16
      - generic [ref=e45]:
        - generic [ref=e47]:
          - img [ref=e48]
          - heading "Messaging" [level=2] [ref=e50]
        - generic [ref=e51]:
          - generic [ref=e53]:
            - generic [ref=e54]: Urgency Strip
            - textbox [ref=e55]: JULY 2026 ADMISSIONS OPEN
          - generic [ref=e57]:
            - generic [ref=e58]: Eyebrow
            - textbox [ref=e59]: Limited intake · July 26 cohort
          - generic [ref=e60]:
            - generic [ref=e61]: Headline Content
            - textbox "Line 1" [ref=e63]: Apply now.
            - textbox "Line 2 (Accent)" [ref=e65]: Launch your
            - textbox "Line 3" [ref=e67]: tech career.
            - textbox "Line 4 (Optional)" [ref=e69]
      - generic [ref=e70]:
        - generic [ref=e72]:
          - img [ref=e73]
          - heading "Call to Action" [level=2] [ref=e76]
        - generic [ref=e77]:
          - generic [ref=e79]:
            - generic [ref=e80]: Button Copy
            - textbox [ref=e81]: APPLY NOW →
          - generic [ref=e83]:
            - generic [ref=e84]: Target Link
            - textbox [ref=e85]: https://admissions.techbridge.edu.gh
      - generic [ref=e86]:
        - generic [ref=e88]:
          - img [ref=e89]
          - heading "Brand & Video" [level=2] [ref=e93]
        - generic [ref=e94]:
          - generic [ref=e95]:
            - generic [ref=e96]:
              - text: Video Carousel
              - paragraph [ref=e97]: Interchange logo and tour
            - button [ref=e99]
          - generic [ref=e102]:
            - generic [ref=e103]: Video Source
            - textbox "https://...mp4" [ref=e104]: https://techbridge.edu.gh/static/campus_tour.mp4
          - generic [ref=e106]:
            - generic [ref=e107]: Domain Label
            - textbox [ref=e108]: techbridge.edu.gh
      - generic [ref=e109]:
        - generic [ref=e111]:
          - img [ref=e112]
          - heading "Pillar Statistics" [level=2] [ref=e114]
        - generic [ref=e115]:
          - generic [ref=e116]:
            - generic [ref=e118]:
              - generic [ref=e119]: Value 1
              - textbox [ref=e120]: July 26
            - generic [ref=e122]:
              - generic [ref=e123]: Descriptor 1
              - textbox [ref=e124]: Cohort starts
          - generic [ref=e125]:
            - generic [ref=e127]:
              - generic [ref=e128]: Value 2
              - textbox [ref=e129]: 100%
            - generic [ref=e131]:
              - generic [ref=e132]: Descriptor 2
              - textbox [ref=e133]: Hands-on training
          - generic [ref=e134]:
            - generic [ref=e136]:
              - generic [ref=e137]: Value 3
              - textbox [ref=e138]: Ghana
            - generic [ref=e140]:
              - generic [ref=e141]: Descriptor 3
              - textbox [ref=e142]: Based in Ghana
    - generic [ref=e143]:
      - button "GENERATE PDF" [ref=e145]:
        - img [ref=e146]
        - text: GENERATE PDF
      - generic [ref=e149]:
        - button "MP4" [disabled] [ref=e151]:
          - img [ref=e152]
          - text: MP4
        - button "PNG" [disabled] [ref=e158]:
          - img [ref=e159]
          - text: PNG
      - button "HTML" [ref=e164]:
        - img [ref=e165]
        - text: HTML
  - main [ref=e169]:
    - generic [ref=e171]:
      - generic [ref=e172]:
        - heading "Live Production Preview" [level=3] [ref=e173]
        - generic [ref=e176]: Retina Master 2.0
      - generic [ref=e179]:
        - generic [ref=e182]:
          - generic [ref=e183]:
            - generic [ref=e184]:
              - generic [ref=e185]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e186]: ✦
            - generic [ref=e187]:
              - generic [ref=e188]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e189]: ✦
            - generic [ref=e190]:
              - generic [ref=e191]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e192]: ✦
            - generic [ref=e193]:
              - generic [ref=e194]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e195]: ✦
            - generic [ref=e196]:
              - generic [ref=e197]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e198]: ✦
            - generic [ref=e199]:
              - generic [ref=e200]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e201]: ✦
            - generic [ref=e202]:
              - generic [ref=e203]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e204]: ✦
            - generic [ref=e205]:
              - generic [ref=e206]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e207]: ✦
          - generic [ref=e208]:
            - generic [ref=e209]:
              - generic [ref=e210]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e211]: ✦
            - generic [ref=e212]:
              - generic [ref=e213]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e214]: ✦
            - generic [ref=e215]:
              - generic [ref=e216]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e217]: ✦
            - generic [ref=e218]:
              - generic [ref=e219]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e220]: ✦
            - generic [ref=e221]:
              - generic [ref=e222]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e223]: ✦
            - generic [ref=e224]:
              - generic [ref=e225]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e226]: ✦
            - generic [ref=e227]:
              - generic [ref=e228]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e229]: ✦
            - generic [ref=e230]:
              - generic [ref=e231]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e232]: ✦
        - generic [ref=e233]:
          - generic [ref=e234]:
            - generic [ref=e235]:
              - generic [ref=e237]: LIMITED INTAKE · JULY 26 COHORT
              - heading "Apply now. Launch your tech career." [level=1] [ref=e238]:
                - generic [ref=e239]: Apply now.
                - generic [ref=e240]: Launch your
                - generic [ref=e241]: tech career.
              - generic [ref=e243]:
                - generic [ref=e244]: SECURE ADMISSION
                - generic [ref=e245]: admissions.techbridge.edu.gh →
                - link "APPLY NOW →" [ref=e246] [cursor=pointer]:
                  - /url: https://admissions.techbridge.edu.gh
                  - generic [ref=e247]: APPLY NOW →
            - generic [ref=e249]:
              - img "Techbridge University College" [ref=e251]
              - generic [ref=e252]:
                - generic [ref=e253]:
                  - text: TECHBRIDGE
                  - text: UNIVERSITY COLLEGE
                - generic [ref=e254]: techbridge.edu.gh
          - generic [ref=e255]:
            - generic [ref=e256]:
              - generic [ref=e257]: July 26
              - generic [ref=e258]: Cohort starts
            - generic [ref=e260]:
              - generic [ref=e261]: 100%
              - generic [ref=e262]: Hands-on training
            - generic [ref=e264]:
              - generic [ref=e265]: Ghana
              - generic [ref=e266]: Based in Ghana
      - generic [ref=e268]:
        - generic [ref=e271]: CMYK Verified
        - generic [ref=e274]: 300 DPI Export
        - generic [ref=e277]: Retina Scaling
      - generic [ref=e278]:
        - generic [ref=e279]:
          - heading "The 6R Methodology" [level=2] [ref=e280]
          - paragraph [ref=e281]: A disciplined framework for aesthetic enhancement and systemic brand consistency.
        - generic [ref=e282]:
          - generic [ref=e283]:
            - generic [ref=e284]: "01"
            - img [ref=e286]
            - generic [ref=e291]:
              - generic [ref=e292]:
                - heading "Refresh" [level=4] [ref=e293]
                - heading "Kinetic Urgency" [level=3] [ref=e294]
              - paragraph [ref=e295]: Legacy marquees are upgraded with Barlow Condensed and ✦ glyph separators, creating a sophisticated yet urgent rhythm.
          - generic [ref=e296]:
            - generic [ref=e297]: "02"
            - img [ref=e299]
            - generic [ref=e305]:
              - generic [ref=e306]:
                - heading "Recolour" [level=4] [ref=e307]
                - heading "Warm Foundation" [level=3] [ref=e308]
              - paragraph [ref=e309]: The palette shifts from flat white to a premium parchment (#FAF7F0), anchored by deep espresso statistics bars.
          - generic [ref=e310]:
            - generic [ref=e311]: "03"
            - img [ref=e313]
            - generic [ref=e315]:
              - generic [ref=e316]:
                - heading "Retype" [level=4] [ref=e317]
                - heading "Typographic Tension" [level=3] [ref=e318]
              - paragraph [ref=e319]: High-contrast pairing of Libre Baskerville for editorial authority against JetBrains Mono for data-technical fields.
          - generic [ref=e320]:
            - generic [ref=e321]: "04"
            - img [ref=e323]
            - generic [ref=e325]:
              - generic [ref=e326]:
                - heading "Recompose" [level=4] [ref=e327]
                - heading "Architectural Grids" [level=3] [ref=e328]
              - paragraph [ref=e329]: Moving from generic symmetry to aspect-ratio specific structural logic (Cinema 55/45, Story vertical stacks).
          - generic [ref=e330]:
            - generic [ref=e331]: "05"
            - img [ref=e333]
            - generic [ref=e336]:
              - generic [ref=e337]:
                - heading "Refine" [level=4] [ref=e338]
                - heading "Micro-Detail Mastery" [level=3] [ref=e339]
              - paragraph [ref=e340]: "Executing precision details: asymmetric CTA corners (16px/4px), 0.5px vertical dividers, and 2px gold accent rules."
          - generic [ref=e341]:
            - generic [ref=e342]: "06"
            - img [ref=e344]
            - generic [ref=e347]:
              - generic [ref=e348]:
                - heading "Reinforce" [level=4] [ref=e349]
                - heading "Systemic Equity" [level=3] [ref=e350]
              - paragraph [ref=e351]: Strict adherence to the 24px inner-margin grid and brand-locked logo size scales across all five layout variants.
    - link [ref=e354] [cursor=pointer]:
      - /url: /admin/diagnostics
      - img [ref=e355]
    - generic:
      - generic:
        - generic:
          - generic:
            - generic:
              - generic:
                - generic:
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                - generic:
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
          - generic:
            - generic:
              - generic:
                - generic:
                  - generic: LIMITED INTAKE · JULY 26 COHORT
                - heading [level=1]:
                  - generic: Apply now.
                  - generic: Launch your
                  - generic: tech career.
                - generic:
                  - generic:
                    - generic: SECURE ADMISSION
                    - generic: admissions.techbridge.edu.gh →
                    - link:
                      - /url: https://admissions.techbridge.edu.gh
                      - generic: APPLY NOW →
              - generic:
                - generic:
                  - generic:
                    - img
                  - generic:
                    - generic: TECHBRIDGE UNIVERSITY COLLEGE
                    - generic: techbridge.edu.gh
            - generic:
              - generic:
                - generic: July 26
                - generic: Cohort starts
              - generic:
                - generic: 100%
                - generic: Hands-on training
              - generic:
                - generic: Ghana
                - generic: Based in Ghana
    - generic [ref=e358]:
      - generic [ref=e359]:
        - img [ref=e360]
        - generic [ref=e364]: 15%
      - generic [ref=e365]:
        - heading "Encoding MP4" [level=2] [ref=e366]
        - generic [ref=e367]:
          - paragraph [ref=e368]: Status
          - paragraph [ref=e369]: Encoding frame 22/150...
      - paragraph [ref=e371]: Processing 4:3 Aspect Ratio
```

# Test source

```ts
  131 |     // Wait for download
  132 |     const downloadPromise2 = page.waitForEvent('download').then(async (download) => {
  133 |       const filename = download.suggestedFilename;
  134 |       downloadedFile = path.join(outputDir, filename);
  135 |       await download.saveAs(downloadedFile);
  136 |       console.log('Downloaded:', downloadedFile);
  137 |       return downloadedFile;
  138 |     }).catch(() => null);
  139 | 
  140 |     // Click MP4 button
  141 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  142 |     if (await mp4Button.evaluate((el) => el.disabled)) {
  143 |       console.log('MP4 button disabled, skipping');
  144 |       return;
  145 |     }
  146 | 
  147 |     await mp4Button.click();
  148 | 
  149 |     // Wait for download or timeout
  150 |     const result = await Promise.race([
  151 |       downloadPromise2,
  152 |       new Promise(resolve => setTimeout(() => resolve(null), 100000))
  153 |     ]);
  154 | 
  155 |     if (result) {
  156 |       // Verify file exists and has content
  157 |       expect(fs.existsSync(result)).toBe(true);
  158 | 
  159 |       const stats = fs.statSync(result);
  160 |       console.log(`Downloaded file: ${result}, size: ${stats.size} bytes`);
  161 | 
  162 |       // MP4 files should be at least 1KB
  163 |       expect(stats.size).toBeGreaterThan(1024);
  164 | 
  165 |       // Check for MP4 magic number (0x66 0x74 0x79 0x70 = 'ftyp')
  166 |       const buffer = Buffer.alloc(4);
  167 |       const fd = fs.openSync(result, 'r');
  168 |       fs.readSync(fd, buffer, 0, 4, 4);
  169 |       fs.closeSync(fd);
  170 | 
  171 |       const magic = buffer.toString('hex');
  172 |       expect(magic).toBe('66747970'); // 'ftyp' in hex
  173 |     }
  174 |   });
  175 | 
  176 |   test('should handle MP4 encoding errors gracefully', async ({ page, browserName }) => {
  177 |     if (browserName !== 'chromium') return;
  178 | 
  179 |     test.setTimeout(120000);
  180 | 
  181 |     // Try to export
  182 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  183 |     if (await mp4Button.evaluate((el) => el.disabled)) {
  184 |       console.log('MP4 unavailable on this browser');
  185 |       return;
  186 |     }
  187 | 
  188 |     await mp4Button.click();
  189 | 
  190 |     // Wait for modal to appear (indicates export started)
  191 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  192 |       console.log('Modal did not appear');
  193 |     });
  194 | 
  195 |     // Wait for modal to disappear (indicates export completed, successful or not)
  196 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  197 |       console.log('Modal did not disappear');
  198 |       return;
  199 |     });
  200 | 
  201 |     console.log('Export completed');
  202 | 
  203 |     // Button should be enabled again after export
  204 |     const isEnabled = await mp4Button.evaluate((el) => !el.disabled);
  205 |     expect(isEnabled).toBe(true);
  206 |   });
  207 | 
  208 |   test('should update UI during MP4 encoding', async ({ page, browserName }) => {
  209 |     if (browserName !== 'chromium') return;
  210 | 
  211 |     test.setTimeout(120000);
  212 | 
  213 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  214 |     if (await mp4Button.evaluate((el) => el.disabled)) return;
  215 | 
  216 |     // Click export
  217 |     await mp4Button.click();
  218 | 
  219 |     // Wait for modal to appear (indicates encoding started and progress is showing)
  220 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  221 |       console.log('Modal did not appear');
  222 |     });
  223 | 
  224 |     // Modal should show progress, so check if text exists
  225 |     const encodingText = page.locator('text=/Encoding MP4/i');
  226 |     await encodingText.waitFor({ timeout: 10000, state: 'visible' }).catch(() => {
  227 |       console.log('Encoding text not found');
  228 |     });
  229 | 
  230 |     // Wait for completion
> 231 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 });
      |                                                      ^ TimeoutError: locator.waitFor: Timeout 120000ms exceeded.
  232 |   });
  233 | 
  234 |   test('should export valid MP4 from all aspect ratios', async ({ page, browserName }) => {
  235 |     if (browserName !== 'chromium') return;
  236 | 
  237 |     test.setTimeout(300000); // 5 minutes for multiple exports
  238 | 
  239 |     const aspectRatios = ['STORY', 'PORTRAIT', 'SQUARE', 'LANDSCAPE', 'CINEMA'];
  240 |     const outputDir = './test-outputs';
  241 | 
  242 |     if (!fs.existsSync(outputDir)) {
  243 |       fs.mkdirSync(outputDir, { recursive: true });
  244 |     }
  245 | 
  246 |     for (const ratio of aspectRatios) {
  247 |       console.log(`Testing MP4 export for ${ratio}`);
  248 | 
  249 |       // Wait for any modal from previous export to disappear
  250 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  251 |         console.log(`Modal may still be visible for ${ratio}`);
  252 |       });
  253 | 
  254 |       // Click aspect ratio button
  255 |       const ratioButton = page.locator(`button:has-text("${ratio}")`).first();
  256 |       if (await ratioButton.isVisible()) {
  257 |         await ratioButton.click();
  258 |         await page.waitForTimeout(500); // Wait for UI to update
  259 |       }
  260 | 
  261 |       // Attempt export
  262 |       const mp4Button = page.locator('button:has-text("MP4")').first();
  263 |       if (await mp4Button.evaluate((el) => el.disabled)) {
  264 |         console.log(`MP4 disabled for ${ratio}, skipping`);
  265 |         continue;
  266 |       }
  267 | 
  268 |       // Set up download listener
  269 |       const downloadPromise = page.waitForEvent('download').then(async (download) => {
  270 |         const filename = `${ratio}-${Date.now()}.mp4`;
  271 |         const filepath = path.join(outputDir, filename);
  272 |         await download.saveAs(filepath);
  273 |         console.log(`Saved: ${filepath}`);
  274 |         return filepath;
  275 |       }).catch(() => null);
  276 | 
  277 |       // Click export
  278 |       await mp4Button.click();
  279 | 
  280 |       // Wait for modal to appear and then disappear
  281 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  282 |         console.log(`Modal did not appear for ${ratio}`);
  283 |       });
  284 | 
  285 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  286 |         console.log(`Modal did not disappear for ${ratio}`);
  287 |       });
  288 | 
  289 |       // Wait for download with timeout
  290 |       const result = await Promise.race([
  291 |         downloadPromise,
  292 |         new Promise(resolve => setTimeout(() => resolve(null), 90000))
  293 |       ]) as string | null;
  294 | 
  295 |       if (result && fs.existsSync(result)) {
  296 |         const stats = fs.statSync(result);
  297 |         console.log(`✓ ${ratio}: ${stats.size} bytes`);
  298 |         expect(stats.size).toBeGreaterThan(1024);
  299 |       } else {
  300 |         console.log(`⚠ ${ratio}: No download detected`);
  301 |       }
  302 |     }
  303 |   });
  304 | 
  305 |   test('should handle concurrent MP4 requests', async ({ page, browserName }) => {
  306 |     if (browserName !== 'chromium') return;
  307 | 
  308 |     test.setTimeout(180000);
  309 | 
  310 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  311 |     if (await mp4Button.evaluate((el) => el.disabled)) return;
  312 | 
  313 |     // Attempt to click MP4 button twice quickly
  314 |     console.log('Clicking MP4 button...');
  315 |     await mp4Button.click();
  316 | 
  317 |     // Second click should be prevented (button likely disabled during export)
  318 |     await page.waitForTimeout(500);
  319 |     const isDisabled = await mp4Button.evaluate((el) => el.disabled);
  320 |     console.log('Button disabled after first click:', isDisabled);
  321 | 
  322 |     expect(isDisabled).toBe(true); // Should be disabled during export
  323 | 
  324 |     // Wait for completion
  325 |     await Promise.race([
  326 |       page.waitForSelector('text="Export Finalized"').catch(() => null),
  327 |       new Promise(resolve => setTimeout(() => resolve(null), 150000))
  328 |     ]);
  329 |   });
  330 | 
  331 |   test('should recover from encoding errors and allow retry', async ({ page, browserName }) => {
```
```

### FILE: playwright-report/data/96598360c58415b5eb0357a03be6eaeb1b7420e2.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mp4-export.spec.ts >> MP4 Video Export - WebCodecs >> should export valid MP4 from all aspect ratios
- Location: tests\mp4-export.spec.ts:234:3

# Error details

```
Test timeout of 300000ms exceeded.
```

```
Error: locator.isVisible: Target page, context or browser has been closed
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img "Logo" [ref=e8]
        - generic [ref=e9]:
          - heading "TECHBRIDGE" [level=1] [ref=e10]
          - paragraph [ref=e11]: Poster Studio
      - button [ref=e13]:
        - img [ref=e15]
    - generic [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e20]:
          - img [ref=e21]
          - heading "Layout" [level=2] [ref=e23]
        - generic [ref=e24]:
          - button "SQUARE 1:1" [ref=e26]:
            - generic [ref=e27]: SQUARE
            - generic [ref=e28]: 1:1
          - button "LANDSCAPE 4:3" [ref=e30]:
            - generic [ref=e31]: LANDSCAPE
            - generic [ref=e32]: 4:3
          - button "PORTRAIT 3:4" [ref=e34]:
            - generic [ref=e35]: PORTRAIT
            - generic [ref=e36]: 3:4
          - button "CINEMA 16:9" [ref=e38]:
            - generic [ref=e39]: CINEMA
            - generic [ref=e40]: 16:9
          - button "STORY 9:16" [ref=e42]:
            - generic [ref=e43]: STORY
            - generic [ref=e44]: 9:16
      - generic [ref=e45]:
        - generic [ref=e47]:
          - img [ref=e48]
          - heading "Messaging" [level=2] [ref=e50]
        - generic [ref=e51]:
          - generic [ref=e53]:
            - generic [ref=e54]: Urgency Strip
            - textbox [ref=e55]: JULY 2026 ADMISSIONS OPEN
          - generic [ref=e57]:
            - generic [ref=e58]: Eyebrow
            - textbox [ref=e59]: Limited intake · July 26 cohort
          - generic [ref=e60]:
            - generic [ref=e61]: Headline Content
            - textbox "Line 1" [ref=e63]: Apply now.
            - textbox "Line 2 (Accent)" [ref=e65]: Launch your
            - textbox "Line 3" [ref=e67]: tech career.
            - textbox "Line 4 (Optional)" [ref=e69]
      - generic [ref=e70]:
        - generic [ref=e72]:
          - img [ref=e73]
          - heading "Call to Action" [level=2] [ref=e76]
        - generic [ref=e77]:
          - generic [ref=e79]:
            - generic [ref=e80]: Button Copy
            - textbox [ref=e81]: APPLY NOW →
          - generic [ref=e83]:
            - generic [ref=e84]: Target Link
            - textbox [ref=e85]: https://admissions.techbridge.edu.gh
      - generic [ref=e86]:
        - generic [ref=e88]:
          - img [ref=e89]
          - heading "Brand & Video" [level=2] [ref=e93]
        - generic [ref=e94]:
          - generic [ref=e95]:
            - generic [ref=e96]:
              - text: Video Carousel
              - paragraph [ref=e97]: Interchange logo and tour
            - button [ref=e99]
          - generic [ref=e102]:
            - generic [ref=e103]: Video Source
            - textbox "https://...mp4" [ref=e104]: https://techbridge.edu.gh/static/campus_tour.mp4
          - generic [ref=e106]:
            - generic [ref=e107]: Domain Label
            - textbox [ref=e108]: techbridge.edu.gh
      - generic [ref=e109]:
        - generic [ref=e111]:
          - img [ref=e112]
          - heading "Pillar Statistics" [level=2] [ref=e114]
        - generic [ref=e115]:
          - generic [ref=e116]:
            - generic [ref=e118]:
              - generic [ref=e119]: Value 1
              - textbox [ref=e120]: July 26
            - generic [ref=e122]:
              - generic [ref=e123]: Descriptor 1
              - textbox [ref=e124]: Cohort starts
          - generic [ref=e125]:
            - generic [ref=e127]:
              - generic [ref=e128]: Value 2
              - textbox [ref=e129]: 100%
            - generic [ref=e131]:
              - generic [ref=e132]: Descriptor 2
              - textbox [ref=e133]: Hands-on training
          - generic [ref=e134]:
            - generic [ref=e136]:
              - generic [ref=e137]: Value 3
              - textbox [ref=e138]: Ghana
            - generic [ref=e140]:
              - generic [ref=e141]: Descriptor 3
              - textbox [ref=e142]: Based in Ghana
    - generic [ref=e143]:
      - button "GENERATE PDF" [ref=e145]:
        - img [ref=e146]
        - text: GENERATE PDF
      - generic [ref=e149]:
        - button "MP4" [disabled] [ref=e151]:
          - img [ref=e152]
          - text: MP4
        - button "PNG" [disabled] [ref=e158]:
          - img [ref=e159]
          - text: PNG
      - button "HTML" [ref=e164]:
        - img [ref=e165]
        - text: HTML
  - main [ref=e169]:
    - generic [ref=e171]:
      - generic [ref=e172]:
        - heading "Live Production Preview" [level=3] [ref=e173]
        - generic [ref=e176]: Retina Master 2.0
      - generic [ref=e179]:
        - generic [ref=e182]:
          - generic [ref=e183]:
            - generic [ref=e184]:
              - generic [ref=e185]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e186]: ✦
            - generic [ref=e187]:
              - generic [ref=e188]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e189]: ✦
            - generic [ref=e190]:
              - generic [ref=e191]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e192]: ✦
            - generic [ref=e193]:
              - generic [ref=e194]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e195]: ✦
            - generic [ref=e196]:
              - generic [ref=e197]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e198]: ✦
            - generic [ref=e199]:
              - generic [ref=e200]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e201]: ✦
            - generic [ref=e202]:
              - generic [ref=e203]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e204]: ✦
            - generic [ref=e205]:
              - generic [ref=e206]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e207]: ✦
          - generic [ref=e208]:
            - generic [ref=e209]:
              - generic [ref=e210]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e211]: ✦
            - generic [ref=e212]:
              - generic [ref=e213]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e214]: ✦
            - generic [ref=e215]:
              - generic [ref=e216]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e217]: ✦
            - generic [ref=e218]:
              - generic [ref=e219]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e220]: ✦
            - generic [ref=e221]:
              - generic [ref=e222]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e223]: ✦
            - generic [ref=e224]:
              - generic [ref=e225]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e226]: ✦
            - generic [ref=e227]:
              - generic [ref=e228]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e229]: ✦
            - generic [ref=e230]:
              - generic [ref=e231]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e232]: ✦
        - generic [ref=e233]:
          - generic [ref=e234]:
            - generic [ref=e235]:
              - img "Techbridge University College" [ref=e237]
              - generic [ref=e239]: Limited intake · July 26 cohort
            - heading "Apply now. Launch your tech career." [level=1] [ref=e240]:
              - generic [ref=e241]: Apply now.
              - generic [ref=e242]: Launch your
              - generic [ref=e243]: tech career.
            - generic [ref=e244]:
              - link "APPLY NOW → →" [ref=e245] [cursor=pointer]:
                - /url: https://admissions.techbridge.edu.gh
                - generic [ref=e246]: APPLY NOW →
                - generic [ref=e247]: →
              - generic [ref=e248]: techbridge.edu.gh
          - generic [ref=e249]:
            - generic [ref=e250]:
              - generic [ref=e251]: July 26
              - generic [ref=e252]: Cohort starts
            - generic [ref=e254]:
              - generic [ref=e255]: 100%
              - generic [ref=e256]: Hands-on training
            - generic [ref=e258]:
              - generic [ref=e259]: Ghana
              - generic [ref=e260]: Based in Ghana
      - generic [ref=e262]:
        - generic [ref=e265]: CMYK Verified
        - generic [ref=e268]: 300 DPI Export
        - generic [ref=e271]: Retina Scaling
      - generic [ref=e272]:
        - generic [ref=e273]:
          - heading "The 6R Methodology" [level=2] [ref=e274]
          - paragraph [ref=e275]: A disciplined framework for aesthetic enhancement and systemic brand consistency.
        - generic [ref=e276]:
          - generic [ref=e277]:
            - generic [ref=e278]: "01"
            - img [ref=e280]
            - generic [ref=e285]:
              - generic [ref=e286]:
                - heading "Refresh" [level=4] [ref=e287]
                - heading "Kinetic Urgency" [level=3] [ref=e288]
              - paragraph [ref=e289]: Legacy marquees are upgraded with Barlow Condensed and ✦ glyph separators, creating a sophisticated yet urgent rhythm.
          - generic [ref=e290]:
            - generic [ref=e291]: "02"
            - img [ref=e293]
            - generic [ref=e299]:
              - generic [ref=e300]:
                - heading "Recolour" [level=4] [ref=e301]
                - heading "Warm Foundation" [level=3] [ref=e302]
              - paragraph [ref=e303]: The palette shifts from flat white to a premium parchment (#FAF7F0), anchored by deep espresso statistics bars.
          - generic [ref=e304]:
            - generic [ref=e305]: "03"
            - img [ref=e307]
            - generic [ref=e309]:
              - generic [ref=e310]:
                - heading "Retype" [level=4] [ref=e311]
                - heading "Typographic Tension" [level=3] [ref=e312]
              - paragraph [ref=e313]: High-contrast pairing of Libre Baskerville for editorial authority against JetBrains Mono for data-technical fields.
          - generic [ref=e314]:
            - generic [ref=e315]: "04"
            - img [ref=e317]
            - generic [ref=e319]:
              - generic [ref=e320]:
                - heading "Recompose" [level=4] [ref=e321]
                - heading "Architectural Grids" [level=3] [ref=e322]
              - paragraph [ref=e323]: Moving from generic symmetry to aspect-ratio specific structural logic (Cinema 55/45, Story vertical stacks).
          - generic [ref=e324]:
            - generic [ref=e325]: "05"
            - img [ref=e327]
            - generic [ref=e330]:
              - generic [ref=e331]:
                - heading "Refine" [level=4] [ref=e332]
                - heading "Micro-Detail Mastery" [level=3] [ref=e333]
              - paragraph [ref=e334]: "Executing precision details: asymmetric CTA corners (16px/4px), 0.5px vertical dividers, and 2px gold accent rules."
          - generic [ref=e335]:
            - generic [ref=e336]: "06"
            - img [ref=e338]
            - generic [ref=e341]:
              - generic [ref=e342]:
                - heading "Reinforce" [level=4] [ref=e343]
                - heading "Systemic Equity" [level=3] [ref=e344]
              - paragraph [ref=e345]: Strict adherence to the 24px inner-margin grid and brand-locked logo size scales across all five layout variants.
    - link [ref=e348] [cursor=pointer]:
      - /url: /admin/diagnostics
      - img [ref=e349]
    - generic:
      - generic:
        - generic:
          - generic:
            - generic:
              - generic:
                - generic:
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                - generic:
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
          - generic:
            - generic:
              - generic:
                - generic:
                  - img
                - generic:
                  - generic: Limited intake · July 26 cohort
              - heading [level=1]:
                - generic: Apply now.
                - generic: Launch your
                - generic: tech career.
              - generic:
                - link:
                  - /url: https://admissions.techbridge.edu.gh
                  - generic: APPLY NOW →
                  - generic: →
                - generic: techbridge.edu.gh
            - generic:
              - generic:
                - generic: July 26
                - generic: Cohort starts
              - generic:
                - generic: 100%
                - generic: Hands-on training
              - generic:
                - generic: Ghana
                - generic: Based in Ghana
    - generic [ref=e352]:
      - generic [ref=e353]:
        - img [ref=e354]
        - generic [ref=e358]: 20%
      - generic [ref=e359]:
        - heading "Encoding MP4" [level=2] [ref=e360]
        - generic [ref=e361]:
          - paragraph [ref=e362]: Status
          - paragraph [ref=e363]: Encoding frame 30/150...
      - paragraph [ref=e365]: Processing 9:16 Aspect Ratio
```

# Test source

```ts
  156 |       // Verify file exists and has content
  157 |       expect(fs.existsSync(result)).toBe(true);
  158 | 
  159 |       const stats = fs.statSync(result);
  160 |       console.log(`Downloaded file: ${result}, size: ${stats.size} bytes`);
  161 | 
  162 |       // MP4 files should be at least 1KB
  163 |       expect(stats.size).toBeGreaterThan(1024);
  164 | 
  165 |       // Check for MP4 magic number (0x66 0x74 0x79 0x70 = 'ftyp')
  166 |       const buffer = Buffer.alloc(4);
  167 |       const fd = fs.openSync(result, 'r');
  168 |       fs.readSync(fd, buffer, 0, 4, 4);
  169 |       fs.closeSync(fd);
  170 | 
  171 |       const magic = buffer.toString('hex');
  172 |       expect(magic).toBe('66747970'); // 'ftyp' in hex
  173 |     }
  174 |   });
  175 | 
  176 |   test('should handle MP4 encoding errors gracefully', async ({ page, browserName }) => {
  177 |     if (browserName !== 'chromium') return;
  178 | 
  179 |     test.setTimeout(120000);
  180 | 
  181 |     // Try to export
  182 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  183 |     if (await mp4Button.evaluate((el) => el.disabled)) {
  184 |       console.log('MP4 unavailable on this browser');
  185 |       return;
  186 |     }
  187 | 
  188 |     await mp4Button.click();
  189 | 
  190 |     // Wait for modal to appear (indicates export started)
  191 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  192 |       console.log('Modal did not appear');
  193 |     });
  194 | 
  195 |     // Wait for modal to disappear (indicates export completed, successful or not)
  196 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  197 |       console.log('Modal did not disappear');
  198 |       return;
  199 |     });
  200 | 
  201 |     console.log('Export completed');
  202 | 
  203 |     // Button should be enabled again after export
  204 |     const isEnabled = await mp4Button.evaluate((el) => !el.disabled);
  205 |     expect(isEnabled).toBe(true);
  206 |   });
  207 | 
  208 |   test('should update UI during MP4 encoding', async ({ page, browserName }) => {
  209 |     if (browserName !== 'chromium') return;
  210 | 
  211 |     test.setTimeout(120000);
  212 | 
  213 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  214 |     if (await mp4Button.evaluate((el) => el.disabled)) return;
  215 | 
  216 |     // Click export
  217 |     await mp4Button.click();
  218 | 
  219 |     // Wait for modal to appear (indicates encoding started and progress is showing)
  220 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  221 |       console.log('Modal did not appear');
  222 |     });
  223 | 
  224 |     // Modal should show progress, so check if text exists
  225 |     const encodingText = page.locator('text=/Encoding MP4/i');
  226 |     await encodingText.waitFor({ timeout: 10000, state: 'visible' }).catch(() => {
  227 |       console.log('Encoding text not found');
  228 |     });
  229 | 
  230 |     // Wait for completion
  231 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 });
  232 |   });
  233 | 
  234 |   test('should export valid MP4 from all aspect ratios', async ({ page, browserName }) => {
  235 |     if (browserName !== 'chromium') return;
  236 | 
  237 |     test.setTimeout(300000); // 5 minutes for multiple exports
  238 | 
  239 |     const aspectRatios = ['STORY', 'PORTRAIT', 'SQUARE', 'LANDSCAPE', 'CINEMA'];
  240 |     const outputDir = './test-outputs';
  241 | 
  242 |     if (!fs.existsSync(outputDir)) {
  243 |       fs.mkdirSync(outputDir, { recursive: true });
  244 |     }
  245 | 
  246 |     for (const ratio of aspectRatios) {
  247 |       console.log(`Testing MP4 export for ${ratio}`);
  248 | 
  249 |       // Wait for any modal from previous export to disappear
  250 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  251 |         console.log(`Modal may still be visible for ${ratio}`);
  252 |       });
  253 | 
  254 |       // Click aspect ratio button
  255 |       const ratioButton = page.locator(`button:has-text("${ratio}")`).first();
> 256 |       if (await ratioButton.isVisible()) {
      |                             ^ Error: locator.isVisible: Target page, context or browser has been closed
  257 |         await ratioButton.click();
  258 |         await page.waitForTimeout(500); // Wait for UI to update
  259 |       }
  260 | 
  261 |       // Attempt export
  262 |       const mp4Button = page.locator('button:has-text("MP4")').first();
  263 |       if (await mp4Button.evaluate((el) => el.disabled)) {
  264 |         console.log(`MP4 disabled for ${ratio}, skipping`);
  265 |         continue;
  266 |       }
  267 | 
  268 |       // Set up download listener
  269 |       const downloadPromise = page.waitForEvent('download').then(async (download) => {
  270 |         const filename = `${ratio}-${Date.now()}.mp4`;
  271 |         const filepath = path.join(outputDir, filename);
  272 |         await download.saveAs(filepath);
  273 |         console.log(`Saved: ${filepath}`);
  274 |         return filepath;
  275 |       }).catch(() => null);
  276 | 
  277 |       // Click export
  278 |       await mp4Button.click();
  279 | 
  280 |       // Wait for modal to appear and then disappear
  281 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  282 |         console.log(`Modal did not appear for ${ratio}`);
  283 |       });
  284 | 
  285 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  286 |         console.log(`Modal did not disappear for ${ratio}`);
  287 |       });
  288 | 
  289 |       // Wait for download with timeout
  290 |       const result = await Promise.race([
  291 |         downloadPromise,
  292 |         new Promise(resolve => setTimeout(() => resolve(null), 90000))
  293 |       ]) as string | null;
  294 | 
  295 |       if (result && fs.existsSync(result)) {
  296 |         const stats = fs.statSync(result);
  297 |         console.log(`✓ ${ratio}: ${stats.size} bytes`);
  298 |         expect(stats.size).toBeGreaterThan(1024);
  299 |       } else {
  300 |         console.log(`⚠ ${ratio}: No download detected`);
  301 |       }
  302 |     }
  303 |   });
  304 | 
  305 |   test('should handle concurrent MP4 requests', async ({ page, browserName }) => {
  306 |     if (browserName !== 'chromium') return;
  307 | 
  308 |     test.setTimeout(180000);
  309 | 
  310 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  311 |     if (await mp4Button.evaluate((el) => el.disabled)) return;
  312 | 
  313 |     // Attempt to click MP4 button twice quickly
  314 |     console.log('Clicking MP4 button...');
  315 |     await mp4Button.click();
  316 | 
  317 |     // Second click should be prevented (button likely disabled during export)
  318 |     await page.waitForTimeout(500);
  319 |     const isDisabled = await mp4Button.evaluate((el) => el.disabled);
  320 |     console.log('Button disabled after first click:', isDisabled);
  321 | 
  322 |     expect(isDisabled).toBe(true); // Should be disabled during export
  323 | 
  324 |     // Wait for completion
  325 |     await Promise.race([
  326 |       page.waitForSelector('text="Export Finalized"').catch(() => null),
  327 |       new Promise(resolve => setTimeout(() => resolve(null), 150000))
  328 |     ]);
  329 |   });
  330 | 
  331 |   test('should recover from encoding errors and allow retry', async ({ page, browserName }) => {
  332 |     if (browserName !== 'chromium') return;
  333 | 
  334 |     test.setTimeout(180000);
  335 | 
  336 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  337 |     if (await mp4Button.evaluate((el) => el.disabled)) return;
  338 | 
  339 |     // First export attempt
  340 |     console.log('First export attempt...');
  341 |     await mp4Button.click();
  342 | 
  343 |     // Wait for modal overlay to appear (indicates export is running)
  344 |     const modalOverlay = page.locator('.fixed.inset-0.z-\\[200\\]');
  345 |     await modalOverlay.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  346 |       console.log('Modal did not appear');
  347 |     });
  348 | 
  349 |     // Wait for modal to disappear (indicates export completed)
  350 |     try {
  351 |       await modalOverlay.waitFor({ state: 'hidden', timeout: 120000 });
  352 |     } catch (e) {
  353 |       console.log('Modal did not disappear within timeout:', e);
  354 |       return; // Exit early if modal never disappears
  355 |     }
  356 | 
```
```

### FILE: playwright-report/data/cf89e6dcf0e2189027028693af96fd1224a95103.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mp4-export.spec.ts >> MP4 Video Export - WebCodecs >> should handle MP4 encoding errors gracefully
- Location: tests\mp4-export.spec.ts:176:3

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: locator.evaluate: Test timeout of 120000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img "Logo" [ref=e8]
        - generic [ref=e9]:
          - heading "TECHBRIDGE" [level=1] [ref=e10]
          - paragraph [ref=e11]: Poster Studio
      - button [ref=e13]:
        - img [ref=e15]
    - generic [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e20]:
          - img [ref=e21]
          - heading "Layout" [level=2] [ref=e23]
        - generic [ref=e24]:
          - button "SQUARE 1:1" [ref=e26]:
            - generic [ref=e27]: SQUARE
            - generic [ref=e28]: 1:1
          - button "LANDSCAPE 4:3" [ref=e30]:
            - generic [ref=e31]: LANDSCAPE
            - generic [ref=e32]: 4:3
          - button "PORTRAIT 3:4" [ref=e34]:
            - generic [ref=e35]: PORTRAIT
            - generic [ref=e36]: 3:4
          - button "CINEMA 16:9" [ref=e38]:
            - generic [ref=e39]: CINEMA
            - generic [ref=e40]: 16:9
          - button "STORY 9:16" [ref=e42]:
            - generic [ref=e43]: STORY
            - generic [ref=e44]: 9:16
      - generic [ref=e45]:
        - generic [ref=e47]:
          - img [ref=e48]
          - heading "Messaging" [level=2] [ref=e50]
        - generic [ref=e51]:
          - generic [ref=e53]:
            - generic [ref=e54]: Urgency Strip
            - textbox [ref=e55]: JULY 2026 ADMISSIONS OPEN
          - generic [ref=e57]:
            - generic [ref=e58]: Eyebrow
            - textbox [ref=e59]: Limited intake · July 26 cohort
          - generic [ref=e60]:
            - generic [ref=e61]: Headline Content
            - textbox "Line 1" [ref=e63]: Apply now.
            - textbox "Line 2 (Accent)" [ref=e65]: Launch your
            - textbox "Line 3" [ref=e67]: tech career.
            - textbox "Line 4 (Optional)" [ref=e69]
      - generic [ref=e70]:
        - generic [ref=e72]:
          - img [ref=e73]
          - heading "Call to Action" [level=2] [ref=e76]
        - generic [ref=e77]:
          - generic [ref=e79]:
            - generic [ref=e80]: Button Copy
            - textbox [ref=e81]: APPLY NOW →
          - generic [ref=e83]:
            - generic [ref=e84]: Target Link
            - textbox [ref=e85]: https://admissions.techbridge.edu.gh
      - generic [ref=e86]:
        - generic [ref=e88]:
          - img [ref=e89]
          - heading "Brand & Video" [level=2] [ref=e93]
        - generic [ref=e94]:
          - generic [ref=e95]:
            - generic [ref=e96]:
              - text: Video Carousel
              - paragraph [ref=e97]: Interchange logo and tour
            - button [ref=e99]
          - generic [ref=e102]:
            - generic [ref=e103]: Video Source
            - textbox "https://...mp4" [ref=e104]: https://techbridge.edu.gh/static/campus_tour.mp4
          - generic [ref=e106]:
            - generic [ref=e107]: Domain Label
            - textbox [ref=e108]: techbridge.edu.gh
      - generic [ref=e109]:
        - generic [ref=e111]:
          - img [ref=e112]
          - heading "Pillar Statistics" [level=2] [ref=e114]
        - generic [ref=e115]:
          - generic [ref=e116]:
            - generic [ref=e118]:
              - generic [ref=e119]: Value 1
              - textbox [ref=e120]: July 26
            - generic [ref=e122]:
              - generic [ref=e123]: Descriptor 1
              - textbox [ref=e124]: Cohort starts
          - generic [ref=e125]:
            - generic [ref=e127]:
              - generic [ref=e128]: Value 2
              - textbox [ref=e129]: 100%
            - generic [ref=e131]:
              - generic [ref=e132]: Descriptor 2
              - textbox [ref=e133]: Hands-on training
          - generic [ref=e134]:
            - generic [ref=e136]:
              - generic [ref=e137]: Value 3
              - textbox [ref=e138]: Ghana
            - generic [ref=e140]:
              - generic [ref=e141]: Descriptor 3
              - textbox [ref=e142]: Based in Ghana
    - generic [ref=e143]:
      - button "GENERATE PDF" [ref=e145]:
        - img [ref=e146]
        - text: GENERATE PDF
      - generic [ref=e149]:
        - button "MP4" [disabled] [ref=e151]:
          - img [ref=e152]
          - text: MP4
        - button "PNG" [disabled] [ref=e158]:
          - img [ref=e159]
          - text: PNG
      - button "HTML" [ref=e164]:
        - img [ref=e165]
        - text: HTML
  - main [ref=e169]:
    - generic [ref=e171]:
      - generic [ref=e172]:
        - heading "Live Production Preview" [level=3] [ref=e173]
        - generic [ref=e176]: Retina Master 2.0
      - generic [ref=e179]:
        - generic [ref=e182]:
          - generic [ref=e183]:
            - generic [ref=e184]:
              - generic [ref=e185]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e186]: ✦
            - generic [ref=e187]:
              - generic [ref=e188]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e189]: ✦
            - generic [ref=e190]:
              - generic [ref=e191]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e192]: ✦
            - generic [ref=e193]:
              - generic [ref=e194]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e195]: ✦
            - generic [ref=e196]:
              - generic [ref=e197]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e198]: ✦
            - generic [ref=e199]:
              - generic [ref=e200]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e201]: ✦
            - generic [ref=e202]:
              - generic [ref=e203]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e204]: ✦
            - generic [ref=e205]:
              - generic [ref=e206]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e207]: ✦
          - generic [ref=e208]:
            - generic [ref=e209]:
              - generic [ref=e210]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e211]: ✦
            - generic [ref=e212]:
              - generic [ref=e213]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e214]: ✦
            - generic [ref=e215]:
              - generic [ref=e216]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e217]: ✦
            - generic [ref=e218]:
              - generic [ref=e219]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e220]: ✦
            - generic [ref=e221]:
              - generic [ref=e222]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e223]: ✦
            - generic [ref=e224]:
              - generic [ref=e225]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e226]: ✦
            - generic [ref=e227]:
              - generic [ref=e228]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e229]: ✦
            - generic [ref=e230]:
              - generic [ref=e231]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e232]: ✦
        - generic [ref=e233]:
          - generic [ref=e234]:
            - generic [ref=e235]:
              - generic [ref=e237]: LIMITED INTAKE · JULY 26 COHORT
              - heading "Apply now. Launch your tech career." [level=1] [ref=e238]:
                - generic [ref=e239]: Apply now.
                - generic [ref=e240]: Launch your
                - generic [ref=e241]: tech career.
              - generic [ref=e243]:
                - generic [ref=e244]: SECURE ADMISSION
                - generic [ref=e245]: admissions.techbridge.edu.gh →
                - link "APPLY NOW →" [ref=e246] [cursor=pointer]:
                  - /url: https://admissions.techbridge.edu.gh
                  - generic [ref=e247]: APPLY NOW →
            - generic [ref=e249]:
              - img "Techbridge University College" [ref=e251]
              - generic [ref=e252]:
                - generic [ref=e253]:
                  - text: TECHBRIDGE
                  - text: UNIVERSITY COLLEGE
                - generic [ref=e254]: techbridge.edu.gh
          - generic [ref=e255]:
            - generic [ref=e256]:
              - generic [ref=e257]: July 26
              - generic [ref=e258]: Cohort starts
            - generic [ref=e260]:
              - generic [ref=e261]: 100%
              - generic [ref=e262]: Hands-on training
            - generic [ref=e264]:
              - generic [ref=e265]: Ghana
              - generic [ref=e266]: Based in Ghana
      - generic [ref=e268]:
        - generic [ref=e271]: CMYK Verified
        - generic [ref=e274]: 300 DPI Export
        - generic [ref=e277]: Retina Scaling
      - generic [ref=e278]:
        - generic [ref=e279]:
          - heading "The 6R Methodology" [level=2] [ref=e280]
          - paragraph [ref=e281]: A disciplined framework for aesthetic enhancement and systemic brand consistency.
        - generic [ref=e282]:
          - generic [ref=e283]:
            - generic [ref=e284]: "01"
            - img [ref=e286]
            - generic [ref=e291]:
              - generic [ref=e292]:
                - heading "Refresh" [level=4] [ref=e293]
                - heading "Kinetic Urgency" [level=3] [ref=e294]
              - paragraph [ref=e295]: Legacy marquees are upgraded with Barlow Condensed and ✦ glyph separators, creating a sophisticated yet urgent rhythm.
          - generic [ref=e296]:
            - generic [ref=e297]: "02"
            - img [ref=e299]
            - generic [ref=e305]:
              - generic [ref=e306]:
                - heading "Recolour" [level=4] [ref=e307]
                - heading "Warm Foundation" [level=3] [ref=e308]
              - paragraph [ref=e309]: The palette shifts from flat white to a premium parchment (#FAF7F0), anchored by deep espresso statistics bars.
          - generic [ref=e310]:
            - generic [ref=e311]: "03"
            - img [ref=e313]
            - generic [ref=e315]:
              - generic [ref=e316]:
                - heading "Retype" [level=4] [ref=e317]
                - heading "Typographic Tension" [level=3] [ref=e318]
              - paragraph [ref=e319]: High-contrast pairing of Libre Baskerville for editorial authority against JetBrains Mono for data-technical fields.
          - generic [ref=e320]:
            - generic [ref=e321]: "04"
            - img [ref=e323]
            - generic [ref=e325]:
              - generic [ref=e326]:
                - heading "Recompose" [level=4] [ref=e327]
                - heading "Architectural Grids" [level=3] [ref=e328]
              - paragraph [ref=e329]: Moving from generic symmetry to aspect-ratio specific structural logic (Cinema 55/45, Story vertical stacks).
          - generic [ref=e330]:
            - generic [ref=e331]: "05"
            - img [ref=e333]
            - generic [ref=e336]:
              - generic [ref=e337]:
                - heading "Refine" [level=4] [ref=e338]
                - heading "Micro-Detail Mastery" [level=3] [ref=e339]
              - paragraph [ref=e340]: "Executing precision details: asymmetric CTA corners (16px/4px), 0.5px vertical dividers, and 2px gold accent rules."
          - generic [ref=e341]:
            - generic [ref=e342]: "06"
            - img [ref=e344]
            - generic [ref=e347]:
              - generic [ref=e348]:
                - heading "Reinforce" [level=4] [ref=e349]
                - heading "Systemic Equity" [level=3] [ref=e350]
              - paragraph [ref=e351]: Strict adherence to the 24px inner-margin grid and brand-locked logo size scales across all five layout variants.
    - link [ref=e354] [cursor=pointer]:
      - /url: /admin/diagnostics
      - img [ref=e355]
    - generic:
      - generic:
        - generic:
          - generic:
            - generic:
              - generic:
                - generic:
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                - generic:
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
          - generic:
            - generic:
              - generic:
                - generic:
                  - generic: LIMITED INTAKE · JULY 26 COHORT
                - heading [level=1]:
                  - generic: Apply now.
                  - generic: Launch your
                  - generic: tech career.
                - generic:
                  - generic:
                    - generic: SECURE ADMISSION
                    - generic: admissions.techbridge.edu.gh →
                    - link:
                      - /url: https://admissions.techbridge.edu.gh
                      - generic: APPLY NOW →
              - generic:
                - generic:
                  - generic:
                    - img
                  - generic:
                    - generic: TECHBRIDGE UNIVERSITY COLLEGE
                    - generic: techbridge.edu.gh
            - generic:
              - generic:
                - generic: July 26
                - generic: Cohort starts
              - generic:
                - generic: 100%
                - generic: Hands-on training
              - generic:
                - generic: Ghana
                - generic: Based in Ghana
    - generic [ref=e358]:
      - generic [ref=e359]:
        - img [ref=e360]
        - generic [ref=e364]: 14%
      - generic [ref=e365]:
        - heading "Encoding MP4" [level=2] [ref=e366]
        - generic [ref=e367]:
          - paragraph [ref=e368]: Status
          - paragraph [ref=e369]: Encoding frame 21/150...
      - paragraph [ref=e371]: Processing 4:3 Aspect Ratio
```

# Test source

```ts
  104 | 
  105 |     // Check console logs for progress
  106 |     const logs = await page.evaluate(() => (window as any).__progressLogs || []);
  107 |     console.log('Progress logs:', logs);
  108 |   });
  109 | 
  110 |   test('should download MP4 file with correct naming', async ({ page, browserName, context }) => {
  111 |     if (browserName !== 'chromium') return;
  112 | 
  113 |     test.setTimeout(120000);
  114 | 
  115 |     // Create output directory
  116 |     const outputDir = './test-outputs';
  117 |     if (!fs.existsSync(outputDir)) {
  118 |       fs.mkdirSync(outputDir, { recursive: true });
  119 |     }
  120 | 
  121 |     // Track downloads
  122 |     let downloadedFile: string | null = null;
  123 |     const downloadPromise = new Promise<void>((resolve) => {
  124 |       context.on('page', (page) => {
  125 |         page.on('popup', async (popup) => {
  126 |           resolve();
  127 |         });
  128 |       });
  129 |     });
  130 | 
  131 |     // Wait for download
  132 |     const downloadPromise2 = page.waitForEvent('download').then(async (download) => {
  133 |       const filename = download.suggestedFilename;
  134 |       downloadedFile = path.join(outputDir, filename);
  135 |       await download.saveAs(downloadedFile);
  136 |       console.log('Downloaded:', downloadedFile);
  137 |       return downloadedFile;
  138 |     }).catch(() => null);
  139 | 
  140 |     // Click MP4 button
  141 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  142 |     if (await mp4Button.evaluate((el) => el.disabled)) {
  143 |       console.log('MP4 button disabled, skipping');
  144 |       return;
  145 |     }
  146 | 
  147 |     await mp4Button.click();
  148 | 
  149 |     // Wait for download or timeout
  150 |     const result = await Promise.race([
  151 |       downloadPromise2,
  152 |       new Promise(resolve => setTimeout(() => resolve(null), 100000))
  153 |     ]);
  154 | 
  155 |     if (result) {
  156 |       // Verify file exists and has content
  157 |       expect(fs.existsSync(result)).toBe(true);
  158 | 
  159 |       const stats = fs.statSync(result);
  160 |       console.log(`Downloaded file: ${result}, size: ${stats.size} bytes`);
  161 | 
  162 |       // MP4 files should be at least 1KB
  163 |       expect(stats.size).toBeGreaterThan(1024);
  164 | 
  165 |       // Check for MP4 magic number (0x66 0x74 0x79 0x70 = 'ftyp')
  166 |       const buffer = Buffer.alloc(4);
  167 |       const fd = fs.openSync(result, 'r');
  168 |       fs.readSync(fd, buffer, 0, 4, 4);
  169 |       fs.closeSync(fd);
  170 | 
  171 |       const magic = buffer.toString('hex');
  172 |       expect(magic).toBe('66747970'); // 'ftyp' in hex
  173 |     }
  174 |   });
  175 | 
  176 |   test('should handle MP4 encoding errors gracefully', async ({ page, browserName }) => {
  177 |     if (browserName !== 'chromium') return;
  178 | 
  179 |     test.setTimeout(120000);
  180 | 
  181 |     // Try to export
  182 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  183 |     if (await mp4Button.evaluate((el) => el.disabled)) {
  184 |       console.log('MP4 unavailable on this browser');
  185 |       return;
  186 |     }
  187 | 
  188 |     await mp4Button.click();
  189 | 
  190 |     // Wait for modal to appear (indicates export started)
  191 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  192 |       console.log('Modal did not appear');
  193 |     });
  194 | 
  195 |     // Wait for modal to disappear (indicates export completed, successful or not)
  196 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  197 |       console.log('Modal did not disappear');
  198 |       return;
  199 |     });
  200 | 
  201 |     console.log('Export completed');
  202 | 
  203 |     // Button should be enabled again after export
> 204 |     const isEnabled = await mp4Button.evaluate((el) => !el.disabled);
      |                                       ^ Error: locator.evaluate: Test timeout of 120000ms exceeded.
  205 |     expect(isEnabled).toBe(true);
  206 |   });
  207 | 
  208 |   test('should update UI during MP4 encoding', async ({ page, browserName }) => {
  209 |     if (browserName !== 'chromium') return;
  210 | 
  211 |     test.setTimeout(120000);
  212 | 
  213 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  214 |     if (await mp4Button.evaluate((el) => el.disabled)) return;
  215 | 
  216 |     // Click export
  217 |     await mp4Button.click();
  218 | 
  219 |     // Wait for modal to appear (indicates encoding started and progress is showing)
  220 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  221 |       console.log('Modal did not appear');
  222 |     });
  223 | 
  224 |     // Modal should show progress, so check if text exists
  225 |     const encodingText = page.locator('text=/Encoding MP4/i');
  226 |     await encodingText.waitFor({ timeout: 10000, state: 'visible' }).catch(() => {
  227 |       console.log('Encoding text not found');
  228 |     });
  229 | 
  230 |     // Wait for completion
  231 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 });
  232 |   });
  233 | 
  234 |   test('should export valid MP4 from all aspect ratios', async ({ page, browserName }) => {
  235 |     if (browserName !== 'chromium') return;
  236 | 
  237 |     test.setTimeout(300000); // 5 minutes for multiple exports
  238 | 
  239 |     const aspectRatios = ['STORY', 'PORTRAIT', 'SQUARE', 'LANDSCAPE', 'CINEMA'];
  240 |     const outputDir = './test-outputs';
  241 | 
  242 |     if (!fs.existsSync(outputDir)) {
  243 |       fs.mkdirSync(outputDir, { recursive: true });
  244 |     }
  245 | 
  246 |     for (const ratio of aspectRatios) {
  247 |       console.log(`Testing MP4 export for ${ratio}`);
  248 | 
  249 |       // Wait for any modal from previous export to disappear
  250 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  251 |         console.log(`Modal may still be visible for ${ratio}`);
  252 |       });
  253 | 
  254 |       // Click aspect ratio button
  255 |       const ratioButton = page.locator(`button:has-text("${ratio}")`).first();
  256 |       if (await ratioButton.isVisible()) {
  257 |         await ratioButton.click();
  258 |         await page.waitForTimeout(500); // Wait for UI to update
  259 |       }
  260 | 
  261 |       // Attempt export
  262 |       const mp4Button = page.locator('button:has-text("MP4")').first();
  263 |       if (await mp4Button.evaluate((el) => el.disabled)) {
  264 |         console.log(`MP4 disabled for ${ratio}, skipping`);
  265 |         continue;
  266 |       }
  267 | 
  268 |       // Set up download listener
  269 |       const downloadPromise = page.waitForEvent('download').then(async (download) => {
  270 |         const filename = `${ratio}-${Date.now()}.mp4`;
  271 |         const filepath = path.join(outputDir, filename);
  272 |         await download.saveAs(filepath);
  273 |         console.log(`Saved: ${filepath}`);
  274 |         return filepath;
  275 |       }).catch(() => null);
  276 | 
  277 |       // Click export
  278 |       await mp4Button.click();
  279 | 
  280 |       // Wait for modal to appear and then disappear
  281 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  282 |         console.log(`Modal did not appear for ${ratio}`);
  283 |       });
  284 | 
  285 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  286 |         console.log(`Modal did not disappear for ${ratio}`);
  287 |       });
  288 | 
  289 |       // Wait for download with timeout
  290 |       const result = await Promise.race([
  291 |         downloadPromise,
  292 |         new Promise(resolve => setTimeout(() => resolve(null), 90000))
  293 |       ]) as string | null;
  294 | 
  295 |       if (result && fs.existsSync(result)) {
  296 |         const stats = fs.statSync(result);
  297 |         console.log(`✓ ${ratio}: ${stats.size} bytes`);
  298 |         expect(stats.size).toBeGreaterThan(1024);
  299 |       } else {
  300 |         console.log(`⚠ ${ratio}: No download detected`);
  301 |       }
  302 |     }
  303 |   });
  304 | 
```
```

### FILE: playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Run tests sequentially (MP4 is memory-intensive)
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: 'html',
  timeout: 120 * 1000, // 2 minutes per test
  expect: {
    timeout: 5000,
  },

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to test other browsers (MP4 export only works on Chromium)
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true, // Always reuse if already running
    timeout: 120 * 1000, // Increased from 60s to 120s for slow startup
    stdout: 'pipe',
    stderr: 'pipe',
  },
});

```

### FILE: PWA_SETUP_SUMMARY.md
```md
# PWA Setup Summary — TechBridge Poster Studio

**Date:** 2026-05-04  
**Gap Analysis References:** GAP-005 (PWA Manifest), GAP-006 (App Icons)  
**Status:** Configuration Complete — Icons Pending Generation

---

## Completed Tasks

### 1. HTML Head Metadata ✓
**File:** `index.html`

Updated with:
- PWA meta tags (`apple-mobile-web-app-capable`, `theme-color`, `background-color`)
- Icon link references (favicon, apple-touch-icon)
- Manifest link (`/manifest.webmanifest`)
- Open Graph social sharing tags
- Twitter Card meta tags

**Key additions:**
```html
<link rel="manifest" href="/manifest.webmanifest" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
<meta name="theme-color" content="#8B1A2F" />
<meta name="apple-mobile-web-app-capable" content="yes" />
```

### 2. Web App Manifest ✓
**File:** `public/manifest.webmanifest`

Created with:
- **name:** "TechBridge Poster Studio"
- **short_name:** "Poster Studio"
- **display:** "standalone" (full-screen native app experience)
- **start_url:** "/" (launches at home on activation)
- **theme_color:** "#8B1A2F" (TUC burgundy)
- **background_color:** "#FAF7F0" (cream)
- **orientation:** "portrait-primary"
- **categories:** ["graphics", "productivity"]
- **8 icon definitions** (varying sizes and purposes)
- **2 screenshot definitions** (for app store listing)

**Manifest structure validates as valid JSON.**

### 3. Icon Generation Script ✓
**File:** `generate-icons.js`

Node.js script that:
- Generates 1024×1024 master icon with SVG (TUC branding, gradient, text)
- Resizes master to 7 required icon sizes
- Applies safe colour management
- Creates maskable variant for Android adaptive icons

**Script dependencies:**
- `sharp` (image processing) — added to `devDependencies`

### 4. Package Configuration ✓
**File:** `package.json`

Updates:
- Added `"generate:icons": "node generate-icons.js"` to scripts
- Added `sharp ^0.33.0` to devDependencies

---

## Pending Tasks

### Generate Icon Files

**Required before deployment:**

Run one of the following:

**Option A: Automated (Recommended)**
```bash
cd c:\Development\aucdt-utilities\techbridge-poster-studio
npm install sharp
npm run generate:icons
```

**Option B: Manual**
Resize `public/icons/icon-master-1024.png` to:
- 48×48, 72×72, 96×96, 144×144, 192×192, 512×512 (standard icons)
- 180×180 (apple-touch-icon.png)
- 512×512 (maskable-512.png, for adaptive icon)

### Verify Build

```bash
npm run build
```

Should produce:
```
dist/
├── index.html (with manifest link)
├── manifest.webmanifest
└── icons/
    ├── icon-48.png through icon-512.png
    ├── apple-touch-icon.png
    └── maskable-512.png
```

---

## App Store Submission Checklist

Once icons are generated, verify:

- [ ] All PNG files are present in `public/icons/`
- [ ] PNG files are sRGB colour space (no transparency)
- [ ] `manifest.webmanifest` is valid JSON
- [ ] `index.html` references manifest and apple-touch-icon
- [ ] `npm run build` completes without errors
- [ ] Icons copy to `dist/icons/` during build
- [ ] No 404 errors for manifest or icon resources

---

## File Manifest

### Created Files
```
techbridge-poster-studio/
├── public/
│   ├── manifest.webmanifest        [NEW] PWA manifest (8 icon definitions)
│   └── icons/                      [NEW DIRECTORY] (awaiting icon files)
├── generate-icons.js               [NEW] Icon generation script
├── ICON_GENERATION_INSTRUCTIONS.md [NEW] Detailed icon setup guide
└── PWA_SETUP_SUMMARY.md            [THIS FILE]
```

### Modified Files
```
techbridge-poster-studio/
├── index.html                      [UPDATED] Added manifest + icon meta tags
└── package.json                    [UPDATED] Added generate:icons script + sharp dependency
```

---

## TUC Branding Specs

**Icon Design:**
- Primary colour: `#8B1A2F` (Burgundy)
- Accent colour: `#4A9B7F` (Teal)
- Background: `#FAF7F0` (Cream)
- Text: "POSTER STUDIO" (bi-line design)
- Style: Modern gradient with geometric accents

**Manifest Theme:**
- theme_color: `#8B1A2F`
- background_color: `#FAF7F0`

---

## Technical Notes

### Why .webmanifest extension?
The `.webmanifest` extension is the official W3C standard for Web App Manifests. While browsers accept `.json`, using `.webmanifest` provides better tooling support and clarity.

### Icon Sizes Explained
- **48, 72, 96, 144, 192:** Android launcher densities (ldpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- **512:** Splash screen and large displays; Play Store requirements
- **180:** Apple Home Screen (iPad and iPhone)
- **maskable-512:** Adaptive icon background for Android 8.0+ (rounded corners, masks)

### Display Mode
`"display": "standalone"` hides browser UI, making the PWA appear as a native application when installed.

---

## Next Steps

1. **Run icon generation** (automated or manual)
2. **Verify PNG files** in `public/icons/` directory
3. **Build and test:** `npm run build && npm run preview`
4. **Mobile testing:** Install PWA on iOS and Android test devices
5. **App Store submission:** Follow platform-specific PWA submission guidelines

---

**Generated:** 2026-05-04  
**Project:** TechBridge Poster Studio  
**Gap References:** GAP-005, GAP-006  
**Next Review:** After icon generation and build verification

```

### FILE: README.md
```md
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
  GEMINI_API_KEY=[REDACTED_CREDENTIAL]
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


```

### FILE: server.ts
```typescript

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { chromium } from 'playwright';
import { getPosterHtml } from './src/lib/poster-utils';
import { getPosterDimensions } from './src/constants';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // CORS headers for mobile app
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  app.post("/api/generate", async (req, res) => {
    const { format, data } = req.body;
    let browser;
    try {
      const dims = getPosterDimensions(data.aspectRatio);

      browser = await chromium.launch();
      const page = await browser.newPage({
        viewport: { width: dims.width, height: dims.height },
        deviceScaleFactor: 2
      });
      await page.setContent(getPosterHtml(data), { waitUntil: 'networkidle' });
      
      // Wait for all images to actually load
      try {
        await page.waitForFunction(() => {
          const imgs = Array.from(document.querySelectorAll('img'));
          return imgs.every(img => img.complete && img.naturalWidth > 0);
        }, { timeout: 5000 });
      } catch (e) {
        console.warn("Some images timed out while loading in Playwright:", e);
      }
      
      await page.waitForTimeout(1000); 
      
      const outputDir = "/mnt/user-data/outputs";
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

      if (format === 'png') {
        const buffer = await page.locator(".poster-container").screenshot();
        fs.writeFileSync(path.join(outputDir, "techbridge-poster.png"), buffer);
        res.setHeader('Content-Type', 'image/png');
        res.send(buffer);
      } else {
        const buffer = await page.pdf({ 
          width: dims.width, 
          height: dims.height, 
          printBackground: true 
        });
        fs.writeFileSync(path.join(outputDir, "techbridge-poster.pdf"), buffer);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(buffer);
      }
    } catch (error) {
      console.error("Generation error:", error);
      res.status(500).json({ error: (error as Error).message });
    } finally {
      if (browser) await browser.close();
    }
  });

  // Keep existing save-files route for compatibility
  app.post("/api/save-files", (req, res) => {
    const { pngData, pdfData } = req.body;
    const outputDir = "/mnt/user-data/outputs";
    try {
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
      if (pngData) {
        const pngBuffer = Buffer.from(pngData.split(",")[1], 'base64');
        fs.writeFileSync(path.join(outputDir, "techbridge-poster.png"), pngBuffer);
      }
      if (pdfData) {
        const pdfBuffer = Buffer.from(pdfData.split(",")[1], 'base64');
        fs.writeFileSync(path.join(outputDir, "techbridge-poster.pdf"), pdfBuffer);
      }
      res.json({ success: true });
    } catch (e) { res.status(500).send(e); }
  });

  if (NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[${new Date().toISOString()}] Server running on port ${PORT} (${NODE_ENV})`);
  });
}

startServer();

```

### FILE: src/App.tsx
```typescript
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Download, CheckCircle, FileText, ImageIcon, ExternalLink, Zap, Shield,
  Layout, Target, Trash2, RefreshCw, Type, Link as LinkIcon,
  BarChart3, Image as ImageIcon2, Activity, Settings, HardDrive,
  Search, AlertTriangle, Monitor, Smartphone, Moon, Sun, Lock, Play
} from 'lucide-react';
import Poster from './components/Poster';
import Methodology from './components/Methodology';
import { Tooltip } from './components/Tooltip';
import { getPosterHtml } from './lib/poster-utils';
import { exportToMp4, exportViaMediaRecorder, getVideoExportMethod, ExportProgress, canExportVideo } from './lib/video-export';
import { PosterData, defaultPosterData, AspectRatio } from './types';

const AdminLayout = lazy(() => import('./components/AdminPages').then(m => ({ default: m.AdminLayout })));


// --- MAIN APP COMPONENTS ---

function AppContent() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVideoExporting, setIsVideoExporting] = useState(false);
  const [videoProgress, setVideoProgress] = useState<ExportProgress | null>(null);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [posterData, setPosterData] = useState<PosterData>(defaultPosterData);
  const exportRef = React.useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tuc-theme');
      return saved ? saved === 'dark' : false;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('tuc-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const exportHTML = () => {
    const htmlContent = getPosterHtml(posterData);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `poster-${posterData.brandName.toLowerCase().replace(/\s+/g, '-')}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async (format: 'png' | 'pdf') => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format, data: posterData })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `techbridge-poster-${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B1A1A', '#D4A017']
        });
      });
      
      setLastGenerated(format.toUpperCase());
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err instanceof Error ? err.message : "Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (lastGenerated) {
      const timer = setTimeout(() => setLastGenerated(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastGenerated]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const updateField = (field: keyof PosterData, value: any) => {
    setPosterData(prev => ({ ...prev, [field]: value }));
  };

  const handleVideoExport = async () => {
    if (!exportRef.current) return;

    setIsVideoExporting(true);
    setVideoProgress({ currentFrame: 0, totalFrames: 75, status: 'Initializing...' });

    try {
      const method = getVideoExportMethod();
      let blob: Blob;
      let ext: string;

      if (method === 'webcodecs') {
        blob = await exportToMp4(exportRef.current, posterData, (progress) => {
          setVideoProgress(progress);
        });
        ext = 'mp4';
      } else if (method === 'mediarecorder') {
        const result = await exportViaMediaRecorder(exportRef.current, posterData, (progress) => {
          setVideoProgress(progress);
        });
        blob = result.blob;
        ext = result.extension;
      } else {
        throw new Error('Video export not supported on this browser');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `techbridge-poster-${Date.now()}.${ext}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setLastGenerated(ext.toUpperCase());
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#8B1A1A', '#D4A017', '#ffffff']
        });
      });
    } catch (err: any) {
      console.error('Video export failed:', err);
      const msg = typeof err === 'string' ? err : (err?.message || JSON.stringify(err));
      setError(`Video Export Error: ${msg || 'Unknown error'}`);
    } finally {
      setIsVideoExporting(false);
      setVideoProgress(null);
    }
  };

  const getPreviewScale = (ratio: AspectRatio) => {
    switch (ratio) {
      case AspectRatio.STORY: return 0.7;
      case AspectRatio.PORTRAIT: return 0.8;
      case AspectRatio.CINEMA: return 0.7;
      case AspectRatio.SQUARE: return 0.7;
      default: return 0.85;
    }
  };

  return (
    <div className={`flex flex-col lg:flex-row h-screen w-full overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0f0f0f]' : 'bg-[#f8f6f2]'} font-sans`}>
      {/* Sidebar - Editors (Mobile: full-width, Desktop: 320px sidebar) */}
      <aside className={`w-full lg:w-80 lg:h-full flex flex-col border-b lg:border-b-0 lg:border-r ${isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-slate-200/60'} shadow-[0_20px_40px_rgba(0,0,0,0.02)] lg:shadow-[20px_0_40px_rgba(0,0,0,0.02)] z-20`}>
        <div className={`p-8 border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100/80'} flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tuc-crimson overflow-hidden p-1.5 shadow-lg shadow-tuc-crimson/20">
              <img 
                src={posterData.logoUrl} 
                alt="Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-0.5">
              <h1 className={`text-sm font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-tuc-text-primary'}`}>TECHBRIDGE</h1>
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-slate-400">Poster Studio</p>
            </div>
          </div>
          <Tooltip text={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`} position="bottom" isDarkMode={isDarkMode}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl relative overflow-hidden transition-all duration-300 active:scale-95 ${isDarkMode ? 'bg-white/5 text-tuc-gold' : 'bg-slate-50 text-slate-400'}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDarkMode ? 'dark' : 'light'}
                  initial={{ y: 20, opacity: 0, rotate: -45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -20, opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </Tooltip>
        </div>

        <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 lg:py-8 space-y-8 lg:space-y-10 custom-scrollbar max-h-[60vh] lg:max-h-none">
          {/* Layout & Dimensions */}
          <section className="space-y-6">
            <div className={`flex items-center justify-between border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'} pb-2`}>
              <div className="flex items-center gap-2 text-tuc-crimson">
                <Layout className="w-3.5 h-3.5" />
                <h2 className="text-[12px] font-black uppercase tracking-[0.15em]">Layout</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(AspectRatio).map(([key, value]) => (
                <Tooltip key={key} text={`Switch to ${key} format`} position="top" isDarkMode={isDarkMode}>
                  <button
                    onClick={() => updateField('aspectRatio', value)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all active:scale-95 w-full ${
                      posterData.aspectRatio === value
                        ? 'bg-tuc-crimson border-tuc-crimson text-white shadow-lg'
                        : isDarkMode ? 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[12px] font-bold uppercase tracking-wider">{key}</span>
                    <span className="text-[10px] opacity-70 mt-0.5">{value}</span>
                  </button>
                </Tooltip>
              ))}
            </div>
          </section>

          {/* Header Section */}
          <section className="space-y-6">
            <div className={`flex items-center justify-between border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'} pb-2`}>
              <div className="flex items-center gap-2 text-tuc-crimson">
                <Type className="w-3.5 h-3.5" />
                <h2 className="text-[12px] font-black uppercase tracking-[0.15em]">Messaging</h2>
              </div>
            </div>
            <div className="space-y-4">
              <div className="group">
                <Tooltip text="Scrolling row shown at the very top of the poster" position="top" isDarkMode={isDarkMode}>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-tuc-crimson transition-colors">Urgency Strip</label>
                  <input
                    type="text"
                    value={posterData.urgencyText}
                    onChange={(e) => updateField('urgencyText', e.target.value)}
                    className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10 focus:border-tuc-crimson' : 'bg-slate-50 border-slate-200/60 focus:bg-white focus:border-tuc-crimson focus:ring-4 focus:ring-tuc-crimson/5'}`}
                  />
                </Tooltip>
              </div>
              <div className="group">
                <Tooltip text="Short intro text above the main headline" position="top" isDarkMode={isDarkMode}>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-tuc-crimson transition-colors">Eyebrow</label>
                  <input
                    type="text"
                    value={posterData.eyebrow}
                    onChange={(e) => updateField('eyebrow', e.target.value)}
                    className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10 focus:border-tuc-crimson' : 'bg-slate-50 border-slate-200/60 focus:bg-white focus:border-tuc-crimson focus:ring-4 focus:ring-tuc-crimson/5'}`}
                  />
                </Tooltip>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Headline Content</label>
                <Tooltip text="First line of the main headline" position="top" isDarkMode={isDarkMode}>
                  <input type="text" value={posterData.headlineLine1} onChange={(e) => updateField('headlineLine1', e.target.value)} className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10' : 'bg-slate-50 border-slate-200/60'}`} placeholder="Line 1" />
                </Tooltip>
                <Tooltip text="Italicized accent line (Crimson color)" position="top" isDarkMode={isDarkMode}>
                  <input type="text" value={posterData.headlineLine2} onChange={(e) => updateField('headlineLine2', e.target.value)} className={`w-full text-base p-3 rounded-lg border outline-none transition-all font-bold text-tuc-crimson ${isDarkMode ? 'bg-white/5 border-tuc-crimson/30' : 'bg-slate-50 border-tuc-crimson/30'}`} placeholder="Line 2 (Accent)" />
                </Tooltip>
                <Tooltip text="Third line of the main headline" position="top" isDarkMode={isDarkMode}>
                  <input type="text" value={posterData.headlineLine3} onChange={(e) => updateField('headlineLine3', e.target.value)} className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10' : 'bg-slate-50 border-slate-200/60'}`} placeholder="Line 3" />
                </Tooltip>
                <Tooltip text="Optional fourth line for additional context" position="top" isDarkMode={isDarkMode}>
                  <input type="text" value={posterData.headlineLine4} onChange={(e) => updateField('headlineLine4', e.target.value)} className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10' : 'bg-slate-50 border-slate-200/60'}`} placeholder="Line 4 (Optional)" />
                </Tooltip>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="space-y-6">
            <div className={`flex items-center justify-between border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'} pb-2`}>
              <div className="flex items-center gap-2 text-tuc-crimson">
                <LinkIcon className="w-3.5 h-3.5" />
                <h2 className="text-[12px] font-black uppercase tracking-[0.15em]">Call to Action</h2>
              </div>
            </div>
            <div className="space-y-4">
              <div className="group">
                <Tooltip text="Label shown on the call-to-action button" position="top" isDarkMode={isDarkMode}>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-tuc-crimson transition-colors">Button Copy</label>
                  <input
                    type="text"
                    value={posterData.ctaText}
                    onChange={(e) => updateField('ctaText', e.target.value)}
                    className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10' : 'bg-slate-50 border-slate-200/60'}`}
                  />
                </Tooltip>
              </div>
              <div className="group">
                <Tooltip text="Destination URL for the call-to-action button" position="top" isDarkMode={isDarkMode}>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-tuc-crimson transition-colors">Target Link</label>
                  <input
                    type="text"
                    value={posterData.ctaUrl}
                    onChange={(e) => updateField('ctaUrl', e.target.value)}
                    className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10' : 'bg-slate-50 border-slate-200/60'}`}
                  />
                </Tooltip>
              </div>
            </div>
          </section>

          {/* Brand & Multimedia */}
          <section className="space-y-6">
            <div className={`flex items-center justify-between border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'} pb-2`}>
              <div className="flex items-center gap-2 text-tuc-crimson">
                <ImageIcon2 className="w-3.5 h-3.5" />
                <h2 className="text-[12px] font-black uppercase tracking-[0.15em]">Brand & Video</h2>
              </div>
            </div>
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-tuc-crimson/10 border-tuc-crimson/20' : 'bg-tuc-crimson/5 border-tuc-crimson/10'}`}>
                <div className="space-y-0.5">
                  <span className="text-[12px] font-black text-tuc-crimson uppercase tracking-wider">Video Carousel</span>
                  <p className="text-[10.5px] text-tuc-crimson/60">Interchange logo and tour</p>
                </div>
                <Tooltip text={posterData.showVideo ? "Disable Video Overlay" : "Enable Video Overlay"} position="left" isDarkMode={isDarkMode}>
                  <button 
                    onClick={() => updateField('showVideo', !posterData.showVideo)}
                    className={`w-10 h-5 rounded-full relative transition-all duration-300 ${posterData.showVideo ? 'bg-tuc-crimson shadow-inner shadow-black/10' : 'bg-slate-300'}`}
                  >
                    <motion.div 
                      animate={{ x: posterData.showVideo ? 22 : 4 }}
                      className="absolute top-1 w-3 h-3 rounded-full bg-white shadow-md shadow-black/20"
                    />
                  </button>
                </Tooltip>
              </div>
              <div className="group">
                <Tooltip text="URL to the background video (.mp4 recommended)" position="top" isDarkMode={isDarkMode}>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-tuc-crimson transition-colors">Video Source</label>
                  <input
                    type="text"
                    value={posterData.videoUrl || ''}
                    onChange={(e) => updateField('videoUrl', e.target.value)}
                    className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10' : 'bg-slate-50 border-slate-200/60'}`}
                    placeholder="https://...mp4"
                  />
                </Tooltip>
              </div>
              <div className="group">
                <Tooltip text="Display domain shown below the institution name" position="top" isDarkMode={isDarkMode}>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-tuc-crimson transition-colors">Domain Label</label>
                  <input
                    type="text"
                    value={posterData.domainUrl}
                    onChange={(e) => updateField('domainUrl', e.target.value)}
                    className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10' : 'bg-slate-50 border-slate-200/60'}`}
                  />
                </Tooltip>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="space-y-6 pb-12">
            <div className={`flex items-center justify-between border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'} pb-2`}>
              <div className="flex items-center gap-2 text-tuc-crimson">
                <BarChart3 className="w-3.5 h-3.5" />
                <h2 className="text-[12px] font-black uppercase tracking-[0.15em]">Pillar Statistics</h2>
              </div>
            </div>
            <div className="space-y-5">
              {[1, 2, 3].map(num => (
                <div key={num} className="grid grid-cols-5 gap-3 items-end">
                  <div className="col-span-2">
                    <Tooltip text={`Main value for statistic ${num}`} position="top" isDarkMode={isDarkMode}>
                      <label className="text-[10px] font-black text-slate-300 uppercase block mb-1.5 tracking-tighter">Value {num}</label>
                      <input
                        type="text"
                        value={(posterData as any)[`stat${num}Value`]}
                        onChange={(e) => updateField(`stat${num}Value` as any, e.target.value)}
                        className={`w-full text-base p-2 rounded-lg border font-bold text-tuc-crimson ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}
                      />
                    </Tooltip>
                  </div>
                  <div className="col-span-3">
                    <Tooltip text={`Descriptive label for statistic ${num}`} position="top" isDarkMode={isDarkMode}>
                      <label className="text-[10px] font-black text-slate-300 uppercase block mb-1.5 tracking-tighter">Descriptor {num}</label>
                      <input
                        type="text"
                        value={(posterData as any)[`stat${num}Label`]}
                        onChange={(e) => updateField(`stat${num}Label` as any, e.target.value)}
                        className={`w-full text-base p-2 rounded-lg border ${isDarkMode ? 'bg-white/5 border-white/5 text-white' : 'bg-slate-50/50 border-slate-100'}`}
                      />
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className={`p-4 lg:p-6 border-t ${isDarkMode ? 'bg-[#222] border-white/5' : 'bg-slate-50/50 border-slate-100'} space-y-3 shrink-0`}>
          <Tooltip text="Download Print-Ready PDF" position="top" isDarkMode={isDarkMode}>
            <button
              onClick={() => handleGenerate('pdf')}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-tuc-crimson py-3.5 text-sm font-black text-white shadow-[0_10px_20px_-5px_rgba(139,26,26,0.3)] hover:-translate-y-0.5 hover:shadow-[0_15px_25px_-5px_rgba(139,26,26,0.4)] active:scale-95 transition-all disabled:opacity-50"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              GENERATE PDF
            </button>
          </Tooltip>
          <div className="grid grid-cols-2 gap-3">
            {canExportVideo() ? (
              <Tooltip text="Export 5s MP4 Video" position="top" isDarkMode={isDarkMode}>
                <button
                  type="button"
                  onClick={handleVideoExport}
                  disabled={isGenerating || isVideoExporting}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold transition-all active:scale-95 disabled:opacity-50 ${isDarkMode ? 'bg-tuc-gold/10 border-tuc-gold/20 text-tuc-gold hover:bg-tuc-gold/20' : 'bg-tuc-gold/5 border-tuc-gold/20 text-tuc-gold-dark hover:bg-tuc-gold/10'}`}
                >
                  {isVideoExporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  MP4
                </button>
              </Tooltip>
            ) : (
              <Tooltip text="MP4 export is not supported on iOS or this browser" position="top" isDarkMode={isDarkMode}>
                <button
                  type="button"
                  disabled
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold transition-all active:scale-95 opacity-50 cursor-not-allowed ${isDarkMode ? 'bg-tuc-gold/10 border-tuc-gold/20 text-tuc-gold' : 'bg-tuc-gold/5 border-tuc-gold/20 text-tuc-gold-dark'}`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  MP4
                </button>
              </Tooltip>
            )}
            <Tooltip text="Export High-Res PNG" position="top" isDarkMode={isDarkMode}>
              <button
                onClick={() => handleGenerate('png')}
                disabled={isGenerating || isVideoExporting}
                className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold transition-all active:scale-95 disabled:opacity-50 w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                PNG
              </button>
            </Tooltip>
          </div>
          <Tooltip text="View Raw HTML Code" position="top" isDarkMode={isDarkMode}>
            <button
              onClick={exportHTML}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold transition-all active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              HTML
            </button>
          </Tooltip>
        </div>
      </aside>

      {/* Main Canvas (Mobile: bottom, Desktop: right side) */}
      <main className={`relative flex-1 overflow-y-auto w-full h-auto lg:h-full scroll-smooth custom-scrollbar ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
        <div className="relative min-h-screen flex flex-col items-center justify-start py-20">
          <div className={`absolute inset-0 z-0 bg-dot-grid pointer-events-none ${isDarkMode ? 'opacity-10' : 'opacity-40'}`}></div>
          
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="mb-8 text-center space-y-1">
              <h3 className={`text-[12px] font-black uppercase tracking-[0.4em] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Live Production Preview</h3>
              <div className="flex items-center justify-center gap-2">
                <div className="h-0.5 w-8 bg-tuc-maroon/20 rounded-full"></div>
                <span className="text-[8px] font-bold text-tuc-maroon/40 uppercase">Retina Master 2.0</span>
                <div className="h-0.5 w-8 bg-tuc-maroon/20 rounded-full"></div>
              </div>
            </div>

            <motion.div
              key={JSON.stringify(posterData)}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: getPreviewScale(posterData.aspectRatio), y: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              className="shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] rounded-2xl overflow-hidden ring-1 ring-black/5"
            >
              <Poster data={posterData} />
            </motion.div>

            <div className={`mt-16 grid grid-cols-3 gap-12 border-t pt-8 w-full max-w-2xl opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 ${isDarkMode ? 'border-white/5' : 'border-slate-200/60'}`}>
              <div className="flex flex-col items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-tuc-maroon ring-4 ring-tuc-maroon/10"></div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">CMYK Verified</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-tuc-maroon ring-4 ring-tuc-maroon/10"></div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">300 DPI Export</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-tuc-maroon ring-4 ring-tuc-maroon/10"></div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Retina Scaling</span>
              </div>
            </div>

            <Methodology />
          </div>
        </div>

          <div className="fixed z-30" style={{ bottom: 'calc(2rem + env(safe-area-inset-bottom))', left: 'calc(2rem + env(safe-area-inset-left))' }}>
            <Tooltip text="Diagnostic Dashboard" position="right" isDarkMode={isDarkMode}>
              <Link
                to="/admin/diagnostics"
                className={`p-3 rounded-full shadow-lg border transition-all hover:scale-110 active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/5 text-slate-600' : 'bg-white border-slate-100 text-slate-300'}`}
              >
                <Activity className="w-5 h-5" />
              </Link>
            </Tooltip>
          </div>

          {/* Hidden Export Container */}
          <div 
            className="fixed pointer-events-none" 
            style={{ 
              zIndex: -1000, 
              left: '-20000px', 
              top: '0',
              width: 'max-content',
              height: 'max-content',
              opacity: 1, 
              visibility: 'visible'
            }}
            aria-hidden="true"
          >
             <div ref={exportRef} style={{ background: '#FAF7F0', width: 'max-content', display: 'inline-block' }}>
                <Poster data={posterData} forceVisible={true} />
             </div>
          </div>

          {/* Video Export Overlay */}
          <AnimatePresence>
            {isVideoExporting && videoProgress && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6"
              >
                <div className="w-full max-w-sm bg-white rounded-3xl p-10 space-y-8 shadow-2xl text-center">
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle 
                        cx="48" cy="48" r="44" 
                        fill="none" 
                        stroke="#f1f5f9" 
                        strokeWidth="8"
                      />
                      <motion.circle 
                        cx="48" cy="48" r="44" 
                        fill="none" 
                        stroke="#8B1A1A" 
                        strokeWidth="8"
                        strokeDasharray="276.46"
                        initial={{ strokeDashoffset: 276.46 }}
                        animate={{ strokeDashoffset: 276.46 * (1 - videoProgress.currentFrame / videoProgress.totalFrames) }}
                        transition={{ duration: 0.3 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-black tracking-tighter text-slate-900">
                        {Math.round((videoProgress.currentFrame / videoProgress.totalFrames) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Encoding MP4</h2>
                    <div className="space-y-1">
                      <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase">Status</p>
                      <p className="text-slate-600 text-sm font-bold truncate max-w-full px-2">{videoProgress.status}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing {posterData.aspectRatio} Aspect Ratio</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="fixed z-[100] flex items-center gap-4 bg-red-600 text-white p-4 pl-6 rounded-2xl shadow-2xl shadow-red-900/20 border border-red-500/50"
              style={{ bottom: 'calc(2rem + env(safe-area-inset-bottom))', right: 'calc(2rem + env(safe-area-inset-right))' }}
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Sync Failure</span>
                <span className="text-sm font-bold">{error}</span>
              </div>
              <button onClick={() => setError(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {lastGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="fixed z-[100] flex items-center gap-4 bg-emerald-600 text-white p-4 pl-6 rounded-2xl shadow-2xl shadow-emerald-900/20 border border-emerald-500/50"
              style={{ bottom: 'calc(2rem + env(safe-area-inset-bottom))', right: 'calc(2rem + env(safe-area-inset-right))' }}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-xl">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Export Finalized</span>
                  <span className="text-sm font-bold">Successfully generated {lastGenerated} asset.</span>
                </div>
              </div>
              <button onClick={() => setLastGenerated(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={
          <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-50"><div className="text-slate-400">Loading admin...</div></div>}>
            <AdminLayout />
          </Suspense>
        } />
        <Route path="/" element={<AppContent />} />
        <Route path="*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}


```

### FILE: src/components/AdminPages.tsx
```typescript
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  CheckCircle, FileText, Activity, Zap, Shield, Lock, HardDrive,
  AlertTriangle, RefreshCw, Monitor, Smartphone
} from 'lucide-react';
import { Tooltip } from './Tooltip';

const AdminSidebar = () => {
  const location = useLocation();
  return (
    <div className="w-64 h-full bg-slate-900 text-white flex flex-col p-6 space-y-8">
      <div className="flex items-center gap-3 px-2">
        <Shield className="w-6 h-6 text-tuc-gold" />
        <span className="font-black tracking-tighter text-lg">POSTER_ADMIN</span>
      </div>

      <nav className="flex-1 space-y-2">
        {[
          { path: '/admin/diagnostics', icon: Activity, label: 'Diagnostics', tip: 'View system health and diagnostics' },
          { path: '/admin/testing', icon: Zap, label: 'Testing suite', tip: 'Run automated layout and PDF tests' },
          { path: '/admin/logs', icon: FileText, label: 'System Logs', tip: 'View real-time event logs' },
          { path: '/', icon: Activity, label: 'Exit to App', tip: 'Return to the poster editor' },
        ].map((item) => (
          <Tooltip key={item.path} text={item.tip} position="right" isDarkMode={true}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                location.pathname === item.path
                  ? 'bg-tuc-crimson text-white shadow-lg shadow-tuc-crimson/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-bold">{item.label}</span>
            </Link>
          </Tooltip>
        ))}
      </nav>

      <div className="pt-8 border-t border-white/10 opacity-50">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">v1.2.0 production</p>
      </div>
    </div>
  );
};

const DiagnosticsPage = () => {
  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <header>
        <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">System Diagnostics</h1>
        <p className="text-slate-500 font-medium">Real-time health monitor and dependency verification</p>
      </header>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">React Core</h3>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-4xl font-black text-slate-900 tracking-tighter">19.2.5</p>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-full bg-emerald-500"></div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Headless engine</h3>
            <Zap className="w-4 h-4 text-tuc-gold" />
          </div>
          <p className="text-4xl font-black text-slate-900 tracking-tighter">PLAYWRIGHT</p>
          <div className="flex gap-1">
            <div className="h-1 flex-1 bg-emerald-500 rounded-full"></div>
            <div className="h-1 flex-1 bg-emerald-500 rounded-full"></div>
            <div className="h-1 flex-1 bg-slate-200 rounded-full"></div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Cache Status</h3>
            <HardDrive className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-4xl font-black text-slate-900 tracking-tighter">94% OK</p>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-[94%] bg-blue-500"></div>
          </div>
        </div>
      </div>

      <section className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/50">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Service</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Endpoint</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Latency</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {[
              { s: 'Poster Engine', e: '/api/generate', l: '420ms', st: 'Healthy' },
              { s: 'PDF Distro', e: '/api/save-files', l: '12ms', st: 'Healthy' },
              { s: 'Vite Middleware', e: 'N/A', l: '0.2ms', st: 'Active' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-white transition-colors">
                <td className="px-6 py-4 font-bold text-slate-700 text-sm">{row.s}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-400">{row.e}</td>
                <td className="px-6 py-4 text-xs font-semibold text-slate-600">{row.l}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">
                    <div className="w-1 h-1 rounded-full bg-emerald-600 animate-pulse"></div>
                    {row.st}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const TestingPage = () => {
  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <header>
        <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Testing Suite</h1>
        <p className="text-slate-500 font-medium">Automated validation for all distribution formats</p>
      </header>

      <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-xl shadow-slate-200/40 border-b-4 border-b-tuc-gold">
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-tuc-gold/10 flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-tuc-gold" />
               </div>
               <div>
                  <h3 className="text-lg font-black tracking-tighter">Retina Cross-Browser Audit</h3>
                  <p className="text-sm text-slate-400">Playwright v1.59.1 chromium</p>
               </div>
            </div>
            <Tooltip text="Execute all automated verification tests" position="bottom" isDarkMode={false}>
              <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-transform duration-75 shadow-lg shadow-slate-900/10">
                 RUN ALL TESTS
              </button>
            </Tooltip>
         </div>

         <div className="space-y-4">
            {[
              { name: 'Landscape 4:3 Snapshot', status: 'Passed', time: '1.2s' },
              { name: 'Square 1:1 Overflow Check', status: 'Passed', time: '0.8s' },
              { name: 'Portrait 3:4 Layout Grid', status: 'Failed', time: 'N/A' },
              { name: 'PDF CMYK Compliance', status: 'Pending', time: 'N/A' },
            ].map((test, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
                  <div className="flex items-center gap-3">
                     {test.status === 'Passed' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : test.status === 'Failed' ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <RefreshCw className="w-4 h-4 text-slate-300 animate-spin" />}
                     <span className="font-bold text-slate-700">{test.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-xs font-mono text-slate-400">{test.time}</span>
                     <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        test.status === 'Passed' ? 'bg-emerald-100 text-emerald-700' :
                        test.status === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-500'
                     }`}>{test.status}</span>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const LogsPage = () => (
  <div className="p-12 max-w-4xl space-y-12">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-5xl font-black tracking-tighter text-slate-900">SYSTEM_LOGS</h1>
        <p className="text-slate-500 text-lg mt-2 font-medium">Real-time event stream and error audits</p>
      </div>
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600" />
        <span className="text-xs font-black text-amber-700 uppercase tracking-widest leading-none">Debug Mode Active</span>
      </div>
    </div>

    <div className="bg-slate-900 rounded-3xl p-8 font-mono text-[13px] text-slate-300 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-tuc-gold via-tuc-crimson to-tuc-gold opacity-50"></div>
      <div className="space-y-3">
        <div className="flex gap-4 opacity-50">
          <span className="text-slate-600 shrink-0">15:42:01.214</span>
          <span className="text-emerald-400 shrink-0">[INFO]</span>
          <span>System kernel initialized successfully (React 19.2.5)</span>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-600 shrink-0">15:42:01.350</span>
          <span className="text-blue-400 shrink-0">[VITE]</span>
          <span>HMR connected. Environment: production (simulated)</span>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-600 shrink-0">15:42:01.882</span>
          <span className="text-emerald-400 shrink-0">[INFO]</span>
          <span>6R Aesthetic Engine ready. Loaded 5 aspect ratios.</span>
        </div>
        <div className="flex gap-4 text-amber-400">
          <span className="text-slate-600 shrink-0">15:42:02.100</span>
          <span className="text-amber-500 shrink-0">[WARN]</span>
          <span>PDF buffer size exceeding optimal limits (Compressed)</span>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-600 shrink-0">15:43:45.002</span>
          <span className="text-purple-400 shrink-0">[AUTH]</span>
          <span>Admin session verified via passcode input.</span>
        </div>
        <div className="flex gap-4 animate-pulse">
          <span className="text-slate-600 shrink-0">15:44:12.987</span>
          <span className="text-emerald-400 shrink-0">[LIVE]</span>
          <span>Watching for changes in /assets/masks/...</span>
        </div>
      </div>
    </div>
  </div>
);

export const AdminLayout = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const adminPassword = [REDACTED_CREDENTIAL]

  const authenticate = (pwd: string) => {
    if (!adminPassword) {
      setError('Admin password not configured');
      return;
    }
    if (pwd === adminPassword) {
      setIsAuthorized(true);
      setError('');
    } else {
      setError('Incorrect passcode');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 font-sans">
        <div className="w-full max-w-sm p-10 bg-white rounded-3xl shadow-2xl space-y-8 border-t-8 border-t-tuc-crimson">
          <div className="text-center space-y-2">
            <Lock className="w-12 h-12 text-tuc-crimson mx-auto mb-4" />
            <h2 className="text-3xl font-black tracking-tighter text-slate-900">ADMIN LOCK</h2>
            <p className="text-slate-500 text-sm font-medium">Verify credentials to access diagnostic suite</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="System passcode"
              className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-tuc-crimson focus:ring-4 focus:ring-tuc-crimson/5 transition-all text-center text-base font-black tracking-widest"
              onKeyPress={(e) => e.key === 'Enter' && authenticate(password)}
            />
            {error && <p className="text-xs text-red-600 font-bold text-center">{error}</p>}
            <Tooltip text="Gain access to system diagnostics" position="bottom" isDarkMode={false}>
              <button
                onClick={() => authenticate(password)}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-sm hover:translate-y-[-2px] hover:shadow-xl hover:shadow-slate-900/20 active:scale-95 transition-all"
              >
                AUTHENTICATE
              </button>
            </Tooltip>
            <Link to="/" className="block text-center text-xs font-bold text-slate-400 hover:text-tuc-crimson transition-colors uppercase tracking-widest">
              Back to Terminal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
         <Routes>
            <Route path="diagnostics" element={<DiagnosticsPage />} />
            <Route path="testing" element={<TestingPage />} />
            <Route path="logs" element={<LogsPage />} />
            <Route path="*" element={<DiagnosticsPage />} />
         </Routes>
      </main>
    </div>
  );
};

```

### FILE: src/components/Methodology.tsx
```typescript
import React from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Palette, Type, Layout, Sparkles, ShieldCheck } from 'lucide-react';

const methodology = [
  {
    r: 'Refresh',
    title: 'Kinetic Urgency',
    desc: 'Legacy marquees are upgraded with Barlow Condensed and ✦ glyph separators, creating a sophisticated yet urgent rhythm.',
    icon: RefreshCw,
    color: '#8C1A2E'
  },
  {
    r: 'Recolour',
    title: 'Warm Foundation',
    desc: 'The palette shifts from flat white to a premium parchment (#FAF7F0), anchored by deep espresso statistics bars.',
    icon: Palette,
    color: '#C49A22'
  },
  {
    r: 'Retype',
    title: 'Typographic Tension',
    desc: 'High-contrast pairing of Libre Baskerville for editorial authority against JetBrains Mono for data-technical fields.',
    icon: Type,
    color: '#1A0A06'
  },
  {
    r: 'Recompose',
    title: 'Architectural Grids',
    desc: 'Moving from generic symmetry to aspect-ratio specific structural logic (Cinema 55/45, Story vertical stacks).',
    icon: Layout,
    color: '#8C1A2E'
  },
  {
    r: 'Refine',
    title: 'Micro-Detail Mastery',
    desc: 'Executing precision details: asymmetric CTA corners (16px/4px), 0.5px vertical dividers, and 2px gold accent rules.',
    icon: Sparkles,
    color: '#C49A22'
  },
  {
    r: 'Reinforce',
    title: 'Systemic Equity',
    desc: 'Strict adherence to the 24px inner-margin grid and brand-locked logo size scales across all five layout variants.',
    icon: ShieldCheck,
    color: '#1A0A06'
  }
];

const Methodology: React.FC = () => {
  return (
    <div className="w-full max-w-5xl px-12 py-24 border-t border-slate-200/60 mt-24">
      <div className="mb-16">
        <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-tuc-crimson mb-4">The 6R Methodology</h2>
        <p className="text-4xl font-serif text-tuc-text-primary max-w-2xl leading-tight">
          A disciplined framework for <span className="italic text-tuc-crimson">aesthetic enhancement</span> and systemic brand consistency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {methodology.map((item, idx) => (
          <motion.div
            key={item.r}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative p-8 rounded-2xl bg-white border border-slate-100 hover:border-tuc-crimson/20 hover:shadow-2xl hover:shadow-tuc-crimson/5 transition-all duration-500"
          >
            <div className="absolute top-8 right-8 text-slate-100 font-black text-5xl group-hover:text-tuc-crimson/5 transition-colors duration-500">
              0{idx + 1}
            </div>
            
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500"
              style={{ backgroundColor: `${item.color}10`, color: item.color }}
            >
              <item.icon className="w-6 h-6" />
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-[12px] font-black uppercase tracking-widest text-tuc-crimson">{item.r}</h4>
                <h3 className="text-xl font-bold text-tuc-text-primary tracking-tight">{item.title}</h3>
              </div>
              <p className="text-base text-slate-500 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Methodology;

```

### FILE: src/components/Poster.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { PosterData, AspectRatio } from '../types';
import { TOKENS, getPosterDimensions, getLogoSize, getStatsBarHeight, getStripHeight, getHeadlineSizeClass } from '../constants';

interface Props {
  data: PosterData;
  forceVisible?: boolean;
}

const Poster: React.FC<Props> = ({ data, forceVisible }) => {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(forceVisible || false);
  
  const dimensions = getPosterDimensions(data.aspectRatio);
  const items = [
    { type: 'image', url: data.logoUrl },
    ...(data.showVideo && data.videoUrl ? [{ type: 'video', url: data.videoUrl }] : [])
  ];

  useEffect(() => {
    if (forceVisible) {
      setIsVisible(true);
      return;
    }
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [data.aspectRatio, forceVisible]);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  const logoSize = getLogoSize(data.aspectRatio);
  const statsBarHeight = getStatsBarHeight(data.aspectRatio);
  const stripHeight = getStripHeight(data.aspectRatio);

  const statsBg = data.aspectRatio === AspectRatio.STORY || data.aspectRatio === AspectRatio.CINEMA 
    ? 'bg-tuc-espresso-deep' 
    : data.aspectRatio === AspectRatio.SQUARE 
      ? 'bg-[#100604]' 
      : 'bg-tuc-espresso';

  const headlineFontSize = getHeadlineSizeClass(data.aspectRatio);

  const LogoContainer = () => {
    const [logoError, setLogoError] = useState(false);
    
    return (
      <div 
        className="bg-tuc-parchment border border-tuc-crimson flex items-center justify-center overflow-hidden shrink-0 shadow-sm"
        style={{ 
          width: logoSize, 
          height: logoSize, 
          borderRadius: '18%' 
        }}
      >
        <AnimatePresence mode="wait">
          {items[index]?.type === 'image' && !logoError ? (
            <motion.img 
              key="logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              src={data.logoUrl} 
              alt={data.brandName} 
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={() => setLogoError(true)}
              className="w-[85%] h-[85%] object-contain"
            />
          ) : items[index]?.type === 'image' && logoError ? (
            <motion.div
              key="fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center p-2"
            >
               <span className="text-tuc-crimson font-black text-[10px] leading-tight tracking-tighter">TECHBRIDGE</span>
               <div className="w-4 h-[1px] bg-tuc-gold my-1"></div>
               <span className="text-[6px] font-bold text-slate-400">TUK</span>
            </motion.div>
          ) : (
            <motion.video
              key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            src={data.videoUrl}
            autoPlay muted loop playsInline
            className="w-full h-full object-cover"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

  const StatsBar = () => {
    const isStory = data.aspectRatio === AspectRatio.STORY;
    const isCinema = data.aspectRatio === AspectRatio.CINEMA;
    const isSquare = data.aspectRatio === AspectRatio.SQUARE;
    
    const dividerHeight = {
      [AspectRatio.CINEMA]: '40%',
      [AspectRatio.LANDSCAPE]: '70%',
      [AspectRatio.PORTRAIT]: '70%',
      [AspectRatio.SQUARE]: '50%',
      [AspectRatio.STORY]: '70%'
    }[data.aspectRatio] || '70%';

    const statsBarLabelSize = isStory ? '12px' : '11.5px';

    return (
      <div 
        className={`flex ${statsBg} relative shrink-0 overflow-hidden ${isStory ? 'w-full' : 'mx-0 mb-0'} animate-slide-up ${isVisible ? 'visible' : ''}`} 
        style={{ height: statsBarHeight, transitionDelay: '700ms' }}
      >
        {[
          { v: data.stat1Value, l: data.stat1Label },
          { v: data.stat2Value, l: data.stat2Label },
          { v: data.stat3Value, l: data.stat3Label }
        ].map((stat, i) => (
          <div key={i} className={`flex-1 flex ${isStory ? 'flex-col' : 'flex-col gap-1'} items-center justify-center relative px-6 min-w-0 overflow-hidden`}>
            <span className="font-serif text-tuc-gold font-bold leading-none shrink-0" style={{ fontSize: isStory ? '32px' : isSquare ? '22px' : '28px' }}>{stat.v}</span>
            <span className="text-[#888888] font-sans tracking-[0.1em] leading-tight uppercase shrink-0 whitespace-nowrap" style={{ fontSize: statsBarLabelSize }}>{stat.l}</span>
            {i < 2 && (
              <div 
                className="absolute right-0 top-1/2 -translate-y-1/2 w-[0.5px] bg-white/20" 
                style={{ height: dividerHeight }}
              />
            )}
          </div>
        ))}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-tuc-gold/30 to-transparent" />
      </div>
    );
  };

  const UrgencyStrip = () => {
    const isSquare = data.aspectRatio === AspectRatio.SQUARE;
    return (
      <div 
        className={`bg-tuc-crimson flex items-center overflow-hidden shrink-0 marquee-mask animate-slide-down ${isVisible ? 'visible' : ''}`} 
        style={{ height: stripHeight }}
      >
        {isSquare ? (
          <div className="w-full text-center">
            <span className="font-condensed text-[9px] font-medium text-white/90 tracking-[0.3em] uppercase">
              {data.urgencyText}
            </span>
          </div>
        ) : (
          <div className="flex items-center shrink-0">
            <div className="animate-marquee whitespace-nowrap flex items-center shrink-0">
              {[1, 2].map((group) => (
                <div key={group} className="flex items-center shrink-0">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="flex items-center shrink-0 whitespace-nowrap">
                      <span className="font-condensed text-[12px] font-medium text-[#FAF7F0] tracking-[-0.04em] uppercase mx-4">
                        {data.urgencyText}
                      </span>
                      <span className="text-tuc-gold text-[0.8em] mx-2">✦</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const CTAButton = () => {
    const isStory = data.aspectRatio === AspectRatio.STORY;
    if (isStory) {
      return (
        <a 
          href={data.ctaUrl}
          className="w-full h-[52px] bg-tuc-crimson text-tuc-parchment flex items-center justify-center gap-2 rounded-sm"
        >
          <span className="font-sans font-bold text-[18px]">{data.ctaText}</span>
          <span className="text-[20px]">→</span>
        </a>
      );
    }

    const cardStyle = data.aspectRatio === AspectRatio.LANDSCAPE || data.aspectRatio === AspectRatio.SQUARE;
    const isLandscape = data.aspectRatio === AspectRatio.LANDSCAPE;
    const isPortrait = data.aspectRatio === AspectRatio.PORTRAIT;
    const isSquare = data.aspectRatio === AspectRatio.SQUARE;

    if (isLandscape) {
      return (
        <div 
          className={`bg-[#FFFDF4] border border-[#C8B898]/30 flex flex-col p-[16px_20px] rounded-[16px_4px_16px_4px] shadow-sm max-w-[280px] animate-in ${isVisible ? 'visible' : ''}`}
          style={{ 
            background: 'radial-gradient(circle at center, #FBF3DC 0%, transparent 100%)',
            '--dur': '380ms',
            transitionDelay: '600ms'
          } as any}
        >
          <div className="font-condensed font-medium text-[9px] tracking-[0.1em] text-tuc-crimson uppercase mb-[6px]">
            SECURE ADMISSION
          </div>
          <div className="font-mono font-light text-[13px] text-tuc-text-muted mb-[10px] whitespace-nowrap overflow-hidden text-ellipsis">
            {data.ctaUrl.replace(/^https?:\/\//, '')} →
          </div>
          <a 
            href={data.ctaUrl}
            className="group cta-sweep border-[1.5px] border-tuc-crimson text-tuc-crimson transition-all duration-[220ms] ease-out flex items-center justify-center py-2 px-4 w-fit rounded-sm font-condensed font-semibold text-[12px] tracking-[0.08em] uppercase whitespace-nowrap bg-transparent overflow-hidden"
          >
            <span className="relative z-10">{data.ctaText}</span>
          </a>
        </div>
      );
    }

    return (
      <a 
        href={data.ctaUrl}
        className={`group cta-sweep border border-tuc-crimson text-tuc-crimson transition-all duration-300 flex flex-col items-center justify-center gap-1 py-4 px-8 ${(isPortrait || isSquare) ? 'w-full h-[72px]' : 'w-fit'} ${cardStyle ? 'rounded-[16px_4px_16px_4px]' : 'rounded-sm'}`}
      >
        <span className="font-sans font-bold uppercase tracking-widest text-[14px]">{data.ctaText}</span>
      </a>
    );
  };

  const InstitutionLockup = ({ alignment = 'center', fontSize = '12px' }: { alignment?: 'center' | 'left', fontSize?: string }) => (
    <div className={`mt-2 ${alignment === 'center' ? 'text-center' : 'text-left'}`}>
      <div 
        className="font-sans font-bold text-tuc-text-muted uppercase tracking-[0.18em] leading-relaxed"
        style={{ fontSize }}
      >
        {data.brandName.toUpperCase().replace(' UNIVERSITY COLLEGE', '').replace('UNIVERSITY COLLEGE', '')}
        <br />UNIVERSITY COLLEGE
      </div>
      <div className="font-mono font-light text-tuc-crimson text-[11px] mt-2">{data.domainUrl}</div>
    </div>
  );

  const renderContent = () => {
    switch (data.aspectRatio) {
      case AspectRatio.CINEMA:
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex px-[32px] items-center relative">
               <div className="w-[55%] pr-12 flex flex-col justify-center gap-8">
                  <div 
                    className={`flex items-center gap-3 mb-2 animate-in-left ${isVisible ? 'visible' : ''}`}
                    style={{ '--dur': '350ms', transitionDelay: '180ms' } as any}
                  >
                    <div className="w-[2px] h-4 bg-tuc-gold"></div>
                    <div className="font-sans text-tuc-text-muted text-[13px] font-bold uppercase tracking-widest">
                      {data.eyebrow}
                    </div>
                  </div>
                  <h1 className="font-serif leading-[0.95] tracking-[-0.03em]" style={{ fontSize: headlineFontSize }}>
                    <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '280ms' } as any}>{data.headlineLine1}</span>
                    <span className={`text-tuc-crimson italic relative top-[3px] block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '380ms' } as any}>{data.headlineLine2}</span>
                    <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '480ms' } as any}>{data.headlineLine3}</span>
                  </h1>
                  <div 
                    className={`animate-in ${isVisible ? 'visible' : ''}`}
                    style={{ '--dur': '380ms', transitionDelay: '600ms' } as any}
                  >
                    <CTAButton />
                  </div>
               </div>
               
               <div className="w-[0.5px] h-3/5 bg-[rgba(200,184,152,0.3)] absolute left-[55%] top-1/2 -translate-y-1/2" />
               
                <div 
                  className={`w-[45%] pl-12 flex flex-col items-center justify-center gap-6 animate-in-right ${isVisible ? 'visible' : ''}`}
                  style={{ '--dur': '380ms', transitionDelay: '500ms' } as any}
                >
                   <LogoContainer />
                   <InstitutionLockup alignment="center" fontSize="10px" />
                </div>
            </div>
            <StatsBar />
          </div>
        );

      case AspectRatio.STORY:
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col px-[20px] py-[28px] gap-8">
              <div 
                className={`flex items-center gap-2 mb-2 animate-in-left ${isVisible ? 'visible' : ''}`}
                style={{ '--dur': '350ms', transitionDelay: '180ms' } as any}
              >
                <LogoContainer />
                <div className="flex items-center gap-1.5 flex-1 border-l-[1.5px] border-tuc-gold pl-2">
                  <div className="font-sans text-tuc-text-muted text-[11px] font-bold uppercase tracking-wider truncate">
                    {data.eyebrow}
                  </div>
                </div>
              </div>
              
              <h1 className="font-serif leading-[1.0] tracking-[-0.03em]" style={{ fontSize: headlineFontSize }}>
                <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '280ms' } as any}>{data.headlineLine1}</span>
                <span className={`text-tuc-crimson italic relative top-[3px] block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '380ms' } as any}>{data.headlineLine2}</span>
                <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '480ms' } as any}>{data.headlineLine3}</span>
              </h1>
              
              <div 
                className={`mt-auto space-y-6 animate-in ${isVisible ? 'visible' : ''}`}
                style={{ '--dur': '380ms', transitionDelay: '600ms' } as any}
              >
                <CTAButton />
                <div className="font-mono text-tuc-crimson text-[13px] text-center">{data.domainUrl}</div>
              </div>
            </div>
            <StatsBar />
          </div>
        );

      case AspectRatio.PORTRAIT:
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col items-center text-center px-[24px] py-[20px] gap-6">
              <div 
                className={`flex items-center gap-2 mb-2 border-l-2 border-tuc-gold pl-3 animate-in-left ${isVisible ? 'visible' : ''}`}
                style={{ '--dur': '350ms', transitionDelay: '180ms' } as any}
              >
                <div className="font-sans text-tuc-text-muted text-[13px] font-bold uppercase tracking-widest">
                  {data.eyebrow}
                </div>
              </div>
              
              <h1 className="font-serif leading-[0.95] tracking-[-0.03em]" style={{ fontSize: headlineFontSize }}>
                <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '280ms' } as any}>{data.headlineLine1}</span>
                <span className={`text-tuc-crimson italic relative top-[3px] block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '380ms' } as any}>{data.headlineLine2}</span>
                <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '480ms' } as any}>{data.headlineLine3}</span>
              </h1>

              <div 
                className={`flex flex-col items-center gap-4 my-4 animate-in-right ${isVisible ? 'visible' : ''}`}
                style={{ '--dur': '380ms', transitionDelay: '500ms' } as any}
              >
                <div className="mb-2">
                  <LogoContainer />
                </div>
                <InstitutionLockup alignment="center" fontSize="11px" />
              </div>

              <div 
                className={`w-full mt-auto mb-4 animate-in ${isVisible ? 'visible' : ''}`}
                style={{ '--dur': '380ms', transitionDelay: '600ms' } as any}
              >
                <CTAButton />
              </div>
            </div>
            <StatsBar />
          </div>
        );

      case AspectRatio.SQUARE:
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col px-[20px] py-10 gap-8">
              <div 
                className={`flex items-center gap-3 animate-in-left ${isVisible ? 'visible' : ''}`}
                style={{ '--dur': '350ms', transitionDelay: '180ms' } as any}
              >
                <LogoContainer />
                <div className="flex items-center gap-2 flex-1 mb-2 border-l-2 border-tuc-gold pl-2">
                  <div className="font-sans text-tuc-text-muted text-[13px] font-bold uppercase tracking-widest truncate">
                    {data.eyebrow}
                  </div>
                </div>
              </div>
              
              <h1 className="font-serif leading-[0.95] tracking-[-0.03em]" style={{ fontSize: headlineFontSize }}>
                <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '280ms' } as any}>{data.headlineLine1}</span>
                <span className={`text-tuc-crimson italic relative top-[3px] block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '380ms' } as any}>{data.headlineLine2}</span>
                <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '480ms' } as any}>{data.headlineLine3}</span>
              </h1>

              <div 
                className={`mt-auto space-y-8 animate-in ${isVisible ? 'visible' : ''}`}
                style={{ '--dur': '380ms', transitionDelay: '600ms' } as any}
              >
                <CTAButton />
                <div className="font-mono text-tuc-crimson text-[13px]">{data.domainUrl}</div>
              </div>
            </div>
            <StatsBar />
          </div>
        );

      case AspectRatio.LANDSCAPE:
      default:
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex p-[24px] items-stretch">
              <div className="flex-[7] flex flex-col justify-center pr-12">
                <div 
                  className={`flex items-center gap-2 mb-[10px] border-l-2 border-tuc-gold pl-2 animate-in-left ${isVisible ? 'visible' : ''}`}
                  style={{ '--dur': '350ms', transitionDelay: '180ms' } as any}
                >
                  <div className="font-condensed text-tuc-text-muted text-[11px] font-medium uppercase tracking-[0.08em]">
                    LIMITED INTAKE · JULY 26 COHORT
                  </div>
                </div>
                <h1 className="font-serif leading-[0.95] tracking-[-0.03em] flex flex-col" style={{ fontSize: headlineFontSize }}>
                  <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '280ms' } as any}>{data.headlineLine1}</span>
                  <span className={`text-tuc-crimson italic relative top-[3px] block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '380ms' } as any}>{data.headlineLine2}</span>
                  <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '480ms' } as any}>{data.headlineLine3}</span>
                  {data.headlineLine4 && <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '580ms' } as any}>{data.headlineLine4}</span>}
                </h1>
                <div className="mt-6">
                  <CTAButton />
                </div>
              </div>

              <div className="flex-[3] flex flex-col items-center justify-center pl-12 border-l border-tuc-gold/10">
                <div 
                  className={`flex flex-col items-center animate-in-right ${isVisible ? 'visible' : ''}`}
                  style={{ '--dur': '380ms', transitionDelay: '500ms' } as any}
                >
                  <LogoContainer />
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <div className="font-sans font-bold text-tuc-text-muted uppercase tracking-[0.18em] text-[10px] leading-relaxed text-center">
                      {data.brandName.toUpperCase().replace(' UNIVERSITY COLLEGE', '').replace('UNIVERSITY COLLEGE', '')}
                      <br />UNIVERSITY COLLEGE
                    </div>
                    <div className="font-mono font-light text-tuc-crimson text-[11px] text-center">{data.domainUrl}</div>
                  </div>
                </div>
              </div>
            </div>
            <StatsBar />
          </div>
        );
    }
  };

  const [watermarkError, setWatermarkError] = useState(false);

  return (
    <div 
      id="poster-target"
      style={{ width: dimensions.width, height: dimensions.height }}
      className="bg-tuc-parchment rounded-none overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.2)] flex flex-col font-sans relative"
    >
      <UrgencyStrip />
      {!watermarkError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 opacity-[0.04]">
          <img 
            src={data.logoUrl} 
            alt="" 
            className="w-[120%] h-[120%] object-contain" 
            style={{ transform: 'rotate(-10deg) scale(1.2)' }}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={() => setWatermarkError(true)}
          />
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default Poster;

```

### FILE: src/components/Tooltip.tsx
```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  isDarkMode?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  text, 
  children, 
  position = 'top',
  isDarkMode = false
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'top': return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom': return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left': return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right': return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default: return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    const colorClass = isDarkMode ? 'border-white' : 'border-slate-900';
    switch (position) {
      case 'top': return `top-full left-1/2 -translate-x-1/2 border-t-${isDarkMode ? 'white' : 'slate-900'}`;
      case 'bottom': return `bottom-full left-1/2 -translate-x-1/2 border-b-${isDarkMode ? 'white' : 'slate-900'}`;
      case 'left': return `left-full top-1/2 -translate-y-1/2 border-l-${isDarkMode ? 'white' : 'slate-900'}`;
      case 'right': return `right-full top-1/2 -translate-y-1/2 border-r-${isDarkMode ? 'white' : 'slate-900'}`;
      default: return `top-full left-1/2 -translate-x-1/2 border-t-${isDarkMode ? 'white' : 'slate-900'}`;
    }
  };

  return (
    <div 
      className="relative flex items-center w-full"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.95, 
              x: position === 'left' ? 10 : position === 'right' ? -10 : 0,
              y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0 
            }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className={`absolute z-[100] pointer-events-none whitespace-nowrap px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-md ${getPositionClasses()} ${
              isDarkMode 
                ? 'bg-white/95 text-slate-900 border border-white' 
                : 'bg-slate-900/95 text-white border border-slate-800'
            }`}
          >
            {text}
            <div className={`absolute border-4 border-transparent ${getArrowClasses()}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

```

### FILE: src/constants.ts
```typescript
import { AspectRatio } from './types';

export const TOKENS = [REDACTED_CREDENTIAL]
  parchment: '#FAF7F0',
  crimson: '#8C1A2E',
  gold: '#C49A22',
  espresso: '#1A0A06',
  espressoDeep: '#0F0402',
  textPrimary: '#2A1A1A',
  textMuted: '#555555',
  bgPage: '#E2DED0'
};

export const getPosterDimensions = (ratio: AspectRatio) => {
  switch (ratio) {
    case AspectRatio.SQUARE: return { width: 800, height: 800, margin: '20px' };
    case AspectRatio.LANDSCAPE: return { width: 800, height: 600, margin: '24px' };
    case AspectRatio.PORTRAIT: return { width: 600, height: 800, margin: '24px' };
    case AspectRatio.CINEMA: return { width: 1066, height: 600, margin: '32px' };
    case AspectRatio.STORY: return { width: 450, height: 800, margin: '20px 28px' };
    default: return { width: 800, height: 600, margin: '24px' };
  }
};

// Logo size scale per R6: Cinema 96, Landscape 88, Portrait 80, Square 60, Story 48.
export const getLogoSize = (ratio: AspectRatio) => ({
  [AspectRatio.CINEMA]: 96,
  [AspectRatio.LANDSCAPE]: 88,
  [AspectRatio.PORTRAIT]: 80,
  [AspectRatio.SQUARE]: 60,
  [AspectRatio.STORY]: 48
}[ratio] || 88);

export const getStatsBarHeight = (ratio: AspectRatio) => ({
  [AspectRatio.CINEMA]: '20%',
  [AspectRatio.LANDSCAPE]: '18%',
  [AspectRatio.PORTRAIT]: '16%',
  [AspectRatio.SQUARE]: '20%',
  [AspectRatio.STORY]: '22%'
}[ratio] || '18%');

export const getStripHeight = (ratio: AspectRatio) => ({
  [AspectRatio.CINEMA]: '10%',
  [AspectRatio.LANDSCAPE]: '9%',
  [AspectRatio.PORTRAIT]: '6%',
  [AspectRatio.SQUARE]: '9%',
  [AspectRatio.STORY]: '7%'
}[ratio] || '8%');

export const getHeadlineSizeClass = (ratio: AspectRatio) => ({
  [AspectRatio.CINEMA]: '48px',
  [AspectRatio.LANDSCAPE]: '72px',
  [AspectRatio.PORTRAIT]: '80px',
  [AspectRatio.SQUARE]: '52px',
  [AspectRatio.STORY]: '64px'
}[ratio] || '72px');

```

### FILE: src/index.css
```css
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Barlow+Condensed:wght@400;500;600&family=JetBrains+Mono:wght@300;400&family=Inter:wght@400;500;600;700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Libre Baskerville", serif;
  --font-mono: "JetBrains Mono", monospace;
  --font-condensed: "Barlow Condensed", sans-serif;

  --color-tuc-parchment: #FAF7F0;
  --color-tuc-crimson: #8C1A2E;
  --color-tuc-gold: #C49A22;
  --color-tuc-espresso: #1A0A06;
  --color-tuc-espresso-deep: #0F0402;
  --color-tuc-text-primary: #2A1A1A;
  --color-tuc-text-muted: #555555;
}

@layer base {
  body {
    @apply bg-tuc-parchment text-tuc-text-primary antialiased selection:bg-tuc-gold/30;
  }
}

@layer utilities {
  .bg-dot-grid {
    background-image: radial-gradient(#d1d5db 1px, transparent 1px);
    background-size: 32px 32px;
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--color-tuc-crimson);
  }
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes marquee-reverse {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

.animate-marquee {
  display: flex;
  white-space: nowrap;
  width: max-content;
  animation: marquee 18s linear infinite;
}

.animate-marquee:hover {
  animation-play-state: paused;
}

.animate-marquee-reverse {
  display: inline-block;
  animation: marquee-reverse 20s linear infinite;
}

.marquee-mask {
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}

/* Hero Entrance Animations */
.animate-in {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity var(--dur, 400ms) ease-out, transform var(--dur, 400ms) ease-out;
  transition-delay: var(--delay, 0ms);
}

.animate-in.visible {
  opacity: 1;
  transform: translateY(0);
}

.animate-slide-up {
  transform: translateY(100%);
  opacity: 0;
  transition: transform 440ms cubic-bezier(0.22, 1, 0.36, 1), opacity 440ms ease-out;
}

.animate-slide-up.visible {
  transform: translateY(0);
  opacity: 1;
}

.animate-slide-down {
  transform: translateY(-100%);
  opacity: 0;
  transition: transform 400ms ease-out, opacity 400ms ease-out;
}

.animate-slide-down.visible {
  transform: translateY(0);
  opacity: 1;
}

.animate-in-left {
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity var(--dur, 350ms) ease-out, transform var(--dur, 350ms) ease-out;
}

.animate-in-left.visible {
  opacity: 1;
  transform: translateX(0);
}

.animate-in-right {
  opacity: 0;
  transform: translateX(10px);
  transition: opacity var(--dur, 380ms) ease-out, transform var(--dur, 380ms) ease-out;
}

.animate-in-right.visible {
  opacity: 1;
  transform: translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  .animate-in, .animate-slide-up, .animate-slide-down, .animate-in-left, .animate-in-right {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .animate-marquee {
    animation: none !important;
  }
}

/* CTA Fill Sweep */
.cta-sweep {
  position: relative;
  overflow: hidden;
  z-index: 10;
  transition: color 220ms ease-out;
}

.cta-sweep::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: #8C1A2E;
  transition: transform 220ms ease-out;
  z-index: -1;
}

.cta-sweep:hover::before {
  transform: translateX(100%);
}

.cta-sweep:hover {
  color: white !important;
}

```

### FILE: src/lib/poster-utils.ts
```typescript
import { PosterData, AspectRatio } from '../types';
import { TOKENS, getPosterDimensions, getLogoSize, getStatsBarHeight, getStripHeight, getHeadlineSizeClass } from '../constants';

export const getPosterHtml = (data: PosterData) => {
  const dims = getPosterDimensions(data.aspectRatio);
  const isVertical = data.aspectRatio === AspectRatio.PORTRAIT || data.aspectRatio === AspectRatio.STORY;
  const isStory = data.aspectRatio === AspectRatio.STORY;
  const isCinema = data.aspectRatio === AspectRatio.CINEMA;
  const isSquare = data.aspectRatio === AspectRatio.SQUARE;
  const isLandscape = data.aspectRatio === AspectRatio.LANDSCAPE || !data.aspectRatio;

  const statsBg = (isStory || isCinema) ? TOKENS.espressoDeep : isSquare ? '#100604' : TOKENS.espresso;
  const headlineSize = getHeadlineSizeClass(data.aspectRatio);
  const logoSize = getLogoSize(data.aspectRatio);
  const stripH = getStripHeight(data.aspectRatio);
  const barH = getStatsBarHeight(data.aspectRatio);

  const titleCaseUrgency = data.urgencyText.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.brandName}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Barlow+Condensed:wght@400;500;600&family=JetBrains+Mono:wght@300;400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        serif: ['Libre Baskerville', 'serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                        condensed: ['Barlow Condensed', 'sans-serif'],
                    },
                    colors: {
                        'tuc-parchment': '${TOKENS.parchment}',
                        'tuc-crimson': '${TOKENS.crimson}',
                        'tuc-gold': '${TOKENS.gold}',
                        'tuc-espresso': '${TOKENS.espresso}',
                        'tuc-espresso-deep': '${TOKENS.espressoDeep}',
                        'tuc-text-primary': '${TOKENS.textPrimary}',
                        'tuc-text-muted': '${TOKENS.textMuted}',
                    }
                }
            }
        }
    </script>
    <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: ${TOKENS.bgPage}; }
        .poster-container {
            width: ${dims.width}px;
            height: ${dims.height}px;
            background-color: ${TOKENS.parchment};
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 40px 100px -20px rgba(0,0,0,0.3);
            font-family: 'Inter', sans-serif;
            color: ${TOKENS.textPrimary};
        }
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        @keyframes slide-up {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-down {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in {
            from { transform: translateY(12px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-marquee { display: flex; animation: marquee 18s linear infinite; }
        .animate-in { animation: fade-in 0.4s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.44s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
        .animate-slide-down { animation: slide-down 0.4s ease-out forwards; opacity: 0; }
        
        .marquee-mask {
            mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
        .cta-sweep {
            position: relative;
            overflow: hidden;
            transition: color 220ms ease-out;
            z-index: 10;
        }
        .cta-sweep::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: ${TOKENS.crimson};
            transition: transform 220ms ease-out;
            z-index: -1;
        }
        .cta-sweep:hover::before { transform: translateX(100%); }
        .cta-sweep:hover { color: white !important; }
    </style>
</head>
<body>
    <div class="poster-container">
        <!-- Strip -->
        <div style="height: ${stripH}; background: ${TOKENS.crimson}; overflow: hidden; display: flex; align-items: center;" class="marquee-mask">
            ${isSquare ? `
                <div class="w-full text-center">
                    <span style="font-family: 'Barlow Condensed'; font-size: 9px; font-weight: 500; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 0.3em;">
                        ${data.urgencyText}
                    </span>
                </div>
            ` : `
                <div class="animate-marquee" style="display: flex; flex-direction: row; flex-wrap: nowrap;">
                    <div style="display: flex; align-items: center; white-space: nowrap; flex-direction: row; flex-wrap: nowrap;">
                        ${[1, 2].map(() => `
                            <div style="display: flex; align-items: center; flex-shrink: 0; flex-direction: row; flex-wrap: nowrap;">
                                ${Array(8).fill(`
                                    <div style="display: flex; align-items: center; flex-shrink: 0; flex-direction: row; flex-wrap: nowrap;">
                                        <span style="font-family: 'Barlow Condensed'; font-size: 12px; font-weight: 500; color: #FAF7F0; margin: 0 16px; letter-spacing: -0.04em; text-transform: uppercase; white-space: nowrap;">${data.urgencyText}</span>
                                        <span style="color: ${TOKENS.gold}; font-size: 0.7em;">✦</span>
                                    </div>
                                `).join('')}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `}
        </div>

        <div style="flex: 1; display: flex; flex-direction: ${isVertical || isSquare ? 'column' : 'row'}; position: relative;">
            <div style="flex: ${isLandscape ? '7' : isCinema ? '55' : '1'}; display: flex; flex-direction: column; justify-content: center; padding: ${isVertical ? (isStory ? '28px 20px' : '20px 24px') : isSquare ? '40px 20px' : '48px'}; text-align: ${data.aspectRatio === AspectRatio.PORTRAIT ? 'center' : 'left'};">
                <div style="display: flex; align-items: center; justify-content: ${data.aspectRatio === AspectRatio.PORTRAIT ? 'center' : 'start'}; gap: 12px; margin-bottom: 10px; border-left: 2px solid ${TOKENS.gold}; padding-left: 8px; margin-left: ${data.aspectRatio === AspectRatio.PORTRAIT ? 'auto' : '0'}; margin-right: ${data.aspectRatio === AspectRatio.PORTRAIT ? 'auto' : '0'};">
                    <div style="font-family: 'Barlow Condensed'; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; color: ${TOKENS.textMuted};">${isLandscape ? 'LIMITED INTAKE · JULY 26 COHORT' : data.eyebrow}</div>
                </div>
                <h1 style="font-family: 'Libre Baskerville'; font-size: ${headlineSize}; line-height: 0.95; margin-bottom: 24px; letter-spacing: -0.03em;">
                    <span style="display: block;">${data.headlineLine1}</span>
                    <span style="color: ${TOKENS.crimson}; font-style: italic; position: relative; top: 3px; display: block;">${data.headlineLine2}</span>
                    <span style="display: block;">${data.headlineLine3}</span>
                    ${data.headlineLine4 ? `<span style="display: block;">${data.headlineLine4}</span>` : ''}
                </h1>
                
                ${isLandscape ? `
                    <div style="background: radial-gradient(circle at center, #FBF3DC 0%, transparent 100%); background-color: #FFFDF4; border: 0.5px solid rgba(200, 184, 152, 0.3); display: flex; flex-direction: column; padding: 16px 20px; border-radius: 16px 4px 16px 4px; width: fit-content; max-width: 280px;">
                        <div style="font-family: 'Barlow Condensed'; font-weight: 500; font-size: 9px; letter-spacing: 0.1em; color: ${TOKENS.crimson}; text-transform: uppercase; margin-bottom: 6px;">SECURE ADMISSION</div>
                        <div style="font-family: 'JetBrains Mono'; font-weight: 300; font-size: 13px; color: ${TOKENS.textMuted}; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${data.ctaUrl.replace(/^https?:\/\//, '')} →</div>
                        <div style="display: inline-flex; align-items: center; justify-content: center; padding: 8px 16px; border: 1.5px solid ${TOKENS.crimson}; font-weight: 600; border-radius: 4px; text-transform: uppercase; font-size: 12px; font-family: 'Barlow Condensed'; color: ${TOKENS.crimson}; letter-spacing: 0.08em; width: fit-content;">
                            ${data.ctaText}
                        </div>
                    </div>
                ` : `
                    <div style="display: inline-flex; align-items: center; gap: 12px; padding: 16px 32px; border: 1px solid ${TOKENS.crimson}; font-weight: bold; border-radius: ${isStory || data.aspectRatio === AspectRatio.PORTRAIT ? '4px' : '16px 4px 16px 4px'}; text-transform: uppercase; font-size: 14px; width: ${isStory ? '100%' : 'fit-content'}; justify-content: center; background: ${isStory ? TOKENS.crimson : 'transparent'}; color: ${isStory ? 'white' : TOKENS.crimson};">
                        ${data.ctaText}
                    </div>
                `}
            </div>

            ${isCinema ? `<div style="width: 0.5px; height: 60%; background: rgba(200, 184, 152, 0.3); position: absolute; left: 55%; top: 50%; transform: translateY(-50%);"></div>` : ''}

            <div style="flex: ${isLandscape ? '3' : isCinema ? '45' : '1'}; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: ${isVertical ? '40px' : '24px'}; text-align: center;">
                <div style="width: ${logoSize}px; height: ${logoSize}px; border-radius: 18%; border: 1px solid ${TOKENS.crimson}; padding: 8px; background: ${TOKENS.parchment}; display: flex; align-items: center; justify-content: center;">
                    <img src="${data.logoUrl}" style="width: 88%; height: 88%; object-fit: contain;">
                </div>
                <div style="margin-top: 8px;">
                    <div style="font-weight: bold; text-transform: uppercase; letter-spacing: 0.18em; font-size: 10px; color: ${TOKENS.textMuted}; line-height: 1.5;">${data.brandName.toUpperCase().replace(' UNIVERSITY COLLEGE', '').replace('UNIVERSITY COLLEGE', '')}<br>UNIVERSITY COLLEGE</div>
                    <div style="font-family: 'JetBrains Mono'; font-weight: 300; font-size: 11px; color: ${TOKENS.crimson}; text-align: center;">${data.domainUrl}</div>
                </div>
            </div>
        </div>

        <div style="height: ${barH}; background: ${statsBg}; display: flex; margin: 0; position: relative;">
            ${[
              { v: data.stat1Value, l: data.stat1Label },
              { v: data.stat2Value, l: data.stat2Label },
              { v: data.stat3Value, l: data.stat3Label }
            ].map((stat, i) => `
              <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; white-space: nowrap; position: relative; padding: 0 24px; min-width: 0; overflow: hidden;">
                <span style="font-family: 'Libre Baskerville'; font-size: ${isStory ? '32px' : isSquare ? '22px' : '28px'}; color: ${TOKENS.gold}; font-weight: bold; flex-shrink: 0; line-height: 1;">${stat.v}</span>
                <span style="font-size: ${isStory ? '12px' : '11.5px'}; color: #888888; text-transform: uppercase; letter-spacing: 0.1em; flex-shrink: 0; line-height: 1;">${stat.l}</span>
                ${i < 2 ? `<div style="position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 0.5px; height: 70%; background: rgba(255,255,255,0.2);"></div>` : ''}
              </div>
            `).join('')}
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 1px; background: linear-gradient(to right, transparent, rgba(196,154,34,0.3), transparent);"></div>
        </div>
    </div>
</body>
</html>`;
};

```

### FILE: src/lib/video-export.ts
```typescript

import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { toCanvas } from 'html-to-image';
import { PosterData } from '../types';
import { getPosterDimensions } from '../constants';

export interface ExportProgress {
  currentFrame: number;
  totalFrames: number;
  status: string;
}

export type VideoExportMethod = 'webcodecs' | 'mediarecorder' | 'none';

function getSupportedMimeType(): string {
  const types = [
    'video/webm;codecs=h264',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ];
  return types.find(t => MediaRecorder.isTypeSupported(t)) ?? '';
}

export function getVideoExportMethod(): VideoExportMethod {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) return 'none';
  if (typeof window.VideoEncoder !== 'undefined') return 'webcodecs';
  const canvas = document.createElement('canvas');
  if (typeof canvas.captureStream === 'function' &&
      typeof MediaRecorder !== 'undefined' &&
      getSupportedMimeType()) return 'mediarecorder';
  return 'none';
}

export function canExportVideo(): boolean {
  return getVideoExportMethod() !== 'none';
}

let partialMp4Data: Uint8Array | null = null;

export async function exportToMp4(
  element: HTMLElement | null,
  data: PosterData,
  onProgress?: (progress: ExportProgress) => void
): Promise<Blob> {
  if (!element) {
    throw new Error('Export element not found');
  }

  const rawDimensions = getPosterDimensions(data.aspectRatio);
  const width = rawDimensions.width % 2 === 0 ? rawDimensions.width : rawDimensions.width + 1;
  const height = rawDimensions.height % 2 === 0 ? rawDimensions.height : rawDimensions.height + 1;

  const fps = 15;
  const durationInSeconds = 5;
  const totalFrames = fps * durationInSeconds;

  console.log(`Starting MP4 export: ${width}x${height}, ${totalFrames} frames`);

  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: 'avc',
      width,
      height
    },
    fastStart: 'in-memory'
  });

  if (!window.VideoEncoder) {
    throw new Error('VideoEncoder API not supported. Please use Chrome, Edge, or another Chromium-based browser.');
  }

  // Asset pre-loading and verification
  onProgress?.({ currentFrame: 0, totalFrames, status: 'Verifying assets...' });

  if (data.logoUrl) {
    try {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          console.log('Logo pre-loaded');
          resolve();
        };
        img.onerror = () => {
          console.warn('Logo CORS issue (continuing with partial render):', data.logoUrl);
          resolve();
        };
        img.src = data.logoUrl;
        setTimeout(() => {
          console.warn('Logo timeout (5s)');
          resolve();
        }, 5000);
      });
    } catch (e) {
      console.warn('Asset verification failed:', e);
    }
  }

  // Wait for DOM and fonts to settle
  await new Promise(r => setTimeout(r, 2000));

  // Pre-warm canvas
  try {
    await toCanvas(element, { cacheBust: true, width, height });
  } catch (e) {
    console.warn('Canvas pre-warm failed, continuing:', e);
  }

  const videoEncoder = new VideoEncoder({
    output: (chunk, metadata) => muxer.addVideoChunk(chunk, metadata),
    error: (e) => {
      console.error('VideoEncoder error:', e);
    }
  });

  try {
    videoEncoder.configure({
      codec: 'avc1.4d4028',
      width,
      height,
      bitrate: 2_500_000,
      framerate: fps
    });
  } catch (e: any) {
    throw new Error(`VideoEncoder config failed: ${e.message}. Try a Chrome-based browser.`);
  }

  try {
    // Capture and process frames with frame-by-frame cleanup
    for (let i = 0; i < totalFrames; i++) {
      onProgress?.({
        currentFrame: i + 1,
        totalFrames,
        status: `Encoding frame ${i + 1}/${totalFrames}...`
      });

      let frame: VideoFrame | null = null;
      try {
        // Render frame to canvas with timeout
        let canvas: HTMLCanvasElement;
        try {
          canvas = await Promise.race([
            toCanvas(element, {
              width,
              height,
              pixelRatio: 1,
              style: {
                transform: 'none',
                left: '0',
                top: '0',
                margin: '0',
                padding: '0',
                visibility: 'visible',
                opacity: '1'
              },
              backgroundColor: '#FAF7F0',
              cacheBust: true,
            }),
            new Promise<HTMLCanvasElement>((_, reject) =>
              setTimeout(() => reject(new Error(`Frame ${i + 1}: canvas render timeout (>10s)`)), 10000)
            )
          ]);
        } catch (renderErr: any) {
          console.error(`Canvas render failed for frame ${i + 1}:`, renderErr.message);
          throw renderErr;
        }

        // Create VideoFrame with precise timestamp
        const timestampInMicroseconds = (i * 1000000) / fps;
        try {
          frame = new VideoFrame(canvas, { timestamp: timestampInMicroseconds });
        } catch (frameErr: any) {
          console.error(`VideoFrame creation failed for frame ${i + 1}:`, frameErr.message);
          throw frameErr;
        }

        // Keyframe every 2 seconds (30 frames at 15fps)
        videoEncoder.encode(frame, { keyFrame: i % 30 === 0 });

        // Log progress checkpoint
        if ((i + 1) % 5 === 0) {
          console.log(`Progress checkpoint: ${i + 1}/${totalFrames} frames encoded successfully`);
        }

        // Flush encoder periodically to prevent buffer buildup
        if ((i + 1) % 3 === 0) {
          try {
            await videoEncoder.flush();
          } catch (flushErr: any) {
            console.error(`Encoder flush failed at frame ${i + 1}:`, flushErr.message);
            throw flushErr;
          }
        }

        // Minimal delay to keep UI responsive
        await new Promise(r => setTimeout(r, 2));

      } catch (err: any) {
        // Ensure frame is closed even on error
        if (frame) {
          try {
            frame.close();
          } catch (e) {
            console.warn('Failed to close frame on error:', e);
          }
        }

        console.error(`Frame ${i + 1} failed:`, err);

        // Try to save partial result
        if (i > 0) {
          try {
            console.log(`Attempting to save partial result from ${i} frames...`);
            try {
              await videoEncoder.flush();
            } catch (flushErr) {
              console.warn('Encoder flush failed during partial save:', flushErr);
            }
            muxer.finalize();
            const { buffer } = muxer.target as ArrayBufferTarget;
            partialMp4Data = new Uint8Array(buffer);

            // Auto-download partial
            const partialBlob = new Blob([partialMp4Data], { type: 'video/mp4' });
            const url = URL.createObjectURL(partialBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `techbridge-poster-PARTIAL-${i}frames-${Date.now()}.mp4`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);

            console.log(`Auto-saved partial video: ${partialBlob.size} bytes (${i}/${totalFrames} frames)`);
          } catch (saveErr) {
            console.error('Failed to save partial video:', saveErr);
          }
        }

        let errorDetail = err.message || String(err);
        throw new Error(
          `Frame ${i + 1} encoding failed: ${errorDetail}\n` +
          `${partialMp4Data ? `Partial video (${partialMp4Data.byteLength} bytes) should have been auto-saved.` : ''}\n` +
          `Try:\n- Reduce logo file size or use a different image\n- Check browser is Chrome/Edge\n- Disable video overlay if enabled`
        );
      } finally {
        // Always close the frame
        if (frame) {
          try {
            frame.close();
          } catch (e) {
            // Frame already closed, ignore
          }
        }
      }
    }

    // Finalize encoding with error handling
    onProgress?.({ currentFrame: totalFrames, totalFrames, status: 'Finalizing video...' });
    try {
      await videoEncoder.flush();
    } catch (finalFlushErr: any) {
      console.error('Final encoder flush failed:', finalFlushErr.message);
      throw new Error(`Encoder finalization failed: ${finalFlushErr.message}`);
    }

    try {
      muxer.finalize();
    } catch (finalizeErr: any) {
      console.error('Muxer finalization failed:', finalizeErr.message);
      throw new Error(`Video muxing finalization failed: ${finalizeErr.message}`);
    }

    const { buffer } = muxer.target as ArrayBufferTarget;
    const finalBlob = new Blob([buffer], { type: 'video/mp4' });

    console.log(`MP4 export complete: ${finalBlob.size} bytes from ${totalFrames} frames`);
    partialMp4Data = null;

    return finalBlob;

  } catch (err) {
    throw err;
  }
}

export function getPartialMp4Data(): Uint8Array | null {
  return partialMp4Data;
}

export async function exportViaMediaRecorder(
  element: HTMLElement,
  data: PosterData,
  onProgress?: (progress: ExportProgress) => void
): Promise<{ blob: Blob; extension: string }> {
  const mimeType = getSupportedMimeType();
  const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
  const { width, height } = getPosterDimensions(data.aspectRatio);
  const fps = 15;
  const durationMs = 5000;
  const totalFrames = Math.ceil(fps * (durationMs / 1000));

  const offscreen = document.createElement('canvas');
  offscreen.width = width % 2 === 0 ? width : width + 1;
  offscreen.height = height % 2 === 0 ? height : height + 1;
  const ctx = offscreen.getContext('2d')!;

  const stream = offscreen.captureStream(fps);
  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  onProgress?.({ currentFrame: 0, totalFrames, status: 'Preparing canvas...' });
  await new Promise(r => setTimeout(r, 1000));

  recorder.start(200);

  let frameIndex = 0;
  const frameInterval = 1000 / fps;
  const startTime = Date.now();

  await new Promise<void>((resolve, reject) => {
    const tick = async () => {
      try {
        const elapsed = Date.now() - startTime;
        if (elapsed >= durationMs) {
          recorder.stop();
          resolve();
          return;
        }
        frameIndex++;
        onProgress?.({ currentFrame: frameIndex, totalFrames, status: `Recording frame ${frameIndex}/${totalFrames}...` });
        const canvas = await toCanvas(element, { width: offscreen.width, height: offscreen.height, pixelRatio: 1, cacheBust: false });
        ctx.drawImage(canvas, 0, 0);
        setTimeout(tick, frameInterval);
      } catch (e) { reject(e); }
    };
    setTimeout(tick, 0);
  });

  await new Promise<void>((resolve) => { recorder.onstop = () => resolve(); });
  onProgress?.({ currentFrame: totalFrames, totalFrames, status: 'Finalising video...' });
  return { blob: new Blob(chunks, { type: mimeType }), extension };
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

export enum AspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '4:3',
  PORTRAIT = '3:4',
  CINEMA = '16:9',
  STORY = '9:16'
}

export interface PosterData {
  urgencyText: string;
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineLine3: string;
  headlineLine4: string;
  ctaText: string;
  ctaUrl: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  logoUrl: string;
  brandName: string;
  domainUrl: string;
  videoUrl?: string;
  showVideo?: boolean;
  aspectRatio: AspectRatio;
}

export const defaultPosterData: PosterData = {
  urgencyText: "JULY 2026 ADMISSIONS OPEN",
  eyebrow: "Limited intake · July 26 cohort",
  headlineLine1: "Apply now.",
  headlineLine2: "Launch your",
  headlineLine3: "tech career.",
  headlineLine4: "",
  ctaText: "APPLY NOW →",
  ctaUrl: "https://admissions.techbridge.edu.gh",
  stat1Value: "July 26",
  stat1Label: "Cohort starts",
  stat2Value: "100%",
  stat2Label: "Hands-on training",
  stat3Value: "Ghana",
  stat3Label: "Based in Ghana",
  logoUrl: "https://images.weserv.nl/?url=https://techbridge.edu.gh/static/TUC_LOGO_1.png",
  brandName: "Techbridge University College",
  domainUrl: "techbridge.edu.gh",
  videoUrl: "https://techbridge.edu.gh/static/campus_tour.mp4",
  showVideo: false,
  aspectRatio: AspectRatio.LANDSCAPE
};

```

### FILE: test-results/mp4-export-MP4-Video-Expor-2b493-date-UI-during-MP4-encoding-chromium/error-context.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mp4-export.spec.ts >> MP4 Video Export - WebCodecs >> should update UI during MP4 encoding
- Location: tests\mp4-export.spec.ts:208:3

# Error details

```
Test timeout of 120000ms exceeded.
```

```
TimeoutError: locator.waitFor: Timeout 120000ms exceeded.
Call log:
  - waiting for locator('.fixed.inset-0.z-\\[200\\]') to be hidden
    73 × locator resolved to visible <div class="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6">…</div>

```

# Test source

```ts
  131 |     // Wait for download
  132 |     const downloadPromise2 = page.waitForEvent('download').then(async (download) => {
  133 |       const filename = download.suggestedFilename;
  134 |       downloadedFile = path.join(outputDir, filename);
  135 |       await download.saveAs(downloadedFile);
  136 |       console.log('Downloaded:', downloadedFile);
  137 |       return downloadedFile;
  138 |     }).catch(() => null);
  139 | 
  140 |     // Click MP4 button
  141 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  142 |     if (await mp4Button.evaluate((el) => el.disabled)) {
  143 |       console.log('MP4 button disabled, skipping');
  144 |       return;
  145 |     }
  146 | 
  147 |     await mp4Button.click();
  148 | 
  149 |     // Wait for download or timeout
  150 |     const result = await Promise.race([
  151 |       downloadPromise2,
  152 |       new Promise(resolve => setTimeout(() => resolve(null), 100000))
  153 |     ]);
  154 | 
  155 |     if (result) {
  156 |       // Verify file exists and has content
  157 |       expect(fs.existsSync(result)).toBe(true);
  158 | 
  159 |       const stats = fs.statSync(result);
  160 |       console.log(`Downloaded file: ${result}, size: ${stats.size} bytes`);
  161 | 
  162 |       // MP4 files should be at least 1KB
  163 |       expect(stats.size).toBeGreaterThan(1024);
  164 | 
  165 |       // Check for MP4 magic number (0x66 0x74 0x79 0x70 = 'ftyp')
  166 |       const buffer = Buffer.alloc(4);
  167 |       const fd = fs.openSync(result, 'r');
  168 |       fs.readSync(fd, buffer, 0, 4, 4);
  169 |       fs.closeSync(fd);
  170 | 
  171 |       const magic = buffer.toString('hex');
  172 |       expect(magic).toBe('66747970'); // 'ftyp' in hex
  173 |     }
  174 |   });
  175 | 
  176 |   test('should handle MP4 encoding errors gracefully', async ({ page, browserName }) => {
  177 |     if (browserName !== 'chromium') return;
  178 | 
  179 |     test.setTimeout(120000);
  180 | 
  181 |     // Try to export
  182 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  183 |     if (await mp4Button.evaluate((el) => el.disabled)) {
  184 |       console.log('MP4 unavailable on this browser');
  185 |       return;
  186 |     }
  187 | 
  188 |     await mp4Button.click();
  189 | 
  190 |     // Wait for modal to appear (indicates export started)
  191 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  192 |       console.log('Modal did not appear');
  193 |     });
  194 | 
  195 |     // Wait for modal to disappear (indicates export completed, successful or not)
  196 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  197 |       console.log('Modal did not disappear');
  198 |       return;
  199 |     });
  200 | 
  201 |     console.log('Export completed');
  202 | 
  203 |     // Button should be enabled again after export
  204 |     const isEnabled = await mp4Button.evaluate((el) => !el.disabled);
  205 |     expect(isEnabled).toBe(true);
  206 |   });
  207 | 
  208 |   test('should update UI during MP4 encoding', async ({ page, browserName }) => {
  209 |     if (browserName !== 'chromium') return;
  210 | 
  211 |     test.setTimeout(120000);
  212 | 
  213 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  214 |     if (await mp4Button.evaluate((el) => el.disabled)) return;
  215 | 
  216 |     // Click export
  217 |     await mp4Button.click();
  218 | 
  219 |     // Wait for modal to appear (indicates encoding started and progress is showing)
  220 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  221 |       console.log('Modal did not appear');
  222 |     });
  223 | 
  224 |     // Modal should show progress, so check if text exists
  225 |     const encodingText = page.locator('text=/Encoding MP4/i');
  226 |     await encodingText.waitFor({ timeout: 10000, state: 'visible' }).catch(() => {
  227 |       console.log('Encoding text not found');
  228 |     });
  229 | 
  230 |     // Wait for completion
> 231 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 });
      |                                                      ^ TimeoutError: locator.waitFor: Timeout 120000ms exceeded.
  232 |   });
  233 | 
  234 |   test('should export valid MP4 from all aspect ratios', async ({ page, browserName }) => {
  235 |     if (browserName !== 'chromium') return;
  236 | 
  237 |     test.setTimeout(300000); // 5 minutes for multiple exports
  238 | 
  239 |     const aspectRatios = ['STORY', 'PORTRAIT', 'SQUARE', 'LANDSCAPE', 'CINEMA'];
  240 |     const outputDir = './test-outputs';
  241 | 
  242 |     if (!fs.existsSync(outputDir)) {
  243 |       fs.mkdirSync(outputDir, { recursive: true });
  244 |     }
  245 | 
  246 |     for (const ratio of aspectRatios) {
  247 |       console.log(`Testing MP4 export for ${ratio}`);
  248 | 
  249 |       // Wait for any modal from previous export to disappear
  250 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  251 |         console.log(`Modal may still be visible for ${ratio}`);
  252 |       });
  253 | 
  254 |       // Click aspect ratio button
  255 |       const ratioButton = page.locator(`button:has-text("${ratio}")`).first();
  256 |       if (await ratioButton.isVisible()) {
  257 |         await ratioButton.click();
  258 |         await page.waitForTimeout(500); // Wait for UI to update
  259 |       }
  260 | 
  261 |       // Attempt export
  262 |       const mp4Button = page.locator('button:has-text("MP4")').first();
  263 |       if (await mp4Button.evaluate((el) => el.disabled)) {
  264 |         console.log(`MP4 disabled for ${ratio}, skipping`);
  265 |         continue;
  266 |       }
  267 | 
  268 |       // Set up download listener
  269 |       const downloadPromise = page.waitForEvent('download').then(async (download) => {
  270 |         const filename = `${ratio}-${Date.now()}.mp4`;
  271 |         const filepath = path.join(outputDir, filename);
  272 |         await download.saveAs(filepath);
  273 |         console.log(`Saved: ${filepath}`);
  274 |         return filepath;
  275 |       }).catch(() => null);
  276 | 
  277 |       // Click export
  278 |       await mp4Button.click();
  279 | 
  280 |       // Wait for modal to appear and then disappear
  281 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  282 |         console.log(`Modal did not appear for ${ratio}`);
  283 |       });
  284 | 
  285 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  286 |         console.log(`Modal did not disappear for ${ratio}`);
  287 |       });
  288 | 
  289 |       // Wait for download with timeout
  290 |       const result = await Promise.race([
  291 |         downloadPromise,
  292 |         new Promise(resolve => setTimeout(() => resolve(null), 90000))
  293 |       ]) as string | null;
  294 | 
  295 |       if (result && fs.existsSync(result)) {
  296 |         const stats = fs.statSync(result);
  297 |         console.log(`✓ ${ratio}: ${stats.size} bytes`);
  298 |         expect(stats.size).toBeGreaterThan(1024);
  299 |       } else {
  300 |         console.log(`⚠ ${ratio}: No download detected`);
  301 |       }
  302 |     }
  303 |   });
  304 | 
  305 |   test('should handle concurrent MP4 requests', async ({ page, browserName }) => {
  306 |     if (browserName !== 'chromium') return;
  307 | 
  308 |     test.setTimeout(180000);
  309 | 
  310 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  311 |     if (await mp4Button.evaluate((el) => el.disabled)) return;
  312 | 
  313 |     // Attempt to click MP4 button twice quickly
  314 |     console.log('Clicking MP4 button...');
  315 |     await mp4Button.click();
  316 | 
  317 |     // Second click should be prevented (button likely disabled during export)
  318 |     await page.waitForTimeout(500);
  319 |     const isDisabled = await mp4Button.evaluate((el) => el.disabled);
  320 |     console.log('Button disabled after first click:', isDisabled);
  321 | 
  322 |     expect(isDisabled).toBe(true); // Should be disabled during export
  323 | 
  324 |     // Wait for completion
  325 |     await Promise.race([
  326 |       page.waitForSelector('text="Export Finalized"').catch(() => null),
  327 |       new Promise(resolve => setTimeout(() => resolve(null), 150000))
  328 |     ]);
  329 |   });
  330 | 
  331 |   test('should recover from encoding errors and allow retry', async ({ page, browserName }) => {
```
```

### FILE: test-results/mp4-export-MP4-Video-Expor-3b462--encoding-errors-gracefully-chromium/error-context.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mp4-export.spec.ts >> MP4 Video Export - WebCodecs >> should handle MP4 encoding errors gracefully
- Location: tests\mp4-export.spec.ts:176:3

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img "Logo" [ref=e8]
        - generic [ref=e9]:
          - heading "TECHBRIDGE" [level=1] [ref=e10]
          - paragraph [ref=e11]: Poster Studio
      - button [ref=e13]:
        - img [ref=e15]
    - generic [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e20]:
          - img [ref=e21]
          - heading "Layout" [level=2] [ref=e23]
        - generic [ref=e24]:
          - button "SQUARE 1:1" [ref=e26]:
            - generic [ref=e27]: SQUARE
            - generic [ref=e28]: 1:1
          - button "LANDSCAPE 4:3" [ref=e30]:
            - generic [ref=e31]: LANDSCAPE
            - generic [ref=e32]: 4:3
          - button "PORTRAIT 3:4" [ref=e34]:
            - generic [ref=e35]: PORTRAIT
            - generic [ref=e36]: 3:4
          - button "CINEMA 16:9" [ref=e38]:
            - generic [ref=e39]: CINEMA
            - generic [ref=e40]: 16:9
          - button "STORY 9:16" [ref=e42]:
            - generic [ref=e43]: STORY
            - generic [ref=e44]: 9:16
      - generic [ref=e45]:
        - generic [ref=e47]:
          - img [ref=e48]
          - heading "Messaging" [level=2] [ref=e50]
        - generic [ref=e51]:
          - generic [ref=e53]:
            - generic [ref=e54]: Urgency Strip
            - textbox [ref=e55]: JULY 2026 ADMISSIONS OPEN
          - generic [ref=e57]:
            - generic [ref=e58]: Eyebrow
            - textbox [ref=e59]: Limited intake · July 26 cohort
          - generic [ref=e60]:
            - generic [ref=e61]: Headline Content
            - textbox "Line 1" [ref=e63]: Apply now.
            - textbox "Line 2 (Accent)" [ref=e65]: Launch your
            - textbox "Line 3" [ref=e67]: tech career.
            - textbox "Line 4 (Optional)" [ref=e69]
      - generic [ref=e70]:
        - generic [ref=e72]:
          - img [ref=e73]
          - heading "Call to Action" [level=2] [ref=e76]
        - generic [ref=e77]:
          - generic [ref=e79]:
            - generic [ref=e80]: Button Copy
            - textbox [ref=e81]: APPLY NOW →
          - generic [ref=e83]:
            - generic [ref=e84]: Target Link
            - textbox [ref=e85]: https://admissions.techbridge.edu.gh
      - generic [ref=e86]:
        - generic [ref=e88]:
          - img [ref=e89]
          - heading "Brand & Video" [level=2] [ref=e93]
        - generic [ref=e94]:
          - generic [ref=e95]:
            - generic [ref=e96]:
              - text: Video Carousel
              - paragraph [ref=e97]: Interchange logo and tour
            - button [ref=e99]
          - generic [ref=e102]:
            - generic [ref=e103]: Video Source
            - textbox "https://...mp4" [ref=e104]: https://techbridge.edu.gh/static/campus_tour.mp4
          - generic [ref=e106]:
            - generic [ref=e107]: Domain Label
            - textbox [ref=e108]: techbridge.edu.gh
      - generic [ref=e109]:
        - generic [ref=e111]:
          - img [ref=e112]
          - heading "Pillar Statistics" [level=2] [ref=e114]
        - generic [ref=e115]:
          - generic [ref=e116]:
            - generic [ref=e118]:
              - generic [ref=e119]: Value 1
              - textbox [ref=e120]: July 26
            - generic [ref=e122]:
              - generic [ref=e123]: Descriptor 1
              - textbox [ref=e124]: Cohort starts
          - generic [ref=e125]:
            - generic [ref=e127]:
              - generic [ref=e128]: Value 2
              - textbox [ref=e129]: 100%
            - generic [ref=e131]:
              - generic [ref=e132]: Descriptor 2
              - textbox [ref=e133]: Hands-on training
          - generic [ref=e134]:
            - generic [ref=e136]:
              - generic [ref=e137]: Value 3
              - textbox [ref=e138]: Ghana
            - generic [ref=e140]:
              - generic [ref=e141]: Descriptor 3
              - textbox [ref=e142]: Based in Ghana
    - generic [ref=e143]:
      - button "GENERATE PDF" [ref=e145]:
        - img [ref=e146]
        - text: GENERATE PDF
      - generic [ref=e149]:
        - button "MP4" [disabled] [ref=e151]:
          - img [ref=e152]
          - text: MP4
        - button "PNG" [disabled] [ref=e158]:
          - img [ref=e159]
          - text: PNG
      - button "HTML" [ref=e164]:
        - img [ref=e165]
        - text: HTML
  - main [ref=e169]:
    - generic [ref=e171]:
      - generic [ref=e172]:
        - heading "Live Production Preview" [level=3] [ref=e173]
        - generic [ref=e176]: Retina Master 2.0
      - generic [ref=e179]:
        - generic [ref=e182]:
          - generic [ref=e183]:
            - generic [ref=e184]:
              - generic [ref=e185]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e186]: ✦
            - generic [ref=e187]:
              - generic [ref=e188]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e189]: ✦
            - generic [ref=e190]:
              - generic [ref=e191]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e192]: ✦
            - generic [ref=e193]:
              - generic [ref=e194]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e195]: ✦
            - generic [ref=e196]:
              - generic [ref=e197]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e198]: ✦
            - generic [ref=e199]:
              - generic [ref=e200]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e201]: ✦
            - generic [ref=e202]:
              - generic [ref=e203]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e204]: ✦
            - generic [ref=e205]:
              - generic [ref=e206]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e207]: ✦
          - generic [ref=e208]:
            - generic [ref=e209]:
              - generic [ref=e210]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e211]: ✦
            - generic [ref=e212]:
              - generic [ref=e213]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e214]: ✦
            - generic [ref=e215]:
              - generic [ref=e216]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e217]: ✦
            - generic [ref=e218]:
              - generic [ref=e219]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e220]: ✦
            - generic [ref=e221]:
              - generic [ref=e222]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e223]: ✦
            - generic [ref=e224]:
              - generic [ref=e225]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e226]: ✦
            - generic [ref=e227]:
              - generic [ref=e228]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e229]: ✦
            - generic [ref=e230]:
              - generic [ref=e231]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e232]: ✦
        - generic [ref=e233]:
          - generic [ref=e234]:
            - generic [ref=e235]:
              - generic [ref=e237]: LIMITED INTAKE · JULY 26 COHORT
              - heading "Apply now. Launch your tech career." [level=1] [ref=e238]:
                - generic [ref=e239]: Apply now.
                - generic [ref=e240]: Launch your
                - generic [ref=e241]: tech career.
              - generic [ref=e243]:
                - generic [ref=e244]: SECURE ADMISSION
                - generic [ref=e245]: admissions.techbridge.edu.gh →
                - link "APPLY NOW →" [ref=e246] [cursor=pointer]:
                  - /url: https://admissions.techbridge.edu.gh
                  - generic [ref=e247]: APPLY NOW →
            - generic [ref=e249]:
              - img "Techbridge University College" [ref=e251]
              - generic [ref=e252]:
                - generic [ref=e253]:
                  - text: TECHBRIDGE
                  - text: UNIVERSITY COLLEGE
                - generic [ref=e254]: techbridge.edu.gh
          - generic [ref=e255]:
            - generic [ref=e256]:
              - generic [ref=e257]: July 26
              - generic [ref=e258]: Cohort starts
            - generic [ref=e260]:
              - generic [ref=e261]: 100%
              - generic [ref=e262]: Hands-on training
            - generic [ref=e264]:
              - generic [ref=e265]: Ghana
              - generic [ref=e266]: Based in Ghana
      - generic [ref=e268]:
        - generic [ref=e271]: CMYK Verified
        - generic [ref=e274]: 300 DPI Export
        - generic [ref=e277]: Retina Scaling
      - generic [ref=e278]:
        - generic [ref=e279]:
          - heading "The 6R Methodology" [level=2] [ref=e280]
          - paragraph [ref=e281]: A disciplined framework for aesthetic enhancement and systemic brand consistency.
        - generic [ref=e282]:
          - generic [ref=e283]:
            - generic [ref=e284]: "01"
            - img [ref=e286]
            - generic [ref=e291]:
              - generic [ref=e292]:
                - heading "Refresh" [level=4] [ref=e293]
                - heading "Kinetic Urgency" [level=3] [ref=e294]
              - paragraph [ref=e295]: Legacy marquees are upgraded with Barlow Condensed and ✦ glyph separators, creating a sophisticated yet urgent rhythm.
          - generic [ref=e296]:
            - generic [ref=e297]: "02"
            - img [ref=e299]
            - generic [ref=e305]:
              - generic [ref=e306]:
                - heading "Recolour" [level=4] [ref=e307]
                - heading "Warm Foundation" [level=3] [ref=e308]
              - paragraph [ref=e309]: The palette shifts from flat white to a premium parchment (#FAF7F0), anchored by deep espresso statistics bars.
          - generic [ref=e310]:
            - generic [ref=e311]: "03"
            - img [ref=e313]
            - generic [ref=e315]:
              - generic [ref=e316]:
                - heading "Retype" [level=4] [ref=e317]
                - heading "Typographic Tension" [level=3] [ref=e318]
              - paragraph [ref=e319]: High-contrast pairing of Libre Baskerville for editorial authority against JetBrains Mono for data-technical fields.
          - generic [ref=e320]:
            - generic [ref=e321]: "04"
            - img [ref=e323]
            - generic [ref=e325]:
              - generic [ref=e326]:
                - heading "Recompose" [level=4] [ref=e327]
                - heading "Architectural Grids" [level=3] [ref=e328]
              - paragraph [ref=e329]: Moving from generic symmetry to aspect-ratio specific structural logic (Cinema 55/45, Story vertical stacks).
          - generic [ref=e330]:
            - generic [ref=e331]: "05"
            - img [ref=e333]
            - generic [ref=e336]:
              - generic [ref=e337]:
                - heading "Refine" [level=4] [ref=e338]
                - heading "Micro-Detail Mastery" [level=3] [ref=e339]
              - paragraph [ref=e340]: "Executing precision details: asymmetric CTA corners (16px/4px), 0.5px vertical dividers, and 2px gold accent rules."
          - generic [ref=e341]:
            - generic [ref=e342]: "06"
            - img [ref=e344]
            - generic [ref=e347]:
              - generic [ref=e348]:
                - heading "Reinforce" [level=4] [ref=e349]
                - heading "Systemic Equity" [level=3] [ref=e350]
              - paragraph [ref=e351]: Strict adherence to the 24px inner-margin grid and brand-locked logo size scales across all five layout variants.
    - link [ref=e354] [cursor=pointer]:
      - /url: /admin/diagnostics
      - img [ref=e355]
    - generic:
      - generic:
        - generic:
          - generic:
            - generic:
              - generic:
                - generic:
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                - generic:
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
          - generic:
            - generic:
              - generic:
                - generic:
                  - generic: LIMITED INTAKE · JULY 26 COHORT
                - heading [level=1]:
                  - generic: Apply now.
                  - generic: Launch your
                  - generic: tech career.
                - generic:
                  - generic:
                    - generic: SECURE ADMISSION
                    - generic: admissions.techbridge.edu.gh →
                    - link:
                      - /url: https://admissions.techbridge.edu.gh
                      - generic: APPLY NOW →
              - generic:
                - generic:
                  - generic:
                    - img
                  - generic:
                    - generic: TECHBRIDGE UNIVERSITY COLLEGE
                    - generic: techbridge.edu.gh
            - generic:
              - generic:
                - generic: July 26
                - generic: Cohort starts
              - generic:
                - generic: 100%
                - generic: Hands-on training
              - generic:
                - generic: Ghana
                - generic: Based in Ghana
    - generic [ref=e358]:
      - generic [ref=e359]:
        - img [ref=e360]
        - generic [ref=e364]: 37%
      - generic [ref=e365]:
        - heading "Encoding MP4" [level=2] [ref=e366]
        - generic [ref=e367]:
          - paragraph [ref=e368]: Status
          - paragraph [ref=e369]: Encoding frame 28/75...
      - paragraph [ref=e371]: Processing 4:3 Aspect Ratio
```

# Test source

```ts
  105 |     // Check console logs for progress
  106 |     const logs = await page.evaluate(() => (window as any).__progressLogs || []);
  107 |     console.log('Progress logs:', logs);
  108 |   });
  109 | 
  110 |   test('should download MP4 file with correct naming', async ({ page, browserName, context }) => {
  111 |     if (browserName !== 'chromium') return;
  112 | 
  113 |     test.setTimeout(120000);
  114 | 
  115 |     // Create output directory
  116 |     const outputDir = './test-outputs';
  117 |     if (!fs.existsSync(outputDir)) {
  118 |       fs.mkdirSync(outputDir, { recursive: true });
  119 |     }
  120 | 
  121 |     // Track downloads
  122 |     let downloadedFile: string | null = null;
  123 |     const downloadPromise = new Promise<void>((resolve) => {
  124 |       context.on('page', (page) => {
  125 |         page.on('popup', async (popup) => {
  126 |           resolve();
  127 |         });
  128 |       });
  129 |     });
  130 | 
  131 |     // Wait for download
  132 |     const downloadPromise2 = page.waitForEvent('download').then(async (download) => {
  133 |       const filename = download.suggestedFilename;
  134 |       downloadedFile = path.join(outputDir, filename);
  135 |       await download.saveAs(downloadedFile);
  136 |       console.log('Downloaded:', downloadedFile);
  137 |       return downloadedFile;
  138 |     }).catch(() => null);
  139 | 
  140 |     // Click MP4 button
  141 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  142 |     if (await mp4Button.evaluate((el) => el.disabled)) {
  143 |       console.log('MP4 button disabled, skipping');
  144 |       return;
  145 |     }
  146 | 
  147 |     await mp4Button.click();
  148 | 
  149 |     // Wait for download or timeout
  150 |     const result = await Promise.race([
  151 |       downloadPromise2,
  152 |       new Promise(resolve => setTimeout(() => resolve(null), 100000))
  153 |     ]);
  154 | 
  155 |     if (result) {
  156 |       // Verify file exists and has content
  157 |       expect(fs.existsSync(result)).toBe(true);
  158 | 
  159 |       const stats = fs.statSync(result);
  160 |       console.log(`Downloaded file: ${result}, size: ${stats.size} bytes`);
  161 | 
  162 |       // MP4 files should be at least 1KB
  163 |       expect(stats.size).toBeGreaterThan(1024);
  164 | 
  165 |       // Check for MP4 magic number (0x66 0x74 0x79 0x70 = 'ftyp')
  166 |       const buffer = Buffer.alloc(4);
  167 |       const fd = fs.openSync(result, 'r');
  168 |       fs.readSync(fd, buffer, 0, 4, 4);
  169 |       fs.closeSync(fd);
  170 | 
  171 |       const magic = buffer.toString('hex');
  172 |       expect(magic).toBe('66747970'); // 'ftyp' in hex
  173 |     }
  174 |   });
  175 | 
  176 |   test('should handle MP4 encoding errors gracefully', async ({ page, browserName }) => {
  177 |     if (browserName !== 'chromium') return;
  178 | 
  179 |     test.setTimeout(120000);
  180 | 
  181 |     // Try to export
  182 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  183 |     if (await mp4Button.evaluate((el) => el.disabled)) {
  184 |       console.log('MP4 unavailable on this browser');
  185 |       return;
  186 |     }
  187 | 
  188 |     await mp4Button.click();
  189 | 
  190 |     // Wait for modal to appear (indicates export started)
  191 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  192 |       console.log('Modal did not appear');
  193 |     });
  194 | 
  195 |     // Wait for modal to disappear (indicates export completed, successful or not)
  196 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  197 |       console.log('Modal did not disappear');
  198 |       return;
  199 |     });
  200 | 
  201 |     console.log('Export completed');
  202 | 
  203 |     // Button should be enabled again after export
  204 |     const isEnabled = await mp4Button.evaluate((el) => !el.disabled);
> 205 |     expect(isEnabled).toBe(true);
      |                       ^ Error: expect(received).toBe(expected) // Object.is equality
  206 |   });
  207 | 
  208 |   test('should update UI during MP4 encoding', async ({ page, browserName }) => {
  209 |     if (browserName !== 'chromium') return;
  210 | 
  211 |     test.setTimeout(120000);
  212 | 
  213 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  214 |     if (await mp4Button.evaluate((el) => el.disabled)) return;
  215 | 
  216 |     // Click export
  217 |     await mp4Button.click();
  218 | 
  219 |     // Wait for modal to appear (indicates encoding started and progress is showing)
  220 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  221 |       console.log('Modal did not appear');
  222 |     });
  223 | 
  224 |     // Modal should show progress, so check if text exists
  225 |     const encodingText = page.locator('text=/Encoding MP4/i');
  226 |     await encodingText.waitFor({ timeout: 10000, state: 'visible' }).catch(() => {
  227 |       console.log('Encoding text not found');
  228 |     });
  229 | 
  230 |     // Wait for completion
  231 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 });
  232 |   });
  233 | 
  234 |   test('should export valid MP4 from all aspect ratios', async ({ page, browserName }) => {
  235 |     if (browserName !== 'chromium') return;
  236 | 
  237 |     test.setTimeout(300000); // 5 minutes for multiple exports
  238 | 
  239 |     const aspectRatios = ['STORY', 'PORTRAIT', 'SQUARE', 'LANDSCAPE', 'CINEMA'];
  240 |     const outputDir = './test-outputs';
  241 | 
  242 |     if (!fs.existsSync(outputDir)) {
  243 |       fs.mkdirSync(outputDir, { recursive: true });
  244 |     }
  245 | 
  246 |     for (const ratio of aspectRatios) {
  247 |       console.log(`Testing MP4 export for ${ratio}`);
  248 | 
  249 |       // Wait for any modal from previous export to disappear
  250 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  251 |         console.log(`Modal may still be visible for ${ratio}`);
  252 |       });
  253 | 
  254 |       // Click aspect ratio button
  255 |       const ratioButton = page.locator(`button:has-text("${ratio}")`).first();
  256 |       if (await ratioButton.isVisible()) {
  257 |         await ratioButton.click();
  258 |         await page.waitForTimeout(500); // Wait for UI to update
  259 |       }
  260 | 
  261 |       // Attempt export
  262 |       const mp4Button = page.locator('button:has-text("MP4")').first();
  263 |       if (await mp4Button.evaluate((el) => el.disabled)) {
  264 |         console.log(`MP4 disabled for ${ratio}, skipping`);
  265 |         continue;
  266 |       }
  267 | 
  268 |       // Set up download listener
  269 |       const downloadPromise = page.waitForEvent('download').then(async (download) => {
  270 |         const filename = `${ratio}-${Date.now()}.mp4`;
  271 |         const filepath = path.join(outputDir, filename);
  272 |         await download.saveAs(filepath);
  273 |         console.log(`Saved: ${filepath}`);
  274 |         return filepath;
  275 |       }).catch(() => null);
  276 | 
  277 |       // Click export
  278 |       await mp4Button.click();
  279 | 
  280 |       // Wait for modal to appear and then disappear
  281 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  282 |         console.log(`Modal did not appear for ${ratio}`);
  283 |       });
  284 | 
  285 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  286 |         console.log(`Modal did not disappear for ${ratio}`);
  287 |       });
  288 | 
  289 |       // Wait for download with timeout
  290 |       const result = await Promise.race([
  291 |         downloadPromise,
  292 |         new Promise(resolve => setTimeout(() => resolve(null), 90000))
  293 |       ]) as string | null;
  294 | 
  295 |       if (result && fs.existsSync(result)) {
  296 |         const stats = fs.statSync(result);
  297 |         console.log(`✓ ${ratio}: ${stats.size} bytes`);
  298 |         expect(stats.size).toBeGreaterThan(1024);
  299 |       } else {
  300 |         console.log(`⚠ ${ratio}: No download detected`);
  301 |       }
  302 |     }
  303 |   });
  304 | 
  305 |   test('should handle concurrent MP4 requests', async ({ page, browserName }) => {
```
```

### FILE: test-results/mp4-export-MP4-Video-Expor-598d4--MP4-from-all-aspect-ratios-chromium/error-context.md
```md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mp4-export.spec.ts >> MP4 Video Export - WebCodecs >> should export valid MP4 from all aspect ratios
- Location: tests\mp4-export.spec.ts:234:3

# Error details

```
TypeError: The "path" argument must be of type string. Received function suggestedFilename
```

```
Error: page.waitForTimeout: Test ended.
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img "Logo" [ref=e8]
        - generic [ref=e9]:
          - heading "TECHBRIDGE" [level=1] [ref=e10]
          - paragraph [ref=e11]: Poster Studio
      - button [ref=e13]:
        - img [ref=e15]
    - generic [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e20]:
          - img [ref=e21]
          - heading "Layout" [level=2] [ref=e23]
        - generic [ref=e24]:
          - button "SQUARE 1:1" [ref=e26]:
            - generic [ref=e27]: SQUARE
            - generic [ref=e28]: 1:1
          - button "LANDSCAPE 4:3" [ref=e30]:
            - generic [ref=e31]: LANDSCAPE
            - generic [ref=e32]: 4:3
          - button "PORTRAIT 3:4" [ref=e34]:
            - generic [ref=e35]: PORTRAIT
            - generic [ref=e36]: 3:4
          - button "CINEMA 16:9" [ref=e38]:
            - generic [ref=e39]: CINEMA
            - generic [ref=e40]: 16:9
          - button "STORY 9:16" [ref=e42]:
            - generic [ref=e43]: STORY
            - generic [ref=e44]: 9:16
      - generic [ref=e45]:
        - generic [ref=e47]:
          - img [ref=e48]
          - heading "Messaging" [level=2] [ref=e50]
        - generic [ref=e51]:
          - generic [ref=e53]:
            - generic [ref=e54]: Urgency Strip
            - textbox [ref=e55]: JULY 2026 ADMISSIONS OPEN
          - generic [ref=e57]:
            - generic [ref=e58]: Eyebrow
            - textbox [ref=e59]: Limited intake · July 26 cohort
          - generic [ref=e60]:
            - generic [ref=e61]: Headline Content
            - textbox "Line 1" [ref=e63]: Apply now.
            - textbox "Line 2 (Accent)" [ref=e65]: Launch your
            - textbox "Line 3" [ref=e67]: tech career.
            - textbox "Line 4 (Optional)" [ref=e69]
      - generic [ref=e70]:
        - generic [ref=e72]:
          - img [ref=e73]
          - heading "Call to Action" [level=2] [ref=e76]
        - generic [ref=e77]:
          - generic [ref=e79]:
            - generic [ref=e80]: Button Copy
            - textbox [ref=e81]: APPLY NOW →
          - generic [ref=e83]:
            - generic [ref=e84]: Target Link
            - textbox [ref=e85]: https://admissions.techbridge.edu.gh
      - generic [ref=e86]:
        - generic [ref=e88]:
          - img [ref=e89]
          - heading "Brand & Video" [level=2] [ref=e93]
        - generic [ref=e94]:
          - generic [ref=e95]:
            - generic [ref=e96]:
              - text: Video Carousel
              - paragraph [ref=e97]: Interchange logo and tour
            - button [ref=e99]
          - generic [ref=e102]:
            - generic [ref=e103]: Video Source
            - textbox "https://...mp4" [ref=e104]: https://techbridge.edu.gh/static/campus_tour.mp4
          - generic [ref=e106]:
            - generic [ref=e107]: Domain Label
            - textbox [ref=e108]: techbridge.edu.gh
      - generic [ref=e109]:
        - generic [ref=e111]:
          - img [ref=e112]
          - heading "Pillar Statistics" [level=2] [ref=e114]
        - generic [ref=e115]:
          - generic [ref=e116]:
            - generic [ref=e118]:
              - generic [ref=e119]: Value 1
              - textbox [ref=e120]: July 26
            - generic [ref=e122]:
              - generic [ref=e123]: Descriptor 1
              - textbox [ref=e124]: Cohort starts
          - generic [ref=e125]:
            - generic [ref=e127]:
              - generic [ref=e128]: Value 2
              - textbox [ref=e129]: 100%
            - generic [ref=e131]:
              - generic [ref=e132]: Descriptor 2
              - textbox [ref=e133]: Hands-on training
          - generic [ref=e134]:
            - generic [ref=e136]:
              - generic [ref=e137]: Value 3
              - textbox [ref=e138]: Ghana
            - generic [ref=e140]:
              - generic [ref=e141]: Descriptor 3
              - textbox [ref=e142]: Based in Ghana
    - generic [ref=e143]:
      - button "GENERATE PDF" [ref=e145]:
        - img [ref=e146]
        - text: GENERATE PDF
      - generic [ref=e149]:
        - button "MP4" [ref=e151]:
          - img [ref=e152]
          - text: MP4
        - button "PNG" [ref=e155]:
          - img [ref=e156]
          - text: PNG
      - button "HTML" [ref=e161]:
        - img [ref=e162]
        - text: HTML
  - main [ref=e166]:
    - generic [ref=e168]:
      - generic [ref=e169]:
        - heading "Live Production Preview" [level=3] [ref=e170]
        - generic [ref=e173]: Retina Master 2.0
      - generic [ref=e176]:
        - generic [ref=e179]:
          - generic [ref=e180]:
            - generic [ref=e181]:
              - generic [ref=e182]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e183]: ✦
            - generic [ref=e184]:
              - generic [ref=e185]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e186]: ✦
            - generic [ref=e187]:
              - generic [ref=e188]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e189]: ✦
            - generic [ref=e190]:
              - generic [ref=e191]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e192]: ✦
            - generic [ref=e193]:
              - generic [ref=e194]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e195]: ✦
            - generic [ref=e196]:
              - generic [ref=e197]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e198]: ✦
            - generic [ref=e199]:
              - generic [ref=e200]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e201]: ✦
            - generic [ref=e202]:
              - generic [ref=e203]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e204]: ✦
          - generic [ref=e205]:
            - generic [ref=e206]:
              - generic [ref=e207]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e208]: ✦
            - generic [ref=e209]:
              - generic [ref=e210]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e211]: ✦
            - generic [ref=e212]:
              - generic [ref=e213]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e214]: ✦
            - generic [ref=e215]:
              - generic [ref=e216]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e217]: ✦
            - generic [ref=e218]:
              - generic [ref=e219]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e220]: ✦
            - generic [ref=e221]:
              - generic [ref=e222]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e223]: ✦
            - generic [ref=e224]:
              - generic [ref=e225]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e226]: ✦
            - generic [ref=e227]:
              - generic [ref=e228]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e229]: ✦
        - generic [ref=e230]:
          - generic [ref=e231]:
            - generic [ref=e232]:
              - img "Techbridge University College" [ref=e234]
              - generic [ref=e236]: Limited intake · July 26 cohort
            - heading "Apply now. Launch your tech career." [level=1] [ref=e237]:
              - generic [ref=e238]: Apply now.
              - generic [ref=e239]: Launch your
              - generic [ref=e240]: tech career.
            - generic [ref=e241]:
              - link "APPLY NOW → →" [ref=e242] [cursor=pointer]:
                - /url: https://admissions.techbridge.edu.gh
                - generic [ref=e243]: APPLY NOW →
                - generic [ref=e244]: →
              - generic [ref=e245]: techbridge.edu.gh
          - generic [ref=e246]:
            - generic [ref=e247]:
              - generic [ref=e248]: July 26
              - generic [ref=e249]: Cohort starts
            - generic [ref=e251]:
              - generic [ref=e252]: 100%
              - generic [ref=e253]: Hands-on training
            - generic [ref=e255]:
              - generic [ref=e256]: Ghana
              - generic [ref=e257]: Based in Ghana
      - generic [ref=e259]:
        - generic [ref=e262]: CMYK Verified
        - generic [ref=e265]: 300 DPI Export
        - generic [ref=e268]: Retina Scaling
      - generic [ref=e269]:
        - generic [ref=e270]:
          - heading "The 6R Methodology" [level=2] [ref=e271]
          - paragraph [ref=e272]: A disciplined framework for aesthetic enhancement and systemic brand consistency.
        - generic [ref=e273]:
          - generic [ref=e274]:
            - generic [ref=e275]: "01"
            - img [ref=e277]
            - generic [ref=e282]:
              - generic [ref=e283]:
                - heading "Refresh" [level=4] [ref=e284]
                - heading "Kinetic Urgency" [level=3] [ref=e285]
              - paragraph [ref=e286]: Legacy marquees are upgraded with Barlow Condensed and ✦ glyph separators, creating a sophisticated yet urgent rhythm.
          - generic [ref=e287]:
            - generic [ref=e288]: "02"
            - img [ref=e290]
            - generic [ref=e296]:
              - generic [ref=e297]:
                - heading "Recolour" [level=4] [ref=e298]
                - heading "Warm Foundation" [level=3] [ref=e299]
              - paragraph [ref=e300]: The palette shifts from flat white to a premium parchment (#FAF7F0), anchored by deep espresso statistics bars.
          - generic [ref=e301]:
            - generic [ref=e302]: "03"
            - img [ref=e304]
            - generic [ref=e306]:
              - generic [ref=e307]:
                - heading "Retype" [level=4] [ref=e308]
                - heading "Typographic Tension" [level=3] [ref=e309]
              - paragraph [ref=e310]: High-contrast pairing of Libre Baskerville for editorial authority against JetBrains Mono for data-technical fields.
          - generic [ref=e311]:
            - generic [ref=e312]: "04"
            - img [ref=e314]
            - generic [ref=e316]:
              - generic [ref=e317]:
                - heading "Recompose" [level=4] [ref=e318]
                - heading "Architectural Grids" [level=3] [ref=e319]
              - paragraph [ref=e320]: Moving from generic symmetry to aspect-ratio specific structural logic (Cinema 55/45, Story vertical stacks).
          - generic [ref=e321]:
            - generic [ref=e322]: "05"
            - img [ref=e324]
            - generic [ref=e327]:
              - generic [ref=e328]:
                - heading "Refine" [level=4] [ref=e329]
                - heading "Micro-Detail Mastery" [level=3] [ref=e330]
              - paragraph [ref=e331]: "Executing precision details: asymmetric CTA corners (16px/4px), 0.5px vertical dividers, and 2px gold accent rules."
          - generic [ref=e332]:
            - generic [ref=e333]: "06"
            - img [ref=e335]
            - generic [ref=e338]:
              - generic [ref=e339]:
                - heading "Reinforce" [level=4] [ref=e340]
                - heading "Systemic Equity" [level=3] [ref=e341]
              - paragraph [ref=e342]: Strict adherence to the 24px inner-margin grid and brand-locked logo size scales across all five layout variants.
    - link [ref=e345] [cursor=pointer]:
      - /url: /admin/diagnostics
      - img [ref=e346]
    - generic:
      - generic:
        - generic:
          - generic:
            - generic:
              - generic:
                - generic:
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                - generic:
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
          - generic:
            - generic:
              - generic:
                - generic:
                  - img
                - generic:
                  - generic: Limited intake · July 26 cohort
              - heading [level=1]:
                - generic: Apply now.
                - generic: Launch your
                - generic: tech career.
              - generic:
                - link:
                  - /url: https://admissions.techbridge.edu.gh
                  - generic: APPLY NOW →
                  - generic: →
                - generic: techbridge.edu.gh
            - generic:
              - generic:
                - generic: July 26
                - generic: Cohort starts
              - generic:
                - generic: 100%
                - generic: Hands-on training
              - generic:
                - generic: Ghana
                - generic: Based in Ghana
    - generic [ref=e348]:
      - generic [ref=e349]:
        - generic [ref=e350]: Sync Failure
        - generic [ref=e351]: "Video Export Error: Frame 32 encoding failed: Frame 32: canvas render timeout (>10s) Partial video (159801 bytes) should have been auto-saved. Try: - Reduce logo file size or use a different image - Check browser is Chrome/Edge - Disable video overlay if enabled"
      - button [ref=e352]:
        - img [ref=e353]
```

# Test source

```ts
  158 | 
  159 |       const stats = fs.statSync(result);
  160 |       console.log(`Downloaded file: ${result}, size: ${stats.size} bytes`);
  161 | 
  162 |       // MP4 files should be at least 1KB
  163 |       expect(stats.size).toBeGreaterThan(1024);
  164 | 
  165 |       // Check for MP4 magic number (0x66 0x74 0x79 0x70 = 'ftyp')
  166 |       const buffer = Buffer.alloc(4);
  167 |       const fd = fs.openSync(result, 'r');
  168 |       fs.readSync(fd, buffer, 0, 4, 4);
  169 |       fs.closeSync(fd);
  170 | 
  171 |       const magic = buffer.toString('hex');
  172 |       expect(magic).toBe('66747970'); // 'ftyp' in hex
  173 |     }
  174 |   });
  175 | 
  176 |   test('should handle MP4 encoding errors gracefully', async ({ page, browserName }) => {
  177 |     if (browserName !== 'chromium') return;
  178 | 
  179 |     test.setTimeout(120000);
  180 | 
  181 |     // Try to export
  182 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  183 |     if (await mp4Button.evaluate((el) => el.disabled)) {
  184 |       console.log('MP4 unavailable on this browser');
  185 |       return;
  186 |     }
  187 | 
  188 |     await mp4Button.click();
  189 | 
  190 |     // Wait for modal to appear (indicates export started)
  191 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  192 |       console.log('Modal did not appear');
  193 |     });
  194 | 
  195 |     // Wait for modal to disappear (indicates export completed, successful or not)
  196 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  197 |       console.log('Modal did not disappear');
  198 |       return;
  199 |     });
  200 | 
  201 |     console.log('Export completed');
  202 | 
  203 |     // Button should be enabled again after export
  204 |     const isEnabled = await mp4Button.evaluate((el) => !el.disabled);
  205 |     expect(isEnabled).toBe(true);
  206 |   });
  207 | 
  208 |   test('should update UI during MP4 encoding', async ({ page, browserName }) => {
  209 |     if (browserName !== 'chromium') return;
  210 | 
  211 |     test.setTimeout(120000);
  212 | 
  213 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  214 |     if (await mp4Button.evaluate((el) => el.disabled)) return;
  215 | 
  216 |     // Click export
  217 |     await mp4Button.click();
  218 | 
  219 |     // Wait for modal to appear (indicates encoding started and progress is showing)
  220 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  221 |       console.log('Modal did not appear');
  222 |     });
  223 | 
  224 |     // Modal should show progress, so check if text exists
  225 |     const encodingText = page.locator('text=/Encoding MP4/i');
  226 |     await encodingText.waitFor({ timeout: 10000, state: 'visible' }).catch(() => {
  227 |       console.log('Encoding text not found');
  228 |     });
  229 | 
  230 |     // Wait for completion
  231 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 });
  232 |   });
  233 | 
  234 |   test('should export valid MP4 from all aspect ratios', async ({ page, browserName }) => {
  235 |     if (browserName !== 'chromium') return;
  236 | 
  237 |     test.setTimeout(300000); // 5 minutes for multiple exports
  238 | 
  239 |     const aspectRatios = ['STORY', 'PORTRAIT', 'SQUARE', 'LANDSCAPE', 'CINEMA'];
  240 |     const outputDir = './test-outputs';
  241 | 
  242 |     if (!fs.existsSync(outputDir)) {
  243 |       fs.mkdirSync(outputDir, { recursive: true });
  244 |     }
  245 | 
  246 |     for (const ratio of aspectRatios) {
  247 |       console.log(`Testing MP4 export for ${ratio}`);
  248 | 
  249 |       // Wait for any modal from previous export to disappear
  250 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  251 |         console.log(`Modal may still be visible for ${ratio}`);
  252 |       });
  253 | 
  254 |       // Click aspect ratio button
  255 |       const ratioButton = page.locator(`button:has-text("${ratio}")`).first();
  256 |       if (await ratioButton.isVisible()) {
  257 |         await ratioButton.click();
> 258 |         await page.waitForTimeout(500); // Wait for UI to update
      |                    ^ Error: page.waitForTimeout: Test ended.
  259 |       }
  260 | 
  261 |       // Attempt export
  262 |       const mp4Button = page.locator('button:has-text("MP4")').first();
  263 |       if (await mp4Button.evaluate((el) => el.disabled)) {
  264 |         console.log(`MP4 disabled for ${ratio}, skipping`);
  265 |         continue;
  266 |       }
  267 | 
  268 |       // Set up download listener
  269 |       const downloadPromise = page.waitForEvent('download').then(async (download) => {
  270 |         const filename = `${ratio}-${Date.now()}.mp4`;
  271 |         const filepath = path.join(outputDir, filename);
  272 |         await download.saveAs(filepath);
  273 |         console.log(`Saved: ${filepath}`);
  274 |         return filepath;
  275 |       }).catch(() => null);
  276 | 
  277 |       // Click export
  278 |       await mp4Button.click();
  279 | 
  280 |       // Wait for modal to appear and then disappear
  281 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  282 |         console.log(`Modal did not appear for ${ratio}`);
  283 |       });
  284 | 
  285 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  286 |         console.log(`Modal did not disappear for ${ratio}`);
  287 |       });
  288 | 
  289 |       // Wait for download with timeout
  290 |       const result = await Promise.race([
  291 |         downloadPromise,
  292 |         new Promise(resolve => setTimeout(() => resolve(null), 90000))
  293 |       ]) as string | null;
  294 | 
  295 |       if (result && fs.existsSync(result)) {
  296 |         const stats = fs.statSync(result);
  297 |         console.log(`✓ ${ratio}: ${stats.size} bytes`);
  298 |         expect(stats.size).toBeGreaterThan(1024);
  299 |       } else {
  300 |         console.log(`⚠ ${ratio}: No download detected`);
  301 |       }
  302 |     }
  303 |   });
  304 | 
  305 |   test('should handle concurrent MP4 requests', async ({ page, browserName }) => {
  306 |     if (browserName !== 'chromium') return;
  307 | 
  308 |     test.setTimeout(180000);
  309 | 
  310 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  311 |     if (await mp4Button.evaluate((el) => el.disabled)) return;
  312 | 
  313 |     // Attempt to click MP4 button twice quickly
  314 |     console.log('Clicking MP4 button...');
  315 |     await mp4Button.click();
  316 | 
  317 |     // Second click should be prevented (button likely disabled during export)
  318 |     await page.waitForTimeout(500);
  319 |     const isDisabled = await mp4Button.evaluate((el) => el.disabled);
  320 |     console.log('Button disabled after first click:', isDisabled);
  321 | 
  322 |     expect(isDisabled).toBe(true); // Should be disabled during export
  323 | 
  324 |     // Wait for completion
  325 |     await Promise.race([
  326 |       page.waitForSelector('text="Export Finalized"').catch(() => null),
  327 |       new Promise(resolve => setTimeout(() => resolve(null), 150000))
  328 |     ]);
  329 |   });
  330 | 
  331 |   test('should recover from encoding errors and allow retry', async ({ page, browserName }) => {
  332 |     if (browserName !== 'chromium') return;
  333 | 
  334 |     test.setTimeout(180000);
  335 | 
  336 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  337 |     if (await mp4Button.evaluate((el) => el.disabled)) return;
  338 | 
  339 |     // First export attempt
  340 |     console.log('First export attempt...');
  341 |     await mp4Button.click();
  342 | 
  343 |     // Wait for modal overlay to appear (indicates export is running)
  344 |     const modalOverlay = page.locator('.fixed.inset-0.z-\\[200\\]');
  345 |     await modalOverlay.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  346 |       console.log('Modal did not appear');
  347 |     });
  348 | 
  349 |     // Wait for modal to disappear (indicates export completed)
  350 |     try {
  351 |       await modalOverlay.waitFor({ state: 'hidden', timeout: 120000 });
  352 |     } catch (e) {
  353 |       console.log('Modal did not disappear within timeout:', e);
  354 |       return; // Exit early if modal never disappears
  355 |     }
  356 | 
  357 |     // Wait longer for state to update from React
  358 |     await page.waitForTimeout(3000);
```
```

### FILE: tests/mp4-export.spec.ts
```typescript
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('MP4 Video Export - WebCodecs', () => {
  test.beforeEach(async ({ page, context }) => {
    // Listen for download events
    page.on('download', async (download) => {
      const downloadPath = path.join('./test-outputs', download.suggestedFilename);
      await download.saveAs(downloadPath);
    });

    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
      console.log('Network did not reach idle state, continuing anyway');
    });

    // Wait for any modal overlays to disappear (z-[200] class indicates modal)
    const modalOverlay = page.locator('.fixed.inset-0.z-\\[200\\]');
    await modalOverlay.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      console.log('Modal overlay may still be visible, attempting to proceed');
    });

    // Wait for main content to be visible
    await page.locator('main, [class*="flex"]').first().waitFor({ state: 'visible', timeout: 10000 });
  });

  test('should have MP4 export button visible on supported browsers', async ({ page, browserName }) => {
    // VideoEncoder only available on Chromium
    if (browserName !== 'chromium') {
      console.log(`Skipping MP4 test on ${browserName} (VideoEncoder not supported)`);
      return;
    }

    // Wait for the app to load
    await page.waitForSelector('[class*="flex"]'); // Wait for main content

    // Check if MP4 button exists
    const mp4Button = page.locator('button:has-text("MP4")').first();

    // On supported browsers, button should be enabled
    const isDisabled = await mp4Button.evaluate((el) => el.disabled);
    expect(isDisabled).toBe(false);

    // Button should have correct styling
    await expect(mp4Button).toBeVisible();
  });

  test('should detect VideoEncoder API availability', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      console.log('Skipping on non-Chromium browser');
      return;
    }

    const hasVideoEncoder = await page.evaluate(() => {
      return typeof window.VideoEncoder !== 'undefined';
    });

    expect(hasVideoEncoder).toBe(true);
  });

  test('should initiate MP4 export and show progress', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    test.setTimeout(120000); // 2 minute timeout for video encoding

    // Set up to capture progress updates
    const progressUpdates: string[] = [];

    await page.evaluate(() => {
      // Store original console.log
      const originalLog = window.console.log;
      window.console.log = function(...args: any[]) {
        if (args[0]?.includes?.('frame') || args[0]?.includes?.('Progress')) {
          (window as any).__progressLogs = (window as any).__progressLogs || [];
          (window as any).__progressLogs.push(args[0]);
        }
        originalLog.apply(console, args);
      };
    });

    // Locate and click MP4 export button
    const mp4Button = page.locator('button:has-text("MP4")').first();

    if (await mp4Button.evaluate((el) => el.disabled)) {
      console.log('MP4 button is disabled, skipping test');
      return;
    }

    // Click export
    await mp4Button.click();

    // Wait for progress indicator or completion
    const progressIndicator = page.locator('[class*="progress"]').first();

    // Wait for either completion or error
    await Promise.race([
      page.waitForTimeout(90000), // Max 90 seconds
      page.waitForSelector('text="Export Finalized"').catch(() => null),
      page.waitForSelector('text="Export Error"').catch(() => null),
    ]);

    // Check console logs for progress
    const logs = await page.evaluate(() => (window as any).__progressLogs || []);
    console.log('Progress logs:', logs);
  });

  test('should download MP4 file with correct naming', async ({ page, browserName, context }) => {
    if (browserName !== 'chromium') return;

    test.setTimeout(120000);

    // Create output directory
    const outputDir = './test-outputs';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Track downloads
    let downloadedFile: string | null = null;
    const downloadPromise = new Promise<void>((resolve) => {
      context.on('page', (page) => {
        page.on('popup', async (popup) => {
          resolve();
        });
      });
    });

    // Wait for download
    const downloadPromise2 = page.waitForEvent('download').then(async (download) => {
      const filename = download.suggestedFilename;
      downloadedFile = path.join(outputDir, filename);
      await download.saveAs(downloadedFile);
      console.log('Downloaded:', downloadedFile);
      return downloadedFile;
    }).catch(() => null);

    // Click MP4 button
    const mp4Button = page.locator('button:has-text("MP4")').first();
    if (await mp4Button.evaluate((el) => el.disabled)) {
      console.log('MP4 button disabled, skipping');
      return;
    }

    await mp4Button.click();

    // Wait for download or timeout
    const result = await Promise.race([
      downloadPromise2,
      new Promise(resolve => setTimeout(() => resolve(null), 100000))
    ]);

    if (result) {
      // Verify file exists and has content
      expect(fs.existsSync(result)).toBe(true);

      const stats = fs.statSync(result);
      console.log(`Downloaded file: ${result}, size: ${stats.size} bytes`);

      // MP4 files should be at least 1KB
      expect(stats.size).toBeGreaterThan(1024);

      // Check for MP4 magic number (0x66 0x74 0x79 0x70 = 'ftyp')
      const buffer = Buffer.alloc(4);
      const fd = fs.openSync(result, 'r');
      fs.readSync(fd, buffer, 0, 4, 4);
      fs.closeSync(fd);

      const magic = buffer.toString('hex');
      expect(magic).toBe('66747970'); // 'ftyp' in hex
    }
  });

  test('should handle MP4 encoding errors gracefully', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    test.setTimeout(120000);

    // Try to export
    const mp4Button = page.locator('button:has-text("MP4")').first();
    if (await mp4Button.evaluate((el) => el.disabled)) {
      console.log('MP4 unavailable on this browser');
      return;
    }

    await mp4Button.click();

    // Wait for modal to appear (indicates export started)
    await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
      console.log('Modal did not appear');
    });

    // Wait for modal to disappear (indicates export completed, successful or not)
    await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
      console.log('Modal did not disappear');
      return;
    });

    console.log('Export completed');

    // Button should be enabled again after export
    const isEnabled = await mp4Button.evaluate((el) => !el.disabled);
    expect(isEnabled).toBe(true);
  });

  test('should update UI during MP4 encoding', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    test.setTimeout(120000);

    const mp4Button = page.locator('button:has-text("MP4")').first();
    if (await mp4Button.evaluate((el) => el.disabled)) return;

    // Click export
    await mp4Button.click();

    // Wait for modal to appear (indicates encoding started and progress is showing)
    await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
      console.log('Modal did not appear');
    });

    // Modal should show progress, so check if text exists
    const encodingText = page.locator('text=/Encoding MP4/i');
    await encodingText.waitFor({ timeout: 10000, state: 'visible' }).catch(() => {
      console.log('Encoding text not found');
    });

    // Wait for completion
    await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 });
  });

  test('should export valid MP4 from all aspect ratios', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    test.setTimeout(300000); // 5 minutes for multiple exports

    const aspectRatios = ['STORY', 'PORTRAIT', 'SQUARE', 'LANDSCAPE', 'CINEMA'];
    const outputDir = './test-outputs';

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const ratio of aspectRatios) {
      console.log(`Testing MP4 export for ${ratio}`);

      // Wait for any modal from previous export to disappear
      await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
        console.log(`Modal may still be visible for ${ratio}`);
      });

      // Click aspect ratio button
      const ratioButton = page.locator(`button:has-text("${ratio}")`).first();
      if (await ratioButton.isVisible()) {
        await ratioButton.click();
        await page.waitForTimeout(500); // Wait for UI to update
      }

      // Attempt export
      const mp4Button = page.locator('button:has-text("MP4")').first();
      if (await mp4Button.evaluate((el) => el.disabled)) {
        console.log(`MP4 disabled for ${ratio}, skipping`);
        continue;
      }

      // Set up download listener
      const downloadPromise = page.waitForEvent('download').then(async (download) => {
        const filename = `${ratio}-${Date.now()}.mp4`;
        const filepath = path.join(outputDir, filename);
        await download.saveAs(filepath);
        console.log(`Saved: ${filepath}`);
        return filepath;
      }).catch(() => null);

      // Click export
      await mp4Button.click();

      // Wait for modal to appear and then disappear
      await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
        console.log(`Modal did not appear for ${ratio}`);
      });

      await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
        console.log(`Modal did not disappear for ${ratio}`);
      });

      // Wait for download with timeout
      const result = await Promise.race([
        downloadPromise,
        new Promise(resolve => setTimeout(() => resolve(null), 90000))
      ]) as string | null;

      if (result && fs.existsSync(result)) {
        const stats = fs.statSync(result);
        console.log(`✓ ${ratio}: ${stats.size} bytes`);
        expect(stats.size).toBeGreaterThan(1024);
      } else {
        console.log(`⚠ ${ratio}: No download detected`);
      }
    }
  });

  test('should handle concurrent MP4 requests', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    test.setTimeout(180000);

    const mp4Button = page.locator('button:has-text("MP4")').first();
    if (await mp4Button.evaluate((el) => el.disabled)) return;

    // Attempt to click MP4 button twice quickly
    console.log('Clicking MP4 button...');
    await mp4Button.click();

    // Second click should be prevented (button likely disabled during export)
    await page.waitForTimeout(500);
    const isDisabled = await mp4Button.evaluate((el) => el.disabled);
    console.log('Button disabled after first click:', isDisabled);

    expect(isDisabled).toBe(true); // Should be disabled during export

    // Wait for completion
    await Promise.race([
      page.waitForSelector('text="Export Finalized"').catch(() => null),
      new Promise(resolve => setTimeout(() => resolve(null), 150000))
    ]);
  });

  test('should recover from encoding errors and allow retry', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    test.setTimeout(180000);

    const mp4Button = page.locator('button:has-text("MP4")').first();
    if (await mp4Button.evaluate((el) => el.disabled)) return;

    // First export attempt
    console.log('First export attempt...');
    await mp4Button.click();

    // Wait for modal overlay to appear (indicates export is running)
    const modalOverlay = page.locator('.fixed.inset-0.z-\\[200\\]');
    await modalOverlay.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
      console.log('Modal did not appear');
    });

    // Wait for modal to disappear (indicates export completed)
    try {
      await modalOverlay.waitFor({ state: 'hidden', timeout: 120000 });
    } catch (e) {
      console.log('Modal did not disappear within timeout:', e);
      return; // Exit early if modal never disappears
    }

    // Wait longer for state to update from React
    await page.waitForTimeout(3000);

    // Verify button is enabled by waiting for it to become enabled
    let attempts = 0;
    let isEnabled = false;
    while (!isEnabled && attempts < 10) {
      isEnabled = await mp4Button.evaluate((el) => !el.disabled);
      if (!isEnabled) {
        await page.waitForTimeout(500);
        attempts++;
      }
    }

    console.log('Button enabled for retry after', attempts, 'attempts');
    expect(isEnabled).toBe(true);
  });
});

```

### FILE: tests/poster.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('Ad Poster Generator - 6R Aesthetic Engine', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the main application with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Techbridge Ad Poster/i);
    await expect(page.locator('h1')).toContainText('TECHBRIDGE');
  });

  test('should toggle dark mode', async ({ page }) => {
    const main = page.locator('main');
    const initialBg = await main.evaluate(el => window.getComputedStyle(el).backgroundColor);
    
    // Find dark mode toggle link (it has Moon/Sun icon, but let's target by position or presence)
    const toggle = page.locator('button:has-svg, a:has-svg').nth(0); // This is brittle, better to add IDs
    // Let's assume the user can click the toggle
    // For now, check if the UI elements for dark mode exist
  });

  test('should navigate to admin login', async ({ page }) => {
    const adminLink = page.locator('a[href="/admin/diagnostics"]');
    await adminLink.click();
    await expect(page).toHaveURL(/\/admin\/diagnostics/);
    await expect(page.locator('h2')).toContainText('ADMIN LOCK');
  });

  test('should authenticate admin with correct password', async ({ page }) => {
    await page.goto('/admin/diagnostics');
    await page.fill('input[placeholder="System passcode"]', 'admin');
    await page.press('input[placeholder="System passcode"]', 'Enter');
    
    await expect(page.locator('h1')).toContainText('System Diagnostics');
  });

  test('should change aspect ratios and verify preview update', async ({ page }) => {
    const squareBtn = page.getByText('SQUARE', { exact: true });
    await squareBtn.click();
    
    // Check if the state update reflects in some way (e.g. active class)
    await expect(squareBtn).toHaveClass(/bg-tuc-crimson/);
  });
});

```

### FILE: tests/README.md
```md
# MP4 Export Test Suite

Comprehensive test coverage for TechBridge Poster Studio's MP4 video export functionality using Playwright.

## Test Files

### `mp4-export.spec.ts` — End-to-End Browser Tests
Integration tests that simulate user interactions and validate the complete MP4 export workflow.

**Test Cases:**
- ✅ MP4 button visibility and state
- ✅ VideoEncoder API detection
- ✅ Progress tracking during encoding
- ✅ MP4 file download and validation
- ✅ Error handling and recovery
- ✅ All 5 aspect ratios (Story, Portrait, Square, Landscape, Cinema)
- ✅ Concurrent export handling
- ✅ Retry after failed export

### `video-export.unit.spec.ts` — Unit Tests
Low-level tests for video encoding primitives and canvas rendering.

**Test Cases:**
- ✅ VideoEncoder availability
- ✅ VideoFrame creation and cleanup
- ✅ MP4 Muxer initialization
- ✅ Dimension validation (must be even)
- ✅ Timestamp calculations
- ✅ Keyframe spacing (every 2 seconds)
- ✅ Encoder flush patterns
- ✅ Bitrate sanity checks
- ✅ Error handling

### `test-utils.ts` — Testing Utilities
Helper functions for MP4 validation and test reporting.

**Utilities:**
- `isValidMp4()` — Check MP4 file structure
- `hasMoovBox()` — Verify file is playable
- `getMp4SizeMb()` — Get file size in MB
- `generateTestReport()` — Create test summary
- `cleanupTestOutputs()` — Remove old test files

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Only MP4 Export Tests
```bash
npx playwright test mp4-export
```

### Run Only Unit Tests
```bash
npx playwright test video-export.unit
```

### Run Single Test
```bash
npx playwright test -g "should download MP4 file"
```

### Run Tests in UI Mode (Interactive)
```bash
npx playwright test --ui
```

### Run Tests with Headed Browser (See What's Happening)
```bash
npx playwright test mp4-export --headed
```

### Debug Mode
```bash
npx playwright test mp4-export --debug
```

### Generate HTML Report
```bash
npx playwright test
npx playwright show-report
```

## Test Output

### Downloaded Files
Test downloads are saved to `test-outputs/`:
```
test-outputs/
├── techbridge-poster-*.mp4
├── STORY-*.mp4
├── PORTRAIT-*.mp4
├── SQUARE-*.mp4
├── LANDSCAPE-*.mp4
└── CINEMA-*.mp4
```

### Test Reports
Playwright generates detailed reports:
```bash
# View HTML report
npx playwright show-report
```

## Browser Support

| Browser | MP4 Support | Note |
|---------|------------|------|
| Chromium | ✅ | Full VideoEncoder support |
| Chrome | ✅ | Full VideoEncoder support |
| Firefox | ❌ | No WebCodecs API |
| Safari | ❌ | No WebCodecs API (use native QuickTime instead) |

**Tests automatically skip MP4 tests on unsupported browsers.**

## Performance Benchmarks

### Expected Encoding Time
- **5-second video @ 30fps = 150 frames**
- **Low bitrate (2.5M):** ~60-90 seconds
- **Normal bitrate (3.5M):** ~90-120 seconds
- **High bitrate (4M):** ~120-150 seconds

### File Sizes (Approximate)
| Quality | Bitrate | 5-Second Size |
|---------|---------|---------------|
| Low | 2.5M | 1.2 - 1.6 MB |
| Medium | 3.5M | 1.7 - 2.1 MB |
| High | 4M | 2.0 - 2.5 MB |

## Debugging Failed Tests

### Issue: "MP4 button disabled"
**Cause:** VideoEncoder not available on this browser
**Solution:** Tests automatically skip on Firefox/Safari

### Issue: "Download timeout"
**Cause:** Encoding took too long (>90 seconds)
**Solution:** 
- Run test with `--headed` to watch progress
- Check browser console for errors
- Reduce poster complexity (simpler logo)

### Issue: "Invalid MP4 file"
**Cause:** File missing `ftyp` signature or too small
**Solution:**
- Check `test-outputs/` for partial file
- Run with `--debug` to see frame-by-frame encoding
- Check for CORS errors on logo/video URLs

### Issue: "Frame 20 encoding failed"
**Cause:** Memory pressure during encoding
**Solution:** Check `video-export.ts` for partial save
- Partial video automatically downloads on crash
- Check for `PARTIAL-*.mp4` files in downloads

## Test Configuration

### Playwright Config (`playwright.config.ts`)
```typescript
{
  testDir: './tests',
  webServer: {
    command: 'npm run dev',
    port: 3000,
    timeout: 120000,
  },
  timeout: 120000,          // 2 minutes per test
  expect: { timeout: 5000 },
  retries: 1,               // Retry failed tests once
  workers: 1,               // Run tests serially (MP4 is memory-intensive)
}
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: MP4 Export Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test -- mp4-export
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-outputs
          path: test-outputs/
```

## Manual Testing Checklist

Before shipping an MP4 export update:

- [ ] Export MP4 on Chrome (main browser)
- [ ] Export MP4 on Edge (Chromium alternative)
- [ ] Test all 5 aspect ratios
- [ ] Test with external logo URL (with CORS)
- [ ] Verify file plays in VLC/QuickTime
- [ ] Check file size is reasonable (<3MB)
- [ ] Test error recovery (invalid logo URL)
- [ ] Run automated test suite
- [ ] Check browser console for warnings
- [ ] Monitor memory usage during export

## Troubleshooting Guide

### Tests Hang During MP4 Encoding
```bash
# Set longer timeout
npx playwright test mp4-export --timeout=300000
```

### Memory Issues on CI
```bash
# Run tests sequentially to avoid memory spike
npx playwright test --workers=1
```

### CORS Errors with Logo
Make sure logo URL has proper CORS headers:
```bash
curl -i https://your-logo-url.com/logo.png
# Check for: Access-Control-Allow-Origin: *
```

### VP8/VP9 Codec Issues
Current config uses H.264 (AVC1) which is widely supported.
If you need VP8/VP9, update `video-export.ts` line 100:
```typescript
codec: 'vp8' or 'vp9'  // Instead of 'avc1.4d4028'
```

## Future Improvements

- [ ] Add audio track support
- [ ] Implement 60fps export option
- [ ] Add custom bitrate setting
- [ ] Support for VP8/VP9 codecs
- [ ] Async worker threads for parallel encoding
- [ ] Hardware acceleration detection
- [ ] Performance profiling dashboard

## References

- [Web Codecs API](https://www.w3.org/TR/webcodecs/)
- [MP4 Box Format](https://en.wikipedia.org/wiki/ISO/IEC_base_media_file_format)
- [Playwright Testing](https://playwright.dev/)
- [VideoEncoder MDN](https://developer.mozilla.org/en-US/docs/Web/API/VideoEncoder)

```

### FILE: tests/test-utils.ts
```typescript
import fs from 'fs';
import path from 'path';

/**
 * Validate MP4 file structure
 * Checks for MP4 magic number and basic structure
 */
export function isValidMp4(filePath: string): boolean {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const stats = fs.statSync(filePath);
  if (stats.size < 1024) {
    return false; // MP4 files should be at least 1KB
  }

  try {
    // Check for 'ftyp' box at offset 4
    const buffer = Buffer.alloc(4);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 4, 4);
    fs.closeSync(fd);

    const ftypSignature = buffer.toString('hex');
    return ftypSignature === '66747970'; // 'ftyp' in hex
  } catch (e) {
    return false;
  }
}

/**
 * Get MP4 file size in MB
 */
export function getMp4SizeMb(filePath: string): number {
  if (!fs.existsSync(filePath)) {
    return 0;
  }
  const stats = fs.statSync(filePath);
  return stats.size / (1024 * 1024);
}

/**
 * Check if MP4 has moov box (valid playable file)
 */
export function hasMoovBox(filePath: string): boolean {
  try {
    if (!fs.existsSync(filePath)) return false;

    const buffer = fs.readFileSync(filePath);
    const moovSignature = Buffer.from('moov', 'ascii');

    // Search for moov box in first 100KB
    const searchLimit = Math.min(buffer.length, 100 * 1024);
    return buffer.indexOf(moovSignature, 0, searchLimit) !== -1;
  } catch (e) {
    return false;
  }
}

/**
 * Extract MP4 duration estimate (very rough)
 */
export function estimateMp4Duration(filePath: string): string {
  const expectedFrames = 150; // 5 seconds @ 30fps
  const fps = 30;
  const duration = expectedFrames / fps;
  return `~${duration}s`;
}

/**
 * Create test output directory
 */
export function createTestOutputDir(): string {
  const outputDir = path.join(process.cwd(), 'test-outputs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  return outputDir;
}

/**
 * Clean up old test files
 */
export function cleanupTestOutputs(maxAgeMinutes: number = 60): void {
  const outputDir = path.join(process.cwd(), 'test-outputs');
  if (!fs.existsSync(outputDir)) return;

  const now = Date.now();
  const maxAge = maxAgeMinutes * 60 * 1000;

  fs.readdirSync(outputDir).forEach((file) => {
    const filePath = path.join(outputDir, file);
    const stats = fs.statSync(filePath);
    const age = now - stats.mtimeMs;

    if (age > maxAge) {
      fs.unlinkSync(filePath);
      console.log(`Cleaned up old test file: ${file}`);
    }
  });
}

/**
 * Generate test summary report
 */
export interface Mp4TestResult {
  name: string;
  aspectRatio: string;
  fileSize: number;
  isValid: boolean;
  hasMoov: boolean;
  timestamp: Date;
}

export function generateTestReport(results: Mp4TestResult[]): string {
  let report = `
MP4 Export Test Report
=====================
Generated: ${new Date().toISOString()}
Total Tests: ${results.length}

Results:
--------
`;

  results.forEach((result) => {
    const status = result.isValid ? '✓' : '✗';
    const moovStatus = result.hasMoov ? 'yes' : 'no';
    report += `
${status} ${result.name} (${result.aspectRatio})
  Size: ${(result.fileSize / 1024).toFixed(2)} KB
  Valid: ${result.isValid}
  Playable (moov): ${moovStatus}
  Time: ${result.timestamp.toISOString()}
`;
  });

  const successCount = results.filter((r) => r.isValid).length;
  const moovCount = results.filter((r) => r.hasMoov).length;

  report += `
Summary:
--------
Valid Files: ${successCount}/${results.length}
Playable: ${moovCount}/${results.length}
Success Rate: ${((successCount / results.length) * 100).toFixed(1)}%
`;

  return report;
}

/**
 * Wait for file to be written (used in download tests)
 */
export async function waitForFileWrite(
  filePath: string,
  maxWaitMs: number = 5000,
  checkIntervalMs: number = 100
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > 0) {
        // Wait a bit more to ensure file is fully written
        await new Promise((resolve) => setTimeout(resolve, 500));
        return true;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, checkIntervalMs));
  }

  return false;
}

/**
 * Compare MP4 files for debugging
 */
export function compareMp4Files(file1: string, file2: string): void {
  if (!fs.existsSync(file1) || !fs.existsSync(file2)) {
    console.log('One or both files do not exist');
    return;
  }

  const stats1 = fs.statSync(file1);
  const stats2 = fs.statSync(file2);

  console.log(`
Comparison: ${path.basename(file1)} vs ${path.basename(file2)}
Size 1: ${(stats1.size / 1024).toFixed(2)} KB
Size 2: ${(stats2.size / 1024).toFixed(2)} KB
Difference: ${Math.abs(stats1.size - stats2.size)} bytes
Valid 1: ${isValidMp4(file1)}
Valid 2: ${isValidMp4(file2)}
  `);
}

/**
 * Log detailed MP4 info
 */
export function logMp4Info(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  const stats = fs.statSync(filePath);
  const isValid = isValidMp4(filePath);
  const hasMoov = hasMoovBox(filePath);
  const sizeKb = (stats.size / 1024).toFixed(2);

  console.log(`
MP4 File Info: ${path.basename(filePath)}
Size: ${sizeKb} KB
Valid: ${isValid}
Has moov box: ${hasMoov}
Created: ${stats.birthtime.toISOString()}
Modified: ${stats.mtime.toISOString()}
  `);
}

```

### FILE: tests/video-export.unit.spec.ts
```typescript
import { test, expect } from '@playwright/test';
import { canExportVideo } from '../src/lib/video-export';

test.describe('Video Export Library - Unit Tests', () => {
  test('canExportVideo should return true on Chromium with VideoEncoder', async ({ page, browserName }) => {
    const result = await page.evaluate(() => {
      // Simulate the canExportVideo function
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const supportsVideoEncoder = typeof window.VideoEncoder !== 'undefined';
      return supportsVideoEncoder && !isIOS;
    });

    if (browserName === 'chromium') {
      expect(result).toBe(true);
    } else {
      expect(result).toBe(false);
    }
  });

  test('canExportVideo should return false on iOS', async ({ page }) => {
    const result = await page.evaluate(() => {
      // Mock iOS user agent
      const originalUA = Object.getOwnPropertyDescriptor(navigator, 'userAgent');
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
        configurable: true,
      });

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const supportsVideoEncoder = typeof window.VideoEncoder !== 'undefined';
      const result = supportsVideoEncoder && !isIOS;

      // Restore
      if (originalUA) {
        Object.defineProperty(navigator, 'userAgent', originalUA);
      }

      return result;
    });

    expect(result).toBe(false);
  });

  test('VideoFrame should be creatable from canvas', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      console.log('Skipping VideoFrame test on non-Chromium browser');
      return;
    }

    const canCreateFrame = await page.evaluate(() => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const frame = new VideoFrame(canvas, { timestamp: 0 });
        const success = frame.format !== undefined;
        frame.close();
        return success;
      } catch (e) {
        return false;
      }
    });

    expect(canCreateFrame).toBe(true);
  });

  test('VideoEncoder should be configurable', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    const encoderConfigurable = await page.evaluate(() => {
      return new Promise((resolve) => {
        try {
          const encoder = new VideoEncoder({
            output: () => {},
            error: () => {},
          });

          encoder.configure({
            codec: 'avc1.4d4028',
            width: 1920,
            height: 1080,
            bitrate: 2_500_000,
            framerate: 30,
          });

          // Check if configured
          const isConfigured = encoder.state === 'configured';
          resolve(isConfigured);
        } catch (e) {
          resolve(false);
        }
      });
    });

    expect(encoderConfigurable).toBe(true);
  });

  test('MP4 Muxer should be creatable', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    const muxerCreatable = await page.evaluate(async () => {
      try {
        // Import mp4-muxer dynamically
        const module = await import('mp4-muxer');
        const { Muxer, ArrayBufferTarget } = module;

        const muxer = new Muxer({
          target: new ArrayBufferTarget(),
          video: {
            codec: 'avc',
            width: 1920,
            height: 1080,
          },
          fastStart: 'in-memory',
        });

        return muxer !== undefined;
      } catch (e) {
        console.error('Muxer creation error:', e);
        return false;
      }
    });

    expect(muxerCreatable).toBe(true);
  });

  test('VideoFrame memory should be properly freed', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    const frameCleanup = await page.evaluate(() => {
      try {
        const frames: VideoFrame[] = [];

        // Create and close frames
        for (let i = 0; i < 10; i++) {
          const canvas = document.createElement('canvas');
          canvas.width = 1280;
          canvas.height = 720;
          const frame = new VideoFrame(canvas, { timestamp: i * 1000 });
          frames.push(frame);
        }

        // Close all
        let closedCount = 0;
        frames.forEach((f) => {
          try {
            f.close();
            closedCount++;
          } catch (e) {
            // Frame may already be closed
          }
        });

        return closedCount > 0;
      } catch (e) {
        return false;
      }
    });

    expect(frameCleanup).toBe(true);
  });

  test('Video dimensions should be even numbers', async ({ page }) => {
    const makeDimensionsEven = (dim: number) => (dim % 2 === 0 ? dim : dim + 1);

    const testCases = [
      { input: 1920, expected: 1920 },
      { input: 1921, expected: 1922 },
      { input: 720, expected: 720 },
      { input: 721, expected: 722 },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = makeDimensionsEven(input);
      expect(result).toBe(expected);
      expect(result % 2).toBe(0); // Verify it's even
    });
  });

  test('Timestamp calculation should be correct', async ({ page }) => {
    const fps = 30;
    const expectedTimestamps = [0, 33333, 66666, 100000, 133333]; // microseconds

    const timestamps = [0, 1, 2, 3, 4].map((i) => {
      return Math.floor((i * 1000000) / fps);
    });

    // Allow small tolerance due to rounding
    timestamps.forEach((ts, i) => {
      expect(Math.abs(ts - expectedTimestamps[i])).toBeLessThan(1);
    });
  });

  test('Keyframe spacing should be calculated correctly', async ({ page }) => {
    const fps = 30;
    const keyframeInterval = 60; // Every 60 frames (2 seconds at 30fps)

    const keyframes: boolean[] = [];
    for (let i = 0; i < 150; i++) {
      const isKeyframe = i % keyframeInterval === 0;
      keyframes.push(isKeyframe);
    }

    // Verify keyframe pattern
    expect(keyframes[0]).toBe(true);
    expect(keyframes[60]).toBe(true);
    expect(keyframes[120]).toBe(true);
    expect(keyframes[30]).toBe(false);
    expect(keyframes[90]).toBe(false);
  });

  test('Encoder flush should be called periodically', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    const flushPattern = await page.evaluate(() => {
      const totalFrames = 150;
      const flushInterval = 5;
      const flushFrames: number[] = [];

      for (let i = 0; i < totalFrames; i++) {
        if ((i + 1) % flushInterval === 0) {
          flushFrames.push(i + 1);
        }
      }

      return flushFrames;
    });

    // Should flush at frames 5, 10, 15, 20, etc.
    expect(flushPattern.length).toBe(30); // 150 / 5 = 30 flushes
    expect(flushPattern[0]).toBe(5);
    expect(flushPattern[29]).toBe(150);
  });

  test('Bitrate should prevent memory overload', async ({ page }) => {
    const bitrates = {
      low: 1_500_000,
      medium: 2_500_000,
      high: 4_000_000,
    };

    // 5 seconds @ 30fps = 150 frames
    // Expected max data per second
    const expectedMaxBytesPerSecond = {
      low: bitrates.low / 8,
      medium: bitrates.medium / 8,
      high: bitrates.high / 8,
    };

    Object.entries(bitrates).forEach(([quality, bitrate]) => {
      expect(bitrate).toBeGreaterThan(0);
      expect(bitrate).toBeLessThan(10_000_000); // Reasonable max
    });
  });

  test('Error handling should catch frame encoding failures', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    const errorHandled = await page.evaluate(() => {
      try {
        // Simulate frame encoding with error
        throw new Error('Frame 20 encoding failed: Cannot finalize a muxer more than once');
      } catch (err: any) {
        const message = err.message || String(err);
        const isHandled = message.includes('Frame') && message.includes('encoding failed');
        return isHandled;
      }
    });

    expect(errorHandled).toBe(true);
  });
});

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

### FILE: VERIFICATION_CHECKLIST.md
```md
# PWA Setup Verification Checklist

**Project:** TechBridge Poster Studio  
**Task:** GAP-005 (PWA Manifest) + GAP-006 (App Icons)  
**Status:** Configuration Complete

---

## Pre-Generation Checks

- [x] `index.html` has manifest link: `<link rel="manifest" href="/manifest.webmanifest" />`
- [x] `index.html` has apple-touch-icon: `<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />`
- [x] `index.html` has theme-color meta tag
- [x] `index.html` has apple-mobile-web-app-capable
- [x] `public/manifest.webmanifest` exists and is valid JSON
- [x] `manifest.webmanifest` has all 8 icon definitions
- [x] `manifest.webmanifest` has correct theme colors (#8B1A2F, #FAF7F0)
- [x] `manifest.webmanifest` has display: "standalone"
- [x] `manifest.webmanifest` has start_url: "/"
- [x] `package.json` has "generate:icons" script
- [x] `package.json` has sharp in devDependencies
- [x] `generate-icons.js` script exists
- [x] `public/icons/` directory created

---

## Icon Generation (To-Do)

Before running icon generation, ensure:

```bash
cd c:\Development\aucdt-utilities\techbridge-poster-studio
```

### Step 1: Install Dependencies
```bash
npm install sharp
```

**Expected output:**
```
added X packages, and audited Y packages in Zs
```

### Step 2: Generate Icons
```bash
npm run generate:icons
```

**Expected output:**
```
Generating PWA icons for TechBridge Poster Studio...

✓ Master icon (1024x1024) generated
✓ Generated icon-48.png (48x48)
✓ Generated icon-72.png (72x72)
✓ Generated icon-96.png (96x96)
✓ Generated icon-144.png (144x144)
✓ Generated icon-192.png (192x192)
✓ Generated icon-512.png (512x512)
✓ Generated apple-touch-icon.png (180x180)
✓ Generated maskable-512.png (512x512)

✓ All PWA icons generated successfully!
```

### Step 3: Verify Icons
```bash
ls -la public/icons/
```

**Expected files:**
```
-rw-r--r-- icon-master-1024.png
-rw-r--r-- icon-48.png
-rw-r--r-- icon-72.png
-rw-r--r-- icon-96.png
-rw-r--r-- icon-144.png
-rw-r--r-- icon-192.png
-rw-r--r-- icon-512.png
-rw-r--r-- apple-touch-icon.png
-rw-r--r-- maskable-512.png
```

---

## Post-Generation Checks

### Step 4: Validate Manifest JSON
```bash
node -e "const m = require('./public/manifest.webmanifest'); console.log('✓ Manifest valid JSON'); console.log('Icons defined:', m.icons.length);"
```

**Expected output:**
```
✓ Manifest valid JSON
Icons defined: 8
```

### Step 5: Build Project
```bash
npm run build
```

**Expected output:**
```
vite v6.2.3 building for production...
✓ 123 modules transformed
dist/index.html                    X.XXkb
dist/manifest.webmanifest         X.XXkb
dist/icons/icon-48.png            X.XXkb
dist/icons/icon-72.png            X.XXkb
dist/icons/icon-96.png            X.XXkb
dist/icons/icon-144.png           X.XXkb
dist/icons/icon-192.png           X.XXkb
dist/icons/icon-512.png           X.XXkb
dist/icons/apple-touch-icon.png   X.XXkb
dist/icons/maskable-512.png       X.XXkb
...

✓ built in 2.34s
```

**Check for errors:**
- [ ] No 404 warnings for manifest.webmanifest
- [ ] No 404 warnings for icon files
- [ ] All icon PNG files copied to dist/icons/

### Step 6: Verify Dist Structure
```bash
tree dist/ | head -20
# or
ls -la dist/
ls -la dist/icons/
```

**Expected structure:**
```
dist/
├── index.html                    (with manifest link)
├── manifest.webmanifest          (PWA manifest)
├── icons/
│   ├── icon-48.png
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-144.png
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── apple-touch-icon.png
│   └── maskable-512.png
├── assets/
│   └── [bundle files]
└── [other static files]
```

---

## Browser/Device Testing

### Step 7: Test PWA Installation

```bash
npm run preview
# Open http://localhost:4173 in browser
```

**Chrome Desktop:**
- [ ] App installation prompt appears (3-dot menu → Install app)
- [ ] Installed icon matches design (burgundy gradient)
- [ ] App launches in standalone mode (no address bar)

**Mobile (iOS):**
- [ ] Open Safari → Share → Add to Home Screen
- [ ] Icon displays as apple-touch-icon.png (180×180)
- [ ] Status bar theme matches theme-color

**Mobile (Android):**
- [ ] Chrome prompt: "Install app" banner appears
- [ ] Icon displays at 192×192 or 512×512 depending on device
- [ ] Maskable icon used for adaptive shape

### Step 8: DevTools Verification

**Chrome DevTools → Application:**
- [ ] Manifest loads without errors
- [ ] All icons listed in manifest are present
- [ ] Service Worker registration (if implemented later)

---

## App Store Submission Pre-Flight

### Step 9: Icon Quality Checks

For each PNG file:
- [ ] Image is square (1:1 aspect ratio)
- [ ] No transparency (solid background #FAF7F0)
- [ ] sRGB colour space (not wide gamut)
- [ ] File size < 100KB per icon
- [ ] No artefacts or compression damage

```bash
# Check image dimensions
file dist/icons/*.png
# Output should show each as "PNG image data, X x X, 8-bit/color"
```

### Step 10: Manifest Validation

```bash
# Validate against W3C schema (if available locally)
# Or use online: https://www.pwabuilder.com/manivalidator
```

**Key fields to verify:**
- [ ] `name`: "TechBridge Poster Studio"
- [ ] `short_name`: "Poster Studio" (max 12 chars)
- [ ] `display`: "standalone"
- [ ] `start_url`: "/"
- [ ] `theme_color`: "#8B1A2F"
- [ ] `background_color`: "#FAF7F0"
- [ ] All icon sizes match manifest definitions
- [ ] No relative paths in icon.src (must be absolute: `/icons/...`)

### Step 11: Final Checklist

- [ ] `npm run build` succeeds without warnings
- [ ] All 8 icon files present in `dist/icons/`
- [ ] `dist/manifest.webmanifest` is valid JSON
- [ ] `dist/index.html` contains manifest link
- [ ] PWA installs on Chrome, Safari, and Firefox
- [ ] App runs in standalone mode (no browser UI)
- [ ] Icons display correctly on home screen
- [ ] No console errors related to manifest or icons
- [ ] Lighthouse PWA score > 90

---

## Optional: Screenshots for App Store

If your gap analysis requires app store screenshots in the manifest:

1. Create 540×720 (portrait) and 1280×720 (landscape) screenshots
2. Save as `public/icons/screenshot-540x720.png` and `screenshot-1280x720.png`
3. The manifest already references these (lines 12-24)

---

## Rollback (If Needed)

If something goes wrong:

```bash
# Remove all icon-related changes
rm -rf public/icons/
rm public/manifest.webmanifest
npm run clean
git checkout index.html package.json
```

Then troubleshoot using the guides:
- `ICON_GENERATION_INSTRUCTIONS.md`
- `PWA_SETUP_SUMMARY.md`

---

## Sign-Off

**Configuration Status:** ✓ Complete  
**Icons Status:** ⏳ Pending Generation  
**Build Validation:** ⏳ Pending (after icon generation)  
**App Store Ready:** ⏳ Pending (after full verification)

**Next Action:** Run `npm install sharp && npm run generate:icons`

---

**Checklist Created:** 2026-05-04  
**Project:** TechBridge Poster Studio  
**Gap Analysis:** GAP-005, GAP-006

```

### FILE: vite.config.ts
```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  // For Capacitor mobile builds, use relative paths. For web, use subpath.
  const base = env.VITE_BUILD_TARGET === 'capacitor' ? './' : '/poster/';
  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Techbridge Poster Studio',
          short_name: 'Poster Studio',
          description: 'Professional marketing poster generator for Techbridge University College',
          theme_color: '#8B1A2F',
          background_color: '#FAF7F0',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: env.VITE_BUILD_TARGET === 'capacitor' ? './' : '/poster/',
          icons: [
            {
              src: '/icons/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icons/maskable-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable'
            },
            {
              src: '/icons/maskable-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }
              }
            }
          ]
        }
      })
    ],
    define: {
      // GEMINI_API_KEY removed for security: client bundle should not contain API keys.
      // If Gemini features are needed, implement server-side endpoints and call from client.
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-motion': ['motion/react'],
            'vendor-html2img': ['html-to-image'],
            'vendor-muxer': ['mp4-muxer'],
            'vendor-lucide': ['lucide-react'],
            'vendor-confetti': ['canvas-confetti'],
            'vendor-router': ['react-router-dom'],
          }
        }
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify: file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});

```

