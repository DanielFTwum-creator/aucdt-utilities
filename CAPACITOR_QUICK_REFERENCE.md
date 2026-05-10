# Capacitor Setup — Quick Reference Card

**Bookmark this page for fast access to setup commands**

---

## 🚀 One-Liners

### Single Project
```powershell
# PowerShell (Windows/Mac/Linux)
.\capacitor-setup.ps1 -AppName "MyApp" -AppId "com.techbridge.myapp"

# Bash (macOS/Linux)
./capacitor-setup.sh --app-name "MyApp" --app-id "com.techbridge.myapp"
```

### Batch (Multiple Projects)
```powershell
# From CSV file
.\capacitor-setup-batch.ps1 -ProjectsFile "capacitor-projects-example.csv"

# From JSON file
.\capacitor-setup-batch.ps1 -ProjectsFile "capacitor-projects-example.json"
```

---

## 📋 Common Parameters

```powershell
# PowerShell
-AppName "Display Name"          # Required: e.g., "LuxThumb Designer"
-AppId "com.company.app"         # Required: Reverse domain notation
-ProjectPath "/path/to/project"  # Optional: Default = current directory
-Version "1.0.0"                 # Optional: Default = 1.0.0
-SkipBuild                       # Optional: Skip web bundle build
-SkipCommit                      # Optional: Don't commit to git
-Help                            # Show detailed help
```

```bash
# Bash
--app-name "Display Name"        # Required
--app-id "com.company.app"       # Required
--project-path "/path/to/project" # Optional
--version "1.0.0"                # Optional
--skip-build                     # Optional
--skip-commit                    # Optional
--help                           # Show help
```

---

## 🎯 Common Scenarios

### Scenario 1: Setup single project (with commit)
```powershell
.\capacitor-setup.ps1 -AppName "BioChemAI" -AppId "com.techbridge.biochemai"
```

### Scenario 2: Setup project without building
```powershell
.\capacitor-setup.ps1 -AppName "MyApp" -AppId "com.techbridge.myapp" -SkipBuild
```

### Scenario 3: Dry run (no build, no commit)
```powershell
.\capacitor-setup.ps1 -AppName "Test" -AppId "com.test.app" -SkipBuild -SkipCommit
```

### Scenario 4: Setup 8 TUC projects at once
```powershell
.\capacitor-setup-batch.ps1 -ProjectsFile "capacitor-projects-example.csv"
```

### Scenario 5: Setup custom project list
```powershell
# Create projects.csv with your project list
.\capacitor-setup-batch.ps1 -ProjectsFile "projects.csv"
```

### Scenario 6: Continue even if some projects fail
```powershell
.\capacitor-setup-batch.ps1 -ProjectsFile "projects.csv" -ContinueOnError
```

---

## 📁 File Locations

```
aucdt-utilities/
├── capacitor-setup.ps1               # Single project (PowerShell)
├── capacitor-setup.sh                # Single project (Bash)
├── capacitor-setup-batch.ps1         # Batch setup
├── capacitor-projects-example.csv    # Example: 8 TUC projects
├── capacitor-projects-example.json   # Example: JSON format
├── CAPACITOR_SCRIPTS.md              # Full documentation
└── CAPACITOR_QUICK_REFERENCE.md      # This file
```

---

## 🏗️ After Setup: npm Scripts

Each project gets these commands:

```bash
pnpm build:web       # Build web bundle + sync platforms
pnpm build:ios       # Web + iOS build (macOS only)
pnpm build:android   # Web + Android build
pnpm mobile:sync     # Sync web assets to platforms
pnpm ios:open        # Open Xcode (macOS only)
pnpm android:open    # Open Android Studio
```

---

## 📱 Build & Deploy

### iOS Build
```bash
cd project-name
pnpm build:ios
open ios/App/App.xcworkspace  # Opens Xcode
```

### Android Build
```bash
cd project-name
pnpm build:android
open android  # Opens Android Studio
```

---

## ⏱️ Time Estimates

| Task | Time | Notes |
|------|------|-------|
| Single project | 3-5 min | Web build included |
| 5 projects (batch) | 15-25 min | Linear setup |
| 10 projects (batch) | 30-50 min | ~3 min each |
| 50+ projects (batch) | 2.5-4 hours | Run overnight |

---

## 🐛 Quick Fixes

```bash
# pnpm not found
npm install -g pnpm

# Clear Capacitor cache
rm -rf capacitor.config.json ios/ android/
pnpm install @capacitor/ios @capacitor/android

# Fix iOS build
cd ios && pod install && cd ..

# Fix Android build
cd android && ./gradlew clean && ./gradlew build

# Git not working
git init && git add . && git commit -m "initial"
```

---

## 📚 Documentation Links

| Resource | Location |
|----------|----------|
| Full script docs | `CAPACITOR_SCRIPTS.md` |
| App store guide | `luxthumb-agent/docs/APP_STORE_GUIDE.md` |
| Icons guide | `luxthumb-agent/docs/APP_ICONS_GUIDE.md` |
| Mobile build guide | `luxthumb-agent/docs/MOBILE_BUILD_GUIDE.md` |
| TUC standards | `CLAUDE.md` (Section 12) |
| Capacitor docs | https://capacitorjs.com/docs |

---

## ✅ Checklist Before Submission

- [ ] Icons created (1024×1024 PNG)
- [ ] Screenshots taken (5-10 per platform)
- [ ] Privacy policy written (`public/privacy.html`)
- [ ] App ID is unique
- [ ] Version number correct
- [ ] Tested on iOS simulator
- [ ] Tested on Android emulator
- [ ] Apple Developer account created (£99/year)
- [ ] Google Play account created (£25 one-time)
- [ ] .htaccess deployed (for SPA routing)

---

## 💻 Platform Requirements

| Task | Windows | macOS | Linux |
|------|---------|-------|-------|
| Single setup | ✅ | ✅ | ✅ |
| Batch setup | ✅ | ✅ | ✅ |
| iOS build | ❌ | ✅ | ❌ |
| Android build | ✅ | ✅ | ✅ |
| iOS testing | ❌ | ✅ | ❌ |
| Android testing | ✅ | ✅ | ✅ |

---

## 📊 Project Coverage

**Status:** 286 React projects in aucdt-utilities
- ✅ WITH Capacitor: 5 (1.7%) — luxthumb, biochemai, smartghana, animator, verb-explorer
- ❌ WITHOUT Capacitor: 281 (98.3%) — Ready for setup

**Next:** Use batch scripts to enable all 281 projects

---

## 🎓 Learning Path

1. **Start here:** Read this quick reference
2. **Single project:** Try `capacitor-setup.ps1` on one project
3. **Batch setup:** Use `capacitor-setup-batch.ps1` for multiple projects
4. **App submission:** Follow `CAPACITOR_SCRIPTS.md` for detailed steps
5. **Full docs:** See luxthumb-agent's `docs/APP_STORE_GUIDE.md`

---

**Last Updated:** 10 May 2026  
**Status:** Production Ready  
**License:** MIT (Use freely for TUC projects)

👉 **Quick Help:** Run `.\capacitor-setup.ps1 -Help` or `./capacitor-setup.sh --help`
