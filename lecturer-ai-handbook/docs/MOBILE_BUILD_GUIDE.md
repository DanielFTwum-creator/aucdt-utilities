# LECTURER AI — MOBILE COMPILATION & BUILD WORKFLOW
## DOCUMENT REF: TUC-MOB-BUILD-2026
### COMPILER: Capacitor 6.x, Xcode 15+, Android Studio Jellyfish+

---

## 1. COMPILATION SEQUENCES
Follow these exact CLI commands sequentially to compile production bundles from your local development environment.

```
+-----------------+      npm run build      +-------------------+
| React JS Source |------------------------>|  Static /dist Folder |
+-----------------+                         +-------------------+
                                                      |
                                                 cap sync
                                                      v
                                        +----------------------------+
                                        |  iOS / Android native code |
                                        +----------------------------+
```

### 1.1 iOS Native Platform Compilation
```bash
# 1. Compile React production build
npm run build:web

# 2. Add the iOS platform natively (first time only)
npx cap add ios

# 3. Synchronize assets to Xcode platform directory
npm run build:ios

# 4. Open project in native Xcode environment
npm run ios:open
```

### 1.2 Android Native Platform Compilation
```bash
# 1. Compile React production build
npm run build:web

# 2. Add the Android platform natively (first time only)
npx cap add android

# 3. Synchronize assets to Android Studio directory
npm run build:android

# 4. Open project in Android Studio IDE
npm run android:open
```

---

## 2. NATIVE STUDIO CONFIGURATION & EXPORTS

### Xcode (macOS / iOS Compilation)
1.  Once Xcode launches, select **App** in the left sidebar.
2.  In **General** -> **Identity**:
    *   Set **Bundle Identifier**: `com.techbridge.lecturerai`
    *   Set **Version**: `1.0.0`
    *   Set **Build**: `1`
3.  In **Signing & Capabilities**:
    *   Check **Automatically manage signing**.
    *   Select your Apple Developer Team profile.
4.  Set Target device to **Any iOS Device (arm64)**.
5.  Select **Product** -> **Archive** to bundle your App Store IPA.

### Android Studio (Windows / macOS / Linux)
1.  Once Android Studio compiles your Gradle sync, open `app/build.gradle`.
2.  Confirm configurations:
    ```groovy
    android {
        defaultConfig {
            applicationId "com.techbridge.lecturerai"
            minSdkVersion 22
            targetSdkVersion 34
            versionCode 1
            versionName "1.0.0"
        }
    }
    ```
3.  Go to **Build** -> **Generate Signed Bundle / APK**.
4.  Select **Android App Bundle (AAB)** (for Google Play Console) and enter your keystore details.
5.  Save your compiled release bundle (`app-release.aab`) in `app/release/`.

---

## 3. TYPICAL MOBILE BUILD ISSUES & RESOLUTIONS

### Issue 1: Web Assets Out of Sync
*   **Symptoms**: App loads, but new code modifications or prompt templates are absent.
*   **Reason**: Static files inside `dist/` were not synchronized to native platforms.
*   **Resolution**: Execute `npm run mobile:sync` to push assets into Xcode and Android Studio structures immediately.

### Issue 2: Android SDK Tools Missing
*   **Symptoms**: Gradle build fails during sync with error "Android SDK Build-Tools not found".
*   **Resolution**: Inside Android Studio, navigate to **Tools** -> **SDK Manager** -> **SDK Tools**. Install **SDK Build-Tools 34.0.0** and **Android SDK Command-line Tools (latest)**.

### Issue 3: CocoaPods Out of Date on macOS
*   **Symptoms**: `cap open ios` fails or Xcode fails to build with compiler linking errors.
*   **Resolution**: Sync CocoaPods dependencies manually:
    ```bash
    cd ios/App
    pod repo update
    pod install
    ```
