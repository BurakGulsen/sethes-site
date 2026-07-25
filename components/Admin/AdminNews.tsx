import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { NewsPost } from '../../types';
import { Trash2, Upload, Plus, Pencil, X } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

const slugify = (text: string) => {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'I': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
  };
  return text
    .split('').map((c) => trMap[c] || c).join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const emptyForm = {
  title: '', title_tr: '', slug: '', excerpt: '', excerpt_tr: '',
  content: '', content_tr: '', cover_image: '',
  published_at: new Date().toISOString().slice(0, 10),
};

export const AdminNews: React.FC = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase.from('news_posts').select('*').order('published_at', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (e) {
      console.error('Error fetching news posts:', e);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setCoverFile(null);
    setEditingId(null);
    setSlugManuallyEdited(false);
  };

  const handleEditClick = (post: NewsPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      title_tr: post.title_tr || '',
      slug: post.slug,
      excerpt: post.excerpt || '',
      excerpt_tr: post.excerpt_tr || '',
      content: post.content,
      content_tr: post.content_tr || '',
      cover_image: post.cover_image || '',
      published_at: post.published_at.slice(0, 10),
    });
    setCoverFile(null);
    setSlugManuallyEdited(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.content) {
      alert('Başlık, slug ve içerik zorunludur.');
      return;
    }

    setSaving(true);
    try {
      let coverUrl = form.cover_image;
      if (coverFile) {
        const ext = coverFile.name.split('.').pop();
        const fileName = `cover-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('news').upload(fileName, coverFile);
        if (uploadError) throw uploadError;
        coverUrl = supabase.storage.from('news').getPublicUrl(fileName).data.publicUrl;
      }

      const payload = {
        title: form.title,
        title_tr: form.title_tr || null,
        slug: form.slug,
        excerpt: form.excerpt || null,
        excerpt_tr: form.excerpt_tr || null,
        content: form.content,
        content_tr: form.content_tr || null,
        cover_image: coverUrl || null,
        published_at: new Date(form.published_at).toISOString(),
      };

      if (editingId) {
        const { error } = await supabase.from('news_posts').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('news_posts').insert([payload]);
        if (error) throw error;
      }

      resetForm();
      fetchPosts();
    } catch (e: any) {
      alert('Kaydedilirken hata oluştu: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu haberi silmek istediğinize emin misiniz?')) return;
    try {
      const { error } = await supabase.from('news_posts').delete().eq('id', id);
      if (error) throw error;
      fetchPosts();
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  return (
    <div className="text-white">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        {editingId ? <Pencil size={20} /> : <Plus size={20} />} {editingId ? 'Haberi Düzenle' : 'Yeni Haber Ekle'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#151515] p-8 rounded-xl border border-stone-800 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Başlık</label>
            <input
              className="w-full p-3 bg-black border border-stone-800 rounded-lg outline-none focus:border-white"
              value={form.title}
              onMouseDown={(e) => e.stopPropagation()}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({ ...f, title, slug: slugManuallyEdited ? f.slug : slugify(title) }));
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-yellow-600">Başlık (Türkçe)</label>
            <input
              className="w-full p-3 bg-black border border-stone-800 rounded-lg outline-none focus:border-white"
              value={form.title_tr}
              onMouseDown={(e) => e.stopPropagation()}
              onChange={(e) => setForm((f) => ({ ...f, title_tr: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Slug (URL)</label>
          <input
            className="w-full p-3 bg-black border border-stone-800 rounded-lg outline-none focus:border-white font-mono text-sm"
            value={form.slug}
            onMouseDown={(e) => e.stopPropagation()}
            onChange={(e) => { setSlugManuallyEdited(true); setForm((f) => ({ ...f, slug: e.target.value })); }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Özet</label>
            <textarea
              rows={3}
              className="w-full p-3 bg-black border border-stone-800 rounded-lg outline-none focus:border-white"
              value={form.excerpt}
              onMouseDown={(e) => e.stopPropagation()}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-yellow-600">Özet (Türkçe)</label>
            <textarea
              rows={3}
              className="w-full p-3 bg-black border border-stone-800 rounded-lg outline-none focus:border-white"
              value={form.excerpt_tr}
              onMouseDown={(e) => e.stopPropagation()}
              onChange={(e) => setForm((f) => ({ ...f, excerpt_tr: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Kapak Görseli</label>
            <div className="relative border-2 border-dashed border-stone-700 rounded-lg p-4 hover:bg-stone-800 transition-colors text-center cursor-pointer">
              <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                onMouseDown={(e) => e.stopPropagation()} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center gap-2 text-stone-400">
                <Upload size={24} />
                <span className="text-xs">{coverFile ? coverFile.name : (form.cover_image ? 'Mevcut görsel var — değiştirmek için tıklayın' : 'Kapak görseli yükleyin')}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Yayın Tarihi</label>
            <input type="date" className="w-full p-3 bg-black border border-stone-800 rounded-lg outline-none focus:border-white"
              value={form.published_at} onMouseDown={(e) => e.stopPropagation()}
              onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">İçerik</label>
          <RichTextEditor value={form.content} onChange={(html) => setForm((f) => ({ ...f, content: html }))} />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-yellow-600">İçerik (Türkçe)</label>
          <RichTextEditor value={form.content_tr} onChange={(html) => setForm((f) => ({ ...f, content_tr: html }))} />
        </div>

        <div className="flex justify-end gap-3">
          {editingId && (
            <button type="button" onClick={resetForm} className="px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-stone-400 hover:text-white flex items-center gap-2">
              <X size={16} /> İptal
            </button>
          )}
          <button type="submit" disabled={saving}
            className={`bg-white text-black px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {saving ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Yayınla'}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-stone-500">Yükleniyor...</div>
        ) : posts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-stone-600 italic">Henüz haber eklenmedi.</div>
        ) : posts.map((post) => (
          <div key={post.id} className="bg-[#151515] rounded-xl overflow-hidden border border-stone-800 group relative">
            <div className="aspect-video bg-stone-900 relative">
              {post.cover_image && <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => handleEditClick(post)} className="bg-white text-black p-2 rounded-full hover:bg-stone-200 shadow-lg"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(post.id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-sm mb-1">{post.title}</h4>
              <p className="text-xs text-stone-500">{new Date(post.published_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
