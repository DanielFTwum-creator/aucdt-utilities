
import React, { useState, useEffect, useRef } from 'react';
import { Play, CheckCircle, XCircle, Loader2, Terminal, AlertTriangle } from 'lucide-react';
import { TestResult } from '../types';

interface Props {
  onComplete: (results: TestResult[]) => void;
}

// Browser Agent simulating Puppeteer-like syntax
class BrowserAgent {
  async sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  async select(selector: string, timeout = 2000): Promise<HTMLElement> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = document.querySelector(selector) as HTMLElement;
      if (el) return el;
      await this.sleep(100);
    }
    throw new Error(`Timeout: Element '${selector}' not found`);
  }

  async click(selector: string) {
    const el = await this.select(selector);
    // Visual indicator of click
    const rect = el.getBoundingClientRect();
    const highlight = document.createElement('div');
    highlight.style.position = 'fixed';
    highlight.style.left = `${rect.left}px`;
    highlight.style.top = `${rect.top}px`;
    highlight.style.width = `${rect.width}px`;
    highlight.style.height = `${rect.height}px`;
    highlight.style.border = '2px solid #ef4444';
    highlight.style.borderRadius = '4px';
    highlight.style.pointerEvents = 'none';
    highlight.style.zIndex = '9999';
    highlight.style.transition = 'opacity 0.5s';
    document.body.appendChild(highlight);
    
    el.click();
    await this.sleep(200); // Visual pause
    highlight.style.opacity = '0';
    setTimeout(() => highlight.remove(), 500);
  }

  async inputValue(selector: string, value: string) {
    const el = await this.select(selector) as HTMLInputElement;
    const proto = Object.getPrototypeOf(el);
    const nativeValueSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    nativeValueSetter?.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    await this.sleep(300);
  }

  async getText(selector: string) {
    const el = await this.select(selector);
    return el.textContent || '';
  }
}

const TestRunner: React.FC<Props> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  useEffect(() => {
    const runTests = async () => {
      const agent = new BrowserAgent();
      const results: TestResult[] = [];
      const scenarios = [
        { name: 'DOM Integrity Check', fn: async () => {
            await agent.select('h1');
            const title = await agent.getText('h1');
            if (!title.includes('of')) throw new Error('Main title format incorrect');
        }},
        { name: 'Config Panel Interaction', fn: async () => {
            await agent.click('button[aria-label="Toggle Config"]');
            await agent.select('#total-scope'); // Wait for panel
            await agent.inputValue('#total-scope', '100');
            await agent.click('button[aria-label="Toggle Config"]'); // Close it
        }},
        { name: 'State Logic Verification', fn: async () => {
             // We changed total to 100 in previous step, let's verify visual update logic implies calculation
             // Wait for React to re-render
             await agent.sleep(500);
             // Find text that says "of 100"
             const title = await agent.getText('h1');
             if (!title.includes('100')) throw new Error(`Expected '100' in title, found: ${title}`);
        }},
        { name: 'Quick Action (Increment)', fn: async () => {
            const before = await agent.getText('div[class*="text-4xl"]'); // First hero stat is completed
            await agent.click('button[aria-label="Increase Completed Count"]');
            await agent.sleep(500);
            const after = await agent.getText('div[class*="text-4xl"]');
            if (before === after) throw new Error('Increment failed');
        }}
      ];

      addLog('🚀 Initializing Puppeteer Simulator...');
      await agent.sleep(1000);

      for (let i = 0; i < scenarios.length; i++) {
        const scenario = scenarios[i];
        const start = performance.now();
        addLog(`Running: ${scenario.name}...`);
        
        try {
          await scenario.fn();
          const duration = Math.round(performance.now() - start);
          results.push({
            id: crypto.randomUUID(),
            name: scenario.name,
            status: 'pass',
            duration,
            timestamp: new Date().toISOString()
          });
          addLog(`✅ PASS (${duration}ms)`);
        } catch (e: any) {
          const duration = Math.round(performance.now() - start);
          results.push({
            id: crypto.randomUUID(),
            name: scenario.name,
            status: 'fail',
            duration,
            error: e.message,
            timestamp: new Date().toISOString()
          });
          addLog(`❌ FAIL: ${e.message}`);
        }
        setProgress(((i + 1) / scenarios.length) * 100);
        await agent.sleep(500);
      }

      addLog('🏁 Test Suite Complete. Generatin report...');
      await agent.sleep(1000);
      onComplete(results);
    };

    // Small delay to allow initial render
    setTimeout(runTests, 1000);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs z-[9999] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-slate-900/50 p-3 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider">
          <Terminal size={14} />
          <span>Test Automation</span>
        </div>
        <Loader2 size={14} className="animate-spin text-slate-500" />
      </div>
      
      <div className="h-64 overflow-y-auto p-4 space-y-2 bg-black/50">
        {logs.map((log, i) => (
          <div key={i} className={`truncate ${log.includes('FAIL') ? 'text-red-400' : log.includes('PASS') ? 'text-emerald-400' : 'text-slate-400'}`}>
            {log}
          </div>
        ))}
        <div className="h-4" /> {/* Spacer */}
      </div>

      <div className="p-3 bg-slate-900/50 border-t border-white/10">
        <div className="flex justify-between mb-2 text-[10px] text-slate-500 uppercase font-bold">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TestRunner;
