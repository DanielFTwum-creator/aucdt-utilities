# Mobile Build & Debugging Guide

**Institution:** Techbridge University College (TUC)
**Document ID:** TUC-INC-2026-007

## 1. Build Workflow

To build the mobile applications, follow these exact steps. Ensure you are on macOS for iOS builds.

### Step 1: Web Assets Compilation
First, compile the frontend application to static assets.
```bash
npm run build:web
```

### Step 2: Synchronize with Capacitor
Sync the compiled assets and any plugin updates to the native projects.
```bash
npm run mobile:sync
```

### Step 3: Platform Specific Builds

**For iOS:**
```bash
npm run build:ios
npm run ios:open
```
This opens Xcode, where you can select your target device/simulator and press Run.

**For Android:**
```bash
npm run build:android
npm run android:open
```
This opens Android Studio, where you can build the APK/AAB or run on an emulator.

## 2. Common Errors and Fixes

### Error: "Cannot find module '@capacitor/core'"
- **Fix:** Run `npm install` to ensure all node modules are present.

### Error (iOS): "Podfile lock sync error"
- **Fix:** Navigate to the `/ios/App` directory and run `pod install` manually. Ensure CocoaPods is updated.

### Error (Android): "SDK location not found"
- **Fix:** Ensure the `ANDROID_HOME` environment variable is set to your Android SDK path, or create a `local.properties` file in the `/android` folder specifying `sdk.dir=/path/to/sdk`.

### White Screen on Device Startup
- **Fix:** Inspect the device logs (using Safari Web Inspector for iOS or Chrome DevTools `chrome://inspect` for Android). Common causes are runtime exceptions or blocked network requests in the web layer.
