import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useLocalizedSiteData } from '../context/SiteContext';
import { resolveTechnicalFileUrl } from '../lib/technicalFiles';

export const TechnicalFiles: React.FC = () => {
  const { t } = useLanguage();
  const { session, loading } = useAuth();
  const { products } = useLocalizedSiteData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate('/account/login?redirect=' + encodeURIComponent('/2d-3d'));
    }
  }, [loading, session, navigate]);

  if (loading || !session) {
    return <div className="min-h-screen bg-[#121212]" />;
  }

  const files = products.filter(p => !!p.pdf_technical);

  const handleDownload = async (path: string) => {
    const url = await resolveTechnicalFileUrl(path);
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="pt-32 min-h-screen bg-[#121212] text-white px-8 md:px-20 pb-20">
      <div className="max-w-[1920px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 border-b border-white/20 pb-8"
        >
          <h1 className="text-6xl md:text-8xl font-condensed uppercase tracking-tight mb-4">
            {t('technicalFiles.title')}
          </h1>
        </motion.div>

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
                <div className="relative aspect-square bg-stone-900 overflow-hidden mb-6">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-700">
                      <FileText size={64} strokeWidth={1} />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full">
                      <Download size={32} className="text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-condensed uppercase tracking-wide mb-2 group-hover:text-stone-300 transition-colors">
                  {product.name}
                </h3>
                <button className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500 group-hover:text-white transition-colors flex items-center gap-2">
                  {t('technicalFiles.download')} <span className="text-[10px] opacity-50">PDF</span>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
