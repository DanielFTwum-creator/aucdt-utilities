# Run Batch Setup — Master Execution Guide

**Step-by-step instructions to deploy Capacitor across 281 TUC React projects**

---

## ⚡ TL;DR (30 seconds)

```bash
# Windows
run-capacitor-batch.bat capacitor-projects-example.csv

# macOS/Linux
./run-capacitor-batch.sh capacitor-projects-example.csv

# Done! Wait 30-50 minutes for 10 projects
```

---

## 📋 Full Workflow (5 minutes)

### Step 1: Prepare Your Project List

Choose one:

**Option A: Use example list (8 TUC projects)**
```bash
# Windows
run-capacitor-batch.bat capacitor-projects-example.csv

# macOS/Linux
./run-capacitor-batch.sh capacitor-projects-example.csv
```

**Option B: Create custom list**

Copy the example:
```bash
# Windows
copy capacitor-projects-example.csv my-projects.csv

# macOS/Linux
cp capacitor-projects-example.csv my-projects.csv
```

Edit `my-projects.csv` in your editor:
```csv
ProjectPath,AppName,AppId,Version
./project1,App 1,com.techbridge.app1,1.0.0
./project2,App 2,com.techbridge.app2,1.0.0
./project3,App 3,com.techbridge.app3,1.0.0
```

Save and run:
```bash
# Windows
run-capacitor-batch.bat my-projects.csv

# macOS/Linux
./run-capacitor-batch.sh my-projects.csv
```

**Option C: Use JSON format**

Edit `capacitor-projects-example.json`:
```json
[
  {
    "projectPath": "./project1",
    "appName": "App 1",
    "appId": "com.techbridge.app1",
    "version": "1.0.0"
  },
  {
    "projectPath": "./project2",
    "appName": "App 2",
    "appId": "com.techbridge.app2",
    "version": "1.0.0"
  }
]
```

Run:
```bash
# Windows
run-capacitor-batch.bat capacitor-projects-example.json

# macOS/Linux
./run-capacitor-batch.sh capacitor-projects-example.json
```

### Step 2: Run the Batch Setup

```bash
# Windows (from Command Prompt or PowerShell)
cd C:\Development\github\aucdt-utilities
run-capacitor-batch.bat capacitor-projects-example.csv

# macOS/Linux (from Terminal)
cd /path/to/aucdt-utilities
chmod +x run-capacitor-batch.sh  # First time only
./run-capacitor-batch.sh capacitor-projects-example.csv
```

### Step 3: Monitor Progress

In another terminal/window:

```bash
# Windows PowerShell
Get-Content batch-setup.log -Wait

# macOS/Linux
tail -f batch-setup.log
```

### Step 4: Wait for Completion

Progress looks like:
```
[1/8] App 1
  ✓ Validated
  ✓ Installed Capacitor
  ✓ Created iOS project
  ✓ Created Android project
  ✓ Built web bundle
  ✓ Synced platforms
  ✓ Committed to git

[2/8] App 2
  ... (repeats for each project)

╔════════════════════════════════════════════════════════════════╗
║              ✅ Batch Setup Complete                          ║
╚════════════════════════════════════════════════════════════════╝

Total:    8
Success:  8
Failed:   0
```

---

## 🚀 Common Scenarios

### Scenario 1: Quick Test (No Building)

Test Capacitor setup without building (10x faster):

```bash
# Windows
run-capacitor-batch.bat projects.csv --skip-build

# macOS/Linux
./run-capacitor-batch.sh projects.csv --skip-build
```

**Time:** 30-60 seconds per project  
**Use case:** Just verify Capacitor installs and projects create correctly

### Scenario 2: Test Without Git Commits

Dry run (no building, no commits):

```bash
# Windows
run-capacitor-batch.bat projects.csv --skip-build --skip-commit

# macOS/Linux
./run-capacitor-batch.sh projects.csv --skip-build --skip-commit
```

**Time:** Same as Scenario 1  
**Use case:** Test setup before committing to git

### Scenario 3: Full Setup (Recommended)

Complete setup with building and commits:

```bash
# Windows
run-capacitor-batch.bat projects.csv

# macOS/Linux
./run-capacitor-batch.sh projects.csv
```

**Time:** 3-5 minutes per project  
**Use case:** Complete deployment ready for app stores

### Scenario 4: Continue on Error

If one project fails, keep going:

```bash
# Windows
run-capacitor-batch.bat projects.csv --continue-error

# macOS/Linux
./run-capacitor-batch.sh projects.csv --continue-error
```

**Time:** Same as full setup  
**Use case:** Handle projects with missing dependencies

### Scenario 5: Large Batch Overnight

Setup 50+ projects while you sleep:

