-- ============================================================================
-- MÜŞTERİ KAYIT/GİRİŞ + 2D/3D TEKNİK DOSYA KORUMASI
-- ============================================================================
--
-- Bu migration, siteye herkese açık müşteri kaydı (register/login) ekler ve
-- 2D/3D teknik dosyaları gerçek (sunucu taraflı) bir korumaya alır.
--
-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
-- ZORUNLU MANUEL ADIM (bu SQL'i çalıştırmadan ÖNCE veya HEMEN SONRA yapılmalı):
--
-- Artık herkes kayıt olup "authenticated" rolü alabildiği için, admin panelini
-- ve admin'e özel yükleme yetkisini SADECE gerçek admin hesabına açık tutmak
-- gerekiyor. Bunun için:
--
--   Supabase Dashboard → Authentication → Users → (mevcut admin hesabınız)
--   → "User Metadata" alanına şunu ekleyin:
--
--       { "role": "admin" }
--
-- Bu adım atlanırsa admin, bu migration'dan sonra KENDİ panelinden (/yonetim-
-- merkezi-x91) dışarıda kalır ve dosya yükleyemez hale gelir.
-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

-- ----------------------------------------------------------------------------
-- 1) Yeni ÖZEL (private) bucket: 2D/3D teknik dosyaları burada tutulacak.
--    "public: false" olduğu için dosyalara sadece imzalı (signed) URL ile,
--    ve sadece giriş yapmış kullanıcılar için, erişilebilir.
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('technical-docs', 'technical-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Giriş yapmış HERHANGİ bir kullanıcı (müşteri veya admin) signed URL üretebilir.
CREATE POLICY "Authenticated Read (technical-docs)"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'technical-docs' );

-- Sadece admin rolü yükleyebilir/güncelleyebilir/silebilir.
CREATE POLICY "Admin Only Upload (technical-docs)"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'technical-docs'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin Only Update (technical-docs)"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'technical-docs'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin Only Delete (technical-docs)"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'technical-docs'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- ----------------------------------------------------------------------------
-- 2) site-assets sıkılaştırma
--    Bu bucket'ın politikaları SUPABASE_SETUP.sql'de tam isimleriyle
--    biliniyor, o yüzden güvenle silip admin-rol koşuluyla yeniden
--    yaratabiliyoruz. Public okuma (SELECT) değişmiyor.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Updates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Deletes" ON storage.objects;

CREATE POLICY "Admin Only Uploads (site-assets)"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-assets'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin Only Updates (site-assets)"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'site-assets'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin Only Deletes (site-assets)"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'site-assets'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- ----------------------------------------------------------------------------
-- 3) DİKKAT — product-assets / catalogs / media / materials bucket'ları
--
-- Bu bucket'ların yazma (INSERT/UPDATE/DELETE) politikaları bu repodaki SQL
-- dosyalarında OLUŞTURULMAMIŞ — muhtemelen Supabase Dashboard üzerinden
-- manuel eklendi ve otomatik/rastgele isimler taşıyorlar. Bu isimleri
-- bilmediğimiz için isimle DROP POLICY güvenli değil.
--
-- Postgres RLS politikaları OR'lanır: aşağıdaki yeni admin-only politikaları
-- eklemek, eski "authenticated ise izin ver" politikasını OTOMATİK OLARAK
-- iptal ETMEZ — ikisi birlikte var olursa eski gevşek kural hâlâ geçerli
-- kalır ve herhangi bir kayıtlı müşteri dosya yükleyebilir/silebilir/
-- üzerine yazabilir.
--
-- BU YÜZDEN, aşağıdaki CREATE POLICY'leri çalıştırmadan ÖNCE:
--   Supabase Dashboard → Storage → [product-assets / catalogs / media /
--   materials] → Policies sekmesine gidip, "authenticated" rolüne INSERT/
--   UPDATE/DELETE izni veren MEVCUT politikaları elle silin.
--
-- Sildikten sonra aşağıdaki blokların yorumunu kaldırıp çalıştırın:
-- ----------------------------------------------------------------------------

-- CREATE POLICY "Admin Only Uploads (product-assets)"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   bucket_id = 'product-assets'
--   AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
-- );
-- CREATE POLICY "Admin Only Updates (product-assets)"
-- ON storage.objects FOR UPDATE
-- TO authenticated
-- USING (
--   bucket_id = 'product-assets'
--   AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
-- );
-- CREATE POLICY "Admin Only Deletes (product-assets)"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (
--   bucket_id = 'product-assets'
--   AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
-- );

-- CREATE POLICY "Admin Only Uploads (catalogs)"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   bucket_id = 'catalogs'
--   AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
-- );
-- CREATE POLICY "Admin Only Updates (catalogs)"
-- ON storage.objects FOR UPDATE
-- TO authenticated
-- USING (
--   bucket_id = 'catalogs'
--   AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
-- );
-- CREATE POLICY "Admin Only Deletes (catalogs)"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (
--   bucket_id = 'catalogs'
--   AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
-- );

-- CREATE POLICY "Admin Only Uploads (media)"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   bucket_id = 'media'
--   AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
-- );
-- CREATE POLICY "Admin Only Updates (media)"
-- ON storage.objects FOR UPDATE
-- TO authenticated
-- USING (
--   bucket_id = 'media'
--   AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
-- );
-- CREATE POLICY "Admin Only Deletes (media)"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (
--   bucket_id = 'media'
--   AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
-- );

-- CREATE POLICY "Admin Only Uploads (materials)"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   bucket_id = 'materials'
--   AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
-- );
-- CREATE POLICY "Admin Only Updates (materials)"
-- ON storage.objects FOR UPDATE
-- TO authenticated
-- USING (
--   bucket_id = 'materials'
--   AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
-- );
-- CREATE POLICY "Admin Only Deletes (materials)"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (
--   bucket_id = 'materials'
--   AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
-- );
