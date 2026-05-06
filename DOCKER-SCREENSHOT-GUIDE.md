# Docker Gateway Screenshot Capture Guide

**Purpose:** Capture production-quality screenshots from Docker containers AND validate all containers are working.

---

## Quick Start (3 Steps)

### Step 1: Start All Docker Services

```bash
cd C:\Development\aucdt-utilities

# Start all 319 services
docker-compose -f docker-compose-all-apps.yml up -d

# Wait for services to start (30-60 seconds)
# Watch the logs to see when ready
docker-compose -f docker-compose-all-apps.yml logs -f nginx-gateway
```

**When ready, you'll see:** Gateway ready messages

**Verify gateway is working:**
- Open http://localhost:8080 in your browser
- You should see the app listing page

### Step 2: Run Screenshot Capture

**Windows:**
```cmd
capture-docker-gateway.bat
```

**Git Bash / Linux:**
```bash
node capture-docker-gateway.js
```

### Step 3: Review Results

Check the generated logs:
- `docker-validation-success.log` — Apps that captured successfully ✅
- `docker-validation-failed.log` — Apps that failed (need debugging) ❌
- `backend-apis.log` — Backend APIs without UI (skipped) ⊘

Screenshots are saved to: `catalogue/<app-name>/screenshot.png`

---

## What This Script Does

1. ✅ **Validates Docker is running**
2. ✅ **Checks NGINX gateway is accessible**
3. ✅ **Scans all projects with package.json**
4. ✅ **Identifies backend-only APIs** (skips them)
5. ✅ **Captures screenshots from http://localhost:8080/<app-name>**
6. ✅ **Validates each Docker container is working**
7. ✅ **Generates validation reports**

---

## Benefits Over File-Based Capture

| File-Based (`file://`) | Docker Gateway (`http://`) |
|------------------------|----------------------------|
| ❌ JavaScript doesn't run | ✅ Full application runs |
| ❌ Shows placeholder HTML | ✅ Shows real rendered UI |
| ❌ No validation | ✅ Validates Docker containers |
| ❌ Missing styles/assets | ✅ Complete production build |
| ❌ Fast but useless | ✅ Slightly slower but accurate |

---

## Configuration

Edit `capture-docker-gateway.js` to customize:

```javascript
const CONFIG = {
  gatewayUrl: 'http://localhost:8080',  // Gateway URL
  timeout: 15000,                        // 15 second timeout
  catalogueDir: 'catalogue',             // Screenshot directory
  viewportWidth: 1920,                   // Screenshot width
  viewportHeight: 1080,                  // Screenshot height
  waitForNetworkIdle: true,              // Wait for network
  concurrency: 3,                        // Process 3 apps at once
};
```

---

## Troubleshooting

### Problem: "Docker is not running"

**Solution:**
```bash
# Start Docker Desktop
# Then run:
docker-compose -f docker-compose-all-apps.yml up -d
```

### Problem: "Gateway not accessible"

**Solution:**
```bash
# Check if gateway container is running
docker ps | grep nginx-gateway

# If not running, restart Docker services
docker-compose -f docker-compose-all-apps.yml restart nginx-gateway

# Check gateway logs
docker-compose -f docker-compose-all-apps.yml logs nginx-gateway
```

### Problem: Many apps failing with "HTTP 404"

**Cause:** App is not configured in NGINX gateway or Docker service isn't running

**Solution:**
```bash
# Check which services are running
docker-compose -f docker-compose-all-apps.yml ps

# Check specific service
docker-compose -f docker-compose-all-apps.yml logs <app-name>

# Restart specific service
docker-compose -f docker-compose-all-apps.yml restart <app-name>
```

### Problem: "Page appears blank" warning

**Cause:** App loaded but has no visible content (might be loading, error, or genuinely blank)

**Solution:**
- Check the screenshot manually: `catalogue/<app-name>/screenshot.png`
- Visit the app in browser: `http://localhost:8080/<app-name>`
- Check app logs: `docker-compose -f docker-compose-all-apps.yml logs <app-name>`

### Problem: Script is slow

**Cause:** Processing 260+ apps takes time, especially with network waits

**Solutions:**

1. **Increase concurrency:**
   ```javascript
   concurrency: 5,  // Process 5 apps at once (instead of 3)
   ```

