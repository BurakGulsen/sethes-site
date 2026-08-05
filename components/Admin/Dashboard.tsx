import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Layers, Box, FileText, Pencil, X, Upload, FileDown, Share2, Users, Folder, MapPin, Palette } from 'lucide-react';
import { useSiteData } from '../../context/SiteContext';
import { Product, Category, Designer } from '../../types';
import { AdminMedia } from './AdminMedia';
import { AdminContacts } from './AdminContacts';
import { AdminMaterials } from './AdminMaterials';
import { RichTextEditor } from './RichTextEditor';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    categories, 
    products, 
    siteSettings,
    designers,
    addCategory, 
    updateCategory, 
    deleteCategory, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    addDesigner,
    updateDesigner,
    deleteDesigner,
    uploadFile,
    uploadPrivateFile,
    updateSiteSetting
  } = useSiteData();
  
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'CATEGORIES' | 'SETTINGS' | 'DESIGNERS' | 'MEDIA' | 'MATERIALS' | 'CONTACTS'>('PRODUCTS');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Settings State
  const [heroVideoFile, setHeroVideoFile] = useState<File | null>(null);
  const heroVideoInputRef = useRef<HTMLInputElement>(null);
  const [heroMediaType, setHeroMediaType] = useState<'video' | 'image'>('video');

  // Logo State
  const [logoType, setLogoType] = useState<'text' | 'image'>('text');
  const [logoImageFile, setLogoImageFile] = useState<File | null>(null);
  const logoImageInputRef = useRef<HTMLInputElement>(null);

  // Load logo settings
  React.useEffect(() => {
      const type = siteSettings.find(s => s.key === 'logo_type')?.value;
      if (type === 'image' || type === 'text') {
          setLogoType(type as 'text' | 'image');
      }
  }, [siteSettings]);

  // Load hero media type from settings
  React.useEffect(() => {
      const type = siteSettings.find(s => s.key === 'hero_media_type')?.value;
      if (type === 'image' || type === 'video') {
          setHeroMediaType(type as 'video' | 'image');
      }
  }, [siteSettings]);
  
  // Story Image State
  const [storyImageFile, setStoryImageFile] = useState<File | null>(null);
  const storyImageInputRef = useRef<HTMLInputElement>(null);

  // Bespoke Video State
  const [bespokeVideoFile, setBespokeVideoFile] = useState<File | null>(null);
  const bespokeVideoInputRef = useRef<HTMLInputElement>(null);

  // Social Links State
  const [socialLinks, setSocialLinks] = useState<{platform: string, url: string}[]>([]);
  const [newSocial, setNewSocial] = useState({ platform: 'Instagram', url: '' });

  // Legal Pages State (Terms & Conditions / Privacy Policy content)
  const [termsContent, setTermsContent] = useState('');
  const [termsContentTr, setTermsContentTr] = useState('');
  const [privacyContent, setPrivacyContent] = useState('');
  const [privacyContentTr, setPrivacyContentTr] = useState('');
  const [legalLoaded, setLegalLoaded] = useState(false);
  const [savingLegal, setSavingLegal] = useState(false);

  React.useEffect(() => {
      if (!legalLoaded && siteSettings.length > 0) {
          setTermsContent(siteSettings.find(s => s.key === 'legal_terms_content')?.value || '');
          setTermsContentTr(siteSettings.find(s => s.key === 'legal_terms_content_tr')?.value || '');
          setPrivacyContent(siteSettings.find(s => s.key === 'legal_privacy_content')?.value || '');
          setPrivacyContentTr(siteSettings.find(s => s.key === 'legal_privacy_content_tr')?.value || '');
          setLegalLoaded(true);
      }
  }, [siteSettings, legalLoaded]);

  const saveLegalContent = async () => {
      setSavingLegal(true);
      await Promise.all([
          updateSiteSetting('legal_terms_content', termsContent),
          updateSiteSetting('legal_terms_content_tr', termsContentTr),
          updateSiteSetting('legal_privacy_content', privacyContent),
          updateSiteSetting('legal_privacy_content_tr', privacyContentTr),
      ]);
      setSavingLegal(false);
  };

  // Load social links from settings
  React.useEffect(() => {
      const setting = siteSettings.find(s => s.key === 'social_links');
      if (setting) {
          try {
              setSocialLinks(JSON.parse(setting.value));
          } catch (e) {
              setSocialLinks([]);
          }
      }
  }, [siteSettings]);

  // Category Form State
  const [catForm, setCatForm] = useState({ name: '', image: '', description: '', name_tr: '', description_tr: '' });
  const [catImageFile, setCatImageFile] = useState<File | null>(null);

  // Product Form State
  const [prodForm, setProdForm] = useState({
      category_id: '',
      name: '',
      image: '',
      detail_image: '',
      description: '',
      designer: '',
      // New PDF fields
      pdf_sheet: '',
      pdf_images: '',
      pdf_technical: '',
      dimensions: '',
      details: '',
      lightSource: '', // Form input uses camelCase for React state
      more_info: '',
      // Turkish counterparts
      name_tr: '',
      description_tr: '',
      dimensions_tr: '',
      details_tr: '',
      lightSource_tr: '',
      more_info_tr: ''
  });

  // Designer Form State
  const [desForm, setDesForm] = useState({
      name: '',
      role: '',
      bio: '',
      collections: '',
      quote: '',
      image_url: '',
      role_tr: '',
      bio_tr: '',
      collections_tr: '',
      quote_tr: ''
  });
  const [desImageFile, setDesImageFile] = useState<File | null>(null);
  
  // File states
  const [prodImageFile, setProdImageFile] = useState<File | null>(null);
  const [prodDetailImageFile, setProdDetailImageFile] = useState<File | null>(null);
  const [fileSheet, setFileSheet] = useState<File | null>(null);
  const [fileImages, setFileImages] = useState<File | null>(null);
  const [fileTech, setFileTech] = useState<File | null>(null);

  // Refs to clear file inputs visually
  const catImageInputRef = useRef<HTMLInputElement>(null);
  const prodImageInputRef = useRef<HTMLInputElement>(null);
  const prodDetailImageInputRef = useRef<HTMLInputElement>(null);
  const fileSheetRef = useRef<HTMLInputElement>(null);
  const fileImagesRef = useRef<HTMLInputElement>(null);
  const fileTechRef = useRef<HTMLInputElement>(null);
  const desImageInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const resetForms = () => {
    setEditingId(null);
    
    // Reset Category Form
    setCatForm({ name: '', image: '', description: '', name_tr: '', description_tr: '' });
    setCatImageFile(null);
    if (catImageInputRef.current) catImageInputRef.current.value = '';

    // Reset Product Form
    setProdForm({
        category_id: '', name: '', image: '', detail_image: '', description: '',
        designer: '', pdf_sheet: '', pdf_images: '', pdf_technical: '',
        dimensions: '', details: '', lightSource: '', more_info: '',
        name_tr: '', description_tr: '', dimensions_tr: '', details_tr: '', lightSource_tr: '', more_info_tr: ''
    });
    setProdImageFile(null);
    setProdDetailImageFile(null);
    setFileSheet(null);
    setFileImages(null);
    setFileTech(null);

    if (prodImageInputRef.current) prodImageInputRef.current.value = '';
    if (prodDetailImageInputRef.current) prodDetailImageInputRef.current.value = '';
    if (fileSheetRef.current) fileSheetRef.current.value = '';
    if (fileImagesRef.current) fileImagesRef.current.value = '';
    if (fileTechRef.current) fileTechRef.current.value = '';

    // Reset Designer Form
    setDesForm({ name: '', role: '', bio: '', collections: '', quote: '', image_url: '', role_tr: '', bio_tr: '', collections_tr: '', quote_tr: '' });
    setDesImageFile(null);
    if (desImageInputRef.current) desImageInputRef.current.value = '';
  };

  const handleEditClick = (item: Product | Category | Designer, type: 'PRODUCT' | 'CATEGORY' | 'DESIGNER') => {
    setEditingId(item.id);
    if (type === 'CATEGORY') {
        const cat = item as Category;
        setCatForm({
            name: cat.name,
            image: cat.image,
            description: cat.description || '',
            name_tr: cat.name_tr || '',
            description_tr: cat.description_tr || ''
        });
        setActiveTab('CATEGORIES');
    } else if (type === 'DESIGNER') {
        const des = item as Designer;
        setDesForm({
            name: des.name,
            role: des.role,
            bio: des.bio,
            collections: des.collections,
            quote: des.quote,
            image_url: des.image_url,
            role_tr: des.role_tr || '',
            bio_tr: des.bio_tr || '',
            collections_tr: des.collections_tr || '',
            quote_tr: des.quote_tr || ''
        });
        setActiveTab('DESIGNERS');
    } else {
        const prod = item as Product;
        setProdForm({
            category_id: prod.category_id || '',
            name: prod.name,
            image: prod.image,
            detail_image: prod.detail_image || '',
            description: prod.description,
            designer: prod.designer || '',
            pdf_sheet: prod.pdf_sheet || '',
            pdf_images: prod.pdf_images || '',
            pdf_technical: prod.pdf_technical || '',
            dimensions: prod.dimensions?.join(', ') || '',
            details: prod.details?.join(', ') || '',
            lightSource: prod.lightSource?.join(', ') || '',
            more_info: prod.more_info || '',
            name_tr: prod.name_tr || '',
            description_tr: prod.description_tr || '',
            dimensions_tr: prod.dimensions_tr?.join(', ') || '',
            details_tr: prod.details_tr?.join(', ') || '',
            lightSource_tr: prod.lightSource_tr?.join(', ') || '',
            more_info_tr: prod.more_info_tr || ''
        });
        setActiveTab('PRODUCTS');
    }
  };

  const submitCategory = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsUploading(true);

      let imageUrl = catForm.image;
      if (catImageFile) {
          const uploadedUrl = await uploadFile(catImageFile, 'categories');
          if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const categoryData = { ...catForm, image: imageUrl };

      if (editingId) {
          await updateCategory(editingId, categoryData);
      } else {
          await addCategory(categoryData);
      }
      setIsUploading(false);
      resetForms();
  };

  const submitDesigner = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsUploading(true);

      let imageUrl = desForm.image_url;
      if (desImageFile) {
          const uploadedUrl = await uploadFile(desImageFile, 'site-assets');
          if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const designerData = { ...desForm, image_url: imageUrl };

      if (editingId) {
          await updateDesigner(editingId, designerData);
      } else {
          await addDesigner(designerData);
      }
      setIsUploading(false);
      resetForms();
  };

  const submitProduct = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsUploading(true);
      
      // Find category name for fallback
      const selectedCat = categories.find(c => c.id === prodForm.category_id);
      
      let imageUrl = prodForm.image;
      if (prodImageFile) {
          const url = await uploadFile(prodImageFile, 'products');
          if (!url) {
              // uploadFile already alerted with the reason (e.g. file too large).
              // Stop here instead of saving the product with a blank/stale image.
              setIsUploading(false);
              return;
          }
          imageUrl = url;
      }

      let detailImageUrl = prodForm.detail_image;
      if (prodDetailImageFile) {
          const url = await uploadFile(prodDetailImageFile, 'products');
          if (!url) {
              setIsUploading(false);
              return;
          }
          detailImageUrl = url;
      } else if (!detailImageUrl) {
          // No detail image has ever been set for this product. Freeze it to
          // whatever the grid image was BEFORE this save (prodForm.image, not
          // the new imageUrl) so that updating the grid image alone doesn't
          // silently change the detail page too. For a brand-new product
          // prodForm.image is empty, so it falls back to the freshly
          // uploaded imageUrl instead.
          detailImageUrl = prodForm.image || imageUrl;
      }

      // Handle 3 PDF uploads
      // 1. Sheet
      let urlSheet = prodForm.pdf_sheet;
      if (fileSheet) {
          const url = await uploadFile(fileSheet, 'docs');
          if (url) urlSheet = url;
      }

      // 2. Images
      let urlImages = prodForm.pdf_images;
      if (fileImages) {
          const url = await uploadFile(fileImages, 'docs');
          if (url) urlImages = url;
      }

      // 3. Technical (2D/3D — private bucket, login required to download)
      let urlTech = prodForm.pdf_technical;
      if (fileTech) {
          const url = await uploadPrivateFile(fileTech, 'technical');
          if (url) urlTech = url;
      }

      // Construct Data Payload
      // Using 'as any' to bypass the Product type strictness temporarily to pass 'light_source' directly
      const productData: any = {
          category_id: prodForm.category_id,
          category: selectedCat ? selectedCat.name : 'General',
          name: prodForm.name,
          image: imageUrl,
          detail_image: detailImageUrl,
          description: prodForm.description,
          designer: prodForm.designer,
          
          // Mapped PDF Fields
          pdf_sheet: urlSheet,
          pdf_images: urlImages,
          pdf_technical: urlTech,
          
          dimensions: prodForm.dimensions.split(',').map(s => s.trim()).filter(s => s),
          details: prodForm.details.split(',').map(s => s.trim()).filter(s => s),

          // DIRECT DB MAPPING: light_source
          light_source: prodForm.lightSource.split(',').map(s => s.trim()).filter(s => s),

          notes: [],
          more_info: prodForm.more_info,

          // Turkish counterparts
          name_tr: prodForm.name_tr,
          description_tr: prodForm.description_tr,
          dimensions_tr: prodForm.dimensions_tr.split(',').map(s => s.trim()).filter(s => s),
          details_tr: prodForm.details_tr.split(',').map(s => s.trim()).filter(s => s),
          light_source_tr: prodForm.lightSource_tr.split(',').map(s => s.trim()).filter(s => s),
          more_info_tr: prodForm.more_info_tr
      };

      if (editingId) {
          await updateProduct(editingId, productData);
      } else {
          await addProduct(productData);
      }
      setIsUploading(false);
      resetForms();
  };

  return (
    <div className="min-h-screen bg-[#101010] text-stone-300 font-sans pb-20">
      {/* Admin Header */}
      <header className="border-b border-stone-800 bg-[#050505] px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-condensed text-xl tracking-widest text-white">SETHES <span className="text-stone-600">ADMIN</span></div>
        <div className="flex items-center gap-6">
            <span className="text-xs text-stone-500 uppercase">CMS Panosu</span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-xs uppercase tracking-wider hover:text-white transition-colors">
                <LogOut size={14} /> Çıkış
            </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto mt-12 px-4">
          {/* Tabs */}
          <div className="flex gap-8 mb-12 border-b border-stone-800 pb-1">
              <button 
                onClick={() => { setActiveTab('PRODUCTS'); resetForms(); }}
                className={`pb-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${activeTab === 'PRODUCTS' ? 'text-white border-b-2 border-white' : 'text-stone-600 hover:text-stone-400'}`}
              >
                  <Box size={16} /> Ürünler
              </button>
              <button
                onClick={() => { setActiveTab('CATEGORIES'); resetForms(); }}
                className={`pb-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${activeTab === 'CATEGORIES' ? 'text-white border-b-2 border-white' : 'text-stone-600 hover:text-stone-400'}`}
              >
                  <Layers size={16} /> Kategoriler
              </button>
              <button
                onClick={() => { setActiveTab('DESIGNERS'); resetForms(); }}
                className={`pb-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${activeTab === 'DESIGNERS' ? 'text-white border-b-2 border-white' : 'text-stone-600 hover:text-stone-400'}`}
              >
                  <Users size={16} /> Tasarımcılar
              </button>
              <button
                onClick={() => { setActiveTab('MEDIA'); resetForms(); }}
                className={`pb-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${activeTab === 'MEDIA' ? 'text-white border-b-2 border-white' : 'text-stone-600 hover:text-stone-400'}`}
              >
                  <Folder size={16} /> Medya
              </button>
              <button
                onClick={() => { setActiveTab('MATERIALS'); resetForms(); }}
                className={`pb-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${activeTab === 'MATERIALS' ? 'text-white border-b-2 border-white' : 'text-stone-600 hover:text-stone-400'}`}
              >
                  <Palette size={16} /> Materyaller
              </button>
              <button
                onClick={() => { setActiveTab('CONTACTS'); resetForms(); }}
                className={`pb-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${activeTab === 'CONTACTS' ? 'text-white border-b-2 border-white' : 'text-stone-600 hover:text-stone-400'}`}
              >
                  <MapPin size={16} /> İletişim
              </button>
              <button
                onClick={() => { setActiveTab('SETTINGS'); resetForms(); }}
                className={`pb-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${activeTab === 'SETTINGS' ? 'text-white border-b-2 border-white' : 'text-stone-600 hover:text-stone-400'}`}
              >
                  <Box size={16} /> Site Ayarları
              </button>
          </div>

          {/* CONTENT AREA */}
          {activeTab === 'MEDIA' ? (
              <AdminMedia />
          ) : activeTab === 'MATERIALS' ? (
              <AdminMaterials />
          ) : activeTab === 'CONTACTS' ? (
              <AdminContacts />
          ) : activeTab === 'SETTINGS' ? (
              <div className="max-w-2xl">
                  <h3 className="text-white font-condensed text-xl uppercase mb-6 flex items-center gap-2">
                      <Box size={18} /> Genel Site Ayarları
                  </h3>
                  
                  <div className="bg-[#151515] p-8 border border-stone-800 rounded-sm space-y-8">
                      {/* Hero Media Section */}
                      {/* Logo Management Section */}
                      <div className="border-b border-stone-800 pb-8 mb-8">
                          <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Logo Yönetimi</h4>
                          <p className="text-stone-500 text-xs mb-4">Metin logosu veya görsel logo arasında seçim yapın.</p>
                          
                          <div className="flex flex-col gap-4">
                              {/* Logo Type Selector */}
                              <div className="flex gap-6 mb-2 border-b border-stone-800 pb-4">
                                  <label className="flex items-center gap-2 cursor-pointer group">
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${logoType === 'text' ? 'border-white' : 'border-stone-600 group-hover:border-stone-400'}`}>
                                          {logoType === 'text' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                      </div>
                                      <input 
                                          type="radio" 
                                          name="logoType" 
                                          value="text" 
                                          checked={logoType === 'text'} 
                                          onChange={() => {
                                              setLogoType('text');
                                              updateSiteSetting('logo_type', 'text');
                                          }}
                                          className="hidden"
                                      />
                                      <span className={`text-sm font-bold uppercase tracking-wider ${logoType === 'text' ? 'text-white' : 'text-stone-500 group-hover:text-stone-300'}`}>Metin Logo</span>
                                  </label>
                                  <label className="flex items-center gap-2 cursor-pointer group">
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${logoType === 'image' ? 'border-white' : 'border-stone-600 group-hover:border-stone-400'}`}>
                                          {logoType === 'image' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                      </div>
                                      <input 
                                          type="radio" 
                                          name="logoType" 
                                          value="image" 
                                          checked={logoType === 'image'} 
                                          onChange={() => {
                                              setLogoType('image');
                                              updateSiteSetting('logo_type', 'image');
                                          }}
                                          className="hidden"
                                      />
                                      <span className={`text-sm font-bold uppercase tracking-wider ${logoType === 'image' ? 'text-white' : 'text-stone-500 group-hover:text-stone-300'}`}>Görsel Logo</span>
                                  </label>
                              </div>

                              {logoType === 'text' ? (
                                  <div>
                                      <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Logo Metni</label>
                                      <div className="flex gap-2">
                                          <input 
                                              type="text" 
                                              defaultValue={siteSettings.find(s => s.key === 'logo_text')?.value || 'SETHES'}
                                              onBlur={(e) => updateSiteSetting('logo_text', e.target.value)}
                                              className="bg-black border border-stone-800 text-white p-3 w-full text-sm focus:border-white outline-none transition-colors"
                                              onMouseDown={(e) => e.stopPropagation()}
                                          />
                                      </div>
                                  </div>
                              ) : (
                                  <div>
                                      <div className="bg-black p-4 border border-stone-800 mb-4">
                                          <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Mevcut Logo Görseli</label>
                                          {siteSettings.find(s => s.key === 'logo_image_url')?.value ? (
                                              <img src={siteSettings.find(s => s.key === 'logo_image_url')?.value} alt="Mevcut Logo" className="h-12 object-contain bg-stone-900/50 p-2" />
                                          ) : (
                                              <div className="text-stone-500 text-xs italic">Yüklenmiş görsel yok</div>
                                          )}
                                      </div>

                                      <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Yeni Logo Yükle (PNG/SVG Önerilir)</label>
                                      <input 
                                          type="file" 
                                          ref={logoImageInputRef}
                                          accept="image/png,image/jpeg,image/svg+xml,image/webp"
                                          onMouseDown={(e) => e.stopPropagation()}
                                          onChange={e => e.target.files && setLogoImageFile(e.target.files[0])}
                                          className="w-full text-xs text-stone-400 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-xs file:bg-stone-800 file:text-white hover:file:bg-stone-700 cursor-pointer border border-stone-800 bg-black"
                                      />
                                      
                                      {logoImageFile && (
                                          <div className="mt-2 bg-stone-900/50 p-4 border border-stone-800">
                                              <p className="text-[10px] uppercase font-bold text-stone-500 mb-2">Önizleme:</p>
                                              <img src={URL.createObjectURL(logoImageFile)} className="h-16 object-contain border border-stone-700 bg-stone-800/50" alt="Preview" />
                                          </div>
                                      )}

                                      <button 
                                          disabled={!logoImageFile || isUploading}
                                          onClick={async () => {
                                              if (!logoImageFile) return;
                                              setIsUploading(true);
                                              const url = await uploadFile(logoImageFile, 'site-assets');
                                              if (url) {
                                                  await updateSiteSetting('logo_image_url', url);
                                                  await updateSiteSetting('logo_type', 'image');
                                                  setLogoImageFile(null);
                                                  if (logoImageInputRef.current) logoImageInputRef.current.value = '';
                                                  alert('Logo başarıyla güncellendi!');
                                              }
                                              setIsUploading(false);
                                          }}
                                          className="bg-white text-black font-bold uppercase py-3 text-xs tracking-widest hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 w-full"
                                      >
                                          {isUploading ? 'Yükleniyor...' : 'Yükle ve Logoyu Güncelle'}
                                      </button>
                                  </div>
                              )}
                          </div>
                      </div>

                      <div>
                          <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Ana Sayfa Öne Çıkan Medya</h4>
                          <p className="text-stone-500 text-xs mb-4">Ana sayfa arkaplanı için video veya görsel arasında seçim yapın.</p>
                          
                          <div className="flex flex-col gap-4">
                              {/* Media Type Selector */}
                              <div className="flex gap-6 mb-2 border-b border-stone-800 pb-4">
                                  <label className="flex items-center gap-2 cursor-pointer group">
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${heroMediaType === 'video' ? 'border-white' : 'border-stone-600 group-hover:border-stone-400'}`}>
                                          {heroMediaType === 'video' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                      </div>
                                      <input 
                                          type="radio" 
                                          name="heroMediaType" 
                                          value="video" 
                                          checked={heroMediaType === 'video'} 
                                          onChange={() => {
                                              setHeroMediaType('video');
                                              updateSiteSetting('hero_media_type', 'video');
                                          }}
                                          className="hidden"
                                      />
                                      <span className={`text-sm font-bold uppercase tracking-wider ${heroMediaType === 'video' ? 'text-white' : 'text-stone-500 group-hover:text-stone-300'}`}>Video Modu</span>
                                  </label>
                                  <label className="flex items-center gap-2 cursor-pointer group">
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${heroMediaType === 'image' ? 'border-white' : 'border-stone-600 group-hover:border-stone-400'}`}>
                                          {heroMediaType === 'image' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                      </div>
                                      <input 
                                          type="radio" 
                                          name="heroMediaType" 
                                          value="image" 
                                          checked={heroMediaType === 'image'} 
                                          onChange={() => {
                                              setHeroMediaType('image');
                                              updateSiteSetting('hero_media_type', 'image');
                                          }}
                                          className="hidden"
                                      />
                                      <span className={`text-sm font-bold uppercase tracking-wider ${heroMediaType === 'image' ? 'text-white' : 'text-stone-500 group-hover:text-stone-300'}`}>Görsel Modu</span>
                                  </label>
                              </div>

                              <div className="bg-black p-4 border border-stone-800">
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Mevcut Medya URL'si</label>
                                  <div className="text-stone-300 text-xs break-all font-mono">
                                      {siteSettings?.find(s => s.key === 'hero_media_url')?.value || siteSettings?.find(s => s.key === 'hero_video_url')?.value || 'Ayarlanmadı'}
                                  </div>
                              </div>

                              <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Yeni {heroMediaType === 'video' ? 'Video (MP4)' : 'Görsel (JPG/PNG)'} Yükle</label>
                                  <input 
                                    type="file" 
                                    ref={heroVideoInputRef}
                                    accept={heroMediaType === 'video' ? "video/mp4,video/webm" : "image/png,image/jpeg,image/webp"}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onChange={e => e.target.files && setHeroVideoFile(e.target.files[0])}
                                    className="w-full text-xs text-stone-400 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-xs file:bg-stone-800 file:text-white hover:file:bg-stone-700 cursor-pointer border border-stone-800 bg-black"
                                  />
                              </div>

                              {/* Preview */}
                              {heroVideoFile && (
                                  <div className="mt-2 bg-stone-900/50 p-4 border border-stone-800">
                                      <p className="text-[10px] uppercase font-bold text-stone-500 mb-2">Önizleme:</p>
                                      {heroMediaType === 'video' ? (
                                          // eslint-disable-next-line jsx-a11y/media-has-caption
                                          <video src={URL.createObjectURL(heroVideoFile)} className="w-full max-h-48 object-cover border border-stone-700" controls />
                                      ) : (
                                          <img src={URL.createObjectURL(heroVideoFile)} className="w-full max-h-48 object-cover border border-stone-700" alt="Preview" />
                                      )}
                                  </div>
                              )}

                              <button 
                                disabled={!heroVideoFile || isUploading}
                                onClick={async () => {
                                    if (!heroVideoFile) return;
                                    setIsUploading(true);
                                    const url = await uploadFile(heroVideoFile, 'site-assets');
                                    if (url) {
                                        await updateSiteSetting('hero_media_url', url);
                                        // Ensure type is saved as well
                                        await updateSiteSetting('hero_media_type', heroMediaType);
                                        
                                        setHeroVideoFile(null);
                                        if (heroVideoInputRef.current) heroVideoInputRef.current.value = '';
                                        alert(`${heroMediaType === 'video' ? 'Video' : 'Görsel'} başarıyla güncellendi!`);
                                    }
                                    setIsUploading(false);
                                }}
                                className="bg-white text-black font-bold uppercase py-3 text-xs tracking-widest hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                              >
                                  {isUploading ? 'Yükleniyor ve Güncelleniyor...' : `Yükle ve ${heroMediaType === 'video' ? 'Videoyu' : 'Görseli'} Güncelle`}
                              </button>
                          </div>
                      </div>

                      {/* Hero Text Section */}
                      <div className="border-t border-stone-800 pt-8">
                          <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Ana Sayfa Öne Çıkan Metin</h4>
                          <p className="text-stone-500 text-xs mb-4">Ana sayfanın öne çıkan bölümünde gösterilen ana başlığı ve alt başlığı güncelleyin.</p>

                          <div className="space-y-4">
                              <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Ana Başlık</label>
                                  <div className="flex gap-2">
                                      <input
                                        className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none select-text cursor-text"
                                        defaultValue={siteSettings?.find(s => s.key === 'hero_title')?.value || ''}
                                        placeholder="örn. S34/4 COLLECTION"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onBlur={(e) => updateSiteSetting('hero_title', e.target.value)}
                                      />
                                  </div>
                              </div>

                              <div>
                                  <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Ana Başlık (Türkçe)</label>
                                  <div className="flex gap-2">
                                      <input
                                        className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none select-text cursor-text"
                                        defaultValue={siteSettings?.find(s => s.key === 'hero_title_tr')?.value || ''}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onBlur={(e) => updateSiteSetting('hero_title_tr', e.target.value)}
                                      />
                                  </div>
                              </div>

                              <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Alt Başlık</label>
                                  <div className="flex gap-2">
                                      <input
                                        className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none select-text cursor-text"
                                        defaultValue={siteSettings?.find(s => s.key === 'hero_subtitle')?.value || ''}
                                        placeholder="örn. UNWRITTEN STREETS"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onBlur={(e) => updateSiteSetting('hero_subtitle', e.target.value)}
                                      />
                                  </div>
                              </div>

                              <div>
                                  <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Alt Başlık (Türkçe)</label>
                                  <div className="flex gap-2">
                                      <input
                                        className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none select-text cursor-text"
                                        defaultValue={siteSettings?.find(s => s.key === 'hero_subtitle_tr')?.value || ''}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onBlur={(e) => updateSiteSetting('hero_subtitle_tr', e.target.value)}
                                      />
                                  </div>
                              </div>

                              <div className="border-t border-stone-800 pt-4 mt-4">
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Koleksiyonlar Bölümü Başlığı</label>
                                  <div className="flex gap-2">
                                      <input
                                        className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none select-text cursor-text"
                                        defaultValue={siteSettings?.find(s => s.key === 'collections_title')?.value || 'COLLECTIONS'}
                                        placeholder="örn. COLLECTIONS"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onBlur={(e) => updateSiteSetting('collections_title', e.target.value)}
                                      />
                                  </div>
                              </div>

                              <div>
                                  <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Koleksiyonlar Bölümü Başlığı (Türkçe)</label>
                                  <div className="flex gap-2">
                                      <input
                                        className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none select-text cursor-text"
                                        defaultValue={siteSettings?.find(s => s.key === 'collections_title_tr')?.value || ''}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onBlur={(e) => updateSiteSetting('collections_title_tr', e.target.value)}
                                      />
                                  </div>
                              </div>

                              <div className="border-t border-stone-800 pt-8 mt-4">
                                  <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Hikaye Bölümü</h4>
                                  <p className="text-stone-500 text-xs mb-4">Hikaye/amiral gemisi bölümünün başlığını ve açıklamasını güncelleyin.</p>

                                  <div className="space-y-4">
                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Hikaye Başlığı</label>
                                          <input
                                            className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none select-text cursor-text"
                                            defaultValue={siteSettings?.find(s => s.key === 'story_title')?.value || 'THE SETHES STORY'}
                                            placeholder="örn. THE SETHES STORY"
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => updateSiteSetting('story_title', e.target.value)}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Hikaye Başlığı (Türkçe)</label>
                                          <input
                                            className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none select-text cursor-text"
                                            defaultValue={siteSettings?.find(s => s.key === 'story_title_tr')?.value || ''}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => updateSiteSetting('story_title_tr', e.target.value)}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Hikaye Açıklaması</label>
                                          <textarea
                                            className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-32 select-text cursor-text"
                                            defaultValue={siteSettings?.find(s => s.key === 'story_description')?.value || ''}
                                            placeholder="Hikaye açıklamasını girin..."
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => updateSiteSetting('story_description', e.target.value)}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Hikaye Açıklaması (Türkçe)</label>
                                          <textarea
                                            className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-32 select-text cursor-text"
                                            defaultValue={siteSettings?.find(s => s.key === 'story_description_tr')?.value || ''}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => updateSiteSetting('story_description_tr', e.target.value)}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Hikaye Görseli (Yükle)</label>
                                          <div className="flex flex-col gap-2">
                                              <input
                                                type="file"
                                                ref={storyImageInputRef}
                                                accept="image/png, image/jpeg, image/webp"
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onChange={e => e.target.files && setStoryImageFile(e.target.files[0])}
                                                className="w-full text-xs text-stone-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:bg-stone-800 file:text-white hover:file:bg-stone-700 cursor-pointer border border-stone-800 bg-black"
                                              />

                                              <div className="bg-black p-4 border border-stone-800">
                                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Mevcut Görsel URL'si</label>
                                                  <div className="text-stone-300 text-xs break-all font-mono">
                                                      {siteSettings?.find(s => s.key === 'story_image_url')?.value || 'Varsayılan Görsel'}
                                                  </div>
                                              </div>

                                              <button
                                                disabled={!storyImageFile || isUploading}
                                                onClick={async () => {
                                                    if (!storyImageFile) return;
                                                    setIsUploading(true);
                                                    const url = await uploadFile(storyImageFile, 'site-assets');
                                                    if (url) {
                                                        await updateSiteSetting('story_image_url', url);
                                                        setStoryImageFile(null);
                                                        if (storyImageInputRef.current) storyImageInputRef.current.value = '';
                                                        alert('Hikaye görseli başarıyla güncellendi!');
                                                    }
                                                    setIsUploading(false);
                                                }}
                                                className="bg-white text-black font-bold uppercase py-3 text-xs tracking-widest hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                              >
                                                  {isUploading ? 'Yükleniyor...' : 'Yükle ve Görseli Güncelle'}
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div className="border-t border-stone-800 pt-8 mt-4">
                                  <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Özel Tasarım Projeleri Bölümü</h4>
                                  <p className="text-stone-500 text-xs mb-4">Özel Tasarım Projeleri bölümünün videosunu ve metnini güncelleyin.</p>

                                  <div className="space-y-4">
                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Bölüm Başlığı</label>
                                          <input
                                            className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none select-text cursor-text"
                                            defaultValue={siteSettings?.find(s => s.key === 'bespoke_title')?.value || 'BESPOKE PROJECTS'}
                                            placeholder="örn. BESPOKE PROJECTS"
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => updateSiteSetting('bespoke_title', e.target.value)}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Bölüm Başlığı (Türkçe)</label>
                                          <input
                                            className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none select-text cursor-text"
                                            defaultValue={siteSettings?.find(s => s.key === 'bespoke_title_tr')?.value || ''}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => updateSiteSetting('bespoke_title_tr', e.target.value)}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Alt Başlık / Açıklama</label>
                                          <textarea
                                            className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-24 select-text cursor-text"
                                            defaultValue={siteSettings?.find(s => s.key === 'bespoke_subtitle')?.value || 'Signature stone washbasins and integrated water systems.'}
                                            placeholder="Alt başlığı girin..."
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => updateSiteSetting('bespoke_subtitle', e.target.value)}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Alt Başlık / Açıklama (Türkçe)</label>
                                          <textarea
                                            className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-24 select-text cursor-text"
                                            defaultValue={siteSettings?.find(s => s.key === 'bespoke_subtitle_tr')?.value || ''}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => updateSiteSetting('bespoke_subtitle_tr', e.target.value)}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Arkaplan Videosu (Yükle)</label>
                                          <div className="flex flex-col gap-2">
                                              <input
                                                type="file"
                                                ref={bespokeVideoInputRef}
                                                accept="video/mp4,video/webm"
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onChange={e => e.target.files && setBespokeVideoFile(e.target.files[0])}
                                                className="w-full text-xs text-stone-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:bg-stone-800 file:text-white hover:file:bg-stone-700 cursor-pointer border border-stone-800 bg-black"
                                              />

                                              <div className="bg-black p-4 border border-stone-800">
                                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Mevcut Video URL'si</label>
                                                  <div className="text-stone-300 text-xs break-all font-mono">
                                                      {siteSettings?.find(s => s.key === 'bespoke_video_url')?.value || 'Varsayılan Video'}
                                                  </div>
                                              </div>

                                              <button 
                                                disabled={!bespokeVideoFile || isUploading}
                                                onClick={async () => {
                                                    if (!bespokeVideoFile) return;
                                                    setIsUploading(true);
                                                    const url = await uploadFile(bespokeVideoFile, 'site-assets');
                                                    if (url) {
                                                        await updateSiteSetting('bespoke_video_url', url);
                                                        setBespokeVideoFile(null);
                                                        if (bespokeVideoInputRef.current) bespokeVideoInputRef.current.value = '';
                                                        alert('Özel tasarım videosu başarıyla güncellendi!');
                                                    }
                                                    setIsUploading(false);
                                                }}
                                                className="bg-white text-black font-bold uppercase py-3 text-xs tracking-widest hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                              >
                                                  {isUploading ? 'Yükleniyor...' : 'Yükle ve Videoyu Güncelle'}
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <p className="text-[10px] text-stone-500 italic">* Değişiklikler, giriş alanının dışına tıkladığınızda otomatik olarak kaydedilir.</p>
                          </div>

                          <div className="border-t border-stone-800 pt-8 mt-4">
                                  <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Alt Bilgi (Footer) Ayarları</h4>
                                  <p className="text-stone-500 text-xs mb-4">Alt bilgi metnini güncelleyin ve sosyal medya bağlantılarını yönetin.</p>

                                  <div className="space-y-4">
                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Alt Bilgi Başlığı</label>
                                          <input
                                            className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none select-text cursor-text"
                                            defaultValue={siteSettings?.find(s => s.key === 'footer_title')?.value || 'SETHES ATELIER'}
                                            placeholder="örn. SETHES ATELIER"
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => updateSiteSetting('footer_title', e.target.value)}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Alt Bilgi Başlığı (Türkçe)</label>
                                          <input
                                            className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none select-text cursor-text"
                                            defaultValue={siteSettings?.find(s => s.key === 'footer_title_tr')?.value || ''}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => updateSiteSetting('footer_title_tr', e.target.value)}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Alt Bilgi Alt Başlığı</label>
                                          <textarea
                                            className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-20 select-text cursor-text"
                                            defaultValue={siteSettings?.find(s => s.key === 'footer_subtitle')?.value || 'An homage to purity, material, and form.'}
                                            placeholder="Alt bilgi alt başlığını girin..."
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => updateSiteSetting('footer_subtitle', e.target.value)}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Alt Bilgi Alt Başlığı (Türkçe)</label>
                                          <textarea
                                            className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-20 select-text cursor-text"
                                            defaultValue={siteSettings?.find(s => s.key === 'footer_subtitle_tr')?.value || ''}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => updateSiteSetting('footer_subtitle_tr', e.target.value)}
                                          />
                                      </div>

                                      <div className="border-t border-stone-800 pt-4 mt-2">
                                          <label className="text-[10px] uppercase font-bold text-stone-500 block mb-4 flex items-center gap-2">
                                              <Share2 size={12} /> Sosyal Medya Bağlantıları
                                          </label>

                                          {/* List existing links */}
                                          <div className="space-y-2 mb-4">
                                              {socialLinks.map((link, idx) => (
                                                  <div key={idx} className="flex items-center gap-2 bg-black border border-stone-800 p-2">
                                                      <span className="text-xs font-bold text-white w-24">{link.platform}</span>
                                                      <span className="text-xs text-stone-500 truncate flex-1">{link.url}</span>
                                                      <button
                                                          onClick={() => {
                                                              const updated = socialLinks.filter((_, i) => i !== idx);
                                                              setSocialLinks(updated);
                                                              updateSiteSetting('social_links', JSON.stringify(updated));
                                                          }}
                                                          className="text-stone-500 hover:text-red-500 transition-colors"
                                                      >
                                                          <Trash2 size={14} />
                                                      </button>
                                                  </div>
                                              ))}
                                              {socialLinks.length === 0 && <p className="text-stone-600 text-xs italic">Henüz bağlantı eklenmedi.</p>}
                                          </div>

                                          {/* Add new link */}
                                          <div className="bg-stone-900/30 p-3 border border-stone-800/50">
                                              <p className="text-[10px] font-bold text-stone-400 uppercase mb-2">Yeni Bağlantı Ekle</p>
                                              <div className="grid grid-cols-3 gap-2 mb-2">
                                                  <select 
                                                      className="bg-black border border-stone-700 text-white text-xs p-2 outline-none"
                                                      value={newSocial.platform}
                                                      onMouseDown={(e) => e.stopPropagation()}
                                                      onChange={e => setNewSocial({...newSocial, platform: e.target.value})}
                                                  >
                                                      <option value="Instagram">Instagram</option>
                                                      <option value="LinkedIn">LinkedIn</option>
                                                      <option value="YouTube">YouTube</option>
                                                      <option value="X (Twitter)">X (Twitter)</option>
                                                      <option value="Facebook">Facebook</option>
                                                      <option value="Pinterest">Pinterest</option>
                                                      <option value="Website">Website</option>
                                                  </select>
                                                  <input 
                                                      className="col-span-2 bg-black border border-stone-700 text-white text-xs p-2 outline-none"
                                                      placeholder="https://..."
                                                      value={newSocial.url}
                                                      onMouseDown={(e) => e.stopPropagation()}
                                                      onChange={e => setNewSocial({...newSocial, url: e.target.value})}
                                                  />
                                              </div>
                                              <button 
                                                  onClick={() => {
                                                      if (!newSocial.url) return;
                                                      const updated = [...socialLinks, newSocial];
                                                      setSocialLinks(updated);
                                                      updateSiteSetting('social_links', JSON.stringify(updated));
                                                      setNewSocial({...newSocial, url: ''});
                                                  }}
                                                  className="w-full bg-white text-black text-xs font-bold uppercase py-2 hover:bg-stone-200 transition-colors"
                                              >
                                                  Bağlantı Ekle
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div className="border-t border-stone-800 pt-8 mt-4">
                                  <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Ethos / Felsefe Bölümü</h4>
                                  <p className="text-stone-500 text-xs mb-4">Felsefe sayfasının içeriğini güncelleyin.</p>

                                  <div className="space-y-4">
                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Sayfa Başlığı</label>
                                          <input
                                            className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none select-text cursor-text"
                                            defaultValue={siteSettings?.find(s => s.key === 'ethos_title')?.value || 'THE ETHOS'}
                                            placeholder="örn. THE ETHOS"
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => updateSiteSetting('ethos_title', e.target.value)}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Sayfa Başlığı (Türkçe)</label>
                                          <input
                                            className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none select-text cursor-text"
                                            defaultValue={siteSettings?.find(s => s.key === 'ethos_title_tr')?.value || ''}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => updateSiteSetting('ethos_title_tr', e.target.value)}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Açıklama / İçerik</label>
                                          <textarea
                                            className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-32 select-text cursor-text"
                                            defaultValue={siteSettings?.find(s => s.key === 'ethos_description')?.value || 'Our research leads us to discover new materials and old hands. We travel to find the rarest stones, the most resilient woods, and the metals that tell a story.'}
                                            placeholder="Felsefe içeriğini girin..."
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => updateSiteSetting('ethos_description', e.target.value)}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Açıklama / İçerik (Türkçe)</label>
                                          <textarea
                                            className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-32 select-text cursor-text"
                                            defaultValue={siteSettings?.find(s => s.key === 'ethos_description_tr')?.value || ''}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => updateSiteSetting('ethos_description_tr', e.target.value)}
                                          />
                                      </div>
                                  </div>
                              </div>

                              <div className="border-t border-stone-800 pt-8 mt-4">
                                  <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Tasarımcı Ayarları</h4>
                                  <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        id="grayscale"
                                        className="w-4 h-4"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        defaultChecked={siteSettings?.find(s => s.key === 'designers_grayscale')?.value === 'true'}
                                        onChange={(e) => updateSiteSetting('designers_grayscale', String(e.target.checked))}
                                      />
                                      <label htmlFor="grayscale" className="text-stone-400 text-xs">Tasarımcı Görsellerinde Gri Tonlama Efekti Uygula</label>
                                  </div>
                              </div>

                              <div className="border-t border-stone-800 pt-8 mt-4">
                                  <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Yasal Sayfalar (Şartlar &amp; Gizlilik)</h4>
                                  <p className="text-stone-500 text-xs mb-6">Herkese açık /legal/terms ve /legal/privacy sayfalarında gösterilen içerik. Yasal metniniz hazır olana kadar boş bırakarak yer tutucu uyarıyı göstermeye devam edebilirsiniz.</p>

                                  <div className="space-y-2 mb-6">
                                      <label className="text-[10px] uppercase font-bold text-stone-500 block">Kullanım Şartları</label>
                                      <RichTextEditor value={termsContent} onChange={setTermsContent} />
                                  </div>
                                  <div className="space-y-2 mb-6">
                                      <label className="text-[10px] uppercase font-bold text-yellow-600 block">Kullanım Şartları (Türkçe)</label>
                                      <RichTextEditor value={termsContentTr} onChange={setTermsContentTr} />
                                  </div>
                                  <div className="space-y-2 mb-6">
                                      <label className="text-[10px] uppercase font-bold text-stone-500 block">Gizlilik Politikası / KVKK</label>
                                      <RichTextEditor value={privacyContent} onChange={setPrivacyContent} />
                                  </div>
                                  <div className="space-y-2 mb-6">
                                      <label className="text-[10px] uppercase font-bold text-yellow-600 block">Gizlilik Politikası / KVKK (Türkçe)</label>
                                      <RichTextEditor value={privacyContentTr} onChange={setPrivacyContentTr} />
                                  </div>

                                  <button
                                      onClick={saveLegalContent}
                                      disabled={savingLegal}
                                      className={`bg-white text-black font-bold uppercase py-3 px-8 text-xs tracking-widest hover:bg-stone-200 transition-colors ${savingLegal ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                      {savingLegal ? 'Kaydediliyor...' : 'Yasal Sayfaları Kaydet'}
                                  </button>
                              </div>
                      </div>
                  </div>
              </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* LEFT: FORM */}
              <div className="lg:col-span-1">
                  <div className={`bg-[#151515] p-6 border rounded-sm sticky top-32 transition-colors duration-300 ${editingId ? 'border-yellow-600/50' : 'border-stone-800'}`}>
                      <div className="flex justify-between items-center mb-6">
                          <h3 className={`font-condensed text-xl uppercase flex items-center gap-2 ${editingId ? 'text-yellow-500' : 'text-white'}`}>
                              {editingId ? <Pencil size={18} /> : <Plus size={18} />}
                              {editingId ? 'Düzenle' : 'Yeni Ekle'}: {activeTab === 'PRODUCTS' ? 'Ürün' : (activeTab === 'CATEGORIES' ? 'Kategori' : 'Tasarımcı')}
                          </h3>
                          {editingId && (
                              <button onClick={resetForms} className="text-stone-500 hover:text-white flex items-center gap-1 text-[10px] uppercase tracking-wider">
                                  <X size={14} /> İptal
                              </button>
                          )}
                      </div>

                      {activeTab === 'CATEGORIES' ? (
                          <form onSubmit={submitCategory} className="space-y-6">
                              <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Kategori Adı</label>
                                  <input
                                    className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none"
                                    value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} required
                                    onMouseDown={(e) => e.stopPropagation()}
                                  />
                              </div>

                              <div>
                                  <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Kategori Adı (Türkçe)</label>
                                  <input
                                    className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none"
                                    value={catForm.name_tr} onChange={e => setCatForm({...catForm, name_tr: e.target.value})}
                                    onMouseDown={(e) => e.stopPropagation()}
                                  />
                              </div>

                              <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Kapak Görseli (Yükle)</label>
                                  <div className="flex flex-col gap-2">
                                      <input
                                        type="file"
                                        ref={catImageInputRef}
                                        accept="image/png, image/jpeg, image/webp"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onChange={e => e.target.files && setCatImageFile(e.target.files[0])}
                                        className="w-full text-xs text-stone-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:bg-stone-800 file:text-white hover:file:bg-stone-700 cursor-pointer"
                                      />
                                      {catForm.image && !catImageFile && (
                                          <div className="text-[10px] text-stone-600 truncate flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span> Mevcut: {catForm.image.substring(0, 30)}...
                                          </div>
                                      )}
                                  </div>
                              </div>

                              <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Kısa Açıklama</label>
                                  <textarea
                                    className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-24"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    value={catForm.description} onChange={e => setCatForm({...catForm, description: e.target.value})}
                                  />
                              </div>

                              <div>
                                  <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Kısa Açıklama (Türkçe)</label>
                                  <textarea
                                    className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-24"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    value={catForm.description_tr} onChange={e => setCatForm({...catForm, description_tr: e.target.value})}
                                  />
                              </div>
                              <button disabled={isUploading} type="submit" className={`w-full font-bold uppercase py-3 text-xs tracking-widest transition-colors ${editingId ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-white hover:bg-stone-200 text-black'} disabled:opacity-50`}>
                                  {isUploading ? 'Yükleniyor...' : (editingId ? 'Kategoriyi Güncelle' : 'Kategoriyi Kaydet')}
                              </button>
                          </form>
                      ) : activeTab === 'DESIGNERS' ? (
                          <form onSubmit={submitDesigner} className="space-y-4">
                              <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Ad</label>
                                  <input 
                                    className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none"
                                    value={desForm.name} onChange={e => setDesForm({...desForm, name: e.target.value})} required 
                                    onMouseDown={(e) => e.stopPropagation()}
                                  />
                              </div>
                              <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Görev</label>
                                  <input
                                    className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none"
                                    value={desForm.role} onChange={e => setDesForm({...desForm, role: e.target.value})} required placeholder="örn. Mimar"
                                    onMouseDown={(e) => e.stopPropagation()}
                                  />
                              </div>
                              <div>
                                  <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Görev (Türkçe)</label>
                                  <input
                                    className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none"
                                    value={desForm.role_tr} onChange={e => setDesForm({...desForm, role_tr: e.target.value})} placeholder="ör. Mimar"
                                    onMouseDown={(e) => e.stopPropagation()}
                                  />
                              </div>
                              <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Profil Görseli (Yükle)</label>
                                  <div className="flex flex-col gap-2">
                                      <input
                                        type="file"
                                        ref={desImageInputRef}
                                        accept="image/png, image/jpeg, image/webp"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onChange={e => e.target.files && setDesImageFile(e.target.files[0])}
                                        className="w-full text-xs text-stone-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:bg-stone-800 file:text-white hover:file:bg-stone-700 cursor-pointer"
                                      />
                                      {desForm.image_url && !desImageFile && (
                                          <div className="text-[10px] text-stone-600 truncate flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span> Mevcut: {desForm.image_url.substring(0, 30)}...
                                          </div>
                                      )}
                                  </div>
                              </div>
                              <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Biyografi</label>
                                  <textarea
                                    className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-32"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    value={desForm.bio} onChange={e => setDesForm({...desForm, bio: e.target.value})}
                                  />
                              </div>
                              <div>
                                  <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Biyografi (Türkçe)</label>
                                  <textarea
                                    className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-32"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    value={desForm.bio_tr} onChange={e => setDesForm({...desForm, bio_tr: e.target.value})}
                                  />
                              </div>
                              <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Koleksiyonlar (Virgülle ayır)</label>
                                  <input
                                    className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none"
                                    value={desForm.collections} onChange={e => setDesForm({...desForm, collections: e.target.value})} placeholder="LuminArt, Pietra..."
                                    onMouseDown={(e) => e.stopPropagation()}
                                  />
                              </div>
                              <div>
                                  <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Koleksiyonlar (Türkçe, virgülle ayır)</label>
                                  <input
                                    className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none"
                                    value={desForm.collections_tr} onChange={e => setDesForm({...desForm, collections_tr: e.target.value})} placeholder="LuminArt, Pietra..."
                                    onMouseDown={(e) => e.stopPropagation()}
                                  />
                              </div>
                              <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Alıntı</label>
                                  <textarea
                                    className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-20"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    value={desForm.quote} onChange={e => setDesForm({...desForm, quote: e.target.value})}
                                  />
                              </div>
                              <div>
                                  <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Alıntı (Türkçe)</label>
                                  <textarea
                                    className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-20"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    value={desForm.quote_tr} onChange={e => setDesForm({...desForm, quote_tr: e.target.value})}
                                  />
                              </div>
                              <button disabled={isUploading} type="submit" className={`w-full font-bold uppercase py-3 text-xs tracking-widest transition-colors ${editingId ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-white hover:bg-stone-200 text-black'} disabled:opacity-50`}>
                                  {isUploading ? 'Yükleniyor...' : (editingId ? 'Tasarımcıyı Güncelle' : 'Tasarımcıyı Kaydet')}
                              </button>
                          </form>
                      ) : (
                          <form onSubmit={submitProduct} className="space-y-4">
                               <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Kategori Seç</label>
                                  <select
                                    className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none appearance-none"
                                    value={prodForm.category_id} onChange={e => setProdForm({...prodForm, category_id: e.target.value})} required
                                    onMouseDown={(e) => e.stopPropagation()}
                                  >
                                      <option value="">Kategori Seçin...</option>
                                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Ürün Adı</label>
                                  <input className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} />
                              </div>
                              <div>
                                  <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Ürün Adı (Türkçe)</label>
                                  <input className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    value={prodForm.name_tr} onChange={e => setProdForm({...prodForm, name_tr: e.target.value})} />
                              </div>

                              <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Ürün Görseli (Yükle)</label>
                                  <div className="flex flex-col gap-2">
                                      <input
                                        type="file"
                                        ref={prodImageInputRef}
                                        accept="image/png, image/jpeg, image/webp"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onChange={e => e.target.files && setProdImageFile(e.target.files[0])}
                                        className="w-full text-xs text-stone-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:bg-stone-800 file:text-white hover:file:bg-stone-700 cursor-pointer"
                                      />
                                      {prodForm.image && !prodImageFile && (
                                          <div className="text-[10px] text-stone-600 truncate flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span> Mevcut: {prodForm.image.substring(0, 30)}...
                                          </div>
                                      )}
                                  </div>
                              </div>

                              <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Detay Sayfası Görseli (Yükle)</label>
                                  <p className="text-stone-600 text-[10px] mb-2">Opsiyonel. Sadece ürün detay sayfasındaki büyük görselde kullanılır — yukarıdaki ızgara küçük görseli değişmez. Boş bırakılırsa ızgara görseli kullanılır.</p>
                                  <div className="flex flex-col gap-2">
                                      <input
                                        type="file"
                                        ref={prodDetailImageInputRef}
                                        accept="image/png, image/jpeg, image/webp"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onChange={e => e.target.files && setProdDetailImageFile(e.target.files[0])}
                                        className="w-full text-xs text-stone-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:bg-stone-800 file:text-white hover:file:bg-stone-700 cursor-pointer"
                                      />
                                      {prodForm.detail_image && !prodDetailImageFile && (
                                          <div className="text-[10px] text-stone-600 truncate flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span> Mevcut: {prodForm.detail_image.substring(0, 30)}...
                                          </div>
                                      )}
                                  </div>
                              </div>

                               <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Tasarımcı</label>
                                  <input className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    value={prodForm.designer} onChange={e => setProdForm({...prodForm, designer: e.target.value})} />
                              </div>
                              <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Açıklama</label>
                                  <textarea className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-20"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} />
                              </div>
                              <div>
                                  <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Açıklama (Türkçe)</label>
                                  <textarea className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-20"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    value={prodForm.description_tr} onChange={e => setProdForm({...prodForm, description_tr: e.target.value})} />
                              </div>

                              <div>
                                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Daha Fazla Bilgi (Opsiyonel)</label>
                                  <textarea className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-32 select-text cursor-text"
                                    placeholder="Ek detaylar, teknik özellikler veya zengin metin bilgisi..."
                                    onMouseDown={(e) => e.stopPropagation()}
                                    value={prodForm.more_info} onChange={e => setProdForm({...prodForm, more_info: e.target.value})} />
                              </div>
                              <div>
                                  <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Daha Fazla Bilgi (Türkçe, opsiyonel)</label>
                                  <textarea className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-sm focus:border-white outline-none h-32 select-text cursor-text"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    value={prodForm.more_info_tr} onChange={e => setProdForm({...prodForm, more_info_tr: e.target.value})} />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Boyutlar (Virgülle ayır)</label>
                                    <input className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-xs focus:border-white outline-none"
                                      onMouseDown={(e) => e.stopPropagation()}
                                      value={prodForm.dimensions} onChange={e => setProdForm({...prodForm, dimensions: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Detaylar (Virgülle ayır)</label>
                                    <input className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-xs focus:border-white outline-none"
                                      onMouseDown={(e) => e.stopPropagation()}
                                      value={prodForm.details} onChange={e => setProdForm({...prodForm, details: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Boyutlar (Türkçe)</label>
                                    <input className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-xs focus:border-white outline-none"
                                      onMouseDown={(e) => e.stopPropagation()}
                                      value={prodForm.dimensions_tr} onChange={e => setProdForm({...prodForm, dimensions_tr: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Detaylar (Türkçe)</label>
                                    <input className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-xs focus:border-white outline-none"
                                      onMouseDown={(e) => e.stopPropagation()}
                                      value={prodForm.details_tr} onChange={e => setProdForm({...prodForm, details_tr: e.target.value})} />
                                </div>
                              </div>

                              {/* 3-Part File Uploads */}
                              <div className="border border-stone-800 p-4 bg-stone-900/50">
                                  <h4 className="text-[10px] font-bold uppercase text-stone-400 mb-3 flex items-center gap-2"><FileDown size={14}/> İndirme Dosyaları Yapılandırması</h4>

                                  <div className="space-y-4">
                                      {/* Sheet */}
                                      <div>
                                          <label className="text-[9px] uppercase font-bold text-stone-500 block mb-1">Ürün Föyü (PDF)</label>
                                          <input type="file" ref={fileSheetRef} accept=".pdf"
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onChange={e => e.target.files && setFileSheet(e.target.files[0])}
                                            className="w-full text-xs text-stone-400 file:mr-2 file:py-1 file:px-2 file:border-0 file:text-[10px] file:bg-stone-800 file:text-white cursor-pointer" />
                                          {prodForm.pdf_sheet && !fileSheet && <span className="text-[9px] text-green-500">Dosya mevcut</span>}
                                      </div>

                                      {/* Images */}
                                      <div>
                                          <label className="text-[9px] uppercase font-bold text-stone-500 block mb-1">Yüksek Çözünürlüklü Görseller (ZIP/PDF)</label>
                                          <input type="file" ref={fileImagesRef} accept=".pdf,.zip,.rar"
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onChange={e => e.target.files && setFileImages(e.target.files[0])}
                                            className="w-full text-xs text-stone-400 file:mr-2 file:py-1 file:px-2 file:border-0 file:text-[10px] file:bg-stone-800 file:text-white cursor-pointer" />
                                            {prodForm.pdf_images && !fileImages && <span className="text-[9px] text-green-500">Dosya mevcut</span>}
                                      </div>

                                      {/* Technical */}
                                      <div>
                                          <label className="text-[9px] uppercase font-bold text-stone-500 block mb-1">2D / 3D Teknik Dosya (ZIP/PDF)</label>
                                          <input type="file" ref={fileTechRef} accept=".pdf,.zip,.rar,.dwg"
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onChange={e => e.target.files && setFileTech(e.target.files[0])}
                                            className="w-full text-xs text-stone-400 file:mr-2 file:py-1 file:px-2 file:border-0 file:text-[10px] file:bg-stone-800 file:text-white cursor-pointer" />
                                            {prodForm.pdf_technical && !fileTech && <span className="text-[9px] text-green-500">Dosya mevcut</span>}
                                      </div>
                                  </div>
                              </div>

                              <div>
                                <label className="text-[10px] uppercase font-bold text-stone-500 block mb-2">Işık Kaynağı (Virgülle ayır)</label>
                                <input className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-xs focus:border-white outline-none"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  value={prodForm.lightSource} onChange={e => setProdForm({...prodForm, lightSource: e.target.value})} />
                              </div>
                              <div>
                                <label className="text-[10px] uppercase font-bold text-yellow-600 block mb-2">Işık Kaynağı (Türkçe)</label>
                                <input className="w-full bg-[#0a0a0a] border border-stone-700 p-3 text-white text-xs focus:border-white outline-none"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  value={prodForm.lightSource_tr} onChange={e => setProdForm({...prodForm, lightSource_tr: e.target.value})} />
                              </div>

                              <button disabled={isUploading} type="submit" className={`w-full font-bold uppercase py-3 text-xs tracking-widest transition-colors ${editingId ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-white hover:bg-stone-200 text-black'} disabled:opacity-50`}>
                                  {isUploading ? 'Yükleniyor ve Kaydediliyor...' : (editingId ? 'Ürünü Güncelle' : 'Ürünü Kaydet')}
                              </button>
                          </form>
                      )}
                  </div>
              </div>

              {/* RIGHT: LIST */}
              <div className="lg:col-span-2">
                   <h3 className="text-white font-condensed text-xl uppercase mb-6 flex items-center gap-2">
                       <FileText size={18} /> {activeTab === 'PRODUCTS' ? 'Ürünleri' : (activeTab === 'CATEGORIES' ? 'Kategorileri' : 'Tasarımcıları')} Yönet
                   </h3>

                   <div className="space-y-4">
                       {activeTab === 'CATEGORIES' ? (
                           categories.length === 0 ? <p className="text-stone-500 italic">Kategori bulunamadı. Başlamak için bir tane ekleyin.</p> :
                           categories.map(cat => (
                               <div key={cat.id} className={`bg-[#151515] p-4 border flex justify-between items-center group transition-colors ${editingId === cat.id ? 'border-yellow-600' : 'border-stone-800 hover:border-stone-600'}`}>
                                   <div className="flex items-center gap-4">
                                       <div className="w-12 h-12 bg-stone-800 overflow-hidden relative">
                                           {cat.image ? (
                                              <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                                           ) : (
                                              <div className="w-full h-full flex items-center justify-center text-stone-600"><Upload size={14}/></div>
                                           )}
                                       </div>
                                       <div>
                                           <h4 className="text-white font-bold uppercase tracking-wider text-sm">{cat.name}</h4>
                                           <p className="text-stone-500 text-xs truncate max-w-xs">{cat.description}</p>
                                       </div>
                                   </div>
                                   <div className="flex items-center gap-2">
                                       <button onClick={() => handleEditClick(cat, 'CATEGORY')} className="p-2 text-stone-500 hover:text-white transition-colors">
                                            <Pencil size={16} />
                                       </button>
                                       <button onClick={() => deleteCategory(cat.id)} className="p-2 text-stone-500 hover:text-red-500 transition-colors">
                                           <Trash2 size={16} />
                                       </button>
                                   </div>
                               </div>
                           ))
                       ) : activeTab === 'DESIGNERS' ? (
                           designers.length === 0 ? <p className="text-stone-500 italic">Tasarımcı bulunamadı. Başlamak için bir tane ekleyin.</p> :
                           designers.map(des => (
                               <div key={des.id} className={`bg-[#151515] p-4 border flex justify-between items-center group transition-colors ${editingId === des.id ? 'border-yellow-600' : 'border-stone-800 hover:border-stone-600'}`}>
                                   <div className="flex items-center gap-4">
                                       <div className="w-12 h-16 bg-stone-800 overflow-hidden relative">
                                           {des.image_url && <img src={des.image_url} alt={des.name} className="w-full h-full object-cover" />}
                                       </div>
                                       <div>
                                           <h4 className="text-white font-bold uppercase text-sm">{des.name}</h4>
                                           <p className="text-stone-500 text-xs uppercase tracking-wider">{des.role}</p>
                                       </div>
                                   </div>
                                   <div className="flex gap-2">
                                       <button onClick={() => handleEditClick(des, 'DESIGNER')} className="p-2 text-stone-500 hover:text-white transition-colors"><Pencil size={16} /></button>
                                       <button onClick={() => { if(confirm('Bu tasarımcı silinsin mi?')) deleteDesigner(des.id); }} className="p-2 text-stone-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                   </div>
                               </div>
                           ))
                       ) : (
                           products.length === 0 ? <p className="text-stone-500 italic">Ürün bulunamadı.</p> :
                           products.map(prod => (
                               <div key={prod.id} className={`bg-[#151515] p-4 border flex justify-between items-center group transition-colors ${editingId === prod.id ? 'border-yellow-600' : 'border-stone-800 hover:border-stone-600'}`}>
                                   <div className="flex items-center gap-4">
                                       <div className="w-12 h-12 bg-stone-800 overflow-hidden relative">
                                            {prod.image ? (
                                              <img src={prod.image} className="w-full h-full object-cover" alt={prod.name} />
                                           ) : (
                                              <div className="w-full h-full flex items-center justify-center text-stone-600"><Upload size={14}/></div>
                                           )}
                                       </div>
                                       <div>
                                           <h4 className="text-white font-bold uppercase tracking-wider text-sm">{prod.name}</h4>
                                           <p className="text-stone-500 text-xs">{prod.category}</p>
                                       </div>
                                   </div>
                                   <div className="flex items-center gap-2">
                                       <button onClick={() => handleEditClick(prod, 'PRODUCT')} className="p-2 text-stone-500 hover:text-white transition-colors">
                                            <Pencil size={16} />
                                       </button>
                                       <button onClick={() => deleteProduct(prod.id)} className="p-2 text-stone-500 hover:text-red-500 transition-colors">
                                           <Trash2 size={16} />
                                       </button>
                                   </div>
                               </div>
                           ))
                       )}
                   </div>
              </div>

          </div>
          )}
      </div>
    </div>
  );
};