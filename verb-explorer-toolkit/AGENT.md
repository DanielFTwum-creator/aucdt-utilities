# verb-explorer-toolkit - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for verb-explorer-toolkit.

### FILE: .dockerignore
```text
node_modules
npm-debug.log
dist
build
.git
.env
.env.local
.DS_Store
android/
ios/
capacitor.config.ts

```

### FILE: (environment files omitted)

> Environment files are never committed. See the repo's own `.env.example`
> for variable names; real values live only in the server's untracked
> `.env.local` / `.env.production`. This block was removed by the fleet
> secret-scrub (blueprint minus secrets).

### FILE: .gitignore
```text
node_modules/
build/
dist/
coverage/
.DS_Store
*.log
.env*
!.env.example

# Capacitor & Native builds
ios/
android/
*.keystore
*.jks

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# OS
Thumbs.db
.DS_Store

```

### FILE: AGENTS.md
```md
# AGENTS.md — Deployment & Automation Guide

> Instructions for Claude agents (Haiku, Sonnet, Opus) automating tasks on this project.

---

## Deployment Automation

### Full Deployment Pipeline

When deploying the Verb Explorer Toolkit to Plesk:

```bash
# 1. Rebuild (ensure vite.config.ts has base: './')
npm run build

# 2. Create target directory
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "mkdir -p /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet"

