# TUC RMS — App Store Deployment Guide

**Document ID:** TUC-RMS-APPSTORE-2026-001  
**Version:** 3.0  
**Last Updated:** 25 May 2026  
**Audience:** App Store Project Managers, Marketing, Release Team

---

## Overview

This guide provides step-by-step instructions for submitting the TUC Results Management System to the Apple App Store and Google Play Store. It covers account setup, app metadata, review submission, and post-launch management.

**Target Platforms:** iOS 14+, Android 8+  
**App Name:** TUC Results  
**Bundle ID:** `com.techbridge.tucrms`  
**Target Launch:** Q3 2026

---

## 1. Prerequisites

### 1.1 Apple App Store

**Requirements:**
- Apple Developer Program membership ($99/year)
  - Link: https://developer.apple.com/programs/
- Mac computer with Xcode 14+ (for final builds)
- Apple ID (used for signing/code signing certificates)
- Valid payment method

**Account Setup:**
1. Enrol in Apple Developer Program at https://developer.apple.com
2. Pay $99 annual fee
3. Complete identity verification (may take 24–48 hours)
4. Create App ID: `com.techbridge.tucrms`
5. Generate provisioning profiles (Development and Distribution)
6. Download certificates (Certificate Authority)

**Key Documents to Prepare:**
- App name: "TUC Results"
- Subtitle: "Academic Performance Tracking"
- Keywords: "results, grades, academic, education, university"
- Category: Education

### 1.2 Google Play Store

**Requirements:**
- Google Play Developer account ($25 one-time fee)
  - Link: https://play.google.com/console/
- Google account (personal or business)
- Valid payment method

**Account Setup:**
1. Visit https://play.google.com/console/
2. Create or sign in to Google account
3. Pay $25 registration fee
4. Complete merchant profile
5. Create new app: "TUC Results"
6. Set package name: `com.techbridge.tucrms`

**Key Documents to Prepare:**
- App name: "TUC Results"
- Category: Education
- Content rating: General audience (PEGI 3)
- Privacy policy URL: https://results.tuc.edu.gh/privacy

---

## 2. App Metadata & Branding

### 2.1 App Icons

**Specifications:**

| Platform | Sizes Required | Dimensions | Format |
|----------|---|---|---|
| iOS | 1 | 1024×1024 px | PNG (no transparency) |
| Android | Adaptive icon | 1024×1024 px (source) | PNG |

**Design:**
- Background colour: #6B0020 (TUC Maroon)
- Accent colour: #F5A800 (TUC Gold)
- Readable at small sizes (as small as 40×40 px)
- No text on icon

**Generation:**
Use `@capacitor/assets` tool:
```bash
cd frontend
npm install -D @capacitor/assets
cp resources/icon.png .  # Place 1024×1024 source file
npx capacitor-assets generate --iconSourcePath=./icon.png --splashSourcePath=./splash.png
```

### 2.2 App Screenshots (Required)

**iOS Screenshots:**
- 5–10 screenshots required
- Minimum 1242×2208 px (6.5-inch display)
- Must show in-app content (no marketing graphics alone)

**Android Screenshots:**
- 2–8 screenshots required
- Phone: 1080×1920 px (9:16 aspect ratio)
- Tablet: 1440×900 px (16:10 aspect ratio)

**Screenshot Sequence (for both platforms):**
1. **Login Screen** — Shows email/password fields, demonstrates authentication
2. **Dashboard** — Displays student/course stats, main navigation
3. **Results Approval** — Registrar approving pending results
4. **Student Management** — Shows student table, search, add capability
5. **Theme Switching** — Highlights dark mode and high-contrast options
6. **Mobile-Specific Features** — Touch interactions, offline support (if applicable)

**Best Practices:**
- Use real data (anonymised student records)
- Highlight key features in each screenshot
- Use captions explaining what users see
- Ensure text is legible in all sizes

### 2.3 App Description

