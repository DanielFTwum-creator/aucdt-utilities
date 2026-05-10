# Capacitor Setup Scripts — TUC React Web Projects

**Fast-track iOS and Android app store deployment for any React web app**

---

## Quick Start

### Single Project (PowerShell - Windows/Mac/Linux)

```powershell
.\capacitor-setup.ps1 -AppName "My App" -AppId "com.techbridge.myapp"
```

### Single Project (Bash - macOS/Linux)

```bash
./capacitor-setup.sh --app-name "My App" --app-id "com.techbridge.myapp"
```

### Multiple Projects (Batch)

```powershell
# From CSV file
.\capacitor-setup-batch.ps1 -ProjectsFile "capacitor-projects-example.csv"

# From JSON file
.\capacitor-setup-batch.ps1 -ProjectsFile "capacitor-projects-example.json"
```

---

## Three Scripts Provided

| Script | Use Case | Platform | Time |
|--------|----------|----------|------|
| **capacitor-setup.ps1** | Single project setup | Windows/Mac/Linux | 3-5 min |
| **capacitor-setup.sh** | Single project setup | macOS/Linux only | 3-5 min |
| **capacitor-setup-batch.ps1** | Multiple projects | Windows/Mac/Linux | 30-50 min per 10 projects |

---

## Script 1: capacitor-setup.ps1 (PowerShell)

**For: Single project, all platforms**

### Basic Usage

```powershell
.\capacitor-setup.ps1 -AppName "MyApp" -AppId "com.techbridge.myapp"
```

### Full Usage

```powershell
.\capacitor-setup.ps1 `
  -AppName "My App Name" `
  -AppId "com.company.myapp" `
  -ProjectPath "C:\Dev\my-project" `
  -Version "1.0.0" `
  -SkipBuild `
  -SkipCommit
```

### Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `-AppName` | ✅ Yes | — | Display name (e.g., "LuxThumb Designer") |
| `-AppId` | ✅ Yes | — | Reverse domain app ID (e.g., "com.techbridge.luxthumb") |
| `-ProjectPath` | ❌ No | `.` | Path to project root (default: current directory) |
| `-Version` | ❌ No | `1.0.0` | App version, semver format |
| `-SkipBuild` | ❌ No | `false` | Skip web bundle build |
| `-SkipCommit` | ❌ No | `false` | Don't commit changes to git |
| `-Help` | ❌ No | — | Show help and exit |

### Examples

```powershell
# Basic setup
.\capacitor-setup.ps1 -AppName "BioChemAI" -AppId "com.techbridge.biochemai"

# Specific project directory
.\capacitor-setup.ps1 `
  -ProjectPath "C:\Development\github\aucdt-utilities\luxthumb-agent" `
  -AppName "LuxThumb Designer" `
  -AppId "com.techbridge.luxthumb"

# Dry run (no build or commit)
.\capacitor-setup.ps1 `
  -AppName "TestApp" `
  -AppId "com.techbridge.testapp" `
  -SkipBuild `
  -SkipCommit

# With custom version
.\capacitor-setup.ps1 `
  -AppName "MyApp" `
  -AppId "com.techbridge.myapp" `
  -Version "2.5.0"
```

### What It Does

1. ✅ Validates project structure (package.json, src/, build config)
2. ✅ Installs Capacitor 8.3.3 via pnpm/npm
3. ✅ Creates `capacitor.config.ts` with your app settings
4. ✅ Adds iOS native project (`ios/`)
5. ✅ Adds Android native project (`android/`)
6. ✅ Updates `package.json` version and build scripts
7. ✅ Builds web bundle (`dist/`)
8. ✅ Syncs web assets to platforms
9. ✅ Commits all changes to git

---

## Script 2: capacitor-setup.sh (Bash)

**For: Single project, macOS/Linux only**

### Basic Usage

```bash
./capacitor-setup.sh --app-name "MyApp" --app-id "com.techbridge.myapp"
```

### Full Usage

```bash
./capacitor-setup.sh \
  --app-name "My App Name" \
  --app-id "com.company.myapp" \
  --project-path /path/to/project \
  --version "1.0.0" \
  --skip-build \
  --skip-commit
```

### Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `--app-name` | ✅ Yes | — | Display name (e.g., "LuxThumb Designer") |
| `--app-id` | ✅ Yes | — | Reverse domain app ID (e.g., "com.techbridge.luxthumb") |
| `--project-path` | ❌ No | `.` | Path to project root (default: current directory) |
| `--version` | ❌ No | `1.0.0` | App version, semver format |
| `--skip-build` | ❌ No | — | Skip web bundle build |
| `--skip-commit` | ❌ No | — | Don't commit changes to git |
| `--help` | ❌ No | — | Show help and exit |

### Examples

```bash
# Basic setup
./capacitor-setup.sh --app-name "BioChemAI" --app-id "com.techbridge.biochemai"

# Specific project directory
./capacitor-setup.sh \
  --project-path /path/to/luxthumb-agent \
  --app-name "LuxThumb Designer" \
  --app-id "com.techbridge.luxthumb"

# Dry run (no build or commit)
./capacitor-setup.sh \
  --app-name "TestApp" \
  --app-id "com.techbridge.testapp" \
  --skip-build \
  --skip-commit

# With custom version
./capacitor-setup.sh \
  --app-name "MyApp" \
  --app-id "com.techbridge.myapp" \
  --version "2.5.0"
```

---

## Script 3: capacitor-setup-batch.ps1 (PowerShell)

**For: Multiple projects at once**

### Basic Usage (CSV)

```powershell
.\capacitor-setup-batch.ps1 -ProjectsFile "capacitor-projects-example.csv"
```

### Basic Usage (JSON)

```powershell
.\capacitor-setup-batch.ps1 -ProjectsFile "capacitor-projects-example.json"
```

### Inline Setup

```powershell
.\capacitor-setup-batch.ps1 -ProjectList '[
  {"projectPath":"./luxthumb","appName":"LuxThumb","appId":"com.techbridge.luxthumb"},
  {"projectPath":"./biochemai","appName":"BioChemAI","appId":"com.techbridge.biochemai"}
]'
```

### Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `-ProjectsFile` | ✅* | — | CSV or JSON file with project list |
| `-ProjectList` | ✅* | — | Inline JSON array of projects |
| `-SetupScript` | ❌ No | `./capacitor-setup.ps1` | Path to single-project setup script |
| `-SkipBuild` | ❌ No | — | Skip web builds for all projects |
| `-SkipCommit` | ❌ No | — | Don't commit for any projects |
| `-ContinueOnError` | ❌ No | — | Keep going if one project fails |
| `-Help` | ❌ No | — | Show help and exit |

*Either `-ProjectsFile` OR `-ProjectList` must be specified

### CSV Format

```csv
ProjectPath,AppName,AppId,Version
./luxthumb-agent,LuxThumb Designer,com.techbridge.luxthumb,1.0.0
./biochemai,BioChemAI,com.techbridge.biochemai,1.0.0
./smartghana,SmartGhana,com.techbridge.smartghana,1.0.0
```

### JSON Format

```json
[
  {
    "projectPath": "./luxthumb-agent",
    "appName": "LuxThumb Designer",
    "appId": "com.techbridge.luxthumb",
    "version": "1.0.0"
  },
  {
    "projectPath": "./biochemai",
    "appName": "BioChemAI",
    "appId": "com.techbridge.biochemai",
    "version": "1.0.0"
  }
]
```

### Examples

```powershell
# Setup from CSV (8 projects = ~40 minutes)
.\capacitor-setup-batch.ps1 -ProjectsFile "capacitor-projects-example.csv"

# Setup from JSON
.\capacitor-setup-batch.ps1 -ProjectsFile "capacitor-projects-example.json"

# Setup without building or committing
.\capacitor-setup-batch.ps1 -ProjectsFile "projects.csv" -SkipBuild -SkipCommit

# Continue even if some projects fail
.\capacitor-setup-batch.ps1 -ProjectsFile "projects.csv" -ContinueOnError

# Setup only 3 projects (create custom CSV first)
# projects-subset.csv:
#   ProjectPath,AppName,AppId,Version
#   ./app1,App 1,com.company.app1,1.0.0
#   ./app2,App 2,com.company.app2,1.0.0
#   ./app3,App 3,com.company.app3,1.0.0
.\capacitor-setup-batch.ps1 -ProjectsFile "projects-subset.csv"
```

---

## Pre-Existing Configuration Files

Two example files are provided:

### capacitor-projects-example.csv
Lists 8 TUC projects (luxthumb, biochemai, smartghana, etc.)
Use as a template for your own CSV.

