# TUC AI Lab — Mobile Build Guide

**Complete workflow for building, testing, and debugging iOS and Android apps**

---

## Quick Build Commands

```bash
# Web build (required before any mobile build)
npm run build:web

# Sync to native projects (after web build)
npx capacitor sync

# iOS build (requires Xcode 15+)
npm run build:ios
npm run ios:open  # Opens Xcode

# Android build (requires Android Studio 2024.1+)
npm run build:android
npm run android:open  # Opens Android Studio

# Rebuild all platforms after code changes
npx capacitor sync
```

---

## iOS Build Workflow

### Prerequisites
- macOS 12.0+
- Xcode 15.0+ (from App Store)
- CocoaPods: `sudo gem install cocoapods`
- Apple Developer Account (for device testing)

### Step 1: Build Web Bundle
```bash
npm run build:web
# Creates dist/ directory with optimized web assets
```

### Step 2: Sync to iOS Project
```bash
npx capacitor sync ios
# Updates ios/App/public/ with latest web bundle
```

### Step 3: Open Xcode
```bash
npm run ios:open
# Or manually: open ios/App/App.xcworkspace
```

### Step 4: Configure Signing (First Time)
1. **Select target:** Project navigator → "App"
2. **General tab:**
   - Bundle Identifier: `com.techbridge.ailab`
   - Team: Select your Apple Developer team
3. **Signing Certificate:** Automatic (Xcode manages)
4. **Capabilities:** No special capabilities needed (default)

### Step 5: Run on Simulator
```bash
# In Xcode:
# 1. Select simulator (top-left dropdown) → iPhone 15 Pro
# 2. Product → Run (⌘R)
# 3. Wait 30-60 seconds for app to launch
```

### Step 6: Run on Physical Device
```bash
# 1. Connect iPhone via USB
# 2. Trust the computer on device
# 3. In Xcode: Select device from dropdown
# 4. Product → Run (⌘R)
# 5. Wait for build and install (2-5 minutes)
```

### Step 7: Debug with Safari Web Inspector
```bash
# 1. Connect iPhone via USB
# 2. Open Safari on Mac
# 3. Safari → Develop → [Your Device] → [App Name]
# 4. Web inspector opens (like Chrome DevTools)
# 5. View console logs, inspect HTML, set breakpoints
```

### Step 8: View Console Logs
```bash
# In Xcode:
# 1. Product → Scheme → Edit Scheme
# 2. Run → Diagnostics → Console (check box)
# 3. Cmd+Shift+C to show console window
# 4. All console.log() output appears here
```

---

## Android Build Workflow

### Prerequisites
- Android Studio 2024.1+
- Android SDK 34+ (API level)
- Java Development Kit 11+
- Google Play Developer Account (for device testing)

### Step 1: Build Web Bundle
```bash
npm run build:web
# Creates dist/ directory
```

### Step 2: Sync to Android Project
```bash
npx capacitor sync android
# Updates android/app/src/main/assets/public/
```

### Step 3: Open Android Studio
```bash
npm run android:open
# Or manually: open android/ folder in Android Studio
```

### Step 4: Configure Android SDK (First Time)
1. **File → Settings → Appearance & Behavior → System Settings → Android SDK**
2. **SDK Platforms Tab:**
   - ☐ Android 13 (API 33) — minimum support
   - ☑ Android 14 (API 34) — target API
   - ☑ Android 15 (API 35) — latest
3. **SDK Tools Tab:**
   - ☑ Android SDK Build Tools 35.x
   - ☑ Android Emulator
   - ☑ Android SDK Platform Tools
4. **Click "Apply" → Accept license → Wait for download (5-10 min)**

### Step 5: Create Android Emulator
```bash
# In Android Studio:
# 1. Tools → Device Manager → Create Device
# 2. Select device: Pixel 9 (or latest)
# 3. Select system image: Android 14 (API 34)
# 4. Finish → Wait for emulator setup (2-5 min)
# 5. Launch emulator: click ▶ button
```

