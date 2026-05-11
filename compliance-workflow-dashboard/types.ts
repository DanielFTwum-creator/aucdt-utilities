export interface Phase {
  id: string;
  name: string;
  directive?: string;
  items: string[];
}

export interface Framework {
  name: string;
  color: string;
  phases: Phase[];
}

export interface Frameworks {
  [key: string]: Framework;
}

export type PhaseStatus = 'complete' | 'in-progress' | 'blocked' | null;

export interface PhaseStatuses {
  [phaseId: string]: PhaseStatus;
}

export type Theme = 'light' | 'dark' | 'high-contrast';

export interface AuditLogEntry {
  timestamp: string;
  action: string;
}

export type TestStatus = 'pending' | 'running' | 'passed' | 'failed';

export interface TestResult {
  name: string;
  status: TestStatus;
  error?: string | null;
  screenshot?: string | null;
}