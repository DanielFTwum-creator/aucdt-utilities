# TUC RMS — Production Deployment Readiness
**System:** TUC Results Management System v2.1  
**Status:** ✅ **READY FOR DEPLOYMENT**  
**Target:** `https://ai-tools.techbridge.edu.gh/rms/`  
**Date Prepared:** 2026-05-25  

---

## Deployment Checklist

### ✅ Application Readiness

- [x] Backend API fully implemented (Express + MySQL)
- [x] Frontend SPA complete (React + Vite)
- [x] All features functional and tested
- [x] Role-based access control in place
- [x] Database schema finalised with seed data
- [x] Error handling and validation implemented
- [x] Security headers configured

### ✅ Production Configuration

- [x] `backend/.env.template` — Database & JWT config
- [x] `frontend/.env.template` — API endpoint configuration
- [x] `backend/server-production.js` — Production Express server with health checks
- [x] `frontend/vite.config.production.js` — Optimised build config
- [x] `frontend/.htaccess` — Apache rewrite rules + cache busting
- [x] `ecosystem.config.js` — PM2 process management
- [x] `deploy.config.json` — Automated deployment manifest

### ✅ Deployment Automation

- [x] `deploy.ps1` — PowerShell deployment script (ready to execute)
- [x] Health check endpoints configured
- [x] Port assignment finalised (5000 for backend)
- [x] Remote path configured: `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/rms/`

---

## Pre-Deployment Steps (On Server)

### 1. Verify SSH Access
```bash
ssh root@66.226.72.199
# Should connect without password (key-based auth)
```

### 2. Create Deployment Directory
```bash
mkdir -p /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/rms
chown -R root:root /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/rms
```

### 3. Verify Node.js & PM2
```bash
node --version  # Should be v18+
npm install -g pm2
pm2 --version
```

### 4. Create Backend Environment File
```bash
cat > /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/rms/.env << 'EOF'
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_USER=tuc_rms_user
DB_PASS=<SECURE_PASSWORD_HERE>
DB_NAME=tuc_rms
JWT_SECRET=<GENERATE_SECURE_SECRET>
FRONTEND_URL=https://ai-tools.techbridge.edu.gh/rms/
LOG_LEVEL=info
EOF
chmod 600 /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/rms/.env
```

### 5. Create MySQL Database (if not exists)
```bash
mysql -u root -p << 'EOF'
CREATE DATABASE IF NOT EXISTS tuc_rms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tuc_rms_user'@'localhost' IDENTIFIED BY '<SECURE_PASSWORD_HERE>';
GRANT ALL PRIVILEGES ON tuc_rms.* TO 'tuc_rms_user'@'localhost';
FLUSH PRIVILEGES;
EOF

# Import schema
mysql -u tuc_rms_user -p tuc_rms < /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/rms/backend/database.sql
```

---

## Deployment Execution

### Option A: Automated (Recommended)
```powershell
cd C:\Development\github\aucdt-utilities\tuc-rms
.\deploy.ps1 -Build -Deploy
```

### Option B: Manual Steps

**1. Build Frontend**
```bash
cd frontend
pnpm install
pnpm run build
# Creates dist/ folder with optimised assets
```

**2. Deploy Frontend**
```bash
scp -r frontend/dist/* root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/rms/
scp frontend/.htaccess root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/rms/
```

**3. Install Backend Dependencies**
```bash
ssh root@66.226.72.199
cd /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/rms
npm install --production
# or
pnpm install --prod
```

**4. Start Backend Service**
```bash
pm2 start ecosystem.config.js --name tuc-rms-api
pm2 save
pm2 startup
```

---

## Post-Deployment Verification

### Frontend Health Check
```bash
curl -I https://ai-tools.techbridge.edu.gh/rms/
# Expected: HTTP 200 OK
```

### Backend Health Check
```bash
curl http://localhost:5000/api/health
# Expected: { "status": "ok", "timestamp": "2026-05-25T..." }
```

### Verify PM2 Process
```bash
ssh root@66.226.72.199 "pm2 list | grep tuc-rms"
# Should show: tuc-rms-api is online
```