# 3. Deploy via SCP (copy all dist contents)
scp -o StrictHostKeyChecking=no -r dist/* \
  root@ai-tools.techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/

# 4. Fix ownership (CRITICAL - never skip this)
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "chown -R techbridge.edu.gh_md:psacln /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet"

# 5. Fix permissions (directories: 755, files: 644)
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "chmod -R 755 /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet && \
   find /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet -type f -exec chmod 644 {} \;"

# 6. Verify deployment
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/"
```

### Critical: Do NOT Skip Step 4 & 5

**Issue:** Files exist but are unreadable by web server (shows 404 or blank page)

**Root Cause:** SCP as root creates files owned by root; Plesk web server runs as `techbridge.edu.gh_md`

**Solution:** Always run `chown` and `chmod` after SCP deployment

**Verification:** Output should show:
```
-rw-r--r-- techbridge.edu.gh_md psacln  index.html
-rw-r--r-- techbridge.edu.gh_md psacln  app-icon.svg
drwxr-xr-x techbridge.edu.gh_md psacln  assets/
```

If owner is `root`, run the chown command again.

---

## Asset Path Configuration

### Vite Configuration

The `vite.config.ts` MUST include:
```typescript
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',  // ← This is CRITICAL for subdirectory deployments
    plugins: [react(), tailwindcss()],
    // ... rest of config
  };
});
```

### Why `base: './'`?

| Scenario | Path Type | Resolves To | Status |
|----------|-----------|-------------|--------|
| Root deploy (`/vet/`) | `./assets/` | `/vet/assets/` | ✅ Works |
| Root deploy (`/vet/`) | `/assets/` | `/assets/` | ❌ 404 |
| Subdomain deploy | `./assets/` | `./assets/` | ✅ Works |
| Subdomain deploy | `/assets/` | `/assets/` | ❌ 404 |

**Rule:** Always use `base: './'` for Plesk deployments.

### Verifying in Built Output

After `npm run build`, check dist/index.html:
```bash
grep "src=\|href=" dist/index.html
```

Should output:
```html
<script type="module" crossorigin src="./assets/index-593tSn8n.js"></script>
<link rel="stylesheet" crossorigin href="./assets/index-C_BPqOIj.css">
<link rel="apple-touch-icon" href="./app-icon.svg" />
```

All paths start with `./` — if any start with `/`, rebuild.

---

## Troubleshooting Checklist

| Symptom | Cause | Solution |
|---------|-------|----------|
| App loads, but JS/CSS 404 | Absolute asset paths | Check `vite.config.ts` has `base: './'`, rebuild, redeploy |
| Plesk shows empty folder | Ownership issue | Run `chown -R techbridge.edu.gh_md:psacln /path/to/vet` |
| Files exist in SSH but not Plesk UI | Cache/sync lag | Refresh Plesk (F5), wait 10s, check ownership |
| 403 Forbidden on assets | File permissions | Run `chmod 644` on files, `chmod 755` on dirs |
| App blank or slow loading | Browser cache | Ctrl+Shift+Del, clear cache, hard refresh Ctrl+F5 |

---

## Deployment Checklist (Before Running Deploy)

- [ ] Latest code pulled: `git pull origin claude/pdf-showcase-prototype-yuiXV`
- [ ] `vite.config.ts` has `base: './'`
- [ ] `npm run lint` passes (zero TypeScript errors)
- [ ] `npm run build` succeeds (no warnings)
- [ ] `dist/index.html` has `./assets/` (not `/assets/`)
- [ ] SSH access verified: `ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh "echo ok"`
- [ ] Know the exact target path: `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/`

---

## Post-Deployment Verification

After deployment completes:

1. **Verify files on server:**
   ```bash
   ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
     "find /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet -type f | head -5"
   ```
   Should list: index.html, app-icon.svg, manifest.webmanifest, assets/index-*.js, assets/index-*.css

2. **Verify ownership:**
   ```bash
   ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
     "ls -l /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/ | head -3"
   ```
   Should show owner `techbridge.edu.gh_md` (NOT `root`)

3. **Test in browser:**
   - Open: https://ai-tools.techbridge.edu.gh/vet/
   - Check DevTools → Network tab
   - All assets should load (status 200, not 404)
   - App should render (not blank page)

---

## Error Handling

### If Deployment Fails

**Common failure points:**

1. **SCP hangs or times out**
   - Check SSH access: `ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh "uptime"`
   - If no response, server may be down — contact sysadmin

2. **mkdir fails: "Permission denied"**
   - Ensure SSH as root: `ssh root@... ` (not as domain user)

3. **chown fails: "invalid user"**
   - Double-check owner name: `techbridge.edu.gh_md` (with underscores, not hyphens)
   - Verify it exists: `ssh root@... "id techbridge.edu.gh_md"`

4. **App loads but shows blank page**
   - Check browser console for JS errors (F12 → Console)
   - Verify assets load: F12 → Network tab, look for 404s
   - If assets 404: assets paths are wrong (redo build + redeploy)

### Recovery Steps

If deployment goes wrong:

```bash
# 1. Clear target directory completely
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "rm -rf /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet"

# 2. Recreate from scratch
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "mkdir -p /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet"

# 3. Redeploy
scp -o StrictHostKeyChecking=no -r dist/* \
  root@ai-tools.techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/

# 4. Re-fix permissions
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "chown -R techbridge.edu.gh_md:psacln /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet && \
   chmod -R 755 /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet && \
   find /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet -type f -exec chmod 644 {} \;"
```

---

## Agent Responsibilities

### Haiku Agent (Deployment & Ops)
- Build: `npm run build`
- Deploy: SCP files to server
- Fix permissions: `chown`, `chmod`
- Verify: SSH checks and file listing
- Cannot: Create signing certificates, manage DNS, approve production changes

### Sonnet Agent (Build & QA)
- Check `vite.config.ts` before build
- Verify build output (asset paths)
- Test locally before deployment approval
- Review error logs and troubleshoot
- Cannot: Deploy to production servers without explicit approval

### Opus Agent (Architecture & Planning)
- Review deployment strategy
- Decide on version bumps and tagging
- Plan migration steps (if major changes)
- Approve release to production
- Cannot: Execute deployment commands (delegate to Haiku)

---

## Quick Reference

**Deploy command (copy-paste, update path if different):**
```bash
#!/bin/bash
set -e

# Build
npm run build

# Create dir
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "mkdir -p /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet"

# Deploy
scp -o StrictHostKeyChecking=no -r dist/* \
  root@ai-tools.techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/

# Fix permissions
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh << 'EOF'
chown -R techbridge.edu.gh_md:psacln /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet
chmod -R 755 /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet
find /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet -type f -exec chmod 644 {} \;
EOF

# Verify
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "echo '✅ Deployment complete' && ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/"
```

---

*Last Updated: 2026-05-08*  
*For: Verb Explorer Toolkit v1.0.0*

```

### FILE: capacitor.config.ts
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techbridge.verbexplorer',
  appName: 'Verb Explorer',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#a8edea",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
    },
  },
};

export default config;

```

### FILE: CLAUDE.md
```md
# CLAUDE.md — Verb Explorer Toolkit

> This file is read automatically by Claude Code on every session.
> It governs development standards, deployment procedures, and known issues for this project.

---

## Project Overview

**Name:** Verb Explorer Toolkit  
**Version:** 1.0.0  
**Status:** Active Development → App Store/Play Store Submission (Phase 2)  
**Stack:** React 19 + TypeScript 5.8 + Vite 6 + Tailwind CSS 4 + Capacitor 8

**Purpose:** Interactive educational toolkit for Class 4 students to discover, research, and create profile cards for English verbs. Fully offline, no external APIs (local-first architecture).

---

## Build & Deployment

### Quick Commands

```bash
npm install          # Install dependencies
npm run build        # Build for production (outputs to dist/)
npm run dev          # Start dev server (port 3000)
npm run cap:sync     # Sync to iOS/Android native projects
npm run cap:ios      # Open Xcode project
npm run cap:android  # Open Android Studio project
```

### Critical: Asset Paths for Subdirectory Deployment

⚠️ **IMPORTANT:** This app is deployed to a subdirectory, NOT the domain root.

**Deployment Path:**
```
/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/
https://ai-tools.techbridge.edu.gh/vet/
```

**vite.config.ts MUST have:**
```typescript
base: './',  // Relative paths, NOT absolute /assets/
```

**Why:** 
- Absolute paths `/assets/` resolve to domain root
- Relative paths `./assets/` resolve to current directory
- Subdirectory deployment requires relative paths

**If paths break after build:**
1. Check `vite.config.ts` has `base: './'`
2. Run `npm run build`
3. Redeploy dist/ to server
4. Test in browser DevTools (Network tab) to verify asset loads

---

## Deployment to Plesk

### Server Details
- **Host:** ai-tools.techbridge.edu.gh (or techbridge.edu.gh for subdomains)
- **SSH Access:** `ssh root@ai-tools.techbridge.edu.gh`
- **Web Root:** `/var/www/vhosts/techbridge.edu.gh/` (for subdomains)
- **Domain Config:** Plesk File Manager

### SCP Deployment Steps

**1. Build locally**
```bash
npm run build
```

**2. Deploy to server**
```bash
# Create target directory if needed
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "mkdir -p /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet"

# Copy files
cd dist/
scp -o StrictHostKeyChecking=no -r ./* \
  root@ai-tools.techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/
```

**3. Fix permissions (CRITICAL!)**
```bash
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh << 'EOF'
# Change ownership to domain user
chown -R techbridge.edu.gh_md:psacln \
  /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet

# Set directory permissions (755)
chmod -R 755 /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet

# Set file permissions (644)
find /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet \
  -type f -exec chmod 644 {} \;
EOF
```

**Why permissions matter:**
- SCP as root creates files owned by root
- Plesk web server runs as `techbridge.edu.gh_md` user
- Files must be readable by web server user
- Without `chown`, Plesk shows files but web server can't read them

**Verify deployment:**
```bash
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/"
```

Files should show owner `techbridge.edu.gh_md` and permissions starting with `rw-r--r--` (644).

**Live URL:** https://ai-tools.techbridge.edu.gh/vet/

---

## Common Issues & Solutions

### Issue: App loads but assets (JS, CSS) return 404

**Cause:** Absolute paths in index.html (`/assets/...` instead of `./assets/...`)

**Fix:**
1. Edit `vite.config.ts`: ensure `base: './'`
2. Run `npm run build`
3. Redeploy `dist/` to server
4. Clear browser cache (Ctrl+Shift+Del)

### Issue: Plesk File Manager shows files as empty

**Cause:** Files exist on server but Plesk interface isn't syncing

**Fix:**
1. Verify files with SSH: `ssh root@... "ls -la /path/to/vet/"`
2. Refresh Plesk page (F5)
3. Check permissions: files should be owned by `techbridge.edu.gh_md`

### Issue: SCP deployment seems to work but files aren't accessible

**Cause:** Ownership/permissions not fixed after SCP

**Fix:**
```bash
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "chown -R techbridge.edu.gh_md:psacln /path/to/vet && \
   chmod -R 755 /path/to/vet && \
   find /path/to/vet -type f -exec chmod 644 {} \;"
```

---

## Development Standards

### Code Quality
- `npm run lint` must pass (TypeScript strict mode)
- No console errors or warnings in production build
- All imports used (no dead code)
- No hardcoded API keys or secrets

### Git Workflow
- Commit messages: descriptive, under 50 chars title + body
- One feature per commit
- Tag releases: `v1.0.0`, `v1.0.1`, etc.
- Push to `claude/pdf-showcase-prototype-yuiXV` branch

### Testing
- Test locally: `npm run dev` on iPhone/Android simulator or actual device
- Test on Plesk: Visit deployed URL after each build
- Check DevTools Network tab for 404 errors on assets
- Verify data persistence: reload page, check localStorage

---

## Mobile App Submission (iOS & Android)

See `DEPLOYMENT_GUIDE.md` and `PRE_LAUNCH_CHECKLIST.md` for full details.

**Phase Status:**
- Phase 1: Development ✅ Complete
- Phase 2: Screenshots & metadata (In Progress)
- Phase 3-7: Testing → Submission → Post-launch (Pending)

**Key Notes:**
- Bundle ID: `com.techbridge.verbexplorer`
- App ID: `com.techbridge.verbexplorer`
- Min iOS: 13.0 | Min Android: 8.0
- Capacitor handles native bridges (no custom Swift/Kotlin needed yet)

---

## Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Currently used:
- `GEMINI_API_KEY` (optional, for future AI verb discovery feature)

Never commit `.env.local` or `.env` files.

---

## Known Limitations (v1.0.0)

- ❌ No cloud sync (all data local to device)
- ❌ No user accounts or login
- ❌ No multiplayer/sharing features
- ❌ No AI verb discovery (planned for v1.1)
- ❌ Cannot open files from device (local app only)

---

## Support & Contacts

| Role | Name | Email |
|------|------|-------|
| Project Lead | Daniel Twum | daniel.twum@techbridge.edu.gh |
| Deployment | Plesk/Server Admin | root@ai-tools.techbridge.edu.gh |
| Legal/Privacy | TUC Legal | ict@techbridge.edu.gh |

---

## Session Checklist

When starting work on this project:

- [ ] Read this file
- [ ] Check `git log --oneline -5` for recent changes
- [ ] Run `npm install` if dependencies changed
- [ ] Run `npm run lint` to catch TypeScript errors
- [ ] If deploying: verify `vite.config.ts` has `base: './'`
- [ ] If deploying: test locally first with `npm run dev`
- [ ] If deploying: remember to fix permissions after SCP

---

*Last Updated: 2026-05-08*  
*Updated by: Claude Haiku 4.5*

```

### FILE: DEPLOYMENT_GUIDE.md
```md
# Verb Explorer Toolkit — App Store & Play Store Deployment Guide

**Last Updated:** 2026-05-08  
**Version:** 1.0.0  
**App ID:** `com.techbridge.verbexplorer`  
**Publisher:** Techbridge Education Services Ghana

---

## 📋 Pre-Deployment Checklist

### Prerequisites
- [ ] Apple Developer Account (paid: $99/year)
- [ ] Google Play Developer Account (one-time: $25)
- [ ] Mac with Xcode (iOS builds)
- [ ] Android Studio or Android SDK (Android builds)
- [ ] Node.js 18+ and npm installed

### Project Setup
- [x] Dependencies installed (`npm install`)
- [x] Web app builds successfully (`npm run build`)
- [x] Capacitor configured (`capacitor.config.ts`)
- [x] App icons created (`public/app-icon.svg`)
- [x] Metadata configured (`metadata.json`)

---

## 🔧 Setup Instructions

### 1. Install Native Project Dependencies

```bash
npm run cap:sync
```

This will:
- Generate `ios/` folder with Xcode project
- Generate `android/` folder with Android Studio project
- Copy web assets to both platforms

### 2. Update App Name & Bundle ID (if needed)

Edit `capacitor.config.ts`:
```typescript
const config: CapacitorConfig = {
  appId: 'com.techbridge.verbexplorer',  // Change if needed
  appName: 'Verb Explorer',               // Change if needed
  webDir: 'dist',
  // ...
};
```

Then re-sync:
```bash
npm run cap:sync
```

---

## 🍎 iOS Deployment (App Store)

### Step 1: Prepare Signing Certificates

1. **Open Xcode Project**
   ```bash
   npm run cap:ios
   ```
   This opens the iOS project in Xcode.

2. **Configure Signing**
   - Select project → "Verb Explorer" target
   - Go to "Signing & Capabilities"
   - Team: Select your Apple Developer Team
   - Bundle ID: `com.techbridge.verbexplorer`

3. **Create Provisioning Profile**
   - Go to Apple Developer Portal (developer.apple.com)
   - Certificates, IDs & Profiles → Identifiers
   - Register new App ID with bundle `com.techbridge.verbexplorer`
   - Create Provisioning Profile for App Store
   - Download and install in Xcode

### Step 2: Update Version & Build Number

In Xcode:
- General tab → Version: `1.0.0`
- General tab → Build: `1`

### Step 3: Create App Store Connect Entry

1. Go to App Store Connect (appstoreconnect.apple.com)
2. **My Apps** → **+** → **New App**
3. Fill in:
   - Name: `Verb Explorer`
   - Bundle ID: `com.techbridge.verbexplorer`
   - SKU: `VERB_EXPLORER_001`
   - User Access: Single User

### Step 4: Fill App Metadata

In App Store Connect:
- **Description**: "Interactive toolkit for Class 4 students to discover and research verbs. Students choose a verb, research its meaning, origin, and usage, then create a colourful profile card and practice presenting."
- **Keywords**: `verb, learning, education, class 4, toolkit, interactive`
- **Category**: Education
- **Content Rating**: None (this is an educational app with no external content)
- **Privacy Policy URL**: (link to TUC privacy policy or create one)

### Step 5: Add Screenshots

Required: 6.7-inch display (iPhone 15 Pro Max) screenshots showing:
1. Step 1: Verb selection screen
2. Step 2: Research input screen
3. Step 3: Manila card profile
4. Step 4: Presentation timer
5. Completed card (print view)
6. Feature highlight

### Step 6: Build & Archive

In Xcode:
1. Select "Verb Explorer" → Generic iOS Device (or latest iPhone)
2. Product → Archive
3. Distribute App
4. App Store Connect
5. Upload

---

## 🤖 Android Deployment (Google Play Store)

### Step 1: Create Keystore & Signing Key

```bash
# Generate keystore file (one-time)
keytool -genkey -v -keystore verb-explorer.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias verb-explorer-key

# Save password and keystore file in secure location
# NEVER commit keystore to git
```

### Step 2: Configure Signing in Gradle

Edit `android/app/build.gradle`:

```gradle
android {
  signingConfigs {
    release {
      storeFile file('../verb-explorer.keystore')
      storePassword 'YOUR_KEYSTORE_PASSWORD'
      keyAlias 'verb-explorer-key'
      keyPassword 'YOUR_KEY_PASSWORD'
    }
  }
  
  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled true
      proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
  }
}
```

### Step 3: Build Release APK/AAB

```bash
cd android
./gradlew bundleRelease
cd ..
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### Step 4: Set Up Google Play Developer Account

1. Go to Google Play Console (play.google.com/console)
2. Create new app
3. Fill in:
   - App name: `Verb Explorer`
   - Default language: English
   - App category: Education
   - Content rating: Everyone (or rate via questionnaire)

### Step 5: Add App Metadata

In Google Play Console → App settings:
- **Short description** (50 chars): "Interactive verb discovery toolkit for Class 4"
- **Full description**: (same as iOS)
- **Promotional graphics**: 1024×500px header image
- **Icon**: 512×512px PNG (use `public/app-icon.svg` converted to PNG)
- **Screenshots**: 1080×1920px minimum (5-8 images)
- **Featured graphic**: 1200×500px

### Step 6: Upload & Submit

1. Release → Production
2. Upload `app-release.aab`
3. Fill in release notes: "First release: Verb discovery project toolkit for educational use"
4. Review content rating
5. Submit for review

---

## 📱 Testing Before Submission

### iOS TestFlight (Beta Testing)
```bash
npm run cap:sync
npm run cap:ios
# In Xcode: Product → Archive → Distribute → TestFlight
```

### Android Internal Testing
1. In Google Play Console → Testing → Internal testing
2. Create track and upload AAB
3. Add testers by email
4. Testers download from Play Store (internal testing link)

---

## 🔒 Security Checklist

- [ ] API keys (if added) stored in environment variables (`.env.local`)
- [ ] `.env` files added to `.gitignore`
- [ ] No credentials committed to git
- [ ] Keystore file NOT in git repository
- [ ] HTTPS enabled for any API calls
- [ ] Data privacy policy created and linked
- [ ] Content Rating Questionnaire completed

---

## 📊 Post-Submission Monitoring

Once live on App Stores:
1. Monitor crash reports in App Store Connect / Google Play Console
2. Read user reviews and respond to feedback
3. Track downloads and user retention
4. Plan version updates for bugs or new features

### Update Process
```bash
# Increment version in capacitor.config.ts
# Update iOS version/build in Xcode
# Update Android versionCode in build.gradle
npm run build
npm run cap:sync
# Follow same submission steps with updated version
```

---

## ⚠️ Important Notes

1. **Review Time**: App Store takes 24-48 hours; Google Play takes 2-4 hours
2. **Rejections**: Apps may be rejected for:
   - Broken links or content
   - Insufficient descriptions
   - Inappropriate for target age group
   - Technical issues (crashes)
3. **Sustainability**: Plan for annual Apple Developer fee renewal
4. **Localization**: Consider adding support for local Ghanaian languages

---

## 📞 Support & Troubleshooting

**Common Issues:**

| Issue | Solution |
|-------|----------|
| Build fails in Xcode | `npm run cap:sync` and rebuild |
| App Store rejection | Check rejection email for specific issue; common: privacy policy missing |
| Play Store upload fails | Verify keystore password and signing config in Gradle |
| App crashes on launch | Check device logs in Xcode debugger or ADB |

**Contact:**
- Daniel Twum — daniel.twum@techbridge.edu.gh
- TUC ICT Department — ict@techbridge.edu.gh

---

*Prepared by: Techbridge ICT Department*  
*For: Class 4 Verb Explorer Toolkit v1.0.0*

```

### FILE: index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Verb Explorer" />
    <meta name="theme-color" content="#a8edea" />
    <meta name="description" content="Interactive toolkit for Class 4 students to discover and research verbs" />
    <meta name="author" content="Techbridge Education Services Ghana" />

    <!-- iOS App Icons -->
    <link rel="apple-touch-icon" href="/app-icon.svg" />

    <!-- App Manifest for PWA -->
    <link rel="manifest" href="/manifest.webmanifest" />

    <title>Verb Explorer Toolkit</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>


```

### FILE: metadata.json
```json
{
  "name": "Verb Explorer Toolkit",
  "description": "Interactive toolkit for Class 4 verb discovery project",
  "version": "1.0.0",
  "appId": "com.techbridge.verbexplorer",
  "publisher": "Techbridge Education Services Ghana",
  "contact": {
    "email": "daniel.twum@techbridge.edu.gh",
    "website": "https://www.techbridge.edu.gh"
  },
  "requestFramePermissions": [],
  "majorCapabilities": [
    "User input (text research)",
    "Local storage (student progress)",
    "Print functionality"
  ],
  "permissions": {
    "ios": [],
    "android": []
  },
  "minimumOSVersions": {
    "ios": "13.0",
    "android": "8.0"
  },
  "screenshots": {
    "ios": "Screenshots for iPhone 6.7-inch (Pro Max) minimum",
    "android": "Screenshots for 6.7-inch minimum"
  }
}

```

### FILE: nginx.conf
```conf
server {
    listen 3000;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Basic security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Frame-Options "SAMEORIGIN";

    # Route all requests to index.html for Single Page Application
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets to improve performance
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}

```

### FILE: package.json
```json
{
  "name": "verb-explorer-toolkit",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "description": "Interactive toolkit for Class 4 students to discover and research verbs",
  "author": "Techbridge Education Services Ghana",
  "license": "PROPRIETARY",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit",
    "cap:sync": "npm run build && npx cap sync",
    "cap:ios": "npm run cap:sync && npx cap open ios",
    "cap:android": "npm run cap:sync && npx cap open android",
    "docker:build": "docker build -t verb-explorer .",
    "docker:run": "docker run -p 3000:3000 verb-explorer"
  },
  "dependencies": {
    "@capacitor/core": "^8.3.2",
    "@google/genai": "^1.29.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^6.2.3"
  },
  "devDependencies": {
    "@capacitor/android": "^8.3.2",
    "@capacitor/cli": "^8.3.2",
    "@capacitor/ios": "^8.3.2",
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.3"
  }
}

```

### FILE: PRE_LAUNCH_CHECKLIST.md
```md
# Verb Explorer Toolkit — Pre-Launch Checklist

**Target Launch Date:** Q3 2026  
**Version:** 1.0.0  
**Platforms:** iOS (App Store) + Android (Google Play Store)

---

## ✅ Phase 1: Development (COMPLETE)

- [x] React + TypeScript app built
- [x] Capacitor configured for iOS/Android
- [x] All 4 steps functional (Choose → Research → Create Card → Present)
- [x] Print functionality working
- [x] Timer feature implemented
- [x] Responsive design (mobile-first)
- [x] Local storage working
- [x] No external API calls (except optional future Gemini integration)

---

## 📋 Phase 2: Metadata & Assets (IN PROGRESS)

### App Branding
- [x] App name finalized: "Verb Explorer"
- [x] Bundle ID created: `com.techbridge.verbexplorer`
- [x] Version set: `1.0.0`
- [x] App icon created: `public/app-icon.svg`
- [ ] High-resolution app icon (1024×1024 PNG for stores)
- [ ] App description written (50 chars short + full description)
- [ ] Keywords identified for App Store/Play Store

### Screenshots & Marketing
- [ ] iPhone 6.7" screenshot 1 — Verb selection screen
- [ ] iPhone 6.7" screenshot 2 — Research input screen
- [ ] iPhone 6.7" screenshot 3 — Manila card profile
- [ ] iPhone 6.7" screenshot 4 — Presentation timer
- [ ] iPhone 6.7" screenshot 5 — Completed card print
- [ ] Android 6.7" versions (same content, different aspect ratio)
- [ ] Feature highlight graphic (1200×500 for Play Store)
- [ ] Promotional banner (1024×500 for App Store)

### Documentation
- [x] Privacy Policy created (`PRIVACY_POLICY.md`)
- [x] Deployment Guide created (`DEPLOYMENT_GUIDE.md`)
- [x] Web App Manifest created (`public/manifest.webmanifest`)
- [ ] Terms of Service (if needed)
- [ ] Support email established (privacy@techbridge.edu.gh)

---

## 🧪 Phase 3: Testing (PENDING)

### Functionality Testing
- [ ] All 4 steps tested on iOS device (iPhone 12 minimum)
- [ ] All 4 steps tested on Android device (Android 8.0 minimum)
- [ ] Text input validation (no crashes on long text)
- [ ] Print functionality tested (Safari print dialog)
- [ ] Timer accuracy verified (countdown is correct)
- [ ] Data persistence verified (data survives app restart)
- [ ] Data deletion verified (uninstall deletes all data)
- [ ] Offline functionality verified (no internet required)

### UI/UX Testing
- [ ] Responsive layout on small screens (iPhone SE)
- [ ] Responsive layout on large screens (iPad)
- [ ] Touch targets are 44×44 minimum (iOS) / 48×48 (Android)
- [ ] Text is readable (minimum 16sp font size)
- [ ] Color contrast passes WCAG AA standard
- [ ] Keyboard navigation works (iOS/Android accessibility)
- [ ] Screen reader compatibility (VoiceOver / TalkBack)

### Performance Testing
- [ ] App launch time < 2 seconds
- [ ] Memory usage stable (no leaks detected)
- [ ] Battery consumption acceptable
- [ ] Storage requirement < 50MB
- [ ] Works on 2G/3G connectivity (app is local-only, so no internet needed)

### Security Testing
- [ ] No hardcoded credentials in app
- [ ] No sensitive data in debug logs
- [ ] HTTPS used for any future API calls
- [ ] App permissions requested appropriately
- [ ] Keystore file (.keystore) NOT in git repository
- [ ] Environment variables used for secrets

---

## 📱 Phase 4: Platform Preparation

### iOS (App Store)
- [ ] Xcode project set up and builds successfully
- [ ] Provisioning profile created in Apple Developer account
- [ ] App ID registered: `com.techbridge.verbexplorer`
- [ ] Test on TestFlight (beta testing)
- [ ] Screenshots uploaded (6.7-inch minimum)
- [ ] Privacy policy URL provided
- [ ] App Review Information filled in
- [ ] Contact email: daniel.twum@techbridge.edu.gh

### Android (Google Play Store)
- [ ] Android Studio project set up and builds successfully
- [ ] Keystore file generated (stored securely, NOT in git)
- [ ] Release APK/AAB signed correctly
- [ ] App ID registered: `com.techbridge.verbexplorer`
- [ ] Screenshots uploaded (1080×1920 minimum)
- [ ] Privacy policy URL provided
- [ ] Content rating completed (ESRB / IARC)
- [ ] Contact email: daniel.twum@techbridge.edu.gh

---

## 🎯 Phase 5: Pre-Submission Review

### Code Quality
- [ ] No TypeScript errors (`npm run lint`)
- [ ] No console errors or warnings
- [ ] No unused variables or imports
- [ ] Code follows project standards
- [ ] Comments are clear and concise

### Documentation
- [ ] README.md updated with current info
- [ ] DEPLOYMENT_GUIDE.md reviewed and tested
- [ ] PRIVACY_POLICY.md matches app behavior
- [ ] Inline code comments added for complex logic

### Legal
- [ ] Privacy Policy reviewed by legal (if required)
- [ ] Terms of Service reviewed (if required)
- [ ] COPPA compliance verified (kids app)
- [ ] GDPR compliance verified (if targeting EU)

---

## 🚀 Phase 6: Submission (NOT YET)

### Pre-Submission (24 hours before)
- [ ] Final build created (`npm run build`)
- [ ] Final sync to native projects (`npm run cap:sync`)
- [ ] Final test on physical devices
- [ ] Screenshots double-checked
- [ ] Description and metadata proofread

### iOS Submission
- [ ] Archive created in Xcode
- [ ] Uploaded to App Store Connect
- [ ] Metadata verified in App Store Connect
- [ ] Submission initiated
- [ ] Review status monitored (24-48 hours)
- [ ] Respond to any rejection feedback immediately

### Android Submission
- [ ] APK/AAB uploaded to Google Play Console
- [ ] Store listing completed
- [ ] Metadata verified in Play Console
- [ ] Submission to Production track
- [ ] Review status monitored (2-4 hours)
- [ ] Respond to any rejection feedback immediately

---

## 📊 Phase 7: Post-Launch (AFTER APPROVAL)

### Monitoring
- [ ] Monitor crash reports daily (first week)
- [ ] Monitor crash reports weekly (after first week)
- [ ] Read and respond to user reviews
- [ ] Track download numbers
- [ ] Track user retention metrics
- [ ] Gather feedback from teachers/parents

### Updates
- [ ] Plan v1.0.1 bug fixes (if any issues found)
- [ ] Plan v1.1.0 features (AI verb discovery, etc.)
- [ ] Establish update schedule (quarterly minimum)

### Marketing
- [ ] Announce launch on TUC website
- [ ] Share with Class 4 teachers
- [ ] Create promotional materials
- [ ] Gather testimonials from early users

---

## 🔗 Key Resources

| Document | Status | Link |
|----------|--------|------|
| Privacy Policy | ✅ Complete | `PRIVACY_POLICY.md` |
| Deployment Guide | ✅ Complete | `DEPLOYMENT_GUIDE.md` |
| App Manifest | ✅ Complete | `public/manifest.webmanifest` |
| .gitignore | ✅ Complete | `.gitignore` |
| Capacitor Config | ✅ Complete | `capacitor.config.ts` |

---

## 👥 Responsible Parties

| Task | Owner | Email |
|------|-------|-------|
| Overall Project | Daniel Twum | daniel.twum@techbridge.edu.gh |
| iOS Deployment | Daniel Twum | daniel.twum@techbridge.edu.gh |
| Android Deployment | Daniel Twum | daniel.twum@techbridge.edu.gh |
| Privacy/Legal | TUC Legal | ict@techbridge.edu.gh |
| Marketing | TUC Marketing | marketing@techbridge.edu.gh |

---

## 📅 Timeline

| Phase | Target Date | Status |
|-------|-------------|--------|
| Development | 2026-05-08 | ✅ Complete |
| Testing | 2026-05-15 | ⏳ Pending |
| Screenshots | 2026-05-20 | ⏳ Pending |
| Beta (TestFlight/Internal) | 2026-05-25 | ⏳ Pending |
| Final Review | 2026-06-01 | ⏳ Pending |
| **App Store Submission** | **2026-06-05** | ⏳ Pending |
| **Play Store Submission** | **2026-06-05** | ⏳ Pending |
| **Live on Stores** | **2026-06-15** | ⏳ Pending |

---

## ⚠️ Known Limitations (v1.0.0)

- No cloud sync (all data local to device)
- No user accounts or login
- No multiplayer/sharing features
- No AI verb discovery (planned for v1.1)
- No offline lesson content (app itself is offline, just no built-in lessons)
- Print feature requires local printer

---

## 🎓 Notes for Teachers

When this app launches:
1. Distribute via App Store (iOS) or Play Store (Android)
2. Students install and work independently
3. Each student's data is private to their device
4. Print the Manila card profile for classroom display
5. No internet required — works fully offline
6. One-time install, no recurring fees

---

*Last Updated: 2026-05-08*  
*Prepared by: Techbridge ICT Department*

```

### FILE: PRIVACY_POLICY.md
```md
# Privacy Policy — Verb Explorer Toolkit

**Last Updated:** 2026-05-08  
**Effective Date:** 2026-05-08

Techbridge Education Services Ghana ("we" or "us" or "our") operates the Verb Explorer Toolkit mobile application (the "App").

---

## 1. Introduction

This Privacy Policy explains our practices regarding the collection, use, and protection of your information when you use our App. We are committed to protecting your privacy and ensuring you have a positive experience on our App.

---

## 2. Information We Collect

### 2.1 Information You Provide
- **Student Name & Class:** Used only to personalize the Manila card profile (stored locally on device)
- **Research Text:** Student research on verb definitions, origins, and usage (stored locally on device)
- **Card Preferences:** Colour selections for the profile card (stored locally on device)

### 2.2 Automatically Collected Information
- **Device Information:** Device model, OS version (for app compatibility)
- **Crash Reports:** Error logs (if enabled) to improve app stability
- **Analytics:** Basic usage statistics (views, steps completed) — no personal identification

### 2.3 What We Do NOT Collect
- Location data
- Camera or microphone access
- Contacts or personal files
- Biometric data
- Financial information

---

## 3. How We Use Your Information

Your data is used to:
1. **Enable core functionality** — saving your research and preferences
2. **Improve the app** — understanding which features are used most
3. **Fix bugs** — analyzing crash reports to resolve technical issues
4. **Comply with law** — if legally required to disclose information

---

## 4. Data Storage & Security

- **Local Storage Only:** All student data is stored only on your device. We do NOT transmit personal data to our servers.
- **No Cloud Sync:** Your research and card preferences are never uploaded or synchronized.
- **Encryption:** Device storage uses the operating system's built-in encryption.
- **No Backup:** Data persists only while the app is installed. Uninstalling the app removes all data.

---

## 5. Third-Party Services

### Google Gemini AI (Optional)
If you enable AI-powered verb suggestions (future version):
- API calls to Google Gemini are anonymized
- Verb suggestions do NOT include personal student data
- Google processes requests per their privacy policy (policies.google.com)

### Analytics (Future)
We may integrate anonymous analytics to track:
- Number of app downloads
- Steps completed per user
- Feature usage trends
- Crash statistics

No personally identifiable information is collected by analytics services.

---

## 6. Children's Privacy (COPPA Compliance)

The Verb Explorer Toolkit is designed for children ages 8–10 (Class 4).

**Important for Parents/Guardians:**
- The app collects only the child's first name for personalization
- No registration or account creation required
- No communication features or social sharing built-in
- No third-party advertising or tracking (currently)
- Data is stored locally; not shared with any servers

**Parent Controls:**
- Install the app only from official App Store / Play Store
- Monitor data usage (the app uses minimal data — research is local only)
- Uninstall the app to delete all stored data

---

## 7. Data Retention

- **While App is Installed:** All data persists on your device
- **After Uninstall:** All data is permanently deleted from your device
- **Deleted Files:** Cannot be recovered after uninstall
- **Backups:** If you have device backups enabled (iCloud, Google Drive), app data may be included — manage backup settings separately

---

## 8. Your Privacy Rights

You have the right to:
- **Access:** View all data the app stores about you (stored locally on your device)
- **Delete:** Uninstall the app to delete all data permanently
- **Opt-Out:** Disable optional analytics or crash reporting in app settings (when added)

---

## 9. Contact Us

If you have questions about this Privacy Policy or our privacy practices:

**Techbridge Education Services Ghana**
- Email: privacy@techbridge.edu.gh
- Phone: +233-XXX-XXX-XXXX
- Website: www.techbridge.edu.gh
- Address: Oyibi, Greater Accra, Ghana

---

## 10. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. Changes will be reflected with an updated "Last Updated" date at the top of this document. Continued use of the app after changes constitutes acceptance of the updated policy.

---

## 11. Compliance

**COPPA (Children's Online Privacy Protection Act):** Verb Explorer complies with COPPA requirements for apps targeted at children under 13.

**GDPR (General Data Protection Regulation):** For users in the EU, this app complies with GDPR principles of data minimization and storage limitation.

**Ghana Data Protection Act:** Compliant with Ghana's data protection laws and regulations.

---

*Prepared by: Techbridge ICT Department*  
*App Version: 1.0.0*

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/53630543-ccc5-4fde-859f-6636bcc3f493

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/App.tsx
```typescript
import { useState, useEffect } from 'react';
import {
  Dices, BookOpen, Globe, PenTool, Lightbulb,
  Printer, ListChecks, ArrowLeft, ArrowRight, HelpCircle, Zap
} from 'lucide-react';
import { UserGuide } from './components/UserGuide';
import { OnboardingCarousel } from './components/OnboardingCarousel';
import { DemoMode } from './components/DemoMode';
import { ClassLevelSelector } from './components/ClassLevelSelector';
import { type ClassLevel } from './utils/hintsByLevel';

export default function App() {
  const [step, setStep] = useState(1);
  const [verb, setVerb] = useState('');
  const [studentName, setStudentName] = useState('');
  const [research, setResearch] = useState({
    definition: '',
    origin: '',
    sentences: '',
    interesting: ''
  });
  const [cardColor, setCardColor] = useState('bg-yellow-100');
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('verb-explorer-onboarded');
    }
    return true;
  });
  const [classLevel, setClassLevel] = useState<ClassLevel>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('verb-explorer-class-level');
      return (saved as ClassLevel) || 'class-4-6';
    }
    return 'class-4-6';
  });
  const [showClassLevelSelector, setShowClassLevelSelector] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('verb-explorer-class-level');
    }
    return false;
  });
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showHints, setShowHints] = useState(true);

  const handleSelectClassLevel = (level: ClassLevel) => {
    localStorage.setItem('verb-explorer-class-level', level);
    setClassLevel(level);
    setShowClassLevelSelector(false);
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem('verb-explorer-onboarded', 'true');
    setShowOnboarding(false);
  };

  const handleStartDemo = () => {
    setShowOnboarding(false);
    handleCompleteOnboarding();
    setIsDemoMode(true);
    setVerb('Discover');
    setStudentName('Demo - Class 4');
    setResearch({
      definition: 'To find or learn about something for the first time',
      origin: 'From Latin "discooperire" meaning to uncover',
      sentences: '1. I will discover new things every day. 2. Scientists discover new species in the rainforest.',
      interesting: 'Synonyms: Find, uncover, reveal. The word has been used since the 1300s!'
    });
    setStep(1);
    setShowHints(true);
  };

  const handleExitDemo = () => {
    setIsDemoMode(false);
    setStep(1);
    setVerb('');
    setStudentName('');
    setResearch({ definition: '', origin: '', sentences: '', interesting: '' });
    setShowHints(false);
  };

  const verbCategories = {
    action: ['Run', 'Dance', 'Explore', 'Discover', 'Create', 'Jump', 'Swim'],
    everyday: ['Help', 'Learn', 'Grow', 'Change', 'Play', 'Eat', 'Sleep'],
    interesting: ['Soar', 'Sparkle', 'Whisper', 'Triumph', 'Buzzle', 'Glimmer']
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const pickRandomVerb = () => {
    const allVerbs = [...verbCategories.action, ...verbCategories.everyday, ...verbCategories.interesting];
    const random = allVerbs[Math.floor(Math.random() * allVerbs.length)];
    setVerb(random);
  };

  const toggleTimer = () => setIsTimerActive(!isTimerActive);
  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeLeft(180);
  };

  useEffect(() => {
    let interval: number | null = null;
    if (isTimerActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderDigitalCard = () => (
    <div className={`manila-card ${cardColor} p-8 rounded-xl max-w-3xl mx-auto shadow-2xl relative overflow-hidden border-2 border-gray-300`}>
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start border-b-2 border-gray-400 pb-4 mb-6">
          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Verb Profile By:</h4>
            <p className="text-xl font-bold font-serif">{studentName || '_____________________'}</p>
          </div>
          <div className="text-right">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md transform rotate-3 inline-block">TOP SECRET DISCOVERY</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-7xl font-extrabold uppercase comic-font tracking-widest text-gray-800 drop-shadow-md">
            {verb || '????'}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 p-4 rounded-2xl shadow border-2 border-blue-200 transform -rotate-1 hover:rotate-0 transition-transform">
            <h3 className="font-bold text-blue-600 border-b-2 border-blue-100 pb-1 mb-2">📖 Meaning</h3>
            <p className="font-medium text-gray-700 whitespace-pre-line">{research.definition || 'No definition written yet.'}</p>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl shadow border-2 border-green-200 transform rotate-1 hover:rotate-0 transition-transform">
            <h3 className="font-bold text-green-600 border-b-2 border-green-100 pb-1 mb-2">🌍 Origin</h3>
            <p className="font-medium text-gray-700 whitespace-pre-line">{research.origin || 'No origin written yet.'}</p>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl shadow border-2 border-purple-200 md:col-span-2 transform -rotate-1 hover:rotate-0 transition-transform">
            <h3 className="font-bold text-purple-600 border-b-2 border-purple-100 pb-1 mb-2">💡 Interesting Facts</h3>
            <p className="font-medium text-gray-700 whitespace-pre-line">{research.interesting || 'No interesting facts written yet.'}</p>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl shadow border-2 border-orange-200 md:col-span-2 transform rotate-1 hover:rotate-0 transition-transform">
            <h3 className="font-bold text-orange-600 border-b-2 border-orange-100 pb-1 mb-2">📝 Example Sentences</h3>
            <p className="font-medium text-gray-700 whitespace-pre-line">{research.sentences || 'No sentences written yet.'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10 print:hidden relative">
        {isDemoMode && (
          <div className="absolute top-0 left-0 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
            <Zap className="w-4 h-4" /> DEMO MODE
          </div>
        )}
        <div className="absolute top-0 right-0 flex gap-2">
          <button
            type="button"
            onClick={() => setShowClassLevelSelector(true)}
            className="px-3 py-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600 transition-colors text-xs font-bold"
            title="Change class level"
          >
            📚 {classLevel === 'class-1-3' ? 'Class 1-3' : classLevel === 'class-4-6' ? 'Class 4-6' : 'JHS'}
          </button>
          {!isDemoMode && (
            <button
              type="button"
              onClick={handleStartDemo}
              className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
              title="Try demo mode"
            >
              <Zap className="w-6 h-6" />
            </button>
          )}
          {isDemoMode && (
            <button
              type="button"
              onClick={handleExitDemo}
              className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600transition-colors text-xs font-bold"
              title="Exit demo mode"
            >
              ✕ Exit
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowGuide(true)}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
            title="Help & Instructions"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="inline-block bg-white px-8 py-4 rounded-3xl card-shadow border-b-4 border-primary mb-4 transform -rotate-1">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 comic-font">
            <span className="text-primary">Verb</span> Discovery <span className="text-secondary">Project</span>
          </h1>
        </div>
        <p className="text-xl text-gray-700 font-semibold mt-2">Class 4 Digital Toolkit 🛠️</p>
      </div>

      {/* Progress Tracker */}
      <div className="max-w-3xl mx-auto mb-10 print:hidden">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full z-0"></div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-2 bg-primary rounded-full z-0 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          
          {[1, 2, 3, 4].map(num => (
            <button 
              key={num} 
              onClick={() => setStep(num)}
              className={`relative z-10 w-12 h-12 rounded-full font-bold text-lg flex items-center justify-center transition-all duration-300 border-4 ${
                step === num ? 'bg-primary text-white border-white scale-125 shadow-lg' : 
                step > num ? 'bg-primary text-white border-primary' : 
                'bg-white text-gray-400 border-gray-200 hover:border-primary'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-xs md:text-sm font-bold text-gray-500 px-2">
          <span className={step >= 1 ? 'text-primary' : ''}>Choose</span>
          <span className={step >= 2 ? 'text-primary' : ''}>Research</span>
          <span className={step >= 3 ? 'text-primary' : ''}>Create Profile</span>
          <span className={step >= 4 ? 'text-primary' : ''}>Present</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-10 card-shadow border border-white print:hidden">
        
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-primary mb-4">Step 1️⃣: Choose Your Verb!</h2>
            <p className="text-center text-lg">Pick a verb that interests you. The more you like it, the funner it will be!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                <h3 className="font-bold text-blue-700 mb-2">🏃🏽‍♂️ Action Verbs</h3>
                <div className="flex flex-wrap gap-2">
                  {verbCategories.action.map(v => (
                    <button key={v} onClick={() => setVerb(v)} className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${verb === v ? 'bg-blue-500 text-white' : 'bg-white text-blue-600 hover:bg-blue-100 border border-blue-300'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                <h3 className="font-bold text-green-700 mb-2">🌱 Everyday Verbs</h3>
                <div className="flex flex-wrap gap-2">
                  {verbCategories.everyday.map(v => (
                    <button key={v} onClick={() => setVerb(v)} className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${verb === v ? 'bg-green-500 text-white' : 'bg-white text-green-600 hover:bg-green-100 border border-green-300'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                <h3 className="font-bold text-purple-700 mb-2">✨ Interesting Verbs</h3>
                <div className="flex flex-wrap gap-2">
                  {verbCategories.interesting.map(v => (
                    <button key={v} onClick={() => setVerb(v)} className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${verb === v ? 'bg-purple-500 text-white' : 'bg-white text-purple-600 hover:bg-purple-100 border border-purple-300'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center mt-6 p-6 bg-white rounded-2xl shadow-inner border-2 border-dashed border-gray-300">
              <p className="mb-3 font-semibold text-gray-600">Or type your own / Pick a random one!</p>
              <div className="flex gap-2 w-full max-w-md">
                <input 
                  type="text" 
                  value={verb} 
                  onChange={(e) => setVerb(e.target.value)} 
                  placeholder="Type a verb here..." 
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-xl text-center font-bold"
                />
                <button onClick={pickRandomVerb} className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-xl font-bold bouncy flex-shrink-0">
                  <Dices className="text-xl w-6 h-6" />
                </button>
              </div>
            </div>

            {verb && (
              <div className="text-center mt-6 animate-bounce">
                <p className="text-lg">You selected:</p>
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary comic-font uppercase tracking-wider my-2">
                  {verb}
                </h1>
                <p className="text-green-600 font-bold">Great choice! Let's go research it.</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-secondary mb-2">Step 2️⃣: Research Station 🔍</h2>
            <p className="text-center text-gray-600 mb-6">Use a dictionary or ask a teacher to find out more about <b>"{verb || 'your verb'}"</b>.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl card-shadow border-t-4 border-blue-400">
                <label className="flex items-center font-bold text-blue-700 mb-2">
                  <BookOpen className="w-5 h-5 mr-2" /> What does it mean?
                </label>
                <p className="text-xs text-gray-500 mb-2">Write the definition in your own words.</p>
                <textarea 
                  value={research.definition}
                  onChange={(e) => setResearch({...research, definition: e.target.value})}
                  className="w-full h-24 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none resize-none"
                  placeholder="It means to..."
                />
              </div>

              <div className="bg-white p-5 rounded-2xl card-shadow border-t-4 border-green-400">
                <label className="flex items-center font-bold text-green-700 mb-2">
                  <Globe className="w-5 h-5 mr-2" /> Where did it come from?
                </label>
                <p className="text-xs text-gray-500 mb-2">History or origin (e.g., from Latin or Old English).</p>
                <textarea 
                  value={research.origin}
                  onChange={(e) => setResearch({...research, origin: e.target.value})}
                  className="w-full h-24 p-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none resize-none"
                  placeholder="It originally came from..."
                />
              </div>

              <div className="bg-white p-5 rounded-2xl card-shadow border-t-4 border-orange-400 md:col-span-2">
                <label className="flex items-center font-bold text-orange-700 mb-2">
                  <PenTool className="w-5 h-5 mr-2" /> How is it used?
                </label>
                <p className="text-xs text-gray-500 mb-2">Write 2 excellent sentences using your verb.</p>
                <textarea 
                  value={research.sentences}
                  onChange={(e) => setResearch({...research, sentences: e.target.value})}
                  className="w-full h-24 p-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none resize-none"
                  placeholder="1. &#10;2. "
                />
              </div>

              <div className="bg-white p-5 rounded-2xl card-shadow border-t-4 border-purple-400 md:col-span-2">
                <label className="flex items-center font-bold text-purple-700 mb-2">
                  <Lightbulb className="w-5 h-5 mr-2" /> What's interesting about it?
                </label>
                <p className="text-xs text-gray-500 mb-2">Multiple meanings? Synonyms? Fun facts?</p>
                <textarea 
                  value={research.interesting}
                  onChange={(e) => setResearch({...research, interesting: e.target.value})}
                  className="w-full h-24 p-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none resize-none"
                  placeholder="An interesting fact is..."
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="print:hidden">
              <h2 className="text-2xl font-bold text-center text-orange-600 mb-2">Step 3️⃣: Create Your Verb Profile 🎨</h2>
              <p className="text-center text-gray-600 mb-4">Design your Manila card! Fill in your name and pick a card colour.</p>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
                <input 
                  type="text" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Your Name & Class (e.g. Ama - Class 4)" 
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg w-full max-w-xs focus:outline-none focus:border-orange-400"
                />
                <div className="flex gap-2">
                  <button onClick={() => setCardColor('bg-yellow-100')} className="w-8 h-8 rounded-full bg-yellow-100 border-2 border-gray-400 hover:scale-110 transition-transform cursor-pointer"></button>
                  <button onClick={() => setCardColor('bg-blue-100')} className="w-8 h-8 rounded-full bg-blue-100 border-2 border-gray-400 hover:scale-110 transition-transform cursor-pointer"></button>
                  <button onClick={() => setCardColor('bg-pink-100')} className="w-8 h-8 rounded-full bg-pink-100 border-2 border-gray-400 hover:scale-110 transition-transform cursor-pointer"></button>
                  <button onClick={() => setCardColor('bg-green-100')} className="w-8 h-8 rounded-full bg-green-100 border-2 border-gray-400 hover:scale-110 transition-transform cursor-pointer"></button>
                </div>
                <button onClick={() => window.print()} className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-black bouncy cursor-pointer">
                  <Printer className="w-5 h-5 mr-2" /> Print Card
                </button>
              </div>
            </div>

            {renderDigitalCard()}
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in print:hidden">
            <h2 className="text-2xl font-bold text-center text-primary mb-2">Step 4️⃣: Practice Your Presentation 🎤</h2>
            <p className="text-center text-gray-600 mb-6">You need to talk for 2-3 minutes. Use the timer below to practice!</p>
            
            <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
              <div className="flex-1 bg-white p-6 rounded-2xl card-shadow">
                <h3 className="flex items-center text-xl font-bold mb-4 text-gray-800">
                  <ListChecks className="text-green-500 w-6 h-6 mr-2" /> Checklist for Monday 11th May 2026
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3 w-5 h-5 accent-green-500 rounded cursor-pointer" />
                    <span className="text-lg">My Manila card profile is complete and colourful.</span>
                  </li>
                  <li className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3 w-5 h-5 accent-green-500 rounded cursor-pointer" />
                    <span className="text-lg">I can explain the meaning in my own words.</span>
                  </li>
                  <li className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3 w-5 h-5 accent-green-500 rounded cursor-pointer" />
                    <span className="text-lg">I have picked the <b>most interesting fact</b> to share with the class.</span>
                  </li>
                  <li className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3 w-5 h-5 accent-green-500 rounded cursor-pointer" />
                    <span className="text-lg">I have practiced speaking loudly and clearly.</span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                  <p className="font-bold text-yellow-800 text-center">🎯 Remember! Earning your 20 marks will be FUN! 💃🏾🕺🏾</p>
                </div>
              </div>

              <div className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-2xl card-shadow text-white flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-gray-300 mb-2">Practice Timer</h3>
                <p className="text-sm text-gray-400 mb-6">Aim for 2 to 3 minutes!</p>
                
                <div className={`text-7xl font-mono font-bold mb-8 ${timeLeft <= 60 ? 'text-red-400' : 'text-green-400'} comic-font`}>
                  {formatTime(timeLeft)}
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={toggleTimer} 
                    className={`px-6 py-3 rounded-xl font-bold text-lg w-32 ${isTimerActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} transition-colors cursor-pointer`}
                  >
                    {isTimerActive ? 'Pause' : 'Start'}
                  </button>
                  <button 
                    onClick={resetTimer} 
                    className="px-6 py-3 rounded-xl font-bold text-lg bg-red-500 hover:bg-red-600 transition-colors w-32 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-10 pt-6 border-t-2 border-gray-200/60 print:hidden">
          <button 
            onClick={handleBack} 
            disabled={step === 1}
            className={`px-6 py-3 rounded-xl font-bold text-lg flex items-center ${step === 1 ? 'opacity-0 cursor-default' : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300 bouncy cursor-pointer'}`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          
          {step < 4 ? (
            <button 
              onClick={handleNext} 
              disabled={step === 1 && !verb}
              className={`px-8 py-3 rounded-xl font-bold text-lg flex items-center transition-all ${step === 1 && !verb ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-indigo-700 bouncy shadow-lg cursor-pointer'}`}
            >
              Next Step <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <div className="text-right">
              <p className="font-bold text-gray-600 mb-1">📅 Due: Monday 11th May 2026</p>
              <p className="text-sm text-gray-500">Good luck!</p>
            </div>
          )}
        </div>
      </div>

      {/* Print Version Only Appears on Print */}
      <div className="hidden print:block">
        {step !== 3 && (
          <div className="text-center p-10">
            <h2>Please go to Step 3 to print your Verb Profile!</h2>
          </div>
        )}
        {step === 3 && renderDigitalCard()}
      </div>

      {/* Onboarding Carousel */}
      {showOnboarding && (
        <OnboardingCarousel
          onComplete={handleCompleteOnboarding}
          onStartDemo={handleStartDemo}
        />
      )}

      {/* Class Level Selector */}
      {showClassLevelSelector && (
        <ClassLevelSelector onSelect={handleSelectClassLevel} />
      )}

      {/* Demo Mode Hints */}
      {isDemoMode && (
        <DemoMode
          step={step}
          showHints={showHints}
          onToggleHints={() => setShowHints(!showHints)}
          onClose={handleExitDemo}
          classLevel={classLevel}
        />
      )}

      {/* User Guide Modal */}
      {showGuide && <UserGuide onClose={() => setShowGuide(false)} />}
    </div>
  );
}

```

### FILE: src/components/ClassLevelSelector.tsx
```typescript
import { BookOpen } from 'lucide-react';

interface ClassLevelSelectorProps {
  onSelect: (level: string) => void;
}

export function ClassLevelSelector({ onSelect }: ClassLevelSelectorProps) {
  const classLevels = [
    {
      id: 'class-1-3',
      label: 'Class 1-3',
      description: 'Ages 6-9 • Simple words • Fun activities',
      color: 'from-blue-400 to-blue-600',
      emoji: '🌟',
    },
    {
      id: 'class-4-6',
      label: 'Class 4-6',
      description: 'Ages 9-12 • Standard level • Full features',
      color: 'from-purple-400 to-purple-600',
      emoji: '⚡',
    },
    {
      id: 'class-7-9',
      label: 'JHS (Class 7-9)',
      description: 'Ages 12-15 • Advanced • Detailed explanations',
      color: 'from-pink-400 to-pink-600',
      emoji: '🎓',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-[400] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-3xl font-bold mb-2">What's Your Class Level?</h2>
          <p className="text-indigo-100">We'll customize the app to match your age group</p>
        </div>

        {/* Class Selector */}
        <div className="p-8 space-y-4">
          {classLevels.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => onSelect(level.id)}
              className={`w-full p-6 rounded-xl border-2 border-gray-200 hover:border-2 transition-all text-left hover:shadow-lg bg-gradient-to-r ${level.color} hover:opacity-95`}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{level.emoji}</div>
                <div>
                  <h3 className="text-xl font-bold text-white">{level.label}</h3>
                  <p className="text-white/90 text-sm">{level.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-xs text-gray-600">
          <p>💡 You can change this anytime in the Help menu</p>
        </div>
      </div>
    </div>
  );
}

```

### FILE: src/components/DemoMode.tsx
```typescript
import { X, ChevronRight, Lightbulb } from 'lucide-react';
import { getHintsByLevel, type ClassLevel } from '../utils/hintsByLevel';

interface DemoModeProps {
  step: number;
  showHints: boolean;
  onToggleHints: () => void;
  onClose: () => void;
  classLevel: ClassLevel;
}

export function DemoMode({ step, showHints, onToggleHints, onClose, classLevel }: DemoModeProps) {
  const hint = getHintsByLevel(step, classLevel);

  if (!showHints || !hint) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-fade-in">
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-400 rounded-lg shadow-lg p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <h3 className="font-bold text-amber-900">{hint.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="hover:bg-amber-200 rounded-full p-1 transition-colors flex-shrink-0"
            title="Close hints"
          >
            <X className="w-4 h-4 text-amber-700" />
          </button>
        </div>

        {/* Tips */}
        <div className="space-y-2 mb-3">
          {hint.tips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-amber-900">
              <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
              <span>{tip}</span>
            </div>
          ))}
        </div>

        {/* Main tip */}
        <div className="bg-white rounded p-3 mb-3 border border-amber-200">
          <p className="text-sm font-semibold text-amber-900">{hint.tip_title}</p>
        </div>

        {/* Toggle button */}
        <button
          type="button"
          onClick={onToggleHints}
          className="text-xs text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1"
        >
          ✕ Hide hints for this step
        </button>
      </div>
    </div>
  );
}

```

### FILE: src/components/OnboardingCarousel.tsx
```typescript
import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

interface OnboardingCarouselProps {
  onComplete: () => void;
  onStartDemo: () => void;
}

export function OnboardingCarousel({ onComplete, onStartDemo }: OnboardingCarouselProps) {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: '📖 Welcome to Verb Discovery',
      description: 'Learn English verbs by researching, creating, and presenting your own verb profiles!',
      icon: '🎯',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: '🔍 Step 1: Choose a Verb',
      description: 'Pick from our categories or enter your own verb. Use the dice 🎲 for a random choice!',
      icon: '✨',
      color: 'from-blue-500 to-purple-600',
    },
    {
      title: '📚 Step 2: Research',
      description: 'Find the definition, origin, example sentences, and interesting facts about your verb.',
      icon: '🔎',
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: '🎨 Step 3: Create Profile Card',
      description: 'Design a colourful Manila card with your verb. Print it to display or submit!',
      icon: '🖨️',
      color: 'from-pink-500 to-red-600',
    },
    {
      title: '🎤 Step 4: Practice & Present',
      description: 'Use the timer to practice speaking for 2-3 minutes. Then present to your class!',
      icon: '⏱️',
      color: 'from-red-500 to-orange-600',
    },
    {
      title: '✅ Ready to Begin?',
      description: 'Try the demo mode to explore all features, or start your own verb discovery journey!',
      icon: '🚀',
      color: 'from-orange-500 to-yellow-600',
    },
  ];

  const currentSlide = slides[slide];

  return (
    <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={onComplete}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Skip onboarding"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Gradient Header */}
        <div className={`bg-gradient-to-r ${currentSlide.color} text-white p-8 text-center min-h-48 flex flex-col items-center justify-center`}>
          <div className="text-6xl mb-4">{currentSlide.icon}</div>
          <h2 className="text-2xl font-bold">{currentSlide.title}</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-gray-700 text-center leading-relaxed">{currentSlide.description}</p>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === slide ? 'bg-gray-800 w-6' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {slide > 0 && (
              <button
                type="button"
                onClick={() => setSlide(slide - 1)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}

            {slide < slides.length - 1 ? (
              <button
                type="button"
                onClick={() => setSlide(slide + 1)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex-1 space-y-2">
                <button
                  type="button"
                  onClick={onStartDemo}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  🎮 Try Demo Mode
                </button>
                <button
                  type="button"
                  onClick={onComplete}
                  className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Start My Journey
                </button>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center">Slide {slide + 1} of {slides.length}</p>
        </div>
      </div>
    </div>
  );
}

```

### FILE: src/components/UserGuide.tsx
```typescript
import { useState } from 'react';
import { X, BookOpen, Users } from 'lucide-react';

interface UserGuideProps {
  onClose: () => void;
}

export function UserGuide({ onClose }: UserGuideProps) {
  const [tab, setTab] = useState<'student' | 'instructor'>('student');

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-2 md:p-4">
      <div className="bg-white rounded-xl md:rounded-2xl w-full max-w-4xl h-[95vh] md:h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 md:p-4 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg md:text-2xl font-bold">📖 User Guide</h2>
          <button type="button" onClick={onClose} className="hover:bg-white/20 rounded-full p-1 md:p-2 transition-colors" title="Close guide">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b flex-shrink-0">
          <button
            type="button"
            onClick={() => setTab('student')}
            className={`flex-1 px-3 md:px-6 py-2 md:py-3 font-semibold flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base transition-colors ${
              tab === 'student'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <BookOpen className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden md:inline">For Students</span><span className="md:hidden">Students</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('instructor')}
            className={`flex-1 px-3 md:px-6 py-2 md:py-3 font-semibold flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base transition-colors ${
              tab === 'instructor'
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden md:inline">For Instructors</span><span className="md:hidden">Teachers</span>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1 p-3 md:p-6 space-y-3 md:space-y-6 text-sm md:text-base">
          {tab === 'student' && (
            <div className="space-y-2 md:space-y-4">
              <div>
                <h3 className="font-bold text-blue-600 mb-1">🎯 Overview</h3>
                <p className="text-gray-700 text-xs md:text-sm leading-tight">
                  Discover, research, and create a profile for English verbs. Follow 4 steps to complete your project.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-blue-600 mb-1">📝 Step 1: Choose Verb</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Pick from Action, Everyday, or Interesting categories</li>
                  <li>• Type your own verb, or click dice 🎲 for a random one</li>
                  <li>• Choose a verb you find interesting!</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-blue-600 mb-1">🔍 Step 2: Research</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Write the definition in your own words</li>
                  <li>• Find the history or origin (e.g., from Latin)</li>
                  <li>• Write 2 sentences using your verb</li>
                  <li>• Share synonyms or interesting facts</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-blue-600 mb-1">🎨 Step 3: Create Card</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Enter your name and class</li>
                  <li>• Pick a card colour (yellow, blue, pink, green)</li>
                  <li>• Click Print to print your Manila card</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-blue-600 mb-1">🎤 Step 4: Present</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Practice for 2-3 minutes using the timer</li>
                  <li>• Explain meaning, origin, and interesting facts</li>
                  <li>• Speak loudly and clearly</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-2 md:p-3 rounded border-l-4 border-blue-500 text-xs md:text-sm">
                <p className="text-blue-900 font-semibold">💡 Tip: Your progress saves automatically!</p>
              </div>
            </div>
          )}

          {tab === 'instructor' && (
            <div className="space-y-2 md:space-y-4">
              <div>
                <h3 className="font-bold text-purple-600 mb-1">📚 Setup</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Install app from App Store or Play Store</li>
                  <li>• No internet required—fully offline</li>
                  <li>• Each student gets independent workspace</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-purple-600 mb-1">📅 Timeline</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Day 1: Choose verb & research (Steps 1-2)</li>
                  <li>• Day 2: Create cards (Step 3)</li>
                  <li>• Day 3: Practice (Step 4)</li>
                  <li>• Days 4-5: Live presentations</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-purple-600 mb-1">🖨️ Printing</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Step 3: Click "Print Card" button</li>
                  <li>• Use colour printer (best results)</li>
                  <li>• Print on A5 or half-page size</li>
                  <li>• Display on bulletin board</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-purple-600 mb-1">🎯 Assessment (20 Marks)</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Research (8) • Presentation (7) • Card (3) • Participation (2)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-purple-600 mb-1">💡 Success Tips</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Model the process with example</li>
                  <li>• Guide students to authoritative sources</li>
                  <li>• Practice presentations as a class</li>
                  <li>• Display all cards and celebrate effort</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-purple-600 mb-1">❓ Troubleshooting</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Data lost: Stored locally—uninstall deletes it</li>
                  <li>• Print issue: Check printer connection</li>
                  <li>• App stuck: Force close and reopen</li>
                  <li>• Help: daniel.twum@techbridge.edu.gh</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-2 md:p-3 rounded border-l-4 border-purple-500 text-xs md:text-sm">
                <p className="text-purple-900 font-semibold">✓ Checklist: Install • Explain • Resource • Deadline • Printer • Schedule</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

```

### FILE: src/index.css
```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Comic+Neue:wght@700&display=swap');
@import "tailwindcss";

@theme {
  --color-manila: #FDE68A;
  --color-primary: #4F46E5;
  --color-secondary: #EC4899;
}

body {
  font-family: 'Nunito', sans-serif;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  min-height: 100vh;
  margin: 0;
  padding: 0;
  color: #334155;
}

.comic-font {
  font-family: 'Comic Neue', cursive;
}

.card-shadow {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.bouncy {
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.bouncy:hover {
  transform: translateY(-5px);
}

@media print {
  body { background: white !important; }
  .manila-card {
      border: 2px solid #000 !important;
      box-shadow: none !important;
      break-inside: avoid;
  }
}

```

### FILE: src/main.tsx
```typescript
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

```

### FILE: src/utils/hintsByLevel.ts
```typescript
export type ClassLevel = 'class-1-3' | 'class-4-6' | 'class-7-9';

export interface StepHints {
  title: string;
  tips: string[];
  tip_title: string;
}

export const getHintsByLevel = (step: number, level: ClassLevel): StepHints => {
  const hints: Record<number, Record<ClassLevel, StepHints>> = {
    1: {
      'class-1-3': {
        title: '💡 Choose a Fun Verb!',
        tips: [
          'Click on any word you like!',
          'Or type a verb you know',
          'Click the dice 🎲 for a surprise',
        ],
        tip_title: 'Pick a word that\'s fun to say! Try "Jump" or "Dance"',
      },
      'class-4-6': {
        title: '💡 Demo Hint: Choose a Verb',
        tips: [
          'Click on any verb in the categories',
          'Type your own verb in the text box',
          'Click the dice 🎲 to pick a random verb',
        ],
        tip_title: 'Try choosing "Discover" to see how the app works!',
      },
      'class-7-9': {
        title: '💡 Verb Selection Strategy',
        tips: [
          'Browse thematic categories (Action, Everyday, Interesting)',
          'Enter any verb you want to research',
          'Use the randomizer for unexpected discoveries',
          'Consider choosing verbs with multiple meanings for deeper analysis',
        ],
        tip_title: 'Pro tip: Choose verbs with interesting etymology or multiple meanings for a richer project!',
      },
    },
    2: {
      'class-1-3': {
        title: '💡 Learn About Your Word',
        tips: [
          'What does it mean? Write it simply',
          'Where did it come from? Ask your teacher',
          'Write 2 sentences using your word',
          'Tell a fun fact about it',
        ],
        tip_title: 'Example: "Jump means to go up in the air and come back down!"',
      },
      'class-4-6': {
        title: '💡 Demo Hint: Research Your Verb',
        tips: [
          'Fill in the definition in your own words',
          'Find where the word comes from (origin)',
          'Write 2 sentences using the verb',
          'Share interesting facts or synonyms',
        ],
        tip_title: 'Example: "Discover" means to find something new!',
      },
      'class-7-9': {
        title: '💡 Research Deep Dive',
        tips: [
          'Provide a detailed definition with contextual usage',
          'Research the etymological origin and language evolution',
          'Create sentences demonstrating different word forms (tense, mood)',
          'Analyze synonyms, antonyms, and semantic nuances',
        ],
        tip_title: 'Challenge: Compare your verb to similar verbs and explain the subtle differences!',
      },
    },
    3: {
      'class-1-3': {
        title: '💡 Make Your Card',
        tips: [
          'Write your name and class',
          'Pick your favorite colour',
          'Click Print to see your card',
          'Show it to your teacher!',
        ],
        tip_title: 'Your card will look so cool when you print it!',
      },
      'class-4-6': {
        title: '💡 Demo Hint: Create Your Card',
        tips: [
          'Enter your name and class (e.g., "Demo - Class 4")',
          'Pick a card colour (yellow, blue, pink, or green)',
          'Click the Print button to see your card',
        ],
        tip_title: 'Your profile card displays all your research beautifully!',
      },
      'class-7-9': {
        title: '💡 Professional Profile Card Design',
        tips: [
          'Enter your full name and class designation',
          'Select a colour that matches your verb\'s meaning or mood',
          'Review the layout before printing',
          'Print on quality paper for best presentation',
        ],
        tip_title: 'Tip: Choose colours strategically—blue for calm verbs, red for action verbs!',
      },
    },
    4: {
      'class-1-3': {
        title: '💡 Practice Speaking',
        tips: [
          'Press Start to begin the timer',
          'Talk about your word for 2-3 minutes',
          'Speak loud and clear so everyone hears',
          'Tell your class about what you learned!',
        ],
        tip_title: 'Remember: Slow down, speak clearly, and smile!',
      },
      'class-4-6': {
        title: '💡 Demo Hint: Practice Presentation',
        tips: [
          'Click Start to begin the 2-3 minute timer',
          'Practice explaining your verb to the class',
          'Use the checklist to make sure you\'re ready',
          'When done, present to your actual class!',
        ],
        tip_title: 'Speak clearly and with confidence!',
      },
      'class-7-9': {
        title: '💡 Professional Presentation Preparation',
        tips: [
          'Use the timer to practice a 2-3 minute presentation',
          'Prepare a compelling narrative about your verb discovery',
          'Practice delivery with emphasis and natural pacing',
          'Anticipate questions from your classmates',
        ],
        tip_title: 'Challenge: Prepare a brief story or example that brings your verb to life!',
      },
    },
  };

  return hints[step]?.[level] || hints[step]?.['class-4-6'] || {
    title: '💡 Hint',
    tips: ['Continue with the current step'],
    tip_title: 'Keep going!',
  };
};

export const getClassLevelLabel = (level: ClassLevel): string => {
  const labels: Record<ClassLevel, string> = {
    'class-1-3': 'Class 1-3',
    'class-4-6': 'Class 4-6',
    'class-7-9': 'JHS (Class 7-9)',
  };
  return labels[level];
};

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}

```

### FILE: vite.config.ts
```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});

```

