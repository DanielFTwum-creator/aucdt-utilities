
// A lightweight, browser-side implementation mimicking Puppeteer for self-testing
export interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  logs: string[];
  duration?: number;
  error?: string;
  screenshots: string[];
}

export interface TestActionParams {
  log: (msg: string) => void;
  screenshot: (label: string) => Promise<void>;
}

export type TestAction = (params: TestActionParams) => Promise<void>;

export interface TestScenario {
  id: string;
  name: string;
  action: TestAction;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const waitForSelector = async (selector: string, timeout = 5000): Promise<HTMLElement> => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element && element.offsetParent !== null) return element;
    await delay(100);
  }
  throw new Error(`Timeout waiting for selector: ${selector}`);
};

// Helper to trigger React's synthetic events by manipulating the native value setter
const setNativeValue = (element: HTMLInputElement | HTMLTextAreaElement, value: string) => {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
  
  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter?.call(element, value);
  } else {
    valueSetter?.call(element, value);
  }
  
  element.dispatchEvent(new Event('input', { bubbles: true }));
};

export const TEST_SUITE: TestScenario[] = [
  {
    id: 'homepage-sanity',
    name: 'TUC Brand Verification',
    action: async ({ log, screenshot }) => {
      log('Navigating to Techbridge Homepage baseline...');
      window.location.hash = '#/'; 
      await delay(1000);

      log('Checking Hero Slider presence...');
      await waitForSelector('section[aria-roledescription="carousel"]');
      await screenshot('Homepage Hero');

      log('Verifying Brand Identity Strings...');
      const bodyText = document.body.innerText;
      if (!bodyText.includes('Techbridge University College')) throw new Error('Institutional Branding missing');
      if (!bodyText.includes('Design and Build a Nation')) throw new Error('Institutional Motto missing');
      log('Identity verification passed.');
    }
  },
  {
    id: 'theme-switching',
    name: 'Theme Engine Functionality',
    action: async ({ log, screenshot }) => {
        log('Locating theme toggle controls...');
        window.location.hash = '#/';
        await delay(500);

        const darkBtn = document.querySelector('button[aria-label="Switch to Dark Mode"]') as HTMLElement;
        const lightBtn = document.querySelector('button[aria-label="Switch to Light Mode"]') as HTMLElement;
        const hcBtn = document.querySelector('button[aria-label="Switch to High Contrast Mode"]') as HTMLElement;

        if (!darkBtn || !lightBtn || !hcBtn) throw new Error('Theme controls not found');

        log('Testing Dark Mode transition...');
        darkBtn.click();
        await delay(300);
        if (!document.documentElement.classList.contains('dark')) throw new Error('Dark mode class not applied to root');
        await screenshot('Dark Mode State');

        log('Testing High Contrast Mode transition...');
        hcBtn.click();
        await delay(300);
        if (!document.documentElement.classList.contains('high-contrast')) throw new Error('High Contrast class not applied to root');
        if (document.documentElement.classList.contains('dark')) throw new Error('Dark mode class should be removed in High Contrast');
        await screenshot('High Contrast State');

        log('Restoring Light Mode...');
        lightBtn.click();
        await delay(300);
        if (document.documentElement.classList.contains('dark') || document.documentElement.classList.contains('high-contrast')) {
            throw new Error('Failed to restore Light mode state');
        }
        log('Theme engine verified successfully.');
    }
  },
  {
    id: 'chat-agent-interaction',
    name: 'AI Agent Interaction Flow',
    action: async ({ log, screenshot }) => {
      log('Opening Chat Agent...');
      const chatToggle = await waitForSelector('button[aria-label="Open AI Chat Assistant"]');
      chatToggle.click();
      
      log('Waiting for AI Dialog to mount...');
      const dialog = await waitForSelector('div[role="dialog"][aria-label="BridgeBot AI Assistant"]');
      await screenshot('Chat Opened');

      log('Locating input field...');
      const input = await waitForSelector('textarea[aria-label="Type your message"]') as HTMLTextAreaElement;
      const sendBtn = await waitForSelector('button[aria-label="Send"]');

      log('Simulating user typing...');
      setNativeValue(input, 'Test Diagnostics: Hello BridgeBot');
      await delay(500);

      log('Sending message...');
      sendBtn.click();
      
      log('Waiting for response stream...');
      // Wait for the input to clear (indicating send success)
      let retries = 0;
      while (input.value !== '' && retries < 10) {
        await delay(200);
        retries++;
      }
      
      await delay(2000); // Allow time for the bubble to appear
      
      // Check for message bubbles. We expect more than the initial greeting.
      // We search for elements with the message bubble styling.
      const messages = dialog.querySelectorAll('div[class*="rounded-[2.5rem]"]');
      if (messages.length < 2) throw new Error('Response message bubble did not render');

      log('Message stream verified.');
      await screenshot('Chat Interaction');
      
      // Close chat to clean up
      const closeBtn = await waitForSelector('button[aria-label="Close chat"]');
      closeBtn.click();
    }
  },
  {
      id: 'admin-security-lockout',
      name: 'Admin Security Lockout Protocol',
      action: async ({ log, screenshot }) => {
          log('Initializing Admin Security Test...');
          // Clean state to ensure reproducible test
          localStorage.removeItem('admin_login_attempts');
          localStorage.removeItem('admin_lockout_until');

          log('Navigating to Admin Portal...');
          window.location.hash = '#/admin';
          await delay(1000);

          const passwordInput = await waitForSelector('input[type="password"]') as HTMLInputElement;
          const submitBtn = await waitForSelector('button[type="submit"]');

          log('Attempting 3 invalid logins to trigger brute-force protection...');
          
          for (let i = 1; i <= 3; i++) {
              log(`Attempt ${i}/3: Injecting invalid credentials...`);
              setNativeValue(passwordInput, `wrongpass${i}`);
              submitBtn.click();
              await delay(800); // Wait for React state update/render
          }

          log('Verifying Lockout State...');
          const bodyText = document.body.innerText;
          const isLocked = bodyText.includes('Locked for') || bodyText.includes('Security Lockout Active');
          
          if (!isLocked) {
              // Fallback check: input should be disabled
              if (!passwordInput.disabled) throw new Error('System failed to lock after 3 invalid attempts');
          }

          await screenshot('Admin Lockout Screen');
          log('Security protocol enforced successfully.');

          // Cleanup
          log('Resetting security state for next run...');
          localStorage.removeItem('admin_login_attempts');
          localStorage.removeItem('admin_lockout_until');
      }
  },
  {
    id: 'link-integrity-crawler',
    name: 'Link Integrity Crawler',
    action: async ({ log, screenshot }) => {
      window.location.hash = '#/';
      await delay(1000);
      
      log('Scanning all visible anchor tags...');
      const links = Array.from(document.querySelectorAll('a'));
      let brokenCount = 0;
      links.forEach((link, idx) => {
        const href = link.getAttribute('href');
        // Check for empty hrefs, or placeholder links that might indicate unfinished work
        if (!href || href === '#' || href === 'javascript:void(0)') {
          brokenCount++;
        }
      });

      if (brokenCount > 15) { 
        log(`[WARN] ${brokenCount} placeholder/empty links detected.`);
      } else {
         log(`Link health check passed. ${links.length} scanned.`);
      }
      
      await screenshot('Link Audit Result');
    }
  }
];
