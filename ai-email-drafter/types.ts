export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  base64: string;
  previewUrl: string;
}

export interface EmailData {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  attachments: Attachment[];
}

export interface TestResult {
  id: number;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  screenshot?: string; // data URL for a captured image
  error?: string;
}
