# LuxThumb Designer — Deployment Guide

**Version:** 1.0  
**Date:** 9 May 2026  
**Target Environment:** Plesk/Ubuntu Server (66.226.72.199) or Cloud Run  
**Domain:** `luxthumb.techbridge.edu.gh`  

---

## 1. Pre-Deployment Checklist

- [ ] Node.js 18+ installed on server
- [ ] npm 9+ installed
- [ ] Git access to repository
- [ ] Gemini API key obtained (from Google AI Studio)
- [ ] SSL certificate configured (or auto-generated via Plesk)
- [ ] Domain DNS pointed to server IP
- [ ] Plesk panel access (or Cloud Run project credentials)

---

## 2. Development Build

### 2.1 Clone Repository
```bash
cd /path/to/projects
git clone https://github.com/techbridge/aucdt-utilities.git
cd aucdt-utilities/luxthumb-agent
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Create Environment File
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
GEMINI_API_KEY=your_gemini_api_key_here
APP_URL=https://luxthumb.techbridge.edu.gh
```

### 2.4 Verify Installation
```bash
npm run lint          # TypeScript check
npm test              # Playwright tests (requires dev server)
npm run dev           # Run dev server (port 3000)
```

Access at `http://localhost:3000` to verify UI loads and theme switching works.

---

## 3. Production Build

### 3.1 Build Artifacts
```bash
npm run build
```

Output: `dist/` directory with minified, optimized files:
- `index.html` (entry point)
- `assets/` (JavaScript bundles, CSS)
- `assets/` (static images and fonts)

### 3.2 Build Verification
```bash
npm run preview
```

Serve `dist/` locally on port 4173 to verify production build loads correctly.

### 3.3 Bundle Size (Typical)
- `index.html`: ~5 KB
- JavaScript bundles: ~250–350 KB (minified, gzipped)
- Total: ~400 KB (gzipped)

---

## 4. Deployment: Plesk (Recommended for TUC)

### 4.1 SSH into Server
```bash
ssh root@66.226.72.199
```

### 4.2 Create Application Directory
```bash
mkdir -p /var/www/vhosts/techbridge.edu.gh/luxthumb
cd /var/www/vhosts/techbridge.edu.gh/luxthumb
```

### 4.3 Deploy Build Artifacts
Option A: Build on server
```bash
git clone <repo> source
cd source/luxthumb-agent
npm install
npm run build
cp -r dist/* /var/www/vhosts/techbridge.edu.gh/luxthumb/
```

Option B: Build locally, upload via SFTP
```bash
# On local machine:
npm run build
# Upload dist/ folder to /var/www/vhosts/techbridge.edu.gh/luxthumb/ via SFTP or SCP
```

### 4.4 Configure Plesk Subdomain
1. Log in to Plesk panel (`https://66.226.72.199:8443`)
2. Navigate to **Domains → techbridge.edu.gh → Subdomains**
3. Create subdomain:
   - **Name:** `luxthumb`
   - **Document Root:** `/var/www/vhosts/techbridge.edu.gh/luxthumb`
4. Click **OK**

### 4.5 Configure SSL Certificate
1. In Plesk, select subdomain **luxthumb.techbridge.edu.gh**
2. Navigate to **SSL/TLS Certificate**
3. Select **Let's Encrypt** (free) or Comodo (paid)
4. Click **Install**

### 4.6 Configure Apache VirtualHost
Plesk auto-generates, but verify `.htaccess` in document root:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  # Serve static files as-is
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  # SPA: rewrite all requests to index.html
  RewriteRule ^ /index.html [QSA,L]
</IfModule>
```

### 4.7 Configure Environment Variables
Create `.env` in document root:
```
GEMINI_API_KEY=your_production_gemini_api_key
APP_URL=https://luxthumb.techbridge.edu.gh
```

### 4.8 Verify Deployment
```bash
curl -I https://luxthumb.techbridge.edu.gh/
# Expected: 200 OK with HTML response

curl https://luxthumb.techbridge.edu.gh/ | head -20
# Should see <html> with proper meta tags
```

---

## 5. Deployment: Cloud Run (Google Cloud)

### 5.1 Create Dockerfile
Save in project root:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist /app/dist
EXPOSE 8080

# Serve dist/ folder with a simple HTTP server
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "8080"]
```

### 5.2 Build & Push Container Image
```bash
gcloud builds submit --tag gcr.io/your-project/luxthumb-agent:latest
```

### 5.3 Deploy to Cloud Run
```bash
gcloud run deploy luxthumb-agent \
  --image gcr.io/your-project/luxthumb-agent:latest \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key,APP_URL=https://luxthumb.techbridge.edu.gh
```

### 5.4 Configure Custom Domain
1. In Cloud Run console, select service **luxthumb-agent**
2. Click **Manage Custom Domains**
3. Add `luxthumb.techbridge.edu.gh`
4. Verify DNS records (Cloud Run provides CNAME target)
5. Configure SSL (auto-generated)

---

## 6. Environment Variables

### 6.1 Required (Production)
| Variable | Value | Source |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key | Google AI Studio dashboard |
| `APP_URL` | `https://luxthumb.techbridge.edu.gh` | Your domain |

