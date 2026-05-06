
export enum RoleCategory {
  DISTRICT_PD_LEAD = 'District PD Lead',
  SCHOOL_PRINCIPAL = 'School Principal',
  INSTRUCTIONAL_COACH = 'Instructional Coach'
}

export enum SchoolLevel {
  ELEMENTARY = 'Elementary',
  MIDDLE = 'Middle',
  HIGH = 'High',
  DISTRICT_WIDE = 'District-Wide'
}

export interface Contact {
  contact_id: number;
  first_name: string;
  last_name: string;
  job_title_raw: string;
  role_category: RoleCategory;
  email: string;
  phone_main: string;
  phone_ext?: string;
  district_name: string;
  county: string;
  school_level: SchoolLevel;
  last_updated: string; // ISO Date string
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  SRS_DOCUMENT = 'SRS_DOCUMENT',
  DOCS_CENTER = 'DOCS_CENTER',
  AGENT = 'AGENT',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  TEST_SUITE = 'TEST_SUITE'
}

export type Theme = 'light' | 'dark' | 'high-contrast';

export interface AuditLog {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  details?: string;
  status: 'SUCCESS' | 'FAILURE' | 'INFO';
}

// Testing Framework Types
export type TestStatus = 'IDLE' | 'RUNNING' | 'PASSED' | 'FAILED';

export interface TestLog {
  id: number;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'browser';
}

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  code: string; // The Puppeteer code string
  status: TestStatus;
}