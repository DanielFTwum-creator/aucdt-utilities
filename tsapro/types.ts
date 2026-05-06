
import React from 'react';

export type Theme = 'light' | 'dark' | 'high-contrast';

export enum AuditLogEvent {
  LOGIN_SUCCESS = 'Successful Login',
  LOGIN_FAILURE = 'Failed Login Attempt',
  LOGOUT = 'User Logout',
  PASSWORD_CHANGE_SUCCESS = 'Successful Password Change',
  PASSWORD_CHANGE_FAILURE = 'Failed Password Change',
  SALARY_CALCULATION = 'Salary Calculation Performed',
  GRADE_ADDED = 'Grade/Step Added',
  GRADE_EDITED = 'Grade/Step Edited',
  GRADE_DELETED = 'Grade/Step Deleted',
  AUDIT_LOG_CLEARED = 'Audit Logs Cleared',
  LOGS_EXPORTED = 'Audit Logs Exported',
  THEME_CHANGE = 'Theme Changed',
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  event: AuditLogEvent;
  details?: string;
}

export interface PayeBracketDetail {
  bracketRange: string;
  rate: number;
  taxable: number;
  tax: number;
}

export interface SsnitDetail {
  base: number;
  rate: number;
  contribution: number;
  tierCapApplied: boolean;
}

export interface SalaryCalculationLogDetails {
  recruitName: string;
  annualSalary: number;
  stepCode: string;
  salaryOverrideValue: number | null; 
  wasSalaryOverridden: boolean; 
  allowanceOverrideValue: number | null; 
  wasAllowanceOverridden: boolean; 
  wasSsnitExemptOverridden: boolean; 
  monthlyBasic: number;
  consolidatedAllowance: number;
  additionalAllowance: number; // New field for separated allowances
  grossMonthly: number;
  taxableMonthly: number;
  ssnit: number;
  isSsnitExempt: boolean;
  paye: number;
  studentLoanApplied: boolean;
  studentLoanDeduction: number;
  netSalary: number;
  ssnitDetails: SsnitDetail;
  payeBreakdown: PayeBracketDetail[];
}

export interface SalaryBreakdown {
  // Monthly figures
  monthlyBasic: number;
  consolidatedAllowance: number;
  additionalAllowance: number; // New field
  grossMonthly: number;
  ssnit: number;
  totalDeductions: number;
  taxableMonthly: number;
  paye: number;
  studentLoan: number;
  netMonthly: number;
  
  // Annual figures
  annualBasic: number;
  annualAllowance: number;
  grossAnnual: number;
  totalAnnualDeductions: number;
  netAnnual: number;

  // Detailed breakdowns
  ssnitDetails: SsnitDetail;
  payeBreakdown: PayeBracketDetail[];
}

export interface StepCodeData {
  empCode: string;
  code: string;
  status: string;
  annualSalary: number;
  allowance: number; // Consolidated monthly allowance
  isSsnitExempt: boolean;
  netSalaryInSheet: number;
  studentLoanInSheet: number | null;
}

export enum TestStatus {
    PENDING = 'Pending',
    RUNNING = 'Running',
    PASSED = 'Passed',
    FAILED = 'Failed',
}

export interface TestErrorDetails {
    inputs: {
        annualSalary: number;
        monthlyAllowance: number;
        isSsnitExempt: boolean;
        studentLoan: number | null;
    };
    expected: {
        netMonthly: number;
    };
    actual: {
        netMonthly: number | null;
        fullBreakdown: SalaryBreakdown | null;
    };
    message: string;
}

export interface TestResult {
    id: string;
    name: string;
    status: TestStatus;
    duration: number; // in ms
    error?: string;
    errorDetails?: TestErrorDetails;
}

export enum E2eTestStatus {
  PENDING = 'Pending',
  RUNNING = 'Running',
  PASSED = 'Passed',
  FAILED = 'Failed',
}

export interface E2eTestStep {
  description: string;
  status: E2eTestStatus;
  details?: string;
  visualLog?: React.ReactNode; 
}

export interface E2eTestResult {
  id: string;
  name: string;
  status: E2eTestStatus;
  steps: E2eTestStep[];
}
