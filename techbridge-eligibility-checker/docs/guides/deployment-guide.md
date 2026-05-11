# Deployment Guide: Eligibility Checker
**Project:** TUC Eligibility Checker (v3.0.0)
**Core Requirement:** MUST compile with React 19.2.5

## 1. Environment Preparation
- **Node.js**: v18+ required.
- **Package Manager**: `pnpm` recommended.
- **React Constraint**: Ensure `package.json` pins `react` and `react-dom` to **19.2.5**.

## 2. Configuration
Create a `.env` file if external APIs are integrated:
```env
VITE_API_URL=https://api.techbridge.edu.gh/aucdt-dev/eligibility
```

## 3. Build & Verification
1. **Install**: `pnpm install`
2. **Lint**: `pnpm run lint` (Ensure 100% compliance)
3. **Build**: `pnpm run build`
4. **Preview**: `pnpm run preview`

## 4. PWA Assets
Ensure all PWA assets in `/public` are intact:
- `manifest.json`
- `sw.js` (Service Worker)
- Institutional logos (Gold/Ink variants)

## 5. Hosting
Deploy the `dist/` folder to a static provider (Vercel, Netlify, or Nginx). Ensure the host supports SPA routing (fallback to `index.html`).
