
# Deployment Guide
**Project**: TVET Assessment Progress Dashboard  
**Framework**: React 19.2.5 (No-Build ESM)

## 1. Architecture Overview
This application utilizes a **Zero-Build Architecture**. It runs directly in the browser using ES Modules (ESM) and Babel Standalone for runtime JSX compilation. 
- **No Node.js build step required.**
- **No bundlers (Webpack/Vite) required for execution.**

## 2. Requirements
- **Runtime**: Any modern web browser (Chrome 90+, Firefox 90+, Safari 14+, Edge).
- **React Version**: 19.2.5 (Strict dependency).
- **Hosting**: Any static file server.

## 3. Deployment Steps

### Option A: Static Web Host (Netlify / Vercel / GitHub Pages)
1. **Repository**: Ensure all files (`index.html`, `index.tsx`, `App.tsx`, `types.ts`, `components/*`) are in the root of your repository.
2. **Publish Directory**: Set the publish directory to the repository root (`.`).
3. **Build Command**: Leave empty (None required).
4. **Deploy**: Trigger the deployment.

### Option B: Traditional Web Server (Apache / Nginx)
1. Upload the entire project directory to your `public_html` or `www` folder.
2. Ensure the server is configured to serve `.tsx` files with the correct MIME type if strict checking is enabled (though Babel handles the request).
3. **Important**: Verify that `index.html` is the entry point.

## 4. Verification
After deployment:
1. Open the URL.
2. Verify the application loads without console errors.
3. Check the **React Version** in the Admin Panel Diagnostics to confirm `19.2.5`.
4. Test URL state persistence by changing a value and refreshing the page.

## 5. Dependency Management
Dependencies are loaded via `importmap` in `index.html`.
- **Source**: `esm.sh` CDN.
- **Versioning**: Pinned to specific versions to ensure stability.
```json
"react": "https://esm.sh/react@19.2.5",
"react-dom": "https://esm.sh/react-dom@19.2.5"
```
*To upgrade dependencies, edit the `importmap` in `index.html`.*
