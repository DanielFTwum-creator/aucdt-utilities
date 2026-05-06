# Docker Build Checklist - Step-by-Step Guide

**Repository:** tuc-utilities
**Total Apps:** 78 Vite applications
**Goal:** Build and test all apps in Docker containers

---

## ✅ Pre-Flight Checklist

Before you start, verify these prerequisites:

### 1. Docker Desktop Status

- [ ] Docker Desktop is installed
- [ ] Docker Desktop is running (check system tray icon)
- [ ] Docker icon shows "Docker Desktop is running" (green status)

**Verify:**
```bash
docker --version
# Should show: Docker version 29.0.1 or higher

docker ps
# Should show a table (even if empty)
# If error, Docker Desktop is NOT running!
```

**If not running:**
- Windows: Start Menu → Docker Desktop
- Mac: Applications → Docker Desktop
- Wait for whale icon to show green status

### 2. System Resources

- [ ] At least 8 GB RAM available
- [ ] At least 20 GB free disk space
- [ ] Good internet connection (for first build)

**Configure Docker Desktop:**
```
1. Docker Desktop → Settings (gear icon)
2. Resources → Memory: Set to 8 GB minimum
3. Resources → CPUs: Set to 4+ cores
4. Resources → Disk: Verify 20+ GB available
5. Click "Apply & Restart"
```

### 3. Terminal Setup

- [ ] Terminal open (Git Bash, PowerShell, or CMD)
- [ ] Located in correct directory

**Navigate to project:**
```bash
cd C:/Users/DELL/OneDrive/Documents/Downloads/Development/tuc-utilities

# Verify you're in correct location
ls docker-compose.yml
# Should show: docker-compose.yml exists
```

---

## 🚀 Build & Start - Option 1: High-Priority Apps (Recommended)

This option builds and starts **6 apps** - perfect for first-time testing!

### Step 1: Start the Build Process

```bash
docker-compose up --build
```

**What this does:**
- Builds 6 high-priority Docker images
- Starts all containers
- Shows live logs in terminal

**Expected output:**
```
[+] Building 967.2s (78/78) FINISHED
 => [analytics-refactor internal] load metadata...
 => [fees-comparison internal] load metadata...
 => [nginx-gateway internal] load metadata...
```

### Step 2: Wait for Build to Complete

⏱️ **Expected Time:** 15-25 minutes (first time only!)

**Progress indicators to watch for:**

- [ ] `[1/6] FROM node:20-alpine` ✓
- [ ] `[2/6] COPY package*.json ./` ✓
- [ ] `[3/6] RUN pnpm install --frozen-lockfile` ✓ (slowest part)
- [ ] `[4/6] COPY . .` ✓
- [ ] `[5/6] RUN pnpm run build` ✓ (Vite building)
- [ ] `[6/6] Creating nginx container` ✓

**You'll see this for each of 6 apps:**
- analytics-refactor
- fees-comparison-dashboard
- tuc-analytics-dashboard
- kanban-app
- tuc-website-react
- techbridge-product-design-6r-design-portal

### Step 3: Wait for "Ready" Messages

When build completes, containers start. Watch for:

```
✔ Network tuc-network                 Created
✔ Container nginx-gateway               Started
✔ Container analytics-refactor          Started
✔ Container fees-comparison-dashboard   Started
✔ Container tuc-analytics-dashboard   Started
✔ Container kanban-app                  Started
✔ Container tuc-website-react         Started
✔ Container techbridge-portal           Started
```

**Then you'll see logs like:**
```
analytics-refactor      | /docker-entrypoint.sh: Configuration complete; ready for start up
nginx-gateway          | Gateway ready at :8080
```

- [ ] All containers show "Started" ✓
- [ ] Nginx gateway shows "ready at :8080" ✓

### Step 4: Access the Applications

**Open your browser:**

🌐 **Main Dashboard:** http://localhost:8080

You should see:
- [ ] Beautiful landing page loads ✓
- [ ] Shows list of 6 running apps ✓
- [ ] All apps show green "Running" status ✓
- [ ] Search box is functional ✓

### Step 5: Test Individual Apps

Click on each app link from the dashboard:

**Test these apps:**
- [ ] Analytics Refactor → http://localhost:8080/analytics-refactor/
- [ ] Fees Comparison → http://localhost:8080/fees-comparison/
- [ ] TUC Analytics → http://localhost:8080/tuc-analytics/
- [ ] Kanban → http://localhost:8080/kanban/
- [ ] TUC Website → http://localhost:8080/tuc-website/
- [ ] Techbridge Portal → http://localhost:8080/techbridge-portal/

**Each app should:**
- [ ] Load without errors
- [ ] Display correctly
- [ ] Assets load (CSS, JS, images)
- [ ] No console errors (F12 → Console)

### Step 6: Verify Containers are Healthy

**Open a new terminal** (keep the first one running with logs)

```bash
docker ps
```

**Check STATUS column for each container:**

- [ ] `analytics-refactor` → healthy
- [ ] `fees-comparison-dashboard` → healthy
- [ ] `tuc-analytics-dashboard` → healthy
- [ ] `kanban-app` → healthy
- [ ] `tuc-website-react` → healthy
- [ ] `techbridge-portal` → healthy
- [ ] `nginx-gateway` → healthy

**If any show "unhealthy":**
```bash
docker logs <container-name>
# Review logs for errors
```

### Step 7: View Logs (Optional)

