# TUC RMS — App Icons & Assets Guide

**Document ID:** TUC-RMS-ICONS-2026-001  
**Version:** 3.0  
**Last Updated:** 25 May 2026  
**Audience:** Designers, Asset Managers, Build Engineers

---

## Overview

This guide specifies the app icon and splash screen requirements for iOS and Android, along with tools and processes for generating multi-sized assets automatically.

**Design Source:** `frontend/resources/icon.png` (1024×1024 px)  
**Tool:** `@capacitor/assets` CLI  
**Format:** PNG with no transparency (for icons)

---

## 1. App Icon Specifications

### 1.1 Design Requirements

**Icon Properties:**
- **Source Dimensions:** 1024×1024 px (square, no transparency)
- **Background Colour:** #6B0020 (TUC Maroon)
- **Accent Colour:** #F5A800 (TUC Gold)
- **Safe Area:** Icons visible at minimum 20% inset from edges
- **Format:** PNG-24 (no transparency)
- **File Size:** <500 KB

**Design Principles:**
- Recognisable at 40×40 px (smallest size)
- Monochromatic or minimal multi-colour
- No text or typography on icon
- Clear contrast on light and dark backgrounds
- Professional, institutional appearance

### 1.2 iOS Icon Sizes

| Size | Pixels | Purpose | Where Used |
|------|--------|---------|-----------|
| 180 | 180×180 | App icon (iPhone 6+) | Home screen |
| 167 | 167×167 | App icon (iPad Pro) | Home screen |
| 152 | 152×152 | App icon (iPad Air) | Home screen |
| 144 | 144×144 | App icon (iPad 2) | Home screen |
| 120 | 120×120 | App icon (iPhone 6) | Home screen |
| 114 | 114×114 | App icon (iPhone 5, 4) | Home screen |
| 120 | 120×120 | Notification icon | Notifications |
| 81 | 81×81 | Spotlight search (iPad) | Search results |
| 80 | 80×80 | Spotlight search (iPhone) | Search results |
| 58 | 58×58 | Settings (iPad) | Settings app |
| 40 | 40×40 | Spotlight search | Search results |
| 29 | 29×29 | Settings (iPhone) | Settings app |

**Total iOS Sizes Required:** 12 variants

### 1.3 Android Icon Sizes

| Size | DPI | Dimensions | Purpose | Where Used |
|------|-----|-----------|---------|-----------|
| xxxhdpi | 640 | 192×192 | App icon | Home screen |
| xxhdpi | 480 | 144×144 | App icon | Home screen |
| xhdpi | 320 | 96×96 | App icon | Home screen |
| hdpi | 240 | 72×72 | App icon | Home screen |
| mdpi | 160 | 48×48 | App icon | Home screen |
| ldpi | 120 | 36×36 | App icon | Legacy devices |

**Adaptive Icons (Android 8+):**
- **Foreground:** 108×108 px (with safe zone of 72×72 px centre)
- **Background:** 108×108 px (solid colour or texture)
- **Format:** PNG-24

**Total Android Sizes Required:** 6 standard + adaptive foreground/background

---

## 2. Splash Screen Specifications

### 2.1 Design Requirements

**Splash Screen Properties:**
- **Source Dimensions:** 2048×2732 px (iPad aspect ratio)
- **Safe Area:** Critical content in central 1200×1500 px region
- **Background Colour:** #6B0020 (TUC Maroon)
- **Format:** PNG-24 with alpha transparency
- **File Size:** <1 MB

**Content:**
- Logo/icon centred (200×200 px minimum)
- Institutional name: "TUC Results"
- Tagline: "Academic Performance Tracking" (optional)
- Loading spinner (animated, if desired)
- Version number (optional, e.g., "v1.0.0")

### 2.2 iOS Splash Sizes

| Device | Landscape | Portrait | Purpose |
|--------|-----------|----------|---------|
| iPhone SE | 1242×2688 | — | Launch screen (vertical) |
| iPhone 6+/8+ | 1125×2436 | — | Launch screen (notch) |
| iPad 7" | 1536×2048 | — | Launch screen |
| iPad 10" | 2048×1536 | 1536×2048 | Launch screen (both) |

**Total iOS Splash Variants:** 4–6

### 2.3 Android Splash Sizes

| DPI | Landscape | Portrait | Purpose |
|-----|-----------|----------|---------|
| xxxhdpi | 1280×1920 | 1080×1920 | Splash (high-res) |
| xxhdpi | 960×1600 | 720×1280 | Splash (medium-high) |
| xhdpi | 720×1280 | 540×960 | Splash (medium) |
| hdpi | 480×800 | 360×640 | Splash (low) |
| mdpi | 320×470 | 320×470 | Splash (legacy) |

**Total Android Splash Variants:** 5 per orientation (10 total)

---

## 3. Asset Generation with @capacitor/assets

### 3.1 Installation

