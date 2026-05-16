# Deployment Guide — Glucose v1.1.0

---

## Quick Start (5 minutes)

```bash
# 1. Build
pnpm run build

# 2. Deploy to production
pnpm run deploy

# 3. Verify
pnpm run deploy:verify

# Live: https://ai-tools.techbridge.edu.gh/glucose
```

---

## Pre-Deployment Checklist

- [ ] All changes committed to main branch
- [ ] `.env.local` has valid `VITE_GEMINI_API_KEY`
- [ ] Local build successful: `pnpm run build`
- [ ] Local dev server runs without errors: `pnpm run dev`
- [ ] E2E tests pass: navigate to E2E Test tab → Run Full Test Suite
- [ ] No console errors in browser DevTools

---

## Environment Configuration

### Development (.env.local)

```bash
# .env.local (not committed, local only)
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

**How to get API key:**
1. Go to https://aistudio.google.com/app/apikey
2. Create or select project
3. Generate new API key
4. Copy and paste into `.env.local`

### Production Configuration

- **Server:** `root@66.226.72.199` (Plesk/Ubuntu)
- **Path:** `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/`
- **URL:** `https://ai-tools.techbridge.edu.gh/glucose`
- **Env Vars:** Baked into built app via `VITE_` prefix

**To update production API key:**
1. Add to `.env.local`
2. Run `pnpm run build`
3. Run `pnpm run deploy`

---

## Build Process

### What Gets Built

```bash
$ pnpm run build
```

**Output: `dist/` folder**
```
dist/
├── index.html                        # Single-page app (2.2 KB)
├── assets/
│   ├── index-HASH.js                 # Main bundle (~271 KB)
│   ├── index-HASH.css                # Tailwind CSS (~50 KB)
│   ├── recharts-HASH.js              # Charts library (~379 KB)
│   └── idb-HASH.js                   # IndexedDB helpers (~3 KB)
├── auth/
│   └── index.html                    # OAuth callback handler
└── screenshots/
    └── e2e/
        ├── oauth-login-view.png
        ├── data-scan-interface.png
        ├── dashboard-stats-overview.png
        └── ... (6 screenshots total)
```

**Build Time:** ~5-7 seconds

**What's Included:**
- Vite production build (minified, optimized)
- Tailwind CSS (only used classes)
- Public assets (logo, screenshots)
- Source maps (for debugging)

**What's NOT Included:**
- node_modules (not deployed)
- Source TypeScript files
- Dev dependencies
- .git folder

---

## Deployment Process

### Step 1: Build Locally

```bash
pnpm run build
```

Verifies:
- No TypeScript errors
- All modules found
- Bundle generation succeeds

### Step 2: Deploy to Production

```bash
pnpm run deploy
```

**What `deploy.ps1` does:**
1. **SSH Connection:** Connects to `root@66.226.72.199`
2. **Create Directory:** Makes `/var/www/.../glucose/` directory
3. **Clear Old Files:** Removes previous deployment (clean deploy)
4. **SCP Upload:** Copies `dist/*` to remote server via secure copy
5. **Create .htaccess:** Writes SPA routing rules (allows React Router to work)
6. **Set Permissions:** Sets correct ownership and file modes
   - Directories: 755 (rwxr-xr-x)
   - Files: 644 (rw-r--r--)
   - .htaccess: 644

**Time:** 30-60 seconds

**Authentication:** SSH key-based (no password prompt if configured)

### Step 3: Verify Deployment

```bash
pnpm run deploy:verify
```

**Checks:**
- App responds to HTTP requests (`HEAD https://ai-tools.techbridge.edu.gh/glucose`)
- Screenshots accessible (`/screenshots/e2e/oauth-login-view.png`)
- Key UI elements load (e.g., "Blood Glucose Monitoring" text present)

**Output:**
```
✅ App is live! (attempt 1/12)
✅ oauth-login-view
✅ data-scan-interface
✅ dashboard-stats-overview

📊 Screenshot verification: 3/3 passed
✅ Deployment verified successfully!
🌐 Live URL: https://ai-tools.techbridge.edu.gh/glucose
```

---

## URL Routing (.htaccess)

**File:** Automatically created during deployment

**Content:**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /glucose/
  
  # Allow existing files and directories to pass through
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Everything else → index.html (React Router)
  RewriteRule ^ /glucose/index.html [QSA,L]
</IfModule>
```

**Why This Works:**
- `/glucose/rophe-logo.jpg` → served as-is (existing file)
- `/glucose/assets/...` → served as-is (existing files)
- `/glucose/screenshots/e2e/...` → served as-is (existing files)
- `/glucose/` → index.html (React Router handles routing)
- `/glucose/dashboard` → index.html → React Router shows Dashboard
- `/glucose/admin` → index.html → React Router shows Admin panel

---

## Troubleshooting

### App is blank/white screen

**Cause:** JavaScript failed to load or syntax error

**Fix:**
1. Open DevTools (F12) → Console tab
2. Look for errors like "Unexpected token", "Cannot find module"
3. Check if assets are loading: Network tab → look for 404s
4. If assets missing: re-run deployment
5. Clear browser cache: Cmd+Shift+Delete (or Ctrl+Shift+Delete on Windows)
6. Hard refresh: Cmd+Shift+R (or Ctrl+Shift+R)

### Screenshots not displaying in E2E tests

**Cause:** Screenshot files not deployed

**Fix:**
```bash
# Rebuild and redeploy
pnpm run build
pnpm run deploy

