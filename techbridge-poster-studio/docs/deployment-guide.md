# Deployment Guide — TechBridge Poster Studio

## Overview
TechBridge Poster Studio is a hybrid client-server application. The client (React/Vite) runs in browsers and mobile apps, while the server (`server.ts`) handles PDF/PNG export via Playwright.

---

## Development

Run locally:
```bash
npm install
npm run dev
```
- Client: Vite dev server (HMR enabled)
- Server: Express with Playwright (http://localhost:3000)
- API endpoint: `http://localhost:3000/api/generate`

---

## Production — Web (SPA)

The React/Vite build outputs a static bundle. Any HTTP server can serve it:

### Option A: Nginx (recommended for web)
```bash
npm run build
npm install -g http-server
http-server dist -p 3000
```

### Option B: Express static
```bash
npm run build
NODE_ENV=production npm run start
```

### Option C: Firebase Hosting, Netlify, Vercel
Push `dist/` to any static host.

---

## Production — Mobile (App Store / Play Store)

### Mobile App API Endpoint

The mobile app **cannot** run server.ts locally. Playwright/Chromium is a Node.js process that doesn't exist on mobile devices.

**Solution:** Deploy `server.ts` as a backend service. The mobile app calls the hosted endpoint.

### Step 1: Deploy Backend to Cloud Run

1. Create a `Dockerfile` for server.ts (already provided in the repo):
   ```dockerfile
   FROM node:24-slim
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --omit=dev
   COPY . .
   RUN npm run build
   ENV NODE_ENV=production
   EXPOSE 3000
   CMD ["npm", "run", "start"]
   ```

2. Deploy to Google Cloud Run:
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/techbridge-poster-studio
   gcloud run deploy techbridge-poster-studio \
     --image gcr.io/PROJECT_ID/techbridge-poster-studio \
     --platform managed \
     --region us-central1 \
     --memory 2Gi \
     --timeout 600
   ```

3. Note the service URL: `https://techbridge-poster-studio-XXXX.run.app`

### Step 2: Update Mobile App Configuration

In the Capacitor/React app, update the API endpoint:

**Development:**
- API endpoint: `http://localhost:3000/api/generate`

**Production:**
- API endpoint: `https://techbridge-poster-studio-XXXX.run.app/api/generate`

Use environment variables to switch between them:
```tsx
const API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://techbridge-poster-studio-XXXX.run.app'
  : 'http://localhost:3000';
```

### Step 3: Submit to App Stores

See `docs/mobile-gap-analysis.md` for App Store / Play Store submission checklist.

---

## Environment Variables

### Development
- `GEMINI_API_KEY` (optional, unused currently)
- `NODE_ENV=development`
- `DISABLE_HMR=false` (Vite HMR enabled)

### Production (Server)
- `NODE_ENV=production`
- `GEMINI_API_KEY` (optional, for future AI features)

### Production (Client)
- None required (no API keys in bundle)

---

## Monitoring & Logs

### Cloud Run
```bash
gcloud run services describe techbridge-poster-studio
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=techbridge-poster-studio" --limit=50
```

### Health Check
```bash
curl https://techbridge-poster-studio-XXXX.run.app/
```

---

## Scaling Considerations

- **PDF/PNG export** is CPU-intensive (Playwright + Chromium)
- Cloud Run auto-scales; set memory to 2Gi for reliability
- Request timeout: 600s (enough for complex posters)
- Max concurrent requests: depends on Cloud Run plan

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors from mobile app | Ensure API endpoint is publicly accessible; add CORS headers if calling from web |
| Export timeout | Increase Cloud Run timeout (default 300s) |
| 404 on `/api/generate` | Check that `npm run build` completed before deployment |
| Chromium not found | Ensure runtime uses `node:24-slim` (Debian), not Alpine |

---

*Last updated: 2026-05-04*
