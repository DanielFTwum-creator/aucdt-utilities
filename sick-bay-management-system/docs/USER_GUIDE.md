# SickBay Management System — User Guide

**Document ID:** `TUC-ICT-UG-2026-004-SICKBAY`  
**Institution:** Techbridge University College (TUC), Oyibi, Greater Accra, Ghana  
**Department:** ICT Department & Campus Health Services  
**Target Audience:** Sickbay Medical Officers, Nurses, Administrative Staff, Student Care Coordinators  

---

## 1. System Overview

The **SickBay Management System (`sickbay`)** is a web-based, mobile-responsive clinical administration platform engineered for Techbridge University College. It streamlines campus patient triage, encounter logging, vitals trend tracking, pharmacy inventory control, hospital referral management, and daily facility sanitisation checks.

### Key Capabilities
- **Triage & Visit Logging:** Instant registration of student and staff clinical encounters with vital signs, presenting symptoms, treatment provided, and disposition outcome.
- **Vitals Trend Visualisation:** Real-time visual graphs mapping historical body temperature, blood pressure, and pulse rate against clinical reference ranges.
- **Inventory & Pharmacy Tracking:** Real-time monitoring of pharmaceutical stock levels, expiry dates, batch numbers, and reorder warnings.
- **Facility Sanitisation & Daily Checks:** Automated tracking of ward hygiene inspections, bed disinfection, and equipment calibration.
- **PDF Medical Summary Export:** One-click generation of formatted, printable medical encounter summaries and referral letters.

---

## 2. Accessing the System

### Production URL
Access the live platform via any modern browser (Chrome, Safari, Edge, Firefox) at:  
🔗 **[https://ai-tools.techbridge.edu.gh/sickbay/](https://ai-tools.techbridge.edu.gh/sickbay/)**

### Theme Customisation
The interface features three high-contrast display modes:
1. **Light Mode (Default):** Optimised for bright clinical environments and day shifts.
2. **Dark Mode:** High-contrast dark palette for night-shift ward monitoring.
3. **High-Contrast Mode:** Accessible high-visibility theme adhering to WCAG 2.1 AA accessibility guidelines.

*To switch themes, click the Sun / Moon / Contrast icon in the top header.*

---

## 3. Workflow & Key Features

### 3.1 Dashboard & Clinical Overview
The **Dashboard** serves as the central command screen displaying:
- **Active Enrolled Patients & Daily Encounters Count**
- **Occupied Ward Beds & Availability**
- **Pending Referrals to External Specialists**
- **Critical Inventory Low-Stock Alerts**

### 3.2 Logging a Patient Encounter
1. Click the **Log New Visit** button or navigate to the **Visits** tab.
2. Select an existing patient from the roster or enter a new Student/Staff ID.
3. Record primary vitals:
   - Body Temperature (°C)
   - Blood Pressure (Systolic/Diastolic mmHg)
   - Pulse Rate (bpm)
4. Select presenting symptoms and enter first-aid treatment administered.
5. Set outcome disposition: *Discharged to Class/Hostel*, *Admitted to Observation Bed*, or *Referred to Specialist*.
6. Click **Save Encounter**. The system automatically records the entry in the persistent audit log.

### 3.3 Patient Vitals Trend Analysis
1. Navigate to the **Patient Roster** tab.
2. Select any patient card and click **View Vitals Trend**.
3. View interactive trend graphs powered by Recharts, highlighting:
   - High Fever ($\ge 37.8^\circ\text{C}$) or Hypothermia warnings.
   - Elevated Blood Pressure ($\ge 130\text{ mmHg}$) warnings.
   - Pulse Rate anomalies (Tachycardia / Bradycardia).

### 3.4 Inventory & Stock Control
1. Select the **Inventory** tab.
2. Monitor stock quantities, reorder points, and expiry warnings.
3. To issue medications during a visit, the system automatically deducts quantities from the active batch stock.

### 3.5 Generating Medical Reports & Referrals
1. Navigate to the **Reports & Export** tab.
2. Select a date range or specific patient ID.
3. Click **Export PDF Summary**. The system generates a formatted PDF document incorporating medical officer credentials and TUC institutional header.

---

## 4. Troubleshooting & Support

| Issue | Resolution |
|---|---|
| **Page shows "404 Not Found"** | Ensure the URL ends with the trailing slash: `.../sickbay/` |
| **Offline Data Sync Warning** | The system automatically persists entries to local browser storage (`IndexedDB`) during network drops. Re-connect to sync. |
| **Password Locked Admin Mode** | Contact TUC ICT Department for administrative password resets. |

**ICT Help Desk:** `daniel.twum@techbridge.edu.gh` | Extension: 104