### capacitor-projects-example.json
Same 8 projects in JSON format.
Use as a template for your own JSON.

---

## After Setup: What Happens

Each project gets:

### New Files
- `capacitor.config.ts` — Capacitor configuration
- `ios/App/` — Xcode project (iOS)
- `android/app/` — Android Studio project (Android)

### New npm Scripts
```bash
pnpm build:web       # Build web bundle + sync platforms
pnpm build:ios       # Web build + iOS Capacitor build (macOS)
pnpm build:android   # Web build + Android Capacitor build
pnpm mobile:sync     # Sync web assets to platforms
pnpm ios:open        # Open Xcode workspace (macOS)
pnpm android:open    # Open Android Studio
```

### Git Commit
All changes committed with message:
```
feat: add Capacitor for iOS/Android app store deployment

- Integrate Capacitor 8.3.3...
- Add iOS and Android platforms...
```

---

## Workflow After Setup

### Build for iOS (macOS only)
```bash
cd luxthumb-agent
pnpm build:ios
open ios/App/App.xcworkspace  # Opens in Xcode
```

### Build for Android
```bash
cd luxthumb-agent
pnpm build:android
open android  # Opens in Android Studio
```

### Sync web changes
```bash
pnpm mobile:sync
```

### Test on simulator/emulator
```bash
# iOS (Xcode)
Product → Run

# Android (Android Studio)
Run → Select emulator
```

---

## App Store Submission (Next Steps)

After setup is complete, follow the guides:

1. **Create app icons** (1024×1024 PNG)
   - See: `docs/APP_ICONS_GUIDE.md` (copy from luxthumb-agent)

2. **Take screenshots** (5-10 per platform)
   - iOS: 1242×2688 px
   - Android: 1080×1920 px

3. **Write privacy policy**
   - See: `public/privacy.html` (copy from luxthumb-agent)

4. **Create developer accounts**
   - Apple Developer: £99/year → appstoreconnect.apple.com
   - Google Play: £25 one-time → play.google.com/console

5. **Submit to stores**
   - See: `docs/APP_STORE_GUIDE.md` (copy from luxthumb-agent)

---

## Troubleshooting

### "pnpm not found"
```powershell
npm install -g pnpm
```

### "Command not found: capacitor"
```bash
pnpm install -D @capacitor/cli
```

### iOS build fails (macOS)
```bash
cd ios && pod install && cd ..
rm -rf ios/Pods/Podfile.lock
pnpm build:ios
```

### Android build fails
```bash
cd android
./gradlew clean
./gradlew build
```

### Git commit fails
Ensure you're in a git repository:
```bash
git init
git add .
git commit -m "initial commit"
```

### Project validation fails
Check that the project has:
- `package.json` at root
- `src/` directory with TypeScript/JSX files
- `vite.config.ts` or `webpack.config.js` (build config)
- `tsconfig.json` (TypeScript config)

---

## Time Estimates

| Scenario | Time | Notes |
|----------|------|-------|
| Single project (PowerShell) | 3-5 min | Includes build + sync |
| Single project (Bash) | 3-5 min | Includes build + sync |
| 5 projects (batch) | 15-25 min | In parallel would be faster |
| 10 projects (batch) | 30-50 min | Linear: 3 min per project |
| 50 projects (batch) | 2.5-4 hours | Run overnight for best results |

**Tip:** Run batch on a powerful machine to build faster.

---

## Support & Documentation

**Learn More:**
- Capacitor docs: https://capacitorjs.com/docs
- App Store Connect: https://appstoreconnect.apple.com
- Google Play Console: https://play.google.com/console
- TUC Standards: CLAUDE.md (Section 12)

**Templates to copy:**
- `docs/APP_STORE_GUIDE.md`
- `docs/MOBILE_BUILD_GUIDE.md`
- `docs/APP_ICONS_GUIDE.md`
- `public/privacy.html`

---

## Examples Provided

- **capacitor-projects-example.csv** — 8 TUC projects in CSV format
- **capacitor-projects-example.json** — Same 8 projects in JSON format

Edit these files to match your project list, then run batch setup.

---

**Last Updated:** 10 May 2026  
**Author:** Daniel Frempong Twum / TUC ICT  
**License:** MIT (Use freely for TUC projects)
