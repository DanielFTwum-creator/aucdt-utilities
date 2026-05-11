import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, XCircle, Code, Clock, Image as ImageIcon } from 'lucide-react';
import { TestResult, getTestResults } from '../../services/testRunner';

interface Props {
  onRunSimulation: () => Promise<void>; // Updated to reflect the async nature
}

export const TestDashboard: React.FC<Props> = ({ onRunSimulation }) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [showCode, setShowCode] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setResults(getTestResults());
  }, []);

  const playwrightCode = `const playwright = require('playwright');

(async () => {
  console.log('🚀 Starting Critical Path Test Suite...');
  
  // Launch browser
  const browser = await playwright.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();
  
  try {
    // 1. Navigate to Application
    console.log('📍 Navigating to application...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // 2. Agreement Review
    console.log('📜 Reviewing Agreement...');
    await page.waitForSelector('button:has-text("Proceed to Sign")', { timeout: 5000 });
    await page.click('button:has-text("Proceed to Sign")');
    await page.waitForTimeout(500);

    // 3. Scholar Details (Step 1)
    console.log('✍️ Filling Scholar Details...');
    await page.type('input[label="Full Name"]', 'Playwright Automated Tester');
    await page.type('input[label="ID Number / Passport No."]', 'TEST-ID-2025-X');
    await page.type('input[type="email"]', 'helpdesk@techbridge.edu.gh');
    await page.type('input[type="tel"]', '0555000000');
    
    // Screenshot Step 1
    await page.screenshot({ path: 'tests/results/step1_filled.png' });
    
    // Navigate Next
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);
    
    // 4. Programme Details (Step 2)
    console.log('✍️ Filling Programme Details...');
    await page.type('input[label="Department"]', 'Computer Science');
    // Bond Duration is read-only, so we verify it instead of typing
    const bondDuration = await page.$eval('input[label="Bond Duration (Years)"]', el => el.value);
    if (bondDuration !== '10') throw new Error("Bond Duration must be 10 years!");
    
    await page.type('input[label="PhD Research Topic"]', 'Automated Systems');
    
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);

    // 5. Guarantor (Step 3)
    console.log('✍️ Filling Guarantor Details...');
    await page.type('input[label="Guarantor Name"]', 'Guarantor Bot');
    await page.type('input[label="Guarantor ID Number"]', 'GTOR-001');
    await page.type('input[label="Guarantor Address"]', 'Bot Residence');
    await page.type('input[label="Guarantor Phone"]', '0555111111');
    
    // Fill Witnesses
    await page.type('input[label="TUC Witness Name"]', 'TUC Official');
    await page.type('input[label="TUC Witness ID"]', 'TUC-WIT-01');
    await page.type('input[label="Scholar Witness Name"]', 'Scholar Friend');
    await page.type('input[label="Scholar Witness ID"]', 'SCH-WIT-01');

    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);

    // 6. Sign (Step 4)
    console.log('✍️ Signing Document...');
    await page.click('input[type="checkbox"]'); // Agree to terms
    await page.type('input[label="Full Legal Name"]', 'Playwright Automated Tester');
    
    // Submit
    console.log('🚀 Finalizing Agreement...');
    await page.click('button:has-text("Finalize Agreement")');
    
    // 7. Verify Success
    await page.waitForSelector('h2:has-text("Bond Executed")', { timeout: 10000 });
    const successText = await page.$eval('h2:has-text("Bond Executed")', el => el.textContent);
    
    if (successText.includes('Bond Executed')) {
      console.log('✅ TEST PASSED: Application submitted successfully');
      await page.screenshot({ path: 'tests/results/success.png' });
    } else {
      throw new Error('Success message not found');
    }

  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    await page.screenshot({ path: 'tests/results/failure.png' });
  } finally {
    await browser.close();
  }
})();`;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hc-bg hc-border">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 hc-text">Self-Test Simulation</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 hc-text">
            Run an in-browser end-to-end simulation. This will verify form rendering, data entry, validation, state transitions, and submission APIs.
          </p>
          <button 
            onClick={onRunSimulation}
            className="flex items-center justify-center w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-indigo-500/20 hc-bg hc-text-accent hover:bg-c6ff00 hover:text-black hc-focus"
          >
            <Play size={18} className="mr-2" />
            Run Critical Path Test
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hc-bg hc-border">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 hc-text">Playwright Suite</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 hc-text">
            Download or view the Node.js Playwright script for CI/CD integration.
          </p>
          <button 
            onClick={() => setShowCode(!showCode)}
            className="flex items-center justify-center w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors font-medium hc-bg hc-text hc-border hover:bg-c6ff00 hover:text-black hc-focus"
          >
            <Code size={18} className="mr-2" />
            {showCode ? 'Hide Script' : 'View Test Script'}
          </button>
        </div>
      </div>

      {showCode && (
        <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-xs overflow-x-auto shadow-inner hc-bg hc-border hc-text">
          <pre>{playwrightCode}</pre>
        </div>
      )}

      {/* Test Results Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hc-bg hc-border">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 hc-border">
           <h3 className="font-semibold text-slate-800 dark:text-slate-200 hc-text">Execution History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-medium hc-bg hc-text hc-border">
              <tr>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Artifacts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 hc-border">
              {results.length === 0 ? (
                 <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400 hc-text">No test runs recorded.</td>
                 </tr>
              ) : (
                results.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 hc-bg-hover">
                    <td className="px-6 py-3">
                      {res.status === 'passed' ? (
                        <span className="inline-flex items-center text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full text-xs hc-text hc-bg">
                          <CheckCircle size={14} className="mr-1" /> Passed
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full text-xs hc-text hc-bg">
                          <XCircle size={14} className="mr-1" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-600 dark:text-slate-300 hc-text">
                      {new Date(res.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-slate-500 dark:text-slate-400 flex items-center hc-text">
                       <Clock size={14} className="mr-1" />
                       {(res.duration / 1000).toFixed(1)}s
                    </td>
                    <td className="px-6 py-3">
                      {res.screenshot && (
                        <button 
                          onClick={() => setSelectedImage(res.screenshot || null)}
                          className="text-tuc-blue-600 hover:text-tuc-blue-700 dark:text-tuc-blue-400 flex items-center text-xs underline hc-text-accent hc-focus"
                        >
                          <ImageIcon size={14} className="mr-1" />
                          View Screenshot
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 hc-bg"
          onClick={() => setSelectedImage(null)}
        >
          <div className="bg-white p-2 rounded-lg max-w-4xl max-h-[90vh] overflow-auto hc-bg-inverted hc-border">
            <img src={selectedImage} alt="Test Screenshot" className="w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
};