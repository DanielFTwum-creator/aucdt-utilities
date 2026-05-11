# LuxThumb Designer — App Store Deployment Guide

**App ID:** `com.techbridge.luxthumb`  
**Display Name:** LuxThumb Designer  
**Version:** 1.0.0  
**Build Number:** 1

---

## Prerequisites

### macOS (for iOS builds)
- Xcode 15+ (from App Store or [developer.apple.com](https://developer.apple.com))
- CocoaPods: `sudo gem install cocoapods`
- Apple Developer Account (£99/year, required for publishing)

### Windows/Linux (for Android builds)
- Android SDK Platform 34+ (via Android Studio)
- Java Development Kit 11+
- Google Play Developer Account (£25 one-time, required for publishing)

---

## Section 1: iOS Deployment (Apple App Store)

### Step 1: Update iOS App Configuration

**File:** `ios/App/App/Info.plist`

```xml
<key>CFBundleDisplayName</key>
<string>LuxThumb Designer</string>
<key>CFBundleVersion</key>
<string>1</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
  <key>NSExceptionDomains</key>
  <dict>
    <key>generativelanguage.googleapis.com</key>
    <dict>
      <key>NSIncludesSubdomains</key>
      <true/>
      <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
      <false/>
    </dict>
  </dict>
</dict>
```

### Step 2: Configure Signing Certificates

1. **Open Xcode project:**
   ```bash
   open ios/App/App.xcworkspace
   ```

2. **Configure Signing:**
   - Select "App" in Project navigator
   - Select "App" target
   - Go to "Signing & Capabilities"
   - Set Team ID to your Apple Developer Team
   - Xcode will auto-generate provisioning profiles

3. **Set Bundle ID:**
   - Set to: `com.techbridge.luxthumb`

### Step 3: Build for Release

```bash
# Archive for App Store submission
open ios/App/App.xcworkspace

# In Xcode:
# 1. Product → Scheme → Edit Scheme
# 2. Set Build Configuration to "Release"
# 3. Product → Archive
# 4. Organizer will open — click "Distribute App"
# 5. Select "App Store Connect"
# 6. Follow prompts to upload
```

### Step 4: App Store Connect Configuration

1. **Create App in App Store Connect:**
   - https://appstoreconnect.apple.com
   - Click "My Apps" → "+"
   - Select "New App"
   - Platform: iOS
   - Name: LuxThumb Designer
   - Bundle ID: com.techbridge.luxthumb
   - SKU: LUXTHUMB-001

2. **Upload Screenshots:**
   - iPhone 15 Pro Max (6.7"): 5 screenshots minimum
   - iPad Pro 12.9": 5 screenshots (optional but recommended)
   - Format: PNG or JPG, max 5MB each

3. **App Icon:**
   - 1024×1024 px, PNG or JPG
   - No transparency, no rounded corners (iOS rounds them automatically)

4. **Privacy Policy:**
   - Required, must be a public URL
   - See [Privacy Policy Template](#privacy-policy-template) below

5. **Description:**
   ```
   LuxThumb Designer: AI-powered thumbnail generation for premium branding.
   
   Create cinematic, luxury editorial visuals with Gemini AI integration.
   Perfect for social media, marketing campaigns, and advertising.
   
   Features:
   - AI-powered design prompts (Midjourney, Imagen 3, DALL-E)
   - Luxury editorial typography
   - Brand customization
   - Multi-format export (PNG, JPG, PDF)
   - Secure audit logging
   - Dark mode & accessibility support
   ```

6. **Keywords:** thumbnail, design, AI, branding, social media, editorial

7. **Support URL:** https://techbridge.edu.gh
   **Privacy Policy:** https://ai-tools.techbridge.edu.gh/luxthumb/privacy.html

---

## Section 2: Android Deployment (Google Play Store)

### Step 1: Generate Release Key

```bash
# Create signing keystore (one-time, keep safe)
keytool -genkey -v -keystore luxthumb-release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias luxthumb

# When prompted, enter:
# - Password: [STRONG_PASSWORD]
# - First/Last Name: Daniel Frempong Twum
# - Organization: Techbridge University College
# - City: Oyibi
# - State: Greater Accra
# - Country Code: GH
```

### Step 2: Configure Android Build

**File:** `android/app/build.gradle`

```gradle
android {
    signingConfigs {
        release {
            storeFile file('luxthumb-release.keystore')
            storePassword System.getenv('LUXTHUMB_KEYSTORE_PASSWORD')
            keyAlias 'luxthumb'
            keyPassword System.getenv('LUXTHUMB_KEY_PASSWORD')
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 3: Build Release APK/AAB

```bash
# Build signed AAB (recommended for Play Store)
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### Step 4: Google Play Console Configuration

1. **Create App:**
   - https://play.google.com/console
   - Click "Create app"
   - App name: LuxThumb Designer
   - Language: English (US)
   - App type: App
   - Category: Lifestyle
   - Free/Paid: Free

2. **Upload Screenshots:**
   - Phone (5.1" portrait): 5 screenshots, PNG/JPG, 1080×1920 px max
   - 7" tablet (optional): 5 screenshots, PNG/JPG, 1200×1920 px max
   - 10" tablet (optional): 5 screenshots, PNG/JPG, 1600×2560 px max

3. **App Icon:**
   - 512×512 px, PNG or JPG
   - No transparency, no rounded corners

4. **Feature Graphic:**
   - 1024×500 px, PNG or JPG
   - Shown in store listing header

5. **Short Description:**
   ```
   AI-powered thumbnail designer with Gemini AI integration
   ```

6. **Full Description:**
   ```
   LuxThumb Designer: Create premium AI-powered thumbnail designs.
   
   Generate cinematic, luxury editorial visuals perfect for social media,
   marketing campaigns, and professional advertising.
   
   ✨ Features:
   • AI-powered design suggestions (Midjourney, Imagen 3, DALL-E)
   • Luxury editorial typography system
   • Complete brand customization
   • Multi-format export (PNG, JPG, PDF)
   • Secure audit logging for all actions
   • Dark mode & accessibility support
   • Offline-capable with cloud sync
   
   Built with Capacitor for smooth native performance on iOS and Android.
   ```

7. **Privacy Policy:** https://ai-tools.techbridge.edu.gh/luxthumb/privacy.html

8. **Target Audience:**
   - Designers, marketers, content creators, small business owners

9. **Content Rating:** Complete the Google Play Content Rating Questionnaire

10. **Testing:** Set up internal/alpha/beta tracks for testing before production release

---

## Section 3: Privacy Policy Template

**File:** `public/privacy.html`

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LuxThumb Designer — Privacy Policy</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333; }
        h1 { color: #C9A84C; border-bottom: 2px solid #C9A84C; padding-bottom: 10px; }
        h2 { color: #1A1A1A; margin-top: 30px; }
        .date { color: #666; font-style: italic; }
    </style>
</head>
<body>
    <h1>Privacy Policy — LuxThumb Designer</h1>
    <p class="date">Last Updated: 10 May 2026</p>

    <h2>1. Overview</h2>
    <p>LuxThumb Designer ("App") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information.</p>

    <h2>2. Information We Collect</h2>
    <ul>
        <li><strong>Design Data:</strong> Brand names, headlines, colours, images, and custom configurations you enter</li>
        <li><strong>Usage Data:</strong> Actions performed (exports, AI generations, theme changes) logged for audit trails</li>
        <li><strong>Device Data:</strong> Device model, OS version, app version (for crash reports and analytics)</li>
        <li><strong>API Data:</strong> Queries sent to Gemini API for AI design generation</li>
    </ul>

    <h2>3. How We Use Your Data</h2>
    <ul>
        <li>To provide and improve the App's functionality</li>
        <li>To generate AI-powered design suggestions (via Google Gemini API)</li>
        <li>To maintain audit logs for security and accountability</li>
        <li>To fix bugs and improve user experience</li>
    </ul>

    <h2>4. Data Storage</h2>
    <ul>
        <li><strong>Local Storage:</strong> Your designs are stored locally in your device's browser IndexedDB or app storage</li>
        <li><strong>Cloud Services:</strong> Gemini API queries are processed by Google (see Google's privacy policy)</li>
        <li><strong>No Central Database:</strong> We do not maintain a central database of your designs</li>
    </ul>

    <h2>5. Third-Party Services</h2>
    <ul>
        <li><strong>Google Gemini API:</strong> Used for AI-powered design generation. Google processes your prompts according to their privacy policy</li>
        <li><strong>Analytics:</strong> Google Analytics tracks app usage to improve performance</li>
    </ul>

    <h2>6. Data Security</h2>
    <p>We implement industry-standard security measures including HTTPS encryption, secure API key management, and audit logging.</p>

    <h2>7. Your Rights</h2>
    <p>You have the right to:</p>
    <ul>
        <li>Access your design data at any time (exported via JSON config)</li>
        <li>Delete your data by clearing app storage</li>
        <li>Opt out of analytics tracking</li>
    </ul>

    <h2>8. Contact Us</h2>
    <p>For privacy concerns, contact:</p>
    <p>
        <strong>Daniel Frempong Twum</strong><br>
        Head of ICT, Techbridge University College<br>
        Email: daniel.twum@techbridge.edu.gh<br>
        Phone: +233 (0) 24 XXX XXXX
    </p>

    <h2>9. Policy Changes</h2>
    <p>We may update this policy periodically. Continued use of the App constitutes acceptance of changes.</p>
</body>
</html>
```

---

## Section 4: Building & Testing Locally

### iOS (macOS only)

```bash
# Build for iOS simulator
npx capacitor build ios

# Open in Xcode
open ios/App/App.xcworkspace

# Run on device: Product → Run (with device connected)
```

### Android

```bash
# Build for Android
npx capacitor build android

# Using Android Studio
open android

# Or via command line
cd android
./gradlew installDebug

# Run on emulator
emulator -avd Pixel_5_API_34 &
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Section 5: Submission Checklist

### Before Submission

- [ ] Privacy Policy published and live at public URL
- [ ] App Icon created (1024×1024 PNG)
- [ ] Screenshots captured (5 minimum per platform)
- [ ] Descriptive title and description (under 80 characters, under 4000 characters)
- [ ] Support email configured
- [ ] Gemini API key secured (backend proxy recommended)
- [ ] Test on physical device (iOS + Android)
- [ ] Verify all export formats work (PNG, JPG, PDF)
- [ ] Check that offline functionality works gracefully

### iOS App Store Review (3–5 days typical)

Common rejection reasons to avoid:
- Incomplete or placeholder privacy policy ❌
- Crashes on launch or during use ❌
- Unlabelled third-party frameworks (disclose Google Gemini) ✅
- Poor UI/UX or unfinished appearance ❌
- Missing support contact information ❌

### Google Play Review (1–2 hours typical)

Common rejection reasons:
- Non-existent or broken privacy policy URL ❌
- Dangerous permissions not justified ❌
- Misleading app description ❌
- SDK policy violations (trackers, ads, etc.) ❌

---

## Section 6: Post-Launch Monitoring

### Analytics Dashboard

```bash
# Monitor crashes and performance
https://play.google.com/console/u/0/developers/{DEVELOPER_ID}/app/{APP_ID}/overview
https://appstoreconnect.apple.com/analytics
```

### Handling Updates

```bash
# Increment version in capacitor.config.ts
# Rebuild: npm run build
# Rebuild iOS: npx capacitor copy ios && open ios/App/App.xcworkspace
# Rebuild Android: npx capacitor copy android && cd android && ./gradlew bundleRelease
# Resubmit via App Store Connect / Google Play Console
```

---

## Troubleshooting

### iOS Codesigning Issues
```bash
rm -rf ios/Pods ios/Podfile.lock
cd ios && pod install && cd ..
```

### Android Gradle Sync Failure
```bash
cd android
./gradlew clean
./gradlew build
```

### Gemini API Errors in Production
**Recommendation:** Use backend API proxy instead of client-side API key.

```typescript
// Instead of:
const response = await fetch('https://generativelanguage.googleapis.com/...', {
  headers: { 'x-goog-api-key': API_KEY }
});

// Use backend:
const response = await fetch('https://api.techbridge.edu.gh/v1/gemini-proxy', {
  method: 'POST',
  body: JSON.stringify({ prompt: userInput })
});
```

---

**Last Updated:** 10 May 2026  
**Maintainer:** Daniel Frempong Twum / TUC ICT  
**Next Review:** 10 August 2026
