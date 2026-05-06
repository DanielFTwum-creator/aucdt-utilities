# 🚀 Quick Start: Docker Gateway Screenshot Capture

**Goal:** Capture production screenshots from all Docker containers AND validate they're working.

---

## ⚡ 3-Step Process

### Step 1️⃣: Start Docker Services (2 minutes)

```bash
cd C:\Development\aucdt-utilities

# Start all 319 Docker services
docker-compose -f docker-compose-all-apps.yml up -d
```

**Wait for services to start** (~60 seconds). You'll see:
```
Creating nginx-gateway ... done
Creating analytics-refactor ... done
Creating fees-comparison-dashboard ... done
[... 316 more services ...]
```

**Verify gateway is ready:**
```bash
# Open in browser
start http://localhost:8080

# Or check with curl
curl http://localhost:8080
```

You should see the app listing page.

---

### Step 2️⃣: Run Screenshot Capture (15-30 minutes)

**Option A: Windows (Easiest)**
```cmd
capture-docker-gateway.bat
```

**Option B: Command Line**
```bash
node capture-docker-gateway.js
```

**Option C: NPM Script**
```bash
npm run screenshots:docker
```

---

### Step 3️⃣: Review Results (2 minutes)

Check the generated logs:

```bash
# Successful captures
type docker-validation-success.log

# Failed captures (need debugging)
type docker-validation-failed.log

# Backend APIs (no UI, skipped)
type backend-apis.log
```

Screenshots are saved to: **`catalogue\<app-name>\screenshot.png`**

---

## 📊 What to Expect

### Console Output:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TUC Docker Gateway Screenshot Capture & Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🐳 Checking Docker status...
✅ Docker is running

🌐 Checking NGINX gateway...
✅ Gateway accessible at http://localhost:8080

📦 Scanning for projects...
✅ Found 262 projects:
   • 250 frontend apps (will capture screenshots)
   • 12 backend APIs (will skip)

🚀 Launching browser...
✅ Browser ready

📸 Starting screenshot capture...

[1/250] 6r-product-design-workshop-portal
  → URL: http://localhost:8080/6r-product-design-workshop-portal
  ✅ SUCCESS: Screenshot saved

[2/250] academic-integrity-detector
  → URL: http://localhost:8080/academic-integrity-detector
  ✅ SUCCESS: Screenshot saved

... (250 apps) ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📊 FINAL REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Statistics:
   Total Apps Scanned:      250
   ✅ Screenshots Captured:  242
   ❌ Failed:                 8
   ⊘  Backend APIs (skipped): 12
   ⏱️  Duration:              18.5 minutes
   📊 Success Rate:          96.8%

✅ Success log: docker-validation-success.log
❌ Failed log: docker-validation-failed.log

🎉 242 DOCKER CONTAINERS VALIDATED SUCCESSFULLY!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Expected Timing:
- **250 apps × ~4-5 seconds each = 16-21 minutes**
- Processes 3 apps in parallel (concurrency=3)

### Expected Success Rate:
- **95-100%:** Excellent ✅
- **85-95%:** Good, some issues to debug
- **<85%:** Review Docker configuration

---

## 🔍 What This Validates

For each app, the script confirms:

✅ **Docker container is running**
✅ **NGINX gateway routes correctly**
✅ **App builds successfully**
✅ **App serves on correct port**
✅ **App loads without errors**
✅ **UI renders properly**

**Failed apps = Docker containers that need attention**

---

## 🆚 Why Docker Gateway vs File-Based?

| File-Based (`file://index.html`) | Docker Gateway (`http://localhost:8080`) |
|-----------------------------------|------------------------------------------|
| ❌ Shows placeholder HTML only | ✅ Shows real rendered application |
| ❌ JavaScript doesn't execute | ✅ Full JavaScript execution |
| ❌ No styles/assets loaded | ✅ Complete production build with assets |
| ❌ No validation | ✅ Validates Docker containers |
| ⚡ Fast but useless | ⚡ Slightly slower but accurate |

---

## 🐛 Troubleshooting

### Problem: "Docker is not running"
```bash
# Start Docker Desktop, then:
docker-compose -f docker-compose-all-apps.yml up -d
```

### Problem: "Gateway not accessible"
```bash
# Check gateway status
docker ps | grep nginx-gateway

# Restart gateway
docker-compose -f docker-compose-all-apps.yml restart nginx-gateway
```

### Problem: Many apps failing
```bash
# Check which services are running
docker-compose -f docker-compose-all-apps.yml ps

# View logs for failed app
docker-compose -f docker-compose-all-apps.yml logs <app-name>
```

### Problem: "Page appears blank"
- Visit app manually: `http://localhost:8080/<app-name>`
- Check app logs: `docker-compose logs <app-name>`
- Verify screenshot: `catalogue\<app-name>\screenshot.png`

---

## 📝 After Capture

### View individual screenshot:
```bash
start catalogue\analytics-refactor\screenshot.png
```

### Generate HTML gallery:
```bash
npm run gallery

# Then open:
start http://localhost:8080/catalogue/
```

### Debug failed apps:
```bash
# Read failed log
type docker-validation-failed.log

# Visit failed app manually
start http://localhost:8080/<failed-app-name>

# Check logs
docker-compose -f docker-compose-all-apps.yml logs <failed-app-name>

# Rebuild if needed
docker-compose -f docker-compose-all-apps.yml build --no-cache <failed-app-name>
```

---

## ⚙️ Configuration

Edit `capture-docker-gateway.js` to customize:

```javascript
const CONFIG = {
  gatewayUrl: 'http://localhost:8080',  // Change if gateway on different port
  timeout: 15000,                        // Increase if apps are slow to load
  concurrency: 3,                        // Increase to 5-6 for faster capture
  viewportWidth: 1920,                   // Screenshot resolution
  viewportHeight: 1080,
  waitForNetworkIdle: true,              // Set false for faster capture
};
```

---

## 📂 Generated Files

| File | Purpose |
|------|---------|
| `docker-validation-success.log` | List of apps that captured successfully |
| `docker-validation-failed.log` | List of apps that failed (with error details) |
| `backend-apis.log` | List of backend APIs (no UI, skipped) |
| `catalogue/<app>/screenshot.png` | Individual app screenshots |

---

## 🎯 Success Criteria

Your capture is successful if:

✅ **Success rate ≥ 95%** (238+ out of 250 apps)
✅ **All critical apps captured** (techbridge-*, student-*, etc.)
✅ **Screenshots show real UI** (not blank/placeholder pages)
✅ **Failed apps are documented** in docker-validation-failed.log

---

## 🔄 Stop Docker Services (When Done)

```bash
# Stop all services
docker-compose -f docker-compose-all-apps.yml down

# Or keep running for development
# (Services will auto-restart on reboot if configured)
```

---

## 📚 More Information

- **Full Guide:** `DOCKER-SCREENSHOT-GUIDE.md`
- **Docker Setup:** `START_HERE.md`
- **Campus Deployment:** `CAMPUS_DEPLOYMENT_GUIDE.md`

---

**Ready? Run these commands:**

```bash
cd C:\Development\aucdt-utilities
docker-compose -f docker-compose-all-apps.yml up -d
capture-docker-gateway.bat
```

**Estimated time: 20-25 minutes total**

🎉 **Good luck!**
