
export type OverallCompliance = 'COMPLIANT' | 'NEEDS_REVIEW' | 'NON_COMPLIANT';

export interface ComplianceDetail {
  category: string;
  compliant: boolean;
  reasoning: string;
}

export interface AnalysisReport {
  overallCompliance: OverallCompliance;
  complianceDetails: ComplianceDetail[];
  suggestions: string;
}
