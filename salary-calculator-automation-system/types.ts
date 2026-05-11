
export enum StepCategory {
  SM = 'SM', // Senior Member
  SS = 'SS', // Senior Staff
  JS = 'JS', // Junior Staff
}

export interface SalaryStep {
  stepCode: string;
  category: StepCategory;
  description: string;
  standardAllowance: number;
}

export interface TaxBracket {
  min: number;
  max: number | null; // null for the highest bracket
  rate: number;
}

export interface SalaryCalculationResult {
  annualSalary: number;
  basicSalary: number;
  consolidatedAllowance: number;
  isCustomAllowance: boolean;
  grossSalary: number;
  hasStudentLoan: boolean;
  studentLoanDeduction: number;
  afterLoanAmount: number;
  ssnitContribution: number;
  taxableIncome: number;
  paye: number;
  netSalary: number;
}

export interface CalculationInput {
  annualSalary: number | null;
  selectedStep: SalaryStep | null;
  hasStudentLoan: boolean;
  useCustomAllowance: boolean;
  customAllowance: number | null;
  justification: string;
}
