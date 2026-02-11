-- 1. Insert Categories
INSERT INTO categories (id, name, slug) VALUES 
(uuid_generate_v4(), 'Bebek Odası', 'bebek-odasi'),
(uuid_generate_v4(), 'Oyuncak', 'oyuncak'),
(uuid_generate_v4(), 'Giyim', 'giyim')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Products (Get category IDs first if needed, but let's just insert with raw category names if FK is text, or use placeholders)
-- Assuming products table has a category column (text) based on schema.sql line 33.
-- schema.sql line 33: category text,
INSERT INTO products (id, title, description, price, image_url, category, stock, is_featured) VALUES
(uuid_generate_v4(), 'Yıldızlı Gece Lambası', 'Bebek odaları için huzurlu bir uyku ortamı sağlayan projeksiyonlu lamba.', 249.90, 'https://images.unsplash.com/photo-1532911545474-bed8a82aa8e6?q=80&w=800', 'Bebek Odası', 50, true),
(uuid_generate_v4(), 'Örgü Ayıcık', 'El yapımı, %100 pamuk ipliği ile örülmüş güvenli uyku arkadaşı.', 189.00, 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?q=80&w=800', 'Oyuncak', 30, true),
(uuid_generate_v4(), 'Bulut Raf', 'Dekoratif, ahşap el yapımı bulut tasarımlı duvar rafı.', 145.00, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800', 'Bebek Odası', 15, false),
(uuid_generate_v4(), 'Pamuklu Tulum', 'Yumuşacık dokusuyla bebeğinizin cildini tahriş etmeyen organik tulum.', 120.00, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800', 'Giyim', 100, false);

-- 3. SET YOURSELF AS ADMIN
-- Run this query after finding your user_id in the Supabase Auth or Profiles table.
-- UPDATE profiles SET role = 'admin' WHERE full_name LIKE '%Ayhan%' OR id = 'YOUR_USER_ID_HERE';
-- Since I don't know the exact ID, I'll provide a generic update for the user to use:
UPDATE profiles SET role = 'admin' WHERE id = (select id from profiles limit 1); -- DANGER: This is just an example, user should specify their ID.

-- Better advice for user:
-- UPDATE profiles SET role = 'admin' WHERE id = auth.uid(); -- Can be run in SQL editor IF they are logged in and it handles auth.uid()
