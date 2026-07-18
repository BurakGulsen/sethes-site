import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSiteData } from '../context/SiteContext';
import { CategoryDetail } from './CategoryDetail';
import { ProductDetail } from './ProductDetail';
import { MediaGallery } from './MediaGallery';

import { ProductGrid } from './ProductGrid';

import { AllCollections } from './AllCollections';

export const AllCollectionsWrapper: React.FC = () => {
    const navigate = useNavigate();
    return <AllCollections onCategoryClick={(id) => navigate(`/category/${id}`)} />;
};

export const ProductGridWrapper: React.FC = () => {
    const { products } = useSiteData();
    const navigate = useNavigate();

    return <ProductGrid products={products} onCategoryClick={(cat) => navigate(`/category/${cat}`)} />;
};

export const CategoryDetailWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, products } = useSiteData();

  const category = categories.find(c => c.id === id || c.slug === id);
  
  if (!category) {
      // Handle not found or loading
      return <div className="min-h-screen pt-40 text-center">Category not found</div>;
  }

  const categoryProducts = products.filter(p => p.category_id === category.id || p.category === category.name);

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
  const { products } = useSiteData();

  const product = products.find(p => p.id === id);

  if (!product) {
      return <div className="min-h-screen pt-40 text-center">Product not found</div>;
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
    const { mediaCategories } = useSiteData();
    
    const category = mediaCategories.find(c => c.id === id || c.slug === id);

    if (!category) {
        return <div className="min-h-screen pt-40 text-center">Media Category not found</div>;
    }

    return <MediaGallery category={category} />;
};
