# Mobile Build & Compilation Guide [TUC-TAB-MOBILE]
### Document Reference: TUC-ICT-SRS-2026-602

**Institution:** Techbridge University College (TUC), Oyibi, Ghana  
**Author:** Senior Mobile Deployment Engineer  
**Approved by:** Daniel Twum, Head of ICT  

This document explains the technical compilation loop and diagnostic processes to translate the Techbridge React web codebase into native iOS and Android packages using Capacitor 8.3.3.

---

## 💻 1. Development Workstation Preparation
Ensure your command terminal has access to these environments before starting:

### macOS Environment (for iOS builds)
* **Xcode:** Version 15.0 or greater.
* **Command Line Tools:** Active.
* **Cocoapods:** `sudo gem install cocoapods` or `brew install cocoapods`.

### Windows / Linux / macOS (for Android builds)
* **Android Studio:** Version 2023.1 or greater.
* **JDK:** OpenJDK 21 installed and environment variables mapped (`JAVA_HOME`).
* **Android SDK Build-Tools:** Version 34+.

---

## ⚙️ 2. Step-by-Step Native Platform Compilation
Execute this steps in clean sequence under your project root directory:

### Step 2.1: Compile Web Production Distribution
Build and compile your React web sources into highly optimized HTML and bundle records inside `/dist`:
```bash
npm run build
```

### Step 2.2: Add Native Wrappers
If your native system platform targets are missing from root directory, inject them:
```bash
npx cap add ios
npx cap add android
```

### Step 2.3: Sync Code Assets
Transfer all static compiled structures from the local web directory `/dist` directly to native visual environments:
```bash
npx cap sync
```

### Step 2.4: Execute Development IDEs
Boot up platform editors holding project files:
```bash
# To open Xcode workspace
npx cap open ios

# To open Android Studio project
npx cap open android
```

---

## 🛠️ 3. Troubleshooting & Error Solutions

### Error 3.1: "Web Directory (/dist) not found"
* **Root Cause:** Trying to sync assets before generating production outputs.
* **Solution:** Run React compilation commands before syncing:
  ```bash
  npm run build
  npx cap sync
  ```

### Error 3.2: "Cocoapods unable to access dependency repositories"
* **Root Cause:** Outdated Cocoapods cache or local permissions clashes.
* **Solution:** Reset Cocoapods workspace:
  ```bash
  cd ios/App && pod repo update && pod install
  ```

### Error 3.3: "Android SDK version mismatch on build.gradle"
* **Root Cause:** Android Gradle plugin requires specific compiler SDK matching rules.
* **Solution:** Open `/android/variables.gradle` and confirm compiler specifications are updated:
  ```gradle
  ext {
      compileSdkVersion = 34
      targetSdkVersion = 34
      minSdkVersion = 22
  }
  ```
