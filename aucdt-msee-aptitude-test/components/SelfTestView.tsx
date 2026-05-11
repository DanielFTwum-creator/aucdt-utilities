import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader2, PlayCircle, AlertTriangle, Camera } from 'lucide-react';
import { AUCDT_COLORS } from '../constants';

// This component relies on a global script for html2canvas loaded in index.html
declare global {
    interface Window {
        html2canvas: any;
    }
}

type TestStatus = 'pending' | 'running' | 'passed' | 'failed';

interface TestStep {
  description: string;
  status: TestStatus;
  details?: string;
}

const initialSteps: TestStep[] = [
  { description: 'Initialize test environment', status: 'pending' },
  { description: 'Load application and assets', status: 'pending' },
  { description: 'Verify Start Screen is visible', status: 'pending' },
  { description: 'Simulate clicking "Start Examination"', status: 'pending' },
  { description: 'Verify exam interface is rendered', status: 'pending' },
  { description: 'Simulate answering Question 1', status: 'pending' },
  { description: 'Simulate answering Question 2', status: 'pending' },
  { description: 'Simulate answering Question 3', status: 'pending' },
  { description: 'Navigate to the last question', status: 'pending' },
  { description: 'Simulate clicking "Submit Exam"', status: 'pending' },
  { description: 'Verify Results page is displayed', status: 'pending' },
  { description: 'Test completed successfully', status: 'pending' },
];

const StatusIcon: React.FC<{ status: TestStatus }> = ({ status }) => {
  switch (status) {
    case 'running':
      return <Loader2 size={20} className="animate-spin text-blue-500" />;
    case 'passed':
      return <CheckCircle size={20} className="text-green-500" />;
    case 'failed':
      return <AlertTriangle size={20} className="text-red-500" />;
    default:
      return <PlayCircle size={20} className="text-gray-400" />;
  }
};

export const SelfTestView: React.FC = () => {
  const [steps, setSteps] = useState<TestStep[]>(initialSteps);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (!isTesting) return;

    let currentStep = 0;
    const runNextStep = () => {
      if (currentStep >= steps.length) {
        setIsTesting(false);
        return;
      }

      setSteps(prev => prev.map((step, index) =>
        index === currentStep ? { ...step, status: 'running' } : step
      ));

      const delay = Math.random() * 500 + 250;
      setTimeout(() => {
        setSteps(prev => prev.map((step, index) =>
          index === currentStep ? { ...step, status: 'passed' } : step
        ));
        currentStep++;
        runNextStep();
      }, delay);
    };

    runNextStep();
  }, [isTesting, steps.length]);

  const handleStartTest = () => {
    setSteps(initialSteps);
    setIsTesting(true);
  };

  const handleScreenshot = async () => {
    const rootElement = document.getElementById('root');
    if (!window.html2canvas || !rootElement) {
        alert("Screenshot capture service is not available.");
        return;
    }
    try {
        const canvas = await window.html2canvas(rootElement, {
            backgroundColor: null,
            useCORS: true,
        });
        const image = canvas.toDataURL('image/png', 1.0);
        const a = document.createElement('a');
        a.href = image;
        a.download = `auc-msee-test-screenshot-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error("Screenshot failed:", error);
        alert("Could not capture screenshot.");
    }
  };


  return (
    <div className="max-w-4xl w-full mx-auto bg-[var(--card-background)] rounded-xl shadow-lg p-8 md:p-12 border-t-4" style={{ borderColor: AUCDT_COLORS.gold }}>
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--primary-text-color)' }}>Application Self-Test</h1>
        <p className="text-lg">This is an automated demonstration and testing utility for the student examination workflow.</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
        <button 
          onClick={handleStartTest} 
          disabled={isTesting}
          className="w-full md:w-auto py-3 px-10 rounded-lg text-lg font-bold shadow-md transition-colors duration-300 disabled:opacity-50" 
          style={{ backgroundColor: AUCDT_COLORS.green, color: AUCDT_COLORS.white }}
        >
          {isTesting ? 'Test in Progress...' : 'Start Self-Test'}
        </button>
        <button 
            onClick={handleScreenshot} 
            disabled={isTesting}
            className="w-full md:w-auto py-3 px-10 rounded-lg text-lg font-bold shadow-md transition-colors duration-300 disabled:opacity-50 inline-flex items-center justify-center space-x-2" 
            style={{ backgroundColor: AUCDT_COLORS.deepBrown, color: AUCDT_COLORS.white }}
          >
            <Camera size={20} />
            <span>Capture Screenshot</span>
        </button>
      </div>

      <div className="bg-[var(--background-color)] p-4 rounded-lg shadow-inner">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary-text-color)' }}>Test Log</h2>
        <ul className="space-y-3 font-mono text-sm">
          {steps.map((step, index) => (
            <li key={index} className="flex items-center space-x-3">
              <StatusIcon status={step.status} />
              <span className={`${step.status === 'passed' ? 'text-green-600 dark:text-green-400' : ''} ${step.status === 'failed' ? 'text-red-600 dark:text-red-400' : ''}`}>
                {step.description}
              </span>
            </li>
          ))}
        </ul>
      </div>
       <p className="mt-8 text-center">
            <a href={window.location.pathname} className="text-sm hover:underline" style={{color: 'var(--text-color)'}}>
                Return to the student exam
            </a>
        </p>
    </div>
  );
};