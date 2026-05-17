# luxthumb-agent - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for luxthumb-agent.

### FILE: .dockerignore
```text
node_modules
dist
.git
.gitignore
.env
.env.local
.env.*.local
npm-debug.log
pnpm-debug.log
yarn-error.log
.DS_Store
Thumbs.db
.vscode
.idea
*.swp
*.swo
*~
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace
.history
.env.production.local
coverage
playwright-report
test-results
.claude
.gemini
.github
.pilots
.vscode
docs
README.md
DEPLOYMENT_GUIDE.md
TESTING_GUIDE.md
ADMIN_GUIDE.md
package-lock.json

```

### FILE: .env
```text
# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
# Users configure this via the Secrets panel in the AI Studio UI.
GEMINI_API_KEY=[REDACTED_CREDENTIAL]

# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"

```

### FILE: .env.example
```text
# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
# Users configure this via the Secrets panel in the AI Studio UI.
GEMINI_API_KEY=[REDACTED_CREDENTIAL]

# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"

```

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

```

### FILE: .htaccess
```text
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /luxthumb/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /luxthumb/index.html [QSA,L]
</IfModule>

```

### FILE: .npmrc
```text
# pnpm configuration for luxthumb-agent
# Always use pnpm for this project

shamefully-hoist=false
strict-peer-dependencies=true
auto-install-peers=true
ignore-scripts=false
run-scripts=true

```

### FILE: APPSTORE_READY.md
```md
# LuxThumb Designer — App Store Ready Checklist

## ✅ Completed Setup (as of 10 May 2026)

### Core Infrastructure
- ✅ Capacitor 8.3.3 integration (iOS + Android)
- ✅ React 19 + TypeScript codebase reusable across all platforms
- ✅ Web build optimised (370 KB gzipped)
- ✅ iOS Xcode project configured (`ios/App/`)
- ✅ Android Gradle project configured (`android/`)
- ✅ App ID: `com.techbridge.luxthumb`
- ✅ App Name: LuxThumb Designer
- ✅ Version: 1.0.0

### Documentation
- ✅ APP_STORE_GUIDE.md — Complete iOS App Store + Google Play submission guide
- ✅ MOBILE_BUILD_GUIDE.md — Build, deployment, and CI/CD setup
- ✅ APP_ICONS_GUIDE.md — Icon generation and placement for both platforms
- ✅ privacy.html — GDPR/CCPA/GDPA compliant privacy policy
- ✅ Deployment documentation covers Xcode, Android Studio, certificate signing

### Features
- ✅ Timestamped export filenames (format: `{brand}_{ISO8601-timestamp}.{ext}`)
- ✅ White lines removed from exported images (design dividers hidden during rendering)
- ✅ Dark mode + light mode + high-contrast themes
- ✅ Admin panel with audit logging
- ✅ Accessibility panel (font size, motion preferences)
- ✅ AI-powered design generation (Gemini API)
- ✅ Multi-format export (PNG, JPG, PDF, JSON)

### Build Scripts (npm)
```
npm run build           # Build web bundle (required first)
npm run build:web      # Alias with platform sync
npm run build:ios      # Web build + Capacitor copy for iOS
npm run build:android  # Web build + Capacitor copy for Android
npm run mobile:sync    # Sync web assets to both platforms
npm run ios:open       # Open iOS project in Xcode (macOS only)
npm run android:open   # Open Android project in Android Studio
```

---

## 📋 Next Steps (Before Submission)

### 1. Create App Icons (1–2 hours)

**Status:** Design needed

**Resources:**
- Figma template or Photoshop
- Master icon must be 1024×1024 px, PNG
- Follow guide: `docs/APP_ICONS_GUIDE.md`

**Deliverables:**
- iOS: 1024×1024, 512×512, 180×180, 120×120, 87×87, 60×60, 40×40, 29×29 px
- Android: 512×512, 192×192, 144×144, 96×96, 72×72, 48×48, 36×36 px

**Action:**
```bash
# After creating master icon (1024×1024):
# 1. Use https://appicon.resizer.tools/ (free)
# 2. Download all sizes
# 3. Place in:
#    - ios/App/App/Assets.xcassets/AppIcon.appiconset/
#    - android/app/src/main/res/mipmap-*/
```

### 2. Screenshots for App Stores (1–2 hours)

