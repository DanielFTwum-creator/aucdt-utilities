
/**
 * @file salaryCalculations.ts
 * @description
 * This file serves as the core calculation engine for the ASAPro application.
 * It is the primary "agent" responsible for interpreting salary data and
 * applying Ghanaian tax and social security regulations to produce a
 * detailed and accurate net salary breakdown. All calculations performed
 * throughout the application originate from the functions within this module,
 * ensuring consistency, accuracy, and a single source of truth.
 */
import { PAYE_ANNUAL_BANDS_2025, SSNIT_RATE, SSNIT_TIER1_CAP } from '../constants';
import { PayeBracketDetail, SsnitDetail, SalaryBreakdown } from '../types';

/**
 * Calculates the annual SSNIT contribution based on the annual basic salary.
 * It considers the Tier 1 cap and exemption status.
 * @param annualSalary The total annual basic salary.
 * @param isExempt A boolean indicating if the employee is exempt from SSNIT contributions.
 * @returns An object containing the annual SSNIT contribution and a detailed breakdown.
 */
export const calculateSsnit = (annualSalary: number, isExempt: boolean): { annualContribution: number; details: SsnitDetail } => {
  if (isExempt) {
    return {
      annualContribution: 0,
      details: {
        base: 0,
        rate: SSNIT_RATE,
        contribution: 0,
        tierCapApplied: false,
      }
    };
  }

  const ssnitBase = Math.min(annualSalary, SSNIT_TIER1_CAP);
  const tierCapApplied = annualSalary > SSNIT_TIER1_CAP;
  const contribution = ssnitBase * SSNIT_RATE;

  return {
    annualContribution: contribution,
    details: {
      base: ssnitBase,
      rate: SSNIT_RATE,
      contribution: contribution,
      tierCapApplied: tierCapApplied,
    }
  };
};

/**
 * Calculates the total annual PAYE (Pay As You Earn) income tax based on the taxable annual income.
 * It applies the progressive tax bands for the specified year.
 * @param taxableAnnualIncome The annual income subject to taxation.
 * @returns An object containing the total annual PAYE and a detailed breakdown of the calculation by tax bracket.
 */
export const calculatePaye = (taxableAnnualIncome: number): { totalAnnualPaye: number; breakdown: PayeBracketDetail[] } => {
  const breakdown: PayeBracketDetail[] = [];
  if (taxableAnnualIncome <= 0) {
    return { totalAnnualPaye: 0, breakdown: [] };
  }

  let totalAnnualPaye = 0;
  let remainingIncome = taxableAnnualIncome;
  let cumulativeBandStart = 0;

  for (const band of PAYE_ANNUAL_BANDS_2025) {
    if (remainingIncome <= 0) break;

    const taxableInBand = Math.min(remainingIncome, band.width);
    const taxInBand = taxableInBand * band.rate;
    totalAnnualPaye += taxInBand;

    const bandEnd = cumulativeBandStart + band.width;
    
    const bracketLabel = band.width === Infinity
      ? `Above ${cumulativeBandStart.toLocaleString()}`
      : `${cumulativeBandStart.toLocaleString()} - ${bandEnd.toLocaleString()}`;

    if (taxableInBand > 0.001) { // Avoid tiny floating point dust in breakdown
        breakdown.push({
          bracketRange: bracketLabel,
          rate: band.rate,
          taxable: taxableInBand,
          tax: taxInBand,
        });
    }

    remainingIncome -= taxableInBand;
    cumulativeBandStart += band.width;
  }

  return { totalAnnualPaye, breakdown };
};

/**
 * Performs a complete salary calculation, including all deductions and detailed breakdowns.
 * This serves as the single source of truth for salary computations across the app.
 * @param annualSalary The total annual basic salary.
 * @param monthlyAllowance The monthly consolidated allowance.
 * @param isSsnitExempt A boolean indicating SSNIT exemption status.
 * @param studentLoanAmount The specific monthly amount for student loan deduction, if applicable.
 * @param additionalAllowance Any extra manual monthly allowance (e.g. manual corrections).
 * @returns A full SalaryBreakdown object, or null if inputs are invalid.
 */
export const performFullSalaryCalculation = (
  annualSalary: number,
  monthlyAllowance: number,
  isSsnitExempt: boolean,
  studentLoanAmount: number | null,
  additionalAllowance: number = 0
): SalaryBreakdown | null => {
  // Guard against invalid inputs
  // Note: additionalAllowance can be 0, but not negative
  if (isNaN(annualSalary) || annualSalary <= 0 || isNaN(monthlyAllowance) || monthlyAllowance < 0 || isNaN(additionalAllowance) || additionalAllowance < 0) {
    return null;
  }

  const annualConsolidatedAllowance = monthlyAllowance * 12;
  const annualAdditionalAllowance = additionalAllowance * 12;
  const totalAnnualAllowance = annualConsolidatedAllowance + annualAdditionalAllowance;
  
  const grossAnnualIncome = annualSalary + totalAnnualAllowance;

  const { annualContribution: annualSsnit, details: ssnitDetails } = calculateSsnit(annualSalary, isSsnitExempt);

  const taxableAnnualIncome = grossAnnualIncome - annualSsnit;
  
  const { totalAnnualPaye, breakdown: payeBreakdown } = calculatePaye(taxableAnnualIncome);
  
  const monthlyStudentLoan = studentLoanAmount ?? 0;
  const annualStudentLoan = monthlyStudentLoan * 12;

  // Monthly Calculations
  const monthlyBasic = annualSalary / 12;
  const grossMonthly = monthlyBasic + monthlyAllowance + additionalAllowance;
  const monthlySsnit = annualSsnit / 12;
  const monthlyPaye = totalAnnualPaye / 12;
  const totalDeductions = monthlySsnit + monthlyPaye + monthlyStudentLoan;
  const netMonthly = grossMonthly - totalDeductions;

  // Annual Calculations
  const totalAnnualDeductions = annualSsnit + totalAnnualPaye + annualStudentLoan;
  const netAnnual = grossAnnualIncome - totalAnnualDeductions;

  return {
    // Monthly
    monthlyBasic,
    consolidatedAllowance: monthlyAllowance,
    additionalAllowance,
    grossMonthly,
    ssnit: monthlySsnit,
    taxableMonthly: taxableAnnualIncome / 12,
    paye: monthlyPaye,
    studentLoan: monthlyStudentLoan,
    totalDeductions,
    netMonthly,
    
    // Annual
    annualBasic: annualSalary,
    annualAllowance: totalAnnualAllowance,
    grossAnnual: grossAnnualIncome,
    totalAnnualDeductions,
    netAnnual,

    // Details
    ssnitDetails,
    payeBreakdown,
  };
};
