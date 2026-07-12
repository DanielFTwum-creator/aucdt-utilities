# LECTURER AI — APP ICONS & SPLASH GRAPHICS DESIGN PROTOCOL
## DOCUMENT REF: TUC-ICO-GUIDE-2026
### DESIGN METRICS: iOS App Store & Android Adaptive Specifications

---

## 1. STRATEGIC ICON STYLE GUIDELINES
To reflect the academic prestige of **Techbridge University College (TUC)**:
*   **Aesthetic**: Pure editorial typography, high-contrast gold crest or emblem on a deep corporate navy background.
*   **Shadows**: Subtle central depth. Do not use complex shadows or photorealistic gradients.
*   **Margins**: Ensure essential logos remain within the **66% central safety zone** to avoid getting cropped by native circle/squircle masks.

---

## 2. REQUIRED APP ICON DIMENSIONS

### 2.1 iOS Dimension Specification Grid
iOS requires a single square PNG app icon without transparency:

| Target File / Device | Dimension | Required DPI | Color Space |
| :--- | :--- | :--- | :--- |
| **App Store Logo** | 1024 x 1024 px | 72 DPI | sRGB / 24-bit PNG |
| **iPad Pro (12.9-inch)** | 167 x 167 px | 264 DPI / @2x | sRGB / 24-bit PNG |
| **iPad Air / iPad Mini** | 152 x 152 px | 264 DPI / @2x | sRGB / 24-bit PNG |
| **iPhone (App Icon @3x)** | 180 x 180 px | 326 DPI / @3x | sRGB / 24-bit PNG |
| **iPhone (App Icon @2x)** | 120 x 120 px | 326 DPI / @2x | sRGB / 24-bit PNG |
| **Spotlight Searches** | 80 x 80 px | 326 DPI / @2x | sRGB / 24-bit PNG |

### 2.2 Android Adaptive Sizing Grid
Android utilizes adaptive layers consisting of a separate **Foreground** (emblem with transparency) and **Background** (solid navy canvas):

| Adaptive Asset Target | Size | Resource Directory Path |
| :--- | :--- | :--- |
| **mdpi** (Baseline) | 48 x 48 px | `android/app/src/main/res/mipmap-mdpi/` |
| **hdpi** | 72 x 72 px | `android/app/src/main/res/mipmap-hdpi/` |
| **xhdpi** | 96 x 96 px | `android/app/src/main/res/mipmap-xhdpi/` |
| **xxhdpi** | 144 x 144 px | `android/app/src/main/res/mipmap-xxhdpi/` |
| **xxxhdpi** (Standard Store) | 192 x 192 px | `android/app/src/main/res/mipmap-xxxhdpi/` |

---

## 3. AUTOMATED ICON SYNTHESIS SETUP
Rather than cropping icons manually, you should use `@capacitor/assets` to auto-compile all required sizes with one terminal command.

### Setup Steps
1.  **Install the Assets Generator Tool**:
    ```bash
    npm install -D @capacitor/assets
    ```
2.  **Establish Assets Directory**:
    Create an `assets/` folder at the root of the project with:
    *   `assets/icon-only.png` (1024x1024 px logo with transparency)
    *   `assets/icon-background.png` (1024x1024 px flat color canvas)
    *   `assets/splash.png` (2732x2732 px splash graphic)
3.  **Synthesize Assets Command**:
    ```bash
    npx capacitor-assets generate --ios --android
    ```
This utility automatically compiles, crops, and writes the output files to their respective Xcode and Android Studio resource sub-folders.
