# TUC RMS Deployment Quick Start

## Server Setup

**Installation Path:** `/var/www/vhosts/techbridge.edu.gh`

The script will create:
- **Frontend:** `/var/www/vhosts/techbridge.edu.gh/rms`
- **Backend:** `/var/www/vhosts/techbridge.edu.gh/tuc-rms-api`

## Prerequisites

Before deploying, have the following ready:

1. **SSH Access** — `root@mail1` or your server hostname (you have this ✅)
2. **Database Password** — Secure password for `tuc_rms_user`
3. **JWT Secret** — Signing key for authentication tokens (generate a long random string)
4. **Optional Session Secret** — For session management (defaults to placeholder)

## Generate Secure Secrets

Run this locally to generate the secrets:

```bash
# JWT Secret (32+ character random string)
openssl rand -base64 32

# Session Secret (optional, 32+ character random string)
openssl rand -base64 32
```

Example output:
```
gAr+2hK9nL/bXc1mP0qR5sT8uV3wXyZ/VxK9fG8m
kL0pM+QrStUvWxYz1aB2cDeFgHiJkLmNoPqRsTuV
```

## Deployment Steps

### 1. Verify Files Locally

From the `tuc-rms` directory:

```bash
# Check that deploy.sh exists and is executable
ls -la deploy.sh
chmod +x deploy.sh

# Verify project structure
ls -la frontend/package.json backend/package.json backend/database.sql
```

### 2. Run the Deployment Script

Execute from the tuc-rms directory:

```bash
./deploy.sh "root@mail1" "YourDBPassword123!" "YourJWTSecret_GeneratedAbove"
```

**Example:**
```bash
./deploy.sh "root@mail1" "SecureDBPass123!" "gAr+2hK9nL/bXc1mP0qR5sT8uV3wXyZ"
```

**What the script does:**
- ✅ Verifies SSH connectivity
- ✅ Builds frontend locally
- ✅ Creates database backups on server
- ✅ Creates MySQL user and initializes tables
- ✅ Deploys frontend to `/var/www/vhosts/techbridge.edu.gh/rms`
- ✅ Configures backend `.env` file
- ✅ Deploys backend to `/var/www/vhosts/techbridge.edu.gh/tuc-rms-api`
- ✅ Starts backend service with PM2
- ✅ Configures Apache virtual host
- ✅ Enables proxy and rewrite modules
- ✅ Reloads Apache

**Expected runtime:** 3-5 minutes

### 3. Verify the Deployment

Once the script completes, test these URLs:

```bash
# Backend health check
curl https://techbridge.edu.gh/api/health

# Frontend (should load in browser)
open https://techbridge.edu.gh/rms
# or
firefox https://techbridge.edu.gh/rms
```

### 4. First Login

Use these seed credentials:

- **Email:** `daniel.twum@techbridge.edu.gh`
- **Password:** Will receive OTP via email (or check backend logs in dev)

## Post-Deployment Checks

### SSH into the Server

```bash
ssh root@mail1
```

### Monitor Backend Logs

```bash
pm2 logs tuc-rms-api

# Or view last 50 lines
pm2 logs tuc-rms-api --lines 50

# Exit with Ctrl+C
```

### Check Backend Status

```bash
pm2 list
pm2 describe tuc-rms-api
```

### Check Apache Logs

```bash
# Error log
tail -f /var/log/apache2/tuc-rms-error.log

# Access log
tail -f /var/log/apache2/tuc-rms-access.log
```

### Verify Database

```bash
mysql -u tuc_rms_user -p
# Enter password

# Inside MySQL:
USE tuc_rms;
SHOW TABLES;
SELECT COUNT(*) as user_count FROM tuc_rms_users;
EXIT;
```

### Check Deployment Files

```bash
# Frontend
ls -la /var/www/vhosts/techbridge.edu.gh/rms/

# Backend
ls -la /var/www/vhosts/techbridge.edu.gh/tuc-rms-api/
cat /var/www/vhosts/techbridge.edu.gh/tuc-rms-api/.env

# Backups
ls -la /var/www/vhosts/techbridge.edu.gh/ | grep backup
```

## Troubleshooting

### Backend won't start

```bash
ssh root@mail1
cd /var/www/vhosts/techbridge.edu.gh/tuc-rms-api
pm2 logs tuc-rms-api --lines 100
# Read the error message
```

