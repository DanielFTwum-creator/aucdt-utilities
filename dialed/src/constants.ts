import { HSB } from './types';

export const ROUNDS = 5;
export const MAX_SCORE_PER_ROUND = 10;
export const TOTAL_MAX_SCORE = ROUNDS * MAX_SCORE_PER_ROUND;

export const DEFAULT_PICKER_HSB: HSB = { h: 180, s: 80, b: 90 };

export const THEMES = ['light', 'dark', 'high-contrast'] as const;

export const COLORS = {
  maroon: '#630f12',
  gold: '#C9A84C',
  ink: '#1A1209',
  cream: '#F5F0E8',
  silver: '#8A8A8A',
  red: '#C0392B',
  rule: '#C9A84C44',
};
