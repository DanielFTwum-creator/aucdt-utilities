# Orbit Walk — Deployment Guide

## Environment Requirements
- **Operating System:** Ubuntu 22.04+ / Docker / Cloud Run
- **Runtime:** Node.js 20.x or higher
- **Resources:** 1GB RAM minimum (Puppeteer requirement)

## Environment Configuration
Create a `.env` file in the project root with the following variables:
```env
GEMINI_API_KEY=your_gemini_key
ADMIN_PASSWORD=your_admin_secret
JWT_SECRET=your_jwt_signature_secret
NODE_ENV=production
```

## Installation & Build
1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Build Client Portal:**
   ```bash
   npm run build
   ```
   *Note: This generates the `dist` folder served by the Express backend.*

## Execution
### Development Mode
Runs the `tsx` server with Vite HMR middleware:
```bash
npm run dev
```

### Production Mode
Serves static assets and provides API endpoints:
```bash
NODE_ENV=production node server.ts
```

## Infrastructure Configuration
### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name movement.techbridge.edu.gh;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Verification Checklist
- [ ] Accessibility: Run `npm run lint` for type checks.
- [ ] Security: Verify `/docs/audit.log` is created on first login.
- [ ] Audio: Test high-frequency dings in a modern browser.
