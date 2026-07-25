import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Catalogue } from '../../types';
import { Trash2, Upload, FileText, Plus } from 'lucide-react';

export const AdminCatalogues: React.FC = () => {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [titleTr, setTitleTr] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCatalogues();
  }, []);

  const fetchCatalogues = async () => {
    try {
      const { data, error } = await supabase
        .from('catalogues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCatalogues(data || []);
    } catch (error) {
      console.error('Error fetching catalogues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile || !pdfFile || !title) {
        alert('Please provide title, cover image, and PDF file.');
        return;
    }

    setUploading(true);
    try {
        // 1. Upload Cover Image
        const coverExt = coverFile.name.split('.').pop();
        const coverFileName = `cover-${Date.now()}.${coverExt}`;
        const { data: coverData, error: coverError } = await supabase.storage
            .from('catalogs')
            .upload(coverFileName, coverFile);
        
        if (coverError) throw coverError;
        
        const coverUrl = supabase.storage.from('catalogs').getPublicUrl(coverFileName).data.publicUrl;

        // 2. Upload PDF
        const pdfFileName = `catalogue-${Date.now()}.pdf`;
        const { data: pdfData, error: pdfError } = await supabase.storage
            .from('catalogs')
            .upload(pdfFileName, pdfFile);

        if (pdfError) throw pdfError;

        const pdfUrl = supabase.storage.from('catalogs').getPublicUrl(pdfFileName).data.publicUrl;

        // 3. Insert into Database
        const { error: dbError } = await supabase
            .from('catalogues')
            .insert([{
                title,
                title_tr: titleTr || null,
                cover_image: coverUrl,
                pdf_url: pdfUrl
            }]);

        if (dbError) throw dbError;

        // Reset Form
        setTitle('');
        setTitleTr('');
        setCoverFile(null);
        setPdfFile(null);
        fetchCatalogues();
        alert('Catalogue uploaded successfully!');

    } catch (error: any) {
        console.error('Upload error:', error);
        alert(`Error uploading catalogue: ${error.message}`);
    } finally {
        setUploading(false);
    }
  };

  const handleDelete = async (id: string, coverUrl: string, pdfUrl: string) => {
      if (!confirm('Are you sure you want to delete this catalogue?')) return;

      try {
          // Delete from DB
          const { error } = await supabase.from('catalogues').delete().eq('id', id);
          if (error) throw error;

          // Note: Ideally we should also delete files from storage, but for simplicity we'll skip that for now 
          // or handle it if we can parse the filenames from URLs.
          
          fetchCatalogues();
      } catch (error) {
          console.error('Delete error:', error);
          alert('Error deleting catalogue');
      }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-condensed uppercase mb-8 text-white">Manage Catalogues</h2>

      {/* Upload Form */}
      <div className="bg-[#151515] p-8 rounded-xl shadow-sm border border-stone-800 mb-12">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
            <Plus size={20} /> Add New Catalogue
        </h3>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="w-full p-3 bg-black border border-stone-800 text-white rounded-lg focus:border-white outline-none"
                    placeholder="e.g. S34/4 Collection"
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
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Cover Image</label>
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
                        <span className="text-xs">{coverFile ? coverFile.name : 'Click to upload cover'}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">PDF File</label>
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
                        <span className="text-xs">{pdfFile ? pdfFile.name : 'Click to upload PDF'}</span>
                    </div>
                </div>
            </div>

            <div className="md:col-span-3 flex justify-end">
                <button 
                    type="submit" 
                    disabled={uploading}
                    className={`bg-white text-black px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {uploading ? 'Uploading...' : 'Publish Catalogue'}
                </button>
            </div>
        </form>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {catalogues.map(cat => (
            <div key={cat.id} className="bg-[#151515] rounded-xl overflow-hidden shadow-sm border border-stone-800 group">
                <div className="relative aspect-[3/4] bg-stone-900">
                    <img src={cat.cover_image} alt={cat.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => handleDelete(cat.id, cat.cover_image, cat.pdf_url)}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <h4 className="font-bold text-lg mb-2 text-white">{cat.title}</h4>
                    <a 
                        href={cat.pdf_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-stone-500 hover:text-white uppercase tracking-wider flex items-center gap-2"
                    >
                        <FileText size={14} /> View PDF
                    </a>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
