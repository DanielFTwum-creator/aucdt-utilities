# PWA Icon Generation for TechBridge Poster Studio

This document explains how to generate the required PWA icons for App Store and Play Store submission.

## What's Been Prepared

The following files have been created/updated:

1. **`generate-icons.js`** — Node.js script to generate all icon sizes
2. **`public/manifest.webmanifest`** — PWA manifest with icon configuration
3. **`index.html`** — Updated with manifest and icon references
4. **`package.json`** — Updated with `generate:icons` script and sharp dependency

## What You Need to Do

### Option A: Automated Generation (Recommended)

If you have `npm` available locally on your system:

```bash
cd c:\Development\aucdt-utilities\techbridge-poster-studio

# Install sharp (image processing library)
npm install sharp

# Generate all icons from the master SVG
npm run generate:icons
```

This will create:
- `public/icons/icon-master-1024.png` (source master)
- `public/icons/icon-48.png` through `public/icons/icon-512.png`
- `public/icons/apple-touch-icon.png` (180x180)
- `public/icons/maskable-512.png` (for adaptive icons)

### Option B: Manual Generation (If npm unavailable)

Use any image editing tool or online service to resize `public/icons/icon-master-1024.png` to:

- **48x48** → `icon-48.png`
- **72x72** → `icon-72.png`
- **96x96** → `icon-96.png`
- **144x144** → `icon-144.png`
- **192x192** → `icon-192.png`
- **512x512** → `icon-512.png`
- **180x180** → `apple-touch-icon.png`
- **512x512 (maskable)** → `maskable-512.png`

**Important:** All images must be PNG format with proper colour profile (sRGB).

## Icon Specifications

### Master Icon (1024×1024)
- **Colours:**
  - Burgundy: `#8B1A2F` (TUC primary)
  - Teal: `#4A9B7F` (accent)
  - Cream: `#FAF7F0` (background)
- **Content:** Gradient circle with "POSTER STUDIO" text
- **Safe Area:** Inner 80% of square (centre 800×800 pixels)

### Maskable Icons
The `maskable-512.png` is used for adaptive icons on Android. It should have:
- Content within centre 66% (340×340 pixels for 512×512 image)
- Safe colour contrast on various backgrounds
- No hard edges at 512×512 boundary

## Verification

After generation, verify:

```bash
# Check all icon files exist
ls -la public/icons/

# Verify manifest is valid JSON
node -e "console.log(JSON.stringify(require('./public/manifest.webmanifest'), null, 2))"

# Build the app (this will validate the manifest reference)
npm run build
```

Expected output in `dist/`:
```
dist/
├── index.html (with manifest link)
├── manifest.webmanifest
└── icons/
    ├── icon-48.png
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-144.png
    ├── icon-192.png
    ├── icon-512.png
    ├── maskable-512.png
    └── apple-touch-icon.png
```

## App Store Submission Checklist

Once icons are generated, verify:

- [ ] All PNG files are **without alpha channel** (solid background, no transparency)
- [ ] Icon files are in `public/icons/` directory
- [ ] `manifest.webmanifest` is valid and references all icons
- [ ] `index.html` contains `<link rel="manifest" href="/manifest.webmanifest">`
- [ ] `index.html` contains `<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">`
- [ ] `npm run build` completes without errors
- [ ] Icons appear correctly in `dist/` after build

## Technical Details

### Why Multiple Icon Sizes?

- **48×48, 72×72, 96×96, 144×144:** Android adaptive icons at various densities
- **192×192:** Primary launcher icon (Android)
- **512×512:** Splash screen and large displays
- **180×180:** Apple Home Screen icon (iOS/iPadOS)
- **maskable-512:** Adaptive icon shape for modern Android (Android 8.0+)

### Manifest Structure

The `manifest.webmanifest` includes:
- `display: "standalone"` — App runs full-screen like native app
- `start_url: "/"` — Home page on launch
- `theme_color` and `background_color` — UI chrome colours
- `icons` array with all sizes and purposes
- `screenshots` — For app store listing (requires generation separately)

## Troubleshooting

**Issue:** Build fails due to missing icons
- **Solution:** Ensure all PNG files are in `public/icons/` before running `npm run build`

**Issue:** Manifest not loading in browser
- **Solution:** Verify `index.html` has `<link rel="manifest" href="/manifest.webmanifest">` in `<head>`

**Issue:** Icons not showing on App Store
- **Solution:** Verify icons are 1:1 aspect ratio (square) and PNG format with no transparency

---

Generated: 2026-05-04
Project: TechBridge Poster Studio
Gap Analysis References: GAP-005, GAP-006
