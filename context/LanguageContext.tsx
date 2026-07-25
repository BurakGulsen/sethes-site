import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../lib/translations';

export type Language = 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'site_language';

// Content is currently English-only across the board — defaulting to 'tr' here
// would show Turkish chrome next to English-fallback content on every first visit.
// Flip this to 'tr' once real Turkish content has been filled in via the admin panel.
const DEFAULT_LANGUAGE: Language = 'en';

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'tr' || stored === 'en' ? stored : DEFAULT_LANGUAGE;
};

const resolvePath = (obj: any, path: string): string | undefined => {
  return path.split('.').reduce((acc, key) => (acc && typeof acc === 'object' ? acc[key] : undefined), obj);
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const t = (path: string): string => {
    const value = resolvePath(translations[language], path) ?? resolvePath(translations.en, path);
    return value ?? path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
