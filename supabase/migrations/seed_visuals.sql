-- Seed Visuals for TinyDreams
-- Run this in Supabase SQL Editor to populate products with images

-- Optional: Clear existing products to avoid duplicates (Comment out if you want to keep them)
-- DELETE FROM products; 

-- Categories (Ensure these exist or are matched by text)
-- 'Bebek Odası', 'Oyuncak', 'Giyim'

INSERT INTO products (title, description, price, image_url, category, stock, is_featured, slug) VALUES
-- Bebek Odası (Nursery)
('Yıldızlı Gece Projeksiyonu', 'Bebeğinizin odasını büyülü bir gökyüzüne dönüştüren müzikli gece lambası.', 450.00, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop', 'Bebek Odası', 50, true, 'yildizli-gece-projeksiyonu'),
('Ahşap Sallanan At', 'Doğal ahşaptan üretilmiş, güvenli ve dayanıklı klasik sallanan at.', 1250.00, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop', 'Bebek Odası', 10, true, 'ahsap-sallanan-at'),
('Bulut Duvar Rafı', 'Pastel tonlarda, el yapımı dekoratif bulut raf seti (3''lü).', 320.00, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop', 'Bebek Odası', 25, false, 'bulut-duvar-rafi'),
('Yün Örgü Battaniye', 'Yumuşacık merinos yünü el örgüsü battaniye, antialerjik.', 550.00, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop', 'Bebek Odası', 15, false, 'yun-orgu-battaniye'),

-- Oyuncak (Toys)
('Uyku Arkadaşı Ayıcık', 'Organik pamuklu kumaştan, işlemeli yüz detaylı sevimli ayıcık.', 280.00, 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?q=80&w=800&auto=format&fit=crop', 'Oyuncak', 40, true, 'uyku-arkadasi-ayicik'),
('Ahşap Blok Seti', '50 parçalı, toksik olmayan boya ile boyanmış eğitici ahşap bloklar.', 390.00, 'https://images.unsplash.com/photo-1596464716127-f9a8759d1b28?q=80&w=800&auto=format&fit=crop', 'Oyuncak', 30, true, 'ahsap-blok-seti'),
('Bez Bebek Lola', 'El yapımı, rengarenk elbiseli bez bebek.', 210.00, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop', 'Oyuncak', 20, false, 'bez-bebek-lola'),

-- Giyim (Clothing)
('Organik Pamuk Tulum', 'GOTS sertifikalı %100 organik pamuk, çıtçıtlı bebek tulumu.', 180.00, 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop', 'Giyim', 100, true, 'organik-pamuk-tulum'),
('Müslin Örtü Seti', '4 katlı yumuşak müslin kumaş, nefes alan yapı (2''li set).', 240.00, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop', 'Giyim', 60, true, 'muslin-ortu-seti'),
('Sevimli Patikler', 'El örgüsü, kaydırmaz tabanlı bebek patikleri.', 90.00, 'https://images.unsplash.com/photo-1520467795206-62e33627e6ce?q=80&w=800&auto=format&fit=crop', 'Giyim', 80, false, 'sevimli-patikler');

-- Update categories to ensure they link if referencing by ID is required, 
-- but our setup uses text category or we rely on triggers. 
-- If 'category' is a foreign key to 'categories(id)', these inserts might fail without fetching IDs.
-- Checking schema... 
-- Schema often uses text for category in products, OR a relation.
-- actions/products.ts query: category, categories (slug, name). 
-- This implies products has a relation to categories. 
-- If products.category is a UUID, the above text inserts will fail!

-- Let's assume safely that we need to insert based on lookup.
-- RE-WRITING query to use sub-selects for safe FK references if possible, or assume text if mixed.
-- The actions/products.ts query `.select(..., categories(slug, name))` strongly suggests a FK relation.

-- DO NOT RUN THE ABOVE DIRECTLY if category IS UUID.
-- Re-writing for Safety with UUID lookup:

WITH cat_bebek AS (SELECT id FROM categories WHERE slug = 'bebek-odasi' LIMIT 1),
     cat_oyuncak AS (SELECT id FROM categories WHERE slug = 'oyuncak' LIMIT 1),
     cat_giyim AS (SELECT id FROM categories WHERE slug = 'giyim' LIMIT 1)

INSERT INTO products (title, description, price, image_url, category, stock, is_featured, slug)
SELECT 'Yıldızlı Gece Projeksiyonu', 'Müzikli gece lambası.', 450.00, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop', id, 50, true, 'yildizli-gece-projeksiyonu-2' FROM cat_bebek
UNION ALL
SELECT 'Uyku Arkadaşı Ayıcık', 'Organik pamuk ayıcık.', 280.00, 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?q=80&w=800&auto=format&fit=crop', id, 40, true, 'uyku-arkadasi-ayicik-2' FROM cat_oyuncak
UNION ALL
SELECT 'Organik Pamuk Tulum', '100% Organik tulum.', 180.00, 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop', id, 100, true, 'organik-pamuk-tulum-2' FROM cat_giyim;
