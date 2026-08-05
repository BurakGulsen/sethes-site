
export interface Designer {
  id: string;
  name: string;
  role: string;
  bio: string;
  collections: string; // Stored as comma separated string in DB
  quote: string;
  image_url: string;
  // Turkish counterparts (optional — fall back to the English field above when empty)
  role_tr?: string;
  bio_tr?: string;
  collections_tr?: string;
  quote_tr?: string;
}

export interface CustomerProfile {
  id: string;
  first_name: string;
  last_name: string;
  company?: string;
  job_role?: string;
  country?: string;
  phone?: string;
  marketing_consent: boolean;
  terms_accepted_at: string;
  created_at: string;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  cover_image?: string;
  excerpt?: string;
  content: string; // HTML from the rich text editor
  published_at: string;
  created_at: string;
  title_tr?: string;
  excerpt_tr?: string;
  content_tr?: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string; // URL friendly ID for routing
  image: string;
  description?: string;
  name_tr?: string;
  description_tr?: string;
}

export interface Product {
  id: string;
  category_id?: string; // Foreign key to Category
  name: string;
  category: string; // Keep for fallback/display
  image: string;
  detail_image?: string; // Optional separate hero image for the product detail page — falls back to `image` when empty
  description: string;
  designer?: string;
  
  // New specific file fields
  pdf_sheet?: string;    // Product Sheet
  pdf_images?: string;   // High-res Images
  pdf_technical?: string;// 2D/3D Files
  pdf_url?: string;      // Legacy fallback
  
  // Dynamic detail view fields
  details?: string[];
  lightSource?: string[]; // Note: Database column usually snake_case (light_source), mapped in Context
  notes?: string[];
  dimensions?: string[];
  more_info?: string; // Additional rich text info

  // Turkish counterparts (optional — fall back to the English field above when empty)
  name_tr?: string;
  description_tr?: string;
  details_tr?: string[];
  dimensions_tr?: string[];
  lightSource_tr?: string[]; // DB column: light_source_tr
  more_info_tr?: string;
}

export interface Catalogue {
  id: string;
  title: string;
  cover_image: string;
  pdf_url: string;
  created_at: string;
  title_tr?: string;
}

export interface MediaCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  name_tr?: string;
}

export interface MediaItem {
  id: string;
  category_id: string;
  title: string;
  cover_image: string;
  pdf_url?: string;
  created_at: string;
  title_tr?: string;
}

export interface MaterialCategory {
  id: string;
  name: string;
  slug: string;
  image?: string;       // Cover image for the /materials landing page
  description?: string; // Optional caption on the swatch page
  sort_order?: number;
  created_at?: string;
  name_tr?: string;
  description_tr?: string;
}

export interface MaterialSwatch {
  id: string;
  category_id: string;
  name: string;         // e.g. "ABARTH 26"
  image: string;        // Swatch texture / color image
  sort_order?: number;
  created_at?: string;
}

export interface ContactInfo {
  id: string;
  type: 'header' | 'card';
  title: string;
  address?: string;
  email?: string;
  phone?: string;
  sort_order: number;
  title_tr?: string;
  address_tr?: string;
}

// Simplified ViewState to handle dynamic categories
export type ViewState = 'HOME' | 'COLLECTION' | 'PHILOSOPHY' | 'DESIGNERS' | 'PRODUCT_DETAIL' | 'CATEGORY_DETAIL' | 'CATALOGUES' | 'MEDIA_DETAIL' | 'CONTACTS' | 'ALL_COLLECTIONS';

export enum DesignStyle {
  LIGHTING = 'Lighting',
  FURNITURE = 'Furniture',
  ACCESSORIES = 'Accessories'
}