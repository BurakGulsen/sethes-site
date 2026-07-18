import React from 'react';
import { useSiteData } from '../context/SiteContext';

export const Philosophy: React.FC = () => {
  const { siteSettings } = useSiteData();

  return (
    <div className="min-h-screen pt-40 px-6 md:px-20 bg-[#f4f4f4] flex flex-col items-center animate-in fade-in duration-700 text-[#171719]">
      <h1 className="text-6xl md:text-8xl font-condensed text-black mb-12 opacity-90 tracking-tight">
          {siteSettings?.find(s => s.key === 'ethos_title')?.value || 'THE ETHOS'}
      </h1>
      <div className="grid md:grid-cols-2 gap-16 max-w-6xl">
        <div className="space-y-8">
          {(siteSettings?.find(s => s.key === 'ethos_description')?.value || 'Our research leads us to discover new materials and old hands. We travel to find the rarest stones, the most resilient woods, and the metals that tell a story.').split('\n').map((paragraph, idx) => (
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
