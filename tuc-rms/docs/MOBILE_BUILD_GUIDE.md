# TUC RMS — Mobile Build Guide

**Document ID:** TUC-RMS-MOBILE-2026-001  
**Version:** 3.0  
**Last Updated:** 25 May 2026  
**Audience:** Developers, Build Engineers, QA Testers

---

## Overview

This guide provides detailed instructions for building and deploying the TUC Results Management System to iOS and Android devices using Capacitor 8.3.3.

**Framework:** Capacitor (native iOS/Android wrapper for React web app)  
**Platforms:** iOS 14+, Android 8+  
**Bundle ID:** `com.techbridge.tucrms`

---

## 1. Prerequisites

### 1.1 System Requirements

| Requirement | Specification |
|---|---|
| **Node.js** | v18 LTS or v20 LTS |
| **npm** | Latest (or pnpm 9+) |
| **Capacitor CLI** | 8.3.3 |
| **iOS SDK** | Xcode 14+ (macOS 12+) |
| **Android SDK** | Android Studio 2023+ (JDK 17) |

### 1.2 Installing Prerequisites

**Node.js & npm:**
```bash
# Check existing installation
node --version  # Should be v18.x or v20.x
npm --version   # Should be latest

# If not installed, download from https://nodejs.org/
```

**Capacitor CLI:**
```bash
npm install -g @capacitor/cli@8.3.3

# Verify installation
npx cap --version  # Should be 8.3.3
```

**For iOS Development (macOS only):**
```bash
# Install Xcode from App Store or via Homebrew
xcode-select --install

# Verify
xcode-select -p  # Should output /Applications/Xcode.app/...
```

**For Android Development (all platforms):**
1. Download Android Studio: https://developer.android.com/studio
2. Install Java Development Kit (JDK) 17+
3. Configure Android SDK:
   ```bash
   # Set environment variables (add to ~/.bashrc or ~/.zshrc)
   export JAVA_HOME=/path/to/jdk17
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

---

## 2. Project Setup

### 2.1 Install Frontend Dependencies

```bash
cd frontend

# Install npm packages
npm install

# or with pnpm
pnpm install

# Verify React and dependencies are installed
npm list react vite capacitor/cli
```

### 2.2 Build Frontend for Production

```bash
cd frontend

# Clean previous builds (optional)
rm -rf dist/

# Build optimised bundle
npm run build:prod

# Verify output
ls -la dist/
# Expected: index.html, assets/main-HASH.js, assets/main-HASH.css
```

### 2.3 Install Capacitor Dependencies

```bash
cd frontend

# Install core Capacitor packages
npm install @capacitor/core@8.3.3
npm install -D @capacitor/cli@8.3.3

# Install platform-specific packages
npm install @capacitor/ios@8.3.3
npm install @capacitor/android@8.3.3

# Verify installation
npm list @capacitor/cli @capacitor/core
```

---

## 3. Capacitor Configuration

### 3.1 Create or Update capacitor.config.ts

Ensure `frontend/capacitor.config.ts` exists with correct settings:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techbridge.tucrms',
  appName: 'TUC Results',
  webDir: 'dist',
  server: {
    hostname: 'ai-tools.techbridge.edu.gh',
    androidScheme: 'https',
    iosScheme: 'https',
    cleartext: false,
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    allowsLinkPreview: false,
    backgroundColor: '#6B0020',
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#6B0020',
    captureInput: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#6B0020',
      showSpinner: false,
    },
  },
};

export default config;
```

### 3.2 Verify Configuration

```bash
cd frontend
npx cap doctor
```

**Expected Output:**
```
✓ Capacitor CLI: 8.3.3
✓ @capacitor/core: 8.3.3
✓ @capacitor/ios: 8.3.3
✓ @capacitor/android: 8.3.3
✓ Xcode: 14.x (on macOS)
✓ Android SDK: API Level 33+
```

---

## 4. iOS Build & Deployment

### 4.1 Add iOS Platform

```bash
cd frontend

# Build frontend first (required!)
npm run build:prod

# Add iOS platform
npx cap add ios

# This creates: ios/ directory with Xcode project
```

### 4.2 Sync Capacitor Assets

```bash
# Sync all changes from web (dist/) to native iOS
npx cap sync ios

# This copies dist/ files to iOS WebView directory
```

### 4.3 Open Xcode Project

```bash
# Open iOS project in Xcode
npx cap open ios

# Alternatively, manually open:
open ios/App/App.xcworkspace
```

### 4.4 Configure Signing & Certificates

**In Xcode:**

1. **Select Project:**
   - Click "App" in sidebar
   - Select "App" target

2. **Configure Signing:**
   - Go to **Build Settings** tab
   - Search for "Code Sign Identity"
   - Set to "iPhone Developer"

3. **Provisioning Profile:**
   - Go to **Build Settings** → **Provisioning Profile**
   - Select your distribution provisioning profile
   - (If none exists, create one in Apple Developer portal)

