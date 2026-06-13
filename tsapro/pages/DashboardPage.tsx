
import React, { useState, useEffect, useMemo } from 'react';
import { performFullSalaryCalculation } from '../utils/salaryCalculations';
import { SalaryBreakdown, StepCodeData, AuditLogEvent, SalaryCalculationLogDetails } from '../types';
import { useStepCodes } from '../contexts/StepCodesContext';
import { addLog } from '../services/auditLogService';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Toggle from '../components/common/Toggle';
import Button from '../components/common/Button';

// --- Icons ---

const AlertTriangle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
);

const BrushIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>
);

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>
);

const TrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
);

const TrendingDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
);

const WalletIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/></svg>
);

// --- Helper Functions ---

const formatCurrency = (amount: number) => {
    return `₵ ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

const formatNumber = (amount: number) => {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

// --- Sub-Components ---

interface GradeSelectorProps {
    stepCodes: StepCodeData[];
    onSelectStep: (step: StepCodeData | null) => void;
    onFlexibleSelection: (allowance: number, baseGrade: string) => void;
    activeMode: 'standard' | 'flexible';
    onModeChange: (mode: 'standard' | 'flexible') => void;
    onCustomLabelChange: (label: string) => void;
    customLabel: string;
}

const GradeSelector: React.FC<GradeSelectorProps> = ({ 
    stepCodes, 
    onSelectStep, 
    onFlexibleSelection,
    activeMode,
    onModeChange,
    onCustomLabelChange,
    customLabel
}) => {
    // Mode: Standard
    const [selectedGradeIndex, setSelectedGradeIndex] = useState('');
    
    // Mode: Flexible (Grade Family)
    const [selectedGradeFamily, setSelectedGradeFamily] = useState('');

    // Derived Lists
    const stepOptions = useMemo(() => {
        return stepCodes.map((sc, index) => ({
            value: index.toString(),
            label: `${sc.code} - ${sc.status}${sc.empCode ? ` (${sc.empCode})` : ''}`,
            status: sc.status
        }));
    }, [stepCodes]);

    const gradeFamilies = useMemo(() => {
        const families = new Map<string, number>();
        stepCodes.forEach(sc => {
            // Extract generic grade e.g., SM0105 from SM0105/4
            const parts = sc.code.split('/');
            const base = parts[0];
            if (base && !families.has(base)) {
                // We use the allowance of the first encountered step as the 'base' allowance for this grade family
                families.set(base, sc.allowance); 
            }
        });
        return Array.from(families.entries()).map(([code, allowance]) => ({ code, allowance })).sort((a, b) => a.code.localeCompare(b.code));
    }, [stepCodes]);

    useEffect(() => {
        // Reset internal sub-states when mode changes
        setSelectedGradeIndex('');
        setSelectedGradeFamily('');
        onCustomLabelChange('');
    }, [activeMode, onCustomLabelChange]);

    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const idx = e.target.value;
        setSelectedGradeIndex(idx);
        if (idx) {
            onSelectStep(stepCodes[parseInt(idx, 10)]);
        } else {
            onSelectStep(null);
        }
    };

    const handleFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        setSelectedGradeFamily(code);
        
        if (code === 'CUSTOM') {
            // Signal to reset inputs for full manual entry
            onFlexibleSelection(-1, 'Custom Entry');
            return;
        }

        const family = gradeFamilies.find(f => f.code === code);
        if (family) {
            onFlexibleSelection(family.allowance, family.code);
        } else {
            onFlexibleSelection(0, '');
        }
    };

    return (
        <Card as="section" ariaLabelledby="grade-selector-heading" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h2 id="grade-selector-heading" className="text-2xl font-bold" data-component="title">Step 1: Select Grade/Step</h2>
            </div>
            
            {/* Mode Tabs */}
            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-4 overflow-x-auto">
                <button
                    onClick={() => onModeChange('standard')}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${activeMode === 'standard' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                >
                    Standard List (Fixed)
                </button>
                <button
                    onClick={() => onModeChange('flexible')}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${activeMode === 'flexible' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                >
                    Flexible (Manual Salary)
                </button>
            </div>

            {/* Mode Content */}
            {activeMode === 'standard' && (
                <div className="animate-in fade-in duration-300">
                    <Select id="grade-selector" label="Select Exact Grade/Step" value={selectedGradeIndex} onChange={handleGradeChange}>
                        <option value="">Select a Grade/Step...</option>
                        {stepOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </Select>
                    <p className="text-xs mt-2" data-component="text-secondary">Use this for existing staff or exact matches. You can still manually edit the salary below to override.</p>
                </div>
            )}

            {activeMode === 'flexible' && (
                <div className="animate-in fade-in duration-300 space-y-3">
                     <Select id="grade-family-selector" label="Select Grade (Allowance Preset)" value={selectedGradeFamily} onChange={handleFamilyChange}>
                        <option value="">Select Grade Code...</option>
                        <option value="CUSTOM" className="font-bold text-blue-600 dark:text-blue-400">Custom (Fully Manual)</option>
                        {gradeFamilies.map(f => (
                            <option key={f.code} value={f.code}>{f.code} (Base Allow: {formatCurrency(f.allowance)})</option>
                        ))}
                    </Select>
                    {selectedGradeFamily === 'CUSTOM' && (
                        <div className="animate-in fade-in slide-in-from-top-1">
                            <Input 
                                id="custom-grade-label"
                                label="Custom Grade/Version Label"
                                placeholder="e.g. SM0105/99 (Contract)"
                                value={customLabel}
                                onChange={(e) => onCustomLabelChange(e.target.value)}
                            />
                        </div>
                    )}
                    <p className="text-xs" data-component="text-secondary">
                        {selectedGradeFamily === 'CUSTOM' 
                            ? "Enter a custom Grade/Version label and fill in salary details below manually."
                            : "Select a grade code to auto-fill allowance. You must enter the Annual Salary yourself in Step 2."}
                    </p>
                </div>
            )}
        </Card>
    );
};

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

const PayslipDisplay: React.FC<{ breakdown: SalaryBreakdown | null, recruitName: string }> = ({ breakdown, recruitName }) => {
    const [showPayeDetails, setShowPayeDetails] = useState(false);
    const [showSsnitDetails, setShowSsnitDetails] = useState(false);
    const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly');
    
    useEffect(() => {
        setShowPayeDetails(false);
        setShowSsnitDetails(false);
    }, [breakdown]);

    if (!breakdown) {
        return (
            <Card as="aside" ariaLabelledby="payslip-placeholder-heading" className="w-full lg:w-96 flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center p-6">
                    <WalletIcon className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p id="payslip-placeholder-heading" data-component="text-secondary" className="font-medium">Calculation Pending</p>
                    <p className="text-xs mt-2 text-gray-400">Select a grade or enter salary details to generate a payslip.</p>
                </div>
            </Card>
        );
    }
    
    const MonthlyView = () => (
        <div className="space-y-4 text-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2" data-component="payslip-section-header">
                    <TrendingUpIcon className="w-5 h-5" aria-hidden="true" />
                    Earnings
                </h3>
                <div className="space-y-1 pl-2">
                    <div className="flex justify-between items-center py-2" data-component="payslip-row">
                        <span data-component="text-secondary">Monthly Basic Salary</span>
                        <span className="font-medium font-mono" data-component="text-primary">{formatCurrency(breakdown.monthlyBasic)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2" data-component="payslip-row">
                        <span data-component="text-secondary">Consolidated Allowance</span>
                        <span className="font-medium font-mono" data-component="text-primary">{formatCurrency(breakdown.consolidatedAllowance)}</span>
                    </div>
                    {breakdown.additionalAllowance > 0 && (
                         <div className="flex justify-between items-center py-2" data-component="payslip-row">
                            <span data-component="text-secondary">Additional Allowance</span>
                            <span className="font-medium font-mono" data-component="text-primary">{formatCurrency(breakdown.additionalAllowance)}</span>
                        </div>
                    )}
                </div>
                <div className="flex justify-between items-center font-bold pt-2 mt-2" data-component="breakdown-section">
                    <span data-component="text-primary">Gross Monthly Salary</span>
                    <span className="font-mono" data-component="text-success">{formatCurrency(breakdown.grossMonthly)}</span>
                </div>
            </div>

            <div>
                 <h3 className="font-semibold mb-2 flex items-center gap-2" data-component="payslip-section-header">
                    <TrendingDownIcon className="w-5 h-5" aria-hidden="true" />
                    Deductions
                </h3>
                 <div className="space-y-1 pl-2">
                    {breakdown.ssnit > 0 && (
                        <div className="py-2" data-component="payslip-row">
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => setShowSsnitDetails(prev => !prev)}
                                    className="flex items-center gap-1 text-left hover:underline"
                                    data-component="text-secondary"
                                    aria-expanded={showSsnitDetails}
                                    aria-controls="ssnit-details"
                                >
                                    SSNIT (5.5%)
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${showSsnitDetails ? 'rotate-180' : ''}`} aria-hidden="true" />
                                </button>
                                <span className="font-medium font-mono" data-component="text-primary">- {formatCurrency(breakdown.ssnit)}</span>
                            </div>
                            {showSsnitDetails && breakdown.ssnitDetails && (
                                <div id="ssnit-details" className="pl-2 mt-2 text-xs" data-component="payslip-table-container">
                                     <table className="w-full">
                                        <tbody>
                                            <tr>
                                                <td className="truncate text-left">Monthly Base for SSNIT</td>
                                                <td className="text-right font-mono">{formatCurrency(breakdown.ssnitDetails.base / 12)}</td>
                                            </tr>
                                            <tr>
                                                <td className="truncate text-left">SSNIT Rate</td>
                                                <td className="text-right font-mono">{(breakdown.ssnitDetails.rate * 100).toFixed(1)}%</td>
                                            </tr>
                                            <tr className="border-t" data-component="divider-dashed">
                                                <td className="truncate text-left font-semibold pt-1">Monthly Contribution</td>
                                                <td className="text-right font-mono font-semibold pt-1">{formatCurrency(breakdown.ssnitDetails.contribution / 12)}</td>
                                            </tr>
                                            {breakdown.ssnitDetails.tierCapApplied && (
                                                 <tr>
                                                    <td colSpan={2} className="text-right italic pt-1" data-component="text-tertiary">Annual Tier 1 cap applied</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {breakdown.paye > 0 && (
                        <div className="py-2" data-component="payslip-row">
                            <div className="flex justify-between items-center">
                                <button 
                                    onClick={() => setShowPayeDetails(prev => !prev)} 
                                    className="flex items-center gap-1 text-left hover:underline" 
                                    data-component="text-secondary"
                                    aria-expanded={showPayeDetails}
                                    aria-controls="paye-details"
                                >
                                    PAYE (Income Tax)
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${showPayeDetails ? 'rotate-180' : ''}`} aria-hidden="true" />
                                </button>
                                <span className="font-medium font-mono" data-component="text-primary">- {formatCurrency(breakdown.paye)}</span>
                            </div>
                            {showPayeDetails && breakdown.payeBreakdown && (
                                <div id="paye-details" className="pl-2 mt-2 text-xs" data-component="payslip-table-container">
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <th className="font-semibold text-left truncate">Bracket</th>
                                                <th className="font-semibold text-right">Rate</th>
                                                <th className="font-semibold text-right">Taxable</th>
                                                <th className="font-semibold text-right">Tax</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {breakdown.payeBreakdown.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="truncate text-left">{item.bracketRange}</td>
                                                    <td className="text-right font-mono">{(item.rate * 100).toFixed(1)}%</td>
                                                    <td className="text-right font-mono">{formatCurrency(item.taxable)}</td>
                                                    <td className="text-right font-mono">{formatCurrency(item.tax)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {breakdown.studentLoan > 0 && <div className="flex justify-between items-center py-2" data-component="payslip-row">
                        <span data-component="text-secondary">Student Loan</span>
                        <span className="font-medium font-mono" data-component="text-primary">- {formatCurrency(breakdown.studentLoan)}</span>
                    </div>}
                 </div>
                 <div className="flex justify-between items-center font-bold pt-2 mt-2" data-component="breakdown-section">
                    <span data-component="text-primary">Total Deductions</span>
                    <span className="font-mono" data-component="text-danger">- {formatCurrency(breakdown.totalDeductions)}</span>
                </div>
            </div>
            
            {breakdown.grossMonthly > 0 && (
                <div className="flex justify-between items-center py-1 text-xs" data-component="payslip-row">
                    <span data-component="text-secondary">Effective Tax Rate</span>
                    <span className="font-semibold font-mono" data-component="text-tertiary">
                        {((breakdown.paye * 12) / breakdown.grossAnnual * 100).toFixed(2)}%
                    </span>
                </div>
            )}

            <div data-component="payslip-final-total">
                 <div className="flex justify-between items-center">
                    <span className="font-bold flex items-center gap-2" data-component="text-primary">
                        <WalletIcon className="w-6 h-6" aria-hidden="true" />
                        Net Monthly Take-Home
                    </span>
                    <div className="text-right">
                        <span className="font-bold text-3xl" data-component="text-accent">
                            <span className="text-xl align-middle mr-1" data-component="text-tertiary">₵</span>
                            {formatNumber(breakdown.netMonthly)}
                        </span>
                    </div>
                </div>
             </div>
        </div>
    );

    const AnnualView = () => (
        <div className="space-y-4 text-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
                 <h3 className="font-semibold mb-2 flex items-center gap-2" data-component="payslip-section-header">
                    <TrendingUpIcon className="w-5 h-5" aria-hidden="true" />
                    Earnings
                </h3>
                <div className="space-y-1 pl-2">
                    <div className="flex justify-between items-center py-2" data-component="payslip-row">
                        <span data-component="text-secondary">Annual Basic Salary</span>
                        <span className="font-medium font-mono" data-component="text-primary">{formatCurrency(breakdown.annualBasic)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2" data-component="payslip-row">
                        <span data-component="text-secondary">Consolidated Allowance (Annual)</span>
                        <span className="font-medium font-mono" data-component="text-primary">{formatCurrency(breakdown.annualAllowance)}</span>
                    </div>
                    {breakdown.additionalAllowance > 0 && (
                         <div className="flex justify-between items-center py-2" data-component="payslip-row">
                            <span data-component="text-secondary">Additional Allowance (Annual)</span>
                            <span className="font-medium font-mono" data-component="text-primary">{formatCurrency(breakdown.additionalAllowance * 12)}</span>
                        </div>
                    )}
                </div>
                <div className="flex justify-between items-center font-bold pt-2 mt-2" data-component="breakdown-section">
                    <span data-component="text-primary">Gross Annual Salary</span>
                    <span className="font-mono" data-component="text-success">{formatCurrency(breakdown.grossAnnual)}</span>
                </div>
            </div>

            <div>
                 <h3 className="font-semibold mb-2 flex items-center gap-2" data-component="payslip-section-header">
                    <TrendingDownIcon className="w-5 h-5" aria-hidden="true" />
                    Deductions
                </h3>
                 <div className="space-y-1 pl-2">
                    {breakdown.ssnit > 0 && (
                        <div className="py-2" data-component="payslip-row">
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => setShowSsnitDetails(prev => !prev)}
                                    className="flex items-center gap-1 text-left hover:underline"
                                    data-component="text-secondary"
                                    aria-expanded={showSsnitDetails}
                                    aria-controls="ssnit-details-annual"
                                >
                                    SSNIT (5.5%)
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${showSsnitDetails ? 'rotate-180' : ''}`} aria-hidden="true" />
                                </button>
                                <span className="font-medium font-mono" data-component="text-primary">- {formatCurrency(breakdown.ssnit * 12)}</span>
                            </div>
                            {showSsnitDetails && breakdown.ssnitDetails && (
                                <div id="ssnit-details-annual" className="pl-2 mt-2 text-xs" data-component="payslip-table-container">
                                     <p className="font-semibold mb-1">Annual SSNIT Breakdown</p>
                                    <table className="w-full">
                                        <tbody>
                                            <tr>
                                                <td className="truncate text-left">Annual Base for SSNIT</td>
                                                <td className="text-right font-mono">{formatCurrency(breakdown.ssnitDetails.base)}</td>
                                            </tr>
                                            <tr>
                                                <td className="truncate text-left">SSNIT Rate</td>
                                                <td className="text-right font-mono">{(breakdown.ssnitDetails.rate * 100).toFixed(1)}%</td>
                                            </tr>
                                             <tr className="border-t" data-component="divider-dashed">
                                                <td className="truncate text-left font-semibold pt-1">Annual Contribution</td>
                                                <td className="text-right font-mono font-semibold pt-1">{formatCurrency(breakdown.ssnitDetails.contribution)}</td>
                                            </tr>
                                            {breakdown.ssnitDetails.tierCapApplied && (
                                                <tr>
                                                    <td colSpan={2} className="text-right italic pt-1" data-component="text-tertiary">Tier 1 cap applied</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {breakdown.paye > 0 && (
                        <div className="py-2" data-component="payslip-row">
                             <div className="flex justify-between items-center">
                                <button 
                                    onClick={() => setShowPayeDetails(prev => !prev)} 
                                    className="flex items-center gap-1 text-left hover:underline" 
                                    data-component="text-secondary"
                                    aria-expanded={showPayeDetails}
                                    aria-controls="paye-details-annual"
                                >
                                    PAYE (Income Tax)
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${showPayeDetails ? 'rotate-180' : ''}`} aria-hidden="true" />
                                </button>
                                <span className="font-medium font-mono" data-component="text-primary">- {formatCurrency(breakdown.paye * 12)}</span>
                            </div>
                            {showPayeDetails && breakdown.payeBreakdown && (
                                <div id="paye-details-annual" className="pl-2 mt-2 text-xs" data-component="payslip-table-container">
                                    <p className="font-semibold mb-1">Annual PAYE Breakdown</p>
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <th className="font-semibold text-left truncate">Bracket</th>
                                                <th className="font-semibold text-right">Rate</th>
                                                <th className="font-semibold text-right">Taxable</th>
                                                <th className="font-semibold text-right">Tax</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {breakdown.payeBreakdown.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="truncate text-left">{item.bracketRange}</td>
                                                    <td className="text-right font-mono">{(item.rate * 100).toFixed(1)}%</td>
                                                    <td className="text-right font-mono">{formatCurrency(item.taxable)}</td>
                                                    <td className="text-right font-mono">{formatCurrency(item.tax)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {breakdown.studentLoan > 0 && <div className="flex justify-between items-center py-2" data-component="payslip-row">
                        <span data-component="text-secondary">Student Loan</span>
                        <span className="font-medium font-mono" data-component="text-primary">- {formatCurrency(breakdown.studentLoan * 12)}</span>
                    </div>}
                 </div>
                 <div className="flex justify-between items-center font-bold pt-2 mt-2" data-component="breakdown-section">
                    <span data-component="text-primary">Total Annual Deductions</span>
                    <span className="font-mono" data-component="text-danger">- {formatCurrency(breakdown.totalAnnualDeductions)}</span>
                </div>
            </div>
            
             <div data-component="payslip-final-total">
                 <div className="flex justify-between items-center">
                     <span className="font-bold flex items-center gap-2" data-component="text-primary">
                        <WalletIcon className="w-6 h-6" aria-hidden="true" />
                        Net Annual Take-Home
                    </span>
                    <div className="text-right">
                        <span className="font-bold text-3xl" data-component="text-accent">
                            <span className="text-xl align-middle mr-1" data-component="text-tertiary">₵</span>
                            {formatNumber(breakdown.netAnnual)}
                        </span>
                    </div>
                </div>
             </div>
        </div>
    );
    
    return (
        <Card as="aside" ariaLabelledby="payslip-summary-heading" className="w-full lg:w-96" data-component="payslip-summary">
            <h2 id="payslip-summary-heading" className="text-2xl font-bold text-center mb-2" data-component="title">Step 3: Payslip Summary</h2>
            {recruitName && <p className="text-center font-semibold mb-4" data-component="text-accent">{recruitName}</p>}
            
            <div className="flex justify-center mb-4">
                <div data-component="segmented-control" className="p-1 rounded-full text-sm font-medium">
                    <button
                        type="button"
                        onClick={() => setViewMode('monthly')}
                        data-active={viewMode === 'monthly'}
                    >
                        Monthly
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('annual')}
                        data-active={viewMode === 'annual'}
                    >
                        Annual
                    </button>
                </div>
            </div>
            
            <div className="flex justify-center mb-2">
                <button
                    type="button"
                    onClick={() => {
                        const effectiveRate = ((breakdown.paye * 12) / breakdown.grossAnnual * 100).toFixed(2);
                        const lines = [
                            '============================================',
                            '     TECHBRIDGE SALARY ADMINISTRATION PORTAL',
                            '============================================',
                            `Generated: ${new Date().toLocaleString()}`,
                            `Recruit:   ${recruitName || 'N/A'}`,
                            '--------------------------------------------',
                            'EARNINGS',
                            `  Monthly Basic Salary       ${formatCurrency(breakdown.monthlyBasic)}`,
                            `  Consolidated Allowance     ${formatCurrency(breakdown.consolidatedAllowance)}`,
                            ...(breakdown.additionalAllowance > 0 ? [`  Additional Allowance       ${formatCurrency(breakdown.additionalAllowance)}`] : []),
                            `  Gross Monthly              ${formatCurrency(breakdown.grossMonthly)}`,
                            '--------------------------------------------',
                            'DEDUCTIONS',
                            ...(breakdown.ssnit > 0 ? [`  SSNIT (5.5%)               - ${formatCurrency(breakdown.ssnit)}`] : []),
                            ...(breakdown.paye > 0 ? [`  PAYE (Income Tax)          - ${formatCurrency(breakdown.paye)}`] : []),
                            ...(breakdown.studentLoan > 0 ? [`  Student Loan               - ${formatCurrency(breakdown.studentLoan)}`] : []),
                            `  Total Deductions          - ${formatCurrency(breakdown.totalDeductions)}`,
                            `  Effective Tax Rate         ${effectiveRate}%`,
                            '============================================',
                            `  NET MONTHLY TAKE-HOME      ${formatCurrency(breakdown.netMonthly)}`,
                            '============================================',
                            '',
                            'ANNUAL SUMMARY',
                            `  Gross Annual              ${formatCurrency(breakdown.grossAnnual)}`,
                            `  Total Annual Deductions   - ${formatCurrency(breakdown.totalAnnualDeductions)}`,
                            `  Net Annual               ${formatCurrency(breakdown.netAnnual)}`,
                            '============================================',
                        ];
                        const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `payslip_${(recruitName || 'recruit').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-[var(--color-border-primary)] text-[var(--color-accent-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                    <DownloadIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    Export Payslip
                </button>
            </div>

            {viewMode === 'monthly' ? <MonthlyView /> : <AnnualView />}
        </Card>
    );
};


const DashboardPage: React.FC = () => {
    const { stepCodes } = useStepCodes();
    const [recruitName, setRecruitName] = useState('');
    
    // Primary State
    const [gradeSelectorMode, setGradeSelectorMode] = useState<'standard' | 'flexible'>('standard');
    const [selectedStep, setSelectedStep] = useState<StepCodeData | null>(null);
    const [customGradeLabel, setCustomGradeLabel] = useState('');
    
    // Input Values (Source of Truth for Calculation)
    const [annualSalaryInput, setAnnualSalaryInput] = useState('');
    const [allowanceInput, setAllowanceInput] = useState('');
    const [additionalAllowanceInput, setAdditionalAllowanceInput] = useState('');
    const [isSsnitExempt, setIsSsnitExempt] = useState(false);
    const [applyStudentLoan, setApplyStudentLoan] = useState(false);
    const [flexibleGradeCode, setFlexibleGradeCode] = useState('');

    // --- Handlers ---

    const handleStepSelection = (step: StepCodeData | null) => {
        setSelectedStep(step);
        if (step) {
            setAnnualSalaryInput(step.annualSalary.toString());
            setAllowanceInput(step.allowance.toString());
            setIsSsnitExempt(step.isSsnitExempt);
            setApplyStudentLoan(false);
            setAdditionalAllowanceInput('');
        }
    };

    const handleFlexibleSelection = (allowance: number, baseGrade: string) => {
        // -1 signals a custom entry where we want fields cleared/empty for manual typing
        setAllowanceInput(allowance === -1 ? '' : allowance.toString());
        setFlexibleGradeCode(baseGrade);
        // In flexible mode, we reset the specific step link
        setSelectedStep(null);
        // We assume standard SSNIT unless changed manually
        setIsSsnitExempt(false); 
    };

    const handleClearOverrides = () => {
        if (gradeSelectorMode === 'standard' && selectedStep) {
            setAnnualSalaryInput(selectedStep.annualSalary.toString());
            setAllowanceInput(selectedStep.allowance.toString());
            setIsSsnitExempt(selectedStep.isSsnitExempt);
        } else {
            setAnnualSalaryInput('');
            setAllowanceInput('');
            setIsSsnitExempt(false);
            setCustomGradeLabel('');
        }
        setAdditionalAllowanceInput('');
        setApplyStudentLoan(false);
    };

    // --- Derived State for UI logic ---

    const currentAnnualSalary = parseFloat(annualSalaryInput) || 0;
    const currentAllowance = parseFloat(allowanceInput) || 0;
    const currentAdditionalAllowance = parseFloat(additionalAllowanceInput) || 0;

    // Detect Overrides
    // Standard Mode: Warn if inputs differ from the selected specific grade.
    // Flexible Mode: Manual inputs are expected, so we don't treat Salary as an "Override" in a warning sense.
    // However, we track if user changes the consolidated allowance FROM the grade default.
    
    const isSalaryOverridden = gradeSelectorMode === 'standard' && selectedStep 
        ? Math.abs(currentAnnualSalary - selectedStep.annualSalary) > 0.01 
        : false;

    // For flexible mode, we check if allowance differs from what the flexible grade selector set?
    // Hard to track without extra state. For now, we simplify: overrides only relevant if selectedStep exists (Standard Mode)
    const isAllowanceOverridden = selectedStep ? Math.abs(currentAllowance - selectedStep.allowance) > 0.01 : false;
    const isSsnitExemptOverridden = selectedStep ? isSsnitExempt !== selectedStep.isSsnitExempt : false;

    // Centralized Calculation
    const salaryBreakdown = useMemo(() => {
        if (currentAnnualSalary <= 0) return null;

        const studentLoanAmount = (applyStudentLoan && selectedStep?.studentLoanInSheet) 
            ? selectedStep.studentLoanInSheet 
            : null;

        return performFullSalaryCalculation(
            currentAnnualSalary,
            currentAllowance,
            isSsnitExempt,
            studentLoanAmount,
            currentAdditionalAllowance
        );
    }, [currentAnnualSalary, currentAllowance, currentAdditionalAllowance, isSsnitExempt, applyStudentLoan, selectedStep]);


    // Logging Effect
    useEffect(() => {
        const handler = setTimeout(() => {
            if (!salaryBreakdown || !recruitName.trim()) return;
            
            let stepCodeLabel = 'Manual Entry';
            if (gradeSelectorMode === 'standard' && selectedStep) {
                stepCodeLabel = `${selectedStep.code} - ${selectedStep.status} (${selectedStep.empCode})`;
            } else if (gradeSelectorMode === 'flexible' && flexibleGradeCode) {
                if (flexibleGradeCode === 'Custom Entry') {
                    stepCodeLabel = customGradeLabel ? `Custom Grade: ${customGradeLabel}` : `Flexible Grade: Custom Entry`;
                } else {
                    stepCodeLabel = `Flexible Grade: ${flexibleGradeCode}`;
                }
            }

            const logDetails: SalaryCalculationLogDetails = {
                recruitName: recruitName.trim(),
                annualSalary: currentAnnualSalary,
                stepCode: stepCodeLabel,
                salaryOverrideValue: isSalaryOverridden ? currentAnnualSalary : null,
                wasSalaryOverridden: isSalaryOverridden,
                allowanceOverrideValue: isAllowanceOverridden ? currentAllowance : null,
                wasAllowanceOverridden: isAllowanceOverridden,
                wasSsnitExemptOverridden: isSsnitExemptOverridden,
                monthlyBasic: salaryBreakdown.monthlyBasic,
                consolidatedAllowance: salaryBreakdown.consolidatedAllowance,
                additionalAllowance: salaryBreakdown.additionalAllowance,
                grossMonthly: salaryBreakdown.grossMonthly,
                taxableMonthly: salaryBreakdown.taxableMonthly,
                ssnit: salaryBreakdown.ssnit,
                isSsnitExempt: isSsnitExempt,
                paye: salaryBreakdown.paye,
                studentLoanApplied: applyStudentLoan,
                studentLoanDeduction: salaryBreakdown.studentLoan,
                netSalary: salaryBreakdown.netMonthly,
                ssnitDetails: salaryBreakdown.ssnitDetails,
                payeBreakdown: salaryBreakdown.payeBreakdown,
            };
            addLog(AuditLogEvent.SALARY_CALCULATION, JSON.stringify(logDetails));
        }, 1000); // Debounce 1s

        return () => clearTimeout(handler);
    }, [salaryBreakdown, recruitName, currentAnnualSalary, currentAllowance, currentAdditionalAllowance, isSsnitExempt, isSalaryOverridden, isAllowanceOverridden, isSsnitExemptOverridden, selectedStep, applyStudentLoan, gradeSelectorMode, flexibleGradeCode, customGradeLabel]);

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-[clamp(1.5rem,5vw,1.875rem)] font-extrabold mb-8" data-component="title">New Recruit Salary Portal</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 flex flex-col gap-8">
                    <GradeSelector 
                      stepCodes={stepCodes}
                      onSelectStep={handleStepSelection}
                      onFlexibleSelection={handleFlexibleSelection}
                      activeMode={gradeSelectorMode}
                      onModeChange={setGradeSelectorMode}
                      onCustomLabelChange={setCustomGradeLabel}
                      customLabel={customGradeLabel}
                    />

                    <Card as="section" ariaLabelledby="calculator-heading">
                        <div className="flex justify-between items-center mb-6">
                             <h2 id="calculator-heading" className="text-2xl font-bold" data-component="title">Step 2: Calculate Net Salary</h2>
                             <Button variant="secondary" onClick={handleClearOverrides} className="flex items-center gap-2 text-xs px-3 py-1 flex-shrink-0">
                                <BrushIcon className="w-4 h-4" aria-hidden="true" />
                                Reset / Clear
                             </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <Input id="recruit-name" label="Recruit Name" type="text" value={recruitName} onChange={(e) => setRecruitName(e.target.value)} placeholder="e.g., Jane Doe" />
                            </div>
                            
                            {/* Salary Input */}
                            <div className="md:col-span-2">
                                <Input
                                    id="annual-salary"
                                    label="Annual Basic Salary (₵)"
                                    type="number"
                                    value={annualSalaryInput}
                                    onChange={(e) => setAnnualSalaryInput(e.target.value)}
                                    placeholder={gradeSelectorMode === 'flexible' ? "Enter Step salary manually..." : "Enter salary (type to override)..."}
                                    min="0"
                                    isOverridden={isSalaryOverridden}
                                />
                                {isSalaryOverridden && (
                                    <div className="mt-2 p-2 rounded-md flex items-center gap-2" data-component="warning-box">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true"/>
                                        <p className="text-xs">
                                            Salary manually changed from selected grade standard.
                                        </p>
                                    </div>
                                )}
                                {gradeSelectorMode === 'flexible' && !annualSalaryInput && (
                                    <p className="text-xs mt-1" data-component="text-secondary">
                                        Please enter the specific salary for this Step.
                                    </p>
                                )}
                            </div>

                            {/* Allowance Input */}
                             <div>
                                <Input
                                    id="consolidated-allowance"
                                    label="Monthly Consolidated Allowance (₵)"
                                    type="number"
                                    value={allowanceInput}
                                    onChange={(e) => setAllowanceInput(e.target.value)}
                                    placeholder="Enter allowance..."
                                    min="0"
                                    isOverridden={isAllowanceOverridden}
                                />
                                {isAllowanceOverridden && (
                                    <div className="mt-2 p-2 rounded-md flex items-center gap-2" data-component="warning-box">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true"/>
                                        <p className="text-xs">
                                            Allowance manually changed from grade default.
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Additional Allowance (New) */}
                            <div>
                                <Input
                                    id="additional-allowance"
                                    label="Additional Monthly Allowance (₵)"
                                    type="number"
                                    value={additionalAllowanceInput}
                                    onChange={(e) => setAdditionalAllowanceInput(e.target.value)}
                                    placeholder="e.g. Manual Adjustments"
                                    min="0"
                                />
                                {parseFloat(additionalAllowanceInput) > 0 && (
                                     <p className="text-xs mt-1" data-component="text-secondary">
                                        Added to Gross & Taxable Income.
                                    </p>
                                )}
                            </div>

                            {/* Toggles */}
                             <div className="md:col-span-2">
                                <Toggle id="ssnit-exempt" label="SSNIT Exempt" enabled={isSsnitExempt} onChange={setIsSsnitExempt} isOverridden={isSsnitExemptOverridden} />
                                {isSsnitExemptOverridden && (
                                    <div className="mt-2 p-2 rounded-md flex items-center gap-2" data-component="warning-box">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                                        <p className="text-xs">
                                            SSNIT status manually changed from grade default.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <Toggle
                                    id="student-loan"
                                    label="Apply Student Loan Deduction"
                                    enabled={applyStudentLoan}
                                    onChange={setApplyStudentLoan}
                                    disabled={gradeSelectorMode === 'standard' && !selectedStep?.studentLoanInSheet}
                                />
                                {gradeSelectorMode === 'standard' && selectedStep?.studentLoanInSheet ? (
                                    <p className="text-xs mt-1" data-component="text-tertiary">
                                        If enabled, a monthly deduction of {formatCurrency(selectedStep.studentLoanInSheet)} will be applied.
                                    </p>
                                ) : (
                                     <p className="text-xs mt-1 text-gray-400 italic">
                                        {gradeSelectorMode === 'flexible' ? "Calculates 5% of taxable income." : "Only available for specific grades with predefined loan data."}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="w-full lg:w-96">
                   <PayslipDisplay breakdown={salaryBreakdown} recruitName={recruitName} />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
