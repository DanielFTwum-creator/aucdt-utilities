/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { Download, Copy, Wand2, Code, GraduationCap, Palette, BarChart3, Check } from 'lucide-react';

interface TextElementPosition {
  x: number;
  y: number;
  alignment: 'left' | 'center' | 'right';
}

interface FormData {
  degree: string;
  institution: string;
  tagline: string;
  stat1: string;
  stat1label: string;
  stat2: string;
  stat2label: string;
  stat3: string;
  stat3label: string;
  badge: string;
  ctaText: string;
  color: string;
  fontColor: string;
  fontFamily: string;
  positions: {
    badge: TextElementPosition;
    degree: TextElementPosition;
    tagline: TextElementPosition;
    stats: TextElementPosition;
    cta: TextElementPosition;
  };
  degreeGradient: boolean;
  gradientFrom: string;
  gradientTo: string;
  overlayPreset: string;
  buttonStyle: 'solid' | 'outline' | 'gradient';
  buttonGradientFrom: string;
  buttonGradientTo: string;
  contentPadding: number;
  badgeStyle: 'pill' | 'animated';
  palette: string;
  videoZoom: number;
}

const DEFAULT_POSITIONS = {
  badge: { x: 0, y: 0, alignment: 'left' as const },
  degree: { x: 0, y: 10, alignment: 'left' as const },
  tagline: { x: 0, y: 30, alignment: 'left' as const },
  stats: { x: 0, y: 55, alignment: 'center' as const },
  cta: { x: 0, y: 85, alignment: 'center' as const },
};

const COLOUR_PALETTES = {
  fashion: { name: 'Fashion Rose', accent: '#f43f5e', gradFrom: '#ffe4e6', gradTo: '#ffffff', glow: 'rgba(244,63,94,0.15)' },
  jewellery: { name: 'Jewellery Gold', accent: '#fbbf24', gradFrom: '#fde68a', gradTo: '#ffffff', glow: 'rgba(217,119,6,0.35)' },
  digital: { name: 'Digital Cyan', accent: '#06b6d4', gradFrom: '#a5f3fc', gradTo: '#ffffff', glow: 'rgba(37,99,235,0.5)' },
  product: { name: 'Product Emerald', accent: '#10b981', gradFrom: '#d1fae5', gradTo: '#ffffff', glow: 'rgba(16,185,129,0.1)' },
  gold: { name: 'TUC Gold', accent: '#C8A84B', gradFrom: '#fef3c7', gradTo: '#ffffff', glow: 'rgba(200,168,75,0.25)' },
};

const OVERLAY_PRESETS = {
  fashion: 'linear-gradient(to bottom, rgba(90,0,20,0.62) 0%, rgba(45,0,10,0.55) 22%, rgba(8,0,2,0.7) 48%, rgba(3,3,5,0.92) 82%, #030305 100%)',
  jewellery: 'linear-gradient(to bottom, rgba(102,0,22,0.85) 0%, rgba(58,0,13,0.82) 50%, rgba(0,0,0,0.9) 100%)',
  digital: 'linear-gradient(to bottom, rgba(4,3,26,0.6) 0%, rgba(10,10,46,0.75) 50%, rgba(3,3,15,0.95) 100%)',
  product: 'linear-gradient(to top, #030305 0%, rgba(3,3,5,0.28) 88%, transparent 100%)',
  dark: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.9) 100%)',
  none: 'none',
};