4. **Team:**
   - Go to **General** tab
   - Set "Team" to your Apple Developer Team

### 4.5 Build for Development (Simulator)

```bash
# In Xcode:
# 1. Select simulator device (e.g., iPhone 14 Pro)
# 2. Product → Build (Cmd+B)
# 3. Product → Run (Cmd+R)

# Or from command line:
xcodebuild -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Debug \
  -destination "generic/platform=iOS Simulator" \
  build
```

**Expected Output:**
- Simulator launches with app
- Login screen loads
- No errors in Xcode console

### 4.6 Build for Production (Release)

```bash
# In Xcode:
# 1. Product → Scheme → Edit Scheme
# 2. Set to "Release" configuration
# 3. Select Generic iOS Device (not simulator)
# 4. Product → Build For → Running (Cmd+B)
# 5. Product → Archive (Cmd+Shift+K)

# Or from command line:
xcodebuild -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  -destination generic/platform=iOS \
  archive -archivePath ios/App.xcarchive
```

**Archiving Steps:**
1. Archive completes (1–2 minutes)
2. Organiser window opens
3. Select your archive
4. Click "Validate" (tests before submission)
5. Click "Upload to App Store" (or export for TestFlight)

---

## 5. Android Build & Deployment

### 5.1 Add Android Platform

```bash
cd frontend

# Build frontend first (required!)
npm run build:prod

# Add Android platform
npx cap add android

# This creates: android/ directory with Gradle project
```

### 5.2 Sync Capacitor Assets

```bash
# Sync all changes from web (dist/) to native Android
npx cap sync android

# This copies dist/ files to Android WebView
```

### 5.3 Open Android Studio Project

```bash
# Open Android project in Android Studio
npx cap open android

# Alternatively, manually open:
# File → Open → frontend/android/
```

### 5.4 Generate Signing Key

Create a keystore for signing releases:

```bash
# Generate new keystore (one-time)
keytool -genkey -v -keystore ~/.android/tuc-rms.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias tuc-rms

# You'll be prompted for:
# - Keystore password: [enter secure password]
# - Key password: [same as keystore password]
# - Name, Organization, City, State, Country
```

**Keep the password safe!** You'll need it for all future Android releases.

### 5.5 Build for Development (Emulator)

**Start Android Emulator:**
```bash
# List available emulators
emulator -list-avds

# Start emulator (e.g., Pixel 4 API 33)
emulator -avd Pixel_4_API_33 &
```

**Build & Run:**
```bash
cd frontend/android

# Build debug APK
./gradlew assembleDebug

# Deploy to emulator/connected device
adb install -r app/build/outputs/apk/debug/app-debug.apk

# Or from Gradle:
./gradlew installDebug
```

**Expected Output:**
- APK installs on emulator
- App launches with login screen
- No errors in Logcat

### 5.6 Build for Production (Release)

**In Android Studio:**
1. Go to **Build** → **Generate Signed Bundle / APK**
2. Select **Bundle (Google Play)**
3. Next → Configure signing:
   - Key store path: `~/.android/tuc-rms.jks`
   - Key alias: `tuc-rms`
   - Key passwords: [enter password]
4. Next → Release configuration
5. Finish

**Output:** `app/release/app-release.aab` (Android App Bundle)

**Or from command line:**
```bash
cd frontend/android

# Create signing configuration
echo "storeFile=~/.android/tuc-rms.jks" > signing.properties
echo "storePassword=YOUR_KEYSTORE_PASSWORD" >> signing.properties
echo "keyAlias=tuc-rms" >> signing.properties
echo "keyPassword=YOUR_KEY_PASSWORD" >> signing.properties

# Build release bundle
./gradlew bundleRelease

# Output: app/release/app-release.aab
```

---

## 6. Device Testing

### 6.1 iOS Physical Device Testing

**Connect Device:**
1. Plug iPhone into Mac via USB
2. Xcode automatically detects device
3. In Xcode: Product → Destination → [Your iPhone]

**Deploy & Test:**
```bash
# Build and run on device
# In Xcode: Product → Run (Cmd+R)
```

**Enable Developer Mode (iOS 16+):**
1. Settings → Privacy & Security → Developer Mode
2. Toggle ON
3. Restart device

### 6.2 Android Physical Device Testing

**Connect Device:**
1. Plug Android phone into computer via USB
2. On phone: Settings → Developer Options → USB Debugging → ON

**Deploy & Test:**
```bash
# Verify device is connected
adb devices
# Expected: [device-id] device

# Install app
adb install -r app/build/outputs/apk/debug/app-debug.apk

# View logs in real-time
adb logcat | grep "TUC\|error\|crash"
```

### 6.3 Testing Checklist

After deploying to device, verify:

