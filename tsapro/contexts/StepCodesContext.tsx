import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { STEP_CODES as DEFAULT_STEP_CODES } from '../constants';
import useLocalStorage from '../hooks/useLocalStorage';
import { addLog } from '../services/auditLogService';
import { AuditLogEvent, StepCodeData } from '../types';

interface StepCodesContextType {
  stepCodes: StepCodeData[];
  addStepCode: (newCode: StepCodeData) => void;
  editStepCode: (index: number, updatedCode: StepCodeData) => void;
  deleteStepCode: (index: number) => void;
}

const StepCodesContext = createContext<StepCodesContextType | undefined>(undefined);

export const StepCodesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stepCodes, setStepCodes] = useLocalStorage<StepCodeData[]>('tuc-salary-step-codes', DEFAULT_STEP_CODES);

  // This effect sanitizes the data from localStorage on initial load to prevent
  // issues with legacy or corrupted data structures. It ensures all grade/step
  // objects have the required properties, preventing "undefined" from appearing
  // in the UI.
  useEffect(() => {
    // Check if any item in the array is malformed.
    const isDataValid = Array.isArray(stepCodes) && stepCodes.every(sc =>
      sc &&
      typeof sc.code === 'string' &&
      typeof sc.status === 'string' &&
      typeof sc.empCode === 'string' &&
      typeof sc.annualSalary === 'number' &&
      typeof sc.allowance === 'number'
    );

    if (!isDataValid) {
      console.warn('LocalStorage contains invalid StepCode data. Sanitizing...');
      const sanitizedCodes = (Array.isArray(stepCodes) ? stepCodes : [])
        .map((item: any) => {
          if (typeof item !== 'object' || item === null) return null;
          
          return {
            empCode: String(item.empCode || ''),
            code: String(item.code || 'INVALID_CODE'),
            status: String(item.status || 'INVALID_STATUS'),
            annualSalary: Number(item.annualSalary) || 0,
            allowance: Number(item.allowance) || 0,
            isSsnitExempt: !!item.isSsnitExempt,
            netSalaryInSheet: Number(item.netSalaryInSheet) || 0,
            studentLoanInSheet: item.studentLoanInSheet ? Number(item.studentLoanInSheet) : null,
          };
        })
        .filter((item): item is StepCodeData => item !== null);
      
      setStepCodes(sanitizedCodes);
    }
  }, []); // Run only once on mount to check and clean the initial data.

  const addStepCode = useCallback((newCode: StepCodeData) => {
    setStepCodes(prevCodes => {
      addLog(AuditLogEvent.GRADE_ADDED, `Added Grade/Step: ${newCode.code} - ${newCode.status}`);
      return [...prevCodes, newCode];
    });
  }, [setStepCodes]);

  const editStepCode = useCallback((index: number, updatedCode: StepCodeData) => {
    setStepCodes(prevCodes => {
      const newCodes = [...prevCodes];
      const originalCode = newCodes[index];
      if (originalCode) {
        const changes: string[] = [];
        if (originalCode.code !== updatedCode.code) changes.push(`code ('${originalCode.code}' -> '${updatedCode.code}')`);
        if (originalCode.status !== updatedCode.status) changes.push(`status ('${originalCode.status}' -> '${updatedCode.status}')`);
        if (originalCode.annualSalary !== updatedCode.annualSalary) changes.push(`annualSalary ('${originalCode.annualSalary}' -> '${updatedCode.annualSalary}')`);
        if (originalCode.allowance !== updatedCode.allowance) changes.push(`allowance ('${originalCode.allowance}' -> '${updatedCode.allowance}')`);
        if (originalCode.isSsnitExempt !== updatedCode.isSsnitExempt) changes.push(`isSsnitExempt ('${originalCode.isSsnitExempt}' -> '${updatedCode.isSsnitExempt}')`);
        
        addLog(AuditLogEvent.GRADE_EDITED, `Edited ${originalCode.empCode} (${originalCode.code}). Changes: ${changes.length > 0 ? changes.join(', ') : 'No changes'}.`);
        newCodes[index] = updatedCode;
      }
      return newCodes;
    });
  }, [setStepCodes]);

  const deleteStepCode = useCallback((index: number) => {
    setStepCodes(prevCodes => {
      const codeToDelete = prevCodes[index];
      if (codeToDelete) {
        addLog(AuditLogEvent.GRADE_DELETED, `Deleted Grade/Step: ${codeToDelete.code} - ${codeToDelete.status}`);
      }
      return prevCodes.filter((_, i) => i !== index);
    });
  }, [setStepCodes]);


  const value = useMemo(() => ({ stepCodes, addStepCode, editStepCode, deleteStepCode }), [stepCodes, addStepCode, editStepCode, deleteStepCode]);

  return (
    <StepCodesContext.Provider value={value}>
      {children}
    </StepCodesContext.Provider>
  );
};

export const useStepCodes = (): StepCodesContextType => {
  const context = useContext(StepCodesContext);
  if (context === undefined) {
    throw new Error('useStepCodes must be used within a StepCodesProvider');
  }
  return context;
};
