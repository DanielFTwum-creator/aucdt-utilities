# Deployment Guide: Ghana News Aggregator
**Project:** Ghana News Aggregator (v3.0.0)
**Core Requirement:** MUST compile with React 19.2.4

## 1. Prerequisites
- **Node.js**: v18 or higher recommended.
- **Package Manager**: `pnpm` (recommended) or `npm`.
- **Constraint**: Ensure `package.json` pins `react` and `react-dom` to **19.2.4**.

## 2. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_API_KEY=your_gemini_api_key_here
VITE_META_PAGE_ID=your_page_id
VITE_META_ACCESS_TOKEN=your_access_token
```

## 3. Institutional Build
1. **Sync Dependencies**: `pnpm install`
2. **Lint & Verify**: `pnpm run lint` (Ensure zero errors)
3. **Build SPA**: `pnpm run build`
4. **Local Preview**: `pnpm run preview`

## 4. Static Hosting
Deploy the `dist/` folder to your institutional static hosting provider. The application relies on high-frequency API polling for agent monitoring; ensure the host supports persistent WebSocket or long-poll connections if scaled.

## 5. PWA Considerations
Institutional logos and the service worker must be correctly registered in `index.tsx` to maintain editorial access even during intermittent network connectivity.
