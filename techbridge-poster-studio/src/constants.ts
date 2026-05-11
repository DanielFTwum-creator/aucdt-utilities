import { AspectRatio } from './types';

export const TOKENS = {
  parchment: '#FAF7F0',
  crimson: '#8C1A2E',
  gold: '#C49A22',
  espresso: '#1A0A06',
  espressoDeep: '#0F0402',
  textPrimary: '#2A1A1A',
  textMuted: '#555555',
  bgPage: '#E2DED0'
};

export const getPosterDimensions = (ratio: AspectRatio) => {
  switch (ratio) {
    case AspectRatio.SQUARE: return { width: 800, height: 800, margin: '20px' };
    case AspectRatio.LANDSCAPE: return { width: 800, height: 600, margin: '24px' };
    case AspectRatio.PORTRAIT: return { width: 600, height: 800, margin: '24px' };
    case AspectRatio.CINEMA: return { width: 1066, height: 600, margin: '32px' };
    case AspectRatio.STORY: return { width: 450, height: 800, margin: '20px 28px' };
    default: return { width: 800, height: 600, margin: '24px' };
  }
};

// Logo size scale per R6: Cinema 96, Landscape 88, Portrait 80, Square 60, Story 48.
export const getLogoSize = (ratio: AspectRatio) => ({
  [AspectRatio.CINEMA]: 96,
  [AspectRatio.LANDSCAPE]: 88,
  [AspectRatio.PORTRAIT]: 80,
  [AspectRatio.SQUARE]: 60,
  [AspectRatio.STORY]: 48
}[ratio] || 88);

export const getStatsBarHeight = (ratio: AspectRatio) => ({
  [AspectRatio.CINEMA]: '20%',
  [AspectRatio.LANDSCAPE]: '18%',
  [AspectRatio.PORTRAIT]: '16%',
  [AspectRatio.SQUARE]: '20%',
  [AspectRatio.STORY]: '22%'
}[ratio] || '18%');

export const getStripHeight = (ratio: AspectRatio) => ({
  [AspectRatio.CINEMA]: '10%',
  [AspectRatio.LANDSCAPE]: '9%',
  [AspectRatio.PORTRAIT]: '6%',
  [AspectRatio.SQUARE]: '9%',
  [AspectRatio.STORY]: '7%'
}[ratio] || '8%');

export const getHeadlineSizeClass = (ratio: AspectRatio) => ({
  [AspectRatio.CINEMA]: '48px',
  [AspectRatio.LANDSCAPE]: '72px',
  [AspectRatio.PORTRAIT]: '80px',
  [AspectRatio.SQUARE]: '52px',
  [AspectRatio.STORY]: '64px'
}[ratio] || '72px');
