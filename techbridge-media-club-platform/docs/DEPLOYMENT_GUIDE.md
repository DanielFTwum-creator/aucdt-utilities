# Deployment Guide
**Techbridge Media Club Platform**

## 1. Overview
The Techbridge Media Club Platform is designed as a lightweight, client-side Single Page Application (SPA). It utilizes modern ES Modules (ESM) to load dependencies directly from a CDN, eliminating the need for complex build steps (Webpack/Vite) for the prototype phase.

## 2. Prerequisites
*   **Web Server:** Any static file server (Nginx, Apache, Vercel, Netlify, GitHub Pages).
*   **Internet Access:** Required to fetch dependencies from `esm.sh` and Tailwind CSS.

## 3. Dependency Requirements
The application strictly enforces the following versions via the Import Map in `index.html`:

*   **React:** `19.2.4`
*   **React DOM:** `19.2.4`
*   **Lucide React:** `0.574.0`
*   **Recharts:** `3.7.0`
*   **Tailwind CSS:** `3.4` (via CDN)

> **Critical:** Do not downgrade React below 19.x as the application relies on React 19 features.

## 4. Deployment Steps

### Option A: Static Web Host (Netlify/Vercel)
1.  Upload the project root directory.
2.  Configure the build settings:
    *   **Build Command:** (Leave empty)
    *   **Publish Directory:** `.` (Current directory)
3.  Deploy.

### Option B: Local Node.js Server
1.  Install a static server package:
    ```bash
    npm install -g serve
    ```
2.  Navigate to the project directory.
3.  Run the server:
    ```bash
    serve .
    ```
4.  Access via `http://localhost:3000`.

## 5. Environment Configuration
For the prototype, configuration is handled in `constants.ts`.
*   **Current User:** Modify `CURRENT_USER` in `constants.ts` to simulate different roles (Admin, Editor, Creator).
*   **Mock Data:** Content and Events are populated from `MOCK_CONTENT` and `MOCK_EVENTS`.

## 6. Verification
After deployment:
1.  Open the application in a browser.
2.  Navigate to the **Admin Portal**.
3.  Login with `admin123`.
4.  Go to **Testing** tab -> **Quick Health Check**.
5.  Ensure all checks return **PASS**.