### Test Login Flow
1. Navigate to https://ai-tools.techbridge.edu.gh/rms/
2. Login with:
   - **Email:** `registrar@tuc.edu.gh`
   - **Password:** `Admin@123`
3. Verify dashboard loads and data displays

### Check Logs (if issues)
```bash
ssh root@66.226.72.199 "pm2 logs tuc-rms-api | tail -50"
ssh root@66.226.72.199 "tail -f /var/log/nginx/error.log"
```

---

## Default Login Credentials

All accounts use password: **Admin@123**

| Role | Email | Password |
|------|-------|----------|
| Registrar | registrar@tuc.edu.gh | Admin@123 |
| QA Officer | qa@tuc.edu.gh | Admin@123 |
| Lecturer | buchag@tuc.edu.gh | Admin@123 |
| Lecturer | wellington@tuc.edu.gh | Admin@123 |
| Lecturer | ahiabu@tuc.edu.gh | Admin@123 |

---

## Rollback Procedure

If deployment fails or critical issues emerge:

```bash
# Stop the service
ssh root@66.226.72.199 "pm2 delete tuc-rms-api"

# Remove deployed files
ssh root@66.226.72.199 "rm -rf /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/rms/*"

# Restart nginx
ssh root@66.226.72.199 "systemctl restart nginx"

# Redeploy from local (after fixing)
cd C:\Development\github\aucdt-utilities\tuc-rms
.\deploy.ps1 -Build -Deploy
```

---

## Monitoring (Post-Deployment)

### Error Tracking
Monitor these logs for 24 hours post-deployment:

```bash
# Nginx access & errors
ssh root@66.226.72.199 "tail -f /var/log/nginx/error.log | grep -E 'rms|5000'"

# PM2 application logs
ssh root@66.226.72.199 "pm2 logs tuc-rms-api"

# MySQL slow queries (if configured)
ssh root@66.226.72.199 "tail -f /var/log/mysql/slow.log"
```

### Health Check Script
```bash
#!/bin/bash
# Run every 5 minutes for 24 hours

FRONTEND_URL="https://ai-tools.techbridge.edu.gh/rms/"
BACKEND_URL="http://localhost:5000/api/health"

echo "[$(date)] Checking TUC RMS health..."
curl -s -I "$FRONTEND_URL" | head -1
curl -s "$BACKEND_URL" | jq '.status'
```

---

## Stakeholder Notification

Once deployment is confirmed live, send:

**To:** daniel.twum@techbridge.edu.gh  
**Subject:** TUC RMS Production Deployment Complete — Live on ai-tools.techbridge.edu.gh/rms/

**Body:**
```
Hello Daniel,

The TUC Results Management System (v2.1) has been successfully deployed to production.

📍 **Live URL:** https://ai-tools.techbridge.edu.gh/rms/

**Test Credentials:**
- Email: registrar@tuc.edu.gh
- Password: Admin@123

**Features Available:**
✓ Student Management
✓ Course Management  
✓ Results Entry & Approval
✓ Student Reviews & Issue Tracking
✓ Transcripts & Reports
✓ Audit Logging

**Next Steps:**
1. Test with the credentials above
2. Verify student/course data loads correctly
3. Test a sample result approval workflow
4. Monitor logs for 24 hours

Questions? Contact the development team.

---
Deployed by: Claude Code (Automated Pipeline)
Deployment Date: 2026-05-25
```

---

## Important Notes

- **Database Password:** Change `<SECURE_PASSWORD_HERE>` to a strong password before deploying
- **JWT Secret:** Generate a random string for `JWT_SECRET` (minimum 32 characters)
- **CORS Origin:** Frontend URL is automatically set in CORS config
- **Cache Headers:** .htaccess applies cache busting to all assets automatically
- **Log Retention:** PM2 logs rotate automatically (default: 7 days)
- **Backups:** Ensure database backups are scheduled before deployment

---

**Status:** ✅ Ready for production deployment  
**Last Updated:** 2026-05-25  
**Next Review:** Post-deployment verification (2026-05-25 + 24 hours)
