import React, { useState, useEffect, useRef } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Product } from '../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onProductClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
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

  // Search Logic with Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
            .limit(10);

          if (error) throw error;
          setResults(data || []);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

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
              SEARCH
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
                placeholder="Type here..."
                className="w-full bg-transparent text-4xl md:text-6xl font-light text-white placeholder-white/20 outline-none border-none"
                // Fix for selection issues
                onMouseDown={(e) => e.stopPropagation()}
                onSelect={(e) => (e.target as HTMLElement).focus()}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto px-8 md:px-12 py-12 max-w-7xl mx-auto w-full scrollbar-hide">
            {loading ? (
              <div className="text-white/40 text-sm tracking-widest animate-pulse">SEARCHING...</div>
            ) : results.length > 0 ? (
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
                        View Details <ArrowRight size={12} />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : query.length > 1 ? (
              <div className="text-white/40 text-lg font-light">
                No results found for "{query}"
              </div>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