### Step 6: Run on Emulator
```bash
# In Android Studio:
# 1. Select emulator from top dropdown
# 2. Run → Run 'app' (Shift+F10)
# 3. Wait for build and install (3-5 minutes)
```

### Step 7: Run on Physical Device
```bash
# 1. Enable Developer Mode on Android phone:
#    Settings → About Phone → Build Number (tap 7 times)
# 2. Enable USB Debugging:
#    Settings → Developer Options → USB Debugging
# 3. Connect phone via USB
# 4. Allow USB debugging on phone prompt
# 5. In Android Studio: Select device from dropdown
# 6. Run → Run 'app' (Shift+F10)
# 7. Wait for install (2-5 minutes)
```

### Step 8: View Logcat (Console Logs)
```bash
# In Android Studio:
# 1. View → Tool Windows → Logcat
# 2. Logcat window opens at bottom
# 3. Filter: type "console.log" to see JavaScript logs
# 4. Scroll to see all messages
```

### Step 9: Debug with Chrome DevTools
```bash
# 1. In Android emulator/device, open app
# 2. On computer, open Chrome
# 3. Go to: chrome://inspect/#devices
# 4. Your app should appear
# 5. Click "inspect"
# 6. Chrome DevTools opens (like desktop Chrome)
```

---

## Testing Checklist

Before submitting to app stores, verify all features:

### Functionality
- ☐ App launches without crashing
- ☐ Search works (type query, tap search button)
- ☐ Filters work (select category, date range)
- ☐ Resource cards load and display
- ☐ Resource detail page opens
- ☐ External links work (open in browser)
- ☐ Admin login works with correct password
- ☐ Admin login fails with wrong password
- ☐ Resource creation works
- ☐ Resource editing works
- ☐ Resource deletion works with confirmation
- ☐ Export (JSON/CSV) downloads file
- ☐ Theme switching works (light → dark → high-contrast)
- ☐ Theme persists after closing and reopening app

### UI/UX
- ☐ All text is readable (not cut off, not too small)
- ☐ Buttons are tappable (min 44×44 pt)
- ☐ Keyboard navigation works (Tab, Enter, Escape)
- ☐ Back button works
- ☐ Layout adjusts for landscape orientation
- ☐ Images load without distortion
- ☐ Icons are visible in all themes

### Performance
- ☐ App launches in < 3 seconds
- ☐ Search returns results in < 200ms
- ☐ No lag when scrolling through results
- ☐ Memory usage is reasonable (< 200 MB)
- ☐ No memory leaks (RAM stable over time)
- ☐ Battery usage is reasonable (< 2% per hour idle)

### Accessibility
- ☐ All interactive elements have labels
- ☐ High-contrast theme is readable (yellow on black)
- ☐ Font sizes can be adjusted
- ☐ Animations can be disabled
- ☐ Screen reader works (VoiceOver on iOS, TalkBack on Android)

### Network
- ☐ App works on WiFi
- ☐ App works on cellular (LTE)
- ☐ Handles slow network gracefully (shows loading, no timeout < 10s)
- ☐ Handles offline (shows appropriate message)
- ☐ Handles network interruption (can retry)

### Device-Specific
**iOS:**
- ☐ Notch/Dynamic Island not covering content
- ☐ Safe area respected (no status bar overlap)
- ☐ Face ID / Touch ID not blocking interaction
- ☐ Landscape orientation works

**Android:**
- ☐ Status bar colour matches app theme
- ☐ Navigation bar colour matches app theme
- ☐ Gesture navigation works (swipe back)
- ☐ Hardware back button works
- ☐ Both portrait and landscape work

---

## Debugging Common Issues

### App Crashes on Launch
```bash
# 1. Check console logs (Safari or Chrome DevTools)
# 2. Look for JavaScript errors
# 3. Common causes:
#    - API key missing (VITE_GEMINI_API_KEY)
#    - IndexedDB initialization error
#    - Large asset not loading

# Fix:
npm run build:web
npx capacitor sync
# Run again
```

