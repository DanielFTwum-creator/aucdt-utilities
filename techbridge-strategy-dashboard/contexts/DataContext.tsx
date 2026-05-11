import React, { createContext, useState, useContext, ReactNode } from 'react';
import { DashboardData, DataContextType } from '../types';
import { budgetData, financialData, marketingData, funnelData, keyMetrics } from '../data';

const defaultData: DashboardData = {
  budget: budgetData,
  financials: financialData,
  marketing: marketingData,
  funnel: funnelData,
  metrics: keyMetrics,
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DashboardData>(defaultData);

  const updateData = (section: keyof DashboardData, newData: any) => {
    setData((prev) => ({
      ...prev,
      [section]: newData,
    }));
  };

  const resetData = () => {
    setData(defaultData);
  };

  return (
    <DataContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDashboardData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDashboardData must be used within a DataProvider');
  }
  return context;
};