### 6.2 Optional (Development)
| Variable | Value | Default |
|---|---|---|
| `DISABLE_HMR` | `true` to disable hot module reload | `false` (HMR enabled) |

### 6.3 Obtain Gemini API Key
1. Visit `https://ai.google.dev/`
2. Click **Get API Key**
3. Create new API key in Google Cloud Console
4. Copy key and paste into `.env.local` or Cloud Run environment

### 6.4 Security Best Practices
- Never commit `.env.local` to Git (add to `.gitignore`)
- Use Plesk Secrets Manager or Cloud Run Secret Manager for sensitive keys
- Rotate API keys every 6 months
- Monitor API key usage in Google Cloud Console

---

## 7. Post-Deployment Verification

### 7.1 Health Check
```bash
curl -I https://luxthumb.techbridge.edu.gh/
```
Expected: `200 OK`, `Content-Type: text/html`

### 7.2 Asset Loading
Open browser DevTools (F12):
1. Navigate to `https://luxthumb.techbridge.edu.gh/`
2. Check **Console** tab for errors (should be empty)
3. Check **Network** tab: all `.js`, `.css`, `.png` files should load (status 200)
4. Verify theme CSS loads: inspect `<html>` for `data-theme` attribute

### 7.3 Functionality Test
1. Fill form with test data
2. Click "Engage Engine"
3. Verify Gemini API responds with generated prompts (check Network tab)
4. Test theme switcher (click accessibility button, switch theme, verify `data-theme` changes)
5. Test export: click PNG, verify browser download
6. Open admin panel (admin button), enter password `admin123`
7. Verify audit logs appear

### 7.4 Google Analytics
1. In browser, open **Network** tab
2. Look for requests to `googletagmanager.com/gtag/js?id=G-FKXTELQ71R`
3. Expected: status 200 (GA script loaded)
4. Open GA dashboard (`https://analytics.google.com`) to verify events are tracked

---

## 8. Monitoring & Logging

### 8.1 Plesk Logs
```bash
# Access via SSH
tail -f /var/log/apache2/luxthumb.techbridge.edu.gh-access.log
tail -f /var/log/apache2/luxthumb.techbridge.edu.gh-error.log
```

### 8.2 Cloud Run Logs
```bash
gcloud run services describe luxthumb-agent --region us-central1
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=luxthumb-agent" --limit 50 --format json
```

### 8.3 Client-Side Monitoring
- Errors logged to browser console (F12 → Console)
- Audit logs stored in browser IndexedDB
- Export logs regularly via Admin Panel for review

### 8.4 Performance Monitoring
- Google Analytics tracks page load time, user interactions
- Check GA dashboard for Core Web Vitals (LCP, FID, CLS)
- Monitor Gemini API latency in Network tab

---

## 9. Troubleshooting

### 9.1 Static Assets Return 404
- **Issue:** CSS, JS files not found
- **Solution:** Verify `.htaccess` rewrite rules are correct; check document root path

### 9.2 Theme Switcher Not Working
- **Issue:** Theme CSS variables not applied
- **Solution:** Verify `src/styles/theme.css` is imported in `src/index.css`; check browser DevTools for CSS load errors

### 9.3 Gemini API 401 Unauthorized
- **Issue:** API key invalid or expired
- **Solution:** Regenerate API key in Google Cloud Console; update `.env` and redeploy

### 9.4 PDF Export Fails
- **Issue:** jsPDF library not loaded
- **Solution:** Check bundle includes `node_modules/jspdf`; rebuild with `npm run build`

### 9.5 Admin Panel Password Incorrect
- **Issue:** Password `admin123` not working
- **Solution:** Verify no typos; hard-reset browser cache (Ctrl+Shift+Delete)

---

## 10. Maintenance

### 10.1 Regular Tasks
- **Weekly:** Review audit logs (via Admin Panel) for unusual activity
- **Monthly:** Export and archive audit logs
- **Quarterly:** Update npm dependencies (`npm update`)
- **Semi-annually:** Rotate Gemini API key

### 10.2 Backup
- Git repository is source backup
- No database; all data is browser-local (IndexedDB)
- Recommend exporting user designs periodically (via JSON export)

### 10.3 Scaling
- Current deployment is single-instance (no scaling needed for typical usage)
- If load increases, scale Cloud Run service or add load balancer to Plesk

---

## 11. Rollback

### 11.1 Revert to Previous Version (Plesk)
```bash
cd /var/www/vhosts/techbridge.edu.gh/luxthumb
git checkout <previous-commit>
npm run build
cp -r dist/* .
systemctl restart apache2
```

### 11.2 Revert to Previous Version (Cloud Run)
```bash
gcloud run deploy luxthumb-agent --image gcr.io/your-project/luxthumb-agent:<previous-tag>
```

---

## 12. Additional Resources

- **SRS:** `docs/TUC-ICT-SRS-2026-LUXTHUMB.md`
- **Admin Guide:** `docs/ADMIN_GUIDE.md`
- **Testing:** `docs/TESTING_GUIDE.md`
- **Architecture:** `docs/architecture.svg`

---

**Deployment Owner:** ICT Department, TUC  
**Last Updated:** 9 May 2026  
**Support:** Contact daniel.twum@techbridge.edu.gh
