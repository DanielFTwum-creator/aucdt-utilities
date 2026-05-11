
export type Theme = 'light' | 'dark' | 'high-contrast' | 'contrast';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user: string;
}

export enum PriorityLevel {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export interface EnrollmentStage {
  name: string;
  value: number;
  description: string;
  color: string;
}

export interface BudgetItem {
  name: string;
  value: number;
  color: string;
}

export interface FinancialYear {
  year: string;
  students: number;
  revenue: number;
  cost: number;
  profit: number;
}

export interface MarketingChannel {
  name: string;
  value: number;
  yield: string;
}

// Phase 3: Testing Interfaces
export type TestStatus = 'idle' | 'running' | 'passed' | 'failed';

export interface TestSuite {
  id: string;
  name: string;
  description: string;
  type: 'unit' | 'e2e' | 'integration';
  status: TestStatus;
  lastRun?: string;
  duration?: number;
}

export interface TestLog {
  timestamp: string;
  level: 'info' | 'success' | 'error';
  message: string;
}

// Data Context Interfaces
export interface FunnelStage {
  stage: string;
  count: number;
  color: string;
}

export interface KeyMetrics {
  currentEnrollment: number;
  capacity: number;
  burnRate: string;
  immediateInvestment: string;
  projectedReturn: string;
  roi: string;
  conversionDropoutRate: string;
}

export interface DashboardData {
  budget: BudgetItem[];
  financials: FinancialYear[];
  marketing: MarketingChannel[];
  funnel: FunnelStage[];
  metrics: KeyMetrics;
}

export interface DataContextType {
  data: DashboardData;
  updateData: (section: keyof DashboardData, newData: any) => void;
  resetData: () => void;
}

export interface AgentProcessResult {
  success: boolean;
  message: string;
  changes?: string[];
}
