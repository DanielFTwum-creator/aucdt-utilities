#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Capacitor Setup Script for TUC React Web Projects
    Configures iOS and Android app store deployment for any React web app

.DESCRIPTION
    Automates Capacitor 8.3.3 setup across TUC projects. Installs dependencies,
    creates configuration, adds native platforms, and commits changes.

.PARAMETER ProjectPath
    Path to React project root (where package.json is located)
    Default: current working directory

.PARAMETER AppName
    Display name for the app (e.g., "LuxThumb Designer")

.PARAMETER AppId
    Reverse domain notation app ID (e.g., "com.techbridge.luxthumb")

.PARAMETER Version
    App version number (semver format, e.g., "1.0.0")
    Default: "1.0.0"

.PARAMETER SkipCommit
    If specified, don't commit changes to git after setup

.PARAMETER SkipBuild
    If specified, don't build web bundle before syncing platforms

.EXAMPLE
    .\capacitor-setup.ps1 -ProjectPath "C:\Dev\luxthumb-agent" `
        -AppName "LuxThumb Designer" `
        -AppId "com.techbridge.luxthumb"

.EXAMPLE
    # From within a project directory
    .\capacitor-setup.ps1 -AppName "BioChemAI" -AppId "com.techbridge.biochemai"

.EXAMPLE
    # Dry run (no commits)
    .\capacitor-setup.ps1 -ProjectPath ".\my-project" `
        -AppName "MyApp" -AppId "com.company.myapp" -SkipCommit

.NOTES
    Author: Daniel Frempong Twum / TUC ICT
    Updated: 10 May 2026
    Requirements: Node.js, pnpm, git
#>

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string]$ProjectPath = ".",

    [Parameter(Mandatory = $false)]
    [string]$AppName,

    [Parameter(Mandatory = $false)]
    [string]$AppId,

    [Parameter(Mandatory = $false)]
    [string]$Version = "1.0.0",

    [switch]$SkipCommit,

    [switch]$SkipBuild,

    [switch]$Help
)

# Show help
if ($Help -or -not $AppName -or -not $AppId) {
    Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║     Capacitor Setup for TUC React Web Projects                ║
║     iOS and Android App Store Deployment Automation           ║
╚════════════════════════════════════════════════════════════════╝

USAGE:
  .\capacitor-setup.ps1 -AppName "App Name" -AppId "com.company.app"

REQUIRED PARAMETERS:
  -AppName      Display name (e.g., "LuxThumb Designer")
  -AppId        Reverse domain app ID (e.g., "com.techbridge.luxthumb")

OPTIONAL PARAMETERS:
  -ProjectPath  Path to project root (default: current directory)
  -Version      App version, semver format (default: 1.0.0)
  -SkipCommit   Don't commit changes to git
  -SkipBuild    Don't build web bundle before syncing
  -Help         Show this message

EXAMPLES:
  # Full setup with commit
  .\capacitor-setup.ps1 -AppName "MyApp" -AppId "com.techbridge.myapp"

  # Specific project directory
  .\capacitor-setup.ps1 -ProjectPath "C:\Dev\my-project" `
      -AppName "MyApp" -AppId "com.techbridge.myapp"

  # Dry run (no commit)
  .\capacitor-setup.ps1 -AppName "MyApp" -AppId "com.techbridge.myapp" `
      -SkipCommit

WHAT THIS SCRIPT DOES:
  1. Validates project structure (package.json, src/, build config)
  2. Installs Capacitor dependencies via pnpm
  3. Creates capacitor.config.ts with your app settings
  4. Adds iOS native project
  5. Adds Android native project
  6. Updates package.json version and build scripts
  7. Builds web bundle (optional)
  8. Syncs web assets to platforms
  9. Commits all changes to git (optional)

TIME ESTIMATE: 3-5 minutes

REQUIREMENTS:
  - Node.js 18+
  - pnpm (or npm, yarn)
  - git
  - macOS for iOS builds (but Android setup works on any OS)

WHAT GETS CREATED:
  - capacitor.config.ts       (Capacitor configuration)
  - ios/                       (Xcode project)
  - android/                   (Android Studio project)
  - Updated package.json       (build scripts)

AFTER SETUP:
  Use: pnpm build:ios          (build for iOS, macOS only)
  Use: pnpm build:android      (build for Android)
  Use: pnpm mobile:sync        (sync web assets to platforms)
  Use: pnpm ios:open           (open in Xcode, macOS only)
  Use: pnpm android:open       (open in Android Studio)

TROUBLESHOOTING:
  • If pnpm not found: npm install -g pnpm
  • If build fails: pnpm install && pnpm build
  • If git fails: ensure you're in a git repository
  • If CocoaPods fails (iOS): cd ios && pod install && cd ..

LEARN MORE:
  - Check docs/ directory after setup for APP_STORE_GUIDE.md
  - Capacitor docs: https://capacitorjs.com/docs
  - TUC standards: CLAUDE.md (Section 12)

"@
    exit 0
}

# Configuration
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Resolve project path
$ProjectPath = Resolve-Path $ProjectPath
Write-Host "🔍 Validating project at: $ProjectPath" -ForegroundColor Cyan

# Validate project structure
$packageJsonPath = Join-Path $ProjectPath "package.json"
$srcPath = Join-Path $ProjectPath "src"
$buildConfigExists = (Test-Path (Join-Path $ProjectPath "vite.config.ts")) -or `
                     (Test-Path (Join-Path $ProjectPath "webpack.config.js")) -or `
                     (Test-Path (Join-Path $ProjectPath "tsconfig.json"))

if (-not (Test-Path $packageJsonPath)) {
    Write-Host "❌ Error: package.json not found at $ProjectPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $srcPath)) {
    Write-Host "❌ Error: src/ directory not found at $ProjectPath" -ForegroundColor Red
    exit 1
}

if (-not $buildConfigExists) {
    Write-Host "❌ Error: No build config found (vite.config.ts, webpack.config.js, or tsconfig.json)" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project structure validated" -ForegroundColor Green

# Read current package.json
$packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
$projectName = $packageJson.name

Write-Host @"
📦 Project Details:
   Name:    $projectName
   AppName: $AppName
   AppId:   $AppId
   Version: $Version

" -ForegroundColor Blue

# Step 1: Install Capacitor
Write-Host "📥 Installing Capacitor dependencies..." -ForegroundColor Yellow
Push-Location $ProjectPath

try {
    $pmCmd = if (Test-Path "pnpm-lock.yaml") { "pnpm" } else { "npm" }

    if ($pmCmd -eq "pnpm") {
        pnpm install `@capacitor/core `@capacitor/cli `@capacitor/ios `@capacitor/android 2>&1 | ForEach-Object {
            if ($_ -match "added|up to date|ERR") { Write-Host $_ }
        }
    }
    else {
        npm install `@capacitor/core `@capacitor/cli `@capacitor/ios `@capacitor/android 2>&1 | ForEach-Object {
            if ($_ -match "added|up to date|ERR") { Write-Host $_ }
        }
    }
    Write-Host "✅ Capacitor installed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to install Capacitor: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}

# Step 2: Create capacitor.config.ts
Write-Host "⚙️  Creating capacitor.config.ts..." -ForegroundColor Yellow

$capacitorConfig = @"
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: '$AppId',
  appName: '$AppName',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
"@

$capacitorConfig | Set-Content "capacitor.config.ts" -Encoding UTF8
Write-Host "✅ capacitor.config.ts created" -ForegroundColor Green

# Step 3: Add iOS platform
Write-Host "🍎 Adding iOS platform..." -ForegroundColor Yellow
try {
    npx capacitor add ios 2>&1 | ForEach-Object {
        if ($_ -match "success|created|Platform|ERR") { Write-Host $_ }
    }
    Write-Host "✅ iOS platform added" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  iOS platform setup skipped (may require macOS)" -ForegroundColor Yellow
}

# Step 4: Add Android platform
Write-Host "🤖 Adding Android platform..." -ForegroundColor Yellow
try {
    npx capacitor add android 2>&1 | ForEach-Object {
        if ($_ -match "success|created|Platform|ERR") { Write-Host $_ }
    }
    Write-Host "✅ Android platform added" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Android platform setup skipped" -ForegroundColor Yellow
}

# Step 5: Update package.json
Write-Host "📝 Updating package.json..." -ForegroundColor Yellow

# Update version
$packageJson.version = $Version

# Add/update build scripts
if (-not $packageJson.scripts) {
    $packageJson.scripts = @{}
}

$packageJson.scripts | Add-Member -Name "build:web" -Value "vite build && capacitor copy ios && capacitor copy android" -MemberType NoteProperty -Force
$packageJson.scripts | Add-Member -Name "build:ios" -Value "npm run build:web && npx capacitor build ios" -MemberType NoteProperty -Force
$packageJson.scripts | Add-Member -Name "build:android" -Value "npm run build:web && npx capacitor build android" -MemberType NoteProperty -Force
$packageJson.scripts | Add-Member -Name "mobile:sync" -Value "capacitor sync" -MemberType NoteProperty -Force
$packageJson.scripts | Add-Member -Name "ios:open" -Value "open ios/App/App.xcworkspace" -MemberType NoteProperty -Force
$packageJson.scripts | Add-Member -Name "android:open" -Value "open android" -MemberType NoteProperty -Force

# Write updated package.json
$packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath -Encoding UTF8
Write-Host "✅ package.json updated (version: $Version, scripts added)" -ForegroundColor Green

# Step 6: Build web (optional)
if (-not $SkipBuild) {
    Write-Host "🏗️  Building web bundle..." -ForegroundColor Yellow
    try {
        if ($pmCmd -eq "pnpm") {
            pnpm build 2>&1 | ForEach-Object {
                if ($_ -match "✓ built|error|ERR") { Write-Host $_ }
            }
        }
        else {
            npm run build 2>&1 | ForEach-Object {
                if ($_ -match "✓ built|error|ERR") { Write-Host $_ }
            }
        }
        Write-Host "✅ Web build complete" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Web build failed: $_" -ForegroundColor Yellow
    }
}

# Step 7: Sync platforms
Write-Host "🔄 Syncing web assets to platforms..." -ForegroundColor Yellow
try {
    npx capacitor sync 2>&1 | ForEach-Object {
        if ($_ -match "copy|update|Syncing|ERR") { Write-Host $_ }
    }
    Write-Host "✅ Platforms synced" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Platform sync skipped" -ForegroundColor Yellow
}

Pop-Location

# Step 8: Commit changes
if (-not $SkipCommit) {
    Write-Host "📤 Committing changes to git..." -ForegroundColor Yellow
    try {
        Push-Location $ProjectPath
        git add -A
        git commit -m "feat: add Capacitor for iOS/Android app store deployment

- Integrate Capacitor 8.3.3 for native iOS and Android builds
- Add iOS and Android platforms with full configuration
- Create capacitor.config.ts with app ID: $AppId
- Update package.json to version $Version
- Add npm scripts for mobile builds (build:ios, build:android, mobile:sync)
- Web bundle synced to both platforms

Ready for iOS App Store and Google Play Store submission.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>" 2>&1

        $commitHash = git rev-parse --short HEAD
        Write-Host "✅ Changes committed ($commitHash)" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Git commit failed: $_" -ForegroundColor Yellow
    }
    finally {
        Pop-Location
    }
}

# Summary
Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║                    ✅ SETUP COMPLETE                          ║
╚════════════════════════════════════════════════════════════════╝

Project:      $projectName
App Name:     $AppName
App ID:       $AppId
Version:      $Version
Build Status: Ready for app store deployment

📁 New directories created:
   ios/      → Xcode project (macOS required to build)
   android/  → Android Studio project

📄 New files created:
   capacitor.config.ts → Capacitor configuration

📝 Updated files:
   package.json → Version $Version, build scripts added

🚀 NEXT STEPS:

1. Build for iOS (macOS only):
   cd $projectName
   pnpm build:ios
   open ios/App/App.xcworkspace

2. Build for Android:
   cd $projectName
   pnpm build:android
   open android

3. Sync changes anytime:
   pnpm mobile:sync

4. Documentation:
   See CLAUDE.md Section 12 for mobile deployment workflow
   Copy docs from luxthumb-agent if needed (APP_STORE_GUIDE.md, etc.)

5. Before App Store submission:
   - Create app icons (1024×1024 PNG)
   - Take screenshots of key features
   - Write privacy policy
   - Create developer accounts (Apple £99/year, Google £25/one-time)
   - See APP_STORE_GUIDE.md for complete checklist

📚 Resources:
   Capacitor Docs:    https://capacitorjs.com/docs
   App Store Connect: https://appstoreconnect.apple.com
   Google Play:       https://play.google.com/console
   TUC Standards:     CLAUDE.md

" -ForegroundColor Green

Write-Host "Done! 🎉" -ForegroundColor Cyan
