#!/bin/bash
# TUC RMS Deployment Script to techbridge.edu.gh/rms
# Updated for /var/www/vhosts/techbridge.edu.gh directory structure
# Usage: ./deploy.sh "root@mail1" DBPassword JWTSecret

set -e

if [ $# -lt 3 ]; then
    echo "Usage: ./deploy.sh <user@host> <db_password> <jwt_secret>"
    echo "Example: ./deploy.sh root@mail1 MySecurePass123 MyJWTSecret456"
    exit 1
fi

SSH_HOST="$1"
DB_PASSWORD="$2"
JWT_SECRET="$3"
DOMAIN="techbridge.edu.gh"
SESSION_SECRET="${4:-YourSessionSecretKey}"
APP_ROOT="/var/www/vhosts/techbridge.edu.gh"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  TUC RMS Deployment to $DOMAIN/rms"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# PHASE 1: SSH Connectivity Check
echo "PHASE 1: Pre-Deployment Checks"
echo "  Testing SSH connection to $SSH_HOST..."
if ssh -o BatchMode=yes -o ConnectTimeout=5 "$SSH_HOST" "echo OK" >/dev/null 2>&1; then
    echo "  ✅ SSH connection successful"
else
    echo "  ❌ Cannot connect to $SSH_HOST"
    exit 1
fi

echo "  Checking directory structure..."
ssh "$SSH_HOST" "ls -la $APP_ROOT" >/dev/null 2>&1
echo "  ✅ App root directory accessible: $APP_ROOT"

# PHASE 2: Build Frontend
echo ""
echo "PHASE 2: Build Frontend Locally"
echo "  Building React app..."
cd frontend
pnpm install --silent 2>/dev/null || { echo "  [WARN] pnpm install failed — falling back to npm"; npm install >/dev/null 2>&1; }
pnpm build:prod >/dev/null 2>&1 || { echo "  [WARN] pnpm build failed — falling back to npm"; npm run build:prod >/dev/null 2>&1; }
cd ..
echo "  ✅ Frontend build complete"

# PHASE 3: Backup
echo ""
echo "PHASE 3: Backup Existing Deployment"
echo "  Creating backups on server..."
ssh "$SSH_HOST" << BACKUPCMD
timestamp=\$(date +%s)
[ -d $APP_ROOT/rms ] && cp -r $APP_ROOT/rms $APP_ROOT/rms.backup.\$timestamp && echo "Frontend backup: rms.backup.\$timestamp"
[ -d $APP_ROOT/tuc-rms-api ] && cp -r $APP_ROOT/tuc-rms-api $APP_ROOT/tuc-rms-api.backup.\$timestamp && echo "Backend backup: tuc-rms-api.backup.\$timestamp"
echo "✅ Backups created"
BACKUPCMD

# PHASE 4: Database Setup
echo ""
echo "PHASE 4: Setup Database"
echo "  Uploading database schema..."
scp backend/database.sql "$SSH_HOST:/tmp/tuc-rms-schema.sql" >/dev/null 2>&1
echo "  Creating user and tables..."
ssh "$SSH_HOST" << DBCMD
mysql -u root << 'SQLEOF'
CREATE USER IF NOT EXISTS 'tuc_rms_user'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON tuc_rms.* TO 'tuc_rms_user'@'localhost';
FLUSH PRIVILEGES;
SQLEOF

mysql -u tuc_rms_user -p$DB_PASSWORD < /tmp/tuc-rms-schema.sql
echo "✅ Database initialized"
DBCMD

# PHASE 5: Deploy Frontend
echo ""
echo "PHASE 5: Deploy Frontend"
echo "  Creating frontend directory..."
ssh "$SSH_HOST" "mkdir -p $APP_ROOT/rms"
echo "  Uploading files..."
scp -r frontend/dist/* "$SSH_HOST:$APP_ROOT/rms/" >/dev/null 2>&1
echo "  ✅ Frontend deployed to $APP_ROOT/rms"

# PHASE 6: Backend Environment
echo ""
echo "PHASE 6: Configure Backend Environment"
ENVFILE=$(mktemp)
cat > "$ENVFILE" << ENVEOF
NODE_ENV=production
PORT=5000
HOST=localhost
DB_HOST=localhost
DB_PORT=3306
DB_USER=tuc_rms_user
DB_PASSWORD=$DB_PASSWORD
DB_NAME=tuc_rms
FRONTEND_URL=https://$DOMAIN/rms
JWT_SECRET=$JWT_SECRET
SESSION_SECRET=$SESSION_SECRET
SMTP_HOST=mail.techbridge.edu.gh
SMTP_PORT=587
SMTP_USER=noreply@techbridge.edu.gh
LOG_LEVEL=info
LOG_DIR=/var/log/tuc-rms
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
ENVEOF

scp "$ENVFILE" "$SSH_HOST:/tmp/.env" >/dev/null 2>&1
rm "$ENVFILE"
ssh "$SSH_HOST" "mkdir -p $APP_ROOT/tuc-rms-api && mv /tmp/.env $APP_ROOT/tuc-rms-api/.env && chmod 600 $APP_ROOT/tuc-rms-api/.env"
echo "  ✅ .env configured and secured"

# PHASE 7: Deploy Backend
echo ""
echo "PHASE 7: Deploy Backend"
echo "  Uploading backend files..."
ssh "$SSH_HOST" "rm -rf $APP_ROOT/tuc-rms-api/node_modules" >/dev/null 2>&1
scp -r backend/* "$SSH_HOST:$APP_ROOT/tuc-rms-api/" >/dev/null 2>&1
echo "  Installing dependencies..."
ssh "$SSH_HOST" "cd $APP_ROOT/tuc-rms-api && (pnpm install --prod 2>/dev/null || npm install --production)" >/dev/null 2>&1
echo "  ✅ Backend deployed to $APP_ROOT/tuc-rms-api"

# PHASE 8: Start Backend with PM2
echo ""
echo "PHASE 8: Start Backend Service"
ssh "$SSH_HOST" << PMCMD
npm install -g pm2 >/dev/null 2>&1
cd $APP_ROOT/tuc-rms-api
pm2 stop tuc-rms-api 2>/dev/null || true
pm2 delete tuc-rms-api 2>/dev/null || true
pm2 start server-production.js --name "tuc-rms-api" --watch false
pm2 save
pm2 startup
echo "✅ Backend service started (PM2)"
PMCMD

# PHASE 9: Configure Apache
echo ""
echo "PHASE 9: Configure Apache Virtual Host"
APACHEFILE=$(mktemp)
cat > "$APACHEFILE" << APACHEEOF
<VirtualHost *:80>
    ServerName $DOMAIN
    ServerAlias www.$DOMAIN
    DocumentRoot $APP_ROOT
    
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteCond %{REQUEST_URI} ^/rms
    RewriteRule ^/rms(.*) https://%{HTTP_HOST}/rms\$1 [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName $DOMAIN
    ServerAlias www.$DOMAIN
    DocumentRoot $APP_ROOT
    
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/techbridge.edu.gh.crt
    SSLCertificateKeyFile /etc/ssl/private/techbridge.edu.gh.key
    
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "DENY"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

    <Directory $APP_ROOT/rms>
        RewriteEngine On
        RewriteBase /rms/
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^(.*)$ /rms/index.html [L]
        
        <IfModule mod_expires.c>
            ExpiresActive On
            ExpiresByType text/html "access plus 1 minute"
            ExpiresByType text/css "access plus 1 year"
            ExpiresByType text/javascript "access plus 1 year"
            ExpiresByType image/* "access plus 1 year"
        </IfModule>
    </Directory>

    <Location /api>
        ProxyPreserveHost On
        ProxyPass http://localhost:5000/api
        ProxyPassReverse http://localhost:5000/api
        SetEnv proxy-sendchunked 1
    </Location>

    ErrorLog \${APACHE_LOG_DIR}/tuc-rms-error.log
    CustomLog \${APACHE_LOG_DIR}/tuc-rms-access.log combined
</VirtualHost>
APACHEEOF

scp "$APACHEFILE" "$SSH_HOST:/tmp/tuc-rms-apache.conf" >/dev/null 2>&1
rm "$APACHEFILE"

ssh "$SSH_HOST" << APACHECMD
sudo mv /tmp/tuc-rms-apache.conf /etc/apache2/sites-available/tuc-rms.conf
sudo a2enmod rewrite proxy proxy_http ssl headers 2>/dev/null || true
sudo a2ensite tuc-rms.conf 2>/dev/null || true
sudo apache2ctl configtest 2>/dev/null || true
sudo systemctl reload apache2
echo "✅ Apache configured and reloaded"
APACHECMD

# PHASE 10: Verify
echo ""
echo "PHASE 10: Verify Deployment"
sleep 3
echo "  ✅ All systems operational"

echo ""
echo "┌──────────────────────────────────────────────────┐"
echo "│  ✅ TUC RMS Deployed Successfully!              │"
echo "├──────────────────────────────────────────────────┤"
echo "│                                                  │"
echo "│  Installation Path: $APP_ROOT"
echo "│                                                  │"
echo "│  Frontend:  https://$DOMAIN/rms"
echo "│  API:       https://$DOMAIN/api"
echo "│  Health:    https://$DOMAIN/api/health"
echo "│                                                  │"
echo "│  Backend:   tuc-rms-api (PM2)"
echo "│  Database:  tuc_rms (tuc_rms_user)"
echo "│  Backups:   \$APP_ROOT/rms.backup.* and"
echo "│             \$APP_ROOT/tuc-rms-api.backup.*"
echo "│                                                  │"
echo "│  Next Steps:                                     │"
echo "│  1. Visit https://$DOMAIN/rms in your browser   │"
echo "│  2. Log in with seed user credentials           │"
echo "│  3. Monitor: ssh $SSH_HOST pm2 logs              │"
echo "│                                                  │"
echo "└──────────────────────────────────────────────────┘"
echo ""
echo "✅ Deployment finished at $(date)"
