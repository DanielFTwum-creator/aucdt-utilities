# App Store & Google Play Deployment SOP [TUC-TAB-APPSTORE]
### Document Reference: TUC-ICT-SRS-2026-601

**Institution:** Techbridge University College (TUC), Oyibi, Ghana  
**Author:** Senior Mobile Deployment Engineer  
**Approved by:** Daniel Twum, Head of ICT  

This document outlines the standard operating procedures (SOP) for compiling, provisioning, and uploading the Techbridge AI Blueprint application to the Apple App Store and Google Play Store using Capacitor wrappers.

---

## 🍎 1. Apple App Store Submission Guide
### 1.1 Account & Identifier Registration
1. **Enroll in Apple Developer Program:** Register on behalf of Techbridge University College (`developer.apple.com`).
2. **Register App ID:** Under Certs, IDs & Profiles, add explicit bundle: `com.techbridge.tab`.
3. **Configure Capabilities:** Check push notifications, local database connectivity, and camera (if needed for AR scans).
4. **Acquire App Store Connect access:** Enter (`appstoreconnect.apple.com`) with management privileges.

### 1.2 Metadata & App Store Record Generation
1. Click **My Apps** > **Create New App** (+)
   - **Platforms:** iOS
   - **Name:** Techbridge AI Blueprint
   - **Primary Language:** UK English
   - **Bundle ID:** `com.techbridge.tab`
   - **SKU:** `TUC-TAB-2026-IOS`
2. **Metadata Specifications:**
   - **Full Description:** High-quality institutional publication and diagnostic tool outlining autonomous systems architecture and metabolic prompt models for Techbridge University College (TUC).
   - **Screenshots:** Attach three 6.7" (iPhone 15 Pro Max layout) and three 6.5" screenshots. Capture page layouts representing standard reader view and system telemetry consoles.
   - **Privacy Policy URL:** Public link hosting terms (`https://blueprint.techbridge.edu.gh/privacy.html`).

### 1.3 Build Upload & Provisioning via Xcode
1. In native iOS directory (`/ios/App/App.xcworkspace`), select **Product** > **Archive**.
2. Select **Distribute App** > **App Store Connect** > **Upload**.
3. Choose Cloud Managed Certificates for Techbridge University College organization.
4. Open App Store Connect, go to draft section, select uploaded build, and proceed to click **Submit for Review**.

---

## 🤖 2. Google Play Store Submission Guide
### 2.1 Developer Console Onboarding
1. **Access Google Play Console:** Enter with TUC organizational profile (`play.google.com/apps/publish`).
2. **Create Application:**
   - **App Name:** Techbridge AI Blueprint
   - **Default Language:** English (United Kingdom) - en-GB
   - **App/Game:** App
   - **Paid/Free:** Free
3. **Confirm declarations:** Accept Developer Program Policies and US export regulations.

### 2.2 Store Listing Setup
1. **Short description:** Institutional software delegation log and diagnostic engine for Techbridge University College.
2. **Graphical Assets:**
   - **App Icon:** High-resolution 512x512 PNG, translucent alphachannels omitted.
   - **Feature Graphic:** 1024x500 PNG representing college branding.
   - **Phone Screenshots:** At least 4 screenshots, 16:9 vertical ratio, showcasing accessibility configurations.
3. **Data Safety Declarations:**
   - App gathers no user location.
   - Audit logging parameters are completely local to the user's browser / terminal device context.

### 2.3 Compilation & Release Management
1. Inside Android Studio, compile a Release Bundle (`Product` > `Generate Signed Bundle / APK`).
2. Generate a secure Keystore file (`techbridge-release-key.jks`) using active TUC certificate authorities.
3. Select **Release** > **AAB App Bundle**.
4. Upload `.aab` output to Google Play Console under **Production Track**.
5. Save draft, review release warnings, and select **Start Rollout to Production**.