- [ ] App launches without crash
- [ ] Login screen displays
- [ ] Can login with demo credentials
- [ ] Dashboard loads with stats
- [ ] Theme switching works (Light → Dark → High-Contrast)
- [ ] Navigation menu opens/closes
- [ ] Can view results/grades
- [ ] Network timeout after 5 minutes inactivity
- [ ] Logout clears session
- [ ] Offline mode works (if implemented)
- [ ] Touch interactions are responsive
- [ ] Text is legible on small screens
- [ ] No console errors in DevTools

---

## 7. Troubleshooting

### Issue: "Pod install failed" (iOS)

**Solution:**
```bash
cd ios/App
rm -rf Pods Podfile.lock
pod install
```

### Issue: "Gradle build failed" (Android)

**Solution:**
```bash
cd android

# Clean build cache
./gradlew clean

# Rebuild
./gradlew assembleDebug
```

### Issue: "WebView fails to load" (Android)

**Solution:** Verify `capacitor.config.ts`:
```typescript
server: {
  hostname: 'ai-tools.techbridge.edu.gh',
  androidScheme: 'https',  // Must be https
}
```

### Issue: "App Crashes on Launch"

**Solution (iOS):**
1. Open Xcode console
2. Look for red error messages
3. Verify `capacitor.config.ts` is correct
4. Check `dist/` folder exists and has index.html

**Solution (Android):**
1. Open Android Studio Logcat
2. Filter for `error` or app package name
3. Look for "Capacitor" errors
4. Verify `capacitor.config.ts` is correct

### Issue: "Cannot Connect to API"

**Solution:**
1. Verify backend is running: `curl http://localhost:5000/api/health`
2. On emulator, use `http://10.0.2.2:5000` (not localhost)
3. On physical device, use production URL: `https://results.tuc.edu.gh`
4. Check firewall/network policies

---

## 8. Capacitor Workflow

### 8.1 Development Workflow

```bash
# 1. Make code changes to frontend/src
nano frontend/src/pages/Dashboard.tsx

# 2. Rebuild web app
cd frontend
npm run build:prod

# 3. Sync to native platforms
npx cap sync  # Both iOS and Android

# 4. Deploy to simulator/device
npx cap open ios  # Xcode
npx cap open android  # Android Studio
```

### 8.2 Update Capacitor

```bash
# Update to new version (e.g., 9.0.0)
npm install @capacitor/cli@9.0.0
npm install @capacitor/core@9.0.0
npm install @capacitor/ios@9.0.0
npm install @capacitor/android@9.0.0

# Update plugins
npm update

# Sync changes
npx cap sync
```

---

## 9. Performance Optimization

### 9.1 App Size

**Current Size (v1.0.0):**
- iOS IPA: ~25 MB (uncompressed)
- Android AAB: ~18 MB (uncompressed)

**Optimisation Tips:**
- Remove unused npm packages: `npm prune`
- Enable production build: `npm run build:prod`
- Use tree-shaking in Vite config
- Compress images before bundling

### 9.2 Startup Time

**Target:** <2 seconds (cold start)

**Measured:**
- iOS simulator: ~1.2 sec
- Android emulator: ~1.5 sec
- Physical device (iPhone 14): ~0.8 sec
- Physical device (Pixel 6): ~1.0 sec

**Optimisation:**
- Lazy-load heavy pages
- Cache static assets
- Enable SplashScreen (hides loading time)

---

## 10. Release Checklist

Before submitting to app stores:

**Code Quality:**
- [ ] TypeScript compilation: zero errors
- [ ] ESLint: zero warnings
- [ ] Unit tests: all passing
- [ ] E2E tests: all passing

**Functionality:**
- [ ] App launches without crash
- [ ] Login works with demo credentials
- [ ] All pages load correctly
- [ ] Theme switching functional
- [ ] Session timeout works

**Accessibility:**
- [ ] ARIA labels present
- [ ] Focus visible on interactive elements
- [ ] Keyboard navigation works
- [ ] Colour contrast ≥ 4.5:1

**Performance:**
- [ ] Startup time <2 seconds
- [ ] No memory leaks
- [ ] No console errors/warnings

**iOS:**
- [ ] Xcode build succeeds
- [ ] Code signing configured
- [ ] Runs on physical device
- [ ] Tested on iPhone 14 + 14 Pro Max

**Android:**
- [ ] Gradle build succeeds
- [ ] Signing key configured
- [ ] Runs on Pixel emulator + physical device
- [ ] Tested on Android 8 + 13

**Metadata:**
- [ ] App icons present (1024×1024 px)
- [ ] Screenshots captured (2–8 per platform)
- [ ] Description & keywords complete
- [ ] Privacy policy live & accessible

---

## Support & Resources

**Official Documentation:**
- Capacitor: https://capacitorjs.com/docs
- iOS: https://developer.apple.com/ios/
- Android: https://developer.android.com/

**Contact & Support:**
- Email: ict@tuc.edu.gh
- Slack: #mobile-development
- Issues: GitHub tuc-rms repository

---

**Document Status:** Final — Version 3.0  
**Next Review Date:** 1 August 2026
