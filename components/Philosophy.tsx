import React from 'react';
import { useLocalizedSiteData } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';

export const Philosophy: React.FC = () => {
  const { getSetting } = useLocalizedSiteData();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-40 px-6 md:px-20 bg-[#f4f4f4] flex flex-col items-center animate-in fade-in duration-700 text-[#171719]">
      <h1 className="text-6xl md:text-8xl font-condensed text-black mb-12 opacity-90 tracking-tight">
          {getSetting('ethos_title') || t('philosophy.defaultTitle')}
      </h1>
      <div className="grid md:grid-cols-2 gap-16 max-w-6xl">
        <div className="space-y-8">
          {(getSetting('ethos_description') || t('philosophy.defaultDescription')).split('\n').map((paragraph, idx) => (
              <p key={idx} className="text-stone-600 leading-8 text-lg font-light">
                  {paragraph}
              </p>
          ))}
          <div className="h-[1px] w-20 bg-stone-300"></div>
        </div>
      </div>
    </div>
  );
};
