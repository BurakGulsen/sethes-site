import React, { useState, useEffect, useRef } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useLocalizedSiteData } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onProductClick }) => {
  const { products } = useLocalizedSiteData();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Search Logic — filters the already-loaded, language-resolved products
  // client-side (no network round-trip), so results always match whichever
  // language is currently active, and the query matches Turkish input too.
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const q = query.trim().toLowerCase();
      if (q.length > 1) {
        const filtered = products.filter(p =>
          p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
        ).slice(0, 10);
        setResults(filtered);
      } else {
        setResults([]);
      }
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [query, products]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col"
        >
          {/* Header / Close Button */}
          <div className="flex justify-between items-center p-8 md:p-12">
            <div className="font-sans text-xl tracking-[0.2em] font-bold text-white uppercase">
              {t('search.title')}
            </div>
            <button 
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={32} strokeWidth={1} />
            </button>
          </div>

          {/* Search Input */}
          <div className="px-8 md:px-12 max-w-7xl mx-auto w-full">
            <div className="relative border-b border-white/20 pb-4">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full bg-transparent text-4xl md:text-6xl font-light text-white placeholder-white/20 outline-none border-none"
                onMouseDown={(e) => e.stopPropagation()}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto px-8 md:px-12 py-12 max-w-7xl mx-auto w-full scrollbar-hide">
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {results.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group cursor-pointer flex gap-6 items-start"
                    onClick={() => {
                      onProductClick(product);
                      onClose();
                    }}
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-stone-900 overflow-hidden flex-shrink-0">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    </div>
                    <div className="flex flex-col pt-2">
                      <h3 className="text-white text-xl font-condensed uppercase tracking-wide group-hover:text-stone-300 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-stone-500 text-xs tracking-widest uppercase mt-1 mb-2">
                        {product.category}
                      </p>
                      <span className="text-white/40 text-xs flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                        {t('search.viewDetails')} <ArrowRight size={12} />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : query.length > 1 ? (
              <div className="text-white/40 text-lg font-light">
                {t('search.noResultsFor')}"{query}"
              </div>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
