# Deployment Guide

## Production Build

To prepare the Animator Agent for production hosting:

```bash
npm run build
```

The system is configured via Vite to build the application into the `dist/` directory.

## Environment Variables

All secrets should be maintained remotely. 
If running end-to-end tests inside the CI/CD pipeline, ensure `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` is adjusted based on your containerization strategy.

## Deployment Target
The application is fully static (React Router is using client-side routing, so your host should redirect everything to `index.html`), making it perfect for deployment to Firebase Hosting, Vercel, or standard NGINX containers.
