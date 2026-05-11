
import React from 'react';
import type { SalaryCalculationResult } from '../types';
import { Card, Button } from './UIComponents';
import { SaveIcon, PrinterIcon, DocumentDuplicateIcon } from './Icons';

interface ResultsDisplayProps {
  result: SalaryCalculationResult | null;
  error: string | null;
}

const ResultRow: React.FC<{ label: string; value: string; isHighlighted?: boolean; isNet?: boolean }> = ({ label, value, isHighlighted, isNet }) => (
  <div className={`flex justify-between py-3 px-4 ${isHighlighted ? 'bg-gray-50' : ''} ${isNet ? 'border-t-2 border-gray-300 font-bold' : 'border-b border-gray-200'}`}>
    <dt className={`text-sm ${isNet ? 'text-brand-primary' : 'text-gray-600'}`}>{label}</dt>
    <dd className={`text-sm font-medium ${isNet ? 'text-xl text-brand-primary' : 'text-gray-900'}`}>{value}</dd>
  </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, error }) => {
  const formatCurrency = (value: number) => `₵${value.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (error) {
    return (
      <Card title="Calculation Error">
        <div className="p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-gray-900">Invalid Input</h3>
            <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card title="Salary Breakdown">
        <div className="p-10 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Awaiting Calculation</h3>
          <p className="mt-1 text-sm text-gray-500">Enter the details on the left to see the salary breakdown.</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card 
        title="Salary Breakdown"
        actions={
            <div className="flex space-x-2">
                <Button variant="icon" onClick={() => window.print()}><PrinterIcon /></Button>
                <Button variant="icon"><DocumentDuplicateIcon /></Button>
            </div>
        }
    >
      <dl>
        <ResultRow label="Annual Salary" value={formatCurrency(result.annualSalary)} isHighlighted />
        <ResultRow label="Monthly Basic Salary" value={formatCurrency(result.basicSalary)} />
        <ResultRow label="Consolidated Allowance" value={formatCurrency(result.consolidatedAllowance)} isHighlighted />
        <ResultRow label="Monthly Gross Salary" value={formatCurrency(result.grossSalary)} />
        {result.hasStudentLoan && (
          <ResultRow label="Student Loan Deduction (-)" value={formatCurrency(result.studentLoanDeduction)} isHighlighted />
        )}
        <ResultRow label="Amount After Loan" value={formatCurrency(result.afterLoanAmount)} />
        <ResultRow label="SSNIT Contribution (5.5%) (-)" value={formatCurrency(result.ssnitContribution)} isHighlighted />
        <ResultRow label="Monthly Taxable Income" value={formatCurrency(result.taxableIncome)} />
        <ResultRow label="PAYE Tax (-)" value={formatCurrency(result.paye)} isHighlighted />
        <ResultRow label="Net Take-home Salary" value={formatCurrency(result.netSalary)} isNet />
      </dl>
    </Card>
  );
};

export default ResultsDisplay;
