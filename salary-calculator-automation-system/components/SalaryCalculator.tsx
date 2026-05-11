
import React, { useState, useMemo } from 'react';
import { SALARY_STEPS, MIN_ANNUAL_SALARY, MAX_ANNUAL_SALARY, MIN_JUSTIFICATION_LENGTH } from '../constants';
import { useSalaryCalculator } from '../hooks/useSalaryCalculator';
import ResultsDisplay from './ResultsDisplay';
import { Card, Input, Button, ToggleSwitch, Select } from './UIComponents';
import type { SalaryStep } from '../types';

const SalaryCalculator: React.FC = () => {
  const { inputs, result, error, updateInput, reset } = useSalaryCalculator({
    annualSalary: 28001.83,
    selectedStep: SALARY_STEPS.find(s => s.stepCode === 'SM0105/2') || null,
    hasStudentLoan: true,
    useCustomAllowance: false,
    customAllowance: null,
    justification: '',
  });

  const isCustomAllowanceValid = 
    !inputs.useCustomAllowance || 
    (inputs.customAllowance !== null && inputs.customAllowance >= 0);
    
  const isJustificationValid = 
    !inputs.useCustomAllowance || 
    (inputs.justification.length >= MIN_JUSTIFICATION_LENGTH);

  const canSubmit = result && !error && isCustomAllowanceValid && isJustificationValid;

  const handleSubmit = () => {
    if (!canSubmit) return;
    console.log("Submitting calculation:", { inputs, result });
    alert(
        `Salary calculation for ${inputs.selectedStep?.stepCode} has been processed.
        ${inputs.useCustomAllowance ? "It is now pending approval from Mr. Twum." : "It has been auto-approved."}`
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      <div className="lg:col-span-2">
        <Card title="Calculation Inputs">
          <div className="space-y-6">
            <div>
              <label htmlFor="annual-salary" className="block text-sm font-medium text-gray-700">Annual Salary (₵)</label>
              <Input
                id="annual-salary"
                type="number"
                placeholder="e.g., 30000"
                value={inputs.annualSalary ?? ''}
                onChange={e => updateInput('annualSalary', e.target.valueAsNumber || null)}
                min={MIN_ANNUAL_SALARY}
                max={MAX_ANNUAL_SALARY}
              />
            </div>
            
            <div>
              <label htmlFor="step-code" className="block text-sm font-medium text-gray-700">Step Code</label>
              <Select
                id="step-code"
                value={inputs.selectedStep?.stepCode || ''}
                onChange={e => updateInput('selectedStep', SALARY_STEPS.find(s => s.stepCode === e.target.value) || null)}
              >
                  <option value="" disabled>Select a step code</option>
                  {SALARY_STEPS.map(step => (
                      <option key={step.stepCode} value={step.stepCode}>
                          {step.stepCode} - {step.description}
                      </option>
                  ))}
              </Select>
               {inputs.selectedStep && (
                <p className="mt-2 text-sm text-gray-500">
                  Standard Allowance: ₵{inputs.selectedStep.standardAllowance.toFixed(2)}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Has Student Loan?</span>
              <ToggleSwitch
                enabled={inputs.hasStudentLoan}
                onChange={value => updateInput('hasStudentLoan', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Use Custom Allowance?</span>
              <ToggleSwitch
                enabled={inputs.useCustomAllowance}
                onChange={value => {
                  updateInput('useCustomAllowance', value);
                  if(!value) {
                    updateInput('customAllowance', null);
                    updateInput('justification', '');
                  }
                }}
              />
            </div>

            {inputs.useCustomAllowance && (
              <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50/50">
                <div>
                  <label htmlFor="custom-allowance" className="block text-sm font-medium text-blue-800">Custom Consolidated Allowance (₵)</label>
                  <Input
                    id="custom-allowance"
                    type="number"
                    placeholder="Enter custom amount"
                    value={inputs.customAllowance ?? ''}
                    onChange={e => updateInput('customAllowance', e.target.valueAsNumber || null)}
                  />
                </div>
                <div>
                  <label htmlFor="justification" className="block text-sm font-medium text-blue-800">Justification</label>
                  <textarea
                    id="justification"
                    rows={4}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent sm:text-sm ${!isJustificationValid ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Provide detailed justification for this exception (min 50 characters)."
                    value={inputs.justification}
                    onChange={e => updateInput('justification', e.target.value)}
                  />
                   {!isJustificationValid && (
                     <p className="mt-1 text-xs text-red-600">Justification must be at least {MIN_JUSTIFICATION_LENGTH} characters long.</p>
                   )}
                </div>
              </div>
            )}
            
            <div className="flex space-x-3">
              <Button onClick={handleSubmit} disabled={!canSubmit} variant="primary">
                {inputs.useCustomAllowance ? 'Submit for Approval' : 'Save Calculation'}
              </Button>
              <Button onClick={reset} variant="secondary">Reset</Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <ResultsDisplay result={result} error={error} />
      </div>
    </div>
  );
};

export default SalaryCalculator;
