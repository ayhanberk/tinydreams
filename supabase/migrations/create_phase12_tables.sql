-- 1. Wishlists Table
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Drop policies to avoid conflicts if they exist
DROP POLICY IF EXISTS "Users can view their own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can add to their own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can remove from their own wishlist" ON wishlists;

CREATE POLICY "Users can view their own wishlist"
    ON wishlists FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist"
    ON wishlists FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own wishlist"
    ON wishlists FOR DELETE
    USING (auth.uid() = user_id);


-- 2. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL, -- Markdown/HTML
    excerpt TEXT,
    cover_image TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;

CREATE POLICY "Public can view published posts"
    ON blog_posts FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage blog posts"
    ON blog_posts FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());


-- 3. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT false, -- Moderation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure is_approved column exists if table already existed without it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'is_approved') THEN
        ALTER TABLE reviews ADD COLUMN is_approved BOOLEAN DEFAULT false;
    END IF;
END $$;

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view approved reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view their own (even unapproved) reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can manage reviews" ON reviews;

CREATE POLICY "Public can view approved reviews"
    ON reviews FOR SELECT
    USING (is_approved = true OR public.is_admin());

CREATE POLICY "Users can view their own (even unapproved) reviews"
    ON reviews FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage reviews"
    ON reviews FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
