# Orbit Walk — App Store Submission Guide

## 1. Preparation
### Assets
- **App Store Icon:** 1024x1024px (no transparency).
- **Screenshots:** 
  - iPhone 6.5" (1242x2688px).
  - iPhone 5.5" (1242x2208px).
  - iPad Pro 12.9" (2048x2732px).
- **Privacy URL:** `https://your-domain.com/privacy.html` (Use the generated `public/privacy.html`).

## 2. Apple App Store (iOS)
1. **App Store Connect:** Create a new app record at [appstoreconnect.apple.com](https://appstoreconnect.apple.com).
2. **Certificates:** Generate a Distribution Certificate in the Apple Developer Portal.
3. **Provisioning:** Create an App Store Provisioning Profile.
4. **Xcode:**
   - Run `npm run build:ios`.
   - Open the project: `npm run ios:open`.
   - Select "Any iOS Device (arm64)".
   - Go to **Product > Archive**.
   - Click "Distribute App" and follow the prompts to upload to TestFlight.

## 3. Google Play Store (Android)
1. **Google Play Console:** Create a new app at [play.google.com/console](https://play.google.com/console).
2. **Signing Key:** Generate an Upload Key using `keytool`.
3. **Android Studio:**
   - Run `npm run build:android`.
   - Open the project: `npm run android:open`.
   - Go to **Build > Generate Signed Bundle / APK**.
   - Select "Android App Bundle" (AAB).
   - Upload the `.aab` file to the "Internal Testing" or "Production" track.

## 4. Submission Checklist
- [ ] Accuracy of App Name and Description (UK British English).
- [ ] Working "Ding" audio (Ensure `playsinline` and audio session categories are set for iOS).
- [ ] Valid Privacy Policy link.
- [ ] Correct Version (Set to 1.0.0 in `package.json`).

---
*Techbridge University College — Mobile Deployment Unit*
