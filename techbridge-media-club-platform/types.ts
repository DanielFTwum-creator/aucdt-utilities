export type UserRole = 'Admin' | 'Editor' | 'Creator' | 'Member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  // Collaboration props
  color?: string;
  cursorPosition?: number;
}

export type ContentStatus = 'Draft' | 'In Review' | 'Approved' | 'Published' | 'Rejected';
export type ContentType = 'Article' | 'Video' | 'Podcast' | 'Graphic';

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  author: string;
  status: ContentStatus;
  dateCreated: string;
  datePublished?: string;
  views?: number;
  thumbnail?: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  type: 'Image' | 'Video' | 'Audio' | 'Document';
  size: string;
  uploadedBy: string;
  dateUploaded: string;
  url: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  description: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

export interface AnalyticsData {
  name: string;
  views: number;
  engagement: number;
  shares: number;
}

// Collaboration Types
export type CollabEventType = 'user_joined' | 'user_left' | 'text_update' | 'cursor_move';

export interface CollabEvent {
  type: CollabEventType;
  user?: User;
  userId?: string;
  sessionId?: string;
  text?: string;
  position?: number;
  action?: 'insert' | 'replace';
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'high-contrast';

// Admin Types
export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  user?: string;
}

export interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  message: string;
}