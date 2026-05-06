import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import Spinner from './Spinner';

interface TestResult {
  status: 'pass' | 'fail' | 'neutral';
  message: string;
}

const TestCard: React.FC<{ title: string, description: string, onRun: () => Promise<TestResult>, children?: React.ReactNode }> = ({ title, description, onRun }) => {
  const [result, setResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async () => {
    setIsLoading(true);
    setResult(null);
    const testResult = await onRun();
    setResult(testResult);
    setIsLoading(false);
  };

  const statusColor = result?.status === 'pass' ? 'green' : result?.status === 'fail' ? 'red' : 'gray';

  return (
    <div className="bg-primary p-6 rounded-lg border border-default">
      <h3 className="font-bold text-lg text-primary">{title}</h3>
      <p className="text-secondary text-sm mt-1 mb-4">{description}</p>
      <div className="flex items-center gap-4">
        <button
          onClick={handleRun}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-accent-primary text-white font-bold hover:bg-accent-primary/90 transition disabled:bg-gray-400"
        >
          {isLoading ? <Spinner className="text-white"/> : 'Run Test'}
        </button>
        {result && (
          <div className={`text-sm font-semibold flex items-center gap-2 text-${statusColor}-600`}>
            {result.status === 'pass' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
            {result.status === 'fail' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>}
            {result.status === 'neutral' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>}
            <span>{result.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface TestingViewProps {
    onStartDemo: () => void;
}

const TestingView: React.FC<TestingViewProps> = ({ onStartDemo }) => {
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const runApiKeyTest = async (): Promise<TestResult> => {
        const apiKey = process.env.API_KEY;
        if (apiKey && apiKey.length > 5) {
            return { status: 'pass', message: 'API Key is configured.' };
        }
        return { status: 'fail', message: 'API_KEY environment variable is not set or is too short.' };
    };
    
    const runLocalStorageTest = async (): Promise<TestResult> => {
        const testKey = 'markai-test-key';
        const testValue = 'test-data';
        try {
            localStorage.setItem(testKey, testValue);
            const retrievedValue = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            if (retrievedValue === testValue) {
                return { status: 'pass', message: 'Local storage is writable and readable.' };
            }
            return { status: 'fail', message: 'Value mismatch in local storage.' };
        } catch (e) {
            return { status: 'fail', message: `Local storage access failed: ${e instanceof Error ? e.message : 'Unknown error'}` };
        }
    };
    
    const captureScreenshot = async (): Promise<TestResult> => {
        setIsCapturing(true);
        setScreenshot(null);
        try {
            const canvas = await html2canvas(document.body);
            setScreenshot(canvas.toDataURL('image/png'));
            return { status: 'pass', message: 'Screenshot captured below.' };
        } catch (error) {
            return { status: 'fail', message: 'Failed to capture screenshot.' };
        } finally {
            setIsCapturing(false);
        }
    };

    const runE2eSimulation = async (): Promise<TestResult> => {
        onStartDemo();
        return { status: 'neutral', message: 'E2E Demo started. See the panel at the bottom.' };
    };

    return (
        <div className="max-w-7xl mx-auto bg-secondary p-6 sm:p-8 rounded-2xl shadow-lg border border-default space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-primary">Testing Dashboard</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TestCard
                    title="API Key Check"
                    description="Verifies that the Google Gemini API key is properly configured in the environment variables."
                    onRun={runApiKeyTest}
                />
                <TestCard
                    title="Local Storage Access"
                    description="Tests if the browser's local storage can be written to and read from, which is essential for data persistence."
                    onRun={runLocalStorageTest}
                />
                 <TestCard
                    title="E2E Workflow Simulation"
                    description="Simulates the full user journey from content creation to scheduling, mirroring the automated Puppeteer test."
                    onRun={runE2eSimulation}
                />
            </div>
            <div>
                 <TestCard
                    title="Capture Screenshot"
                    description="Takes a full-page screenshot for visual regression testing. The result will be displayed below."
                    onRun={captureScreenshot}
                />
                 {isCapturing && <div className="mt-4 text-center"><Spinner className="w-8 h-8 mx-auto text-accent-primary"/> <p className="text-secondary">Capturing...</p></div>}
                 {screenshot && (
                     <div className="mt-6 border border-default rounded-lg p-4">
                         <h3 className="font-bold text-lg text-primary mb-4">Screenshot Result</h3>
                         <img src={screenshot} alt="Application screenshot" className="w-full rounded-md border-2 border-default" />
                         <a 
                            href={screenshot} 
                            download="markai-screenshot.png"
                            className="mt-4 inline-block px-4 py-2 rounded-lg bg-accent-secondary text-white font-bold hover:bg-accent-secondary/90 transition"
                        >
                            Download Image
                        </a>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default TestingView;
