
export interface DashboardData {
  totalAssessments: number;
  completed: number;
  startDate: string; // ISO string
  targetRate: number;
  logoUrl: string;
  title: string;
  itemLabel: string;
}

export interface TrendDataPoint {
  day: number;
  target: number;
  actual: number | null;
  projected: number | null;
}

export interface CalculatedStats {
  daysElapsed: number;
  remaining: number;
  progressPercent: number;
  actualRate: number;
  daysRemainingAtTarget: number;
  projectedFinishDay: number;
  weeklyTarget: number;
  originalFinishDay: number;
  gapMultiplier: number;
  expectedAtCurrentDay: number;
  shortfall: number;
  avgDaysEach: number;
  todayDate: string;
  projectedEndDate: string;
  gapTrend: { day: number, gap: number }[];
  burnupTrend: TrendDataPoint[];
}

export type Theme = 'dark' | 'light' | 'high-contrast' | 'contrast';
export type AppView = 'dashboard' | 'admin' | 'login' | 'testing';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'pass' | 'fail';
  duration?: number;
  error?: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