**Short Description (80 characters):**
```
Results Management System for Techbridge University College
```

**Full Description (4000 characters max):**
```
TUC Results is an official mobile application for Techbridge University 
College that provides secure access to academic grades, course results, 
and performance metrics.

KEY FEATURES:
✓ View grades and academic performance
✓ Track course results in real-time
✓ Secure authentication with two-factor support
✓ Offline access to stored grades (on iOS)
✓ Dark mode and accessibility themes
✓ Notifications for new results
✓ Grade transcripts and academic records

SECURITY & PRIVACY:
- Military-grade encryption (HTTPS/TLS)
- Passwords stored with bcrypt hashing
- GDPR, CCPA, and GDPA compliant
- No third-party tracking or analytics
- Complete privacy policy available in-app

REQUIREMENTS:
- iOS 14+ or Android 8+
- Internet connection for grade uploads
- Techbridge University College account (student or staff)

For support, contact: ict@tuc.edu.gh

Version 1.0.0 | © 2026 Techbridge University College
```

### 2.4 Privacy Policy & Terms

**Required URL:**
```
https://results.tuc.edu.gh/privacy
```

**Hosted File:**
- `frontend/public/privacy.html` (standalone, no React)
- Accessible from both web and mobile app
- Covers GDPR, CCPA, GDPA compliance
- Updated date: 25 May 2026

---

## 3. Building for Production

### 3.1 Frontend Production Build

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build:prod

# Verify output
ls -la dist/
# Should contain: index.html, assets/main-HASH.js, assets/main-HASH.css
```

### 3.2 iOS Build (using Capacitor)

```bash
cd frontend

# Install Capacitor dependencies
npm install @capacitor/core@8.3.3 @capacitor/ios@8.3.3
npm install -D @capacitor/cli@8.3.3

# Add iOS platform
npx cap add ios

# Sync Capacitor
npm run build:prod  # Must build first!
npx cap sync ios

# Open Xcode
npx cap open ios
```

**In Xcode:**
1. Select "TUC Results" target
2. Under General → Signing & Capabilities:
   - Team: Select your Apple Developer Team
   - Bundle Identifier: `com.techbridge.tucrms`
3. Select Generic iOS Device (not simulator)
4. Product → Archive
5. Upload to App Store Connect

### 3.3 Android Build (using Capacitor)

```bash
cd frontend

# Install Android SDK (if not already installed)
# Download Android Studio: https://developer.android.com/studio

# Add Android platform
npx cap add android

# Sync Capacitor
npm run build:prod  # Must build first!
npx cap sync android

# Open Android Studio
npx cap open android
```

**In Android Studio:**
1. Build → Generate Signed Bundle / APK
2. Select "Bundle (Google Play)"
3. Create or select signing key:
   - Key store path: `~/.android/tuc-rms.jks`
   - Key alias: `tuc-rms`
   - Key password: [generate secure password]
4. Release build variant: `release`
5. Build → Build Bundle(s)

Output: `app/release/app-release.aab`

---

## 4. App Store Connect (iOS)

### 4.1 Creating the App

1. Log in to https://appstoreconnect.apple.com/
2. Click **Apps** → **+ New App**
3. Fill in:
   - **Platform:** iOS
   - **Name:** TUC Results
   - **Primary Language:** English
   - **Bundle ID:** `com.techbridge.tucrms` (select existing)
   - **SKU:** `TUC-RMS-2026` (any unique identifier)
4. Click **Create**

### 4.2 App Information

**General:**
- Category: Education
- Content Rating: None / Not Required (PEGI 3)
- Ratings Configuration: Complete questionnaire

**Pricing & Availability:**
- Price: Free
- Availability: Select countries (or worldwide)

### 4.3 App Preview & Screenshots

1. Select screenshot set for 6.5-inch display (iPhone 14 Pro Max)
2. Upload 5–10 screenshots (minimum 1 required)
3. Add app preview video (optional, but recommended)

**Screenshot Upload:**
- Drag and drop 1242×2208 px PNG files
- Reorder for optimal flow
- Add captions under each screenshot

### 4.4 Description, Release Notes & Keywords

**Name:** TUC Results (≤30 characters)

**Subtitle:** Academic Performance Tracking (≤30 characters)

**Description:** (≤4000 characters)
```
TUC Results is an official mobile app for students and staff of 
Techbridge University College to view academic grades, track course 
performance, and access institutional resources securely.

