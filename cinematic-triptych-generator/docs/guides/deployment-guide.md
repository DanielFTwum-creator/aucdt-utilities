# Deployment Guide: Cinematic Triptych Generator
**Project:** Cinematic Triptych (v3.0.0)
**Core Requirement:** MUST compile with React 19.2.4

## 1. Prerequisites
- **Node.js**: v18 or higher recommended.
- **Package Manager**: `pnpm` (recommended) or `npm`.
- **Constraint**: Ensure `package.json` pins `react` and `react-dom` to **19.2.4**.

## 2. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 3. Institutional Build
1. **Sync Dependencies**: `pnpm install`
2. **Type Check**: `pnpm run build` (Ensure 100% compliance)
3. **Verify**: Inspect build chunks to confirm React 19.2.4 integration.

## 4. Static Hosting
Deploy the `dist/` folder to your institutional static hosting provider (Vercel, Netlify, or Nginx). Ensure the host supports high-bandwidth base64 image transfers.

## 5. External Assets
The application requires the `JSZip` library via CDN for multi-panel archiving. Ensure institutional firewalls allow traffic from `https://cdnjs.cloudflare.com`.