```bash
cd frontend

# Install the assets plugin
npm install -D @capacitor/assets

# Verify installation
npx capacitor-assets --version  # Should be 3.x+
```

### 3.2 Prepare Source Files

Place source files in `frontend/resources/`:

```bash
cd frontend

# Create resources directory
mkdir -p resources

# Copy source files
cp /path/to/icon.png resources/icon.png         # 1024×1024
cp /path/to/splash.png resources/splash.png    # 2048×2732
```

**File Specifications:**

**icon.png (1024×1024):**
```
Format: PNG-24, no transparency
Dimensions: 1024×1024 px exactly
File size: <500 KB
Colour profile: sRGB
```

**splash.png (2048×2732):**
```
Format: PNG-24 with alpha transparency
Dimensions: 2048×2732 px exactly (iPad aspect ratio)
File size: <1 MB
Colour profile: sRGB
Safe area: 1200×1500 px centre region
```

### 3.3 Generate Assets Automatically

```bash
cd frontend

# Generate all assets
npx capacitor-assets generate \
  --iconSourcePath=resources/icon.png \
  --splashSourcePath=resources/splash.png

# Expected output:
# ✓ Generating app icons...
# ✓ Generating splash screens...
# ✓ iOS icons: 12 sizes → ios/App/App/Assets.xcassets
# ✓ Android icons: 6 sizes → android/app/src/main/res/mipmap-*/
# ✓ Splash screens: 10+ sizes → both platforms
```

### 3.4 Verification

After generation, verify files exist:

**iOS:**
```bash
# Check Xcode asset catalog
ls -la ios/App/App/Assets.xcassets/AppIcon.appiconset/
# Should contain: 12 icon sizes

# View in Xcode
# Open ios/App/App.xcworkspace
# Assets.xcassets → AppIcon → verify all sizes populated
```

**Android:**
```bash
# Check drawable directories
ls -la android/app/src/main/res/ | grep mipmap
# Should contain: mipmap-ldpi, mipmap-mdpi, mipmap-hdpi, mipmap-xhdpi, mipmap-xxhdpi, mipmap-xxxhdpi

# Verify icon in each
ls android/app/src/main/res/mipmap-*/ic_launcher.png
# Should show 6 files
```

---

## 4. Adaptive Icons (Android 8+)

### 4.1 Adaptive Icon Design

Android 8.0+ supports adaptive icons with layered design:

**Components:**
- **Foreground Layer:** 108×108 px (icon shape)
- **Background Layer:** 108×108 px (solid colour or pattern)
- **Safe Zone:** 72×72 px centre region (guaranteed visible)

**Design Process:**
1. Design foreground: 108×108 px PNG with transparency
2. Design background: 108×108 px PNG solid colour
3. Place both in `android/app/src/main/res/drawable/` named:
   - `ic_launcher_foreground.png`
   - `ic_launcher_background.png`

### 4.2 Update AndroidManifest.xml

Ensure adaptive icon is declared:

```xml
<!-- android/app/src/main/AndroidManifest.xml -->

<application>
  <activity
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
  >
    <!-- ... -->
  </activity>
</application>
```

### 4.3 Define Adaptive Icon XML

Create `android/app/src/main/res/mipmap-anydpi-v33/ic_launcher.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
  <background android:drawable="@drawable/ic_launcher_background"/>
  <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
```

---

## 5. Splash Screen Configuration

### 5.1 iOS Splash Configuration

Edit `ios/App/App/Info.plist`:

```xml
<key>UILaunchStoryboardName</key>
<string>LaunchScreen</string>

<key>UILaunchStoryboardName</key>
<string>Storyboard</string>

<key>UIAppFonts</key>
<array>
  <string>fonts/Inter-Regular.ttf</string>
  <string>fonts/Inter-Bold.ttf</string>
</array>
```

**Custom Splash Screen (optional):**
1. In Xcode: Create LaunchScreen.storyboard
2. Design layout with logo, name, tagline
3. Set as launch screen in Build Settings

### 5.2 Android Splash Configuration

Edit `android/app/src/main/res/values/styles.xml`:

```xml
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
  <item name="android:windowBackground">@drawable/splash</item>
  <item name="android:windowNoTitle">true</item>
  <item name="android:windowActionBar">false</item>
  <item name="android:windowFullscreen">true</item>
</style>
```

Create `android/app/src/main/res/drawable/splash.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  <item android:drawable="@color/ic_launcher_background"/>
  <item>
    <bitmap
      android:src="@drawable/splash_image"
      android:gravity="center"/>
  </item>
</layer-list>
```

---

## 6. Capacitor SplashScreen Plugin

### 6.1 Configuration

In `capacitor.config.ts`:

