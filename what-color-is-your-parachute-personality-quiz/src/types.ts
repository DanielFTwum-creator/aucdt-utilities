export interface Trait {
  id: string;
  label: string;
  emoji: string;
  accentColor?: string;
  tagline?: string;
  description?: string;
  shadowSide?: string;
  careerSuggestions?: string[];
}

export interface Profile {
  id?: string;
  top10: Trait[];
  top3: Trait[];
  createdAt?: string;
}
