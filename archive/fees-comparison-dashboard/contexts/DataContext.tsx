import React, { createContext, useContext, useState } from 'react';
import { DataContextType, ViewType, UndergraduateFeeData, InternationalFeeData, PostgraduateFeeData } from '../types';
import { useAuth } from './AuthContext';

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Static Data
const initialUndergraduateData: UndergraduateFeeData[] = [
  { name: 'UG (Humanities)', fees: 2319, continuing: 1774, type: 'public' },
  { name: 'UG (Admin/Law)', fees: 2435, continuing: 1890, type: 'public' },
  { name: 'KNUST (Humanities)', fees: 1875, continuing: 1715, type: 'public' },
  { name: 'KNUST (Business)', fees: 2428, continuing: 2268, type: 'public' },
  { name: 'KNUST (Engineering)', fees: 3778, continuing: 2968, type: 'public' },
  { name: 'KNUST (Medicine)', fees: 4068, continuing: 3908, type: 'public' },
  { name: 'UEW (Humanities)', fees: 2226, continuing: 2226, type: 'public' },
  { name: 'UEW (Business)', fees: 3096, continuing: 3096, type: 'public' },
  { name: 'UEW (Science)', fees: 2783, continuing: 2783, type: 'public' },
  { name: 'TUC', fees: 5299, continuing: 5299, type: 'private' },
  { name: 'Academic City (CS)', fees: 41580, continuing: 41580, type: 'private' },
  { name: 'Academic City (Journalism)', fees: 29700, continuing: 29700, type: 'private' },
  { name: 'Academic City (Biomed)', fees: 59400, continuing: 59400, type: 'private' },
  { name: 'Ashesi (Business)', fees: 12500, continuing: 12500, type: 'private' },
  { name: 'Ashesi (Engineering)', fees: 14000, continuing: 14000, type: 'private' },
  { name: 'Valley View (Business)', fees: 2250, continuing: 2250, type: 'private' },
  { name: 'Valley View (Science)', fees: 2856, continuing: 2856, type: 'private' },
  { name: 'Wisconsin (General)', fees: 3180, continuing: 3180, type: 'private' },
  { name: 'Wisconsin (Law)', fees: 5800, continuing: 5800, type: 'private' }
];

const initialInternationalData: InternationalFeeData[] = [
  { name: 'UG (Humanities) - African', fees: 4328 * 15, type: 'public' },
  { name: 'UG (Humanities) - Non-African', fees: 5109 * 15, type: 'public' },
  { name: 'UG (Admin/Law)', fees: 5336 * 15, type: 'public' },
  { name: 'KNUST (Humanities)', fees: 4354 * 15, type: 'public' },
  { name: 'KNUST (Business/Law)', fees: 6054 * 15, type: 'public' },
  { name: 'KNUST (Engineering)', fees: 6204 * 15, type: 'public' },
  { name: 'KNUST (Medicine)', fees: 7487 * 15, type: 'public' },
  { name: 'Lancaster (Foundation)', fees: 7000 * 15, type: 'private' },
  { name: 'Lancaster (Undergraduate)', fees: 9000 * 15, type: 'private' }
];

const initialPostgraduateData: PostgraduateFeeData[] = [
  { name: 'UG (MA - One Year)', fees: 13074, type: 'public' },
  { name: 'UG (MPhil/MBA)', fees: 13551, type: 'public' },
  { name: 'UG (Law - ADR/HRA)', fees: 22485, type: 'public' },
  { name: 'UG (EPM - Regular)', fees: 18540, type: 'public' },
  { name: 'UG (EPM - Weekend)', fees: 25785, type: 'public' },
  { name: 'UG (PhD - Humanities)', fees: 10256, type: 'public' },
  { name: 'UG (PhD - Admin)', fees: 11694, type: 'public' },
  { name: 'Academic City (Data Sci)', fees: 47250 / 2, type: 'private' },
  { name: 'Academic City (Cyber Sec)', fees: 47250 / 2, type: 'private' },
  { name: 'Lancaster (MBA)', fees: (12000 * 15) / 2, type: 'private' }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [undergraduateData, setUndergraduateData] = useState(initialUndergraduateData);
  const [internationalData, setInternationalData] = useState(initialInternationalData);
  const [postgraduateData, setPostgraduateData] = useState(initialPostgraduateData);
  const { logAction, auditLogs } = useAuth();

  const updateFee = (category: ViewType, index: number, field: string, value: number) => {
    let oldVal = 0;
    let name = '';

    const updateList = (list: any[], setter: Function) => {
      const newList = [...list];
      oldVal = newList[index][field];
      name = newList[index].name;
      newList[index] = { ...newList[index], [field]: value };
      setter(newList);
    };

    if (category === 'undergraduate') updateList(undergraduateData, setUndergraduateData);
    else if (category === 'international') updateList(internationalData, setInternationalData);
    else if (category === 'postgraduate') updateList(postgraduateData, setPostgraduateData);

    logAction('DATA_UPDATE', `Updated ${category} fee for ${name}: ${field} changed from ${oldVal} to ${value}`);
  };

  return (
    <DataContext.Provider value={{ 
      undergraduateData, 
      internationalData, 
      postgraduateData, 
      updateFee,
      auditLogs 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
