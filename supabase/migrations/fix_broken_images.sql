-- Fix broken Unsplash URLs for specific products
-- Replaces 404 image URLs with valid ones

-- 1. Yıldızlı Gece Lambası -> Use a valid baby room/light image
UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800'
WHERE title = 'Yıldızlı Gece Lambası';

-- 2. Örgü Ayıcık (Knitted Bear) -> Use a valid toy image
UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?q=80&w=800'
WHERE title = 'Örgü Ayıcık';

-- 3. Bulut Raf (Cloud Shelf) -> Use a valid nursery image
UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800'
WHERE title = 'Bulut Raf';

-- 4. Pamuklu Tulum (Cotton Onesie) -> Use a valid baby image
UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800'
WHERE title = 'Pamuklu Tulum';

-- 5. Fix any other potential broken ones by title if needed
-- (Optional)
