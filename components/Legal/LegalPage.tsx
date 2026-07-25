import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useLocalizedSiteData } from '../../context/SiteContext';

export const LegalPage: React.FC<{ variant: 'terms' | 'privacy' }> = ({ variant }) => {
  const { language, t } = useLanguage();
  const { getSetting, isLoading } = useLocalizedSiteData();
  const title = variant === 'terms' ? t('legal.termsTitle') : t('legal.privacyTitle');

  const baseKey = variant === 'terms' ? 'legal_terms_content' : 'legal_privacy_content';
  const content = language === 'tr'
    ? (getSetting(`${baseKey}_tr`) || getSetting(baseKey))
    : getSetting(baseKey);

  return (
    <div className="min-h-screen bg-white text-stone-900">
      <div className="flex items-center p-6 md:p-8">
        <div className="font-sans text-lg tracking-[0.2em] font-bold uppercase">SETHES</div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-24">
        <h1 className="text-3xl font-condensed uppercase tracking-wide mb-6">{title}</h1>

        {isLoading ? null : content ? (
          <div
            className="max-w-none text-sm leading-relaxed text-stone-700
              [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-stone-900
              [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-stone-900
              [&_p]:mb-4
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1
              [&_a]:underline [&_a]:font-medium [&_a]:text-stone-900"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};
