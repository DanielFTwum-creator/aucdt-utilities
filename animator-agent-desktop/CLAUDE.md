# CLAUDE.md — Animator Agent Desktop

> This file is read automatically by Claude Code on every session.
> It governs AI model allocation, workflow protocols, and project standards.

---

## Task Delegation

When spawning subagents, use the cheapest model that can handle the task:
- Haiku: bulk mechanical tasks - file ops, formatting, renaming, simple transformations
- Sonnet: scoped research, code exploration, summarization, synthesis across sources
- Opus: only when real planning or tradeoffs are involved - architecture, ambiguous requirements

---

## Quick Commands

**Package manager:** pnpm 8.15.0 (required)

| Task | Command |
|---|---|
| **Development server** | `pnpm dev` (localhost:3000) |
| **Build for production** | `pnpm build` (Vite) |
| **Type checking only** | `pnpm lint` (tsc --noEmit) |
| **Deploy to server** | `pnpm deploy` (builds + SCP to `/animator/`) |

**Note:** This project uses pnpm exclusively. Do not use npm or yarn.

---

## Architecture Overview

### Purpose
Desktop animation studio for creating AI agent videos using Claudia (AI character).
Integrates with Google Gemini API for AI-powered features.
Supports multi-track animation timeline with keyframes, camera integration, and admin diagnostics.

### Stack
- **Frontend:** React 19 + TypeScript 5.8 + Vite 6.2
- **Styling:** Tailwind CSS v4 + PostCSS
- **Mobile:** Capacitor 8.3 (iOS/Android packaging)
- **Animation:** Framer Motion, custom CSS animations
- **Icons:** Lucide React
- **AI:** Google Gemini (@google/genai 1.29.0)
- **Backend:** Express.js (optional)

### Routes (3 main)
```
/                  → Main Animator (timeline editor)
/admin/dashboard   → System status & diagnostics
/admin/testing     → Puppeteer test suite & accessibility audits
```

### Layout Structure
- **App.tsx** — Root: BrowserRouter wrapping Routes with admin auth
- **Animator.tsx** — Main timeline editor with tracks and keyframes
- **ClaudiaScene.tsx** — SVG-based Claudia character with animation states

### Authentication
Admin routes require password authentication (default: "admin")
Configure via App.tsx AdminAuth component

### Mobile Packaging (Capacitor)
**App ID:** com.techbridge.animator
**App Name:** Animator Agent
**Web Dir:** dist

To add iOS/Android support:
```bash
pnpm cap add ios
pnpm cap add android
pnpm cap sync
```

### Styling & Theming
- **Tailwind v4** with custom color palette
- **Dark mode** default (zinc/indigo/purple color scheme)
- **Responsive design** for desktop and tablet views
- Custom Claudia character SVG animations

### Animation Pattern
Timeline-based 24 FPS playback with:
- Frame-accurate scrubbing
- Multi-track keyframe system
- Real-time preview of character poses
- Custom fizz/heart particle effects

### State Management
Local React hooks (useState) for:
- Timeline playback (frame, position, playing state)
- Track management (segments, keyframes)
- Camera capture
- Admin authentication

---

## Development Notes

- **Hot reload:** Vite HMR enabled; changes reflect instantly
- **TypeScript:** Strict mode enabled; `noUnusedLocals`, `noUnusedParameters` enforced
- **CSS:** Tailwind utilities + custom claudia.css for character animations
- **Google API:** Requires GEMINI_API_KEY in .env.local
- **Express:** Optional backend at server.ts (not yet implemented)

---

## Deployment

**Local:** `pnpm dev` (port 3000, accessible via 0.0.0.0)
**Production:** `pnpm deploy` (builds + copies to `/var/www/vhosts/techbridge.edu.gh/httpdocs/animator/`)

---

## App Store / Play Store Standards (Capacitor)

This project follows the same mobile packaging standards as SmartGhana:

1. **Build & Package**
   ```bash
   pnpm build
   pnpm cap sync
   ```

2. **iOS (Xcode)**
   ```bash
   pnpm cap open ios
   ```
   Then configure in Xcode:
   - Signing & Capabilities
   - Deployment target
   - Bundle identifier

3. **Android (Android Studio)**
   ```bash
   pnpm cap open android
   ```
   Then configure in Android Studio:
   - Build variants (release)
   - Signing configuration
   - API levels

4. **Publishing**
   - iOS: Archive → Upload to App Store Connect
   - Android: Generate signed APK/AAB → Upload to Google Play Console

---

## Known Limitations

1. Camera integration currently web-only (Capacitor camera plugin needed for mobile)
2. Express backend not yet integrated with Vite dev server
3. Puppeteer tests not yet connected to admin testing panel

---

*Last updated: May 2026 — Daniel Frempong Twum / Techbridge ICT*
