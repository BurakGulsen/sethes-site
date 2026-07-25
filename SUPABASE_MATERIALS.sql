-- =============================================================
-- MATERIALS MODULE (mirrors the Media module)
-- material_categories = material types (e.g. Fabrics, Leathers, Woods)
-- material_swatches    = color/finish swatches inside a category (kartela)
-- =============================================================

-- Create material_categories table
CREATE TABLE IF NOT EXISTS material_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,               -- cover image shown on the /materials landing page
  description TEXT,         -- optional caption shown on the swatch page
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create material_swatches table
CREATE TABLE IF NOT EXISTS material_swatches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES material_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,       -- e.g. "ABARTH 26"
  image TEXT NOT NULL,      -- swatch texture / color image
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE material_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_swatches ENABLE ROW LEVEL SECURITY;

-- Policies for material_categories
CREATE POLICY "Public read material_categories" ON material_categories FOR SELECT USING (true);
CREATE POLICY "Auth insert material_categories" ON material_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update material_categories" ON material_categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete material_categories" ON material_categories FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for material_swatches
CREATE POLICY "Public read material_swatches" ON material_swatches FOR SELECT USING (true);
CREATE POLICY "Auth insert material_swatches" ON material_swatches FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update material_swatches" ON material_swatches FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete material_swatches" ON material_swatches FOR DELETE USING (auth.role() = 'authenticated');

-- Reuse the existing public 'product-assets' bucket for uploads (same bucket the
-- SiteContext.uploadFile helper already uses), so no extra bucket setup is needed.
-- If you prefer a dedicated bucket, uncomment the block below and switch the
-- AdminMaterials uploads to it.
-- INSERT INTO storage.buckets (id, name, public) VALUES ('materials', 'materials', true) ON CONFLICT (id) DO NOTHING;
