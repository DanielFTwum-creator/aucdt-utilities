# Deployment Guide
## TechBridge 6R Workshop Portal

### 1. Requirements
- A static file hosting service (GitHub Pages, Netlify, Vercel, or Firebase Hosting).
- **HTTPS is mandatory** for Service Worker and PWA functionality.

### 2. API Configuration
The application relies on the Google Gemini API.
- Ensure the environment variable `API_KEY` is provided during the build process or injected by the hosting provider.
- In the local development environment, use an `.env` file or local shell export.

### 3. PWA Assets
Before deployment, verify the following files are in the root directory:
- `sw.js`: The Service Worker logic.
- `metadata.json`: PWA manifest and permissions configuration.
- `index.html`: The entry point containing the import maps.

### 4. Verification Checklist
- [ ] App is served over HTTPS.
- [ ] `manifest.json` (if present) or `metadata.json` is correctly linked.
- [ ] Service worker registers successfully in Browser DevTools -> Application.
- [ ] Offline mode works after the first load.
