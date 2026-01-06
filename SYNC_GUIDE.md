# Sync Guide: AUCDT ↔ Techbridge Repository Sync

This guide helps you sync changes between the `aucdt-utilities` and `techbridge-university-college` repositories.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Method 1: Bash Script (Recommended)](#method-1-bash-script-recommended)
- [Method 2: PowerShell Script](#method-2-powershell-script)
- [Method 3: Manual Sync](#method-3-manual-sync)
- [What Gets Synced](#what-gets-synced)
- [Troubleshooting](#troubleshooting)

---

## Overview

**Source Repository:** `aucdt-utilities`
**Target Repository:** `techbridge-university-college`

Both repositories share the same codebase but are customized for different institutions:
- **AUCDT:** African University College of Digital Technologies
- **Techbridge:** Techbridge University College

---

## Quick Start

### Prerequisites

1. ✅ Git installed on your system
2. ✅ Both repositories cloned locally
3. ✅ No uncommitted changes in target repository (or stashed)

### Choose Your Method

| Method | Tool | Best For |
|--------|------|----------|
| **Method 1** | Git Bash | Most reliable, detailed output |
| **Method 2** | PowerShell | Windows users who prefer PowerShell |
| **Method 3** | Manual | Full control, learning git |

---

## Method 1: Bash Script (Recommended)

### Step 1: Open Git Bash

Right-click in the `aucdt-utilities` folder → **Git Bash Here**

### Step 2: Make Script Executable

```bash
chmod +x sync-to-techbridge.sh
```

### Step 3: Run the Script

```bash
./sync-to-techbridge.sh
```

### Step 4: Follow Prompts

The script will:
1. ✅ Check both repositories exist
2. ✅ Add AUCDT as a remote in Techbridge repo
3. ✅ Fetch changes
4. ✅ Cherry-pick commits one by one
5. ✅ Ask if you want to update branding (AUCDT → Techbridge)
6. ✅ Show summary

### Example Output

```
============================================================================
Pre-flight Checks
============================================================================
✓ AUCDT repository found
✓ Techbridge repository found

============================================================================
Syncing Commits from AUCDT to Techbridge
============================================================================

ℹ Cherry-picking: 5b79df543b349ca2ae28a5cd9e80c117824bf57d
    Message: Add comprehensive CLAUDE.md for AI assistant guidance
✓ Successfully applied

...

============================================================================
Sync Summary
============================================================================

✓ Successfully synced: 5 commits

ℹ Current status of Techbridge repository:
dc34208 Add comprehensive final documentation - Phase 5 Complete
6cd8aed Add comprehensive README.md documentation
...
```

---

## Method 2: PowerShell Script

### Step 1: Open PowerShell

Right-click in the `aucdt-utilities` folder → **Open PowerShell Here**

### Step 2: Allow Script Execution (One-time)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 3: Run the Script

```powershell
.\sync-to-techbridge.ps1
```

### Step 4: Follow Prompts

Same workflow as Bash script, but with PowerShell syntax.

---

## Method 3: Manual Sync

If you prefer to sync manually or want to understand what the scripts do:

### Step 1: Navigate to Techbridge Repository

```bash
cd "C:/Users/DELL/OneDrive/Documents/Downloads/Development/github/aucdt-utilities/techbridge-university-college"
```

### Step 2: Add AUCDT as Remote (First Time Only)

```bash
git remote add aucdt "../"
```

Verify:
```bash
git remote -v
```

### Step 3: Fetch Changes from AUCDT

```bash
git fetch aucdt
```

### Step 4: Cherry-Pick Commits

Cherry-pick each commit individually (excluding merge commits):

```bash
# Phase 1: CLAUDE.md
git cherry-pick 5b79df543b349ca2ae28a5cd9e80c117824bf57d

# Phase 2: React app source
git cherry-pick 51348cb0f62f3a4de594315e8515c8d6870967c2

# Phase 3: Testing infrastructure
git cherry-pick 749156c35155dd81ba2ab5c952030d4072f8f785

# Phase 4: README.md
git cherry-pick 6cd8aed92fe207512fb7c6363b76e662bedadf37

# Phase 5: Final documentation
git cherry-pick dc34208dad9216ff90d07c8a001160a7adedb3d7
```

### Step 5: Update Branding (Optional)

Replace AUCDT references with Techbridge:

```bash
# In README.md
sed -i 's/African University College of Digital Technologies/Techbridge University College/g' README.md
sed -i 's/AUCDT/Techbridge/g' README.md

# In CLAUDE.md
sed -i 's/African University College of Digital Technologies/Techbridge University College/g' CLAUDE.md
sed -i 's/AUCDT/Techbridge/g' CLAUDE.md

# In src/App.tsx
sed -i 's/African University College of Digital Technologies/Techbridge University College/g' src/App.tsx

# In package.json
sed -i 's/aucdt-utilities/techbridge-university-college/g' package.json

# In docs/
sed -i 's/AUCDT/Techbridge/g' docs/README.md
sed -i 's/African University College of Digital Technologies/Techbridge University College/g' docs/SRS_ThesisAI_Frontend_Final.md

# Commit changes
git add .
git commit -m "Update branding from AUCDT to Techbridge University College"
```

### Step 6: Verify

```bash
git log --oneline -10
pnpm install
pnpm test
pnpm build
```

---

## What Gets Synced

### Commits Included

| Phase | Commit | Description |
|-------|--------|-------------|
| **1** | `5b79df5` | Add comprehensive CLAUDE.md for AI assistant guidance |
| **2** | `51348cb` | Add React application source files and fix build configuration |
| **3** | `749156c` | Add comprehensive testing infrastructure with 100% coverage |
| **4** | `6cd8aed` | Add comprehensive README.md documentation |
| **5** | `dc34208` | Add comprehensive final documentation - Phase 5 Complete |

### Files Added/Modified

- ✅ `CLAUDE.md` - AI assistant guide
- ✅ `README.md` - Complete project documentation
- ✅ `src/main.tsx` - Application entry point
- ✅ `src/App.tsx` - Main React component
- ✅ `src/index.css` - Tailwind imports
- ✅ `src/test/App.test.tsx` - App component tests
- ✅ `src/test/FeatureCard.test.tsx` - FeatureCard tests
- ✅ `src/test/setup.ts` - Test setup
- ✅ `vitest.config.ts` - Vitest configuration
- ✅ `.gitignore` - Updated ignore patterns
- ✅ `package.json` - Updated scripts and dependencies
- ✅ `pnpm-lock.yaml` - Updated lockfile
- ✅ `docs/README.md` - Documentation index
- ✅ `docs/SRS_ThesisAI_Frontend_Final.md` - IEEE SRS document
- ✅ `docs/svg/*.svg` - 5 technical diagrams
- ✅ `docs/presentation/*.svg` - 2 presentation diagrams

### Branding Changes (Optional)

When you enable branding updates, the script replaces:

| Original | Replacement |
|----------|-------------|
| African University College of Digital Technologies | Techbridge University College |
| AUCDT | Techbridge |
| aucdt-utilities | techbridge-university-college |

---

## Troubleshooting

### Issue: "Remote 'aucdt' already exists"

**Solution:** This is normal on subsequent runs. The script will use the existing remote.

---

### Issue: "Cherry-pick failed - possible conflicts"

**Cause:** The files being synced conflict with existing changes in Techbridge repo.

**Solution:**

1. **Option 1 - Resolve conflicts:**
   ```bash
   # Edit conflicting files manually
   git add .
   git cherry-pick --continue
   ```

2. **Option 2 - Skip this commit:**
   ```bash
   git cherry-pick --skip
   ```

3. **Option 3 - Abort and start over:**
   ```bash
   git cherry-pick --abort
   ```

---

### Issue: "You have uncommitted changes"

**Solution:** Commit or stash your changes first:

```bash
# Option 1: Commit
git add .
git commit -m "WIP: Save current work"

# Option 2: Stash
git stash save "Work in progress"
# (Later: git stash pop)
```

---

### Issue: Script won't run (Permission denied)

**Bash:**
```bash
chmod +x sync-to-techbridge.sh
./sync-to-techbridge.sh
```

**PowerShell:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\sync-to-techbridge.ps1
```

---

### Issue: "Repository not found at path"

**Solution:** Update the paths in the script:

**In Bash Script (`sync-to-techbridge.sh`):**
```bash
# Line 18-19
AUCDT_REPO="/c/Users/YOUR_PATH/aucdt-utilities"
TECHBRIDGE_REPO="/c/Users/YOUR_PATH/techbridge-university-college"
```

**In PowerShell Script (`sync-to-techbridge.ps1`):**
```powershell
# Line 11-12
$AUCDT_REPO = "C:\Users\YOUR_PATH\aucdt-utilities"
$TECHBRIDGE_REPO = "C:\Users\YOUR_PATH\techbridge-university-college"
```

---

### Issue: Branding not updated correctly

**Solution:** Run manual find-replace:

```bash
cd techbridge-university-college

# Find all instances (review first)
grep -r "AUCDT" .

# Replace in specific files
find . -name "*.md" -exec sed -i 's/AUCDT/Techbridge/g' {} +
find . -name "*.tsx" -exec sed -i 's/African University College of Digital Technologies/Techbridge University College/g' {} +
```

---

## Advanced Usage

### Sync Only Specific Commits

Edit the `COMMITS_TO_SYNC` array in the script to include only the commits you want:

```bash
# In sync-to-techbridge.sh (line 24-30)
COMMITS_TO_SYNC=(
    "6cd8aed92fe207512fb7c6363b76e662bedadf37"  # Only Phase 4: README
    "dc34208dad9216ff90d07c8a001160a7adedb3d7"  # Only Phase 5: Documentation
)
```

### Sync in Reverse (Techbridge → AUCDT)

To sync changes FROM Techbridge TO AUCDT:

1. Swap the repository paths in the script
2. OR manually:
   ```bash
   cd aucdt-utilities
   git remote add techbridge ../techbridge-university-college
   git fetch techbridge
   git cherry-pick <commit-hash>
   ```

### Create a Patch File

To create a patch file you can apply later:

```bash
cd aucdt-utilities
git format-patch -5 HEAD --stdout > recent-changes.patch

# Apply in techbridge repo:
cd ../techbridge-university-college
git am < ../aucdt-utilities/recent-changes.patch
```

---

## Best Practices

1. ✅ **Always test after syncing:**
   ```bash
   pnpm install
   pnpm test
   pnpm build
   ```

2. ✅ **Commit changes before syncing** to avoid conflicts

3. ✅ **Review changes before pushing:**
   ```bash
   git log --oneline -10
   git diff HEAD~5
   ```

4. ✅ **Keep both repositories in sync regularly** to minimize conflicts

5. ✅ **Document any custom changes** specific to each institution

---

## Need Help?

- **Git documentation:** https://git-scm.com/doc
- **Cherry-pick guide:** https://git-scm.com/docs/git-cherry-pick
- **Resolve conflicts:** https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging

---

**Last Updated:** January 6, 2026
**Script Version:** 1.0
