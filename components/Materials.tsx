import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useLocalizedSiteData } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';

export const Materials: React.FC = () => {
  const { materialCategories } = useLocalizedSiteData();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="pt-32 min-h-screen bg-[#121212] text-white px-8 md:px-20 pb-20">
      <div className="max-w-[1920px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 border-b border-white/20 pb-8"
        >
          <h1 className="text-6xl md:text-8xl font-condensed uppercase tracking-tight">
            {t('materials.title')}
          </h1>
        </motion.div>

        {materialCategories.length === 0 ? (
          <div className="text-stone-500 text-lg font-light">
            {t('materials.empty')}
          </div>
        ) : (
          <div className="flex flex-col">
            {materialCategories.map((cat, index) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => navigate(`/materials/${cat.slug || cat.id}`)}
                className="group flex items-end gap-8 md:gap-16 py-10 md:py-12 border-b border-white/10 text-left w-full"
              >
                {/* Cover image */}
                <div className="relative w-40 h-28 sm:w-72 sm:h-48 md:w-[420px] md:h-[280px] flex-shrink-0 bg-stone-900 overflow-hidden">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-700 text-xs uppercase tracking-widest">
                      {cat.name}
                    </div>
                  )}

                  {/* Hover tag straddling the right edge */}
                  <span className="hidden sm:block absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 px-3 py-1 border border-white/50 bg-black/70 backdrop-blur-sm text-[11px] font-medium tracking-wide text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {cat.name}
                  </span>
                </div>

                {/* Title */}
                <h2 className="flex-1 text-4xl md:text-7xl font-condensed uppercase tracking-tight leading-none group-hover:text-stone-300 transition-colors">
                  {cat.name}
                </h2>

                {/* Discover */}
                <span className="hidden md:flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-stone-500 group-hover:text-white transition-colors pb-2">
                  <Plus size={14} /> {t('materials.discover')}
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
