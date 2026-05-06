import { TestResult } from '../types';

// Helper to capture a screenshot of the body
const captureScreenshot = async (): Promise<string> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(window as any).html2canvas) {
    console.error('html2canvas is not loaded');
    return 'html2canvas script not found.';
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const canvas = await (window as any).html2canvas(document.body, {
        windowWidth: document.body.scrollWidth,
        windowHeight: document.body.scrollHeight,
        useCORS: true,
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Screenshot failed:', error);
    return 'Failed to capture screenshot.';
  }
};

// Simple assertion helper
const expect = (value: unknown) => ({
  toBe: (expected: unknown) => {
    if (value !== expected) {
      throw new Error(`Expected ${JSON.stringify(value)} to be ${JSON.stringify(expected)}`);
    }
  },
  toContain: (substring: string) => {
    if (typeof value !== 'string' || !value.includes(substring)) {
        throw new Error(`Expected "${value}" to contain "${substring}"`);
    }
  },
});

// Helper to wait for re-renders
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Test Definitions
const testSuite: { description: string; testFn: () => Promise<void> }[] = [
  {
    description: 'Initial page should load and render all applications',
    testFn: async () => {
      await wait(500); // Wait for initial animation
      const appCards = document.querySelectorAll('.group.relative');
      expect(appCards.length).toBe(12);
      const header = document.querySelector('header');
      if (!header) throw new Error('Header not found');
      expect(header.textContent).toContain('TechBridge');
    }
  },
  {
    description: 'Should filter applications by search term "agent"',
    testFn: async () => {
      const searchInput = document.getElementById('search') as HTMLInputElement;
      if (!searchInput) throw new Error('Search input not found');
      
      searchInput.value = 'agent';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      await wait(300);
      
      const appCards = document.querySelectorAll('.group.relative');
      expect(appCards.length).toBe(1);
      const cardTitle = appCards[0].querySelector('h3');
      expect(cardTitle?.textContent).toBe('Agent-Led Software Development');
      
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      await wait(300);
    }
  },
  {
    description: 'Should filter applications by "Research" category',
    testFn: async () => {
      const categoryButtons = Array.from(document.querySelectorAll('button[aria-label^="Filter by"]'));
      const researchButton = categoryButtons.find(btn => btn.textContent?.includes('Research')) as HTMLButtonElement;
      if (!researchButton) throw new Error('Research filter button not found');
      
      researchButton.click();
      await wait(300);
      
      const appCards = document.querySelectorAll('.group.relative');
      expect(appCards.length).toBe(7);
      const allBadgesAreResearch = Array.from(appCards).every(card => card.textContent?.includes('Research'));
      expect(allBadgesAreResearch).toBe(true);

      const allAppsButton = categoryButtons.find(btn => btn.textContent?.includes('All Apps')) as HTMLButtonElement;
      if (!allAppsButton) throw new Error('All Apps button not found for cleanup');
      allAppsButton.click();
      await wait(300);
    }
  },
  {
    description: 'Should show "No applications found" message for invalid search',
    testFn: async () => {
      const searchInput = document.getElementById('search') as HTMLInputElement;
      if (!searchInput) throw new Error('Search input not found');

      searchInput.value = 'xyz-nonexistent-app-xyz';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      await wait(300);

      const noAppsMessage = document.querySelector('.text-center.py-24');
      if (!noAppsMessage) throw new Error('"No applications found" message container not found');
      expect(noAppsMessage.textContent).toContain('No applications found');

      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      await wait(300);
    }
  },
  {
    description: 'Should switch theme to Dark mode and verify style change',
    testFn: async () => {
      const themeButtons = Array.from(document.querySelectorAll('button[aria-label^="Switch to"]'));
      const darkButton = themeButtons.find(btn => btn.getAttribute('aria-label')?.includes('dark')) as HTMLButtonElement;
      if (!darkButton) throw new Error('Dark theme button not found');

      darkButton.click();
      await wait(300);
      
      const htmlElement = document.documentElement;
      expect(htmlElement.getAttribute('data-theme')).toBe('dark');
      
      const bodyColor = getComputedStyle(document.body).backgroundColor;
      // rgb(15, 12, 7) is the RGB equivalent of brand-ink / #0F0C07
      expect(bodyColor).toBe('rgb(15, 12, 7)');

      const lightButton = themeButtons.find(btn => btn.getAttribute('aria-label')?.includes('light')) as HTMLButtonElement;
       if (!lightButton) throw new Error('Light theme button not found for cleanup');
      lightButton.click();
      await wait(300);
    }
  }
];

export const runSelfTests = async (onProgress: (result: TestResult) => void) => {
  for (const test of testSuite) {
    const result: TestResult = { description: test.description, status: 'FAIL' };
    try {
      await test.testFn();
      result.status = 'PASS';
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.error = error.message;
      } else {
        result.error = String(error);
      }
      result.screenshot = await captureScreenshot();
    }
    onProgress(result);
    await wait(200); // Small delay between tests for visual feedback
  }
};