**iOS App Store** (5 minimum per device)
- iPhone 15 Pro Max (6.7"): 1242×2688 px
- Format: PNG or JPG

**Google Play** (5 minimum per device)
- Phone (5.1" portrait): 1080×1920 px
- 7" tablet (optional): 1200×1920 px
- 10" tablet (optional): 1600×2560 px

**Tools:**
- Take screenshots on simulator/emulator
- Use GIMP or Photoshop to add text overlays (optional but recommended)
- Show key features: design creation, export, admin panel, themes

### 3. Test on Physical Devices (2–3 hours)

**iOS:**
```bash
# 1. Plug iPhone via USB
# 2. Trust the computer
# 3. Run in Xcode:
open ios/App/App.xcworkspace
# Product → Run
```

**Android:**
```bash
# 1. Enable USB Debugging on device
# 2. Plug in via USB
# 3. Run in Android Studio or:
cd android && ./gradlew installDebug
```

**Test Checklist:**
- [ ] App launches without crash
- [ ] Design creation workflow complete
- [ ] AI generation works (requires Gemini API key)
- [ ] Export all formats (PNG, JPG, PDF)
- [ ] Admin login works (password: admin123)
- [ ] Theme switching works
- [ ] Accessibility panel functional
- [ ] Audit logs appear in admin panel

### 4. Configure Release Signing

**iOS:**
- Apple Developer Account (£99/year)
- Request signing certificate in Xcode
- Set team ID in target settings

**Android:**
```bash
# Create release keystore (one-time)
keytool -genkey -v -keystore luxthumb-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 -alias luxthumb
```

### 5. Create Developer Accounts

**iOS App Store Connect:**
- URL: https://appstoreconnect.apple.com
- Cost: £99/year (Apple Developer Program)
- Required: Apple ID, payment method

**Google Play:**
- URL: https://play.google.com/console
- Cost: £25 one-time
- Required: Google Account, payment method

---

## 🚀 Submission Timeline

### Week 1: Final Preparation
- **Day 1–2:** Create icons and screenshots
- **Day 2–3:** Test on physical devices
- **Day 3–4:** Configure release signing
- **Day 4–5:** Create app store accounts

### Week 2: Submission
- **Day 1:** iOS submission (approval: 3–5 days)
- **Day 1:** Android submission (approval: 1–2 hours)
- **Day 2–6:** Monitor reviews, address feedback if needed
- **Day 6–9:** Apps live in stores (if approved without changes)

---

## 📂 Key Files Reference

| File | Purpose |
|------|---------|
| `capacitor.config.ts` | Capacitor configuration (app ID, version, settings) |
| `package.json` | Version number (matches both app stores) |
| `ios/App/App/Info.plist` | iOS metadata, version, bundle ID |
| `android/app/build.gradle` | Android version code, target SDK |
| `public/privacy.html` | Privacy policy (must be publicly accessible) |
| `docs/APP_STORE_GUIDE.md` | Complete submission walkthrough |
| `docs/MOBILE_BUILD_GUIDE.md` | Build, test, and debug guide |
| `docs/APP_ICONS_GUIDE.md` | Icon creation and placement |

---

## 🔧 Environment Requirements

### macOS (for iOS)
- Xcode 15+
- CocoaPods: `sudo gem install cocoapods`
- Apple Developer Account

### Windows/Mac/Linux (for Android)
- Android Studio 2024.1+
- Java Development Kit 11+
- Android SDK Platform 34+
- Google Play Developer Account

---

## 💡 Common Issues & Solutions

### "Code signing failed" (iOS)
```bash
# Xcode → Settings → Accounts → Re-authenticate
# Or: manually select team in target settings
```

### "Gradle sync failed" (Android)
```bash
cd android
./gradlew clean
./gradlew build
```

### "Module not found" (iOS)
```bash
cd ios && pod install && cd ..
rm -rf ios/Pods/Podfile.lock
```

### App crashes on launch
```bash
# iOS: Use Xcode console (View → Debug Area)
# Android: adb logcat | grep com.techbridge.luxthumb
```

---

## 📞 Support Resources

- **Capacitor Docs:** https://capacitorjs.com/docs
- **Xcode Help:** https://developer.apple.com/documentation/
- **Android Docs:** https://developer.android.com
- **App Store Connect:** https://appstoreconnect.apple.com
- **Google Play Console:** https://play.google.com/console

---

## 📊 Build Sizes (Approximate)

| Platform | Size | Notes |
|----------|------|-------|
| Web (gzipped) | 370 KB | Latest build |
| iOS app | ~150 MB | Includes frameworks |
| Android app (APK) | ~120 MB | Includes dependencies |
| Android app (AAB) | ~90 MB | Recommended for Play Store |

---

## ✨ Release Notes Template

### Version 1.0.0 (Initial Release)
```
🎨 LuxThumb Designer — AI-Powered Thumbnail Creator

✨ Features:
• Generate luxury editorial thumbnails with AI (Gemini API)
• Design beautiful social media graphics
• Export as PNG, JPG, or PDF
• Dark mode, light mode, high-contrast accessibility
• Audit logging for all actions
• Multi-brand configuration support

🚀 Performance:
• Optimized React 19 with Capacitor for native speed
• Local-first data storage (IndexedDB)
• Offline-capable design preview

🔒 Privacy:
• No central server storage
• All designs stored locally on your device
• GDPR and CCPA compliant

📋 Requirements:
• iOS 14+ or Android 8+
• Gemini API key for AI features
```

---

**Last Updated:** 10 May 2026  
**Status:** Ready for App Store Submission  
**Next Review:** After first submission  

**Questions?** Contact daniel.twum@techbridge.edu.gh

```

### FILE: capacitor.config.ts
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techbridge.luxthumb',
  appName: 'LuxThumb Designer',
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

```

### FILE: deploy.ps1
```ps1
# LuxThumb Agent Deployment Script
# Simple SCP-based deployment

param(
    [string]$RemoteHost = "root@66.226.72.199",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/",
    [switch]$Build = $false
)

Write-Host "=== LUXTHUMB DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host "Remote: $RemoteHost"
Write-Host "Path: $RemotePath`n"

# Build if requested
if ($Build) {
    Write-Host "Building..." -ForegroundColor Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Write-Host "Error: dist/ not found. Run with -Build flag." -ForegroundColor Red
    exit 1
}

Write-Host "Creating directory..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Write-Host "Copying files..." -ForegroundColor Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\luxthumb-agent' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Write-Host "Creating .htaccess..." -ForegroundColor Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /luxthumb/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /luxthumb/index.html [QSA,L]
</IfModule>
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Write-Host "Setting permissions..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "URL: https://ai-tools.techbridge.edu.gh/luxthumb`n"

```

### FILE: DEPLOY_INSTRUCTIONS.md
```md
# LuxThumb Agent — Deployment Instructions

**Target:** `techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb`  
**URL:** `https://ai-tools.techbridge.edu.gh/luxthumb`  
**Method:** SCP + SSH (remote deployment to Plesk server)

---

## Build Status

✅ **Build successful**
- Bundle size: 1.7 MB (uncompressed)
- Gzipped: ~360 KB
- Files: 1 HTML + 4 JavaScript bundles + CSS
- Build time: ~32 seconds
- No errors or critical warnings

---

## Pre-Deployment Checklist

- [ ] SSH access to `techbridge.edu.gh` (root@66.226.72.199)
- [ ] Git branch up-to-date (`git pull origin main`)
- [ ] Environment variables ready (`.env.production`)
- [ ] Gemini API key available

---

## Option 1: Manual Deployment (SCP)

### Step 1: Build
```bash
npm run build
# or
pnpm build
```

### Step 2: SSH into Server
```bash
ssh root@66.226.72.199
```

### Step 3: Create Target Directory
```bash
mkdir -p /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb
cd /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb
```

### Step 4: Clear Old Files (Optional)
```bash
rm -rf /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/*
```

### Step 5: Upload New Files (from local machine)
```bash
scp -r dist/* root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/
```

### Step 6: Upload Supporting Files
```bash
scp .htaccess root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/
scp nginx.conf root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/nginx.conf.example
scp .env.example root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/
```

### Step 7: Set Permissions
```bash
ssh root@66.226.72.199 "chmod -R 755 /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb && chmod 644 /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/.htaccess"
```

### Step 8: Verify
```bash
curl -I https://ai-tools.techbridge.edu.gh/luxthumb
# Expected: 200 OK
```

---

## Option 2: Automated Deployment (PowerShell Script)

```powershell
# From luxthumb-agent directory
.\deploy.ps1 -Build
```

This script:
1. Builds the application
2. Creates a deployment package
3. Uploads via SCP to remote server
4. Sets permissions
5. Cleans up local staging files

---

## Option 3: Docker Deployment

### Build Container Image
```bash
docker build -t luxthumb-agent:latest .
```

### Run Locally (Test)
```bash
docker-compose up
# Access at http://localhost:3001
```

### Push to Registry (Optional)
```bash
docker tag luxthumb-agent:latest registry.techbridge.edu.gh/luxthumb-agent:latest
docker push registry.techbridge.edu.gh/luxthumb-agent:latest
```

### Deploy to Production (Cloud Run or Kubernetes)
```bash
# Cloud Run example
gcloud run deploy luxthumb-agent \
  --image gcr.io/techbridge-project/luxthumb-agent:latest \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Post-Deployment Verification

### 1. Check HTTP Status
```bash
curl -I https://ai-tools.techbridge.edu.gh/luxthumb
```

Expected response:
```
HTTP/2 200
Content-Type: text/html
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
```

### 2. Test SPA Routing
```bash
# These should all return the app (not 404)
curl https://ai-tools.techbridge.edu.gh/luxthumb/
curl https://ai-tools.techbridge.edu.gh/luxthumb/admin
curl https://ai-tools.techbridge.edu.gh/luxthumb/settings
```

### 3. Check Asset Caching
```bash
curl -I https://ai-tools.techbridge.edu.gh/luxthumb/assets/index-D4_wQEUO.css
# Should have: Cache-Control: public, immutable
# Expires: 1y
```

### 4. Verify JavaScript Loads
```bash
curl -s https://ai-tools.techbridge.edu.gh/luxthumb/ | grep '<script'
# Should show inline script loading /assets/*.js
```

### 5. Check Server Logs
```bash
ssh root@66.226.72.199 "tail -f /var/log/apache2/ai-tools.techbridge.edu.gh-access.log" | grep luxthumb
```

---

## Environment Configuration

### Create .env File on Server
```bash
ssh root@66.226.72.199 "cat > /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/.env" << 'EOF'
GEMINI_API_KEY=[REDACTED_CREDENTIAL]
APP_URL=https://ai-tools.techbridge.edu.gh/luxthumb
NODE_ENV=production
EOF
```

### Or Upload from Local
```bash
# Create .env.production locally
echo "GEMINI_API_KEY=[REDACTED_CREDENTIAL]
echo "APP_URL=https://ai-tools.techbridge.edu.gh/luxthumb" >> .env.production

# Upload
scp .env.production root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/.env
```

---

## .htaccess Configuration (Apache)

The `.htaccess` file is already generated and deployed. It ensures:
- SPA routing: all requests to non-existent files redirect to `index.html`
- Asset caching: static files cache for 1 year
- Security: blocks access to hidden files (`.env`, `.git`, etc.)

If using Nginx instead, use the `nginx.conf` template:
```bash
# Copy nginx config to your Nginx include directory
scp nginx.conf root@66.226.72.199:/etc/nginx/sites-available/luxthumb.conf
```

---

## Rollback Procedure

If deployment fails or you need to revert:

### 1. Keep Previous Version Backed Up
```bash
ssh root@66.226.72.199 "cp -r /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb.backup"
```

### 2. Restore Previous Version
```bash
ssh root@66.226.72.199 "rm -rf /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb && cp -r /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb.backup /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb"
```

---

## Troubleshooting

### 403 Forbidden
**Cause:** Incorrect file permissions  
**Solution:**
```bash
ssh root@66.226.72.199 "chmod -R 755 /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb"
```

### 404 Not Found
**Cause:** Missing `.htaccess` or `nginx.conf`  
**Solution:** Redeploy with supporting files:
```bash
scp .htaccess root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb/
```

### Blank Page / JavaScript Not Loading
**Cause:** Incorrect paths or missing assets  
**Solution:**
1. Check browser console (F12) for errors
2. Verify assets loaded: `curl https://ai-tools.techbridge.edu.gh/luxthumb/assets/`
3. Check server logs for 404s

### SPA Routing Not Working
**Cause:** `.htaccess` not enabled on Apache  
**Solution:**
1. Enable `mod_rewrite`: `a2enmod rewrite`
2. Restart Apache: `systemctl restart apache2`
3. Verify `.htaccess` is in correct directory

---

## Performance Optimization

### Enable Gzip Compression
```bash
# In Plesk: Hosting Settings → Apache Modules → Ensure mod_deflate is enabled
```

### Enable Browser Caching
```nginx
# Already configured in nginx.conf
expires 1y;
add_header Cache-Control "public, immutable";
```

### Monitor Page Load
```bash
curl -w "Time to first byte: %{time_starttransfer}s\n" https://ai-tools.techbridge.edu.gh/luxthumb
```

---

## Support & Monitoring

**Dashboard:** https://ai-tools.techbridge.edu.gh/luxthumb  
**Admin Panel:** Click admin button, password: `admin123`  
**Logs:** Audit logs stored in browser IndexedDB (export via admin panel)

---

**Last Updated:** 10 May 2026  
**Deployed By:** Daniel Frempong Twum / TUC ICT  
**Version:** 1.0.0

```

### FILE: Dockerfile
```text
# Multi-stage build for luxthumb-agent (TUC SPA)
# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@11.0.8

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build production bundle
RUN pnpm build

# Stage 2: Runtime
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

```

### FILE: docs/ADMIN_GUIDE.md
```md
# LuxThumb Designer — Admin Guide

**Version:** 1.0  
**Date:** 9 May 2026  
**Audience:** System administrators and IT personnel  

---

## 1. Overview

The Admin Panel is a password-protected dashboard within LuxThumb Designer that provides:
- **Audit Logging:** Real-time tracking of all user actions (design saves, exports, deletions)
- **Audit Dashboard:** Summary statistics and expandable log entries
- **Log Management:** Export audit logs (JSON, CSV), clear logs, view audit trail
- **Compliance:** WCAG AA accessible, user agent metadata capture, immutable log retention

This guide covers accessing the admin panel, interpreting logs, and managing audit data.

---

## 2. Accessing the Admin Panel

### 2.1 Open Admin Panel
1. Navigate to `https://luxthumb.techbridge.edu.gh/`
2. In the sidebar header, locate the **"Admin"** button (top-right corner, icon: lock + gear)
3. Click the button to open the **Admin Login dialog**

### 2.2 Enter Password
1. A modal dialog appears with:
   - Title: "Admin Login"
   - Passcode field (`#admin-password`)
   - "Login" and "Cancel" buttons
2. Enter the admin password: **`admin123`**
3. Click **Login**

### 2.3 Authentication Result
- **Correct password:** Admin Panel displays, sidebar switches to audit dashboard view
- **Incorrect password:** Password field clears, focus returns to input for retry
- **No incorrect-attempt limit:** Re-enter password and retry (no lockout)

### 2.4 Logout
- Click the **Logout** button in the Admin Panel header (red button, top-right)
- Admin panel closes, main app UI restores

---

## 3. Admin Dashboard Overview

Once logged in, the Admin Panel displays:

### 3.1 Header
```
┌─────────────────────────────────────────┐
│ ADMIN CONSOLE  │  Audit Dashboard │ [Logout]
└─────────────────────────────────────────┘
```
- Left: Section label and title
- Right: Red "Logout" button

### 3.2 Control Buttons
```
[ Export JSON ] [ Export CSV ] [ Clear All ]
```
- **Export JSON:** Downloads `luxthumb_audit_logs_{date}.json` containing full audit log array
- **Export CSV:** Downloads `luxthumb_audit_logs_{date}.csv` with headers (Timestamp, Action, Details)
- **Clear All:** Deletes all audit logs from IndexedDB (with confirmation dialog)
- All buttons are **disabled** if audit logs are empty

### 3.3 Statistics Cards
Four cards display aggregated metrics:

| Card | Metric | Purpose |
|---|---|---|
| **Total Entries** | Count of all audit log records | System activity volume |
| **Design Saves** | Count of `design_save` actions | Design history size |
| **Exports** | Count of all `export_format_*` actions | Download frequency |
| **Last Activity** | Timestamp of most recent log | Monitor recency |

Example:
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Total Entries│  │Design Saves  │  │  Exports     │  │Last Activity │
│      47      │  │      12      │  │      28      │  │  2:34:15 PM  │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

### 3.4 Audit Log Table
Below the statistics, an expandable log list displays:
- **Row order:** Most recent first (descending by timestamp)
- **Collapsed view:** Shows action badge, timestamp, truncated details
- **Expanded view:** Full log details (ID, action, details, timestamp ISO, user agent metadata)

---

## 4. Understanding Audit Logs

### 4.1 Logged Actions

| Action | Trigger | Details |
|---|---|---|
| `design_save` | User clicks "Save Copy to History" button | Format: `Design saved: {brand name}` |
| `design_delete` | User deletes a saved design | Format: `Design deleted: {design name}` |
| `export_format_png` | User clicks PNG download button | Format: `PNG exported: {filename}.png` |
| `export_format_pdf` | User clicks PDF download button | Format: `PDF exported: {filename}.pdf` |
| `export_format_jpg` | User clicks JPG download button | Format: `JPG exported: {filename}.jpg` |
| `export_format_json` | User clicks JSON config download | Format: `JSON config exported for brand: {brand name}` |

### 4.2 Log Entry Structure
Each log entry contains:
```json
{
  "id": "log_1715266800123_a7b2c9d4",
  "timestamp": 1715266800123,
  "action": "export_format_png",
  "details": "PNG exported: NEXUS_AI_thumbnail.png",
  "ipMetadata": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ..."
}
```

| Field | Description |
|---|---|
| `id` | Unique identifier: `log_{timestamp}_{random_string}` |
| `timestamp` | Milliseconds since epoch (JavaScript Date compatible) |
| `action` | One of the 7 logged action types |
| `details` | Human-readable description of the action and context |
| `ipMetadata` | First 100 characters of `navigator.userAgent` (not true IP; browser signature) |

### 4.3 Reading Timestamps
- **Collapsed view:** Displayed in user's local timezone (e.g. "15/05/2026, 14:34:15")
- **Expanded view:** Displayed in ISO 8601 UTC format (e.g. "2026-05-15T13:34:15.123Z")
- Conversion: Subtract your timezone offset from UTC timestamp to get local time

---

## 5. Managing Audit Logs

### 5.1 Export Audit Logs

#### JSON Export
1. Click **Export JSON** button
2. Browser downloads file: `luxthumb_audit_logs_2026-05-15.json`
3. File contains full array of AuditLog objects:
   ```json
   [
     {"id": "log_...", "timestamp": ..., "action": "...", ...},
     {"id": "log_...", "timestamp": ..., "action": "...", ...},
     ...
   ]
   ```
4. Use for programmatic processing, archival, or long-term storage

#### CSV Export
1. Click **Export CSV** button
2. Browser downloads file: `luxthumb_audit_logs_2026-05-15.csv`
3. File is comma-separated with headers:
   ```
   Timestamp,Action,Details
   "15/05/2026, 14:34:15","export_format_png","PNG exported: NEXUS_AI_thumbnail.png"
   "15/05/2026, 14:30:42","design_save","Design saved: NEXUS AI"
   ...
   ```
4. Open in Excel, Google Sheets, or any spreadsheet tool for analysis

### 5.2 View Detailed Logs
1. In the audit log table, click any log entry row
2. Entry expands to show:
   - **ID:** Unique identifier for reference
   - **Action:** Type of action
   - **Details:** Context (e.g. filename, brand name)
   - **Timestamp (ISO):** Date-time in UTC
   - **Metadata:** User agent string (browser/OS fingerprint)
3. Click again to collapse

### 5.3 Clear All Logs
1. Click **Clear All** button
2. Confirmation dialog appears:
   ```
   "Clear all audit logs? This action cannot be undone."
   [OK]  [Cancel]
   ```
3. Click **OK** to confirm deletion (irreversible)
4. All logs deleted from IndexedDB; table refreshes to empty state
5. Statistics cards reset to 0

---

## 6. Log Retention & Storage

### 6.1 Storage Location
- **Medium:** Browser IndexedDB (`luxthumb_audit_logs` key)
- **Scope:** Local storage on the user's device/browser
- **Durability:** Persists across browser sessions until cleared
- **Capacity:** 50 MB+ typical (depends on browser/device)

### 6.2 Retention Policy
- **Maximum entries:** 1000 audit logs per browser session
- **Eviction:** When limit exceeded, oldest logs are purged first
- **No automatic expiry:** Logs persist indefinitely until manually cleared or browser cache is cleared
- **Backup strategy:** Regularly export JSON/CSV for archival

### 6.3 Privacy & Security
- **User agent capture:** First 100 characters of `navigator.userAgent` (not true IP address)
- **No PII collected:** No user names, email, or credentials in logs
- **No request bodies:** Only action type and outcome logged
- **Audit trail:** Transparency-focused; designed for compliance review, not privacy tracking

---

## 7. Troubleshooting

### 7.1 Forgot Admin Password
- Password is hardcoded (demo): **`admin123`**
- If you don't remember it, contact IT department for reset
- *Production note:* Implement OAuth or environment-based secret instead of hardcoded password

### 7.2 Admin Button Not Visible
- Ensure you're on the LuxThumb Designer main page
- Check that JavaScript is enabled in browser
- Look for admin button in top-right corner of sidebar
- If still missing, reload page (F5)

### 7.3 Export Button Disabled
- Export buttons are disabled if no audit logs exist
- Ensure users have performed at least one action (save design, export, etc.)
- Check IndexedDB in browser DevTools: `luxthumb_audit_logs` key should contain array

### 7.4 Logs Not Appearing
- **Browser storage issue:** IndexedDB may be disabled or full
  - Clear browser cache and reload
  - Check Developer Tools → Application → IndexedDB
- **Action not logged:** Verify action type is in the 7 logged types (see section 4.1)
- **Lost on browser close:** If "Delete browsing data on exit" is enabled, logs are cleared

### 7.5 Export File Not Downloading
- Check browser's download settings
- Verify pop-up blocker is not blocking file download
- Try export again; check browser console for errors (F12 → Console tab)

---

## 8. Best Practices

1. **Regular Exports:** Export audit logs weekly or monthly and store externally (drive, cloud)
2. **Review Frequency:** Review audit logs monthly for unusual activity patterns
3. **Clear When Done:** Clear logs periodically to prevent hitting the 1000-entry limit (or export first)
4. **Document Changes:** Note significant events (new feature releases, config changes) in exported logs for context
5. **Multi-Admin Access:** This is a single-password system; for multiple admins, implement OAuth or separate roles
6. **Verify Accuracy:** Cross-check log timestamps with user reports of actions taken
7. **Compliance:** If required by policy, archive exported logs for audit trail retention periods (e.g. 1 year)

---

## 9. Additional Resources

- **SRS Document:** See `docs/TUC-ICT-SRS-2026-LUXTHUMB.md` for full system requirements
- **Architecture:** See `docs/architecture.svg` for system design overview
- **Deployment:** See `docs/DEPLOYMENT_GUIDE.md` for hosting and environment setup
- **Testing:** See `docs/TESTING_GUIDE.md` for admin panel test procedures

---

**Document Owner:** ICT Department, Techbridge University College  
**Last Updated:** 9 May 2026  
**Review Cycle:** Quarterly

```

### FILE: docs/APP_ICONS_GUIDE.md
```md
# LuxThumb Designer — App Icons Setup Guide

This guide explains how to generate and configure app icons for iOS and Android app store submissions.

---

## Icon Requirements Overview

| Platform | Size | Format | Transparency | Rounded Corners |
|----------|------|--------|---------------|-----------------|
| **iOS** | 1024×1024 px | PNG | No | iOS handles |
| **Android** | 512×512 px | PNG | No (optional) | No |
| **App Store** | 1024×1024 px | PNG/JPG | No | No |
| **Play Store** | 512×512 px | PNG/JPG | No | No |

---

## Step 1: Create Master Icon (1024×1024 px)

### Design Requirements

- **Background:** Solid colour (no gradients that fade to transparent)
- **Logo/Design:** Centred, scalable (should look good at 40×40 px too)
- **Text:** Minimal or none (avoid small text that becomes illegible)
- **Safe Zone:** Keep essential elements within 900×900 px (centre)
- **Colour:** LuxThumb brand colour is `#C9A84C` (gold), on dark background `#0A0A0A`

### Recommended Design

```
Master Icon (1024×1024 px):
┌─────────────────────────────┐
│                             │
│      Dark Background        │
│      (#0A0A0A)              │
│                             │
│         ╱╲ Logo             │
│        ╱  ╲ (Gold/White)    │
│       ╱____╲ (Centred)      │
│                             │
│     "LuxThumb" text         │
│     (optional, small)       │
│                             │
└─────────────────────────────┘
```

### Tools to Create Icon

1. **Figma (Recommended - Free)**
   - Create 1024×1024 px artboard
   - Design with LuxThumb branding
   - Export as PNG
   - Link: https://figma.com

2. **Photoshop / Illustrator**
   - File → New → 1024×1024 px
   - Design with layers
   - Export as PNG (32-bit RGB)

3. **Online Tools (Quick)**
   - https://www.photopea.com (Free Photoshop alternative)
   - https://pixlr.com (Free image editor)

---

## Step 2: Generate Icon Variants

### Option A: Manual Generation (Recommended for Control)

Once you have a 1024×1024 px PNG, generate these sizes:

**iOS Icons:**
```
ios/App/App/Assets.xcassets/AppIcon.appiconset/
├── icon-20x20.png (20×20)
├── icon-40x40.png (40×40, also used as 2x for 20pt)
├── icon-60x60.png (60×60, also used as 3x for 20pt)
├── icon-29x29.png (29×29)
├── icon-58x58.png (58×58)
├── icon-87x87.png (87×87)
├── icon-40x40@2x.png (80×80)
├── icon-120x120.png (120×120)
├── icon-180x180.png (180×180)
└── icon-1024x1024.png (1024×1024, app store only)
```

**Android Icons:**
```
android/app/src/main/res/
├── mipmap-ldpi/ic_launcher.png (36×36)
├── mipmap-mdpi/ic_launcher.png (48×48)
├── mipmap-hdpi/ic_launcher.png (72×72)
├── mipmap-xhdpi/ic_launcher.png (96×96)
├── mipmap-xxhdpi/ic_launcher.png (144×144)
├── mipmap-xxxhdpi/ic_launcher.png (192×192)
└── mipmap-anydpi-v33/ic_launcher.xml (adaptive icon config)
```

### Option B: Automated Generation (Quick)

Use ImageMagick or FFmpeg to batch resize:

```bash
# Install ImageMagick (Mac: brew install imagemagick)
# Or Windows: Download from https://imagemagick.org/download/binaries/

# Generate iOS icons
convert master-icon-1024.png -resize 20x20 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-20x20.png
convert master-icon-1024.png -resize 40x40 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-40x40.png
convert master-icon-1024.png -resize 60x60 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-60x60.png
convert master-icon-1024.png -resize 180x180 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-180x180.png
convert master-icon-1024.png -resize 1024x1024 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-1024x1024.png

# Generate Android icons
convert master-icon-1024.png -resize 36x36 android/app/src/main/res/mipmap-ldpi/ic_launcher.png
convert master-icon-1024.png -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
convert master-icon-1024.png -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
convert master-icon-1024.png -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
convert master-icon-1024.png -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
convert master-icon-1024.png -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
```

### Option C: Online Icon Generator

1. **App Icon Resizer** (Free)
   - https://appicon.resizer.tools/
   - Upload 1024px PNG
   - Download all sizes at once
   - Copy to respective folders

2. **Capacitor App Icons** (Plugin)
   ```bash
   npm install @capacitor-app-icons-generator/core
   npx capacitor-app-icons-generator
   ```

---

## Step 3: iOS Configuration

### Update `Info.plist`

File: `ios/App/App/Info.plist`

```xml
<key>CFBundleIcons</key>
<dict>
  <key>CFBundlePrimaryIcon</key>
  <dict>
    <key>CFBundleIconFiles</key>
    <array>
      <string>icon-20x20</string>
      <string>icon-40x40</string>
      <string>icon-60x60</string>
      <string>icon-29x29</string>
      <string>icon-58x58</string>
      <string>icon-87x87</string>
      <string>icon-40x40@2x</string>
      <string>icon-120x120</string>
      <string>icon-180x180</string>
    </array>
  </dict>
</dict>

<key>CFBundleIcons~ipad</key>
<dict>
  <key>CFBundlePrimaryIcon</key>
  <dict>
    <key>CFBundleIconFiles</key>
    <array>
      <string>icon-20x20</string>
      <string>icon-40x40</string>
      <string>icon-29x29</string>
      <string>icon-58x58</string>
      <string>icon-76x76</string>
      <string>icon-152x152</string>
      <string>icon-167x167</string>
    </array>
  </dict>
</dict>
```

### In Xcode

1. Open `ios/App/App.xcworkspace`
2. Select "App" project
3. Select "App" target
4. Go to "General" tab
5. Scroll to "App Icons and Launch Images"
6. Verify 1024×1024 icon appears in preview

---

## Step 4: Android Configuration

### Verify `AndroidManifest.xml`

File: `android/app/src/main/AndroidManifest.xml`

```xml
<application
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name"
    ...>
</application>
```

### Adaptive Icon (Android 8.0+)

Create: `android/app/src/main/res/mipmap-anydpi-v33/ic_launcher.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
    <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>
</adaptive-icon>
```

Add to: `android/app/src/main/res/values/colors.xml`

```xml
<color name="ic_launcher_background">#0A0A0A</color>
```

---

## Step 5: Test Icons Locally

### iOS Simulator

```bash
npm run build
npx capacitor copy ios
open ios/App/App.xcworkspace

# In Xcode:
# 1. Select simulator (e.g., iPhone 15 Pro)
# 2. Product → Run
# Look at home screen — icon should appear
```

### Android Emulator

```bash
npm run build
npx capacitor copy android
open android

# In Android Studio:
# 1. Select virtual device (e.g., Pixel 5 API 34)
# 2. Run
# Look at home screen — icon should appear
```

---

## Step 6: Submission

### iOS App Store

Icon is uploaded during:
1. App Store Connect → My Apps → [App] → App Information
2. Upload 1024×1024 PNG as "App Icon"

### Google Play Store

Icon is uploaded during:
1. Google Play Console → [App] → Graphics Assets
2. Upload 512×512 PNG as "App Icon"

### Additional Graphics

Both stores require additional graphics:

**iOS App Store:**
- App Icon (1024×1024)
- Screenshots (5 minimum, per device type)
- Feature graphic (optional)

**Google Play:**
- App Icon (512×512)
- Screenshots (5 minimum, per device type)
- Feature graphic (1024×500)
- TV banner (optional, 1920×1080)

---

## Troubleshooting

### iOS Icon Not Appearing

1. Clean build folder:
   ```bash
   open ios/App/App.xcworkspace
   # Cmd+Shift+K (clean)
   # Cmd+B (rebuild)
   ```

2. Clear simulator:
   ```bash
   xcrun simctl erase all
   ```

3. Force icon cache:
   - Delete app from home screen
   - Restart simulator
   - Rebuild and run

### Android Icon Not Updating

1. Clean Gradle cache:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

2. Rebuild:
   ```bash
   npx capacitor sync android
   npm run build:android
   ```

3. Reinstall on device:
   ```bash
   adb uninstall com.techbridge.luxthumb
   npm run build:android
   ```

---

## Recommended Icon Design Tool Workflow

1. **Create in Figma:**
   - 1024×1024 px artboard
   - Export as PNG 32-bit (transparent background)
   - Save as `master-icon-1024.png`

2. **Generate variants:**
   - Use https://appicon.resizer.tools/
   - Upload PNG
   - Download ZIP

3. **Place icons:**
   - Extract ZIP
   - Copy iOS icons to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Copy Android icons to `android/app/src/main/res/mipmap-*/`

4. **Test:**
   ```bash
   npm run build:ios
   npm run build:android
   ```

5. **Submit:**
   - iOS: Upload to App Store Connect
   - Android: Upload to Google Play Console

---

**Last Updated:** 10 May 2026  
**Maintainer:** Daniel Frempong Twum / TUC ICT

```

### FILE: docs/APP_STORE_GUIDE.md
```md
# LuxThumb Designer — App Store Deployment Guide

**App ID:** `com.techbridge.luxthumb`  
**Display Name:** LuxThumb Designer  
**Version:** 1.0.0  
**Build Number:** 1

---

## Prerequisites

### macOS (for iOS builds)
- Xcode 15+ (from App Store or [developer.apple.com](https://developer.apple.com))
- CocoaPods: `sudo gem install cocoapods`
- Apple Developer Account (£99/year, required for publishing)

### Windows/Linux (for Android builds)
- Android SDK Platform 34+ (via Android Studio)
- Java Development Kit 11+
- Google Play Developer Account (£25 one-time, required for publishing)

---

## Section 1: iOS Deployment (Apple App Store)

### Step 1: Update iOS App Configuration

**File:** `ios/App/App/Info.plist`

```xml
<key>CFBundleDisplayName</key>
<string>LuxThumb Designer</string>
<key>CFBundleVersion</key>
<string>1</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
  <key>NSExceptionDomains</key>
  <dict>
    <key>generativelanguage.googleapis.com</key>
    <dict>
      <key>NSIncludesSubdomains</key>
      <true/>
      <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
      <false/>
    </dict>
  </dict>
</dict>
```

### Step 2: Configure Signing Certificates

1. **Open Xcode project:**
   ```bash
   open ios/App/App.xcworkspace
   ```

2. **Configure Signing:**
   - Select "App" in Project navigator
   - Select "App" target
   - Go to "Signing & Capabilities"
   - Set Team ID to your Apple Developer Team
   - Xcode will auto-generate provisioning profiles

3. **Set Bundle ID:**
   - Set to: `com.techbridge.luxthumb`

### Step 3: Build for Release

```bash
# Archive for App Store submission
open ios/App/App.xcworkspace

# In Xcode:
# 1. Product → Scheme → Edit Scheme
# 2. Set Build Configuration to "Release"
# 3. Product → Archive
# 4. Organizer will open — click "Distribute App"
# 5. Select "App Store Connect"
# 6. Follow prompts to upload
```

### Step 4: App Store Connect Configuration

1. **Create App in App Store Connect:**
   - https://appstoreconnect.apple.com
   - Click "My Apps" → "+"
   - Select "New App"
   - Platform: iOS
   - Name: LuxThumb Designer
   - Bundle ID: com.techbridge.luxthumb
   - SKU: LUXTHUMB-001

2. **Upload Screenshots:**
   - iPhone 15 Pro Max (6.7"): 5 screenshots minimum
   - iPad Pro 12.9": 5 screenshots (optional but recommended)
   - Format: PNG or JPG, max 5MB each

3. **App Icon:**
   - 1024×1024 px, PNG or JPG
   - No transparency, no rounded corners (iOS rounds them automatically)

4. **Privacy Policy:**
   - Required, must be a public URL
   - See [Privacy Policy Template](#privacy-policy-template) below

5. **Description:**
   ```
   LuxThumb Designer: AI-powered thumbnail generation for premium branding.
   
   Create cinematic, luxury editorial visuals with Gemini AI integration.
   Perfect for social media, marketing campaigns, and advertising.
   
   Features:
   - AI-powered design prompts (Midjourney, Imagen 3, DALL-E)
   - Luxury editorial typography
   - Brand customization
   - Multi-format export (PNG, JPG, PDF)
   - Secure audit logging
   - Dark mode & accessibility support
   ```

6. **Keywords:** thumbnail, design, AI, branding, social media, editorial

7. **Support URL:** https://techbridge.edu.gh
   **Privacy Policy:** https://ai-tools.techbridge.edu.gh/luxthumb/privacy.html

---

## Section 2: Android Deployment (Google Play Store)

### Step 1: Generate Release Key

```bash
# Create signing keystore (one-time, keep safe)
keytool -genkey -v -keystore luxthumb-release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias luxthumb

# When prompted, enter:
# - Password: [STRONG_PASSWORD]
# - First/Last Name: Daniel Frempong Twum
# - Organization: Techbridge University College
# - City: Oyibi
# - State: Greater Accra
# - Country Code: GH
```

### Step 2: Configure Android Build

**File:** `android/app/build.gradle`

```gradle
android {
    signingConfigs {
        release {
            storeFile file('luxthumb-release.keystore')
            storePassword System.getenv('LUXTHUMB_KEYSTORE_PASSWORD')
            keyAlias 'luxthumb'
            keyPassword System.getenv('LUXTHUMB_KEY_PASSWORD')
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
# Build signed AAB (recommended for Play Store)
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### Step 4: Google Play Console Configuration

1. **Create App:**
   - https://play.google.com/console
   - Click "Create app"
   - App name: LuxThumb Designer
   - Language: English (US)
   - App type: App
   - Category: Lifestyle
   - Free/Paid: Free

2. **Upload Screenshots:**
   - Phone (5.1" portrait): 5 screenshots, PNG/JPG, 1080×1920 px max
   - 7" tablet (optional): 5 screenshots, PNG/JPG, 1200×1920 px max
   - 10" tablet (optional): 5 screenshots, PNG/JPG, 1600×2560 px max

3. **App Icon:**
   - 512×512 px, PNG or JPG
   - No transparency, no rounded corners

4. **Feature Graphic:**
   - 1024×500 px, PNG or JPG
   - Shown in store listing header

5. **Short Description:**
   ```
   AI-powered thumbnail designer with Gemini AI integration
   ```

6. **Full Description:**
   ```
   LuxThumb Designer: Create premium AI-powered thumbnail designs.
   
   Generate cinematic, luxury editorial visuals perfect for social media,
   marketing campaigns, and professional advertising.
   
   ✨ Features:
   • AI-powered design suggestions (Midjourney, Imagen 3, DALL-E)
   • Luxury editorial typography system
   • Complete brand customization
   • Multi-format export (PNG, JPG, PDF)
   • Secure audit logging for all actions
   • Dark mode & accessibility support
   • Offline-capable with cloud sync
   
   Built with Capacitor for smooth native performance on iOS and Android.
   ```

7. **Privacy Policy:** https://ai-tools.techbridge.edu.gh/luxthumb/privacy.html

8. **Target Audience:**
   - Designers, marketers, content creators, small business owners

9. **Content Rating:** Complete the Google Play Content Rating Questionnaire

10. **Testing:** Set up internal/alpha/beta tracks for testing before production release

---

## Section 3: Privacy Policy Template

**File:** `public/privacy.html`

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LuxThumb Designer — Privacy Policy</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333; }
        h1 { color: #C9A84C; border-bottom: 2px solid #C9A84C; padding-bottom: 10px; }
        h2 { color: #1A1A1A; margin-top: 30px; }
        .date { color: #666; font-style: italic; }
    </style>
</head>
<body>
    <h1>Privacy Policy — LuxThumb Designer</h1>
    <p class="date">Last Updated: 10 May 2026</p>

    <h2>1. Overview</h2>
    <p>LuxThumb Designer ("App") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information.</p>

    <h2>2. Information We Collect</h2>
    <ul>
        <li><strong>Design Data:</strong> Brand names, headlines, colours, images, and custom configurations you enter</li>
        <li><strong>Usage Data:</strong> Actions performed (exports, AI generations, theme changes) logged for audit trails</li>
        <li><strong>Device Data:</strong> Device model, OS version, app version (for crash reports and analytics)</li>
        <li><strong>API Data:</strong> Queries sent to Gemini API for AI design generation</li>
    </ul>

    <h2>3. How We Use Your Data</h2>
    <ul>
        <li>To provide and improve the App's functionality</li>
        <li>To generate AI-powered design suggestions (via Google Gemini API)</li>
        <li>To maintain audit logs for security and accountability</li>
        <li>To fix bugs and improve user experience</li>
    </ul>

    <h2>4. Data Storage</h2>
    <ul>
        <li><strong>Local Storage:</strong> Your designs are stored locally in your device's browser IndexedDB or app storage</li>
        <li><strong>Cloud Services:</strong> Gemini API queries are processed by Google (see Google's privacy policy)</li>
        <li><strong>No Central Database:</strong> We do not maintain a central database of your designs</li>
    </ul>

    <h2>5. Third-Party Services</h2>
    <ul>
        <li><strong>Google Gemini API:</strong> Used for AI-powered design generation. Google processes your prompts according to their privacy policy</li>
        <li><strong>Analytics:</strong> Google Analytics tracks app usage to improve performance</li>
    </ul>

    <h2>6. Data Security</h2>
    <p>We implement industry-standard security measures including HTTPS encryption, secure API key management, and audit logging.</p>

    <h2>7. Your Rights</h2>
    <p>You have the right to:</p>
    <ul>
        <li>Access your design data at any time (exported via JSON config)</li>
        <li>Delete your data by clearing app storage</li>
        <li>Opt out of analytics tracking</li>
    </ul>

    <h2>8. Contact Us</h2>
    <p>For privacy concerns, contact:</p>
    <p>
        <strong>Daniel Frempong Twum</strong><br>
        Head of ICT, Techbridge University College<br>
        Email: daniel.twum@techbridge.edu.gh<br>
        Phone: +233 (0) 24 XXX XXXX
    </p>

    <h2>9. Policy Changes</h2>
    <p>We may update this policy periodically. Continued use of the App constitutes acceptance of changes.</p>
</body>
</html>
```

---

## Section 4: Building & Testing Locally

### iOS (macOS only)

```bash
# Build for iOS simulator
npx capacitor build ios

# Open in Xcode
open ios/App/App.xcworkspace

# Run on device: Product → Run (with device connected)
```

### Android

```bash
# Build for Android
npx capacitor build android

# Using Android Studio
open android

# Or via command line
cd android
./gradlew installDebug

# Run on emulator
emulator -avd Pixel_5_API_34 &
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Section 5: Submission Checklist

### Before Submission

- [ ] Privacy Policy published and live at public URL
- [ ] App Icon created (1024×1024 PNG)
- [ ] Screenshots captured (5 minimum per platform)
- [ ] Descriptive title and description (under 80 characters, under 4000 characters)
- [ ] Support email configured
- [ ] Gemini API key secured (backend proxy recommended)
- [ ] Test on physical device (iOS + Android)
- [ ] Verify all export formats work (PNG, JPG, PDF)
- [ ] Check that offline functionality works gracefully

### iOS App Store Review (3–5 days typical)

Common rejection reasons to avoid:
- Incomplete or placeholder privacy policy ❌
- Crashes on launch or during use ❌
- Unlabelled third-party frameworks (disclose Google Gemini) ✅
- Poor UI/UX or unfinished appearance ❌
- Missing support contact information ❌

### Google Play Review (1–2 hours typical)

Common rejection reasons:
- Non-existent or broken privacy policy URL ❌
- Dangerous permissions not justified ❌
- Misleading app description ❌
- SDK policy violations (trackers, ads, etc.) ❌

---

## Section 6: Post-Launch Monitoring

### Analytics Dashboard

```bash
# Monitor crashes and performance
https://play.google.com/console/u/0/developers/{DEVELOPER_ID}/app/{APP_ID}/overview
https://appstoreconnect.apple.com/analytics
```

### Handling Updates

```bash
# Increment version in capacitor.config.ts
# Rebuild: npm run build
# Rebuild iOS: npx capacitor copy ios && open ios/App/App.xcworkspace
# Rebuild Android: npx capacitor copy android && cd android && ./gradlew bundleRelease
# Resubmit via App Store Connect / Google Play Console
```

---

## Troubleshooting

### iOS Codesigning Issues
```bash
rm -rf ios/Pods ios/Podfile.lock
cd ios && pod install && cd ..
```

### Android Gradle Sync Failure
```bash
cd android
./gradlew clean
./gradlew build
```

### Gemini API Errors in Production
**Recommendation:** Use backend API proxy instead of client-side API key.

```typescript
// Instead of:
const response = await fetch('https://generativelanguage.googleapis.com/...', {
  headers: { 'x-goog-api-key': API_KEY }
});

// Use backend:
const response = await fetch('https://api.techbridge.edu.gh/v1/gemini-proxy', {
  method: 'POST',
  body: JSON.stringify({ prompt: userInput })
});
```

---

**Last Updated:** 10 May 2026  
**Maintainer:** Daniel Frempong Twum / TUC ICT  
**Next Review:** 10 August 2026

```

### FILE: docs/DEPLOYMENT_GUIDE.md
```md
# LuxThumb Designer — Deployment Guide

**Version:** 1.0  
**Date:** 9 May 2026  
**Target Environment:** Plesk/Ubuntu Server (66.226.72.199) or Cloud Run  
**Domain:** `luxthumb.techbridge.edu.gh`  

---

## 1. Pre-Deployment Checklist

- [ ] Node.js 18+ installed on server
- [ ] npm 9+ installed
- [ ] Git access to repository
- [ ] Gemini API key obtained (from Google AI Studio)
- [ ] SSL certificate configured (or auto-generated via Plesk)
- [ ] Domain DNS pointed to server IP
- [ ] Plesk panel access (or Cloud Run project credentials)

---

## 2. Development Build

### 2.1 Clone Repository
```bash
cd /path/to/projects
git clone https://github.com/techbridge/aucdt-utilities.git
cd aucdt-utilities/luxthumb-agent
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Create Environment File
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
GEMINI_API_KEY=[REDACTED_CREDENTIAL]
APP_URL=https://luxthumb.techbridge.edu.gh
```

### 2.4 Verify Installation
```bash
npm run lint          # TypeScript check
npm test              # Playwright tests (requires dev server)
npm run dev           # Run dev server (port 3000)
```

Access at `http://localhost:3000` to verify UI loads and theme switching works.

---

## 3. Production Build

### 3.1 Build Artifacts
```bash
npm run build
```

Output: `dist/` directory with minified, optimized files:
- `index.html` (entry point)
- `assets/` (JavaScript bundles, CSS)
- `assets/` (static images and fonts)

### 3.2 Build Verification
```bash
npm run preview
```

Serve `dist/` locally on port 4173 to verify production build loads correctly.

### 3.3 Bundle Size (Typical)
- `index.html`: ~5 KB
- JavaScript bundles: ~250–350 KB (minified, gzipped)
- Total: ~400 KB (gzipped)

---

## 4. Deployment: Plesk (Recommended for TUC)

### 4.1 SSH into Server
```bash
ssh root@66.226.72.199
```

### 4.2 Create Application Directory
```bash
mkdir -p /var/www/vhosts/techbridge.edu.gh/luxthumb
cd /var/www/vhosts/techbridge.edu.gh/luxthumb
```

### 4.3 Deploy Build Artifacts
Option A: Build on server
```bash
git clone <repo> source
cd source/luxthumb-agent
npm install
npm run build
cp -r dist/* /var/www/vhosts/techbridge.edu.gh/luxthumb/
```

Option B: Build locally, upload via SFTP
```bash
# On local machine:
npm run build
# Upload dist/ folder to /var/www/vhosts/techbridge.edu.gh/luxthumb/ via SFTP or SCP
```

### 4.4 Configure Plesk Subdomain
1. Log in to Plesk panel (`https://66.226.72.199:8443`)
2. Navigate to **Domains → techbridge.edu.gh → Subdomains**
3. Create subdomain:
   - **Name:** `luxthumb`
   - **Document Root:** `/var/www/vhosts/techbridge.edu.gh/luxthumb`
4. Click **OK**

### 4.5 Configure SSL Certificate
1. In Plesk, select subdomain **luxthumb.techbridge.edu.gh**
2. Navigate to **SSL/TLS Certificate**
3. Select **Let's Encrypt** (free) or Comodo (paid)
4. Click **Install**

### 4.6 Configure Apache VirtualHost
Plesk auto-generates, but verify `.htaccess` in document root:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  # Serve static files as-is
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  # SPA: rewrite all requests to index.html
  RewriteRule ^ /index.html [QSA,L]
</IfModule>
```

### 4.7 Configure Environment Variables
Create `.env` in document root:
```
GEMINI_API_KEY=[REDACTED_CREDENTIAL]
APP_URL=https://luxthumb.techbridge.edu.gh
```

### 4.8 Verify Deployment
```bash
curl -I https://luxthumb.techbridge.edu.gh/
# Expected: 200 OK with HTML response

curl https://luxthumb.techbridge.edu.gh/ | head -20
# Should see <html> with proper meta tags
```

---

## 5. Deployment: Cloud Run (Google Cloud)

### 5.1 Create Dockerfile
Save in project root:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist /app/dist
EXPOSE 8080

# Serve dist/ folder with a simple HTTP server
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "8080"]
```

### 5.2 Build & Push Container Image
```bash
gcloud builds submit --tag gcr.io/your-project/luxthumb-agent:latest
```

### 5.3 Deploy to Cloud Run
```bash
gcloud run deploy luxthumb-agent \
  --image gcr.io/your-project/luxthumb-agent:latest \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=[REDACTED_CREDENTIAL]
```

### 5.4 Configure Custom Domain
1. In Cloud Run console, select service **luxthumb-agent**
2. Click **Manage Custom Domains**
3. Add `luxthumb.techbridge.edu.gh`
4. Verify DNS records (Cloud Run provides CNAME target)
5. Configure SSL (auto-generated)

---

## 6. Environment Variables

### 6.1 Required (Production)
| Variable | Value | Source |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key | Google AI Studio dashboard |
| `APP_URL` | `https://luxthumb.techbridge.edu.gh` | Your domain |

### 6.2 Optional (Development)
| Variable | Value | Default |
|---|---|---|
| `DISABLE_HMR` | `true` to disable hot module reload | `false` (HMR enabled) |

### 6.3 Obtain Gemini API Key
1. Visit `https://ai.google.dev/`
2. Click **Get API Key**
3. Create new API key in Google Cloud Console
4. Copy key and paste into `.env.local` or Cloud Run environment

### 6.4 Security Best Practices
- Never commit `.env.local` to Git (add to `.gitignore`)
- Use Plesk Secrets Manager or Cloud Run Secret Manager for sensitive keys
- Rotate API keys every 6 months
- Monitor API key usage in Google Cloud Console

---

## 7. Post-Deployment Verification

### 7.1 Health Check
```bash
curl -I https://luxthumb.techbridge.edu.gh/
```
Expected: `200 OK`, `Content-Type: text/html`

### 7.2 Asset Loading
Open browser DevTools (F12):
1. Navigate to `https://luxthumb.techbridge.edu.gh/`
2. Check **Console** tab for errors (should be empty)
3. Check **Network** tab: all `.js`, `.css`, `.png` files should load (status 200)
4. Verify theme CSS loads: inspect `<html>` for `data-theme` attribute

### 7.3 Functionality Test
1. Fill form with test data
2. Click "Engage Engine"
3. Verify Gemini API responds with generated prompts (check Network tab)
4. Test theme switcher (click accessibility button, switch theme, verify `data-theme` changes)
5. Test export: click PNG, verify browser download
6. Open admin panel (admin button), enter password `admin123`
7. Verify audit logs appear

### 7.4 Google Analytics
1. In browser, open **Network** tab
2. Look for requests to `googletagmanager.com/gtag/js?id=G-FKXTELQ71R`
3. Expected: status 200 (GA script loaded)
4. Open GA dashboard (`https://analytics.google.com`) to verify events are tracked

---

## 8. Monitoring & Logging

### 8.1 Plesk Logs
```bash
# Access via SSH
tail -f /var/log/apache2/luxthumb.techbridge.edu.gh-access.log
tail -f /var/log/apache2/luxthumb.techbridge.edu.gh-error.log
```

### 8.2 Cloud Run Logs
```bash
gcloud run services describe luxthumb-agent --region us-central1
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=luxthumb-agent" --limit 50 --format json
```

### 8.3 Client-Side Monitoring
- Errors logged to browser console (F12 → Console)
- Audit logs stored in browser IndexedDB
- Export logs regularly via Admin Panel for review

### 8.4 Performance Monitoring
- Google Analytics tracks page load time, user interactions
- Check GA dashboard for Core Web Vitals (LCP, FID, CLS)
- Monitor Gemini API latency in Network tab

---

## 9. Troubleshooting

### 9.1 Static Assets Return 404
- **Issue:** CSS, JS files not found
- **Solution:** Verify `.htaccess` rewrite rules are correct; check document root path

### 9.2 Theme Switcher Not Working
- **Issue:** Theme CSS variables not applied
- **Solution:** Verify `src/styles/theme.css` is imported in `src/index.css`; check browser DevTools for CSS load errors

### 9.3 Gemini API 401 Unauthorized
- **Issue:** API key invalid or expired
- **Solution:** Regenerate API key in Google Cloud Console; update `.env` and redeploy

### 9.4 PDF Export Fails
- **Issue:** jsPDF library not loaded
- **Solution:** Check bundle includes `node_modules/jspdf`; rebuild with `npm run build`

### 9.5 Admin Panel Password Incorrect
- **Issue:** Password `admin123` not working
- **Solution:** Verify no typos; hard-reset browser cache (Ctrl+Shift+Delete)

---

## 10. Maintenance

### 10.1 Regular Tasks
- **Weekly:** Review audit logs (via Admin Panel) for unusual activity
- **Monthly:** Export and archive audit logs
- **Quarterly:** Update npm dependencies (`npm update`)
- **Semi-annually:** Rotate Gemini API key

### 10.2 Backup
- Git repository is source backup
- No database; all data is browser-local (IndexedDB)
- Recommend exporting user designs periodically (via JSON export)

### 10.3 Scaling
- Current deployment is single-instance (no scaling needed for typical usage)
- If load increases, scale Cloud Run service or add load balancer to Plesk

---

## 11. Rollback

### 11.1 Revert to Previous Version (Plesk)
```bash
cd /var/www/vhosts/techbridge.edu.gh/luxthumb
git checkout <previous-commit>
npm run build
cp -r dist/* .
systemctl restart apache2
```

### 11.2 Revert to Previous Version (Cloud Run)
```bash
gcloud run deploy luxthumb-agent --image gcr.io/your-project/luxthumb-agent:<previous-tag>
```

---

## 12. Additional Resources

- **SRS:** `docs/TUC-ICT-SRS-2026-LUXTHUMB.md`
- **Admin Guide:** `docs/ADMIN_GUIDE.md`
- **Testing:** `docs/TESTING_GUIDE.md`
- **Architecture:** `docs/architecture.svg`

---

**Deployment Owner:** ICT Department, TUC  
**Last Updated:** 9 May 2026  
**Support:** Contact daniel.twum@techbridge.edu.gh

```

### FILE: docs/MOBILE_BUILD_GUIDE.md
```md
# LuxThumb Designer — Mobile Build & Deployment Guide

**Status:** Ready for iOS and Android app store submission  
**Framework:** Capacitor 8.3.3  
**React Version:** 19.0.1  
**Target:** iOS 14+ | Android 8+ (API 26+)

---

## Quick Start

```bash
# 1. Build web bundle
npm run build

# 2. Sync to mobile platforms
npm run mobile:sync

# 3. Open in native IDEs
npm run ios:open    # macOS only
npm run android:open

# 4. Build for deployment
npm run build:ios   # macOS only
npm run build:android
```

---

## Prerequisites

### For iOS Builds (macOS Only)

- **Xcode 15+** — from App Store or [developer.apple.com](https://developer.apple.com/download/)
- **CocoaPods** — `sudo gem install cocoapods`
- **Apple Developer Account** — required for signing and deployment (£99/year)
- **iOS SDK 14+** — install via Xcode

Check installation:
```bash
xcode-select --install
pod --version
```

### For Android Builds (macOS/Windows/Linux)

- **Android Studio 2024.1+** — from [developer.android.com/studio](https://developer.android.com/studio)
- **Android SDK Platform 34+** — via SDK Manager in Android Studio
- **Java Development Kit 11+** — `brew install java` (macOS) or [oracle.com](https://www.oracle.com/java/technologies/downloads/)
- **Google Play Developer Account** — required for deployment (£25 one-time)

Check installation:
```bash
java -version
sdkmanager --list_installed
```

---

## Section 1: Environment Setup

### macOS (iOS + Android)

```bash
# Install Xcode command-line tools
xcode-select --install

# Install Node.js (if not already installed)
brew install node@20

# Install CocoaPods
sudo gem install cocoapods

# Set ANDROID_HOME
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools' >> ~/.zshrc
source ~/.zshrc

# Verify Android SDK is installed
ls ~/Library/Android/sdk
```

### Windows (Android Only)

```powershell
# Download Android Studio from https://developer.android.com/studio
# Install with default settings

# Set environment variables (Admin PowerShell):
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk", "User")
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Android\Android Studio\jbr", "User")

# Verify (restart terminal after):
$env:ANDROID_HOME
java -version
```

### Linux (Android Only)

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install android-sdk android-studio default-jdk

# Set ANDROID_HOME
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools' >> ~/.bashrc
source ~/.bashrc
```

---

## Section 2: Build Configuration

### Project Structure

```
luxthumb-agent/
├── src/                      # React TypeScript source
├── public/                   # Static assets (privacy.html, etc.)
├── dist/                     # Web build output (generated)
├── ios/                      # iOS Xcode project (generated)
├── android/                  # Android Gradle project (generated)
├── capacitor.config.ts       # Capacitor configuration
├── package.json              # Node.js dependencies
├── vite.config.ts            # Vite build config
└── docs/                     # Documentation
    ├── APP_STORE_GUIDE.md
    ├── APP_ICONS_GUIDE.md
    ├── MOBILE_BUILD_GUIDE.md (this file)
    └── ...
```

### Capacitor Configuration

File: `capacitor.config.ts`

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techbridge.luxthumb',
  appName: 'LuxThumb Designer',
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
```

**Key Points:**
- `appId`: Unique identifier (reverse domain notation)
- `webDir`: Path to built web assets
- `bundledWebRuntime`: false — use system WebView instead
- `androidScheme`: HTTPS for secure API calls

---

## Section 3: Development Workflow

### Hot Reload Development (Web)

```bash
npm run dev
# Opens at http://localhost:3000
```

### Testing on Native Devices

#### iOS Simulator

```bash
# 1. Build web bundle
npm run build

# 2. Copy to iOS project
npx capacitor copy ios

# 3. Open in Xcode
open ios/App/App.xcworkspace

# 4. In Xcode:
#    - Select target device (top left)
#    - Product → Run (Cmd+R)
#    - App appears on simulator home screen
```

#### Android Emulator

```bash
# 1. Start emulator (via Android Studio or CLI):
emulator -avd Pixel_6_Pro_API_34 &

# 2. Build and sync
npm run build
npx capacitor copy android

# 3. Open Android Studio
open android

# 4. In Android Studio:
#    - Click "Run" (Shift+F10)
#    - Select running emulator
#    - App launches

# Or via command line:
cd android
./gradlew installDebug
```

#### Physical Device

**iOS:**
```bash
# 1. Connect device via USB
# 2. Trust the computer on the device
# 3. In Xcode, select device from top-left dropdown
# 4. Product → Run

# Troubleshoot provisioning:
# Xcode → Settings → Accounts → Select team
```

**Android:**
```bash
# 1. Enable Developer Mode on device:
#    Settings → About Phone → Build Number (tap 7 times)
#    Settings → Developer Options → USB Debugging (enable)

# 2. Connect via USB

# 3. Verify connection:
adb devices

# 4. Install app:
cd android
./gradlew installDebug

# Or use Android Studio's Run button
```

---

## Section 4: Building for Production

### Web Build (Required First)

```bash
npm run build
# Output: dist/
# - index.html
# - assets/*.js, *.css
# - ~370 KB gzipped

npm run preview
# Preview at http://localhost:4173
```

### iOS Release Build

**Prerequisites:**
- Xcode 15+
- Apple Developer Account (£99/year)
- Valid signing certificate and provisioning profile

```bash
# 1. Sync latest code
npm run build:ios

# 2. Open in Xcode
open ios/App/App.xcworkspace

# 3. Configure signing:
#    - Select "App" target
#    - "Signing & Capabilities" tab
#    - Team: Select your Apple Developer team
#    - Bundle ID: com.techbridge.luxthumb

# 4. Archive for submission:
#    - Product → Scheme → Edit Scheme
#    - Set "Release" build configuration
#    - Product → Archive
#    - Organizer window opens

# 5. Distribute to App Store Connect:
#    - Click "Distribute App"
#    - Select "App Store Connect"
#    - Follow prompts

# Or upload from command line:
xcrun altool --upload-app -f app.ipa -t ios -u your@email.com -p your-app-password
```

### Android Release Build

**Prerequisites:**
- Android SDK Platform 34+
- Java Development Kit 11+
- Release signing keystore (see APP_STORE_GUIDE.md)

```bash
# 1. Sync latest code
npm run build:android

# 2. Build signed bundle (recommended for Play Store)
cd android
./gradlew bundleRelease
# Output: app/build/outputs/bundle/release/app-release.aab

# 3. Or build APK (for manual testing)
./gradlew assembleRelease
# Output: app/build/outputs/apk/release/app-release.apk

# 4. Verify signing
jarsigner -verify -verbose -certs app/build/outputs/bundle/release/app-release.aab

# 5. Upload to Google Play Console:
#    - https://play.google.com/console
#    - My apps → [App]
#    - Release → Create new release
#    - Upload app-release.aab
#    - Fill in release notes and submit
```

---

## Section 5: Versioning & Updates

### Update Version Number

File: `package.json`

```json
{
  "version": "1.0.0"
}
```

File: `capacitor.config.ts`

```typescript
const config: CapacitorConfig = {
  appId: 'com.techbridge.luxthumb',
  appName: 'LuxThumb Designer',
  // Version is read from package.json automatically
};
```

### iOS Version Update

File: `ios/App/App/Info.plist`

```xml
<key>CFBundleVersion</key>
<string>2</string>
<key>CFBundleShortVersionString</key>
<string>1.0.1</string>
```

**Note:** Build number increments; version string matches semver

### Android Version Update

File: `android/app/build.gradle`

```gradle
android {
    defaultConfig {
        applicationId "com.techbridge.luxthumb"
        minSdkVersion 26
        targetSdkVersion 34
        versionCode 2
        versionName "1.0.1"
    }
}
```

**Workflow for Updates:**
```bash
# 1. Update version in package.json
# 2. Rebuild: npm run build
# 3. Update iOS: Info.plist → CFBundleVersion + CFBundleShortVersionString
# 4. Update Android: build.gradle → versionCode + versionName
# 5. Rebuild: npm run build:ios && npm run build:android
# 6. Test on devices
# 7. Submit to respective app stores
```

---

## Section 6: Debugging

### iOS Debugging

**Console Logs:**
```bash
# Via Xcode
# Debug → Activate Breakpoints
# Debug → Pause Execution
# View → Debug Area → Show Console

# Or Safari Web Inspector
# Safari → Develop → [Device] → [App]
# View console logs and DOM
```

**Common Issues:**
```
❌ "Could not find Package.swift"
→ rm -rf ios/Pods && pod install

❌ "Code signing failed"
→ Xcode → Settings → Accounts → Re-authenticate Apple ID

❌ "Module not found"
→ Product → Clean Build Folder (Cmd+Shift+K)
→ Product → Build (Cmd+B)
```

### Android Debugging

**Console Logs:**
```bash
# View logcat
adb logcat

# Or in Android Studio
# View → Tool Windows → Logcat
```

**Common Issues:**
```
❌ "Gradle sync failed"
→ File → Sync Now
→ Or: cd android && ./gradlew clean

❌ "Build failed: symbol not found"
→ File → Invalidate Caches
→ ./gradlew clean && ./gradlew build

❌ "App crashes on launch"
→ adb logcat | grep "your-app-package"
→ Check for missing permissions in AndroidManifest.xml
```

---

## Section 7: Continuous Integration (CI/CD)

### GitHub Actions Example

Create: `.github/workflows/mobile-build.yml`

```yaml
name: Mobile Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: macos-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build web
        run: npm run build
      
      - name: Sync to iOS
        run: npx capacitor copy ios
      
      - name: Sync to Android
        run: npx capacitor copy android
      
      - name: Build Android AAB
        run: |
          cd android
          ./gradlew bundleRelease
      
      - name: Upload Android artifact
        uses: actions/upload-artifact@v3
        with:
          name: android-aab
          path: android/app/build/outputs/bundle/release/app-release.aab
```

---

## Section 8: Troubleshooting

### Clean Rebuild

```bash
# Complete clean
rm -rf dist node_modules pnpm-lock.yaml
npm install
npm run build

# Sync platforms
npx capacitor sync

# Test
npm run build:ios
npm run build:android
```

### Platform-Specific Issues

**iOS:**
```bash
# Force pod dependency update
cd ios && pod repo update && pod install && cd ..

# Verify Capacitor config
npx capacitor doctor

# Check provisioning profiles
security find-identity -v -p codesigning
```

**Android:**
```bash
# Update Gradle wrapper
cd android && ./gradlew wrapper --gradle-version 8.5 && cd ..

# Check SDK packages
sdkmanager --list_installed

# Verify keystore
keytool -list -v -keystore ~/.android/debug.keystore
```

---

## Section 9: Performance Optimization

### Bundle Size Reduction

Current sizes:
- Web build: ~370 KB gzipped
- iOS app: ~150 MB (includes frameworks)
- Android app: ~120 MB (includes libraries)

**Optimization strategies:**
1. Code splitting for large dependencies
2. Dynamic imports for AI features
3. Lazy-load Gemini API client
4. Optimize image assets

### Runtime Performance

**Monitor in native apps:**
- iOS: Instruments (Xcode → Product → Profile)
- Android: Android Profiler (Android Studio → Profiler)

**Web performance:**
```bash
npm run build
npm run preview
# Use Chrome DevTools → Lighthouse
```

---

## Deployment Timeline

### First Submission (1–2 weeks)

- Day 1–2: Prepare icons, screenshots, privacy policy
- Day 3: iOS submission (approval 3–5 days)
- Day 3: Android submission (approval 1–2 hours)
- Day 4–9: Review, address feedback
- Day 9–14: Resubmit if rejected, await final approval

### Updates (3–5 days)

- Day 1: Increment version, rebuild
- Day 1: iOS submission
- Day 1: Android submission
- Day 2–4: Approval process
- Day 4–5: Both available in stores

---

## Support & Resources

**Capacitor Docs:** https://capacitorjs.com/docs  
**Xcode Documentation:** https://developer.apple.com/documentation/xcode  
**Android Development:** https://developer.android.com  
**App Store Connect:** https://appstoreconnect.apple.com  
**Google Play Console:** https://play.google.com/console  

---

**Last Updated:** 10 May 2026  
**Maintained by:** Daniel Frempong Twum / TUC ICT  
**Next Review:** 10 August 2026

```

### FILE: docs/TESTING_GUIDE.md
```md
# LuxThumb Designer — Testing Guide

**Version:** 1.0  
**Date:** 9 May 2026  
**Framework:** Playwright (Browser Automation)  
**Coverage:** Integration tests for core flows and accessibility  

---

## 1. Overview

LuxThumb Designer uses **Playwright** for end-to-end testing. Tests cover:
- Core UI functionality (form submission, theme switching)
- Admin panel authentication and audit logging
- Export functionality (PNG, PDF, JPG, JSON)
- Accessibility (ARIA labels, focus, keyboard navigation)
- Responsive layout (desktop viewports)

---

## 2. Setup & Installation

### 2.1 Install Playwright
```bash
npm install --save-dev @playwright/test
```

### 2.2 Configure Playwright
File: `playwright.config.ts` (already configured)
```typescript
testDir: './tests',
fullyParallel: true,
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
},
use: {
  baseURL: 'http://localhost:3000',
  trace: 'on-first-retry',
}
```

### 2.3 Verify Installation
```bash
npx playwright --version
# Output: Version X.X.X
```

---

## 3. Running Tests

### 3.1 Run All Tests
```bash
npm test
```
- Starts dev server (port 3000) automatically
- Runs all test files in `tests/` directory
- Headless mode (no browser window visible)
- Generates HTML report in `playwright-report/`

### 3.2 Run Specific Test File
```bash
npm test -- tests/app.spec.ts
```

### 3.3 Run Tests in UI Mode (Recommended for Debugging)
```bash
npm test:ui
```
- Opens Playwright Inspector window
- Click test steps to step through execution
- Inspect DOM, network requests, console logs
- Very useful for understanding failures

### 3.4 Run Tests in Headed Mode (Visible Browser)
```bash
npx playwright test --headed
```
- Opens Chrome browser window
- Watch tests execute in real time
- Useful for visual verification

### 3.5 Run Single Test
```bash
npx playwright test -g "theme switching"
```
- Runs only tests matching "theme switching"

---

## 4. Test Structure

### 4.1 Test File Locations
```
tests/
├── app.spec.ts          (core UI, admin, theme, accessibility tests)
└── export.spec.ts       (export functionality tests)
```

### 4.2 Test Format (Playwright Example)
```typescript
import { test, expect } from '@playwright/test';

test.describe('Core Application', () => {
  test('should display LuxThumb Designer title', async ({ page }) => {
    await page.goto('/');
    const title = page.locator('h1');
    await expect(title).toContainText('LuxThumb Designer');
  });
});
```

---

## 5. Current Test Suite

### 5.1 Core Application Tests (`tests/app.spec.ts`)

#### Test: Page Title
```typescript
test('should load with correct page title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/LuxThumb Designer/);
});
```

#### Test: Aspect Ratio Selection
```typescript
test('should apply correct styling to selected aspect ratio', async ({ page }) => {
  await page.goto('/');
  const ratioButton = page.locator('button', { hasText: '4:5' });
  await ratioButton.click();
  await expect(ratioButton).toHaveClass(/border-\[#C9A84C\]/);
});
```

#### Test: Form Input
```typescript
test('should fill brand name input field', async ({ page }) => {
  await page.goto('/');
  const input = page.locator('input[placeholder*="Fancy Homes"]');
  await input.fill('My Brand');
  await expect(input).toHaveValue('My Brand');
});
```

### 5.2 Admin Panel Tests

#### Test: Admin Authentication
```typescript
test('should show audit dashboard after correct password', async ({ page }) => {
  await page.goto('/');
  const adminButton = page.locator('button[aria-label="Open admin panel"]');
  await adminButton.click();
  
  const passwordInput = [REDACTED_CREDENTIAL]
  await passwordInput.fill('admin123');
  
  const loginButton = page.locator('button', { hasText: 'Login' });
  await loginButton.click();
  
  const dashboard = page.locator('text=Audit Dashboard');
  await expect(dashboard).toBeVisible();
});
```

#### Test: Admin Logout
```typescript
test('should logout from admin panel', async ({ page }) => {
  // ... login first ...
  
  const logoutButton = page.locator('button[aria-label="Logout from admin panel"]');
  await logoutButton.click();
  
  const adminButton = page.locator('button[aria-label="Open admin panel"]');
  await expect(adminButton).toBeVisible();
});
```

### 5.3 Theme Switching Tests

#### Test: Theme Toggle
```typescript
test('should switch to light theme', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityButton = page.locator('button[aria-label*="accessibility"]');
  await accessibilityButton.click();
  
  const lightThemeButton = page.locator('button', { hasText: 'Light' });
  await lightThemeButton.click();
  
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'light');
});
```

#### Test: Theme Persistence
```typescript
test('should persist theme to localStorage and restore on reload', async ({ page }) => {
  await page.goto('/');
  
  // Set theme to light
  await page.locator('button[aria-label*="accessibility"]').click();
  await page.locator('button', { hasText: 'Light' }).click();
  
  // Verify localStorage
  const theme = await page.evaluate(() => localStorage.getItem('luxthumb-theme'));
  expect(theme).toBe('light');
  
  // Reload page and verify theme is restored
  await page.reload();
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'light');
});
```

### 5.4 Accessibility Tests

#### Test: ARIA Labels
```typescript
test('should have aria-label on all control buttons', async ({ page }) => {
  await page.goto('/');
  
  const buttons = page.locator('button[aria-label]');
  const count = await buttons.count();
  expect(count).toBeGreaterThan(0);
});
```

#### Test: Admin Password Input Accessibility
```typescript
test('should have aria-label on admin password input', async ({ page }) => {
  await page.goto('/');
  const adminButton = page.locator('button[aria-label="Open admin panel"]');
  await adminButton.click();
  
  const input = page.locator('#admin-password');
  await expect(input).toHaveAttribute('aria-label', /password/i);
});
```

### 5.5 Export Tests (`tests/export.spec.ts`)

#### Test: PNG Export
```typescript
test('export png does not fail', async ({ page }) => {
  await page.goto('/');
  
  // Fill required field
  await page.getByPlaceholder(/e.g. Confident CEO/).fill('Test Subject');
  
  // Wait for download and verify
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('button', { hasText: 'PNG' }).click()
  ]);
  
  const path = await download.path();
  const stat = fs.statSync(path!);
  expect(stat.size).toBeGreaterThan(100);
});
```

---

## 6. Test Commands Cheat Sheet

| Command | Purpose |
|---|---|
| `npm test` | Run all tests (headless) |
| `npm test:ui` | Run tests in UI mode (interactive) |
| `npx playwright test --headed` | Run tests with visible browser |
| `npx playwright test -g "pattern"` | Run tests matching pattern |
| `npx playwright test tests/app.spec.ts` | Run specific test file |
| `npx playwright test --debug` | Run single test in debug mode |
| `npx playwright codegen http://localhost:3000` | Record test interactions (generate code) |

---

## 7. Manual Testing Checklist

Use this checklist for features not covered by automated tests:

### 7.1 Configuration Input
- [ ] Type in brand name → appears in canvas
- [ ] Upload logo image → appears in canvas top-left
- [ ] Upload background image → appears behind content
- [ ] Adjust background zoom/offset sliders → canvas updates live
- [ ] Upload subject image → appears right side of canvas
- [ ] Adjust subject zoom/offset → canvas updates live
- [ ] Edit headline, subheadline, tagline → canvas updates
- [ ] Add feature icons → appears in canvas

### 7.2 AI Prompt Generation
- [ ] Click "Engage Engine" → shows loading spinner
- [ ] Wait for Gemini API response → prompts appear below canvas
- [ ] Copy Midjourney prompt → text copied to clipboard
- [ ] Copy Imagen 3 prompt → text copied to clipboard
- [ ] Copy Motion Extension → text copied to clipboard
- [ ] Invalid API key → error alert shown (not crash)

### 7.3 Export
- [ ] PNG export → file downloads correctly
- [ ] JPG export → file downloads correctly
- [ ] PDF export → file downloads correctly
- [ ] JSON export → file contains all form data
- [ ] Filename sanitisation → special characters removed

### 7.4 Design History
- [ ] Save design → appears in history list
- [ ] Load design → restores all form inputs
- [ ] Delete design → removed from history
- [ ] Multiple designs → all visible in history list

### 7.5 Admin Panel
- [ ] Admin button visible → click opens login dialog
- [ ] Wrong password → clears input, stays on login
- [ ] Correct password → shows audit dashboard
- [ ] Dashboard stats → totals match logged actions
- [ ] Expand log entry → shows full details
- [ ] Export JSON → downloads audit log file
- [ ] Export CSV → downloads audit log in spreadsheet format
- [ ] Clear all logs → confirmation dialog, then clears
- [ ] Logout → closes admin panel

### 7.6 Accessibility
- [ ] Theme switcher → Dark/Light/High-Contrast work
- [ ] Font size adjuster → Small/Normal/Large/Extra-Large apply
- [ ] Reduced motion toggle → animations stop
- [ ] Keyboard navigation → Tab through all inputs, Enter submits
- [ ] Focus indicators → Visible gold outline on focused elements
- [ ] Screen reader → Page structure readable (h1, labels, descriptions)

### 7.7 Responsive Design
- [ ] Desktop (1920×1080) → layout optimal
- [ ] Tablet (1024×1366, iPad) → sidebar collapses or scales
- [ ] Mobile (375×667, iPhone) → not required, but doesn't crash

---

## 8. Debugging Failed Tests

### 8.1 Enable Debug Mode
```bash
npx playwright test --debug
```
- Launches test in debug mode
- Inspector window shows each step
- Inspect page DOM, network, console logs

### 8.2 View Test Report
After test run:
```bash
npx playwright show-report
```
- Opens HTML report in browser
- Click failed test to see screenshot, trace, logs

### 8.3 Common Failures

| Error | Likely Cause | Solution |
|---|---|---|
| `Timeout waiting for locator` | Element not found on page | Verify selector is correct; check page loaded |
| `Expected toHaveValue('...')` but got `undefined` | Input not filled | Add `await page.waitForLoadState()` |
| `API key error (401)` | Invalid Gemini API key in `.env` | Update `.env.local` with valid key |
| `Theme not persisting` | LocalStorage not set | Check theme.css is imported; verify localStorage getter/setter |

### 8.4 Check Console Logs
```bash
npx playwright test --reporter=list
```
- Verbose output with console logs from browser
- Search for error messages from app

---

## 9. CI/CD Integration

### 9.1 GitHub Actions (Example)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v2
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### 9.2 Local Pre-Commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

---

## 10. Best Practices

1. **Test Isolation:** Each test should be independent (no shared state)
2. **Explicit Waits:** Use `waitForLoadState()`, `waitForEvent()` instead of `sleep()`
3. **Descriptive Names:** Test names should clearly state what they verify
4. **Fast Feedback:** Run quick tests locally before pushing (use `-g` for pattern matching)
5. **Visual Debugging:** Use `page.screenshot()` to capture state during test
6. **Error Messages:** Add context to assertions: `expect(x).toBe(y, 'reason why')`
7. **Headless Efficiency:** Run headless in CI; use headed/UI mode only for debugging

---

## 11. Adding New Tests

### 11.1 Test Template
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something specific', async ({ page }) => {
    // Arrange: Set up page state
    await page.goto('/');
    
    // Act: Perform user action
    await page.locator('button').click();
    
    // Assert: Verify result
    await expect(page.locator('div')).toContainText('Success');
  });
});
```

### 11.2 Common Selectors
```typescript
// By text
page.locator('button', { hasText: 'Login' });

// By placeholder
page.getByPlaceholder('Enter email');

// By aria-label
page.locator('[aria-label="Close"]');

// By test ID (add data-testid="..." to HTML)
page.locator('[data-testid="admin-button"]');

// By CSS class
page.locator('.btn-primary');

// By ID
page.locator('#my-input');
```

---

## 12. Additional Resources

- **Playwright Docs:** https://playwright.dev/
- **SRS:** `docs/TUC-ICT-SRS-2026-LUXTHUMB.md`
- **Admin Guide:** `docs/ADMIN_GUIDE.md`
- **Deployment:** `docs/DEPLOYMENT_GUIDE.md`

---

**Test Owner:** Development Team  
**Last Updated:** 9 May 2026  
**Maintenance:** Add tests for new features before merge

```

### FILE: docs/TUC-ICT-SRS-2026-LUXTHUMB.md
```md
# Software Requirements Specification
## LuxThumb Designer — AI-Powered Thumbnail Generation

**Document ID:** TUC-ICT-SRS-2026-LUXTHUMB-001  
**Version:** 1.0  
**Date:** 9 May 2026  
**Status:** Approved  
**Organisation:** Techbridge University College (TUC)  
**Author:** Daniel Frempong Twum  
**Prepared by:** ICT Department  

---

## 1. Introduction

### 1.1 Purpose
This specification defines the requirements for LuxThumb Designer, a web-based AI-powered thumbnail design tool that generates professional, cinematic visual assets and image prompts for social media, advertising, and editorial content.

### 1.2 Scope
LuxThumb Designer encompasses:
- A React-based single-page application (SPA) for UI design and configuration
- Integration with Google Gemini AI API for prompt generation
- Export functionality (PNG, PDF, JPG, JSON configuration)
- Design history and persistence via IndexedDB
- Admin dashboard with audit logging
- Accessibility controls (theme switcher, font size adjuster, reduced motion support)
- Responsive design supporting desktop and tablet viewports

Out of scope:
- Mobile app native implementations (web-only)
- Direct AI image generation (prompt generation only)
- Multi-user collaboration or team features
- Custom AI model training

### 1.3 Document Conventions
- **SHALL** = mandatory requirement
- **SHOULD** = recommended, not mandatory
- **MAY** = optional
- Aspect ratios: `4:5` (Social Feed), `9:16` (Story/Reel), `1:1` (Square), `16:9` (Web/Video)
- Brand colours: Gold (`#C9A84C`), Deep Black (`#050505`), White (`#F5F5F5`)

---

## 2. Overall Description

### 2.1 Product Perspective
LuxThumb Designer is part of the Techbridge University College ICT platform, operated as a cloud-hosted SPA at `luxthumb.techbridge.edu.gh`. It integrates with Google Gemini AI (via `@google/genai` SDK) and relies on client-side rendering with IndexedDB for persistence.

### 2.2 Product Features

#### 2.2.1 Design Configuration Module
Users input brand details and visual parameters:
- Brand name and logo (image upload or description)
- Headline (two-line structure: white primary, gold secondary)
- Subheadline and feature list (icons with optional images)
- Background scene description and custom image upload
- Foreground subject description and optional image
- Tagline bar and aspect ratio selection

#### 2.2.2 AI Prompt Generation
Using Gemini AI, the app generates:
- **Midjourney prompt** — optimised for Midjourney v6 image generation
- **Imagen 3 / DALL-E prompt** — alternative image prompt format
- **Canva creative brief** — human-readable design brief
- **Typography specification** — font recommendations and hierarchy
- **Colour palette** — hex codes for background, gold primary, gold accent, white text
- **Animated extension** — Sora/Veo video loop extension prompt

#### 2.2.3 Export & Download
Users can export in multiple formats:
- PNG (2x scale, transparent background handling)
- JPG (90% quality, opaque background)
- PDF (single page, orientation auto-detected)
- JSON configuration (all design parameters)

#### 2.2.4 Design History & Persistence
- Auto-save design state to IndexedDB (`luxthumb_design_data`)
- Manual design snapshots (`luxthumb_saved_designs`) with restore capability
- Design deletion from history

#### 2.2.5 Admin Panel
- Password-protected access (credentials: `admin123`)
- Audit dashboard displaying:
  - Total audit log entries
  - Design saves, exports, deletions (aggregated counts)
  - Last activity timestamp
  - Expandable log entries with full details (timestamp, action, user agent, ID)
- Audit log export (JSON, CSV)
- Clear audit logs (with confirmation)

#### 2.2.6 Accessibility & Theming
- **Theme switcher:** Dark (default), Light, High-Contrast
- **Font size adjuster:** Small (85%), Normal (100%), Large (115%), Extra Large (130%)
- **Reduced motion toggle:** Disables animations for motion-sensitive users
- **Persistence:** Settings stored in localStorage, applied on page load
- **WCAG AA compliance:** Focus indicators, colour contrast, keyboard navigation

---

## 3. Functional Requirements

### 3.1 Configuration Inputs

| Input | Type | Required | Constraints |
|---|---|---|---|
| Brand Name | Text | Yes | Max 50 chars |
| Logo Description | Text | No | Max 100 chars |
| Logo Image | File | No | PNG, JPG, GIF; max 5MB |
| Headline L1 | Text | Yes | Max 20 chars |
| Headline L2 | Text | Yes | Max 20 chars |
| Subheadline | Text | No | Max 50 chars |
| Background Scene | Text | Yes | Max 300 chars |
| Background Image | File | No | PNG, JPG; max 10MB |
| Foreground Subject | Text | Yes | Max 300 chars (detailed description required) |
| Subject Image | File | No | PNG, JPG; max 10MB |
| Feature Entries | Text array | No | 3 entries, max 30 chars each |
| Feature Images | File array | No | 3 optional PNG/JPG; max 2MB each |
| Tagline Bar | Text | No | Max 100 chars |
| Aspect Ratio | Selection | Yes | One of: `4:5`, `9:16`, `1:1`, `16:9` |

### 3.2 AI Prompt Generation

**Requirement 3.2.1 — System Instruction Adherence**
The Gemini AI SHALL use the system instruction defining:
- Design philosophy: Cinematic dark luxury
- Mood: Authoritative, aspirational, high-converting
- Colour language: Deep blacks + gold + bright white
- Composition: Portrait poster with bold headlines, background scene, right-aligned subject, icon list (lower-left), tagline bar (bottom)
- Lighting: Sharp rim lighting, Chiaroscuro/Rembrandt key lighting, golden-hour accents on subject

**Requirement 3.2.2 — Output Format**
Gemini SHALL return a JSON object with structure:
```json
{
  "midjourney": "prompt string",
  "imagen3": "prompt string",
  "canvaBrief": "brief string",
  "typographySpec": { "headline": "...", "subheadline": "...", "icons": "...", "tagline": "..." },
  "colorPalette": { "background": "#...", "goldPrimary": "#...", "goldAccent": "#...", "whiteText": "#..." },
  "animatedExtension": "prompt string"
}
```

**Requirement 3.2.3 — Error Handling**
If Gemini API fails:
- Display user-friendly error: "Failed to generate prompts. Check your API key."
- Log error to console
- Do not crash the application
- Remain on the configuration screen

### 3.3 Export Functions

**Requirement 3.3.1 — PNG Export**
- Render thumbnail canvas at 2x scale
- Remove border/shadow before export (visual artifacts prevention)
- Restore border/shadow after export
- Filename: `{BrandName}_thumbnail.png` (sanitised)
- Failure → user alert with error message

**Requirement 3.3.2 — PDF Export**
- Detect orientation from aspect ratio (portrait for 4:5, 9:16; landscape for 16:9)
- Embed PNG snapshot as single page
- Filename: `{BrandName}_thumbnail.pdf`

**Requirement 3.3.3 — JPG Export**
- Render at 90% quality
- Opaque background (#0A0A0A)
- Filename: `{BrandName}_thumbnail.jpg`

**Requirement 3.3.4 — JSON Export**
- Export entire `ThumbnailData` object (all inputs)
- Filename: `luxthumb_ad_config.json`
- Used for round-trip design loading

### 3.4 Audit Logging

**Requirement 3.4.1 — Logged Actions**
The following user actions SHALL be logged to IndexedDB (`luxthumb_audit_logs`):
- `design_save` — design snapshot created
- `design_delete` — design removed from history
- `export_format_png` — PNG downloaded
- `export_format_pdf` — PDF downloaded
- `export_format_jpg` — JPG downloaded
- `export_format_json` — JSON config downloaded

**Requirement 3.4.2 — Log Structure**
Each log entry SHALL include:
- Unique ID (`log_{timestamp}_{random}`)
- Timestamp (milliseconds since epoch)
- Action type
- Details (human-readable description, e.g. "PNG exported: NEXUS_AI_thumbnail.png")
- User agent metadata (first 100 chars of `navigator.userAgent`)

**Requirement 3.4.3 — Log Retention**
- Maximum 1000 log entries per session
- Oldest entries purged when limit exceeded
- Admin dashboard allows manual clear (with confirmation)

### 3.5 Admin Panel

**Requirement 3.5.1 — Authentication**
- Password: `admin123` (demo; in production use environment-based secrets)
- Accessed via "Admin" button in main sidebar
- Prompts for password in modal dialog
- On correct password: show AdminPanel component
- On incorrect password: clear input, focus password field

**Requirement 3.5.2 — Dashboard Display**
Admin panel SHALL display:
- Total audit log entries (count)
- Design saves (filtered count)
- Exports (filtered count)
- Last activity timestamp (most recent log)
- Expandable audit log table with timestamp, action, details for each entry

**Requirement 3.5.3 — Export Logs**
- JSON export: `luxthumb_audit_logs_{date}.json`
- CSV export: `luxthumb_audit_logs_{date}.csv` with headers (Timestamp, Action, Details)
- Export buttons disabled if no logs exist

**Requirement 3.5.4 — Logout**
- Logout button clears authentication state
- Returns to main app (admin button becomes visible again)

### 3.6 Accessibility

**Requirement 3.6.1 — Theme Support**
- Dark theme (default): #050505 background, #F5F5F5 text, #C9A84C gold
- Light theme: #FFFFFF background, #050505 text, #C9A84C gold
- High-contrast theme: #000000 background, #FFFFFF text, #FFFF00 gold
- Theme persisted to `localStorage` key `luxthumb-theme`
- Theme applied via `[data-theme]` attribute on `<html>` element
- CSS variables scoped by theme for all components

**Requirement 3.6.2 — Font Size**
- Options: Small (85%), Normal (100%), Large (115%), Extra Large (130%)
- Applied via root `font-size` property
- Persisted to `localStorage` key `luxthumb-font-size`

**Requirement 3.6.3 — Reduced Motion**
- Toggle to reduce/disable CSS animations
- When enabled: animation duration → 0.01ms, transition duration → 0.01ms
- Persisted to `localStorage` key `luxthumb-reduced-motion`

**Requirement 3.6.4 — WCAG Compliance**
- All interactive elements have `aria-label` attributes
- All buttons, inputs have visible focus indicators (outline: 2px gold)
- Colour is not the only means of conveying information (icons + text)
- Text contrast ratios meet WCAG AA standard (4.5:1 for body text, 3:1 for large text)
- Keyboard-only navigation supported (Tab, Enter, Space, Escape)

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Page load time: < 3 seconds on 5 Mbps connection (with Gemini API latency excluded)
- Thumbnail canvas render time: < 500ms
- Theme switching: instant (< 100ms perceived)
- Export generation: < 10 seconds (PNG at 2x scale)

### 4.2 Compatibility
- **Browsers:** Chrome 120+, Firefox 115+, Safari 17+, Edge 120+
- **Viewport:** 1024×768 minimum (desktop); tablet support (iPad, 1024×1366)
- **Mobile:** Not required (design-focused tool; desktop UX expected)

### 4.3 Security
- API Key (`GEMINI_API_KEY`) loaded from environment; never exposed in client code
- Admin password `admin123` is demo-only; production SHALL use hashed comparison or OAuth
- No user authentication required (public-facing); audit logs for transparency
- HTTPS enforced on production domain (`luxthumb.techbridge.edu.gh`)
- Content Security Policy (CSP) headers recommended for image/font loading

### 4.4 Reliability
- IndexedDB graceful fallback: if unavailable, warn user but allow session-only operation
- Gemini API failure → user alert; app remains usable (prompts not generated)
- Export failures caught and reported to user with error details
- No data loss on browser refresh (IndexedDB persists automatically)

### 4.5 Maintainability
- TypeScript strict mode enabled
- Components modular and documented
- Gemini system instruction centralised in `geminiService.ts`
- Tests cover core flows: admin auth, theme switching, exports, accessibility

---

## 5. External Interfaces

### 5.1 Google Gemini AI API
**Endpoint:** `@google/genai` SDK  
**Model:** `gemini-3-flash-preview`  
**Request Type:** `generateContent` with JSON response  
**Response Mime Type:** `application/json`  
**Error Handling:** Catch and display user-friendly error  

### 5.2 Browser APIs Used
- **IndexedDB (`idb-keyval`):** Persistent storage for design data, saved designs, audit logs
- **Canvas API (html2canvas-pro, jsPDF):** Export rendering
- **File API:** Image upload and download
- **LocalStorage:** Theme and accessibility settings persistence
- **Navigator API:** User agent detection for audit logs

---

## 6. Design & Architecture

### 6.1 Component Structure
```
App.tsx (main state container)
├── AdminPanel.tsx (password gated)
├── AccessibilityPanel.tsx (theme/font/motion settings)
└── Thumbnail Canvas (preview area with background, subject, text overlays)
```

### 6.2 Data Model
```typescript
ThumbnailData {
  brandName, logoDescription, logoImage,
  headlineLine1, headlineLine2, subheadline,
  backgroundScene, backgroundImage, bgZoom, bgX, bgY,
  foregroundSubject, subjectImage, subjectZoom, subjectX, subjectY,
  featureIcons, featureImages,
  taglineBar, aspectRatio
}

GeneratedPrompts {
  midjourney, imagen3, canvaBrief,
  typographySpec, colorPalette, animatedExtension
}

SavedDesign {
  id, timestamp, name, data (ThumbnailData)
}

AuditLog {
  id, timestamp, action, details, ipMetadata
}
```

### 6.3 Persistence
| Store | Key | Format | Purpose |
|---|---|---|---|
| IndexedDB | `luxthumb_design_data` | ThumbnailData | Current design (auto-save) |
| IndexedDB | `luxthumb_saved_designs` | SavedDesign[] | Design history |
| IndexedDB | `luxthumb_audit_logs` | AuditLog[] | Admin audit trail |
| LocalStorage | `luxthumb-theme` | 'dark' \| 'light' \| 'high-contrast' | Theme preference |
| LocalStorage | `luxthumb-font-size` | 'small' \| 'normal' \| 'large' \| 'extra-large' | Font size |
| LocalStorage | `luxthumb-reduced-motion` | 'true' \| 'false' | Motion preference |

---

## 7. Testing Requirements

### 7.1 Unit Tests (TypeScript)
- `generateThumbnailPrompts()` handles API success and failure
- `recordAuditLog()` creates and persists log entries
- Theme CSS variables resolve for all three themes

### 7.2 Integration Tests (Playwright)
- Core flow: fill form, click "Engage Engine", verify output
- Admin flow: click admin button, enter password, view logs
- Theme switching: select theme, verify `data-theme` attribute, reload, confirm persistence
- Export flow: fill form (subject required), click PNG/PDF/JPG/JSON, verify download
- Accessibility: verify `aria-label` on all buttons, `lang="en"` on html, focus indicators visible

### 7.3 Manual Tests
- Visual check: thumbnail preview reflects all input changes in real-time
- Gemini API integration: valid prompts generated for realistic brand inputs
- Admin audit logs: verify all actions logged (design save, export, delete)
- Theme transition: no visual flicker on theme change
- Mobile viewport: responsive layout on iPad (1024×1366)

---

## 8. Deployment & Operations

### 8.1 Hosting
- Platform: Cloud Run (Google Cloud) or Plesk/Ubuntu server at `66.226.72.199`
- Domain: `luxthumb.techbridge.edu.gh`
- SSL/TLS: HTTPS enforced
- Environment variables: `GEMINI_API_KEY`, `APP_URL` (injected at runtime)

### 8.2 Build & Release
- Build tool: Vite 6
- Release command: `npm run build` → produces `dist/` directory
- Deployment: Copy `dist/` to Plesk public_html or Cloud Run container
- Version: Semantic versioning (e.g. 1.0.0)

### 8.3 Monitoring
- Client-side error logging to console (browser DevTools)
- Google Analytics tracking ID: `G-FKXTELQ71R`
- Audit logs stored client-side (admin panel export for review)
- No server-side logging (SPA-only; logs in IndexedDB)

---

## 9. Glossary

| Term | Definition |
|---|---|
| **Gemini AI** | Google's generative AI model (`gemini-3-flash-preview`) |
| **Cinematic** | High-contrast, dramatic lighting style for thumbnail design |
| **Editorial** | Professional, polished design aesthetic (not playful or casual) |
| **Rim Lighting** | Backlighting that separates subject from background |
| **Chiaroscuro** | High-contrast light/shadow technique (Italian: "light-dark") |
| **Rembrandt Lighting** | Asymmetrical key lighting creating a small triangular catchlight in shadow side of face |
| **IndexedDB** | Browser's NoSQL database for client-side persistence |
| **Audit Trail** | Immutable log of all user actions for compliance and transparency |

---

## 10. Sign-Off

| Role | Name | Date | Signature |
|---|---|---|---|
| Author | Daniel Frempong Twum | 9 May 2026 | ✓ Approved |
| Department Head | ICT Department | 9 May 2026 | ✓ Approved |
| Project Manager | Techbridge University College | 9 May 2026 | ✓ Approved |

---

**Document Classification:** TUC Internal | **Review Cycle:** Annual | **Last Reviewed:** 9 May 2026

```

### FILE: index.html
```html
<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <!-- TUC Standard Meta Tags -->
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO Meta Tags -->
    <title>LuxThumb Designer | AI-Powered Thumbnail Generation</title>
    <meta name="description" content="LuxThumb Designer: Generate premium AI-powered thumbnail designs with Gemini AI integration. Create cinematic, luxury editorial visuals for social media and marketing." />
    <meta name="keywords" content="thumbnail generator, AI design, Gemini API, luxury branding, editorial design, social media graphics, advertising" />
    <meta name="author" content="Daniel Frempong Twum, Techbridge University College (TUC)" />
    <meta name="publisher" content="Techbridge University College" />
    <meta name="canonical" href="https://luxthumb.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

    <!-- Geographic Meta Tags -->
    <meta name="geo.region" content="GH-GA" />
    <meta name="geo.placename" content="Oyibi, Greater Accra" />
    <meta name="geo.position" content="5.6529;-0.0756" />

    <!-- Open Graph Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://luxthumb.techbridge.edu.gh/" />
    <meta property="og:title" content="LuxThumb Designer | AI-Powered Thumbnail Generation" />
    <meta property="og:description" content="Generate premium AI-powered thumbnail designs with Gemini AI integration. Create cinematic, luxury editorial visuals." />
    <meta property="og:image" content="https://luxthumb.techbridge.edu.gh/og-image.png" />
    <meta property="og:locale" content="en_GB" />
    <meta property="og:site_name" content="LuxThumb Designer" />

    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TecBridgeUni" />
    <meta name="twitter:creator" content="@KudjoTwum" />
    <meta name="twitter:title" content="LuxThumb Designer | AI-Powered Thumbnail Generation" />
    <meta name="twitter:description" content="Generate premium AI-powered thumbnail designs with Gemini AI integration." />
    <meta name="twitter:image" content="https://luxthumb.techbridge.edu.gh/og-image.png" />

    <!-- Theme & Branding -->
    <meta name="theme-color" content="#C9A84C" />
    <meta name="msapplication-TileColor" content="#050505" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <meta name="copyright" content="Copyright 2026 Techbridge University College" />

    <!-- Font Preconnection -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Outfit:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-FKXTELQ71R"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-FKXTELQ71R');
    </script>

    <!-- Theme Persistence & Auto-Apply -->
    <script>
      (function() {
        const theme = localStorage.getItem('luxthumb-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const effectiveTheme = theme || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', effectiveTheme);
      })();
    </script>

    <!-- Main Styles -->
    <style>
      :root {
        --color-background-main: #050505;
        --color-background-secondary: #0A0A0A;
        --color-background-tertiary: #0F0F0F;
        --color-background-quaternary: #111111;
        --color-foreground: #F5F5F5;
        --color-foreground-secondary: #C9C9C9;
        --color-foreground-muted: #999999;
        --color-primary: #C9A84C;
        --color-primary-hover: #D4B96A;
        --color-primary-active: #B89836;
        --color-accent: #1A1A1A;
        --color-accent-subtle: #2A2A2A;
        --color-border: #2A2A2A;
        --color-border-subtle: #1A1A1A;
        --color-success: #22C55E;
        --color-error: #EF4444;
        --color-warning: #F59E0B;
        --color-info: #3B82F6;
        --transition-fast: 0.15s ease;
        --transition-normal: 0.3s ease;
        --transition-slow: 0.5s ease;
      }

      [data-theme='dark'] {
        --color-background-main: #050505;
        --color-background-secondary: #0A0A0A;
        --color-background-tertiary: #0F0F0F;
        --color-background-quaternary: #111111;
        --color-foreground: #F5F5F5;
        --color-foreground-secondary: #C9C9C9;
        --color-foreground-muted: #999999;
        --color-primary: #C9A84C;
        --color-primary-hover: #D4B96A;
        --color-primary-active: #B89836;
        --color-accent: #1A1A1A;
        --color-accent-subtle: #2A2A2A;
        --color-border: #2A2A2A;
        --color-border-subtle: #1A1A1A;
      }

      [data-theme='light'] {
        --color-background-main: #FFFFFF;
        --color-background-secondary: #F5F5F5;
        --color-background-tertiary: #EEEEEE;
        --color-background-quaternary: #E5E5E5;
        --color-foreground: #050505;
        --color-foreground-secondary: #333333;
        --color-foreground-muted: #666666;
        --color-primary: #C9A84C;
        --color-primary-hover: #D4B96A;
        --color-primary-active: #B89836;
        --color-accent: #E5E5E5;
        --color-accent-subtle: #CCCCCC;
        --color-border: #CCCCCC;
        --color-border-subtle: #E5E5E5;
      }

      [data-theme='high-contrast'] {
        --color-background-main: #000000;
        --color-background-secondary: #1A1A1A;
        --color-background-tertiary: #333333;
        --color-background-quaternary: #4D4D4D;
        --color-foreground: #FFFFFF;
        --color-foreground-secondary: #E5E5E5;
        --color-foreground-muted: #CCCCCC;
        --color-primary: #FFFF00;
        --color-primary-hover: #FFFFCC;
        --color-primary-active: #CCCC00;
        --color-accent: #FFFFFF;
        --color-accent-subtle: #E5E5E5;
        --color-border: #FFFFFF;
        --color-border-subtle: #CCCCCC;
      }

      body {
        margin: 0;
        padding: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background-color: var(--color-background-main);
        color: var(--color-foreground);
        transition: background-color var(--transition-normal), color var(--transition-normal);
        overflow: hidden;
      }

      #root {
        width: 100%;
        height: 100vh;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideIn {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .animate-fade-in {
        animation: fadeIn var(--transition-normal) ease;
      }

      .animate-slide-in {
        animation: slideIn var(--transition-normal) ease;
      }

      .font-playfair {
        font-family: 'Playfair Display', ui-serif, Georgia, serif;
      }

      .font-outfit {
        font-family: 'Outfit', sans-serif;
      }

      .font-space-grotesk {
        font-family: 'Space Grotesk', monospace;
      }

      /* Scrollbar Styling */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: var(--color-background-secondary);
      }

      ::-webkit-scrollbar-thumb {
        background: var(--color-accent-subtle);
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: var(--color-foreground-muted);
      }

      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }

      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    </style>
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
  "name": "LuxThumb Agent",
  "description": "Professional AI-powered thumbnail design agent for cinematic luxury brands. Generates high-converting visual prompts and specs.",
  "requestFramePermissions": [],
  "majorCapabilities": []
}

```

### FILE: nginx.conf
```conf
# nginx configuration for luxthumb-agent SPA
# Serves static files and routes all other requests to index.html

server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  # Gzip compression
  gzip on;
  gzip_types text/plain text/css text/javascript application/json application/javascript;
  gzip_min_length 1000;

  # Security headers
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;

  # Cache control for assets
  location ~* ^/assets/.*\.(js|css|png|jpg|jpeg|gif|svg|webp)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # Cache control for index.html (never cache HTML)
  location = /index.html {
    expires -1;
    add_header Cache-Control "public, must-revalidate";
  }

  # SPA routing: rewrite non-file requests to index.html
  location / {
    # Check if file exists; if not, rewrite to index.html
    try_files $uri $uri/ /index.html;
  }

  # Deny access to hidden files
  location ~ /\. {
    deny all;
  }
}

```

### FILE: package.json
```json
{
  "name": "luxthumb-agent",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "build:web": "vite build && npm run sync:mobile",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "lint": "tsc --noEmit",
    "sync:mobile": "capacitor copy ios && capacitor copy android",
    "build:ios": "npm run build:web && npx capacitor build ios",
    "build:android": "npm run build:web && npx capacitor build android",
    "ios:open": "open ios/App/App.xcworkspace",
    "android:open": "open android",
    "mobile:sync": "capacitor sync"
  },
  "dependencies": {
    "@capacitor/android": "^8.3.3",
    "@capacitor/ios": "^8.3.3",
    "@google/genai": "^1.29.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "html2canvas-pro": "^2.0.2",
    "idb-keyval": "^6.2.2",
    "jspdf": "^4.2.1",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^6.2.3"
  },
  "devDependencies": {
    "@capacitor/cli": "^8.3.3",
    "@capacitor/core": "^8.3.3",
    "@playwright/test": "^1.59.1",
    "@types/express": "^4.17.21",
    "@types/node": "^22.19.18",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.3"
  }
}

```

### FILE: playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/166faa11-a917-44af-be7f-cd461fd6acc5

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
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { get, set } from 'idb-keyval';
import {
  Sparkles,
  Copy,
  Check,
  Send,
  Layout,
  Palette,
  Type as FontIcon,
  Image as ImageIcon,
  ChevronRight,
  Info,
  Upload,
  Download,
  Save,
  History,
  X,
  RotateCcw,
  Settings,
  Shield
} from 'lucide-react';
import { generateThumbnailPrompts } from './services/geminiService';
import { ThumbnailData, GeneratedPrompts, SavedDesign } from './types';
import { AdminPanel, recordAuditLog } from './components/AdminPanel';
import { AccessibilityPanel } from './components/AccessibilityPanel';

const INITIAL_DATA: ThumbnailData = {
  brandName: 'NEXUS AI',
  logoDescription: 'Minimalist geometric N',
  logoImage: null,
  headlineLine1: 'AI',
  headlineLine2: 'MASTERCLASS',
  subheadline: 'UNLOCK FUTURE GROWTH',
  backgroundScene: 'Futuristic server room with glowing cyan and purple fiber optic data streams.',
  backgroundImage: null,
  bgZoom: 100,
  bgX: 50,
  bgY: 50,
  foregroundSubject: 'Charismatic tech executive presenting, pointing at futuristic holographic data, sharp cinematic lighting.',
  subjectImage: null,
  subjectZoom: 100,
  subjectX: 50,
  subjectY: 50,
  featureIcons: ['Machine Learning', 'Data Strategy', 'Scale Fast'],
  featureImages: [null, null, null],
  taglineBar: 'PROMPT ENGINEERING & BEYOND',
  aspectRatio: '4:5'
};

export default function App() {
  const [data, setData] = useState<ThumbnailData>(INITIAL_DATA);
  const [generated, setGenerated] = useState<GeneratedPrompts | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  useEffect(() => {
    get('luxthumb_design_data').then((savedData) => {
      if (savedData) {
        setData(savedData);
      }
      setIsLoaded(true);
    }).catch((err) => {
      console.error("Failed to load design data from IndexedDB", err);
      setIsLoaded(true);
    });

    get('luxthumb_saved_designs').then((designs) => {
      if (designs) setSavedDesigns(designs);
    });
  }, []);

  useEffect(() => {
    if (isLoaded) {
      set('luxthumb_design_data', data).catch((err) => {
        console.error("Failed to save design data to IndexedDB", err);
      });
    }
  }, [data, isLoaded]);

  const saveCurrentDesign = async () => {
    const newDesign: SavedDesign = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      name: data.brandName || 'Untitled Design',
      data: { ...data }
    };
    const updated = [newDesign, ...savedDesigns];
    setSavedDesigns(updated);
    set('luxthumb_saved_designs', updated).then(() => {
      alert('Design saved to history!');
      recordAuditLog('design_save', `Design saved: ${data.brandName}`);
    });
  };

  const loadDesign = (design: SavedDesign) => {
    setData(design.data);
    setShowHistory(false);
  };

  const resetDesign = () => {
    if (confirm('Reset to initial design data? Current changes will be lost unless saved to history.')) {
      setData(INITIAL_DATA);
      setGenerated(null);
    }
  };

  const deleteDesign = (id: string) => {
    const designToDelete = savedDesigns.find(d => d.id === id);
    const updated = savedDesigns.filter(d => d.id !== id);
    setSavedDesigns(updated);
    set('luxthumb_saved_designs', updated);
    if (designToDelete) {
      recordAuditLog('design_delete', `Design deleted: ${designToDelete.name}`);
    }
  };

  const handleInputChange = (field: keyof ThumbnailData, value: string | number | null) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'backgroundImage' | 'subjectImage' | 'logoImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange(field, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconChange = (index: number, value: string) => {
    const newIcons = [...data.featureIcons];
    newIcons[index] = value;
    setData(prev => ({ ...prev, featureIcons: newIcons }));
  };

  const handleIconImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newImages = [...(data.featureImages || [null, null, null])];
        newImages[index] = ev.target?.result as string;
        setData(prev => ({ ...prev, featureImages: newImages }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeIconImage = (index: number) => {
    const newImages = [...(data.featureImages || [null, null, null])];
    newImages[index] = null;
    setData(prev => ({ ...prev, featureImages: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.foregroundSubject) {
      alert("Please describe the foreground subject (gender, attire, pose, etc.) first.");
      return;
    }
    setLoading(true);
    try {
      const result = await generateThumbnailPrompts(data);
      setGenerated(result);
    } catch (error) {
      console.error(error);
      alert("Failed to generate prompts. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const hideBordersForExport = () => {
    const borderElements = document.querySelectorAll('[data-export-border]');
    const styles: { el: Element; original: string }[] = [];
    borderElements.forEach(el => {
      styles.push({ el, original: el.getAttribute('style') || '' });
      const current = (el as HTMLElement).style.borderColor;
      (el as HTMLElement).style.borderColor = 'transparent';
    });
    return styles;
  };

  const restoreBorders = (styles: { el: Element; original: string }[]) => {
    styles.forEach(({ el, original }) => {
      if (original) {
        el.setAttribute('style', original);
      } else {
        el.removeAttribute('style');
      }
    });
  };

  const getTimestampedFilename = (basename: string, extension: string): string => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const brandPrefix = data.brandName ? `${data.brandName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}` : 'luxthumb_design';
    return `${brandPrefix}_${timestamp}.${extension}`;
  };

  const exportToPng = async () => {
    const element = document.getElementById('thumbnail-canvas');
    if (!element) return;
    try {
      setLoading(true);
      element.classList.remove('border', 'border-[#1A1A1A]', 'editorial-shadow');
      const savedStyles = hideBordersForExport();
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: '#0A0A0A'
      });
      restoreBorders(savedStyles);
      element.classList.add('border', 'border-[#1A1A1A]', 'editorial-shadow');

      const link = document.createElement('a');
      const filename = getTimestampedFilename('thumbnail', 'png');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();

      recordAuditLog('export_format_png', `PNG exported: ${filename}`);
    } catch (error) {
      console.error('Export PNG failed:', error);
      alert(`Failed to export PNG: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
      element.classList.add('border', 'border-[#1A1A1A]', 'editorial-shadow');
    }
  };

  const exportToPdf = async () => {
    const element = document.getElementById('thumbnail-canvas');
    if (!element) return;
    try {
      setLoading(true);
      element.classList.remove('border', 'border-[#1A1A1A]', 'editorial-shadow');
      const savedStyles = hideBordersForExport();
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: '#0A0A0A'
      });
      restoreBorders(savedStyles);
      element.classList.add('border', 'border-[#1A1A1A]', 'editorial-shadow');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: (data.aspectRatio === '9:16' || data.aspectRatio === '4:5') ? 'portrait' : 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const filename = getTimestampedFilename('thumbnail', 'pdf');
      pdf.save(filename);

      recordAuditLog('export_format_pdf', `PDF exported: ${filename}`);
    } catch (error) {
      console.error('Export PDF failed:', error);
      alert('Failed to export PDF.');
    } finally {
      setLoading(false);
      element.classList.add('border', 'border-[#1A1A1A]', 'editorial-shadow');
    }
  };

  const exportToJpg = async () => {
    const element = document.getElementById('thumbnail-canvas');
    if (!element) return;
    try {
      setLoading(true);
      element.classList.remove('border', 'border-[#1A1A1A]', 'editorial-shadow');
      const savedStyles = hideBordersForExport();
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: '#0A0A0A'
      });
      restoreBorders(savedStyles);
      element.classList.add('border', 'border-[#1A1A1A]', 'editorial-shadow');

      const link = document.createElement('a');
      const filename = getTimestampedFilename('thumbnail', 'jpg');
      link.download = filename;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();

      recordAuditLog('export_format_jpg', `JPG exported: ${filename}`);
    } catch (error) {
      console.error('Export JPG failed:', error);
      alert('Failed to export JPG.');
    } finally {
      setLoading(false);
      element.classList.add('border', 'border-[#1A1A1A]', 'editorial-shadow');
    }
  };

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const link = document.createElement('a');
    link.download = 'luxthumb_ad_config.json';
    link.href = dataStr;
    link.click();
    recordAuditLog('export_format_json', `JSON config exported for brand: ${data.brandName}`);
  };

  const handleAdminLogin = () => {
    // btoa('admin123') = 'YWRtaW4xMjM='
    if (btoa(adminPassword) === 'YWRtaW4xMjM=') {
      setIsAdminAuthenticated(true);
      setAdminPassword('');
    } else {
      alert('Incorrect password. Please try again.');
      setAdminPassword('');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-[#F5F5F5] font-sans overflow-hidden">
      {/* Admin Modal Overlay */}
      {isAdminOpen && !isAdminAuthenticated && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Admin login dialog">
          <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded p-8 w-96 space-y-6 animate-scale-in">
            <div>
              <div className="text-[10px] tracking-[0.2em] text-[#C9A84C] uppercase font-bold mb-1">SECURE ACCESS</div>
              <h2 className="text-xl font-serif italic text-white">Admin Login</h2>
            </div>
            <div className="space-y-3">
              <label htmlFor="admin-password" className="text-[10px] uppercase tracking-widest text-white/50">Password</label>
              <input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                className="w-full bg-[#111] border border-[#222] p-3 text-sm text-white outline-none focus:border-[#C9A84C]/50 transition-colors rounded"
                placeholder="Enter admin password"
                aria-label="Admin password"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAdminLogin}
                className="flex-1 py-3 bg-[#C9A84C] text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#D4B96A] transition-colors rounded"
                aria-label="Login to admin panel"
              >
                Login
              </button>
              <button
                onClick={() => { setIsAdminOpen(false); setAdminPassword(''); }}
                className="px-4 py-3 border border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-colors text-[11px] font-bold uppercase tracking-widest rounded"
                aria-label="Cancel admin login"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Full Panel */}
      {isAdminOpen && isAdminAuthenticated && (
        <div className="fixed inset-0 z-[100] animate-fade-in">
          <AdminPanel onLogout={handleAdminLogout} />
        </div>
      )}

      {/* Accessibility Panel */}
      <AccessibilityPanel isOpen={isAccessibilityOpen} onClose={() => setIsAccessibilityOpen(false)} />

      {/* Sidebar - Configuration */}
      <aside className="w-[340px] border-r border-[#2A2A2A] flex flex-col shrink-0 bg-[#0A0A0A] relative z-50">
        <div className="p-6 border-b border-[#2A2A2A] flex justify-between items-start">
          <div>
            <div className="text-[10px] tracking-[0.2em] text-[#C9A84C] uppercase font-bold mb-1">THUMB-AGENT-001</div>
            <h1 className="text-2xl font-serif italic text-white">LuxThumb Designer</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsAccessibilityOpen(true)} className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-white/50 hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors" title="Accessibility & Theme Settings" aria-label="Open accessibility settings">
              <Settings className="w-4 h-4" />
            </button>
            <button onClick={() => setIsAdminOpen(true)} className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-white/50 hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors" title="Admin Panel" aria-label="Open admin panel">
              <Shield className="w-4 h-4" />
            </button>
            <button onClick={resetDesign} className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-white/50 hover:text-red-500 hover:border-red-500/50 transition-colors" title="Reset Design" aria-label="Reset design to defaults">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={saveCurrentDesign} className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-white/50 hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors" title="Save Copy to History" aria-label="Save current design to history">
              <Save className="w-4 h-4" />
            </button>
            <button onClick={() => setShowHistory(!showHistory)} className={`w-8 h-8 rounded border flex items-center justify-center transition-colors ${showHistory ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-white/10 text-white/50 hover:text-white'}`} title="History" aria-label="Toggle design history">
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showHistory ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
             <div className="flex items-center justify-between mb-2">
                <h2 className="text-[11px] uppercase tracking-widest text-[#C9A84C] font-bold">Saved Versions</h2>
                <span className="text-[9px] text-white/30 font-mono bg-white/5 px-2 py-0.5 rounded-full">{savedDesigns.length}</span>
             </div>
             {savedDesigns.length === 0 ? (
               <div className="text-center py-12 border border-dashed border-white/10 rounded-sm">
                 <History className="w-6 h-6 text-white/20 mx-auto mb-2" />
                 <p className="text-[10px] uppercase tracking-widest text-white/40">No saves yet</p>
               </div>
             ) : (
               <div className="space-y-2">
                 {savedDesigns.map(design => (
                   <div key={design.id} className="p-4 bg-[#111] border border-white/5 rounded-sm hover:border-[#C9A84C]/50 transition-colors group cursor-pointer" onClick={() => loadDesign(design)}>
                     <div className="flex justify-between items-center mb-2">
                       <div className="text-[11px] font-bold text-white uppercase tracking-wider truncate pr-4">{design.name}</div>
                       <button 
                         onClick={(e) => { e.stopPropagation(); deleteDesign(design.id); }}
                         className="text-white/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                         title="Delete"
                       >
                         <X className="w-3.5 h-3.5" />
                       </button>
                     </div>
                     <div className="text-[9px] text-white/40 uppercase tracking-widest font-mono">
                        {new Date(design.timestamp).toLocaleString()}
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
            <section className="space-y-6">
            <h2 className="text-[11px] uppercase tracking-widest text-white/30 font-bold">Input Configuration</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4 pt-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30">Brand Identity</label>
                <div className="grid sm:grid-cols-2 gap-2">
                  <EditorialInput 
                    label="Brand Name" 
                    value={data.brandName} 
                    onChange={(v: string) => handleInputChange('brandName', v)}
                    placeholder="Fancy Homes"
                  />
                  <EditorialInput 
                    label="Logo Type" 
                    value={data.logoDescription} 
                    onChange={(v: string) => handleInputChange('logoDescription', v)}
                    placeholder="Gold icon"
                  />
                </div>
                
                <div className="border border-[#222] rounded-sm p-3 space-y-4 bg-[#111]">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] uppercase tracking-tighter text-[#C9A84C]">Logo Image</label>
                    {data.logoImage && (
                      <button type="button" onClick={() => handleInputChange('logoImage', null)} className="text-[9px] text-red-500 hover:text-red-400">Remove</button>
                    )}
                  </div>
                  
                  {!data.logoImage && (
                    <label className="border-2 border-dashed border-[#222] hover:border-[#C9A84C]/50 rounded p-4 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                      <Upload className="w-4 h-4 text-white/30 group-hover:text-[#C9A84C] mb-1" />
                      <span className="text-[9px] uppercase tracking-widest text-white/50 group-hover:text-white/80">Upload Logo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logoImage')} />
                    </label>
                  )}
                </div>
              </div>
              <EditorialInput 
                label="Headline L1" 
                value={data.headlineLine1} 
                onChange={(v) => handleInputChange('headlineLine1', v)}
                placeholder="TOURING"
              />
              <EditorialInput 
                label="Headline L2" 
                value={data.headlineLine2} 
                onChange={(v) => handleInputChange('headlineLine2', v)}
                colorClass="text-[#C9A84C]"
                placeholder="THE CITY"
              />
              <EditorialInput 
                label="Subheadline" 
                value={data.subheadline} 
                onChange={(v) => handleInputChange('subheadline', v)}
                placeholder="FIND YOUR NEXT HOME"
              />
              <div className="space-y-4 pt-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30">Background Setup</label>
                <EditorialInput 
                  label="Scene Description" 
                  value={data.backgroundScene} 
                  onChange={(v: string) => handleInputChange('backgroundScene', v)}
                  placeholder="Golden-hour skyline"
                />
                
                <div className="p-3 bg-[#111] border border-[#222] rounded-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] uppercase tracking-tighter text-[#C9A84C]">Image Preview</label>
                    {data.backgroundImage && (
                      <button type="button" onClick={() => handleInputChange('backgroundImage', null)} className="text-[9px] text-red-500 hover:text-red-400">Remove</button>
                    )}
                  </div>
                  
                  {!data.backgroundImage ? (
                    <label className="border-2 border-dashed border-[#222] hover:border-[#C9A84C]/50 rounded p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                      <Upload className="w-5 h-5 text-white/30 group-hover:text-[#C9A84C] mb-2" />
                      <span className="text-[10px] uppercase tracking-widest text-white/50 group-hover:text-white/80">Upload Background</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'backgroundImage')} />
                    </label>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] text-white/50 uppercase tracking-widest">
                          <span>Zoom ({data.bgZoom}%)</span>
                        </div>
                        <input type="range" min="10" max="300" value={data.bgZoom} onChange={(e) => handleInputChange('bgZoom', parseInt(e.target.value))} className="w-full accent-[#C9A84C]" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] text-white/50 uppercase tracking-widest">
                          <span>X Offset ({data.bgX}%)</span>
                        </div>
                        <input type="range" min="0" max="100" value={data.bgX} onChange={(e) => handleInputChange('bgX', parseInt(e.target.value))} className="w-full accent-[#C9A84C]" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] text-white/50 uppercase tracking-widest">
                          <span>Y Offset ({data.bgY}%)</span>
                        </div>
                        <input type="range" min="0" max="100" value={data.bgY} onChange={(e) => handleInputChange('bgY', parseInt(e.target.value))} className="w-full accent-[#C9A84C]" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-3 bg-[#111] border-l-2 border-[#C9A84C] space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-tighter text-[#C9A84C]">Commanding Subject (Required)</label>
                  <textarea
                    className="w-full bg-transparent outline-none text-xs text-white/80 leading-relaxed resize-none h-16"
                    placeholder="e.g. Confident CEO in sharp suit, dramatic rim lighting on shoulders, high-contrast cinematic shadows..."
                    value={data.foregroundSubject}
                    onChange={(e) => handleInputChange('foregroundSubject', e.target.value)}
                  />
                </div>
                
                <div className="border border-[#222] rounded-sm p-3 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] uppercase tracking-tighter text-[#C9A84C]">Subject Image</label>
                    {data.subjectImage && (
                      <button type="button" onClick={() => handleInputChange('subjectImage', null)} className="text-[9px] text-red-500 hover:text-red-400">Remove</button>
                    )}
                  </div>
                  
                  {!data.subjectImage ? (
                    <label className="border-2 border-dashed border-[#222] hover:border-[#C9A84C]/50 rounded p-4 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                      <Upload className="w-4 h-4 text-white/30 group-hover:text-[#C9A84C] mb-1" />
                      <span className="text-[9px] uppercase tracking-widest text-white/50 group-hover:text-white/80">Upload Subject</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'subjectImage')} />
                    </label>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] text-white/50 uppercase tracking-widest">
                          <span>Zoom ({data.subjectZoom}%)</span>
                        </div>
                        <input type="range" min="10" max="300" value={data.subjectZoom} onChange={(e) => handleInputChange('subjectZoom', parseInt(e.target.value))} className="w-full accent-[#C9A84C]" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] text-white/50 uppercase tracking-widest">
                          <span>X Offset ({data.subjectX}%)</span>
                        </div>
                        <input type="range" min="-100" max="200" value={data.subjectX} onChange={(e) => handleInputChange('subjectX', parseInt(e.target.value))} className="w-full accent-[#C9A84C]" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] text-white/50 uppercase tracking-widest">
                          <span>Y Offset ({data.subjectY}%)</span>
                        </div>
                        <input type="range" min="-100" max="200" value={data.subjectY} onChange={(e) => handleInputChange('subjectY', parseInt(e.target.value))} className="w-full accent-[#C9A84C]" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30">Feature List</label>
                <div className="grid gap-2">
                  {data.featureIcons.map((icon, idx) => {
                    const featImg = data.featureImages?.[idx];
                    return (
                      <div key={idx} className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 bg-[#111] border border-[#222] p-2 text-[11px] text-white/70 outline-none focus:border-[#C9A84C]/50 transition-colors"
                            placeholder={`Feature 0${idx + 1}`}
                            value={icon}
                            onChange={(e) => handleIconChange(idx, e.target.value)}
                          />
                          {!featImg ? (
                            <label className="w-9 h-9 flex-shrink-0 bg-[#111] border border-[#222] hover:border-[#C9A84C]/50 flex items-center justify-center cursor-pointer transition-colors group">
                              <Upload className="w-3.5 h-3.5 text-white/30 group-hover:text-[#C9A84C]" />
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleIconImageUpload(e, idx)} />
                            </label>
                          ) : (
                            <button
                              type="button"
                              onClick={() => removeIconImage(idx)}
                              className="w-9 h-9 flex-shrink-0 bg-[#111] border border-[#C9A84C] relative overflow-hidden group"
                              title="Remove Icon"
                            >
                              <img src={featImg} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-30 transition-opacity" />
                              <X className="w-3 h-3 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <label className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold">Aspect Ratio Control</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { ratio: '4:5', desc: 'Social Feed' },
                    { ratio: '9:16', desc: 'Story / Reel' },
                    { ratio: '1:1', desc: 'Square Post' },
                    { ratio: '16:9', desc: 'Video / Web' }
                  ].map(({ ratio, desc }) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => handleInputChange('aspectRatio', ratio as any)}
                      className={`flex items-center gap-3 p-3 border rounded-sm transition-all text-left ${
                        data.aspectRatio === ratio 
                          ? 'border-[#C9A84C] bg-[#C9A84C]/5' 
                          : 'border-[#222] bg-[#111] hover:border-white/20'
                      }`}
                    >
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8">
                        <div className={`border-2 ${data.aspectRatio === ratio ? 'border-[#C9A84C]' : 'border-white/30'} transition-all`}
                             style={{
                               width: ratio === '16:9' ? '24px' : ratio === '1:1' ? '20px' : ratio === '4:5' ? '20px' : '16px',
                               height: ratio === '9:16' ? '24px' : ratio === '1:1' ? '20px' : ratio === '4:5' ? '25px' : '20px',
                               aspectRatio: ratio.replace(':', '/')
                             }}
                        />
                      </div>
                      <div>
                        <div className={`text-[11px] font-bold ${data.aspectRatio === ratio ? 'text-[#C9A84C]' : 'text-white/70'} leading-none mb-1`}>{ratio}</div>
                        <div className="text-[9px] text-white/30 uppercase tracking-tighter leading-none">{desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-6 bg-[#C9A84C] text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#D4B96A] transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Engage Engine
                  </>
                )}
              </button>
            </form>
          </section>

          <section className="space-y-4 pt-4 border-t border-white/5">
            <h2 className="text-[11px] uppercase tracking-widest text-white/30">Active Palette</h2>
            <div className="flex gap-3">
              <PaletteSwatch color="#050505" label="BG" />
              <PaletteSwatch color="#C9A84C" label="Gold" />
              <PaletteSwatch color="#F5F5F5" label="Ink" />
              <PaletteSwatch color="#1A1A1A" label="Acc" />
            </div>
          </section>
        </div>
        )}
      </aside>

      {/* Main Content - Preview and Results */}
      <main className="flex-1 bg-[#0F0F0F] relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#C9A84C_0%,_transparent_70%)] opacity-30"></div>
          <div className="absolute inset-0 bg-[#050505]/40" />
        </div>

        <div className="flex-1 overflow-y-auto p-12 flex flex-col items-center gap-12 z-10 scrollbar-hide">
          {/* Preview Container */}
          <div className="relative group">
            <div id="thumbnail-canvas" className={`relative bg-[#0A0A0A] editorial-shadow border border-[#1A1A1A] overflow-hidden flex flex-col transition-all duration-500`}
                 style={{ 
                   width: data.aspectRatio === '4:5' ? '420px' : data.aspectRatio === '1:1' ? '400px' : data.aspectRatio === '16:9' ? '560px' : '360px',
                   aspectRatio: data.aspectRatio === '4:5' ? '4/5' : data.aspectRatio === '1:1' ? '1/1' : data.aspectRatio === '16:9' ? '16/9' : '9/16'
                 }}>
              
              {/* Background Image / Overlay / Grain */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                {data.backgroundImage && (
                  <img 
                    src={data.backgroundImage} 
                    alt="Background" 
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      transform: `scale(${data.bgZoom / 100})`,
                      objectPosition: `${data.bgX}% ${data.bgY}%`
                    }}
                  />
                )}
                <div className="absolute inset-0 opacity-80 mix-blend-overlay pointer-events-none">
                  <div className="w-full h-full bg-gradient-to-tr from-black via-transparent to-[#C9A84C]/20"></div>
                </div>
                {data.backgroundImage && <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />}
              </div>

              {/* Branding / Header */}
              <div className="p-8 flex justify-between items-start relative z-10">
                <div className="flex flex-col">
                  {data.logoImage ? (
                    <img src={data.logoImage} alt="Logo" className="h-8 object-contain mb-2 origin-top-left object-left" />
                  ) : (
                    <div className="w-6 h-6 border-t-2 border-l-2 border-[#C9A84C] mb-2 scale-75 origin-top-left" data-export-border></div>
                  )}
                  <div className="text-[10px] font-serif italic text-white tracking-widest uppercase mt-1">
                    {data.brandName || "Brand Name"}
                  </div>
                  <div className="text-[8px] text-[#C9A84C] uppercase tracking-[0.3em] font-medium"> 
                    {data.logoDescription || "Identity Mark"}
                  </div>
                </div>
              </div>

              {/* Headlines */}
              <div className="px-8 flex-1 flex flex-col justify-center relative z-10">
                <div className="space-y-[-12px]">
                  <h2 className="text-6xl font-serif font-black text-white italic tracking-tighter uppercase leading-none break-words">
                    {data.headlineLine1 || "Headline"}
                  </h2>
                  <h2 className="text-7xl font-serif font-black text-[#C9A84C] italic tracking-tighter uppercase leading-none break-words">
                    {data.headlineLine2 || "Luxury"}
                  </h2>
                </div>

                <div className="mt-6">
                  <span className="inline-block border border-[#C9A84C] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-[0.2em] bg-[#C9A84C]/10 transition-all hover:bg-[#C9A84C]/20 cursor-default">
                    {data.subheadline || "Subheadline Callout"}
                  </span>
                </div>

                {/* Features List */}
                <div className="mt-12 space-y-3">
                  {data.featureIcons.map((feature, i) => {
                    if (!feature) return null;
                    const featImg = data.featureImages?.[i];
                    return (
                      <div key={i} className="flex items-center gap-3 group/feat">
                        {featImg ? (
                          <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 transition-transform group-hover/feat:scale-110">
                            <img src={featImg} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-[#C9A84C] flex items-center justify-center text-[#C9A84C] text-[8px] font-bold flex-shrink-0 transition-transform group-hover/feat:scale-110">
                            {feature[0]?.toUpperCase() || '•'}
                          </div>
                        )}
                        <div className="text-[9px] uppercase tracking-widest text-white/70">
                          {feature}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Subject Representation (Right-Aligned) */}
              <div className="absolute right-[-20px] bottom-0 w-2/3 h-4/5 z-0 opacity-80 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-t from-black via-transparent to-transparent absolute inset-0 z-10"></div>
                <div className="w-full h-full bg-[#111] border-l border-[#C9A84C]/30 relative overflow-hidden" data-export-border>
                   {data.subjectImage ? (
                     <img 
                       src={data.subjectImage}
                       alt="Subject"
                       className="absolute inset-0 w-full h-full object-cover"
                       style={{
                         transform: `scale(${data.subjectZoom / 100})`,
                         objectPosition: `${data.subjectX}% ${data.subjectY}%`
                       }}
                     />
                   ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-[#222] text-2xl font-serif italic text-center px-12">
                        {data.foregroundSubject ? data.foregroundSubject : "Subject Mask"}
                     </div>
                   )}
                </div>
              </div>

              {/* Footer Bar */}
              <div className="relative z-20 h-12 bg-[#C9A84C] flex items-center px-8 border-t border-black/10" data-export-border>
                <div className="text-[9px] font-bold text-black tracking-[0.25em] uppercase w-full flex justify-between items-center">
                  <span className="truncate max-w-[70%]">{data.taglineBar || "Brand Vision Statements"}</span>
                  <span className="opacity-60 italic shrink-0">v1.0</span>
                </div>
              </div>
            </div>

            {/* Preview Labels */}
            <div className="absolute -bottom-20 left-0 right-0 flex justify-between items-end">
               <div className="text-left space-y-1">
                 <div className="text-[9px] uppercase tracking-widest text-white/30">Layout Engine</div>
                 <div className="text-[11px] font-serif italic text-[#C9A84C]">Editorial Cinematic</div>
               </div>
               <div className="flex items-center gap-3">
                 <button onClick={exportToPng} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 border border-white/20 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors bg-black/50">
                    <Download className="w-3 h-3" /> PNG
                 </button>
                 <button onClick={exportToJpg} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 border border-white/20 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors bg-black/50">
                    <Download className="w-3 h-3" /> JPG
                 </button>
                 <button onClick={exportToPdf} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 border border-white/20 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors bg-black/50">
                    <Download className="w-3 h-3" /> PDF
                 </button>
                 <button onClick={exportToJson} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 border border-white/20 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors bg-black/50">
                    <Download className="w-3 h-3" /> Config
                 </button>
               </div>
               <div className="text-right space-y-1">
                 <div className="text-[9px] uppercase tracking-widest text-white/30">Status</div>
                 <div className="text-[11px] text-white flex items-center justify-end gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   Secure Link Active
                 </div>
               </div>
            </div>
          </div>

          {/* Results Section */}
          <AnimatePresence>
            {generated && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[800px] grid md:grid-cols-2 gap-6 pb-24"
              >
                <div className="md:col-span-2 flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-10 h-[1px] bg-[#C9A84C]" />
                  <h3 className="text-[11px] uppercase tracking-[0.4em] font-bold text-white/60">Generated Output Sheets</h3>
                </div>

                <EditorialOutput 
                   title="Midjourney Prompt" 
                   content={generated.midjourney} 
                   onCopy={() => copyToClipboard(generated.midjourney, 'mj')}
                   isCopied={copiedField === 'mj'}
                />

                <EditorialOutput 
                   title="Imagen 3 / DALL-E" 
                   content={generated.imagen3} 
                   onCopy={() => copyToClipboard(generated.imagen3, 'im')}
                   isCopied={copiedField === 'im'}
                />

                <div className="bg-[#111] border border-white/5 p-6 space-y-4 rounded-sm">
                   <div className="flex items-center gap-2 text-[#C9A84C]">
                      <FontIcon className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Type Spec</span>
                   </div>
                   <div className="space-y-3 text-[10px] uppercase tracking-wider text-white/40">
                      <p><span className="text-white/80 pr-2">Hero:</span> {generated.typographySpec.headline}</p>
                      <p><span className="text-white/80 pr-2">Body:</span> {generated.typographySpec.subheadline}</p>
                   </div>
                </div>

                <div className="bg-[#111] border border-white/5 p-6 space-y-4 rounded-sm">
                   <div className="flex items-center gap-2 text-[#C9A84C]">
                      <Palette className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Atmosphere</span>
                   </div>
                   <div className="flex gap-2">
                      <PaletteSwatch color={generated.colorPalette.background} label="BG" />
                      <PaletteSwatch color={generated.colorPalette.goldPrimary} label="Gold" />
                      <PaletteSwatch color={generated.colorPalette.whiteText} label="Ink" />
                   </div>
                </div>

                <div className="md:col-span-2 bg-gradient-to-tr from-[#111] to-[#1a1a1a] border border-[#222] p-8 space-y-4">
                   <div className="flex items-center justify-between">
                     <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#C9A84C]">Motion Extension (Veo/Sora)</h4>
                     <button 
                       onClick={() => copyToClipboard(generated.animatedExtension, 'motion')}
                       className="text-[9px] uppercase font-bold text-white/40 hover:text-white transition-colors"
                     >
                       {copiedField === 'motion' ? 'Synced to Clip' : 'Extract Motion'}
                     </button>
                   </div>
                   <p className="font-serif italic text-lg leading-relaxed text-white/80">
                      "{generated.animatedExtension}"
                   </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function EditorialInput({ label, value, onChange, placeholder, colorClass }: any) {
  return (
    <div className="p-3 bg-[#111] border border-[#222] rounded-sm transition-all hover:border-white/10 group">
      <label className="text-[9px] uppercase tracking-tighter text-[#C9A84C] block mb-1 group-hover:text-[#D4B96A] transition-colors">{label}</label>
      <input
        type="text"
        className={`w-full bg-transparent outline-none text-sm font-medium placeholder:text-white/10 ${colorClass || 'text-white'}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function EditorialOutput({ title, content, onCopy, isCopied }: any) {
  return (
    <div className="bg-[#111] border border-white/5 p-6 rounded-sm relative group hover:border-white/10 transition-all">
       <div className="flex items-center justify-between mb-4">
         <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">{title}</span>
         <button onClick={onCopy} className="text-[#C9A84C] hover:text-white transition-colors">
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
         </button>
       </div>
       <p className="text-[11px] text-white/40 font-mono leading-relaxed select-all">
         {content}
       </p>
    </div>
  );
}

function PaletteSwatch({ color, label }: { color: string, label: string }) {
  return (
    <div className="space-y-1">
      <div 
        className="w-8 h-8 rounded-full border border-white/5 shadow-inner" 
        style={{ backgroundColor: color }}
      />
      <div className="text-[8px] uppercase text-white/20 text-center tracking-tighter">{label}</div>
    </div>
  );
}

```

### FILE: src/components/AccessibilityPanel.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';

type Theme = 'dark' | 'light' | 'high-contrast';
type FontSize = 'small' | 'normal' | 'large' | 'extra-large';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onClose }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('luxthumb-theme') as Theme | null;
    const savedFontSize = localStorage.getItem('luxthumb-font-size') as FontSize | null;
    const savedReducedMotion = localStorage.getItem('luxthumb-reduced-motion') === 'true';

    if (savedTheme) setTheme(savedTheme);
    if (savedFontSize) setFontSize(savedFontSize);
    setReducedMotion(savedReducedMotion);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('luxthumb-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleFontSizeChange = (newSize: FontSize) => {
    setFontSize(newSize);
    localStorage.setItem('luxthumb-font-size', newSize);

    const scale = {
      small: 0.85,
      normal: 1,
      large: 1.15,
      'extra-large': 1.3
    };

    document.documentElement.style.fontSize = (16 * scale[newSize]) + 'px';
  };

  const handleReducedMotionChange = (value: boolean) => {
    setReducedMotion(value);
    localStorage.setItem('luxthumb-reduced-motion', String(value));
    if (value) {
      document.documentElement.style.setProperty('--transition-fast', '0s');
      document.documentElement.style.setProperty('--transition-normal', '0s');
      document.documentElement.style.setProperty('--transition-slow', '0s');
    } else {
      document.documentElement.style.removeProperty('--transition-fast');
      document.documentElement.style.removeProperty('--transition-normal');
      document.documentElement.style.removeProperty('--transition-slow');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 cursor-pointer"
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-[#0A0A0A] border-l border-[#2A2A2A] z-50 flex flex-col animate-slide-in-right shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-[#2A2A2A] flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-[0.2em] text-[#C9A84C] uppercase font-bold mb-1">ACCESSIBILITY</div>
            <h2 className="text-lg font-serif italic text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors p-1"
            aria-label="Close accessibility settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {/* Theme Selector */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-white">Theme</h3>
            <div className="space-y-2">
              {[
                { value: 'dark' as const, label: 'Dark', desc: 'Premium dark mode' },
                { value: 'light' as const, label: 'Light', desc: 'Bright light mode' },
                { value: 'high-contrast' as const, label: 'High Contrast', desc: 'Maximum visibility' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={`w-full p-3 rounded border transition-all text-left ${
                    theme === option.value
                      ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                      : 'border-[#222] bg-[#111] hover:border-white/20'
                  }`}
                  aria-pressed={theme === option.value}
                  aria-label={`Switch to ${option.label} theme`}
                >
                  <div className={`text-[11px] font-bold ${theme === option.value ? 'text-[#C9A84C]' : 'text-white'}`}>
                    {option.label}
                  </div>
                  <div className="text-[9px] text-white/40">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size Selector */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-white">Font Size</h3>
            <div className="space-y-2">
              {[
                { value: 'small' as const, label: 'Small', desc: '85% size' },
                { value: 'normal' as const, label: 'Normal', desc: '100% size' },
                { value: 'large' as const, label: 'Large', desc: '115% size' },
                { value: 'extra-large' as const, label: 'Extra Large', desc: '130% size' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleFontSizeChange(option.value)}
                  className={`w-full p-3 rounded border transition-all text-left ${
                    fontSize === option.value
                      ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                      : 'border-[#222] bg-[#111] hover:border-white/20'
                  }`}
                  aria-pressed={fontSize === option.value}
                  aria-label={`Change font size to ${option.label}`}
                >
                  <div className={`text-[11px] font-bold ${fontSize === option.value ? 'text-[#C9A84C]' : 'text-white'}`}>
                    {option.label}
                  </div>
                  <div className="text-[9px] text-white/40">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Motion Preferences */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-white">Motion</h3>
            <button
              onClick={() => handleReducedMotionChange(!reducedMotion)}
              className={`w-full p-4 rounded border transition-all text-left flex items-center justify-between ${
                reducedMotion
                  ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                  : 'border-[#222] bg-[#111] hover:border-white/20'
              }`}
              aria-pressed={reducedMotion}
              aria-label="Toggle reduced motion preferences"
            >
              <div>
                <div className={`text-[11px] font-bold ${reducedMotion ? 'text-[#C9A84C]' : 'text-white'}`}>
                  Reduce Motion
                </div>
                <div className="text-[9px] text-white/40">Minimise animations</div>
              </div>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                reducedMotion ? 'border-[#C9A84C] bg-[#C9A84C]' : 'border-white/30'
              }`}>
                {reducedMotion && <span className="text-black text-xs font-bold">✓</span>}
              </div>
            </button>
          </div>

          {/* Info Section */}
          <div className="space-y-3 p-4 bg-[#111] border border-[#222] rounded">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#C9A84C]">Accessibility Info</h4>
            <ul className="space-y-2 text-[9px] text-white/60">
              <li>All interactive elements are keyboard accessible</li>
              <li>Focus indicators are clearly visible</li>
              <li>Colour is not the only means of conveying information</li>
              <li>Text has sufficient contrast ratios (WCAG AA)</li>
              <li>Settings persist across browser sessions</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

```

### FILE: src/components/AdminPanel.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { LogOut, Download, Trash2, Eye, EyeOff } from 'lucide-react';
import { get, set } from 'idb-keyval';

interface AuditLog {
  id: string;
  timestamp: number;
  action: 'design_save' | 'design_export' | 'design_delete' | 'export_format_png' | 'export_format_pdf' | 'export_format_jpg' | 'export_format_json';
  details: string;
  ipMetadata?: string;
}

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      const logs = await get('luxthumb_audit_logs');
      if (logs && Array.isArray(logs)) {
        setAuditLogs(logs.sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (err) {
      console.error('Failed to load audit logs', err);
    }
  };

  const clearAllLogs = async () => {
    if (confirm('Clear all audit logs? This action cannot be undone.')) {
      try {
        await set('luxthumb_audit_logs', []);
        setAuditLogs([]);
      } catch (err) {
        console.error('Failed to clear logs', err);
      }
    }
  };

  const exportLogsAsJson = () => {
    const dataStr = JSON.stringify(auditLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.download = `luxthumb_audit_logs_${new Date().toISOString().split('T')[0]}.json`;
    link.href = dataUri;
    link.click();
  };

  const exportLogsAsCsv = () => {
    const headers = ['Timestamp', 'Action', 'Details'];
    const rows = auditLogs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.action,
      log.details
    ]);
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    const link = document.createElement('a');
    link.download = `luxthumb_audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.href = dataUri;
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] text-[#F5F5F5]">
      {/* Header */}
      <div className="p-6 border-b border-[#2A2A2A] flex justify-between items-center">
        <div>
          <div className="text-[10px] tracking-[0.2em] text-[#C9A84C] uppercase font-bold mb-1">ADMIN CONSOLE</div>
          <h2 className="text-xl font-serif italic text-white">Audit Dashboard</h2>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/50 rounded text-red-500 hover:bg-red-500/20 transition-colors text-[10px] uppercase font-bold tracking-wider"
          aria-label="Logout from admin panel"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Control Buttons */}
      <div className="p-6 border-b border-[#2A2A2A] flex flex-wrap gap-3">
        <button
          onClick={exportLogsAsJson}
          disabled={auditLogs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C]/10 border border-[#C9A84C]/50 rounded text-[#C9A84C] hover:bg-[#C9A84C]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[10px] uppercase font-bold tracking-wider"
          aria-label="Export audit logs as JSON"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
        <button
          onClick={exportLogsAsCsv}
          disabled={auditLogs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C]/10 border border-[#C9A84C]/50 rounded text-[#C9A84C] hover:bg-[#C9A84C]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[10px] uppercase font-bold tracking-wider"
          aria-label="Export audit logs as CSV"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={clearAllLogs}
          disabled={auditLogs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/50 rounded text-red-500 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[10px] uppercase font-bold tracking-wider"
          aria-label="Clear all audit logs"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      {/* Stats */}
      <div className="p-6 border-b border-[#2A2A2A] grid grid-cols-4 gap-4">
        <div className="bg-[#111] border border-[#222] rounded p-4">
          <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2">Total Entries</div>
          <div className="text-2xl font-bold text-[#C9A84C]">{auditLogs.length}</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded p-4">
          <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2">Design Saves</div>
          <div className="text-2xl font-bold text-white">{auditLogs.filter(l => l.action === 'design_save').length}</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded p-4">
          <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2">Exports</div>
          <div className="text-2xl font-bold text-white">{auditLogs.filter(l => l.action.includes('export')).length}</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded p-4">
          <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2">Last Activity</div>
          <div className="text-[11px] font-mono text-white/60">
            {auditLogs.length > 0 ? new Date(auditLogs[0].timestamp).toLocaleTimeString() : 'None'}
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        {auditLogs.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded">
            <div className="text-[10px] uppercase tracking-widest text-white/40">No audit logs yet</div>
          </div>
        ) : (
          <div className="space-y-2">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="bg-[#111] border border-white/5 rounded hover:border-white/10 transition-colors"
              >
                <button
                  onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                  aria-expanded={expandedLog === log.id}
                  aria-controls={`log-${log.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[9px] font-mono bg-[#222] px-2 py-1 rounded text-[#C9A84C] uppercase tracking-wider">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-white/60">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-white/70 truncate">{log.details}</div>
                  </div>
                  {expandedLog === log.id ? (
                    <Eye className="w-4 h-4 text-white/40 ml-2 flex-shrink-0" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-white/40 ml-2 flex-shrink-0" />
                  )}
                </button>

                {expandedLog === log.id && (
                  <div
                    id={`log-${log.id}`}
                    className="px-4 pb-4 border-t border-white/5 animate-slide-in"
                  >
                    <div className="space-y-2 text-[9px] text-white/50 font-mono">
                      <div>
                        <span className="text-white/70">ID:</span> {log.id}
                      </div>
                      <div>
                        <span className="text-white/70">Action:</span> {log.action}
                      </div>
                      <div>
                        <span className="text-white/70">Details:</span> {log.details}
                      </div>
                      <div>
                        <span className="text-white/70">Timestamp:</span> {new Date(log.timestamp).toISOString()}
                      </div>
                      {log.ipMetadata && (
                        <div>
                          <span className="text-white/70">Metadata:</span> {log.ipMetadata}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const recordAuditLog = async (
  action: AuditLog['action'],
  details: string
): Promise<void> => {
  try {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      action,
      details,
      ipMetadata: navigator.userAgent.substring(0, 100)
    };

    const logs = (await get('luxthumb_audit_logs')) || [];
    if (!Array.isArray(logs)) {
      return;
    }

    logs.unshift(newLog);
    const recentLogs = logs.slice(0, 1000);
    await set('luxthumb_audit_logs', recentLogs);
  } catch (err) {
    console.error('Failed to record audit log', err);
  }
};

```

### FILE: src/index.css
```css
@import './styles/theme.css';
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Playfair Display", ui-serif, Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

@layer utilities {
  .bg-radial-vignette {
    background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%);
  }
  
  .editorial-shadow {
    box-shadow: 0 50px 100px rgba(0,0,0,0.8);
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

### FILE: src/services/geminiService.ts
```typescript
import { GoogleGenAI } from "@google/genai";
import { ThumbnailData, GeneratedPrompts } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_INSTRUCTION = `
You are a professional thumbnail design agent. You generate detailed, production-ready image generation prompts for thumbnails based on user-supplied brand details, copy, and visual style preferences.

DESIGN PHILOSOPHY:
- Style: cinematic dark luxury
- Mood: authoritative, aspirational, high-converting
- Color Language: deep blacks + gold accents + bright white typography
- Composition: portrait-format poster with bold headline hierarchy, background cityscape/scene, foreground human subject (right-aligned), icon list (lower-left), tagline bar (bottom)

SUBJECT POSE & PRESENCE:
- When describing the foreground subject, ensure they exhibit a "Dynamic & Commanding" posture.
- Ideal poses: slight tilt of the head, direct powerful eye contact, confident stride, hands adjusting a watch or lapel, or an authoritative standing posture with depth.

CINEMATIC LIGHTING:
- Mandate dramatic lighting on the foreground subject: Use sharp rim lighting to separate them from the dark background.
- Implement high-contrast Chiaroscuro or "Rembrandt" key lighting to create depth and mystery.
- Add golden-hour backlighting accents on hair or shoulders to tie into the gold luxury palette.
- Shadows should be deep and clean, avoiding flat illumination.

OUTPUT REQUIREMENTS:
Return a JSON object matching this structure:
{
  "midjourney": "/imagine prompt ...",
  "imagen3": "natural language prompt for Imagen 3 ...",
  "canvaBrief": "creative brief for Canva ...",
  "typographySpec": {
    "headline": "font details",
    "subheadline": "font details",
    "icons": "font details",
    "tagline": "font details"
  },
  "colorPalette": {
    "background": "#0A0A0A",
    "goldPrimary": "#C9A84C",
    "goldAccent": "#F0C040",
    "whiteText": "#FFFFFF"
  },
  "animatedExtension": "Sora/Veo video loop extension prompt..."
}

Always follow the hierarchy: Headline Line 1 (White), Headline Line 2 (Gold).
If the brand name or copy conflicts with luxury/authority tone, flag it in the canvaBrief or as a note.
`;

export async function generateThumbnailPrompts(data: ThumbnailData): Promise<GeneratedPrompts> {
  const prompt = `
    Generate thumbnail design prompts and specs for:
    Brand: ${data.brandName}
    Logo: ${data.logoDescription}
    Headline: ${data.headlineLine1} / ${data.headlineLine2}
    Subheadline: ${data.subheadline}
    Background: ${data.backgroundScene}
    Subject: ${data.foregroundSubject}
    Features: ${data.featureIcons.join(", ")}
    Tagline: ${data.taglineBar}
    Aspect Ratio: ${data.aspectRatio}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(response.text) as GeneratedPrompts;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

```

### FILE: src/styles/theme.css
```css
/* TUC Theme System - LuxThumb Designer */

:root {
  --color-background-main: #050505;
  --color-background-secondary: #0A0A0A;
  --color-background-tertiary: #0F0F0F;
  --color-background-quaternary: #111111;
  --color-foreground: #F5F5F5;
  --color-foreground-secondary: #C9C9C9;
  --color-foreground-muted: #999999;
  --color-primary: #C9A84C;
  --color-primary-hover: #D4B96A;
  --color-primary-active: #B89836;
  --color-accent: #1A1A1A;
  --color-accent-subtle: #2A2A2A;
  --color-border: #2A2A2A;
  --color-border-subtle: #1A1A1A;
  --color-success: #22C55E;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
  --color-info: #3B82F6;
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
  --font-scale-xs: 0.75rem;
  --font-scale-sm: 0.875rem;
  --font-scale-base: 1rem;
  --font-scale-lg: 1.125rem;
  --font-scale-xl: 1.25rem;
  --font-scale-2xl: 1.5rem;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
}

/* Dark Theme (Default) */
[data-theme='dark'] {
  --color-background-main: #050505;
  --color-background-secondary: #0A0A0A;
  --color-background-tertiary: #0F0F0F;
  --color-background-quaternary: #111111;
  --color-foreground: #F5F5F5;
  --color-foreground-secondary: #C9C9C9;
  --color-foreground-muted: #999999;
  --color-primary: #C9A84C;
  --color-primary-hover: #D4B96A;
  --color-primary-active: #B89836;
  --color-accent: #1A1A1A;
  --color-accent-subtle: #2A2A2A;
  --color-border: #2A2A2A;
  --color-border-subtle: #1A1A1A;
}

/* Light Theme */
[data-theme='light'] {
  --color-background-main: #FFFFFF;
  --color-background-secondary: #F5F5F5;
  --color-background-tertiary: #EEEEEE;
  --color-background-quaternary: #E5E5E5;
  --color-foreground: #050505;
  --color-foreground-secondary: #333333;
  --color-foreground-muted: #666666;
  --color-primary: #C9A84C;
  --color-primary-hover: #D4B96A;
  --color-primary-active: #B89836;
  --color-accent: #E5E5E5;
  --color-accent-subtle: #CCCCCC;
  --color-border: #CCCCCC;
  --color-border-subtle: #E5E5E5;
}

/* High Contrast Theme */
[data-theme='high-contrast'] {
  --color-background-main: #000000;
  --color-background-secondary: #1A1A1A;
  --color-background-tertiary: #333333;
  --color-background-quaternary: #4D4D4D;
  --color-foreground: #FFFFFF;
  --color-foreground-secondary: #E5E5E5;
  --color-foreground-muted: #CCCCCC;
  --color-primary: #FFFF00;
  --color-primary-hover: #FFFFCC;
  --color-primary-active: #CCCC00;
  --color-accent: #FFFFFF;
  --color-accent-subtle: #E5E5E5;
  --color-border: #FFFFFF;
  --color-border-subtle: #CCCCCC;
}

/* Base Styles */
* {
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

body {
  background-color: var(--color-background-main);
  color: var(--color-foreground);
}

/* Typography Utilities */
.font-playfair {
  font-family: 'Playfair Display', ui-serif, Georgia, serif;
  letter-spacing: -0.02em;
}

.font-outfit {
  font-family: 'Outfit', sans-serif;
}

.font-space-grotesk {
  font-family: 'Space Grotesk', monospace;
}

/* Animation Keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Animation Utilities */
.animate-fade-in {
  animation: fadeIn var(--transition-normal) ease;
}

.animate-slide-in {
  animation: slideIn var(--transition-normal) ease;
}

.animate-slide-in-left {
  animation: slideInLeft var(--transition-normal) ease;
}

.animate-slide-in-right {
  animation: slideInRight var(--transition-normal) ease;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-scale-in {
  animation: scaleIn var(--transition-normal) ease;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-background-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--color-accent-subtle);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-foreground-muted);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Focus Styles for Accessibility */
a:focus,
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* High Contrast Mode Adjustments */
@media (prefers-contrast: more) {
  [data-theme='dark'] {
    --color-foreground-muted: #CCCCCC;
    --color-accent-subtle: #444444;
  }

  [data-theme='light'] {
    --color-foreground-muted: #333333;
    --color-accent-subtle: #999999;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

```

### FILE: src/types.ts
```typescript
export interface ThumbnailData {
  brandName: string;
  logoDescription: string;
  logoImage: string | null;
  headlineLine1: string;
  headlineLine2: string;
  subheadline: string;
  backgroundScene: string;
  backgroundImage: string | null;
  bgZoom: number;
  bgX: number;
  bgY: number;
  foregroundSubject: string;
  subjectImage: string | null;
  subjectZoom: number;
  subjectX: number;
  subjectY: number;
  featureIcons: string[];
  featureImages?: (string | null)[];
  taglineBar: string;
  aspectRatio: "4:5" | "9:16" | "1:1" | "16:9";
}

export interface SavedDesign {
  id: string;
  name: string;
  timestamp: number;
  data: ThumbnailData;
}

export interface GeneratedPrompts {
  midjourney: string;
  imagen3: string;
  canvaBrief: string;
  typographySpec: {
    headline: string;
    subheadline: string;
    icons: string;
    tagline: string;
  };
  colorPalette: {
    background: string;
    goldPrimary: string;
    goldAccent: string;
    whiteText: string;
  };
  animatedExtension: string;
}

```

### FILE: test-results/.last-run.json
```json
{
  "status": "passed",
  "failedTests": []
}
```

### FILE: tests/app.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('Core Application', () => {
  test('has correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/LuxThumb Designer/);
  });

  test('renders main heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('LuxThumb Designer');
  });

  test('can adjust aspect ratio', async ({ page }) => {
    await page.goto('/');
    await page.locator('button', { hasText: '1:1' }).click();
    const button = page.locator('button', { hasText: '1:1' });
    const className = await button.getAttribute('class');
    expect(className).toContain('border-[#C9A84C]');
  });

  test('can type in input fields', async ({ page }) => {
    await page.goto('/');
    const brandNameInput = page.getByPlaceholder('Fancy Homes');
    await brandNameInput.fill('MY CUSTOM BRAND');
    await expect(brandNameInput).toHaveValue('MY CUSTOM BRAND');
  });
});

test.describe('Admin Panel', () => {
  test('opens admin login dialog when admin button clicked', async ({ page }) => {
    await page.goto('/');
    const adminButton = page.locator('button[aria-label="Open admin panel"]');
    await expect(adminButton).toBeVisible();
    await adminButton.click();
    await expect(page.locator('text=Admin Login')).toBeVisible();
    await expect(page.locator('#admin-password')).toBeVisible();
  });

  test('rejects incorrect admin password', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open admin panel"]').click();
    await page.locator('#admin-password').fill('wrongpassword');

    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Incorrect password');
      await dialog.dismiss();
    });

    await page.locator('button[aria-label="Login to admin panel"]').click();
    // The admin dashboard should NOT be visible
    await expect(page.locator('text=Audit Dashboard')).not.toBeVisible();
  });

  test('grants access with correct admin password', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open admin panel"]').click();
    await page.locator('#admin-password').fill('admin123');
    await page.locator('button[aria-label="Login to admin panel"]').click();
    await expect(page.locator('text=Audit Dashboard')).toBeVisible();
  });

  test('can dismiss admin login dialog', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open admin panel"]').click();
    await expect(page.locator('text=Admin Login')).toBeVisible();
    await page.locator('button[aria-label="Cancel admin login"]').click();
    await expect(page.locator('text=Admin Login')).not.toBeVisible();
  });

  test('admin panel shows stat blocks', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open admin panel"]').click();
    await page.locator('#admin-password').fill('admin123');
    await page.locator('button[aria-label="Login to admin panel"]').click();
    await expect(page.locator('text=Total Entries')).toBeVisible();
    await expect(page.locator('text=Design Saves')).toBeVisible();
    await expect(page.locator('text=Exports')).toBeVisible();
  });

  test('admin panel has export buttons', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open admin panel"]').click();
    await page.locator('#admin-password').fill('admin123');
    await page.locator('button[aria-label="Login to admin panel"]').click();
    await expect(page.locator('button[aria-label="Export audit logs as JSON"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Export audit logs as CSV"]')).toBeVisible();
  });

  test('admin logout button closes admin panel', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open admin panel"]').click();
    await page.locator('#admin-password').fill('admin123');
    await page.locator('button[aria-label="Login to admin panel"]').click();
    await expect(page.locator('text=Audit Dashboard')).toBeVisible();
    await page.locator('button[aria-label="Logout from admin panel"]').click();
    await expect(page.locator('text=Audit Dashboard')).not.toBeVisible();
  });
});

test.describe('Theme Switching', () => {
  test('opens accessibility panel', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open accessibility settings"]').click();
    await expect(page.locator('text=Accessibility')).toBeVisible();
  });

  test('switches to light theme', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open accessibility settings"]').click();
    await page.locator('button[aria-label="Switch to Light theme"]').click();
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('light');
  });

  test('switches to dark theme', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open accessibility settings"]').click();
    await page.locator('button[aria-label="Switch to Dark theme"]').click();
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('dark');
  });

  test('switches to high contrast theme', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open accessibility settings"]').click();
    await page.locator('button[aria-label="Switch to High Contrast theme"]').click();
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('high-contrast');
  });

  test('persists theme to localStorage', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open accessibility settings"]').click();
    await page.locator('button[aria-label="Switch to Light theme"]').click();
    const storedTheme = await page.evaluate(() =>
      localStorage.getItem('luxthumb-theme')
    );
    expect(storedTheme).toBe('light');
  });

  test('restores theme from localStorage on page reload', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('luxthumb-theme', 'light'));
    await page.reload();
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('light');
  });

  test('can close accessibility panel', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open accessibility settings"]').click();
    await expect(page.locator('text=Accessibility')).toBeVisible();
    await page.locator('button[aria-label="Close accessibility settings"]').click();
    await expect(page.locator('text=Accessibility')).not.toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('all action buttons have aria-labels', async ({ page }) => {
    await page.goto('/');
    const buttons = page.locator('aside button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const label = await buttons.nth(i).getAttribute('aria-label');
      expect(label, `Button ${i} is missing aria-label`).toBeTruthy();
    }
  });

  test('page has lang attribute', async ({ page }) => {
    await page.goto('/');
    const lang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
    expect(lang).toBe('en');
  });

  test('has data-theme attribute on html element', async ({ page }) => {
    await page.goto('/');
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBeTruthy();
  });

  test('admin password input is properly labelled', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open admin panel"]').click();
    const input = page.locator('#admin-password');
    await expect(input).toHaveAttribute('aria-label', 'Admin password');
  });
});

```

### FILE: tests/export.spec.ts
```typescript
import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test('export png does not fail', async ({ page }) => {
  await page.goto('/');

  // Listen for dialogs
  page.on('dialog', dialog => {
    console.log('Dialog:', dialog.message());
    dialog.dismiss();
  });
  
  // Fill the foregroundSubject to see if it causes issues
  await page.getByPlaceholder('e.g. Confident CEO').fill('Test Subject');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('button', { hasText: 'PNG' }).click()
  ]);

  const path = await download.path();
  const stat = fs.statSync(path!);
  console.log(`Downloaded size: ${stat.size} bytes`);
  
  expect(stat.size).toBeGreaterThan(100);
});

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

