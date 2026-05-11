# myVBCI Camper App - Administrator Guide

**Version: 1.0**

---

## 1. Introduction

This guide provides a comprehensive overview of the administrative features of the myVBCI Camper App. It is intended for users with the 'Admin' role and covers all aspects of managing the camp system, from monitoring the dashboard to sending notifications.

## 2. Getting Started: Logging In

1.  Navigate to the application's main page.
2.  The authentication screen will be displayed.
3.  For quick access to the admin panel, click the **"Admin Demo"** button. This will pre-fill the form with administrator credentials.
4.  Click **"Sign In"**. You will be redirected to the Admin Dashboard.

## 3. The Dashboard

The Dashboard is your central hub for monitoring the camp's key performance indicators.

-   **Stats Grid:** At a glance, you can see:
    -   **Total Revenue:** The sum of all completed payments.
    -   **Total Campers:** The total number of confirmed registrations.
    -   **Active Camps:** The number of camp events currently configured in the system.
    -   **Room Occupancy:** The percentage of rooms that are marked as 'Full'.
-   **Revenue by Camp Chart:** A bar chart that breaks down revenue sources by each camp event.
-   **Room Availability Chart:** A pie chart showing the proportion of available rooms versus full rooms across all camps.

## 4. Managing Camps

This section allows you to create, view, and remove camp events.

### 4.1 Creating a New Camp
1.  Navigate to the **"Manage Camps"** page from the sidebar.
2.  Click the **"+ Add Camp"** button.
3.  A form will appear. Fill in the required details:
    -   **Camp Name:** The official name of the event.
    -   **Description:** A brief overview of the camp.
    -   **Start & End Dates:** The duration of the camp.
    -   **Price:** The registration fee per camper.
    -   **Capacity:** The total number of campers the event can accommodate.
4.  Click **"Create Camp"**. The new camp will appear in the list.

### 4.2 Deleting a Camp
1.  On the **"Manage Camps"** page, find the camp you wish to remove.
2.  Click the **trash can icon** on the right side of the camp's card.
3.  A confirmation prompt will appear. Confirm the action to permanently delete the camp and all associated data.

## 5. Room Allocation

Here, you can manage accommodations for each camp.

### 5.1 Viewing and Filtering Rooms
1.  Navigate to the **"Room Allocation"** page.
2.  Use the dropdown menus at the top to filter the view:
    -   **Sort by:** Order rooms by name, capacity, or occupancy.
    -   **Filter by Type:** Show only specific room types (e.g., Cabin, Tent).
    -   **Filter by Status:** Show only 'Available' or 'Full' rooms.
    -   **Filter by Camp:** Select the camp event for which you want to manage rooms.

### 5.2 Adding a New Room
1.  First, select the desired camp from the **"Camp"** filter dropdown.
2.  Click the **"+ Add Room"** button.
3.  In the modal that appears, provide the room details:
    -   **Room Name:** A unique identifier (e.g., "Cabin Alpha").
    -   **Type:** The kind of accommodation.
    -   **Capacity:** The maximum number of campers.
    -   **Gender Restriction:** Set to Male, Female, or Mixed.
    -   **Amenities:** A brief list of features (e.g., "Bunk beds, AC").
4.  Click **"Create Room"**.

### 5.3 Editing or Deleting a Room
1.  Hover over the card of the room you wish to modify.
2.  Action icons will appear in the top-right corner.
    -   Click the **pencil icon** to edit the room's details in a modal.
    -   Click the **trash can icon** to delete the room after a confirmation prompt.

## 6. Sending Notifications

Communicate with users by sending targeted alerts.

1.  Navigate to the **"Notifications"** page.
2.  On the left, use the **"Create Alert"** form:
    -   **Title:** A short, descriptive title for the notification.
    -   **Type:** Choose from Info, Warning, Success, or Urgent. This affects the alert's visual style.
    -   **Target Audience:** Select whether the alert should go to all users, just campers, or just admins.
    -   **Message:** The full text of your announcement.
3.  Click **"Post Notification"**. The alert will be sent and will appear in the "Active Notifications" list.

## 7. System Testing

The **"Testing"** page contains a Playwright-based self-test suite. This allows you to run automated checks on critical user journeys to ensure the application is functioning correctly. Refer to the *Testing Guide* for more details.
