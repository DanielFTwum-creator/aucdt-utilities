# LuxThumb Designer — App Icons Setup Guide

This guide explains how to generate and configure app icons for iOS and Android app store submissions.

---

## Icon Requirements Overview

| Platform | Size | Format | Transparency | Rounded Corners |
|----------|------|--------|---------------|-----------------|
| **iOS** | 1024×1024 px | PNG | No | iOS handles |
| **Android** | 512×512 px | PNG | No (optional) | No |
| **App Store** | 1024×1024 px | PNG/JPG | No | No |
| **Play Store** | 512×512 px | PNG/JPG | No | No |

---

## Step 1: Create Master Icon (1024×1024 px)

### Design Requirements

- **Background:** Solid colour (no gradients that fade to transparent)
- **Logo/Design:** Centred, scalable (should look good at 40×40 px too)
- **Text:** Minimal or none (avoid small text that becomes illegible)
- **Safe Zone:** Keep essential elements within 900×900 px (centre)
- **Colour:** LuxThumb brand colour is `#C9A84C` (gold), on dark background `#0A0A0A`

### Recommended Design

```
Master Icon (1024×1024 px):
┌─────────────────────────────┐
│                             │
│      Dark Background        │
│      (#0A0A0A)              │
│                             │
│         ╱╲ Logo             │
│        ╱  ╲ (Gold/White)    │
│       ╱____╲ (Centred)      │
│                             │
│     "LuxThumb" text         │
│     (optional, small)       │
│                             │
└─────────────────────────────┘
```

### Tools to Create Icon

1. **Figma (Recommended - Free)**
   - Create 1024×1024 px artboard
   - Design with LuxThumb branding
   - Export as PNG
   - Link: https://figma.com

2. **Photoshop / Illustrator**
   - File → New → 1024×1024 px
   - Design with layers
   - Export as PNG (32-bit RGB)

3. **Online Tools (Quick)**
   - https://www.photopea.com (Free Photoshop alternative)
   - https://pixlr.com (Free image editor)

---

## Step 2: Generate Icon Variants

### Option A: Manual Generation (Recommended for Control)

Once you have a 1024×1024 px PNG, generate these sizes:

**iOS Icons:**
```
ios/App/App/Assets.xcassets/AppIcon.appiconset/
├── icon-20x20.png (20×20)
├── icon-40x40.png (40×40, also used as 2x for 20pt)
├── icon-60x60.png (60×60, also used as 3x for 20pt)
├── icon-29x29.png (29×29)
├── icon-58x58.png (58×58)
├── icon-87x87.png (87×87)
├── icon-40x40@2x.png (80×80)
├── icon-120x120.png (120×120)
├── icon-180x180.png (180×180)
└── icon-1024x1024.png (1024×1024, app store only)
```

**Android Icons:**
```
android/app/src/main/res/
├── mipmap-ldpi/ic_launcher.png (36×36)
├── mipmap-mdpi/ic_launcher.png (48×48)
├── mipmap-hdpi/ic_launcher.png (72×72)
├── mipmap-xhdpi/ic_launcher.png (96×96)
├── mipmap-xxhdpi/ic_launcher.png (144×144)
├── mipmap-xxxhdpi/ic_launcher.png (192×192)
└── mipmap-anydpi-v33/ic_launcher.xml (adaptive icon config)
```

### Option B: Automated Generation (Quick)

Use ImageMagick or FFmpeg to batch resize:

```bash
# Install ImageMagick (Mac: brew install imagemagick)
# Or Windows: Download from https://imagemagick.org/download/binaries/

# Generate iOS icons
convert master-icon-1024.png -resize 20x20 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-20x20.png
convert master-icon-1024.png -resize 40x40 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-40x40.png
convert master-icon-1024.png -resize 60x60 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-60x60.png
convert master-icon-1024.png -resize 180x180 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-180x180.png
convert master-icon-1024.png -resize 1024x1024 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-1024x1024.png

# Generate Android icons
convert master-icon-1024.png -resize 36x36 android/app/src/main/res/mipmap-ldpi/ic_launcher.png
convert master-icon-1024.png -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
convert master-icon-1024.png -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
convert master-icon-1024.png -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
convert master-icon-1024.png -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
convert master-icon-1024.png -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
```

### Option C: Online Icon Generator

1. **App Icon Resizer** (Free)
   - https://appicon.resizer.tools/
   - Upload 1024px PNG
   - Download all sizes at once
   - Copy to respective folders

2. **Capacitor App Icons** (Plugin)
   ```bash
   npm install @capacitor-app-icons-generator/core
   npx capacitor-app-icons-generator
   ```

