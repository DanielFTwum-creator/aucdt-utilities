# LuxThumb Designer — App Store Ready Checklist

## ✅ Completed Setup (as of 10 May 2026)

### Core Infrastructure
- ✅ Capacitor 8.3.3 integration (iOS + Android)
- ✅ React 19 + TypeScript codebase reusable across all platforms
- ✅ Web build optimised (370 KB gzipped)
- ✅ iOS Xcode project configured (`ios/App/`)
- ✅ Android Gradle project configured (`android/`)
- ✅ App ID: `com.techbridge.luxthumb`
- ✅ App Name: LuxThumb Designer
- ✅ Version: 1.0.0

### Documentation
- ✅ APP_STORE_GUIDE.md — Complete iOS App Store + Google Play submission guide
- ✅ MOBILE_BUILD_GUIDE.md — Build, deployment, and CI/CD setup
- ✅ APP_ICONS_GUIDE.md — Icon generation and placement for both platforms
- ✅ privacy.html — GDPR/CCPA/GDPA compliant privacy policy
- ✅ Deployment documentation covers Xcode, Android Studio, certificate signing

### Features
- ✅ Timestamped export filenames (format: `{brand}_{ISO8601-timestamp}.{ext}`)
- ✅ White lines removed from exported images (design dividers hidden during rendering)
- ✅ Dark mode + light mode + high-contrast themes
- ✅ Admin panel with audit logging
- ✅ Accessibility panel (font size, motion preferences)
- ✅ AI-powered design generation (Gemini API)
- ✅ Multi-format export (PNG, JPG, PDF, JSON)

### Build Scripts (npm)
```
npm run build           # Build web bundle (required first)
npm run build:web      # Alias with platform sync
npm run build:ios      # Web build + Capacitor copy for iOS
npm run build:android  # Web build + Capacitor copy for Android
npm run mobile:sync    # Sync web assets to both platforms
npm run ios:open       # Open iOS project in Xcode (macOS only)
npm run android:open   # Open Android project in Android Studio
```

---

## 📋 Next Steps (Before Submission)

### 1. Create App Icons (1–2 hours)

**Status:** Design needed

**Resources:**
- Figma template or Photoshop
- Master icon must be 1024×1024 px, PNG
- Follow guide: `docs/APP_ICONS_GUIDE.md`

**Deliverables:**
- iOS: 1024×1024, 512×512, 180×180, 120×120, 87×87, 60×60, 40×40, 29×29 px
- Android: 512×512, 192×192, 144×144, 96×96, 72×72, 48×48, 36×36 px

**Action:**
```bash
# After creating master icon (1024×1024):
# 1. Use https://appicon.resizer.tools/ (free)
# 2. Download all sizes
# 3. Place in:
#    - ios/App/App/Assets.xcassets/AppIcon.appiconset/
#    - android/app/src/main/res/mipmap-*/
```

### 2. Screenshots for App Stores (1–2 hours)

