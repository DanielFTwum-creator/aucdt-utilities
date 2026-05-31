# Dictation App — Deployment Guide v1.0

**Document ID:** TUC-ICT-DEPLOY-2026-001  
**Status:** Final  
**Date:** May 31, 2026  
**Version:** 1.0  
**Audience:** DevOps Engineers & System Administrators

---

## 1. Pre-Deployment Verification

### Checklist

✅ All requirements met:
- [ ] Code review completed
- [ ] Tests passing at 80%+ rate (77 tests)
- [ ] Security scan passed
- [ ] Performance benchmarks met
- [ ] Documentation complete
- [ ] Rollback plan documented
- [ ] Team briefing completed

### Build Verification

```bash
cd /var/www/dictation-app

# Verify dependencies
pnpm list --depth 0

# Build production
pnpm build

# Check build output
ls -la dist/
# Should contain:
# - index.html
# - assets/
# - manifest.json
```

---

## 2. Environment Setup

### 2.1 Ubuntu Server Preparation

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm@latest

# Install Nginx
sudo apt-get install -y nginx

# Install SSL tools
sudo apt-get install -y certbot python3-certbot-nginx

# Install monitoring
sudo apt-get install -y htop curl wget git

# Verify installations
node --version
pnpm --version
nginx -v
```

### 2.2 Application Directory

```bash
# Create app directory
sudo mkdir -p /var/www/dictation-app
sudo chown $USER:$USER /var/www/dictation-app
cd /var/www/dictation-app

# Clone repository
git clone https://github.com/techbridge/dictation-app.git .
git checkout main
```

---

## 3. Configuration

### 3.1 Environment Variables

Create `.env.production`:

```bash
cat > .env.production <<'ENVEOF'
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_client_secret_here

# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Application URLs
VITE_APP_URL=https://dictation-app.techbridge.edu.gh
VITE_API_URL=https://api.techbridge.edu.gh

# Environment
VITE_ENVIRONMENT=production

# Security
VITE_SECURE_COOKIES=true
VITE_CORS_ORIGIN=https://dictation-app.techbridge.edu.gh

# Logging
VITE_LOG_LEVEL=info
ENVEOF

chmod 600 .env.production
```

### 3.2 Nginx Configuration

Create `/etc/nginx/sites-available/dictation-app`:

```bash
sudo tee /etc/nginx/sites-available/dictation-app > /dev/null <<'NGINXEOF'
server {
    listen 80;
    listen [::]:80;
    server_name dictation-app.techbridge.edu.gh;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name dictation-app.techbridge.edu.gh;
    
    ssl_certificate /etc/letsencrypt/live/dictation-app.techbridge.edu.gh/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dictation-app.techbridge.edu.gh/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_comp_level 9;
    
    root /var/www/dictation-app/dist;
    
    location / {
        try_files $uri /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
NGINXEOF

# Enable site
sudo ln -s /etc/nginx/sites-available/dictation-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. Building for Production

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Build application
pnpm build

# Verify build
ls -la dist/

# Output should show:
# index.html, assets/, manifest.json
```

---

## 5. Systemd Service

Create `/etc/systemd/system/dictation-app.service`:

```bash
sudo tee /etc/systemd/system/dictation-app.service > /dev/null <<'SERVICEEOF'
[Unit]
Description=Dictation App Production Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/var/www/dictation-app
Environment="NODE_ENV=production"
EnvironmentFile=/var/www/dictation-app/.env.production
ExecStart=/usr/local/bin/pnpm start
Restart=on-failure
RestartSec=10

NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
SERVICEEOF

sudo systemctl daemon-reload
sudo systemctl enable dictation-app
sudo systemctl start dictation-app
```

---

## 6. SSL Certificate

```bash
# Obtain certificate
sudo certbot certonly --nginx \
  -d dictation-app.techbridge.edu.gh \
  -m admin@techbridge.edu.gh \
  --agree-tos

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verify
openssl x509 -in /etc/letsencrypt/live/dictation-app.techbridge.edu.gh/fullchain.pem -text -noout
```

---

## 7. Verification

### 7.1 Health Checks

```bash
# Check service
sudo systemctl status dictation-app

# Check Nginx
sudo systemctl status nginx

# View logs
sudo journalctl -u dictation-app -f

# Test HTTPS
curl -I https://dictation-app.techbridge.edu.gh
# Expected: HTTP/2 200

# Check certificate
openssl s_client -connect dictation-app.techbridge.edu.gh:443
```

### 7.2 Smoke Tests

```bash
# Load test page
curl -s https://dictation-app.techbridge.edu.gh | head -20

# Check OAuth redirect
curl -I https://dictation-app.techbridge.edu.gh/auth/callback

# Performance test
ab -n 100 -c 10 https://dictation-app.techbridge.edu.gh/
# Expected: Response time < 500ms
```

---

## 8. Monitoring Setup

```bash
# System monitoring
sudo apt-get install -y prometheus-node-exporter
sudo systemctl enable prometheus-node-exporter

# Log aggregation (optional)
# Set up ELK Stack or cloud provider logging

# Uptime monitoring
# Configure Pingdom or StatusPage.io

# Error tracking
# Set up Sentry or similar service
```

---

## 9. Rollback Plan

If deployment fails:

```bash
# Stop application
sudo systemctl stop dictation-app

# Revert to previous version
cd /var/www/dictation-app
git checkout main~1  # Previous commit
pnpm install
pnpm build

# Restart
sudo systemctl start dictation-app

# Verify
curl -I https://dictation-app.techbridge.edu.gh
```

---

## 10. Post-Deployment

### 10.1 Day 1

- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify SSL certificate
- [ ] Test all features
- [ ] Confirm OAuth flow
- [ ] Document issues found

### 10.2 Week 1

- [ ] Performance analysis
- [ ] User feedback collection
- [ ] Security review
- [ ] Capacity planning
- [ ] Backup verification

---

## 11. Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Preparation | 1 hour | |
| Environment Setup | 30 min | |
| Build & Test | 15 min | |
| Configuration | 20 min | |
| Service Setup | 15 min | |
| SSL Certificate | 10 min | |
| Verification | 10 min | |
| **Total** | **~2 hours** | |

---

## 12. Emergency Contacts

- **DevOps Lead:** devops@techbridge.edu.gh
- **Security Team:** security@techbridge.edu.gh
- **Support:** support@techbridge.edu.gh

---

**Status:** ✅ Final  
**Last Updated:** May 31, 2026

