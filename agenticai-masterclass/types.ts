export interface EmailPayload {
  applicantId: string;
  fullName: string;
  message: string;
  receiverEmailId: string;
  senderEmailId: string;
  subject: string;
  ccEmailId?: string;
}

export enum RegistrationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type BookingType = 'MASTERCLASS' | 'PRIVATE';

export type Theme = 'light' | 'dark' | 'high-contrast';

export interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user: string;
  category: 'auth' | 'system' | 'user';
}

export interface AdminUser {
  username: string;
  isAuthenticated: boolean;
  loginTime?: string;
}