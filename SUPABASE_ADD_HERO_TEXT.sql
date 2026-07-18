-- Insert default hero title and subtitle if not exists
INSERT INTO site_settings (key, value)
VALUES 
  ('hero_title', 'S34/4 COLLECTION'),
  ('hero_subtitle', 'UNWRITTEN STREETS')
ON CONFLICT (key) DO NOTHING;
