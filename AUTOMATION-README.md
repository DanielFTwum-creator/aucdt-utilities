# TUC Development Automation Scripts

**Created:** March 10, 2026
**Department:** ICT
**Purpose:** Automate Dockerfile generation and screenshot capture for all apps

---

## 📦 Available Scripts

### 1. `generate-missing-dockerfiles.sh`
**Purpose:** Automatically create Dockerfiles for any app that doesn't have one

**What it does:**
- Scans all project directories
- Identifies apps with `package.json` but no `Dockerfile`
- Generates appropriate Dockerfile based on app type:
  - Vite/React apps → Multi-stage Dockerfile (node:20-alpine → nginx:alpine)
  - Express/Node.js backends → Node.js Dockerfile
- Creates generation log for review

**Usage:**
```bash
cd /c/Development/aucdt-utilities
./generate-missing-dockerfiles.sh
```

**Output:**
- Dockerfiles created in each app directory
- Log file: `dockerfile-generation.log`
- Summary statistics

**Example Output:**
```
========================================
TUC - Dockerfile Generation Script
========================================

Scanning for apps without Dockerfiles...

✓ Generated: academic-integrity-detector/Dockerfile
✓ Generated: ai-exam-generator/Dockerfile
⊘ Skipped (Dockerfile exists): analytics-refactor/
...

========================================
Dockerfile Generation Complete
========================================

Summary:
  Total apps scanned:    100
  Dockerfiles generated: 77
  Skipped:               23
  Errors:                0
```

---

### 2. `capture-app-screenshots.js`
**Purpose:** Automatically capture screenshots of all app pages

**What it does:**
- Finds all projects with `package.json`
- Attempts multiple methods to capture screenshots:
  1. **File-based:** Opens `index.html` directly (fastest)
  2. **Dev server:** Captures from `http://localhost:5173` if running
  3. **Docker gateway:** Captures from `http://localhost:8080/[app-name]`
- Generates HTML gallery of all screenshots
- Processes multiple apps in parallel (3 concurrent by default)

**Prerequisites:**
```bash
# Install playwright if not already installed
cd /c/Development/aucdt-utilities
npm install playwright
```

**Usage:**
```bash
cd /c/Development/aucdt-utilities
node capture-app-screenshots.js
```

**Configuration:**
Edit the `CONFIG` object in the script to customize:
- `basePort`: Default dev server port (5173)
- `timeout`: Max wait time per screenshot (30s)
- `screenshotDir`: Output directory ('catalogue')
- `viewportWidth/Height`: Screenshot dimensions (1920x1080)
- `concurrency`: Parallel captures (3)

**Output:**
- Screenshots: `catalogue/[app-name]/screenshot.png`
- Gallery: `catalogue/index.html`
- Failure log: `screenshot-failures.log`

**Example Output:**
```
========================================
TUC - Screenshot Capture Script
========================================

Found 100 projects

Launching browser...
Browser launched successfully

[1] Processing: academic-integrity-detector...
  → Attempting file-based capture...
  ✓ Success (file): catalogue/academic-integrity-detector/screenshot.png

[2] Processing: ai-exam-generator...
  → Attempting file-based capture...
  ⊘ File-based failed: No index.html found
  → Checking Docker gateway...
  ✓ Success (Docker): catalogue/ai-exam-generator/screenshot.png

...

========================================
Screenshot Capture Complete
========================================

Total projects:     100
Successful:         85
Failed:             15
Duration:           45.2s

Gallery: catalogue/index.html
```

---

## 🚀 Quick Start Guide

### Step 1: Generate Missing Dockerfiles

```bash
cd /c/Development/aucdt-utilities

# Make script executable (if needed)
chmod +x generate-missing-dockerfiles.sh

# Run the script
./generate-missing-dockerfiles.sh

# Review the log
cat dockerfile-generation.log
```

### Step 2: Verify Dockerfiles

```bash
# Count total Dockerfiles
find . -maxdepth 2 -name "Dockerfile" | wc -l

# List apps that still don't have Dockerfiles
for dir in */; do
  if [ -f "${dir}package.json" ] && [ ! -f "${dir}Dockerfile" ]; then
    echo "$dir"
  fi
done
```

### Step 3: Update docker-compose-all-apps.yml

```bash
# Use the existing script to regenerate docker-compose
bash generate-docker-compose.sh

# Or manually add new services following the existing pattern
```

### Step 4: Capture Screenshots

**Option A: From Files (No servers needed)**
```bash
# This is the fastest method - just captures index.html files
node capture-app-screenshots.js
```

**Option B: From Running Docker Services**
```bash
# Start all services first
docker-compose -f docker-compose-all-apps.yml up -d

# Wait for services to be ready (2-3 minutes)
sleep 180

# Capture screenshots
node capture-app-screenshots.js

# Screenshots will be from http://localhost:8080/[app-name]
```

**Option C: From Dev Servers**
```bash
# Start individual dev server
cd academic-integrity-detector
pnpm install
pnpm run dev &

# In another terminal, capture screenshot
cd ..
node capture-app-screenshots.js
```

### Step 5: View Gallery

```bash
# Open the generated gallery in browser
start catalogue/index.html  # Windows
# or
open catalogue/index.html   # Mac
# or
xdg-open catalogue/index.html  # Linux
```

