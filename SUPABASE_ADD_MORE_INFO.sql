-- Add more_info column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS more_info TEXT;
