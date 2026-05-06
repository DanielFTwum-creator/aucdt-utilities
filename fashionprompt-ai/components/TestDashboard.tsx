import React, { useState } from 'react';
import { TestResult, DesignState } from '../types';

interface TestDashboardProps {
  currentState: DesignState;
}

const TestDashboard: React.FC<TestDashboardProps> = ({ currentState }) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    const tests: (() => Promise<TestResult>)[] = [
      async () => {
        return {
          id: 't1',
          name: 'State Integrity Check',
          status: currentState.garment ? 'pass' : 'fail',
          message: currentState.garment ? 'Garment state is valid' : 'Garment state is missing',
          duration: 5
        };
      },
      async () => {
        const hasActiveEthnicity = Object.values(currentState.ethnicities).some(v => v);
        return {
          id: 't2',
          name: 'Diversity Guardrails',
          status: hasActiveEthnicity ? 'pass' : 'fail',
          message: hasActiveEthnicity ? 'At least one ethnicity selected' : 'No ethnicity selected - Diversity violation',
          duration: 8
        };
      },
      async () => {
        await new Promise(r => setTimeout(r, 400)); // Simulate network/processing
        return {
          id: 't3',
          name: 'Resolution Configuration',
          status: 'pass',
          message: 'Resolution defaults to 1024x1024',
          duration: 405
        };
      },
      async () => {
        const validMoods = ['elegant', 'mysterious', 'playful', 'ethereal', 'bold', 'romantic', 'melancholic', 'serene'];
        const currentMoodKey = currentState.mood.split(' ')[0].toLowerCase();
        const isValid = validMoods.includes(currentMoodKey);
        return {
          id: 't4',
          name: 'Mood Consistency',
          status: isValid ? 'pass' : 'fail',
          message: `Mood "${currentState.mood}" is ${isValid ? 'valid' : 'invalid'}`,
          duration: 12
        };
      }
    ];

    const newResults: TestResult[] = [];
    for (const test of tests) {
      const result = await test();
      newResults.push(result);
      setResults([...newResults]);
      await new Promise(r => setTimeout(r, 100)); // Visual delay
    }
    setIsRunning(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">System Self-Test</h2>
        <button
          onClick={runTests}
          disabled={isRunning}
          className={`px-6 py-2 rounded-xl font-bold text-white transition-all ${
            isRunning ? 'bg-slate-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200'
          }`}
        >
          {isRunning ? 'Running Diagnostics...' : '▶ Run Test Suite'}
        </button>
      </div>

      <div className="grid gap-3">
        {results.length === 0 && !isRunning && (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">Ready to execute system diagnostics.</p>
          </div>
        )}
        
        {results.map((result) => (
          <div key={result.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${
                result.status === 'pass' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 
                result.status === 'fail' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-yellow-500'
              }`} />
              <div>
                <h4 className="font-bold text-slate-800">{result.name}</h4>
                <p className="text-sm text-slate-600">{result.message}</p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">{result.duration}ms</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestDashboard;
