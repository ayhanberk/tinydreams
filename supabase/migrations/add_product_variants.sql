-- Add colors and sizes columns to products table
ALTER TABLE products ADD COLUMN colors text[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN sizes text[] DEFAULT '{}';

-- Update existing products with some dummy data for testing
UPDATE products SET colors = ARRAY['Red', 'Blue', 'Green'], sizes = ARRAY['S', 'M', 'L'] WHERE category = 'Clothing';
UPDATE products SET colors = ARRAY['Natural', 'Wood'], sizes = ARRAY['Standard'] WHERE category = 'Toys';
