# Deployment Execution Guide — 23 Apps (2026-05-25)

**Purpose:** Step-by-step execution of all 23 apps to production.  
**Prerequisites:** SSH access to ai-tools.techbridge.edu.gh, pnpm installed locally, all dist/ folders built.  
**Estimated Duration:** 45–60 minutes total.

---

## Pre-Deployment Checklist

- [ ] All 23 `dist/` folders exist and are non-empty
- [ ] All 23 `deploy.ps1` scripts are present and executable
- [ ] Network connectivity to ai-tools.techbridge.edu.gh confirmed
- [ ] SSH key is loaded in SSH agent
- [ ] User has logged in to Plesk dashboard (for post-deploy verification)

**Verify:**
```powershell
cd C:\Development\github\aucdt-utilities
ls */dist | Measure-Object | Select-Object Count
ls */deploy.ps1 | Measure-Object | Select-Object Count
# Both should show 23
```

---

## PHASE 1: GROUP A Deployment (Frontend-Only, 14 apps, ~8–10 minutes)

**Command to run:** Execute one app at a time, in order.

### Step 1.1 — daaro-distributor
```powershell
cd daaro-distributor
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/sdwater/`  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/sdwater/`  
Expected: `200 OK` within 2 seconds.

---

### Step 1.2 — typing-and-mathematics-tutorial
```powershell
cd typing-and-mathematics-tutorial
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/math-island/`  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/math-island/`  
Expected: `200 OK` within 2 seconds.

---

### Step 1.3 — typing-tutorial
```powershell
cd typing-tutorial
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/typing-tutor/`  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/typing-tutor/`  
Expected: `200 OK` within 2 seconds.

---

### Step 1.4 — ai-stand-up-workshop-prep-dashboard
```powershell
cd ai-stand-up-workshop-prep-dashboard
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/workshop/`  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/workshop/`  
Expected: `200 OK` within 2 seconds.

---

### Step 1.5 — bionicskins™
```powershell
cd "bionicskins™"
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/bionicskins/`  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/bionicskins/`  
Expected: `200 OK` within 3 seconds.

---

### Step 1.6 — dictation-app
```powershell
cd dictation-app
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/dictation/`  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/dictation/`  
Expected: `200 OK` within 2 seconds.

---

### Step 1.7 — dmcdai-digital-media-communication-design
```powershell
cd dmcdai-digital-media-communication-design
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/dmcdai/`  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/dmcdai/`  
Expected: `200 OK` within 2 seconds.

---

### Step 1.8 — impact-ventures-dashboard
```powershell
cd impact-ventures-dashboard
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/impact-ventures/`  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/impact-ventures/`  
Expected: `200 OK` within 3 seconds.

---

### Step 1.9 — luxthumb-agent
```powershell
cd luxthumb-agent
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/luxthumb/`  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/luxthumb/`  
Expected: `200 OK` within 3 seconds.

---

### Step 1.10 — markai
```powershell
cd markai
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/markai/`  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/markai/`  
Expected: `200 OK` within 2 seconds.

---

### Step 1.11 — orbit-walk-reminder
```powershell
cd orbit-walk-reminder
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/orbit-walk-reminder/`  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/orbit-walk-reminder/`  
Expected: `200 OK` within 2 seconds.

---

### Step 1.12 — patois-lyricist-v2.0.0
```powershell
cd patois-lyricist-v2.0.0
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/lyricist/`  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/lyricist/`  
Expected: `200 OK` within 3 seconds.

---

### Step 1.13 — rophe-specialist-care-rpms
```powershell
cd rophe-specialist-care-rpms
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/care/`  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/care/`  
Expected: `200 OK` within 3 seconds.

---

### Step 1.14 — techbridge-ai-application-portal
```powershell
cd techbridge-ai-application-portal
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/`  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/`  
Expected: `200 OK` within 2 seconds.

---

**✓ GROUP A COMPLETE** — All 14 frontend-only apps deployed.  
**Time Elapsed:** ~8–10 minutes.

---

## PHASE 2: GROUP B Deployment (Full-Stack, 9 apps, ~27–45 minutes)

**Note:** These apps have backends (Node.js/TSX) that start automatically after SCP. Each deploy includes a health check wait loop.

---

### Step 2.1 — glucose
```powershell
cd glucose
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/glucose/`  
**Backend Port:** 3006 (TSX)  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/glucose/`  
Expected: `200 OK` within 5 seconds (backend startup included).

---

### Step 2.2 — peace-vinyl
```powershell
cd peace-vinyl
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/peace/`  
**Backend Port:** 3001 (Node)  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/peace/`  
Expected: `200 OK` within 5 seconds.

---

### Step 2.3 — biochemai
```powershell
cd biochemai
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/biochemai/`  
**Backend Port:** 3002 (TSX)  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/biochemai/`  
Expected: `200 OK` within 5 seconds.

---

### Step 2.4 — deliberate-magic-reader
```powershell
cd deliberate-magic-reader
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/magic-reader/`  
**Backend Port:** 3008 (Node)  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/magic-reader/`  
Expected: `200 OK` within 5 seconds.

---

### Step 2.5 — tuc-ai-lab-catalog
```powershell
cd tuc-ai-lab-catalog
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/ai-lab/`  
**Backend Port:** 3003 (TSX)  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/ai-lab/`  
Expected: `200 OK` within 5 seconds. Verify hero search bar is visible on page load.

---

### Step 2.6 — willpro
```powershell
cd willpro
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/willpro/`  
**Backend Port:** 3004 (TSX)  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/willpro/`  
Expected: `200 OK` within 5 seconds. ⚠️ Note: port 3004 shared with groove-streamer (willpro is active now).

