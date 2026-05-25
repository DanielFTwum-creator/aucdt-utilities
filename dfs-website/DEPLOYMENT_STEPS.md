# DfS Website — Deployment Steps

**Project**: Drumming for SEL Success Website  
**Deployment Target**: `https://ai-tools.techbridge.edu.gh/dfs`  
**Backend Port**: 3007 (internal, proxied via Apache .htaccess)  
**Server**: Plesk (root@66.226.72.199)  
**Remote Path**: `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs/`

---

## Pre-Deployment Checklist

- [ ] **Verify `.env` exists** — contains `GEMINI_API_KEY`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`
- [ ] **Test locally** — run `pnpm run dev` and verify all pages load
- [ ] **Build locally** — run `pnpm run build` and confirm `/dist` is created
- [ ] **Health check** — confirm `index.html`, `server.ts`, and assets are in `/dist`

---

## Deployment Process

### 1. **Automated Deployment (Recommended)**

From the project root (`C:\Development\github\aucdt-utilities\dfs-website`):

```powershell
# Deploy with automatic build
./deploy.ps1

# Deploy without rebuild (if already built)
./deploy.ps1 -Build:$false
```

**What the script does:**
1. Validates `.env` for required keys
2. Builds the React app via Vite (`pnpm run build`)
3. Creates remote directory structure
4. Copies frontend files (`dist/*`) to remote
5. Copies backend files (`server.ts`, `package.json`) to remote
6. Installs backend dependencies (`npm install --omit=dev`)
7. Creates Apache `.htaccess` with:
   - URL rewriting for SPA routing
   - API proxy to port 3007 (`/api/*` → `localhost:3007/api/*`)
   - Cache-busting headers (immutable for hash-busted assets, no-cache for HTML)
8. Copies `.env` to remote (permissions: 644)
9. Kills any existing port 3007 process
10. Starts backend via `tsx` in a detached process (`setsid nohup`)
11. Runs health checks (frontend presence, backend running, port listening)

### 2. **Manual SSH Deployment (If Script Fails)**

```bash
# SSH to server
ssh root@66.226.72.199

# Create directory
mkdir -p /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs/

# From local machine, copy files
scp -r dist/* root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs/
scp server.ts package.json root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs/

# On remote, install dependencies
cd /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs/
npm install --omit=dev

# Start backend
NODE_ENV=production setsid nohup tsx server.ts > server.log 2>&1 < /dev/null &

# Verify
ss -tlnp | grep 3007
curl http://localhost:3007/api/health 2>/dev/null | head -20
```

---

## Post-Deployment Verification

### 1. **Check Frontend**
```bash
curl -s https://ai-tools.techbridge.edu.gh/dfs/ | grep -o '<title>.*</title>'
# Expected: <title>Drumming for SEL Success</title>
```

### 2. **Check Backend Health**
```bash
curl -s http://localhost:3007/api/health
# Expected: JSON response or { "status": "ok" }
```

### 3. **Check Port Listening** (on server)
```bash
ssh root@66.226.72.199 'ss -tlnp | grep 3007'
# Expected: LISTEN  127.0.0.1:3007
```

### 4. **Test Contact Form**
1. Navigate to https://ai-tools.techbridge.edu.gh/dfs
2. Go to **Contact** page
3. Fill out inquiry form
4. Submit
5. Check `sbferrar10@gmail.com` for received email

### 5. **Review Logs**
```bash
ssh root@66.226.72.199 'tail -50 /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs/server.log'
```

---

## Configuration Reference

### Environment Variables (`.env`)
| Variable | Source | Required | Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | Google AI Studio | ✅ Yes | Gemini API calls for AI agent |
| `GMAIL_USER` | Gmail Account | ✅ Yes | Email account for contact form notifications |
| `GMAIL_APP_PASSWORD` | Gmail App Passwords | ✅ Yes | 16-char app-specific password (not regular password) |
| `APP_URL` | Deployment Target | ✅ Yes | URL base (e.g., `https://ai-tools.techbridge.edu.gh/dfs`) |

### Apache Configuration (`.htaccess`)
The deployment script generates `.htaccess` with:
- **SPA Routing**: All non-file/non-directory requests rewritten to `/dfs/index.html`
- **API Proxy**: `/api/*` requests proxied to `http://localhost:3007/api/*`
- **Cache Control**:
  - Assets (`.js`, `.css`, `.png`, etc.) → `max-age=31536000` (1 year, immutable)
  - HTML → `max-age=0` (no-cache, must-revalidate)

### Backend Server (`server.ts`)
- **Port**: 3007
- **Entry Point**: `server.ts` (Express + Vite dev/production middleware)
- **Process Manager**: `setsid nohup` (detached process, survives SSH disconnect)
- **Logging**: `server.log` (append mode)

---

## Rollback Procedure

If deployment fails or needs rollback:

```bash
# SSH to server
ssh root@66.226.72.199

# Stop backend
fuser -k 3007/tcp

# Remove deployed files
rm -rf /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs/*

# Restore previous version (if git backup exists)
git pull && npm install --omit=dev
NODE_ENV=production setsid nohup tsx server.ts > server.log 2>&1 < /dev/null &
```

---

## Troubleshooting

### Issue: Port 3007 not listening after deployment

**Cause**: Backend failed to start (likely missing `.env` or dependencies).

**Solution**:
```bash
ssh root@66.226.72.199
cd /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs/
tail -50 server.log
npm install --omit=dev  # Reinstall deps
NODE_ENV=production tsx server.ts  # Run in foreground to see errors
```

### Issue: 404 errors on contact form submission

**Cause**: API proxy route not matching (check `.htaccess` RewriteRule).

**Solution**:
```bash
ssh root@66.226.72.199
cat /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs/.htaccess
# Verify: RewriteRule ^api/(.*)$ http://localhost:3007/api/$1 [P,L]
# If missing, redeploy script or manually add
```

### Issue: Emails not sending from contact form

**Cause**: Missing or invalid Gmail credentials in `.env`.

**Solution**:
1. Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `.env`
2. Generate a fresh app password at https://myaccount.google.com/apppasswords
3. Update `.env` and redeploy: `scp .env root@66.226.72.199:/var/www/vhosts/.../dfs/.env`

### Issue: "GEMINI_API_KEY missing" error

**Cause**: `.env` not copied to remote or contains blank value.

**Solution**:
```bash
ssh root@66.226.72.199
grep GEMINI_API_KEY /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs/.env
# Should return: GEMINI_API_KEY=AIzaSy...
# If blank, copy fresh .env: scp .env root@66.226.72.199:.../.env
```

---

## Post-Deployment Next Steps

1. **Update DNS** (if needed): Ensure `ai-tools.techbridge.edu.gh` resolves to the Plesk server
2. **Monitor Logs**: Watch `server.log` for errors in first 24 hours
3. **Backup**: Commit `.env.example` updates to git (never commit `.env` itself)
4. **Notify Stakeholders**: Confirm deployment with Steve Ferraris (DfS contact)

---

*Last updated: May 2026*  
*Deployment script: `./deploy.ps1`*  
*SRS reference: `./docs/SRS.md`*
