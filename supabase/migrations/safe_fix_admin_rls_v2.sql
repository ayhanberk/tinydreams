-- Safe Admin RLS Fix
-- This script safely updates RLS policies for admin access to version 13 features

-- 1. Ensure is_admin function exists and is correct
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update Products Policies (Drop existing to avoid conflicts)
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Everyone can view products" ON products;

-- Re-create
CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING (is_admin());

CREATE POLICY "Everyone can view products" ON products
  FOR SELECT USING (true);

-- 3. Update Baby Profiles Policies (New for Phase 13)
ALTER TABLE baby_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own baby profiles" ON baby_profiles;

CREATE POLICY "Users can manage their own baby profiles"
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Grant permissions just in case
GRANT ALL ON products TO authenticated;
GRANT ALL ON products TO service_role;
GRANT ALL ON baby_profiles TO authenticated;
GRANT ALL ON baby_profiles TO service_role;
