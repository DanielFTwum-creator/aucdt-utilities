
# Techbridge TSAP - User Guide

**Version 2.0**

---

## 1. Introduction

Welcome to the **Techbridge Salary Administration Portal (TSAP)**.

This guide is your comprehensive resource for using the portal's features. It provides detailed, step-by-step instructions for the complete salary calculation workflow, including handling special cases with overrides, reviewing past calculations, and customizing your user experience.

While the [OnboardingGuide.md](./OnboardingGuide.md) provides a quick start, this document serves as the detailed manual for day-to-day operations.

---

## 2. The Main Dashboard

After logging in, you are greeted by the main dashboard. The interface is designed for an efficient, linear workflow.

-   **Left Side**: Contains the input forms for the salary calculation process, organized into logical steps.
-   **Right Side**: Features the **Payslip Summary**, which updates in real-time as you enter data, giving you immediate feedback on the calculation.

---

## 3. Core Workflow: Calculating Net Salary

This section details the primary function of TSAP: calculating a new recruit's net take-home pay.

### Step 1: Estimate Consolidated Allowance (Optional)

This is a helper tool designed to give you a quick estimate of a monthly allowance before you begin the formal calculation. It does not affect the final calculation in Step 2.

1.  **Choose Estimation Method**:
    -   **By Grade/Step (Most Accurate)**: Select a specific grade from the dropdown to see its exact allowance.
    -   **By Status**: Select a job title (e.g., "Lecturer"). If multiple grades share this title, it will show you the range of possible allowances.
    -   **By Annual Salary (Closest Match)**: Enter an annual salary, and the tool will find the grade with the closest salary and show its allowance.

2.  **Click "Estimate Allowance"**: The result will appear below, providing you with a useful reference point.

### Step 2: Calculate Net Salary (The Main Calculator)

This is the primary form for generating an official salary calculation.

1.  **Enter Recruit Name**: Fill in the full name of the new recruit. This is crucial as it's used to identify the calculation in the History and Audit Logs.

2.  **Select Grade/Step**: Choose the recruit's official designation from the dropdown menu.
    *   **Automatic Population**: Once you select a Grade/Step, the **Annual Basic Salary (₵)**, **Monthly Consolidated Allowance (₵)**, and **SSNIT Exempt** fields will automatically fill with the standard values for that role.

3.  **Apply Deductions**:
    *   **SSNIT Exempt**: This toggle is set automatically based on the Grade/Step. You can override it if necessary (see section on overrides below).
    *   **Apply Student Loan Deduction**: Enable this toggle if the recruit is subject to a student loan deduction as defined for their Grade/Step. The "Payslip Summary" will immediately update to reflect this.

### Handling Overrides: Special Cases

TSAP allows you to manually override the standard values for exceptional cases. **All overrides are flagged and detailed in the audit log.**

-   **To Override Annual Salary**: Click into the "Annual Basic Salary (₵)" field and type the new, non-standard amount.
-   **To Override Monthly Allowance**: Click into the "Monthly Consolidated Allowance (₵)" field and type the new amount.
-   **To Override SSNIT Status**: Click the "SSNIT Exempt" toggle to change it from the default.

When an override is active:
-   The input field will be highlighted with a colored border.
-   A warning message will appear directly below the field, confirming that the change is being flagged.
-   To revert to the standard values, click the **"Clear All Overrides"** button.

### Understanding the Payslip Summary

This card provides a complete, real-time financial breakdown. You can switch between a **Monthly** and **Annual** view using the toggle buttons at the top of the card.

-   **Earnings**: Shows the breakdown of the basic salary and the consolidated allowance, summing up to the **Gross Salary**.
-   **Deductions**: Lists all applicable deductions, such as SSNIT, PAYE (Income Tax), and Student Loan, and shows the **Total Deductions**.
-   **Net Take-Home**: The final, prominently displayed figure representing the recruit's actual pay after all deductions.

---

## 4. Reviewing Past Calculations

Every calculation is saved for future reference and auditing.

1.  **Access History**: Click the **"History"** link in the header or footer.
2.  **Search**: Use the search bar to filter the list by a recruit's name. The list updates as you type.
3.  **View Details**: For any entry, click the **"View Details"** button. This expands the card to show a comprehensive breakdown of the calculation, including:
    -   All inputs and overrides used.
    -   Detailed annual SSNIT calculation parameters.
    -   A full table of the progressive PAYE tax brackets that were applied.

---

## 5. Customizing Your Experience

You can change the visual appearance of TSAP to suit your preference.

-   Click the theme icons in the header.
-   The application's theme will change instantly.
-   Your selection is automatically saved and will be remembered the next time you log in.

---

## 6. Next Steps

You are now equipped to handle all standard salary calculation tasks. For more advanced administrative functions, such as managing the Grade/Step list, changing the system password, or reviewing the raw security logs, please refer to the **[AdministratorGuide.md](./AdministratorGuide.md)**.