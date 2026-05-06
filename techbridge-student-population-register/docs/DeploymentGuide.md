# Deployment Guide: Student Population Register
**Project:** TUC Population Register (v3.0.0)
**Core Requirement:** MUST compile with React 19.2.4

## 1. Environment Preparation
- **Node.js**: v18+ required.
- **Package Manager**: `pnpm` (recommended) or `npm`.
- **Constraint**: Ensure `package.json` pins `react` and `react-dom` to **19.2.4**.

## 2. Institutional Metadata
- Ensure `metadata.json` in the root correctly identifies the application as the "Student Population Register".

## 3. Build & Verification
1. **Sync Dependencies**: `pnpm install`
2. **Type Check**: `pnpm run lint` (Strict `tsc` check)
3. **Institutional Build**: `pnpm run build`
4. **Local Preview**: `pnpm run preview`

## 4. PWA Assets
All branding assets must reside in the `/public` folder:
- `TUC_LOGO_1.png` (High-res institutional logo)
- `manifest.json` (PWA configuration)
- `sw.js` (Service Worker)

## 5. Hosting Strategy
Deploy the `dist/` folder to a secure institutional server. The application uses `react-router-dom` with `/admin` routes; ensure the host supports SPA routing (fallback to `index.html`).
