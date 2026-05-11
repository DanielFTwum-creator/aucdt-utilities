# Orbit Walk — Mobile Build Workflow

## Prerequisites
- **Xcode:** Required for iOS builds (macOS only).
- **Android Studio:** Required for Android builds.
- **Capacitor CLI:** Installed via `npm install`.

## Build Commands
### iOS Deployment
1. Sync web assets:
   ```bash
   npm run build:ios
   ```
2. Open in Xcode:
   ```bash
   npm run ios:open
   ```
3. In Xcode, configure "Signing & Capabilities" with your Team ID.

### Android Deployment
1. Sync web assets:
   ```bash
   npm run build:android
   ```
2. Open in Android Studio:
   ```bash
   npm run android:open
   ```
3. Press the "Run" button to deploy to a connected device or emulator.

## Debugging Tips
- **HMR:** Note that Hot Module Replacement does not work on native devices. You must run `npm run mobile:sync` after web code changes.
- **Console Logs:**
  - **iOS:** View logs in the Xcode console.
  - **Android:** View logs in the "Logcat" tab of Android Studio.

## Configuration Updates
If you change the App Name or Bundle ID, update `capacitor.config.ts` and then run:
```bash
npx cap copy
```
