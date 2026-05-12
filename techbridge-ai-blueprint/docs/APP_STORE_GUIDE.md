# App Store Submission Guide
## Techbridge AI Blueprint [TAB]

This guide provides the Standard Operating Procedure (SOP) for submitting the Techbridge AI Blueprint application to the iOS App Store and Google Play Store.

### 1. Account Preparation
- **Apple Developer Program**: Ensure the TUC organizational account is active.
- **Google Play Console**: Ensure the TUC developer account is configured.

### 2. Metadata Requirements
- **App Name**: Techbridge AI Blueprint
- **Category**: Productivity / Business
- **Privacy Policy**: https://[YOUR_DOMAIN]/privacy.html (GDPR & GDPA compliant)
- **Support URL**: https://techbridge.edu.gh/ict-support

### 3. Build & Upload Process
#### iOS (App Store Connect)
1. Run `npm run build:ios`.
2. Open Xcode: `npm run ios:open`.
3. Select 'Any iOS Device (arm64)' as the build destination.
4. Go to `Product > Archive`.
5. Once the archive is complete, click 'Distribute App' and follow the prompts for App Store Connect.

#### Android (Google Play)
1. Run `npm run build:android`.
2. Open Android Studio: `npm run android:open`.
3. Go to `Build > Generate Signed Bundle / APK`.
4. Select 'Android App Bundle' and follow the wizard to create a signed `.aab` file.
5. Upload the `.aab` to the 'Internal Testing' or 'Production' track in the Google Play Console.

### 4. Review Submission
- Provide a demo account (test user) for the reviewers.
- Note the use of Google Sign-in for authentication.
- Attach the TUC security certification if requested.

---
*Created by: TUC ICT Department*