FEATURES:
✓ Real-time grade viewing
✓ Course result tracking
✓ Secure authentication
✓ Dark mode & accessibility options
✓ Offline grade access
✓ Privacy-first design

SECURITY:
- HTTPS/TLS encryption
- bcrypt password hashing
- GDPR/CCPA/GDPA compliant
- No third-party tracking

Version: 1.0.0 | Support: ict@tuc.edu.gh
```

**Keywords:** (comma-separated, up to 100 characters)
```
results,grades,academic,university,education,tracking,tuc,ghana
```

**Support URL:**
```
https://results.tuc.edu.gh/support
```

**Privacy Policy URL:**
```
https://results.tuc.edu.gh/privacy
```

**Release Notes:**
```
🎉 Initial Release v1.0.0

Welcome to TUC Results — your personal academic dashboard.

NEW IN THIS VERSION:
- Full-featured mobile app for iOS 14+
- Real-time grade access
- Dark mode and high-contrast themes
- WCAG 2.1 AA accessibility compliance
- Offline grade caching
- Secure password-less login (fingerprint)

📱 Supported Features:
✓ View grades by course
✓ Track GPA and academic standing
✓ Receive result notifications
✓ Access transcripts and reports
✓ Switch between light, dark, and high-contrast themes

🔒 Security & Privacy:
- All data encrypted in transit (HTTPS)
- Passwords hashed with bcrypt
- No analytics or third-party tracking
- GDPR, CCPA, and GDPA compliant

Thank you for choosing TUC Results!
For support, email ict@tuc.edu.gh
```

### 4.5 App Review Information

**Contact Information:**
- Email: daniel.twum@techbridge.edu.gh
- Phone: +233 XXX XXX XXX
- Address: Oyibi, Greater Accra, Ghana

**Demo Account Credentials:**
```
Email: registrar@tuc.edu.gh
Password: Admin@123
Role: Registrar (full access for testing)
```

**Review Notes (for Apple reviewers):**
```
This is an official educational app for Techbridge University College 
students and staff.

TEST ACCOUNT:
- Email: registrar@tuc.edu.gh
- Password: Admin@123

The app provides secure access to student grades, course results, 
and academic performance metrics. It requires a valid institution 
account to authenticate.

Key features for testing:
1. Login with provided credentials
2. Navigate to Dashboard to view stats
3. Switch themes (Light/Dark/High-Contrast)
4. View results and grades
5. Logout (clears session)

The app does not collect or share personal data with third parties. 
Privacy policy: https://results.tuc.edu.gh/privacy

