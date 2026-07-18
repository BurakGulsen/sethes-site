
export interface Designer {
  id: string;
  name: string;
  role: string;
  bio: string;
  collections: string; // Stored as comma separated string in DB
  quote: string;
  image_url: string;
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
}

export interface Product {
  id: string;
  category_id?: string; // Foreign key to Category
  name: string;
  category: string; // Keep for fallback/display
  image: string;
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
}

export interface Catalogue {
  id: string;
  title: string;
  cover_image: string;
  pdf_url: string;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface MediaCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface MediaItem {
  id: string;
  category_id: string;
  title: string;
  cover_image: string;
  pdf_url?: string;
  created_at: string;
}

export interface ContactInfo {
  id: string;
  type: 'header' | 'card';
  title: string;
  address?: string;
  email?: string;
  phone?: string;
  sort_order: number;
}

// Simplified ViewState to handle dynamic categories
export type ViewState = 'HOME' | 'COLLECTION' | 'PHILOSOPHY' | 'DESIGNERS' | 'PRODUCT_DETAIL' | 'CATEGORY_DETAIL' | 'CATALOGUES' | 'MEDIA_DETAIL' | 'CONTACTS' | 'ALL_COLLECTIONS';

export enum DesignStyle {
  LIGHTING = 'Lighting',
  FURNITURE = 'Furniture',
  ACCESSORIES = 'Accessories'
}