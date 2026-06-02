# TUC RMS Production Deployment Guide

**Document ID:** TUC-RMS-DEPLOY-2026-001  
**Version:** 3.0  
**Last Updated:** 25 May 2026  
**Audience:** DevOps Engineers, System Administrators, IT Staff

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Frontend Build](#frontend-build)
4. [Apache Configuration](#apache-configuration)
5. [Backend Deployment](#backend-deployment)
6. [Database Initialisation](#database-initialisation)
7. [Health Check Verification](#health-check-verification)
8. [Rollback Procedure](#rollback-procedure)
9. [Maintenance Mode](#maintenance-mode)
10. [Log Management](#log-management)

---

## Prerequisites

### System Requirements

- **OS:** Ubuntu 20.04 LTS or later
- **Node.js:** v18.x or v20.x (LTS)
- **npm or pnpm:** Latest stable version
- **MySQL:** 8.0 or later (or MariaDB 10.5+)
- **Apache:** 2.4 with mod_rewrite enabled
- **PM2:** Global installation for process management

### Required Ports

- **80/443:** Apache web server (HTTPS enforced in production)
- **5000:** Express backend API (internal, proxied through Apache)
- **3306 or 3307:** MySQL database

### Pre-Deployment Checklist

- [ ] SSH access to production server
- [ ] Database credentials (DB user; no application-level passwords)
- [ ] `SMTP_GATEWAY_URL` confirmed reachable from production server
- [ ] SSL certificates obtained (or use Plesk auto-renewal)
- [ ] Domain name pointing to server
- [ ] Backup of current database completed
- [ ] Backup of current frontend/backend code completed
- [ ] Team notified of deployment window

---

## Environment Variables

### Backend `.env` File

Create `backend/.env` in production with these variables:

```bash
# Server Configuration
NODE_ENV=production
PORT=5000
HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=tuc_rms_user
DB_NAME=tuc_rms_db

# Frontend URL (for CORS)
FRONTEND_URL=https://results.tuc.edu.gh

# Security
JWT_SECRET=YourSecretKeyHere_GenerateNewForProduction
SESSION_SECRET=AnotherSecretKey_GenerateNewForProduction

# SMTP Gateway (magic link delivery)
SMTP_GATEWAY_URL=https://api.techbridge.edu.gh/aucdt-dev/sendMail

# Logging
LOG_LEVEL=info
LOG_DIR=/var/log/tuc-rms

# API Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
```

### Frontend `.env` File

Create `frontend/.env.production` (Vite reads this):

```bash
VITE_API_URL=https://results.tuc.edu.gh/api
VITE_APP_NAME=TUC Results Management System
NODE_ENV=production
```

### Important Notes

- **Store `.env` files securely** — Never commit to version control
- **Rotate secrets regularly** — Change JWT_SECRET and SESSION_SECRET every 6 months
- **No passwords in .env** — Authentication is passwordless; `DB_PASSWORD` is not required (DB user should be configured with socket auth or a separate secrets manager)
- **SMTP_GATEWAY_URL** — Points to the shared TUC API gateway; no SMTP credentials are stored in .env
- **Use a secret manager** — Consider HashiCorp Vault or AWS Secrets Manager for larger deployments
- **File permissions:** `chmod 600 .env` to prevent unauthorised access

---

## Frontend Build

### Build for Production

```bash
cd frontend
npm install  # or pnpm install
npm run build:prod
```

### Output

The build process creates a `dist/` directory containing:
- Minified React bundle
- Optimized assets
- Source maps (optional)

### Build Verification

```bash
# Check that dist/ contains index.html and main.*.js
ls -la dist/

# Expected output:
# index.html
# assets/main-HASH.js
# assets/main-HASH.css
# ... other assets
```

### Deployment to Plesk

1. **Via Plesk File Manager:**
   - Log in to Plesk (e.g., `https://cPanel.techbridge.edu.gh:8443`)
   - Navigate to **File Manager** → `/home/tuc-rms/public_html`
   - Delete old files (or back up first)
   - Upload contents of `dist/` folder

2. **Via SCP (Secure Copy):**
   ```bash
   scp -r frontend/dist/* user@results.tuc.edu.gh:/home/tuc-rms/public_html/
   ```

3. **Via SSH + Git (Recommended):**
   ```bash
   ssh user@results.tuc.edu.gh
   cd /home/tuc-rms/public_html
   git fetch origin main
   git checkout main -- frontend
   cd frontend
   npm install
   npm run build:prod
   cp -r dist/* .
   ```

---

## Apache Configuration

### Enable Required Modules

```bash
sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod ssl
sudo systemctl restart apache2
```

### Virtual Host Configuration

Create `/etc/apache2/sites-available/tuc-rms.conf`:

```apache
<VirtualHost *:80>
    ServerName results.tuc.edu.gh
    ServerAlias www.results.tuc.edu.gh
    DocumentRoot /home/tuc-rms/public_html

    # Redirect HTTP to HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName results.tuc.edu.gh
    ServerAlias www.results.tuc.edu.gh
    DocumentRoot /home/tuc-rms/public_html

    # SSL Certificates (auto-managed by Plesk or Let's Encrypt)
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/results.tuc.edu.gh/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/results.tuc.edu.gh/privkey.pem

    # Security Headers
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "DENY"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set Referrer-Policy "no-referrer"

    # Enable mod_rewrite
    <Directory /home/tuc-rms/public_html>
        RewriteEngine On
        RewriteBase /
        
        # Don't rewrite real files or directories
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        
        # Rewrite to index.html for SPA routing
        RewriteRule ^(.*)$ /index.html [L]
        
        # Cache static assets
        <IfModule mod_expires.c>
            ExpiresActive On
            ExpiresByType text/html "access plus 1 minute"
            ExpiresByType text/css "access plus 1 year"
            ExpiresByType text/javascript "access plus 1 year"
            ExpiresByType application/javascript "access plus 1 year"
            ExpiresByType image/* "access plus 1 year"
        </IfModule>
    </Directory>

    # Proxy API requests to backend
    <Location /api>
        ProxyPreserveHost On
        ProxyPass http://localhost:5000/api
        ProxyPassReverse http://localhost:5000/api
        
        # Allow large uploads
        SetEnv proxy-sendchunked 1
        
        # WebSocket support (if future features require it)
        RewriteEngine On
        RewriteCond %{HTTP:Upgrade} websocket [NC]
        RewriteCond %{HTTP:Connection} upgrade [NC]
        RewriteRule ^/api/(.*) ws://localhost:5000/api/$1 [P,L]
    </Location>

    # Logging
    ErrorLog ${APACHE_LOG_DIR}/tuc-rms-error.log
    CustomLog ${APACHE_LOG_DIR}/tuc-rms-access.log combined
</VirtualHost>
```

### Enable the Virtual Host

```bash
sudo a2ensite tuc-rms.conf
sudo a2dissite 000-default.conf  # Disable default site if necessary
sudo apache2ctl configtest  # Should return "Syntax OK"
sudo systemctl restart apache2
```

---

## Backend Deployment

### Install Dependencies

```bash
cd backend
npm install --production
```

### Start with PM2

```bash
# Install PM2 globally if not already installed
npm install -g pm2

# Start the backend
pm2 start server-production.js --name "tuc-rms-api" --watch

# Save PM2 configuration to auto-start on reboot
pm2 save
pm2 startup

# Verify the service is running
pm2 list
pm2 logs tuc-rms-api
```

### PM2 Configuration File (Optional)

Create `ecosystem.config.js` in the project root:

```javascript
module.exports = {
  apps: [
    {
      name: 'tuc-rms-api',
      script: './server-production.js',
      cwd: './backend',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M'
    }
  ]
};
```

Start with this configuration:

```bash
pm2 start ecosystem.config.js
pm2 save
```

---

## Database Initialisation

### Create Database User

```bash
mysql -u root -p
# Enter root password

CREATE USER 'tuc_rms_user'@'localhost' IDENTIFIED BY 'SecurePassword123!';
GRANT ALL PRIVILEGES ON tuc_rms_db.* TO 'tuc_rms_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Create Database and Tables

```bash
cd backend
mysql -u tuc_rms_user -p tuc_rms_db < database.sql
# Enter the password set above
```

### Verify Tables

```bash
mysql -u tuc_rms_user -p -e "USE tuc_rms_db; SHOW TABLES;"
```

Expected output:

```
+------------------+
| Tables_in_tuc_rms_db |
+------------------+
| users            |
| students         |
| courses          |
| enrollments      |
| results          |
| lecturers        |
| student_reviews  |
| audit_log        |
| notifications    |
| system_config    |
+------------------+
```

---

## Health Check Verification

### Check Backend Health

```bash
curl https://results.tuc.edu.gh/api/health
```

**Expected Response:**

```json
{
  "status": "ok",
  "service": "tuc-rms-api",
  "timestamp": "2026-05-25T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

### Check Full Health Status

```bash
curl https://results.tuc.edu.gh/api/health/full
```

**Expected Response:**

```json
{
  "status": "ok",
  "service": "tuc-rms-api",
  "timestamp": "2026-05-25T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "database": {
    "status": "ok",
    "error": null
  },
  "memory": {
    "heapUsed": 120,
    "heapTotal": 256,
    "external": 10,
    "rss": 300
  }
}
```

### Check Frontend

```bash
curl -I https://results.tuc.edu.gh
```

Should return HTTP 200 with content type `text/html`.

---

## Rollback Procedure

If something goes wrong, follow these steps to revert to the previous version:

### Step 1: Backup Current Version

```bash
# Backup current frontend
cp -r /home/tuc-rms/public_html /home/tuc-rms/public_html.broken.$(date +%s)

# Backup current backend
cd /home/tuc-rms/app
cp -r backend backend.broken.$(date +%s)
```

### Step 2: Restore Previous Backend

```bash
cd /home/tuc-rms/app/backend.broken.PREVIOUS_TIMESTAMP
npm install --production
pm2 stop tuc-rms-api
pm2 start server-production.js --name "tuc-rms-api"
```

### Step 3: Restore Previous Frontend

```bash
# Delete broken frontend files
rm -r /home/tuc-rms/public_html/*

# Restore previous version
cp -r /home/tuc-rms/public_html.backup/* /home/tuc-rms/public_html/
```

### Step 4: Verify Health

```bash
curl https://results.tuc.edu.gh/api/health
# Check that status is "ok"
```

### Step 5: Notify Stakeholders

- Email IT staff and management
- Include timestamp of rollback and reason
- Plan post-mortem if necessary

---

## Maintenance Mode

To perform database maintenance without affecting users:

### Enable Maintenance Page

Create `/home/tuc-rms/public_html/maintenance.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Scheduled Maintenance</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { color: #6B0020; }
        p { color: #666; line-height: 1.6; }
        .status { font-size: 18px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>System Maintenance</h1>
        <p>TUC Results Management System is temporarily unavailable for scheduled maintenance.</p>
        <div class="status">
            <p><strong>Expected Duration:</strong> 1-2 hours</p>
            <p><strong>Thank you for your patience.</strong></p>
        </div>
        <p style="font-size: 12px; color: #999;">
            For urgent issues, contact ict@tuc.edu.gh
        </p>
    </div>
</body>
</html>
```

### Activate Maintenance Mode (Apache)

Edit `/etc/apache2/sites-available/tuc-rms.conf`:

```apache
<VirtualHost *:443>
    # ... existing config ...
    
    # Redirect all requests to maintenance page
    RewriteEngine On
    RewriteCond %{REQUEST_URI} !/maintenance.html
    RewriteCond %{REQUEST_FILENAME} !/maintenance.html
    RewriteRule ^(.*)$ /maintenance.html [L]
</VirtualHost>
```

Reload Apache:

```bash
sudo systemctl reload apache2
```

### Deactivate Maintenance Mode

Remove the RewriteCond rules and restart Apache:

```bash
sudo systemctl reload apache2
```

---

## Log Management

### Backend Logs

**Location:** `/var/log/tuc-rms/` (configured in `.env`)

```bash
# View live logs
tail -f /var/log/tuc-rms/info.log

# View errors
tail -f /var/log/tuc-rms/error.log
```

### PM2 Logs

```bash
# View PM2 logs
pm2 logs tuc-rms-api

# Save logs to file
pm2 logs tuc-rms-api > /var/log/tuc-rms/pm2.log

# Flush all logs
pm2 flush
```

### Apache Logs

```bash
# Access log
tail -f /var/log/apache2/tuc-rms-access.log

# Error log
tail -f /var/log/apache2/tuc-rms-error.log
```

### Log Rotation

Configure logrotate for automatic rotation (daily, keep 30 days):

Create `/etc/logrotate.d/tuc-rms`:

```
/var/log/tuc-rms/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

---

## Deployment Checklist

Use this checklist for each production deployment:

- [ ] Code reviewed and merged to `main` branch
- [ ] All tests passing (`npm test`)
- [ ] Database migrations tested locally (confirm `otp_tokens` table present)
- [ ] `.env` variables verified on production server — especially `SMTP_GATEWAY_URL` and `JWT_SECRET`
- [ ] SSL certificate valid (check expiry)
- [ ] Current backend/frontend backed up
- [ ] Frontend built and deployed
- [ ] Backend dependencies installed and PM2 started
- [ ] Database tables verified (including `otp_tokens`)
- [ ] Health checks passing (all three endpoints)
- [ ] Frontend loads in browser
- [ ] Magic link flow works end-to-end: enter name → email arrives → click link → lands on correct role page
- [ ] Expired/used link shows "Link expired" screen with "Request a new link" button
- [ ] Can navigate to dashboard (registrar) and /courses (lecturer)
- [ ] Audit log reflects login action
- [ ] Apache logs show no errors
- [ ] All stakeholders notified

---

## Support and Escalation

**For deployment issues, contact:**
- Email: [ict@tuc.edu.gh](mailto:ict@tuc.edu.gh)
- On-call: +233 XXX XXX XXX

---

**Document Status:** Final — Version 3.0  
**Next Review Date:** 25 May 2027
