# Deployment Guide - AUCDT Website

**Version: 1.0**

## 1. Introduction

This guide provides instructions for building and deploying the AUCDT website. As a static Single-Page Application (SPA) built with React, it can be hosted on any modern static web hosting service.

## 2. Prerequisites

*   **Node.js and npm:** Ensure you have Node.js (version 16.x or later) and npm installed. You can download them from [nodejs.org](https://nodejs.org/).
*   **Source Code:** Access to the project's source code files (`index.html`, `index.tsx`, `App.tsx`, etc.).

## 3. Build Process

The application is built using a modern JavaScript bundler like Vite or Create React App. Since the current environment simulates this, the build process involves preparing the files for static hosting.

1.  **Place all source files** in a single directory. The file structure should be:
    ```
    /
    ├── index.html
    ├── index.tsx
    ├── App.tsx
    ├── metadata.json
    ├── components/
    │   ├── Header.tsx
    │   ├── ... (all other components)
    ├── utils/
    │   ├── logger.ts
    │   ├── testRunner.ts
    └── assets/
        └── (any local images or fonts)
    ```
2.  **Transpile TypeScript:** Use a tool like `tsc` or a bundler's built-in capabilities to convert `.tsx` files into browser-compatible JavaScript.
    *   Example command with `tsc`: `npx tsc` (requires a `tsconfig.json` file).
    *   Example with Vite: `npx vite build`. This will create a `dist` folder.

3.  **Output:** The build process will generate a `dist` (or similar) folder containing:
    *   `index.html`
    *   A bundled and minified JavaScript file (e.g., `index-*.js`).
    *   A bundled and minified CSS file (if CSS is extracted).
    *   Any static assets.

## 4. Deployment to a Static Host

This application is ideal for services that specialize in hosting static sites.

### Method 1: Netlify / Vercel (Recommended)

These platforms offer a seamless deployment experience directly from a Git repository.

1.  **Push your code** to a GitHub, GitLab, or Bitbucket repository.
2.  **Sign up** for a free account on [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/).
3.  **Create a new project/site** and connect it to your Git repository.
4.  **Configure build settings:**
    *   **Build Command:** `npm run build` (or the equivalent command for your project, e.g., `vite build`).
    *   **Publish Directory:** `dist` (or the name of your build output folder).
5.  **Deploy:** The platform will automatically pull your code, run the build command, and deploy the contents of the publish directory to their global CDN.
6.  Your site will be live at a provided URL, and future pushes to your main branch will trigger automatic redeployments.

### Method 2: Manual Deployment (e.g., AWS S3, Apache/Nginx)

You can also host the built files on any standard web server or cloud storage service.

1.  **Run the build process** locally as described in Section 3.
2.  **Upload the contents** of the `dist` folder to your hosting provider.
    *   **For AWS S3:** Create an S3 bucket, enable static website hosting, and upload the files.
    *   **For a traditional server (Apache/Nginx):** Copy the files to the web root directory (e.g., `/var/www/html`).
3.  **Configure the server:** Ensure your server is configured to handle client-side routing. All requests for non-existent paths should be redirected to `index.html`.
    *   **Nginx example:**
        ```nginx
        server {
          listen 80;
          server_name yourdomain.com;
          root /path/to/your/dist;
          index index.html;

          location / {
            try_files $uri /index.html;
          }
        }
        ```

## 5. Post-Deployment Checks

1.  Verify that the website loads correctly at its public URL.
2.  Test all navigation links and interactive elements.
3.  Confirm that the admin login functionality is working.
4.  Check the browser console for any errors.
