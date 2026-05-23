# MOBILE DEVICE CODE COMPILATION AND DIAGNOSIS
## Document ID: TUC-INC-2026-005
### System Version: Capacitor 8.3.3

This developer guide highlights commands, error logs, and corrections for preparing local native builds of the Typing Tutorial.

---

## 1. Local Environment Pre-Requisites

Before starting native tasks, configure these runtime environments:

### 1.1 macOS Environment (iOS & Android compile)
- Instal **Xcode 15+** from the Mac App Store.
- Install **Cocoapods**:
  ```bash
  sudo gem install cocoapods
  ```
- Install Android Studio and JDK 17 (needed for Android Gradle pipelines).

### 1.2 Windows/Linux Environment (Android compile only)
- Download and install **Android Studio** (Koala or newer).
- Configure environment variable configurations in `.bashrc` or `.zshrc`:
  ```bash
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
  ```

---

## 2. Command Pipeline Reference

Run these commands in order from the root directory of the application:

### Step 2.1: Compile the Web Stack
Produces a release bundle (optimized static assets) inside `/dist`:
```bash
npm run build
```

### Step 2.2: Sync with Capacitor Platform
Copies web assets and configures platform source dependencies:
```bash
npx cap sync
```

### Step 2.3: Open and Run on Physical Device or Emulator
For iOS (Opens Xcode IDE):
```bash
npx cap open ios
```
For Android (Opens Android Studio IDE):
```bash
npx cap open android
```

---

## 3. Troubleshooting & Core Error Logs

### 3.1 iOS pod install Failure
* **Symptoms:** Sync completes but Xcode project throws "Could not find Podfile" or cocoapods integration failure during dependency synchronization.
* **Resolution:** Reinstall matching Cocoapods, clear cache, and sync:
  ```bash
  cd ios/App
  pod cache clean --all
  pod deintegrate
  pod setup
  arch -x86_64 pod install || pod install
  ```

### 3.2 Android SDK Location Missing
* **Symptoms:** Android Studio compiling throws `SDK Location not found` error, or `local.properties` file not automatically written.
* **Resolution:** Write `/android/local.properties` manually:
  ```properties
  sdk.dir=/Users/yourusername/Library/Android/sdk
  ```

### 3.3 Touch Event Latency Issues
* **Symptoms:** Interactive buttons double-triggering or feeling slow on mobile viewports.
* **Resolution:** Standardise Touch interactions. Remove hover dependencies on mobile CSS and ensure active styles have:
  ```css
  -webkit-tap-highlight-color: transparent;
  ```
  And configure `touch-action: manipulation` for interactive typing pads.
