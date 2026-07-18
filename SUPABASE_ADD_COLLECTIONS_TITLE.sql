-- Insert default collections title if not exists
INSERT INTO site_settings (key, value)
VALUES ('collections_title', 'COLLECTIONS')
ON CONFLICT (key) DO NOTHING;