No in-app purchases, ads, or external links.
```

---

## 5. Google Play Console (Android)

### 5.1 Creating the App

1. Log in to https://play.google.com/console/
2. Click **Create App**
3. Fill in:
   - **App name:** TUC Results
   - **Default language:** English
   - **App or game:** App
   - **Free or paid:** Free
4. Click **Create app**

### 5.2 App Details

**Basic Information:**
- Short description (80 char): "Results Management for TUC Students"
- Full description (4000 char): [same as iOS, above]
- Development status: Published

**Categorisation:**
- Category: Education
- Content rating: General Audiences (PEGI 3)

### 5.3 Graphic Assets

**Store Listing Graphics:**
- **Icon:** 512×512 px PNG
- **Featured Graphic:** 1024×500 px PNG (landscape banner)
- **Screenshots:** 1080×1920 px (phone) or 1440×900 px (tablet), 2–8 required
- **Promo Video:** 16:9 aspect ratio (optional)

**Upload Process:**
1. Navigate to **Store listing** → **Graphics**
2. Click upload button for each asset type
3. Ensure all items pass validation (no red X)

### 5.4 Content Rating

1. Navigate to **Content rating**
2. Complete questionnaire (5–10 minutes)
3. Questionnaire topics:
   - Violence
   - Sexual content
   - Substance abuse
   - Language
   - etc.
4. Click **Save ratings**

**Result:** PEGI 3 (for most educational apps)

### 5.5 Privacy Policy & Permissions

**Privacy Policy:**
- Copy URL: https://results.tuc.edu.gh/privacy
- Paste into **Privacy policy** field
- Click **Save**

**App Permissions Disclosure:**
- List all permissions used:
  - Internet (networking)
  - Device ID (for session tracking)
  - Photos (optional, for profile pictures)
- Explain why each permission is needed

---

## 6. App Review Process

### 6.1 iOS App Review (Apple)

**Timeline:** 24–48 hours (usually)

**Review Guidelines:**
- https://developer.apple.com/app-store/review/guidelines/

**Common Rejection Reasons & Fixes:**
| Reason | Fix |
|--------|-----|
| Incomplete app metadata | Ensure all screenshots, description, privacy policy are complete |
| Bugs during testing | Test thoroughly with demo account before submission |
| Unclear purpose | Write clear description explaining educational use |
| Privacy concerns | Verify privacy policy is linked and compliant |
| Outdated API usage | Use latest iOS APIs (Capacitor handles this) |

**Submission Steps:**
1. In App Store Connect, click **Prepare for Submission**
2. Under **App Version**, click **Add Version**
3. Fill in all required fields
4. Review Compliance Certificate (COPPA, if handling children)
5. Click **Submit for Review**
6. Apple will review and email approval/rejection within 48 hours

### 6.2 Google Play Review (Android)

**Timeline:** 2–4 hours (usually)

**Review Guidelines:**
- https://support.google.com/googleplay/android-developer/answer/9859455

**Common Rejection Reasons & Fixes:**
| Reason | Fix |
|--------|-----|
| Privacy policy not accessible | Verify URL is live and unblocked |
| Inadequate testing | Use test account credentials |
| Deceptive behaviour | Ensure app functions as described |
| Aggressive ads (none in our case) | No ads in our app, so not applicable |
| Broken permissions | Only request permissions needed |

**Submission Steps:**
1. In Google Play Console, navigate to **Store listing**
2. Complete all required fields (see sections above)
3. Upload signed AAB (Android App Bundle) under **Release** → **Closed testing**
4. Test in closed testing track (48 hours)
5. Move to **Internal testing** if satisfied
6. Click **Create release** → **Production**
7. Upload AAB and click **Review release**
8. Google will review and notify approval within 4 hours

---

## 7. Post-Launch Management

### 7.1 Monitoring & Ratings

**Track KPIs:**
- Downloads per day
- Average rating (target: 4.5+ stars)
- Crash rate (target: <1%)
- Negative review themes

**Location:** App Store Connect & Google Play Console → Analytics

### 7.2 Responding to Reviews

**iOS (App Store Connect):**
1. Navigate to **Ratings and Reviews**
2. Filter by star rating (focus on 1–3 stars)
3. Click **Reply** to respond
4. Keep responses professional, brief, solution-focused

**Android (Google Play Console):**
1. Navigate to **Reviews**
2. Filter by rating
3. Click **Reply** to respond
4. Same approach as iOS

**Response Template:**
```
Thank you for your feedback. We're sorry to hear you experienced 
[issue]. Please email support@tuc.edu.gh with:
- Your account email
- Device & OS version
- Steps to reproduce the issue

