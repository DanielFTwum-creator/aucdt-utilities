# Capacitor Batch Runner Guide

**Quick command-line wrappers for running batch Capacitor setup**

---

## Overview

Two simple runner scripts make batch setup even easier:
- **run-capacitor-batch.bat** — Windows Batch wrapper
- **run-capacitor-batch.sh** — Bash wrapper (macOS/Linux)

These are thin wrappers around `capacitor-setup-batch.ps1` that handle:
- File validation
- PowerShell execution
- Logging
- Error handling
- Colorized output

---

## Windows: run-capacitor-batch.bat

### Quick Start

```batch
run-capacitor-batch.bat capacitor-projects-example.csv
```

### Full Usage

```batch
run-capacitor-batch.bat PROJECT-FILE [OPTIONS]
```

### Parameters

| Parameter | Description |
|-----------|-------------|
| `PROJECT-FILE` | CSV or JSON file with project list |
| `--skip-build` | Skip web bundle builds (10x faster) |
| `--skip-commit` | Don't commit changes to git |
| `--continue-error` | Continue if one project fails |

### Examples

```batch
# Basic setup from CSV
run-capacitor-batch.bat capacitor-projects-example.csv

# Setup without building (just Capacitor install + sync)
run-capacitor-batch.bat projects.csv --skip-build

# Setup from JSON
run-capacitor-batch.bat projects.json

# Setup with multiple options
run-capacitor-batch.bat projects.csv --skip-build --skip-commit

# Continue even if some projects fail
run-capacitor-batch.bat projects.csv --continue-error

# Show help
run-capacitor-batch.bat
```

### What It Does

1. ✅ Validates project file exists
2. ✅ Validates PowerShell script exists
3. ✅ Runs capacitor-setup-batch.ps1 with your parameters
4. ✅ Logs output to `batch-setup.log`
5. ✅ Shows colorized progress
6. ✅ Reports success or failure

### Output

```
╔════════════════════════════════════════════════════════════════╗
║         Capacitor Batch Setup - Starting                      ║
╚════════════════════════════════════════════════════════════════╝

Projects file: capacitor-projects-example.csv
Setup script:  C:\...\capacitor-setup-batch.ps1
Log file:      C:\...\batch-setup.log
Timestamp:     ...

Running: powershell ...

[PowerShell output shows here with colorized progress]

╔════════════════════════════════════════════════════════════════╗
║              ✅ Batch Setup Complete                          ║
╚════════════════════════════════════════════════════════════════╝

Log saved to: C:\...\batch-setup.log
```

### Log File

All output is logged to `batch-setup.log` in the same directory:

```bash
tail -f batch-setup.log  # Watch progress
cat batch-setup.log      # View completed log
```

---

## macOS/Linux: run-capacitor-batch.sh

### Quick Start

```bash
./run-capacitor-batch.sh capacitor-projects-example.csv
```

### Full Usage

```bash
./run-capacitor-batch.sh PROJECT-FILE [OPTIONS]
```

### Parameters

Same as Windows version (see above)

### Examples

```bash
# Basic setup from CSV
./run-capacitor-batch.sh capacitor-projects-example.csv

# Setup without building (10x faster)
./run-capacitor-batch.sh projects.csv --skip-build

# Setup from JSON
./run-capacitor-batch.sh projects.json

# Setup with multiple options
./run-capacitor-batch.sh projects.csv --skip-build --skip-commit

# Continue even if some projects fail
./run-capacitor-batch.sh projects.csv --continue-error

# Show help
./run-capacitor-batch.sh
```

### Setup (first time only)

Make the script executable:
```bash
chmod +x run-capacitor-batch.sh
```

Install PowerShell if not already present (macOS):
```bash
brew install powershell
```

### What It Does

1. ✅ Validates project file exists
2. ✅ Validates PowerShell script exists
3. ✅ Validates PowerShell 7+ is installed
4. ✅ Runs capacitor-setup-batch.ps1 with your parameters
5. ✅ Logs output to `batch-setup.log`
6. ✅ Shows colorized progress
7. ✅ Reports success or failure

### Output

Same as Windows version (see above)

---

## Typical Workflow

### Step 1: Create Project List

Copy and edit the example CSV:

```bash
# Windows
copy capacitor-projects-example.csv my-projects.csv

# macOS/Linux
cp capacitor-projects-example.csv my-projects.csv
```

Edit `my-projects.csv`:
```csv
ProjectPath,AppName,AppId,Version
./project1,App1,com.techbridge.app1,1.0.0
./project2,App2,com.techbridge.app2,1.0.0
./project3,App3,com.techbridge.app3,1.0.0
```

### Step 2: Run Batch Setup

```bash
# Windows
run-capacitor-batch.bat my-projects.csv

# macOS/Linux
./run-capacitor-batch.sh my-projects.csv
```

### Step 3: Monitor Progress

In another terminal, watch the log file:

```bash
# Windows PowerShell
Get-Content batch-setup.log -Wait

# macOS/Linux
tail -f batch-setup.log
```

### Step 4: Verify Results

When complete, check the summary at end of log:
```
╔════════════════════════════════════════════════════════════════╗
║                   Batch Setup Complete                        ║
╚════════════════════════════════════════════════════════════════╝

Total:    10
Success:  10
Failed:   0

✅ All projects setup successfully!
```

