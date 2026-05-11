import React, { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';

type Theme = 'dark' | 'light' | 'high-contrast';
type FontSize = 'small' | 'normal' | 'large' | 'extra-large';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onClose }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('luxthumb-theme') as Theme | null;
    const savedFontSize = localStorage.getItem('luxthumb-font-size') as FontSize | null;
    const savedReducedMotion = localStorage.getItem('luxthumb-reduced-motion') === 'true';

    if (savedTheme) setTheme(savedTheme);
    if (savedFontSize) setFontSize(savedFontSize);
    setReducedMotion(savedReducedMotion);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('luxthumb-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleFontSizeChange = (newSize: FontSize) => {
    setFontSize(newSize);
    localStorage.setItem('luxthumb-font-size', newSize);

    const scale = {
      small: 0.85,
      normal: 1,
      large: 1.15,
      'extra-large': 1.3
    };

    document.documentElement.style.fontSize = (16 * scale[newSize]) + 'px';
  };

  const handleReducedMotionChange = (value: boolean) => {
    setReducedMotion(value);
    localStorage.setItem('luxthumb-reduced-motion', String(value));
    if (value) {
      document.documentElement.style.setProperty('--transition-fast', '0s');
      document.documentElement.style.setProperty('--transition-normal', '0s');
      document.documentElement.style.setProperty('--transition-slow', '0s');
    } else {
      document.documentElement.style.removeProperty('--transition-fast');
      document.documentElement.style.removeProperty('--transition-normal');
      document.documentElement.style.removeProperty('--transition-slow');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 cursor-pointer"
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-[#0A0A0A] border-l border-[#2A2A2A] z-50 flex flex-col animate-slide-in-right shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-[#2A2A2A] flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-[0.2em] text-[#C9A84C] uppercase font-bold mb-1">ACCESSIBILITY</div>
            <h2 className="text-lg font-serif italic text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors p-1"
            aria-label="Close accessibility settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {/* Theme Selector */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-white">Theme</h3>
            <div className="space-y-2">
              {[
                { value: 'dark' as const, label: 'Dark', desc: 'Premium dark mode' },
                { value: 'light' as const, label: 'Light', desc: 'Bright light mode' },
                { value: 'high-contrast' as const, label: 'High Contrast', desc: 'Maximum visibility' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={`w-full p-3 rounded border transition-all text-left ${
                    theme === option.value
                      ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                      : 'border-[#222] bg-[#111] hover:border-white/20'
                  }`}
                  aria-pressed={theme === option.value}
                  aria-label={`Switch to ${option.label} theme`}
                >
                  <div className={`text-[11px] font-bold ${theme === option.value ? 'text-[#C9A84C]' : 'text-white'}`}>
                    {option.label}
                  </div>
                  <div className="text-[9px] text-white/40">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size Selector */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-white">Font Size</h3>
            <div className="space-y-2">
              {[
                { value: 'small' as const, label: 'Small', desc: '85% size' },
                { value: 'normal' as const, label: 'Normal', desc: '100% size' },
                { value: 'large' as const, label: 'Large', desc: '115% size' },
                { value: 'extra-large' as const, label: 'Extra Large', desc: '130% size' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleFontSizeChange(option.value)}
                  className={`w-full p-3 rounded border transition-all text-left ${
                    fontSize === option.value
                      ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                      : 'border-[#222] bg-[#111] hover:border-white/20'
                  }`}
                  aria-pressed={fontSize === option.value}
                  aria-label={`Change font size to ${option.label}`}
                >
                  <div className={`text-[11px] font-bold ${fontSize === option.value ? 'text-[#C9A84C]' : 'text-white'}`}>
                    {option.label}
                  </div>
                  <div className="text-[9px] text-white/40">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Motion Preferences */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-white">Motion</h3>
            <button
              onClick={() => handleReducedMotionChange(!reducedMotion)}
              className={`w-full p-4 rounded border transition-all text-left flex items-center justify-between ${
                reducedMotion
                  ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                  : 'border-[#222] bg-[#111] hover:border-white/20'
              }`}
              aria-pressed={reducedMotion}
              aria-label="Toggle reduced motion preferences"
            >
              <div>
                <div className={`text-[11px] font-bold ${reducedMotion ? 'text-[#C9A84C]' : 'text-white'}`}>
                  Reduce Motion
                </div>
                <div className="text-[9px] text-white/40">Minimise animations</div>
              </div>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                reducedMotion ? 'border-[#C9A84C] bg-[#C9A84C]' : 'border-white/30'
              }`}>
                {reducedMotion && <span className="text-black text-xs font-bold">✓</span>}
              </div>
            </button>
          </div>

          {/* Info Section */}
          <div className="space-y-3 p-4 bg-[#111] border border-[#222] rounded">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#C9A84C]">Accessibility Info</h4>
            <ul className="space-y-2 text-[9px] text-white/60">
              <li>All interactive elements are keyboard accessible</li>
              <li>Focus indicators are clearly visible</li>
              <li>Colour is not the only means of conveying information</li>
              <li>Text has sufficient contrast ratios (WCAG AA)</li>
              <li>Settings persist across browser sessions</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
