import React, { useEffect } from 'react';
import { MediaCategory } from '../types';
import { X } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAi: () => void;
  onCategorySelect?: (categoryId: string) => void;
  onMediaSelect?: (category: MediaCategory) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose, onOpenAi, onCategorySelect, onMediaSelect }) => {
  const { categories, mediaCategories, siteSettings } = useSiteData();
  const navigate = useNavigate();

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
        ease: [0.22, 1, 0.36, 1], // Custom ease-out
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      height: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1],
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
                 <div className="font-sans text-xl tracking-[0.2em] font-bold text-white uppercase">ARBEM</div>
                 <button onClick={onClose} className="text-white hover:text-stone-300 transition-colors p-2">
                    <X size={24} strokeWidth={2} />
                  </button>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 flex-1 justify-center max-w-[1920px] mx-auto w-full">
                
                {/* COMPANY */}
                <motion.div variants={itemVariants} className="flex flex-col gap-6 items-center text-center">
                  <h3 className="text-white/40 font-['Oswald'] text-4xl tracking-normal uppercase mb-8">Company</h3>
                  <div className="flex flex-col gap-3 items-center">
                    <button onClick={() => handleNav('/philosophy')} className="text-sm font-bold tracking-[0.1em] uppercase hover:text-stone-400 transition-colors">About Us</button>
                    <button onClick={() => handleNav('/designers')} className="text-sm font-bold tracking-[0.1em] uppercase hover:text-stone-400 transition-colors">Designers</button>
                    <button className="text-sm font-bold tracking-[0.1em] uppercase text-stone-600 cursor-not-allowed">Careers</button>
                  </div>
                </motion.div>

                {/* PRODUCTS */}
                <motion.div variants={itemVariants} className="flex flex-col gap-6 items-center text-center">
                  <h3 className="text-white/40 font-['Oswald'] text-4xl tracking-normal uppercase mb-8">Products</h3>
                  <div className="flex flex-col gap-3 items-center max-h-[30vh] overflow-y-auto scrollbar-hide">
                    <button onClick={() => handleNav('/collections')} className="text-sm font-bold tracking-[0.1em] uppercase hover:text-stone-400 transition-colors">All Collections</button>
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
                  <h3 className="text-white/40 font-['Oswald'] text-4xl tracking-normal uppercase mb-8">Media</h3>
                  <div className="flex flex-col gap-3 items-center">
                    <button onClick={() => handleNav('/catalogues')} className="text-sm font-bold tracking-[0.1em] uppercase hover:text-stone-400 transition-colors">Catalogues</button>
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
                    {siteSettings?.find(s => s.key === 'nav_communication_title')?.value || 'Communication'}
                  </h3>
                  <div className="flex flex-col gap-3 items-center">
                    <button onClick={() => handleNav('/contacts')} className="text-sm font-bold tracking-[0.1em] uppercase hover:text-stone-400 transition-colors">
                      {siteSettings?.find(s => s.key === 'nav_contacts_title')?.value || 'Contacts'}
                    </button>
                  </div>
                </motion.div>

              </div>

              {/* Footer */}
              <motion.div variants={itemVariants} className="flex justify-end items-end text-[10px] font-bold tracking-widest uppercase text-stone-600 mt-8">
                <div>
                    Credits
                </div>
              </motion.div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
