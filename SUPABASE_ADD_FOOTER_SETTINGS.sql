-- Insert default footer settings
INSERT INTO site_settings (key, value)
VALUES 
  ('footer_title', 'ARBEM ATELIER'),
  ('footer_subtitle', 'An homage to purity, material, and form.'),
  ('social_links', '[{"platform": "Instagram", "url": "https://instagram.com"}]')
ON CONFLICT (key) DO NOTHING;
