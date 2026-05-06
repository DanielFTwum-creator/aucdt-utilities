# Deployment Guide: University Fees Dashboard
**Project:** Ghana University Fees (v3.0.0)
**Core Requirement:** MUST compile with React 19.2.4

## 1. Prerequisites
- **Node.js**: v18 or higher recommended.
- **Package Manager**: `pnpm` (recommended) or `npm`.
- **Constraint**: Ensure `package.json` pins `react` and `react-dom` to **19.2.4**.

## 2. Institutional Metadata
- Ensure `metadata.json` in the root correctly identifies the application as the "Ghana University Fees Dashboard".

## 3. Build & Verification
1. **Sync Dependencies**: `pnpm install`
2. **Type Check**: `pnpm run build` (Ensuring 100% compliance)
3. **Verify**: Inspect `package.json` to confirm React 19.2.4 is active.

## 4. Static Hosting
Deploy the `dist/` folder to your institutional static hosting provider.
Ensure the host supports SPA routing (fallback to `index.html`) if custom admin routes are added.

## 5. Security Posture
The application utilizes `localStorage` for institutional audit trails and session state. Ensure the production environment is served exclusively over HTTPS to protect financial data context.
