export interface HSB {
  h: number;
  s: number;
  b: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface GameState {
  round: number;
  totalScore: number;
  currentHsb: HSB;
  pickerHsb: HSB;
  roundScores: number[];
  playerColors: HSB[];
  targetColors: HSB[];
}

export type Theme = 'light' | 'dark' | 'high-contrast';

export type Screen = 
  | 'intro' 
  | 'countdown' 
  | 'memorize' 
  | 'picker' 
  | 'result' 
  | 'total' 
  | 'leaderboard' 
  | 'challenge-setup' 
  | 'challenge-intro' 
  | 'daily-intro' 
  | 'daily-results'
  | 'rules'
  | 'admin';

export interface Challenge {
  code: string;
  creatorName: string;
  colors: HSB[];
  mode: 'easy' | 'hard';
}

export interface ScoreEntry {
  name: string;
  score: number;
  mode: string;
  createdAt: string;
}
