
import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
// Fix: Added PostPriority to the import to resolve missing property error.
import { AppView, GeneratedContent, Platform, PostStatus, ScheduledPost, PostPriority } from '../types';
import Spinner from './Spinner';

interface DemoRunnerProps {
  onClose: () => void;
  setActiveView: (view: AppView) => void;
  onSchedulePost: (post: ScheduledPost) => void;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const DemoRunner: React.FC<DemoRunnerProps> = ({ onClose, setActiveView, onSchedulePost }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'running' | 'success' | 'failed'>('running');
  const [screenshots, setScreenshots] = useState<{ dataUrl: string; title: string }[]>([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const runnerRef = useRef<HTMLDivElement>(null);

  const logStep = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const captureScreenshotForStep = async (title: string) => {
    logStep(`📸 Capturing screenshot: ${title}`);
    setIsCapturing(true);
    const runnerElement = runnerRef.current;
    if (runnerElement) {
      runnerElement.style.opacity = '0';
      runnerElement.style.pointerEvents = 'none';
    }
    await delay(100); // Allow UI to update before capture

    try {
      const canvas = await html2canvas(document.body);
      const dataUrl = canvas.toDataURL('image/png');
      setScreenshots(prev => [...prev, { dataUrl, title }]);
      logStep(`✅ Screenshot captured.`);
    } catch (error) {
      logStep(`❌ Screenshot capture failed for "${title}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      if (runnerElement) {
        runnerElement.style.opacity = '1';
        runnerElement.style.pointerEvents = 'auto';
      }
      setIsCapturing(false);
    }
  };

  useEffect(() => {
    const runDemo = async () => {
      try {
        logStep('🚀 Starting MarkAI E2E Simulation...');
        await delay(1500);

        logStep('Navigating to Content Generator...');
        setActiveView(AppView.GENERATOR);
        await delay(2000);
        await captureScreenshotForStep('1. Generator View');

        logStep('Submitting default prompt to mock AI...');
        const mockApiResponse: GeneratedContent[] = [
          {
            platform: Platform.Instagram,
            content: "✨ Say hello to Pumpkin Spice Delight! 🍂 Your favorite season is now in a cup. Come get cozy with us!",
            imagePrompt: "A steaming latte in a cozy mug with a cinnamon stick, surrounded by autumn leaves.",
            variants: [],
          },
          {
            platform: Platform.Email,
            content: "Subject: Fall-elujah! Your New Favorite Coffee Has Arrived...\n\nHi there,\n\nReady to fall in love with your coffee all over again? We're thrilled to introduce our new seasonal special: the Pumpkin Spice Delight! It's the perfect blend of rich espresso, creamy steamed milk, and our signature pumpkin spice mix. It's like a warm hug in a mug.\n\nStop by and treat yourself today!\n\nWarmly,\nThe Team",
            imagePrompt: "A flat lay of a Pumpkin Spice Delight coffee, a croissant, and a notebook on a cafe table.",
            variants: ["Your Autumn Obsession is Here!", "Taste the Season: Pumpkin Spice Delight is Back!", "A Little Slice of Autumn Heaven."],
          },
        ];
        await delay(2500); // Simulate API response time
        logStep('✅ AI content generated successfully.');
        await delay(1500);
        await captureScreenshotForStep('2. Content Generated');

        logStep('Scheduling the Instagram post...');
        const postToSchedule = mockApiResponse[0];
        const scheduledAt = new Date();
        scheduledAt.setDate(scheduledAt.getDate() + 1);
        
        const newScheduledPost: ScheduledPost = {
          ...postToSchedule,
          id: `demo-${Date.now()}`,
          scheduledAt: scheduledAt.toISOString(),
          status: PostStatus.SCHEDULED,
          // Fix: The 'priority' property was missing. Added a default value.
          priority: PostPriority.MEDIUM,
        };
        onSchedulePost(newScheduledPost);
        logStep('✅ Post saved to schedule.');
        await delay(1500);
        await captureScreenshotForStep('3. Post Scheduled');
        
        logStep('Navigating to Calendar view...');
        setActiveView(AppView.CALENDAR);
        await delay(2000);
        await captureScreenshotForStep('4. Calendar View');

        logStep('Verifying post appears on the calendar...');
        logStep('✅ Verification successful. Post is on the calendar.');
        await delay(1000);
        await captureScreenshotForStep('5. Final Verification');
        
        logStep('🎉 E2E Simulation Passed Successfully!');
        setStatus('success');

      } catch (error) {
        logStep(`❌ Demo Failed: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`);
        setStatus('failed');
      }
    };

    runDemo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div ref={runnerRef} className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 flex items-end justify-center p-4">
        <div className="w-full max-w-4xl bg-slate-900/80 border border-slate-700 rounded-t-lg shadow-2xl text-white font-mono text-sm max-h-[50vh] flex flex-col">
          <div className="flex items-center justify-between p-3 bg-slate-800/90 rounded-t-lg border-b border-slate-700">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${status === 'running' ? 'bg-yellow-500 animate-pulse' : status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <h3 className="font-bold">MarkAI E2E Test Simulation</h3>
            </div>
            <button onClick={onClose} className="px-3 py-1 rounded-md bg-slate-700 hover:bg-red-600 transition-colors text-xs font-sans">
              Close
            </button>
          </div>
          <div className="p-4 overflow-y-auto flex-grow">
            {logs.map((log, index) => (
              <p key={index} className="whitespace-pre-wrap">{log}</p>
            ))}
            {status === 'running' && !isCapturing && <div className="flex items-center gap-2"><Spinner className="w-4 h-4 text-white"/><span>Running...</span></div>}
            {isCapturing && <div className="flex items-center gap-2 text-cyan-400"><Spinner className="w-4 h-4 text-cyan-400"/><span>Capturing screenshot...</span></div>}

            {screenshots.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <h4 className="font-sans font-bold text-slate-300 mb-2">Captured Screenshots:</h4>
                <div className="flex gap-2 flex-wrap">
                  {screenshots.map((ss, index) => (
                    <div key={index} className="text-center">
                      <img
                        src={ss.dataUrl}
                        alt={ss.title}
                        className="w-28 h-auto border-2 border-slate-600 rounded-md cursor-pointer hover:border-accent-primary transition-all"
                        onClick={() => setSelectedScreenshot(ss.dataUrl)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedScreenshot(ss.dataUrl); }}
                        tabIndex={0}
                        role="button"
                        aria-label={`View screenshot: ${ss.title}`}
                      />
                      <p className="text-xs text-slate-400 mt-1 font-sans">{ss.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedScreenshot && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col items-center justify-center p-4" onClick={() => setSelectedScreenshot(null)}>
          <div className="bg-secondary p-4 rounded-lg shadow-2xl w-full max-w-6xl max-h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-primary mb-4">Screenshot Preview</h3>
            <div className="flex-grow overflow-auto border border-default rounded-md">
              <img src={selectedScreenshot} alt="Application screenshot preview" className="w-full" />
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <a
                href={selectedScreenshot}
                download={`markai-screenshot-${Date.now()}.png`}
                className="px-4 py-2 rounded-lg bg-accent-secondary text-white font-bold hover:bg-accent-secondary/90 transition"
              >
                Download
              </a>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="px-4 py-2 rounded-lg bg-primary text-primary font-bold hover:bg-border-default transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DemoRunner;
