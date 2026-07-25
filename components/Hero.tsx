import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onExplore: () => void;
  videoUrl?: string; // Keep for backward compatibility or fallback
  mediaType?: 'video' | 'image';
  mediaUrl?: string;
  title?: string;
  subtitle?: string;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, videoUrl, mediaType = 'video', mediaUrl, title, subtitle }) => {
  const [scrollY, setScrollY] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    if (mediaType === 'video' && videoRef.current) {
        videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [videoUrl, mediaUrl, mediaType]); // Re-run effect if media changes

  const contentOpacity = Math.max(0, 1 - scrollY / 700);
  const contentTranslate = scrollY * 0.35;
  
  // Determine active media URL
  // Priority: mediaUrl -> videoUrl -> default fallback
  const activeMediaUrl = mediaUrl || videoUrl || "https://videos.pexels.com/video-files/7515833/7515833-uhd_2160_3840_25fps.mp4";
  const activeTitle = title || t('hero.defaultTitle');
  const activeSubtitle = subtitle || t('hero.defaultSubtitle');

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black sticky top-0 -z-10">
      {/* Background Media */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {mediaType === 'image' ? (
            <img 
                src={activeMediaUrl}
                alt="Hero Background"
                className="w-full h-full object-cover grayscale-[10%] brightness-[0.5] transition-transform duration-75"
                style={{ 
                   transform: `scale(${1 + scrollY * 0.0004})` 
                }}
                loading="eager" // Hero image should load immediately
            />
        ) : (
            <video 
              key={activeMediaUrl} // Force re-render on URL change
              ref={videoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover grayscale-[10%] brightness-[0.5] transition-transform duration-75"
              style={{ 
                 transform: `scale(${1 + scrollY * 0.0004})` 
              }}
            >
              <source src={activeMediaUrl} type="video/mp4" />
            </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
      </div>

      {/* Hero Content - Adjusted Typography to match 100px requirement */}
      <div 
        className="absolute bottom-0 left-0 z-10 p-12 md:p-20 w-full max-w-6xl will-change-transform"
        style={{ 
           opacity: contentOpacity,
           transform: `translateY(-${contentTranslate}px)`
        }}
      >
        <h1 className="text-5xl md:text-7xl lg:text-[100px] font-condensed font-bold text-white mb-2 tracking-tight uppercase leading-[0.95]">
          {activeTitle}
        </h1>
        <h2 className="text-xl md:text-3xl lg:text-4xl font-condensed font-normal text-white/95 tracking-normal mb-10 uppercase">
          {activeSubtitle}
        </h2>
        
        <button 
          onClick={onExplore}
          className="group flex items-center gap-2 text-[11px] font-condensed font-bold tracking-[0.2em] uppercase text-white hover:text-stone-300 transition-colors"
        >
          <span className="text-lg leading-none transition-transform duration-500 group-hover:translate-x-1">+</span>
          <span>{t('hero.readMore')}</span>
        </button>
      </div>
    </section>
  );
};