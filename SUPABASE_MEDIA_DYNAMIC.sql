-- Create media_categories table
CREATE TABLE IF NOT EXISTS media_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create media_items table
CREATE TABLE IF NOT EXISTS media_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES media_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE media_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- Policies for media_categories
CREATE POLICY "Public read media_categories" ON media_categories FOR SELECT USING (true);
CREATE POLICY "Auth insert media_categories" ON media_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update media_categories" ON media_categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete media_categories" ON media_categories FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for media_items
CREATE POLICY "Public read media_items" ON media_items FOR SELECT USING (true);
CREATE POLICY "Auth insert media_items" ON media_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update media_items" ON media_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete media_items" ON media_items FOR DELETE USING (auth.role() = 'authenticated');

-- Reuse 'catalogs' bucket or create 'media' bucket. Let's use 'catalogs' for simplicity or create 'media' to be clean.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for 'media' bucket
CREATE POLICY "Public access media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Auth upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update media" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete media" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
