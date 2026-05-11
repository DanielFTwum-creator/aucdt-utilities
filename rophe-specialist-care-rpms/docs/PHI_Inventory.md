# HIPAA PHI Inventory & Data Map
**Date:** May 2024
**Status:** Phase 1 Baseline

## 1. Protected Health Information (PHI) Definition
Under HIPAA, PHI is any information about health status, provision of health care, or payment for health care that can be linked to a specific individual.

## 2. Data Element Inventory
The following fields used in the `Patient` and `Appointment` interfaces are classified as PHI.

| Data Element | Type | Sensitivity | Classification |
| :--- | :--- | :--- | :--- |
| `firstName` / `lastName` | String | High | Direct Identifier |
| `dob` (Date of Birth) | Date | High | Direct Identifier |
| `phone` | String | High | Direct Identifier |
| `email` | String | High | Direct Identifier |
| `address` | String | Medium | Direct Identifier |
| `insuranceId` | String | High | Direct Identifier |
| `medicalHistory` | Array | Critical | Health Data |
| `allergies` | Array | Critical | Health Data |
| `PatientRecording` (Video) | Blob/URL | Critical | Biometric/Health Data |
| `notes` (Clinical Notes) | String | Critical | Health Data |
| `vitals` (BP, Temp, SpO2) | Object | Critical | Health Data |

## 3. Data Storage Map

### A. Client-Side Memory (RAM)
*   **Status:** Active
*   **Description:** React State (`useState`, `useRef`).
*   **Risk:** Data is lost on page refresh (Volatile).
*   **Mitigation:** Access requires authentication. Browser tab isolation.

### B. Local Storage (Browser)
*   **Status:** Active
*   **Key:** `rophe_user`
*   **Content:** Session token, User Role, User Name.
*   **Compliance:** strictly excludes Patient PHI. Only contains Provider identity.

### C. External Processing (AI)
*   **Service:** Google Gemini API
*   **Content:** Clinical notes, Vitals, De-identified symptom strings.
*   **Compliance:** 
    *   Data is sent via TLS 1.3.
    *   Processing is stateless (Zero Data Retention by model).
    *   Request frames comply with "Minimum Necessary" standard.

### D. File System (Telehealth)
*   **Content:** `.webm` Video Recordings.
*   **Location:** Browser Blob Store (Temporary).
*   **Egress:** User manually downloads to local encrypted disk. The App does not retain blobs after session closure.

## 4. Access Matrix

| Role | Read Access | Write Access | Admin Functions |
| :--- | :--- | :--- | :--- |
| **Administrator** | All Records | System Config Only | Logs, Thresholds, Security Keys |
| **Doctor** | All Records | Clinical Notes, Rx | Telehealth |
| **Nurse** | All Records | Vitals, Triage | None |
| **Receptionist** | Demographics | Appointments | None |

---
*End of Inventory*