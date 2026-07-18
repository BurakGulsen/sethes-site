-- Add logo settings to site_settings table

-- Insert default values if they don't exist
INSERT INTO site_settings (key, value)
VALUES 
  ('logo_type', 'text'),
  ('logo_text', 'ARBEM'),
  ('logo_image_url', '')
ON CONFLICT (key) DO NOTHING;
