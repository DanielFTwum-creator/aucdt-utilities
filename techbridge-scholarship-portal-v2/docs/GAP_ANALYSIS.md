# Gap Analysis: Scholarship Agreement PDF vs. Digital Portal

## Overview
This document compares the digitized Agreement Form (`AgreementTab.tsx`) and the data structure (`types.ts`) against standard requirements for the Techbridge University College Scholarship Bond.

## 1. Missing Data Fields in Agreement Tab
The following fields are present in the data structure or standard legal bonds but are missing from the `AgreementTab.tsx` visual form:

| Field | Status | Recommendation |
|-------|--------|----------------|
| **Scholar ID / Passport No.** | 🔴 Missing | **Critical**: Must be added to the "Scholar" section of the Agreement Tab to legally identify the individual. |
| **Scholar Title (Mr/Mrs/Ms)** | 🟡 Missing | Add a dropdown for Title before Full Name. |
| **Programme Funding Source** | 🟡 Hardcoded | Text says "Staff Development Scholarship Scheme". If funding source varies, this should be dynamic. |
| **Bond Duration** | 🟡 Hardcoded | Text says "TEN (10) YEARS". Should be linked to `data.program.serviceYears` to ensure consistency with the "Sell Lines" in the sidebar. |

## 2. Structural Gaps
| Section | Status | Recommendation |
|---------|--------|----------------|
| **Signature Block** | 🔴 Missing | The Agreement Tab text ends at "General Provisions". It lacks the "IN WITNESS WHEREOF" clause and the signature placeholders for Scholar, Guarantor, and Witnesses. |
| **Witness Details** | 🟡 Partial | `Step3GuarantorWitness` collects Name/ID, but `types.ts` includes `fatherName` which is not collected. |
| **Guarantor Address** | 🟡 Optional | Currently optional in Step 3, but usually mandatory for legal bonds. |

## 3. Discrepancies
- **Service Years**: The sidebar displays `data.program.serviceYears` (dynamic), but the Agreement text hardcodes "TEN (10) YEARS". If the logic changes to 5 years, the text will be legally incorrect.
- **Date Format**: The Agreement Tab uses a date picker (`YYYY-MM-DD`), but legal documents often require "This [Day] day of [Month], [Year]".

## 4. Action Plan
1.  **Update AgreementTab.tsx**:
    -   Add `Scholar ID Number` input.
    -   Add `Title` dropdown.
    -   Replace "TEN (10) YEARS" with dynamic `{data.program.serviceYears}`.
    -   Append the "IN WITNESS WHEREOF" signature block section (read-only preview).
## 5. Resolved Issues
- **Hydration Error**: Fixed invalid HTML nesting where `<ul>` was a descendant of `<p>` in `AgreementTab.tsx`. This ensures React hydration works correctly.
- **Layout**: Widened layout to `max-w-7xl` for full-screen utilization.
- **Aesthetics**: Implemented editorial/magazine layout with split views, grid systems, and enhanced typography.
- **Components**: Refactored `AgreementTab`, `Step3GuarantorWitness`, and `Step4Review` to use multi-column layouts.
- **Hero Section**: Redesigned for better visual impact.
- **Success View**: Updated to a 2-column immersive layout.
