import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Product, Category, SiteSettings, Designer, MediaCategory, ContactInfo } from '../types';

interface SiteContextType {
  products: Product[];
  categories: Category[];
  siteSettings: SiteSettings[];
  designers: Designer[];
  mediaCategories: MediaCategory[];
  contacts: ContactInfo[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'slug'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addDesigner: (designer: Omit<Designer, 'id'>) => Promise<void>;
  updateDesigner: (id: string, updates: Partial<Designer>) => Promise<void>;
  deleteDesigner: (id: string) => Promise<void>;
  uploadFile: (file: File, path: string) => Promise<string | null>;
  updateSiteSetting: (key: string, value: string) => Promise<void>;
  updateContact: (id: string, updates: Partial<ContactInfo>) => Promise<void>;
  addContact: (contact: Omit<ContactInfo, 'id'>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

// Helper to create slugs (Turkish char support)
const createSlug = (text: string) => {
  const trMap: { [key: string]: string } = {
      'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
      'Ç': 'c', 'Ğ': 'g', 'I': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };
  return text
      .split('')
      .map(char => trMap[char] || char)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
};

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings[]>([]);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [mediaCategories, setMediaCategories] = useState<MediaCategory[]>([]);
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    // 0. Configuration Check
    if (!isSupabaseConfigured) {
      console.error("SiteContext: Missing Supabase Environment Variables.");
      setError("Bağlantı Hatası: Veritabanı yapılandırması eksik (Environment Variables).");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Fetch Categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (catError) {
        console.error("Categories fetch error:", catError);
      }

      // 2. Fetch Products
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (prodError) throw prodError;

      // 3. Fetch Site Settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('*');

      if (settingsError) {
          console.error("Settings fetch error:", settingsError);
      }

      // 4. Fetch Designers
      const { data: desData, error: desError } = await supabase
        .from('designers')
        .select('*')
        .order('created_at');

      if (desError) {
          console.error("Designers fetch error:", desError);
      }

      // 5. Fetch Media Categories
      const { data: mediaCatData, error: mediaCatError } = await supabase
        .from('media_categories')
        .select('*')
        .order('created_at');

      if (mediaCatError) {
          console.error("Media Categories fetch error:", mediaCatError);
      }

      // 6. Fetch Contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts_info')
        .select('*')
        .order('sort_order', { ascending: true });

      if (contactsError) {
          console.error("Contacts fetch error:", contactsError);
      }

      // Handle Categories
      if (catData && catData.length > 0) {
        setCategories(catData);
      } else {
        setCategories([]); 
      }

      // Handle Products
      if (prodData && prodData.length > 0) {
        const mappedData = prodData.map((item: any) => {
            // Resolve designer name if it's an ID
            let designerName = item.designer;
            if (!designerName && item.designer_id && desData) {
                const d = desData.find((d: any) => d.id === item.designer_id);
                if (d) designerName = d.name;
            }

            return {
                id: item.id,
                category_id: item.category_id,
                name: item.name,
                category: item.category || 'General', 
                image: item.image,
                description: item.description,
                designer: designerName,
                pdf_url: item.pdf_url,
                pdf_sheet: item.pdf_sheet,
                pdf_images: item.pdf_images,
                pdf_technical: item.pdf_technical,
                details: Array.isArray(item.details) ? item.details : [],
                lightSource: Array.isArray(item.light_source) ? item.light_source : [],
                notes: Array.isArray(item.notes) ? item.notes : [],
                dimensions: Array.isArray(item.dimensions) ? item.dimensions : [],
                more_info: item.more_info
            };
        });
        setProducts(mappedData);
      } else {
        setProducts([]);
      }

      // Handle Settings
      if (settingsData) {
          setSiteSettings(settingsData);
      }

      // Handle Designers
      if (desData) {
          setDesigners(desData);
      }

      // Handle Media Categories
      if (mediaCatData) {
          setMediaCategories(mediaCatData);
      }

      // Handle Contacts
      if (contactsData) {
          setContacts(contactsData);
      }

    } catch (err: any) {
      console.error("SiteContext Critical Error:", err);
      // More user friendly message if it's a connection error
      if (err.message && (err.message.includes("fetch") || err.message.includes("connection"))) {
        setError("Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.");
      } else {
        setError("Veri yüklenirken bir hata oluştu: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('product-assets').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('product-assets').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error: any) {
      console.error('Upload Error:', error.message);
      alert('Dosya yüklenirken hata oluştu: ' + error.message);
      return null;
    }
  };

  const addCategory = async (category: Omit<Category, 'id' | 'slug'>) => {
    try {
      const slug = createSlug(category.name);
      const payload = { name: category.name, slug: slug, image: category.image, description: category.description };
      const { error } = await supabase.from('categories').insert([payload]);
      if (error) throw error;
      await fetchData();
    } catch (e: any) {
      alert("Kategori eklenemedi: " + e.message);
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const dbUpdates: any = { ...updates };
      if (updates.name) dbUpdates.slug = createSlug(updates.name);
      const { error } = await supabase.from('categories').update(dbUpdates).eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (e: any) {
      alert("Kategori güncellenemedi: " + e.message);
    }
  };

  const deleteCategory = async (id: string) => {
     try {
       const { error } = await supabase.from('categories').delete().eq('id', id);
       if (error) throw error;
       await fetchData();
     } catch (e: any) {
       alert("Silinemedi: " + e.message);
     }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
      try {
        const dbProduct: any = {
            category_id: product.category_id,
            name: product.name,
            category: product.category,
            image: product.image,
            description: product.description,
            designer: product.designer,
            pdf_url: product.pdf_url,
            pdf_sheet: product.pdf_sheet,
            pdf_images: product.pdf_images,
            pdf_technical: product.pdf_technical,
            details: product.details,
            light_source: product.lightSource,
            notes: product.notes,
            dimensions: product.dimensions,
            more_info: product.more_info
        };
        const { error } = await supabase.from('products').insert([dbProduct]);
        if (error) throw error;
        await fetchData();
      } catch (e: any) {
        alert("Ürün eklenemedi: " + e.message);
      }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
        const dbUpdates: any = { ...updates };
        if (updates.lightSource !== undefined) {
             dbUpdates.light_source = updates.lightSource;
        }
        if ('lightSource' in dbUpdates) {
            delete dbUpdates.lightSource;
        }
        const { error } = await supabase.from('products').update(dbUpdates).eq('id', id);
        if (error) throw error;
        await fetchData();
    } catch (err: any) {
        alert("Güncelleme başarısız: " + err.message);
    }
  };

  const deleteProduct = async (id: string) => {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        await fetchData();
      } catch (e: any) {
        alert("Silinemedi: " + e.message);
      }
  };

  // Designer Actions
  const addDesigner = async (designer: Omit<Designer, 'id'>) => {
      try {
          const { error } = await supabase.from('designers').insert([designer]);
          if (error) throw error;
          await fetchData();
      } catch (e: any) {
          alert("Tasarımcı eklenemedi: " + e.message);
      }
  };

  const updateDesigner = async (id: string, updates: Partial<Designer>) => {
      try {
          const { error } = await supabase.from('designers').update(updates).eq('id', id);
          if (error) throw error;
          await fetchData();
      } catch (e: any) {
          alert("Tasarımcı güncellenemedi: " + e.message);
      }
  };

  const deleteDesigner = async (id: string) => {
      try {
          const { error } = await supabase.from('designers').delete().eq('id', id);
          if (error) throw error;
          await fetchData();
      } catch (e: any) {
          alert("Tasarımcı silinemedi: " + e.message);
      }
  };

  const updateSiteSetting = async (key: string, value: string) => {
      try {
          // Use upsert to handle both insert and update in one atomic operation
          // This prevents "duplicate key value" errors
          const { error } = await supabase
            .from('site_settings')
            .upsert({ key, value }, { onConflict: 'key' });
            
          if (error) throw error;
          await fetchData();
      } catch (e: any) {
          console.error("Setting update error:", e);
          alert("Ayar güncellenemedi: " + e.message);
      }
  };

  const updateContact = async (id: string, updates: Partial<ContactInfo>) => {
      try {
          const { error } = await supabase.from('contacts_info').update(updates).eq('id', id);
          if (error) throw error;
          await fetchData();
      } catch (e: any) {
          alert("İletişim bilgisi güncellenemedi: " + e.message);
      }
  };

  const addContact = async (contact: Omit<ContactInfo, 'id'>) => {
      try {
          const { error } = await supabase.from('contacts_info').insert([contact]);
          if (error) throw error;
          await fetchData();
      } catch (e: any) {
          alert("İletişim bilgisi eklenemedi: " + e.message);
      }
  };

  const deleteContact = async (id: string) => {
      try {
          const { error } = await supabase.from('contacts_info').delete().eq('id', id);
          if (error) throw error;
          await fetchData();
      } catch (e: any) {
          alert("İletişim bilgisi silinemedi: " + e.message);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SiteContext.Provider value={{ 
        products, 
        categories, 
        siteSettings,
        designers,
        mediaCategories,
        contacts,
        isLoading, 
        error,
        refreshData: fetchData, 
        updateProduct,
        updateCategory,
        addCategory,
        deleteCategory,
        addProduct,
        deleteProduct,
        addDesigner,
        updateDesigner,
        deleteDesigner,
        uploadFile,
        updateSiteSetting,
        updateContact,
        addContact,
        deleteContact
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSiteData must be used within a SiteProvider');
  }
  return context;
};