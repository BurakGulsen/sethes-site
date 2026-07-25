import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const AuthLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <div className="flex items-center gap-2 p-6 md:p-8">
        <div className="font-sans text-lg tracking-[0.2em] font-bold text-stone-900 uppercase">SETHES</div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 transition-colors ml-6"
        >
          <ChevronLeft size={16} /> {t('auth.backToWebsite')}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-24">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-10">
          <h1 className="text-2xl font-condensed uppercase tracking-wide text-center mb-8 text-stone-900">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};