---

## Step 3: iOS Configuration

### Update `Info.plist`

File: `ios/App/App/Info.plist`

```xml
<key>CFBundleIcons</key>
<dict>
  <key>CFBundlePrimaryIcon</key>
  <dict>
    <key>CFBundleIconFiles</key>
    <array>
      <string>icon-20x20</string>
      <string>icon-40x40</string>
      <string>icon-60x60</string>
      <string>icon-29x29</string>
      <string>icon-58x58</string>
      <string>icon-87x87</string>
      <string>icon-40x40@2x</string>
      <string>icon-120x120</string>
      <string>icon-180x180</string>
    </array>
  </dict>
</dict>

<key>CFBundleIcons~ipad</key>
<dict>
  <key>CFBundlePrimaryIcon</key>
  <dict>
    <key>CFBundleIconFiles</key>
    <array>
      <string>icon-20x20</string>
      <string>icon-40x40</string>
      <string>icon-29x29</string>
      <string>icon-58x58</string>
      <string>icon-76x76</string>
      <string>icon-152x152</string>
      <string>icon-167x167</string>
    </array>
  </dict>
</dict>
```

### In Xcode

1. Open `ios/App/App.xcworkspace`
2. Select "App" project
3. Select "App" target
4. Go to "General" tab
5. Scroll to "App Icons and Launch Images"
6. Verify 1024×1024 icon appears in preview

---

## Step 4: Android Configuration

### Verify `AndroidManifest.xml`

File: `android/app/src/main/AndroidManifest.xml`

```xml
<application
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name"
    ...>
</application>
```

### Adaptive Icon (Android 8.0+)

Create: `android/app/src/main/res/mipmap-anydpi-v33/ic_launcher.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
    <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>
</adaptive-icon>
```

Add to: `android/app/src/main/res/values/colors.xml`

```xml
<color name="ic_launcher_background">#0A0A0A</color>
```

---

## Step 5: Test Icons Locally

### iOS Simulator

```bash
npm run build
npx capacitor copy ios
open ios/App/App.xcworkspace

# In Xcode:
# 1. Select simulator (e.g., iPhone 15 Pro)
# 2. Product → Run
# Look at home screen — icon should appear
```

### Android Emulator

```bash
npm run build
npx capacitor copy android
open android

# In Android Studio:
# 1. Select virtual device (e.g., Pixel 5 API 34)
# 2. Run
# Look at home screen — icon should appear
```

---

## Step 6: Submission

### iOS App Store

Icon is uploaded during:
1. App Store Connect → My Apps → [App] → App Information
2. Upload 1024×1024 PNG as "App Icon"

### Google Play Store

Icon is uploaded during:
1. Google Play Console → [App] → Graphics Assets
2. Upload 512×512 PNG as "App Icon"

### Additional Graphics

Both stores require additional graphics:

**iOS App Store:**
- App Icon (1024×1024)
- Screenshots (5 minimum, per device type)
- Feature graphic (optional)

**Google Play:**
- App Icon (512×512)
- Screenshots (5 minimum, per device type)
- Feature graphic (1024×500)
- TV banner (optional, 1920×1080)

---

## Troubleshooting

### iOS Icon Not Appearing

1. Clean build folder:
   ```bash
   open ios/App/App.xcworkspace
   # Cmd+Shift+K (clean)
   # Cmd+B (rebuild)
   ```

2. Clear simulator:
   ```bash
   xcrun simctl erase all
   ```

3. Force icon cache:
   - Delete app from home screen
   - Restart simulator
   - Rebuild and run

### Android Icon Not Updating

1. Clean Gradle cache:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

2. Rebuild:
   ```bash
   npx capacitor sync android
   npm run build:android
   ```

3. Reinstall on device:
   ```bash
   adb uninstall com.techbridge.luxthumb
   npm run build:android
   ```

---

## Recommended Icon Design Tool Workflow

1. **Create in Figma:**
   - 1024×1024 px artboard
   - Export as PNG 32-bit (transparent background)
   - Save as `master-icon-1024.png`

2. **Generate variants:**
   - Use https://appicon.resizer.tools/
   - Upload PNG
   - Download ZIP

3. **Place icons:**
   - Extract ZIP
   - Copy iOS icons to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Copy Android icons to `android/app/src/main/res/mipmap-*/`

4. **Test:**
   ```bash
   npm run build:ios
   npm run build:android
   ```

5. **Submit:**
   - iOS: Upload to App Store Connect
   - Android: Upload to Google Play Console

---

**Last Updated:** 10 May 2026  
**Maintainer:** Daniel Frempong Twum / TUC ICT
