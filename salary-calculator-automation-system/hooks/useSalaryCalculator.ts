
import { useState, useEffect, useCallback } from 'react';
import { CalculationInput, SalaryCalculationResult, SalaryStep } from '../types';
import { TAX_BRACKETS, SSNIT_RATE, STUDENT_LOAN_RATE } from '../constants';

export const useSalaryCalculator = (initialState: CalculationInput) => {
  const [inputs, setInputs] = useState<CalculationInput>(initialState);
  const [result, setResult] = useState<SalaryCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculatePAYE = useCallback((annualTaxableIncome: number): number => {
    let tax = 0;
    let remainingIncome = annualTaxableIncome;

    for (const bracket of TAX_BRACKETS) {
        if (remainingIncome <= 0) break;

        const taxableInBracket = bracket.max
            ? Math.min(remainingIncome, bracket.max - bracket.min)
            : remainingIncome;
        
        if (taxableInBracket > 0) {
            tax += taxableInBracket * bracket.rate;
            remainingIncome -= taxableInBracket;
        }
    }
    return tax;
  }, []);

  useEffect(() => {
    const { annualSalary, selectedStep, hasStudentLoan, useCustomAllowance, customAllowance } = inputs;

    if (!annualSalary || !selectedStep) {
      setResult(null);
      setError(null);
      return;
    }

    // Validation
    if (annualSalary < 6000 || annualSalary > 100000) {
      setError("Annual salary must be between ₵6,000 and ₵100,000.");
      setResult(null);
      return;
    }
     if (useCustomAllowance && (customAllowance === null || customAllowance < 0)) {
        setError("Custom allowance must be a positive number.");
        setResult(null);
        return;
    }


    setError(null);

    const basicSalary = annualSalary / 12;
    const effectiveAllowance = useCustomAllowance && customAllowance !== null ? customAllowance : selectedStep.standardAllowance;
    const grossSalary = basicSalary + effectiveAllowance;
    
    // Student loan is calculated on basic salary as per common practice, before other allowances
    const studentLoanDeduction = hasStudentLoan ? basicSalary * STUDENT_LOAN_RATE : 0;
    
    // Per SRS: SSNIT calculated on post-student-loan amount
    // After Loan = Gross Salary - Student Loan
    const afterLoanAmount = grossSalary - studentLoanDeduction;

    const ssnitContribution = afterLoanAmount * SSNIT_RATE;
    
    // Taxable Income = After Loan - SSNIT
    const taxableIncome = afterLoanAmount - ssnitContribution;
    
    const annualTaxableIncome = taxableIncome * 12;
    const annualPAYE = calculatePAYE(annualTaxableIncome);
    const paye = annualPAYE / 12;
    
    const netSalary = taxableIncome - paye;

    setResult({
      annualSalary,
      basicSalary,
      consolidatedAllowance: effectiveAllowance,
      isCustomAllowance: useCustomAllowance,
      grossSalary,
      hasStudentLoan,
      studentLoanDeduction,
      afterLoanAmount,
      ssnitContribution,
      taxableIncome,
      paye,
      netSalary,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, calculatePAYE]);

  const updateInput = <K extends keyof CalculationInput>(key: K, value: CalculationInput[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setInputs(initialState);
    setResult(null);
    setError(null);
  };
  
  return { inputs, result, error, updateInput, reset };
};
