import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteData } from '../context/SiteContext';
import { Hero } from './Hero';
import { RevealOnScroll } from './RevealOnScroll';
import { Flagship } from './Flagship';
import { Projects } from './Projects';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { categories, siteSettings } = useSiteData();
  
  // Collections Scroll Logic
  const collectionsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Drag State
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const mouseMoved = useRef(false);

  const checkScroll = () => {
    if (collectionsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = collectionsScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const scrollCollections = (direction: 'left' | 'right') => {
    if (collectionsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      collectionsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    mouseMoved.current = false;
    if(collectionsScrollRef.current) {
        startX.current = e.pageX - collectionsScrollRef.current.offsetLeft;
        scrollLeftStart.current = collectionsScrollRef.current.scrollLeft;
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if(collectionsScrollRef.current) {
        const x = e.pageX - collectionsScrollRef.current.offsetLeft;
        const walk = (x - startX.current) * 2; // Scroll-fast
        collectionsScrollRef.current.scrollLeft = scrollLeftStart.current - walk;
        if (Math.abs(walk) > 5) {
            mouseMoved.current = true;
        }
    }
  };

  const handleCardClick = (id: string) => {
      if (!mouseMoved.current) {
          navigate(`/category/${id}`);
      }
  };

  return (
    <div className="relative z-10 bg-transparent">
      <Hero 
          onExplore={() => navigate('/collections')} 
          videoUrl={siteSettings?.find(s => s.key === 'hero_video_url')?.value}
          mediaType={(siteSettings?.find(s => s.key === 'hero_media_type')?.value as 'video' | 'image') || 'video'}
          mediaUrl={siteSettings?.find(s => s.key === 'hero_media_url')?.value}
          title={siteSettings?.find(s => s.key === 'hero_title')?.value}
          subtitle={siteSettings?.find(s => s.key === 'hero_subtitle')?.value}
      />
      
      <div className="relative z-20 bg-[#f4f4f4]"> 
        <RevealOnScroll>
          {/* Dynamic Collections / Categories List on Home */}
          <section className="py-24 px-4 md:px-10 max-w-[1920px] mx-auto">
              <div className="flex justify-between items-end mb-12 border-b border-stone-300 pb-4">
                  <h2 className="text-4xl font-condensed uppercase tracking-tight">
                      {siteSettings?.find(s => s.key === 'collections_title')?.value || 'COLLECTIONS'}
                  </h2>
                  <button onClick={() => navigate('/collections')} className="text-xs font-bold tracking-[0.2em] uppercase hover:text-stone-500">View All</button>
              </div>
              
              <div className="relative group/slider">
                  {/* Left Button */}
                  <button 
                      onClick={() => scrollCollections('left')}
                      disabled={!canScrollLeft}
                      className={`hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 ${!canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  >
                      <ChevronLeft size={24} className="text-black" />
                  </button>

                  {/* Right Button */}
                  <button 
                      onClick={() => scrollCollections('right')}
                      disabled={!canScrollRight}
                      className={`hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 ${!canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  >
                      <ChevronRight size={24} className="text-black" />
                  </button>

                  <div 
                      ref={collectionsScrollRef}
                      onScroll={checkScroll}
                      onMouseDown={handleMouseDown}
                      onMouseLeave={handleMouseLeave}
                      onMouseUp={handleMouseUp}
                      onMouseMove={handleMouseMove}
                      className={`flex gap-8 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden ${isDragging ? 'cursor-grabbing select-none snap-none' : 'cursor-grab snap-x snap-mandatory scroll-smooth'}`}
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                      {categories.map(cat => (
                          <div key={cat.id} onClick={() => handleCardClick(cat.id)} className="min-w-[300px] md:min-w-[400px] snap-center flex-shrink-0 group cursor-pointer relative aspect-[4/5] overflow-hidden bg-stone-200">
                              <img 
                                  src={cat.image} 
                                  alt={cat.name} 
                                  className="absolute inset-0 w-full h-full !object-cover object-center transition-transform duration-700 group-hover:scale-105 pointer-events-none" 
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-8 pointer-events-none">
                                  <h3 className="text-white text-3xl font-condensed uppercase">{cat.name}</h3>
                                  <p className="text-white/80 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-500">
                                      Explore Collection <ArrowRight size={12} className="inline ml-1"/>
                                  </p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </section>
        </RevealOnScroll>
        
        <RevealOnScroll>
          <Flagship 
            title={siteSettings?.find(s => s.key === 'story_title')?.value}
            description={siteSettings?.find(s => s.key === 'story_description')?.value}
            imageUrl={siteSettings?.find(s => s.key === 'story_image_url')?.value}
          />
        </RevealOnScroll>
        
        <RevealOnScroll>
          <Projects 
            videoUrl={siteSettings?.find(s => s.key === 'bespoke_video_url')?.value}
            title={siteSettings?.find(s => s.key === 'bespoke_title')?.value}
            subtitle={siteSettings?.find(s => s.key === 'bespoke_subtitle')?.value}
          />
        </RevealOnScroll>
      </div>
    </div>
  );
};
