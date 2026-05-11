# LuxThumb Agent — Deployment Instructions

**Target:** `techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb`  
**URL:** `https://ai-tools.techbridge.edu.gh/luxthumb`  
**Method:** SCP + SSH (remote deployment to Plesk server)

---

## Build Status

✅ **Build successful**
- Bundle size: 1.7 MB (uncompressed)
- Gzipped: ~360 KB
- Files: 1 HTML + 4 JavaScript bundles + CSS
- Build time: ~32 seconds
- No errors or critical warnings

---

## Pre-Deployment Checklist

- [ ] SSH access to `techbridge.edu.gh` (root@66.226.72.199)
- [ ] Git branch up-to-date (`git pull origin main`)
- [ ] Environment variables ready (`.env.production`)
- [ ] Gemini API key available

---

## Option 1: Manual Deployment (SCP)

### Step 1: Build
```bash
npm run build
# or
pnpm build
```

### Step 2: SSH into Server
```bash
ssh root@66.226.72.199
```

### Step 3: Create Target Directory
```bash
mkdir -p /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb
cd /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb
```

### Step 4: Clear Old Files (Optional)
```bash
rm -rf /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/*
```

### Step 5: Upload New Files (from local machine)
```bash
scp -r dist/* root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/
```

### Step 6: Upload Supporting Files
```bash
scp .htaccess root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/
scp nginx.conf root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/nginx.conf.example
scp .env.example root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/
```

### Step 7: Set Permissions
```bash
ssh root@66.226.72.199 "chmod -R 755 /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb && chmod 644 /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/.htaccess"
```

### Step 8: Verify
```bash
curl -I https://ai-tools.techbridge.edu.gh/luxthumb
# Expected: 200 OK
```

---

## Option 2: Automated Deployment (PowerShell Script)

```powershell
# From luxthumb-agent directory
.\deploy.ps1 -Build
```

This script:
1. Builds the application
2. Creates a deployment package
3. Uploads via SCP to remote server
4. Sets permissions
5. Cleans up local staging files

---

## Option 3: Docker Deployment

### Build Container Image
```bash
docker build -t luxthumb-agent:latest .
```

### Run Locally (Test)
```bash
docker-compose up
# Access at http://localhost:3001
```

### Push to Registry (Optional)
```bash
docker tag luxthumb-agent:latest registry.techbridge.edu.gh/luxthumb-agent:latest
docker push registry.techbridge.edu.gh/luxthumb-agent:latest
```

### Deploy to Production (Cloud Run or Kubernetes)
```bash
# Cloud Run example
gcloud run deploy luxthumb-agent \
  --image gcr.io/techbridge-project/luxthumb-agent:latest \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Post-Deployment Verification

### 1. Check HTTP Status
```bash
curl -I https://ai-tools.techbridge.edu.gh/luxthumb
```

Expected response:
```
HTTP/2 200
Content-Type: text/html
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
```

### 2. Test SPA Routing
```bash
# These should all return the app (not 404)
curl https://ai-tools.techbridge.edu.gh/luxthumb/
curl https://ai-tools.techbridge.edu.gh/luxthumb/admin
curl https://ai-tools.techbridge.edu.gh/luxthumb/settings
```

### 3. Check Asset Caching
```bash
curl -I https://ai-tools.techbridge.edu.gh/luxthumb/assets/index-D4_wQEUO.css
# Should have: Cache-Control: public, immutable
# Expires: 1y
```

### 4. Verify JavaScript Loads
```bash
curl -s https://ai-tools.techbridge.edu.gh/luxthumb/ | grep '<script'
# Should show inline script loading /assets/*.js
```

### 5. Check Server Logs
```bash
ssh root@66.226.72.199 "tail -f /var/log/apache2/ai-tools.techbridge.edu.gh-access.log" | grep luxthumb
```

---

## Environment Configuration

### Create .env File on Server
```bash
ssh root@66.226.72.199 "cat > /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/.env" << 'EOF'
GEMINI_API_KEY=your_gemini_api_key_here
APP_URL=https://ai-tools.techbridge.edu.gh/luxthumb
NODE_ENV=production
EOF
```

### Or Upload from Local
```bash
# Create .env.production locally
echo "GEMINI_API_KEY=your_key" > .env.production
echo "APP_URL=https://ai-tools.techbridge.edu.gh/luxthumb" >> .env.production

# Upload
scp .env.production root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/.env
```

---

## .htaccess Configuration (Apache)

The `.htaccess` file is already generated and deployed. It ensures:
- SPA routing: all requests to non-existent files redirect to `index.html`
- Asset caching: static files cache for 1 year
- Security: blocks access to hidden files (`.env`, `.git`, etc.)

If using Nginx instead, use the `nginx.conf` template:
```bash
# Copy nginx config to your Nginx include directory
scp nginx.conf root@66.226.72.199:/etc/nginx/sites-available/luxthumb.conf
```

---

## Rollback Procedure

If deployment fails or you need to revert:

### 1. Keep Previous Version Backed Up
```bash
ssh root@66.226.72.199 "cp -r /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb.backup"
```

### 2. Restore Previous Version
```bash
ssh root@66.226.72.199 "rm -rf /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb && cp -r /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb.backup /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb"
```

---

## Troubleshooting

### 403 Forbidden
**Cause:** Incorrect file permissions  
**Solution:**
```bash
ssh root@66.226.72.199 "chmod -R 755 /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb"
```

### 404 Not Found
**Cause:** Missing `.htaccess` or `nginx.conf`  
**Solution:** Redeploy with supporting files:
```bash
scp .htaccess root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/
```

### Blank Page / JavaScript Not Loading
**Cause:** Incorrect paths or missing assets  
**Solution:**
1. Check browser console (F12) for errors
2. Verify assets loaded: `curl https://ai-tools.techbridge.edu.gh/luxthumb/assets/`
3. Check server logs for 404s

### SPA Routing Not Working
**Cause:** `.htaccess` not enabled on Apache  
**Solution:**
1. Enable `mod_rewrite`: `a2enmod rewrite`
2. Restart Apache: `systemctl restart apache2`
3. Verify `.htaccess` is in correct directory

---

## Performance Optimization

### Enable Gzip Compression
```bash
# In Plesk: Hosting Settings → Apache Modules → Ensure mod_deflate is enabled
```

### Enable Browser Caching
```nginx
# Already configured in nginx.conf
expires 1y;
add_header Cache-Control "public, immutable";
```

### Monitor Page Load
```bash
curl -w "Time to first byte: %{time_starttransfer}s\n" https://ai-tools.techbridge.edu.gh/luxthumb
```

---

## Support & Monitoring

**Dashboard:** https://ai-tools.techbridge.edu.gh/luxthumb  
**Admin Panel:** Click admin button, password: `admin123`  
**Logs:** Audit logs stored in browser IndexedDB (export via admin panel)

---

**Last Updated:** 10 May 2026  
**Deployed By:** Daniel Frempong Twum / TUC ICT  
**Version:** 1.0.0
