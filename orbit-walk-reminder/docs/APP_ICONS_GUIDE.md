# Orbit Walk — App Icon Generation

## Required Sizes
### iOS
- 20x20, 29x29, 40x40, 60x60, 76x76, 83.5x83.5 (@2x and @3x).
- 1024x1024 (App Store Icon).

### Android
- **Icon:** 48x48, 72x72, 96x96, 144x144, 192x192.
- **Adaptive Icons:** Background and Foreground layers (108x108px with safe zone).

## Generation Process
1. Prepare a high-resolution logo (1024x1024px).
2. We recommend using `@capacitor/assets` for automatic generation:
   ```bash
   npx @capacitor/assets generate --icon --ios --android
   ```
3. Icons will be placed in:
   - `ios/App/App/Assets.xcassets/AppIcon.appiconset`
   - `android/app/src/main/res/`

## Safe Zone Notice
Ensure the "Orbit-Walk" logo is centred within the inner 66% of the 1024x1024 canvas to avoid clipping on Android adaptive circular masks.
