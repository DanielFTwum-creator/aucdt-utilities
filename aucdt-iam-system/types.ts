export enum Role {
  STUDENT = 'STUDENT',
  ORGANIZATION = 'ORGANIZATION',
  INSTITUTION = 'INSTITUTION',
  ADMIN = 'ADMIN'
}

export enum LogStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar: string;
}

export interface LogEntry {
  id: string;
  studentId: string;
  date: string;
  hours: number;
  activities: string;
  summary: string; // AI Generated
  status: LogStatus;
  feedback?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  action: string;
  adminId: string;
}

export interface Report {
  id: string;
  studentId: string;
  fileName: string;
  submittedAt: number;
}

export type Theme = 'light' | 'dark' | 'high-contrast';

// Testing Framework Types
export type TestStatus = 'IDLE' | 'RUNNING' | 'PASSED' | 'FAILED';

export interface TestStep {
  id: string;
  description: string;
  status: 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED';
  duration?: number;
  screenshotUrl?: string;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  status: TestStatus;
  steps: TestStep[];
}