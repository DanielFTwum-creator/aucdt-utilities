# TUC AI Lab — App Store Submission Guide

**Complete step-by-step instructions for iOS App Store and Google Play Store distribution**

---

## Prerequisites

Before you start, ensure you have:

### Required Accounts
- ✅ **Apple Developer Account** (£99/year for iOS)
  - Register at [developer.apple.com](https://developer.apple.com)
  - Requires Apple ID and credit card
- ✅ **Google Play Developer Account** (£25 one-time for Android)
  - Register at [play.google.com/console](https://play.google.com/console)
  - Requires Google account and credit card

### Required Software
- ✅ **Xcode 15+** (for iOS builds)
- ✅ **Android Studio 2024.1+** (for Android builds)
- ✅ **Capacitor 8.3.3** (already configured in package.json)
- ✅ **CocoaPods** (for iOS dependencies)
  ```bash
  sudo gem install cocoapods
  ```

### Required Assets
- ✅ **App Icon** (1024×1024 PNG, will be resized automatically)
- ✅ **Screenshots** (5-10 per platform, various screen sizes)
- ✅ **Privacy Policy** (HTML, must be publicly accessible)
- ✅ **Description & Keywords** (marketing copy, 80–4000 characters)

### Required Files
- ✅ `capacitor.config.ts` — Already configured with appId: `com.techbridge.ailab`
- ✅ `package.json` — Version must be in semver format (1.0.0)
- ✅ `public/privacy.html` — Privacy policy (see template below)

---

## Part 1: Prepare Your App

### Step 1.1: Create App Icon

**Specification:**
- Format: PNG (32-bit RGBA)
- Size: 1024×1024 pixels
- Safe zone: 180×180 pixels from edges (for rounding on iOS)
- No transparency gradients on alpha channel

**Tools:**
- Figma: [appicon.resizer.tools](https://appicon.resizer.tools/)
- Online: [appiconmaker.co](https://appiconmaker.co/)
- Local: ImageMagick or GIMP

**Place your icon at:**
- `public/icon-1024.png`

### Step 1.2: Create Privacy Policy

Create `public/privacy.html` with GDPR/CCPA/GDPA compliance:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - TUC AI Lab</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1, h2 { color: #C9A84C; }
        .last-updated { color: #999; font-size: 0.9em; }
    </style>
</head>
<body>
    <h1>Privacy Policy — TUC AI Lab</h1>
    <p class="last-updated">Last Updated: 10 May 2026</p>

    <h2>1. Introduction</h2>
    <p>Techbridge University College ("we", "us", "TUC") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our TUC AI Lab mobile application.</p>

    <h2>2. Information We Collect</h2>
    <p>We collect information in the following ways:</p>
    <ul>
        <li><strong>Usage Data:</strong> Page views, interaction time, feature usage via Google Analytics</li>
        <li><strong>Device Information:</strong> Device type, OS version, app version</li>
        <li><strong>Crash Reports:</strong> Error logs to improve stability (if enabled)</li>
    </ul>
    <p><strong>We do NOT collect:</strong> Personal names, email addresses, location data, or biometric data.</p>

    <h2>3. How We Use Your Information</h2>
    <ul>
        <li>Improve app performance and user experience</li>
        <li>Understand usage patterns and popular resources</li>
        <li>Fix bugs and optimise features</li>
        <li>Comply with legal obligations</li>
    </ul>

    <h2>4. Third-Party Sharing</h2>
    <p>We share data only with:</p>
    <ul>
        <li><strong>Google Analytics:</strong> For usage tracking (anonymised)</li>
        <li><strong>Apple/Google:</strong> App store analytics (standard)</li>
    </ul>
    <p>We do not sell, trade, or rent user data to third parties.</p>

    <h2>5. Data Security</h2>
    <p>All data transmission is encrypted using HTTPS/TLS 1.2+. We implement industry-standard security practices to protect against unauthorised access, alteration, and destruction of data.</p>

    <h2>6. Your Rights</h2>
    <p>Under GDPR, CCPA, and Ghana Data Protection Regulation (GDPA), you have the right to:</p>
    <ul>
        <li>Access your data</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion (right to be forgotten)</li>
        <li>Opt-out of analytics tracking</li>
    </ul>
    <p>Contact: <strong>daniel.twum@techbridge.edu.gh</strong></p>

    <h2>7. Retention</h2>
    <p>We retain analytics data for 26 months. You can request deletion at any time.</p>

    <h2>8. Children's Privacy</h2>
    <p>This app is intended for educational use. We do not knowingly collect data from children under 13. Parents/guardians concerned about data practices should contact us.</p>

    <h2>9. Changes to This Policy</h2>
    <p>We may update this policy. We will notify users of significant changes via app notification or email.</p>

    <h2>10. Contact Us</h2>
    <p><strong>Techbridge University College</strong><br>
    Oyibi, Greater Accra, Ghana<br>
    Email: daniel.twum@techbridge.edu.gh<br>
    Phone: +233 (0) 123 456 789</p>
</body>
</html>
```

**Important:** Make this file publicly accessible at `https://ai-lab.techbridge.edu.gh/privacy.html`

### Step 1.3: Take Screenshots

**iOS Screenshots (6 recommended):**
- Screen size: 1242×2688 (iPhone 15 Pro Max)
- Scenes: Home, search results, resource detail, admin panel, theme switcher, export
- Add 1-2 lines of descriptive text per screenshot

**Android Screenshots (5-8 recommended):**
- Screen size: 1440×2560 (Pixel 9)
- Same scenes as iOS
- Text overlay: Feature highlights, benefits

**Tools:**
- Built-in device screenshots (Settings → Screenshots on iOS, Developer Options on Android)
- Simulator screenshots (Xcode, Android Studio)
- Design tool: Figma template for screenshot framing

### Step 1.4: Update package.json Version

Ensure version follows semver and matches app store submission:

```json
{
  "version": "1.0.0"
}
```

Increment for updates:
- **1.0.1** — Bug fixes
- **1.1.0** — New features
- **2.0.0** — Major breaking changes

### Step 1.5: Verify All Features Work

Before submission, test on physical devices:

```bash
# Build web
npm run build:web

# Sync to native projects
npx capacitor sync

# Test on iOS simulator
npm run ios:open  # Opens Xcode, run via Product → Run

# Test on Android emulator
npm run android:open  # Opens Android Studio, run via Run → Run 'app'
```

**Test Checklist:**
- ☐ App launches without crashes
- ☐ Search works
- ☐ Filters work
- ☐ Theme switching works
- ☐ Admin login works
- ☐ Resource creation works
- ☐ All links open correctly
- ☐ Navigation works (back button, tab bar)
- ☐ No console errors
- ☐ Text is readable on all screen sizes

---

## Part 2: iOS App Store Submission

### Step 2.1: Generate iOS Build

```bash
cd tuc-ai-lab-catalog

# Install dependencies
pnpm install

# Build web bundle
npm run build:web

# Open Xcode project
npm run ios:open
```

### Step 2.2: Configure Signing in Xcode

1. **Open Xcode:** Project → Select target "App"
2. **General Tab:**
   - Display Name: `TUC AI Lab`
   - Bundle Identifier: `com.techbridge.ailab`
   - Version: `1.0.0`
   - Build: `1`
3. **Signing & Capabilities:**
   - Team: Select your Apple Developer team
   - Signing Certificate: Automatic (let Xcode manage)
   - Provisioning Profile: Automatic

### Step 2.3: Archive for Submission

```bash
# In Xcode:
Product → Archive
# Wait for build to complete (2-5 minutes)

# When prompt appears: "Distribute App"
# Select: "App Store Connect"
```

### Step 2.4: Create App Store Connect Entry

1. **Go to:** [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. **Click:** "My Apps" → "Create New App"
3. **Fill in:**
   - Platform: iOS
   - App Name: `TUC AI Lab`
   - Bundle ID: `com.techbridge.ailab`
   - SKU: `tuc-ailab-001` (internal identifier, not user-visible)
   - User Access: Full Access (unless team-managed)

### Step 2.5: Upload Build

```bash
# Using Apple's Transporter (recommended):
# 1. Download .ipa file from Xcode archive
# 2. Open Transporter app (Mac App Store)
# 3. Drag .ipa into Transporter
# 4. Wait for upload validation (5-10 minutes)
```

### Step 2.6: Fill App Metadata

In App Store Connect, complete all sections:

#### Availability
- Release Date: Today or future date
- Countries/Regions: Select all or priority markets

#### Pricing
- Price Tier: Free (or 0.99 USD if paid)

#### App Information
- Category: Education
- Subcategory: Reference
- Content Rating Questionnaire: Complete (usually "17+")

#### App Description
```
Explore artificial intelligence research, tools, and educational resources at Techbridge University College. 
The TUC AI Lab Catalog offers a comprehensive repository of AI initiatives, datasets, publications, and learning materials.

Features:
• Search and filter AI projects by category, date, and keywords
• Discover datasets, papers, and tools
• Dark mode and high-contrast themes for accessibility
• Offline browsing (selected resources cached)
```

#### Keywords
`AI, machine learning, education, research, Techbridge, TUC, Ghana`

#### Support URL
`https://ai-lab.techbridge.edu.gh`

#### Privacy Policy URL
`https://ai-lab.techbridge.edu.gh/privacy.html`

#### Demo Account (if admin access shown)
Username: `demo@techbridge.edu.gh`
Password: `demo1234` (or leave blank if not applicable)

#### Screenshots & Preview
- Add 5-6 screenshots from Step 1.3
- Add app preview video (optional, but recommended)

#### App Icon
- Upload `public/icon-1024.png`

### Step 2.7: Submit for Review

1. **In App Store Connect:** App → Version → General
2. **Review Checklist Section:** Check all required items
3. **Click:** "Submit for Review"
4. **Wait:** 3–5 business days for review

### Step 2.8: Handle Review Feedback

If rejected, you'll receive email with rejection reason. Common issues:
- **Guideline 2.1 (Performance):** App crashes or is too slow → Fix and resubmit
- **Guideline 4.2 (Metadata):** Screenshots or description misleading → Update and resubmit
- **Guideline 5.2 (Legal):** Privacy policy missing or inadequate → Update and resubmit

---

## Part 3: Google Play Store Submission

### Step 3.1: Generate Android Build

```bash
cd tuc-ai-lab-catalog

# Build web bundle
npm run build:web

# Open Android Studio
npm run android:open
```

### Step 3.2: Create Keystore (First Time Only)

In Android Studio:
```
Build → Generate Signed Bundle/APK → APK → Next
```

Follow wizard:
- **New Keystore:** Create `~/.android/tuc-ailab-release.jks`
- **Alias:** `tuc-ailab-release`
- **Password:** Use strong password (save securely)
- **Validity:** 25+ years

### Step 3.3: Generate Release APK/Bundle

```bash
# In Android Studio:
Build → Generate Signed Bundle/APK → Android App Bundle (AAB, recommended)

# Use keystore from Step 3.2
# Select "Release" build variant
# Wait 2-5 minutes for build
```

### Step 3.4: Create Google Play Console Entry

1. **Go to:** [play.google.com/console](https://play.google.com/console)
2. **Click:** "Create App"
3. **Fill in:**
   - App Name: `TUC AI Lab`
   - Default Language: English
   - App Type: Application
   - Category: Education → Reference
   - Free/Paid: Free

### Step 3.5: Fill App Metadata

#### App Access
- Access Type: Full game (default)

#### Content Rating Questionnaire
- Complete questionnaire (usually "Everyone 10+" for educational app)
- Answer honestly about content

#### Policies
- Accept all policies
- Confirm privacy policy is available

#### Store Listing
- **Short Description (50 chars):**
  `AI research & education hub by Techbridge University`

- **Full Description (4000 chars max):**
  ```
  Discover artificial intelligence at Techbridge University College.
  
  The TUC AI Lab Catalog is your gateway to cutting-edge AI research, educational resources, and tools developed by our research teams.
  
  Features:
  • Search thousands of AI projects, papers, and datasets
  • Filter by category, date, publication status
  • Dark mode and high-contrast themes
  • Bookmark favourite resources
  • Offline access to selected materials
  
  Explore AI research in:
  - Machine Learning
  - Natural Language Processing
  - Computer Vision
  - Educational AI
  - Generative AI
  
  Perfect for students, researchers, and AI enthusiasts.
  ```

- **Short Description (80 chars max):**
  `TUC AI Lab — Education & Research Resources`

- **App Category:**
  Education → Reference

#### Graphic Assets
- **App Icon:** 512×512 PNG (upload `public/icon-1024.png`, auto-scaled)
- **Feature Graphic:** 1024×500 PNG (header image for store listing)
- **Screenshots:** 5-8 screenshots (1440×2560 recommended)
  - Minimum 2, maximum 8
  - Can be landscape or portrait

#### Content Rating
- Fill content rating questionnaire
- Select "Everyone 10+"

#### Privacy Policy
- Privacy Policy URL: `https://ai-lab.techbridge.edu.gh/privacy.html`

#### Contact Details
- Email: `daniel.twum@techbridge.edu.gh`
- Website: `https://ai-lab.techbridge.edu.gh`

### Step 3.6: Upload Build

1. **Go to:** Release → Production
2. **Create new release:**
   - Click "Create new release"
   - Upload Android App Bundle (AAB) from Step 3.3
   - Add release notes:
     ```
     Version 1.0.0
     
     Initial release of TUC AI Lab Catalog.
     
     Features:
     • Full catalogue search and filtering
     • Admin dashboard (password-protected)
     • Dark and high-contrast themes
     • Google Analytics integration
     - Complete audit logging
     ```
3. **Review Checklist:** Ensure all required fields are complete
4. **Click:** "Save" then "Review Release"

### Step 3.7: Submit for Review

1. **Go to:** Release → Production
2. **Click:** "Start rollout to Production"
3. **Confirm:** "Rollout"
4. **Wait:** 1–2 hours for review (usually much faster than Apple)

### Step 3.8: Handle Review Feedback

Common rejection reasons:
- **Inadequate content rating:** Revise questionnaire
- **Missing privacy policy:** Add URL and ensure page loads
- **Misleading screenshots:** Update screenshots or description
- **Prohibited content:** Remove any flagged elements

---

## Post-Submission Checklist

### Immediately After Submission
- ☐ Confirm receipt of submission confirmation email
- ☐ Set up monitoring alerts for app reviews
- ☐ Prepare response templates for common review feedback

### During Review Period (1–5 days)
- ☐ Check review status daily
- ☐ Be ready to respond to questions or feedback
- ☐ Keep changelog updated for next version

### After Approval
- ☐ Download and test installed app from app store
- ☐ Verify all features work on production version
- ☐ Monitor user reviews and ratings
- ☐ Plan first update (v1.0.1) with bug fixes or improvements
- ☐ Set up automatic update deployment (App Store internal testing)

---

## Version Updates & Future Releases

### Bug Fix Release (1.0.1)
```bash
# 1. Fix bug in code
# 2. Update version in package.json: "1.0.1"
# 3. Build and submit as new release
```

### Feature Release (1.1.0)
```bash
# 1. Add new feature
# 2. Test thoroughly
# 3. Update package.json: "1.1.0"
# 4. Write release notes
# 5. Submit to both app stores
```

### Major Release (2.0.0)
```bash
# 1. Plan breaking changes
# 2. Update documentation
# 3. Test with beta users
# 4. Update package.json: "2.0.0"
# 5. Submit with prominent release notes
```

---

## Troubleshooting

### Xcode Build Fails
```bash
# Clear derived data
rm -rf ~/Library/Developer/Xcode/DerivedData/*
# Clean build
xcode-select --install
pnpm install
npm run build:web
npm run ios:open
# Try build again
```

### Android Build Fails
```bash
# Clear gradle cache
./android/gradlew clean
# Sync gradle
./android/gradlew sync
# Try build again
npm run android:open
```

### App Rejected by App Store
- Review rejection reason carefully
- Make only the requested changes
- Resubmit within 30 days or app will be removed
- Contact Apple Support if reason is unclear

### App Rejected by Google Play
- Review policy violation carefully
- Make changes and resubmit immediately
- Google Play review is typically faster (1–2 hours)

---

## Support

- **Capacitor Docs:** https://capacitorjs.com/docs
- **Apple App Store Guide:** https://developer.apple.com/app-store/
- **Google Play Guide:** https://play.google.com/console/about/guides/

For TUC-specific questions, contact:
**Daniel Frempong Twum**  
daniel.twum@techbridge.edu.gh  
Head of ICT, Techbridge University College

---

**Last Updated:** 10 May 2026  
**Status:** Production Ready  
**Estimated Submission Time:** 2–3 hours per platform
