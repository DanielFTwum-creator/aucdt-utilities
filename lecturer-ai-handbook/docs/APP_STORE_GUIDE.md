# LECTURER AI — APP STORE SUBMISSION PROCEDURES (SOP)
## DOCUMENT REF: TUC-APP-SUBMIT-2026
### SCOPE: iOS App Store & Google Play Store Publishing

---

## 1. PRE-REQUISITES & ACCOUNT SETUPS
Before launching the mobile app submission process, ensure the **TUC ICT Directorate** has provisioned the necessary corporate developer accounts:

### Apple Developer Enterprise Account
*   **Access Portal**: [Apple Developer Center](https://developer.apple.com)
*   **Account Type**: Organization Account (requires D-U-N-S Number for TUC)
*   **Primary Contact**: Daniel Twum, Head of ICT

### Google Play Console Account
*   **Access Portal**: [Google Play Console](https://play.google.com/console)
*   **Account Type**: Organization Account
*   **Primary Contact**: Daniel Twum, Head of ICT

---

## 2. APPLE APP STORE SUBMISSION WORKFLOW

### Step 1: Create App Identifier & Certificates
1.  Navigate to **Certificates, Identifiers & Profiles** in Apple Developer.
2.  Add a new App ID: `com.techbridge.lecturerai`.
3.  Configure Capabilities: Enable **Push Notifications** (optional) and **In-App WebView Capabilities**.
4.  Generate an **App Store Distribution Certificate** using a Certificate Signing Request (CSR) from your Mac.

### Step 2: Establish the App Store Connect Record
1.  Sign into [App Store Connect](https://appstoreconnect.apple.com).
2.  Click **My Apps** -> **+** -> **New App**.
3.  Select Platform: **iOS**.
4.  Enter App Name: `LecturerAI`.
5.  Set Primary Language: **English (UK)**.
6.  Set Bundle ID: `com.techbridge.lecturerai`.
7.  Define SKU (e.g. `TUC-LAI-2026`).

### Step 3: Populate App Metadata
*   **Subtitle**: Academic Companion & Workbook.
*   **Promotional Text**: Elegant lesson frameworks and syllabus prompts for TUC instructors.
*   **Description**: Official AI-powered training workbook and prompt library for Techbridge University College lecturers in Oyibi, Ghana.
*   **Keywords**: Techbridge, TUC, Lecturer, AI, Syllabus, GTEC, Lesson Planner.
*   **Support URL**: `https://techbridge.edu.gh/lecturer-ai/support`
*   **Privacy Policy URL**: `https://techbridge.edu.gh/lecturer-ai/privacy.html`

### Step 4: Upload App Screenshots
Upload high-resolution screenshots captured via Xcode Simulator:
*   **6.5-inch iPhone Display** (e.g., iPhone 15 Pro Max): 1242 x 2688 pixels
*   **5.5-inch iPhone Display** (e.g., iPhone 8 Plus): 1242 x 2208 pixels

### Step 5: Build Upload via Xcode
1.  Compile the iOS app bundle via standard Xcode (see `MOBILE_BUILD_GUIDE.md`).
2.  Select **Product** -> **Archive**.
3.  Click **Distribute App** -> **App Store Connect** -> **Upload**.
4.  Once compiled, select the build inside App Store Connect.

### Step 6: Trigger App Store Review
1.  Complete the **App Rating Questionnaire** (G-rated/All Ages).
2.  Provide Administrative Demo Access:
    *   **Demo Username**: `tuc_demo`
    *   **Demo Password**: `tuc-ict-admin-2026` (with login walkthrough notes)
3.  Click **Submit for Review**. Standard reviews complete in 24–48 hours.

---

## 3. GOOGLE PLAY STORE SUBMISSION WORKFLOW

### Step 1: Create the App Console Record
1.  Navigate to the Google Play Console.
2.  Click **Create App** and specify:
    *   **App Name**: `LecturerAI`
    *   **Default Language**: English (United Kingdom)
    *   **App or Game**: App
    *   **Free or Paid**: Free
3.  Confirm compliance with developer terms and click **Create**.

### Step 2: Set up Store Presence Metadata
Complete the **Main Store Listing**:
*   **Short Description**: Official TUC Lecturer AI Companion.
*   **Full Description**: LecturerAI is the premier lesson structuring companion and training workbook designed specifically for the faculty of Techbridge University College (TUC) in Oyibi, Ghana. It streamlines syllabus design, handout PDF exports, and academic compliance.
*   **App Icon**: 512 x 512 pixels (32-bit PNG, max 1MB).
*   **Feature Graphic**: 1024 x 500 pixels (JPG/PNG).
*   **Screenshots**: Minimum of 2, up to 8 (aspect ratios 16:9 or 9:16).

### Step 3: Complete App Content Questionnaires
Ensure all mandatory console forms are completed:
*   **Privacy Policy Link**: `https://techbridge.edu.gh/lecturer-ai/privacy.html`
*   **Target Audience**: 18 and older (educational faculty focus).
*   **News App/COVID-19 Declarations**: Declare "No".
*   **Content Rating**: Enter the rating wizard and classify as **Educational/Utility**.

### Step 4: Build Upload & Internal Testing Release
1.  Navigate to **Production** -> **Create New Release**.
2.  Ensure **Google Play App Signing** is active.
3.  Drag and drop your signed production Android App Bundle (`app-release.aab`).
4.  Specify Release Notes (e.g., `Initial stable 1.0.0 build for TUC faculty`).
5.  Click **Save** -> **Review Release** -> **Start Rollout to Production**.
