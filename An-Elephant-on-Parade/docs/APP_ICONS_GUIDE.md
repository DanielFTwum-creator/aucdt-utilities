# Application Launcher Icon Compilation Standards
## Document Ref: TUC-MBL-ICO-2026-001
### Project: Techbridge AI Blueprint [TAB] — Launcher Assets Definition
### Organisation: Techbridge University College (TUC), Oyibi, Ghana

---

## 1. Icon Dimensions Specification

To look sharp on high-density mobile displays, the launcher icon must be formatted in these specific dimensions across iOS and Android containers.

### 1.1 iOS Icon Sizing Grid
For iOS platforms, supply a single high-resolution square file without transparency (alpha channel must be disabled). Xcode automatically scales this to the individual device sizes.

| Destination | Required Size (Pixels) | Format | Transparency |
| :--- | :--- | :--- | :--- |
| **App Store Connect Icon** | 1024 x 1024 | PNG | No Alpha |
| iPhone Home Screen (@3x) | 180 x 180 | PNG | No Alpha |
| iPhone Home Screen (@2x) | 120 x 120 | PNG | No Alpha |
| iPad Pro Home Screen (@2x) | 167 x 167 | PNG | No Alpha |
| iPad Home / iPad mini (@2x)| 152 x 152 | PNG | No Alpha |
| Spotlight Search (@3x) | 120 x 120 | PNG | No Alpha |
| Settings Menu (@3x) | 87 x 87 | PNG | No Alpha |

---

### 1.2 Android Adaptive Icons Grid
Android requires **Adaptive Icons**, which split the icon into a **Foreground vector layer** and a **Background layer** (solid colour or subtle pattern). This allows devices to apply custom masking shapes (squircle, circle, teardrop).

| Density Bucket | Foreground Size | Background Size | Output Path in `android/app/src/main/res/` |
| :--- | :--- | :--- | :--- |
| **xxxhdpi** | 432 x 432 | 432 x 432 | `mipmap-xxxhdpi/` |
| **xxhdpi** | 324 x 324 | 324 x 324 | `mipmap-xxhdpi/` |
| **xhdpi** | 216 x 216 | 216 x 216 | `mipmap-xhdpi/` |
| **hdpi** | 162 x 162 | 162 x 162 | `mipmap-hdpi/` |
| **mdpi** | 108 x 108 | 108 x 108 | `mipmap-mdpi/` |

---

## 2. Icon Generation Tools & Generation SOP

We recommend using the official `cordova-res` or `@capacitor/assets` toolchain to automatically generate icons from a single master layout file:

### 2.1 Step 1: Create 1024x1024 Master Source Files
1. Design a master logo file: `assets/icon-only.png` (1024x1024, centered branding inside a safe circle boundary of 660px to avoid cropping by Android adaptive systems).
2. Design a separate background cover: `assets/background.png` (1024x1024).

### 2.2 Step 2: Auto-Generate Assets via CLI
You can install and execute the native Capacitor asset tool:
```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate --android --ios
```
This CLI tool automatically reads the master source file, cuts the alpha bounds, creates adaptive layered grids, and automatically places output files into targeted Android mipmap folders and iOS `.appiconset` catalogs!

---

## 3. Manual Source Placement Paths

If doing manual asset substitution:
- **iOS Folder target check**:
  `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- **Android Folder MIPMAP target check**:
  `android/app/src/main/res/mipmap-xxxx/` directories for:
  - `ic_launcher.png` (Regular legacy launchers)
  - `ic_launcher_round.png` (circular launchers)
  - `ic_launcher_foreground.png` + `ic_launcher_background.xml` (Adaptive Launchers system)