```bash
# Prepare large list
vi projects-large.csv  # Edit with 50+ projects

# Start batch before leaving
# Windows
run-capacitor-batch.bat projects-large.csv

# macOS/Linux
./run-capacitor-batch.sh projects-large.csv
```

**Time:** 2.5-4 hours for 50 projects  
**Result:** Check `batch-setup.log` in morning  
**Success rate:** Usually 95%+ (fix failures individually)

---

## 📊 Time Breakdown

| Scenario | Projects | Full Setup | Skip-Build |
|----------|----------|-----------|-----------|
| Quick test | 1 | 3-5 min | 30-60 sec |
| Small batch | 5 | 15-25 min | 2-5 min |
| Medium batch | 10 | 30-50 min | 5-10 min |
| Large batch | 50 | 2.5-4 hours | 25-50 min |
| All projects | 281 | 12-20 hours | 2-4 hours |

---

## ✅ Pre-Execution Checklist

Before running batch setup:

- [ ] You're in the correct directory (`aucdt-utilities/`)
- [ ] Project file exists and is valid (CSV or JSON)
- [ ] Projects in list actually exist (run validation)
- [ ] Project paths are relative (e.g., `./project-name`)
- [ ] App IDs follow pattern (e.g., `com.techbridge.projectname`)
- [ ] Git is configured (`git config --global user.name "Your Name"`)
- [ ] You have free disk space (1-2 GB per 10 projects)
- [ ] Internet connection is stable (for npm installs)

### Validate Projects Before Running

```bash
# Windows PowerShell
foreach ($line in Get-Content projects.csv -Skip 1) {
    $path = $line.Split(',')[0]
    if (-not (Test-Path $path)) {
        Write-Host "❌ Missing: $path"
    } else {
        Write-Host "✓ Found: $path"
    }
}

# macOS/Linux
tail -n +2 projects.csv | while IFS=, read path appname appid version; do
    if [ ! -d "$path" ]; then
        echo "❌ Missing: $path"
    else
        echo "✓ Found: $path"
    fi
done
```

---

## 🔍 Monitoring & Troubleshooting

### Watch Progress in Real Time

```bash
# Windows PowerShell
Get-Content batch-setup.log -Tail 20 -Wait

# macOS/Linux
tail -f batch-setup.log
```

### Check Failed Projects

```bash
# Windows PowerShell
Select-String "❌ Failed" batch-setup.log

# macOS/Linux
grep "❌ Failed" batch-setup.log
```

### Resume Failed Projects

If batch stops at project 5 of 10:

1. Fix the issue manually:
   ```bash
   cd project5
   npm install  # Fix whatever failed
   cd ..
   ```

2. Remove failed projects from CSV

3. Run again:
   ```bash
   run-capacitor-batch.bat remaining-projects.csv --continue-error
   ```

---

## 📝 Results & Verification

After batch completes:

### Check Log Summary

End of `batch-setup.log` shows:
```
╔════════════════════════════════════════════════════════════════╗
║                   Batch Setup Complete                        ║
╚════════════════════════════════════════════════════════════════╝

Total:    8
Success:  7
Failed:   1

Results (summary):
Project 1    ✅ Success
Project 2    ✅ Success
Project 3    ❌ Failed: npm install timeout
Project 4    ✅ Success
...
```

### Verify Each Project

```bash
# Check capacitor.config.ts was created
cd project1
ls capacitor.config.ts  # Should exist

# Check platforms exist
ls ios/                 # Should have App/ directory
ls android/             # Should have app/ directory

# Check build scripts in package.json
grep "build:ios" package.json  # Should find it
grep "build:android" package.json  # Should find it

cd ..
```

### Count Successes

```bash
# Windows PowerShell
(Select-String "✅ Success" batch-setup.log).Count

# macOS/Linux
grep "✅ Success" batch-setup.log | wc -l
```

---

## 🎯 Next Steps After Batch Setup

### 1. Copy Documentation (If Not Already Done)

For each project that succeeded:

```bash
# Copy from luxthumb-agent template
cp luxthumb-agent/docs/APP_STORE_GUIDE.md project1/docs/
cp luxthumb-agent/docs/MOBILE_BUILD_GUIDE.md project1/docs/
cp luxthumb-agent/docs/APP_ICONS_GUIDE.md project1/docs/
cp luxthumb-agent/public/privacy.html project1/public/
```

Or script it:
```bash
# Windows PowerShell
Get-ChildItem -Directory | ForEach-Object {
    Copy-Item "luxthumb-agent/docs/*" "$_/docs/" -Force
    Copy-Item "luxthumb-agent/public/privacy.html" "$_/public/" -Force
}

# macOS/Linux
for dir in */; do
    [ -d "$dir/docs" ] && cp luxthumb-agent/docs/* "$dir/docs/"
    [ -d "$dir/public" ] && cp luxthumb-agent/public/privacy.html "$dir/public/"
done
```

