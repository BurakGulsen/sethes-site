import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Product, MediaCategory } from '../types';
import { Navigation } from './Navigation';
import { AiConcierge } from './AiConcierge';
import { RevealOnScroll } from './RevealOnScroll';
import { Menu, Search, Sparkles, Instagram, Mail, MapPin, WifiOff, Linkedin, Youtube, Twitter, Facebook, Globe } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { SearchOverlay } from './SearchOverlay';
import { Intro } from './Intro';

export const MainSite: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { siteSettings, error, categories } = useSiteData();
  const location = useLocation();
  const navigate = useNavigate();

  // Footer Data Logic
  const footerTitle = siteSettings?.find(s => s.key === 'footer_title')?.value || 'ARBEM ATELIER';
  const footerSubtitle = siteSettings?.find(s => s.key === 'footer_subtitle')?.value || 'An homage to purity, material, and form.';
  
  let socialLinks: {platform: string, url: string}[] = [];
  try {
      const socialStr = siteSettings?.find(s => s.key === 'social_links')?.value;
      if (socialStr) {
          socialLinks = JSON.parse(socialStr);
      } else {
           socialLinks = [{ platform: 'Instagram', url: '#' }];
      }
  } catch(e) {
      socialLinks = [{ platform: 'Instagram', url: '#' }];
  }

  const getSocialIcon = (platform: string) => {
      const p = platform.toLowerCase();
      if (p.includes('instagram')) return <Instagram size={16} />;
      if (p.includes('linkedin')) return <Linkedin size={16} />;
      if (p.includes('youtube')) return <Youtube size={16} />;
      if (p.includes('twitter') || p.includes('x')) return <Twitter size={16} />;
      if (p.includes('facebook')) return <Facebook size={16} />;
      return <Globe size={16} />;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generic Category Handler
  const handleCategorySelect = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
    setIsNavOpen(false);
  };

  const handleMediaSelect = (category: MediaCategory) => {
      navigate(`/media/${category.id}`);
      setIsNavOpen(false);
  };

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
    setIsSearchOpen(false);
  };

  // Critical Error State Render
  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex flex-col items-center justify-center p-8 text-center">
         <div className="bg-white p-12 shadow-2xl max-w-lg border-t-4 border-red-500">
             <WifiOff size={48} className="text-stone-300 mx-auto mb-6" />
             <h2 className="text-2xl font-condensed font-bold text-stone-900 uppercase mb-4 tracking-wide">
               Bağlantı Kurulamadı
             </h2>
             <p className="text-stone-600 font-light mb-8">
               {error}
             </p>
             <button 
               onClick={() => window.location.reload()}
               className="bg-black text-white px-8 py-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-stone-800 transition-colors"
             >
               Tekrar Dene
             </button>
         </div>
      </div>
    );
  }

  const isDarkHeader = scrolled || (location.pathname !== '/' && !location.pathname.includes('/product/'));
  
  // Determine if page is dark based on route
  const isDarkPage = 
    location.pathname.includes('/product/') || 
    location.pathname.includes('/catalogues') || 
    location.pathname.includes('/media/') || 
    location.pathname.includes('/contacts') || 
    location.pathname.includes('/collections') ||
    (location.pathname.includes('/category/') && (() => {
        // Check if current category is dark
        const pathParts = location.pathname.split('/');
        const catId = pathParts[pathParts.length - 1];
        const cat = categories.find(c => c.id === catId || c.slug === catId);
        return cat && ['Lighting', 'Washbasins'].includes(cat.name);
    })());

  const globalBgClass = isDarkPage ? 'bg-[#121212] text-white' : 'bg-[#f4f4f4] text-[#171719]';
  
  return (
    <div className={`min-h-screen transition-colors duration-700 selection:bg-stone-700 selection:text-white ${globalBgClass}`}>
      {showIntro && <Intro onComplete={() => setShowIntro(false)} />}

      <div className={`transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        <header 
          className={`fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center transition-colors duration-500 ${
            isDarkHeader ? 'bg-black/90 backdrop-blur-sm' : 'bg-transparent'
          }`}
        >
          <div onClick={() => navigate('/')} className="cursor-pointer font-sans text-xl tracking-[0.2em] font-bold text-white uppercase flex items-center h-20">
            {siteSettings?.find(s => s.key === 'logo_type')?.value === 'image' && siteSettings?.find(s => s.key === 'logo_image_url')?.value ? (
                <img 
                    src={siteSettings.find(s => s.key === 'logo_image_url')?.value} 
                    alt="Logo" 
                    className="h-full w-auto object-contain py-1"
                />
            ) : (
                siteSettings?.find(s => s.key === 'logo_text')?.value || 'ARBEM'
            )}
          </div>

          <div className="flex items-center gap-8 md:gap-12">
              <button onClick={() => setIsSearchOpen(true)} className="text-white hover:text-stone-300 transition-colors"><Search size={18} /></button>
              <button onClick={() => setIsNavOpen(true)} className="text-white hover:text-stone-300 transition-colors">
                <Menu size={20} strokeWidth={2} />
              </button>
          </div>
        </header>

        <main>
            <Outlet />
        </main>

        {!location.pathname.includes('/product/') && (
          <RevealOnScroll>
            <footer className="relative z-20 bg-black text-stone-500 py-20 px-8 border-t border-stone-900">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="max-w-xs">
                  <h4 className="text-white font-condensed text-2xl mb-6 tracking-wide">{footerTitle}</h4>
                  <p className="text-sm leading-relaxed mb-6 font-light">{footerSubtitle}</p>
                </div>
                <div className="flex gap-12 text-sm tracking-widest uppercase">
                  <div className="flex flex-col gap-4">
                    <span className="text-white font-bold mb-2">Connect</span>
                    {socialLinks.map((link, idx) => (
                        <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2 transition-colors">
                            {getSocialIcon(link.platform)} {link.platform}
                        </a>
                    ))}
                  </div>
                </div>
              </div>
            </footer>
          </RevealOnScroll>
        )}

        <button onClick={() => setIsAiOpen(true)} className="fixed bottom-8 right-8 z-40 bg-black text-white p-3 rounded-full hover:bg-stone-900 transition-colors shadow-lg border border-stone-800">
          <Sparkles size={20} strokeWidth={1} />
        </button>
      </div>

      <Navigation 
        isOpen={isNavOpen} 
        onClose={() => setIsNavOpen(false)} 
        onOpenAi={() => { setIsNavOpen(false); setIsAiOpen(true); }}
        onCategorySelect={handleCategorySelect}
        onMediaSelect={handleMediaSelect}
      />
      
      <AiConcierge isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)}
        onProductClick={handleProductClick}
      />
    </div>
  );
};