# DfS Website — Deployment Steps

**Project**: Drumming for SEL Success Website  
**Deployment Target**: `https://ai-tools.techbridge.edu.gh/dfs-website`  
**Backend Port**: 3012 (internal, managed by PM2)  
**PM2 App**: `dfs-website`  
**Server**: Plesk (root@techbridge.edu.gh)  
**Remote Path**: `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs-website/`

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
# Deploy (server-side build + PM2 restart)
./deploy.ps1
```

**What the script does:**
1. Validates `.env` for required keys
2. Pushes the current branch to GitHub (non-fatal if it fails)
3. Uploads `.env` to the server, then runs a server-side build:
   sparse `git clone`, `pnpm install`, `pnpm build`
4. Syncs `dist/` to the web root via `rsync --delete`
5. Copies backend files (`server.ts`, `package.json`, `pnpm-lock.yaml`) to remote
6. Installs backend dependencies (`pnpm install --prod`)
7. Creates Apache `.htaccess` with:
   - URL rewriting for SPA routing
   - Cache-busting headers (immutable for hash-busted assets, no-cache for HTML)
8. Copies `.env` to remote and fixes ownership/permissions
9. Restarts the backend via PM2 (`pm2 reload dfs-website`, or `pm2 start` on
   first deploy) bound to `PORT=3012`
10. Runs health checks (frontend presence, port 3012 listening, HTTP health)

### 2. **Manual SSH Deployment (If Script Fails)**

```bash
# SSH to server
ssh root@techbridge.edu.gh

# Create directory
mkdir -p /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs-website/

# From local machine, copy files
scp -r dist/* root@techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs-website/dist/
scp server.ts package.json pnpm-lock.yaml root@techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs-website/

# On remote, install dependencies
cd /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs-website/
pnpm install --prod

# Start backend via PM2 (port 3012)
PORT=3012 pm2 start server.ts --name dfs-website --interpreter npx --interpreter-args tsx
pm2 save

# Verify
ss -tlnp | grep 3012
curl http://localhost:3012/api/health 2>/dev/null | head -20
```

---

## Post-Deployment Verification

### 1. **Check Frontend**
```bash
curl -s https://ai-tools.techbridge.edu.gh/dfs-website/ | grep -o '<title>.*</title>'
# Expected: <title>Drumming for SEL Success</title>
```

### 2. **Check Backend Health**
```bash
curl -s http://localhost:3012/api/health
# Expected: JSON response or { "status": "ok" }
```

### 3. **Check Port Listening** (on server)
```bash
ssh root@techbridge.edu.gh 'ss -tlnp | grep 3012'
# Expected: LISTEN  0.0.0.0:3012
```

### 4. **Test Contact Form**
1. Navigate to https://ai-tools.techbridge.edu.gh/dfs-website
2. Go to **Contact** page
3. Fill out inquiry form
4. Submit
5. Check `sbferrar10@gmail.com` for received email

### 5. **Review Logs**
```bash
ssh root@techbridge.edu.gh 'pm2 logs dfs-website --lines 50 --nostream'
```

---

## Configuration Reference

### Environment Variables (`.env`)
| Variable | Source | Required | Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | Google AI Studio | ✅ Yes | Gemini API calls for AI agent |
| `GMAIL_USER` | Gmail Account | ✅ Yes | Email account for contact form notifications |
| `GMAIL_APP_PASSWORD` | Gmail App Passwords | ✅ Yes | 16-char app-specific password (not regular password) |
| `APP_URL` | Deployment Target | ✅ Yes | URL base (e.g., `https://ai-tools.techbridge.edu.gh/dfs-website`) |

### Apache Configuration (`.htaccess`)
The deployment script generates `.htaccess` in `dist/` with:
- **SPA Routing**: All non-file/non-directory requests rewritten to `index.html`
- **Cache Control**:
  - Assets (`.js`, `.css`, `.png`, etc.) → `max-age=31536000` (1 year, immutable)
  - HTML → `no-cache, no-store, must-revalidate`

### Backend Server (`server.ts`)
- **Port**: 3012 (overridable via `PORT` env var)
- **Entry Point**: `server.ts` (Express + Vite dev/production middleware)
- **Process Manager**: PM2 app `dfs-website` (interpreter `npx tsx`)
- **Logging**: `pm2 logs dfs-website` (PM2-managed)

---

## Rollback Procedure

If deployment fails or needs rollback:

```bash
# SSH to server
ssh root@techbridge.edu.gh

# Stop backend
pm2 stop dfs-website

# Remove deployed files
rm -rf /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs-website/dist/*

# Redeploy a known-good commit from local, then:
pm2 restart dfs-website
```

---

## Troubleshooting

### Issue: Port 3012 not listening after deployment

**Cause**: Backend failed to start (likely a port collision, missing `.env`, or dependencies). This is the known PM2 SSH-disown symptom — check restart count.

**Solution**:
```bash
ssh root@techbridge.edu.gh
pm2 describe dfs-website        # check restart count + status
pm2 logs dfs-website --lines 50 --nostream --err   # EADDRINUSE means port clash
ss -tlnp | grep 3012           # confirm who owns the port
cd /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs-website/
pnpm install --prod            # reinstall deps if needed
pm2 restart dfs-website
```

### Issue: EADDRINUSE / port already in use

**Cause**: Another PM2 app already owns the configured port. Port assignments
are registered in the shared `ecosystem.config.js` on the server.

**Solution**:
```bash
ssh root@techbridge.edu.gh
grep -nE "name:|PORT:" /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ecosystem.config.js
# dfs-website is registered on PORT 3012 — confirm nothing else uses it
```

### Issue: Emails not sending from contact form

**Cause**: Missing or invalid Gmail credentials in `.env`.

**Solution**:
1. Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `.env`
2. Generate a fresh app password at https://myaccount.google.com/apppasswords
3. Update `.env` and redeploy: `scp .env root@techbridge.edu.gh:/var/www/vhosts/.../dfs-website/.env`

### Issue: "GEMINI_API_KEY missing" error

**Cause**: `.env` not copied to remote or contains blank value.

**Solution**:
```bash
ssh root@techbridge.edu.gh
grep GEMINI_API_KEY /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs-website/.env
# Should return: GEMINI_API_KEY=AIzaSy...
# If blank, copy fresh .env: scp .env root@techbridge.edu.gh:.../.env
```

---

## Post-Deployment Next Steps

1. **Update DNS** (if needed): Ensure `ai-tools.techbridge.edu.gh` resolves to the Plesk server
2. **Monitor Logs**: Watch `pm2 logs dfs-website` for errors in first 24 hours
3. **Backup**: Commit `.env.example` updates to git (never commit `.env` itself)
4. **Notify Stakeholders**: Confirm deployment with Steve Ferraris (DfS contact)

---

*Last updated: June 2026*  
*Deployment script: `./deploy.ps1`*  
*SRS reference: `./docs/SRS.md`*
