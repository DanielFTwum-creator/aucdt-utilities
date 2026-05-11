export interface Article {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  summary: string;
  originalUrl: string;
  imageUrl?: string;
  publishedAt: string;
  scheduledAt?: string; // ISO string for future publication
  category: ArticleCategory;
  status: ArticleStatus;
  sentiment: 'positive' | 'neutral' | 'negative' | 'critical';
  engagementScore?: number;
  isAiGenerated: boolean;
  isFetched?: boolean; // New flag to track real fetched data
  tags?: string[]; // Added tagging support
}

export enum ArticleCategory {
  POLITICS = 'Politics',
  BUSINESS = 'Business',
  SPORTS = 'Sports',
  ENTERTAINMENT = 'Entertainment',
  TECHNOLOGY = 'Technology',
  GENERAL = 'General'
}

export enum ArticleStatus {
  PENDING = 'pending',
  PENDING_EDIT = 'pending_edit', // Added for inline editing workflow
  PROCESSING = 'processing',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SCHEDULED = 'scheduled',
  POSTED = 'posted'
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'api' | 'scraper';
  enabled: boolean;
  lastFetch?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  module: 'AGGREGATOR' | 'AI_PROCESSOR' | 'PUBLISHER' | 'SYSTEM';
  details?: any; // New field for status drill-down data
}

export interface AgentStatus {
  state: 'idle' | 'fetching' | 'processing' | 'publishing' | 'sleeping';
  lastRun: string;
  nextRun: string;
  articlesProcessedToday: number;
  postsPublishedToday: number;
  successRate: number;
  activeTask?: string;
  progress?: number;
}

export type Theme = 'light' | 'dark' | 'high-contrast';

export interface User {
  username: string;
  role: 'admin' | 'editor' | 'viewer';
  lastLogin: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  status: 'success' | 'failure';
}

export interface TestStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'success' | 'failure';
  logs: string[];
  screenshot?: string; // Base64 or URL mock
  duration?: number;
}

export interface TestSuiteResult {
  isRunning: boolean;
  startTime?: number;
  endTime?: number;
  steps: TestStep[];
  overallStatus: 'idle' | 'running' | 'success' | 'failure';
}

export interface SocialConfig {
  facebookPageId: string;
  facebookAccessToken: string;
  autoPostEnabled: boolean;
}