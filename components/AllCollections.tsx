import React from 'react';
import { useLocalizedSiteData } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface AllCollectionsProps {
  onCategoryClick: (categoryId: string) => void;
}

export const AllCollections: React.FC<AllCollectionsProps> = ({ onCategoryClick }) => {
  const { categories } = useLocalizedSiteData();
  const { t } = useLanguage();

  return (
    <div className="pt-32 min-h-screen bg-[#121212] px-4 md:px-10 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 border-b border-white/10 pb-8"
      >
        <h1 className="text-6xl md:text-8xl font-condensed uppercase tracking-tight text-white">
          {t('allCollections.title')}
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onClick={() => onCategoryClick(cat.id)}
            className="group cursor-pointer relative aspect-[4/5] overflow-hidden bg-stone-900"
          >
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-8">
              <h3 className="text-white text-3xl md:text-4xl font-condensed uppercase">{cat.name}</h3>
              <p className="text-white/80 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-500 flex items-center gap-2">
                {t('allCollections.exploreCollection')} <ArrowRight size={14} />
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
