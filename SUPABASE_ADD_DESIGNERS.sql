-- Create designers table
CREATE TABLE IF NOT EXISTS designers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  collections TEXT, -- Can be comma separated string
  quote TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default designer (Alper Akkoz) if table is empty
INSERT INTO designers (name, role, bio, collections, quote, image_url)
SELECT 'Alper Akkoz', 'Lead Designer', 'Alper Akkoz blends architectural precision with organic fluidity. His work explores the tension between raw material and refined form.', 'S34 Collection, Mono Series', 'Design is not just about form, but the silence between forms.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM designers);

-- Add grayscale setting
INSERT INTO site_settings (key, value)
VALUES ('designers_grayscale', 'true')
ON CONFLICT (key) DO NOTHING;