### White Screen (App Loads But Shows Nothing)
```bash
# 1. Open DevTools (Safari or Chrome Inspector)
# 2. Check Network tab — are assets loading?
# 3. Check Console tab — any errors?
# 4. Common causes:
#    - HTML not finding React root (#root element missing)
#    - CSS not loading
#    - JavaScript error preventing render

# Fix:
# Check index.html has <div id="root"></div>
# Check vite.config.ts has base: './'
npm run build:web
npx capacitor sync
```

### Search Not Working
```bash
# 1. Open DevTools
# 2. Type in search box
# 3. Check Console for errors
# 4. Common causes:
#    - Search data not loaded
#    - Filter state not updating
#    - API call failing

# Fix:
# Verify data is in IndexedDB
# Check network requests in DevTools Network tab
```

### Theme Not Persisting
```bash
# 1. Switch theme
# 2. Close app completely
# 3. Reopen — should be same theme
# 4. If it resets to light:
#    - Check localStorage is enabled
#    - Verify key is 'tuc-ai-lab-catalog-theme'

# Fix:
# In DevTools Console:
localStorage.getItem('tuc-ai-lab-catalog-theme')
localStorage.setItem('tuc-ai-lab-catalog-theme', 'dark')
```

### Performance Issues (Slow or Janky)
```bash
# 1. Open DevTools
# 2. Performance tab → Record
# 3. Scroll through catalogue
# 4. Stop recording
# 5. Look for long tasks (> 50ms)
# 6. Common causes:
#    - Large image rendering
#    - Expensive JavaScript computation
#    - Layout thrashing

# Fix:
# Enable hardware acceleration
# Reduce number of items rendered at once
# Use React.memo() for expensive components
```

### App Won't Build
```bash
# iOS:
xcode-select --install  # Install Xcode command tools
pod repo update  # Update CocoaPods
rm -rf ios/Pods ios/Podfile.lock
npx capacitor sync ios

# Android:
./android/gradlew clean
./android/gradlew sync
```

---

## CI/CD Integration (GitHub Actions)

Example workflow file (`.github/workflows/build.yml`):

```yaml
name: Build Mobile Apps

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: pnpm install
      - run: npm run build:web
      - run: npx capacitor sync ios
      - run: |
          cd ios/App
          xcodebuild build -scheme App -configuration Release

  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - uses: actions/setup-java@v3
        with:
          java-version: '11'
          distribution: 'temurin'
      - run: pnpm install
      - run: npm run build:web
      - run: npx capacitor sync android
      - run: |
          cd android
          ./gradlew assembleRelease
```

---

## Testing on Real Devices

### iOS Device Testing
1. **Register device:** [developer.apple.com/account](https://developer.apple.com/account) → Devices
2. **Get UDID:** Connect phone → Xcode → Window → Devices & Simulators → Copy UDID
3. **Register UDID in developer account**
4. **Create provisioning profile:** Includes your new device
5. **Download and import provisioning profile in Xcode**
6. **Run on device:** Select device, Product → Run

### Android Device Testing
1. **Enable USB debugging** on Android device
2. **Connect via USB**
3. **Trust the computer** on device
4. **In Android Studio:** Select device, Run → Run 'app'

---

## Beta Testing (TestFlight & Firebase)

### iOS TestFlight
1. Archive app in Xcode
2. Submit to App Store Connect
3. Click "TestFlight" tab
4. Add test users (email addresses)
5. Users receive TestFlight link, can test app
6. Collect feedback before public release

### Android Firebase App Distribution
```bash
# 1. Set up Firebase project (console.firebase.google.com)
# 2. Install Firebase CLI: npm install -g firebase-tools
# 3. Login: firebase login
# 4. Build release APK
# 5. Upload:
firebase appdistribution:distribute android/app/build/outputs/apk/release/app-release.apk \
  --app 1:123456789:android:abcdef1234567890 \
  --testers "test@example.com"
```

---

**Last Updated:** 10 May 2026  
**Status:** Production Ready
