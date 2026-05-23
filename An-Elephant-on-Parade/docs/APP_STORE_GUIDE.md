# iOS App Store & Google Play Submission SOP
## Document Ref: TUC-MBL-SOP-2026-001
### Project: Techbridge AI Blueprint [TAB] — Mobile Systems Division
### Organisation: Techbridge University College (TUC), Oyibi, Ghana
### Lead: Daniel Twum, Head of ICT

---

## 1. Google Play Console Submission Workflow

This SOP establishes the mandatory step-by-step procedure for deploying the TAB Android application onto the Google Play Store on behalf of TUC.

### 1.1 Pre-Requisites & Account Setup
- Must possess active **TUC Google Play Developer Credentials**.
- Verified organization Dun & Bradstreet D-U-N-S number.
- Standard compliance with the Google Play Developer Program Policies and Ghana Data Protection regulations.

### 1.2 Creating the App Record
1. Open the [Google Play Console](https://play.google.com/console).
2. Click **Create app** (top right).
3. Specify:
   - **App name**: Techbridge AI Blueprint
   - **Default language**: English (United Kingdom) - `en-GB`
   - **App or Game**: App
   - **Free or Paid**: Free
4. Accept Developer Program Declarations, US Export Laws, and click **Create app**.

### 1.3 Listing Metadata & Store Presence
Complete the "Set up your app" core checklist under Dashboard:
- **Privacy Policy**: Link to the public URL: `https://tab.techbridge.edu.gh/privacy.html`
- **App Access**: Choose "All functionality is available without special access".
- **Target Audience**: Parents & Educators (Recommended age: 13+ or Families Program).
- **News app**: Choose "No".
- **Government app**: Choose "No" (or Yes if officially registered by Ministry).
- **Financial Features**: Choose "None".
- **Content Rating**: Complete the self-assessment questionnaire.
- **Store Listing Details**:
  - **Short Description**: "Interactive djembe drum trainer, guides, and companion storytelling app."
  - **Full Description**: "The official academic digital companion to Steve Ferraris' Drumming for Success and An Elephant on Parade curriculum. Developed in coordination with Techbridge University College, Oyibi, Ghana, this application dynamically synthesises rich West African drumming structures in real-time, providing educators and students with accessible rhythmic training tools."
  - **Phone + Tablet Graphics**:
    - Upload high-resolution Launcher Icon (512x512 PNG, 32-bit, alpha allowed).
    - Feature Graphic (1024x500 JPG/PNG).
    - Minimum of 4 dynamic application screenshots showing the story player, sandbox, and active drum-trigger panels.

### 1.4 Uploading and Releasing the Build (AAB)
1. In the left navigation menu, go to **Release -> Production**.
2. Click **Create new release**.
3. Choose Google Play App Signing (Recommended: let Google manage key).
4. Drag and drop the release Android App Bundle (AAB):
   `android/app/build/outputs/bundle/release/app-release.aab`
5. Input the Release Name (e.g. `1.0.0 (1)`) and Release Notes.
6. Click **Save as draft**, then **Review release**.
7. Click **Start roll-out to Production** (select countries: Ghana and Global).

---

## 2. Apple App Store Connect Submission Workflow

This SOP establishes the mandatory step-by-step procedure for building and submitting the TAB iOS application.

### 2.1 Apple Developer Account & Certificate Orchestration
- Active TUC Apple Developer membership ($99/year).
- macOS node equipped with Xcode 15+ and an Apple Distribution Certificate.
- Establish an **App ID** on Apple Developer Portal with standard capabilities.

### 2.2 App Record Creation in App Store Connect
1. Navigate to [App Store Connect](https://appstoreconnect.apple.com).
2. Go to **Apps**, then click the **`+`** symbol -> **New App**.
3. Fill in:
   - **Platform**: iOS
   - **Name**: Techbridge AI Blueprint
   - **Primary Language**: English
   - **Bundle ID**: `com.techbridge.tab`
   - **SKU**: `TUC-TAB-2026-IOS`
   - **User Access**: Full Access
4. Click **Create**.

### 2.3 Store Listing details & Metadata
1. **App Information**: Enter the Subtitle, Category (Education, Music), and Content Rights flags.
2. **Pricing and Availability**: Set to **Free**, available globally.
3. **App Privacy Module**:
   - Provide the Privacy Link: `https://tab.techbridge.edu.gh/privacy.html`
   - Standard data practices: self-disclose that diagnostic logs are stored purely in client-side LocalStorage sandboxes and never transmitted to external cloud systems.
4. **Prepare for Submission Screen**:
   - Upload screenshots for 6.5-inch displaying models and 5.5-inch displaying models.
   - **Promotional Text / Description**: Details explaining the djembe curriculum.
   - **Keywords**: "djembe, drum trainer, education, storytelling, rhythm, ghana, student"
   - **Support URL**: `https://tab.techbridge.edu.gh/support`

### 2.4 Xcode Production Archive & Upload
1. In Xcode, select **Any iOS Device (arm64)** as the run destination.
2. Navigate to menu: **Product -> Archive**.
3. After compilation, the Xcode Organizer window will pop up.
4. Click **Distribute App -> App Store Connect -> Upload**.
5. Choose automatic signing credentials. Xcode compiles, validates against store policies, and directly uploads the build.

### 2.5 final Store Review Trigger
1. Return to App Store Connect -> **Prepare for Submission**.
2. Scroll to **Build** section, click the `+` button and assign the uploaded build.
3. Complete App Review Information:
   - **Demo Account**: Give a mock testing device passcode (e.g., `TUC-ICT-2026`) with explicit credentials to easily bypass the passcode gate.
   - **Contact Info**: Daniel Twum, Head of ICT, Techbridge University College.
4. Click **Save**, then click **Submit for Review** at the top.
