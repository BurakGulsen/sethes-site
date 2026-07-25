-- ============================================================================
-- MÜŞTERİ PROFİLİ (KAYIT FORMU EK ALANLARI) + SÖZLEŞME ONAYI KAYDI
-- ============================================================================
--
-- Register formuna eklenen Ad/Soyad/Şirket/Ünvan/Ülke/Telefon alanlarını ve
-- Kullanım Şartları / pazarlama izni onaylarını saklamak için.
--
-- Not: "role" sütun adı kasıtlı olarak kullanılmadı — Supabase Auth'ta
-- zaten user_metadata.role ile admin/customer ayrımı yapılıyor
-- (bkz. SUPABASE_ADD_CUSTOMER_AUTH.sql); karışmasın diye burada "job_role".

CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  job_role TEXT,
  country TEXT,
  phone TEXT,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  terms_accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

-- Kullanıcı sadece kendi profilini oluşturabilir ve görebilir.
CREATE POLICY "Self insert"
ON customer_profiles FOR INSERT
TO authenticated
WITH CHECK ( auth.uid() = id );

CREATE POLICY "Self select"
ON customer_profiles FOR SELECT
TO authenticated
USING ( auth.uid() = id );

-- Admin, lead listesi olarak tüm kayıtları görebilir.
CREATE POLICY "Admin select all"
ON customer_profiles FOR SELECT
TO authenticated
USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );
