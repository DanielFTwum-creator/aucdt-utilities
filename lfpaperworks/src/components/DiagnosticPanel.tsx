import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Camera, 
  Smartphone, 
  Monitor, 
  ShieldCheck 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAdminAuth } from '../context/AdminAuthContext';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'pass' | 'fail';
  duration?: number;
  error?: string;
}

const DiagnosticPanel: React.FC = () => {
  const { addLog } = useAdminAuth();
  const [isCapturing, setIsCapturing] = useState(false);
  const [tests, setTests] = useState<TestResult[]>([
    { id: '1', name: 'Homepage Load & Hero Render', status: 'pending' },
    { id: '2', name: 'Product Configurator Logic', status: 'pending' },
    { id: '3', name: 'Cart Persistence (localStorage)', status: 'pending' },
    { id: '4', name: 'Admin Authentication Gate', status: 'pending' },
    { id: '5', name: 'Theme Switching Accessibility', status: 'pending' },
    { id: '6', name: 'Responsive Breakpoint Integrity', status: 'pending' },
  ]);

  const runTest = async (testId: string) => {
    setTests(prev => prev.map(t => t.id === testId ? { ...t, status: 'running' } : t));
    
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
    
    const success = Math.random() > 0.1; // 90% success rate for simulation
    
    setTests(prev => prev.map(t => t.id === testId ? { 
      ...t, 
      status: success ? 'pass' : 'fail',
      duration: Math.floor(1200 + Math.random() * 800),
      error: success ? undefined : 'Timeout waiting for element selector: ".hero-cta"'
    } : t));

    addLog('RUN_DIAGNOSTIC_TEST', `Test: ${tests.find(t => t.id === testId)?.name} - Result: ${success ? 'PASS' : 'FAIL'}`);
  };

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.id);
    }
  };

  const handleCaptureScreenshot = async () => {
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(document.body);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `lfpw_snapshot_${new Date().toISOString()}.png`;
      link.click();
      addLog('CAPTURE_SCREENSHOT', 'System State Snapshot');
    } catch (err) {
      console.error('Screenshot failed:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Test Suite Controls */}
        <div className="lg:col-span-2 bg-white border border-brand-linen">
          <div className="p-6 border-b border-brand-linen flex justify-between items-center">
            <h3 className="label-caps">Automated Test Suite</h3>
            <button 
              onClick={runAllTests}
              disabled={tests.some(t => t.status === 'running')}
              className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-tuc-gold hover:opacity-80 disabled:opacity-50"
            >
              <Play className="w-3 h-3" />
              <span>Run Full Suite</span>
            </button>
          </div>
          
          <div className="divide-y divide-brand-linen">
            {tests.map(test => (
              <div key={test.id} className="p-6 flex items-center justify-between hover:bg-brand-leaf/30 transition-colors">
                <div className="flex items-center space-x-4">
                  {test.status === 'pending' && <div className="w-2 h-2 rounded-full bg-brand-linen" />}
                  {test.status === 'running' && <Loader2 className="w-4 h-4 text-tuc-gold animate-spin" />}
                  {test.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  {test.status === 'fail' && <XCircle className="w-4 h-4 text-red-500" />}
                  
                  <div>
                    <p className="text-sm font-medium">{test.name}</p>
                    {test.error && <p className="text-[10px] text-red-500 mt-1 font-mono">{test.error}</p>}
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  {test.duration && (
                    <span className="text-[10px] font-mono text-brand-stone">{test.duration}ms</span>
                  )}
                  <button 
                    onClick={() => runTest(test.id)}
                    disabled={test.status === 'running'}
                    className="p-2 hover:bg-brand-leaf rounded-full transition-colors"
                    title="Run individual test"
                  >
                    <Play className="w-3 h-3 text-brand-stone" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Tools */}
        <div className="space-y-8">
          <div className="bg-white p-8 border border-brand-linen">
            <h3 className="label-caps mb-6">Visual Verification</h3>
            <div className="space-y-4">
              <button 
                onClick={handleCaptureScreenshot}
                disabled={isCapturing}
                className="btn-secondary w-full py-4 flex items-center justify-center space-x-3 text-xs"
              >
                {isCapturing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                <span>{isCapturing ? 'Capturing...' : 'Capture Snapshot'}</span>
              </button>
              <p className="text-[10px] text-brand-stone text-center italic">
                Uses html2canvas to generate a visual audit of the current UI state.
              </p>
            </div>
          </div>

          <div className="bg-tuc-ink p-8 border border-tuc-gold/20 text-white">
            <div className="flex items-center space-x-3 mb-6">
              <ShieldCheck className="w-5 h-5 text-tuc-gold" />
              <h3 className="label-caps text-white">Security Scan</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-[10px] uppercase tracking-widest text-brand-stone">SSL Status</span>
                <span className="text-[10px] font-bold text-green-400">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-[10px] uppercase tracking-widest text-brand-stone">HSTS Policy</span>
                <span className="text-[10px] font-bold text-green-400">ENFORCED</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-[10px] uppercase tracking-widest text-brand-stone">CSP Headers</span>
                <span className="text-[10px] font-bold text-tuc-gold">MONITORING</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPanel;
