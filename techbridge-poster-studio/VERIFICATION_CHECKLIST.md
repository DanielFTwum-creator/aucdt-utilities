# PWA Setup Verification Checklist

**Project:** TechBridge Poster Studio  
**Task:** GAP-005 (PWA Manifest) + GAP-006 (App Icons)  
**Status:** Configuration Complete

---

## Pre-Generation Checks

- [x] `index.html` has manifest link: `<link rel="manifest" href="/manifest.webmanifest" />`
- [x] `index.html` has apple-touch-icon: `<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />`
- [x] `index.html` has theme-color meta tag
- [x] `index.html` has apple-mobile-web-app-capable
- [x] `public/manifest.webmanifest` exists and is valid JSON
- [x] `manifest.webmanifest` has all 8 icon definitions
- [x] `manifest.webmanifest` has correct theme colors (#8B1A2F, #FAF7F0)
- [x] `manifest.webmanifest` has display: "standalone"
- [x] `manifest.webmanifest` has start_url: "/"
- [x] `package.json` has "generate:icons" script
- [x] `package.json` has sharp in devDependencies
- [x] `generate-icons.js` script exists
- [x] `public/icons/` directory created

---

## Icon Generation (To-Do)

Before running icon generation, ensure:

```bash
cd c:\Development\aucdt-utilities\techbridge-poster-studio
```

### Step 1: Install Dependencies
```bash
npm install sharp
```

**Expected output:**
```
added X packages, and audited Y packages in Zs
```

### Step 2: Generate Icons
```bash
npm run generate:icons
```

**Expected output:**
```
Generating PWA icons for TechBridge Poster Studio...

✓ Master icon (1024x1024) generated
✓ Generated icon-48.png (48x48)
✓ Generated icon-72.png (72x72)
✓ Generated icon-96.png (96x96)
✓ Generated icon-144.png (144x144)
✓ Generated icon-192.png (192x192)
✓ Generated icon-512.png (512x512)
✓ Generated apple-touch-icon.png (180x180)
✓ Generated maskable-512.png (512x512)

✓ All PWA icons generated successfully!
```

### Step 3: Verify Icons
```bash
ls -la public/icons/
```

**Expected files:**
```
-rw-r--r-- icon-master-1024.png
-rw-r--r-- icon-48.png
-rw-r--r-- icon-72.png
-rw-r--r-- icon-96.png
-rw-r--r-- icon-144.png
-rw-r--r-- icon-192.png
-rw-r--r-- icon-512.png
-rw-r--r-- apple-touch-icon.png
-rw-r--r-- maskable-512.png
```

---

## Post-Generation Checks

### Step 4: Validate Manifest JSON
```bash
node -e "const m = require('./public/manifest.webmanifest'); console.log('✓ Manifest valid JSON'); console.log('Icons defined:', m.icons.length);"
```

**Expected output:**
```
✓ Manifest valid JSON
Icons defined: 8
```

### Step 5: Build Project
```bash
npm run build
```

**Expected output:**
```
vite v6.2.3 building for production...
✓ 123 modules transformed
dist/index.html                    X.XXkb
dist/manifest.webmanifest         X.XXkb
dist/icons/icon-48.png            X.XXkb
dist/icons/icon-72.png            X.XXkb
dist/icons/icon-96.png            X.XXkb
dist/icons/icon-144.png           X.XXkb
dist/icons/icon-192.png           X.XXkb
dist/icons/icon-512.png           X.XXkb
dist/icons/apple-touch-icon.png   X.XXkb
dist/icons/maskable-512.png       X.XXkb
...

✓ built in 2.34s
```

**Check for errors:**
- [ ] No 404 warnings for manifest.webmanifest
- [ ] No 404 warnings for icon files
- [ ] All icon PNG files copied to dist/icons/

### Step 6: Verify Dist Structure
```bash
tree dist/ | head -20
# or
ls -la dist/
ls -la dist/icons/
```

**Expected structure:**
```
dist/
├── index.html                    (with manifest link)
├── manifest.webmanifest          (PWA manifest)
├── icons/
│   ├── icon-48.png
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-144.png
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── apple-touch-icon.png
│   └── maskable-512.png
├── assets/
│   └── [bundle files]
└── [other static files]
```

---

## Browser/Device Testing

### Step 7: Test PWA Installation

```bash
npm run preview
# Open http://localhost:4173 in browser
```

**Chrome Desktop:**
- [ ] App installation prompt appears (3-dot menu → Install app)
- [ ] Installed icon matches design (burgundy gradient)
- [ ] App launches in standalone mode (no address bar)

**Mobile (iOS):**
- [ ] Open Safari → Share → Add to Home Screen
- [ ] Icon displays as apple-touch-icon.png (180×180)
- [ ] Status bar theme matches theme-color

**Mobile (Android):**
- [ ] Chrome prompt: "Install app" banner appears
- [ ] Icon displays at 192×192 or 512×512 depending on device
- [ ] Maskable icon used for adaptive shape

### Step 8: DevTools Verification

**Chrome DevTools → Application:**
- [ ] Manifest loads without errors
- [ ] All icons listed in manifest are present
- [ ] Service Worker registration (if implemented later)

---

## App Store Submission Pre-Flight

### Step 9: Icon Quality Checks

For each PNG file:
- [ ] Image is square (1:1 aspect ratio)
- [ ] No transparency (solid background #FAF7F0)
- [ ] sRGB colour space (not wide gamut)
- [ ] File size < 100KB per icon
- [ ] No artefacts or compression damage

```bash
# Check image dimensions
file dist/icons/*.png
# Output should show each as "PNG image data, X x X, 8-bit/color"
```

### Step 10: Manifest Validation

```bash
# Validate against W3C schema (if available locally)
# Or use online: https://www.pwabuilder.com/manivalidator
```

**Key fields to verify:**
- [ ] `name`: "TechBridge Poster Studio"
- [ ] `short_name`: "Poster Studio" (max 12 chars)
- [ ] `display`: "standalone"
- [ ] `start_url`: "/"
- [ ] `theme_color`: "#8B1A2F"
- [ ] `background_color`: "#FAF7F0"
- [ ] All icon sizes match manifest definitions
- [ ] No relative paths in icon.src (must be absolute: `/icons/...`)

### Step 11: Final Checklist

- [ ] `npm run build` succeeds without warnings
- [ ] All 8 icon files present in `dist/icons/`
- [ ] `dist/manifest.webmanifest` is valid JSON
- [ ] `dist/index.html` contains manifest link
- [ ] PWA installs on Chrome, Safari, and Firefox
- [ ] App runs in standalone mode (no browser UI)
- [ ] Icons display correctly on home screen
- [ ] No console errors related to manifest or icons
- [ ] Lighthouse PWA score > 90

---

## Optional: Screenshots for App Store

If your gap analysis requires app store screenshots in the manifest:

1. Create 540×720 (portrait) and 1280×720 (landscape) screenshots
2. Save as `public/icons/screenshot-540x720.png` and `screenshot-1280x720.png`
3. The manifest already references these (lines 12-24)

---

## Rollback (If Needed)

If something goes wrong:

```bash
# Remove all icon-related changes
rm -rf public/icons/
rm public/manifest.webmanifest
npm run clean
git checkout index.html package.json
```

Then troubleshoot using the guides:
- `ICON_GENERATION_INSTRUCTIONS.md`
- `PWA_SETUP_SUMMARY.md`

---

## Sign-Off

**Configuration Status:** ✓ Complete  
**Icons Status:** ⏳ Pending Generation  
**Build Validation:** ⏳ Pending (after icon generation)  
**App Store Ready:** ⏳ Pending (after full verification)

**Next Action:** Run `npm install sharp && npm run generate:icons`

---

**Checklist Created:** 2026-05-04  
**Project:** TechBridge Poster Studio  
**Gap Analysis:** GAP-005, GAP-006
