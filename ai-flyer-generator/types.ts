export interface TextElement {
  type: 'headline' | 'subheading' | 'bullet' | 'button' | 'divider' | 'social_links';
  text?: string;
  color?: string;
  position?: string;
  size?: string;
  weight?: string;
  line_spacing?: string;
  number?: number;
  icon?: string;
  spacing_below?: string;
  style?: 'primary' | 'secondary';
  width?: string;
  links?: { platform: 'instagram' | 'x' | 'linkedin'; handle: string }[];
}

export interface FlyerData {
  prompt: string;
  text_elements: TextElement[];
  layout: string;
  column_widths: {
    left: string;
    right: string;
  };
  color_palette: {
    [key: string]: string;
  };
  spacing: {
    [key: string]: string;
  };
  typography: {
    [key: string]: string;
  };
  visual_elements: {
    [key: string]: string;
  };
  format: string;
  aspect_ratio: string;
  quality: string;
  critical_instruction: string;
}

export interface AuthContextType {
  user: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

export interface AuditLogEntry {
  timestamp: Date;
  user: string;
  action: string;
}

export type Theme = 'light' | 'dark' | 'high-contrast';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}