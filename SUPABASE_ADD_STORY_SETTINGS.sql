-- Insert default story settings
INSERT INTO site_settings (key, value)
VALUES 
  ('story_title', 'THE SETHES STORY'),
  ('story_description', 'Sethes consolidates its presence with a flagship store in the heart of Istanbul. Nestled in the vibrant Ataşehir district, the space celebrates Sethes''s distinctive aesthetic where unique materials and craftsmanship blend with contemporary design.

The showroom is conceived as an immersive design atelier, offering architects and designers a gateway into the world of Sethes. The collections on display include iconic pieces presented within an interior concept defined by striking balance.')
ON CONFLICT (key) DO NOTHING;
