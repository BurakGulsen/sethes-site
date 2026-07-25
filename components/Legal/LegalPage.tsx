import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const LegalPage: React.FC<{ variant: 'terms' | 'privacy' }> = ({ variant }) => {
  const { t } = useLanguage();
  const title = variant === 'terms' ? t('legal.termsTitle') : t('legal.privacyTitle');

  return (
    <div className="min-h-screen bg-white text-stone-900">
      <div className="flex items-center p-6 md:p-8">
        <div className="font-sans text-lg tracking-[0.2em] font-bold uppercase">SETHES</div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-24">
        <h1 className="text-3xl font-condensed uppercase tracking-wide mb-6">{title}</h1>

        <div className="bg-red-50 border border-red-300 text-red-700 text-sm p-4 rounded-lg mb-10 leading-relaxed">
          {t('legal.placeholderWarning')}
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-stone-700">
          <section>
            <h2 className="font-bold uppercase tracking-wide text-xs mb-2 text-stone-400">{t('legal.dataController')}</h2>
            <p>[…]</p>
          </section>
          <section>
            <h2 className="font-bold uppercase tracking-wide text-xs mb-2 text-stone-400">{t('legal.dataProcessed')}</h2>
            <p>{t('legal.placeholderBody')}</p>
          </section>
          <section>
            <h2 className="font-bold uppercase tracking-wide text-xs mb-2 text-stone-400">{t('legal.processingPurposes')}</h2>
            <p>[…]</p>
          </section>
          <section>
            <h2 className="font-bold uppercase tracking-wide text-xs mb-2 text-stone-400">{t('legal.retentionPeriod')}</h2>
            <p>[…]</p>
          </section>
          <section>
            <h2 className="font-bold uppercase tracking-wide text-xs mb-2 text-stone-400">{t('legal.yourRights')}</h2>
            <p>[…]</p>
          </section>
        </div>
      </div>
    </div>
  );
};
