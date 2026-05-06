export interface DesignState {
  garment: string;
  style: string;
  color: string;
  fabric: string;
  detail: string;
  setting: string;
  lighting: string;
  mood: string;
  ethnicities: Record<string, boolean>;
}

export interface GeneratedOutput {
  textPrompt: string;
  jsonConfig: string;
}

export interface OptionItem {
  value: string;
  label: string;
}

export interface CheckboxItem {
  id: string;
  label: string;
  value: string;
}

export type Theme = 'light' | 'dark' | 'high-contrast';

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'pass' | 'fail';
  message?: string;
  duration?: number;
}