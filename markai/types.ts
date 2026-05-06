
import React from 'react';

// Core Application State
export enum AppView {
  HOME = 'HOME', GENERATOR = 'GENERATOR', IMAGE_EDITOR = 'IMAGE_EDITOR',
  PRICING = 'PRICING', CALENDAR = 'CALENDAR', ADMIN = 'ADMIN',
  TESTING_HOME = 'TESTING', LIVE_CHAT = 'LIVE_CHAT',
}
export enum Theme { Light = 'light', Dark = 'dark', HighContrast = 'high-contrast' }

// Feature Management
export enum FeatureFlag {
  AI_CONTENT_GENERATION = 'AI_CONTENT_GENERATION', CAMPAIGN_SCHEDULING = 'CAMPAIGN_SCHEDULING',
  IMAGE_EDITING = 'IMAGE_EDITING', LIVE_AUDIO = 'LIVE_AUDIO',
}

// AI Configuration
export enum GeminiModel { FLASH = 'gemini-2.5-flash', PRO = 'gemini-2.5-pro' }

// User and Authentication
export interface User { id: string; email: string; name: string; tier: 'free' | 'pro' | 'enterprise'; }

// Content and Scheduling
export enum Platform { Instagram = 'Instagram', Facebook = 'Facebook', Twitter = 'Twitter', LinkedIn = 'LinkedIn', Email = 'Email' }
export enum PostStatus { DRAFT = 'DRAFT', SCHEDULED = 'SCHEDULED', PUBLISHED = 'PUBLISHED' }
export enum PostPriority { LOW = 'LOW', MEDIUM = 'MEDIUM', HIGH = 'HIGH' }

export interface PlatformDetail { 
  id: Platform; 
  name: string; 
  icon: React.FC<React.SVGProps<SVGSVGElement>>; 
  description: string; 
}

export interface GeneratedContent { 
  platform: Platform; 
  content: string; 
  imagePrompt: string; 
  variants: string[]; 
  generatedImageUrl?: string; 
}

export interface ScheduledPost extends GeneratedContent {
  id: string;
  scheduledAt: string;
  status: PostStatus;
  priority: PostPriority;
}

// Administration and Auditing
export interface AuditLogEntry { id: string; timestamp: string; action: string; details?: string; }

// Live Chat / Transcription
export interface TranscriptionEntry { id: number; speaker: 'user' | 'model'; text: string; isFinal?: boolean; }