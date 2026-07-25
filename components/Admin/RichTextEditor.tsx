import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { supabase } from '../../lib/supabaseClient';
import { Bold, Italic, List, ListOrdered, LinkIcon, ImageIcon, Heading2, Heading3 } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const uploadNewsImage = async (file: File): Promise<string | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `content-${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const { error } = await supabase.storage.from('news').upload(fileName, file);
  if (error) {
    alert('Görsel yüklenirken hata oluştu: ' + error.message);
    return null;
  }
  return supabase.storage.from('news').getPublicUrl(fileName).data.publicUrl;
};

const ToolbarButton: React.FC<{ onClick: () => void; active?: boolean; children: React.ReactNode; title: string }> = ({ onClick, active, children, title }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    onMouseDown={(e) => e.preventDefault()}
    className={`p-2 rounded transition-colors ${active ? 'bg-white text-black' : 'text-stone-400 hover:text-white hover:bg-stone-800'}`}
  >
    {children}
  </button>
);

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        // classList.add() (used internally by ProseMirror to patch this attribute)
        // throws on any token containing whitespace — must be a single-line,
        // single-space-separated string, not a multi-line template literal.
        class: [
          'max-w-none min-h-[200px] p-4 focus:outline-none text-white text-sm',
          '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2',
          '[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-2',
          '[&_p]:mb-3',
          '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3',
          '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3',
          '[&_a]:underline [&_a]:text-blue-400',
          '[&_img]:rounded [&_img]:my-3 [&_img]:max-w-full',
        ].join(' '),
      },
    },
  });

  // Keep the editor in sync when a different post is loaded for editing —
  // guarded so we don't clobber the cursor position on every keystroke.
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt('Link URL:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const handleImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const url = await uploadNewsImage(file);
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="border border-stone-800 rounded-lg bg-black overflow-hidden">
      <div className="flex items-center gap-1 border-b border-stone-800 p-2 flex-wrap">
        <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={14} /></ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={14} /></ToolbarButton>
        <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={14} /></ToolbarButton>
        <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={14} /></ToolbarButton>
        <ToolbarButton title="Bullet List" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={14} /></ToolbarButton>
        <ToolbarButton title="Ordered List" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={14} /></ToolbarButton>
        <ToolbarButton title="Link" active={editor.isActive('link')} onClick={setLink}><LinkIcon size={14} /></ToolbarButton>
        <ToolbarButton title="Image" onClick={() => fileInputRef.current?.click()}><ImageIcon size={14} /></ToolbarButton>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelected} className="hidden" />
      </div>
      <EditorContent editor={editor} className="text-white" placeholder={placeholder} />
    </div>
  );
};
