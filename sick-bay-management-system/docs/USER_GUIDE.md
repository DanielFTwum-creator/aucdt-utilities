# SickBay Management System, User Guide

**Document ID:** `TUC-ICT-UG-2026-004-SICKBAY`
**Institution:** Techbridge University College (TUC), Oyibi, Greater Accra, Ghana
**Department:** ICT Division and Campus Health Services
**Audience:** Sick bay medical officers, nurses, administrative staff, student care coordinators
**Last revised:** 22 July 2026 (database-backed release)

---

## 1. What SickBay Is

SickBay is the campus clinic's record system. It handles patient triage, visit logging, observation beds, daily wellness checks, pharmacy stock, hospital referrals, facility fault reports, and clinical reporting.

**Every record you save is stored in the central SickBay database on the TUC server.** Nothing clinical is kept in your browser. This means:

- What you enter on one computer appears on every other signed-in device.
- Closing the browser, clearing its cache, or switching machines never loses data.
- Backups and restores are handled centrally by ICT, not by exporting from your browser.

The only thing remembered locally is your display theme preference.

---

## 2. Signing In

Open **https://ai-tools.techbridge.edu.gh/sickbay/** in any modern browser (Chrome, Edge, Safari, Firefox). The URL must end with the trailing slash.

1. Click **Sign in with your TUC account**.
2. Choose your **@techbridge.edu.gh** Workspace account in the Google window. Personal Gmail accounts are refused with a "Wrong Google Account" message.
3. Enter the **6-digit code** from your authenticator app (Google Authenticator, Authy, or similar) when prompted.

### First time? Setting up your authenticator

If you have never used the authenticator before, choose **First time? Set up your authenticator** on the code screen:

1. Click **Begin Setup**. A QR code appears.
2. Open your authenticator app, add an account, and scan the QR code. If you cannot scan, type in the manual key shown below the code.
3. Enter the 6-digit code the app now shows and click **Confirm & Continue**.

You will use this same app-generated code on future sign-ins.

### Sign-in problems

| Message | Meaning | What to do |
|---|---|---|
| Wrong Google Account | You picked a personal account | Retry and select your TUC Workspace account |
| Account Deactivated | Your TUC account is disabled | Contact the ICT Division (ict@techbridge.edu.gh) |
| Sign-in Failed | A temporary error occurred | Try again; contact ICT if it persists |

Sign-in is shared across the TUC staff app fleet. If you are already signed in to another TUC staff app, SickBay usually signs you in silently without asking again.

To sign out, use **Terminate Session** at the bottom of the sidebar. This signs you out of all TUC single sign-on apps.

---

## 3. The Dashboard (Overview Tab)

The dashboard opens on **Today's Summary**, a compact header that greets you by name according to the time of day and shows four live figures:

- **Visits today**, with an up or down arrow comparing today against yesterday's total.
- **Critical**, the number of items needing action now (expired medication batches, patients with abnormal vitals, unresolved facility faults). The tile turns red when it is above zero.
- **In observation**, patients currently occupying observation beds.
- **Clinic status**, showing **Operational** or **Needs attention** depending on the critical count.

Three quick actions sit beside the summary: **Log New Visit**, **Roster**, and **Daily Check**.

### KPI cards

Below the summary, four cards are ordered by urgency:

1. **Critical Alerts** (red when active), with sub-counts for expired stock, vitals warnings, and facility faults. Clicking it opens Pharmacy Stock.
2. **In Observation**, jumping to the active beds panel.
3. **Visits Today**, with the trend versus yesterday. Clicking opens the Encounters Journal.
4. **Low Stock Meds**, medications at or below their reorder threshold.

### Other dashboard panels

- **Active Observation Beds**: appears whenever a patient is under observation. Each card shows the bed, vitals, and symptoms, with a **Discharge** button (see section 5).
- **Active Medical & Stock Alerts**: three columns covering low stock, medications expiring within 30 days, and patients whose latest visit recorded a fever (37.8 °C or higher) or elevated blood pressure.
- **Daily Health Check Journal**: today's wellness screenings with search and status filters (Healthy, Needs Monitor, Refer to Sickbay).
- **Top Presenting Conditions**: the five most common conditions across logged visits.
- **Recent Visits Timeline** and **Patient Composition** (students versus staff).

---

## 4. Logging a Visit

1. Click **Log New Visit** (dashboard) or open the **Log Visit** tab.
2. Search the roster and select the patient. Allergies and chronic conditions on file are shown.
3. Record vitals: temperature (°C), blood pressure (systolic/diastolic), pulse rate (bpm).
4. Describe symptoms, tick the presenting conditions, and set the severity (Mild, Moderate, Severe).
5. Enter the treatment given and, if medication was dispensed, pick the item and quantity. The system warns you if the selected drug conflicts with a recorded allergy (for example penicillin-family drugs for a penicillin-allergic patient) and blocks dispensing from an out-of-stock line.
6. Choose the disposition:
   - **Back to Class**
   - **Sent Home**
   - **Observe in Sick Bay** (choose a bed)
   - **Referral to Hospital** (enter the hospital and reason)
