import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, FileText, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useLocalizedSiteData } from '../../context/SiteContext';
import { resolveTechnicalFileUrl } from '../../lib/technicalFiles';

export const ReservedAreaProducts: React.FC = () => {
  const { t } = useLanguage();
  const { products } = useLocalizedSiteData();
  const navigate = useNavigate();

  const files = products.filter(p => !!p.pdf_technical);

  const handleDownload = async (path: string) => {
    const url = await resolveTechnicalFileUrl(path);
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="px-6 md:px-10 py-10 max-w-6xl mx-auto">
      <div className="text-sm mb-4 flex items-center gap-2">
        <button
          onClick={() => navigate('/2d-3d')}
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          <ChevronLeft size={14} /> {t('reservedArea.backToReservedArea')}
        </button>
      </div>
      <div className="border-b border-stone-300 mb-10" />

      <h1 className="text-5xl md:text-7xl font-condensed uppercase tracking-tight mb-14">
        {t('reservedArea.productsTitle')}
      </h1>

      {files.length === 0 ? (
        <div className="text-stone-500 text-lg font-light">{t('technicalFiles.empty')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {files.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => handleDownload(product.pdf_technical!)}
            >
              <div className="relative aspect-square bg-stone-200 overflow-hidden mb-6">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <FileText size={64} strokeWidth={1} />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white/60 backdrop-blur-md p-4 rounded-full">
                    <Download size={32} className="text-stone-900" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-condensed uppercase tracking-wide mb-2 group-hover:text-stone-600 transition-colors">
                {product.name}
              </h3>
              <button className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500 group-hover:text-stone-900 transition-colors flex items-center gap-2">
                {t('technicalFiles.download')} <span className="text-[10px] opacity-50">PDF</span>
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
