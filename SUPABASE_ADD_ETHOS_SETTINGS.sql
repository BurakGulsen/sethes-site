-- Insert default ethos settings
INSERT INTO site_settings (key, value)
VALUES 
  ('ethos_title', 'THE ETHOS'),
  ('ethos_description', 'Our research leads us to discover new materials and old hands. We travel to find the rarest stones, the most resilient woods, and the metals that tell a story.')
ON CONFLICT (key) DO NOTHING;
