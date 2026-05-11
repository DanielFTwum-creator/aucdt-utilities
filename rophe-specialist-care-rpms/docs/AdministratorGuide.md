# Rophe RPMS: Specialist Administrator Manual

## 1. Governance Objectives
The Rophe Patient Management System (RPMS) is designed for clinical precision and high-stakes patient safety. As an administrator, your primary role is ensuring the system's safety logic reflects the clinical protocols of your institution.

## 2. Authentication Protocol
- **Admin Entry:** Access the `System Admin` tab.
- **Security Key:** Use the institutionally mandated passphrase (default: `rophe2024`).
- **Session Security:** Passphrase resets are ephemeral to current browser sessions unless integrated with external IAM providers in production.

## 3. Clinical Safety Thresholds
The "Clinical Safety Limits" engine is the heart of the RPMS proactive monitoring.
- **Configurable Vitals:**
  - **Blood Pressure:** Triggers `CRITICAL` alerts for systolic/diastolic spikes.
  - **Oxygen Saturation (SpO2):** Automated detection of hypoxemic events.
  - **Pyrexia (Temperature):** Configurable thresholds for febrile monitoring.
- **Action:** Changes are global. Once applied, every active encounter monitor will immediately evaluate new inputs against these updated clinical standards.

## 4. Audit & Compliance Monitoring
Under the `Logs` tab, every action is serialized into an immutable audit stream.
- **Log Fields:** Timestamp, Provider ID, Event Type (e.g., `TELEHEALTH_ENGAGEMENT`), and specific metadata.
- **Exporting:** Logs can be exported for medical-legal review or institutional compliance audits.

## 5. System Health & Self-Testing
If the clinical AI or video services exhibit latency:
1. Navigate to the `Self-Test` tab.
2. Trigger the `Integration Suite`.
3. Check the `XHR Monitor` for 403 (Auth), 500 (Server), or Proxy errors.
4. Ensure the `API_KEY` environment variable is not expired.

---
*For technical escalation, consult the Deployment Guide.*