**In second terminal:**
```bash
# All logs
docker-compose logs

# Specific app
docker-compose logs analytics-refactor

# Follow logs (live)
docker-compose logs -f
```

### Step 8: Stop When Done

**Option A: Graceful Stop (keeps containers)**
```bash
# In terminal with running logs:
Ctrl + C

# Or in new terminal:
docker-compose stop
```

**Option B: Stop and Remove (clean shutdown)**
```bash
docker-compose down
```

---

## 🌐 Build & Start - Option 2: All 78 Apps (Advanced)

For testing all apps at once:

### Step 1: Build All Apps

```bash
docker-compose -f docker-compose-full.yml --profile full build
```

⏱️ **Expected Time:** 45-60 minutes (first time)

### Step 2: Start All Apps

```bash
docker-compose -f docker-compose-full.yml --profile full up
```

### Step 3: Access

🌐 http://localhost:8080

All 78 apps will be listed!

---

## 🔧 Build & Start - Option 3: Specific Apps Only

Build and run specific apps:

### Example: Just Analytics and Fees Comparison

```bash
docker-compose build analytics-refactor fees-comparison-dashboard
docker-compose up analytics-refactor fees-comparison-dashboard nginx-gateway
```

**Note:** Always include `nginx-gateway` for the reverse proxy!

---

## 📊 Progress Tracking Checklist

### Build Phase (15-25 min)

**For EACH of 6 apps, you'll see:**

- [ ] Pulling base images (node:20-alpine, nginx:alpine) - 2 min
- [ ] Copying package files - 10 sec
- [ ] Installing dependencies (pnpm install) - 3-5 min per app
- [ ] Copying source code - 30 sec
- [ ] Building with Vite (npm run build) - 2-3 min per app
- [ ] Creating nginx container - 1 min

### Container Start Phase (1-2 min)

- [ ] Creating network (tuc-network)
- [ ] Starting nginx-gateway
- [ ] Starting all 6 app containers
- [ ] Health checks passing
- [ ] Ready messages in logs

### Access Phase

- [ ] Browser opens http://localhost:8080
- [ ] Landing page displays
- [ ] All 6 app links work
- [ ] Individual apps load correctly

---

## 🐛 Troubleshooting Checklist

### Issue: Docker Desktop Not Running

**Symptoms:**
```
error during connect: This error may indicate that the docker daemon is not running
```

**Solution:**
- [ ] Start Docker Desktop
- [ ] Wait for green whale icon
- [ ] Try command again

### Issue: Port 8080 Already in Use

**Symptoms:**
```
Error: bind: address already in use
```

**Solution:**
```bash
# Option 1: Kill process using port 8080
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # Mac/Linux

# Option 2: Change port in docker-compose.yml
# Edit line: "8080:80" → "8081:80"
```

### Issue: Build Takes Forever

**Normal!** First build downloads everything:
- [ ] Base images (500 MB)
- [ ] Node modules for each app
- [ ] Building production bundles
- [ ] Creating production bundles

**Speed it up:**
- [ ] Enable BuildKit: `export DOCKER_BUILDKIT=1`
- [ ] Close other apps to free RAM
- [ ] Ensure good internet connection

### Issue: Out of Memory

**Symptoms:**
```
Container killed due to OOM (Out of Memory)
```

**Solution:**
- [ ] Increase Docker Desktop memory (Settings → Resources → 8 GB)
- [ ] Close other applications
- [ ] Build fewer apps: `docker-compose up analytics-refactor fees-comparison-dashboard`

### Issue: Build Fails for Specific App

**Symptoms:**
```
ERROR [analytics-refactor 4/6] RUN pnpm run build
```

**Solution:**
```bash
# Test build locally first
cd analytics-refactor
npm install
npm run build

# If it works locally, rebuild Docker:
docker-compose build --no-cache analytics-refactor
```

### Issue: Container Keeps Restarting

**Check logs:**
```bash
docker ps -a  # See all containers
docker logs <container-name>
```

**Common causes:**
- [ ] Missing dependencies → rebuild
- [ ] Port conflict → change port
- [ ] Failed health check → review health endpoint

### Issue: App Loads but Assets Missing

**Symptoms:**
- Page loads but no styling
- Missing images/fonts
- Console errors: "Failed to load resource"

**Verify:**
- [ ] `base: './'` in vite.config.js
- [ ] Rebuild: `docker-compose up --build`
- [ ] Check browser console (F12)

---

## 🎯 Post-Build Checklist

After successful build and start:

### Verification

- [ ] All 6 containers running
- [ ] All containers show "healthy" status
- [ ] http://localhost:8080 loads
- [ ] Landing page displays
- [ ] All 6 app links work
- [ ] No console errors
- [ ] Apps display correctly

### Cleanup
- [ ] Tested all apps
- [ ] Screenshots taken (optional)
- [ ] Note any issues
- [ ] Containers stopped (`docker-compose down`)

---

## 🎉 Success Criteria

**You've successfully completed Docker setup when:**

✅ All 6 containers running
✅ All apps accessible at http://localhost:8080
✅ No errors in logs
✅ Apps load with proper styling
✅ Navigation works between apps

**Congratulations!** You now have all 78 Vite apps containerized and ready to test! 🎊

---

**Created:** February 20, 2026
**Status:** Ready to Execute
**Estimated Time:** 15-25 minutes (first build)

**START HERE:** ☑️ Step 1 of Pre-Flight Checklist
