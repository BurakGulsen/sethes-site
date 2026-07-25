import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { MaterialCategory, MaterialSwatch } from '../../types';
import { Trash2, Upload, Plus, FolderPlus, Folder, Pencil, X } from 'lucide-react';
import { useSiteData } from '../../context/SiteContext';

// Slug helper (Turkish char support)
const createSlug = (text: string) => {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'I': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };
  return text
    .split('').map(c => trMap[c] || c).join('')
    .toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').replace(/-+/g, '-');
};

export const AdminMaterials: React.FC = () => {
  const { uploadFile, refreshData } = useSiteData();

  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [swatches, setSwatches] = useState<MaterialSwatch[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Category form state
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catNameTr, setCatNameTr] = useState('');
  const [catDescriptionTr, setCatDescriptionTr] = useState('');
  const [catImageFile, setCatImageFile] = useState<File | null>(null);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  // Swatch form state
  const [swatchName, setSwatchName] = useState('');
  const [swatchImageFile, setSwatchImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSwatches(selectedCategory);
    } else {
      setSwatches([]);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('material_categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) { console.error('Error fetching material categories:', error); return; }
    setCategories(data || []);
    if (!selectedCategory && data && data.length > 0) {
      setSelectedCategory(data[0].id);
    }
  };

  const fetchSwatches = async (categoryId: string) => {
    const { data, error } = await supabase
      .from('material_swatches')
      .select('*')
      .eq('category_id', categoryId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) { console.error('Error fetching swatches:', error); return; }
    setSwatches(data || []);
  };

  const resetCatForm = () => {
    setEditingCatId(null);
    setCatName('');
    setCatDescription('');
    setCatNameTr('');
    setCatDescriptionTr('');
    setCatImageFile(null);
  };

  const startEditCategory = (cat: MaterialCategory) => {
    setEditingCatId(cat.id);
    setCatName(cat.name);
    setCatDescription(cat.description || '');
    setCatNameTr(cat.name_tr || '');
    setCatDescriptionTr(cat.description_tr || '');
    setCatImageFile(null);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;
    setUploading(true);
    try {
      let imageUrl: string | undefined;
      if (catImageFile) {
        const url = await uploadFile(catImageFile, 'materials');
        if (url) imageUrl = url;
      }

      if (editingCatId) {
        const payload: any = { name: catName, slug: createSlug(catName), description: catDescription, name_tr: catNameTr, description_tr: catDescriptionTr };
        if (imageUrl) payload.image = imageUrl;
        const { error } = await supabase.from('material_categories').update(payload).eq('id', editingCatId);
        if (error) throw error;
      } else {
        const payload: any = { name: catName, slug: createSlug(catName), description: catDescription, name_tr: catNameTr, description_tr: catDescriptionTr, image: imageUrl || null };
        const { error } = await supabase.from('material_categories').insert([payload]);
        if (error) throw error;
      }

      resetCatForm();
      await fetchCategories();
      await refreshData();
    } catch (error: any) {
      console.error('Error saving category:', error);
      alert('Error saving material: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure? This will delete the material and all its swatches.')) return;
    try {
      const { error } = await supabase.from('material_categories').delete().eq('id', id);
      if (error) throw error;
      if (selectedCategory === id) setSelectedCategory(null);
      await fetchCategories();
      await refreshData();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleAddSwatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!swatchImageFile || !swatchName || !selectedCategory) {
      alert('Please provide a swatch name and image.');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadFile(swatchImageFile, 'materials');
      if (!url) throw new Error('Image upload failed.');

      const { error } = await supabase.from('material_swatches').insert([{
        category_id: selectedCategory,
        name: swatchName,
        image: url,
        sort_order: swatches.length
      }]);
      if (error) throw error;

      setSwatchName('');
      setSwatchImageFile(null);
      await fetchSwatches(selectedCategory);
    } catch (error: any) {
      console.error('Error adding swatch:', error);
      alert('Error adding swatch: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSwatch = async (id: string) => {
    if (!confirm('Delete this swatch?')) return;
    try {
      const { error } = await supabase.from('material_swatches').delete().eq('id', id);
      if (error) throw error;
      if (selectedCategory) fetchSwatches(selectedCategory);
    } catch (error: any) {
      console.error('Delete error:', error);
    }
  };

  const selectedCat = categories.find(c => c.id === selectedCategory);

  return (
    <div className="p-8 text-white">
      <h2 className="text-3xl font-condensed uppercase mb-8">Manage Materials</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar: Material categories */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[#151515] p-6 rounded-xl border border-stone-800">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-stone-400">
              <Folder size={16} /> Materials
            </h3>

            <div className="space-y-2 mb-6">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3 rounded-lg cursor-pointer flex justify-between items-center group transition-colors ${selectedCategory === cat.id ? 'bg-stone-800 text-white' : 'hover:bg-stone-900 text-stone-400'}`}
                >
                  <span className="font-medium text-sm">{cat.name}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); startEditCategory(cat); }}
                      className="p-1 hover:text-yellow-500"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                      className="p-1 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-stone-600 text-xs italic">No materials yet.</p>
              )}
            </div>

            {/* Category add/edit form */}
            <form onSubmit={handleSaveCategory} className="space-y-3 border-t border-stone-800 pt-4">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  {editingCatId ? 'Edit Material' : 'New Material'}
                </p>
                {editingCatId && (
                  <button type="button" onClick={resetCatForm} className="text-stone-500 hover:text-white flex items-center gap-1 text-[10px] uppercase">
                    <X size={12} /> Cancel
                  </button>
                )}
              </div>
              <input
                type="text"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                placeholder="Material name (e.g. Fabrics)"
                className="w-full bg-black border border-stone-800 rounded p-2 text-xs text-white focus:border-stone-600 outline-none"
              />
              <input
                type="text"
                value={catNameTr}
                onChange={(e) => setCatNameTr(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                placeholder="Materyal adı (Türkçe)"
                className="w-full bg-black border border-stone-800 rounded p-2 text-xs text-white focus:border-yellow-600 outline-none"
              />
              <textarea
                value={catDescription}
                onChange={(e) => setCatDescription(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                placeholder="Caption (optional)"
                className="w-full bg-black border border-stone-800 rounded p-2 text-xs text-white focus:border-stone-600 outline-none h-16"
              />
              <textarea
                value={catDescriptionTr}
                onChange={(e) => setCatDescriptionTr(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                placeholder="Açıklama (Türkçe, opsiyonel)"
                className="w-full bg-black border border-stone-800 rounded p-2 text-xs text-white focus:border-yellow-600 outline-none h-16"
              />
              <div className="relative border-2 border-dashed border-stone-700 rounded-lg p-3 hover:bg-stone-800 transition-colors text-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCatImageFile(e.target.files?.[0] || null)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-1 text-stone-400">
                  <Upload size={18} />
                  <span className="text-[10px]">{catImageFile ? catImageFile.name : 'Cover image (optional)'}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-white text-black py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-stone-200 disabled:opacity-50 flex items-center justify-center gap-1"
              >
                <Plus size={14} /> {uploading ? 'Saving...' : (editingCatId ? 'Update' : 'Add Material')}
              </button>
            </form>
          </div>
        </div>

        {/* Main content: swatches */}
        <div className="lg:col-span-3">
          {selectedCategory && selectedCat ? (
            <>
              {/* Add swatch form */}
              <div className="bg-[#151515] p-8 rounded-xl shadow-sm border border-stone-800 mb-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                  <Plus size={20} /> Add Swatch to {selectedCat.name}
                </h3>
                <form onSubmit={handleAddSwatch} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Swatch Name</label>
                    <input
                      type="text"
                      value={swatchName}
                      onChange={(e) => setSwatchName(e.target.value)}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="w-full p-3 bg-black border border-stone-800 text-white rounded-lg focus:border-white outline-none"
                      placeholder="e.g. ABARTH 26"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Swatch Image</label>
                    <div className="relative border-2 border-dashed border-stone-700 rounded-lg p-4 hover:bg-stone-800 transition-colors text-center cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSwatchImageFile(e.target.files?.[0] || null)}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center gap-2 text-stone-400">
                        <Upload size={24} />
                        <span className="text-xs">{swatchImageFile ? swatchImageFile.name : 'Click to upload'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className={`bg-white text-black px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {uploading ? 'Uploading...' : 'Add Swatch'}
                  </button>
                </form>
              </div>

              {/* Swatches grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {swatches.map(swatch => (
                  <div key={swatch.id} className="bg-[#151515] rounded-lg overflow-hidden border border-stone-800 group relative">
                    <div className="aspect-square bg-stone-900 relative">
                      <img src={swatch.image} alt={swatch.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDeleteSwatch(swatch.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="p-2">
                      <h4 className="font-bold text-white text-[11px] tracking-wider uppercase truncate">{swatch.name}</h4>
                    </div>
                  </div>
                ))}
                {swatches.length === 0 && (
                  <div className="col-span-full text-center py-12 text-stone-600 italic">
                    No swatches in this material yet.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-stone-500 border border-dashed border-stone-800 rounded-xl">
              <FolderPlus size={48} className="mb-4 opacity-50" />
              <p>Create or select a material to manage its swatches.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
