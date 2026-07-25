import React from 'react';
import { Product, Category } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { DARK_THEME_CATEGORY_SLUGS } from '../lib/constants';

interface CategoryDetailProps {
  categoryData: Category;
  products: Product[];
  onProductClick?: (product: Product) => void;
}

export const CategoryDetail: React.FC<CategoryDetailProps> = ({ categoryData, products, onProductClick }) => {
  const { t } = useLanguage();
  const categoryName = categoryData.name;

  // Dynamic theme based on category — keyed by slug (stable across languages),
  // not the display name (which changes with the active language).
  const isDark = DARK_THEME_CATEGORY_SLUGS.includes(categoryData.slug);
  const bgColor = isDark ? 'bg-[#121212]' : 'bg-[#f4f4f4]';
  const textColor = isDark ? 'text-white' : 'text-[#171719]';
  const breadcrumbColor = isDark ? 'text-white' : 'text-stone-500';
  const lineColor = isDark ? 'bg-white' : 'bg-stone-300';
  const gridGap = isDark ? 'gap-4 md:gap-8' : 'gap-x-8 gap-y-16';

  return (
    <section className={`${bgColor} ${textColor} min-h-screen w-full pt-40 px-6 md:px-12 pb-20 animate-in fade-in duration-500`}>
      <div className="max-w-[1920px] mx-auto">
        
        <div className="mb-16">
          <div className={`flex gap-2 text-[11px] font-bold tracking-[0.15em] uppercase ${breadcrumbColor} mb-4 pl-1`}>
            <span className="hover:opacity-70 cursor-pointer transition-opacity">{t('categoryDetail.breadcrumb')}</span>
            <span>/</span>
            <span className={isDark ? 'text-white' : 'text-black'}>{categoryName}</span>
          </div>

          <div className={`h-[1px] w-full ${lineColor} opacity-50 mb-6`}></div>

          <h1 className="text-6xl md:text-[80px] font-condensed uppercase tracking-tight leading-none">
            {categoryName}
          </h1>
          {categoryData.description && (
             <p className={`mt-4 max-w-2xl font-light text-sm ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                {categoryData.description}
             </p>
          )}
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gridGap}`}>
          {products.map((item) => (
            <div 
              key={item.id} 
              className="group cursor-pointer"
              onClick={() => onProductClick && onProductClick(item)}
            >
              <div className={`w-full aspect-[4/3] overflow-hidden ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#e0e0e0]'} mb-2 relative`}>
                <div className={`absolute inset-0 transition-colors duration-500 z-10 ${isDark ? 'bg-transparent group-hover:bg-white/5' : 'bg-white/10 group-hover:bg-transparent'}`}></div>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className={`w-full h-full object-contain p-8 md:p-12 transition-transform duration-700 group-hover:scale-105 ${isDark ? 'mix-blend-normal' : ''}`}
                />
              </div>

              <div className="flex flex-col items-start pl-1 mt-6">
                <div className="relative">
                  <h3 className={`text-[13px] font-bold tracking-[0.1em] uppercase ${isDark ? 'text-white' : 'text-stone-800'} transition-colors`}>
                    {item.name}
                  </h3>
                  <span className={`absolute left-0 -bottom-2 h-[1px] transition-all duration-500 ease-out w-0 group-hover:w-full ${isDark ? 'bg-white' : 'bg-stone-800'}`}></span>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
             <div className="col-span-full py-20 text-center opacity-50">{t('categoryDetail.empty')}</div>
          )}
        </div>
      </div>
    </section>
  );
};