2. **Reduce timeout:**
   ```javascript
   timeout: 10000,  // 10 seconds instead of 15
   ```

3. **Disable network idle wait:**
   ```javascript
   waitForNetworkIdle: false,  // Don't wait for all network requests
   ```

4. **Capture specific apps only:**
   ```bash
   # Edit script to filter projects
   # Add this after findAllProjects():
   projects = projects.filter(p => p.name.startsWith('techbridge-'));
   ```

---

## Expected Results

### Typical Output:

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

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📊 FINAL REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Statistics:
   Total Apps Scanned:      250
   ✅ Screenshots Captured:  240
   ❌ Failed:                 10
   ⊘  Backend APIs (skipped): 12
   ⏱️  Duration:              420.5s
   📊 Success Rate:          96.0%

✅ Success log: docker-validation-success.log
❌ Failed log: docker-validation-failed.log
📋 Backend APIs log: backend-apis.log (12 APIs)

🎉 240 DOCKER CONTAINERS VALIDATED SUCCESSFULLY!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Success Rate Expectations:

- **95-100%:** Excellent — All or nearly all containers working
- **85-95%:** Good — Most containers working, few issues to debug
- **75-85%:** Fair — Some containers need attention
- **<75%:** Poor — Investigate Docker configuration or app builds

---

## Debugging Failed Containers

For apps listed in `docker-validation-failed.log`:

### Step 1: Visit the app manually
```
http://localhost:8080/<failed-app-name>
```

Check what error you see in the browser.

### Step 2: Check Docker logs
```bash
docker-compose -f docker-compose-all-apps.yml logs <failed-app-name>
```

Common errors:
- **Build failed:** Container didn't build properly
- **Port conflict:** Container can't start due to port in use
- **Missing dependencies:** npm install failed during build
- **NGINX misconfiguration:** App not configured in gateway

### Step 3: Rebuild the container
```bash
# Rebuild specific container
docker-compose -f docker-compose-all-apps.yml build --no-cache <failed-app-name>

# Restart container
docker-compose -f docker-compose-all-apps.yml up -d <failed-app-name>

# Test again
curl http://localhost:8080/<failed-app-name>
```

---

## Backend APIs (No Screenshots)

These apps are **Express APIs without UI**. They're listed in `backend-apis.log`:

Examples:
- `backend` (tuc-auth-api)
- `accommodation-management`
- Any app with Express but no React

**These are NORMAL and expected to be skipped.**

To verify backend APIs are working:
```bash
# Check API health
curl http://localhost:8080/backend/health

# Check API logs
docker-compose -f docker-compose-all-apps.yml logs backend
```

---

## Performance Tips

### For Faster Capture:

1. **Close unnecessary apps** on your computer (free up RAM)
2. **Use SSD** if possible (Docker performs better)
3. **Increase Docker resources:**
   - Docker Desktop → Settings → Resources
   - CPUs: 4-8 cores
   - Memory: 8-16 GB
4. **Run during low-usage times** (fewer background processes)

### Estimated Duration:

- **250 apps × 15 seconds = 3,750 seconds ≈ 62 minutes**
- **With concurrency=3: ~20-30 minutes**
- **With concurrency=5: ~15-20 minutes**

---

## After Capture

### Generate Gallery:

```bash
# Regenerate HTML gallery
npm run gallery

# Or manually
node scripts/generate-gallery.js
```

### View Gallery:

```
http://localhost:8080/catalogue/
```

Or open: `catalogue/index.html` in browser

---

## Next Steps

1. ✅ **Review failed containers** — Fix build/configuration issues
2. ✅ **Update README** — Document which containers are working
3. ✅ **Create showcase** — Use screenshots for portfolio
4. ✅ **Monitor health** — Set up container health checks

---

## Script Files

| File | Purpose |
|------|---------|
| `capture-docker-gateway.js` | Main Node.js script |
| `capture-docker-gateway.bat` | Windows wrapper |
| `docker-validation-success.log` | Successful captures |
| `docker-validation-failed.log` | Failed captures (debugging) |
| `backend-apis.log` | Backend APIs (no UI) |
| `catalogue/<app>/screenshot.png` | Individual screenshots |

---

**Last Updated:** March 11, 2026
**Status:** Ready for use
**Support:** support@techbridge.edu.gh
