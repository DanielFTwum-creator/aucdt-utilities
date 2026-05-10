# TUC AI Lab Catalog — Deployment Guide

**Complete guide for deploying to production on Plesk/Ubuntu**

---

## Quick Start

### Windows (PowerShell)
```powershell
# Build and deploy
./deploy.ps1 -Build

# Just deploy (if already built)
./deploy.ps1
```

### macOS/Linux (Bash)
```bash
# Build and deploy
./deploy.sh --build

# Just deploy (if already built)
./deploy.sh
```

---

## Server Configuration

### Target Environment
- **Host:** 66.226.72.199 (Plesk-managed Ubuntu server)
- **Domain:** ai-tools.techbridge.edu.gh
- **Deployment Path:** `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab`
- **Public URL:** https://ai-tools.techbridge.edu.gh/ai-lab
- **Web Server:** Apache 2.4+ with mod_rewrite enabled

### Prerequisites

1. **SSH Access**
   - SSH key configured: `~/.ssh/id_rsa`
   - Public key added to server: `~/.ssh/id_rsa.pub`
   - SSH agent running (Windows: use Git Bash or OpenSSH)

2. **Build Environment**
   - Node.js 18+ installed
   - pnpm installed: `npm install -g pnpm`
   - Vite build tools available

3. **Server Access**
   - Plesk admin account (for configuration)
   - SSH access as root or privileged user
   - Apache document root permissions

---

## Deployment Steps

### Step 1: Build Locally

```bash
# Install dependencies
pnpm install

# Build production bundle
pnpm build
# Creates optimized dist/ directory

# Verify build
ls -la dist/
# Should contain: index.html, assets/, and other files
```

### Step 2: Test Locally (Optional)

```bash
# Preview the production build locally
pnpm preview
# Starts local server at http://localhost:4173

# Test in browser:
# - Navigation works
# - All resources load
# - No console errors
# - Theme switching works
# - Admin login works

# Stop with Ctrl+C
```

### Step 3: Deploy to Production

#### Windows (PowerShell)
```powershell
# Deploy with build
./deploy.ps1 -Build

# Or, deploy pre-built dist/
./deploy.ps1

# Specify different environment
./deploy.ps1 production

# Verbose output
./deploy.ps1 | Write-Host -ForegroundColor Yellow
```

#### macOS/Linux (Bash)
```bash
# Deploy with build
./deploy.sh --build

# Or, deploy pre-built dist/
./deploy.sh

# Specify different environment
./deploy.sh staging

# View detailed output
./deploy.sh --build 2>&1 | tee deploy.log
```

### Step 4: Verify Deployment

#### Check URL
```bash
# In browser:
https://ai-tools.techbridge.edu.gh/ai-lab

# Or via curl:
curl -I https://ai-tools.techbridge.edu.gh/ai-lab
# Should return 200 OK
```

#### Check Server Logs
```bash
# SSH to server
ssh root@66.226.72.199

# View Apache access logs
tail -f /var/log/apache2/ai-tools.techbridge.edu.gh-access.log

# View Apache error logs
tail -f /var/log/apache2/ai-tools.techbridge.edu.gh-error.log

# Exit with Ctrl+C
exit
```

#### Verify Files
```bash
# SSH to server
ssh root@66.226.72.199

# Check deployment path
ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/

# Should contain:
# - index.html
# - assets/
# - .htaccess
# - privacy.html
# - DEPLOYMENT_MANIFEST.json

# Check .htaccess permissions
cat /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/.htaccess

exit
```

---

## Deployment Script Details

### What the script does:

1. **Validation**
   - Checks dist/ directory exists
   - Verifies SSH key is configured
   - Confirms remote host is accessible

2. **Package Preparation**
   - Copies dist/ files to temporary staging directory
   - Creates .htaccess with SPA routing rules
   - Includes privacy.html and environment examples
   - Generates DEPLOYMENT_MANIFEST.json with metadata

3. **SSH Deployment**
   - Creates remote directory structure: `mkdir -p $REMOTE_PATH`
   - Clears old files: `rm -rf $REMOTE_PATH/*`
   - Transfers files: `scp -r ./dist-deploy/* $REMOTE_HOST:$REMOTE_PATH/`
   - Sets permissions: `chmod 755 $REMOTE_PATH`, `chmod 644 .htaccess`

4. **Cleanup**
   - Removes temporary staging directory
   - Reports deployment summary and next steps

### Environment Variables (Optional)

Create `.env.production` for production-specific configuration:

```bash
# .env.production
VITE_GEMINI_API_KEY=your_api_key_here
VITE_ANALYTICS_ID=G-FKXTELQ71R
NODE_ENV=production
```

Deploy it:
```bash
scp .env.production root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/.env
```

---

## SPA Routing (.htaccess)

The deployment script automatically creates `.htaccess` for React SPA routing:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-lab/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /ai-lab/index.html [QSA,L]
</IfModule>
```

**How it works:**
1. If the request is for a real file (-f) or directory (-d), serve it as-is
2. Otherwise, rewrite all requests to index.html
3. React Router handles client-side routing

**This allows:**
- Direct links to routes work (e.g., `/ai-lab/resources/search`)
- Browser back/forward buttons work
- Bookmarks are preserved

---

## Troubleshooting

### SSH Connection Failed

**Error:** `ssh: command not found` or `ssh: Could not resolve hostname`

**Solution:**
- Ensure SSH is installed: `ssh -v` should show version info
- For Windows, use OpenSSH (included in Windows 10+) or Git Bash
- Verify SSH key exists: `ls ~/.ssh/id_rsa`
- Test SSH connection: `ssh root@66.226.72.199 "echo OK"`

### SCP Transfer Failed

**Error:** `scp: command not found` or `scp: Permission denied`

**Solution:**
- Ensure SCP is available (bundled with SSH)
- Verify permissions on server: `ssh root@66.226.72.199 "ls -la /var/www/vhosts/"`
- Check that remote directory exists: `ssh root@66.226.72.199 "mkdir -p /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab"`

### 404 Errors After Deployment

**Symptom:** App loads but all routes show 404, CSS/JS not found

**Causes:**
1. `.htaccess` not deployed or not readable
2. `RewriteBase /ai-lab/` incorrect (check actual path)
3. mod_rewrite not enabled in Apache

**Solutions:**
```bash
# Check .htaccess
ssh root@66.226.72.199 "cat /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/.htaccess"