**iOS App Store** (5 minimum per device)
- iPhone 15 Pro Max (6.7"): 1242×2688 px
- Format: PNG or JPG

**Google Play** (5 minimum per device)
- Phone (5.1" portrait): 1080×1920 px
- 7" tablet (optional): 1200×1920 px
- 10" tablet (optional): 1600×2560 px

**Tools:**
- Take screenshots on simulator/emulator
- Use GIMP or Photoshop to add text overlays (optional but recommended)
- Show key features: design creation, export, admin panel, themes

### 3. Test on Physical Devices (2–3 hours)

**iOS:**
```bash
# 1. Plug iPhone via USB
# 2. Trust the computer
# 3. Run in Xcode:
open ios/App/App.xcworkspace
# Product → Run
```

**Android:**
```bash
# 1. Enable USB Debugging on device
# 2. Plug in via USB
# 3. Run in Android Studio or:
cd android && ./gradlew installDebug
```

**Test Checklist:**
- [ ] App launches without crash
- [ ] Design creation workflow complete
- [ ] AI generation works (requires Gemini API key)
- [ ] Export all formats (PNG, JPG, PDF)
- [ ] Admin login works (password: admin123)
- [ ] Theme switching works
- [ ] Accessibility panel functional
- [ ] Audit logs appear in admin panel

### 4. Configure Release Signing

**iOS:**
- Apple Developer Account (£99/year)
- Request signing certificate in Xcode
- Set team ID in target settings

**Android:**
```bash
# Create release keystore (one-time)
keytool -genkey -v -keystore luxthumb-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 -alias luxthumb
```

### 5. Create Developer Accounts

**iOS App Store Connect:**
- URL: https://appstoreconnect.apple.com
- Cost: £99/year (Apple Developer Program)
- Required: Apple ID, payment method

**Google Play:**
- URL: https://play.google.com/console
- Cost: £25 one-time
- Required: Google Account, payment method

---

## 🚀 Submission Timeline

### Week 1: Final Preparation
- **Day 1–2:** Create icons and screenshots
- **Day 2–3:** Test on physical devices
- **Day 3–4:** Configure release signing
- **Day 4–5:** Create app store accounts

### Week 2: Submission
- **Day 1:** iOS submission (approval: 3–5 days)
- **Day 1:** Android submission (approval: 1–2 hours)
- **Day 2–6:** Monitor reviews, address feedback if needed
- **Day 6–9:** Apps live in stores (if approved without changes)

---

## 📂 Key Files Reference

| File | Purpose |
|------|---------|
| `capacitor.config.ts` | Capacitor configuration (app ID, version, settings) |
| `package.json` | Version number (matches both app stores) |
| `ios/App/App/Info.plist` | iOS metadata, version, bundle ID |
| `android/app/build.gradle` | Android version code, target SDK |
| `public/privacy.html` | Privacy policy (must be publicly accessible) |
| `docs/APP_STORE_GUIDE.md` | Complete submission walkthrough |
| `docs/MOBILE_BUILD_GUIDE.md` | Build, test, and debug guide |
| `docs/APP_ICONS_GUIDE.md` | Icon creation and placement |

---

## 🔧 Environment Requirements

### macOS (for iOS)
- Xcode 15+
- CocoaPods: `sudo gem install cocoapods`
- Apple Developer Account

### Windows/Mac/Linux (for Android)
- Android Studio 2024.1+
- Java Development Kit 11+
- Android SDK Platform 34+
- Google Play Developer Account

---

## 💡 Common Issues & Solutions

### "Code signing failed" (iOS)
```bash
# Xcode → Settings → Accounts → Re-authenticate
# Or: manually select team in target settings
```

### "Gradle sync failed" (Android)
```bash
cd android
./gradlew clean
./gradlew build
```

### "Module not found" (iOS)
```bash
cd ios && pod install && cd ..
rm -rf ios/Pods/Podfile.lock
```

### App crashes on launch
```bash
# iOS: Use Xcode console (View → Debug Area)
# Android: adb logcat | grep com.techbridge.luxthumb
```

---

## 📞 Support Resources

- **Capacitor Docs:** https://capacitorjs.com/docs
- **Xcode Help:** https://developer.apple.com/documentation/
- **Android Docs:** https://developer.android.com
- **App Store Connect:** https://appstoreconnect.apple.com
- **Google Play Console:** https://play.google.com/console

---

## 📊 Build Sizes (Approximate)

| Platform | Size | Notes |
|----------|------|-------|
| Web (gzipped) | 370 KB | Latest build |
| iOS app | ~150 MB | Includes frameworks |
| Android app (APK) | ~120 MB | Includes dependencies |
| Android app (AAB) | ~90 MB | Recommended for Play Store |

---

## ✨ Release Notes Template

### Version 1.0.0 (Initial Release)
```
🎨 LuxThumb Designer — AI-Powered Thumbnail Creator

✨ Features:
• Generate luxury editorial thumbnails with AI (Gemini API)
• Design beautiful social media graphics
• Export as PNG, JPG, or PDF
• Dark mode, light mode, high-contrast accessibility
• Audit logging for all actions
• Multi-brand configuration support

🚀 Performance:
• Optimized React 19 with Capacitor for native speed
• Local-first data storage (IndexedDB)
• Offline-capable design preview

🔒 Privacy:
• No central server storage
• All designs stored locally on your device
• GDPR and CCPA compliant

📋 Requirements:
• iOS 14+ or Android 8+
• Gemini API key for AI features
```

---

**Last Updated:** 10 May 2026  
**Status:** Ready for App Store Submission  
**Next Review:** After first submission  

**Questions?** Contact daniel.twum@techbridge.edu.gh
