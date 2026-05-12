# App Store Submission Guide (iOS & Android)

**Institution:** Techbridge University College (TUC)
**Document ID:** TUC-INC-2026-006

## 1. Overview
This Standard Operating Procedure (SOP) details the steps to publish the Techbridge University College (TUC) Compliance Workflow Dashboard application to the Apple App Store and Google Play Store.

## 2. Apple App Store Submission (iOS)

### Account & App Setup
1. **Apple Developer Account:** Ensure TUC has an active Apple Developer Program membership.
2. **App ID & Profiles:** Create an App ID matching `com.techbridge.complianceworkflowdashboard` in the Apple Developer Portal. Generate a Distribution Provisioning Profile.
3. **App Store Connect:** Create a new app record in App Store Connect. Fill in the required metadata (Name, Description, Keywords, Support URL, Privacy Policy URL).

### Metadata & Imagery
1. Upload App Store screenshots (requires 6.5-inch and 5.5-inch display dimensions).
2. Upload the App Icon (1024x1024).

### Build Upload & Submission
1. Build the app archive via Xcode.
2. Upload to App Store Connect using Xcode Organizer or Transporter.
3. Select the build in App Store Connect.
4. Submit for review. Address any rejections promptly by consulting the App Store Review Guidelines.

## 3. Google Play Store Submission (Android)

### Account & App Setup
1. **Google Play Console:** Access the Google Play Developer Console using the official TUC developer account.
2. **App Creation:** Create a new app and complete the Store Listing (Title, Short Description, Full Description).
3. **App Content:** Complete the App Content declarations (Privacy Policy, Data Safety, Content Rating).

### Metadata & Imagery
1. Upload phone and tablet screenshots.
2. Upload the Hi-res icon (512x512) and Feature Graphic (1024x500).

### Build Upload & Submission
1. Generate a signed Android App Bundle (AAB) in Android Studio.
2. Create a new release on the Production track (or Internal/Closed Testing tracks first).
3. Upload the AAB.
4. Roll out to production and await Google Play Review.
