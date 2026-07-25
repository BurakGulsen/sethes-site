import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { MaterialCategory, MaterialSwatch } from '../types';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLocalizedSiteData } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';

interface MaterialDetailProps {
  category: MaterialCategory;
}

export const MaterialDetail: React.FC<MaterialDetailProps> = ({ category }) => {
  const { materialCategories } = useLocalizedSiteData();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [swatches, setSwatches] = useState<MaterialSwatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchSwatches = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('material_swatches')
          .select('*')
          .eq('category_id', category.id)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: true });

        if (error) throw error;
        setSwatches(data || []);
      } catch (error) {
        console.error('Error fetching swatches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSwatches();
  }, [category.id]);

  return (
    <div className="pt-32 min-h-screen bg-[#121212] text-white px-8 md:px-20 pb-20">
      <div className="max-w-[1920px] mx-auto">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/materials')}
          className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500 hover:text-white transition-colors mb-6"
        >
          {t('materialDetail.breadcrumb')}
        </button>

        {/* Title row with category switcher */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-white/20 pb-8 mb-4">
          <motion.h1
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl md:text-8xl font-condensed uppercase tracking-tight"
          >
            {category.name}
          </motion.h1>

          {/* Category dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(o => !o)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
              className="flex items-center gap-3 bg-stone-800/60 hover:bg-stone-700/60 transition-colors rounded-full px-6 py-3 text-xs font-bold tracking-[0.2em] uppercase"
            >
              {category.name}
              <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-stone-700 rounded-lg overflow-hidden z-20 shadow-2xl">
                {materialCategories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/materials/${c.slug || c.id}`)}
                    className={`block w-full text-left px-5 py-3 text-xs font-bold tracking-widest uppercase transition-colors ${
                      c.id === category.id ? 'bg-stone-800 text-white' : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Caption */}
        <p className="text-sm text-stone-400 font-light mb-16">
          {category.description || t('materialDetail.defaultCaption')}
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-stone-500 tracking-widest uppercase">{t('mediaGallery.loading')}</div>
          </div>
        ) : swatches.length === 0 ? (
          <div className="text-stone-500 text-lg font-light">{t('materials.empty')}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
            {swatches.map((swatch, index) => (
              <motion.div
                key={swatch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (index % 10) * 0.05 }}
                className="group"
              >
                <div className="relative aspect-square bg-stone-900 overflow-hidden mb-3">
                  <img
                    src={swatch.image}
                    alt={swatch.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-stone-400 group-hover:text-white transition-colors">
                  {swatch.name}
                </h3>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
