-- Optional separate hero image for the product detail page.
-- Falls back to the existing `image` column (grid thumbnail) when empty.
ALTER TABLE products ADD COLUMN IF NOT EXISTS detail_image TEXT;
