-- Create catalogues table
CREATE TABLE IF NOT EXISTS catalogues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE catalogues ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON catalogues FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated insert" ON catalogues FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON catalogues FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON catalogues FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage bucket for catalogs if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('catalogs', 'catalogs', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow public read access
CREATE POLICY "Give public access to catalogs" ON storage.objects FOR SELECT USING (bucket_id = 'catalogs');

-- Create storage policy to allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads to catalogs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'catalogs' AND auth.role() = 'authenticated');

-- Create storage policy to allow authenticated users to update
CREATE POLICY "Allow authenticated updates to catalogs" ON storage.objects FOR UPDATE USING (bucket_id = 'catalogs' AND auth.role() = 'authenticated');

-- Create storage policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated deletes to catalogs" ON storage.objects FOR DELETE USING (bucket_id = 'catalogs' AND auth.role() = 'authenticated');