```typescript
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,           // Show for 2 seconds
    launchAutoHide: true,               // Auto-hide when app ready
    backgroundColor: '#6B0020',         // Maroon background
    showSpinner: false,                 // No spinner
    androidSpinnerStyle: 'large',       // If spinner enabled
    iosSpinnerStyle: 'large',           // If spinner enabled
    spinColor: '#F5A800',               // Gold spinner
  },
},
```

### 6.2 Custom SplashScreen Component

Optional custom React component that hides the native splash:

```typescript
// frontend/src/components/SplashScreen.tsx
import React, { useEffect } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';

export const initSplashScreen = async () => {
  try {
    await SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
  } catch (e) {
    // Native splash not available (running in browser)
  }
};

// In App.tsx
useEffect(() => {
  initSplashScreen();
}, []);
```

---

## 7. Asset Checklist

### Pre-Generation

- [ ] Source icon ready: 1024×1024 px PNG-24
- [ ] Source splash ready: 2048×2732 px PNG-24 with transparency
- [ ] `@capacitor/assets` installed locally
- [ ] No existing generated assets (avoid conflicts)

### Post-Generation

**iOS:**
- [ ] AppIcon.appiconset contains 12 sizes
- [ ] All PNG files present
- [ ] No missing sizes
- [ ] Verified in Xcode: AppIcon asset catalog

**Android:**
- [ ] mipmap directories contain correct sizes
- [ ] ic_launcher.png in each DPI folder
- [ ] Adaptive icon files present
- [ ] Splash screen drawable defined

### Final Verification

- [ ] Simulator build succeeds (iOS)
- [ ] Emulator build succeeds (Android)
- [ ] Icons appear on home screen
- [ ] Splash screen displays for 2 seconds
- [ ] No build warnings related to assets

---

## 8. Troubleshooting

### Issue: "Icon not found" on iOS

**Solution:**
1. Verify image exists: `ls -la ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. In Xcode: Build Phases → Copy Bundle Resources → check AppIcon is included
3. Clean build: Xcode → Product → Clean

### Issue: "Icon missing on Android launcher"

**Solution:**
1. Verify file exists: `ls -la android/app/src/main/res/mipmap-*/ic_launcher.png`
2. Run: `./gradlew clean && ./gradlew assembleDebug`
3. Uninstall previous build: `adb uninstall com.techbridge.tucrms`
4. Reinstall APK

### Issue: "Splash screen blank or missing"

**Solution:**
1. Verify splash source: `ls -la frontend/resources/splash.png`
2. Regenerate: `npx capacitor-assets generate`
3. Check `capacitor.config.ts`: `launchAutoHide: true`
4. View in simulator (2 sec native splash, then app)

### Issue: "Adaptive icon not showing"

**Solution (Android 8+):**
1. Check device runs Android 8+
2. Verify `ic_launcher_foreground.png` and `background.png` exist
3. Verify XML: `android/app/src/main/res/mipmap-anydpi-v33/ic_launcher.xml`
4. Rebuild: `./gradlew clean bundleRelease`

---

## 9. Asset Delivery & Distribution

### 9.1 App Store Icons (iOS)

**Required:**
- 1024×1024 px PNG-24 (for App Store listing)

**Upload:**
1. App Store Connect → App Information → App Icon
2. Drag and drop or select 1024×1024 PNG
3. Click Save

### 9.2 Google Play Icons (Android)

**Required:**
- 512×512 px PNG-24 (for Google Play listing)

**Upload:**
1. Google Play Console → Store listing → Graphics
2. Icon: upload 512×512 PNG
3. Featured graphic: 1024×500 px (banner)
4. Screenshots: 1080×1920 or 1440×900 px
5. Save

---

## 10. Design Variants (Future)

### Light & Dark Mode Icons

Optional: Create separate icon variants for light/dark themes:

**Implementation:**
1. Create icon variants: `icon-light.png`, `icon-dark.png`
2. Configure in `capacitor.config.ts` (if plugin supports)
3. Or use SVG + CSS for dynamic icon colour

**Not implemented in v1.0** — add in v2.0 if needed

---

## 11. Performance Optimization

**Icon Size Targets:**
- Total icon package size: <2 MB (all sizes combined)
- Individual icon: <50 KB each
- Splash screen: <1 MB

**Optimization Tips:**
- Use PNG compression tools: TinyPNG, ImageOptim
- Test icon legibility at smallest size (40×40 px)
- Use single-colour background (faster compression)

---

## Support & Resources

**Design Tools:**
- Figma: https://figma.com
- Adobe XD: https://www.adobe.com/products/xd
- Sketch: https://sketch.com
- GIMP (free): https://www.gimp.org

**Icon Inspiration:**
- Apple HIG: https://developer.apple.com/design/human-interface-guidelines/app-icons
- Google Material: https://material.io/design/iconography/
- Heroicons: https://heroicons.com
- Feather Icons: https://feathericons.com

---

**Document Status:** Final — Version 3.0  
**Next Review Date:** 1 August 2026
