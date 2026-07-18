import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { MediaItem, MediaCategory } from '../types';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';

interface MediaGalleryProps {
  category: MediaCategory;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ category }) => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [category.id]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('category_id', category.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching media items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (pdfUrl?: string) => {
    if (pdfUrl) {
        window.open(pdfUrl, '_blank');
    }
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
            {category.name}
          </h1>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-stone-500 tracking-widest uppercase">Loading...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-stone-500 text-lg font-light">No items available in this category.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group ${item.pdf_url ? 'cursor-pointer' : ''}`}
                onClick={() => handleItemClick(item.pdf_url)}
              >
                <div className="relative aspect-square bg-stone-900 overflow-hidden mb-6">
                  {item.cover_image ? (
                    <img 
                      src={item.cover_image} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-700">
                      <FileText size={64} strokeWidth={1} />
                    </div>
                  )}
                  
                  {item.pdf_url && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-full">
                            <Download size={32} className="text-white" strokeWidth={1.5} />
                        </div>
                      </div>
                  )}
                </div>
                
                <h3 className="text-2xl font-condensed uppercase tracking-wide mb-2 group-hover:text-stone-300 transition-colors">
                  {item.title}
                </h3>
                {item.pdf_url && (
                    <button className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500 group-hover:text-white transition-colors flex items-center gap-2">
                    Download <span className="text-[10px] opacity-50">PDF</span>
                    </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
