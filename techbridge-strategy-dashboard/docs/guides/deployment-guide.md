# TechBridge Dashboard - Deployment Guide

## 1. Overview
The TechBridge Dashboard is a **Single Page Application (SPA)** built with React. It requires no server-side runtime (like Node.js or Python) for the dashboard visualization itself, as it is a client-side application using ESM (ES Modules). It can be hosted on any static file server or CDN.

## 2. Prerequisites
*   **Node.js**: v18.0.0 or higher (required only for Playwright testing or local development tools).
*   **Git**: For version control.
*   **Hosting Account**: Netlify, Vercel, GitHub Pages, or AWS S3.

## 3. Local Development

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/techbridge-uc/dashboard.git
    cd dashboard
    ```

2.  **Install Dependencies** (for Playwright testing only):
    ```bash
    npm install
    ```

3.  **Run Application**:
    Since this project uses ES Modules via CDN, you can serve it with any static server:
    ```bash
    npx serve .
    ```
    Open `http://localhost:3000` in your browser.

## 4. Production Build & Deployment

### Option A: Vercel (Recommended)
1.  Push your code to a GitHub repository.
2.  Log in to Vercel and click "Add New Project".
3.  Select your repository.
4.  **Build Command**: Leave empty (No build step required for this ESM architecture).
5.  **Output Directory**: `.` (Root).
6.  Click **Deploy**.

### Option B: Netlify
1.  Drag and drop the project folder into Netlify Drop.
2.  **OR** Connect via Git:
    *   **Build Command**: (Empty)
    *   **Publish Directory**: `/`

### Option C: Apache/Nginx
1.  Upload all files (`index.html`, `index.tsx`, `App.tsx`, `types.ts`, `components/`, `assets/`) to your `public_html` or `/var/www/html` directory.
2.  **Important**: Configure your server to redirect all 404s to `index.html` to support Client-Side Routing (if `react-router` is added in the future).

## 5. Post-Deployment Verification
1.  Navigate to your live URL (e.g., `https://dashboard.techbridge.edu.gh`).
2.  Verify the Executive Briefing loads.
3.  Check the Console (F12) for any CORS errors related to the CDN imports.
4.  Run the **System Health** diagnostics in the app to confirm integrity.

## 6. Environment Variables
Currently, the application uses hardcoded configuration for simplicity. For a secure production environment, consider moving the Admin Password to an environment variable during a build step if migrating to a bundler like Vite.