# Verify screenshots exist remotely
ssh root@66.226.72.199
ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/screenshots/e2e/
```

### Logo image broken

**Cause:** Incorrect image path

**Current:** `./rophe-logo.jpg` (relative, works with `/glucose/` base path)

**Verify:**
```bash
curl -I https://ai-tools.techbridge.edu.gh/glucose/rophe-logo.jpg
# Should return HTTP 200
```

### 404 errors on page reload

**Cause:** SPA routing not configured (no .htaccess)

**Fix:**
- Verify .htaccess created: `ssh root@... cat /path/.htaccess`
- If missing: manually create or re-run deploy
- Restart Nginx: `ssh root@... systemctl restart nginx`

### Database/settings lost after deployment

**Cause:** IndexedDB is browser-local (clearing cache wipes it)

**Prevent:**
- Users should export data: click "Export" button
- Import data on fresh browser: click "Import" button
- Data never synced to server (by design)

### Gemini API key errors on production

**Cause:** `.env.local` not in production build

**Why:** Environment variables only work if prefixed with `VITE_`
- ✅ `VITE_GEMINI_API_KEY` → included in build
- ❌ `GEMINI_API_KEY` → NOT included

**Fix:**
1. Verify `.env.local` has `VITE_GEMINI_API_KEY`
2. Rebuild: `pnpm run build`
3. Check that key is in built bundle:
   ```bash
   grep -r "VITE_GEMINI_API_KEY" dist/
   # Should find references in index-*.js
   ```
4. Redeploy: `pnpm run deploy`

---

## Rollback Procedure

**Note:** Current deployment script replaces all files (no backup).

**Manual Rollback:**
1. Connect to server: `ssh root@66.226.72.199`
2. If you have backups from previous deployment:
   ```bash
   cd /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/
   # Copy previous dist to glucose folder
   cp -r /path/to/backup/* glucose/
   ```
3. Restart Nginx: `systemctl restart nginx`

**Better Practice:**
1. Before deploying major changes, manually backup:
   ```bash
   tar -czf glucose-backup-$(date +%Y%m%d-%H%M%S).tar.gz glucose/
   ```
2. If needed, restore: `tar -xzf glucose-backup-*.tar.gz`

---

## Health Monitoring

### Manual Health Check

```bash
# Check if app responds
curl -I https://ai-tools.techbridge.edu.gh/glucose

# Should return:
# HTTP/2 200
# Content-Type: text/html
```

### Automated Verification

```bash
pnpm run deploy:verify
```

Runs after every deployment (recommended).

---

## Performance Optimization

### Browser Caching

Current setup uses hashed filenames for assets:
- `index-ABC123.js` → when code changes, new hash, cache busts automatically
- `index-XYZ789.css` → same for CSS

**Benefits:**
- Users get latest version automatically
- No stale asset issues
- Efficient caching

---

## Emergency Procedures

### App completely down

1. Check server status:
   ```bash
   ssh root@66.226.72.199 "systemctl status nginx"
   ```

2. Check disk space:
   ```bash
   ssh root@66.226.72.199 "df -h"
   ```

3. Restart Nginx:
   ```bash
   ssh root@66.226.72.199 "systemctl restart nginx"
   ```

4. Check file permissions:
   ```bash
   ssh root@66.226.72.199 "ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/index.html"
   # Should show: -rw-r--r--
   ```

5. If all else fails, redeploy:
   ```bash
   pnpm run build
   pnpm run deploy
   ```

---

## CI/CD Integration (Future)

To integrate into GitHub Actions:

```yaml
name: Deploy Glucose

on:
  push:
    branches: [main]
    paths: ['glucose/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: cd glucose && pnpm install
      
      - name: Build
        run: cd glucose && pnpm run build
      
      - name: Deploy
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: |
          cd glucose
          echo "$DEPLOY_KEY" > /tmp/deploy_key
          chmod 600 /tmp/deploy_key
          export SSH_KEY_PATH=/tmp/deploy_key
          pnpm run deploy
      
      - name: Verify
        run: cd glucose && pnpm run deploy:verify
```

---

## Maintenance Schedule

| Task | Frequency | Command |
|------|-----------|---------|
| Verify app is live | Daily | `pnpm run deploy:verify` |
| Check error logs | Weekly | `ssh root@... tail -f /var/log/nginx/error.log` |
| Backup database | Weekly | User-initiated export via app |
| Update dependencies | Monthly | `pnpm update && pnpm audit` |
| Full deployment test | Quarterly | Test deploy to staging server |

---

## Support

**Issues?**
1. Check troubleshooting section above
2. Review console errors (DevTools F12)
3. Check deployment log: `ssh root@... tail /tmp/deploy.log`
4. Contact: daniel.twum@techbridge.edu.gh

---

*Last updated: May 16, 2026*  
*Deployment process is automated and reliable*