**Common issues:**
- `.env` file missing → Check: `cat /var/www/vhosts/techbridge.edu.gh/tuc-rms-api/.env`
- Database connection failed → Check credentials in .env match deployment password
- Port 5000 in use → `lsof -i :5000` or `netstat -tuln | grep 5000`
- Node.js not found → `which node` (should be in PATH)

### Database connection error

```bash
# Test database connection
mysql -u tuc_rms_user -p -h localhost -e "USE tuc_rms; SELECT COUNT(*) FROM tuc_rms_users;"
# Enter password when prompted
```

**Fix:**
- Verify password in `.env` matches what you provided to deploy.sh
- Check user exists: `mysql -u root -p -e "SELECT user, host FROM mysql.user WHERE user='tuc_rms_user';"`
- Check permissions: `mysql -u root -p -e "SHOW GRANTS FOR 'tuc_rms_user'@'localhost';"`

### Frontend shows blank page

```bash
# Check files were copied
ls -la /var/www/vhosts/techbridge.edu.gh/rms/

# Should contain: index.html, assets/ directory, etc.
```

**Fix:**
```bash
# Verify Apache can read files
sudo apache2ctl configtest
sudo systemctl reload apache2
```

### API calls fail (CORS or proxy errors)

```bash
# Check backend is running
pm2 list
pm2 describe tuc-rms-api

# Test API locally on server
curl http://localhost:5000/api/health

# Check Apache proxy config
sudo apache2ctl -S | grep -i rms
```

**Fix:**
- Ensure backend is running: `pm2 restart tuc-rms-api`
- Check `/var/log/apache2/tuc-rms-error.log` for proxy errors
- Verify Apache modules: `sudo a2enmod proxy proxy_http`

## Rollback to Previous Deployment

If something goes wrong:

```bash
ssh root@mail1
cd /var/www/vhosts/techbridge.edu.gh

# List available backups
ls -la | grep backup

# Restore frontend
rm -rf rms
cp -r rms.backup.TIMESTAMP rms

# Restore backend
rm -rf tuc-rms-api
cp -r tuc-rms-api.backup.TIMESTAMP tuc-rms-api
cd tuc-rms-api
npm install --production
pm2 restart tuc-rms-api
```

## Environment Variables Explained

Located at: `/var/www/vhosts/techbridge.edu.gh/tuc-rms-api/.env`

| Variable | Purpose | Example |
|---|---|---|
| `NODE_ENV` | Runtime environment | `production` |
| `PORT` | Backend port (internal) | `5000` |
| `DB_HOST` | Database hostname | `localhost` |
| `DB_USER` | Database username | `tuc_rms_user` |
| `DB_PASSWORD` | Database user password | `SecurePass123!` |
| `DB_NAME` | Database name | `tuc_rms` |
| `FRONTEND_URL` | Frontend domain (for CORS) | `https://techbridge.edu.gh/rms` |
| `JWT_SECRET` | Auth token signing key | `gAr+2hK9nL/bXc1mP0qR5sT...` |
| `SESSION_SECRET` | Session signing key | Similar to JWT_SECRET |
| `RATE_LIMIT_MAX_REQUESTS` | API rate limit | `5` (requests per 15 min) |

## Updating After Deployment

### Update Frontend Only

```bash
# On local machine (tuc-rms directory)
cd frontend
npm run build:prod
cd ..

scp -r frontend/dist/* root@mail1:/var/www/vhosts/techbridge.edu.gh/rms/
```

### Update Backend Only

```bash
# On local machine (tuc-rms directory)
scp -r backend/* root@mail1:/var/www/vhosts/techbridge.edu.gh/tuc-rms-api/

# On server
ssh root@mail1
cd /var/www/vhosts/techbridge.edu.gh/tuc-rms-api
npm install --production
pm2 restart tuc-rms-api
```

## Support

For issues:

1. **Check logs first** — `pm2 logs tuc-rms-api` or check Apache logs
2. **Verify connectivity** — `curl https://techbridge.edu.gh/api/health`
3. **Database access** — `mysql -u tuc_rms_user -p tuc_rms`
4. **Apache config** — `sudo apache2ctl configtest`

Contact: ict@tuc.edu.gh

---

**Document:** TUC RMS Deployment Quick Start  
**Version:** 2.0 (Updated for /var/www/vhosts/techbridge.edu.gh)  
**Last Updated:** 2026-05-25
