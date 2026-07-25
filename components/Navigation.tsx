import React, { useEffect } from 'react';
import { MediaCategory } from '../types';
import { X } from 'lucide-react';
import { useLocalizedSiteData } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect?: (categoryId: string) => void;
  onMediaSelect?: (category: MediaCategory) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose, onCategorySelect, onMediaSelect }) => {
  const { categories, mediaCategories, getSetting } = useLocalizedSiteData();
  const { language, setLanguage, t } = useLanguage();
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleTechnicalFilesClick = () => {
    if (session) {
      handleNav('/2d-3d');
    } else {
      handleNav('/account/login?redirect=' + encodeURIComponent('/2d-3d'));
    }
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const containerVariants = {
    hidden: { height: 0 },
    visible: {
      height: '65vh',
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const, // Custom ease-out
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      height: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as const,
        when: "afterChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Curtain Menu */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 w-full z-50 bg-black text-white overflow-hidden shadow-2xl"
          >
            <div className="h-full flex flex-col p-8 md:p-12 max-w-[1920px] mx-auto relative">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-12 md:mb-16">
                 <div className="font-sans text-xl tracking-[0.2em] font-bold text-white uppercase">SETHES</div>
                 <button onClick={onClose} className="text-white hover:text-stone-300 transition-colors p-2">
                    <X size={24} strokeWidth={2} />
                  </button>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 flex-1 justify-center max-w-[1920px] mx-auto w-full">
                
                {/* COMPANY */}
                <motion.div variants={itemVariants} className="flex flex-col gap-6 items-center text-center">
                  <h3 className="text-white/40 font-['Oswald'] text-4xl tracking-normal uppercase mb-8">{t('nav.company')}</h3>
                  <div className="flex flex-col gap-3 items-center">
                    <button onClick={() => handleNav('/philosophy')} className="text-sm font-bold tracking-[0.1em] uppercase hover:text-stone-400 transition-colors">{t('nav.aboutUs')}</button>
                    <button onClick={() => handleNav('/designers')} className="text-sm font-bold tracking-[0.1em] uppercase hover:text-stone-400 transition-colors">{t('nav.designers')}</button>
                    <button className="text-sm font-bold tracking-[0.1em] uppercase text-stone-600 cursor-not-allowed">{t('nav.careers')}</button>
                  </div>
                </motion.div>

                {/* PRODUCTS */}
                <motion.div variants={itemVariants} className="flex flex-col gap-6 items-center text-center">
                  <h3 className="text-white/40 font-['Oswald'] text-4xl tracking-normal uppercase mb-8">{t('nav.products')}</h3>
                  <div className="flex flex-col gap-3 items-center max-h-[30vh] overflow-y-auto scrollbar-hide">
                    <button onClick={() => handleNav('/collections')} className="text-sm font-bold tracking-[0.1em] uppercase hover:text-stone-400 transition-colors">{t('nav.allCollections')}</button>
                    <button onClick={() => handleNav('/materials')} className="text-sm font-bold tracking-[0.1em] uppercase hover:text-stone-400 transition-colors">{t('nav.materials')}</button>
                    <button onClick={handleTechnicalFilesClick} className="text-sm font-bold tracking-[0.1em] uppercase hover:text-stone-400 transition-colors">{t('nav.technicalFiles')}</button>
                    {/* Top Categories */}
                    {categories.slice(0, 5).map(cat => (
                         <button
                            key={cat.id}
                            onClick={() => {
                                if (onCategorySelect) onCategorySelect(cat.id);
                                onClose();
                            }}
                            className="text-sm font-light tracking-[0.1em] uppercase hover:text-white text-stone-400 transition-colors"
                        >
                            {cat.name}
                        </button>
                    ))}
                  </div>
                </motion.div>

                {/* MEDIA */}
                <motion.div variants={itemVariants} className="flex flex-col gap-6 items-center text-center">
                  <h3 className="text-white/40 font-['Oswald'] text-4xl tracking-normal uppercase mb-8">{t('nav.media')}</h3>
                  <div className="flex flex-col gap-3 items-center">
                    <button onClick={() => handleNav('/catalogues')} className="text-sm font-bold tracking-[0.1em] uppercase hover:text-stone-400 transition-colors">{t('nav.catalogues')}</button>
                    <button onClick={() => handleNav('/news')} className="text-sm font-bold tracking-[0.1em] uppercase hover:text-stone-400 transition-colors">{t('nav.news')}</button>
                    {mediaCategories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                if (onMediaSelect) onMediaSelect(cat);
                                onClose();
                            }}
                            className="text-sm font-bold tracking-[0.1em] uppercase hover:text-stone-400 transition-colors"
                        >
                            {cat.name}
                        </button>
                    ))}
                  </div>
                </motion.div>

                {/* COMMUNICATION */}
                <motion.div variants={itemVariants} className="flex flex-col gap-6 items-center text-center">
                  <h3 className="text-white/40 font-['Oswald'] text-4xl tracking-normal uppercase mb-8">
                    {getSetting('nav_communication_title') || t('nav.network')}
                  </h3>
                  <div className="flex flex-col gap-3 items-center">
                    <button onClick={() => handleNav('/contacts')} className="text-sm font-bold tracking-[0.1em] uppercase hover:text-stone-400 transition-colors">
                      {getSetting('nav_contacts_title') || t('nav.contacts')}
                    </button>
                  </div>
                </motion.div>

              </div>

              {/* Footer */}
              <motion.div variants={itemVariants} className="flex justify-between items-end text-[10px] font-bold tracking-widest uppercase mt-8">
                {/* Language Switcher */}
                <div className="flex flex-col gap-1 text-left">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`transition-colors ${language === 'en' ? 'text-white' : 'text-stone-600 hover:text-stone-400'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('tr')}
                    className={`transition-colors ${language === 'tr' ? 'text-white' : 'text-stone-600 hover:text-stone-400'}`}
                  >
                    Türkçe
                  </button>
                </div>
                <div className="text-stone-600">
                    {t('nav.credits')}
                </div>
              </motion.div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