---

### Step 2.7 — techbridge-ai-blueprint
```powershell
cd techbridge-ai-blueprint
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/blueprint/`  
**Backend Port:** 3005 (TSX)  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/blueprint/`  
Expected: `200 OK` within 5 seconds.

---

### Step 2.8 — ai-email-drafter
```powershell
cd ai-email-drafter
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/email-drafter/`  
**Backend Port:** 3007 (TSX)  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/email-drafter/`  
Expected: `200 OK` within 5 seconds.

---

### Step 2.9 — groove-streamer (LAST — Port 3004 Conflict)
```powershell
cd groove-streamer
./deploy.ps1 -Build
```
**Endpoint:** `https://ai-tools.techbridge.edu.gh/bridge-radio/`  
**Backend Port:** 3004 (TSX) — ⚠️ **Will replace willpro's backend**  
**Health Check:** `curl -I https://ai-tools.techbridge.edu.gh/bridge-radio/`  
Expected: `200 OK` within 5 seconds.

**⚠️ After this deployment:** willpro's frontend will still load, but its backend (port 3004) is now running groove-streamer's code. Document this in DEPLOYMENT_TRACKER.md.

---

**✓ GROUP B COMPLETE** — All 9 full-stack apps deployed.  
**Time Elapsed:** ~27–45 minutes (including backend startup waits).

---

## PHASE 3: Final Verification (2–3 minutes)

After all 23 apps are deployed, run these health checks:

### 3.1 — Verify 3 representative apps
```powershell
# Frontend-only (daaro-distributor)
curl -I https://ai-tools.techbridge.edu.gh/sdwater/
# Expected: 200 OK, response time < 2 sec

# Full-stack (biochemai)
curl -I https://ai-tools.techbridge.edu.gh/biochemai/
# Expected: 200 OK, response time < 3 sec

# Discovery-redesigned (tuc-ai-lab-catalog)
curl -I https://ai-tools.techbridge.edu.gh/ai-lab/
# Expected: 200 OK, response time < 5 sec
```

### 3.2 — Plesk Dashboard Verification
1. Log in to Plesk: `https://plesk.techbridge.edu.gh:8443`
2. Navigate to **File Manager → /home/aucdt/public_html/**
3. Confirm 23 subdirectories exist: `/sdwater/`, `/biochemai/`, `/ai-lab/`, etc.
4. Spot-check 3 directories for non-empty `index.html` files.

### 3.3 — Cache Headers Verification
```powershell
# Verify CSS/JS get 1-year cache (immutable)
curl -I https://ai-tools.techbridge.edu.gh/sdwater/assets/index-*.css
# Look for: Cache-Control: public, immutable; max-age=31536000

# Verify HTML gets 0-cache (always revalidate)
curl -I https://ai-tools.techbridge.edu.gh/sdwater/index.html
# Look for: Cache-Control: public, must-revalidate; max-age=0
```

---

## Troubleshooting

### If a deploy script fails:

1. **JSON parse error in package.json:**
   - Check for backtick-n characters: `grep -n '\`n' {app}/package.json`
   - Fix: Replace `\`n` with actual newline
   - Retry: `./deploy.ps1 -Build`

2. **Backend won't start (TSX/Node process dies silently):**
   - SSH to server: `ssh aucdt@ai-tools.techbridge.edu.gh`
   - Check logs: `tail -50 /var/log/syslog | grep {app-name}`
   - Manually restart: `pm2 start /home/aucdt/public_html/{app}/dist/server.cjs --name {app}`

3. **Health check timeout (curl hangs > 10 seconds):**
   - Check if backend process is running: `pm2 list`
   - Check nginx config: `nginx -t`
   - Restart nginx: `systemctl restart nginx`

4. **SCP fails (permission denied):**
   - Verify SSH key: `ssh-add -l`
   - Verify host in known_hosts: `ssh-keyscan ai-tools.techbridge.edu.gh >> ~/.ssh/known_hosts`
   - Retry deploy script

---

## Post-Deployment Tasks

After all 23 apps are confirmed live:

1. **Update DEPLOYMENT_TRACKER.md:**
   ```markdown
   | 2026-05-25 | All 23 apps | ✅ Group A (14) + Group B (9) | Success |
   ```

2. **Document port 3004 collision:**
   ```markdown
   ⚠️ willpro and groove-streamer share port 3004.
   Currently active: groove-streamer (deployed last).
   willpro frontend loads but backend serves groove-streamer code.
   ```

3. **Notify stakeholders:**
   - Email: daniel.twum@techbridge.edu.gh
   - Subject: "Production Deployment Complete — 23 Apps Live (2026-05-25)"
   - Body: List of all 23 endpoints, health check results, any warnings

---

## Rollback Procedure (if critical issue discovered)

If any app has a critical bug post-deployment:

1. SSH to server
2. Delete the app directory: `rm -rf /home/aucdt/public_html/{app-name}/`
3. Delete any pm2 process: `pm2 delete {app-name}` (if applicable)
4. Restart nginx: `systemctl restart nginx`
5. Revert to prior version or pause the app until fix is ready
6. Document incident in DEPLOYMENT_TRACKER.md with timestamp and reason

---

**Generated:** 2026-05-25 11:45 UTC  
**Ready for execution. Good luck! 🚀**
