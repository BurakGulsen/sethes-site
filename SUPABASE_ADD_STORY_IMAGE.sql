-- Insert default story image url
INSERT INTO site_settings (key, value)
VALUES ('story_image_url', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop')
ON CONFLICT (key) DO NOTHING;
