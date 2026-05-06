import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations } from '../translations';

type Locale = 'en-GB' | 'en-US' | 'fr-FR' | 'ak-GH';
type Translations = typeof translations['en-GB'];

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en-GB');

  const t = (key: keyof Translations): string => {
    // Fallback logic
    const lang = translations[locale as keyof typeof translations] || translations['en-GB'];
    return (lang as any)[key] || (translations['en-GB'] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};