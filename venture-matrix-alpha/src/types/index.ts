
export type VentureStage = 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Growth';
export type VentureSector = 'HealthAI' | 'FinAI' | 'EdAI' | 'ClimateAI' | 'DefenceAI' | 'EnterpriseAI';

export interface Venture {
  id: string;                    // UUID
  name: string;
  tagline: string;
  sector: VentureSector;
  stage: VentureStage;
  founded: number;               // Year
  teamSize: number;
  
  // Scoring
  gScore: number;                // 0–100  Social Good Score
  mScore: number;                // 0–100  Monetisation Score
  roiProjection: number;         // Decimal e.g. 3.4 = 340% ROI

  // Context for AI brief
  problemStatement: string;
  solutionSummary: string;
  keyRisks: string[];
  keyOpportunities: string[];
  
  // Metadata
  lastUpdated: string;           // ISO date
}

export interface Brief {
  ventureId: string;
  generatedAt: string;
  headline: string;
  executiveSummary: string;
  riskAssessment: string;
  strategicRecommendation: string;
  confidenceScore: number;       // 0–1, Gemini self-reported
}

export interface CompareSession {
  ids: [string, string];         // Exactly 2 ventures
  deltaG: number;                // gScore diff
  deltaM: number;                // mScore diff
  deltaROI: number;
  dominantId: string;            // ID of "winning" venture
  spread: 'narrow' | 'moderate' | 'wide';
}

export interface AdminMetric {
  key: string;
  label: string;
  value: string | number;
  status: 'healthy' | 'degraded' | 'critical';
  lastChecked: string;
}
