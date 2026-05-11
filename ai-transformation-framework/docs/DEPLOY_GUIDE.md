# Deployment Guide

## 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

## 2. Build Process
To build the application for production:

```bash
npm install
npm run build
```

This will generate a `dist` folder containing the static assets.

## 3. Hosting
The application is a static site and can be deployed to any static hosting provider:

- **Vercel/Netlify:** Connect your repository and set the build command to `npm run build` and output directory to `dist`.
- **GitHub Pages:** Use a workflow to build and deploy the `dist` folder.
- **Docker/Container:** Use a simple Nginx container to serve the `dist` folder.

## 4. Environment Variables
Ensure the following environment variables are set in your production environment:

- `VITE_API_URL`: (Optional) URL for backend API if applicable.

## 5. Verification
After deployment, verify:
1. The application loads correctly.
2. PDF generation works.
3. Admin routes are accessible via `/admin/login`.
