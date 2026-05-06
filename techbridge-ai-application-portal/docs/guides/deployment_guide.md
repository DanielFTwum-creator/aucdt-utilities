# Techbridge AI Portal - Deployment Guide

**Version 3.0**

## 1. Introduction

This guide details the process for deploying the Techbridge AI Portal. As a static, client-side React application, it can be hosted on any modern static web hosting provider.

## 2. Prerequisites

-   Access to a static web hosting provider (e.g., Netlify, Vercel, AWS S3, GitHub Pages).

## 3. Pre-Deployment Configuration

### 3.1. Set the Admin Password
Before deploying, it is **highly recommended** to change the default admin password. Open the `App.tsx` file and change the `ADMIN_PASSWORD` constant to a new, strong, and unique password.

```typescript
// in App.tsx
const ADMIN_PASSWORD = 'Your_New_Strong_Password_Here!';
```

## 4. Build Process

The current application runs directly from source files without a formal build step. For a production deployment, all `.ts`, `.tsx`, `.html`, and other asset files in the project root should be uploaded to the hosting provider.

For a more optimized deployment, you would typically use a build tool like Vite or Create React App to compile, bundle, and minify the assets. If such a tool were added, the process would be:

1.  **Install Dependencies:** `npm install`
2.  **Build the Application:** `npm run build`
3.  This command would create a `dist` directory containing the optimized static files.

## 5. Deployment

Deploy the contents of the project's root directory (or the `dist` folder if a build step is added) to your chosen static hosting provider.

-   **Using a Drag-and-Drop Service (Netlify, Vercel):**
    1.  Log in to your provider's dashboard.
    2.  Drag the project folder into the deployment area.
    3.  The provider will automatically upload the files and provide you with a live URL.

-   **Using a Web Server (Nginx, Apache):**
    1.  Copy the project files to the webroot directory of your server (e.g., `/var/www/html`).
    2.  Ensure your web server is configured to serve `index.html` as the default file for the directory. For SPAs, you must configure URL rewriting to direct all routes to `index.html` so that client-side routing works correctly.