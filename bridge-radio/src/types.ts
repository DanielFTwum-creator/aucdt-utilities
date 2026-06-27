export interface Track {
  name: string;
  url: string;
  bpm: string;
  duration?: number;
  artwork?: string;
}

export interface Genre {
  id: string;
  label: string;
  tagline: string;
  metadata: string;
  base: string;
  sources: string[];
  heroes: string[];
  accent: string;
}

export interface HistoryItem {
  idx: number;
  name: string;
  ts: number;
  artwork?: string;
}
