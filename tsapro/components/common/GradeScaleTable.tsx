import React, { useMemo } from 'react';
import { StepCodeData } from '../../types';

interface GradeScaleTableProps {
  data: StepCodeData[];
}

const formatCurrency = (amount: number) => {
  return `₵${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * GradeScaleTable component renders a matrix view of the salary scale.
 * It groups salary steps by their base grade (e.g., SM0105) and displays 
 * steps as columns.
 */
const GradeScaleTable: React.FC<GradeScaleTableProps> = ({ data }) => {
  // Process data into a matrix: { [gradeCode]: { [stepNumber]: annualSalary } }
  const matrix = useMemo(() => {
    const table: Record<string, Record<string, number>> = {};
    const stepSet = new Set<number>();

    data.forEach((item) => {
      const parts = item.code.split('/');
      const grade = parts[0];
      const step = parts[1] ? parseInt(parts[1], 10) : 1;

      if (!isNaN(step)) {
        stepSet.add(step);
        if (!table[grade]) {
          table[grade] = {};
        }
        table[grade][step] = item.annualSalary;
      }
    });

    const sortedGrades = Object.keys(table).sort();
    const sortedSteps = Array.from(stepSet).sort((a, b) => a - b);

    return { table, sortedGrades, sortedSteps };
  }, [data]);

  const { table, sortedGrades, sortedSteps } = matrix;

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 italic border rounded-lg bg-slate-50 dark:bg-slate-900/50">
        No salary scale data available to display in matrix view.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm" data-component="table-container">
      <table className="min-w-full divide-y divide-[var(--color-border-primary)]" data-component="table">
        <thead data-component="table-header">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider sticky left-0 z-10 bg-[var(--color-bg-tertiary)] border-r">
              Grade
            </th>
            {sortedSteps.map((step) => (
              <th key={step} className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">
                Step {step}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border-primary)]" data-component="table-body">
          {sortedGrades.map((grade) => (
            <tr key={grade} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-bold sticky left-0 z-10 bg-[var(--color-bg-card)] border-r shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                {grade}
              </td>
              {sortedSteps.map((step) => (
                <td key={`${grade}-${step}`} className="px-4 py-3 whitespace-nowrap text-sm text-center font-mono">
                  {table[grade][step] ? (
                    <span className="text-[var(--color-success)] font-medium">
                      {formatCurrency(table[grade][step])}
                    </span>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-700">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradeScaleTable;