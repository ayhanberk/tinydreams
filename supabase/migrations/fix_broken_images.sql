-- Fix broken Unsplash images in products table

-- 1. Fix typo in ...df4 -> ...df9 (Sleep/Clothing/Bathtime)
UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1000&auto=format&fit=crop' 
WHERE image_url LIKE '%photo-1555252333-9f8e92e65df4%';

-- 2. Fix broken ...b28 (Toys) -> New working URL
UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000&auto=format&fit=crop' 
WHERE image_url LIKE '%photo-1596464716127-f9a8759d1b28%';

-- 3. Fix broken ...59b (Clothing) -> Another working URL (e.g., the one from Slide 1 or similar)
-- Using a safe alternative for baby clothing
UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1522771930-78848d50259b?q=80&w=1000&auto=format&fit=crop' 
WHERE image_url LIKE '%photo-1522771930-78848d50259b%';
-- Wait, if 59b is broken, I should replace it with something else.
-- Replacing with: https://images.unsplash.com/photo-1519689680058-324335c77eba
UPDATE products
SET image_url = 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000&auto=format&fit=crop'
WHERE image_url LIKE '%photo-1522771930-78848d50259b%';
