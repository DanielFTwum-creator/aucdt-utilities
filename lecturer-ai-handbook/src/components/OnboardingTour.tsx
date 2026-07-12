import { useEffect, useState, useRef, CSSProperties } from 'react';
import { ChevronLeft, ChevronRight, X, Sparkles, Award, Play } from 'lucide-react';
import { SavedArtefact } from '../types';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface TourStep {
  title: string;
  description: string;
  targetId: string;
  tab: string;
  position: 'bottom' | 'top' | 'center';
}

export default function OnboardingTour({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
}: OnboardingTourProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const requestRef = useRef<number | null>(null);

  const steps: TourStep[] = [
    {
      title: "Welcome to your Digital Workspace",
      description: "Welcome, Ambassador! This Participant Workbook is your hands-on training companion. Here, we move beyond basic 'chatting' to help you create rigorous, moderation-ready course materials using generative AI.",
      targetId: "onboarding-header",
      tab: "block1",
      position: "bottom",
    },
    {
      title: "Modular Training Blocks",
      description: "Explore these tabs to access our four core training blocks. Learn how to write structured prompts, automate grading rubrics, design lesson slides, and configure strategic agentic sequences.",
      targetId: "onboarding-nav-tabs",
      tab: "block1",
      position: "bottom",
    },
    {
      title: "Take-Away Prompt Library",
      description: "Need a high-quality syllabus, rubric, or assignment? The Prompt Library contains pre-configured masterclass templates tailored for university college lectures. Adjust parameters, run them instantly, or copy them to your clipboard.",
      targetId: "onboarding-tab-templates",
      tab: "templates",
      position: "bottom",
    },
    {
      title: "My Briefcase & PDF Exporter",
      description: "This is your private, offline-first digital vault. Every syllabus, quiz, and slide deck you generate can be saved here. Organize them with custom course tags, copy to clipboard, or export them into formatted A4 PDFs ready for moderation boards or print.",
      targetId: "onboarding-tab-briefcase",
      tab: "briefcase",
      position: "bottom",
    },
  ];

  const currentStep = steps[currentStepIdx];

  // Force tab switch if step defines a specific tab
  useEffect(() => {
    if (!isOpen) return;
    if (activeTab !== currentStep.tab) {
      setActiveTab(currentStep.tab);
    }
  }, [currentStepIdx, isOpen]);

  // Recalculate target element position for spotlight
  const updateSpotlight = () => {
    if (!isOpen || currentStep.targetId === 'center') {
      setSpotlightRect(null);
      return;
    }

    const el = document.getElementById(currentStep.targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setSpotlightRect(rect);
    } else {
      setSpotlightRect(null);
    }

    requestRef.current = requestAnimationFrame(updateSpotlight);
  };

  useEffect(() => {
    if (isOpen) {
      // Auto scroll target into view
      setTimeout(() => {
        const el = document.getElementById(currentStep.targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);

      requestRef.current = requestAnimationFrame(updateSpotlight);
    } else {
      setSpotlightRect(null);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [currentStepIdx, isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('tuc_onboarding_tour_completed', 'true');
    onClose();
    setCurrentStepIdx(0);
  };

  // Determine tooltip style coordinates based on target elements
  let tooltipStyle: CSSProperties = {
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
  };

  if (spotlightRect) {
    const isMobile = window.innerWidth < 640;
    const padding = 12;
    const tooltipWidth = isMobile ? Math.min(320, window.innerWidth - 32) : 400;

    // Calculate vertical alignment
    let top = spotlightRect.bottom + window.scrollY + padding;
    let left = spotlightRect.left + window.scrollX + (spotlightRect.width / 2) - (tooltipWidth / 2);

    // Keep within bounds
    left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
    
    // Fallback placement logic
    if (top + 250 > window.innerHeight + window.scrollY) {
      top = spotlightRect.top + window.scrollY - 260; // place above
    }

    tooltipStyle = {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      width: `${tooltipWidth}px`,
      zIndex: 9999,
    };
  }

  return (
    <div className="absolute inset-0 z-[9990] pointer-events-none">
      {/* SVG Mask Overlay for the spotlight cutout */}
      <svg className="fixed inset-0 w-full h-full pointer-events-auto" style={{ zIndex: 9995 }}>
        <defs>
          <mask id="spotlight-mask">
            {/* White color permits background display (dimmed mask) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black color cuts out the spotlight completely (revealing element behind) */}
            {spotlightRect && (
              <rect
                x={spotlightRect.left - 8}
                y={spotlightRect.top - 8}
                width={spotlightRect.width + 16}
                height={spotlightRect.height + 16}
                rx="12"
                ry="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        {/* Dimmed background using mask */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 33, 71, 0.45)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Floating Spotlight Border (Visual Cue only) */}
      {spotlightRect && (
        <div
          className="fixed border-2 border-editorial-gold rounded-xl pointer-events-none transition-all duration-300 animate-pulse"
          style={{
            top: `${spotlightRect.top - 8}px`,
            left: `${spotlightRect.left - 8}px`,
            width: `${spotlightRect.width + 16}px`,
            height: `${spotlightRect.height + 16}px`,
            zIndex: 9997,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0), 0 0 15px rgba(212, 175, 55, 0.6)',
          }}
        />
      )}

      {/* Tooltip Card */}
      <div
        style={tooltipStyle}
        className="bg-white border-2 border-editorial-gold text-editorial-text-dark rounded-2xl shadow-xl p-5 sm:p-6 pointer-events-auto transition-all duration-300"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-editorial-gold/10 text-editorial-gold">
              <Sparkles size={16} />
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-editorial-text-muted">
              Step {currentStepIdx + 1} of {steps.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-editorial-text-light hover:text-editorial-accent rounded-lg hover:bg-editorial-secondary transition-colors cursor-pointer"
            title="Skip Onboarding Tour"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="font-serif font-bold text-base sm:text-lg text-editorial-accent leading-tight">
            {currentStep.title}
          </h3>
          <p className="font-sans text-xs sm:text-sm text-editorial-text-light leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 mt-5 border-t border-editorial-border/60">
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              currentStepIdx === 0
                ? 'opacity-40 cursor-not-allowed text-editorial-text-muted'
                : 'text-editorial-text-light hover:bg-editorial-secondary hover:text-editorial-accent'
            }`}
          >
            <ChevronLeft size={14} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentStepIdx ? 'bg-editorial-gold w-3' : 'bg-editorial-border'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-editorial-accent hover:bg-editorial-accent/90 rounded-lg shadow transition-all cursor-pointer"
          >
            <span>{currentStepIdx === steps.length - 1 ? 'Finish' : 'Next'}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
