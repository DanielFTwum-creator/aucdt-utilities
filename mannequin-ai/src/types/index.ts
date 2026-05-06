export type ThemeType = "dark" | "light" | "highContrast";

export interface ColorPalette {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  gold: string;
  goldLight: string;
  terracotta: string;
  terracottaLight: string;
  text: string;
  textMuted: string;
  textDim: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
}

export interface Module {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly tagline: string;
  readonly icon: string;
  readonly color: string;
  readonly status: "active" | "beta" | "protected";
  readonly features: ReadonlyArray<string>;
  readonly stats: Readonly<Record<string, string>>;
}

export interface CurriculumItem {
  module: number;
  title: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  severity: "INFO" | "WARN" | "HIGH";
  ip: string;
}
