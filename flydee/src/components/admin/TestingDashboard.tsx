import React from 'react';
import { Button } from '../ui/button';

export default function TestingDashboard() {
  const runTests = () => {
    console.log('Running Playwright tests...');
    // In a real app, this would trigger the test runner
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Testing Suite</h2>
      <Button onClick={runTests}>Run E2E Tests</Button>
    </div>
  );
}