const TEMPLATES = {
  fashion: {
    degree: 'BTech Fashion Design Technology',
    institution: 'Techbridge University College',
    tagline: 'Sustainable design, technical excellence, creative leadership.',
    stat1: '4',
    stat1label: 'Years',
    stat2: 'Industry',
    stat2label: 'Focused',
    stat3: 'Jan',
    stat3label: '2027',
    badge: 'ADMISSIONS OPEN',
    ctaText: 'Apply Now',
    color: '#f43f5e',
    fontColor: '#ffffff',
    fontFamily: 'Outfit',
    positions: DEFAULT_POSITIONS,
    degreeGradient: true,
    gradientFrom: '#ffe4e6',
    gradientTo: '#ffffff',
    overlayPreset: 'fashion',
    buttonStyle: 'solid' as const,
    buttonGradientFrom: '#f9a8d4',
    buttonGradientTo: '#ffffff',
    contentPadding: 6,
    badgeStyle: 'animated' as const,
    palette: 'fashion',
    videoZoom: 1,
  },
  jewellery: {
    degree: 'B.A. Jewellery Design Technology',
    institution: 'Techbridge University College',
    tagline: 'Precious metals, alternative materials, 3D design mastery.',
    stat1: '4',
    stat1label: 'Years',
    stat2: 'Studio',
    stat2label: 'Based',
    stat3: 'Jan',
    stat3label: '2027',
    badge: 'ADMISSIONS OPEN',
    ctaText: 'Enrol Now',
    color: '#fbbf24',
    fontColor: '#ffffff',
    fontFamily: 'Outfit',
    positions: DEFAULT_POSITIONS,
    degreeGradient: true,
    gradientFrom: '#fde68a',
    gradientTo: '#ffffff',
    overlayPreset: 'jewellery',
    buttonStyle: 'gradient' as const,
    buttonGradientFrom: '#fde68a',
    buttonGradientTo: '#d97706',
    contentPadding: 6,
    badgeStyle: 'animated' as const,
    palette: 'jewellery',
    videoZoom: 1,
  },
  digital: {
    degree: 'BTech Digital Media & Communication Design',
    institution: 'Techbridge University College',
    tagline: 'Interactive storytelling, motion graphics, mobile & web design.',
    stat1: '4',
    stat1label: 'Years',
    stat2: 'Digital',
    stat2label: 'Creative',
    stat3: 'Jan',
    stat3label: '2027',
    badge: 'NOW ENROLLING',
    ctaText: 'Start Creating',
    color: '#8b5cf6',
    fontColor: '#ffffff',
    fontFamily: 'Space Grotesk',
    positions: DEFAULT_POSITIONS,
    degreeGradient: true,
    gradientFrom: '#a5f3fc',
    gradientTo: '#ffffff',
    overlayPreset: 'digital',
    buttonStyle: 'gradient' as const,
    buttonGradientFrom: '#67e8f9',
    buttonGradientTo: '#2dd4bf',
    contentPadding: 6,
    badgeStyle: 'animated' as const,
    palette: 'digital',
    videoZoom: 1,
  },
  product: {
    degree: 'B.A. Product Design & Entrepreneurship',
    institution: 'Techbridge University College',
    tagline: 'Functional design, problem-solving, venture creation.',
    stat1: '4',
    stat1label: 'Years',
    stat2: 'Real-world',
    stat2label: 'Ventures',
    stat3: 'Jan',
    stat3label: '2027',
    badge: 'APPLICATIONS OPEN',
    ctaText: 'Apply Today',
    color: '#06b6d4',
    fontColor: '#ffffff',
    fontFamily: 'Inter',
    positions: DEFAULT_POSITIONS,
    degreeGradient: false,
    gradientFrom: '#ffffff',
    gradientTo: '#ffffff',
    overlayPreset: 'product',
    buttonStyle: 'solid' as const,
    buttonGradientFrom: '#ffffff',
    buttonGradientTo: '#ffffff',
    contentPadding: 6,
    badgeStyle: 'animated' as const,
    palette: 'product',
    videoZoom: 1,
  },
};

