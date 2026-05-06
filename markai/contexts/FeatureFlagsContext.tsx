
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { FeatureFlag } from '../types';
import { storageService } from '../services/storageService';

interface FeatureFlagsContextType { 
  featureFlags: Record<FeatureFlag, boolean>; 
  toggleFlag: (flag: FeatureFlag) => void; 
}

export const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (!context) throw new Error('useFeatureFlags must be used within FeatureFlagsProvider');
  return context;
};

export const FeatureFlagsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [featureFlags, setFeatureFlags] = useState<Record<FeatureFlag, boolean>>({
    [FeatureFlag.AI_CONTENT_GENERATION]: true,
    [FeatureFlag.CAMPAIGN_SCHEDULING]: true,
    [FeatureFlag.IMAGE_EDITING]: true,
    [FeatureFlag.LIVE_AUDIO]: true,
  });

  useEffect(() => { 
    (async () => setFeatureFlags(await storageService.getFeatureFlags()))(); 
  }, []);

  const toggleFlag = useCallback(async (flag: FeatureFlag) => {
    setFeatureFlags(prev => { 
      const updated = { ...prev, [flag]: !prev[flag] }; 
      storageService.setFeatureFlags(updated); 
      return updated; 
    });
  }, []);

  return <FeatureFlagsContext.Provider value={{ featureFlags, toggleFlag }}>{children}</FeatureFlagsContext.Provider>;
};
