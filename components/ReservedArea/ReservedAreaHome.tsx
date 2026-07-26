import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export const ReservedAreaHome: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="px-6 md:px-10 py-10 max-w-6xl mx-auto">
      <div className="text-sm mb-4">
        <span className="text-blue-600">{t('reservedArea.breadcrumb')}</span>
      </div>
      <div className="border-b border-stone-300 mb-10" />

      <h1 className="text-5xl md:text-7xl font-condensed uppercase tracking-tight mb-14">
        {t('reservedArea.title')}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-3xl">
        <button onClick={() => navigate('/2d-3d/products')} className="text-left group">
          <div className="relative">
            <div className="absolute -top-2 left-4 w-2/3 h-3 bg-stone-300 rounded-t-md" />
            <div className="relative aspect-[4/3] bg-stone-300 group-hover:bg-stone-400 transition-colors" />
          </div>
          <div className="bg-black text-white text-xs font-bold tracking-[0.15em] uppercase px-4 py-3">
            {t('reservedArea.products')}
          </div>
        </button>

        <div className="text-left opacity-60 cursor-not-allowed" aria-disabled="true">
          <div className="relative">
            <div className="absolute -top-2 left-4 w-2/3 h-3 bg-stone-300 rounded-t-md" />
            <div className="relative aspect-[4/3] bg-stone-300" />
          </div>
          <div className="bg-black text-white text-xs font-bold tracking-[0.15em] uppercase px-4 py-3 flex items-center justify-between gap-2">
            <span>{t('reservedArea.materials')}</span>
            <span className="text-[9px] text-stone-400 tracking-wide normal-case">{t('reservedArea.comingSoon')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
