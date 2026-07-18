-- Insert default bespoke settings
INSERT INTO site_settings (key, value)
VALUES 
  ('bespoke_video_url', 'https://assets.mixkit.co/videos/preview/mixkit-bathroom-sink-faucet-running-water-4330-large.mp4'),
  ('bespoke_title', 'BESPOKE PROJECTS'),
  ('bespoke_subtitle', 'Signature stone washbasins and integrated water systems.')
ON CONFLICT (key) DO NOTHING;
