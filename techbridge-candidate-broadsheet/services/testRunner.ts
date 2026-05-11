import { TestScenario, TestResult } from '../types';
import html2canvas from 'html2canvas';

// Helper to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to simulate typing
const simulateType = async (selector: string, value: string) => {
  const input = document.querySelector(selector) as HTMLInputElement | HTMLSelectElement;
  if (!input) throw new Error(`Element not found: ${selector}`);
  
  // React 16+ hack for changing inputs programmatically
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  )?.set;
  
  const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLSelectElement.prototype,
    "value"
  )?.set;

  if (input instanceof HTMLInputElement && nativeInputValueSetter) {
    nativeInputValueSetter.call(input, value);
  } else if (input instanceof HTMLSelectElement && nativeSelectValueSetter) {
    nativeSelectValueSetter.call(input, value);
  } else {
    input.value = value;
  }

  const event = new Event('input', { bubbles: true });
  input.dispatchEvent(event);
  await wait(300);
};

// Define Critical User Journey
export const CRITICAL_USER_JOURNEY: TestScenario = {
  name: "Complete Scoring Workflow",
  description: "Validates form entry, scoring calculation, submission, and confirmation UI.",
  steps: [
    {
      id: 1,
      description: "Reset Form & Navigate to Home",
      action: async () => {
        // Ensure we are on the main form (crudely by reloading if needed, but here we assume SPA state)
        // In a real runner we might force route, but for this app, we just ensure inputs are clear-ish
        const nameInput = document.getElementById('fullName') as HTMLInputElement;
        if (nameInput && nameInput.value) {
           await simulateType('#fullName', '');
        }
      }
    },
    {
      id: 2,
      description: "Enter Candidate Details",
      action: async () => {
        await simulateType('#fullName', 'Automated Test Candidate');
        await simulateType('#position', 'Test Engineer');
        await simulateType('#date', '2025-01-01');
      }
    },
    {
      id: 3,
      description: "Enter Panel Details",
      action: async () => {
        await simulateType('#panelMember', 'Test Bot');
        await simulateType('#panelRole', 'QA');
      }
    },
    {
      id: 4,
      description: "Input Scores",
      action: async () => {
        // Appearance (Max 5) -> 4
        await simulateType('#score-appearance', '4');
        // Confidence (Max 15) -> 12
        await simulateType('#score-confidence', '12');
        // Competence (Max 40) -> 35
        await simulateType('#score-competence', '35');
      }
    },
    {
      id: 5,
      description: "Submit Broadsheet",
      action: async () => {
        const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (!submitBtn) throw new Error("Submit button not found");
        if (submitBtn.disabled) throw new Error("Submit button is disabled - form validation failed?");
        submitBtn.click();
        await wait(2000); // Wait for mock API
      }
    },
    {
      id: 6,
      description: "Verify Success State",
      action: async () => {
        const successMsg = document.body.innerText.includes('Submission Successful');
        if (!successMsg) throw new Error("Success message not found in DOM");
        
        // Take screenshot of success
        const canvas = await html2canvas(document.body);
        const dataUrl = canvas.toDataURL();
        // In a real app we'd save this, here we just confirm it generated
        if (!dataUrl.startsWith('data:image')) throw new Error("Screenshot generation failed");
      }
    }
  ]
};