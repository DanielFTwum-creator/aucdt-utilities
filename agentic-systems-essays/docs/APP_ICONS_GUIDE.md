# Mobile Application Asset Generation SOP [TUC-TAB-ICONS]
### Document Reference: TUC-ICT-SRS-2026-603

**Institution:** Techbridge University College (TUC), Oyibi, Ghana  
**Author:** Senior Mobile Deployment Engineer  
**Approved by:** Daniel Twum, Head of ICT  

This SOP documents the graphical standards and exact directory mapping for deploying application launcher icons and splash branding screens across mobile operating systems.

---

## 🎨 1. App Launcher Icon Guidelines
To represent Techbridge University College appropriately on a user's phone, use high-contrast and non-flickering visual assets matching professional typography standards.

* **Color Space:** sRGB.
* **Format:** Alpha channels must be omitted in iOS app stores. Adaptive vectors are supported in Android.

### 🖼️ 1.1 iOS Asset Requirements
Place generated resources inside the Xcode folder tree: `/ios/App/App/Assets.xcassets/AppIcon.appiconset/`

| Filename | Purpose / Device Class | Target Dimensions (px) |
| :--- | :--- | :--- |
| `icon-20x20@2x.png` | Notification Icon - iPad (Retina) | 40 x 40 |
| `icon-20x20@3x.png` | Notification Icon - iPhone (Retina) | 60 x 60 |
| `icon-29x29@2x.png` | Settings Menu Icon | 58 x 58 |
| `icon-29x29@3x.png` | Settings Menu Icon (Retina) | 87 x 87 |
| `icon-40x40@2x.png` | Spotlight Search Icon | 80 x 80 |
| `icon-40x40@3x.png` | Spotlight Search Icon (Retina) | 120 x 120 |
| `icon-60x60@2x.png` | Home Screen - iPhone (Standard) | 120 x 120 |
| `icon-60x60@3x.png` | Home Screen - iPhone (Retina) | 180 x 180 |
| `icon-1024x1024.png` | App Store Connect Master Asset | 1024 x 1024 |

---

### 🤖 1.2 Android Asset Requirements
Under Android layouts, adaptive XML icons are required. These separate the foreground design from background layers to allow device-specific masking.
Map assets inside: `/android/app/src/main/res/mipmap-[density]/`

| Density Bucket | Target Dimensions (px) | Output Directory Path |
| :--- | :--- | :--- |
| `mipmap-mdpi` | 48 x 48 | `mipmap-mdpi/ic_launcher.png` |
| `mipmap-hdpi` | 72 x 72 | `mipmap-hdpi/ic_launcher.png` |
| `mipmap-xhdpi` | 96 x 96 | `mipmap-xhdpi/ic_launcher.png` |
| `mipmap-xxhdpi` | 144 x 144 | `mipmap-xxhdpi/ic_launcher.png` |
| `mipmap-xxxhdpi` | 192 x 192 | `mipmap-xxxhdpi/ic_launcher.png` |

---

## 🚀 2. Instant Asset Generation CLI [Cordova-Res]
Instead of creating 50 visual slices manually, use the automated Capacitor Asset utility:

1. Create a high-quality master graphic (`icon.png`, min 1024x1024px) and splash screen (`splash.png`, min 2732x2732px) under the relative directory: `/resources/`
2. Install the asset automation package:
   ```bash
   npm install -g @capacitor/assets
   ```
3. Run the generation script over all active platforms:
   ```bash
   npx capacitor-assets generate
   ```
This script populates all size brackets under `AppIcon.appiconset` and `mipmap` automatically according to standards.