function generateHTML(formData: FormData): string {
  const rgb = formData.color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  const rgbStr = rgb ? `${parseInt(rgb[1], 16)},${parseInt(rgb[2], 16)},${parseInt(rgb[3], 16)}` : '244,63,94';
  const { positions } = formData;
  const paddingMap = { 4: '16px', 5: '20px', 6: '24px', 7: '28px', 8: '32px' };
  const contentPadding = paddingMap[formData.contentPadding as keyof typeof paddingMap] || '24px';

  const getAlignStyle = (alignment: string) => {
    switch (alignment) {
      case 'left': return 'text-left left-6';
      case 'right': return 'text-right right-6';
      default: return 'text-center left-1/2 transform -translate-x-1/2';
    }
  };

  const getButtonStyle = () => {
    switch (formData.buttonStyle) {
      case 'outline': return 'background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #ffffff;';
      case 'gradient': return `background: linear-gradient(to right, ${formData.buttonGradientFrom}, ${formData.buttonGradientTo}); color: #000000;`;
      default: return 'background: #ffffff; color: #000000;';
    }
  };

  const degreeGradientStyle = formData.degreeGradient
    ? `.gradient-text { background: linear-gradient(180deg, ${formData.gradientFrom}, ${formData.gradientTo}); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }`
    : `.gradient-text { color: ${formData.fontColor}; }`;

  const badgeAnimation = formData.badgeStyle === 'animated'
    ? `@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
       .ping-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: currentColor; margin-right: 6px; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${formData.degree} — ${formData.institution}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<style>
  body { background: #030305; font-family: '${formData.fontFamily}', sans-serif; color: ${formData.fontColor}; }
  ${degreeGradientStyle}
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
  .positioned-element { position: absolute; }
  ${badgeAnimation}
</style>
</head>
<body class="flex items-center justify-center min-h-screen p-4">
  <div class="relative w-full max-w-[390px] aspect-[9/16] rounded-[2.8rem] bg-black border-[10px] border-zinc-900 overflow-hidden shadow-2xl">
    <video
      src="https://techbridge.edu.gh/static/campus_tour.mp4"
      autoplay
      loop
      muted
      playsinline
      class="absolute inset-0 w-full h-full object-cover z-0"
      style="transform: scale(${formData.videoZoom}); transform-origin: center center;"
    ></video>
    <div style="position:absolute;inset:0;background:${OVERLAY_PRESETS[formData.overlayPreset as keyof typeof OVERLAY_PRESETS] || 'none'};z-index:1;pointer-events:none;"></div>
    <div class="absolute top-3 right-3 z-20 opacity-70 hover:opacity-100 transition-opacity">
      <img src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" alt="TUC Logo" class="h-20 w-20 object-contain" />
    </div>
    <div class="relative z-10 w-full h-full p-6 pt-10" style="padding: ${contentPadding};">
      ${formData.badge ? `<div class="positioned-element inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold uppercase tracking-wider w-fit fade-up" style="top: calc(${positions.badge.y}% + 2.5rem); left: ${positions.badge.x}%; animation-delay: 0s">${formData.badgeStyle === 'animated' ? `<span class="ping-dot"></span>` : ''}${formData.badge}</div>` : ''}
      <h1 class="positioned-element font-black text-[28px] leading-[1.1] tracking-[-0.02em] gradient-text fade-up ${getAlignStyle(positions.degree.alignment)}" style="top: calc(${positions.degree.y}% + 2.5rem); animation-delay: 0.1s; width: calc(100% - 3rem); word-wrap: break-word; overflow-wrap: break-word; hyphens: auto;">${formData.degree}</h1>
      <p class="positioned-element text-[14px] leading-snug fade-up ${getAlignStyle(positions.tagline.alignment)}" style="top: calc(${positions.tagline.y}% + 2.5rem); animation-delay: 0.2s; color: ${formData.fontColor}99; width: calc(100% - 3rem);">${formData.tagline}</p>
      <div class="positioned-element grid grid-cols-3 gap-2.5 fade-up" style="top: calc(${positions.stats.y}% + 2.5rem); left: 0; right: 0; width: 100%; padding: 0 1.5rem; animation-delay: 0.3s">
        <div class="bg-white/5 rounded-2xl p-3 text-center">
            <div class="font-bold text-[22px]">${formData.stat1}</div>
            <div class="text-[10px] uppercase tracking-wider mt-1 opacity-70">${formData.stat1label}</div>
        </div>
        <div class="bg-white/5 rounded-2xl p-3 text-center">
            <div class="font-bold text-[19px]">${formData.stat2}</div>
            <div class="text-[10px] uppercase tracking-wider mt-1 opacity-70">${formData.stat2label}</div>
        </div>
        <div class="bg-white/5 rounded-2xl p-3 text-center">
            <div class="font-bold text-[19px]">${formData.stat3}</div>
            <div class="text-[10px] uppercase tracking-wider mt-1 opacity-70">${formData.stat3label}</div>
        </div>
      </div>
      <button class="positioned-element w-[calc(100%-3rem)] p-3 rounded-xl font-semibold text-sm fade-up" style="top: calc(${positions.cta.y}% + 2.5rem); left: 1.5rem; animation-delay: 0.4s; ${getButtonStyle()}">${formData.ctaText}</button>
    </div>
  </div>
</body>
</html>`;
}

function FieldInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold uppercase tracking-wide text-white/60 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition"
      />
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.currentTarget.value);
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const val = (e.target as HTMLInputElement).value;
    onChange(val);
  };

  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold uppercase tracking-wide text-white/60 mb-2">
        {label}
      </label>
      <input
        type="color"
        value={value && value.startsWith('#') ? value : (value || '#000000')}
        onChange={handleChange}
        onInput={handleInput}
        aria-label={label}
        className="w-full h-10 bg-white/5 border border-white/10 rounded-lg cursor-pointer"
        style={{ colorScheme: 'dark' }}
      />
    </div>
  );
}

function PaletteSelector({
  palette,
  onChange
}: {
  palette: string;
  onChange: (key: string) => void;
}) {
  const palettes = Object.entries(COLOUR_PALETTES) as [string, any][];
  return (
    <div className="mb-6">
      <label className="text-xs font-semibold uppercase tracking-wide text-white/70 mb-3 block">Colour Palette</label>
      <div className="grid grid-cols-5 gap-2">
        {palettes.map(([key, pal]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`h-10 rounded-lg border-2 transition ${
              palette === key
                ? 'border-white/50 ring-2 ring-white/30'
                : 'border-white/10 hover:border-white/20'
            }`}
            style={{ backgroundColor: pal.accent }}
            title={pal.name}
          />
        ))}
      </div>
    </div>
  );
}

