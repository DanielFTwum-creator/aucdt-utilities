export interface ThumbnailData {
  brandName: string;
  logoDescription: string;
  logoImage: string | null;
  headlineLine1: string;
  headlineLine2: string;
  subheadline: string;
  backgroundScene: string;
  backgroundImage: string | null;
  bgZoom: number;
  bgX: number;
  bgY: number;
  foregroundSubject: string;
  subjectImage: string | null;
  subjectZoom: number;
  subjectX: number;
  subjectY: number;
  featureIcons: string[];
  featureImages?: (string | null)[];
  taglineBar: string;
  aspectRatio: "4:5" | "9:16" | "1:1" | "16:9";
}

export interface SavedDesign {
  id: string;
  name: string;
  timestamp: number;
  data: ThumbnailData;
}

export interface GeneratedPrompts {
  midjourney: string;
  imagen3: string;
  canvaBrief: string;
  typographySpec: {
    headline: string;
    subheadline: string;
    icons: string;
    tagline: string;
  };
  colorPalette: {
    background: string;
    goldPrimary: string;
    goldAccent: string;
    whiteText: string;
  };
  animatedExtension: string;
}
