# Administrative Operator Guide [TUC-TAB-ADM]
### Document Reference: TUC-ICT-SRS-2026-101

**Institution:** Techbridge University College (TUC), Oyibi, Ghana  
**ICT Owner:** Daniel Twum, Head of ICT  

This guide explains how to authenticate, control, and inspect the Techbridge AI Blueprint console from an administrator role.

---

## 🔐 Administrative Access & Credentials
The admin panel is locked behind a visual login component in the web reader header.

1. **Authentication Endpoint:** Accessible directly via the **Admin Portal** link in the header.
2. **Default Credentials:**
   - **Role:** Head of ICT / Administrator
   - **Admin Passcode:** `admin123`
3. **Session Session Lifetime:** Valid until explicit logout or browser cache clearance.

---

## 🛠️ Admin Panel Controls
Once logged in, the administrative panel unlocks several interactive diagnostic planes:

### 1. Security & Audit Trails
- Displays active lists of all critical events since page launch.
- Captured event schemas: Timestamp, Activity Type, Description details, and Caller IP.
- Allows immediate clear or copy/export of audit trails.

### 2. High-Contrast & Color Themes
Toggle the primary system theme configuration:
- **Light Theme (Editorial Paper):** High line readability, soft warm yellow background (`#FDFCF9`).
- **Dark Theme (Space Charcoal):** Safe reading in dark rooms (`#121212`).
- **High-contrast Theme (Deep Canvas / Neon Yellow borders):** Styled under high visibility guidelines for visually impaired TUC students.

### 3. Service Health Sensors
Simulate system pings to essential application service bounds:
- Container Docker server performance
- MySQL/MariaDB schema tables status
- Let's Encrypt SSL/HTTPS health
- Disk write space capacity

### 4. Interactive Test Suite Run Actions
Runs a real-time terminal animation tracking of Playwright test cases (Unit, Auth, Theme, Health verification), presenting raw code execution and mock screenshot captures in PNG format.

---

## 🛡️ Administrative SOPs & Security Protocols
- **Always log out** after viewing logs or performing checks on campus workstations.
- **Do not share** credentials beyond TUC ICT managers.
- **Archive weekly logs** using the database export checklist in the Reset Guidelines.