function ButtonStyleSelector({
  buttonStyle,
  gradientFrom,
  gradientTo,
  onChange,
  onGradientChange
}: {
  buttonStyle: string;
  gradientFrom: string;
  gradientTo: string;
  onChange: (style: 'solid' | 'outline' | 'gradient') => void;
  onGradientChange: (from: string, to: string) => void;
}) {
  return (
    <div className="mb-6 pb-6 border-b border-white/10">
      <label className="text-xs font-semibold uppercase tracking-wide text-white/70 mb-3 block">Button Style</label>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {(['solid', 'outline', 'gradient'] as const).map((style) => (
          <button
            key={style}
            type="button"
            onClick={() => onChange(style)}
            className={`py-2 px-2 text-xs font-semibold rounded-lg transition capitalize ${
              buttonStyle === style
                ? 'bg-white/30 border border-white/50 text-white'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            {style}
          </button>
        ))}
      </div>
      {buttonStyle === 'gradient' && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-white/50 mb-1 block">From</label>
            <input
              type="color"
              value={gradientFrom}
              onChange={(e) => onGradientChange(e.target.value, gradientTo)}
              className="w-full h-8 rounded-lg cursor-pointer border border-white/10"
            />
          </div>
          <div>
            <label className="text-[11px] text-white/50 mb-1 block">To</label>
            <input
              type="color"
              value={gradientTo}
              onChange={(e) => onGradientChange(gradientFrom, e.target.value)}
              className="w-full h-8 rounded-lg cursor-pointer border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function OverlaySelector({
  overlayPreset,
  onChange
}: {
  overlayPreset: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="mb-6">
      <label className="text-xs font-semibold uppercase tracking-wide text-white/70 mb-3 block">Hero Overlay</label>
      <div className="grid grid-cols-3 gap-2">
        {(['fashion', 'jewellery', 'digital', 'product', 'dark', 'none'] as const).map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`py-2 px-2 text-xs font-semibold rounded-lg transition capitalize ${
              overlayPreset === preset
                ? 'bg-white/30 border border-white/50 text-white'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}

function GradientTextToggle({
  enabled,
  gradientFrom,
  gradientTo,
  onChange,
  onColourChange
}: {
  enabled: boolean;
  gradientFrom: string;
  gradientTo: string;
  onChange: (v: boolean) => void;
  onColourChange: (from: string, to: string) => void;
}) {
  return (
    <div className="mb-6 pb-6 border-b border-white/10">
      <label className="text-xs font-semibold uppercase tracking-wide text-white/70 mb-3 block">Gradient Text on Degree</label>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`w-full py-2 px-3 rounded-lg font-semibold text-sm transition ${
          enabled
            ? 'bg-white/20 border border-white/30 text-white'
            : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
        }`}
      >
        {enabled ? '✓ Enabled' : 'Disabled'}
      </button>
      {enabled && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <label className="text-[11px] text-white/50 mb-1 block">From</label>
            <input
              type="color"
              value={gradientFrom}
              onChange={(e) => onColourChange(e.target.value, gradientTo)}
              className="w-full h-8 rounded-lg cursor-pointer border border-white/10"
            />
          </div>
          <div>
            <label className="text-[11px] text-white/50 mb-1 block">To</label>
            <input
              type="color"
              value={gradientTo}
              onChange={(e) => onColourChange(gradientFrom, e.target.value)}
              className="w-full h-8 rounded-lg cursor-pointer border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SpacingSlider({
  value,
  onChange
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const paddingMap: Record<number, string> = { 4: '16px', 5: '20px', 6: '24px', 7: '28px', 8: '32px' };
  return (
    <div className="mb-6">
      <label className="text-xs font-semibold uppercase tracking-wide text-white/70 mb-2 block">Content Padding: {paddingMap[value]}</label>
      <input
        type="range"
        min="4"
        max="8"
        step="1"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white/50"
      />
    </div>
  );
}

function VideoZoomSlider({
  value,
  onChange
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const zoomPercent = Math.round(value * 100);
  return (
    <div className="mb-6 pb-6 border-b border-white/10">
      <label className="text-xs font-semibold uppercase tracking-wide text-white/70 mb-2 block">Video Zoom: {zoomPercent}%</label>
      <input
        type="range"
        min="0.8"
        max="2"
        step="0.1"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white/50"
      />
      <p className="text-[10px] text-white/40 mt-2">Zoom in/out the background video</p>
    </div>
  );
}

function BadgeStyleToggle({
  style,
  onChange
}: {
  style: string;
  onChange: (s: 'pill' | 'animated') => void;
}) {
  return (
    <div className="mb-6">
      <label className="text-xs font-semibold uppercase tracking-wide text-white/70 mb-3 block">Badge Style</label>
      <div className="grid grid-cols-2 gap-2">
        {(['pill', 'animated'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={`py-2 px-2 text-xs font-semibold rounded-lg transition capitalize ${
              style === s
                ? 'bg-white/30 border border-white/50 text-white'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function PositionControls({
  label,
  position,
  onChange
}: {
  label: string;
  position: TextElementPosition;
  onChange: (pos: TextElementPosition) => void;
}) {
  return (
    <div className="mb-6 pb-6 border-b border-white/10">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-white/70 mb-3">{label}</h4>
      <div className="space-y-3">
        <div>
          <label className="text-[11px] text-white/50 mb-1 block">Vertical Position: {position.y}%</label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={position.y}
            onChange={(e) => onChange({...position, y: parseInt(e.target.value)})}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white/50"
          />
        </div>
        <div>
          <label className="text-[11px] text-white/50 mb-1 block">Horizontal Offset: {position.x}%</label>
          <input
            type="range"
            min="-20"
            max="20"
            step="5"
            value={position.x}
            onChange={(e) => onChange({...position, x: parseInt(e.target.value)})}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white/50"
          />
        </div>
        <div>
          <label className="text-[11px] text-white/50 mb-2 block">Alignment</label>
          <div className="grid grid-cols-3 gap-2">
            {(['left', 'center', 'right'] as const).map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => onChange({...position, alignment: align})}
                className={`py-2 px-2 text-xs font-semibold rounded-lg transition capitalize ${
                  position.alignment === align
                    ? 'bg-white/30 border border-white/50 text-white'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                {align}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlPanel({
  formData,
  setFormData,
  onDownload,
  onCopy,
  copiedId,
  onAIGenerate
}: {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onDownload: () => void;
  onCopy: () => void;
  copiedId: string | null;
  onAIGenerate: () => void;
}) {
  const updatePosition = (key: keyof typeof formData.positions, position: TextElementPosition) => {
    setFormData({
      ...formData,
      positions: {
        ...formData.positions,
        [key]: position
      }
    });
  };

  const updatePalette = (paletteKey: string) => {
    const palette = COLOUR_PALETTES[paletteKey as keyof typeof COLOUR_PALETTES];
    if (palette) {
      setFormData({
        ...formData,
        color: palette.accent,
        gradientFrom: palette.gradFrom,
        gradientTo: palette.gradTo,
        palette: paletteKey,
      });
    }
  };

  return (
    <div className="w-96 bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-white/10 to-transparent p-6 border-b border-white/10">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <GraduationCap size={20} />
          Program Builder
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Program Info */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-4 flex items-center gap-2">
            <GraduationCap size={14} />
            Program Info
          </h3>
          <FieldInput
            label="Degree"
            value={formData.degree}
            onChange={(v) => setFormData({...formData, degree: v})}
          />
          <FieldInput
            label="Institution"
            value={formData.institution}
            onChange={(v) => setFormData({...formData, institution: v})}
          />
          <FieldInput
            label="Tagline"
            value={formData.tagline}
            onChange={(v) => setFormData({...formData, tagline: v})}
          />
          <FieldInput
            label="Badge"
            value={formData.badge}
            onChange={(v) => setFormData({...formData, badge: v})}
          />
        </div>

        {/* Statistics */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-4 flex items-center gap-2">
            <BarChart3 size={14} />
            Statistics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <FieldInput
              label="Stat 1"
              value={formData.stat1}
              onChange={(v) => setFormData({...formData, stat1: v})}
            />
            <FieldInput
              label="Label"
              value={formData.stat1label}
              onChange={(v) => setFormData({...formData, stat1label: v})}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FieldInput
              label="Stat 2"
              value={formData.stat2}
              onChange={(v) => setFormData({...formData, stat2: v})}
            />
            <FieldInput
              label="Label"
              value={formData.stat2label}
              onChange={(v) => setFormData({...formData, stat2label: v})}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FieldInput
              label="Stat 3"
              value={formData.stat3}
              onChange={(v) => setFormData({...formData, stat3: v})}
            />
            <FieldInput
              label="Label"
              value={formData.stat3label}
              onChange={(v) => setFormData({...formData, stat3label: v})}
            />
          </div>
          <FieldInput
            label="CTA Button"
            value={formData.ctaText}
            onChange={(v) => setFormData({...formData, ctaText: v})}
          />
        </div>

        {/* Design */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-4 flex items-center gap-2">
            <Palette size={14} />
            Design
          </h3>
          <ColorInput
            label="Theme Color"
            value={formData.color}
            onChange={(v) => setFormData({...formData, color: v})}
          />
          <ColorInput
            label="Font Color"
            value={formData.fontColor}
            onChange={(v) => setFormData({...formData, fontColor: v})}
          />
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wide text-white/60 mb-2">
              Font Family
            </label>
            <select
              value={formData.fontFamily}
              onChange={(e) => setFormData({...formData, fontFamily: e.target.value})}
              aria-label="Font family selection"
              className="w-full text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition"
            >
              <option value="Outfit">Outfit</option>
              <option value="Space Grotesk">Space Grotesk</option>
              <option value="Inter">Inter</option>
            </select>
          </div>
        </div>

        {/* Palette & Gradients */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-4 flex items-center gap-2">
            🎨 Palette & Gradients
          </h3>
          <PaletteSelector
            palette={formData.palette}
            onChange={updatePalette}
          />
          <GradientTextToggle
            enabled={formData.degreeGradient}
            gradientFrom={formData.gradientFrom}
            gradientTo={formData.gradientTo}
            onChange={(v) => setFormData({...formData, degreeGradient: v})}
            onColourChange={(from, to) => setFormData({...formData, gradientFrom: from, gradientTo: to})}
          />
          <OverlaySelector
            overlayPreset={formData.overlayPreset}
            onChange={(v) => setFormData({...formData, overlayPreset: v})}
          />
        </div>

        {/* Style & Spacing */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-4 flex items-center gap-2">
            ⚙️ Style & Spacing
          </h3>
          <ButtonStyleSelector
            buttonStyle={formData.buttonStyle}
            gradientFrom={formData.buttonGradientFrom}
            gradientTo={formData.buttonGradientTo}
            onChange={(style) => setFormData({...formData, buttonStyle: style})}
            onGradientChange={(from, to) => setFormData({...formData, buttonGradientFrom: from, buttonGradientTo: to})}
          />
          <BadgeStyleToggle
            style={formData.badgeStyle}
            onChange={(s) => setFormData({...formData, badgeStyle: s})}
          />
          <SpacingSlider
            value={formData.contentPadding}
            onChange={(v) => setFormData({...formData, contentPadding: v})}
          />
          <VideoZoomSlider
            value={formData.videoZoom}
            onChange={(v) => setFormData({...formData, videoZoom: v})}
          />
        </div>

        {/* Positioning */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-4 flex items-center gap-2">
            📍 Element Positioning
          </h3>
          <PositionControls
            label="Badge"
            position={formData.positions.badge}
            onChange={(pos) => updatePosition('badge', pos)}
          />
          <PositionControls
            label="Degree"
            position={formData.positions.degree}
            onChange={(pos) => updatePosition('degree', pos)}
          />
          <PositionControls
            label="Tagline"
            position={formData.positions.tagline}
            onChange={(pos) => updatePosition('tagline', pos)}
          />
          <PositionControls
            label="Statistics"
            position={formData.positions.stats}
            onChange={(pos) => updatePosition('stats', pos)}
          />
          <PositionControls
            label="Call-to-Action Button"
            position={formData.positions.cta}
            onChange={(pos) => updatePosition('cta', pos)}
          />
        </div>
      </div>

      <div className="border-t border-white/10 p-6 space-y-3 bg-white/[0.02]">
        <button
          type="button"
          onClick={onAIGenerate}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2.5 rounded-lg transition"
        >
          <Wand2 size={16} />
          AI Generate
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCopy}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 font-semibold transition ${
              copiedId === 'copy'
                ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
            }`}
          >
            {copiedId === 'copy' ? <Check size={16} /> : <Copy size={16} />}
            {copiedId === 'copy' ? 'Copied!' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-lg py-2.5 font-semibold transition"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewPanel({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-white/10 to-transparent px-6 py-4 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white/70">Mobile Preview</h3>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-black/20 to-white/5">
        <iframe
          ref={iframeRef}
          srcDoc={html}
          title="preview"
          className="w-full h-full max-w-sm rounded-2xl border border-white/10 shadow-2xl"
        />
      </div>
    </div>
  );
}

function CodePanel({ html }: { html: string }) {
  return (
    <div className="w-96 bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-white/10 to-transparent px-6 py-4 border-b border-white/10 flex items-center gap-2">
        <Code size={16} className="text-white/60" />
        <h3 className="text-sm font-semibold text-white/70">HTML Source</h3>
      </div>
      <pre className="flex-1 overflow-auto p-6 text-xs font-mono text-white/60 whitespace-pre-wrap break-words">
        {html}
      </pre>
    </div>
  );
}

export default function App() {
  const [formData, setFormData] = useState<FormData>(TEMPLATES.fashion);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generatedHTML = useMemo(() => generateHTML(formData), [formData]);

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedHTML], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.degree.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedHTML);
      setCopiedId('copy');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleAIGenerate = async () => {
    const description = window.prompt('Describe the program (e.g., "4-year BSc Computer Science with AI focus"):');
    if (!description) return;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      alert('Gemini API key not configured. Set GEMINI_API_KEY in your environment.');
      return;
    }

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate a college landing page for: "${description}". Respond with a valid JSON object (no markdown) with these exact keys: degree, institution, tagline, stat1, stat1label, stat2, stat2label, stat3, stat3label, badge, ctaText, color (hex), fontColor (hex), fontFamily (Outfit, Space Grotesk, or Inter). Keep values concise. Ensure institution is "Techbridge University College".`
            }]
          }]
        })
      });

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (content) {
        const parsed = JSON.parse(content);
        setFormData({
          ...formData,
          degree: parsed.degree || formData.degree,
          institution: parsed.institution || formData.institution,
          tagline: parsed.tagline || formData.tagline,
          stat1: parsed.stat1 || formData.stat1,
          stat1label: parsed.stat1label || formData.stat1label,
          stat2: parsed.stat2 || formData.stat2,
          stat2label: parsed.stat2label || formData.stat2label,
          stat3: parsed.stat3 || formData.stat3,
          stat3label: parsed.stat3label || formData.stat3label,
          badge: parsed.badge || formData.badge,
          ctaText: parsed.ctaText || formData.ctaText,
          color: parsed.color || formData.color,
          fontColor: parsed.fontColor || formData.fontColor,
          fontFamily: parsed.fontFamily || formData.fontFamily,
        });
      }
    } catch (err) {
      console.error('AI Generate error:', err);
      alert('Failed to generate. Check console for details.');
    }
  };

  const applyTemplate = (template: keyof typeof TEMPLATES) => {
    setFormData(TEMPLATES[template]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#1a1f2e] to-[#0d1117]">
      <div className="flex flex-col h-screen p-6 gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://techbridge.edu.gh/static/TUC_LOGO_1.png"
              alt="Techbridge University College"
              className="h-16 w-16 object-contain"
            />
            <div>
              <h1 className="text-3xl font-black text-white">College Landing Page Generator</h1>
              <p className="text-white/50 text-sm mt-1">Techbridge University College</p>
            </div>
          </div>
          <div className="flex gap-2">
            {Object.keys(TEMPLATES).map((key) => (
              <button
                key={key}
                onClick={() => applyTemplate(key as keyof typeof TEMPLATES)}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 rounded-lg font-semibold text-sm transition capitalize"
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden">
          <ControlPanel
            formData={formData}
            setFormData={setFormData}
            onDownload={handleDownload}
            onCopy={handleCopy}
            copiedId={copiedId}
            onAIGenerate={handleAIGenerate}
          />
          <PreviewPanel html={generatedHTML} />
          <CodePanel html={generatedHTML} />
        </div>
      </div>
    </div>
  );
}
