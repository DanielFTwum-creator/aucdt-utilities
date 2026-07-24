export interface BaseFeeData {
  name: string;
  fees: number;
  type: 'public' | 'private';
}

export interface UndergraduateFeeData extends BaseFeeData {
  continuing: number;
}

export interface InternationalFeeData extends BaseFeeData {}

export interface PostgraduateFeeData extends BaseFeeData {}

export type FeeDataItem = UndergraduateFeeData | InternationalFeeData | PostgraduateFeeData;

export type ViewType = 'undergraduate' | 'international' | 'postgraduate';

// Phase 2 Additions
export type Theme = 'light' | 'dark' | 'high-contrast';

export interface AuditLog {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  actor: string; // e.g., 'Admin'
}

export interface AuthState {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  updatePassword: (newPassword: string) => void;
}

export interface DataContextType {
  undergraduateData: UndergraduateFeeData[];
  internationalData: InternationalFeeData[];
  postgraduateData: PostgraduateFeeData[];
  updateFee: (category: ViewType, index: number, field: string, value: number) => void;
  auditLogs: AuditLog[];
}
