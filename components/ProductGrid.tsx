import React from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProductGridProps {
  products: Product[];
  onCategoryClick?: (category: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onCategoryClick }) => {
  const { t } = useLanguage();
  // Array'in varlığını kontrol et
  if (!products) return null;

  return (
    <section className="bg-[#f4f4f4] w-full py-24 px-4 md:px-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 w-full max-w-[1920px] mx-auto">
        {products?.map((product) => (
          <div 
            key={product?.id} 
            className="group cursor-pointer flex flex-col gap-6"
            onClick={() => onCategoryClick && product?.category && onCategoryClick(product.category)}
          >
            {/* Image Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-200 shadow-sm">
              {product?.image ? (
                <img 
                  src={product.image} 
                  alt={product?.name || 'Product Image'}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-300 text-stone-500 text-xs tracking-widest uppercase">
                  {t('productGrid.noImage')}
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
            </div>
            
            {/* Label */}
            <div className="flex items-center gap-3 pl-1">
              <span className="text-stone-900 font-normal text-xl leading-none transition-transform duration-500 group-hover:translate-x-1">+</span>
              <span className="font-condensed text-[16px] font-medium text-[#171719] tracking-[0.05em] uppercase">
                {product?.name || t('productGrid.unnamedProduct')}
              </span>
            </div>
          </div>
        ))}
        
        {products?.length === 0 && (
          <div className="col-span-full text-center text-stone-500 py-20 font-light">
            {t('productGrid.empty')}
          </div>
        )}
      </div>
    </section>
  );
};