
# TUC Platform Deployment Guide

## 1. Build Environment
- **Node.js:** 18.x or 20.x
- **Package Manager:** npm
- **Build Tool:** Vite

## 2. Configuration
The platform requires a valid Google Gemini API Key.
- `process.env.API_KEY`: Mandatory for BridgeBot and AI services.

## 3. Build Process
```bash
npm install
npm run build
```

## 4. Hosting Recommendation
- **Vercel/Netlify:** Preferred for SPA routing and environment variable management.
- **Manual Nginx:** Ensure `try_files $uri $uri/ /index.html` is configured for React Router support.

---
**Institutional Motto:** "Design and Build a Nation!"
