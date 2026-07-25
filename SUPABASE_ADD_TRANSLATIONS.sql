-- =============================================================
-- BILINGUAL CONTENT (Turkish/English) SUPPORT
-- Adds "_tr" sibling columns for every genuinely-translatable
-- free-text field. The existing (untouched) column stays the
-- English/base value and doubles as the fallback whenever the
-- Turkish counterpart hasn't been filled in yet by the admin.
--
-- Deliberately NOT translated (see plan for rationale):
--   products.category (legacy fallback copy of category name),
--   products.designer / designers.name (proper nouns),
--   products.notes (dead field, never populated by the admin UI),
--   material_swatches.name (catalog/color codes, kept identical
--   across languages just like the Henge reference site),
--   contacts_info.email / contacts_info.phone (not language content)
-- =============================================================

ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_tr TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description_tr TEXT;

ALTER TABLE products ADD COLUMN IF NOT EXISTS name_tr TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_tr TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS details_tr TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions_tr TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS light_source_tr TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS more_info_tr TEXT;

ALTER TABLE designers ADD COLUMN IF NOT EXISTS role_tr TEXT;
ALTER TABLE designers ADD COLUMN IF NOT EXISTS bio_tr TEXT;
ALTER TABLE designers ADD COLUMN IF NOT EXISTS collections_tr TEXT;
ALTER TABLE designers ADD COLUMN IF NOT EXISTS quote_tr TEXT;

ALTER TABLE catalogues ADD COLUMN IF NOT EXISTS title_tr TEXT;

ALTER TABLE media_categories ADD COLUMN IF NOT EXISTS name_tr TEXT;
ALTER TABLE media_items ADD COLUMN IF NOT EXISTS title_tr TEXT;

ALTER TABLE contacts_info ADD COLUMN IF NOT EXISTS title_tr TEXT;
ALTER TABLE contacts_info ADD COLUMN IF NOT EXISTS address_tr TEXT;

ALTER TABLE material_categories ADD COLUMN IF NOT EXISTS name_tr TEXT;
ALTER TABLE material_categories ADD COLUMN IF NOT EXISTS description_tr TEXT;

-- site_settings needs no schema change (generic key/value store).
-- Convention: every translatable key gets a sibling key with a
-- "_tr" suffix, e.g. `hero_title` + `hero_title_tr`, created via
-- the existing updateSiteSetting() upsert-by-key helper from the
-- admin panel. No rows need to be pre-seeded here.
