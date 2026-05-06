
import React from 'react';
import { SalaryCalculationLogDetails } from '../../types';

const formatCurrency = (amount: number | undefined | null) => {
    if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
    return `₵ ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

const SalaryCalculationDetails: React.FC<{ details: SalaryCalculationLogDetails }> = ({ details }) => (
    <div className="text-sm space-y-2 pt-4 mt-4 border-t" data-component="divider">
        <h4 className="font-semibold" data-component="text-primary">Full Breakdown:</h4>
        <ul className="text-xs space-y-1" data-component="text-secondary">
            {details.recruitName && <li><strong>Recruit Name:</strong> {details.recruitName}</li>}
            <li><strong>Annual Salary:</strong> {formatCurrency(details.annualSalary)}</li>
            {details.wasSalaryOverridden && 
                <li className="pl-2 italic" data-component="warning-text">Salary override of {formatCurrency(details.salaryOverrideValue)} was applied.</li>
            }
            <li><strong>Grade/Step:</strong> {details.stepCode}</li>

            <li className="pt-1 mt-1 border-t" data-component="divider"><strong>Monthly Basic:</strong> {formatCurrency(details.monthlyBasic)}</li>
            <li><strong>Consol. Allowance:</strong> {formatCurrency(details.consolidatedAllowance)}</li>
             {details.wasAllowanceOverridden && 
                <li className="pl-2 italic" data-component="warning-text">Allowance override of {formatCurrency(details.allowanceOverrideValue)} was applied.</li>
            }
            {details.additionalAllowance > 0 && (
                <li><strong>Additional Allow:</strong> {formatCurrency(details.additionalAllowance)}</li>
            )}

            <li className="pt-1 mt-1 border-t" data-component="divider"><strong>Gross Monthly:</strong> {formatCurrency(details.grossMonthly)}</li>
            <li><strong>Monthly Taxable:</strong> {formatCurrency(details.taxableMonthly)}</li>
            <li className="pt-1 mt-1 border-t" data-component="divider"><strong>Deductions:</strong></li>
            <li className="pl-2">
                <strong>SSNIT:</strong> {formatCurrency(details.ssnit)}
                {details.wasSsnitExemptOverridden && 
                    <span className="ml-2 italic" data-component="warning-text">
                        (Status overridden to: '{details.isSsnitExempt ? 'Exempt' : 'Standard'}')
                    </span>
                }
            </li>
            <li className="pl-2"><strong>PAYE:</strong> {formatCurrency(details.paye)}</li>
            <li className="pl-2">
                <strong>Student Loan:</strong> 
                {details.studentLoanApplied ? ` ${formatCurrency(details.studentLoanDeduction)}` : ' N/A'}
            </li>
            <li className="font-semibold pt-1 mt-1 border-t" data-component="divider"><strong>Net Salary:</strong> {formatCurrency(details.netSalary)}</li>
            
            {details.ssnitDetails && (
                <li className="pt-2 mt-2 border-t border-dashed" data-component="divider-dashed">
                    <strong className="font-semibold" data-component="text-primary">SSNIT Calculation Details (Annual):</strong>
                    <dl className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1">
                        <dt>Base:</dt>
                        <dd className="text-right font-mono">{formatCurrency(details.ssnitDetails.base)}</dd>
                        <dt>Rate:</dt>
                        <dd className="text-right font-mono">{(details.ssnitDetails.rate * 100).toFixed(1)}%</dd>
                        <dt>Contribution:</dt>
                        <dd className="text-right font-mono">{formatCurrency(details.ssnitDetails.contribution)}</dd>
                        {details.ssnitDetails.tierCapApplied && (
                            <>
                                <dt>Status:</dt>
                                <dd className="text-right italic" data-component="text-tertiary">Tier 1 cap applied</dd>
                            </>
                        )}
                    </dl>
                </li>
            )}

            {details.payeBreakdown && (
                 <li className="pt-2 mt-2 border-t border-dashed" data-component="divider-dashed">
                    <strong className="font-semibold" data-component="text-primary">PAYE Calculation Details (Annual):</strong>
                    <table className="mt-1 w-full text-left table-auto">
                        <thead>
                            <tr className="border-b" data-component="divider">
                                <th className="py-1 font-medium text-xs">Bracket</th>
                                <th className="py-1 font-medium text-right text-xs">Rate</th>
                                <th className="py-1 font-medium text-right text-xs">Taxable</th>
                                <th className="py-1 font-medium text-right text-xs">Tax Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.payeBreakdown.map((item, index) => (
                                <tr key={index} className="border-b last:border-b-0" data-component="divider-dashed">
                                    <td className="py-1 text-xs">{item.bracketRange}</td>
                                    <td className="py-1 text-right font-mono text-xs">{(item.rate * 100).toFixed(1)}%</td>
                                    <td className="py-1 text-right font-mono text-xs">{formatCurrency(item.taxable)}</td>
                                    <td className="py-1 text-right font-mono text-xs">{formatCurrency(item.tax)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </li>
            )}
        </ul>
    </div>
);

export default SalaryCalculationDetails;
