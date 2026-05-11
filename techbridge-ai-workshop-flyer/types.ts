export interface Speaker {
  name: string;
  title: string;
  topic: string;
  isAi?: boolean;
  imageUrl?: string;
  variant: 'primary' | 'secondary';
}

export interface EventDetail {
  icon: string;
  label: string;
  value: string;
  subValue?: string;
}

export type ThemeMode = 'dark' | 'light' | 'high-contrast';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
}

export interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'pass' | 'fail';
  message?: string;
  timestamp: number;
}

export interface ShowcaseImage {
  id: string;
  url: string;
  caption: string;
}