-- Insert or Update products with variants for testing

-- 1. Detailed Clothing Item
INSERT INTO products (title, description, price, image_url, category, stock, is_featured, slug, colors, sizes)
VALUES (
  'Organic Cotton Sleep Set',
  'Soft, breathable organic cotton sleep set perfect for sensitive skin. detailed stitching and durable fabric.',
  35.00,
  'https://images.unsplash.com/photo-1522771930-78848d50259b?w=800&q=80',
  'Clothing',
  50,
  true,
  'organic-cotton-sleep-set',
  ARRAY['Cream', 'Sage Green', 'Dusty Rose'],
  ARRAY['0-3M', '3-6M', '6-12M']
) ON CONFLICT (id) DO NOTHING; -- Assuming ID might conflict if I hardcoded it, but I'm letting uuid gen. for new ones. 
-- However, to be safe and update if exists by slug (which is unique):
INSERT INTO products (title, description, price, image_url, category, stock, is_featured, slug, colors, sizes)
VALUES (
  'Cozy Fleece Jumpsuit', 
  'Warm and cozy fleece jumpsuit for winter days.', 
  42.00, 
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80', 
  'Clothing', 
  30, 
  true, 
  'cozy-fleece-jumpsuit', 
  ARRAY['Navy', 'Grey', 'Red'], 
  ARRAY['6M', '12M', '18M', '24M']
) ON CONFLICT (slug) DO UPDATE SET colors = EXCLUDED.colors, sizes = EXCLUDED.sizes;

-- 2. Toy with Color Variants
INSERT INTO products (title, description, price, image_url, category, stock, is_featured, slug, colors, sizes)
VALUES (
  'Silicone Stacking Rings',
  'Safe, chewable silicone stacking rings in modern pastel colors.',
  18.50,
  'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80',
  'Toys',
  100,
  false,
  'silicone-stacking-rings',
  ARRAY['Pastel', 'Bright', 'Earth Tones'],
  ARRAY['Standard']
) ON CONFLICT (slug) DO UPDATE SET colors = EXCLUDED.colors, sizes = EXCLUDED.sizes;

-- 3. Gear with Size Variants (e.g. Blankets)
INSERT INTO products (title, description, price, image_url, category, stock, is_featured, slug, colors, sizes)
VALUES (
  'Muslin Swaddle Blanket',
  'Lightweight and breathable muslin swaddle blanket.',
  22.00,
  'https://images.unsplash.com/photo-1555252333-9f8e92e65df4?w=800&q=80',
  'Gear',
  75,
  false,
  'muslin-swaddle-blanket',
  ARRAY['White', 'Star Pattern', 'Animal Print'],
  ARRAY['Small (30x30)', 'Large (47x47)']
) ON CONFLICT (slug) DO UPDATE SET colors = EXCLUDED.colors, sizes = EXCLUDED.sizes;
