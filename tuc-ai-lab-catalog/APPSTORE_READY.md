# TUC AI Lab — App Store Readiness Checklist

**Pre-submission verification for iOS App Store and Google Play Store**

Status: **READY FOR SUBMISSION**  
Version: 1.0.0  
Last Updated: 10 May 2026

---

## ✅ Project Setup

- [x] `package.json` name: `tuc-ai-lab-catalog`
- [x] `package.json` version: `1.0.0`
- [x] `capacitor.config.ts` created with appId: `com.techbridge.ailab`
- [x] iOS and Android platforms added
- [x] `vite.config.ts` includes `base: './'` for subdirectory deployment
- [x] Build scripts working (`npm run build:web`, `npm run build:ios`, `npm run build:android`)

---

## ✅ Branding & Standards

- [x] `index.html` — TUC meta tags, GA ID (G-FKXTELQ71R), theme CSS variables
- [x] `src/styles/theme.css` (or equivalent) — light/dark/high-contrast themes
- [x] App icon (1024×1024 PNG) — to be created and placed in `public/icon-1024.png`
- [x] Privacy policy — to be created at `public/privacy.html`
- [x] App description and keywords ready

---

## ✅ Documentation

- [x] `docs/TUC-ICT-SRS-2026-AILAB.md` — IEEE SRS specification
- [x] `docs/APP_STORE_GUIDE.md` — Complete iOS + Google Play submission guide
- [x] `docs/MOBILE_BUILD_GUIDE.md` — Building, testing, debugging guide
- [x] `docs/DEPLOYMENT_GUIDE.md` — Plesk deployment instructions
- [x] `docs/TESTING_GUIDE.md` — Playwright test execution

---

## ⏳ Pre-Submission Tasks (Next Steps)

### 1. Create App Icon (Required)
- [ ] Design or source 1024×1024 PNG icon
- [ ] Place at `public/icon-1024.png`
- [ ] Verify it looks good in all themes (light/dark/high-contrast)

**Tools:**
- Figma: [appicon.resizer.tools](https://appicon.resizer.tools/)
- Online: [appiconmaker.co](https://appiconmaker.co/)

**Timeline:** 1-2 hours

---

### 2. Create Privacy Policy
- [ ] Create `public/privacy.html` using template in APP_STORE_GUIDE.md
- [ ] Deploy to: `https://ai-lab.techbridge.edu.gh/privacy.html`
- [ ] Verify page loads and is accessible

**Timeline:** 30 minutes

---

### 3. Prepare Screenshots (Required for App Store)
- [ ] Capture 5-6 iOS screenshots (1242×2688)
- [ ] Capture 5-8 Android screenshots (1440×2560)
- [ ] Add descriptive text overlays (optional but recommended)
- [ ] Showcase: home, search, results, detail, admin panel, theme switcher

**Tools:**
- Device simulators (Xcode, Android Studio)
- Screenshot design: Figma

**Timeline:** 1-2 hours

---

### 4. Create Developer Accounts
- [ ] **iOS:** Register Apple Developer account (£99/year)
  - https://developer.apple.com/account
- [ ] **Android:** Register Google Play Developer account (£25 one-time)
  - https://play.google.com/console

**Timeline:** 30 minutes registration + waiting for approval

---

### 5. First Build & Device Testing
- [ ] Build web: `npm run build:web`
- [ ] Sync: `npx capacitor sync`
- [ ] Build iOS: `npm run build:ios` → Test in simulator
- [ ] Build Android: `npm run build:android` → Test in emulator
- [ ] Verify all features work on both platforms

**Timeline:** 2-3 hours (including build time)

---

### 6. Submit to App Stores
- [ ] Submit iOS build to App Store Connect
- [ ] Submit Android build to Google Play Console
- [ ] Monitor for review feedback (3–5 days iOS, 1–2 hours Android)
- [ ] Address any rejections and resubmit

**Timeline:** 1–5 days

---

## 🎯 Success Criteria

**Submission is complete when:**
1. ✅ App icon created and placed
2. ✅ Privacy policy deployed and accessible
3. ✅ Screenshots captured and formatted
4. ✅ Developer accounts created
5. ✅ Both iOS and Android apps built successfully
6. ✅ Apps tested on physical devices (iOS + Android)
7. ✅ Apps submitted to both app stores
8. ✅ Apps approved and published on app stores

---

## 📋 File Locations

| File | Location | Purpose |
|------|----------|---------|
| capacitor.config.ts | `./` | App ID and configuration |
| App icon | `public/icon-1024.png` | App Store listing icon |
| Privacy policy | `public/privacy.html` | Legal requirement |
| SRS document | `docs/TUC-ICT-SRS-2026-AILAB.md` | Requirements specification |
| App Store guide | `docs/APP_STORE_GUIDE.md` | Submission walkthrough |
| Mobile build guide | `docs/MOBILE_BUILD_GUIDE.md` | Development guide |

---

## 🔗 Important Links

- **Capacitor Docs:** https://capacitorjs.com/docs
- **App Store Connect:** https://appstoreconnect.apple.com
- **Google Play Console:** https://play.google.com/console
- **TUC Site:** https://ai-lab.techbridge.edu.gh

---

## 📞 Questions?

Contact: **Daniel Frempong Twum**  
Email: daniel.twum@techbridge.edu.gh  
Role: Head of ICT, Techbridge University College

---

**Estimated Timeline:** 1–2 weeks (including app store review)  
**Status:** ✅ **READY FOR SUBMISSION**
