import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { NewsPost } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const { data, error } = await supabase.from('news_posts').select('*').eq('slug', slug).maybeSingle();
      if (error) throw error;
      if (!data) {
        setNotFound(true);
      } else {
        setPost(data);
      }
    } catch (error) {
      console.error('Error fetching news post:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const pick = (base: string, tr?: string) => (language === 'tr' && tr?.trim()) ? tr : base;

  if (loading) {
    return <div className="min-h-screen bg-white pt-40 text-center text-stone-400">{t('news.loading')}</div>;
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-white pt-40 text-center">
        <p className="text-stone-600 mb-6">{t('common.newsNotFound')}</p>
        <Link to="/news" className="text-black font-bold underline">{t('news.backToNews')}</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-stone-900">
      {post.cover_image && (
        <div className="w-full h-[50vh] bg-stone-900">
          <img src={post.cover_image} alt={pick(post.title, post.title_tr)} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <Link to="/news" className="text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-black transition-colors">
          &larr; {t('news.backToNews')}
        </Link>

        <p className="text-xs text-stone-400 uppercase tracking-widest mt-8 mb-2">
          {new Date(post.published_at).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
        </p>
        <h1 className="text-4xl md:text-6xl font-condensed uppercase tracking-tight mb-10">
          {pick(post.title, post.title_tr)}
        </h1>

        <div
          className="max-w-none text-lg font-light leading-relaxed
            [&_h2]:text-3xl [&_h2]:font-condensed [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:mt-10 [&_h2]:mb-4
            [&_h3]:text-2xl [&_h3]:font-condensed [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-wide [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:mb-6
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-1
            [&_a]:underline [&_a]:font-medium [&_a]:text-black
            [&_img]:rounded-lg [&_img]:my-8 [&_img]:w-full"
          dangerouslySetInnerHTML={{ __html: pick(post.content, post.content_tr) }}
        />
      </div>
    </div>
  );
};