# Verify permissions
ssh root@66.226.72.199 "ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/" | grep htaccess

# Check Apache modules
ssh root@66.226.72.199 "apache2ctl -M | grep rewrite"
# Should show: rewrite_module (shared)

# Enable mod_rewrite if needed
ssh root@66.226.72.199 "a2enmod rewrite && systemctl reload apache2"
```

### CSS/JS Assets Not Loading

**Symptom:** App loads but is unstyled, console has 404 errors

**Cause:** `base: './'` in vite.config.ts might be missing

**Solution:**
1. Verify vite.config.ts has `base: './'`:
   ```typescript
   export default defineConfig({
     base: './',  // ← This line is essential
     // ... rest of config
   });
   ```

2. Rebuild and redeploy:
   ```bash
   pnpm build
   ./deploy.ps1  # or ./deploy.sh
   ```

3. Clear browser cache:
   - Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
   - Clear "Cached images and files"
   - Reload page

### Large Asset Size

**Symptom:** Deployment is slow or app loads slowly

**Check build size:**
```bash
du -sh dist/
# If > 50MB, investigate what's included
```

**Optimize:**
1. Check for large dependencies: `pnpm list --depth=0`
2. Enable gzip on server:
   ```bash
   ssh root@66.226.72.199 'grep -A5 "<Directory /var/www/vhosts>" /etc/apache2/sites-enabled/*.conf | grep -i deflate'
   ```
3. Use code splitting to defer non-critical imports

---

## Rollback Procedure

If deployment causes issues, rollback to previous version:

### Via Git
```bash
# Check deployment history
git log --oneline | head -5

# Rollback to previous commit
git revert HEAD

# Rebuild and redeploy
pnpm build
./deploy.ps1  # or ./deploy.sh
```

### Via Server Backup
```bash
# SSH to server
ssh root@66.226.72.199

# List backup directories (if available)
ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ | grep ai-lab

# Restore from backup
cp -r ai-lab.backup ai-lab

# Verify
curl -I https://ai-tools.techbridge.edu.gh/ai-lab

exit
```

### Manual File Restoration
```bash
# If no backup, manually deploy previous version:
git checkout HEAD~1
pnpm build
./deploy.ps1

# Then get back to latest
git checkout main  # or your branch
```

---

## Monitoring & Maintenance

### Monitor Logs

```bash
# Real-time access log (all requests)
ssh root@66.226.72.199 'tail -f /var/log/apache2/ai-tools.techbridge.edu.gh-access.log'

# Real-time error log (errors only)
ssh root@66.226.72.199 'tail -f /var/log/apache2/ai-tools.techbridge.edu.gh-error.log'

# Search for specific errors
ssh root@66.226.72.199 'grep "500" /var/log/apache2/ai-tools.techbridge.edu.gh-error.log'
```

### Check Deployment Manifest

```bash
# View what was deployed
ssh root@66.226.72.199 'cat /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/DEPLOYMENT_MANIFEST.json'

# Output shows:
# - Deployment timestamp
# - App version
# - Git commit deployed
# - Environment
```

### Cache Management

If users report stale content:

```bash
# Clear server-side caching (if configured)
ssh root@66.226.72.199 'rm -rf /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/.cache'

# Users should clear browser cache
# Instruct users: Ctrl+Shift+Delete → Clear cached images and files → Reload
```

---

## Version Updates

### Minor Update (1.0.0 → 1.0.1)

```bash
# Update version in package.json
# Fix bugs or apply patches

# Rebuild and deploy
pnpm build
./deploy.ps1 -Build

# Verify
curl https://ai-tools.techbridge.edu.gh/ai-lab
```

### Major Update (1.0.0 → 2.0.0)

```bash
# Plan breaking changes
# Document migration path
# Update SRS if needed

# Test extensively locally
pnpm build
pnpm preview

# Only then deploy
./deploy.ps1 -Build

# Monitor logs closely for first hour
ssh root@66.226.72.199 'tail -f /var/log/apache2/ai-tools.techbridge.edu.gh-error.log'
```

---

## Production Checklist

Before deploying to production:

- [ ] All features tested locally
- [ ] `pnpm build` runs without errors
- [ ] No console errors or warnings
- [ ] Performance acceptable (< 2s page load)
- [ ] Accessibility verified (WCAG 2.1 AA)
- [ ] Privacy policy updated and deployed
- [ ] Environment variables configured
- [ ] SSH key configured and tested
- [ ] Server space available (check: `ssh root@66.226.72.199 'df -h'`)
- [ ] Team notified of planned deployment

---

## Support

For deployment issues:

1. **Check deployment script output** — most errors are clearly stated
2. **Review server logs** — shows exactly what went wrong
3. **Test SSH manually** — ensures connectivity works
4. **Verify .htaccess** — SPA routing is a common issue
5. **Contact admin** — daniel.twum@techbridge.edu.gh

---

**Last Updated:** 10 May 2026  
**Status:** Production Ready  
**Estimated Deployment Time:** 5–10 minutes