### 2. Create App Icons

For each project, create 1024×1024 PNG icon:
```bash
# Windows/macOS/Linux
# Use Figma or https://appicon.resizer.tools/
# Place in: project/icon-1024.png
```

### 3. Build for Submission

After verifying all projects:

```bash
# Build individually or in parallel
cd project1 && pnpm build:ios && cd ..
cd project1 && pnpm build:android && cd ..
# ... repeat for all projects
```

Or create parallel build script:
```bash
# macOS/Linux
for dir in */; do
    (cd "$dir" && pnpm build:android) &
done
wait
```

### 4. Submit to App Stores

Follow APP_STORE_GUIDE.md for each project:
- Create App Store Connect entry
- Create Google Play entry
- Upload icons, screenshots, descriptions
- Submit for review

---

## 🐛 Common Issues & Fixes

### Issue: "tee command not found" (Windows)

If `tee` is not available, use PowerShell pipeline instead:
```bash
# Instead of: run-capacitor-batch.bat projects.csv | tee log.txt
# Use this in PowerShell:
.\capacitor-setup-batch.ps1 -ProjectsFile "projects.csv" | Out-File batch-setup.log -Append
```

### Issue: Projects fail with "npm ERR"

Some projects may have incompatible dependencies:
1. Check `package.json` for conflicts
2. Run individually to debug:
   ```bash
   cd failing-project
   npm install  # See actual error
   ```
3. Fix and retry batch

### Issue: Disk full during build

If running out of disk space:
1. Use `--skip-build` flag (saves 80% of space)
2. Build projects individually later
3. Or run on machine with more disk space

### Issue: Git auth fails

Ensure git is configured:
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git config --list  # Verify
```

---

## 📊 Dashboard: Track Progress

Create a simple tracker in Excel/Sheets:

| Project | Status | Started | Completed | Notes |
|---------|--------|---------|-----------|-------|
| Project 1 | ✅ Done | 10:00 | 10:05 | 5 min |
| Project 2 | ⏳ Running | 10:05 | — | — |
| Project 3 | ⏱️ Pending | — | — | — |

Or use the log:
```bash
# Count progress
grep "✅ Success" batch-setup.log | wc -l  # How many done
grep "❌ Failed" batch-setup.log | wc -l   # How many failed
grep "⏳" batch-setup.log | wc -l          # How many running
```

---

## 🎉 Success Criteria

Batch setup is **COMPLETE** when:

✅ All projects have:
- [ ] capacitor.config.ts created
- [ ] ios/ directory with Xcode project
- [ ] android/ directory with Android project
- [ ] Updated package.json with build scripts
- [ ] Committed to git
- [ ] No build errors

✅ Log file shows:
- [ ] `Total: X` matches your project count
- [ ] `Success: X` close to or equal to total
- [ ] `Failed: 0` or low count (acceptable: <5%)

✅ Ready for next steps:
- [ ] Copy documentation to each project
- [ ] Create app icons
- [ ] Build for submission
- [ ] Submit to app stores

---

## 📞 Support

### Quick Help

```bash
# Windows
run-capacitor-batch.bat              # Shows help

# macOS/Linux
./run-capacitor-batch.sh             # Shows help
```

### Full Documentation

- `BATCH_RUNNER_GUIDE.md` — Batch runner details
- `CAPACITOR_SCRIPTS.md` — Setup script details
- `SCRIPTS_README.md` — Master overview
- `CAPACITOR_QUICK_REFERENCE.md` — One-liners

### Check Status Anytime

```bash
# View log in real time
# Windows: Get-Content batch-setup.log -Wait
# macOS/Linux: tail -f batch-setup.log

# Check successes
# Windows: Select-String "✅" batch-setup.log | Measure-Object
# macOS/Linux: grep "✅" batch-setup.log | wc -l

# Check failures
# Windows: Select-String "❌" batch-setup.log
# macOS/Linux: grep "❌" batch-setup.log
```

---

## 🏁 Summary

**Quick Command:**
```bash
run-capacitor-batch.bat capacitor-projects-example.csv
./run-capacitor-batch.sh capacitor-projects-example.csv
```

**Time:** 3-5 minutes per project (or 30-60 seconds with --skip-build)

**Result:** All 281 TUC React projects iOS/Android ready

**Next:** Submit to app stores using APP_STORE_GUIDE.md

---

**Last Updated:** 10 May 2026  
**Status:** Production Ready  
**Estimated Total Time:** 12-20 hours for all 281 projects (run overnight)
