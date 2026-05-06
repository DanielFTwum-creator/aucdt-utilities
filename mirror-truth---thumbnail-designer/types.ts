export type ThumbnailVariant = 'original' | 'neon-void' | 'editorial';

export interface ThumbnailConfig {
  artistName: string;
  hookText: string;
  accentWord: string;
  showSafeZones: boolean;
  showGrid: boolean;
  animate: boolean;
  variant: ThumbnailVariant;
  leftImage: string | null;
  rightImage: string | null;
  
  // Image Transforms
  leftImageScale: number;
  leftImageX: number;
  leftImageY: number;
  rightImageScale: number;
  rightImageX: number;
  rightImageY: number;

  // Face Container Transforms
  faceX: number;
  faceY: number;
  faceScale: number;
  faceSpread: number;

  showCssFace: boolean;
  hookLetterSpacing: number;
  hookFontWeight: string;
}

export interface GlitchFragment {
  id: number;
  width: number;
  height: number;
  top: number;
  left: number;
  color: string;
  delay: number;
}

export interface PixelScatter {
  id: number;
  top: number;
  left: number;
  color: string;
  delay: number;
  opacity: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export type ThemeMode = 'dark' | 'light';