---

## 📊 Expected Results

### Dockerfile Generation
- **Before:** 73 Dockerfiles
- **After:** ~250+ Dockerfiles (one per app)
- **Coverage:** 100% of React/Vite apps
- **Time:** ~2-5 minutes

### Screenshot Capture
- **Total Apps:** 322 projects
- **Expected Screenshots:** 250-300 (some apps may not have UI)
- **Output Size:** ~50-100 MB (depends on app complexity)
- **Time:** 10-15 minutes (file-based), 20-30 minutes (Docker-based)

---

## 🐛 Troubleshooting

### Dockerfile Generation Issues

**Problem:** Script says "Unknown type (skipping)"
```bash
# Check the app's package.json
cat [app-name]/package.json | grep -E '"react"|"vite"|"express"'

# Manually create Dockerfile if needed
cp Dockerfile.vite [app-name]/Dockerfile
```

**Problem:** Permission denied
```bash
# Run with proper permissions
chmod +x generate-missing-dockerfiles.sh
bash generate-missing-dockerfiles.sh
```

### Screenshot Capture Issues

**Problem:** "No index.html found"
```bash
# Check if app has been built
cd [app-name]
pnpm run build

# Or check for index.html locations
find . -name "index.html"
```

**Problem:** "Failed to launch browser"
```bash
# Install playwright dependencies (Linux)
sudo apt-get install -y \
  libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 \
  libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 \
  libpangocairo-1.0-0 libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0

# Windows: Reinstall playwright
npm uninstall playwright
npm install playwright
```

**Problem:** Screenshots are blank/white
```bash
# Increase wait time in the script
# Edit capture-app-screenshots.js:
# Change: await page.waitForTimeout(2000);
# To:     await page.waitForTimeout(5000);
```

**Problem:** Too slow
```bash
# Increase concurrency
# Edit CONFIG in capture-app-screenshots.js:
# concurrency: 5  // Instead of 3
```

---

## 🔄 Integration with Existing Workflows

### After Running Scripts

1. **Commit Generated Dockerfiles**
```bash
cd /c/Development/aucdt-utilities
git status
git add */Dockerfile
git commit -m "feat: add Dockerfiles for all apps"
```

2. **Update docker-compose-all-apps.yml**
```bash
bash generate-docker-compose.sh
git add docker-compose-all-apps.yml
git commit -m "chore: update docker-compose with new services"
```

3. **Commit Screenshots**
```bash
git add catalogue/
git commit -m "docs: add app screenshots to catalogue"
```

### Scheduled Automation

**Weekly Screenshot Updates:**
```bash
# Add to crontab or Task Scheduler
# Every Sunday at 2 AM:
0 2 * * 0 cd /c/Development/aucdt-utilities && node capture-app-screenshots.js
```

**Monthly Dockerfile Check:**
```bash
# First day of month:
0 3 1 * * cd /c/Development/aucdt-utilities && ./generate-missing-dockerfiles.sh
```

---

## 📝 Manual Overrides

### Custom Dockerfile Templates

If an app needs a custom Dockerfile:

```bash
# 1. Let the script generate the default
./generate-missing-dockerfiles.sh

# 2. Edit the generated Dockerfile
nano [app-name]/Dockerfile

# 3. Add comment at top to prevent regeneration
# Custom Dockerfile - DO NOT REGENERATE
```

### Custom Screenshot Settings

For specific apps that need special handling:

```javascript
// Edit capture-app-screenshots.js
// Add to CONFIG object:
specialApps: {
  'app-name': {
    waitTime: 10000,  // Wait 10s instead of 2s
    fullPage: false,  // Don't capture full page
  }
}
```

---

## 🎯 Best Practices

1. **Run Dockerfile generation before Docker builds**
   - Always generate Dockerfiles before updating docker-compose
   - Review generated Dockerfiles for any special requirements

2. **Capture screenshots from built apps when possible**
   - Built apps load faster and are more stable
   - Run `pnpm run build` in apps before screenshot capture

3. **Use Docker gateway for consistent screenshots**
   - All apps accessible at `http://localhost:8080/[app-name]`
   - Consistent styling and routing

4. **Review failure logs**
   - Check `dockerfile-generation.log` for skipped apps
   - Check `screenshot-failures.log` for capture issues

5. **Keep gallery updated**
   - Run screenshot capture after significant UI changes
   - Update gallery for presentations and documentation

---

## 📞 Support

**Issues or Questions:**
- IT Help Desk: support@techbridge.edu.gh
- ICT Department: ext. 2100

**Common Issues:**
- Script permissions → Run with `bash` or `chmod +x`
- Missing dependencies → `npm install playwright`
- Docker not running → Start Docker Desktop first

---

## 🔗 Related Documentation

- [CLAUDE.md](./CLAUDE.md) - Claude Code guidance
- [SHARED-STANDARDS.md](./SHARED-STANDARDS.md) - Tech standards
- [CAMPUS_DEPLOYMENT_GUIDE.md](/c/Development/CAMPUS_DEPLOYMENT_GUIDE.md) - Campus-wide deployment
- [START_HERE.md](./START_HERE.md) - Quick start guide

---

**Last Updated:** March 10, 2026
**Version:** 1.0
**Status:** Production Ready
