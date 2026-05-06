# Deployment Guide
**Project:** Techbridge AI Workshop Flyer
**Target Environment:** Static Web Hosting

---

## 1. Prerequisites
*   **Node.js** (v18+): Required for running the Playwright test suite, though not strictly required for serving the app in its current "no-build" state.
*   **Web Browser**: Chrome/Edge/Firefox (Latest) supporting ES Modules and Import Maps.

## 2. Build Architecture
This application utilizes a **Zero-Build** architecture for development and rapid prototyping:
*   **React** is loaded via `esm.sh` CDN.
*   **Tailwind** is loaded via Play CDN (Runtime JIT).
*   **TypeScript/JSX** files are assumed to be served in an environment that handles basic resolution or via a lightweight dev server (like Vite) if compiled. 

*Note: For the provided file structure, the application expects `index.html` to be the entry point.*

## 3. Production Deployment (Static)
To deploy this application to a production environment (e.g., Netlify, Vercel, GitHub Pages):

### Option A: Standard Static Host
1.  Upload all files (`index.html`, `App.tsx`, `index.tsx`, etc.) to the public root.
2.  Ensure your web server serves `.tsx` files with the correct MIME type if compiling on the fly, OR use a build tool.

### Option B: Recommended Production Build (Vite)
For a robust production deployment, it is recommended to wrap the code in a Vite config:

1.  Initialize Vite:
    ```bash
    npm create vite@latest techbridge-flyer -- --template react-ts
    ```
2.  Move `components`, `utils`, `types.ts`, `constants.ts`, `App.tsx` into `src/`.
3.  Move `index.html` to root.
4.  Run Build:
    ```bash
    npm run build
    ```
5.  Deploy the `dist/` folder.

## 4. Environment Configuration
Currently, there are no `.env` dependencies.
*   **API Keys**: None required.
*   **Backend**: None (Serverless/Client-side only).

## 5. Verifying Deployment
1.  Open the production URL.
2.  Check the console for `[AUDIT] App Started`.
3.  Press `Ctrl+Shift+A` to open the Admin Panel.
4.  Run **Diagnostics** to confirm the production build is healthy.
