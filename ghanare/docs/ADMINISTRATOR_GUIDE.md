# Administrator Guide: GhanaRide Platform

**Version 1.0**

## 1. Introduction

This guide provides comprehensive instructions for administrators to configure, manage, and moderate the GhanaRide Car Rental Platform. It covers user verification, vehicle approval, dispute resolution, and monitoring system health.

It is critical that only authorized personnel have access to the administrative functions to maintain the safety, trust, and integrity of the platform for all users.

---

## 2. Accessing the Admin Dashboard

The Admin Dashboard is a secure, web-based interface where all administrative tasks are performed.

**To access the Admin Dashboard:**

1.  Click the "Admin" button in the application header.
2.  Enter the configurable admin password in the login modal. The default password is `admin`.
3.  Upon successful authentication, the Admin Panel will be displayed below the main search bar.

---

## 3. Core Administrative Functions

The Admin Panel is organized into two tabs: **Management** and **Self-Testing**.

### 3.1 Management Tab

This tab contains tools for day-to-day platform oversight.

-   **User Management**: Review users and toggle their verification status. Verified users are trusted members of the community.
    -   To verify a user, click the green "Verify" button next to their name.
    -   To revoke verification, click the red "Un-verify" button.
-   **Vehicle Management**: Review vehicles and toggle their listing status. De-listed vehicles are hidden from public search results.
    -   To de-list a vehicle (e.g., for a safety inspection), click the red "De-list" button.
    -   To make it visible again, click the green "Re-list" button.
-   **Audit Log**: A real-time log of all actions performed within the Admin Panel, providing accountability and a history of changes. The log is displayed in reverse chronological order.

### 3.2 Self-Testing Tab

This tab provides an integrated framework for running a suite of automated (simulated) end-to-end tests to quickly verify the health of critical application features.

-   **Running Tests**: Click the "Run All Tests" button to initiate the test suite. The button will be disabled while the tests are in progress.
-   **Viewing Results**: Test results appear in real-time in the results panel. Each test will show:
    -   A status icon (Running, Passed, or Failed).
    -   The name of the test (e.g., "Theme Switching").
    -   Details about the steps being performed.
    -   A simulated screenshot filename upon completion.
-   **Audit Logging**: The start and completion of a test suite run are automatically recorded in the main Audit Log for tracking.

---

## 4. Troubleshooting

**Issue: A feature seems to be broken after a recent update.**
*   **Solution**: Navigate to the "Self-Testing" tab in the Admin Panel and run the test suite. If any tests fail, the details will provide initial diagnostic information to pass on to the development team.

**Issue: User unable to complete verification.**
*   **Solution**: Check the user's profile in the "User Management" section. If their status is un-verified, you can manually verify them if you have received appropriate documentation through other channels.

**Issue: A vehicle is reported for a serious safety concern.**
*   **Solution**: Immediately de-list the vehicle using the "Vehicle Management" section. This will prevent further bookings. Contact the owner to inform them of the report and request proof of inspection or repair. Do not re-list the vehicle until the issue is confirmed to be resolved.