7. Save.

Saving is a single, all-or-nothing operation on the server: the visit is recorded, dispensed stock is deducted from the pharmacy, and, for hospital referrals, a referral record is created automatically with status **Pending**. A **Changes Saved** toast confirms the database write.

---

## 5. Observation Beds and Discharge

Patients with disposition **Observe in Sick Bay** appear in the dashboard's **Active Observation Beds** panel until discharged.

To discharge:

1. Find the patient's bed card and click **Discharge**.
2. Add recovery or checkout notes (optional; a standard note is used if left blank).
3. Click **Save & Discharge**.

The system stamps the observation end time, appends your checkout notes to the visit record, and sets the disposition to **Back to Class**. The bed disappears from the panel.

---

## 6. Daily Health Checks

Routine wellness screenings are logged from the dashboard:

1. Click **Daily Check**.
2. Select the student from the roster list.
3. Enter the temperature (quick preset buttons for 36.5, 37.5 and 38.2 °C). A fever warning appears at 37.8 °C or higher.
4. Tick any symptoms (or leave **None / Healthy**).
5. Set the status: **Healthy**, **Needs Monitor**, or **Refer to Sickbay**.
6. Add remarks if needed and click **Save Wellness Check**.

Saved checks appear in the **Daily Health Check Journal**, which every signed-in device can see.

---

## 7. Pharmacy Stock (Admin Only)

The **Pharmacy Stock** tab tracks every medication line: category, quantity on hand, unit, reorder threshold, batch number, and expiry date.

- **Add** a new stock line with its batch number and expiry date.
- **Edit** any line to correct details or adjust quantities.
- **Restock** to add received units to the current quantity.
- **Discard expired** to zero out an expired batch.
- **Delete** a line to remove it entirely.

Stock levels fall automatically when medication is dispensed during a visit. The dashboard raises alerts when a line drops to its reorder threshold, and lists batches expiring within 30 days.

---

## 8. Hospital Referrals

The **Hospital Referrals** tab lists every referral, newest first. Referrals are created automatically when a visit's disposition is **Referral to Hospital**, and can also be added manually from this tab.

Each referral moves through the statuses **Pending**, **Transferred**, **Discharged**, and **Followed Up**. Update the status as the case progresses and record outcome notes for the file.

---

## 9. Facility Logs (Admin Only)

Report clinic equipment faults under **Facility Logs**: the equipment name, its status (**Functional**, **Needs Maintenance**, **Non-Functional**), the issue, and who reported it. When a fault is fixed, mark it resolved and record how many days the resolution took. Unresolved faults count towards the dashboard's critical alerts.

---

## 10. Reports & Sync (Admin Only)

The **Reports & Sync** tab provides:

- **Export PDF Report**: a formatted clinic audit for a chosen date range, including visit statistics, demographics, and the incident log.
- **Daily PDF export** for the day's records.
- **JSON backup export**: downloads a snapshot of the current dataset for record-keeping.
- **Audit trail**: a searchable log of every significant action (sign-ins, clinical entries, stock changes, facility reports), filterable by category (AUTH, CLINICAL, INVENTORY, FACILITY, SYSTEM). The system records who did what, and when, automatically.
- **Re-sync**: reloads the on-screen data from the central database. Use it if you suspect your view is stale.

**Restores are not done in the app.** Because all data lives in the central MariaDB database, restores are a server-side operation performed by ICT from database backups. The old in-app import is disabled.

---

## 11. Roles and Access

Your access level comes from your TUC staff account; there is no separate SickBay password.

| Access | Who | Can use |
|---|---|---|
| Standard | All authorised clinic staff | Overview, Log Visit, Encounters Journal, Roster, Hospital Referrals |
| Admin | Staff with the WMS role SYSTEM_ADMIN, HOD, ADMIN_STAFF, or MEDICAL_OFFICER | Everything, plus Pharmacy Stock, Facility Logs, Reports & Sync |

Restricted tabs show a padlock for standard users. If you need admin access, ask ICT to review your staff role.

---

## 12. Themes and Accessibility

The sidebar offers three display themes: **Light** (default), **Dark** (night shifts), and **Contrast** (high-visibility). Your choice is remembered on that device.

---

## 13. Troubleshooting

| Issue | Resolution |
|---|---|
| Page shows 404 | Make sure the address ends with the trailing slash: `.../sickbay/` |
| "Authentication required" or data will not load | Your session has expired. Reload the page and sign in again |
| "Could not save ..." error after an action | The server rejected the write. Check your connection and retry; if it persists, contact ICT |
| "A patient with this ID already exists" | The patient code is already on the roster. Search for it instead of re-adding |
| A colleague's entry is not showing | Click **Re-sync** in Reports & Sync, or reload the page |

**ICT Help Desk:** daniel.twum@techbridge.edu.gh | Extension: 104
