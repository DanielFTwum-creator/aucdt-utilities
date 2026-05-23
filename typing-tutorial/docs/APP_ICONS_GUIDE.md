# MOBILE LAUNCH ICON AND SPLASH SYSTEM SPECIFICATIONS
## Document ID: TUC-INC-2026-006
### Standards Association: Apple Human Interface guidelines | Google Material Design Icons

This technical layout guide summarizes the resource matrices and size standards required for app icons.

---

## 1. Asset Generation Tools (Recommended Workflow)

Instead of manually editing and outputting dozens of image sizes, engineers should utilize the Capacitor Assets tool chaining:
```bash
# Install asset generator CLI
npm install -g @capacitor/assets

# Create assets folder at project root with source images
# Input sizes required:
# - assets/icon-only.png (minimum 1024x1024px, square, no transparency for iOS)
# - assets/splash.png (minimum 2732x2732px, centered icon, background layer)

# Run generation script to automate asset replication
npx capacitor-assets generate --ios --android
```

---

## 2. iOS Asset Size Matrix
These assets are stored within `/ios/App/App/Assets.xcassets/AppIcon.appiconset`:

| Image Filename | Target Resolution | Target Scale | Source Device Scope |
| :--- | :---: | :---: | :--- |
| `AppIcon-20x20@2x.png` | 40 x 40 px | @2x | iPad Notification |
| `AppIcon-20x20@3x.png` | 60 x 60 px | @3x | iPhone Notification |
| `AppIcon-29x29@2x.png` | 58 x 58 px | @2x | iPad Settings / iPhone Spotlight |
| `AppIcon-29x29@3x.png` | 87 x 87 px | @3x | iPhone Settings |
| `AppIcon-40x40@2x.png` | 80 x 80 px | @2x | Spotlight iPad / iPhone |
| `AppIcon-40x40@3x.png` | 120 x 120 px | @3x | Spotlight iPhone |
| `AppIcon-60x60@2x.png` | 120 x 120 px | @2x | App Launcher iPhone Standard |
| `AppIcon-60x60@3x.png` | 180 x 180 px | @3x | App Launcher iPhone High Res |
| `AppIcon-76x76@2x.png` | 152 x 152 px | @2x | App Launcher iPad Pro / Standard |
| `AppIcon-83.5x83.5@2x.png` | 167 x 167 px | @2x | App Launcher iPad Pro 12.9-inch |
| `AppIcon-1024x1024.png` | 1024 x 1024 px | @1x | App Store Listing Cover |

---

## 3. Android mipmap Asset Matrix
These assets are placed folders inside `/android/app/src/main/res/`:

### 3.1 Legacy Icon Sets
- Located in: `mipmap-[density]/ic_launcher.png`

| Relative Resource Directory | DPI Target | Dimensions |
| :--- | :---: | :---: |
| `res/mipmap-mdpi/ic_launcher.png` | Medium (~160 dpi) | 48 x 48 px |
| `res/mipmap-hdpi/ic_launcher.png` | High (~240 dpi) | 72 x 72 px |
| `res/mipmap-xdpi/ic_launcher.png` | Extra High (~320 dpi) | 96 x 96 px |
| `res/mipmap-xxhdpi/ic_launcher.png` | Double Extra (~480 dpi) | 144 x 144 px |
| `res/mipmap-xxxhdpi/ic_launcher.png` | Triple Extra (~640 dpi) | 192 x 192 px |

### 3.2 Adaptive Icons (Recommended for Android 8.0+)
Adaptive icons split elements into separate Foreground vector layers (`ic_launcher_foreground.xml`) and Background color fields (`ic_launcher_background.xml` or custom colors in `colors.xml`).
- Stored inside: `res/mipmap-[density]/ic_launcher_foreground.png` and `res/values/ic_launcher_background.xml`.
- Dimensions: 108dp x 108dp centered (Safe rendering zone is the inner 66dp circular mask).
