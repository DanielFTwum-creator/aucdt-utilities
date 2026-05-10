# Capacitor Deployment Scripts — Complete Toolkit

**Reusable scripts to enable iOS and Android app store deployment across 281 TUC React web projects**

---

## 📦 What You Get

### Three Automated Setup Scripts
1. **capacitor-setup.ps1** — Single project (PowerShell, all platforms)
2. **capacitor-setup.sh** — Single project (Bash, macOS/Linux)
3. **capacitor-setup-batch.ps1** — Multiple projects (PowerShell, all platforms)

### Example Configuration Files
- **capacitor-projects-example.csv** — 8 TUC projects in CSV format
- **capacitor-projects-example.json** — 8 TUC projects in JSON format

### Documentation
- **CAPACITOR_SCRIPTS.md** — Complete usage guide (800+ lines)
- **CAPACITOR_QUICK_REFERENCE.md** — Bookmark this for fast lookups
- **SCRIPTS_README.md** — This file

---

## 🚀 Getting Started

### 1. Single Project (Fastest Way)
```powershell
# From project root or specify path
.\capacitor-setup.ps1 -AppName "MyApp" -AppId "com.techbridge.myapp"
```

**What happens:**
- Installs Capacitor 8.3.3
- Creates iOS + Android projects
- Adds build scripts to package.json
- Commits changes to git
- **Time:** 3-5 minutes

### 2. Multiple Projects (Batch)
```powershell
# Setup 8 TUC projects at once
.\capacitor-setup-batch.ps1 -ProjectsFile "capacitor-projects-example.csv"
```

**What happens:**
- Runs single-project setup for each project
- Logs progress and results
- Can continue on error or stop at first failure
- **Time:** 30-50 minutes for 10 projects

### 3. Custom Projects (DIY Batch)
```powershell
# 1. Create your own CSV or JSON
# 2. Edit capacitor-projects-example.csv as template
# 3. Run batch setup
.\capacitor-setup-batch.ps1 -ProjectsFile "my-projects.csv"
```

---

## 📚 Documentation

### For Quick Lookups
**→ CAPACITOR_QUICK_REFERENCE.md**
- One-liner commands
- Common scenarios
- Time estimates
- Quick troubleshooting

### For Complete Details
**→ CAPACITOR_SCRIPTS.md**
- Detailed parameter documentation
- Full usage examples
- CSV/JSON format specifications
- Pre/post-setup workflows
- Platform-specific instructions

### For Implementation Context
**→ CLAUDE.md (Section 12)**
- TUC standards for mobile deployment
- Reusable process documentation
- Timeline for other TUC projects

