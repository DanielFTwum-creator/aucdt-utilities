# Mobile Build & Test Guide
## Techbridge AI Blueprint [TAB]

This guide covers the local development, building, and testing workflow for the mobile versions of [TAB].

### 1. Prerequisites
- **Node.js & NPM**: Installed and updated.
- **Capacitor CLI**: `npm install -g @capacitor/cli`.
- **Xcode**: Required for iOS (macOS only).
- **Android Studio**: Required for Android builds.

### 2. Synchronization Workflow
Whenever web code inside `/src` is updated, you must sync the mobile platforms:
```bash
npm run mobile:sync
```

### 3. Native Platform Builds
- **iOS**: `npm run build:ios`
- **Android**: `npm run build:android`

### 4. Testing on Simulators
#### iOS Simulator
1. Run `npm run ios:open`.
2. In Xcode, select a simulator (e.g., iPhone 15).
3. Click the 'Play' button to build and run.

#### Android Emulator
1. Run `npm run android:open`.
2. In Android Studio, ensure an AVD (Android Virtual Device) is created.
3. Click 'Run' (Green Arrow).

---
*Created by: TUC ICT Department*
