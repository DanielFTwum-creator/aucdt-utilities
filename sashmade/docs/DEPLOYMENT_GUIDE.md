# SashMade Deployment Guide

**Version:** 2.0
**Date:** 2026-04-14
**Required React Version:** 19.2.5

## 1. Prerequisites
- **Node.js:** v22.x LTS (minimum v22.0.0)
- **pnpm:** v10.30+ (`npm install -g pnpm`)
- **Gemini API Key:** A valid Google Gemini API key (for AI Studio features)

## 2. Environment Setup
1. Clone the repository and `cd sashmade`.
2. Create `.env.local`:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

## 3. Installation
```bash
pnpm install
```
> **Critical:** Ensure `react` and `react-dom` are pinned to `19.2.5` in `package.json`. Never upgrade without approval.

## 4. Development Server
```bash
pnpm run dev        # http://localhost:3000
```

## 5. Building for Production
```bash
pnpm run build      # outputs to dist/
pnpm run preview    # preview the production build locally
```

Chunk splitting is configured in `vite.config.ts` â€” expect 7â€“9 `.js` files in `dist/assets/`, none exceeding 1 MB.

## 6. Deployment Targets

### 6.1 Netlify / Static Hosting
1. Connect the repository to Netlify.
2. Set build command: `pnpm run build`
3. Set output directory: `dist`
4. Add environment variable `GEMINI_API_KEY` in the Netlify dashboard.
5. SPA routing is handled by `public/_redirects` (`/* /index.html 200`).

### 6.2 Apache / cPanel
1. Upload `dist/` contents to the web root.
2. SPA routing is handled by `public/.htaccess` (RewriteEngine rules).

### 6.3 Docker
```bash
docker build -t sashmade .
docker run -p 3000:80 -e GEMINI_API_KEY="your_key" sashmade
```

## 7. Post-Deployment Verification
After deployment, verify:
1. `/` â€” Homepage loads with hero, moodboard, How to Order section.
2. `/shop` â€” All 5 products display with prices in â‚µ.
3. `/about` â€” Founder message, team, contact info visible.
4. `/admin/login` â€” Login form present; credentials `admin / sashmade2026` work.
5. `/admin/testing` â€” Run E2E suite to confirm all 5 specs pass.
6. SPA routing: navigate to `/shop`, refresh â€” page must not 404.
