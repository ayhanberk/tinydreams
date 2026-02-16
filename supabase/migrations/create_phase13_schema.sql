-- Phase 13: Personalization & Operations

-- 1. Create Baby Profiles Table
CREATE TABLE IF NOT EXISTS baby_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    gender TEXT CHECK (gender IN ('boy', 'girl', 'neutral')),
    relationship TEXT DEFAULT 'child',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Baby Profiles
ALTER TABLE baby_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own baby profiles"
    ON baby_profiles FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 2. Extend Products Table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS min_age_months INTEGER,
ADD COLUMN IF NOT EXISTS max_age_months INTEGER,
ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb;

-- 3. Inventory Batches (Optional but good for future)
CREATE TABLE IF NOT EXISTS inventory_batches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    batch_code TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE inventory_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage inventory batches"
    ON inventory_batches FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
