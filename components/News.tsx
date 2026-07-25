import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { NewsPost } from '../types';
import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const News: React.FC = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching news posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const pick = (base: string, tr?: string) => (language === 'tr' && tr?.trim()) ? tr : base;

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
            {t('news.title')}
          </h1>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-stone-500 tracking-widest uppercase">{t('news.loading')}</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-stone-500 text-lg font-light">{t('news.empty')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => navigate(`/news/${post.slug}`)}
              >
                <div className="relative aspect-video bg-stone-900 overflow-hidden mb-6">
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={pick(post.title, post.title_tr)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-700">
                      <Newspaper size={48} strokeWidth={1} />
                    </div>
                  )}
                </div>

                <p className="text-xs text-stone-500 mb-2 uppercase tracking-widest">
                  {new Date(post.published_at).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                </p>
                <h3 className="text-2xl font-condensed uppercase tracking-wide mb-2 group-hover:text-stone-300 transition-colors">
                  {pick(post.title, post.title_tr)}
                </h3>
                {(post.excerpt || post.excerpt_tr) && (
                  <p className="text-sm text-stone-400 font-light line-clamp-2">{pick(post.excerpt || '', post.excerpt_tr)}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
