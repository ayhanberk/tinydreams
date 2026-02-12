-- Create a function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update Products RLS
DROP POLICY IF EXISTS "Only admins can insert products." ON products;
DROP POLICY IF EXISTS "Only admins can update products." ON products;

CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING (is_admin());

-- Update Orders RLS
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all orders" ON orders
  FOR UPDATE USING (is_admin());

-- Update Order Items RLS
CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT USING (is_admin());

-- Update Inventory RLS (product_variants)
DROP POLICY IF EXISTS "Admins can manage variants" ON product_variants;

CREATE POLICY "Admins can manage variants" ON product_variants
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Update Banners RLS
CREATE POLICY "Admins can manage banners" ON banners
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Update Notifications RLS
CREATE POLICY "Admins can manage notifications" ON notifications
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());
