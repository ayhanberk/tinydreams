
-- 1. Add slug column to products
ALTER TABLE products ADD COLUMN slug text;

-- 2. Populate slug from title (Simple slugify function mock)
-- Since we can't easily use regex replace in pure standard SQL without extensions for all cases, 
-- we will update them manually or use a simple replace.
-- Ideally this is done via application logic or a robust function. 
-- For now, let's update the specific rows we inserted in seed_data or rely on a generic update.
-- But standard postgres doesn't have 'slugify'.
-- We can default slug to id if title is complex, but let's try a simple lower-case-replace-space approach.
UPDATE products SET slug = lower(replace(title, ' ', '-'));

-- Manually fix non-ascii chars if needed for the test data
-- 'Yıldızlı Gece Lambası' -> 'yildizli-gece-lambasi'
UPDATE products SET slug = 'yildizli-gece-lambasi' WHERE title = 'Yıldızlı Gece Lambası';
UPDATE products SET slug = 'orgu-ayicik' WHERE title = 'Örgü Ayıcık';
UPDATE products SET slug = 'bulut-raf' WHERE title = 'Bulut Raf';
UPDATE products SET slug = 'pamuklu-tulum' WHERE title = 'Pamuklu Tulum';

-- 3. Make slug unique
ALTER TABLE products ADD CONSTRAINT products_slug_key UNIQUE (slug);
ALTER TABLE products ALTER COLUMN slug SET NOT NULL;

-- 4. Create products/category/slug helper function (Optional, or just handle in frontend)
