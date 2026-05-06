# Pama Realtor - Administrator Guide

**Version:** 1.0  
**Date:** October 26, 2023

---

## 1. Accessing the Admin Console

### 1.1 Login
To access the administrative dashboard:
1. Scroll to the footer of the application.
2. Click the **Admin** link (indicated by a lock icon).
3. Alternatively, append a query parameter or navigate internally if a router was configured (currently modal based).
4. Enter the secure password: `pama123`.

### 1.2 Dashboard Overview
Once logged in, you will see the **Admin Console**. The top navigation bar allows switching between:
- **Properties:** Manage listings.
- **Audit Logs:** View system activity.
- **Logout:** Securely end the session.

---

## 2. Managing Properties

### 2.1 Adding a New Property
1. Navigate to the **Properties** tab.
2. Click the blue **+ Add Property** button.
3. Fill in the required fields:
   - **Title:** e.g., "Luxury 4-Bedroom Villa".
   - **Price:** Value in Ghana Cedis (Gh₵).
   - **Location:** e.g., "East Legon, Accra".
   - **Type:** Select "For Rent" or "For Sale".
   - **Description:** Detailed text about the property.
4. Click **Create Listing**. The property will immediately appear in the grid and on the public homepage.

### 2.2 Deleting a Property
1. Locate the property in the grid (use the Search bar to filter).
2. Hover over the property card.
3. Click the red **Trash Icon** in the top right corner.
4. The item is permanently removed from the active session list.

---

## 3. Monitoring System Activity

### 3.1 Audit Logs
The **Audit Logs** tab provides a real-time table of critical actions performed within the application.
- **Timestamp:** Exact time of event.
- **User:** Who performed the action (Admin, Guest, or System).
- **Action:** Category (e.g., "Login", "Property Delete", "Checkout").
- **Details:** Specifics of the event.

Use this log to track sales inquiries and administrative changes.

---

## 4. Security Notes
- The current implementation is **Client-Side Only**.
- Refreshing the browser will **RESET** all data (properties, logs) to their default initial state.
- For production persistence, a backend database (Firebase/Supabase) integration is required in a future phase.
