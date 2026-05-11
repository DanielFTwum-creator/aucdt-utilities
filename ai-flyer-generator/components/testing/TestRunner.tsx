import React from 'react';

interface TestRunnerProps {
  addLogEntry: (action: string) => void;
  onCaptureScreenshot: () => void;
  canCapture: boolean;
  onGenerateSample: () => void;
}

const TestRunner: React.FC<TestRunnerProps> = ({ addLogEntry, onCaptureScreenshot, canCapture, onGenerateSample }) => {
  
  const handleGenerate = () => {
    addLogEntry('TestRunner: Triggered sample generation.');
    onGenerateSample();
  }

  const handleCapture = () => {
    if (canCapture) {
      addLogEntry('TestRunner: Triggered screenshot capture.');
      onCaptureScreenshot();
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">E2E Testing Control</h2>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Use these controls to simulate user actions for end-to-end testing purposes.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={handleGenerate} className="px-6 py-3 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-colors">
          Generate Sample Flyer
        </button>
        <button 
          onClick={handleCapture} 
          className="px-6 py-3 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canCapture}
        >
          Capture Flyer Screenshot
        </button>
      </div>
      {!canCapture && (
         <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
            A flyer must be generated before a screenshot can be captured.
         </p>
      )}
    </div>
  );
};

export default TestRunner;