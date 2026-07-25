import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSiteData, useLocalizedSiteData } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { CategoryDetail } from './CategoryDetail';
import { ProductDetail } from './ProductDetail';
import { MediaGallery } from './MediaGallery';
import { MaterialDetail } from './MaterialDetail';

import { ProductGrid } from './ProductGrid';

import { AllCollections } from './AllCollections';

export const AllCollectionsWrapper: React.FC = () => {
    const navigate = useNavigate();
    return <AllCollections onCategoryClick={(id) => navigate(`/category/${id}`)} />;
};

export const ProductGridWrapper: React.FC = () => {
    const { products } = useLocalizedSiteData();
    const navigate = useNavigate();

    return <ProductGrid products={products} onCategoryClick={(cat) => navigate(`/category/${cat}`)} />;
};

export const CategoryDetailWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { categories, products } = useLocalizedSiteData();
  // Raw (untranslated) categories — needed only to resolve the legacy
  // products.category text-fallback match below, since that column is
  // deliberately never translated and always stays the English name.
  const { categories: rawCategories } = useSiteData();

  const category = categories.find(c => c.id === id || c.slug === id);

  if (!category) {
      // Handle not found or loading
      return <div className="min-h-screen pt-40 text-center">{t('common.categoryNotFound')}</div>;
  }

  const rawCategoryName = rawCategories.find(c => c.id === category.id)?.name;
  const categoryProducts = products.filter(p => p.category_id === category.id || p.category === rawCategoryName);

  return (
    <CategoryDetail
      categoryData={category}
      products={categoryProducts}
      onProductClick={(product) => navigate(`/product/${product.id}`)}
    />
  );
};

export const ProductDetailWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { products } = useLocalizedSiteData();

  const product = products.find(p => p.id === id);

  if (!product) {
      return <div className="min-h-screen pt-40 text-center">{t('common.productNotFound')}</div>;
  }

  return (
    <ProductDetail
      product={product}
      onDesignerClick={() => navigate('/designers')}
    />
  );
};

export const MediaGalleryWrapper: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useLanguage();
    const { mediaCategories } = useLocalizedSiteData();

    const category = mediaCategories.find(c => c.id === id || c.slug === id);

    if (!category) {
        return <div className="min-h-screen pt-40 text-center">{t('common.mediaNotFound')}</div>;
    }

    return <MediaGallery category={category} />;
};

export const MaterialDetailWrapper: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useLanguage();
    const { materialCategories } = useLocalizedSiteData();

    const category = materialCategories.find(c => c.id === id || c.slug === id);

    if (!category) {
        return <div className="min-h-screen pt-40 text-center">{t('common.materialNotFound')}</div>;
    }

    return <MaterialDetail category={category} />;
};
