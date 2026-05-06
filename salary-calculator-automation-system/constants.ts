
import { StepCategory, SalaryStep, TaxBracket } from './types';

export const SALARY_STEPS: SalaryStep[] = [
  { stepCode: 'SM0101/2', category: StepCategory.SM, description: 'Senior Member, Level 1, Position 2', standardAllowance: 6200.00 },
  { stepCode: 'SM0102/7', category: StepCategory.SM, description: 'Senior Member, Level 2, Position 7', standardAllowance: 4400.00 },
  { stepCode: 'SM0105/2', category: StepCategory.SM, description: 'Senior Member, Level 5, Position 2', standardAllowance: 2850.00 },
  { stepCode: 'SS0102/6', category: StepCategory.SS, description: 'Senior Staff, Level 2, Position 6', standardAllowance: 1300.00 },
  { stepCode: 'JS0104/2', category: StepCategory.JS, description: 'Junior Staff, Level 4, Position 2', standardAllowance: 700.00 },
  { stepCode: 'JS0101/1', category: StepCategory.JS, description: 'Junior Staff, Level 1, Position 1', standardAllowance: 550.00 },
  { stepCode: 'SS0105/3', category: StepCategory.SS, description: 'Senior Staff, Level 5, Position 3', standardAllowance: 1800.00 },
];

// Based on Ghana Revenue Authority (GRA) 2024 tax bands (annual)
export const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 5888, rate: 0.0 },
  { min: 5888, max: 7288, rate: 0.05 },
  { min: 7288, max: 8968, rate: 0.10 },
  { min: 8968, max: 44968, rate: 0.175 },
  { min: 44968, max: 244968, rate: 0.25 },
  { min: 244968, max: 600000, rate: 0.30 },
  { min: 600000, max: null, rate: 0.35 },
];

export const SSNIT_RATE = 0.055;
export const STUDENT_LOAN_RATE = 0.05; // Assumption: 5% of basic salary
export const MIN_ANNUAL_SALARY = 6000;
export const MAX_ANNUAL_SALARY = 100000;
export const MIN_JUSTIFICATION_LENGTH = 50;
