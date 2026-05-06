import type React from 'react';

export interface EmailPayload {
  applicantId: string;
  fullName: string;
  message: string;
  receiverEmailId: string;
  senderEmailId: string;
  subject: string;
}

export type ModuleId =
  | 'visual-design'
  | 'video-production'
  | 'content-creation'
  | 'personalization'
  | 'storytelling'
  | 'sentiment-analysis'
  | 'ux-ui-design'
  | 'branding'
  | 'deepfakes'
  | 'ethics';

export interface Module {
  id: ModuleId;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface UiComponent {
    type: 'container' | 'text' | 'button' | 'input' | 'image';
    props?: Record<string, any>;
    children?: UiComponent[];
    content?: string;
}

export interface SentimentAnalysisResult {
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    confidence: number;
    explanation: string;
}

export interface EthicalAnalysisResult {
    concerns: {
        issue: string;
        severity: 'Low' | 'Medium' | 'High';
        explanation: string;
    }[];
    summary: string;
}

export interface PersonalizationResult {
    variants: {
        persona: string;
        copy: string;
        rationale: string;
    }[];
}

export interface BrandingResult {
    manifesto: string;
    colorPalette: {
        hex: string;
        name: string;
        reason: string;
    }[];
    logoConcept: string;
}

export interface AuthenticityResult {
    score: number;
    flags: string[];
    analysis: string;
    verdict: 'Likely Authentic' | 'Potentially Synthetic' | 'Highly Suspicious';
}


export interface AuditLog {
  timestamp: string;
  action: string;
}
