import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../GameContext';
import { hsbToCss, hsbToRgb, getContrastColor, calculateScore } from '../lib/colorUtils';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { HSB } from '../types';

export const PickerScreen: React.FC = () => {
  const { state, submitRound } = useGame();
  const [pickerHsb, setPickerHsb] = useState<HSB>(state.pickerHsb);
  const colorCss = hsbToCss(pickerHsb.h, pickerHsb.s, pickerHsb.b);
  const rgb = hsbToRgb(pickerHsb.h, pickerHsb.s, pickerHsb.b);
  const textColor = getContrastColor(rgb.r, rgb.g, rgb.b);

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickerHsb(prev => ({ ...prev, h: parseInt(e.target.value) }));
  };

  const handleSatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickerHsb(prev => ({ ...prev, s: parseInt(e.target.value) }));
  };

  const handleBriChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickerHsb(prev => ({ ...prev, b: parseInt(e.target.value) }));
  };

  const handleSubmit = () => {
    const score = calculateScore(
      pickerHsb.h, pickerHsb.s, pickerHsb.b,
      state.currentHsb.h, state.currentHsb.s, state.currentHsb.b
    );
    submitRound(score, pickerHsb);
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen transition-colors duration-100 relative overflow-hidden"
      style={{ backgroundColor: colorCss }}
    >
      <div 
        className="absolute top-12 left-12 font-label tracking-[0.2em]"
        style={{ color: textColor, opacity: 0.6 }}
      >
        ROUND {state.round} / 5
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-center z-10 w-full max-w-4xl px-12">
        {/* Sliders */}
        <div className="flex-1 space-y-8 w-full">
          <div className="space-y-2">
            <div className="flex justify-between font-label tracking-widest text-sm" style={{ color: textColor }}>
              <span>HUE</span>
              <span>{pickerHsb.h}°</span>
            </div>
            <input 
              type="range" min="0" max="360" value={pickerHsb.h} onChange={handleHueChange}
              className="slider-premium"
              aria-label="Hue adjustment slider"
              style={{ background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between font-label tracking-widest text-sm" style={{ color: textColor }}>
              <span>SATURATION</span>
              <span>{pickerHsb.s}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={pickerHsb.s} onChange={handleSatChange}
              className="slider-premium"
              aria-label="Saturation adjustment slider"
              style={{ background: `linear-gradient(to right, ${hsbToCss(pickerHsb.h, 0, pickerHsb.b)}, ${hsbToCss(pickerHsb.h, 100, pickerHsb.b)})` }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between font-label tracking-widest text-sm" style={{ color: textColor }}>
              <span>BRIGHTNESS</span>
              <span>{pickerHsb.b}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={pickerHsb.b} onChange={handleBriChange}
              className="slider-premium"
              aria-label="Brightness adjustment slider"
              style={{ background: `linear-gradient(to right, #000, ${hsbToCss(pickerHsb.h, pickerHsb.s, 100)})` }}
            />
          </div>
        </div>

        {/* Info & Submit */}
        <div className="flex flex-col items-center md:items-start gap-8">
          <div className="text-center md:text-left" style={{ color: textColor }}>
            <div className="font-label tracking-[0.2em] text-sm opacity-60 mb-1">YOUR SELECTION</div>
            <div className="text-4xl font-display font-bold tracking-tight">
              H{pickerHsb.h} S{pickerHsb.s} B{pickerHsb.b}
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-tuc-ink shadow-xl hover:scale-110 active:scale-95 transition-all"
            aria-label="Submit selection and reveal score"
          >
            <Check size={40} />
          </button>
        </div>
      </div>
    </div>
  );
};