---

## Advanced: Dry Run (No Build/Commit)

Test without building or committing:

```bash
# Windows
run-capacitor-batch.bat projects.csv --skip-build --skip-commit

# macOS/Linux
./run-capacitor-batch.sh projects.csv --skip-build --skip-commit
```

This is **10x faster** because it only:
- Installs Capacitor
- Creates native projects
- Updates package.json
- Syncs platforms

Useful for testing before running full builds.

---

## Error Handling

### Default Behavior (Stop on Error)

If one project fails, the batch stops:
```
[Project 1] ✅ Success
[Project 2] ❌ Failed: npm install error
[Stopping batch setup]
```

### Continue on Error

Use `--continue-error` to keep going:
```bash
# Windows
run-capacitor-batch.bat projects.csv --continue-error

# macOS/Linux
./run-capacitor-batch.sh projects.csv --continue-error
```

Output:
```
[Project 1] ✅ Success
[Project 2] ❌ Failed: npm install error
[Project 3] ✅ Success
[Project 4] ❌ Failed: git error
[Continuing batch setup...]

Total:    4
Success:  2
Failed:   2
```

---

## Time Estimates

| Task | Time |
|------|------|
| Setup only (--skip-build) | 30-60 sec per project |
| Full setup (with build) | 3-5 min per project |

Examples:
- 10 projects with builds: 30-50 minutes
- 10 projects without builds: 5-10 minutes
- 50 projects with builds: 2.5-4 hours
- 50 projects without builds: 25-50 minutes

**Recommendation:** For large batches (50+), use `--skip-build` first, then build individually later.

---

## Logging

All output is saved to `batch-setup.log`:

### View Log in Real Time

```bash
# Windows PowerShell
Get-Content batch-setup.log -Wait

# macOS/Linux
tail -f batch-setup.log
```

### View Completed Log

```bash
# Windows
type batch-setup.log
more batch-setup.log  # Page through

# macOS/Linux
cat batch-setup.log
less batch-setup.log  # Page through
```

### Extract Failure Summary

```bash
# macOS/Linux - show only failed projects
grep "❌ Failed" batch-setup.log

# Windows PowerShell
Select-String "❌ Failed" batch-setup.log
```

---

## Troubleshooting

### "Script not found" (Windows)

Ensure you're running from the correct directory:
```batch
# Right directory
cd C:\Development\github\aucdt-utilities
run-capacitor-batch.bat projects.csv

# Or use full path
C:\Development\github\aucdt-utilities\run-capacitor-batch.bat projects.csv
```

### "PowerShell not found" (macOS/Linux)

Install PowerShell:
```bash
brew install powershell
pwsh --version  # Verify
```

### CSV file issues

Ensure CSV has header row:
```csv
ProjectPath,AppName,AppId,Version
./project1,App1,com.techbridge.app1,1.0.0
```

No extra spaces, quotes, or commas in values.

### Build failures during batch

Run failed projects individually:
```bash
# Windows
.\capacitor-setup.ps1 -ProjectPath ".\project1" -AppName "App1" -AppId "com.techbridge.app1"

# macOS/Linux
./capacitor-setup.sh --project-path ./project1 --app-name "App1" --app-id "com.techbridge.app1"
```

---

## Tips & Tricks

### Run Overnight

For large batches (100+ projects), schedule to run overnight:

```bash
# Windows Task Scheduler (GUI or command)
# macOS cron or launchd
# Linux cron

# Example: Run at 10 PM
crontab -e
0 22 * * * cd /path/to/aucdt-utilities && ./run-capacitor-batch.sh projects.csv
```

### Split Large Batches

Instead of 281 projects at once, split into smaller groups:

```bash
# Group 1: First 50 projects
run-capacitor-batch.bat group1.csv

# Wait for completion, then group 2
run-capacitor-batch.bat group2.csv

# etc.
```

### Skip Builds for Speed

For testing Capacitor setup only (10x faster):
```bash
run-capacitor-batch.bat projects.csv --skip-build
```

Then build individually later:
```bash
cd project1 && pnpm build:ios && cd ..
cd project2 && pnpm build:android && cd ..
```

### Monitor Multiple Batches

Run multiple batches in parallel on different machines:
- Machine 1: First 100 projects
- Machine 2: Second 100 projects
- Machine 3: Remaining projects

Or in separate terminals:
```bash
# Terminal 1
./run-capacitor-batch.sh group1.csv

# Terminal 2 (in another window)
./run-capacitor-batch.sh group2.csv
```

---

## Summary

| Feature | Windows | macOS/Linux |
|---------|---------|-------------|
| Quick start | `run-capacitor-batch.bat` | `./run-capacitor-batch.sh` |
| Dry run | `--skip-build --skip-commit` | Same |
| Continue on error | `--continue-error` | Same |
| Logging | `batch-setup.log` | Same |
| Setup time per project | 3-5 min | 3-5 min |
| Skip-build time | 30-60 sec | 30-60 sec |

---

**Last Updated:** 10 May 2026  
**Status:** Production Ready  
**Time to Setup All 281 Projects:** 12-20 hours (or 2-4 hours with --skip-build)
