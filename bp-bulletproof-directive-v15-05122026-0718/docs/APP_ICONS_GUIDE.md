# App Icons Generation Process

**Institution:** Techbridge University College (TUC)
**Document ID:** TUC-INC-2026-008

## 1. Required Asset Sizes

### iOS Requirements
- **App Icon:** 1024x1024 px (PNG, no transparency). Must be placed in `ios/App/App/Assets.xcassets/AppIcon.appiconset`.
- **Splash Screen:** 2732x2732 px (PNG).

### Android Requirements
- **App Icons:** Needs adaptive icons (foreground and background layers, ideally vector XML or transparent PNGs) for all mipmap densities (ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi).
- **Splash Screen:** Handled typically by a unified Vector Drawable in `android/app/src/main/res/drawable`.

## 2. Recommended Tools
We recommend using the official `@capacitor/assets` tool to automate icon and splash screen generation for both platforms.

```bash
# 1. Install the tool
npm install -g @capacitor/assets

# 2. Place source images
# Create an `assets` folder at the root.
# Add `assets/icon.png` (1024x1024, no transparency for iOS)
# Add `assets/splash.png` (2732x2732, safe zone in center)

# 3. Generate native assets
npx @capacitor/assets generate --ios
npx @capacitor/assets generate --android
```

## 3. Manual Placement Paths
If adjusting manually:
- **iOS Icon:** `/ios/App/App/Assets.xcassets/AppIcon.appiconset`
- **Android Icon:** `/android/app/src/main/res/mipmap-*`
