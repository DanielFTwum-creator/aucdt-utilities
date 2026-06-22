# APP STORE & GOOGLE PLAY SUBMISSION SOP
## Document ID: TUC-INC-2026-004
### Core Platforms: Apple iOS & Google Android OS

This manual provides detail workflows to submit the encapsulated VortexType mobile app compiled via Capacitor to public application directories.

---

## 1. Apple App Store Submission Workflow

### 1.1 Developer Portal Provisioning
1. Register/Log in to the **Apple Developer Portal** (`developer.apple.com`) with a corporate TUC Apple ID (Enrollment under 'Educational Institution' recommended to waive fees).
2. Direct to **Certificates, Identifiers & Profiles**:
   - Create an App ID matching: `com.techbridge.typingtutor`
   - Enable services: *In-App Purchases* (No), *Associated Domains* (Optional).
3. Generate a **Distribution Certificate** (`Apple Distribution`) using Xcode's automatic system or by signing a Certificate Signing Request (CSR) from Keychain Access.
4. Create an **App Store Provisioning Profile** linking the Distribution Certificate and the App ID together.

### 1.2 App Store Connect Configuration
1. Enter **App Store Connect** (`appstoreconnect.apple.com`).
2. Select **My Apps** -> click **"+"** -> select **New App**:
   - **Name:** VortexType
   - **Primary Language:** English (UK)
   - **Bundle ID:** `com.techbridge.typingtutor`
   - **SKU:** `TUC-TT-2026-SKU`
3. Prepare the storefront metadata:
   - **Subtitle:** Learn Keyboard and Typing Skills
   - **Promotional Text:** Perfect your typing alignment, speed, and accuracy with educational tests.
   - **Description:** Professional multi-level typing training platform customized for students of Techbridge University College, Ghana.
   - **Support URL:** `https://tuc.edu.gh/typing-support`
   - **Privacy Policy URL:** `https://tuc.edu.gh/privacy.html`

### 1.3 Uploading Builds (Xcode Wrapper)
1. Open the project inside Xcode on a macOS workstation:
   ```bash
   npx cap open ios
   ```
2. Select **Any iOS Device (arm64)** as the run target.
3. Click **Product** -> **Archive**.
4. Once completed, click **Distribute App** inside the Organizer window:
   - Method: **App Store Connect**
   - Options: Match Provisioning Profile, Strip Swift Symbols
5. Authenticate and submit. Review and publish inside App Store Connect after processing.

---

## 2. Google Play Store Submission Workflow

### 2.1 Google Play Console Setup
1. Log in to the **Google Play Console** (`play.google.com/console`).
2. Select **Create App**:
   - **App Name:** VortexType
   - **Default Language:** English (UK)
   - **App Category:** Educational Game
   - **Free or Paid:** Free

### 2.2 Store Performance & Marketing Materials
1. Upload graphic assets matching standard Android requirements:
   - **App Icon:** 512px x 512px, 32-bit PNG (with alpha channels).
   - **Feature Graphic:** 1024px x 500px JPG or 24-bit PNG.
   - **Phone Screenshots:** At least two screenshots, minimum 320px, 16:9 ratio.
   - **Tablet Screenshots:** 7-inch and 10-inch aspect ratios (at least 2 each).

### 2.3 Uploading Assembly Packages (AAB)
1. Inside Android Studio, compile a Release Android App Bundle:
   ```bash
   npx cap open android
   ```
2. Choose **Build** -> **Generate Signed Bundle / APK...** -> **Android App Bundle**:
   - Create or choose an existing Keystore file (`techbridge.jks`).
   - Define passwords, alias names (`typingtutor`), and store them securely.
3. The bundle is compiled in `/android/app/release/app-release.aab`.
4. Upload `app-release.aab` directly to the **Production Track** or **Internal Testing Track** inside Play Console.
5. Fill out the Play Store privacy declaration, content ratings, and GDPR questionnaire.
6. Click **Save** -> **Review Release** and rollout to Production.
