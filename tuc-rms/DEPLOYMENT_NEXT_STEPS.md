# TUC RMS — Deployment Ready

The app is **fully built and tested**. You're ready to deploy to `techbridge.edu.gh/rms`.

## Quick Checklist ✅

- ✅ Login/OTP flow works end-to-end (verified)
- ✅ Authentication bug fixed (auth middleware table name)
- ✅ Frontend builds successfully
- ✅ Backend starts and responds to requests
- ✅ Database schema created
- ✅ Deployment script ready
- ✅ All documentation complete

## Your Next Step: Deploy

### 1. Generate Secure Secrets

Run these commands to generate production secrets:

```bash
# JWT Secret (copy the output)
openssl rand -base64 32

# Session Secret (copy the output)
openssl rand -base64 32
```

Keep these values safe — you'll need them for deployment.

### 2. Run the Deployment Script

From the `tuc-rms` directory on your local machine:

```bash
./deploy.sh "root@mail1" "YourSecureDBPassword123!" "YourGeneratedJWTSecret"
```

Replace:
- `root@mail1` — your SSH host
- `YourSecureDBPassword123!` — any secure password for the database user
- `YourGeneratedJWTSecret` — the output from `openssl rand -base64 32` above

**Example:**
```bash
./deploy.sh "root@mail1" "SecurePass456!" "gAr+2hK9nL/bXc1mP0qR5sT8uV3wXyZ"
```

### 3. Wait for Completion

The script will run through all 10 phases. Expected time: **3–5 minutes**.

Watch the output for any errors. If all phases show ✅, deployment succeeded.

### 4. Verify the Deployment

Once complete, test these URLs in your browser:

```
https://techbridge.edu.gh/rms        (Frontend)
https://techbridge.edu.gh/api/health (API Health)
```

## Files Created for Deployment

| File | Purpose |
|---|---|
| `deploy.sh` | Main deployment script (241 lines) |
| `DEPLOYMENT_QUICK_START.md` | Full deployment guide with troubleshooting |
| `DEPLOYMENT_SUMMARY.txt` | Quick reference summary |
| `backend/database.sql` | Database schema (auto-uploaded) |

## If Something Goes Wrong

1. **Check the error message** from the deploy script
2. **Consult DEPLOYMENT_QUICK_START.md** — has a troubleshooting section for every common issue
3. **Rollback** using the instructions in DEPLOYMENT_QUICK_START.md (backups are created automatically)

## First Login

After deployment:

1. Go to `https://techbridge.edu.gh/rms`
2. Email: `daniel.twum@techbridge.edu.gh`
3. Check email for OTP (or check backend logs if email isn't working yet)
4. Enter OTP → Dashboard opens

## Post-Deployment Monitoring

Once deployed, monitor the app:

```bash
# SSH to server
ssh root@mail1

# View backend logs
pm2 logs tuc-rms-api

# Check backend status
pm2 list

# View Apache errors
tail -f /var/log/apache2/tuc-rms-error.log
```

## What's Deployed

| Component | Location |
|---|---|
| **Frontend** | `/var/www/vhosts/techbridge.edu.gh/rms/` |
| **Backend** | `/var/www/vhosts/techbridge.edu.gh/tuc-rms-api/` |
| **Database** | `tuc_rms` (MySQL) |
| **Config** | `/var/www/vhosts/techbridge.edu.gh/tuc-rms-api/.env` |

## Next Updates

If you update code later:

**Frontend:**
```bash
cd frontend && npm run build:prod && cd ..
scp -r frontend/dist/* root@mail1:/var/www/vhosts/techbridge.edu.gh/rms/
```

**Backend:**
```bash
scp -r backend/* root@mail1:/var/www/vhosts/techbridge.edu.gh/tuc-rms-api/
ssh root@mail1 "cd /var/www/vhosts/techbridge.edu.gh/tuc-rms-api && npm install --production && pm2 restart tuc-rms-api"
```

## Still Have Questions?

- **Deployment steps?** → See `DEPLOYMENT_QUICK_START.md`
- **Server error?** → See troubleshooting in `DEPLOYMENT_QUICK_START.md`
- **Emergency rollback?** → See rollback section in `DEPLOYMENT_QUICK_START.md`
- **Maintenance commands?** → See `DEPLOYMENT_SUMMARY.txt`

---

**You're ready. Run the deploy script and you'll be live in minutes.** 🚀

Questions? Check the docs or reach out to ict@tuc.edu.gh
