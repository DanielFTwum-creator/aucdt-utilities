# AUCDT SendMail API Tester - User Guide

This guide explains how to use the AUCDT SendMail API Tester application.

## 1. Overview

The application provides a simple interface to test the `sendMail` API across three different environments: Development (DEV), Quality Assurance (QA), and User Acceptance Testing (UAT).

## 2. Using the Application

The interface is divided into three main sections: the environment selector, the email form, and the response display.

### Step 1: Select an Environment

At the top of the form, you will find the environment selector.

-   **DEV**: Select this to send requests to the development server.
-   **QA**: Select this to send requests to the quality assurance server.
-   **UAT**: Select this to send requests to the user acceptance testing server. This is the default selection.

Click on the desired environment. The selected button will be highlighted.

### Step 2: Fill in the Email Form

Complete all the fields in the form with the necessary data for your test case.

-   **Applicant ID**: The unique identifier for the applicant.
-   **Full Name**: The full name of the sender/applicant.
-   **Sender Email**: The email address the email will be sent from.
-   **Receiver Email**: The email address that will receive the email.
-   **Subject**: The subject line of the email.
-   **Message**: The body content of the email.
-   **Attachment (Optional)**: Click the "Browse" button to select a file from your computer to attach to the email. If you've selected a file, its name will be displayed. You can click the 'x' icon to remove the attachment.

All fields except for the attachment are required.

### Step 3: Send the Request

Once the form is complete, click the **"Send Email"** button at the bottom.

While the request is being processed, the button will be disabled and will show a "Sending..." status with a loading spinner.

### Step 4: Interpret the Response

After the server responds, the **API Response** section will appear below the form. This section provides detailed feedback on your request.

The response card is color-coded based on the HTTP status code:

-   **Green (Success - 2xx):** The request was successful.
-   **Blue (Redirection - 3xx):** The server responded with a redirect.
-   **Yellow (Client Error - 4xx):** There was an issue with the data you sent (e.g., bad request). Check the response body for details.
-   **Red (Server Error - 5xx):** The server encountered an error while processing your request.
-   **Red (Network/Client-Side Issue):** The application could not reach the server. Check your internet connection or for CORS issues.

The response card contains:
-   A clear title (e.g., "Success", "Error: Server Error").
-   A descriptive message.
-   The HTTP **Status Code**.
-   The full **Response Body** from the API, which can help in debugging.

This completes the process of testing the API. You can now modify the form to send another request.