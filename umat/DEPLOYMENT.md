# UMaT Tracker Deployment Guide

Deployment location: **ai-tools.techbridge.edu.gh/umat**  
Server: 66.226.72.199 (Ubuntu + Plesk)

## 1. Build the Application

```bash
cd umat
pnpm install
pnpm build
```

This creates an optimized production build in `umat/dist/`.

## 2. Deploy to Ubuntu Server

### Option A: Using SFTP/SCP (Recommended)

```bash
# From your local machine
scp -r umat/dist/* root@66.226.72.199:/var/www/vhosts/ai-tools.techbridge.edu.gh/umat/
```

### Option B: Using rsync

```bash
rsync -avz umat/dist/ root@66.226.72.199:/var/www/vhosts/ai-tools.techbridge.edu.gh/umat/
```

### Option C: SSH + Manual Upload

```bash
# SSH into server
ssh root@66.226.72.199

# Navigate to web root
cd /var/www/vhosts/ai-tools.techbridge.edu.gh/

# Create umat directory if it doesn't exist
mkdir -p umat

# Then upload files via SFTP
```

## 3. Nginx Configuration (via Plesk or Manual)

### If using Plesk:
1. Log into Plesk
2. Go to **Domains** → **ai-tools.techbridge.edu.gh** → **Document Root**
3. Ensure the document root is `/var/www/vhosts/ai-tools.techbridge.edu.gh/`
4. Create a subdirectory `/umat/` and upload the `dist/` contents

### If configuring manually:

Add this location block to your Nginx config:

```nginx
server {
  listen 80;
  listen 443 ssl http2;
  server_name ai-tools.techbridge.edu.gh;

  # SSL configuration (handled by Plesk)
  # ssl_certificate ...
  # ssl_certificate_key ...

  root /var/www/vhosts/ai-tools.techbridge.edu.gh;

  location /umat/ {
    # Serve static files with caching
    try_files $uri $uri/ /umat/index.html;
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }
  }

  # Other locations...
}
```

Then reload Nginx:
```bash
systemctl reload nginx
```

## 4. File Structure on Server

```
/var/www/vhosts/ai-tools.techbridge.edu.gh/
├── umat/
│   ├── index.html
│   └── assets/
│       └── index-*.js
└── [other app directories]
```

## 5. Testing

After deployment, test the app:

```bash
curl -I https://ai-tools.techbridge.edu.gh/umat/
# Should return 200 OK

# Or visit in browser:
https://ai-tools.techbridge.edu.gh/umat/
```

## 6. Data Persistence

The UMAT tracker stores data in **browser localStorage** under key `umat-tracker-v1`. 

⚠️ **Important:** localStorage is browser-local. If you need persistent server-side storage:

1. Add a backend API (optional, can be added later)
2. Implement database persistence
3. For now, users should export CSV regularly for backup

## 7. Updates & Redeployment

To update the app with new changes:

```bash
# Build the app
cd umat
pnpm build

# Deploy to server
scp -r dist/* root@66.226.72.199:/var/www/vhosts/ai-tools.techbridge.edu.gh/umat/

# Clear browser cache if needed (send message to users or add cache-busting headers)
```

## 8. Troubleshooting

### 404 errors on page refresh
Ensure Nginx is configured with `try_files $uri $uri/ /umat/index.html;` for SPA routing.

### Styles not loading
Check browser console for 404s in CSS/JS assets. Verify file paths use correct base URL (`/umat/`).

### Data not persisting
This is expected—localStorage is browser-local. Use the CSV export feature for backups.

---

**Contact:** daniel.twum@techbridge.edu.gh
