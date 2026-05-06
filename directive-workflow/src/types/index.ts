export interface Phase {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly color: string;
  readonly gradient: string;
  readonly title: string;
  readonly subtitle: string;
  readonly tag: string;
  readonly content: string;
}

export type ThemeType = "dark" | "light" | "highContrast";

export interface ColorPalette {
  readonly bg: string;
  readonly surface: string;
  readonly surfaceAlt: string;
  readonly border: string;
  readonly text: string;
  readonly textMuted: string;
  readonly textDim: string;
  readonly primary: string;
  readonly secondary: string;
  readonly accent: string;
  readonly success: string;
  readonly warning: string;
  readonly error: string;
}
