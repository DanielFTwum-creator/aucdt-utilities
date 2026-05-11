
export interface Faculty {
  name: string;
  title: string;
  labName: string;
  labLink: string;
  video: string;
  description: string;
  department: string;
}

export interface ResearchTopic {
  id: number;
  text: string;
  link: string;
  x: number;
  y: number;
  radius: number;
  align: 'start' | 'end';
  anchor?: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'contrast';

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface TestCase {
  id: string;
  name: string;
  status: 'pending' | 'passed' | 'failed';
  message?: string;
}

export enum Category {
  DEVELOPMENT = 'Development',
  DESIGN = 'Design',
  EDUCATION = 'Education',
  PRODUCTIVITY = 'Productivity',
  BUSINESS = 'Business',
  UTILITY = 'Utility',
  MARKETING = 'Marketing',
  ENTERTAINMENT = 'Entertainment',
  HEALTHCARE = 'Healthcare',
  ALL = 'All'
}

export interface AppEntry {
  id: string;
  title: string;
  category: Category;
  description: string;
  path: string;
}
