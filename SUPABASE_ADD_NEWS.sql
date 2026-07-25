-- ============================================================================
-- HABERLER / BLOG (news_posts)
-- ============================================================================

CREATE TABLE IF NOT EXISTS news_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  cover_image TEXT,
  excerpt TEXT,
  content TEXT NOT NULL,          -- Zengin metin editöründen gelen HTML
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title_tr TEXT,
  excerpt_tr TEXT,
  content_tr TEXT
);

ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read news_posts"
ON news_posts FOR SELECT
USING (true);

CREATE POLICY "Admin insert news_posts"
ON news_posts FOR INSERT
TO authenticated
WITH CHECK ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );

CREATE POLICY "Admin update news_posts"
ON news_posts FOR UPDATE
TO authenticated
USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );

CREATE POLICY "Admin delete news_posts"
ON news_posts FOR DELETE
TO authenticated
USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );

-- Kapak görselleri + makale içine gömülen görseller için.
INSERT INTO storage.buckets (id, name, public)
VALUES ('news', 'news', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public access news"
ON storage.objects FOR SELECT
USING ( bucket_id = 'news' );

CREATE POLICY "Admin upload news"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'news' AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );

CREATE POLICY "Admin update news storage"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'news' AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );

CREATE POLICY "Admin delete news storage"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'news' AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );
