# Verb Explorer Toolkit — App Store & Play Store Deployment Guide

**Last Updated:** 2026-05-08  
**Version:** 1.0.0  
**App ID:** `com.techbridge.verbexplorer`  
**Publisher:** Techbridge Education Services Ghana

---

## 📋 Pre-Deployment Checklist

### Prerequisites
- [ ] Apple Developer Account (paid: $99/year)
- [ ] Google Play Developer Account (one-time: $25)
- [ ] Mac with Xcode (iOS builds)
- [ ] Android Studio or Android SDK (Android builds)
- [ ] Node.js 18+ and npm installed

### Project Setup
- [x] Dependencies installed (`npm install`)
- [x] Web app builds successfully (`npm run build`)
- [x] Capacitor configured (`capacitor.config.ts`)
- [x] App icons created (`public/app-icon.svg`)
- [x] Metadata configured (`metadata.json`)

---

## 🔧 Setup Instructions

### 1. Install Native Project Dependencies

```bash
npm run cap:sync
```

This will:
- Generate `ios/` folder with Xcode project
- Generate `android/` folder with Android Studio project
- Copy web assets to both platforms

### 2. Update App Name & Bundle ID (if needed)

Edit `capacitor.config.ts`:
```typescript
const config: CapacitorConfig = {
  appId: 'com.techbridge.verbexplorer',  // Change if needed
  appName: 'Verb Explorer',               // Change if needed
  webDir: 'dist',
  // ...
};
```

Then re-sync:
```bash
npm run cap:sync
```

---

## 🍎 iOS Deployment (App Store)

### Step 1: Prepare Signing Certificates

1. **Open Xcode Project**
   ```bash
   npm run cap:ios
   ```
   This opens the iOS project in Xcode.

2. **Configure Signing**
   - Select project → "Verb Explorer" target
   - Go to "Signing & Capabilities"
   - Team: Select your Apple Developer Team
   - Bundle ID: `com.techbridge.verbexplorer`

3. **Create Provisioning Profile**
   - Go to Apple Developer Portal (developer.apple.com)
   - Certificates, IDs & Profiles → Identifiers
   - Register new App ID with bundle `com.techbridge.verbexplorer`
   - Create Provisioning Profile for App Store
   - Download and install in Xcode

### Step 2: Update Version & Build Number

In Xcode:
- General tab → Version: `1.0.0`
- General tab → Build: `1`

### Step 3: Create App Store Connect Entry

1. Go to App Store Connect (appstoreconnect.apple.com)
2. **My Apps** → **+** → **New App**
3. Fill in:
   - Name: `Verb Explorer`
   - Bundle ID: `com.techbridge.verbexplorer`
   - SKU: `VERB_EXPLORER_001`
   - User Access: Single User

### Step 4: Fill App Metadata

In App Store Connect:
- **Description**: "Interactive toolkit for Class 4 students to discover and research verbs. Students choose a verb, research its meaning, origin, and usage, then create a colourful profile card and practice presenting."
- **Keywords**: `verb, learning, education, class 4, toolkit, interactive`
- **Category**: Education
- **Content Rating**: None (this is an educational app with no external content)
- **Privacy Policy URL**: (link to TUC privacy policy or create one)

### Step 5: Add Screenshots

Required: 6.7-inch display (iPhone 15 Pro Max) screenshots showing:
1. Step 1: Verb selection screen
2. Step 2: Research input screen
3. Step 3: Manila card profile
4. Step 4: Presentation timer
5. Completed card (print view)
6. Feature highlight

### Step 6: Build & Archive

In Xcode:
1. Select "Verb Explorer" → Generic iOS Device (or latest iPhone)
2. Product → Archive
3. Distribute App
4. App Store Connect
5. Upload

---

## 🤖 Android Deployment (Google Play Store)

### Step 1: Create Keystore & Signing Key

```bash
# Generate keystore file (one-time)
keytool -genkey -v -keystore verb-explorer.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias verb-explorer-key

# Save password and keystore file in secure location
# NEVER commit keystore to git
```

### Step 2: Configure Signing in Gradle

Edit `android/app/build.gradle`:

```gradle
android {
  signingConfigs {
    release {
      storeFile file('../verb-explorer.keystore')
      storePassword 'YOUR_KEYSTORE_PASSWORD'
      keyAlias 'verb-explorer-key'
      keyPassword 'YOUR_KEY_PASSWORD'
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
cd android
./gradlew bundleRelease
cd ..
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### Step 4: Set Up Google Play Developer Account

1. Go to Google Play Console (play.google.com/console)
2. Create new app
3. Fill in:
   - App name: `Verb Explorer`
   - Default language: English
   - App category: Education
   - Content rating: Everyone (or rate via questionnaire)

### Step 5: Add App Metadata

In Google Play Console → App settings:
- **Short description** (50 chars): "Interactive verb discovery toolkit for Class 4"
- **Full description**: (same as iOS)
- **Promotional graphics**: 1024×500px header image
- **Icon**: 512×512px PNG (use `public/app-icon.svg` converted to PNG)
- **Screenshots**: 1080×1920px minimum (5-8 images)
- **Featured graphic**: 1200×500px

### Step 6: Upload & Submit

1. Release → Production
2. Upload `app-release.aab`
3. Fill in release notes: "First release: Verb discovery project toolkit for educational use"
4. Review content rating
5. Submit for review

---

## 📱 Testing Before Submission

### iOS TestFlight (Beta Testing)
```bash
npm run cap:sync
npm run cap:ios
# In Xcode: Product → Archive → Distribute → TestFlight
```

### Android Internal Testing
1. In Google Play Console → Testing → Internal testing
2. Create track and upload AAB
3. Add testers by email
4. Testers download from Play Store (internal testing link)

---

## 🔒 Security Checklist

- [ ] API keys (if added) stored in environment variables (`.env.local`)
- [ ] `.env` files added to `.gitignore`
- [ ] No credentials committed to git
- [ ] Keystore file NOT in git repository
- [ ] HTTPS enabled for any API calls
- [ ] Data privacy policy created and linked
- [ ] Content Rating Questionnaire completed

---

## 📊 Post-Submission Monitoring

Once live on App Stores:
1. Monitor crash reports in App Store Connect / Google Play Console
2. Read user reviews and respond to feedback
3. Track downloads and user retention
4. Plan version updates for bugs or new features

### Update Process
```bash
# Increment version in capacitor.config.ts
# Update iOS version/build in Xcode
# Update Android versionCode in build.gradle
npm run build
npm run cap:sync
# Follow same submission steps with updated version
```

---

## ⚠️ Important Notes

1. **Review Time**: App Store takes 24-48 hours; Google Play takes 2-4 hours
2. **Rejections**: Apps may be rejected for:
   - Broken links or content
   - Insufficient descriptions
   - Inappropriate for target age group
   - Technical issues (crashes)
3. **Sustainability**: Plan for annual Apple Developer fee renewal
4. **Localization**: Consider adding support for local Ghanaian languages

---

## 📞 Support & Troubleshooting

**Common Issues:**

| Issue | Solution |
|-------|----------|
| Build fails in Xcode | `npm run cap:sync` and rebuild |
| App Store rejection | Check rejection email for specific issue; common: privacy policy missing |
| Play Store upload fails | Verify keystore password and signing config in Gradle |
| App crashes on launch | Check device logs in Xcode debugger or ADB |

**Contact:**
- Daniel Twum — daniel.twum@techbridge.edu.gh
- TUC ICT Department — ict@techbridge.edu.gh

---

*Prepared by: Techbridge ICT Department*  
*For: Class 4 Verb Explorer Toolkit v1.0.0*
