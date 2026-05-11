# Deployment Guide
**Project:** Techbridge Scholarship Portal (v2.0)
**Core Requirement:** MUST compile with React 19.2.5

## 1. Prerequisites
- Node.js (v18 or higher recommended)
- `pnpm` or `npm`
- **Strict Requirement:** React version MUST be `19.2.5`. Do not upgrade or downgrade.

## 2. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_KEY=your_gemini_api_key_here
VITE_SMTP_ENDPOINT=https://api.techbridge.edu.gh/aucdt-dev/sendMail
```

## 3. Build Process
1. **Install Dependencies:**
   ```bash
   npm install
   ```
   *Verify that `react` and `react-dom` are pinned to `19.2.5`.*

2. **Run Linter:**
   ```bash
   npm run lint
   ```

3. **Production Build:**
   ```bash
   npm run build
   ```
   This will use Vite to compile the SPA into the `dist/` directory.

## 4. PWA Configuration
Ensure the following files remain in the `/public` directory:
- `manifest.json`
- `sw.js` (Service Worker)
- All logo variants (TUC_LOGO_1.png)

## 5. Hosting (Static Server)
Deploy the `dist/` folder to any static hosting provider (e.g., Vercel, Netlify, Nginx).
Ensure routing is configured for SPA (fallback to `index.html`).
*Note: Since the application relies on hash routing (`#/admin`), standard static hosting without complex rewrite rules is fully supported.*