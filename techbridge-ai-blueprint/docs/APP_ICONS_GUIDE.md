# App Icons & Splash Screen Guide
## Techbridge AI Blueprint [TAB]

Guidelines for generating branding assets for the mobile application.

### 1. Requirements
- **App Icon**: 1024x1024px (no transparency for iOS).
- **Splash Screen**: 2732x2732px (centered content).

### 2. Automated Generation
We use `@capacitor/assets` to generate all required sizes from a single source file.

1. Place your source images in `/assets`:
   - `assets/logo.png`
   - `assets/splash.png` (or `splash-dark.png`)

2. Run the generation script:
   ```bash
   npx @capacitor/assets generate
   ```

### 3. Manual Placement (Paths)
- **iOS Icons**: `ios/App/App/Assets.xcassets/AppIcon.appiconset`
- **Android Icons**: `android/app/src/main/res/mipmap-*`

---
*Created by: TUC ICT Department*
