# Mobile Packaging & Build Engineering Guide
## Document Ref: TUC-MBL-BLD-2026-001
### Project: Techbridge AI Blueprint [TAB] — Capacitor Mobile Bundle Integration
### Organisation: Techbridge University College (TUC), Oyibi, Ghana

---

## 1. Local Prerequisites

Before compiling mobile targets, verify that your development station possesses the following baseline environments:

- **Node.js**: LTS version (18 or 20 are supported).
- **Android Studio**: Dolphin or newer with Android SDK Build-Tools 34+.
- **Xcode**: Version 15+ (required for iOS compiling, macOS exclusively).
- **CocoaPods**: Version 1.13+ (mandatory for managing native iOS dependencies).

---

## 2. Step-by-Step Build Pipeline

Execute these scripts sequentially from the root directory to translate the React + TypeScript frontend into native compilation binaries.

### 2.1 Web Build Execution
Compile the absolute web distribution bundle:
```bash
npm run build
```
This outputs static assets into the root `/dist` folder.

### 2.2 Synchronise Web Assets to Capacitor Platform Shells
Inject the newly compiled static assets directly into the native iOS and Android packages:
```bash
npx cap sync
```
This updates dependencies and copies files safely.

### 2.3 Compile Android Binaries (AAB / APK)
1. Launch Android Studio directly pointed to our Android project shell:
   ```bash
   npx cap open android
   ```
2. Wait for Google Gradle sync to complete.
3. To generate a debugging APK: Select **Build -> Build Bundle(s) / APK(s) -> Build APK(s)** in Android Studio.
4. To generate a signed App Bundle for store upload: Select **Build -> Generate Signed Bundle / APK** and provide the TUC release Keystore asset.

### 2.4 Compile iOS Binaries (Xcode Workspace)
1. Open the native workspace within Xcode:
   ```bash
   npx cap open ios
   ```
2. Choose your active signing unit under **Signing & Capabilities** (select TUC developer profile).
3. Set the target destination to **Any iOS Device (arm64)**.
4. Select **Product -> Archive** to compile the distribution target.

---

## 3. Common Compilation Errors & Troubleshooting

### 3.1 Error: "Capacitor not found" or "npx cap command fails"
- **Cause**: The Capacitor CLI dependencies are missing from the environment.
- **Remedy**: Install packages explicitly:
  ```bash
  npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
  ```

### 3.2 Error: "Could not find android.jar" or "Build tools mismatch"
- **Cause**: Android Studio does not have the target SDK platforms installed.
- **Remedy**:
  1. Open Android Studio -> Settings -> Appearance & Behavior -> System Settings -> Android SDK.
  2. Install **Android 14 (API level 34)** or higher.
  3. Under SDK Tools, confirm that Android SDK Platform-Tools and Build-Tools are checked.

### 3.3 Error: "CocoaPods did not sync" or "Podfile out of sync"
- **Cause**: iOS pods mismatch on macOS.
- **Remedy**:
  ```bash
  cd ios/App
  pod repo update
  pod install
  cd ../..
  npx cap sync ios
  ```

### 3.4 Error: "Web Audio failing on physical mobile viewports"
- **Cause**: Browser engines block audio context threads until a touch gesture occurs.
- **Remedy**: Ensure the application presents a "Tap to Start / Enable Audio" overlay when the App is booted up (already integrated into the main `App.tsx` navigation bar).

---

## 4. Automation Commands Reference

To speed up operational cycles, we have integrated rapid scripts in `package.json`:
- `npm run build:ios`: Rebuilds web assets and opens Xcode.
- `npm run build:android`: Rebuilds web assets and opens Android Studio.
- `npm run mobile:sync`: Executes immediate sync actions.
