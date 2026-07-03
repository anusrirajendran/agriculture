import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { LanguageType } from '../../utils/translations';
import { Globe } from 'lucide-react';

const languagesList: { code: LanguageType; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
];

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="relative inline-flex items-center">
      <Globe className="absolute left-2.5 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as LanguageType)}
        className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 cursor-pointer appearance-none"
      >
        {languagesList.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};
export default LanguageSelector;