### For App Store Submission
**→ luxthumb-agent/docs/**
- APP_STORE_GUIDE.md
- MOBILE_BUILD_GUIDE.md
- APP_ICONS_GUIDE.md
- APPSTORE_READY.md

---

## 💻 System Requirements

### Required
- Node.js 18+
- pnpm or npm
- git

### For iOS builds (macOS only)
- Xcode 15+
- CocoaPods: `sudo gem install cocoapods`

### For Android builds (all platforms)
- Android Studio 2024.1+
- Java Development Kit 11+
- Android SDK Platform 34+

---

## ✨ Key Features

### Automated Setup
- ✅ Validates project structure (package.json, src/, build config)
- ✅ Installs dependencies via pnpm/npm
- ✅ Creates capacitor.config.ts
- ✅ Adds iOS native project
- ✅ Adds Android native project
- ✅ Updates package.json with build scripts
- ✅ Builds web bundle
- ✅ Syncs platforms
- ✅ Commits to git (optional)

### Error Handling
- ✅ Validates projects before setup
- ✅ Skips steps that fail (with warnings)
- ✅ Continues on error or stops (configurable)
- ✅ Provides detailed error messages

### Flexibility
- ✅ Single or batch processing
- ✅ Dry-run mode (no build/commit)
- ✅ Custom versions and app IDs
- ✅ CSV or JSON project lists
- ✅ PowerShell or Bash

---

## 📊 Current Status

### Capacitor Coverage
```
Total React projects: 286
With Capacitor: 5 (1.7%)
  - luxthumb-agent ✅
  - biochemai-v151120252049 ✅
  - smartghana ✅
  - animator-agent-desktop ✅
  - verb-explorer-toolkit ✅

Without Capacitor: 281 (98.3%)
  - Ready for batch setup
  - Can be enabled with single command
  - Estimated time: 2-4 hours per batch of 50
```

### Next Steps to Complete
1. Edit capacitor-projects-example.csv to match your project list
2. Run batch setup: `.\capacitor-setup-batch.ps1 -ProjectsFile "projects.csv"`
3. Copy documentation from luxthumb-agent to each project:
   - `docs/APP_STORE_GUIDE.md`
   - `docs/MOBILE_BUILD_GUIDE.md`
   - `docs/APP_ICONS_GUIDE.md`
   - `public/privacy.html`
4. Create app icons (1024×1024 PNG per project)
5. Submit to app stores

---

## 🎯 Usage Examples

### Example 1: Setup single project
```powershell
# LuxThumb Designer (already done, but this is how)
.\capacitor-setup.ps1 `
  -AppName "LuxThumb Designer" `
  -AppId "com.techbridge.luxthumb"
```

### Example 2: Setup with custom version
```powershell
.\capacitor-setup.ps1 `
  -AppName "BioChemAI" `
  -AppId "com.techbridge.biochemai" `
  -Version "2.0.0"
```

### Example 3: Dry run (test without committing)
```powershell
.\capacitor-setup.ps1 `
  -AppName "TestApp" `
  -AppId "com.test.testapp" `
  -SkipBuild `
  -SkipCommit
```

### Example 4: Batch setup from CSV
```powershell
# First, create tuc-projects.csv:
# ProjectPath,AppName,AppId,Version
# ./project1,App1,com.techbridge.app1,1.0.0
# ./project2,App2,com.techbridge.app2,1.0.0

.\capacitor-setup-batch.ps1 -ProjectsFile "tuc-projects.csv"
```

### Example 5: Batch setup from JSON
```powershell
# First, create projects.json:
# [
#   {"projectPath":"./app1","appName":"App1","appId":"com.company.app1"},
#   {"projectPath":"./app2","appName":"App2","appId":"com.company.app2"}
# ]

.\capacitor-setup-batch.ps1 -ProjectsFile "projects.json"
```

### Example 6: Batch without builds/commits
```powershell
.\capacitor-setup-batch.ps1 `
  -ProjectsFile "projects.csv" `
  -SkipBuild `
  -SkipCommit
```

---

## ⏱️ Time Breakdown

### Per Project
| Step | Time |
|------|------|
| Install dependencies | 20-30 sec |
| Create config | 5 sec |
| Add iOS platform | 10-15 sec |
| Add Android platform | 15-20 sec |
| Update package.json | 5 sec |
| Build web bundle | 15-30 sec |
| Sync platforms | 10-15 sec |
| Git commit | 5 sec |
| **Total per project** | **1.5-2.5 min** |

### Batch Processing
| Count | Time |
|-------|------|
| 1 project | 3-5 min |
| 5 projects | 15-25 min |
| 10 projects | 30-50 min |
| 50 projects | 2.5-4 hours |
| 281 projects (all) | 12-20 hours (run overnight) |

---

## 🔧 Troubleshooting

### pnpm not found
```bash
npm install -g pnpm
```

### Capacitor CLI not found
```bash
pnpm install -D @capacitor/cli
```

### Pod install fails (iOS)
```bash
cd ios
pod install
cd ..
```

### Gradle build fails (Android)
```bash
cd android
./gradlew clean
./gradlew build
cd ..
```

### Git commit fails
```bash
git init
git add .
git commit -m "initial commit"
```

---

## 📖 Further Learning

### Official Documentation
- **Capacitor:** https://capacitorjs.com/docs
- **iOS App Store:** https://appstoreconnect.apple.com
- **Google Play:** https://play.google.com/console

### TUC Standards
- **Main guide:** `CLAUDE.md` (Section 12)
- **LuxThumb template:** `luxthumb-agent/docs/`

### YouTube/Tutorials
- Capacitor getting started: https://www.youtube.com/watch?v=0V-cCX6FpM0
- iOS App Store submission: https://www.youtube.com/watch?v=8sVvl8YFQIY
- Google Play submission: https://www.youtube.com/watch?v=JMKgLf6Z9L0

---

## ✅ Pre-Deployment Checklist

- [ ] **Project Setup**
  - [ ] Capacitor installed
  - [ ] iOS and Android projects created
  - [ ] Build scripts added to package.json
  - [ ] Web bundle builds successfully

- [ ] **Assets**
  - [ ] App icon created (1024×1024 PNG)
  - [ ] Screenshots taken (5-10 per platform)
  - [ ] Privacy policy written (public/privacy.html)
  - [ ] Documentation copied from luxthumb-agent

- [ ] **Configuration**
  - [ ] App ID is unique (com.techbridge.xxxx)
  - [ ] App version is correct (semver format)
  - [ ] .htaccess deployed (for SPA routing)
  - [ ] Environment variables configured

- [ ] **Testing**
  - [ ] Tested on iOS simulator
  - [ ] Tested on Android emulator
  - [ ] Tested on physical iOS device
  - [ ] Tested on physical Android device
  - [ ] All features work (export, theming, admin panel, etc.)

- [ ] **Accounts**
  - [ ] Apple Developer account created (£99/year)
  - [ ] Google Play account created (£25 one-time)
  - [ ] Developer certificates generated
  - [ ] Release signing configured

- [ ] **Submission**
  - [ ] Submit to App Store Connect
  - [ ] Submit to Google Play Console
  - [ ] Monitor for review feedback
  - [ ] Address any rejection reasons

---

## 🎉 Summary

You now have:
- ✅ 3 reusable setup scripts (PS1, SH, batch)
- ✅ Example configuration files (CSV, JSON)
- ✅ 3 documentation files (complete, quick reference, this readme)
- ✅ Ready to deploy to 281 projects
- ✅ Estimated 12-20 hours to enable all 286 projects

**Next action:** Choose your first batch of projects and run the batch setup script.

---

**Last Updated:** 10 May 2026  
**Author:** Daniel Frempong Twum / TUC ICT  
**Version:** 1.0.0  
**Status:** Production Ready  
**License:** MIT (Use freely for TUC projects)

👉 **Start here:** Read CAPACITOR_QUICK_REFERENCE.md for one-liner commands
