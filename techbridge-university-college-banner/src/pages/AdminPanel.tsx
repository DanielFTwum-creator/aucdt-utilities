import React, { useRef, useState, useEffect } from 'react';
import { useBannerColors, FONT_OPTIONS } from '../context/ColorContext';
import TechbridgeBanner from '../components/TechbridgeBanner';

const BANNER_W = 640;
const BANNER_H = 850;

export default function AdminPanel() {
  const { colors, fonts, updateColor, updateFont } = useBannerColors();
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.55);

  useEffect(() => {
    const update = () => {
      if (previewRef.current) {
        const available = previewRef.current.clientWidth - 48;
        const next = Math.min(available / BANNER_W, 1);
        setScale(next);
        previewRef.current.style.setProperty('--preview-scale', String(next));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const colorInputs = [
    { id: 'primary',       label: 'Primary (Gold)',    value: colors.primary },
    { id: 'secondary',     label: 'Secondary (Ink)',   value: colors.secondary },
    { id: 'accent',        label: 'Accent (Cream)',    value: colors.accent },
    { id: 'textPrimary',   label: 'Text Primary',      value: colors.textPrimary },
    { id: 'textSecondary', label: 'Text Secondary',    value: colors.textSecondary },
  ];

  return (
    <div className="min-h-screen bg-[#0F0C07] text-white p-8 font-sans">
      <h1 className="text-4xl font-black text-[#C8A84B] mb-4">Banner Colorwheel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* Left — colour + font controls */}
        <div className="space-y-6">
          <div className="bg-[#141210] border border-[#C8A84B] p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Color Controls</h2>
            <div className="space-y-4">
              {colorInputs.map(color => (
                <div key={color.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="font-medium">{color.label}</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={color.value}
                      onChange={(e) => updateColor(color.id, e.target.value)}
                      className="bg-black text-white px-2 py-1 rounded border border-gray-600 text-sm w-24 font-mono"
                      aria-label={`Hex value for ${color.label}`}
                    />
                    <input
                      type="color"
                      value={color.value}
                      onChange={(e) => updateColor(color.id, e.target.value)}
                      className="w-8 h-8 rounded-full cursor-pointer border-0"
                      aria-label={`Pick colour for ${color.label}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141210] border border-[#C8A84B] p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Font Controls</h2>
            <div className="space-y-4">
              {([
                { id: 'heading', label: 'Heading Font', value: fonts.heading },
                { id: 'body',    label: 'Body Font',    value: fonts.body },
              ] as const).map(slot => (
                <div key={slot.id} className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-sm font-medium mb-2 text-gray-300">{slot.label}</div>
                  <div className="grid grid-cols-2 gap-2">
                    {FONT_OPTIONS.map(f => (
                      <button
                        key={f.family}
                        type="button"
                        onClick={() => updateFont(slot.id, f.family)}
                        className={`px-3 py-2 rounded text-sm text-left transition-colors ${
                          slot.value === f.family
                            ? 'bg-[#C8A84B] text-black font-bold'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                        aria-pressed={slot.value === f.family ? 'true' : 'false'}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Active: <span className="text-[#C8A84B]">{slot.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — live banner preview */}
        <div
          ref={previewRef}
          className="bg-[#141210] border border-[#C8A84B] p-6 rounded-lg shadow-xl"
        >
          <h2 className="text-xl font-bold mb-4">
            Live Preview
            <span className="ml-2 text-xs text-gray-400 font-normal">{Math.round(scale * 100)}%</span>
          </h2>
          <div className="banner-preview-viewport">
            <div className="banner-preview-scaler">
              <TechbridgeBanner />
            </div>
          </div>
        </div>

      </div>

      <div className="mt-8">
        <a href="#/" className="text-[#C8A84B] hover:underline">← Back to Banner</a>
      </div>
    </div>
  );
}
