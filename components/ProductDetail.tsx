import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Product } from '../types';
import { Download, Plus, Minus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { resolveTechnicalFileUrl } from '../lib/technicalFiles';

interface ProductDetailProps {
  product: Product;
  onDesignerClick?: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onDesignerClick }) => {
  const { t } = useLanguage();
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(product.image || '');
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Reset image state when product changes
    setImgSrc(product.image || '');
    setImgLoaded(false);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [product]);

  // Parallax effect
  const scale = Math.max(1, 1 + scrollY * 0.0005);
  const opacity = Math.max(0, 1 - scrollY * 0.002);

  const renderList = (items?: string[]) => {
      if (!items || items.length === 0) return null;
      return items.map((item, idx) => <li key={idx} className="mb-1">{item}</li>);
  };

  const DownloadItem = ({ title, url }: { title: string, url?: string }) => {
      if (!url) return null;

      return (
          <a href={url} target="_blank" rel="noopener noreferrer" className="group flex justify-between items-center py-4 border-b border-stone-200 hover:border-black transition-colors cursor-pointer">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-900 group-hover:text-black">{title}</span>
              <div className="flex items-center gap-2 text-stone-900 group-hover:text-black">
                  <span className="text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{t('productDetail.download')}</span>
                  <Download size={14} strokeWidth={1.5} />
              </div>
          </a>
      );
  };

  // 2D/3D technical files require a login — unlike the other downloads above,
  // clicking either redirects to login or resolves a short-lived signed URL.
  const TechnicalDownloadItem = ({ title, path }: { title: string, path?: string }) => {
      if (!path) return null;

      const handleClick = async () => {
          if (!session) {
              navigate('/account/login?redirect=' + encodeURIComponent(location.pathname));
              return;
          }
          const url = await resolveTechnicalFileUrl(path);
          if (url) window.open(url, '_blank');
      };

      return (
          <button onClick={handleClick} className="group flex justify-between items-center py-4 border-b border-stone-200 hover:border-black transition-colors cursor-pointer w-full text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-900 group-hover:text-black">{title}</span>
              <div className="flex items-center gap-2 text-stone-900 group-hover:text-black">
                  <span className="text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{t('productDetail.download')}</span>
                  <Download size={14} strokeWidth={1.5} />
              </div>
          </button>
      );
  };

  const handleImageError = () => {
    // Fallback to a high-quality abstract texture or placeholder
    setImgSrc('https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2500&auto=format&fit=crop');
  };

  return (
    <div className="w-full relative min-h-screen">
      
      {/* 1. HERO IMAGE SECTION (FIXED) */}
      {/* Changed to fixed positioning to ensure it stays at the top and z-0 to be behind content */}
      <div className="fixed top-0 left-0 w-full h-screen z-0 bg-[#121212]">
        <div 
            className="w-full h-full relative"
            style={{ 
                transform: `scale(${scale})`,
                transition: 'transform 0.1s ease-out'
            }}
        >
             {/* Loading State */}
             {!imgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#121212] z-10">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
             )}
             
             <img 
                src={imgSrc || 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2500&auto=format&fit=crop'} 
                alt={product.name} 
                className={`w-full h-full object-cover transition-opacity duration-700 ${imgLoaded ? 'opacity-90' : 'opacity-0'}`}
                onLoad={() => setImgLoaded(true)}
                onError={handleImageError}
             />
             <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Title Overlay on Hero - Bottom Left */}
        <div 
            className="absolute bottom-12 left-8 md:left-16 text-white z-20"
            style={{ opacity: opacity }}
        >
            <h1 className="text-6xl md:text-9xl font-condensed font-bold uppercase tracking-tighter leading-none mb-2">
                {product.name}
            </h1>
            <p className="text-sm font-light tracking-[0.3em] uppercase opacity-80 pl-1">
                {product.category}
            </p>
        </div>
      </div>

      {/* 2. CONTENT SECTION (SCROLLS OVER HERO) */}
      {/* Added mt-[100vh] to push content below the fixed hero */}
      <div className="relative z-10 bg-white mt-[100vh] text-stone-900">
          
          <div className="max-w-[1920px] mx-auto px-8 md:px-16 py-24 md:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-40">
                
                {/* LEFT COLUMN: DESCRIPTION & MORE INFO */}
                <div className="flex flex-col gap-16">
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-8">{t('productDetail.description')}</h2>
                        <p className="text-xl md:text-2xl font-light leading-relaxed text-black text-justify">
                            {product.description || t('productDetail.defaultDescription')}
                        </p>
                    </div>

                    {/* More Info Accordion */}
                    {(product.more_info || (product.dimensions && product.dimensions.length > 0) || (product.details && product.details.length > 0)) && (
                        <div className="border-t border-stone-200 pt-8">
                            <button 
                                onClick={() => setIsMoreInfoOpen(!isMoreInfoOpen)}
                                className="w-full flex justify-between items-center group"
                            >
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-black group-hover:text-stone-600 transition-colors">{t('productDetail.moreInfo')}</span>
                                {isMoreInfoOpen ? <Minus size={16} /> : <Plus size={16} />}
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isMoreInfoOpen ? 'max-h-[800px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                                <div className="space-y-12">
                                    {/* Custom More Info Text */}
                                    {product.more_info && (
                                        <div className="text-sm font-medium text-stone-900 leading-relaxed whitespace-pre-line">
                                            {product.more_info}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        {product.dimensions && product.dimensions.length > 0 && (
                                            <div>
                                                <h4 className="text-[10px] font-bold uppercase mb-4 tracking-[0.2em] text-stone-400">{t('productDetail.dimensions')}</h4>
                                                <div className="space-y-1 text-sm font-medium text-stone-900">
                                                    {renderList(product.dimensions)}
                                                </div>
                                            </div>
                                        )}
                                        {product.details && product.details.length > 0 && (
                                            <div>
                                                <h4 className="text-[10px] font-bold uppercase mb-4 tracking-[0.2em] text-stone-400">{t('productDetail.materials')}</h4>
                                                <ul className="space-y-1 text-sm font-medium text-stone-900">
                                                    {renderList(product.details)}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: DOWNLOADS & DESIGNER */}
                <div className="flex flex-col gap-16 lg:pl-12">
                    
                    {/* Downloads Section */}
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-8">{t('productDetail.downloads')}</h2>
                        <div className="flex flex-col">
                            <DownloadItem title={t('productDetail.productSheet')} url={product.pdf_sheet || product.pdf_url} />
                            <DownloadItem title={t('productDetail.highResImages')} url={product.pdf_images} />
                            <TechnicalDownloadItem title={t('productDetail.technical2d3d')} path={product.pdf_technical} />
                            {(!product.pdf_sheet && !product.pdf_url && !product.pdf_images && !product.pdf_technical) && (
                                <div className="py-4 text-xs text-stone-400 italic border-b border-stone-200">
                                    {t('productDetail.noDownloads')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Designer Section */}
                    {product.designer && (
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-8">{t('productDetail.designer')}</h2>
                            <div
                                onClick={onDesignerClick}
                                className="group cursor-pointer inline-block"
                            >
                                <h3 className="text-3xl md:text-4xl font-sans font-light uppercase border-b border-stone-300 group-hover:border-black transition-all duration-300 inline-block pb-1 text-black">
                                    {product.designer}
                                </h3>
                                <p className="text-xs text-stone-500 mt-4 font-light leading-relaxed max-w-sm">
                                    {t('productDetail.discoverPrefix')}{product.designer}.
                                </p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
          </div>
      </div>
    </div>
  );
};