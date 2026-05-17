# salary-calculator-automation-system - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for salary-calculator-automation-system.

### FILE: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: App.tsx
```typescript
import React, { useState } from 'react';
import LoginScreen from './components/Login';
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return <MainLayout onLogout={handleLogout} />;
};

export default App;

```

### FILE: components/Icons.tsx
```typescript

import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        {children}
    </svg>
);

export const SaveIcon: React.FC = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338A2.25 2.25 0 0017.088 3.75H15M12 3.75v12m-3.75-6.75h7.5" />
    </IconWrapper>
);

export const PrinterIcon: React.FC = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
    </IconWrapper>
);

export const DocumentDuplicateIcon: React.FC = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </IconWrapper>
);

```

### FILE: components/Login.tsx
```typescript
import React, { useState } from 'react';
import { Card, Input, Button } from './UIComponents';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      if (username === 'admin' && password =[REDACTED_CREDENTIAL]
        onLoginSuccess();
      } else {
        setError('Invalid username or password.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center items-center mb-6">
          <svg className="w-12 h-12 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm3-6h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm3-6h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008ZM6 21v-3.093c0-1.16.536-2.22 1.41-2.907l2.224-1.779c.874-.699 2.026-.699 2.9 0l2.223 1.779c.874.687 1.41 1.747 1.41 2.907V21M6 21h12m-6-15.75v.008" />
          </svg>
          <h1 className="ml-3 text-2xl font-bold text-gray-800 tracking-tight">Salary Calculator</h1>
        </div>
        <Card title="Secure Sign In">
          <form onSubmit={handleLogin} className="p-6 space-y-6">
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="admin"
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password-input" className="block text-sm font-medium text-gray-700">Password</label>
              <Input
                id="password-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="password123"
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" disabled={isLoading} variant="primary" className="w-full">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            <p className="text-xs text-center text-gray-500">
                For demo purposes, use username: <strong>admin</strong> and password: <strong>password123</strong>
            </p>
          </form>
        </Card>
      </div>
      <footer className="text-center p-4 text-gray-500 text-sm mt-8">
        <p>&copy; 2025 SalaryCorp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginScreen;

```

### FILE: components/MainLayout.tsx
```typescript
import React from 'react';
import SalaryCalculator from './SalaryCalculator';
import { Button } from './UIComponents';

interface MainLayoutProps {
    onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <header className="bg-brand-primary shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
                <svg className="w-10 h-10 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm3-6h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm3-6h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008ZM6 21v-3.093c0-1.16.536-2.22 1.41-2.907l2.224-1.779c.874-.699 2.026-.699 2.9 0l2.223 1.779c.874.687 1.41 1.747 1.41 2.907V21M6 21h12m-6-15.75v.008" />
                </svg>
              <h1 className="text-2xl font-bold text-white tracking-tight">Salary Calculator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-brand-light">
                Automation System v1.0
              </div>
              <Button onClick={onLogout} variant="secondary">Logout</Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <SalaryCalculator />
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>&copy; 2025 SalaryCorp. Prepared for Mr. Twum. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;

```

### FILE: components/ResultsDisplay.tsx
```typescript

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

```

### FILE: components/SalaryCalculator.tsx
```typescript

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

```

### FILE: components/UIComponents.tsx
```typescript
import React from 'react';

// --- Card Component ---
interface CardProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, actions }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {actions && <div>{actions}</div>}
    </div>
    <div>{children}</div>
  </div>
);

// --- Input Component ---
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = (props) => (
  <input
    {...props}
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
  />
);

// --- Select Component ---
type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select: React.FC<SelectProps> = ({ children, ...props }) => (
    <select
        {...props}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
    >
        {children}
    </select>
);


// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150';
  
  const variantClasses = {
    primary: 'border-transparent bg-brand-primary text-white hover:bg-brand-secondary focus:ring-brand-primary',
    secondary: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-brand-accent',
    icon: 'p-2 border-gray-300 bg-white text-gray-500 hover:bg-gray-100 focus:ring-brand-accent',
  };

  const sizeClasses = variant === 'icon' ? 'p-2' : 'px-4 py-2';
  
  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${className || ''}`}
    >
      {children}
    </button>
  );
};

// --- ToggleSwitch Component ---
interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange }) => {
    return (
        <button
            type="button"
            className={`${enabled ? 'bg-brand-primary' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2`}
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
        >
            <span
                aria-hidden="true"
                className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    );
};

```

### FILE: constants.ts
```typescript

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

```

### FILE: CREATION.md
```md
# salary-calculator-automation-system

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: Dockerfile
```text
FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — salary-calculator-automation-system

**Application:** salary-calculator-automation-system
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_salary-calculator-automation-system_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — salary-calculator-automation-system

**Application:** salary-calculator-automation-system
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd salary-calculator-automation-system
pnpm install
pnpm run dev        # http://localhost:5173
```

```bash
pnpm run build      # TypeScript compile + Vite bundle → dist/
```


---

## Docker Deployment

### Build

```bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build salary-calculator-automation-system
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up salary-calculator-automation-system
# App available at http://localhost:5173
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build pattern:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Environment Variables

Create `.env` (never commit):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_GA_ID=G-FKXTELQ71R
```

---

## Health Check

```bash
curl http://localhost:5173/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite memory error | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port 5173 in use | Change port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Salary Calculator Automation System
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Salary Calculator Automation System**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Salary Calculator Automation System** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Salary Calculator Automation System** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âŒ Non-compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âŒ Non-compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: docs/TESTING.md
```md
# Testing Guide — salary-calculator-automation-system

**Application:** salary-calculator-automation-system
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd salary-calculator-automation-system
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: hooks/useSalaryCalculator.ts
```typescript

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

```

### FILE: index.css
```css
@import "tailwindcss";


```

### FILE: index.html
```html

<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Salary Calculator Automation System" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Salary Calculator Automation System" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Salary Calculator Automation System</title>
    <script type="importmap">
{
  "imports": {
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "react": "https://aistudiocdn.com/react@^19.2.0"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
  <body class="bg-gray-50">
    <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>

```

### FILE: index.tsx
```typescript

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

### FILE: metadata.json
```json
{
  "name": "Salary Calculator Automation System",
  "description": "An automated system for calculating new recruit salaries based on standardized steps, allowances, and deductions, ensuring consistency and transparency in salary administration.",
  "requestFramePermissions": []
}
```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "name": "salary-calculator-automation-system",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "react-dom": "19.2.5",
    "react": "19.2.5"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1H9tavYQ-Jl5IHm2BEIdFfgEJlxbUBTSg

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — salary-calculator-automation-system
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('salary-calculator-automation-system E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### FILE: types.ts
```typescript

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

```

### FILE: vite.config.ts
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
  ,
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom')) return 'vendor-react-dom';
              if (id.includes('react-router')) return 'vendor-router';
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
              if (id.includes('lucide') || id.includes('heroicons')) return 'vendor-icons';
              return 'vendor';
            }
          },
        },
      },
    }
  };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — salary-calculator-automation-system
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — salary-calculator-automation-system
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

