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
