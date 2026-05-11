import { TestResult } from '../types';

export const runSystemDiagnostics = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];
  
  const addResult = (name: string, passed: boolean, message: string) => {
    results.push({
      id: crypto.randomUUID(),
      name,
      status: passed ? 'pass' : 'fail',
      message,
      timestamp: Date.now()
    });
  };

  // Test 1: DOM Structure Integrity
  try {
    const root = document.getElementById('root');
    const flyer = document.querySelector('main');
    addResult(
      'Critical DOM Elements', 
      !!(root && flyer), 
      root && flyer ? 'Root and Main Flyer container found.' : 'Critical DOM elements missing.'
    );
  } catch (e) {
    addResult('Critical DOM Elements', false, `Error: ${e}`);
  }

  // Test 2: CSS Variable Injection
  try {
    const computed = getComputedStyle(document.documentElement);
    const bg = computed.getPropertyValue('--bg-root').trim();
    addResult(
      'Theme System Variables', 
      bg.length > 0, 
      bg.length > 0 ? 'CSS Variables detected.' : '--bg-root variable is undefined.'
    );
  } catch (e) {
    addResult('Theme System Variables', false, `Error: ${e}`);
  }

  // Test 3: Accessibility Attributes
  try {
    const images = document.querySelectorAll('img');
    let missingAlt = 0;
    images.forEach(img => {
      if (!img.hasAttribute('alt')) missingAlt++;
    });
    addResult(
      'Image Accessibility (Alt Text)', 
      missingAlt === 0, 
      missingAlt === 0 ? 'All images have alt attributes.' : `${missingAlt} images missing alt text.`
    );
  } catch (e) {
    addResult('Image Accessibility', false, `Error: ${e}`);
  }

  // Test 4: Interactive Elements
  try {
    const buttons = document.querySelectorAll('button');
    const focusable = Array.from(buttons).every(btn => btn.tabIndex !== -1);
    addResult(
      'Interactive Controls', 
      buttons.length > 0 && focusable, 
      `Found ${buttons.length} buttons, all focusable.`
    );
  } catch (e) {
    addResult('Interactive Controls', false, `Error: ${e}`);
  }

  // Test 5: Speaker Data Rendering
  try {
    const cards = document.querySelectorAll('[role="article"]');
    addResult(
      'Content Rendering', 
      cards.length > 0, 
      `Rendered ${cards.length} speaker cards successfully.`
    );
  } catch (e) {
    addResult('Content Rendering', false, `Error: ${e}`);
  }

  // Simulate async delay for realism
  await new Promise(r => setTimeout(r, 800));

  return results;
};