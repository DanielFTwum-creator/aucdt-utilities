export type ZoneId = 'counting' | 'addition' | 'subtraction' | 'multiplication' | 'fractions' | 'cosmic';

export interface LevelConfig {
  id: number;
  zone: ZoneId;
  zoneTitle: string;
  levelNumber: number;
  title: string;
  description: string;
  starsRequired: number;
  unlocked: boolean;
  practices: MathQuestion[];
}

export type OperationType = 'count' | 'addition' | 'subtraction' | 'multiplication' | 'fraction' | 'blitz';

export interface MathQuestion {
  id: string;
  type: OperationType;
  prompt: string;         // E.g., "Count the stars:" or "Solve the subtraction of blocks:"
  visualType: 'blocks' | 'ten-frame' | 'balloon-pop' | 'star-grid' | 'pizza' | 'asteroid';
  visualData: any;         // Specific representation structures (e.g. { count: 4 }, { groupA: 3, groupB: 2 }, etc.)
  equation: string;        // Full text expected to type, e.g., "3 + 2 = 5" or "1/3" or "3 * 4 = 12"
  answer: string;          // Specific solution part, e.g., "5"
  helperTip: string;       // Math support quote from Tabby Cat
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  cost: number;
  unlocked: boolean;
  category: string;
}

export interface UserProgress {
  level: number;
  stars: number;
  coins: number;
  highScore: number;
  streak: number;
  maxStreak: number;
  completedLevels: number[];
  unlockedBadgeIds: string[];
  wpmHistory: { date: string; wpm: number; accuracy: number }[];
  currentProfilePic: string; // Emoji
  audioSynth?: 'sine' | 'triangle' | 'sawtooth' | 'square' | 'mute';
}
