import { HSB, RGB } from '../types';

export function hsbToRgb(h: number, s: number, b: number): RGB {
  s /= 100;
  b /= 100;
  const c = b * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = b - c;
  let r = 0, g = 0, bl = 0;
  if (h < 60) { r = c; g = x; bl = 0; }
  else if (h < 120) { r = x; g = c; bl = 0; }
  else if (h < 180) { r = 0; g = c; bl = x; }
  else if (h < 240) { r = 0; g = x; bl = c; }
  else if (h < 300) { r = x; g = 0; bl = c; }
  else { r = c; g = 0; bl = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((bl + m) * 255)
  };
}

export function rgbToCss(r: number, g: number, b: number): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function hsbToCss(h: number, s: number, b: number): string {
  const rgb = hsbToRgb(h, s, b);
  return rgbToCss(rgb.r, rgb.g, rgb.b);
}

export function getLuminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function getContrastColor(r: number, g: number, b: number): string {
  return getLuminance(r, g, b) > 0.45 ? '#000' : '#fff';
}

function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  let rL = r / 255;
  let gL = g / 255;
  let bL = b / 255;

  rL = rL > 0.04045 ? Math.pow((rL + 0.055) / 1.055, 2.4) : rL / 12.92;
  gL = gL > 0.04045 ? Math.pow((gL + 0.055) / 1.055, 2.4) : gL / 12.92;
  bL = bL > 0.04045 ? Math.pow((bL + 0.055) / 1.055, 2.4) : bL / 12.92;

  let x = (rL * 0.4124564 + gL * 0.3575761 + bL * 0.1804375) / 0.95047;
  let y = (rL * 0.2126729 + gL * 0.7151522 + bL * 0.0721750);
  let z = (rL * 0.0193339 + gL * 0.1191920 + bL * 0.9503041) / 1.08883;

  const f = (t: number) => t > 0.008856 ? Math.pow(t, 1/3) : 7.787 * t + 16 / 116;
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}

export function calculateScore(h1: number, s1: number, b1: number, h2: number, s2: number, b2: number): number {
  const rgb1 = hsbToRgb(h1, s1, b1);
  const rgb2 = hsbToRgb(h2, s2, b2);
  const lab1 = rgbToLab(rgb1.r, rgb1.g, rgb1.b);
  const lab2 = rgbToLab(rgb2.r, rgb2.g, rgb2.b);

  const dE = Math.sqrt(
    Math.pow(lab1[0] - lab2[0], 2) +
    Math.pow(lab1[1] - lab2[1], 2) +
    Math.pow(lab1[2] - lab2[2], 2)
  );

  const base = 10 / (1 + Math.pow(dE / 38, 1.6));
  const hueDiff = Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2));
  const avgSat = (s1 + s2) / 2;
  const avgBri = (b1 + b2) / 2;
  const colorPresence = Math.min(1, avgSat / 20) * Math.min(1, avgBri / 20);

  const hueAcc = Math.max(0, 1 - Math.pow(hueDiff / 25, 1.5));
  const recovery = (10 - base) * hueAcc * colorPresence * 0.5;

  const huePenFactor = Math.max(0, (hueDiff - 30) / 150);
  const penalty = base * huePenFactor * colorPresence * 0.4;

  const raw = base + recovery - penalty;
  return Math.max(0, Math.min(10, Math.round(raw * 100) / 100));
}

export function randomHsb(): HSB {
  return {
    h: Math.floor(Math.random() * 360),
    s: 15 + Math.floor(Math.random() * 86),
    b: 15 + Math.floor(Math.random() * 86)
  };
}

export function randomPickerDefault(targetH: number): HSB {
  let h = Math.floor(Math.random() * 360);
  while (Math.abs(h - targetH) < 60 || Math.abs(h - targetH) > 300) {
    h = Math.floor(Math.random() * 360);
  }
  return {
    h,
    s: 30 + Math.floor(Math.random() * 60),
    b: 40 + Math.floor(Math.random() * 50)
  };
}