We'll investigate and send a fix ASAP. —TUC Support Team
```

### 7.3 Updates & Version Management

**Update Process:**
1. Increment version in `package.json`: e.g., 1.0.1
2. Update `capacitor.config.ts` version
3. Rebuild for iOS and Android
4. Submit to respective app stores with release notes

**Release Notes Template (for v1.0.1):**
```
🔧 Bug Fixes & Improvements

- Fixed login timeout on Android
- Improved dark mode theme consistency
- Enhanced accessibility for screen readers
- Performance optimisations

Thank you for using TUC Results!
```

### 7.4 Scheduled Releases

**Schedule Future Releases:**
1. Upload build/AAB
2. Under **Release management**, select **Scheduled release**
3. Choose date/time
4. Google/Apple will auto-publish at that time

---

## 8. Troubleshooting

### Issue: "Invalid Bundle ID"

**Solution:** Ensure `capacitor.config.ts` has correct `appId`:
```typescript
const config: CapacitorConfig = {
  appId: 'com.techbridge.tucrms',  // Must match App Store Connect
  // ...
};
```

### Issue: "Code Signing Failed" (iOS)

**Solution:**
1. In Xcode, select Project → Build Settings
2. Search for "Code Sign Identity"
3. Select "iPhone Developer"
4. Ensure provisioning profile is valid

### Issue: "App Not Optimised for Tablet" (Android)

**Solution:**
- Google Play requires 7-inch and 10-inch tablet screenshots
- Add `1440×900` tablet screenshots to store listing
- Test app layout on tablets in emulator

### Issue: "Privacy Policy Not Accessible"

**Solution:**
1. Verify URL is live: `curl https://results.tuc.edu.gh/privacy`
2. Check that page loads (no 404 error)
3. Allow time for DNS propagation (24 hours)

---

## 9. Timeline & Milestones

### Pre-Launch (Q2 2026)
- [x] Complete Capacitor setup
- [x] Build iOS and Android versions
- [x] Test on physical devices
- [x] Prepare app metadata & screenshots
- [x] Create app listings in both stores

### Launch Week (Q3 2026)
- [ ] Submit to App Store (Monday)
- [ ] Submit to Google Play (Monday)
- [ ] Await Apple review (48 hours)
- [ ] Await Google review (4 hours)
- [ ] Announce release to users

### Post-Launch
- [ ] Monitor crash rate & ratings
- [ ] Respond to user reviews
- [ ] Plan v1.0.1 with user feedback

---

## 10. Marketing & User Acquisition

### Launch Announcement

**Email Template:**
```
Subject: 📱 TUC Results App Now Available — Download Free!

Dear Techbridge University College Community,

We're excited to announce the launch of TUC Results, the official 
mobile app for accessing your academic grades and course performance.

📲 DOWNLOAD NOW:
- iOS: [App Store link]
- Android: [Google Play link]

✨ Features:
✓ View grades in real-time
✓ Track course progress
✓ Dark mode & accessibility themes
✓ Secure, encrypted access
✓ Offline grade caching

🔐 Your Privacy Matters:
- No third-party tracking
- GDPR/CCPA/GDPA compliant
- Military-grade encryption

Questions? Email ict@tuc.edu.gh

—Daniel Frempong Twum
Head of ICT
```

### Social Media

**Twitter/X Post:**
```
🎉 The TUC Results app is live! Download now for instant access to 
your grades, course performance, and academic standing. Available on 
iOS and Android. Secure, private, and designed for you. 

📥 App Store: [link]
🤖 Google Play: [link]

#TUC #MobileApp #EducationTech
```

---

## Support & Escalation

**For App Store Issues:**
- Email: appstore-support@apple.com (for review rejections)
- Contact: Daniel Frempong Twum (daniel.twum@techbridge.edu.gh)

**For Google Play Issues:**
- Support: https://support.google.com/googleplay/android-developer/
- Contact: Daniel Frempong Twum (daniel.twum@techbridge.edu.gh)

---

**Document Status:** Final — Version 3.0  
**Next Review Date:** 1 August 2026
