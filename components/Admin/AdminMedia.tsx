import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { MediaCategory, MediaItem } from '../../types';
import { Trash2, Upload, FileText, Plus, FolderPlus, Folder, BookOpen, Newspaper } from 'lucide-react';
import { AdminCatalogues } from './AdminCatalogues';
import { AdminNews } from './AdminNews';

export const AdminMedia: React.FC = () => {
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('STATIC_CATALOGUES');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatNameTr, setNewCatNameTr] = useState('');

  // Item Form State
  const [title, setTitle] = useState('');
  const [titleTr, setTitleTr] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'STATIC_CATALOGUES' && selectedCategory !== 'STATIC_NEWS') {
      fetchItems(selectedCategory);
    } else {
      setItems([]);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('media_categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
      // Default to Catalogues if no selection, or keep existing if valid
      if (!selectedCategory) {
          setSelectedCategory('STATIC_CATALOGUES');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newCatName) return;

      try {
          const slug = newCatName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
          const { error } = await supabase
            .from('media_categories')
            .insert([{ name: newCatName, name_tr: newCatNameTr || null, slug }]);

          if (error) throw error;

          setNewCatName('');
          setNewCatNameTr('');
          fetchCategories();
      } catch (error: any) {
          console.error('Error adding category:', error);
          alert('Kategori eklenirken hata oluştu: ' + error.message);
      }
  };

  const handleDeleteCategory = async (id: string) => {
      if (!confirm('Emin misiniz? Bu, kategorideki tüm öğeleri silecek.')) return;
      try {
          const { error } = await supabase.from('media_categories').delete().eq('id', id);
          if (error) throw error;
          fetchCategories();
          if (selectedCategory === id) setSelectedCategory(null);
      } catch (error) {
          console.error('Error deleting category:', error);
      }
  };

  const handleUploadItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile || !title || !selectedCategory) {
        alert('Lütfen başlık ve kapak görseli girin.');
        return;
    }

    setUploading(true);
    try {
        // 1. Upload Cover Image
        const coverExt = coverFile.name.split('.').pop();
        const coverFileName = `media-cover-${Date.now()}.${coverExt}`;
        const { error: coverError } = await supabase.storage
            .from('media') // Using 'media' bucket created in SQL
            .upload(coverFileName, coverFile);
        
        if (coverError) throw coverError;
        
        const coverUrl = supabase.storage.from('media').getPublicUrl(coverFileName).data.publicUrl;

        // 2. Upload PDF (Optional)
        let pdfUrl = '';
        if (pdfFile) {
            const pdfFileName = `media-pdf-${Date.now()}.pdf`;
            const { error: pdfError } = await supabase.storage
                .from('media')
                .upload(pdfFileName, pdfFile);

            if (pdfError) throw pdfError;
            pdfUrl = supabase.storage.from('media').getPublicUrl(pdfFileName).data.publicUrl;
        }

        // 3. Insert into Database
        const { error: dbError } = await supabase
            .from('media_items')
            .insert([{
                category_id: selectedCategory,
                title,
                title_tr: titleTr || null,
                cover_image: coverUrl,
                pdf_url: pdfUrl || null
            }]);

        if (dbError) throw dbError;

        // Reset Form
        setTitle('');
        setTitleTr('');
        setCoverFile(null);
        setPdfFile(null);
        fetchItems(selectedCategory);
        alert('Öğe başarıyla yüklendi!');

    } catch (error: any) {
        console.error('Upload error:', error);
        alert(`Öğe yüklenirken hata oluştu: ${error.message}`);
    } finally {
        setUploading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
      if (!confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) return;
      try {
          const { error } = await supabase.from('media_items').delete().eq('id', id);
          if (error) throw error;
          if (selectedCategory) fetchItems(selectedCategory);
      } catch (error) {
          console.error('Delete error:', error);
      }
  };

  return (
    <div className="p-8 text-white">
      <h2 className="text-3xl font-condensed uppercase mb-8">Medyayı Yönet</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar: Categories */}
          <div className="lg:col-span-1 space-y-8">
              <div className="bg-[#151515] p-6 rounded-xl border border-stone-800">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-stone-400">
                      <Folder size={16} /> Kategoriler
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                      {/* Static Catalogues Item */}
                      <div
                        onClick={() => setSelectedCategory('STATIC_CATALOGUES')}
                        className={`p-3 rounded-lg cursor-pointer flex justify-between items-center group transition-colors ${selectedCategory === 'STATIC_CATALOGUES' ? 'bg-stone-800 text-white' : 'hover:bg-stone-900 text-stone-400'}`}
                      >
                          <span className="font-medium text-sm flex items-center gap-2"><BookOpen size={14} /> Kataloglar</span>
                      </div>

                      <div
                        onClick={() => setSelectedCategory('STATIC_NEWS')}
                        className={`p-3 rounded-lg cursor-pointer flex justify-between items-center group transition-colors ${selectedCategory === 'STATIC_NEWS' ? 'bg-stone-800 text-white' : 'hover:bg-stone-900 text-stone-400'}`}
                      >
                          <span className="font-medium text-sm flex items-center gap-2"><Newspaper size={14} /> Haberler</span>
                      </div>

                      {categories.map(cat => (
                          <div 
                            key={cat.id} 
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`p-3 rounded-lg cursor-pointer flex justify-between items-center group transition-colors ${selectedCategory === cat.id ? 'bg-stone-800 text-white' : 'hover:bg-stone-900 text-stone-400'}`}
                          >
                              <span className="font-medium text-sm">{cat.name}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                              >
                                  <Trash2 size={14} />
                              </button>
                          </div>
                      ))}
                  </div>

                  <form onSubmit={handleAddCategory} className="space-y-2">
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        onMouseDown={(e) => e.stopPropagation()}
                        placeholder="Yeni Kategori..."
                        className="w-full bg-black border border-stone-800 rounded p-2 text-xs text-white focus:border-stone-600 outline-none"
                      />
                      <input
                        type="text"
                        value={newCatNameTr}
                        onChange={(e) => setNewCatNameTr(e.target.value)}
                        onMouseDown={(e) => e.stopPropagation()}
                        placeholder="Yeni Kategori (Türkçe)..."
                        className="w-full bg-black border border-stone-800 rounded p-2 text-xs text-white focus:border-yellow-600 outline-none"
                      />
                      <button type="submit" className="w-full bg-white text-black p-2 rounded hover:bg-stone-200 flex items-center justify-center">
                          <Plus size={16} />
                      </button>
                  </form>
              </div>
          </div>

          {/* Main Content: Items */}
          <div className="lg:col-span-3">
              {selectedCategory === 'STATIC_CATALOGUES' ? (
                  <div className="bg-[#151515] p-8 rounded-xl border border-stone-800">
                      <AdminCatalogues />
                  </div>
              ) : selectedCategory === 'STATIC_NEWS' ? (
                  <AdminNews />
              ) : selectedCategory ? (
                  <>
                    {/* Upload Form */}
                    <div className="bg-[#151515] p-8 rounded-xl shadow-sm border border-stone-800 mb-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                            <Plus size={20} /> {categories.find(c => c.id === selectedCategory)?.name} İçin Öğe Ekle
                        </h3>
                        <form onSubmit={handleUploadItem} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Başlık</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="w-full p-3 bg-black border border-stone-800 text-white rounded-lg focus:border-white outline-none"
                                    placeholder="örn. Basın Bülteni 2024"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-yellow-600">Title (Türkçe)</label>
                                <input
                                    type="text"
                                    value={titleTr}
                                    onChange={(e) => setTitleTr(e.target.value)}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="w-full p-3 bg-black border border-stone-800 text-white rounded-lg focus:border-white outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Kapak Görseli</label>
                                <div className="relative border-2 border-dashed border-stone-700 rounded-lg p-4 hover:bg-stone-800 transition-colors text-center cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-2 text-stone-400">
                                        <Upload size={24} />
                                        <span className="text-xs">{coverFile ? coverFile.name : 'Kapak yüklemek için tıklayın'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">PDF Dosyası (Opsiyonel)</label>
                                <div className="relative border-2 border-dashed border-stone-700 rounded-lg p-4 hover:bg-stone-800 transition-colors text-center cursor-pointer">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-2 text-stone-400">
                                        <FileText size={24} />
                                        <span className="text-xs">{pdfFile ? pdfFile.name : 'PDF yüklemek için tıklayın'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-3 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className={`bg-white text-black px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {uploading ? 'Yükleniyor...' : 'Öğeyi Yayınla'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map(item => (
                            <div key={item.id} className="bg-[#151515] rounded-xl overflow-hidden shadow-sm border border-stone-800 group relative">
                                <div className="aspect-[3/4] bg-stone-900 relative">
                                    <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                                    {item.pdf_url && (
                                        <a href={item.pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs text-stone-500 hover:text-white flex items-center gap-1">
                                            <FileText size={12} /> PDF
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                        {items.length === 0 && (
                            <div className="col-span-full text-center py-12 text-stone-600 italic">
                                Bu kategoride henüz öğe yok.
                            </div>
                        )}
                    </div>
                  </>
              ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-stone-500 border border-dashed border-stone-800 rounded-xl">
                      <FolderPlus size={48} className="mb-4 opacity-50" />
                      <p>Öğeleri yönetmek için bir kategori seçin veya oluşturun.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
