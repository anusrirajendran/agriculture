import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from '../utils/translations';

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  const { language, setLanguage } = context;
  const t = translations[language] || translations['en'];

  return { t, language, setLanguage };
};
