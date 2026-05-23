# Project Reset & Critical Disaster Recovery Checklist
## Document Ref: TUC-RST-2026-001
### Organisation: Techbridge University College (TUC), Oyibi, Ghana
### Owner: Daniel Twum, Head of ICT

---

## Purpose
This document provides system administrators with the definitive SOP for restoring the Techbridge AI Blueprint (TAB) companion software back to pristine default operational states following runtime, cache, or storage corruptions.

---

## Phase A: Client-Side Reset & Cache Purge
Use the following sequence when an end-user device encounters browser freezes, visual errors, or faulty theme combinations.

- [ ] **1. Force Hard Browser Reload**
  - **Windows / Chrome / Firefox**: Press `Ctrl + F5` or `Ctrl + Shift + R`.
  - **macOS / Safari / Chrome**: Press `Cmd + Shift + R` or hold `Shift` and click the browser's Reload icon.
  - **iOS / Safari Mobile**: Go to Settings -> Safari -> Advanced -> Website Data -> Clear all history and website data.
  - **Android / Chrome Mobile**: Settings -> Privacy and security -> Clear browsing data (select Cached images and files).

- [ ] **2. Flush Web LocalStorage State**
  - Open Developer Console (`F12` or `Cmd + Option + I`).
  - Navigate to the **Application** (Chrome/Safari) or **Storage** (Firefox) tab.
  - Choose **Local Storage** under the web origin (e.g., `https://tab.techbridge.edu.gh`).
  - To wipe settings, execute in the console:
    ```javascript
    localStorage.clear();
    console.log("LocalStorage fully cleared.");
    ```
  - This resets theme preference to Standard Light, wipes all simulated audit logs, and resets passcode configurations.

- [ ] **3. Restart Web Audio Context Thread**
  - If sounds fail to trigger despite volume levels, reset the audio subsystem.
  - Call `audioContext.close()` in JavaScript, reset the reference to null, and re-trigger initialization via a user tap listener on the application screen.

---

## Phase B: Infrastructure-Side Docker & Plesk Reset
Use the following sequence for site-wide server-side issues (e.g., container crash, service port conflicts, proxy failure).

- [ ] **1. Stop Running App Shell Container**
  - Locate the container ID using standard Docker management listings:
    ```bash
    docker ps | grep techbridge-tab
    ```
  - Stop the process cleanly:
    ```bash
    docker stop techbridge-tab-container-id
    ```

- [ ] **2. Rebuild the Production Web Shell Bundle**
  - Run the build sequence to compile optimized static assets:
    ```bash
    npm run clean
    npm install
    npm run build
    ```
  - Verify that static deliverables are successfully stored inside the `/dist` directory.

- [ ] **3. Redeploy and Start Container**
  - Launch the fresh Docker volume cleanly bound to Port 3000:
    ```bash
    docker build -t techbridge/tab:latest .
    docker run -d --name techbridge-tab -p 3000:3000 --restart unless-stopped techbridge/tab:latest
    ```

- [ ] **4. Validate Nginx Dynamic Port Configurations**
  - Execute a configuration dry-run on proxy routers:
    ```bash
    nginx -t
    ```
  - Reload proxy systems to enforce strict HTTP routes:
    ```bash
    systemctl reload nginx
    ```

---

## Phase C: High-Fidelity App Store and Capacitor Package Reset
Use when a mobile installer fails to initialize or sync.

- [ ] **1. Clean Capacitor Assets Directories**
  ```bash
  npx cap clean
  rm -rf android/app/build iOS/App/build
  ```

- [ ] **2. Re-Sync Web-to-Native Directory Bindings**
  ```bash
  npm run build
  npx cap sync
  ```

- [ ] **3. Re-run Native Development Framework Builds**
  - **Android Studio**: Select `Build -> Clean Project`, followed by `Build -> Rebuild Project`.
  - **Xcode**: Press `Cmd + Shift + K` to clean the product folder, then rebuild the emulator targets.

---

## Critical Disaster Verification Matrix
Following any complete reset, administrators must confirm:
1. **Access control**: Admin area passcode returns to `TUC-ICT-2026`.
2. **Persistence**: Audit tracking initializes cleanly and logs the restart as `TUC-INC-2026-001`.
3. **Accessibility**: High-contrast states operate with absolute alignment.
